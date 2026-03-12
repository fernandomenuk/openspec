import { writeFile, access, mkdir } from "node:fs/promises";
import { join } from "node:path";
import chalk from "chalk";
import { loadConfig } from "../config.js";

const TEMPLATE = (name: string, slug: string) => `---
name: ${name}
description:
priority: 50
tags: [${slug}]
---

# ${name}

-
`;

export async function runAdd(
  projectRoot: string,
  moduleName: string,
  options: { priority?: string; targets?: string; tags?: string }
): Promise<void> {
  const config = await loadConfig(projectRoot);
  const modulesDir = join(projectRoot, config.modulesDir);

  // Ensure modules directory exists
  await mkdir(modulesDir, { recursive: true });

  // Slugify the module name for the filename
  const slug = moduleName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const filePath = join(modulesDir, `${slug}.md`);

  // Check if it already exists
  try {
    await access(filePath);
    console.log(chalk.yellow(`Module "${slug}.md" already exists.`));
    console.log(chalk.dim(`  Edit it at: ${config.modulesDir}/${slug}.md`));
    return;
  } catch {
    // Good — doesn't exist
  }

  // Build frontmatter
  const priority = options.priority ? parseInt(options.priority, 10) : 50;
  const tags = options.tags ? options.tags.split(",").map((t) => t.trim()) : [slug];
  const displayName = moduleName
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  let frontmatter = `---\nname: ${displayName}\npriority: ${priority}\ntags: [${tags.join(", ")}]`;

  if (options.targets) {
    const targetList = options.targets.split(",").map((t) => t.trim());
    frontmatter += `\ntargets: [${targetList.join(", ")}]`;
  }

  frontmatter += `\n---`;

  const content = `${frontmatter}\n\n# ${displayName}\n\n- \n`;

  await writeFile(filePath, content, "utf-8");

  console.log(chalk.green(`Created module: ${config.modulesDir}/${slug}.md`));
  console.log(chalk.dim(`  Edit it, then run 'openspec sync' to regenerate.`));
}
