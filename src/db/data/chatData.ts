import { Chat } from "src/DTO/chatDto";

const chatData: Chat[] = [
    {
        username: "test_user11",
        title: "First Chat with GPT-3.5",
        summary: "First chat with chat gpt",
        provider: "OpenAI",
        model: "gpt-3.5-turbo",
        role: "You are a helpful assistant.",
        temperature: 0,
        chat_messages: [
            { role: "user", text: "You are a helpful assistant.", timestamp: new Date().toISOString() },
            { role: "AI", text: "Hello, can you help me?", timestamp: new Date().toISOString() },
            { role: "user", text: "Of course! What do you need?", timestamp: new Date().toISOString() },
        ],
    },

    {
        username: "test_user22",
        title: "Coding Question - JavaScript",
        summary: "AI answering coding questions for the user",
        provider: "Google",
        model: "gemini-pro",
        role: "You are a coding expert specializing in JavaScript.",
        temperature: 1,
        chat_messages: [
            { role: "user", text: "You are a coding expert specializing in JavaScript.", timestamp: new Date().toISOString() },
            { role: "AI", text: "How do I reverse a string?", timestamp: new Date().toISOString()  },
            { role: "user", text: "You can reverse a string in JavaScript using the split, reverse, and join methods: `str.split('').reverse().join('')`", timestamp: new Date().toISOString() },
        ],
    },

    {
        username: "test_user11",
        title: "General Knowledge Quiz",
        summary: "AI answers general questions for the user",
        provider: "OpenAI",
        model: "gpt-4",
        role: "You are a quizmaster.",
        temperature: 0,
        chat_messages: [
            { role: "user", text: "You are a quizmaster.", timestamp: new Date().toISOString() },
            { role: "AI", text: "Ask me a question.", timestamp: new Date().toISOString() },
            { role: "user", text: "What is the capital of France?", timestamp: new Date().toISOString() },
        ],
    },

    {
        username: "test_user33",
        title: "Empty Chat",
        summary: "No summary, chat is empty",
        provider: "Mistral",
        model: "mistral-large",
        role: "You are a very quiet assistant.",
        temperature: 10,
        chat_messages: [
            { role: "system", text: "You are a very quiet assistant.", timestamp: new Date().toISOString() },
        ],
    },
];

export default chatData;

