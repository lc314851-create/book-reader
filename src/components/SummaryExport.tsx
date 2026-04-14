import { Box, HStack, Button, useToast, Menu, MenuButton, MenuList, MenuItem, IconButton, Tooltip } from '@chakra-ui/react'

interface Note {
  id: string
  type: string
  title: string
  content: string
}

interface Book {
  id: string
  title: string
  author: string
  cover: string
  description?: string
  category?: string
  notes: Note[]
}

interface Props {
  book: Book
}

const NOTE_TYPE_NAMES: Record<string, string> = {
  'outline': '📝 大纲整理',
  'mindmap': '🧠 思维导图',
  'golden-sentence': '✨ 金句提取',
  'reading-note': '📖 读书笔记'
}

export default function SummaryExport({ book }: Props) {
  const toast = useToast()

  // 导出为 Markdown
  const handleExportMarkdown = () => {
    let md = `# ${book.title}\n\n`
    md += `> 作者：${book.author}\n\n`
    
    if (book.cover) {
      md += `![cover](${book.cover})\n\n`
    }

    if (book.description) {
      md += `## 简介\n\n${book.description}\n\n`
    }

    book.notes.forEach(note => {
      const noteName = NOTE_TYPE_NAMES[note.type] || note.type
      md += `## ${noteName}\n\n${note.content}\n\n---\n\n`
    })

    md += `\n---\n*由 BookReader 生成*\n`

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `${book.title}-读书笔记.md`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)

    toast({ title: 'Markdown 已下载', status: 'success', duration: 2000 })
  }

  // 导出为 PDF (使用打印功能)
  const handleExportPDF = () => {
    toast({ title: '正在生成 PDF...', status: 'info', duration: 1500 })
    
    // 创建打印内容的 HTML
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${book.title} - 读书笔记</title>
        <style>
          body { font-family: "Noto Serif SC", serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          h1 { text-align: center; color: #2c5282; }
          h2 { color: #3182ce; border-bottom: 2px solid #3182ce; padding-bottom: 8px; }
          .cover { text-align: center; margin: 20px 0; }
          .cover img { max-width: 200px; border-radius: 8px; }
          .meta { text-align: center; color: #666; margin-bottom: 30px; }
          pre { white-space: pre-wrap; background: #f7fafc; padding: 16px; border-radius: 8px; line-height: 1.6; }
          .footer { text-align: center; color: #999; margin-top: 40px; font-size: 14px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <h1>📚 ${book.title}</h1>
        <div class="meta">作者：${book.author}</div>
        ${book.cover ? `<div class="cover"><img src="${book.cover}" alt="cover"></div>` : ''}
        ${book.description ? `<p><strong>简介：</strong>${book.description}</p>` : ''}
        ${book.notes.map(note => `
          <h2>${NOTE_TYPE_NAMES[note.type] || note.type}</h2>
          <pre>${note.content}</pre>
        `).join('\n')}
        <div class="footer">由 BookReader 生成 | ${new Date().toLocaleDateString('zh-CN')}</div>
      </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.onload = () => {
        printWindow.print()
      }
    } else {
      toast({ title: '请允许弹出窗口', status: 'warning', duration: 2000 })
    }
  }

  // 复制全部内容
  const handleCopyAll = async () => {
    let text = `${book.title}\n作者：${book.author}\n\n`
    
    book.notes.forEach(note => {
      const noteName = NOTE_TYPE_NAMES[note.type] || note.type
      text += `${noteName}\n${note.content}\n\n`
    })

    try {
      await navigator.clipboard.writeText(text)
      toast({ title: '已复制全部内容', status: 'success', duration: 2000 })
    } catch {
      toast({ title: '复制失败', status: 'error', duration: 2000 })
    }
  }

  return (
    <HStack spacing={2} flexWrap="wrap">
      {/* 导出菜单 */}
      <Menu>
        <MenuButton as={Button} size="sm" colorScheme="green">
          📥 导出笔记 ▾
        </MenuButton>
        <MenuList>
          <MenuItem onClick={handleExportMarkdown}>
            📝 导出为 Markdown (.md)
          </MenuItem>
          <MenuItem onClick={handleExportPDF}>
            📄 导出为 PDF (打印)
          </MenuItem>
          <MenuItem onClick={handleCopyAll}>
            📋 复制全部内容
          </MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  )
}
