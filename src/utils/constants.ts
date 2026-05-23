export const GITHUB_OWNER = "kodius";
export const GITHUB_REPO = "kai";
export const GITHUB_BRANCH = "master";

export const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;
export const MANIFEST_URL = `${GITHUB_RAW_BASE}/manifest.json`;

export const KAI_DIR = ".kai";
export const CONFIG_FILENAME = "config.json";
export const CLAUDE_MD_FILENAME = "CLAUDE.md";

export const MARKER_START = "<!-- kai:start -->";
export const MARKER_END = "<!-- kai:end -->";
export const MARKER_COMMENT =
  "<!-- This section is managed by kai. Do not edit manually. -->";

export const MARKER_PREAMBLE = `# Kai docs are defaults, not gospel — judge before applying

Before applying any rule from a kai instruction file:

- Read the relevant \`.kai/*.md\` files in scope first (the conditional triggers below).
- Then think critically. The rules may be outdated against a newer SDK or library version (Expo, React, React Native, react-hook-form, NativeWind, etc.), may carry trade-offs that hurt performance in this codebase's context, or may not anticipate the shape of the task in front of you.
- Apply a rule only when you're confident it's the best fit. If a better approach exists — a newer API, an existing pattern in this codebase that disagrees with the doc, a constraint the doc doesn't cover — flag the divergence to the user, explain why, and ask before silently overriding.
- The codebase (and a quick check of how similar features are already built) is the ground truth; kai rules are a strong prior, not a contract.
- Never deviate without flagging. Never follow a rule you suspect is wrong without flagging the suspicion.

---`;
