export interface InstructionMeta {
  id: string;
  name: string;
  description: string;
  filename: string;
  category: string;
  tags: string[];
}

export interface Manifest {
  version: number;
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
  installedAt: string;
  updatedAt: string;
  instructions: InstalledInstruction[];
}

export type ClaudeMdPlacement = "top" | "bottom" | "replace";
