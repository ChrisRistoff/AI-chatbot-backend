import { Chat } from 'src/DTO/chatDto';
import db from '../db/connection'

export async function getAllChatsForUser(username: string): Promise<Chat[]> {
    const dbQuery = `SELECT * FROM chat WHERE username = $1`

    const result = await db.query(dbQuery, [username]);

    return result.rows;
}
