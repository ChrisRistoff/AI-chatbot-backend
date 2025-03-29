import { Router } from 'express';
import { protect } from '../middleware/authentication';
import * as controllers from '../controllers/chatMessagesControllers'

export const chatMessagesRouter = Router();

chatMessagesRouter.post("/chats/removeMessage", protect, controllers.removeChatMessageByIdController);
