import { useState, useEffect } from 'react'
import { Box, Container, Heading, Text, VStack, Card, CardBody, Image, Flex, Badge, Button, Tabs, TabList, Tab, TabPanels, TabPanel, HStack } from '@chakra-ui/react'
import Link from 'next/link'

interface Book {
  id: string
  title: string
  author: string
  cover: string
  commentCount: number
  noteCount: number
  score: number
}

export default function Rankings() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/rankings')
      .then(res => res.json())
      .then(data => {
        setBooks(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="blue.600" color="white" py={6} px={8}>
        <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
          <Box>
            <Heading size="lg">📊 读书排行榜</Heading>
            <Text mt={2} opacity={0.9}>发现最受关注的书籍</Text>
          </Box>
          <Link href="/">
            <Button variant="outline" color="white" borderColor="white">← 返回首页</Button>
          </Link>
        </Flex>
      </Box>

      <Container maxW="800px" py={8}>
        <Tabs colorScheme="blue">
          <TabList>
            <Tab>🔥 热度榜</Tab>
            <Tab>📝 笔记榜</Tab>
            <Tab>💬 评论榜</Tab>
          </TabList>

          <TabPanels>
            {/* 热度榜 */}
            <TabPanel px={0}>
              <VStack spacing={4} align="stretch">
                {loading && <Text>加载中...</Text>}
                {!loading && books.length === 0 && (
                  <Text color="gray.400" textAlign="center" py={10}>暂无数据</Text>
                )}
                {books.map((book, index) => (
                  <Link key={book.id} href={`/book/${book.id}`}>
                    <Card cursor="pointer" _hover={{ shadow: 'md', transform: 'translateY(-2px)' }} transition="all 0.2s">
                      <CardBody>
                        <Flex align="center" gap={4}>
                          <Text 
                            fontSize="2xl" 
                            fontWeight="bold" 
                            color={index < 3 ? 'orange.500' : 'gray.400'}
                            minW="40px"
                          >
                            {index + 1}
                          </Text>
                          <Image src={book.cover} alt={book.title} w="60px" h="80px" borderRadius="md" objectFit="cover" />
                          <Box flex={1}>
                            <Heading size="sm">{book.title}</Heading>
                            <Text fontSize="sm" color="gray.500">{book.author}</Text>
                          </Box>
                          <VStack align="end" spacing={1}>
                            <Badge colorScheme="orange">{book.score} 热度</Badge>
                            <HStack fontSize="xs" color="gray.500">
                              <Text>📝 {book.noteCount}</Text>
                              <Text>💬 {book.commentCount}</Text>
                            </HStack>
                          </VStack>
                        </Flex>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </VStack>
            </TabPanel>

            {/* 笔记榜 */}
            <TabPanel px={0}>
              <VStack spacing={4} align="stretch">
                {books.sort((a, b) => b.noteCount - a.noteCount).map((book, index) => (
                  <Link key={book.id} href={`/book/${book.id}`}>
                    <Card cursor="pointer" _hover={{ shadow: 'md' }} transition="all 0.2s">
                      <CardBody>
                        <Flex align="center" gap={4}>
                          <Text fontSize="2xl" fontWeight="bold" color={index < 3 ? 'blue.500' : 'gray.400'} minW="40px">
                            {index + 1}
                          </Text>
                          <Image src={book.cover} alt={book.title} w="60px" h="80px" borderRadius="md" objectFit="cover" />
                          <Box flex={1}>
                            <Heading size="sm">{book.title}</Heading>
                            <Text fontSize="sm" color="gray.500">{book.author}</Text>
                          </Box>
                          <Badge colorScheme="blue">{book.noteCount} 篇笔记</Badge>
                        </Flex>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </VStack>
            </TabPanel>

            {/* 评论榜 */}
            <TabPanel px={0}>
              <VStack spacing={4} align="stretch">
                {books.sort((a, b) => b.commentCount - a.commentCount).map((book, index) => (
                  <Link key={book.id} href={`/book/${book.id}`}>
                    <Card cursor="pointer" _hover={{ shadow: 'md' }} transition="all 0.2s">
                      <CardBody>
                        <Flex align="center" gap={4}>
                          <Text fontSize="2xl" fontWeight="bold" color={index < 3 ? 'green.500' : 'gray.400'} minW="40px">
                            {index + 1}
                          </Text>
                          <Image src={book.cover} alt={book.title} w="60px" h="80px" borderRadius="md" objectFit="cover" />
                          <Box flex={1}>
                            <Heading size="sm">{book.title}</Heading>
                            <Text fontSize="sm" color="gray.500">{book.author}</Text>
                          </Box>
                          <Badge colorScheme="green">{book.commentCount} 条评论</Badge>
                        </Flex>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  )
}