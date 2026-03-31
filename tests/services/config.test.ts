import { describe, it, expect } from "vitest";
import { mergeConfig } from "../../src/services/config.js";
import type { AinitConfig, InstalledInstruction } from "../../src/types/index.js";

function makeInstruction(id: string): InstalledInstruction {
  return {
    id,
    filename: `${id}.md`,
    installedAt: "2026-01-01T00:00:00.000Z",
    sourceUrl: `https://example.com/${id}.md`,
  };
}

describe("mergeConfig", () => {
  it("creates new config when no existing config", () => {
    const instructions = [makeInstruction("react")];
    const result = mergeConfig(null, instructions);

    expect(result.version).toBe(1);
    expect(result.instructions).toHaveLength(1);
    expect(result.instructions[0]?.id).toBe("react");
    expect(result.installedAt).toBeTruthy();
    expect(result.updatedAt).toBeTruthy();
  });

  it("merges new instructions into existing config", () => {
    const existing: AinitConfig = {
      version: 1,
      installedAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      instructions: [makeInstruction("react")],
    };

    const result = mergeConfig(existing, [makeInstruction("nextjs")]);

    expect(result.instructions).toHaveLength(2);
    expect(result.instructions.map((i) => i.id)).toEqual(["react", "nextjs"]);
    expect(result.installedAt).toBe("2026-01-01T00:00:00.000Z");
  });

  it("deduplicates by id, preferring new instruction", () => {
    const existing: AinitConfig = {
      version: 1,
      installedAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      instructions: [makeInstruction("react")],
    };

    const updated: InstalledInstruction = {
      ...makeInstruction("react"),
      installedAt: "2026-06-01T00:00:00.000Z",
    };

    const result = mergeConfig(existing, [updated]);

    expect(result.instructions).toHaveLength(1);
    expect(result.instructions[0]?.installedAt).toBe("2026-06-01T00:00:00.000Z");
  });
});
