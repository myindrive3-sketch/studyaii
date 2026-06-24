import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AI_TOOLS, APP_ROUTES } from '@/lib/constants'
import { getToolIcon } from '@/lib/tool-icons'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/60 to-violet-500/5 p-8 md:p-10">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-0" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Your workspace
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Pick an AI tool and start your learning journey today
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Conversations', value: '0', icon: '💬', color: 'from-blue-500/20 to-blue-500/5' },
          { label: 'Decks Created', value: '0', icon: '📚', color: 'from-purple-500/20 to-purple-500/5' },
          { label: 'Quizzes Done', value: '0', icon: '✅', color: 'from-green-500/20 to-green-500/5' },
          { label: 'Summaries Made', value: '0', icon: '📄', color: 'from-orange-500/20 to-orange-500/5' },
        ].map((stat, i) => (
          <div
            key={i}
            className={`relative p-6 rounded-2xl border border-border/40 glass-card group hover:border-primary/40 transition-all overflow-hidden`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color}`}></div>
            <div className="relative flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
              <span className="text-4xl group-hover:scale-125 transition-transform duration-300">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-serif font-bold text-foreground">Start here</h2>
          <p className="text-muted-foreground">Upload a document and let AI do the rest</p>
        </div>

        <Link href={APP_ROUTES.STUDY_HUB}>
          <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-primary/15 via-violet-500/10 to-transparent border border-primary/25 hover:border-primary/50 transition-all cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-primary text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  Study Hub
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground">
                  Upload → Notes, Quiz, Slides & more
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Drop your PDF or lecture notes and generate everything you need to study
                </p>
              </div>
              <div className="flex items-center text-primary font-semibold group-hover:translate-x-1 transition-transform shrink-0">
                Open Study Hub <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-serif font-bold text-foreground">More Tools</h2>
          <p className="text-muted-foreground">Individual AI learning tools</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AI_TOOLS.filter((t) => t.id !== 'study').map((tool, index) => {
            const Icon = getToolIcon(tool.icon)
            return (
              <Link key={tool.id} href={tool.route}>
                <div
                  className="group relative animate-slideUp"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="relative p-7 glass-card rounded-2xl hover:border-primary/40 transition-all cursor-pointer h-full flex flex-col justify-between group/card">
                    <div className="space-y-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/25 to-violet-500/10 flex items-center justify-center group-hover/card:from-primary/35 group-hover/card:to-violet-500/20 transition-all duration-300">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-display font-semibold text-foreground group-hover/card:text-primary transition-colors duration-300">
                          {tool.name}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center text-primary text-sm font-semibold group-hover/card:translate-x-2 transition-transform duration-300">
                      Explore Tool
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="relative p-8 glass-card rounded-2xl space-y-6">
        <h3 className="text-2xl font-display font-semibold text-foreground flex items-center gap-2">
          <span className="text-xl">🚀</span>
          Getting Started
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { tool: 'Study Hub', desc: 'Upload docs → notes, quiz, slides & more' },
            { tool: 'Tutor Chat', desc: 'Get instant answers to your questions' },
            { tool: 'Flashcards', desc: 'Memorize with spaced repetition' },
            { tool: 'Quizzes', desc: 'Test your knowledge effectively' },
            { tool: 'Summaries', desc: 'Distill long content quickly' },
          ].map((item, i) => (
            <li key={i} className="flex gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors">
              <span className="text-primary font-bold flex-shrink-0">✓</span>
              <div>
                <span className="font-semibold text-foreground">{item.tool}</span>
                <span className="text-muted-foreground ml-2">— {item.desc}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
