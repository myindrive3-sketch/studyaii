'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileText, Plus, Trash2, Download, Zap } from 'lucide-react'

interface Summary {
  id: string
  title: string
  originalLength: number
  summaryLength: number
  summaryType: 'short' | 'medium' | 'long'
  createdAt: string
}

export const dynamic = 'force-dynamic'

export default function SummariesPage() {
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [summaryType, setSummaryType] = useState<'short' | 'medium' | 'long'>('medium')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateSummary = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!textInput.trim()) return

    setIsGenerating(true)
    try {
      const newSummary: Summary = {
        id: Date.now().toString(),
        title: textInput.substring(0, 50) + (textInput.length > 50 ? '...' : ''),
        originalLength: textInput.length,
        summaryLength: Math.floor(textInput.length * (summaryType === 'short' ? 0.2 : summaryType === 'medium' ? 0.4 : 0.6)),
        summaryType,
        createdAt: new Date().toLocaleDateString(),
      }
      setSummaries((prev) => [newSummary, ...prev])
      setTextInput('')
      setShowCreateForm(false)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDeleteSummary = (id: string) => {
    if (confirm('Are you sure you want to delete this summary?')) {
      setSummaries((prev) => prev.filter((s) => s.id !== id))
    }
  }

  return (
    <div className="animate-slideUp space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <FileText className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Summaries</h1>
            <p className="text-muted-foreground">Summarize long texts quickly and accurately</p>
          </div>
        </div>
      </div>

      {/* Create Summary Form */}
      {showCreateForm && (
        <div className="p-6 bg-card border border-border rounded-lg space-y-4 animate-slideUp">
          <h3 className="text-lg font-semibold text-foreground">Generate New Summary</h3>
          <form onSubmit={handleGenerateSummary} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text" className="text-foreground">Text to Summarize</Label>
              <textarea
                id="text"
                placeholder="Paste your text here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full h-32 p-3 bg-slate-900 border border-border text-foreground rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-foreground">Summary Length</Label>
              <select
                id="type"
                value={summaryType}
                onChange={(e) => setSummaryType(e.target.value as 'short' | 'medium' | 'long')}
                className="w-full p-2 bg-slate-900 border border-border text-foreground rounded-lg"
              >
                <option value="short">Short (20% of original)</option>
                <option value="medium">Medium (40% of original)</option>
                <option value="long">Long (60% of original)</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isGenerating || !textInput.trim()}
                className="bg-accent hover:bg-amber-600 text-accent-foreground"
              >
                {isGenerating ? 'Summarizing...' : 'Generate Summary'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateForm(false)}
                className="border-border text-foreground"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Summaries Grid */}
      {summaries.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">Your Summaries</h2>
            {!showCreateForm && (
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-accent hover:bg-amber-600 text-accent-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Summary
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summaries.map((summary) => (
              <div
                key={summary.id}
                className="p-4 bg-card border border-border rounded-lg hover:border-accent transition-colors group"
              >
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2 text-sm">
                    {summary.title}
                  </h3>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Original: {summary.originalLength} chars</p>
                    <p>Summary: {summary.summaryLength} chars</p>
                    <p className="capitalize">Type: {summary.summaryType}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-accent hover:bg-amber-600 text-accent-foreground text-xs"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border hover:bg-slate-700/50"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border hover:bg-red-950/50 text-red-400"
                      onClick={() => handleDeleteSummary(summary.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {!showCreateForm && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Button
                onClick={() => setShowCreateForm(true)}
                className="h-auto p-6 bg-card border-2 border-dashed border-border hover:border-accent transition-colors flex flex-col items-center justify-center gap-3 text-center"
              >
                <Plus className="w-8 h-8 text-accent" />
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Create Summary</p>
                  <p className="text-xs text-muted-foreground">Summarize text</p>
                </div>
              </Button>
            </div>
          )}

          {!showCreateForm && (
            <div className="p-6 bg-card border border-border rounded-lg text-center space-y-4">
              <p className="text-muted-foreground">No summaries yet. Create one to get started!</p>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-accent hover:bg-amber-600 text-accent-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Summary
              </Button>
            </div>
          )}
        </>
      )}

      {/* Tips */}
      <div className="p-4 bg-card border border-border rounded-lg space-y-3">
        <h3 className="font-semibold text-foreground">Summary Tips:</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>Use short summaries for quick overviews</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>Choose medium for balanced summaries</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>Use long summaries to retain more detail</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
