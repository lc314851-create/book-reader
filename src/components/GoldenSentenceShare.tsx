import { useState, useRef } from 'react'
import { Box, Button, Flex, Text, IconButton, useToast, HStack } from '@chakra-ui/react'

interface Props {
  sentences: string[]
  bookTitle?: string
}

const COLORS = [
  { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: 'white' },
  { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', text: 'white' },
  { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', text: 'white' },
  { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', text: 'gray.800' },
  { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', text: 'gray.800' },
  { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', text: 'gray.800' },
]

export default function GoldenSentenceShare({ sentences, bookTitle }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [colorIndex, setColorIndex] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const toast = useToast()

  const handleDownload = async () => {
    if (!cardRef.current) return

    try {
      // 动态导入 html2canvas
      const html2canvas = (await import('html2canvas')).default
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      })

      const link = document.createElement('a')
      link.download = `金句-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()

      toast({ title: '图片已下载', status: 'success', duration: 2000 })
    } catch (err) {
      toast({ title: '下载失败，请重试', status: 'error', duration: 2000 })
    }
  }

  const handleCopyText = async () => {
    const text = `「${sentences[selectedIndex]}」${bookTitle ? `\n—— 《${bookTitle}》` : ''}`
    await navigator.clipboard.writeText(text)
    toast({ title: '文字已复制', status: 'success', duration: 2000 })
  }

  if (sentences.length === 0) return null

  return (
    <Box>
      {/* 预览卡片 */}
      <Box 
        ref={cardRef}
        p={8}
        bgGradient={COLORS[colorIndex].bg}
        borderRadius="xl"
        minW="320px"
        maxW="400px"
        mx="auto"
        position="relative"
      >
        <Text 
          fontSize="2xl" 
          fontWeight="bold" 
          color={COLORS[colorIndex].text}
          fontFamily="'Noto Serif SC', serif"
          lineHeight="tall"
        >
          「{sentences[selectedIndex]}」
        </Text>
        {bookTitle && (
          <Text 
            mt={4} 
            fontSize="sm" 
            color={COLORS[colorIndex].text} 
            opacity={0.8}
            textAlign="right"
          >
            —— 《{bookTitle}》
          </Text>
        )}
        {/* 水印 */}
        <Text 
          position="absolute" 
          bottom={2} 
          right={3} 
          fontSize="xs" 
          color={COLORS[colorIndex].text} 
          opacity={0.5}
        >
          BookReader
        </Text>
      </Box>

      {/* 控制面板 */}
      <HStack mt={4} justify="center" spacing={2} flexWrap="wrap">
        <Button size="sm" onClick={handleDownload}>📥 下载图片</Button>
        <Button size="sm" onClick={handleCopyText}>📋 复制文字</Button>
      </HStack>

      {/* 切换颜色 */}
      <Flex mt={3} justify="center" gap={2}>
        {COLORS.map((c, i) => (
          <Box
            key={i}
            w="24px"
            h="24px"
            borderRadius="full"
            bg={i === colorIndex ? 'blue.500' : 'gray.300'}
            cursor="pointer"
            onClick={() => setColorIndex(i)}
            border={i === colorIndex ? '2px' : 'none'}
            borderColor="blue.600"
          />
        ))}
      </Flex>

      {/* 切换金句 */}
      {sentences.length > 1 && (
        <HStack mt={3} justify="center">
          <Button 
            size="xs" 
            variant="ghost"
            onClick={() => setSelectedIndex(i => i > 0 ? i - 1 : sentences.length - 1)}
          >
            ◀
          </Button>
          <Text fontSize="sm" color="gray.500">
            {selectedIndex + 1} / {sentences.length}
          </Text>
          <Button 
            size="xs" 
            variant="ghost"
            onClick={() => setSelectedIndex(i => i < sentences.length - 1 ? i + 1 : 0)}
          >
            ▶
          </Button>
        </HStack>
      )}
    </Box>
  )
}