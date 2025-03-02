import db from "../connection";
import { Chat, User } from "../data/types";

type SeedData = {
  users: User[];
  chats: Chat[];
}

export const seed = async ({ users, chats }: SeedData): Promise<void> => {
  await db.query(`DROP TABLE IF EXISTS chat CASCADE;`);
  await db.query(`DROP TABLE IF EXISTS users CASCADE;`);

  await db.query(`
        CREATE TABLE users (
            username VARCHAR PRIMARY KEY,
            email VARCHAR NOT NULL,
            password VARCHAR NOT NULL
        );
    `);

    await db.query(`
        CREATE TABLE chat (
            chat_id SERIAL PRIMARY KEY,
            username VARCHAR REFERENCES users(username),
            title VARCHAR,
            provider VARCHAR NOT NULL,
            model VARCHAR NOT NULL,
            system_message TEXT,
            chat_messages TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `);

    await seedUsers(users);
    await seedChats(chats);
}


const seedUsers = async (users: User[]): Promise<void> => {
    for (const user of users) {
        await db.query(
            `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`,
        [user.username, user.email, user.password]
        );
    }
}

const seedChats = async (chats: Chat[]): Promise<void> => {
    for (const chat of chats) {
        const formattedChatMessages = `${chat.chat_messages}`;

        await db.query(
            `INSERT INTO chat (username, title, provider, model, system_message, chat_messages) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
            chat.username,
            chat.title,
            chat.provider,
            chat.model,
            chat.system_message,
            formattedChatMessages,
        ]
        );
    }
}
