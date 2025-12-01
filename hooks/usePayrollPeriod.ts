import { PayrollPeriod } from "@/types/payrollPeriod";
import { ApiResponse } from "@/types/response";
import { fetchwithauth } from "@/utils/fetcher";
import { useSession } from "@clerk/nextjs";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export const usePayrollPeriod = (periodId?: number) => {
  const { session } = useSession();

  const query = useQuery<
    ApiResponse<Omit<PayrollPeriod, "totalNet" | "count">>
  >({
    queryKey: ["payrollPeriod", periodId, session?.user?.emailAddresses],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/payroll/periods/${periodId}`,
        method: "GET",
      }),
    enabled: !!periodId, // prevents running when periodId is undefined
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
