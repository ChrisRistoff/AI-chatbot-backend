import { seed } from "./seed";
import userData from "../data/userData";
import chatData from "../data/chatData";

const runSeed = async (): Promise<void> => {
    try {
        await seed({users: userData, chats: chatData});
    } catch (err) {
        throw err
    } finally {
        process.exit();
    }
};

runSeed().then(() => console.log('Seed Complete')).catch((err) => console.log('Seed Failed', err));
