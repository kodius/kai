export type Exercise = {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  difficulty: "beginner" | "intermediate" | "advanced";
};
