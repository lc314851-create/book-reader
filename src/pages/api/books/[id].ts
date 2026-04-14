import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query

  try {
    const book = await prisma.book.findUnique({
      where: { id: id as string },
      include: { notes: true },
    })

    if (!book) {
      return res.status(404).json({ error: '书籍不存在' })
    }

    res.status(200).json(book)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
