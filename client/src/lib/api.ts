import { ChatDetail, ChatSummary, CreateChatRequest } from '@/types/chat';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  async getChats(): Promise<ChatSummary[]> {
    const response = await fetch(`${API_BASE_URL}/chats`);
    if (!response.ok) {
      throw new Error('Failed to fetch chats');
    }
    return response.json();
  },

  async getChat(id: number): Promise<ChatDetail> {
    const response = await fetch(`${API_BASE_URL}/chats/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch chat');
    }
    return response.json();
  },

  async createChat(chat: CreateChatRequest): Promise<ChatDetail> {
    const response = await fetch(`${API_BASE_URL}/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chat }),
    });
    if (!response.ok) {
      throw new Error('Failed to create chat');
    }
    return response.json();
  },
}; 