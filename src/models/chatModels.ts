import { Chat } from 'src/DTO/chatDto';
import db from '../db/connection'

export async function getAllChatsForUser(username: string): Promise<Chat[]> {
    const dbQuery = `SELECT * FROM chat WHERE username = $1`

    const result = await db.query(dbQuery, [username]);

    return result.rows;
}

export async function getChatById(id: string): Promise<Chat> {
    const dbQuery = `SELECT * FROM chat WHERE chat_id = $1`

    const result = await db.query(dbQuery, [id]);

    if (result.rows.length === 0) {
        return Promise.reject({errCode: 404, errMsg: `Chat with ID of ${id} not found`});
    }

    return result.rows[0];
}
