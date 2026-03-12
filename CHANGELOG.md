# Changelog

All notable changes to OpenSpec will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-03-12

### Added

- Core transpiler engine with module discovery and compilation
- 7 target outputs: Claude Code, Cursor, Gemini, GitHub Copilot, Aider, OpenAI Codex, Windsurf
- YAML frontmatter support: `name`, `description`, `priority`, `targets`, `excludeTargets`, `tags`, `globs`
- Per-target renderers with tool-specific formatting
- CLI commands: `init`, `sync`, `watch`, `status`, `hooks`, `clean`
- File watcher with debounced auto-sync (`openspec watch`)
- Git pre-commit hook integration (`openspec hooks`)
- YAML and JSON config file support with multiple search paths
- `openspec init` scaffolding with example modules
- `openspec clean` to remove only openspec-managed generated files
