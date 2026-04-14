import { describe, it, expect } from "vitest";
import { getInstructionUrl } from "../../src/utils/github.js";
import { GITHUB_RAW_BASE } from "../../src/utils/constants.js";

describe("getInstructionUrl", () => {
  it("constructs correct URL for index file", () => {
    const url = getInstructionUrl("react", "index.md");
    expect(url).toBe(`${GITHUB_RAW_BASE}/instructions/react/index.md`);
  });

  it("constructs correct URL for sub-file", () => {
    const url = getInstructionUrl("react", "common.md");
    expect(url).toBe(`${GITHUB_RAW_BASE}/instructions/react/common.md`);
  });

  it("handles ids with hyphens", () => {
    const url = getInstructionUrl("project-structure", "index.md");
    expect(url).toBe(
      `${GITHUB_RAW_BASE}/instructions/project-structure/index.md`,
    );
  });
});
