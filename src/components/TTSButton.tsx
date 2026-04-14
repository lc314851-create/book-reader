import { useState, useEffect, useRef } from 'react'
import { IconButton, Tooltip, Box } from '@chakra-ui/react'

interface Props {
  text: string
  size?: 'sm' | 'md'
}

export default function TTSButton({ text, size = 'sm' }: Props) {
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    setSupported('speechSynthesis' in window)
  }, [])

  const handleSpeak = () => {
    if (speaking) {
      // 停止
      speechSynthesis.cancel()
      setSpeaking(false)
      return
    }

    // 清理标点符号，只保留中文和基本标点
    const cleanText = text.replace(/[#📝✨🧠📖🔊📋✅⏳]/g, '').trim()
    if (!cleanText) return

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.9
    utterance.pitch = 1

    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    utteranceRef.current = utterance
    speechSynthesis.speak(utterance)
    setSpeaking(true)
  }

  if (!supported) return null

  return (
    <Tooltip label={speaking ? '⏹ 停止' : '🔊 朗读'}>
      <IconButton
        aria-label="朗读"
        icon={<Box fontSize={size === 'sm' ? '16px' : '20px'}>{speaking ? '⏹' : '🔊'}</Box>}
        size={size}
        variant="ghost"
        colorScheme={speaking ? 'red' : 'blue'}
        onClick={handleSpeak}
      />
    </Tooltip>
  )
}