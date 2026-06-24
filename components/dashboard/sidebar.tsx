'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AI_TOOLS, APP_ROUTES } from '@/lib/constants'
import { getToolIcon } from '@/lib/tool-icons'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Sparkles } from 'lucide-react'

export function DashboardSidebar() {
  const pathname = usePathname()

  const isActive = (route: string) => {
    return pathname === route || pathname.startsWith(route + '/')
  }

  const studyHub = AI_TOOLS.find((t) => t.id === 'study')
  const otherTools = AI_TOOLS.filter((t) => t.id !== 'study')

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-card/80 backdrop-blur-xl border-r border-border/60">
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <Link href={APP_ROUTES.DASHBOARD}>
          <div
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm',
              isActive(APP_ROUTES.DASHBOARD) && pathname === APP_ROUTES.DASHBOARD
                ? 'bg-primary/15 text-primary border border-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
            )}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-display">Dashboard</span>
          </div>
        </Link>

        {studyHub && (
          <Link href={studyHub.route}>
            <div
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm mt-2',
                isActive(studyHub.route)
                  ? 'bg-gradient-to-r from-primary/25 to-violet-500/15 text-primary border border-primary/25 shadow-sm shadow-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40 border border-transparent'
              )}
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-display font-semibold">{studyHub.name}</span>
            </div>
          </Link>
        )}

        <div className="py-3">
          <p className="px-4 text-[10px] font-display font-semibold text-muted-foreground uppercase tracking-[0.15em]">
            More Tools
          </p>
        </div>

        {otherTools.map((tool) => {
          const Icon = getToolIcon(tool.icon)
          return (
            <Link key={tool.id} href={tool.route}>
              <div
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm',
                  isActive(tool.route)
                    ? 'bg-primary/15 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{tool.name}</span>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t border-border/60">
        <div className="px-4 py-3 glass-card rounded-xl">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-primary">Tip:</span> Upload PDF, DOCX, or PPTX in Study Hub to generate everything at once
          </p>
        </div>
      </div>
    </aside>
  )
}
