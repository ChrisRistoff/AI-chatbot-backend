import { Chat } from 'src/DTO/chatDto';
import db from '../db/connection'
import { QueryResult } from 'pg';

export async function getAllChatsForUserModel(currentUser: string): Promise<Chat[]> {
    const dbQuery = `SELECT * FROM chat WHERE username = $1`

    const result: QueryResult<Chat> = await db.query(dbQuery, [currentUser]);

    return result.rows;
}

export async function getChatByIdModel(id: string, currentUser: string): Promise<Chat> {
    const dbQuery = `SELECT * FROM chat WHERE chat_id = $1`

    const chat: QueryResult<Chat> = await db.query(dbQuery, [id]);

    if (chat.rows.length === 0) {
        return Promise.reject({errCode: 404, errMsg: `Chat with ID of ${id} not found`});
    }

    const result = chat.rows[0];

    if (currentUser !== result.username) {
        return Promise.reject({errCode: 401, errMsg: "Chat belongs to a different user"})
    }

    return result;
}

export async function saveChatModel(chat: Chat): Promise<Chat> {
    const dbQuery = `INSERT INTO chat (username, title, summary, provider, model, role, temperature, chat_messages) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

    const savedChat: QueryResult<Chat> = await db.query(
        dbQuery,
        [
            chat.username,
            chat.title,
            chat.summary,
            chat.provider,
            chat.model,
            chat.role,
            chat.temperature,
            JSON.stringify(chat.chat_messages),
        ]
    );

    return savedChat.rows[0];
}
