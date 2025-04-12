import { Router } from 'express';
import * as controllers from '../controllers/chatControllers';
import { protect } from '../middleware/authentication';

export const chatRouter = Router();

chatRouter.get("/chats", protect, controllers.getAllChatsForUserController);
chatRouter.get("/chat/:id", protect, controllers.getChatByIdController);
chatRouter.post("/chat/save", protect, controllers.saveChatController);
chatRouter.post("/chat/update", protect, controllers.updateChatController);
chatRouter.post("/chat/delete/:id", protect, controllers.deleteChatController);
