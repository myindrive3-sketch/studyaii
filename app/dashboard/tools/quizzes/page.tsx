'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Brain, Plus, Trash2, PlayCircle, BarChart3 } from 'lucide-react'

interface Quiz {
  id: string
  title: string
  questions: number
  attempts: number
  lastScore?: number
  createdAt: string
}

export const dynamic = 'force-dynamic'

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [quizTitle, setQuizTitle] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quizTitle.trim()) return

    setIsCreating(true)
    try {
      const newQuiz: Quiz = {
        id: Date.now().toString(),
        title: quizTitle,
        questions: 0,
        attempts: 0,
        createdAt: new Date().toLocaleDateString(),
      }
      setQuizzes((prev) => [newQuiz, ...prev])
      setQuizTitle('')
      setShowCreateForm(false)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteQuiz = (id: string) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes((prev) => prev.filter((q) => q.id !== id))
    }
  }

  return (
    <div className="animate-slideUp space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Brain className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Quizzes</h1>
            <p className="text-muted-foreground">Generate quizzes from any text or topic</p>
          </div>
        </div>
      </div>

      {/* Create Quiz Form */}
      {showCreateForm && (
        <div className="p-6 bg-card border border-border rounded-lg space-y-4 animate-slideUp">
          <h3 className="text-lg font-semibold text-foreground">Generate New Quiz</h3>
          <form onSubmit={handleCreateQuiz} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quizTitle" className="text-foreground">Quiz Topic</Label>
              <Input
                id="quizTitle"
                type="text"
                placeholder="e.g., Biology Chapter 5 - Photosynthesis"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                className="bg-slate-900 border-border text-foreground"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isCreating || !quizTitle.trim()}
                className="bg-accent hover:bg-amber-600 text-accent-foreground"
              >
                {isCreating ? 'Generating...' : 'Generate Quiz'}
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

      {/* Quizzes Grid */}
      {quizzes.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">Your Quizzes</h2>
            {!showCreateForm && (
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-accent hover:bg-amber-600 text-accent-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Quiz
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-4 bg-card border border-border rounded-lg hover:border-accent transition-colors group"
              >
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                    {quiz.title}
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Questions: {quiz.questions}</p>
                    <p>Attempts: {quiz.attempts}</p>
                    {quiz.lastScore && <p className="text-accent">Last Score: {quiz.lastScore}%</p>}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-accent hover:bg-amber-600 text-accent-foreground text-xs"
                    >
                      <PlayCircle className="w-3 h-3 mr-1" />
                      Take Quiz
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border hover:bg-slate-700/50"
                    >
                      <BarChart3 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border hover:bg-red-950/50 text-red-400"
                      onClick={() => handleDeleteQuiz(quiz.id)}
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
                  <p className="font-semibold text-foreground">Generate Quiz</p>
                  <p className="text-xs text-muted-foreground">Test your knowledge</p>
                </div>
              </Button>
            </div>
          )}

          {!showCreateForm && (
            <div className="p-6 bg-card border border-border rounded-lg text-center space-y-4">
              <p className="text-muted-foreground">No quizzes yet. Generate one to get started!</p>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-accent hover:bg-amber-600 text-accent-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate First Quiz
              </Button>
            </div>
          )}
        </>
      )}

      {/* Tips */}
      <div className="p-4 bg-card border border-border rounded-lg space-y-3">
        <h3 className="font-semibold text-foreground">Quiz Tips:</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>Take quizzes to test your understanding of topics</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>Review explanations for questions you miss</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>Retake quizzes to track your improvement over time</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
