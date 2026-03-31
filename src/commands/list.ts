import { intro, log, outro } from "@clack/prompts";
import { fetchManifest } from "../services/manifest.js";
import { readConfig } from "../services/config.js";

export async function listCommand(): Promise<void> {
  intro("ainit — available instructions");

  const manifest = await fetchManifest();
  const config = await readConfig();

  const installedIds = new Set(
    config?.instructions.map((i) => i.id) ?? [],
  );

  const grouped = new Map<string, typeof manifest.instructions>();

  for (const inst of manifest.instructions) {
    const group = grouped.get(inst.category) ?? [];
    group.push(inst);
    grouped.set(inst.category, group);
  }

  for (const [category, instructions] of grouped) {
    log.info(`${category}`);

    for (const inst of instructions) {
      const installed = installedIds.has(inst.id) ? " [installed]" : "";
      log.message(`  ${inst.name} — ${inst.description}${installed}`);
    }
  }

  outro("Done.");
}
