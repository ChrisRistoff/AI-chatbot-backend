export type Chat = {
  username: string;
  title?: string;
  provider: string;
  model: string;
  system_message: string;
  chat_messages: string;
}

export type User = {
    username: string;
    email: string;
    password: string;
}
