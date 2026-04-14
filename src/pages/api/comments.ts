import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { bookId } = req.query
    const comments = await prisma.comment.findMany({
      where: { bookId: bookId as string },
      orderBy: { createdAt: 'desc' },
    })
    return res.status(200).json(comments)
  }

  if (req.method === 'POST') {
    const { bookId, content, author } = req.body
    if (!bookId || !content) {
      return res.status(400).json({ error: '缺少参数' })
    }
    const comment = await prisma.comment.create({
      data: {
        bookId,
        content,
        author: author || '匿名用户',
      },
    })
    return res.status(200).json(comment)
  }

  res.status(405).json({ error: 'Method not allowed' })
}
