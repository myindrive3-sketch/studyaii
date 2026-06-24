'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Menu, X, LogOut } from 'lucide-react'
import { APP_ROUTES } from '@/lib/constants'
import { authClient } from '@/lib/auth-client'

export function DashboardNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      window.location.href = APP_ROUTES.AUTH_LOGIN
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="border-b border-border/60 bg-card/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between">
          <Link href={APP_ROUTES.DASHBOARD} className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-serif font-bold text-foreground hidden sm:inline">StudyAI</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href={APP_ROUTES.DASHBOARD} className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
              Dashboard
            </Link>
            <Link href={APP_ROUTES.STUDY_HUB} className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
              Study Hub
            </Link>
            <Link href={APP_ROUTES.PROFILE} className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
              Profile
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-card rounded-lg transition-colors text-foreground"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-border pt-4 animate-slideDown">
            <Link
              href={APP_ROUTES.DASHBOARD}
              className="block px-4 py-2 text-foreground hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href={APP_ROUTES.PROFILE}
              className="block px-4 py-2 text-foreground hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              Profile
            </Link>
            <Button
              onClick={handleLogout}
              className="w-full bg-primary/15 text-primary hover:bg-primary/25 border border-primary/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
