import { Router } from 'express';
import { protect } from '../middleware/authentication';
import { removeChatMessageByIdController } from '../controllers/chatMessagesControllers'

export const chatMessagesRouter = Router();

chatMessagesRouter.post("/chats/removeMessage", protect, removeChatMessageByIdController);
