import client, { ApiError } from './api/client';

export { ApiError };

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  reply: string;
}

export interface Recommendation {
  name: string;
  type: string;
  description: string;
  address: string;
  why: string;
}

export interface RecommendationsResponse {
  recommendations: Recommendation[] | string;
}

// POST /v1/ai/chat
export async function sendChatMessage(messages: ChatMessage[], systemPrompt?: string): Promise<ChatResponse> {
  return client.post<ChatResponse>('/v1/ai/chat', { messages, systemPrompt });
}

// POST /v1/ai/onboarding
export async function sendOnboardingMessage(messages: ChatMessage[]): Promise<ChatResponse> {
  return client.post<ChatResponse>('/v1/ai/onboarding', { messages });
}

// POST /v1/ai/recommendations
export async function getRecommendations(preferences: Record<string, unknown>, location?: { lat: number; lng: number }): Promise<RecommendationsResponse> {
  return client.post<RecommendationsResponse>('/v1/ai/recommendations', { preferences, location });
}
