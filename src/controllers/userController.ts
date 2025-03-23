import { NextFunction, Request, Response } from "express";
import { hashPassword, createJWT } from "../middleware/authentication";
import { createUserModel, signUserInModel } from "../models/userModels";

export async function createUser(req: Request, res: Response, next: NextFunction) {
    const { email, username, password } = req.body;

    const hashedPw = await hashPassword(password);

    try {
        const user = await createUserModel(username, email, hashedPw);
        const token = createJWT(user);

        req.user = { username: user.username };

        res.status(201).send({ token });
    } catch (error) {
        next(error);
    }
};

export async function signUserIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { username, password } = req.body;

    try {
        const user = await signUserInModel(username, password);

        const token = createJWT(user);

        res.status(200).send({ token });
    } catch (error) {
        next(error);
    }
};
