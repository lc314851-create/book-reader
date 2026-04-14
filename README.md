# 📚 BookReader - AI智能读书分享平台

> 自动化拆书、笔记整理、金句卡片生成

## 功能特点

- 🤖 AI 自动化拆书：大纲整理、金句提取、思维导图、读书笔记
- 🖼️ 金句卡片：生成精美卡片一键分享
- 🔊 语音朗读：通勤场景覆盖
- 📊 数据榜单：热度榜、销量榜、重印次数榜
- 💰 变现通道：书籍链接佣金

## 技术栈

- **前端**: Next.js 14 + React + TailwindCSS
- **后端**: Next.js API Routes
- **数据库**: SQLite (Prisma ORM)
- **AI**: 硅基流动 / DeepSeek API
- **TTS**: Web Speech API

## 快速开始

```bash
# 安装依赖
pnpm install

# 初始化数据库
pnpm db:push

# 启动开发服务器
pnpm dev
```

## 项目结构

```
├── src/
│   ├── pages/        # 页面
│   ├── components/   # 组件
│   ├── lib/          # 工具函数
│   └── styles/       # 样式
├── prisma/
│   └── schema.prisma # 数据模型
└── scripts/          # 脚本
```

## License

MIT
