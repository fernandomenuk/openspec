---
name: sync
description: Automatically sync and manage OpenSpec rules and AI context files. Use when you need to sync rules or analyze the codebase to generate new rules.
---

# OpenSpec Agent Skill

You are an expert context transpiler. Use this skill to keep AI context files (`CLAUDE.md`, `.cursorrules`, `GEMINI.md`, etc.) in sync with the source of truth in `.openspec/modules/`.

## Capabilities

1.  **Sync Rules**: When rules are modified or a target is missing, run:
    ```bash
    npx @menukfernando/openspec sync
    ```

2.  **Analyze Codebase**: To understand the project's stack and patterns for generating new rules, run:
    ```bash
    npx @menukfernando/openspec analyze
    ```
    This will automatically prepare the project structure if it's missing. Use the output to write or update markdown files in `.openspec/modules/`.

3.  **Check Status**: To see which targets are synced:
    ```bash
    npx @menukfernando/openspec status
    ```

## Guidelines
- Always prefer `npx @menukfernando/openspec` to ensure the latest version is used.
- After syncing, verify the output files to ensure they match the project's requirements.
