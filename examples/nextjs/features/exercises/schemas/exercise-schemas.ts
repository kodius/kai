import { z } from "zod";

export const exerciseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  muscleGroup: z.string().min(1, "Muscle group is required"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
});

export type ExerciseInput = z.infer<typeof exerciseSchema>;
