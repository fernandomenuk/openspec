<p align="center">
  <a href="README.md">English</a> | 
  <a href="README.zh-CN.md">简体中文</a> | 
  <a href="README.pt-BR.md">Português (Brasil)</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/fernandomenuk/openspec/master/assets/banner.svg" alt="OpenSpec — A infraestrutura universal de contexto para IA." width="100%" />
</p>

<p align="center">
  <h1>🛑 Pare com a "Deriva de Contexto".</h1>
  <strong>A infraestrutura universal de contexto para IA.</strong><br/>
  Sincronize as regras do seu projeto entre <strong>Cursor</strong>, <strong>Claude</strong>, <strong>Gemini</strong> e <strong>Windsurf</strong> automaticamente. 
  <br/>Uma única fonte da verdade. Sete saídas. Zero trabalho manual.
</p>

<p align="center">
  <a href="#-quickstart"><strong>Início Rápido</strong></a> ·
  <a href="#-por-que-openspec"><strong>Por que?</strong></a> ·
  <a href="#%EF%B8%8F-arquitetura"><strong>Arquitetura</strong></a> ·
  <a href="#-configuração"><strong>Config</strong></a> ·
  <a href="#-contribuindo"><strong>Contribuição</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.2.2-6366f1?style=flat-square" alt="Versão" />
  <img src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square" alt="Licença" />
  <img src="https://img.shields.io/badge/node-%3E%3D18-3b82f6?style=flat-square" alt="Node" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PRs-welcome-a78bfa?style=flat-square" alt="PRs Welcome" />
</p>

---

## ✨ Por que OpenSpec?

Se você usa mais de uma ferramenta de IA, você tem um **problema de fragmentação de contexto**. 
- **Cursor** usa `.cursorrules`
- **Claude Code** usa `CLAUDE.md`
- **Aider** usa `.aiderrules`
- **Copilot** usa `.github/copilot-instructions.md`

Quando as convenções do seu projeto evoluem, você tem que atualizar manualmente **mais de 7 arquivos diferentes**. Esqueça um, e seu agente de IA começará a escrever código inconsistente.

**OpenSpec é o "Transpiler" para contexto de IA.** Você define suas regras em arquivos Markdown modulares e limpos, e o OpenSpec gera o formato otimizado para cada agente de IA na sua stack.

### 🚀 Principais Recursos
- **🤖 Workflow AI-Native:** Projetado para ser gerenciado *pelo* seu agente de IA.
- **🔄 Sync Universal:** Suporte para Cursor, Claude, Gemini, Copilot, Aider, Codex e Windsurf.
- **🧠 Configuração Zero-Knowledge:** `openspec analyze` varre sua base de código e *diz* à IA quais regras escrever.
- **🔌 Claude Code First:** Plugin nativo para a ferramenta de codificação por IA mais poderosa do momento.
- **🛠️ Watch Mode:** Atualiza seus arquivos de contexto em tempo real enquanto você edita seus módulos.

---

## O Problema

Cada ferramenta de IA tem seu próprio arquivo de contexto. Manter todos sincronizados manualmente é um pesadelo que leva a erros e código fora dos padrões. O OpenSpec resolve isso atuando como a camada de contexto para seus agentes.

## A Solução

```
.openspec/modules/           ← A IA escreve suas regras AQUI
  ├── shared.md
  ├── frontend.md
  └── backend.md
        │
        ▼  A IA executa openspec sync
        │
  CLAUDE.md                  ← Gerado
  .cursorrules               ← Gerado
  GEMINI.md                  ← Gerado
  ... (7+ saídas)            ← Gerado
```

**Uma única fonte da verdade. Sete saídas. Zero trabalho manual.**

---

## ⚡ Trabalho Manual Zero (Recomendado)

O OpenSpec foi feito para agentes de IA gerenciarem autonomamente.

### 1. Adicione ao Claude Code
Execute estes comandos na sua sessão do Claude Code:
```bash
/plugin marketplace add fernandomenuk/openspec
/plugin install openspec@openspec
```

### 2. Configure Automaticamente
Execute o comando:
```bash
/openspec:configure
```
**Pronto.** O Claude analisará seu código, criará as regras e sincronizará tudo.

---

## 📄 Licença

MIT — veja [LICENSE](LICENSE) para detalhes.

---

<p align="center">
  <strong>Pare de copiar e colar regras de IA.</strong><br/>
  <code>npx @menukfernando/openspec analyze && npx @menukfernando/openspec sync</code>
</p>
