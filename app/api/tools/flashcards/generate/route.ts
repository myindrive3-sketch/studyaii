import { generateText } from 'ai';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { isAiConfigured, models, usesGeminiProvider } from '@/lib/ai';
import { generateGeminiText } from '@/lib/gemini';

export const runtime = 'nodejs';

const FLASHCARD_SYSTEM =
  'You are StudyAI, an expert at creating concise, effective flashcards. Return only valid JSON, no markdown fences.';

function buildFlashcardPrompt(
  topic: string,
  content: string | undefined,
  cardCount: number
) {
  const source = content?.trim()
    ? `\n\nSource material:\n${content}`
    : '';

  return `Create ${cardCount} flashcards about: ${topic}${source}

Return ONLY valid JSON in this exact format:
{
  "title": "Deck title",
  "cards": [
    { "question": "Front of card", "answer": "Back of card" }
  ]
}`;
}

export async function POST(req: Request) {
  try {
    if (!isAiConfigured()) {
      return Response.json(
        { error: 'AI is not configured. Add your Gemini API key in .env.local' },
        { status: 503 }
      );
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { topic, content, cardCount = 15 } = await req.json();

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return Response.json({ error: 'Topic is required' }, { status: 400 });
    }

    const count = Math.min(Math.max(Number(cardCount) || 15, 5), 30);
    const prompt = buildFlashcardPrompt(topic.trim(), content, count);

    const result = usesGeminiProvider()
      ? await generateGeminiText({ prompt, system: FLASHCARD_SYSTEM })
      : (
          await generateText({
            model: models.fast,
            system: FLASHCARD_SYSTEM,
            prompt,
          })
        ).text;

    return Response.json({ result });
  } catch (error) {
    console.error('[flashcards/generate]', error);
    const message =
      error instanceof Error ? error.message : 'Failed to generate flashcards';
    return Response.json({ error: message }, { status: 500 });
  }
}
