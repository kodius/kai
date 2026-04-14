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

export function buildPresetConfig(
  existing: KaiConfig | null,
  presetId: string,
  instructions: InstalledInstruction[],
): KaiConfig {
  const now = new Date().toISOString();

  return {
    version: 2,
    preset: presetId,
    installedAt: existing?.installedAt ?? now,
    updatedAt: now,
    instructions,
  };
}
