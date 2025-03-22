import { Request, Response, NextFunction } from "express";
import { getAllChatsForUser } from "../models/chatModels";

export async function getAllChatsForUserController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { username } = req.query;

        const chats = await getAllChatsForUser(username as string);

        res.status(200).send(chats);
    } catch (error) {
        next(error);
    }
}
