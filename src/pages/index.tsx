import { useState } from 'react'
import { ChakraProvider, Box, Heading, Text, VStack, Button, Input, Textarea, Select, SimpleGrid, Card, CardBody, Image, Badge, Flex, useToast, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { bookData, noteData } from '@/lib/mock-data'

export default function Home() {
  const [bookTitle, setBookTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [loading, setLoading] = useState(false)
  const [books, setBooks] = useState(bookData)
  const toast = useToast()

  const handleAddBook = async () => {
    if (!bookTitle) return
    setLoading(true)
    try {
      // Simulate AI processing
      await new Promise(r => setTimeout(r, 1500))
      
      const newBook = {
        id: Date.now().toString(),
        title: bookTitle,
        author: author || '未知作者',
        cover: `https://picsum.photos/seed/${Date.now()}/200/300`,
        notes: [
          { id: '1', type: 'outline', title: '📝 大纲整理', content: '正在生成...' },
          { id: '2', type: 'golden-sentence', title: '✨ 金句提取', content: '正在生成...' },
          { id: '3', type: 'mindmap', title: '🧠 思维导图', content: '正在生成...' },
          { id: '4', type: 'reading-note', title: '📖 读书笔记', content: '正在生成...' },
        ]
      }
      
      setBooks([newBook, ...books])
      setBookTitle('')
      setAuthor('')
      toast({ title: '书籍已添加，AI正在处理中...', status: 'success', duration: 3000 })
    } catch (err) {
      toast({ title: '添加失败', status: 'error', duration: 3000 })
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

      <Box maxW="1200px" mx="auto" py={8} px={4}>
        {/* Add Book Section */}
        <Card mb={8}>
          <CardBody>
            <Heading size="md" mb={4}>添加新书籍</Heading>
            <Flex gap={4} wrap="wrap">
              <Input placeholder="书名" value={bookTitle} onChange={e => setBookTitle(e.target.value)} maxW="300px" />
              <Input placeholder="作者" value={author} onChange={e => setAuthor(e.target.value)} maxW="200px" />
              <Button colorScheme="blue" onClick={handleAddBook} isLoading={loading}>添加并AI拆书</Button>
            </Flex>
          </CardBody>
        </Card>

        {/* Tabs */}
        <Tabs colorScheme="blue">
          <TabList>
            <Tab>📚 全部书籍</Tab>
            <Tab>⏳ 处理中</Tab>
            <Tab>✅ 已完成</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              <SimpleGrid columns={[1, 2, 3]} spacing={6}>
                {books.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </SimpleGrid>
            </TabPanel>
            <TabPanel px={0}>
              <SimpleGrid columns={[1, 2, 3]} spacing={6}>
                {books.filter(b => b.notes.some(n => n.content.includes('正在生成'))).map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </SimpleGrid>
            </TabPanel>
            <TabPanel px={0}>
              <SimpleGrid columns={[1, 2, 3]} spacing={6}>
                {books.filter(b => b.notes.every(n => !n.content.includes('正在生成'))).map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  )
}

function BookCard({ book }: { book: any }) {
  const [expanded, setExpanded] = useState(false)
  const status = book.notes.some(n => n.content.includes('正在生成')) ? 'processing' : 'done'
  
  return (
    <Card>
      <CardBody>
        <Image src={book.cover} alt={book.title} borderRadius="md" mb={3} h="150px" objectFit="cover" />
        <Heading size="sm" noOfLines={2}>{book.title}</Heading>
        <Text fontSize="sm" color="gray.500">{book.author}</Text>
        <Badge mt={2} colorScheme={status === 'processing' ? 'orange' : 'green'}>
          {status === 'processing' ? '⏳ 处理中' : '✅ 完成'}
        </Badge>
        
        {expanded && (
          <VStack align="stretch" mt={4} spacing={3}>
            {book.notes.map((note: any) => (
              <Box key={note.id} p={3} bg="gray.50" borderRadius="md">
                <Text fontWeight="bold" fontSize="sm">{note.title}</Text>
                <Text fontSize="sm" color="gray.600" noOfLines={3}>{note.content}</Text>
              </Box>
            ))}
          </VStack>
        )}
        
        <Button size="sm" mt={3} onClick={() => setExpanded(!expanded)}>
          {expanded ? '收起详情' : '查看笔记'}
        </Button>
      </CardBody>
    </Card>
  )
}
