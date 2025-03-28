type ChatMessage = {
    role: string,
    text: string,
    timestamp: string,
}

export type ChatMessages = ChatMessage[];

export type Chat = {
    username: string;
    title?: string;
    summary: string;
    provider: string;
    model: string;
    role: string;
    chat_messages: ChatMessages;
}
