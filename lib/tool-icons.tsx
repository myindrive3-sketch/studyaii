import {
  Sparkles,
  MessageCircle,
  BookOpen,
  Brain,
  FileText,
  Presentation,
  type LucideIcon,
} from 'lucide-react'

export const TOOL_ICONS: Record<string, LucideIcon> = {
  Sparkles,
  MessageCircle,
  BookOpen,
  Brain,
  FileText,
  Presentation,
}

export function getToolIcon(name: string): LucideIcon {
  return TOOL_ICONS[name] ?? Sparkles
}
