import axios from 'axios';
import Env from '../config/env';

const client = axios.create({
  baseURL: 'https://api.openai.com/v1',
  timeout: 30_000,
  headers: {
    'Authorization': `Bearer ${Env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionResponse {
  choices: Array<{
    message: { content: string };
  }>;
}

export async function chatCompletion(
  messages: Message[],
  systemPrompt?: string,
): Promise<string> {
  const allMessages: Message[] = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;

  const response = await client.post<ChatCompletionResponse>('/chat/completions', {
    model: Env.OPENAI_MODEL,
    messages: allMessages,
    max_tokens: 1024,
  });

  return response.data.choices[0].message.content;
}

const SYDNEY_ONBOARDING_PROMPT = `You are a friendly Sydney tourism assistant helping new visitors discover the best of Sydney, Australia. 
Your role is to understand their preferences, interests, budget, and travel style to provide personalized recommendations. 
Ask about their interests (beaches, culture, food, adventure, family activities), how long they're staying, where they're based, and any dietary or accessibility requirements.
Be warm, enthusiastic, and knowledgeable about Sydney's attractions, neighborhoods, transport options, and hidden gems.`;

export async function onboardingChat(messages: Message[]): Promise<string> {
  return chatCompletion(messages, SYDNEY_ONBOARDING_PROMPT);
}
