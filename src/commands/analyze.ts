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
  }
}
