import { Owner } from "@/types/owner";
import { PayrollPeriod } from "@/types/payrollPeriod";
import { ApiResponse } from "@/types/response";
import { Shop } from "@/types/shop";
import { fetchwithauth } from "@/utils/fetcher";
import { useSession } from "@clerk/nextjs";
import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const usePeriodFields = (periodId: number) => {
  const { session } = useSession();
  const query = useQuery<ApiResponse<string[]>>({
    queryKey: ["payrollPeriods", "fields", session?.user?.emailAddresses],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/payroll/periods/${periodId}/fields`,
        method: "GET",
      }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
