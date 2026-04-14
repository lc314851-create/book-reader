import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 获取所有书籍及其评论数和笔记数
    const books = await prisma.book.findMany({
      include: {
        _count: { select: { notes: true, comments: true } },
      },
    })

    // 计算热度分数：评论数*10 + 笔记数*5
    const rankedBooks = books.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      cover: book.cover,
      commentCount: book._count.comments,
      noteCount: book._count.notes,
      score: book._count.comments * 10 + book._count.notes * 5,
    }))

    // 按热度排序
    rankedBooks.sort((a, b) => b.score - a.score)

    res.status(200).json(rankedBooks)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
