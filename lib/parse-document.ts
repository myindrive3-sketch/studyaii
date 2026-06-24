const MAX_DOCUMENT_CHARS = 50000;

const TEXT_EXTENSIONS = new Set(['.txt', '.md', '.markdown', '.csv', '.json']);

export const SUPPORTED_EXTENSIONS = [
  '.pdf',
  '.txt',
  '.md',
  '.markdown',
  '.docx',
  '.pptx',
] as const;

export function truncateDocument(text: string) {
  if (text.length <= MAX_DOCUMENT_CHARS) return text;
  return `${text.slice(0, MAX_DOCUMENT_CHARS)}\n\n[Document truncated for processing]`;
}

async function extractFromOffice(buffer: Buffer, label: string) {
  const { parseOffice } = await import('officeparser');
  const ast = await parseOffice(buffer);
  const text = ast.toText()?.trim();
  if (!text) {
    throw new Error(`Could not extract text from this ${label} file`);
  }
  return truncateDocument(text);
}

export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  const extension = name.slice(name.lastIndexOf('.'));

  if (TEXT_EXTENSIONS.has(extension)) {
    return truncateDocument(await file.text());
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (extension === '.pdf') {
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    const text = result.text?.trim();
    if (!text) throw new Error('Could not extract text from this PDF');
    return truncateDocument(text);
  }

  if (extension === '.docx') {
    return extractFromOffice(buffer, 'Word');
  }

  if (extension === '.pptx') {
    return extractFromOffice(buffer, 'PowerPoint');
  }

  throw new Error(
    'Unsupported file type. Upload PDF, DOCX, PPTX, TXT, or MD files.'
  );
}
