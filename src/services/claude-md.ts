import { join } from "node:path";
import { select, log, isCancel } from "@clack/prompts";
import {
  CLAUDE_MD_FILENAME,
  KAI_DIR,
  MARKER_START,
  MARKER_END,
  MARKER_COMMENT,
} from "../utils/constants.js";
import { fileExists, readText, writeText } from "../utils/fs.js";
import type { ClaudeMdPlacement } from "../types/index.js";

export interface InstructionRef {
  filename: string;
  trigger: string;
}

export function buildManagedBlock(instructions: InstructionRef[]): string {
  const lines = instructions
    .map((i) =>
      i.trigger
        ? `${i.trigger}, read \`.kai/${i.filename}\`.`
        : `@${KAI_DIR}/${i.filename}`,
    )
    .join("\n\n");

  return `${MARKER_START}\n${MARKER_COMMENT}\n${lines}\n${MARKER_END}`;
}

export function replaceManagedBlock(
  content: string,
  newBlock: string,
): string {
  const startIdx = content.indexOf(MARKER_START);
  const endIdx = content.indexOf(MARKER_END);

  if (startIdx === -1 || endIdx === -1) {
    return content;
  }

  const before = content.slice(0, startIdx);
  const after = content.slice(endIdx + MARKER_END.length);

  return `${before}${newBlock}${after}`;
}

export function hasMarkers(content: string): boolean {
  return content.includes(MARKER_START) && content.includes(MARKER_END);
}

async function askPlacement(): Promise<ClaudeMdPlacement> {
  const placement = await select({
    message:
      "CLAUDE.md already exists. Where should the kai block be placed?",
    options: [
      {
        value: "top",
        label: "Top",
        hint: "Add kai imports at the top, keep existing content below",
      },
      {
        value: "bottom",
        label: "Bottom",
        hint: "Keep existing content, add kai imports at the bottom",
      },
      {
        value: "replace",
        label: "Replace",
        hint: "Replace entire CLAUDE.md with kai managed content",
      },
    ],
  });

  if (isCancel(placement)) {
    process.exit(0);
  }

  return placement as ClaudeMdPlacement;
}

export async function handleClaudeMd(
  instructions: InstructionRef[],
): Promise<void> {
  const claudeMdPath = join(process.cwd(), CLAUDE_MD_FILENAME);
  const block = buildManagedBlock(instructions);

  const exists = await fileExists(claudeMdPath);

  if (!exists) {
    await writeText(claudeMdPath, block + "\n");
    log.success("Created CLAUDE.md with kai instructions.");
    return;
  }

  const existing = await readText(claudeMdPath);

  if (hasMarkers(existing)) {
    const updated = replaceManagedBlock(existing, block);
    await writeText(claudeMdPath, updated);
    log.success("Updated kai block in CLAUDE.md.");
    return;
  }

  const placement = await askPlacement();

  let content: string;

  switch (placement) {
    case "top":
      content = `${block}\n\n${existing}`;
      break;
    case "bottom":
      content = `${existing}\n\n${block}\n`;
      break;
    case "replace":
      content = `${block}\n`;
      break;
  }

  await writeText(claudeMdPath, content);
  log.success("Updated CLAUDE.md with kai instructions.");
}
