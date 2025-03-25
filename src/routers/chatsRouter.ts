import { Router } from 'express';
import { getAllChatsForUserController, getChatByIdController } from '../controllers/chatControllers';
import { protect } from '../middleware/authentication';

export const chatRouter = Router();

chatRouter.get("/chats", protect, getAllChatsForUserController);
chatRouter.get("/chat", protect, getChatByIdController);
