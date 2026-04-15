import Link from "next/link";
import { Container } from "@/components/primitives/container";
import { Section } from "@/components/primitives/section";
import { Button } from "@/components/ui/button";
import { getExercisesAction } from "@/features/exercises/actions/exercise-actions";

export default async function ExercisesPage() {
  const exercises = await getExercisesAction();

  return (
    <Container>
      <Section title="Exercises">
        <div className="flex flex-col gap-4">
          <div>
            <Button asChild>
              <Link href="/exercises/new">New Exercise</Link>
            </Button>
          </div>
          {exercises.length === 0 ? (
            <p className="text-muted-foreground">No exercises yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {exercises.map((exercise) => (
                <li key={exercise.id} className="rounded-md border p-4">
                  <p className="font-medium">{exercise.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {exercise.muscleGroup} &middot; {exercise.difficulty}
                  </p>
                  {exercise.description && (
                    <p className="mt-1 text-sm">{exercise.description}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>
    </Container>
  );
}
