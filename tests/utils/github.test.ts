import { describe, it, expect } from "vitest";
import { getInstructionUrl } from "../../src/utils/github.js";
import { GITHUB_RAW_BASE } from "../../src/utils/constants.js";

describe("getInstructionUrl", () => {
  it("constructs correct URL for instruction file", () => {
    const url = getInstructionUrl("react.md");
    expect(url).toBe(`${GITHUB_RAW_BASE}/instructions/react.md`);
  });

  it("handles filenames with hyphens", () => {
    const url = getInstructionUrl("be-general.md");
    expect(url).toBe(`${GITHUB_RAW_BASE}/instructions/be-general.md`);
  });
});
