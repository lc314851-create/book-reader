import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET /api/books - 获取所有书籍列表
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

  // POST /api/books - 创建新书籍 (这个在 books.ts 里)
  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
