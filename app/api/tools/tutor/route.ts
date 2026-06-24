import { streamText, type ModelMessage } from 'ai';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import {
  getAiProviderName,
  isAiConfigured,
  models,
  systemPrompts,
  usesGeminiProvider,
} from '@/lib/ai';
import { streamGeminiText } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    if (!isAiConfigured()) {
      return new Response(
        JSON.stringify({
          error:
            'AI is not configured. Set GOOGLE_GENERATIVE_AI_API_KEY, OPENAI_API_KEY, or AI_GATEWAY_API_KEY in .env.local',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const normalizedMessages = messages.map(
      (msg: { role?: string; content?: string }) => ({
        role: (msg.role === 'assistant' ? 'assistant' : 'user') as
          | 'user'
          | 'assistant',
        content: msg.content || '',
      })
    );

    if (usesGeminiProvider()) {
      const stream = await streamGeminiText({
        model: process.env.AI_MODEL || 'gemini-2.5-flash',
        system: systemPrompts.tutor,
        messages: normalizedMessages,
      });

      return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    const result = streamText({
      model: models.tutor,
      system: systemPrompts.tutor,
      messages: normalizedMessages satisfies ModelMessage[],
      temperature: 0.7,
      maxOutputTokens: 2000,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('[tutor] API error:', error);

    const message =
      error instanceof Error ? error.message : 'Failed to process request';

    const friendlyMessage = message.includes('unregistered callers')
      ? 'Gemini API key is not active yet. In Google AI Studio, restrict the key to Gemini API only, or create a new key in a fresh project.'
      : message;

    return new Response(JSON.stringify({ error: friendlyMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
