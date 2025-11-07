import { useForm, UseFormProps, UseFormReturn, Control } from "react-hook-form";
import { z, ZodTypeAny } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Extend RHF Control to include schema
export type ZodControl<TSchema extends ZodTypeAny> = Control<z.infer<TSchema>> & {
  schema: TSchema;
};

export type ZodForm<TSchema extends ZodTypeAny> = UseFormReturn<
  z.infer<TSchema>
> & {
  schema: TSchema;
  control: Control<z.infer<TSchema>> & { schema: TSchema };
};

export function useZodForm<TSchema extends ZodTypeAny>(
  schema: TSchema,
  options?: Omit<UseFormProps<z.infer<TSchema>>, "resolver">
): UseFormReturn<z.infer<TSchema>> & { control: ZodControl<TSchema> } {
  const methods = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    ...options,
  });

  // Inject schema into control
  const controlWithSchema = Object.assign(methods.control, { schema });

  return { ...methods, control: controlWithSchema };
}
