import { Chat } from "./types";

const chatData: Chat[] = [
  {
    username: "test_user1",
    title: "First Chat with GPT-3.5",
    provider: "OpenAI",
    model: "gpt-3.5-turbo",
    system_message: "You are a helpful assistant.",
    chat_messages:
      "system: You are a helpful assistant.\nuser: Hello, can you help me?\nassistant: Of course! What do you need?",
  },
  {
    username: "test_user2",
    title: "Coding Question - JavaScript",
    provider: "Google",
    model: "gemini-pro",
    system_message: "You are a coding expert specializing in JavaScript.",
    chat_messages:
      "system: You are a coding expert specializing in JavaScript.\nuser: How do I reverse a string?\nassistant: You can reverse a string in JavaScript using the split, reverse, and join methods: `str.split('').reverse().join('')`",
  },
  {
    username: "test_user1",
    title: "General Knowledge Quiz",
    provider: "OpenAI",
    model: "gpt-4",
    system_message: "You are a quizmaster.",
    chat_messages:
      "system: You are a quizmaster.\nuser: Ask me a question.\nassistant: What is the capital of France?",
  },
    {
    username: "test_user3",
    title: "Empty Chat",
    provider: "Mistral",
    model: "mistral-large",
    system_message: "You are a very quiet assistant.",
    chat_messages:
      "system: You are a very quiet assistant.",
  },
];

export default chatData;

