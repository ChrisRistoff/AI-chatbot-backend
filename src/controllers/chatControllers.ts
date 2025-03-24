import { Request, Response, NextFunction } from "express";
import { getAllChatsForUserModel, getChatByIdModel } from "../models/chatModels";

export async function getAllChatsForUserController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { username } = req.query;

        const chats = await getAllChatsForUserModel(username as string);

        res.status(200).send(chats);
    } catch (error) {
        next(error);
    }
}

export async function getChatByIdController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.query;

        const chat = await getChatByIdModel(id as string);

        res.status(200).send(chat);
    } catch (error) {
        next(error);
    }
}
