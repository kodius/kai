"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/form-input/form-input";
import { FormTextarea } from "@/components/form/form-textarea/form-textarea";
import { FormSelect } from "@/components/form/form-select/form-select";
import { exerciseSchema } from "@/features/exercises/schemas/exercise-schemas";
import { createExerciseAction } from "@/features/exercises/actions/exercise-actions";
import type { ExerciseInput } from "@/features/exercises/schemas/exercise-schemas";
import type { FormOption } from "@/components/form/types";

const difficultyOptions: FormOption<"beginner" | "intermediate" | "advanced">[] = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

export const ExerciseForm = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ExerciseInput>({
    resolver: standardSchemaResolver(exerciseSchema),
    defaultValues: {
      name: "",
      description: "",
      muscleGroup: "",
      difficulty: "beginner",
    },
  });

  const handleSubmit = (data: ExerciseInput) => {
    startTransition(async () => {
      await createExerciseAction(data);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <FormInput<ExerciseInput>
          name="name"
          label="Name"
          placeholder="e.g. Bench Press"
        />
        <FormTextarea<ExerciseInput>
          name="description"
          label="Description"
          placeholder="Describe the exercise..."
        />
        <FormInput<ExerciseInput>
          name="muscleGroup"
          label="Muscle Group"
          placeholder="e.g. Chest, Back"
        />
        <FormSelect<ExerciseInput, "beginner" | "intermediate" | "advanced">
          name="difficulty"
          label="Difficulty"
          options={difficultyOptions}
        />
        <div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Exercise"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
