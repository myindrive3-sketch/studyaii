import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { extractTextFromFile } from '@/lib/parse-document';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return Response.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ error: 'File must be under 10MB' }, { status: 400 });
    }

    const text = await extractTextFromFile(file);
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    return Response.json({
      fileName: file.name,
      text,
      wordCount,
      charCount: text.length,
    });
  } catch (error) {
    console.error('[study/upload]', error);
    const message =
      error instanceof Error ? error.message : 'Failed to process document';
    return Response.json({ error: message }, { status: 400 });
  }
}
