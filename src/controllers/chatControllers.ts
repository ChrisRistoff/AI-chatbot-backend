import { Request, Response, NextFunction } from "express";
import { getAllChatsForUserModel, getChatByIdModel } from "../models/chatModels";

export async function getAllChatsForUserController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const currentUser = req.user!.username;

        const chats = await getAllChatsForUserModel(currentUser);

        res.status(200).send(chats);
    } catch (error) {
        next(error);
    }
}

export async function getChatByIdController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.query;
        const currentUser = req.user!.username;

        const chat = await getChatByIdModel(id as string, currentUser);

        res.status(200).send(chat);
    } catch (error) {
        next(error);
    }
}
