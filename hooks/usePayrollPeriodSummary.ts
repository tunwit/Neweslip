import { Branch } from "@/types/branch";
import { EmployeeStats } from "@/types/employeeStats";
import { PayrollPeriodSummary } from "@/types/payrollPeriodSummary";
import { ApiResponse } from "@/types/response";
import { extractSlug } from "@/utils/extractSlug";
import { fetchwithauth } from "@/utils/fetcher";
import {
  useQuery,
  UseQueryResult,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { usePathname } from "next/navigation";

export const usePayrollPeriodSummary = (periodId: number) => {
  const query = useQuery<ApiResponse<PayrollPeriodSummary>>({
    queryKey: ["payrollPeriod", "summary", periodId],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/payroll/periods/${periodId}/summary`,
        method: "GET",
      }),
    enabled: periodId > 0,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
