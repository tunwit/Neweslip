
import { OtField } from "@/types/otField";
import { PayrollRecord } from "@/types/payrollRecord";
import { PenaltyField } from "@/types/penaltyField";
import { ApiResponse } from "@/types/response";
import { SalaryField, SalaryFieldGrouped } from "@/types/salaryFields";
import { Shop } from "@/types/shop";
import { fetchwithauth } from "@/utils/fetcher";
import { useSession } from "@clerk/nextjs";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const usePayrollRecords = (periodId:number) => {
  const { session } = useSession();
  const query = useQuery<ApiResponse<PayrollRecord[]>>({
    queryKey: ["payrollRecord",periodId ,session?.user?.emailAddresses],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/payroll/records?periodId=${periodId}`,
        method: "GET",
      }),
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
