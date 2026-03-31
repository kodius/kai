import { join } from "node:path";
import { spinner } from "@clack/prompts";
import { AINIT_DIR } from "../utils/constants.js";
import { getInstructionUrl, fetchText } from "../utils/github.js";
import { ensureDir, writeText } from "../utils/fs.js";
import type { InstructionMeta, InstalledInstruction } from "../types/index.js";

export interface DownloadResult {
  instruction: InstalledInstruction;
  success: boolean;
  error?: string;
}

export async function downloadInstructions(
  selections: InstructionMeta[],
): Promise<DownloadResult[]> {
  const s = spinner();
  s.start(`Downloading ${selections.length} instruction set(s)...`);

  const dir = join(process.cwd(), AINIT_DIR);
  await ensureDir(dir);

  const results = await Promise.all(
    selections.map(async (meta): Promise<DownloadResult> => {
      const sourceUrl = getInstructionUrl(meta.filename);

      try {
        const content = await fetchText(sourceUrl);
        const filePath = join(dir, meta.filename);
        await writeText(filePath, content);

        return {
          instruction: {
            id: meta.id,
            filename: meta.filename,
            installedAt: new Date().toISOString(),
            sourceUrl,
          },
          success: true,
        };
      } catch (error) {
        return {
          instruction: {
            id: meta.id,
            filename: meta.filename,
            installedAt: new Date().toISOString(),
            sourceUrl,
          },
          success: false,
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
        };
      }
    }),
  );

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  if (failCount === 0) {
    s.stop(`Downloaded ${successCount} instruction set(s).`);
  } else {
    s.stop(
      `Downloaded ${successCount} of ${selections.length} instruction set(s). ${failCount} failed.`,
    );
  }

  return results;
}
