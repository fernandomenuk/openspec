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

Every AI tool has its own context file (`CLAUDE.md`, `.cursorrules`, `GEMINI.md`, etc.). When project conventions evolve, you have to manually update **7 different files**. Miss one, and your AI agent starts writing inconsistent code. 

OpenSpec solves this by acting as the **context layer** for your AI agents.

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
  ... (7+ outputs)           ← Generated
```

**One source of truth. Seven outputs. Zero manual work.**

---

## ⚡ Truly Zero Manual Work (Recommended)

OpenSpec is built for AI agents to manage autonomously. You don't even need to initialize the project—the AI does it for you.

### 1. Add to Claude Code
Simply run these commands inside your Claude Code session:
```bash
/plugin marketplace add fernandomenuk/openspec
/plugin install openspec@openspec
```

### 2. Configure Automatically
Run the configuration command:
```bash
/openspec:configure
```
**That's it.** Claude will analyze your codebase, create the rules, and sync them to every tool in your stack.

---

## 🛠️ CLI Workflow (Any Agent)

If you use Cursor, Windsurf, Aider, or any other agent, just tell them:

> *"Run `npx @menukfernando/openspec analyze`, use the output to write modular rules to `.openspec/modules/`, and then run sync."*

OpenSpec's `analyze` command provides a high-density structured report specifically designed for AI agents to understand your codebase conventions instantly.

---

## 🔧 CLI Reference

```
Usage: openspec [command] [options]

Commands:
  analyze           Deep codebase analysis for AI-powered rule generation (auto-inits)
  sync [--quiet]    Compile modules → generate all AI context files
  watch             Watch for module changes, auto-sync on save
  status            Show modules, targets, and sync status
  diff              Preview what changes sync would make
  add <name>        Create a new rule module
  install           Install OpenSpec Claude Code Plugin (Local)
  hooks [--remove]  Install/remove git pre-commit hook
  clean             Remove all generated files (only openspec-managed)
  help [command]    Show help for a command
```

---

## 📋 Roadmap

- [x] Core transpiler engine
- [x] 7 target outputs (Claude, Cursor, Gemini, Copilot, Aider, Codex, Windsurf)
- [x] **Claude Code Plugin & Marketplace support**
- [x] **Truly Zero-Init Workflow**
- [ ] MCP server mode for dynamic context
- [ ] Module inheritance & composition
- [ ] Monorepo support

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Stop copy-pasting AI rules.</strong><br/>
  <code>npx @menukfernando/openspec analyze && npx @menukfernando/openspec sync</code>
</p>
