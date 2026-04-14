import TTSButton from '@/components/TTSButton'
import { useState, useEffect } from 'react'
import { ChakraProvider, Box, Heading, Text, VStack, Button, Input, SimpleGrid, Card, CardBody, Image, Badge, Flex, useToast, Container, IconButton } from '@chakra-ui/react'

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
  notes: Note[]
}

export default function Home() {
  const [bookTitle, setBookTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [loading, setLoading] = useState(false)
  const [books, setBooks] = useState<Book[]>([])
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())
  const toast = useToast()

  // 加载已有书籍
  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBooks(data)
      })
      .catch(() => {})
  }, [])

  const handleAddBook = async () => {
    if (!bookTitle) return
    setLoading(true)
    
    try {
      // 先添加一个处理中的书籍卡片
      const tempId = Date.now().toString()
      const tempBook: Book = {
        id: tempId,
        title: bookTitle,
        author: author || '未知作者',
        cover: `https://picsum.photos/seed/${tempId}/200/300`,
        notes: [
          { id: '1', type: 'outline', title: '📝 大纲整理', content: '⏳ AI处理中...' },
          { id: '2', type: 'golden-sentence', title: '✨ 金句提取', content: '⏳ AI处理中...' },
          { id: '3', type: 'mindmap', title: '🧠 思维导图', content: '⏳ AI处理中...' },
          { id: '4', type: 'reading-note', title: '📖 读书笔记', content: '⏳ AI处理中...' },
        ]
      }
      
      setBooks(prev => [tempBook, ...prev])
      setProcessingIds(prev => new Set([...prev, tempId]))
      setBookTitle('')
      setAuthor('')
      
      toast({ title: '开始AI拆书，请稍候...', status: 'info', duration: 2000 })

      // 调用API
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: bookTitle, author }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '添加失败')
      }

      const newBook = await res.json()
      
      // 替换临时书籍为真实数据
      setBooks(prev => prev.map(b => b.id === tempId ? newBook : b))
      setProcessingIds(prev => {
        const next = new Set(prev)
        next.delete(tempId)
        return next
      })

      toast({ title: 'AI拆书完成！', status: 'success', duration: 3000 })
    } catch (err: any) {
      toast({ title: err.message || '添加失败', status: 'error', duration: 3000 })
      // 移除临时书籍
      setBooks(prev => prev.filter(b => !processingIds.has(b.id)))
    }
    
    setLoading(false)
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="blue.600" color="white" py={6} px={8}>
        <Heading size="lg">📚 BookReader - AI智能读书平台</Heading>
        <Text mt={2} opacity={0.9}>自动化拆书、笔记整理、金句卡片生成</Text>
      </Box>

      <Container maxW="1200px" py={8}>
        {/* Add Book Section */}
        <Card mb={8}>
          <CardBody>
            <Heading size="md" mb={4}>添加新书籍</Heading>
            <Flex gap={4} wrap="wrap">
              <Input 
                placeholder="请输入书名" 
                value={bookTitle} 
                onChange={e => setBookTitle(e.target.value)} 
                maxW="300px" 
                bg="white"
              />
              <Input 
                placeholder="作者（选填）" 
                value={author} 
                onChange={e => setAuthor(e.target.value)} 
                maxW="200px" 
                bg="white"
              />
              <Button 
                colorScheme="blue" 
                onClick={handleAddBook} 
                isLoading={loading}
                isDisabled={!bookTitle}
              >
                添加并AI拆书
              </Button>
            </Flex>
          </CardBody>
        </Card>

        {/* Books Grid */}
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {books.map(book => (
            <BookCard 
              key={book.id} 
              book={book} 
              isProcessing={processingIds.has(book.id)} 
            />
          ))}
        </SimpleGrid>

        {books.length === 0 && (
          <Box textAlign="center" py={20} color="gray.400">
            <Text fontSize="xl">📚 还没有书籍，快添加第一本吧</Text>
          </Box>
        )}
      </Container>
    </Box>
  )
}

function BookCard({ book, isProcessing }: { book: Book; isProcessing?: boolean }) {
  const [expanded, setExpanded] = useState(false)
  
  return (
    <Card>
      <CardBody>
        <Image 
          src={book.cover} 
          alt={book.title} 
          borderRadius="md" 
          mb={3} 
          h="150px" 
          objectFit="cover"
        />
        <Heading size="sm" noOfLines={2}>{book.title}</Heading>
        <Text fontSize="sm" color="gray.500">{book.author}</Text>
        <Badge mt={2} colorScheme={isProcessing ? 'orange' : 'green'}>
          {isProcessing ? '⏳ AI处理中' : '✅ 完成'}
        </Badge>
        
        {expanded && (
          <VStack align="stretch" mt={4} spacing={3}>
            {book.notes.map((note) => (
              <Box key={note.id} p={3} bg="gray.50" borderRadius="md">
                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold" fontSize="sm">{note.title}</Text>
                  <TTSButton text={note.content} />
                </Flex>
                <Text fontSize="sm" color="gray.600" whiteSpace="pre-wrap" mt={1}>
                  {note.content}
                </Text>
              </Box>
            ))}
          </VStack>
        )}
        
        <Button 
          size="sm" 
          mt={3} 
          onClick={() => setExpanded(!expanded)}
          isDisabled={isProcessing}
        >
          {expanded ? '收起详情' : '查看笔记'}
        </Button>
      </CardBody>
    </Card>
  )
}
