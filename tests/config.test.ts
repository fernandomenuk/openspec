import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { loadConfig, findConfigFile } from "../src/config.js";

let tempDir: string;

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), "openspec-test-"));
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
});

describe("findConfigFile", () => {
  it("finds .openspec/config.yaml", async () => {
    await mkdir(join(tempDir, ".openspec"), { recursive: true });
    await writeFile(join(tempDir, ".openspec", "config.yaml"), "version: 1");

    const result = await findConfigFile(tempDir);
    expect(result).toContain("config.yaml");
  });

  it("finds openspec.config.json", async () => {
    await writeFile(join(tempDir, "openspec.config.json"), '{"version": 1}');

    const result = await findConfigFile(tempDir);
    expect(result).toContain("openspec.config.json");
  });

  it("returns null when no config exists", async () => {
    const result = await findConfigFile(tempDir);
    expect(result).toBeNull();
  });

  it("prefers .openspec/config.yaml over openspec.config.yaml", async () => {
    await mkdir(join(tempDir, ".openspec"), { recursive: true });
    await writeFile(join(tempDir, ".openspec", "config.yaml"), "version: 1");
    await writeFile(join(tempDir, "openspec.config.yaml"), "version: 1");

    const result = await findConfigFile(tempDir);
    expect(result).toContain(join(".openspec", "config.yaml"));
  });
});

describe("loadConfig", () => {
  it("returns defaults when no config file exists", async () => {
    const config = await loadConfig(tempDir);

    expect(config.version).toBe(1);
    expect(config.modulesDir).toBe(".openspec/modules");
    expect(config.targets.claude.enabled).toBe(true);
    expect(config.targets.claude.output).toBe("CLAUDE.md");
  });

  it("merges user config with defaults", async () => {
    await mkdir(join(tempDir, ".openspec"), { recursive: true });
    await writeFile(
      join(tempDir, ".openspec", "config.yaml"),
      `
version: 1
targets:
  claude:
    enabled: true
    output: custom-claude.md
  cursor:
    enabled: false
`
    );

    const config = await loadConfig(tempDir);

    expect(config.targets.claude.output).toBe("custom-claude.md");
    expect(config.targets.cursor.enabled).toBe(false);
    // Non-overridden targets should still have defaults
    expect(config.targets.gemini.enabled).toBe(true);
  });

  it("loads JSON config", async () => {
    await mkdir(join(tempDir, ".openspec"), { recursive: true });
    await writeFile(
      join(tempDir, ".openspec", "config.json"),
      JSON.stringify({
        version: 1,
        modulesDir: "custom/modules",
        targets: {
          claude: { enabled: true, output: "AI.md" },
        },
      })
    );

    const config = await loadConfig(tempDir);
    expect(config.modulesDir).toBe("custom/modules");
    expect(config.targets.claude.output).toBe("AI.md");
  });

  it("handles target set to false (disabled shorthand)", async () => {
    await mkdir(join(tempDir, ".openspec"), { recursive: true });
    await writeFile(
      join(tempDir, ".openspec", "config.yaml"),
      `
version: 1
targets:
  aider: false
`
    );

    const config = await loadConfig(tempDir);
    expect(config.targets.aider.enabled).toBe(false);
  });
});
