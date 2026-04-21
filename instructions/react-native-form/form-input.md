# FormInput

`FormInput` wraps React Native's `TextInput` with react-hook-form `Controller`. It reads the form context internally — callers only provide `name`, optional `label`, and optional `TextInput` props.

File location: `components/form/form-input/form-input.tsx`

## Styling lives inside FormInput

The base visual style (border, padding, radius, text size, colors) is owned by `FormInput`. Callers do **not** pass styling for the default look.

`inputClassName` and `inputStyle` are escape hatches — use them only when a specific instance needs something custom that the default cannot express (e.g. a centered OTP input). They are appended to the base style, not replacements for it.

```tsx
import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form";
import { Text, TextInput, View, type TextInputProps } from "react-native";

const baseInputClassName =
  "rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  autoComplete?: TextInputProps["autoComplete"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  keyboardType?: TextInputProps["keyboardType"];
  maxLength?: number;
  autoFocus?: boolean;
  editable?: boolean;
  inputClassName?: string;
  inputStyle?: TextInputProps["style"];
};

export const FormInput = <T extends FieldValues>(props: Props<T>) => {
  const form = useFormContext<T>();

  return (
    <Controller
      control={form.control}
      name={props.name}
      render={({ field, fieldState }) => (
        <View className="gap-2">
          {props.label ? (
            <Text className="text-sm font-medium text-foreground">
              {props.label}
            </Text>
          ) : null}
          <TextInput
            className={
              props.inputClassName
                ? `${baseInputClassName} ${props.inputClassName}`
                : baseInputClassName
            }
            style={props.inputStyle}
            placeholder={props.placeholder}
            placeholderTextColor="#9ca3af"
            autoComplete={props.autoComplete}
            autoCapitalize={props.autoCapitalize}
            keyboardType={props.keyboardType}
            maxLength={props.maxLength}
            autoFocus={props.autoFocus}
            editable={props.editable}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
          />
          {fieldState.error ? (
            <Text className="text-sm text-destructive">
              {fieldState.error.message}
            </Text>
          ) : null}
        </View>
      )}
    />
  );
};
```

## Per-instance overrides — `inputClassName` / `inputStyle`

Only reach for these when the caller truly needs a variant the default cannot provide.

```tsx
<FormInput
  name="token"
  inputClassName="text-2xl tracking-widest"
  inputStyle={{ textAlign: "center" }}
  keyboardType="number-pad"
  maxLength={6}
  autoFocus
/>
```
