import { existsSync } from "fs";
import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import chalk from "chalk";
import { buildContext } from "../scanner/context.js";
import { runDetectors } from "../scanner/detectors/index.js";
import { sampleSourceFiles } from "../scanner/sampler.js";
import { formatMarkdown, formatJson } from "../scanner/formatter.js";

interface AnalyzeOptions {
  json?: boolean;
  output?: string;
  quiet?: boolean;
}

/**
 * Analyzes the codebase and outputs a structured report for AI rule generation.
 * Automatically prepares the .openspec directory if missing.
 */
export async function runAnalyze(
  root: string,
  options: AnalyzeOptions
): Promise<void> {
  const openspecDir = join(root, ".openspec");
  const modulesDir = join(openspecDir, "modules");

  // Auto-prepare directory structure
  if (!existsSync(modulesDir)) {
    try {
      await mkdir(modulesDir, { recursive: true });
    } catch (err) {
      // Ignore errors if directory exists or cannot be created
    }
  }

  if (!options.quiet) {
    console.log(chalk.blue("Analyzing codebase for rule generation..."));
  }

  // Build context
  const ctx = await buildContext(root);

  // Run all detectors
  const scanResult = await runDetectors(ctx);

  // Sample source files
  const codeSamples = await sampleSourceFiles(root, scanResult);
  scanResult.codeSamples = codeSamples;

  // Format output
  const output = options.json
    ? formatJson(scanResult)
    : formatMarkdown(scanResult);

  // Output
  if (options.output) {
    const outPath = join(root, options.output);
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, output, "utf-8");
    if (!options.quiet) {
      console.log(chalk.green(`Analysis written to ${options.output}`));
    }
  } else {
    console.log(output);
  }

  if (!options.quiet && !options.output) {
    console.log(
      chalk.dim(
        "\nAI agent: Use the analysis above to write module files in .openspec/modules/. Focus on actual patterns found in the samples."
      )
    );
    console.log(
      chalk.cyan("\n🚀 Love OpenSpec? Let others know:") +
      chalk.white("\n   Star us on GitHub: ") + chalk.bold("https://github.com/fernandomenuk/openspec") +
      chalk.white("\n   Share on X: ") + chalk.bold("https://x.com/intent/tweet?text=I%20just%20automated%20my%20AI%20context%20with%20OpenSpec!%20One%20source%20of%20truth%20for%20Claude%2C%20Cursor%2C%20and%20Copilot.%20%F0%9F%9A%80%20https%3A%2F%2Fgithub.com%2Ffernandomenuk%2Fopenspec")
    );
  }
}
