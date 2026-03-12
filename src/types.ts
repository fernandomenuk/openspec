export interface ModuleFrontmatter {
  name?: string;
  description?: string;
  tags?: string[];
  targets?: string[];        // Only include in these targets (whitelist)
  excludeTargets?: string[]; // Exclude from these targets (blacklist)
  priority?: number;         // Sort order (lower = earlier), default 50
  globs?: string[];          // File patterns this module applies to (for scoped rules)
}

export interface ParsedModule {
  filePath: string;
  slug: string;              // e.g. "frontend" from "frontend.md"
  frontmatter: ModuleFrontmatter;
  content: string;           // Markdown content without frontmatter
}

export interface TargetConfig {
  enabled: boolean;
  output: string;            // Output file path relative to project root
  modules?: string[];        // Explicit module list (overrides default "all")
  header?: string;           // Custom header for this target
  scoped?: boolean;          // Whether this target supports scoped/per-directory rules
}

export interface OpenSpecConfig {
  version: number;
  modulesDir: string;        // Default: ".openspec/modules"
  targets: Record<string, TargetConfig>;
  shared?: {
    header?: string;         // Global header prepended to all outputs
    footer?: string;         // Global footer appended to all outputs
  };
}

export interface SyncResult {
  target: string;
  outputPath: string;
  modulesIncluded: string[];
  bytesWritten: number;
  skipped: boolean;
  error?: string;
}

export const DEFAULT_CONFIG: OpenSpecConfig = {
  version: 1,
  modulesDir: ".openspec/modules",
  targets: {
    claude: {
      enabled: true,
      output: "CLAUDE.md",
    },
    cursor: {
      enabled: true,
      output: ".cursorrules",
    },
    gemini: {
      enabled: true,
      output: "GEMINI.md",
    },
    copilot: {
      enabled: true,
      output: ".github/copilot-instructions.md",
    },
    aider: {
      enabled: true,
      output: ".aiderrules",
    },
    codex: {
      enabled: true,
      output: "AGENTS.md",
    },
    windsurf: {
      enabled: true,
      output: ".windsurfrules",
    },
  },
};

export const TARGET_DESCRIPTIONS: Record<string, string> = {
  claude: "Claude Code (CLAUDE.md)",
  cursor: "Cursor (.cursorrules)",
  gemini: "Gemini (GEMINI.md)",
  copilot: "GitHub Copilot (.github/copilot-instructions.md)",
  aider: "Aider (.aiderrules)",
  codex: "OpenAI Codex (AGENTS.md)",
  windsurf: "Windsurf (.windsurfrules)",
};
