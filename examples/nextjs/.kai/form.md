# Forms

Forms use **react-hook-form** with **shadcn/ui** form primitives. Every reusable form field is a generic wrapper component that reads the form context internally — callers only provide `name` and display props.

## StandardFormProps — the shared base type for all form field components

All form field components extend `StandardFormProps<T>` so they share a consistent API and are type-safe against the form's schema.

```tsx
// types.ts (shared, lives at components/form/types.ts)
import { ReactNode } from "react";
import type { FieldValues, Path } from "react-hook-form";
import { PropsWithClassName } from "@/types/globals";

export type StandardFormProps<
  T extends FieldValues = FieldValues,
  F extends string = string,
> = {
  label?: ReactNode;
  name: Path<T>;
  placeholder?: string;
  description?: string;
  onChange?: (option?: FormOption<F>) => void;
} & PropsWithClassName;
```

## Form field components — wrap shadcn primitives with Controller

Each shadcn UI primitive (Input, Textarea, Select, …) gets a matching `Form*` wrapper. The wrapper calls `useFormContext()` so the parent form never passes `control` down manually.

File location: `components/form/form-{name}/form-{name}.tsx`

Every `Form*` component follows the same structure:

1. `"use client"` directive
2. Generic `<T extends FieldValues>` for type-safe field paths
3. `useFormContext<T>()` to get `control` — never accept `control` as a prop
4. `useId()` for accessible label linking
5. `Controller` from react-hook-form to connect field state
6. `Field` / `FieldLabel` / `FieldError` from `@/components/ui/field` for layout and error display
7. Export the props type so wrapper components can extend it

Reference implementations:
- `components/form/form-input/form-input.tsx` — wraps `Input`
- `components/form/form-select/form-select.tsx` — wraps `Select`

## Naming — prefix Form + PascalCase component name

```tsx
// ✓ correct
FormInput       // wraps Input
FormTextarea    // wraps Textarea
FormSelect      // wraps Select
FormCombobox    // wraps Combobox

// ✗ avoid
InputField
SelectWrapper
RHFInput
```

## FormOption — use for select-like components

When a field stores a structured value (label + value pair), use the shared `FormOption` type instead of a plain string.

```tsx
export type FormOption<T extends string = string> = {
  label: string;
  value: T;
};

// ✓ correct — field.onChange receives the full option object
onValueChange={(value) => {
  const selected = options.find((o) => o.value === value);
  field.onChange(selected);
  props.onChange?.(selected);
}}

// ✗ avoid — storing only the string value loses the label needed for display
field.onChange(value);
```

## FormTextarea — wraps Textarea for multi-line string fields

Props: `name`, `label`, `placeholder` — identical surface to FormInput, just renders a `Textarea` instead of `Input`.

```tsx
import { FormTextarea } from "@/components/form/form-textarea/form-textarea";

<FormTextarea<MyFormValues>
  name="bio"
  label="Bio"
  placeholder="Tell us about yourself"
/>
```

Wraps: `Textarea` from `@/components/ui/textarea`.

## FormCheckbox — wraps Checkbox for boolean fields

Props: `name`, `label` — binds to a boolean field. Uses horizontal orientation with label beside the checkbox. `Controller` maps `checked`/`onCheckedChange` for boolean binding.

```tsx
import { FormCheckbox } from "@/components/form/form-checkbox/form-checkbox";

<FormCheckbox<MyFormValues>
  name="terms"
  label="I agree to the terms and conditions"
/>
```

Wraps: `Checkbox` from `@/components/ui/checkbox`.

## FormSwitch — wraps Switch for boolean toggle fields

Props: `name`, `label` — identical API to FormCheckbox but renders a `Switch` toggle. Uses horizontal orientation with label beside the switch. `Controller` maps `checked`/`onCheckedChange` for boolean binding.

```tsx
import { FormSwitch } from "@/components/form/form-switch/form-switch";

<FormSwitch<MyFormValues>
  name="notifications"
  label="Enable notifications"
/>
```

Wraps: `Switch` from `@/components/ui/switch`.

## FormRadioGroup — wraps RadioGroup for mutually exclusive string options

Props: `name`, `label`, `options: FormOption[]` — renders a `RadioGroup` with a `RadioGroupItem` per option. Each option gets its own horizontal `Field` with a label. Uses `FormOption` from `types.ts`.

```tsx
import { FormRadioGroup } from "@/components/form/form-radio-group/form-radio-group";

const contactOptions: FormOption[] = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "mail", label: "Mail" },
];

<FormRadioGroup<MyFormValues>
  name="contact"
  label="Preferred contact method"
  options={contactOptions}
/>
```

Wraps: `RadioGroup` + `RadioGroupItem` from `@/components/ui/radio-group`.

## FormSlider — wraps Slider for numeric range fields

Props: `name`, `label`, `min?`, `max?`, `step?` — binds to a number field. The shadcn `Slider` uses `number[]` internally, so the Controller converts between the form's single number value and the slider's `[number]` array format.

```tsx
import { FormSlider } from "@/components/form/form-slider/form-slider";

<FormSlider<MyFormValues>
  name="volume"
  label="Volume"
  min={0}
  max={100}
  step={1}
/>
```

Wraps: `Slider` from `@/components/ui/slider`.

## FormCombobox — wraps Popover + Command for searchable dropdown fields

Props: `name`, `label`, `options: FormOption[]`, `placeholder?`, `open?`, `onOpenChange?`, `isLoading?` — mirrors FormSelect's API for consistency. Renders a searchable dropdown using Popover + Command. Supports the same data-fetching wrapper pattern as FormSelect via `open`/`onOpenChange`/`isLoading` props.

```tsx
import { FormCombobox } from "@/components/form/form-combobox/form-combobox";

const frameworkOptions: FormOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
];

<FormCombobox<MyFormValues>
  name="framework"
  label="Framework"
  placeholder="Select a framework"
  options={frameworkOptions}
/>
```

Data-fetching wrapper pattern (same as FormSelect):

```tsx
import { FormCombobox, type FormComboboxProps } from "@/components/form/form-combobox/form-combobox";

type Props<T extends FieldValues> = Omit<FormComboboxProps<T>, "options">;

export const MySearchableCombobox = <T extends FieldValues>(props: Props<T>) => {
  const [open, setOpen] = useState(false);
  const { data: options = [], isLoading } = useMyQuery({ enabled: open });

  return (
    <FormCombobox<T>
      {...props}
      options={options}
      open={open}
      onOpenChange={setOpen}
      isLoading={isLoading}
    />
  );
};
```

Wraps: `Popover` from `@/components/ui/popover` + `Command` from `@/components/ui/command`.

## FormDatePicker — wraps Popover + Calendar for Date fields

Props: `name`, `label`, `placeholder?` — binds to a `Date` value. Composed from Popover (trigger + content) and Calendar (react-day-picker). The trigger displays the formatted date using `date-fns` `format(value, "PPP")` or placeholder text when no date is selected. Selecting a date closes the popover automatically.

```tsx
import { FormDatePicker } from "@/components/form/form-date-picker/form-date-picker";

<FormDatePicker<MyFormValues>
  name="dob"
  label="Date of birth"
  placeholder="Pick a date"
/>
```

Schema example — use `z.date()` for the field:

```tsx
const schema = z.object({
  dob: z.date({ error: "Please select a date." }),
});
```

Wraps: `Popover` from `@/components/ui/popover` + `Calendar` from `@/components/ui/calendar` (react-day-picker).
