import { Branch } from "@/types/branch";
import { EmployeeStats } from "@/types/employeeStats";
import { ApiResponse } from "@/types/response";
import { extractSlug } from "@/utils/extractSlug";
import { fetchwithauth } from "@/utils/fetcher";
import {
  useQuery,
  UseQueryResult,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { usePathname } from "next/navigation";

interface useEmployeeStats {
  shopId: number;
}
export const useEmployeeStats = ({ shopId }: useEmployeeStats) => {
  const query = useQuery<ApiResponse<EmployeeStats>>({
    queryKey: ["employees", "stats", shopId],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/employees/stats`,
        method: "GET",
      }),
    enabled: shopId > 0,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
