export type StudyOutputType =
  | 'notes'
  | 'quiz'
  | 'slides'
  | 'infographic'
  | 'flashcards';

export const STUDY_OUTPUTS: Array<{
  id: StudyOutputType;
  name: string;
  description: string;
  icon: string;
}> = [
  {
    id: 'notes',
    name: 'Smart Notes',
    description: 'Structured study notes with headings and key points',
    icon: 'FileText',
  },
  {
    id: 'quiz',
    name: 'Quiz',
    description: 'Multiple-choice questions with explanations',
    icon: 'Brain',
  },
  {
    id: 'slides',
    name: 'Presentation',
    description: 'Slide deck outline ready to present',
    icon: 'Presentation',
  },
  {
    id: 'infographic',
    name: 'Infographic',
    description: 'Visual summary with sections and stats',
    icon: 'BarChart3',
  },
  {
    id: 'flashcards',
    name: 'Flashcards',
    description: 'Question and answer cards for revision',
    icon: 'BookOpen',
  },
];

const PROMPTS: Record<StudyOutputType, string> = {
  notes: `Create comprehensive study notes from the document.
Use markdown with clear headings, bullet points, definitions, and a "Key Takeaways" section at the end.
Make it exam-ready and easy to scan.`,

  quiz: `Create a quiz from the document with 8-10 multiple choice questions.
Return ONLY valid JSON in this format:
{
  "title": "Quiz title",
  "questions": [
    {
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}`,

  slides: `Create a presentation from the document with 8-12 slides.
Return ONLY valid JSON:
{
  "title": "Presentation title",
  "slides": [
    {
      "title": "Slide title",
      "bullets": ["point 1", "point 2"],
      "speakerNotes": "What to say"
    }
  ]
}`,

  infographic: `Create an infographic-style summary from the document.
Return ONLY valid JSON:
{
  "title": "Infographic title",
  "tagline": "One line summary",
  "sections": [
    {
      "heading": "Section title",
      "points": ["fact 1", "fact 2"],
      "stat": "optional highlight stat"
    }
  ],
  "keyStats": ["stat 1", "stat 2", "stat 3"]
}`,

  flashcards: `Create flashcards from the document for revision.
Return ONLY valid JSON:
{
  "title": "Deck title",
  "cards": [
    { "question": "Front of card", "answer": "Back of card" }
  ]
}
Create 12-20 cards.`,
};

export function getStudyPrompt(type: StudyOutputType) {
  return PROMPTS[type];
}

export function isStudyOutputType(value: string): value is StudyOutputType {
  return value in PROMPTS;
}
