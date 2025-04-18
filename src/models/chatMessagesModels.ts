import { Chat, ChatMessages } from 'src/DTO/chatDto';
import db from '../db/connection'
import { QueryResult } from 'pg';

export async function removeChatMessageByIdModel(id: number, messageIndex: number, currentUser: string): Promise<void> {
    const dbQuery = `SELECT * FROM chat WHERE chat_id = $1`;

    const chat: QueryResult<Chat> = await db.query(dbQuery, [id]);

    if (chat.rows.length === 0) {
        return Promise.reject({errCode: 404, errMsg: `Chat with id ${id} does not exist`});
    }

    if (chat.rows[0].username !== currentUser) {
        return Promise.reject({errCode: 401, errMsg: "Chat belongs to a different user"});
    }

    const currentChatMessages = chat.rows[0].chat_messages;

    let newChatMessages: ChatMessages = [];

    for (let i = 0; i < currentChatMessages.length; i++) {
        if (i !== messageIndex) {
            newChatMessages.push(currentChatMessages[i]);
        }
    }

    const updateMessagesQuery = `
        UPDATE chat
        SET chat_messages = $1
        WHERE chat_id = $2
        RETURNING *
    `;

    await db.query(updateMessagesQuery, [JSON.stringify(newChatMessages), id]);
}
