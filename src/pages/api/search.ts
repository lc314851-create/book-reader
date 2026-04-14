import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { q } = req.query

  if (!q || (q as string).length < 1) {
    return res.status(400).json({ error: '搜索关键词不能为空' })
  }

  try {
    // 搜索书籍（标题和作者）和笔记内容
    const books = await prisma.book.findMany({
      where: {
        OR: [
          { title: { contains: q as string } },
          { author: { contains: q as string } },
        ],
      },
      include: {
        notes: {
          where: {
            content: { contains: q as string },
          },
        },
      },
    })

    // 也搜索笔记内容，返回匹配的书籍
    const notesWithMatches = await prisma.note.findMany({
      where: {
        content: { contains: q as string },
      },
      select: { bookId: true },
    })

    const noteBookIds = [...new Set(notesWithMatches.map(n => n.bookId))]
    const noteBooks = await prisma.book.findMany({
      where: { id: { in: noteBookIds } },
      include: { notes: true },
    })

    // 合并结果
    const allBooks = [...books, ...noteBooks.filter(b => !books.find(bb => bb.id === b.id))]
    const uniqueBooks = Array.from(new Map(allBooks.map(b => [b.id, b])).values())

    res.status(200).json(uniqueBooks)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}