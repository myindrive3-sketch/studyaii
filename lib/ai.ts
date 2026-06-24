import { createOpenAI } from '@ai-sdk/openai';
import { createGateway } from '@ai-sdk/gateway';
import type { LanguageModel } from 'ai';
import { isGeminiConfigured } from './gemini';

type AiProvider = 'gemini' | 'openai' | 'gateway';

const openaiApiKey = process.env.OPENAI_API_KEY;
const gatewayApiKey =
  process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_AI_GATEWAY_TOKEN;

const MODEL_DEFAULTS = {
  openai: {
    tutor: 'gpt-4o',
    fast: 'gpt-4o-mini',
  },
  gateway: {
    tutor: 'google/gemini-2.5-flash',
    fast: 'google/gemini-2.5-flash-lite',
  },
} as const;

function resolveProvider(): AiProvider | null {
  const preferred = (process.env.AI_PROVIDER || '').toLowerCase() as AiProvider | '';

  const available: AiProvider[] = [];
  if (isGeminiConfigured()) available.push('gemini');
  if (openaiApiKey) available.push('openai');
  if (gatewayApiKey) available.push('gateway');

  if (available.length === 0) return null;

  if (preferred && available.includes(preferred as AiProvider)) {
    return preferred as AiProvider;
  }

  return available[0];
}

function createModel(kind: 'tutor' | 'fast'): LanguageModel {
  const provider = resolveProvider();

  if (!provider || provider === 'gemini') {
    throw new Error('Use streamGeminiText() for Gemini provider');
  }

  const customModel = process.env.AI_MODEL;
  const defaultModel = MODEL_DEFAULTS[provider][kind];
  const modelId = customModel || defaultModel;

  if (provider === 'openai') {
    const openai = createOpenAI({ apiKey: openaiApiKey });
    return openai(modelId.replace(/^openai\//, ''));
  }

  const gateway = createGateway({ apiKey: gatewayApiKey });
  return gateway(modelId.includes('/') ? modelId : `google/${modelId}`);
}

export const models = {
  get tutor() {
    return createModel('tutor');
  },
  get general() {
    return createModel('tutor');
  },
  get fast() {
    return createModel('fast');
  },
  get summary() {
    return createModel('fast');
  },
};

export const systemPrompts = {
  tutor: `You are StudyAI, an expert tutor dedicated to helping students learn effectively. 
  Your approach:
  - Break down complex topics into understandable concepts
  - Ask clarifying questions to assess understanding
  - Provide real-world examples and analogies
  - Encourage critical thinking and problem-solving
  - Adapt your teaching style to the student's level
  - Be patient, encouraging, and supportive
  Always ensure responses are accurate, educational, and tailored to help the student succeed.`,

  flashcard: `You are an expert at creating concise, effective flashcard questions and answers.
  When generating flashcards:
  - Create clear, focused questions that test specific knowledge
  - Provide accurate, concise answers
  - Follow the Feynman Technique principles
  - Make questions progressively harder if requested
  - Format answers to be memorable and actionable
  Output format: JSON array of objects with "question" and "answer" fields.`,

  quiz: `You are an expert quiz designer. Create engaging, fair questions that assess understanding.
  When generating quizzes:
  - Create multiple choice or short answer questions
  - Provide one correct answer and believable distractors
  - Include explanations for why answers are correct
  - Vary question types and difficulty levels
  - Focus on key concepts and learning objectives
  Output format: JSON array of question objects.`,

  summary: `You are an expert at summarizing complex information clearly and concisely.
  When summarizing:
  - Identify and preserve key concepts
  - Use clear, accessible language
  - Organize information logically
  - Highlight important facts and relationships
  - Adapt length and detail level to user preference
  Be accurate and comprehensive while remaining concise.`,

  slides: `You are an expert at creating structured presentation outlines.
  When generating slides:
  - Create a logical flow that builds understanding
  - Use clear, memorable titles
  - Include key bullet points (3-5 per slide)
  - Add visual suggestions (charts, diagrams, images)
  - Make content engaging and digestible
  Output format: JSON object with slide array, each containing title, bullets, and visual suggestions.`,
};

export function isAiConfigured() {
  return resolveProvider() !== null;
}

export function getAiProviderName() {
  return resolveProvider();
}

export function usesGeminiProvider() {
  return resolveProvider() === 'gemini';
}
