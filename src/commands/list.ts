import { intro, log, outro } from "@clack/prompts";
import { fetchManifest } from "../services/manifest.js";
import { readConfig } from "../services/config.js";

export async function listCommand(): Promise<void> {
  intro("kai — available presets");

  const manifest = await fetchManifest();
  const config = await readConfig();

  const installedPreset = config?.preset;

  const grouped = new Map<string, typeof manifest.presets>();

  for (const preset of manifest.presets) {
    const instructionIds = preset.instructions;
    const instructionMetas = instructionIds
      .map((id) => manifest.instructions.find((i) => i.id === id))
      .filter((i) => i !== undefined);
    const category = instructionMetas[0]?.category ?? "general";
    const group = grouped.get(category) ?? [];
    group.push(preset);
    grouped.set(category, group);
  }

  for (const [category, presets] of grouped) {
    log.info(category);

    for (const preset of presets) {
      const installed = installedPreset === preset.id ? " [installed]" : "";
      const fileList = preset.instructions.join(", ");
      log.message(`  ${preset.name} — ${preset.description}${installed}`);
      log.message(`    includes: ${fileList}`);
    }
  }

  outro("Done.");
}
