import express from 'express';
import { customErrors, serverError, sqlErrors } from './middleware/errorHandlers';
import { chatRouter } from './routers/chatsRouter';

export const app = express();

app.use(express.json());

app.use(chatRouter);

//error handling
app.use(sqlErrors, customErrors, serverError);
