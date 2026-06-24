'use client'

import { useState } from 'react'
import { Download, FileText, FileType, Presentation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type StudyOutputType } from '@/lib/study-types'
import {
  downloadPdf,
  downloadPptx,
  downloadTextFile,
  formatStudyAsText,
  getExportBaseName,
  tryParseStudyJson,
} from '@/lib/export-study'

interface ExportButtonsProps {
  type: StudyOutputType
  result: string
  fileName: string
}

export function ExportButtons({ type, result, fileName }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null)
  const baseName = getExportBaseName(fileName, type)
  const plainText = formatStudyAsText(type, result, fileName)

  const runExport = async (label: string, action: () => Promise<void> | void) => {
    setIsExporting(label)
    try {
      await action()
    } finally {
      setIsExporting(null)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="outline"
        disabled={!!isExporting}
        onClick={() =>
          runExport('txt', () => downloadTextFile(plainText, `${baseName}.txt`))
        }
        className="border-border/60"
      >
        <FileText className="w-4 h-4 mr-1.5" />
        {isExporting === 'txt' ? 'Downloading...' : 'TXT'}
      </Button>

      <Button
        size="sm"
        variant="outline"
        disabled={!!isExporting}
        onClick={() =>
          runExport('md', () =>
            downloadTextFile(plainText, `${baseName}.md`)
          )
        }
        className="border-border/60"
      >
        <Download className="w-4 h-4 mr-1.5" />
        {isExporting === 'md' ? 'Downloading...' : 'Markdown'}
      </Button>

      <Button
        size="sm"
        variant="outline"
        disabled={!!isExporting}
        onClick={() =>
          runExport('pdf', () =>
            downloadPdf(plainText, `${baseName}.pdf`, `${type} — StudyAI`)
          )
        }
        className="border-border/60"
      >
        <FileType className="w-4 h-4 mr-1.5" />
        {isExporting === 'pdf' ? 'Exporting...' : 'PDF'}
      </Button>

      {type === 'slides' && (
        <Button
          size="sm"
          disabled={!!isExporting}
          onClick={() =>
            runExport('pptx', async () => {
              const data = tryParseStudyJson(result)
              if (!data?.slides) throw new Error('Invalid slides data')
              await downloadPptx(data, `${baseName}.pptx`)
            })
          }
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Presentation className="w-4 h-4 mr-1.5" />
          {isExporting === 'pptx' ? 'Exporting...' : 'PPTX'}
        </Button>
      )}
    </div>
  )
}
