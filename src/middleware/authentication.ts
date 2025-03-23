import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import { NextFunction, Response, Request } from "express";

export async function hashPassword (password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = (password: string, hashedPassword: string) => {
    return bcrypt.compare(password, hashedPassword);
};

export function createJWT (user: any): string {
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

export function protect (req: Request, res: Response, next: NextFunction): void {
    const bearer = req.headers.authorization;

    if (!bearer) {
        res.status(401).send({ msg: "You need to be logged in" });

        return;
    }

    const split_token = bearer.split(" ");
    const token = split_token[1];

    if (!token) {
        res.status(401).send({ msg: "Token is not valid" });

        return;
    }

    try {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error;
        }

        const user = jwt.verify(token, secret);

        req.user = user;

        next();
    } catch (error) {
        res.status(401).send({ msg: "Token is not valid" });
    }
};
