'use client'

import { useState } from 'react'
import { Sparkles, FileCheck, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DocumentUploader } from '@/components/study/document-uploader'
import { OutputSelector } from '@/components/study/output-selector'
import { StudyResult } from '@/components/study/study-result'
import { type StudyOutputType } from '@/lib/study-types'

export default function StudyHubPage() {
  const [document, setDocument] = useState<{
    text: string
    fileName: string
    wordCount: number
  } | null>(null)
  const [selectedType, setSelectedType] = useState<StudyOutputType | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generated, setGenerated] = useState<{
    type: StudyOutputType
    result: string
  } | null>(null)

  const handleGenerate = async () => {
    if (!document || !selectedType) return
    setError(null)
    setIsGenerating(true)
    setGenerated(null)

    try {
      const res = await fetch('/api/study/generate', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: document.text,
          type: selectedType,
          fileName: document.fileName,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setGenerated({ type: data.type, result: data.result })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setIsGenerating(false)
    }
  }

  const reset = () => {
    setDocument(null)
    setSelectedType(null)
    setGenerated(null)
    setError(null)
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/80 to-violet-500/5 p-8 md:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-0" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Study Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
            Transform lectures into{' '}
            <span className="bg-gradient-to-r from-violet-400 via-primary to-violet-300 bg-clip-text text-transparent">
              smart study materials
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Upload your PDF, Word doc, PowerPoint, or notes — get notes, quizzes, slides, infographics, and flashcards in seconds.
          </p>
        </div>
      </div>

      {!document ? (
        <DocumentUploader onDocumentReady={setDocument} />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-card/60 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/15 flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{document.fileName}</p>
                <p className="text-sm text-muted-foreground">
                  {document.wordCount.toLocaleString()} words ready
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={reset} className="border-border/60">
              <RotateCcw className="w-4 h-4 mr-2" />
              Upload different file
            </Button>
          </div>

          <OutputSelector
            selected={selectedType}
            onSelect={setSelectedType}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />

          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              {error}
            </div>
          )}

          {generated && document && (
            <StudyResult
              type={generated.type}
              result={generated.result}
              fileName={document.fileName}
            />
          )}
        </div>
      )}
    </div>
  )
}
