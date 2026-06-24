import { generateText } from 'ai';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { isAiConfigured, models, usesGeminiProvider } from '@/lib/ai';
import { generateGeminiText } from '@/lib/gemini';
import { getStudyPrompt, isStudyOutputType } from '@/lib/study-types';

export const runtime = 'nodejs';

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

    const { content, type, fileName } = await req.json();

    if (!content || typeof content !== 'string') {
      return Response.json({ error: 'Document content is required' }, { status: 400 });
    }

    if (!type || !isStudyOutputType(type)) {
      return Response.json({ error: 'Invalid output type' }, { status: 400 });
    }

    const prompt = `${getStudyPrompt(type)}

Document title: ${fileName || 'Uploaded document'}

--- DOCUMENT START ---
${content}
--- DOCUMENT END ---`;

    const system =
      'You are StudyAI, an expert at turning lectures and documents into high-quality study materials. Be accurate and only use information from the document.';

    const result = usesGeminiProvider()
      ? await generateGeminiText({ prompt, system })
      : (
          await generateText({
            model: models.tutor,
            system,
            prompt,
          })
        ).text;

    return Response.json({ type, result, fileName: fileName || 'Document' });
  } catch (error) {
    console.error('[study/generate]', error);
    const message =
      error instanceof Error ? error.message : 'Failed to generate content';
    return Response.json({ error: message }, { status: 500 });
  }
}
