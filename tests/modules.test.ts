import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { discoverModules, filterModulesForTarget } from "../src/modules.js";

let tempDir: string;

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), "openspec-test-"));
  await mkdir(join(tempDir, ".openspec", "modules"), { recursive: true });
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
});

describe("discoverModules", () => {
  it("discovers markdown files in modules directory", async () => {
    await writeFile(
      join(tempDir, ".openspec", "modules", "shared.md"),
      "---\nname: Shared\npriority: 10\n---\nShared rules here."
    );
    await writeFile(
      join(tempDir, ".openspec", "modules", "backend.md"),
      "---\nname: Backend\npriority: 20\n---\nBackend rules."
    );

    const modules = await discoverModules(tempDir, ".openspec/modules");

    expect(modules).toHaveLength(2);
    expect(modules[0].slug).toBe("shared");
    expect(modules[0].frontmatter.name).toBe("Shared");
    expect(modules[0].frontmatter.priority).toBe(10);
    expect(modules[0].content).toBe("Shared rules here.");
    expect(modules[1].slug).toBe("backend");
  });

  it("sorts by priority then alphabetically", async () => {
    await writeFile(join(tempDir, ".openspec", "modules", "z-last.md"), "---\npriority: 10\n---\nZ");
    await writeFile(join(tempDir, ".openspec", "modules", "a-first.md"), "---\npriority: 10\n---\nA");
    await writeFile(join(tempDir, ".openspec", "modules", "m-middle.md"), "---\npriority: 5\n---\nM");

    const modules = await discoverModules(tempDir, ".openspec/modules");

    expect(modules[0].slug).toBe("m-middle"); // priority 5
    expect(modules[1].slug).toBe("a-first");  // priority 10, 'a' before 'z'
    expect(modules[2].slug).toBe("z-last");   // priority 10, 'z' after 'a'
  });

  it("defaults priority to 50", async () => {
    await writeFile(join(tempDir, ".openspec", "modules", "no-prio.md"), "No frontmatter priority.");

    const modules = await discoverModules(tempDir, ".openspec/modules");

    expect(modules[0].frontmatter.priority).toBe(50);
  });

  it("returns empty array when no modules exist", async () => {
    const modules = await discoverModules(tempDir, ".openspec/modules");
    expect(modules).toHaveLength(0);
  });
});

describe("filterModulesForTarget", () => {
  it("returns all modules when no filtering is specified", async () => {
    await writeFile(join(tempDir, ".openspec", "modules", "a.md"), "---\nname: A\n---\nA");
    await writeFile(join(tempDir, ".openspec", "modules", "b.md"), "---\nname: B\n---\nB");

    const modules = await discoverModules(tempDir, ".openspec/modules");
    const filtered = filterModulesForTarget(modules, "claude");

    expect(filtered).toHaveLength(2);
  });

  it("respects module-level target whitelist", async () => {
    await writeFile(
      join(tempDir, ".openspec", "modules", "claude-only.md"),
      "---\ntargets: [claude]\n---\nClaude only."
    );
    await writeFile(
      join(tempDir, ".openspec", "modules", "universal.md"),
      "---\nname: Universal\n---\nEverywhere."
    );

    const modules = await discoverModules(tempDir, ".openspec/modules");

    const forClaude = filterModulesForTarget(modules, "claude");
    expect(forClaude).toHaveLength(2);

    const forCursor = filterModulesForTarget(modules, "cursor");
    expect(forCursor).toHaveLength(1);
    expect(forCursor[0].slug).toBe("universal");
  });

  it("respects module-level target blacklist", async () => {
    await writeFile(
      join(tempDir, ".openspec", "modules", "no-aider.md"),
      "---\nexcludeTargets: [aider]\n---\nNot for aider."
    );

    const modules = await discoverModules(tempDir, ".openspec/modules");

    expect(filterModulesForTarget(modules, "claude")).toHaveLength(1);
    expect(filterModulesForTarget(modules, "aider")).toHaveLength(0);
  });

  it("respects config-level explicit module list", async () => {
    await writeFile(join(tempDir, ".openspec", "modules", "a.md"), "A content");
    await writeFile(join(tempDir, ".openspec", "modules", "b.md"), "B content");
    await writeFile(join(tempDir, ".openspec", "modules", "c.md"), "C content");

    const modules = await discoverModules(tempDir, ".openspec/modules");
    const filtered = filterModulesForTarget(modules, "claude", ["a", "c"]);

    expect(filtered).toHaveLength(2);
    expect(filtered.map((m) => m.slug)).toEqual(["a", "c"]);
  });
});
