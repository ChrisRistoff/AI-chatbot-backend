import { seed } from "../src/db/seed/seed";
import { app } from "../src/app";
import db from "../src/db/connection";
import request from 'supertest';
import chatData from "../src/db/data/chatData";
import userData from "../src/db/data/userData";

let server: any;

beforeAll(async () => {
    await seed({users: userData, chats: chatData});

    server = app.listen(0);
});

afterAll(async () => {
    await server.close();
    await db.end();
});

describe('User controllers', () => {
    describe('Create user', () => {
        it('201: should create a new user', async () => {
            const response = await request(app).post("/register").send({
                username: "username",
                email: "username@google.com",
                password: "password",
            });

            expect(response.statusCode).toBe(201);
            expect(response.body.token).toBeDefined();
        })

        it('409: Should throw error when trying to register an existing user', async () => {
            const response = await request(app).post("/register").send({
                username: "username",
                email: "username@google.com",
                password: "password",
            });

            expect(response.statusCode).toBe(409);
            expect(response.body.msg).toBe('User already exists');
        })
    });

    describe('Login user', () => {
        it('200: should sign in user', async () => {
            const response = await request(app).post("/login").send({
                username: "username",
                password: "password",
            });

            expect(response.statusCode).toBe(200);
            expect(response.body.token).toBeDefined();
        })

        it('404: should throw an error when user does not exist', async () => {
            const response = await request(app).post("/login").send({
                username: "username-non-existant",
                password: "password",
            });

            expect(response.statusCode).toBe(404);
            expect(response.body.msg).toBe("User not found");
        })

        it('404: should throw an error when incorrect password is given', async () => {
            const response = await request(app).post("/login").send({
                username: "username",
                password: "password-wrong",
            });

            expect(response.statusCode).toBe(401);
            expect(response.body.msg).toBe("Incorrect password");
        })
    })
});
