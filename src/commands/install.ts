import { intro, select, log, outro, isCancel } from "@clack/prompts";
import { fetchManifest } from "../services/manifest.js";
import { readConfig, writeConfig, buildPresetConfig } from "../services/config.js";
import {
  downloadInstructions,
  deleteInstructionFiles,
  toLocalFilename,
} from "../services/instructions.js";
import { handleClaudeMd } from "../services/claude-md.js";

export async function installCommand(): Promise<void> {
  intro("kai — install instructions");

  const manifest = await fetchManifest();
  const existingConfig = await readConfig();

  if (manifest.presets.length === 0) {
    log.warning("No presets available.");
    outro("Done.");
    return;
  }

  const options = manifest.presets.map((preset) => ({
    value: preset.id,
    label: preset.name,
    hint: `${preset.description}${existingConfig?.preset === preset.id ? " [installed]" : ""}`,
  }));

  const selectedPresetId = await select({
    message: "Select a preset to install:",
    options,
  });

  if (isCancel(selectedPresetId)) {
    outro("Cancelled.");
    return;
  }

  const preset = manifest.presets.find((p) => p.id === selectedPresetId);
  if (!preset) {
    log.error("Selected preset not found.");
    outro("Done.");
    return;
  }

  // If switching presets, delete files from the old preset that aren't in the new one
  if (existingConfig?.preset && existingConfig.preset !== selectedPresetId) {
    const newInstructionIds = new Set(preset.instructions);
    const toDelete = existingConfig.instructions.filter(
      (i) => !newInstructionIds.has(i.id),
    );
    for (const inst of toDelete) {
      await deleteInstructionFiles(inst.filenames);
    }
  }

  const instructionMetas = preset.instructions
    .map((id) => manifest.instructions.find((i) => i.id === id))
    .filter((i) => i !== undefined);

  const results = await downloadInstructions(instructionMetas);

  const successful = results
    .filter((r) => r.success)
    .map((r) => r.instruction);

  const failed = results.filter((r) => !r.success);

  if (failed.length > 0) {
    for (const f of failed) {
      log.warning(`Failed to download: ${f.instruction.id} — ${f.error}`);
    }
  }

  if (successful.length === 0) {
    log.error("No instruction sets were downloaded successfully.");
    outro("Done.");
    return;
  }

  const newConfig = buildPresetConfig(existingConfig, selectedPresetId, successful);
  await writeConfig(newConfig);

  const instructionRefs = newConfig.instructions.map((inst) => {
    const meta = manifest.instructions.find((m) => m.id === inst.id);
    const indexFilename = toLocalFilename(inst.id, "index.md");
    return { indexFilename, trigger: meta?.trigger ?? "" };
  });
  await handleClaudeMd(instructionRefs);

  outro("Instructions installed successfully!");
}
