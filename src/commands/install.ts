import { intro, multiselect, log, outro, isCancel } from "@clack/prompts";
import { fetchManifest } from "../services/manifest.js";
import { readConfig, writeConfig, mergeConfig } from "../services/config.js";
import { downloadInstructions } from "../services/instructions.js";
import { handleClaudeMd } from "../services/claude-md.js";

export async function installCommand(): Promise<void> {
  intro("kai — install instructions");

  const manifest = await fetchManifest();
  const existingConfig = await readConfig();

  const installedIds = new Set(
    existingConfig?.instructions.map((i) => i.id) ?? [],
  );

  const options = manifest.instructions.map((inst) => ({
    value: inst.id,
    label: inst.name,
    hint: `${inst.description}${installedIds.has(inst.id) ? " [installed]" : ""}`,
  }));

  if (options.length === 0) {
    log.warning("No instruction sets available.");
    outro("Done.");
    return;
  }

  const selected = await multiselect({
    message: "Which instruction sets would you like to install?",
    options,
    required: true,
  });

  if (isCancel(selected)) {
    outro("Cancelled.");
    return;
  }

  const selectedMeta = manifest.instructions.filter((inst) =>
    selected.includes(inst.id),
  );

  const results = await downloadInstructions(selectedMeta);

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

  const newConfig = mergeConfig(existingConfig, successful);
  await writeConfig(newConfig);

  const allFilenames = newConfig.instructions.map((i) => i.filename);
  await handleClaudeMd(allFilenames);

  outro("Instructions installed successfully!");
}
