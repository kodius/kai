import { join } from "node:path";
import { KAI_DIR, CONFIG_FILENAME } from "../utils/constants.js";
import { fileExists, readText, writeText, ensureDir } from "../utils/fs.js";
import type { KaiConfig, InstalledInstruction } from "../types/index.js";

function getConfigPath(): string {
  return join(process.cwd(), KAI_DIR, CONFIG_FILENAME);
}

export async function readConfig(): Promise<KaiConfig | null> {
  const configPath = getConfigPath();

  if (!(await fileExists(configPath))) {
    return null;
  }

  const text = await readText(configPath);
  return JSON.parse(text) as KaiConfig;
}

export async function writeConfig(config: KaiConfig): Promise<void> {
  const dir = join(process.cwd(), KAI_DIR);
  await ensureDir(dir);

  const configPath = getConfigPath();
  await writeText(configPath, JSON.stringify(config, null, 2));
}

export function mergeConfig(
  existing: KaiConfig | null,
  newInstructions: InstalledInstruction[],
): KaiConfig {
  const now = new Date().toISOString();

  if (!existing) {
    return {
      version: 1,
      preset: "",
      installedAt: now,
      updatedAt: now,
      instructions: newInstructions,
    };
  }

  const merged = new Map<string, InstalledInstruction>();

  for (const inst of existing.instructions) {
    merged.set(inst.id, inst);
  }

  for (const inst of newInstructions) {
    merged.set(inst.id, inst);
  }

  return {
    ...existing,
    updatedAt: now,
    instructions: Array.from(merged.values()),
  };
}

export function buildPresetConfig(
  existing: KaiConfig | null,
  presetId: string,
  instructions: InstalledInstruction[],
): KaiConfig {
  const now = new Date().toISOString();

  return {
    version: 1,
    preset: presetId,
    installedAt: existing?.installedAt ?? now,
    updatedAt: now,
    instructions,
  };
}
