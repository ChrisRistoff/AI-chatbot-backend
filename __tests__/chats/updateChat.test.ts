import { seed } from "../../src/db/seed/seed";
import { app } from "../../src/app";
import db from "../../src/db/connection";
import request from 'supertest';
import chatData from "../../src/db/data/chatData";
import userData from "../../src/db/data/userData";
import { Chat } from "src/DTO/chatDto";
import supertest from "supertest";

type CheckFlags = {
    title?: boolean;
    provider?: boolean;
    model?: boolean;
    role?: boolean;
    chatMessages?: boolean;
    temperature?: boolean;
};

let server: any;
let token: any;
let initialChat: Chat;

const username = 'test_user11';
const invalidKeys: (keyof Chat)[] = ['temperature', 'chat_id', 'username', 'created_at', 'updated_at'];

const reseedChatAndUpdateUser = async () => {
    await seed({users: userData, chats: chatData});

    if (!token) {
        const auth = await request(app)
            .post("/login")
            .send({ username: username, password: "password1" });

        token = auth.body.token;
    }

    const chatResponse = await request(app)
        .get('/chat')
        .query({ id: '1' })
        .set("Authorization", `Bearer ${token}`);

    initialChat = chatResponse.body;
}

beforeAll(async () => {
    await reseedChatAndUpdateUser();
    server = app.listen(0);
});

afterAll(async () => {
    await server.close();
    await db.end();
});

const checkChat = (initialChat: Chat, {
    title = true,
    provider = true,
    model = true,
    role = true,
    chatMessages = true
}) => {

    expect(initialChat.username).toBe(username);

    title ? expect(initialChat.title).toBe('First Chat with GPT-3.5') : undefined;
    provider ? expect(initialChat.provider).toBe('OpenAI') : undefined;
    model ? expect(initialChat.model).toBe('gpt-3.5-turbo') : undefined;
    role ? expect(initialChat.role).toBe('You are a helpful assistant.') : undefined;

    if (chatMessages) {
        expect(Array.isArray(initialChat.chat_messages)).toBe(true);
        expect(initialChat.chat_messages.length).toBe(3);
        expect(initialChat.chat_messages[0].role).toBe('user');
        expect(initialChat.chat_messages[0].text).toBe('You are a helpful assistant.');
        expect(initialChat.chat_messages[1].role).toBe('AI');
        expect(initialChat.chat_messages[1].text).toBe('Hello, can you help me?');
    }
}

describe('Update Chat Controller', () => {
    describe('Update chat', () => {
        it('201: TITLE - should return updated chat', async () => {
            checkChat(initialChat, {});

            const params: [CheckFlags, string][] = [
                [{ title: false }, 'title'],
                [{ provider: false }, 'provider'],
                [{ model: false }, 'model'],
                [{ role: false }, 'role'],
                [{ chatMessages: false }, 'chat_messages'],
                [{ temperature: false}, 'temperature']
            ]

            for (let i = 0; i < params.length; i++) {
                await reseedChatAndUpdateUser();
                const testObject = params[i][0];
                const keyName = params[i][1] as keyof Chat;

                const response = await request(app)
                    .post('/chat/update')
                    .send({
                        chatId: 1,
                        [keyName]: keyName === 'temperature' ? 10 : `new ${keyName} value`
                    })
                    .set("Authorization", `Bearer ${token}`);

                expect(response.status).toBe(201);

                const updatedChat: Chat = response.body;

                if (keyName === 'temperature') {
                    expect(updatedChat[keyName]).toBe(10);
                } else {
                    expect(updatedChat[keyName]).toBe(`new ${keyName} value`);
                }

                checkChat(updatedChat, testObject);
            }
        });

        it('201: ALL - should return updated chat when everything is updated one by one', async () => {
            await reseedChatAndUpdateUser();
            checkChat(initialChat, {});

            let updatedChat: Chat = initialChat;

            const params= ['title', 'summary', 'provider', 'model', 'role', 'chat_messages', 'temperature']

            for (let i = 0; i < params.length; i++) {
                const keyName = params[i] as keyof Chat;

                const response = await request(app)
                    .post('/chat/update')
                    .send({
                        chatId: 1,
                        [keyName]: keyName === 'temperature' ? 10 : `new ${keyName} value`
                    })
                    .set("Authorization", `Bearer ${token}`);

                expect(response.status).toBe(201);

                if (i === params.length + 1) {
                    updatedChat = response.body;
                }
            }

            const chatResponse = await request(app)
                .get('/chat')
                .query({ id: '1' })
                .set("Authorization", `Bearer ${token}`);

            updatedChat = chatResponse.body;

            for (const key of Object.keys(updatedChat) as (keyof Chat)[]) {
                if (key === 'temperature') {
                    expect(updatedChat[key]).toBe(10);
                } else if (!invalidKeys.includes(key)) {
                    expect(updatedChat[key]).toBe(`new ${key} value`);
                }
            }
        })

        it('201: ALL - should return updated chat when everything is updated in one request', async () => {
            await reseedChatAndUpdateUser();
            checkChat(initialChat, {});

            const response = await supertest(app)
                .post('/chat/update')
                .send({
                    chatId:1,
                    title: 'new value',
                    summary: 'new value',
                    provider: 'new value',
                    model: 'new value',
                    role: 'new value',
                    chat_messages: 'new value',
                    temperature: 10,
                })
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(201);

            const chat: Chat = response.body

            for (const key of Object.keys(chat) as (keyof Chat)[]) {
                if (key === 'temperature') {
                    expect(chat[key]).toBe(10);
                } else if (!invalidKeys.includes(key)) {
                    expect(chat[key]).toBe('new value')
                }
            }
        })

        it('400: Should return an error when no values to updated are passed', async () => {
            const response = await supertest(app)
                .post('/chat/update')
                .send({
                    chatId: 1,
                })
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(400);
            expect(response.body.msg).toBe('No fields provided to update');
        })

        it('404: Should return an error when wrong chatId is passed', async () => {
            const response = await supertest(app)
                .post('/chat/update')
                .send({
                    chatId: 20,
                    temperature: 1
                })
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body.msg).toBe('Chat with ID of 20 not found');
        })

        it('400: Should return an error when wrong chatId is passed', async () => {
            const response = await supertest(app)
                .post('/chat/update')
                .send({
                    chatId: 'asdasd',
                    temperature: 1
                })
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(400);
            expect(response.body.msg).toBe('Invalid input');
        })

        it('401: should return an error if no token is given', async () => {
            const response = await request(app)
                .post('/chat/update');

            expect(response.status).toBe(401);
            expect(response.body.msg).toBe("You need to be logged in");
        })

        it('401: should return an error if invalid token is given', async () => {
            const response = await request(app)
                .post('/chat/update')
                .set("Authorization", `Bearer invalid-token`);

            expect(response.status).toBe(401);
            expect(response.body.msg).toBe("Token is not valid");
        })
    });

})
