import { Box, HStack, IconButton, Tooltip, useToast, Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'

interface Props {
  title: string
  url?: string
  summary?: string
}

export default function ShareButtons({ title, url, summary }: Props) {
  const toast = useToast()
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

  return (
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
    </HStack>
  )
}
