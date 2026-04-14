import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Box, Container, Heading, Text, VStack, Button, Badge, Flex, Spinner, Card, CardBody, Image, Grid } from '@chakra-ui/react'
import Link from 'next/link'
import TTSButton from '@/components/TTSButton'
import GoldenSentenceShare from '@/components/GoldenSentenceShare'

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

export default function BookDetail() {
  const router = useRouter()
  const { id } = router.query
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/books/${id}`)
      .then(res => res.json())
      .then(data => {
        setBook(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Flex justify="center" align="center" h="50vh">
          <Spinner size="xl" />
        </Flex>
      </Box>
    )
  }

  if (!book) {
    return (
      <Box minH="100vh" bg="gray.50" p={8}>
        <Container maxW="800px">
          <Text>书籍不存在</Text>
          <Link href="/">
            <Button mt={4}>返回首页</Button>
          </Link>
        </Container>
      </Box>
    )
  }

  const outlineNote = book.notes.find(n => n.type === 'outline')
  const goldenNote = book.notes.find(n => n.type === 'golden-sentence')
  const mindmapNote = book.notes.find(n => n.type === 'mindmap')
  const readingNote = book.notes.find(n => n.type === 'reading-note')

  // 解析金句
  const parseSentences = (content: string) => {
    const matches = content.match(/「([^」]+)」/g)
    if (matches) return matches.map((s: string) => s.replace(/「|」/g, ''))
    return content.split('\n').filter(Boolean)
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="blue.600" color="white" py={6} px={8}>
        <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
          <Box>
            <Heading size="lg">📚 {book.title}</Heading>
            <Text mt={2} opacity={0.9}>作者：{book.author}</Text>
          </Box>
          <Link href="/">
            <Button variant="outline" color="white" borderColor="white">← 返回首页</Button>
          </Link>
        </Flex>
      </Box>

      <Container maxW="1200px" py={8}>
        <Grid templateColumns={{ base: '1fr', md: '300px 1fr' }} gap={8}>
          {/* 左侧书籍信息 */}
          <Box>
            <Card>
              <CardBody>
                <Image src={book.cover} alt={book.title} borderRadius="md" mb={4} />
                <Heading size="md">{book.title}</Heading>
                <Text color="gray.500" mt={1}>{book.author}</Text>
                {book.category && <Badge mt={2}>{book.category}</Badge>}
              </CardBody>
            </Card>
          </Box>

          {/* 右侧笔记内容 */}
          <VStack spacing={6} align="stretch">
            {/* 大纲 */}
            {outlineNote && (
              <Card>
                <CardBody>
                  <Flex justify="space-between" align="center" mb={3}>
                    <Heading size="md">📝 大纲整理</Heading>
                    <TTSButton text={outlineNote.content} size="md" />
                  </Flex>
                  <Box whiteSpace="pre-wrap" fontFamily="mono" fontSize="sm" lineHeight="tall">
                    {outlineNote.content}
                  </Box>
                </CardBody>
              </Card>
            )}

            {/* 思维导图 */}
            {mindmapNote && (
              <Card>
                <CardBody>
                  <Flex justify="space-between" align="center" mb={3}>
                    <Heading size="md">🧠 思维导图</Heading>
                    <TTSButton text={mindmapNote.content} size="md" />
                  </Flex>
                  <Box 
                    whiteSpace="pre-wrap" 
                    fontFamily="mono" 
                    fontSize="sm" 
                    lineHeight="tall"
                    bg="gray.50" 
                    p={4} 
                    borderRadius="md"
                  >
                    {mindmapNote.content}
                  </Box>
                </CardBody>
              </Card>
            )}

            {/* 金句卡片 */}
            {goldenNote && (
              <Card>
                <CardBody>
                  <Flex justify="space-between" align="center" mb={3}>
                    <Heading size="md">✨ 金句提取</Heading>
                    <TTSButton text={goldenNote.content} size="md" />
                  </Flex>
                  <GoldenSentenceShare sentences={parseSentences(goldenNote.content)} bookTitle={book.title} />
                </CardBody>
              </Card>
            )}

            {/* 读书笔记 */}
            {readingNote && (
              <Card>
                <CardBody>
                  <Flex justify="space-between" align="center" mb={3}>
                    <Heading size="md">📖 读书笔记</Heading>
                    <TTSButton text={readingNote.content} size="md" />
                  </Flex>
                  <Box whiteSpace="pre-wrap" lineHeight="relaxed">
                    {readingNote.content}
                  </Box>
                </CardBody>
              </Card>
            )}
          </VStack>
        </Grid>
      </Container>
    </Box>
  )
}