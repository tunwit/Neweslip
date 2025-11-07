import { EmployeeRespounse } from "@/types/employee";
import { PaginatedResponse } from "@/types/response";
import { extractSlug } from "@/utils/extractSlug";
import { fetchwithauth } from "@/utils/fetcher";
import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface useEmployeesProps {
  search_query?: string;
  page?: Number;
  limit?: Number;
  status?: "ALL" | "ACTIVE" | "INACTIVE" | "PARTTIME" | undefined;
  branchId?: Number;
}
export const useEmployees = ({
  search_query,
  status,
  page,
  limit,
  branchId,
}: useEmployeesProps):UseQueryResult<PaginatedResponse<EmployeeRespounse[]>> => {
  const pathname = usePathname().split("/");
  const slug = pathname[1];
  const { name, id } = extractSlug(slug);

  const queryParams = new URLSearchParams({
    shopId: id.toString(),
    ...(search_query && { search_query: search_query }),
    ...(branchId && branchId !== -1 && { branchId: branchId.toString() }),
    ...(status && status !== "ALL" && { status: status }),
    ...(page && { page: page.toString() }),
  });
  
  return useQuery({
    queryKey: ["employees", slug, search_query, page, branchId, status],
    queryFn: () => {
      return fetchwithauth({
        endpoint: `/employees?${queryParams}`,
        method: "GET",
      });
    },
    placeholderData: keepPreviousData,
    // refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};
