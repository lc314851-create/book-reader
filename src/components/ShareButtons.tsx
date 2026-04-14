import { Box, HStack, IconButton, Tooltip, useToast, Button, Text, VStack, Flex } from '@chakra-ui/react'
import { useState } from 'react'

interface Props {
  title: string
  url?: string
  summary?: string
}

export default function ShareButtons({ title, url, summary }: Props) {
  const toast = useToast()
  const [showWechatModal, setShowWechatModal] = useState(false)
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareText = summary ? `${title} - ${summary}` : title

  // Web Share API (移动端)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: shareUrl })
      } catch (err) {
        // 用户取消分享
      }
    } else {
      toast({ title: '此浏览器不支持直接分享', status: 'info', duration: 2000 })
    }
  }

  // 复制链接
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({ title: '链接已复制', status: 'success', duration: 2000 })
    } catch {
      toast({ title: '复制失败', status: 'error', duration: 2000 })
    }
  }

  // 微博分享
  const handleWeiboShare = () => {
    const weiboUrl = `https://service.weibo.com/share/share.php?title=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(weiboUrl, '_blank', 'width=600,height=400')
  }

  // Twitter/X 分享
  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
  }

  // QQ分享
  const handleQQShare = () => {
    const qqUrl = `https://connect.qq.com/widget/shareqq/index.html?title=${encodeURIComponent(title)}&desc=${encodeURIComponent(summary || '')}&url=${encodeURIComponent(shareUrl)}`
    window.open(qqUrl, '_blank', 'width=600,height=400')
  }

  // 微信分享
  const handleWechatShare = () => {
    setShowWechatModal(true)
  }

  const handleCopyForWechat = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({ title: '链接已复制，去微信粘贴吧', status: 'success', duration: 2000 })
      setShowWechatModal(false)
    } catch {
      toast({ title: '复制失败', status: 'error', duration: 2000 })
    }
  }

  return (
    <>
      <HStack spacing={2} flexWrap="wrap">
        {/* 原生分享按钮 (移动端显示) */}
        <Button
          size="sm"
          colorScheme="blue"
          variant="outline"
          onClick={handleNativeShare}
          display={{ base: 'flex', md: 'none' }}
        >
          📤 分享
        </Button>

        {/* 复制链接 */}
        <Tooltip label="复制链接">
          <IconButton
            aria-label="复制链接"
            icon={<span>🔗</span>}
            size="sm"
            variant="ghost"
            onClick={handleCopyLink}
          />
        </Tooltip>

        {/* 微博 */}
        <Tooltip label="分享到微博">
          <IconButton
            aria-label="微博"
            icon={<span>📧</span>}
            size="sm"
            variant="ghost"
            onClick={handleWeiboShare}
          />
        </Tooltip>

        {/* Twitter/X */}
        <Tooltip label="分享到 X (Twitter)">
          <IconButton
            aria-label="Twitter"
            icon={<span>✈️</span>}
            size="sm"
            variant="ghost"
            onClick={handleTwitterShare}
          />
        </Tooltip>

        {/* QQ */}
        <Tooltip label="分享到 QQ">
          <IconButton
            aria-label="QQ"
            icon={<span>🐧</span>}
            size="sm"
            variant="ghost"
            onClick={handleQQShare}
          />
        </Tooltip>

        {/* 微信 */}
        <Tooltip label="微信分享">
          <IconButton
            aria-label="微信"
            icon={<span>💬</span>}
            size="sm"
            variant="ghost"
            onClick={handleWechatShare}
          />
        </Tooltip>
      </HStack>

      {/* 微信分享引导弹窗 */}
      {showWechatModal && (
        <>
          {/* 遮罩层 */}
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.600"
            zIndex={999}
            onClick={() => setShowWechatModal(false)}
          />
          
          {/* 弹窗内容 */}
          <Box
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="white"
            borderRadius="xl"
            p={6}
            maxW="320px"
            w="90%"
            zIndex={1000}
            boxShadow="xl"
          >
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontWeight="bold" fontSize="lg">📱 微信分享</Text>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setShowWechatModal(false)}
              >
                ✕
              </Button>
            </Flex>

            <VStack spacing={4} align="stretch">
              <Box
                p={4}
                bg="green.50"
                borderRadius="xl"
                textAlign="center"
                border="1px dashed"
                borderColor="green.300"
              >
                <Text fontSize="3xl" mb={2}>💬</Text>
                <Text fontWeight="bold" color="green.700">微信分享方式</Text>
              </Box>
              
              <VStack spacing={2} align="stretch">
                <Text fontWeight="bold" fontSize="sm" color="gray.600">方式一：复制链接</Text>
                <Text fontSize="sm" color="gray.500">点击按钮复制链接，粘贴到微信对话框</Text>
                <Button
                  colorScheme="green"
                  size="sm"
                  onClick={handleCopyForWechat}
                >
                  📋 复制链接
                </Button>
              </VStack>

              <VStack spacing={2} align="stretch">
                <Text fontWeight="bold" fontSize="sm" color="gray.600">方式二：截图分享</Text>
                <Text fontSize="sm" color="gray.500">截图当前页面或金句卡片，分享到微信</Text>
                <Button
                  variant="outline"
                  colorScheme="gray"
                  size="sm"
                  onClick={() => {
                    toast({ title: '请截图当前页面分享', status: 'info', duration: 2000 })
                  }}
                >
                  🖼️ 截图分享
                </Button>
              </VStack>

              <Text fontSize="xs" color="gray.400" textAlign="center">
                微信暂不支持第三方直接分享
              </Text>
            </VStack>
          </Box>
        </>
      )}
    </>
  )
}
