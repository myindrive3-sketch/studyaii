'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, LogOut } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

export default function ProfilePage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      if (data?.user) {
        setName(data.user.name || '')
        setEmail(data.user.email || '')
      }
      setIsLoading(false)
    })
  }, [])

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      window.location.href = '/auth/login'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="animate-slideUp max-w-2xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-serif font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="space-y-6 p-6 bg-card border border-border rounded-lg">
        <h2 className="text-lg font-semibold text-foreground">Account Information</h2>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              className="pl-10"
              disabled
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              className="pl-10"
              disabled
            />
          </div>
        </div>

        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        )}

        <Button className="bg-accent hover:bg-amber-600 text-accent-foreground" disabled>
          Update Profile
        </Button>
      </div>

      <div className="space-y-6 p-6 bg-card border border-border rounded-lg">
        <h2 className="text-lg font-semibold text-foreground">Learning Statistics</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Chat Messages', value: '0' },
            { label: 'Flashcards', value: '0' },
            { label: 'Quizzes Taken', value: '0' },
            { label: 'Summaries', value: '0' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-3 bg-slate-800 rounded-lg">
              <p className="text-2xl font-bold text-accent">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6 p-6 bg-red-950/20 border border-red-900/50 rounded-lg">
        <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
        <p className="text-sm text-muted-foreground">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button
          variant="outline"
          className="border-red-900 text-red-400 hover:bg-red-950/50"
          disabled
        >
          Delete Account
        </Button>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleLogout}
          className="bg-accent hover:bg-amber-600 text-accent-foreground"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}
