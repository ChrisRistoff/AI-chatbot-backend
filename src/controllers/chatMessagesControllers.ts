import { Request, Response, NextFunction } from "express";
import { removeChatMessageByIdModel } from "../models/chatMessagesModels";

interface RemoveChatMessageBody {
    id: number,
    messageIndex: number
}

export async function removeChatMessageByIdController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id, messageIndex } = req.body as RemoveChatMessageBody;
        const currentUser = req.user!.username;

        await removeChatMessageByIdModel(id, messageIndex, currentUser);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}
