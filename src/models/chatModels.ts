import { Chat } from 'src/DTO/chatDto';
import db from '../db/connection'

export async function getAllChatsForUserModel(currentUser: string): Promise<Chat[]> {
    const dbQuery = `SELECT * FROM chat WHERE username = $1`

    const result = await db.query(dbQuery, [currentUser]);

    return result.rows;
}

export async function getChatByIdModel(id: string, currentUser: string): Promise<Chat> {
    const dbQuery = `SELECT * FROM chat WHERE chat_id = $1`

    const chat = await db.query(dbQuery, [id]);

    if (chat.rows.length === 0) {
        return Promise.reject({errCode: 404, errMsg: `Chat with ID of ${id} not found`});
    }

    const result: Chat = chat.rows[0];

    if (currentUser !== result.username) {
        return Promise.reject({errCode: 401, errMsg: "Chat belongs to a different user"})
    }

    return result;
}
