import { getDb } from "@/lib/db";
import { Exercise } from "@/features/exercises/types/exercise";

type ExerciseRow = {
  id: string;
  name: string;
  description: string;
  muscle_group: string;
  difficulty: "beginner" | "intermediate" | "advanced";
};

export const getExercises = async (): Promise<Exercise[]> => {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM exercises").all() as ExerciseRow[];

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    muscleGroup: row.muscle_group,
    difficulty: row.difficulty,
  }));
};
