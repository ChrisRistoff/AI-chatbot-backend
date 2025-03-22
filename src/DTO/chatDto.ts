type ChatMessage = {
    role: string,
    text: string,
}

type ChatMessages = ChatMessage[];

export type Chat = {
  username: string;
  title?: string;
  provider: string;
  model: string;
  system_message: string;
  chat_messages: ChatMessages;
}
