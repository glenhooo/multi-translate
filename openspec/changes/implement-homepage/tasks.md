## 1. 主题配置
- [x] 1.1 无需修改 index.css 主题变量 — 直接使用 shadcn 默认主题 token（`--primary`, `--secondary`, `--muted`, `--border`, `--background`, `--foreground` 等），所有组件引用现有 shadcn CSS 变量
- [x] 1.2 使用已有 lucide-react 图标库（替代 Material Symbols），已内置于 shadcn 生态

## 2. 基础组件（src/components/ui/）
- [x] 2.1 创建 Textarea 基础组件（带字符计数支持）
- [x] 2.2 IconButton 直接用 shadcn Button variant="ghost" size="icon" 替代
- [x] 2.3 语言选择器使用原生 button 实现占位（下拉列表为后续功能）

## 3. 布局组件
- [x] 3.1 创建 TopNavBar 组件（Logo: Languages 图标 + "MultiTranslate"、History/Saved 导航链接、配置按钮）
- [x] 3.2 创建 Footer 组件（版权信息 "© 2026 MultiTranslate. All rights reserved." + Help Center/Privacy Policy/Terms 链接）

## 4. 翻译工作台组件
- [x] 4.1 创建 SourcePanel 组件
  - 语言选择器（"检测语言"按钮 + ChevronDown 图标，X 清除按钮）
  - 文本输入区（Textarea 组件，placeholder="在此输入需要翻译的文本..."）
  - 底部控制区（字符计数 {text.length} / 5000、Mic 图标按钮）
- [x] 4.2 创建 TargetPanel 组件
  - 语言选择器（快捷切换 "英语"/"日语"，ChevronDown 更多语言按钮）
  - 翻译结果展示区（3 个 ProviderCard: Deepseek-v4, Minimax 2.6, OpenAI GPT-4）
- [x] 4.3 创建 ProviderCard 组件
  - 服务商名称标题（首个标记 primary 颜色） + 卡片边框阴影
  - 翻译内容展示区（"等待翻译..." 占位斜体）
  - 操作按钮（Copy、Volume2 图标 + hover 过渡）
- [x] 4.4 创建 SwapButton 组件（桌面端 ArrowLeftRight 水平、移动端 rotate-90 垂直）
- [x] 4.5 创建 TranslationWorkbench 组件（SourcePanel + 桌面 absolute / 移动端 inline SwapButton + TargetPanel + 底部"翻译"按钮）

## 5. 页面集成
- [x] 5.1 创建 HomePage 页面组件（TopNavBar + TranslationWorkbench + Footer）
- [x] 5.2 更新 App.tsx，替换默认演示内容为 HomePage 组件
- [x] 5.3 响应式布局：桌面端 md:flex-row 双栏 + hidden/md:flex 切换、移动端 flex-col 上下排列

## 6. 确认
- [x] 6.1 TypeScript 编译检查通过、vite build 构建成功、ESLint 零新增错误
- [x] 6.2 所有交互元素有 hover:bg-muted hover:text-primary 过渡效果
- [x] 6.3 shadcn 默认暗色模式正常工作（按 `d` 键切换 — 由 ThemeProvider 提供）