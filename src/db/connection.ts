import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const ENV = process.env.NODE_ENV ?? "development";
const config: { connectionString?: string; max?: number } = {};

if (ENV === "production" && process.env.DB_LINK) {
    config.connectionString = process.env.DB_LINK;
    config.max = 2;
} else if (ENV === "development" && process.env.DB_DEV_LINK) {
    config.connectionString = process.env.DB_DEV_LINK;
    config.max = 2;
}

if (!process.env.DB_LINK && !process.env.DB_DEV_LINK) {
    throw new Error("PGDATABASE or DATABASE_URL not set");
}

export default new Pool(config);
