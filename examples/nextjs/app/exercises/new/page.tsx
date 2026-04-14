import { Container } from "@/components/primitives/container";
import { Section } from "@/components/primitives/section";
import { ExerciseForm } from "@/features/exercises/components/exercise-form";

export default function NewExercisePage() {
  return (
    <Container>
      <Section title="New Exercise">
        <ExerciseForm />
      </Section>
    </Container>
  );
}
