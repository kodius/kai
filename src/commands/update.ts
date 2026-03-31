import { intro, log, outro } from "@clack/prompts";
import { readConfig, writeConfig } from "../services/config.js";
import { fetchManifest } from "../services/manifest.js";
import { downloadInstructions } from "../services/instructions.js";
import { handleClaudeMd } from "../services/claude-md.js";

export async function updateCommand(): Promise<void> {
  intro("kai — update instructions");

  const config = await readConfig();

  if (!config || config.instructions.length === 0) {
    log.error("No kai config found. Run `kai install` first.");
    outro("Done.");
    return;
  }

  log.info(
    `Updating ${config.instructions.length} instruction set(s)...`,
  );

  const manifest = await fetchManifest();

  const toUpdate = manifest.instructions.filter((inst) =>
    config.instructions.some((c) => c.id === inst.id),
  );

  if (toUpdate.length === 0) {
    log.warning(
      "None of your installed instructions were found in the current manifest.",
    );
    outro("Done.");
    return;
  }

  const results = await downloadInstructions(toUpdate);

  const successful = results
    .filter((r) => r.success)
    .map((r) => r.instruction);

  const failed = results.filter((r) => !r.success);

  if (failed.length > 0) {
    for (const f of failed) {
      log.warning(`Failed to update: ${f.instruction.id} — ${f.error}`);
    }
  }

  if (successful.length > 0) {
    const updatedConfig = {
      ...config,
      updatedAt: new Date().toISOString(),
      instructions: config.instructions.map((existing) => {
        const updated = successful.find((s) => s.id === existing.id);
        return updated ?? existing;
      }),
    };

    await writeConfig(updatedConfig);

    const allFilenames = updatedConfig.instructions.map((i) => i.filename);
    await handleClaudeMd(allFilenames);
  }

  outro("Instructions updated successfully!");
}
