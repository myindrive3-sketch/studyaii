'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Mail, Lock, User, Loader2, CheckCircle } from 'lucide-react'
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button'
import { isValidEmail, isValidPassword } from '@/lib/utils'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateForm = () => {
    if (!name.trim()) {
      setError('Please enter your name')
      return false
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email')
      return false
    }
    if (!isValidPassword(password)) {
      setError('Password must be at least 8 characters with uppercase and number')
      return false
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/sign-up/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || data.error || 'Signup failed')
      }

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="animate-slideUp space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-display font-bold text-foreground">Create your account</h1>
        <p className="text-muted-foreground text-sm">Join students learning smarter with AI</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="e.g. Ali Khan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="e.g. student@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <CheckCircle className={cn('w-3 h-3 mr-1', password.length >= 8 ? 'text-green-500' : 'text-muted-foreground')} />
            At least 8 characters
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-950 border border-red-800 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className={cn(
            'w-full bg-gradient-to-r from-violet-500 to-primary text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">Or sign up with</span>
        </div>
      </div>

      <GoogleSignInButton label="Sign up with Google" onError={setError} />

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link href="/auth/login" className="text-primary hover:text-violet-300 font-semibold transition-colors">
          Sign in
        </Link>
      </div>
    </div>
  )
}
