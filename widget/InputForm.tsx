import { FormControl, FormLabel, Input } from "@mui/joy";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { ZodControl } from "@/lib/useZodForm"; // import type from above

interface InputFormProps<TSchema extends z.ZodTypeAny> {
  control: ZodControl<TSchema>;
  name: keyof z.infer<TSchema>;
  label: string;
  placeHolder?: string;
  disabled?: boolean;
  required?: boolean;
  type?: string;
}

export function InputForm<TSchema extends z.ZodTypeAny>({
  control,
  name,
  label,
  placeHolder = label,
  disabled = false,
  required,
  type = "text",
}: InputFormProps<TSchema>) {
  const shape = control.schema._def.shape();
  const fieldSchema = shape[name as string];
  const isRequired = fieldSchema && !fieldSchema.isOptional();

  return (
    <Controller
      name={name as any}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl
          error={!!fieldState.error}
          required={required ? required : isRequired}
        >
          <FormLabel>
            {label}
            {fieldState.error && (
              <p className="text-xs ml-2 font-normal text-red-500 italic">
                {fieldState.error.message}
              </p>
            )}
          </FormLabel>
          <Input
            {...field}
            onChange={(e) =>
              field.onChange(
                type === "number" ? e.target.valueAsNumber : e.target.value,
              )
            }
            disabled={disabled}
            type={type}
            placeholder={placeHolder}
          />
        </FormControl>
      )}
    />
  );
}
