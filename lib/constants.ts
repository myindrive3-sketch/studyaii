// API Routes
export const API_ROUTES = {
  TUTOR_CHAT: '/api/tools/tutor',
  FLASHCARDS: '/api/tools/flashcards',
  FLASHCARDS_GENERATE: '/api/tools/flashcards/generate',
  QUIZZES: '/api/tools/quizzes',
  QUIZZES_GENERATE: '/api/tools/quizzes/generate',
  SUMMARIES_GENERATE: '/api/tools/summaries/generate',
  SLIDES_GENERATE: '/api/tools/slides/generate',
  STUDY_UPLOAD: '/api/study/upload',
  STUDY_GENERATE: '/api/study/generate',
};

// App Routes
export const APP_ROUTES = {
  HOME: '/',
  AUTH_LOGIN: '/auth/login',
  AUTH_SIGNUP: '/auth/signup',
  DASHBOARD: '/dashboard',
  STUDY_HUB: '/dashboard/study',
  TOOLS_TUTOR: '/dashboard/tools/tutor',
  TOOLS_FLASHCARDS: '/dashboard/tools/flashcards',
  TOOLS_QUIZZES: '/dashboard/tools/quizzes',
  TOOLS_SUMMARIES: '/dashboard/tools/summaries',
  TOOLS_SLIDES: '/dashboard/tools/slides',
  PROFILE: '/dashboard/profile',
};

// AI Tools Configuration
export const AI_TOOLS = [
  {
    id: 'study',
    name: 'Study Hub',
    description: 'Upload documents and generate notes, quizzes, slides & more',
    icon: 'Sparkles',
    route: APP_ROUTES.STUDY_HUB,
    featured: true,
  },
  {
    id: 'tutor',
    name: 'Tutor Chat',
    description: 'Get instant help from an AI tutor on any subject',
    icon: 'MessageCircle',
    route: APP_ROUTES.TOOLS_TUTOR,
  },
  {
    id: 'flashcards',
    name: 'Flashcards',
    description: 'Create and study with AI-generated flashcard decks',
    icon: 'BookOpen',
    route: APP_ROUTES.TOOLS_FLASHCARDS,
  },
  {
    id: 'quizzes',
    name: 'Quizzes',
    description: 'Generate quizzes from any text or topic',
    icon: 'Brain',
    route: APP_ROUTES.TOOLS_QUIZZES,
  },
  {
    id: 'summaries',
    name: 'Summaries',
    description: 'Summarize long texts quickly and accurately',
    icon: 'FileText',
    route: APP_ROUTES.TOOLS_SUMMARIES,
  },
  {
    id: 'slides',
    name: 'Slides',
    description: 'Generate presentation slides from any topic',
    icon: 'Presentation',
    route: APP_ROUTES.TOOLS_SLIDES,
  },
];

// UI Constants
export const COLORS = {
  PRIMARY: '#f59e0b',
  NAVY: '#0f172a',
  SLATE: '#1e293b',
  TEXT_PRIMARY: '#f8fafc',
  TEXT_SECONDARY: '#cbd5e1',
  BORDER: '#1e293b',
  SUCCESS: '#10b981',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
};

// Animations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// Limits
export const LIMITS = {
  MAX_CHAT_MESSAGE_LENGTH: 5000,
  MAX_SUMMARY_LENGTH: 10000,
  MAX_FLASHCARDS_PER_DECK: 100,
  MAX_QUIZ_QUESTIONS: 50,
  MAX_SLIDES_PER_PRESENTATION: 30,
};
