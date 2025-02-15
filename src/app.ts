import express, { Request, Response } from 'express';
import db from './db/connection';

export const app = express();

app.use(express.json());

app.get("/test", async (_req: Request, res: Response) => {
    const response = await db.query('SELECT * FROM chat;')

    try {
        res.status(200).send(response);
    } catch (_error) {
        console.log('oops')
    }
});
