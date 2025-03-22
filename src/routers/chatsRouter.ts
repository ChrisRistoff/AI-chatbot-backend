import { Router } from 'express';
import { getAllChatsForUserController } from '../controllers/chatControllers';

export const chatRouter = Router();

chatRouter.get("/chats", getAllChatsForUserController);
