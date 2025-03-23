import { QueryResult } from 'pg';
import db from '../db/connection';
import { User } from '../db/data/userData';
import { comparePassword } from '../middleware/authentication';

export async function createUserModel(username: string, email: string, password: string): Promise<User> {
    const existingUser: QueryResult = await db.query(
        `
            SELECT username FROM users WHERE username=$1
        `,
        [username],
    );

    if (existingUser.rows.length > 0) {
        return Promise.reject({ errCode: 409, errMsg: "User already exists" });
    }

    const user = await db.query(
        `
            INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3) RETURNING *
        `,
        [username, email, password],
    );

    return user.rows[0];
};

export async function signUserInModel(username: string, password: string): Promise<User> {
    const user: QueryResult<User> = await db.query(
        `
            SELECT * FROM users WHERE username=$1
        `,
        [username],
    );

    if (!user.rows.length) {
        return Promise.reject({ errCode: 404, errMsg: "User not found" });
    }

    const isValid: boolean = await comparePassword(
        password,
        user.rows[0].password,
    );

    if (!isValid)
        return Promise.reject({ errCode: 401, errMsg: "Incorrect password" });

    user.rows[0].password = '';

    return user.rows[0];
};
