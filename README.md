# StudyAI - AI-Powered Learning Platform

A sophisticated, full-stack AI learning platform built with Next.js, featuring five powerful AI-driven study tools to help students master any subject efficiently.

## Features

### 🎓 Five AI-Powered Learning Tools

1. **Tutor Chat** - Real-time conversational AI tutor with streaming responses
   - Get instant help on any subject
   - Adaptive teaching approach
   - Message history tracking
   - Expert explanations and guidance

2. **Flashcards** - Intelligent spaced-repetition learning system
   - Create custom flashcard decks
   - AI-generated cards from topics
   - Progress tracking
   - Study mode with visual feedback

3. **Quizzes** - Dynamic quiz generation and assessment
   - Generate quizzes from any topic or text
   - Multiple question types
   - Performance tracking
   - Detailed explanations for incorrect answers

4. **Summaries** - Advanced text summarization tool
   - Summarize long documents instantly
   - Adjustable summary length (short/medium/long)
   - Character count tracking
   - Download and export functionality

5. **Presentations** - Automatic slide generation
   - Generate professional presentations from topics
   - AI-organized content structure
   - Visual layout suggestions
   - PDF export capability

### 🎨 Dark-Navy Academic Theme
- Sophisticated dark-navy primary color (#0F172A)
- Gold accent color (#F59E0B) for highlights
- Serif display fonts for headings
- Smooth animations and transitions
- Fully responsive mobile-first design

### 🔐 Security & Authentication
- Email + password authentication with validation
- Google OAuth 2.0 integration
- Better Auth for session management
- PostgreSQL with Row-Level Security (RLS)
- Protected dashboard routes with middleware

### 📊 Data Persistence
- PostgreSQL database with RLS policies
- User data isolation at database level
- Complete audit trails
- Type-safe queries with TypeScript

### ⚡ AI Integration
- AI SDK 6 with Vercel AI Gateway
- GPT-4 Turbo for tutor and general tasks
- GPT-4 Mini for faster responses
- Streaming responses for real-time feedback
- Multi-model support (OpenAI, Google, Anthropic)

## Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- React 19.2
- TypeScript
- Tailwind CSS 4
- shadcn/ui components
- Lucide icons

**Backend:**
- Next.js API Routes
- Better Auth
- AI SDK 6
- PostgreSQL

**Deployment:**
- Vercel (recommended)
- Next.js 16 with Turbopack

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- PostgreSQL database
- Google OAuth credentials
- Vercel AI Gateway token

### Installation

1. **Clone and install dependencies:**
```bash
pnpm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
```

3. **Configure your .env.local:**
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/studyai

# Better Auth
BETTER_AUTH_SECRET=your-secret-key (generate with: openssl rand -base64 32)
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI Gateway
VERCEL_AI_GATEWAY_TOKEN=your-ai-gateway-token
```

4. **Create PostgreSQL database:**
```bash
createdb studyai
```

5. **Run database schema:**
```bash
psql studyai < lib/schema.sql
```

6. **Start development server:**
```bash
pnpm dev
```

7. **Open browser:**
```
http://localhost:3000
```

## Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── tools/           # AI tools pages
│   │   ├── layout.tsx       # Dashboard layout
│   │   └── page.tsx         # Dashboard home
│   ├── auth/                # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── layout.tsx
│   ├── api/                 # API routes
│   │   └── tools/          # Tool endpoints
│   ├── layout.tsx           # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles & theme
├── components/
│   ├── dashboard/          # Dashboard UI components
│   ├── ui/                 # shadcn/ui components
│   └── ...
├── lib/
│   ├── db.ts              # PostgreSQL client
│   ├── auth.ts            # Better Auth config
│   ├── ai.ts              # AI SDK setup
│   ├── schema.sql         # Database schema
│   ├── constants.ts       # App constants
│   └── utils.ts           # Utility functions
├── public/                # Static assets
└── .env.example          # Environment variables template
```

## Database Schema

The application uses PostgreSQL with Row-Level Security policies to ensure data privacy:

- **users** - User accounts (managed by Better Auth)
- **sessions** - Authentication sessions
- **chat_history** - Tutor chat conversations
- **flashcard_decks** - User flashcard collections
- **flashcard_progress** - Learning progress tracking
- **quizzes** - Quiz collections
- **quiz_attempts** - Quiz responses and scores
- **summaries** - Generated text summaries
- **presentations** - AI-generated presentations

All tables have RLS policies enforcing user-based data isolation.

## Authentication Flow

1. **Signup/Login** - Users authenticate via email or Google OAuth
2. **Session Creation** - Better Auth manages encrypted sessions
3. **Protected Routes** - Middleware redirects unauthenticated requests
4. **Data Isolation** - RLS policies ensure users only access their own data

## API Endpoints

### Tutor Chat
- `POST /api/tools/tutor` - Stream chat responses

### Future Endpoints
- `POST /api/tools/flashcards/generate` - Generate flashcards
- `POST /api/tools/quizzes/generate` - Generate quizzes
- `POST /api/tools/summaries/generate` - Generate summaries
- `POST /api/tools/slides/generate` - Generate presentations

## Development

### Running Tests
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
pnpm start
```

### Linting
```bash
pnpm lint
```

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
```bash
git push origin main
```

2. **Connect to Vercel:**
- Go to vercel.com
- Import your GitHub repository
- Add environment variables in Project Settings
- Deploy!

### Environment Variables for Production

Set these in your Vercel project settings:
- `DATABASE_URL` - Production PostgreSQL connection
- `BETTER_AUTH_SECRET` - Secure random string
- `BETTER_AUTH_URL` - Your production domain
- `GOOGLE_CLIENT_ID` - OAuth credentials
- `GOOGLE_CLIENT_SECRET` - OAuth credentials
- `VERCEL_AI_GATEWAY_TOKEN` - AI Gateway token

## Customization

### Theming

Edit `app/globals.css` to customize colors:
```css
--background: #0f172a;      /* Navy background */
--foreground: #f8fafc;      /* Light text */
--accent: #f59e0b;          /* Gold accent */
--primary: #f59e0b;         /* Primary action color */
```

### Fonts

Fonts are configured in `app/layout.tsx` and `app/globals.css`:
- Display: Playfair Display (serif)
- Body: Geist (sans-serif)
- Mono: Geist Mono

## Performance Optimizations

- Next.js 16 with Turbopack for fast builds
- Server-side rendering for core pages
- Streaming responses for AI interactions
- Image optimization
- Code splitting and lazy loading
- Database query indexing

## Security Measures

- Row-Level Security on all database tables
- Password hashing with Better Auth
- CSRF protection
- XSS protection via React
- SQL injection prevention with parameterized queries
- Secure session management
- Environment variable protection

## Future Enhancements

- [ ] Voice input for tutor chat
- [ ] Collaborative study groups
- [ ] Advanced analytics dashboard
- [ ] Mobile app
- [ ] Offline mode with sync
- [ ] Custom AI model training
- [ ] Integration with learning platforms
- [ ] Social sharing features

## Support

For issues or questions:
1. Check existing GitHub issues
2. Create a detailed bug report
3. Contact support at support@studyai.com

## License

MIT License - See LICENSE file for details

## Acknowledgments

- Built with Next.js, React, and TypeScript
- AI powered by Vercel AI SDK and multiple LLM providers
- UI components from shadcn/ui
- Icons from Lucide React
- Styling with Tailwind CSS

---

**StudyAI** - Master Any Subject, Smarter and Faster
