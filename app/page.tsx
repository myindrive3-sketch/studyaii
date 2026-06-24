import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Upload,
  FileText,
  Brain,
  Presentation,
  BarChart3,
  BookOpen,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react'

export default function LandingPage() {
  const outputs = [
    { icon: FileText, title: 'Smart Notes', desc: 'Structured, exam-ready notes' },
    { icon: Brain, title: 'Quizzes', desc: 'Test yourself with MCQs' },
    { icon: Presentation, title: 'Slides', desc: 'Presentation decks instantly' },
    { icon: BarChart3, title: 'Infographics', desc: 'Visual summaries' },
    { icon: BookOpen, title: 'Flashcards', desc: 'Revision cards' },
  ]

  const steps = [
    { num: '01', title: 'Upload', desc: 'Drop your PDF, lecture notes, or paste text' },
    { num: '02', title: 'Choose', desc: 'Pick notes, quiz, slides, infographic, or flashcards' },
    { num: '03', title: 'Study', desc: 'AI generates everything in seconds' },
  ]

  return (
    <main className="min-h-screen mesh-bg overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px]" />
      </div>

      <nav className="border-b border-border/20 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-serif font-bold text-foreground">StudyAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-slideUp">
          <Zap className="w-3.5 h-3.5" />
          Transform lectures into study materials
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-foreground leading-[1.1] mb-6 animate-slideUp">
          Upload once.
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-primary to-violet-300 bg-clip-text text-transparent">
            Study smarter.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-slideUp">
          Drop your lecture PDF or notes — get smart notes, quizzes, presentation slides, infographics, and flashcards powered by AI.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-slideUp">
          <Link href="/auth/signup">
            <Button size="lg" className="h-12 px-8 bg-gradient-to-r from-violet-500 to-primary text-white font-semibold hover:shadow-xl hover:shadow-primary/25 text-base">
              Start for Free <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="outline" className="h-12 px-8 border-border/60 text-foreground">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="relative max-w-3xl mx-auto animate-slideUp">
          <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur p-8 shadow-2xl shadow-primary/5">
            <div className="border-2 border-dashed border-primary/30 rounded-xl p-10 bg-primary/5">
              <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground">Drop your document here</p>
              <p className="text-sm text-muted-foreground mt-2">PDF, DOCX, PPTX, lecture notes — up to 10MB</p>
            </div>
            <div className="grid grid-cols-5 gap-2 mt-6">
              {outputs.map((o, i) => {
                const Icon = o.icon
                return (
                  <div key={i} className="p-3 rounded-lg bg-background/50 border border-border/30 text-center">
                    <Icon className="w-5 h-5 text-primary mx-auto mb-1" />
                    <p className="text-[10px] text-muted-foreground font-medium">{o.title}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-border/20">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center text-foreground mb-4">
          How it works
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Three simple steps — just like StudyAI
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="text-center p-8 rounded-2xl bg-card/40 border border-border/30 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/15 text-primary font-serif font-bold text-lg flex items-center justify-center mx-auto mb-4">
                {step.num}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center text-foreground mb-12">
          Everything you need to ace exams
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {outputs.map((o, i) => {
            const Icon = o.icon
            return (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-card/40 border border-border/30 hover:border-primary/40 hover:bg-card/70 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{o.title}</h3>
                <p className="text-sm text-muted-foreground">{o.desc}</p>
              </div>
            )
          })}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/15 to-violet-500/10 border border-primary/20 flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">+ Tutor Chat</h3>
            <p className="text-sm text-muted-foreground mb-4">Ask anything about your material</p>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-primary text-primary-foreground w-fit">
                Try it free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-serif font-bold text-foreground mb-4">
          Ready to transform your study routine?
        </h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Join students who study smarter with AI
        </p>
        <Link href="/auth/signup">
          <Button size="lg" className="h-12 px-10 bg-gradient-to-r from-violet-500 to-primary text-white font-semibold">
            Get Started — It&apos;s Free <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </section>

      <footer className="border-t border-border/20 py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 StudyAI. Built for students who want to learn smarter.</p>
      </footer>
    </main>
  )
}
