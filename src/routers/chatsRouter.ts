import { Router } from 'express';
import { getAllChatsForUserController, getChatByIdController } from '../controllers/chatControllers';

export const chatRouter = Router();

chatRouter.get("/chats", getAllChatsForUserController);
chatRouter.get("/chat", getChatByIdController);
