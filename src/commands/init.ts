import { writeFile, mkdir, access } from "node:fs/promises";
import { join } from "node:path";
import chalk from "chalk";

const DEFAULT_CONFIG_YAML = `# openspec configuration
# Docs: https://github.com/user/openspec
version: 1

# Directory containing your rule modules
modulesDir: ".openspec/modules"

# Target AI tools to sync to
targets:
  claude:
    enabled: true
    output: CLAUDE.md

  cursor:
    enabled: true
    output: .cursorrules

  gemini:
    enabled: true
    output: GEMINI.md

  copilot:
    enabled: true
    output: .github/copilot-instructions.md

  aider:
    enabled: true
    output: .aiderrules

  codex:
    enabled: true
    output: AGENTS.md

  windsurf:
    enabled: true
    output: .windsurfrules
`;

export async function runInit(projectRoot: string): Promise<void> {
  const openspecDir = join(projectRoot, ".openspec");
  const modulesDir = join(openspecDir, "modules");

  // Check if already initialized
  try {
    await access(openspecDir);
    console.log(chalk.yellow("⚠ .openspec/ directory already exists."));
    console.log(chalk.dim("  Delete it first if you want to reinitialize."));
    return;
  } catch {
    // Good, doesn't exist yet
  }

  // Create directories
  await mkdir(modulesDir, { recursive: true });

  // Write config
  await writeFile(join(openspecDir, "config.yaml"), DEFAULT_CONFIG_YAML);

  console.log(chalk.green("✓ Initialized openspec!\n"));
  console.log("  Created:");
  console.log(chalk.dim("  .openspec/config.yaml        — Configuration"));
  console.log(chalk.dim("  .openspec/modules/           — Directory for AI to generate rules"));
  console.log();
  console.log("  Next steps for your AI Agent:");
  console.log(chalk.cyan("  1. Run 'openspec install' to install the OpenSpec Claude Code plugin"));
  console.log(chalk.cyan("     Then run /openspec:configure in Claude Code to auto-generate modules"));
  console.log(chalk.cyan("  2. Or have your AI agent run 'openspec analyze' to analyze the codebase"));
  console.log(chalk.cyan("  3. Your AI agent should then run 'openspec sync' to generate all context files"));
}
