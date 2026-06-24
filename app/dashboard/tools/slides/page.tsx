'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Presentation, Plus, Trash2, Eye, Download } from 'lucide-react'

interface Presentation {
  id: string
  title: string
  slideCount: number
  topic: string
  createdAt: string
}

export const dynamic = 'force-dynamic'

export default function SlidesPage() {
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [topic, setTopic] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateSlides = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return

    setIsGenerating(true)
    try {
      const newPresentation: Presentation = {
        id: Date.now().toString(),
        title: `Presentation: ${topic}`,
        slideCount: Math.floor(Math.random() * 8) + 5,
        topic,
        createdAt: new Date().toLocaleDateString(),
      }
      setPresentations((prev) => [newPresentation, ...prev])
      setTopic('')
      setShowCreateForm(false)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDeletePresentation = (id: string) => {
    if (confirm('Are you sure you want to delete this presentation?')) {
      setPresentations((prev) => prev.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="animate-slideUp space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <Presentation className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Presentations</h1>
            <p className="text-muted-foreground">Generate professional slides instantly</p>
          </div>
        </div>
      </div>

      {/* Create Presentation Form */}
      {showCreateForm && (
        <div className="p-6 bg-card border border-border rounded-lg space-y-4 animate-slideUp">
          <h3 className="text-lg font-semibold text-foreground">Generate New Presentation</h3>
          <form onSubmit={handleGenerateSlides} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-foreground">Presentation Topic</Label>
              <Input
                id="topic"
                type="text"
                placeholder="e.g., Introduction to Machine Learning"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-slate-900 border-border text-foreground"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isGenerating || !topic.trim()}
                className="bg-accent hover:bg-amber-600 text-accent-foreground"
              >
                {isGenerating ? 'Generating...' : 'Generate Presentation'}
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

      {/* Presentations Grid */}
      {presentations.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">Your Presentations</h2>
            {!showCreateForm && (
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-accent hover:bg-amber-600 text-accent-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Presentation
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {presentations.map((presentation) => (
              <div
                key={presentation.id}
                className="p-4 bg-card border border-border rounded-lg hover:border-accent transition-colors group"
              >
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                    {presentation.title}
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Slides: {presentation.slideCount}</p>
                    <p>Topic: {presentation.topic}</p>
                    <p>Created: {presentation.createdAt}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-accent hover:bg-amber-600 text-accent-foreground text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
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
                      onClick={() => handleDeletePresentation(presentation.id)}
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
                  <p className="font-semibold text-foreground">Generate Slides</p>
                  <p className="text-xs text-muted-foreground">Create presentation</p>
                </div>
              </Button>
            </div>
          )}

          {!showCreateForm && (
            <div className="p-6 bg-card border border-border rounded-lg text-center space-y-4">
              <p className="text-muted-foreground">No presentations yet. Generate one to get started!</p>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-accent hover:bg-amber-600 text-accent-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Presentation
              </Button>
            </div>
          )}
        </>
      )}

      {/* Tips */}
      <div className="p-4 bg-card border border-border rounded-lg space-y-3">
        <h3 className="font-semibold text-foreground">Presentation Tips:</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>AI generates 5-12 slides per presentation</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>Each slide includes key points and visual suggestions</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>Download as PDF to share or present offline</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
