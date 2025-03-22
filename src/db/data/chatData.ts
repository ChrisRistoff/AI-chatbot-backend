import { Chat } from "./types";

const chatData: Chat[] = [
  {
    username: "test_user11",
    title: "First Chat with GPT-3.5",
    provider: "OpenAI",
    model: "gpt-3.5-turbo",
    system_message: "You are a helpful assistant.",
    chat_messages: [
      { role: "system", text: "You are a helpful assistant." },
      { role: "user", text: "Hello, can you help me?" },
      { role: "assistant", text: "Of course! What do you need?" },
    ],
  },

  {
    username: "test_user22",
    title: "Coding Question - JavaScript",
    provider: "Google",
    model: "gemini-pro",
    system_message: "You are a coding expert specializing in JavaScript.",
    chat_messages: [
      { role: "system", text: "You are a coding expert specializing in JavaScript." },
      { role: "user", text: "How do I reverse a string?" },
      { role: "assistant", text: "You can reverse a string in JavaScript using the split, reverse, and join methods: `str.split('').reverse().join('')`" },
    ],
  },

  {
    username: "test_user11",
    title: "General Knowledge Quiz",
    provider: "OpenAI",
    model: "gpt-4",
    system_message: "You are a quizmaster.",
    chat_messages: [
      { role: "system", text: "You are a quizmaster." },
      { role: "user", text: "Ask me a question." },
      { role: "assistant", text: "What is the capital of France?" },
    ],
  },

  {
    username: "test_user33",
    title: "Empty Chat",
    provider: "Mistral",
    model: "mistral-large",
    system_message: "You are a very quiet assistant.",
    chat_messages: [
      { role: "system", text: "You are a very quiet assistant." },
    ],
  },
];

export default chatData;

