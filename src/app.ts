import express from 'express';
import * as errors from './middleware/errorHandlers';
import { chatRouter } from './routers/chatsRouter';
import { chatMessagesRouter } from './routers/chatMessagesRouter';
import { userRouter } from './routers/userRouter';
import { UserPayload } from './middleware/authentication';

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
            work?: boolean;
        }
    }
}

export const app = express();

app.use(express.json());

app.use(chatRouter);
app.use(chatMessagesRouter);
app.use(userRouter);

app.use(errors.sqlErrors, errors.customErrors, errors.serverError);
