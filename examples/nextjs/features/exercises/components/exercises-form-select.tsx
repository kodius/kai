"use client";

import { useState } from "react";
import type { FieldValues } from "react-hook-form";

import {
  FormSelect,
  type FormSelectProps,
} from "@/components/form/form-select/form-select";
import { useGetExercises } from "@/features/exercises/hooks/use-get-exercises";

type Props<T extends FieldValues> = Omit<FormSelectProps<T>, "options">;

export const ExercisesFormSelect = <T extends FieldValues>(
  props: Props<T>,
) => {
  const [open, setOpen] = useState(false);

  const { data: options = [], isLoading } = useGetExercises({
    enabled: open,
    select: (data) =>
      data.map((exercise) => ({
        value: exercise.id,
        label: exercise.name,
      })),
  });

  return (
    <FormSelect<T>
      {...props}
      label={props.label || "Select Exercise"}
      options={options}
      open={open}
      onOpenChangeAction={setOpen}
      isLoading={isLoading}
    />
  );
};
