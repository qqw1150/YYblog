# YYLog - 现代化个人博客系统

一个基于 Next.js 15 和 Supabase 构建的高性能个人博客系统，支持大容量内容管理、全文搜索、动态分类和标签管理。

## ✨ 主要特性

- 🚀 **高性能架构**: 基于 Next.js 15 App Router，支持服务端渲染和静态生成
- 📝 **富文本编辑器**: 集成 Toast UI Editor，支持 Markdown 和富文本编辑
- 🔍 **全文搜索**: 基于 Supabase PostgreSQL 的全文搜索功能
- 🏷️ **分类标签系统**: 动态分类和标签管理，支持多对多关联
- 👤 **用户认证**: 基于 Supabase Auth 的用户认证系统
- 🎨 **响应式设计**: 使用 Tailwind CSS 构建的现代化响应式界面
- 📱 **移动端优化**: 完美适配各种设备尺寸
- 🔒 **权限管理**: 支持管理员和普通用户角色
- 📊 **SEO 优化**: 内置 SEO 功能，支持关键词和描述设置

## 🛠️ 技术栈

### 前端
- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + @tailwindcss/typography
- **状态管理**: Zustand
- **图标**: Lucide React
- **编辑器**: Toast UI Editor

### 后端
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **部署**: Vercel
- **搜索**: PostgreSQL 全文搜索 (tsvector)

### 开发工具
- **代码规范**: ESLint + Prettier
- **类型检查**: TypeScript
- **构建工具**: Next.js

## 📁 项目结构

```
yylog/
├── app/                          # Next.js App Router 页面
│   ├── admin/                    # 管理后台
│   │   ├── categories/           # 分类管理
│   │   ├── posts/                # 文章管理
│   │   ├── tags/                 # 标签管理
│   │   └── settings/             # 系统设置
│   ├── auth/                     # 认证相关页面
│   │   ├── login/                # 登录页面
│   │   ├── register/             # 注册页面
│   │   └── callback/             # 认证回调
│   ├── blog/                     # 博客前台
│   │   ├── [id]/                 # 文章详情页
│   │   ├── category/[id]/        # 分类页面
│   │   └── tag/[id]/             # 标签页面
│   └── globals.css               # 全局样式
├── components/                    # 可复用组件
│   ├── admin/                    # 管理后台组件
│   ├── auth/                     # 认证相关组件
│   ├── blog/                     # 博客前台组件
│   ├── editor/                   # 编辑器组件
│   └── ui/                       # 通用 UI 组件
├── lib/                          # 工具库
│   ├── supabase/                 # Supabase 相关
│   │   ├── client.ts             # 客户端配置
│   │   ├── server.ts             # 服务端配置
│   │   └── db/                   # 数据库操作
│   └── utils/                    # 工具函数
├── stores/                       # 状态管理
│   └── authStore.ts              # 认证状态管理
├── types/                        # TypeScript 类型定义
└── public/                       # 静态资源
```

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm/yarn/pnpm

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 环境配置

1. 复制环境变量模板：
```bash
cp .env.example .env.local
```

2. 配置 Supabase 环境变量：
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 数据库设置

1. 在 Supabase 中创建新项目
2. 运行数据库迁移脚本：
```bash
# 在 Supabase SQL 编辑器中执行
cat lib/supabase/db/schema.sql
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📝 使用指南

### 博客前台

- **首页**: 展示最新文章列表，支持搜索和分页
- **文章详情**: 支持 Markdown 渲染，代码高亮
- **分类浏览**: 按分类筛选文章
- **标签浏览**: 按标签筛选文章
- **搜索功能**: 全文搜索文章内容

### 管理后台

访问 `/admin` 进入管理后台（需要管理员权限）：

- **文章管理**: 创建、编辑、删除文章
- **分类管理**: 管理文章分类
- **标签管理**: 管理文章标签
- **用户管理**: 管理用户账户

### 认证系统

- **用户注册**: 支持邮箱注册
- **用户登录**: 邮箱密码登录
- **权限控制**: 基于角色的访问控制

## 🔧 开发指南

### 代码规范

项目使用 ESLint 和 Prettier 进行代码规范：

```bash
# 代码检查
npm run lint

# 代码格式化
npx prettier --write .
```

### 数据库操作

数据库操作封装在 `lib/supabase/db/` 目录下：

- `posts.ts`: 文章相关操作
- `categories.ts`: 分类相关操作
- `tags.ts`: 标签相关操作
- `users.ts`: 用户相关操作

### 组件开发

组件位于 `components/` 目录，按功能分类：

- 使用 TypeScript 确保类型安全
- 遵循 React 最佳实践
- 使用 Tailwind CSS 进行样式设计

## 🚀 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 自动部署

### 环境变量配置

确保在 Vercel 中配置以下环境变量：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📊 性能优化

- **图片优化**: 使用 Next.js 内置图片优化
- **代码分割**: 自动代码分割和懒加载
- **缓存策略**: 合理的缓存策略
- **SEO 优化**: 服务端渲染和元数据优化

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Supabase](https://supabase.com/) - 后端即服务
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Lucide](https://lucide.dev/) - 图标库
- [Toast UI Editor](https://ui.toast.com/tui-editor) - 富文本编辑器

---

⭐ 如果这个项目对您有帮助，请给它一个星标！
