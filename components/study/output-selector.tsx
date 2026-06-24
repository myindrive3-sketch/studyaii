'use client'

import {
  BookOpen,
  Brain,
  BarChart3,
  FileText,
  Presentation,
  Loader2,
} from 'lucide-react'
import { STUDY_OUTPUTS, type StudyOutputType } from '@/lib/study-types'
import { cn } from '@/lib/utils'

const ICONS = {
  FileText,
  Brain,
  Presentation,
  BarChart3,
  BookOpen,
}

interface OutputSelectorProps {
  selected: StudyOutputType | null
  onSelect: (type: StudyOutputType) => void
  onGenerate: () => void
  isGenerating: boolean
  disabled?: boolean
}

export function OutputSelector({
  selected,
  onSelect,
  onGenerate,
  isGenerating,
  disabled,
}: OutputSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-display font-semibold text-foreground mb-1">
          What do you want to create?
        </h3>
        <p className="text-sm text-muted-foreground">
          Pick one — AI will build it from your document
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {STUDY_OUTPUTS.map((output) => {
          const Icon = ICONS[output.icon as keyof typeof ICONS]
          const isSelected = selected === output.id
          return (
            <button
              key={output.id}
              type="button"
              disabled={disabled || isGenerating}
              onClick={() => onSelect(output.id)}
              className={cn(
                'text-left p-4 rounded-xl border transition-all',
                isSelected
                  ? 'border-primary bg-primary/15 shadow-lg shadow-primary/10'
                  : 'border-border/50 bg-card/40 hover:border-primary/40 hover:bg-card/70',
                (disabled || isGenerating) && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                    isSelected ? 'bg-primary/25' : 'bg-primary/10'
                  )}
                >
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{output.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {output.description}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={!selected || isGenerating || disabled}
        className={cn(
          'w-full py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2',
          selected && !isGenerating
            ? 'bg-gradient-to-r from-violet-500 to-primary text-white hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.01]'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        )}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating with AI...
          </>
        ) : (
          <>
            <SparklesIcon />
            Generate {selected ? STUDY_OUTPUTS.find((o) => o.id === selected)?.name : 'Content'}
          </>
        )}
      </button>
    </div>
  )
}

function SparklesIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}
