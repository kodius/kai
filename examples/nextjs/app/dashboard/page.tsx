import Link from "next/link";
import { Suspense } from "react";
import { Container } from "@/components/primitives/container";
import { Section } from "@/components/primitives/section";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ExerciseList } from "@/features/exercises/components/exercise-list";

export default function DashboardPage() {
  return (
    <Container>
      <Section
        title="Exercises"
        action={
          <Button asChild>
            <Link href="/exercises/new">New Exercise</Link>
          </Button>
        }
      >
        <Suspense fallback={<Spinner />}>
          <ExerciseList />
        </Suspense>
      </Section>
    </Container>
  );
}
