import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen mesh-bg flex items-center justify-center px-4 py-12 overflow-hidden">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[90px]" />
      </div>

      <div className="w-full max-w-md space-y-8">
        <Link href="/" className="flex items-center justify-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-serif font-bold text-foreground">StudyAI</span>
        </Link>

        <div className="glass-card glow-border rounded-2xl p-8 shadow-2xl shadow-black/20">
          {children}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          AI-powered notes, quizzes, slides & flashcards
        </p>
      </div>
    </div>
  )
}
