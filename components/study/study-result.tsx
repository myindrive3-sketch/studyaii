'use client'

import { type StudyOutputType } from '@/lib/study-types'
import { tryParseStudyJson } from '@/lib/export-study'
import { ExportButtons } from '@/components/study/export-buttons'

interface StudyResultProps {
  type: StudyOutputType
  result: string
  fileName: string
}

export function StudyResult({ type, result, fileName }: StudyResultProps) {
  const data = type !== 'notes' ? tryParseStudyJson(result) : null

  return (
    <div className="rounded-2xl glass-card glow-border overflow-hidden animate-slideUp">
      <div className="px-6 py-4 border-b border-border/50 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Generated from {fileName}
          </p>
          <h3 className="text-xl font-serif font-semibold text-foreground capitalize mt-1">
            {type === 'notes' ? 'Smart Notes' : type}
          </h3>
        </div>
        <ExportButtons type={type} result={result} fileName={fileName} />
      </div>

      <div className="p-6 max-h-[600px] overflow-y-auto">
        {type === 'notes' && (
          <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-foreground/90 leading-relaxed">
            {result}
          </div>
        )}

        {type === 'quiz' && data?.questions && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">{data.title}</h4>
            {data.questions.map((q: { question: string; options: string[]; correctIndex: number; explanation: string }, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-background/50 border border-border/40 space-y-3">
                <p className="font-medium text-foreground">
                  {i + 1}. {q.question}
                </p>
                <ul className="space-y-1.5">
                  {q.options.map((opt: string, j: number) => (
                    <li
                      key={j}
                      className={`text-sm px-3 py-2 rounded-lg ${
                        j === q.correctIndex
                          ? 'bg-green-500/15 text-green-300 border border-green-500/30'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {String.fromCharCode(65 + j)}. {opt}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground italic">{q.explanation}</p>
              </div>
            ))}
          </div>
        )}

        {type === 'slides' && data?.slides && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">{data.title}</h4>
            {data.slides.map((slide: { title: string; bullets: string[]; speakerNotes?: string }, i: number) => (
              <div key={i} className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-border/40">
                <p className="text-xs text-primary font-medium mb-2">Slide {i + 1}</p>
                <h5 className="font-semibold text-foreground text-lg mb-3">{slide.title}</h5>
                <ul className="space-y-1.5">
                  {slide.bullets.map((b: string, j: number) => (
                    <li key={j} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary">•</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {type === 'infographic' && data?.sections && (
          <div className="space-y-6">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-violet-500/20 via-primary/10 to-blue-500/10 border border-primary/20">
              <h4 className="text-2xl font-serif font-bold text-foreground">{data.title}</h4>
              {data.tagline && (
                <p className="text-muted-foreground mt-2">{data.tagline}</p>
              )}
            </div>
            {data.keyStats && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {data.keyStats.map((stat: string, i: number) => (
                  <div key={i} className="p-4 rounded-xl bg-primary/10 text-center border border-primary/20">
                    <p className="text-sm font-semibold text-primary">{stat}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.sections.map((section: { heading: string; points: string[]; stat?: string }, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-background/50 border border-border/40">
                  <h5 className="font-semibold text-foreground mb-2">{section.heading}</h5>
                  {section.stat && (
                    <p className="text-primary text-sm font-medium mb-2">{section.stat}</p>
                  )}
                  <ul className="space-y-1">
                    {section.points.map((p: string, j: number) => (
                      <li key={j} className="text-sm text-muted-foreground">• {p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {type === 'flashcards' && data?.cards && (
          <div className="space-y-3">
            <h4 className="text-lg font-semibold mb-4">{data.title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.cards.map((card: { question: string; answer: string }, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-background/50 border border-border/40 hover:border-primary/40 transition-colors">
                  <p className="text-sm font-medium text-foreground mb-2">{card.question}</p>
                  <p className="text-xs text-primary">{card.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {type !== 'notes' && !data && (
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap">{result}</pre>
        )}
      </div>
    </div>
  )
}
