import { Router } from 'express';
import * as controllers from '../controllers/chatControllers';
import { protect } from '../middleware/authentication';

export const chatRouter = Router();

chatRouter.get("/chats", protect, controllers.getAllChatsForUserController);
chatRouter.get("/chat", protect, controllers.getChatByIdController);
chatRouter.post("/save/chat", protect, controllers.saveChatController);
