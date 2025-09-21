这是一个基于 [Next.js](https://nextjs.org) 的项目，使用 [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) 脚手架创建。

## 快速开始

### 环境准备
- Node.js 18+ 
- yarn/npm/pnpm 等包管理工具

### 启动流程
1. 克隆仓库
```bash
git clone https://github.com/aliancn/teachflow.git
cd teachflow
```

2. 安装依赖
```bash
yarn install
# 或
npm install
```

3. 启动开发服务器
```bash
yarn dev
# 或
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看运行结果。

### 修改内容
- 页面文件：`app/page.tsx` - 修改后页面会自动热更新
- 样式文件：`app/globals.css` - 全局CSS样式配置

## 技术特性
- 使用 [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) 自动优化并加载 [Geist](https://vercel.com/font) 字体
- 支持 TypeScript 类型检查
- 集成 Tailwind CSS 样式框架

## 学习资源
- [Next.js 官方文档](https://nextjs.org/docs) - 核心特性与API文档
- [Next.js 学习教程](https://nextjs.org/learn) - 交互式学习课程
- [GitHub 仓库](https://github.com/vercel/next.js) - 源码与问题反馈

## 部署指南
推荐使用 [Vercel 平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) 进行一键部署，具体流程参考：
- [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying)
- [Vercel 部署指南](https://vercel.com/docs/deployments)
