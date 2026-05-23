import { describe, it, expect } from "vitest";
import {
  buildManagedBlock,
  replaceManagedBlock,
  hasMarkers,
} from "../../src/services/claude-md.js";
import {
  MARKER_START,
  MARKER_END,
  MARKER_COMMENT,
  MARKER_PREAMBLE,
} from "../../src/utils/constants.js";

describe("buildManagedBlock", () => {
  it("builds block with trigger as prose sentence", () => {
    const result = buildManagedBlock([
      { indexFilename: "react.md", trigger: "When writing React components or hooks" },
    ]);

    expect(result).toBe(
      `${MARKER_START}\n${MARKER_COMMENT}\n\n${MARKER_PREAMBLE}\n\nWhen writing React components or hooks, read \`.kai/react.md\`.\n${MARKER_END}`,
    );
  });

  it("builds block with multiple instructions separated by blank lines", () => {
    const result = buildManagedBlock([
      { indexFilename: "react.md", trigger: "When writing React components or hooks" },
      { indexFilename: "form.md", trigger: "When building or modifying forms" },
    ]);

    expect(result).toContain("When writing React components or hooks, read `.kai/react.md`.");
    expect(result).toContain("When building or modifying forms, read `.kai/form.md`.");
    expect(result).toMatch(new RegExp(`^${escapeRegex(MARKER_START)}`));
    expect(result).toMatch(new RegExp(`${escapeRegex(MARKER_END)}$`));
  });

  it("falls back to @import when trigger is empty", () => {
    const result = buildManagedBlock([{ indexFilename: "react.md", trigger: "" }]);

    expect(result).toContain("@.kai/react.md");
  });

  it("builds block with empty instructions", () => {
    const result = buildManagedBlock([]);

    expect(result).toBe(
      `${MARKER_START}\n${MARKER_COMMENT}\n\n${MARKER_PREAMBLE}\n\n\n${MARKER_END}`,
    );
  });
});

describe("replaceManagedBlock", () => {
  it("replaces existing managed block", () => {
    const existing = [
      "# My Project",
      "",
      MARKER_START,
      "@.kai/old.md",
      MARKER_END,
      "",
      "# Custom stuff",
    ].join("\n");

    const newBlock = buildManagedBlock([
      { indexFilename: "react.md", trigger: "When writing React components or hooks" },
    ]);
    const result = replaceManagedBlock(existing, newBlock);

    expect(result).toContain("# My Project");
    expect(result).toContain("react.md");
    expect(result).not.toContain("@.kai/old.md");
    expect(result).toContain("# Custom stuff");
  });

  it("returns content unchanged when no markers found", () => {
    const content = "# Just a plain CLAUDE.md\n\nSome content.";
    const result = replaceManagedBlock(content, "new block");

    expect(result).toBe(content);
  });

  it("preserves content before and after markers", () => {
    const existing = `before\n${MARKER_START}\nold\n${MARKER_END}\nafter`;
    const newBlock = `${MARKER_START}\nnew\n${MARKER_END}`;
    const result = replaceManagedBlock(existing, newBlock);

    expect(result).toBe(`before\n${MARKER_START}\nnew\n${MARKER_END}\nafter`);
  });
});

describe("hasMarkers", () => {
  it("returns true when both markers present", () => {
    expect(hasMarkers(`${MARKER_START}\ncontent\n${MARKER_END}`)).toBe(true);
  });

  it("returns false when no markers", () => {
    expect(hasMarkers("just content")).toBe(false);
  });

  it("returns false when only start marker", () => {
    expect(hasMarkers(`${MARKER_START}\ncontent`)).toBe(false);
  });

  it("returns false when only end marker", () => {
    expect(hasMarkers(`content\n${MARKER_END}`)).toBe(false);
  });
});

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
