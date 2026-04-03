import { intro, log, outro } from "@clack/prompts";
import { readConfig, writeConfig, buildPresetConfig } from "../services/config.js";
import { fetchManifest } from "../services/manifest.js";
import { downloadInstructions, deleteInstruction } from "../services/instructions.js";
import { handleClaudeMd } from "../services/claude-md.js";

export async function updateCommand(): Promise<void> {
  intro("kai — update instructions");

  const config = await readConfig();

  if (!config || !config.preset) {
    log.error("No kai config found. Run `kai install` first.");
    outro("Done.");
    return;
  }

  const manifest = await fetchManifest();

  const preset = manifest.presets.find((p) => p.id === config.preset);
  if (!preset) {
    log.error(
      `Preset "${config.preset}" was not found in the current manifest. Run \`kai install\` to select a new preset.`,
    );
    outro("Done.");
    return;
  }

  const installedIds = new Set(config.instructions.map((i) => i.id));
  const presetIds = new Set(preset.instructions);

  const toAdd = preset.instructions.filter((id) => !installedIds.has(id));
  const toRemove = config.instructions.filter((i) => !presetIds.has(i.id));
  const toUpdate = preset.instructions.filter((id) => installedIds.has(id));

  // Delete removed files
  for (const inst of toRemove) {
    await deleteInstruction(inst.filename);
  }

  // Download new + existing files
  const idsToDownload = [...toUpdate, ...toAdd];
  const instructionMetas = idsToDownload
    .map((id) => manifest.instructions.find((i) => i.id === id))
    .filter((i) => i !== undefined);

  const results = await downloadInstructions(instructionMetas);

  const successful = results
    .filter((r) => r.success)
    .map((r) => r.instruction);

  const failed = results.filter((r) => !r.success);

  if (failed.length > 0) {
    for (const f of failed) {
      log.warning(`Failed to update: ${f.instruction.id} — ${f.error}`);
    }
  }

  const addedCount = successful.filter((s) => toAdd.includes(s.id)).length;
  const updatedCount = successful.filter((s) => toUpdate.includes(s.id)).length;
  const removedCount = toRemove.length;

  const parts: string[] = [];
  if (updatedCount > 0) parts.push(`${updatedCount} updated`);
  if (addedCount > 0) parts.push(`${addedCount} added`);
  if (removedCount > 0) parts.push(`${removedCount} removed`);
  if (parts.length > 0) log.info(parts.join(", "));

  const updatedConfig = buildPresetConfig(config, config.preset, successful);
  await writeConfig(updatedConfig);

  const allFilenames = updatedConfig.instructions.map((i) => i.filename);
  await handleClaudeMd(allFilenames);

  outro("Instructions updated successfully!");
}
