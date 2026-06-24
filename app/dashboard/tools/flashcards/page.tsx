'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  BookOpen,
  Plus,
  Trash2,
  Play,
  Sparkles,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
  Shuffle,
} from 'lucide-react'
import { tryParseStudyJson } from '@/lib/export-study'
import { cn } from '@/lib/utils'

interface Flashcard {
  question: string
  answer: string
}

interface Deck {
  id: string
  title: string
  cards: Flashcard[]
  createdAt: string
}

const STORAGE_KEY = 'studyai-flashcard-decks'

function loadDecks(): Deck[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveDecks(decks: Deck[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks))
}

export default function FlashcardsPage() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [topic, setTopic] = useState('')
  const [content, setContent] = useState('')
  const [cardCount, setCardCount] = useState(15)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [studying, setStudying] = useState<Deck | null>(null)

  useEffect(() => {
    setDecks(loadDecks())
  }, [])

  const persist = useCallback((next: Deck[]) => {
    setDecks(next)
    saveDecks(next)
  }, [])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return

    setError(null)
    setIsGenerating(true)

    try {
      const res = await fetch('/api/tools/flashcards/generate', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          content: content.trim() || undefined,
          cardCount,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')

      const parsed = tryParseStudyJson(data.result)
      if (!parsed?.cards?.length) {
        throw new Error('AI returned invalid flashcard data. Try again.')
      }

      const deck: Deck = {
        id: crypto.randomUUID(),
        title: parsed.title || topic.trim(),
        cards: parsed.cards,
        createdAt: new Date().toLocaleDateString(),
      }

      persist([deck, ...decks])
      setTopic('')
      setContent('')
      setShowCreate(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this deck?')) {
      persist(decks.filter((d) => d.id !== id))
    }
  }

  if (studying) {
    return (
      <StudyMode
        deck={studying}
        onClose={() => setStudying(null)}
      />
    )
  }

  return (
    <div className="animate-fadeIn space-y-8 max-w-5xl">
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/80 to-violet-500/5 p-8">
        <div className="absolute top-0 right-0 w-56 h-56 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              Flashcards
            </h1>
            <p className="text-muted-foreground mt-1">
              AI generates decks from any topic — then study with flip cards
            </p>
          </div>
        </div>
      </div>

      {showCreate ? (
        <div className="glass-card rounded-2xl p-6 space-y-5 animate-slideUp">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-semibold text-foreground">
              Generate with AI
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setShowCreate(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g. Photosynthesis, Spanish verbs, World War 2"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-background border-border"
                autoFocus
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Source text (optional)</Label>
              <textarea
                id="content"
                placeholder="Paste notes or textbook content for more accurate cards..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-28 p-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">Number of cards ({cardCount})</Label>
              <input
                id="count"
                type="range"
                min={5}
                max={30}
                value={cardCount}
                onChange={(e) => setCardCount(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isGenerating || !topic.trim()}
                className="bg-gradient-to-r from-violet-500 to-primary text-white hover:shadow-lg hover:shadow-primary/25"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Deck
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Button
          onClick={() => setShowCreate(true)}
          className="bg-gradient-to-r from-violet-500 to-primary text-white hover:shadow-lg hover:shadow-primary/25"
        >
          <Plus className="w-4 h-4 mr-2" />
          New AI Deck
        </Button>
      )}

      {decks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="glass-card rounded-2xl p-5 hover:border-primary/30 transition-all group"
            >
              <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {deck.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {deck.cards.length} cards · {deck.createdAt}
              </p>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  className="flex-1 bg-primary/15 text-primary hover:bg-primary/25 border border-primary/20"
                  onClick={() => setStudying(deck)}
                >
                  <Play className="w-3 h-3 mr-1" />
                  Study
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-border/60 text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(deck.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showCreate && (
          <div className="glass-card rounded-2xl p-12 text-center">
            <BookOpen className="w-12 h-12 text-primary/50 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No decks yet. Generate your first AI deck!</p>
            <Button
              onClick={() => setShowCreate(true)}
              className="bg-gradient-to-r from-violet-500 to-primary text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create with AI
            </Button>
          </div>
        )
      )}
    </div>
  )
}

function StudyMode({ deck, onClose }: { deck: Deck; onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [cards, setCards] = useState(deck.cards)
  const [known, setKnown] = useState<Set<number>>(new Set())

  const card = cards[index]
  const progress = `${index + 1} / ${cards.length}`

  const next = () => {
    setFlipped(false)
    setIndex((i) => (i + 1) % cards.length)
  }

  const prev = () => {
    setFlipped(false)
    setIndex((i) => (i - 1 + cards.length) % cards.length)
  }

  const shuffle = () => {
    setFlipped(false)
    setCards((c) => [...c].sort(() => Math.random() - 0.5))
    setIndex(0)
    setKnown(new Set())
  }

  const markKnown = () => {
    setKnown((k) => new Set(k).add(index))
    next()
  }

  return (
    <div className="animate-fadeIn space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-semibold text-foreground">{deck.title}</h2>
          <p className="text-sm text-muted-foreground">{progress} · {known.size} mastered</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={shuffle} className="border-border/60">
            <Shuffle className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={onClose} className="border-border/60">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="w-full min-h-[280px] glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/40 transition-all perspective"
      >
        <p className="text-xs uppercase tracking-widest text-primary mb-4">
          {flipped ? 'Answer' : 'Question'}
        </p>
        <p className={cn(
          'text-lg md:text-xl leading-relaxed',
          flipped ? 'text-primary font-medium' : 'text-foreground font-semibold'
        )}>
          {flipped ? card.answer : card.question}
        </p>
        <p className="text-xs text-muted-foreground mt-6">Tap to flip</p>
      </button>

      <div className="flex gap-2">
        <Button variant="outline" onClick={prev} className="border-border/60">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          onClick={() => setFlipped((f) => !f)}
          className="flex-1 border-border/60"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Flip
        </Button>
        <Button
          onClick={markKnown}
          className="flex-1 bg-gradient-to-r from-violet-500 to-primary text-white"
        >
          Got it
        </Button>
        <Button variant="outline" onClick={next} className="border-border/60">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

