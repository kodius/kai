import { join } from "node:path";
import { spinner } from "@clack/prompts";
import { KAI_DIR } from "../utils/constants.js";
import { getInstructionUrl, fetchText } from "../utils/github.js";
import { ensureDir, writeText, deleteFile, fileExists } from "../utils/fs.js";
import type { InstructionMeta, InstalledInstruction } from "../types/index.js";

export interface DownloadResult {
  instruction: InstalledInstruction;
  success: boolean;
  error?: string;
}

/**
 * Maps a source filename to its local .kai/ filename.
 * The index file (e.g. react.md) keeps its name.
 * Sub-files get prefixed with the instruction id (e.g. react-common.md).
 */
export function toLocalFilename(
  instructionId: string,
  sourceFilename: string,
): string {
  if (sourceFilename === "index.md") {
    return `${instructionId}.md`;
  }
  return sourceFilename;
}

export async function downloadInstructions(
  selections: InstructionMeta[],
): Promise<DownloadResult[]> {
  const s = spinner();
  const totalFiles = selections.reduce((n, m) => n + m.files.length, 0);
  s.start(`Downloading ${totalFiles} file(s)...`);

  const dir = join(process.cwd(), KAI_DIR);
  await ensureDir(dir);

  const results = await Promise.all(
    selections.map(async (meta): Promise<DownloadResult> => {
      try {
        const localFilenames: string[] = [];

        for (const file of meta.files) {
          const sourceUrl = getInstructionUrl(meta.id, file);
          const localName = toLocalFilename(meta.id, file);
          const content = await fetchText(sourceUrl);
          await writeText(join(dir, localName), content);
          localFilenames.push(localName);
        }

        return {
          instruction: {
            id: meta.id,
            filenames: localFilenames,
            installedAt: new Date().toISOString(),
          },
          success: true,
        };
      } catch (error) {
        return {
          instruction: {
            id: meta.id,
            filenames: [],
            installedAt: new Date().toISOString(),
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

export async function deleteInstructionFiles(
  filenames: string[],
): Promise<void> {
  for (const filename of filenames) {
    const filePath = join(process.cwd(), KAI_DIR, filename);
    if (await fileExists(filePath)) {
      await deleteFile(filePath);
    }
  }
}
