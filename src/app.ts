import express from 'express';
import { customErrors, serverError, sqlErrors } from './middleware/errorHandlers';
import { chatRouter } from './routers/chatsRouter';
import { userRouter } from './routers/userRouter';
import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: string | JwtPayload;
            work?: boolean;
        }
    }
}

export const app = express();

app.use(express.json());

app.use(chatRouter);
app.use(userRouter);

//error handling
app.use(sqlErrors, customErrors, serverError);
