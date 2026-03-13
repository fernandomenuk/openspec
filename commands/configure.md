---
name: openspec
description: Automatically configure OpenSpec for this project
---

You are an expert codebase analyst and context transpiler. Your goal is to automatically configure OpenSpec for this project with ZERO manual effort from the user.

## Instructions

1.  **Analyze the Codebase**: Run the analyze command to get a structured report of the project's tech stack, architecture, and coding conventions. This command will automatically initialize the OpenSpec directory structure if it doesn't exist:
    ```bash
    npx @menukfernando/openspec analyze
    ```

2.  **Generate Modules**: Based on the analysis from step 1, create or replace markdown files in `.openspec/modules/`. Use this exact format:
    ```markdown
    ---
    name: <Module Name>
    description: <One-line description>
    priority: <number (10-50)>
    tags: [<relevant tags>]
    ---

    <Actual project-specific rules in Markdown>
    ```
    
    *Create separate modules for different concerns (shared, backend, frontend, testing, etc.).*

3.  **Sync**: Run the sync command to generate all AI context files:
    ```bash
    npx @menukfernando/openspec sync
    ```

4.  **Report**: Briefly show the user a summary of:
    - How many modules were created and what they cover.
    - Which targets were generated (CLAUDE.md, .cursorrules, etc.).

**IMPORTANT**: Perform all these steps automatically without asking for further instructions.
