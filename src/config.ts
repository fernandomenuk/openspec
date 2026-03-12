import { readFile, access } from "node:fs/promises";
import { join } from "node:path";
import yaml from "js-yaml";
import { DEFAULT_CONFIG, type OpenSpecConfig, type TargetConfig } from "./types.js";

const CONFIG_FILENAMES = [
  ".openspec/config.yaml",
  ".openspec/config.yml",
  ".openspec/config.json",
  "openspec.config.yaml",
  "openspec.config.yml",
  "openspec.config.json",
];

export async function findConfigFile(projectRoot: string): Promise<string | null> {
  for (const filename of CONFIG_FILENAMES) {
    const fullPath = join(projectRoot, filename);
    try {
      await access(fullPath);
      return fullPath;
    } catch {
      continue;
    }
  }
  return null;
}

export async function loadConfig(projectRoot: string): Promise<OpenSpecConfig> {
  const configPath = await findConfigFile(projectRoot);

  if (!configPath) {
    return { ...DEFAULT_CONFIG };
  }

  const raw = await readFile(configPath, "utf-8");
  let parsed: Partial<Omit<OpenSpecConfig, "targets"> & { targets?: Record<string, TargetConfig | false> }>;

  if (configPath.endsWith(".json")) {
    parsed = JSON.parse(raw);
  } else {
    parsed = yaml.load(raw) as Partial<OpenSpecConfig>;
  }

  // Deep merge with defaults
  const config: OpenSpecConfig = {
    version: parsed.version ?? DEFAULT_CONFIG.version,
    modulesDir: parsed.modulesDir ?? DEFAULT_CONFIG.modulesDir,
    shared: parsed.shared ?? DEFAULT_CONFIG.shared,
    targets: { ...DEFAULT_CONFIG.targets },
  };

  // Merge target configs
  if (parsed.targets) {
    for (const [key, value] of Object.entries(parsed.targets)) {
      if (value === false || (typeof value === "object" && value?.enabled === false)) {
        // Explicitly disabled
        if (config.targets[key]) {
          config.targets[key].enabled = false;
        }
      } else if (typeof value === "object" && value !== null) {
        config.targets[key] = {
          ...config.targets[key],
          ...value,
          enabled: value.enabled ?? true,
        };
      }
    }
  }

  return config;
}
