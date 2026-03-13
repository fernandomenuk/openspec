import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import chalk from "chalk";

const PLUGIN_JSON = {
  name: "openspec",
  version: "0.2.0",
  description: "The universal AI context infrastructure. Let AI generate your project rules, we sync them everywhere.",
  author: {
    name: "Menuk Fernando"
  },
  homepage: "https://fernandomenuk.github.io/openspec/",
  repository: "https://github.com/fernandomenuk/openspec.git"
};

const MARKETPLACE_JSON = {
  name: "openspec",
  owner: {
    name: "Menuk Fernando"
  },
  metadata: {
    description: "Official OpenSpec Plugin Marketplace",
    version: "0.2.0"
  },
  plugins: [
    {
      name: "openspec",
      source: {
        path: "./"
      },
      description: "The universal AI context infrastructure. Let AI generate your project rules, we sync them everywhere.",
      category: "productivity",
      tags: ["ai", "context", "rules"]
    }
  ]
};

const COMMAND_CONTENT = `---
name: configure
description: Automatically configure OpenSpec for this project
---

You are an expert codebase analyst and context transpiler. Your goal is to automatically configure OpenSpec for this project with ZERO manual effort from the user.

## Instructions

1.  **Analyze the Codebase**: Run the analyze command to get a structured report of the project's tech stack, architecture, and coding conventions. This command will automatically initialize the OpenSpec directory structure if it doesn't exist:
    \`\`\`bash
    npx @menukfernando/openspec analyze
    \`\`\`

2.  **Generate Modules**: Based on the analysis from step 1, create or replace markdown files in \`.openspec/modules/\` with project-specific rules using the OpenSpec format.

3.  **Sync**: Run \`npx @menukfernando/openspec sync\` to generate all AI context files.

4.  **Report**: Briefly show the user a summary of what was generated.

**IMPORTANT**: Perform all these steps automatically without asking for further instructions.
`;

const SKILL_CONTENT = `---
name: sync
description: Automatically sync and manage OpenSpec rules and AI context files. Use when you need to sync rules or analyze the codebase to generate new rules.
---

# OpenSpec Agent Skill

You are an expert context transpiler. Use this skill to keep AI context files (\`CLAUDE.md\`, \`.cursorrules\`, \`GEMINI.md\`, etc.) in sync with the source of truth in \`.openspec/modules/\`.

## Capabilities

1.  **Sync Rules**: When rules are modified or a target is missing, run:
    \`\`\`bash
    npx @menukfernando/openspec sync
    \`\`\`

2.  **Analyze Codebase**: To understand the project's stack and patterns for generating new rules, run:
    \`\`\`bash
    npx @menukfernando/openspec analyze
    \`\`\`
    This will automatically prepare the project structure if it's missing. Use the output to write or update markdown files in \`.openspec/modules/\`.

3.  **Check Status**: To see which targets are synced:
    \`\`\`bash
    npx @menukfernando/openspec status
    \`\`\`

## Guidelines
- Always prefer \`npx @menukfernando/openspec\` to ensure the latest version is used.
- After syncing, verify the output files to ensure they match the project's requirements.
`;

/**
 * Installs the OpenSpec Claude Plugin (Official Standard)
 */
export async function runInstall(projectRoot: string): Promise<void> {
  const pluginMetaDir = join(projectRoot, ".claude-plugin");
  const commandsDir = join(projectRoot, "commands");
  const skillsDir = join(projectRoot, "skills", "openspec");
  const agentsDir = join(projectRoot, "agents");

  // Create official directory structure
  await mkdir(pluginMetaDir, { recursive: true });
  await mkdir(commandsDir, { recursive: true });
  await mkdir(skillsDir, { recursive: true });
  await mkdir(agentsDir, { recursive: true });

  // Write files
  await writeFile(join(pluginMetaDir, "plugin.json"), JSON.stringify(PLUGIN_JSON, null, 2));
  await writeFile(join(pluginMetaDir, "marketplace.json"), JSON.stringify(MARKETPLACE_JSON, null, 2));
  await writeFile(join(commandsDir, "configure.md"), COMMAND_CONTENT);
  await writeFile(join(skillsDir, "SKILL.md"), SKILL_CONTENT);

  console.log(chalk.green("✓ Installed OpenSpec Claude Plugin!\n"));
  console.log("  How to use in Claude Code:");
  console.log(chalk.cyan("  1. Namespaced Command:"));
  console.log(chalk.bold("     /openspec:configure\n"));
  console.log(chalk.cyan("  2. Automatic Skills:"));
  console.log(chalk.dim("     Claude will now automatically sync your rules using 'analyze' and 'sync'."));
  console.log();
  console.log(chalk.cyan("  Pro Tip (Marketplace Flow):"));
  console.log(chalk.dim("  To allow users to install your plugin like an official one,"));
  console.log(chalk.dim("  they can run these commands inside Claude Code:"));
  console.log(chalk.bold("     /plugin marketplace add fernandomenuk/openspec"));
  console.log(chalk.bold("     /plugin install openspec@openspec\n"));
  console.log(chalk.yellow("  Note: You may need to start Claude Code with:"));
  console.log(chalk.bold("  claude --plugin-dir ."));
}
