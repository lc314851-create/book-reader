import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { splitBook } from '@/lib/api'

const prisma = new PrismaClient()

// GET /api/books - 获取所有书籍列表
// POST /api/books - 创建新书籍
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET - 获取列表
  if (req.method === 'GET') {
    try {
      const books = await prisma.book.findMany({
        include: { notes: true },
        orderBy: { createdAt: 'desc' },
      })
      return res.status(200).json(books)
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  }

  // POST - 创建新书籍
  if (req.method === 'POST') {
    const { title, author } = req.body

    if (!title) {
      return res.status(400).json({ error: '书名不能为空' })
    }

    try {
      // 创建书籍记录
      const book = await prisma.book.create({
        data: {
          title,
          author: author || '未知作者',
          cover: `https://picsum.photos/seed/${Date.now()}/200/300`,
        },
      })

      // 获取API Key
      const apiKey = process.env.MINIMAX_API_KEY
      if (!apiKey) {
        return res.status(500).json({ error: 'API Key not configured' })
      }

      // 调用AI拆书
      const notes = await splitBook(title, author || '', apiKey)

      // 保存笔记
      await Promise.all([
        prisma.note.create({
          data: { bookId: book.id, type: 'outline', title: '📝 大纲整理', content: notes.outline },
        }),
        prisma.note.create({
          data: { bookId: book.id, type: 'golden-sentence', title: '✨ 金句提取', content: notes.goldenSentences },
        }),
        prisma.note.create({
          data: { bookId: book.id, type: 'mindmap', title: '🧠 思维导图', content: notes.mindMap },
        }),
        prisma.note.create({
          data: { bookId: book.id, type: 'reading-note', title: '📖 读书笔记', content: notes.readingNote },
        }),
      ])

      // 返回完整数据
      const fullBook = await prisma.book.findUnique({
        where: { id: book.id },
        include: { notes: true },
      })

      return res.status(200).json(fullBook)
    } catch (error: any) {
      console.error('Error:', error)
      return res.status(500).json({ error: error.message })
    }
  }

  // 其他方法不允许
  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
