export interface InstructionMeta {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  trigger: string;
  files: string[];
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
  filenames: string[];
  installedAt: string;
}

export interface KaiConfig {
  version: number;
  preset: string;
  installedAt: string;
  updatedAt: string;
  instructions: InstalledInstruction[];
}

export type ClaudeMdPlacement = "top" | "bottom" | "replace";
