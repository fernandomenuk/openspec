<p align="center">
  <img src="https://raw.githubusercontent.com/fernandomenuk/openspec/master/assets/banner.svg" alt="OpenSpec — The universal AI context infrastructure." width="100%" />
</p>

<p align="center">
  <strong>The universal AI context infrastructure.</strong><br/>
  Let AI generate and manage your project rules, while OpenSpec automatically syncs them to every AI coding tool in your stack.
</p>

<p align="center">
  <a href="#-quickstart"><strong>Quickstart</strong></a> ·
  <a href="#-why-openspec"><strong>Why?</strong></a> ·
  <a href="#%EF%B8%8F-architecture"><strong>Architecture</strong></a> ·
  <a href="#-configuration"><strong>Config</strong></a> ·
  <a href="#-contributing"><strong>Contributing</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.2.0-6366f1?style=flat-square" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/node-%3E%3D18-3b82f6?style=flat-square" alt="Node" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PRs-welcome-a78bfa?style=flat-square" alt="PRs Welcome" />
</p>

---

## The Problem

Every AI tool has its own context file:

| Tool | File |
|------|------|
| Claude Code | `CLAUDE.md` |
| Cursor | `.cursorrules` |
| Google Gemini | `GEMINI.md` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Aider | `.aiderrules` |
| OpenAI Codex | `AGENTS.md` |
| Windsurf | `.windsurfrules` |

When project conventions evolve, you have to copy-paste updates into **7 different files**. Miss one, and an AI agent starts writing inconsistent code. Your team now has a **context fragmentation** problem. OpenSpec solves this by acting as the context infrastructure *for* your AI agents.

## The Solution

```
.openspec/modules/           ← AI writes your rules HERE
  ├── shared.md
  ├── frontend.md
  └── backend.md
        │
        ▼  AI runs openspec sync
        │
  CLAUDE.md                  ← Generated
  .cursorrules               ← Generated
  GEMINI.md                  ← Generated
  AGENTS.md                  ← Generated
  .aiderrules                ← Generated
  .windsurfrules             ← Generated
  .github/copilot-instructions.md  ← Generated
```

**One source of truth. Seven outputs. Zero manual work.**

---

## ⚡ Quickstart (Agent-First Workflow)

OpenSpec is built for AI agents to manage autonomously.

```bash
# 1. Install & Initialize
npm install -g @menukfernando/openspec
npx @menukfernando/openspec init

# 2. Add the OpenSpec plugin to Claude Code (Recommended)
openspec install    
# Then in Claude Code, run: /openspec:configure

# (Advanced) Install via Marketplace in Claude Code:
# /plugin marketplace add fernandomenuk/openspec
# /plugin install openspec@openspec

# Option B: Use with any other AI Agent (Cursor, Gemini, etc.)
# Simply tell your AI agent:
# "Run 'openspec analyze', write rules to .openspec/modules/, then run 'openspec sync'."
```

That's it. Every AI tool in your stack now reads the same rules, managed entirely by your primary AI assistant.

---

## 🧠 Why OpenSpec?

<table>
<tr>
<td width="50%">

### Without OpenSpec

```
❌ Ask Claude to update CLAUDE.md
❌ Forget to update .cursorrules
❌ Cursor AI writes conflicting code
❌ 2 hours debugging AI-generated drift
❌ Team argues about which file is "correct"
```

</td>
<td width="50%">

### With OpenSpec

```
✅ Ask Claude to update project rules
✅ Claude uses OpenSpec Agent Skill to sync
✅ All 7 files updated instantly
✅ Every AI tool follows the same conventions
✅ Single source of truth in version control
```

</td>
</tr>
</table>

---

## 📖 How It Works

### 1. AI-Driven Rule Generation

Your AI agent analyzes your codebase and writes modular Markdown files into `.openspec/modules/`. Use the `analyze` command to give your agent the context it needs:

```bash
openspec analyze
```

### 2. Smart Frontmatter

Each module can control exactly where it appears:

```yaml
---
name: React Conventions
priority: 20

# Only include this module in Cursor and Claude outputs:
targets: [cursor, claude]

# Or exclude from specific targets:
excludeTargets: [aider]

# Hint which files this rule applies to:
globs: ["src/components/**/*.tsx"]

tags: [frontend, react]
---
```

---

## 🔧 CLI Reference

```
Usage: openspec [command] [options]

Commands:
  init              Scaffold .openspec/ for AI agents
  analyze           Deep codebase analysis for AI-powered rule generation
  sync [--quiet]    Compile modules → generate all AI context files
  watch             Watch for module changes, auto-sync on save
  status            Show modules, targets, and sync status
  diff              Preview what changes sync would make
  add <name>        Create a new rule module (--priority, --targets, --tags)
  install           Install OpenSpec Claude Code Plugin
  hooks [--remove]  Install/remove git pre-commit hook
  clean             Remove all generated files (only openspec-managed)
  help [command]    Show help for a command
```

### `openspec init`

Creates the `.openspec/` directory for your AI agents to populate.

### `openspec analyze`

Performs deep codebase analysis and outputs a structured context document optimized for AI agents to write rules.

```bash
$ openspec analyze

Analyzing codebase...
# Codebase Analysis — my-app
...
## Instructions for AI Agent
Using the analysis above, generate OpenSpec module files...
```

**Typical workflow with an AI agent:**

```bash
# In Claude Code, run:
/openspec:configure

# Or manually:
openspec analyze    # Agent reads the output
# → Agent writes .openspec/modules/*.md
openspec sync       # Generate all 7 AI context files
```

### `openspec sync`

Reads all modules, filters per target, and generates the output context files.

### `openspec install`

Installs the **OpenSpec Claude Plugin**. This adds the namespaced command `/openspec:configure` and a model-invoked **Skill** that allows Claude to automatically sync rules when they change.

---

## 🗂️ Project Structure

```
openspec/
├── .claude-plugin/      # Claude Plugin Metadata (plugin.json, marketplace.json)
├── commands/            # Claude Plugin Commands (/openspec:configure)
├── skills/              # Claude Agent Skills (automatic sync)
├── src/
│   ├── cli.ts           # CLI entry point
│   ├── compiler.ts       # Core compilation engine
│   ├── analyze/         # Codebase analysis logic
│   └── targets/         # Per-target renderers
├── .openspec/            # Configuration
└── package.json
```

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

```bash
git clone https://github.com/fernandomenuk/openspec.git
cd openspec
npm install
npm run dev -- init
npm run dev -- sync
```

---

## 📋 Roadmap

- [x] Core transpiler engine
- [x] 7 target outputs (Claude, Cursor, Gemini, Copilot, Aider, Codex, Windsurf)
- [x] **Claude Code Plugin & Marketplace support**
- [x] **Agent-First Workflow (Zero Manual Work)**
- [ ] MCP server mode for dynamic context
- [ ] Module inheritance & composition
- [ ] Monorepo support

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Stop copy-pasting AI rules.</strong><br/>
  <code>npx @menukfernando/openspec init && npx @menukfernando/openspec sync</code>
</p>
