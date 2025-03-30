import { Chat, ChatMessages } from 'src/DTO/chatDto';
import db from '../db/connection'
import { QueryResult } from 'pg';
import { UpdateChatBody } from 'src/controllers/chatControllers';

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

export async function updateChatModel(chat: UpdateChatBody): Promise<Chat> {
    const getChatQuery = 'SELECT * FROM chat WHERE chat_id = $1';

    const currentChat: QueryResult<Chat> = await db.query(getChatQuery, [chat.chatId]);

    if (currentChat.rows.length === 0) {
        return Promise.reject({ errCode: 404, errMsg: `Chat with ID of ${chat.chatId} not found` });
    }

    if (currentChat.rows[0].username !== chat.username) {
        return Promise.reject({errCode: 401, errMsg: 'Chat belongs to a different user'});
    }

    let updateChatQuery = 'UPDATE chat SET ';
    let counter = 0;

    const fieldsArray: Array<string | number | ChatMessages> = [];
    let updateChatQueryFields: string[] = [];

    (Object.keys(chat) as (keyof UpdateChatBody)[]).forEach((field) => {
        if (field && field !== 'username' && field !== 'chatId') {
            counter++;
            updateChatQueryFields.push(`${field} = $${counter}`);

            if (field === 'chat_messages') {
                fieldsArray.push(JSON.stringify(chat[field]));
            } else {
                fieldsArray.push(chat[field]!);
            }
        }
    })

    if (updateChatQueryFields.length === 0) {
        return Promise.reject({ errCode: 400, errMsg: 'No fields provided to update' })
    }

    updateChatQuery += updateChatQueryFields.join(', ');

    counter++;
    updateChatQuery += ` WHERE chat_id = $${counter} RETURNING *`;
    fieldsArray.push(chat.chatId);

    const updatedChat: QueryResult<Chat> = await db.query(updateChatQuery, fieldsArray)

    return updatedChat.rows[0];
}
