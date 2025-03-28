import { seed } from "../src/db/seed/seed";
import { app } from "../src/app";
import db from "../src/db/connection";
import request from 'supertest';
import chatData from "../src/db/data/chatData";
import userData from "../src/db/data/userData";
import { Chat } from "src/DTO/chatDto";

let server: any;
let token: any;

beforeAll(async () => {
    await seed({users: userData, chats: chatData});

    server = app.listen(0);

    const auth = await request(app)
        .post("/login")
        .send({ username: "test_user11", password: "password1" });

    token = auth.body.token;
});

afterAll(async () => {
    await server.close();
    await db.end();
});

describe('Chat Controllers', () => {
    describe('GET /chats', () => {
        it('200: should return chats for a given username', async () => {
            const response = await request(app)
                .get('/chats')
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);

            const body: Chat[] = response.body

            expect(body.length).toBe(2);

            body.forEach((item) => {
                expect(item).toHaveProperty('username');
                expect(item).toHaveProperty('title');
                expect(item).toHaveProperty('summary');
                expect(item).toHaveProperty('provider');
                expect(item).toHaveProperty('model');
                expect(item).toHaveProperty('role');
                expect(item).toHaveProperty('temperature');
                expect(item).toHaveProperty('chat_messages');

                expect(Array.isArray(item.chat_messages)).toBe(true);

                item.chat_messages.forEach((chatMessage) => {
                    expect(chatMessage).toHaveProperty('text');
                    expect(chatMessage).toHaveProperty('role');
                    expect(chatMessage).toHaveProperty('timestamp');
                })
            })
        });

        it('401: should return an error if no token is given', async () => {
            const response = await request(app)
                .get('/chats');

            expect(response.status).toBe(401);
            expect(response.body.msg).toBe("You need to be logged in");
        })

        it('401: should return an error if invalid token is given', async () => {
            const response = await request(app)
                .get('/chats')
                .set("Authorization", `Bearer invalid-token`);

            expect(response.status).toBe(401);
            expect(response.body.msg).toBe("Token is not valid");
        })
    });

    describe('GET /chat', () => {
        it('200: should return a chat for a given id', async () => {
            const response = await request(app)
                .get('/chat')
                .query({ id: '1' })
                .set("Authorization", `Bearer ${token}`);

            const body: Chat = response.body;

            expect(response.status).toBe(200);

            expect(body.title).toBe('First Chat with GPT-3.5');
            expect(body.username).toBe('test_user11');
            expect(body.provider).toBe('OpenAI');
            expect(body.model).toBe('gpt-3.5-turbo');
            expect(body.role).toBe('You are a helpful assistant.');

            expect(body.chat_messages[0].role).toBe('user');
            expect(body.chat_messages[0].text).toBe('You are a helpful assistant.');
            expect(body.chat_messages[1].role).toBe('AI');
            expect(body.chat_messages[1].text).toBe('Hello, can you help me?');
        });

        it('401: should return an error if no token is given', async () => {
            const response = await request(app)
                .get('/chat')
                .query({ id: 'any' })

            expect(response.status).toBe(401);
            expect(response.body.msg).toBe("You need to be logged in");
        })

        it('401: should return an error if invalid token is given', async () => {
            const response = await request(app)
                .get('/chats')
                .set("Authorization", `Bearer invalid-token`);

            expect(response.status).toBe(401);
            expect(response.body.msg).toBe("Token is not valid");
        })

        it('401: should return an error if chat belongs to a different user', async () => {
            const response = await request(app)
                .get('/chat')
                .query({ id: '2' })
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(401);
            expect(response.body.msg).toBe("Chat belongs to a different user");
        })

        it('404: should return an error for a non-existing id', async () => {
            const response = await request(app)
                .get('/chat')
                .query({ id: '222' })
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body.msg).toBe("Chat with ID of 222 not found");
        })

        it('400: should return an error for wrong input', async () => {
            const response = await request(app)
                .get('/chat')
                .query({ id: 'asdasd' })
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(400);
            expect(response.body.msg).toBe("Invalid input");
        })
    });
});
