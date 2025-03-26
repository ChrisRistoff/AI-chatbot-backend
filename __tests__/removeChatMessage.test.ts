import { seed } from "../src/db/seed/seed";
import { app } from "../src/app";
import db from "../src/db/connection";
import request from 'supertest';
import chatData from "../src/db/data/chatData";
import userData from "../src/db/data/userData";
import { Chat } from "../src/DTO/chatDto";

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

describe('Chat messages', () => {
    describe('POST /chat/removeMessage', () => {
        it('204: Should remove chat message', async () => {
            const getChatResponse = await request(app)
                .get('/chat')
                .query({ id: '1' })
                .set("Authorization", `Bearer ${token}`);

            expect(getChatResponse.status).toBe(200);

            const originalChat: Chat = getChatResponse.body;

            expect(originalChat.chat_messages.length).toBe(3);
            expect(originalChat.chat_messages[0].role).toBe('user');

            const removeMessageResponse = await request(app)
                .post("/chats/removeMessage")
                .send({
                    id: 1,
                    messageIndex: 0,
                })
                .set("Authorization", `Bearer ${token}`);

            expect(removeMessageResponse.status).toBe(204);

            const updatedChatResponse = await request(app)
                .get('/chat')
                .query({ id: '1' })
                .set("Authorization", `Bearer ${token}`);

            expect(updatedChatResponse.status).toBe(200);

            const updatedChat: Chat = updatedChatResponse.body;

            expect(updatedChat.chat_messages.length).toBe(2);
            expect(updatedChat.chat_messages[0].role).toBe('AI');
        })
    });

    it('404: Should return an error if chat does not exist', async () => {
        const response = await request(app)
            .post("/chats/removeMessage")
            .send({
                id: 2222,
                messageIndex: 0,
            })
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.msg).toBe("Chat with id 2222 does not exist");
    })

    it('401: Should return an error if no token is given', async () => {
        const response = await request(app)
            .post("/chats/removeMessage")
            .send({
                id: 1,
                messageIndex: 0,
            });

        expect(response.status).toBe(401);
        expect(response.body.msg).toBe("You need to be logged in");
    })

    it('401: Should return an error if invalid token is given', async () => {
        const response = await request(app)
            .post("/chats/removeMessage")
            .send({
                id: 1,
                messageIndex: 0,
            })
            .set("Authorization", `Bearer invalid-token`);

        expect(response.status).toBe(401);
        expect(response.body.msg).toBe("Token is not valid");
    })
})
