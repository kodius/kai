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
import { FormCheckbox } from "@/components/form/form-checkbox/form-checkbox";
import { FormInput } from "@/components/form/form-input/form-input";
import { FormSelect } from "@/components/form/form-select/form-select";
import { FormSwitch } from "@/components/form/form-switch/form-switch";
import { FormTextarea } from "@/components/form/form-textarea/form-textarea";
import { FormRadioGroup } from "@/components/form/form-radio-group/form-radio-group";
import { FormSlider } from "@/components/form/form-slider/form-slider";
import { FormCombobox } from "@/components/form/form-combobox/form-combobox";
import { FormDatePicker } from "@/components/form/form-date-picker/form-date-picker";
import { ExercisesFormSelect } from "@/features/exercises/components/exercises-form-select";

import type { FormOption } from "@/components/form/types";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.email("Please enter a valid email address."),
  bio: z.string().max(500, "Bio must be 500 characters or less.").optional(),
  role: z.string().min(1, "Please select a role."),
  exercise: z.string().min(1, "Please select an exercise."),
  framework: z.string().min(1, "Please select a framework."),
  contact: z.string().min(1, "Please select a contact method."),
  dob: z.date({ error: "Please select a date." }),
  volume: z.number().min(0).max(100),
  notifications: z.boolean().optional(),
  terms: z.literal(true, {
    error: "You must agree to the terms.",
  }),
});

type FormValues = z.infer<typeof schema>;

const roleOptions: FormOption[] = [
  { value: "developer", label: "Developer" },
  { value: "designer", label: "Designer" },
  { value: "manager", label: "Manager" },
];

const frameworkOptions: FormOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
];

const contactOptions: FormOption[] = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "mail", label: "Mail" },
];

export const DemoForm = () => {
  const form = useForm<FormValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      role: "",
      exercise: "",
      framework: "",
      contact: "",
      dob: undefined as unknown as Date,
      volume: 50,
      notifications: false,
      terms: false as unknown as true,
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
              <FormTextarea<FormValues>
                name="bio"
                label="Bio"
                placeholder="Tell us about yourself"
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
              <FormCombobox<FormValues>
                name="framework"
                label="Framework"
                placeholder="Select a framework"
                options={frameworkOptions}
              />
              <FormRadioGroup<FormValues>
                name="contact"
                label="Preferred contact method"
                options={contactOptions}
              />
              <FormDatePicker<FormValues>
                name="dob"
                label="Date of birth"
                placeholder="Pick a date"
              />
              <FormSlider<FormValues>
                name="volume"
                label="Volume"
                min={0}
                max={100}
                step={1}
              />
              <FormSwitch<FormValues>
                name="notifications"
                label="Enable notifications"
              />
              <FormCheckbox<FormValues>
                name="terms"
                label="I agree to the terms and conditions"
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
