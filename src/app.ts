import express, { Request, Response } from 'express';
import db from './db/connection';
import { customErrors, serverError, sqlErrors } from './middleware/errorHandlers';

export const app = express();

app.use(express.json());

app.get("/test", async (_req: Request, res: Response) => {
    const response = await db.query('SELECT * FROM chat;')

    try {
        res.status(200).send(response.rows);
    } catch (_error) {
        console.log('oops')
    }
});

//error handling
app.use(sqlErrors, customErrors, serverError);
