import { Grid } from "@/components/primitives/grid";
import { getExercises } from "@/features/exercises/api/exercises-api";
import { ExerciseCard } from "@/features/exercises/components/exercise-card";

export const ExerciseList = async () => {
  const exercises = await getExercises();

  return (
    <Grid md={2} lg={3}>
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </Grid>
  );
};
