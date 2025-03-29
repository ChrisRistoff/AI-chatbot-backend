import { Request, Response, NextFunction } from "express";
import * as models from "../models/chatMessagesModels";

interface RemoveChatMessageBody {
    id: number,
    messageIndex: number
}

export async function removeChatMessageByIdController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id, messageIndex } = req.body as RemoveChatMessageBody;
        const currentUser = req.user!.username;

        await models.removeChatMessageByIdModel(id, messageIndex, currentUser);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}
