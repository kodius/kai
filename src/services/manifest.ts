import { spinner } from "@clack/prompts";
import { fetchManifestJson } from "../utils/github.js";
import type { Manifest } from "../types/index.js";

export async function fetchManifest(): Promise<Manifest> {
  const s = spinner();
  s.start("Fetching available instructions...");

  try {
    const manifest = await fetchManifestJson();
    s.stop("Instructions fetched successfully.");
    return manifest;
  } catch (error) {
    s.stop("Failed to fetch instructions.");

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Could not connect to GitHub. Check your internet connection.",
      );
    }

    throw new Error(
      "Could not fetch instruction manifest. The kai repository may have moved.",
    );
  }
}
