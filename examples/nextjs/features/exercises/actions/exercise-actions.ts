"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { exerciseSchema } from "@/features/exercises/schemas/exercise-schemas";
import type { ExerciseInput } from "@/features/exercises/schemas/exercise-schemas";
import type { Exercise } from "@/features/exercises/types/exercise";

export const createExerciseAction = async (data: ExerciseInput): Promise<void> => {
  const parsed = exerciseSchema.parse(data);
  const db = getDb();
  const id = crypto.randomUUID();

  db.prepare(
    "INSERT INTO exercises (id, name, description, muscle_group, difficulty) VALUES (?, ?, ?, ?, ?)"
  ).run(id, parsed.name, parsed.description, parsed.muscleGroup, parsed.difficulty);

  redirect("/exercises");
};

type ExerciseRow = {
  id: string;
  name: string;
  description: string;
  muscle_group: string;
  difficulty: "beginner" | "intermediate" | "advanced";
};

export const getExercisesAction = async (): Promise<Exercise[]> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const db = getDb();
  const rows = db.prepare("SELECT * FROM exercises").all() as ExerciseRow[];

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    muscleGroup: row.muscle_group,
    difficulty: row.difficulty,
  }));
};
