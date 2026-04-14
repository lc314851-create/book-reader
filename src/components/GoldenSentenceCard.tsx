import { useState, useRef } from 'react'
import { Box, Text, Button, VStack, useToast, IconButton, Tooltip } from '@chakra-ui/react'
import html2canvas from 'html2canvas'

interface Props {
  sentences: string[]
}

export default function GoldenSentenceCards({ sentences }: Props) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const toast = useToast()

  // 解析金句（从「」中提取）
  const parseSentences = (content: string) => {
    const matches = content.match(/「([^」]+)」/g)
    if (matches) return matches.map(s => s.replace(/「|」/g, ''))
    return content.split('\n').filter(Boolean)
  }

  const allSentences = sentences.length > 0 
    ? sentences 
    : ['暂无金句']

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <VStack spacing={4} align="stretch">
      {allSentences.map((sentence, i) => (
        <Box 
          key={i}
          p={6}
          bgGradient="linear(to-br, blue.50, purple.50)"
          borderRadius="xl"
          border="1px"
          borderColor="gray.200"
          position="relative"
          _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
          transition="all 0.2s"
        >
          <Text fontSize="lg" fontWeight="medium" color="gray.800" fontFamily="'Noto Serif SC', serif">
            「{sentence}」
          </Text>
          <Box position="absolute" bottom={2} right={2}>
            <Button 
              size="xs" 
              variant="ghost"
              onClick={() => handleCopy(`「${sentence}」`, i)}
            >
              {copiedIndex === i ? '✅ 已复制' : '📋 复制'}
            </Button>
          </Box>
        </Box>
      ))}
    </VStack>
  )
}
