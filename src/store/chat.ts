import { makeAutoObservable } from 'mobx';
import { chatService } from '../services';
import { Chat, ChatMessage, ContextTag } from './interface';

interface ChatMessages {
  [chat_id: string]: ChatMessage[];
}

export interface ChatStore {
  chats: Map<string, Chat>;
  chatMessages: ChatMessages;
  currentChatId: string | null;

  addChat: (chat: Chat) => void;
  updateChat: (id: string, chat: Partial<Chat>) => void;
  getChat: (id: string) => Chat | undefined;
  getChatMessages: (chat_id: string) => ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, message: Partial<ChatMessage>) => void;
}

export class ChatHistoryStore implements ChatStore {
  chats: Map<string, Chat> = new Map();
  chatMessages: ChatMessages = {};
  currentChatId: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  addChat(chat: Chat) {
    this.chats.set(chat.id, chat);
    if (!this.chatMessages[chat.id]) {
      this.chatMessages[chat.id] = [];
    }
  }

  updateChat(id: string, chatUpdate: Partial<Chat>) {
    const existingChat = this.chats.get(id);
    if (existingChat) {
      this.chats.set(id, { ...existingChat, ...chatUpdate });
    }
  }

  getChat(id: string): Chat | undefined {
    return this.chats.get(id);
  }

  getChatMessages(chat_id: string): ChatMessage[] {
    return this.chatMessages[chat_id] || [];
  }

  addMessage(message: ChatMessage) {
    const chatMessages = this.chatMessages[message.chat_id] || [];
    this.chatMessages[message.chat_id] = [...chatMessages, message];
  }

  updateMessage(id: string, messageUpdate: Partial<ChatMessage>) {
    Object.keys(this.chatMessages).forEach((chatId: string) => {
      this.chatMessages[chatId] = this.chatMessages[chatId].map((msg: ChatMessage) =>
        msg.id === id ? { ...msg, ...messageUpdate } : msg
      );
    });
  }

  async loadChat(chat_id: string): Promise<Chat | undefined> {
    const chat = await chatService.getChat(chat_id);
    if (chat) {
      this.addChat(chat);
    }
    return chat;
  }

  async loadChatHistory(chat_id: string): Promise<ChatMessage[] | undefined> {
    const messages = await chatService.getChatHistory(chat_id);
    if (messages) {
      this.chatMessages[chat_id] = messages;
    }
    return messages;
  }

  async sendMessage(
    chat_id: string,
    message: string,
    contextTags?: ContextTag[]
  ): Promise<ChatMessage | undefined> {
    const newMessage = await chatService.sendMessage(chat_id, message, contextTags);
    if (newMessage) {
      this.addMessage(newMessage);
    }
    return newMessage;
  }
}

export const chatHistoryStore = new ChatHistoryStore();
