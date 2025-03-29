import { Request, Response, NextFunction } from "express";
import * as models from "../models/chatModels";
import { Chat } from "src/DTO/chatDto";

export async function getAllChatsForUserController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const currentUser = req.user!.username;

        const chats = await models.getAllChatsForUserModel(currentUser);

        res.status(200).send(chats);
    } catch (error) {
        next(error);
    }
}

export async function getChatByIdController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.query;
        const currentUser = req.user!.username;

        const chat = await models.getChatByIdModel(id as string, currentUser);

        res.status(200).send(chat);
    } catch (error) {
        next(error);
    }
}

export async function saveChatController(req: Request, res: Response, next: NextFunction): Promise<void> {
    const chat: Chat = {
        ...req.body as Chat,
        username: req.user!.username
    }

    try {
        const savedChat = await models.saveChatModel(chat);

        res.status(201).send(savedChat);
    } catch (error) {
        next(error);
    }
}
