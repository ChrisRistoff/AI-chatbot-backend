import { Request, Response, NextFunction } from "express";
import * as models from "../models/chatModels";
import { Chat } from "src/DTO/chatDto";

export interface UpdateChatBody extends Chat {
    chatId: number;
}

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
        const { id } = req.params;
        const currentUser = req.user!.username;

        const chat = await models.getChatByIdModel(id as string, currentUser);

        res.status(200).send(chat);
    } catch (error) {
        next(error);
    }
}

export async function saveChatController(req: Request, res: Response, next: NextFunction): Promise<void> {
    const chat: Chat = {
        ...req.body,
        username: req.user!.username
    }

    try {
        const savedChat = await models.saveChatModel(chat);

        res.status(201).send(savedChat);
    } catch (error) {
        next(error);
    }
}

export async function updateChatController(req: Request, res: Response, next: NextFunction): Promise<void> {
    const chat: UpdateChatBody = {
        ...req.body,
        username: req.user!.username
    }

    try {
        const updatedChat = await models.updateChatModel(chat);

        res.status(201).send(updatedChat);
    } catch (error) {
        next(error)
    }
}

export async function deleteChatController(req: Request, res: Response, next: NextFunction): Promise<void> {
    const username = req.user!.username;
    const chatId = req.params.id as string;

    try {
        await models.deleteChatModel(chatId, username);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}
