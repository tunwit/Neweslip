import { OtField } from "@/types/otField";
import { PayrollRecord } from "@/types/payrollRecord";
import { PenaltyField } from "@/types/penaltyField";
import { ApiResponse } from "@/types/response";
import { SalaryField, SalaryFieldGrouped } from "@/types/salaryFields";
import { Shop } from "@/types/shop";
import { fetchwithauth } from "@/utils/fetcher";
import { useSession } from "@clerk/nextjs";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const usePreview = (jobId: string | null) => {
  const { session } = useSession();
  const query = useQuery<ApiResponse<string>>({
    queryKey: ["preview", jobId, session?.user?.emailAddresses],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/payroll/records/preview/${jobId}`,
        method: "GET",
      }),
    enabled: jobId !== null,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error: any) => {
      if (error?.status === 404 || error?.response?.status === 404)
        return false;
      return failureCount < 3;
    },
  });

  return query;
};
