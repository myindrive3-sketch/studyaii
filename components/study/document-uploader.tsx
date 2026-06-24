'use client'

import { useCallback, useState } from 'react'
import {
  Upload,
  FileText,
  Loader2,
  Sparkles,
  X,
  ClipboardPaste,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DocumentUploaderProps {
  onDocumentReady: (data: {
    text: string
    fileName: string
    wordCount: number
  }) => void
  disabled?: boolean
}

export function DocumentUploader({
  onDocumentReady,
  disabled,
}: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pasteMode, setPasteMode] = useState(false)
  const [pasteText, setPasteText] = useState('')

  const processFile = useCallback(
    async (file: File) => {
      setError(null)
      setIsUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/study/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Upload failed')
        onDocumentReady({
          text: data.text,
          fileName: data.fileName,
          wordCount: data.wordCount,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
      } finally {
        setIsUploading(false)
      }
    },
    [onDocumentReady]
  )

  const handlePasteSubmit = () => {
    if (!pasteText.trim()) return
    onDocumentReady({
      text: pasteText.trim(),
      fileName: 'Pasted text',
      wordCount: pasteText.trim().split(/\s+/).filter(Boolean).length,
    })
    setPasteMode(false)
    setPasteText('')
  }

  return (
    <div className="space-y-4">
      {!pasteMode ? (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            const file = e.dataTransfer.files[0]
            if (file) processFile(file)
          }}
          className={cn(
            'relative rounded-2xl border-2 border-dashed p-10 text-center transition-all glow-border',
            isDragging
              ? 'border-primary bg-primary/10 scale-[1.01] shadow-lg shadow-primary/10'
              : 'border-border/50 glass-card hover:border-primary/40 hover:bg-card/70',
            disabled && 'opacity-50 pointer-events-none'
          )}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx,.pptx,.txt,.md,.markdown"
            className="absolute inset-0 cursor-pointer opacity-0"
            disabled={disabled || isUploading}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) processFile(file)
            }}
          />

          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-primary" />
              )}
            </div>
            <div className="space-y-2">
              <p className="text-lg font-display font-semibold text-foreground">
                {isUploading ? 'Reading your document...' : 'Drop your lecture here'}
              </p>
              <p className="text-sm text-muted-foreground">
                PDF, DOCX, PPTX, TXT, or MD — up to 10MB
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>Lecture notes • Slides • Textbooks • Articles</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-foreground">Paste your text</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPasteMode(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste lecture notes, article text, or study material..."
            className="w-full h-48 p-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button
            onClick={handlePasteSubmit}
            disabled={!pasteText.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Use this text
          </Button>
        </div>
      )}

      {!pasteMode && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setPasteMode(true)}
            disabled={disabled || isUploading}
            className="border-border/60"
          >
            <ClipboardPaste className="w-4 h-4 mr-2" />
            Or paste text instead
          </Button>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
