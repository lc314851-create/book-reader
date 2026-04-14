import { useState, useEffect } from 'react'
import { Box, VStack, Heading, Input, Button, Text, Flex, HStack, Avatar, Textarea } from '@chakra-ui/react'

interface Comment {
  id: string
  author: string
  content: string
  createdAt: string
}

interface Props {
  bookId: string
}

export default function Comments({ bookId }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/comments?bookId=${bookId}`)
      .then(res => res.json())
      .then(data => setComments(Array.isArray(data) ? data : []))
  }, [bookId])

  const handleSubmit = async () => {
    if (!newComment.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, content: newComment, author: authorName || '匿名用户' }),
      })
      const comment = await res.json()
      setComments([comment, ...comments])
      setNewComment('')
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <Box mt={8}>
      <Heading size="md" mb={4}>💬 评论区</Heading>

      {/* 输入框 */}
      <Box mb={6} p={4} bg="gray.50" borderRadius="lg">
        <Input
          placeholder="你的名字（选填）"
          value={authorName}
          onChange={e => setAuthorName(e.target.value)}
          mb={2}
          bg="white"
        />
        <Textarea
          placeholder="写下你的读书心得..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          rows={3}
          bg="white"
          mb={2}
        />
        <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading}>
          发布评论
        </Button>
      </Box>

      {/* 评论列表 */}
      <VStack spacing={4} align="stretch">
        {comments.length === 0 && (
          <Text color="gray.400" textAlign="center" py={4}>
            暂无评论，来发表第一篇吧
          </Text>
        )}
        {comments.map(comment => (
          <Box key={comment.id} p={4} bg="white" borderRadius="lg" shadow="sm">
            <Flex justify="space-between" mb={2}>
              <HStack>
                <Avatar size="sm" name={comment.author} bg="blue.500" color="white" />
                <Text fontWeight="bold">{comment.author}</Text>
              </HStack>
              <Text fontSize="xs" color="gray.400">
                {new Date(comment.createdAt).toLocaleString('zh-CN')}
              </Text>
            </Flex>
            <Text color="gray.700">{comment.content}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  )
}