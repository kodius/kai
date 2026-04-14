import { describe, it, expect } from "vitest";
import { buildPresetConfig } from "../../src/services/config.js";
import type { KaiConfig, InstalledInstruction } from "../../src/types/index.js";

function makeInstruction(id: string): InstalledInstruction {
  return {
    id,
    filenames: [`${id}.md`, `${id}-common.md`],
    installedAt: "2026-01-01T00:00:00.000Z",
  };
}

describe("buildPresetConfig", () => {
  it("creates new config when no existing config", () => {
    const instructions = [makeInstruction("react")];
    const result = buildPresetConfig(null, "nextjs", instructions);

    expect(result.version).toBe(2);
    expect(result.preset).toBe("nextjs");
    expect(result.instructions).toHaveLength(1);
    expect(result.instructions[0]?.id).toBe("react");
    expect(result.instructions[0]?.filenames).toEqual(["react.md", "react-common.md"]);
  });

  it("preserves original installedAt when existing config", () => {
    const existing: KaiConfig = {
      version: 2,
      preset: "nextjs",
      installedAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      instructions: [makeInstruction("react")],
    };

    const result = buildPresetConfig(existing, "nextjs", [makeInstruction("react")]);

    expect(result.installedAt).toBe("2026-01-01T00:00:00.000Z");
  });

  it("replaces all instructions with provided list", () => {
    const existing: KaiConfig = {
      version: 2,
      preset: "nextjs",
      installedAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      instructions: [makeInstruction("react"), makeInstruction("types")],
    };

    const result = buildPresetConfig(existing, "nextjs", [makeInstruction("form")]);

    expect(result.instructions).toHaveLength(1);
    expect(result.instructions[0]?.id).toBe("form");
  });
});
