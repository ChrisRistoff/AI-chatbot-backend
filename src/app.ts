import express from 'express';
import { customErrors, serverError, sqlErrors } from './middleware/errorHandlers';
import { chatRouter } from './routers/chatsRouter';
import { userRouter } from './routers/userRouter';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const app = express();

app.use(express.json());

app.use(chatRouter);
app.use(userRouter);

//error handling
app.use(sqlErrors, customErrors, serverError);
