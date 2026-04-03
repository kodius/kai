export interface InstructionMeta {
  id: string;
  name: string;
  description: string;
  filename: string;
  category: string;
  tags: string[];
}

export interface PresetMeta {
  id: string;
  name: string;
  description: string;
  instructions: string[]; // instruction IDs
}

export interface Manifest {
  version: number;
  presets: PresetMeta[];
  instructions: InstructionMeta[];
}

export interface InstalledInstruction {
  id: string;
  filename: string;
  installedAt: string;
  sourceUrl: string;
}

export interface KaiConfig {
  version: number;
  preset: string;
  installedAt: string;
  updatedAt: string;
  instructions: InstalledInstruction[];
}

export type ClaudeMdPlacement = "top" | "bottom" | "replace";
