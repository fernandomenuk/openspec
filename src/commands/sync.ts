import chalk from "chalk";
import { loadConfig } from "../config.js";
import { compileAll } from "../compiler.js";
import { discoverModules } from "../modules.js";
import { TARGET_DESCRIPTIONS } from "../types.js";

export async function runSync(projectRoot: string, options: { quiet?: boolean }): Promise<void> {
  const config = await loadConfig(projectRoot);
  const modules = await discoverModules(projectRoot, config.modulesDir);

  if (modules.length === 0) {
    if (!options.quiet) {
      console.log(chalk.yellow("⚠ No modules found in"), chalk.cyan(config.modulesDir));
      console.log(chalk.dim("  Run 'openspec init' to get started."));
    }
    process.exitCode = 1;
    return;
  }

  if (!options.quiet) {
    console.log(chalk.blue(`Found ${modules.length} module(s):`), chalk.dim(modules.map((m) => m.slug).join(", ")));
    console.log();
  }

  const results = await compileAll(projectRoot, config);

  if (options.quiet) {
    const errors = results.filter((r) => r.error);
    if (errors.length > 0) {
      process.exitCode = 1;
    }
    return;
  }

  for (const result of results) {
    const label = TARGET_DESCRIPTIONS[result.target] ?? result.target;

    if (result.error) {
      console.log(chalk.red(`  ✗ ${label}`));
      console.log(chalk.dim(`    Error: ${result.error}`));
    } else if (result.skipped) {
      console.log(chalk.dim(`  ⊘ ${label} (skipped)`));
    } else {
      const size = result.bytesWritten > 1024
        ? `${(result.bytesWritten / 1024).toFixed(1)}KB`
        : `${result.bytesWritten}B`;
      console.log(
        chalk.green(`  ✓ ${label}`),
        chalk.dim(`→ ${result.outputPath} (${result.modulesIncluded.length} modules, ${size})`)
      );
    }
  }

  const synced = results.filter((r) => !r.skipped && !r.error);
  const errors = results.filter((r) => r.error);

  console.log();
  if (errors.length > 0) {
    console.log(chalk.red(`Synced with ${errors.length} error(s).`));
    process.exitCode = 1;
  } else {
    console.log(chalk.green(`✓ Synced ${synced.length} target(s) successfully.`));
  }
}
