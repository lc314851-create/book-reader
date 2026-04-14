import axios from 'axios'

// MiniMax API配置
const MINIMAX_API = 'https://api.minimax.chat/v1'
const MINIMAX_MODEL = 'abab6.5s-chat'

// 调用 AI（通用接口，支持 MiniMax）
async function callAI(prompt: string, apiKey: string, baseUrl: string = MINIMAX_API): Promise<string> {
  const response = await axios.post(
    `${baseUrl}/text/chatcompletion_v2`,
    {
      model: MINIMAX_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  )
  return response.data.choices[0].messages.content
}

// 生成大纲
export async function generateOutline(bookTitle: string, author: string, apiKey: string): Promise<string> {
  const prompt = `请为书籍《${bookTitle}》(作者：${author})生成一个详细的章节大纲。
要求：
1. 包含书籍的主要章节和子节
2. 每个章节用简洁的语言描述核心内容
3. 章节标题用"#"标记，子内容用缩进表示
4. 列出书籍的核心主题和解决的问题
5. 分析书籍的读者群体和阅读价值

请用中文回答，格式清晰。`

  return callAI(prompt, apiKey)
}

// 生成金句
export async function generateGoldenSentences(bookTitle: string, author: string, apiKey: string): Promise<string> {
  const prompt = `请为书籍《${bookTitle}》(作者：${author})提取20条最精彩的金句。
要求：
1. 每条金句不超过50字
2. 涵盖书中的核心观点、重要论述、令人深思的句子
3. 用引号「」包裹每条金句
4. 条目之间用空行分隔

请用中文回答。`

  return callAI(prompt, apiKey)
}

// 生成思维导图
export async function generateMindMap(bookTitle: string, author: string, apiKey: string): Promise<string> {
  const prompt = `请为书籍《${bookTitle}》(作者：${author})生成一个思维导图。
要求：
1. 用树状结构展示书籍的核心概念和分支
2. 格式示例：
   书名
   ├── 主题A
   │   ├── 子概念A1
   │   └── 子概念A2
   └── 主题B
       ├── 子概念B1
       └── 子概念B2
3. 保持层级清晰，最多3层
4. 突出书中的核心论点之间的逻辑关系

请用中文回答。`

  return callAI(prompt, apiKey)
}

// 生成读书笔记
export async function generateReadingNote(bookTitle: string, author: string, apiKey: string): Promise<string> {
  const prompt = `请为书籍《${bookTitle}》(作者：${author})写一篇读书笔记。
要求：
1. 包含书籍简介（100字以内）
2. 分析作者的核心观点和写作目的
3. 总结书中3-5个最重要的洞见
4. 结合实际案例说明如何应用
5. 给出阅读建议和适合的读者群体
6. 字数在500-800字之间
7. 用Markdown格式输出，标题用#标记

请用中文回答。`

  return callAI(prompt, apiKey)
}

// AI拆书主函数 - 并行调用四大功能
export async function splitBook(bookTitle: string, author: string, apiKey: string) {
  const [outline, goldenSentences, mindMap, readingNote] = await Promise.all([
    generateOutline(bookTitle, author, apiKey),
    generateGoldenSentences(bookTitle, author, apiKey),
    generateMindMap(bookTitle, author, apiKey),
    generateReadingNote(bookTitle, author, apiKey),
  ])

  return {
    outline,
    goldenSentences,
    mindMap,
    readingNote,
  }
}
