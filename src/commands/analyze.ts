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
 * Analyzes the codebase and outputs a structured report for AI rule generation
 */
export async function runAnalyze(
  root: string,
  options: AnalyzeOptions
): Promise<void> {
  const openspecDir = join(root, ".openspec");

  // Auto-initialize if .openspec/ doesn't exist
  if (!existsSync(openspecDir)) {
    if (!options.quiet) {
      console.log(
        chalk.yellow("No .openspec/ directory found. Run `openspec init` first.")
      );
    }
    process.exitCode = 1;
    return;
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
  }
}
