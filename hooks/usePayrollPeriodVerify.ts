import { Branch } from "@/types/branch";
import { EmployeeStats } from "@/types/employeeStats";
import { PayrollPeriodSummary } from "@/types/payrollPeriodSummary";
import { PayrollProblem } from "@/types/payrollProblem";
import { ApiResponse } from "@/types/response";
import { extractSlug } from "@/utils/extractSlug";
import { fetchwithauth } from "@/utils/fetcher";
import {
  useQuery,
  UseQueryResult,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { usePathname } from "next/navigation";

export const usePayrollPeriodVerify = (periodId: number) => {
  const query = useQuery<ApiResponse<PayrollProblem[]>>({
    queryKey: ["payrollPeriod", "verify", periodId],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/payroll/periods/${periodId}/verify`,
        method: "GET",
      }),
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
