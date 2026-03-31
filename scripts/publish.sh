#!/usr/bin/env bash
set -euo pipefail

# Bump type: patch (default), minor, or major
BUMP="${1:-patch}"

npm version "$BUMP"
pnpm build
npm publish
