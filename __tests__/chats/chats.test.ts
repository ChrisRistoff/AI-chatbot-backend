import { seed } from "../../src/db/seed/seed";
import { app } from "../../src/app";
import db from "../../src/db/connection";
import request from 'supertest';
import chatData from "../../src/db/data/chatData";
import userData from "../../src/db/data/userData";
import { Chat, ChatMessages } from "src/DTO/chatDto";

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
                .get('/chat/1')
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
                .get('/chat/any')

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
                .get('/chat/2')
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(401);
            expect(response.body.msg).toBe("Chat belongs to a different user");
        })

        it('404: should return an error for a non-existing id', async () => {
            const response = await request(app)
                .get('/chat/222')
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body.msg).toBe("Chat with ID of 222 not found");
        })

        it('400: should return an error for wrong input', async () => {
            const response = await request(app)
                .get('/chat/asdfasdf')
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(400);
            expect(response.body.msg).toBe("Invalid input");
        })
    });

    describe('POST /save/chat', () => {
        it('201 Should save and return saved chat', async () => {
            const chatMessages: ChatMessages = [
                {role: 'USER', text: 'user message', timestamp: 'test timestamp'},
                {role: 'AI', text: 'ai message', timestamp: 'test timestamp'}
            ]

            const chatPayload: Chat = {
                username: 'this wont be used',
                title: 'new chat',
                summary: 'new summary',
                provider: 'new provider',
                model: 'new model',
                role: 'new role',
                temperature: 3,
                chat_messages: chatMessages
            }

            const response = await request(app)
                .post('/chat/save')
                .send(chatPayload)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(201);

            const chat: Chat = response.body;

            expect(chat.username).toBe('test_user11');
            expect(chat.title).toBe('new chat');
            expect(chat.summary).toBe('new summary');
            expect(chat.provider).toBe('new provider');
            expect(chat.model).toBe('new model');
            expect(chat.role).toBe('new role');
            expect(chat.temperature).toBe(3);

            expect(chat.chat_messages[0].role).toBe('USER');
            expect(chat.chat_messages[0].text).toBe('user message');
            expect(chat.chat_messages[0].timestamp).toBe('test timestamp');

            expect(chat.chat_messages[1].role).toBe('AI');
            expect(chat.chat_messages[1].text).toBe('ai message');
            expect(chat.chat_messages[1].timestamp).toBe('test timestamp');
        })

        it('400 Should return an error if no payload sent', async () => {
            const response = await request(app)
                .post('/chat/save')
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(400);
            expect(response.body.msg).toBe('Not null violation');
        })

        it('401 Should return an error if user not signed in', async () => {
            const response = await request(app)
                .post('/chat/save');

            expect(response.status).toBe(401);
            expect(response.body.msg).toBe('You need to be logged in');
        })
    })

    describe('POST delete/chat', () => {
        it('204 should delete chat', async () => {
            const response = await request(app)
                .get('/chat/1')
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);

            const deleteChatResponse = await request(app)
                .post('/chat/delete/1')
                .set("Authorization", `Bearer ${token}`);

            expect(deleteChatResponse.status).toBe(204);

            const getDeletedChatResponse = await request(app)
                .get('/chat/1')
                .set("Authorization", `Bearer ${token}`);

            expect(getDeletedChatResponse.status).toBe(404);
        })

        it('401: should return an error if chat belongs to a different user', async () => {
            const response = await request(app)
                .post('/chat/delete/2')
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(401);
            expect(response.body.msg).toBe("Chat belongs to a different user");
        })

        it('404: should return an error for a non-existing id', async () => {
            const response = await request(app)
                .post('/chat/delete/222')
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body.msg).toBe("Chat with ID of 222 not found");
        })

        it('400: should return an error for wrong input', async () => {
            const response = await request(app)
                .post('/chat/delete/asdfasdf')
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(400);
            expect(response.body.msg).toBe("Invalid input");
        })

        it('401 Should return an error if user not signed in', async () => {
            const response = await request(app)
                .post('/chat/delete/1');

            expect(response.status).toBe(401);
            expect(response.body.msg).toBe('You need to be logged in');
        })
    })
});
