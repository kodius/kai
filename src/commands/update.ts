import { intro, log, outro } from "@clack/prompts";
import { readConfig, writeConfig, buildPresetConfig } from "../services/config.js";
import { fetchManifest } from "../services/manifest.js";
import {
  downloadInstructions,
  deleteInstructionFiles,
  toLocalFilename,
} from "../services/instructions.js";
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

  const presetIds = new Set(preset.instructions);

  // Delete files from instructions no longer in the preset
  const toRemove = config.instructions.filter((i) => !presetIds.has(i.id));
  for (const inst of toRemove) {
    await deleteInstructionFiles(inst.filenames);
  }

  // Download all instructions in the preset (overwrite)
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
      log.warning(`Failed to update: ${f.instruction.id} — ${f.error}`);
    }
  }

  const removedCount = toRemove.length;
  if (removedCount > 0) {
    log.info(`${removedCount} instruction(s) removed.`);
  }

  const updatedConfig = buildPresetConfig(config, config.preset, successful);
  await writeConfig(updatedConfig);

  const instructionRefs = updatedConfig.instructions.map((inst) => {
    const meta = manifest.instructions.find((m) => m.id === inst.id);
    const indexFilename = toLocalFilename(inst.id, "index.md");
    return { indexFilename, trigger: meta?.trigger ?? "" };
  });
  await handleClaudeMd(instructionRefs);

  outro("Instructions updated successfully!");
}
