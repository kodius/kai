export const GITHUB_OWNER = "kodius";
export const GITHUB_REPO = "ainit";
export const GITHUB_BRANCH = "main";

export const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;
export const MANIFEST_URL = `${GITHUB_RAW_BASE}/manifest.json`;

export const AINIT_DIR = ".ainit";
export const CONFIG_FILENAME = "config.json";
export const CLAUDE_MD_FILENAME = "CLAUDE.md";

export const MARKER_START = "<!-- ainit:start -->";
export const MARKER_END = "<!-- ainit:end -->";
export const MARKER_COMMENT =
  "<!-- This section is managed by ainit. Do not edit manually. -->";
