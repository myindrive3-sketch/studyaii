'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageCircle, Send, Loader2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function TutorChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/tools/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to get response')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      let assistantMessage = ''
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantMessage += decoder.decode(value, { stream: true })
      }

      assistantMessage += decoder.decode()

      if (assistantMessage) {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: assistantMessage,
        }
        setMessages((prev) => [...prev, responseMessage])
      } else {
        throw new Error('AI returned an empty response')
      }
    } catch (error) {
      console.error('[tutor] Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          error instanceof Error
            ? error.message
            : 'Sorry, I encountered an error. Please try again.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    setMessages([])
  }

  return (
    <div className="animate-slideUp space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Tutor Chat</h1>
            <p className="text-muted-foreground">Get instant help from your AI tutor</p>
          </div>
        </div>
      </div>

      <div className="h-96 md:h-[600px] flex flex-col bg-card border border-border rounded-lg overflow-hidden">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-accent" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Start a conversation</h3>
                <p className="text-muted-foreground max-w-xs">
                  Ask me anything about your studies. I&apos;m here to help you learn!
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'animate-slideUp flex gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-xs md:max-w-2xl px-4 py-3 rounded-lg',
                    message.role === 'user'
                      ? 'bg-accent text-accent-foreground rounded-br-none'
                      : 'bg-slate-700 text-foreground rounded-bl-none'
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-3 animate-slideUp">
              <div className="bg-slate-700 text-foreground max-w-xs md:max-w-2xl px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border bg-slate-900/50">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="bg-card border-border text-foreground placeholder:text-muted-foreground"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || input.trim() === ''}
              className="bg-accent hover:bg-amber-600 text-accent-foreground"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
            {messages.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleClearChat}
                className="border-border hover:bg-slate-700/50"
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </form>
        </div>
      </div>

      <div className="p-4 bg-card border border-border rounded-lg space-y-3">
        <h3 className="font-semibold text-foreground">Tips for better results:</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>Ask specific questions to get more targeted answers</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>Provide context about what you&apos;re studying</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>Follow up with &quot;why&quot; or &quot;explain&quot; for deeper understanding</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
