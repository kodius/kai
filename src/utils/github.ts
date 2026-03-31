import { GITHUB_RAW_BASE, MANIFEST_URL } from "./constants.js";
import type { Manifest } from "../types/index.js";

export function getInstructionUrl(filename: string): string {
  return `${GITHUB_RAW_BASE}/instructions/${filename}`;
}

export async function fetchText(url: string): Promise<string> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}

export async function fetchManifestJson(): Promise<Manifest> {
  const text = await fetchText(MANIFEST_URL);

  const data = JSON.parse(text) as Manifest;

  if (typeof data.version !== "number" || !Array.isArray(data.instructions)) {
    throw new Error("Invalid manifest format");
  }

  return data;
}
