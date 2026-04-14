import { describe, it, expect } from "vitest";
import { toLocalFilename } from "../../src/services/instructions.js";

describe("toLocalFilename", () => {
  it("maps index.md to {id}.md", () => {
    expect(toLocalFilename("react", "index.md")).toBe("react.md");
  });

  it("keeps sub-files as-is", () => {
    expect(toLocalFilename("react", "react-common.md")).toBe("react-common.md");
  });

  it("keeps component files as-is", () => {
    expect(toLocalFilename("form", "form-input.md")).toBe("form-input.md");
  });

  it("handles ids with hyphens", () => {
    expect(toLocalFilename("project-structure", "index.md")).toBe(
      "project-structure.md",
    );
  });
});
