"use client";

import { useId, useState } from "react";
import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form";
import { IconCheck, IconSelector } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

import type { FormOption } from "@/components/form/types";

export type FormComboboxProps<T extends FieldValues, TValue extends string = string> = {
  name: Path<T>;
  label: string;
  options: FormOption<TValue>[];
  placeholder?: string;
  open?: boolean;
  onOpenChangeAction?: (open: boolean) => void;
  onSelectAction?: (option: FormOption<TValue>) => void;
  isLoading?: boolean;
};

export const FormCombobox = <T extends FieldValues, TValue extends string = string>(
  props: FormComboboxProps<T, TValue>,
) => {
  const form = useFormContext<T>();
  const id = useId();
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = props.open !== undefined;
  const open = isControlled ? props.open : internalOpen;
  const onOpenChange = isControlled ? props.onOpenChangeAction : setInternalOpen;

  return (
    <Controller
      name={props.name}
      control={form.control}
      render={({ field, fieldState }) => {
        const selectedLabel = props.options.find(
          (o) => o.value === field.value,
        )?.label;

        return (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor={id}>{props.label}</FieldLabel>
            <Popover open={open} onOpenChange={onOpenChange}>
              <PopoverTrigger asChild>
                <Button
                  id={id}
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  aria-invalid={fieldState.invalid}
                  className="w-fit justify-between gap-1.5 text-xs font-normal"
                >
                  {selectedLabel ?? (
                    <span className="text-muted-foreground">
                      {props.placeholder}
                    </span>
                  )}
                  <IconSelector className="size-4 shrink-0 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                {props.isLoading ? (
                  <Spinner className="h-20" />
                ) : (
                  <Command>
                    <CommandInput placeholder={props.placeholder} />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {props.options.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            keywords={[option.label]}
                            onSelect={(value) => {
                              const newValue = value === field.value ? "" : value;
                              field.onChange(newValue);
                              const selected = props.options.find((o) => o.value === newValue);
                              if (selected) props.onSelectAction?.(selected);
                              onOpenChange?.(false);
                            }}
                          >
                            {option.label}
                            <IconCheck
                              className={cn(
                                "ml-auto size-4",
                                field.value === option.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                )}
              </PopoverContent>
            </Popover>
            {fieldState.invalid ? (
              <FieldError errors={[fieldState.error]} />
            ) : null}
          </Field>
        );
      }}
    />
  );
};
