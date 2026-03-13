<p align="center">
  <a href="README.md">English</a> | 
  <a href="README.zh-CN.md">简体中文</a> | 
  <a href="README.pt-BR.md">Português (Brasil)</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/fernandomenuk/openspec/master/assets/banner.svg" alt="OpenSpec — 通用 AI 上下文基础设施。" width="100%" />
</p>

<p align="center">
  <h1>🛑 停止上下文漂移 (Context Drift)。</h1>
  <strong>通用 AI 上下文基础设施。</strong><br/>
  自动在 <strong>Cursor</strong>、<strong>Claude</strong>、<strong>Gemini</strong> 和 <strong>Windsurf</strong> 之间同步您的项目规则。 
  <br/>单一事实来源。七种输出。零手动工作。
</p>

<p align="center">
  <a href="#-快速开始"><strong>快速开始</strong></a> ·
  <a href="#-为什么选择-openspec"><strong>为什么？</strong></a> ·
  <a href="#%EF%B8%8F-架构"><strong>架构</strong></a> ·
  <a href="#-配置"><strong>配置</strong></a> ·
  <a href="#-贡献"><strong>贡献</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.2.2-6366f1?style=flat-square" alt="版本" />
  <img src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square" alt="许可证" />
  <img src="https://img.shields.io/badge/node-%3E%3D18-3b82f6?style=flat-square" alt="Node" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PRs-欢迎-a78bfa?style=flat-square" alt="欢迎 PR" />
</p>

---

## ✨ 为什么选择 OpenSpec？

如果您使用多个 AI 工具，您就会面临 **上下文碎片化问题**。
- **Cursor** 需要 `.cursorrules`
- **Claude Code** 需要 `CLAUDE.md`
- **Aider** 需要 `.aiderrules`
- **Copilot** 需要 `.github/copilot-instructions.md`

当您的项目规范演进时，您必须手动更新 **7 个以上不同的文件**。漏掉一个，您的 AI 助手就会开始编写不一致的代码。

**OpenSpec 是 AI 上下文的“转译器”。** 您可以在整洁、模块化的 Markdown 文件中定义规则，OpenSpec 会为您的技术栈中的每个 AI 代理生成优化后的格式。

### 🚀 核心特性
- **🤖 AI 原生工作流：** 专为由您的 AI 代理自主管理而设计。
- **🔄 通用同步：** 支持 Cursor, Claude, Gemini, Copilot, Aider, Codex 和 Windsurf。
- **🧠 零初始化配置：** `openspec analyze` 扫描您的代码库，并*告诉* AI 该编写哪些规则。
- **🔌 Claude Code 优先：** 针对最新、最强大的 AI 编程工具的原生插件。
- **🛠️ 监听模式：** 在您保存模块时实时自动同步。

---

## 问题所在

每个 AI 工具都有自己的上下文文件（CLAUDE.md, .cursorrules, GEMINI.md 等）。当项目规范变化时，手动同步极其痛苦且容易出错。

OpenSpec 作为 AI 代理的上下文层来解决这个问题。

## 解决方案

```
.openspec/modules/           ← AI 在这里编写您的规则
  ├── shared.md
  ├── frontend.md
  └── backend.md
        │
        ▼  AI 运行 openspec sync
        │
  CLAUDE.md                  ← 已生成
  .cursorrules               ← 已生成
  GEMINI.md                  ← 已生成
  ... (7+ 种输出)             ← 已生成
```

**单一事实来源。七种输出。零手动工作。**

---

## ⚡ 真正零手动工作 (推荐)

OpenSpec 专为 AI 代理自主管理而构建。您甚至不需要初始化项目——AI 会为您完成。

### 1. 添加到 Claude Code
在您的 Claude Code 会话中运行以下命令：
```bash
/plugin marketplace add fernandomenuk/openspec
/plugin install openspec@openspec
```

### 2. 自动配置
运行配置命令：
```bash
/openspec:configure
```
**就这么简单。** Claude 将分析您的代码库，创建规则，并同步到您技术栈中的每个工具。

---

## 🔧 许可证

MIT — 详见 [LICENSE](LICENSE)。

---

<p align="center">
  <strong>停止复制粘贴 AI 规则。</strong><br/>
  <code>npx @menukfernando/openspec analyze && npx @menukfernando/openspec sync</code>
</p>
