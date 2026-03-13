import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { buildContext } from "../../src/scanner/context.js";
import { runDetectors } from "../../src/scanner/detectors/index.js";
import { sampleSourceFiles } from "../../src/scanner/sampler.js";
import { formatMarkdown, formatJson } from "../../src/scanner/formatter.js";

let tempDir: string;

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), "openspec-gen-"));
});

afterEach(async () => {
  await rm(tempDir, { recursive: true });
});

async function setupRealisticProject(root: string) {
  // package.json
  await writeFile(
    join(root, "package.json"),
    JSON.stringify({
      name: "test-app",
      version: "1.0.0",
      scripts: { build: "tsc", test: "vitest run", dev: "vite" },
      dependencies: {
        react: "^18.2.0",
        express: "^4.18.0",
        "@prisma/client": "^5.0.0",
      },
      devDependencies: {
        typescript: "^5.0.0",
        vitest: "^1.0.0",
        eslint: "^8.0.0",
        tailwindcss: "^3.0.0",
        vite: "^5.0.0",
      },
    })
  );

  // Config files
  await writeFile(join(root, "tsconfig.json"), "{}");
  await writeFile(join(root, "vitest.config.ts"), "export default {};");
  await writeFile(join(root, "vite.config.ts"), "export default {};");
  await writeFile(join(root, ".eslintrc.json"), "{}");
  await writeFile(join(root, "package-lock.json"), "{}");

  // Source files
  await mkdir(join(root, "src", "components"), { recursive: true });
  await mkdir(join(root, "src", "api"), { recursive: true });
  await mkdir(join(root, "tests"), { recursive: true });
  await mkdir(join(root, ".github", "workflows"), { recursive: true });

  await writeFile(
    join(root, "src", "index.ts"),
    'import express from "express";\nconst app = express();\n'
  );

  await writeFile(
    join(root, "src", "components", "Header.tsx"),
    `import { useState } from 'react';

export function Header({ title }: { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return <header className="bg-blue-500 p-4">{title}</header>;
}
`
  );

  await writeFile(
    join(root, "src", "api", "users.ts"),
    `import { Router } from 'express';

export const usersRouter = Router();

usersRouter.get('/', async (req, res) => {
  try {
    const users = await db.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});
`
  );

  await writeFile(
    join(root, "tests", "app.test.ts"),
    `import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('should start correctly', () => {
    expect(true).toBe(true);
  });
});
`
  );

  await writeFile(
    join(root, ".github", "workflows", "ci.yml"),
    "name: CI\non: [push]"
  );
}

describe("analyze integration", () => {
  it("should produce full markdown output for a realistic project", async () => {
    await setupRealisticProject(tempDir);

    const ctx = await buildContext(tempDir);
    const scanResult = await runDetectors(ctx);
    scanResult.codeSamples = await sampleSourceFiles(tempDir, scanResult);
    const output = formatMarkdown(scanResult);

    // Tech stack
    expect(output).toContain("# Codebase Analysis — test-app");
    expect(output).toContain("TypeScript");
    expect(output).toContain("React");
    expect(output).toContain("Express");
    expect(output).toContain("Vite");
    expect(output).toContain("Vitest");
    expect(output).toContain("ESLint");
    expect(output).toContain("Tailwind CSS");
    expect(output).toContain("Prisma");
    expect(output).toContain("GitHub Actions");
    expect(output).toContain("npm");

    // Structure
    expect(output).toContain("src/index.ts");

    // Code samples
    expect(output).toContain("## Code Samples");

    // Instructions
    expect(output).toContain("## Instructions for AI Agent");
  });

  it("should produce valid JSON output for a realistic project", async () => {
    await setupRealisticProject(tempDir);

    const ctx = await buildContext(tempDir);
    const scanResult = await runDetectors(ctx);
    scanResult.codeSamples = await sampleSourceFiles(tempDir, scanResult);
    const output = formatJson(scanResult);

    const parsed = JSON.parse(output);
    expect(parsed.projectName).toBe("test-app");
    expect(parsed.languages.length).toBeGreaterThan(0);
    expect(parsed.frameworks.length).toBeGreaterThan(0);
    expect(parsed.codeSamples.length).toBeGreaterThan(0);
    expect(parsed.packageManager).toBe("npm");
  });

  it("should handle empty project gracefully", async () => {
    const ctx = await buildContext(tempDir);
    const scanResult = await runDetectors(ctx);
    scanResult.codeSamples = await sampleSourceFiles(tempDir, scanResult);
    const output = formatMarkdown(scanResult);

    expect(output).toContain("# Codebase Analysis — Project");
    expect(output).toContain("## Instructions for AI Agent");
  });
});
