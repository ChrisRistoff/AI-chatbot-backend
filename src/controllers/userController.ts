import { NextFunction, Request, Response } from "express";
import { hashPassword, createJWT } from "../middleware/authentication";
import { createUserModel, signUserInModel } from "../models/userModels";

interface CreateUserBody {
    email: string,
    username: string,
    password: string
}

interface LoginUserBody {
    username: string,
    password: string
}

export async function createUserController(req: Request, res: Response, next: NextFunction): Promise<void> {
    const body = req.body as CreateUserBody;

    const hashedPw = await hashPassword(body.password);

    try {
        const user = await createUserModel(body.username, body.email, hashedPw);
        const token = createJWT(user);

        req.user = { username: user.username };

        res.status(201).send({ token });
    } catch (error) {
        next(error);
    }
};

export async function LoginUserController(req: Request, res: Response, next: NextFunction): Promise<void> {
    const body = req.body as LoginUserBody;

    try {
        const user = await signUserInModel(body.username, body.password);

        const token = createJWT(user);

        res.status(200).send({ token });
    } catch (error) {
        next(error);
    }
};
