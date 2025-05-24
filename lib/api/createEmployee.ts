import { extractSlug } from "@/utils/extractSlug";
import { fetchwithauth } from "@/utils/fetcher";
import { useMutation } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

export function createEmployee(
  onCreatError: (error: Error) => void,
  onCreateSuccess: () => void,
) {
  const mutation = useMutation({
    mutationFn: (data: Record<string, any>) =>
      fetchwithauth({
        endpoint: "/employees",
        method: "POST",
        body: data,
      }),
    onError: (error, variables, context) => onCreatError(error),
    onSuccess: () => onCreateSuccess(),
  });
  return mutation;
}
