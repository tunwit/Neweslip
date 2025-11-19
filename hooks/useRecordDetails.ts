
import { OtField } from "@/types/otField";
import { PayrollRecord } from "@/types/payrollRecord";
import { PenaltyField } from "@/types/penaltyField";
import { RecordDetails } from "@/types/RecordDetails";
import { ApiResponse } from "@/types/response";
import { SalaryField, SalaryFieldGrouped } from "@/types/salaryFields";
import { Shop } from "@/types/shop";
import { fetchwithauth } from "@/utils/fetcher";
import { useSession } from "@clerk/nextjs";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useRecordDetails = (recordId:number) => {
  const { session } = useSession();
  const query = useQuery<ApiResponse<RecordDetails>>({
    queryKey: ["record",recordId ,session?.user?.emailAddresses],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/payroll/records/${recordId}`,
        method: "GET",
      }),
    enabled: !!recordId,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
