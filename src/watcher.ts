import { watch } from "chokidar";
import { join } from "node:path";
import chalk from "chalk";
import type { OpenSpecConfig } from "./types.js";
import { compileAll } from "./compiler.js";

export function startWatcher(projectRoot: string, config: OpenSpecConfig): void {
  const modulesDir = join(projectRoot, config.modulesDir).replace(/\\/g, "/");
  const watchPattern = `${modulesDir}/**/*.md`;

  console.log(chalk.blue("👀 Watching for changes in"), chalk.cyan(config.modulesDir));
  console.log(chalk.dim("   Press Ctrl+C to stop.\n"));

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const watcher = watch(watchPattern, {
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 200,
      pollInterval: 50,
    },
  });

  const triggerSync = (event: string, path: string) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const shortPath = path.replace(projectRoot, "").replace(/^[\\/]/, "");
      console.log(chalk.yellow(`\n⚡ ${event}:`), chalk.dim(shortPath));

      try {
        const results = await compileAll(projectRoot, config);
        const synced = results.filter((r) => !r.skipped && !r.error);
        console.log(chalk.green(`✓ Synced ${synced.length} target(s)`));
        for (const r of synced) {
          console.log(chalk.dim(`  → ${r.outputPath} (${r.modulesIncluded.length} modules)`));
        }
      } catch (err) {
        console.error(chalk.red("✗ Sync failed:"), err instanceof Error ? err.message : err);
      }
    }, 300);
  };

  watcher
    .on("change", (path) => triggerSync("Modified", path))
    .on("add", (path) => triggerSync("Added", path))
    .on("unlink", (path) => triggerSync("Removed", path));
}
