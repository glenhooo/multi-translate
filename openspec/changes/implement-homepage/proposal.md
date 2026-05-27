# Change: Implement Homepage with Translation Workbench

## Why
项目当前仅包含脚手架生成的默认欢迎页面。用户提供了一份完整的产品级设计 HTML，包含导航栏、翻译工作台（双语对照输入/输出）、多服务商翻译结果对比等核心功能布局。需要将设计转化为 React 组件实现。

## What Changes
- 创建 HomePage 页面组件，替代当前的默认欢迎页面
- 实现 TopNavBar 组件（Logo、导航链接、配置按钮）
- 实现 TranslationWorkbench 组件（双栏布局的翻译工作台）
- 实现 SourcePanel 组件（源语言检测、文本输入区、字符限制）
- 实现 TargetPanel 组件（目标语言选择、翻译结果展示）
- 实现 ProviderCard 组件（单个翻译服务商的结果卡片）
- 实现 SwapButton 组件（语言交换按钮）
- 实现 Footer 组件（版权信息和链接）
- 创建颜色主题和字体变量的 Tailwind 配置以匹配设计稿
- 更新 App.tsx 路由结构以渲染 HomePage
- **BREAKING**: 删除当前 App.tsx 中的演示内容

## Impact
- 新增 homepage 能力规范
- 影响文件: App.tsx, src/components/ 下新增多个组件, src/index.css（主题变量更新）, 路由入口逻辑