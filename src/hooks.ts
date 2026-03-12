import { writeFile, readFile, access, mkdir } from "node:fs/promises";
import { join } from "node:path";

const HOOK_SCRIPT = `#!/bin/sh
# openspec: auto-sync AI context files on commit
# To remove: delete this file or run 'openspec hooks --remove'

if command -v npx >/dev/null 2>&1; then
  npx openspec sync --quiet 2>/dev/null
  git add CLAUDE.md .cursorrules GEMINI.md AGENTS.md .aiderrules .windsurfrules .github/copilot-instructions.md 2>/dev/null || true
fi
`;

const HOOK_MARKER = "# openspec:";

export async function installHook(projectRoot: string): Promise<boolean> {
  const hooksDir = join(projectRoot, ".git", "hooks");
  const hookPath = join(hooksDir, "pre-commit");

  // Check if .git exists
  try {
    await access(join(projectRoot, ".git"));
  } catch {
    return false;
  }

  await mkdir(hooksDir, { recursive: true });

  try {
    const existing = await readFile(hookPath, "utf-8");
    if (existing.includes(HOOK_MARKER)) {
      return true; // Already installed
    }
    // Append to existing hook
    await writeFile(hookPath, existing + "\n" + HOOK_SCRIPT, { mode: 0o755 });
  } catch {
    // No existing hook, create new one
    await writeFile(hookPath, HOOK_SCRIPT, { mode: 0o755 });
  }

  return true;
}

export async function removeHook(projectRoot: string): Promise<boolean> {
  const hookPath = join(projectRoot, ".git", "hooks", "pre-commit");

  try {
    const existing = await readFile(hookPath, "utf-8");
    if (!existing.includes(HOOK_MARKER)) {
      return false; // Not our hook
    }

    // Remove our section
    const lines = existing.split("\n");
    const filtered: string[] = [];
    let inOurSection = false;

    for (const line of lines) {
      if (line.includes(HOOK_MARKER)) {
        inOurSection = true;
        continue;
      }
      if (inOurSection && line.startsWith("#")) {
        continue; // Skip our comment lines
      }
      if (inOurSection && line.trim() === "") {
        inOurSection = false;
        continue;
      }
      if (inOurSection && (line.startsWith("if ") || line.startsWith("  ") || line === "fi")) {
        continue;
      }
      inOurSection = false;
      filtered.push(line);
    }

    const result = filtered.join("\n").trim();
    if (result === "" || result === "#!/bin/sh") {
      // Remove empty hook file
      const { unlink } = await import("node:fs/promises");
      await unlink(hookPath);
    } else {
      await writeFile(hookPath, result + "\n", { mode: 0o755 });
    }

    return true;
  } catch {
    return false;
  }
}
