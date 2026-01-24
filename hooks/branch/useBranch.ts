import { Branch } from "@/types/branch";
import { ApiResponse } from "@/types/response";
import { extractSlug } from "@/utils/extractSlug";
import { fetchwithauth } from "@/utils/fetcher";
import {
  useQuery,
  UseQueryResult,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { usePathname } from "next/navigation";

export const useBranch = () => {
  const pathname = usePathname().split("/");
  const slug = pathname[2];
  const data = extractSlug(slug);

  const query = useQuery<ApiResponse<Branch[]>>({
    queryKey: ["branch", slug],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/shops/${data.id}/branches`,
        method: "GET",
      }),
    enabled: data.id > 0,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
