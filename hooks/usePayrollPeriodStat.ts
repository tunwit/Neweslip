import { Branch } from "@/types/branch";
import { EmployeeStats } from "@/types/employeeStats";
import { ApiResponse } from "@/types/response";
import { extractSlug } from "@/utils/extractSlug";
import { fetchwithauth } from "@/utils/fetcher";
import { useQuery, UseQueryResult, useSuspenseQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

export const usePayrollPeriodStats = (periodId: number) => {
  const query = useQuery<ApiResponse<EmployeeStats>>({
    queryKey: ["payrollPeriods","stats", periodId],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/payroll/periods/stats?periodId=${periodId}`,
        method: "GET",
      }),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};