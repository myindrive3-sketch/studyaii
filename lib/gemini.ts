import { GoogleGenAI } from '@google/genai';

const apiKey =
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY;

export function isGeminiConfigured() {
  return Boolean(apiKey);
}

export function getGeminiClient() {
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }
  return new GoogleGenAI({ apiKey });
}

export async function generateGeminiText({
  model = 'gemini-2.5-flash',
  prompt,
  system,
}: {
  model?: string;
  prompt: string;
  system?: string;
}) {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: system,
      temperature: 0.7,
      maxOutputTokens: 8000,
    },
  });
  return response.text || '';
}

export async function streamGeminiText({
  model = 'gemini-2.5-flash',
  system,
  messages,
}: {
  model?: string;
  system: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
}) {
  const ai = getGeminiClient();

  const stream = await ai.models.generateContentStream({
    model,
    contents: messages.map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }],
    })),
    config: {
      systemInstruction: system,
      temperature: 0.7,
      maxOutputTokens: 2000,
    },
  });

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.text;
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}
