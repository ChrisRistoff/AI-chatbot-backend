import { seed } from "../src/db/seed/seed";
import { app } from "../src/app";
import db from "../src/db/connection";
import request from 'supertest';
import chatData from "../src/db/data/chatData";
import userData from "../src/db/data/userData";
import { Chat } from "src/DTO/chatDto";

let server: any;

beforeAll(async () => {
    await seed({users: userData, chats: chatData});
    server = app.listen(0);
});

afterAll(async () => {
    await server.close();
    await db.end();
});

describe('Chat Controllers', () => {
    describe('GET /chats', () => {
        it('should return chats for a given username', async () => {
            const response = await request(app)
                .get('/chats')
                .query({ username: 'test_user11' });

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);

            const body: Chat[] = response.body

            expect(body.length).toBe(2);

            body.forEach((item) => {
                expect(item).toHaveProperty('username');
                expect(item).toHaveProperty('title');
                expect(item).toHaveProperty('provider');
                expect(item).toHaveProperty('model');
                expect(item).toHaveProperty('system_message');
                expect(item).toHaveProperty('chat_messages');

                expect(Array.isArray(item.chat_messages)).toBe(true);

                expect(item.chat_messages[0]).toHaveProperty('text');
                expect(item.chat_messages[0]).toHaveProperty('role');
            })
        });
    });

    describe('GET /chat', () => {
        it('should return a chat for a given id', async () => {
            const response = await request(app)
                .get('/chat')
                .query({ id: '1' });

            const body: Chat = response.body;

            expect(response.status).toBe(200);

            expect(body.title).toBe('First Chat with GPT-3.5');
            expect(body.username).toBe('test_user11');
            expect(body.provider).toBe('OpenAI');
            expect(body.model).toBe('gpt-3.5-turbo');
            expect(body.system_message).toBe('You are a helpful assistant.');

            expect(body.chat_messages[0].role).toBe('system');
            expect(body.chat_messages[0].text).toBe('You are a helpful assistant.');
            expect(body.chat_messages[1].role).toBe('user');
            expect(body.chat_messages[1].text).toBe('Hello, can you help me?');
        });

        it('should return 404 for a non-existing id', async () => {
            const response = await request(app)
                .get('/chat')
                .query({ id: '222' });

            expect(response.status).toBe(404);
            expect(response.body.msg).toBe("Chat with ID of 222 not found");
        })

        it('should return 400 for wrong input', async () => {
            const response = await request(app)
                .get('/chat')
                .query({ id: 'asdasd' });

            expect(response.status).toBe(400);
            expect(response.body.msg).toBe("Invalid input");
        })
    });
});
