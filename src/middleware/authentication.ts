import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import { NextFunction, Response, Request } from "express";
import { User } from 'src/db/data/userData';

export interface UserPayload {
    username: string,
    iat: number
}

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
};

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
};

export function createJWT(user: User): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        return '';
    }

    const token = jwt.sign(
        {
            username: user.username,
        },
        secret,
    );

    return token;
};

export function protect(req: Request, res: Response, next: NextFunction): void {
    const bearer = req.headers.authorization;

    if (!bearer) {
        res.status(401).send({ msg: "You need to be logged in" });

        return;
    }

    const splitToken = bearer.split(" ");
    const token = splitToken[1];

    if (!token) {
        res.status(401).send({ msg: "Token is not valid" });

        return;
    }

    try {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error;
        }

        const user = jwt.verify(token, secret) as UserPayload;

        req.user = user;

        next();
    } catch (_error) {
        res.status(401).send({ msg: "Token is not valid" });
    }
};
