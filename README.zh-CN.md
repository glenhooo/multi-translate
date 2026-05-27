# 聚合翻译

> 一个使用 React、TypeScript 和 OpenAI 兼容 API 构建的轻量级翻译工作台。

聚合翻译 允许你配置多个 OpenAI 兼容模型提供商，并在同一个界面中比较它们的流式翻译结果。它适用于快速文本翻译、模型输出对比，以及构建简单的基于浏览器的翻译工作流。

## 截图

![Multi Translate](docs/screenshot.png)

## 功能特性

- 多提供商管理：添加、启用和禁用 OpenAI 兼容 API 提供商。
- 并行流式翻译：向所有已启用的提供商发送请求，并在结果流式返回时查看。
- 提供商连接检查：通过 `/models` 端点验证 API Base URL、API 密钥和可用模型。
- 语言检测：自动检测源语言，并智能调整目标语言。
- 语言互换：一键切换源语言和目标语言。
- 自定义提示词模板：使用 `{sourceText}`、`{sourceLanguage}` 和 `{targetLanguage}` 变量配置翻译提示词。
- 本地持久化：将提供商设置和通用设置存储在浏览器的 `localStorage` 中。
- 现代化界面：使用 Tailwind CSS、shadcn/ui 和 Radix UI 构建，并支持主题切换。

## 技术栈

- [React 19](https://react.dev/) - UI 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Vite](https://vite.dev/) - 前端构建工具
- [Tailwind CSS 4](https://tailwindcss.com/) - 样式方案
- [shadcn/ui](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/) - UI 组件
- [OpenAI SDK](https://github.com/openai/openai-node) - OpenAI 兼容 API 请求
- [Sonner](https://sonner.emilkowal.ski/) - Toast 通知

## 快速开始

### 环境要求

- Node.js 20.19+ 或 22.12+
- 推荐使用 pnpm 9+

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

然后打开终端中显示的本地 URL，通常为：

```text
http://localhost:5173
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建


```bash
pnpm preview
```

## 使用方法

### 1. 配置翻译提供商

打开设置页面，添加或编辑提供商：

| 字段 | 说明 | 示例 |
| --- | --- | --- |
| 提供商名称 | UI 中使用的显示名称 | `OpenAI Primary` |
| API Base URL | OpenAI 兼容 API 端点 | `https://api.openai.com/v1` |
| API Key | 提供商 API 密钥 | `sk-...` |
| 模型 | 可用模型列表 | `gpt-4o-mini`, `gpt-4.1` |

保存前，你可以测试连接。应用会向以下地址发送请求：

```text
GET {API_BASE_URL}/models
```

### 2. 自定义翻译提示词

在通用设置中，你可以编辑提示词模板。支持以下变量：

| 变量 | 说明 |
| --- | --- |
| `{sourceText}` | 源文本 |
| `{sourceLanguage}` | 源语言名称 |
| `{targetLanguage}` | 目标语言名称 |

默认模板会要求模型只返回译文，不包含额外解释。

### 3. 翻译文本

1. 在首页输入你想要翻译的文本。
2. 选择源语言，或自动检测源语言。
3. 选择目标语言。
4. 开始翻译，以接收来自所有已启用提供商的并行结果。

## 可用脚本

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 运行 TypeScript 构建并生成生产资源 |
| `pnpm preview` | 在本地预览生产构建 |
| `pnpm lint` | 运行 ESLint 检查 |
| `pnpm typecheck` | 运行 TypeScript 类型检查 |
| `pnpm format` | 使用 Prettier 格式化源文件 |

## 隐私与安全

- API 密钥目前存储在浏览器的 `localStorage` 中。请避免在不受信任或共享设备上使用本应用。
- 翻译请求会直接从浏览器发送到配置的 API Base URL。对于公开部署，建议添加后端代理、身份认证和服务端密钥管理。
- 语言检测可能会调用第三方语言检测服务。请避免输入不应发送给外部服务的敏感内容。
- 应用默认不包含服务端数据存储。设置仅存储在当前浏览器中。
