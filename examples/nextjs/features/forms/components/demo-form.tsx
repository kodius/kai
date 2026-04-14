"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { FormInput } from "@/components/form/form-input/form-input";
import { FormSelect } from "@/components/form/form-select/form-select";
import { ExercisesFormSelect } from "@/features/exercises/components/exercises-form-select";

import type { FormOption } from "@/components/form/types";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.email("Please enter a valid email address."),
  role: z.string().min(1, "Please select a role."),
  exercise: z.string().min(1, "Please select an exercise."),
});

type FormValues = z.infer<typeof schema>;

const roleOptions: FormOption[] = [
  { value: "developer", label: "Developer" },
  { value: "designer", label: "Designer" },
  { value: "manager", label: "Manager" },
];

export const DemoForm = () => {
  const form = useForm<FormValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      exercise: "",
    },
  });

  const handleSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <FormProvider {...form}>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="demo-form" onSubmit={form.handleSubmit(handleSubmit)}>
            <FieldGroup>
              <FormInput<FormValues>
                name="name"
                label="Name"
                placeholder="John Doe"
                autoComplete="name"
              />
              <FormInput<FormValues>
                name="email"
                label="Email"
                placeholder="john@example.com"
                autoComplete="email"
              />
              <FormSelect<FormValues>
                name="role"
                label="Role"
                placeholder="Select a role"
                options={roleOptions}
              />
              <ExercisesFormSelect<FormValues>
                name="exercise"
                label="Exercise"
                placeholder="Select an exercise"
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" form="demo-form">
            Submit
          </Button>
        </CardFooter>
      </Card>
    </FormProvider>
  );
};
