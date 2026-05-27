## Context
依据用户提供的设计 HTML 文件，将 MultiTranslate 首页从脚手架默认页面改造为完整的翻译工作台。设计采用 Material Design 3 风格的颜色系统和排版方案，包含源语言输入、目标语言选择、多服务商翻译结果对比等功能布局。

## Goals / Non-Goals

**Goals:**
- 还原设计 HTML 的布局结构（导航栏、工作台、页脚），但使用 shadcn 默认主题配色
- 组件化拆分，保持 shadcn/ui 风格
- 响应式布局：桌面端双列并排，移动端上下排列
- 保留 shadcn/ui 原有的 dark mode 切换机制（按 `d` 键）
- 不引入任何自定义颜色变量，完全复用 shadcn `index.css` 中的默认主题 token

**Non-Goals:**
- 翻译 API 调用逻辑（本提案仅实现 UI 层）
- 真实的状态管理（语言选择、翻译结果等 `useState` 占位即可）
- 路由系统（暂无多页面需求，所有组件在同页面渲染）

## Decisions

| 决策 | 描述 | 备选方案 |
|------|------|---------|
| 图标库 | 使用 Material Symbols SVG 组件 (通过 `@material-symbols/svg-xxx` npm 包)，而非 Google Fonts 引用 | Google Fonts CDN（外部依赖，离线不可用） |
| 颜色配置 | 使用 shadcn 默认主题 token（已有 `--primary`, `--secondary`, `--muted`, `--border`, `--background` 等），不添加任何自定义颜色 | 设计稿自定义 Material 3 色板（需要额外 CSS 变量、增加维护成本） |
| 字体 | 使用 shadcn 默认字体（Inter Variable，已在 `index.css` 中通过 `@fontsource-variable/inter` 配置），设计稿中的 Geist 仅作布局参考 | Geist（需额外安装，且与 shadcn 默认不一致） |
| 语言交换按钮 | 桌面端用 absolute 定位在双栏中间，移动端用 flex 行间分隔 | 单独成组件便于控制不同断点 |
| 服务商结果区域 | 使用纵向 flex 列表 + 滚动，每个 ProviderCard 作为独立卡片 | 横向 tabs（不利于多服务商对比） |

## Component Architecture

```
src/
├── App.tsx                        # 根组件，渲染 HomePage
├── index.css                      # 主题变量（已扩展 color/radius/spacing/font）
├── components/
│   ├── homepage/
│   │   ├── home-page.tsx          # 首页页面组件
│   │   ├── top-nav-bar.tsx        # 顶部导航栏
│   │   ├── footer-section.tsx     # 页脚
│   │   ├── translation-workbench.tsx  # 翻译工作台（核心布局）
│   │   ├── source-panel.tsx       # 源语言输入面板
│   │   ├── target-panel.tsx       # 目标语言展示面板
│   │   ├── provider-card.tsx      # 单个服务商翻译结果卡片
│   │   └── swap-button.tsx        # 语言交换按钮
│   ├── ui/                        # shadcn 基础 UI 组件
│   │   ├── button.tsx             # 已有
│   │   ├── textarea.tsx           # 带字符计数的 textarea
│   │   ├── icon-button.tsx        # 图标按钮封装
│   │   └── select.tsx             # 下拉选择组件（shadcn + Radix）
│   └── theme-provider.tsx         # 已有
└── lib/
    ├── utils.ts                   # cn() 工具函数（已有）
    └── icons.ts                   # Material Symbols 图标组件导出
```

## Risks / Trade-offs
- 使用 npm 包安装 Material Symbols 会增加首次构建体积，但比 CDN 引用更可靠、支持 tree-shaking
- 翻译结果区域使用滚动列表而非 tabs，移动端可能较长但更适合多服务商横向对比
- 当前设计中的 "配置" 按钮和 "翻译" 按钮暂无实际功能，实现为 UI 占位
- 使用 shadcn 默认配色意味着与设计稿颜色不完全一致（如按钮背景 `--primary` 而非 `--primary-container`），需以 shadcn 主题表现为准

## Open Questions
- 是否需要独立的 "配置页面" 或弹窗？目前配置按钮仅为 UI 点缀