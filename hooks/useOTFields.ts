
import { OtField } from "@/types/otField";
import { ApiResponse } from "@/types/response";
import { SalaryField, SalaryFieldGrouped } from "@/types/salaryFields";
import { Shop } from "@/types/shop";
import { fetchwithauth } from "@/utils/fetcher";
import { useSession } from "@clerk/nextjs";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useOTFields = (shopId:number) => {
  const { session } = useSession();
  const query = useQuery<ApiResponse<OtField[]>>({
    queryKey: ["OTFields", session?.user?.emailAddresses],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/payroll/overtime?shopId=${shopId}`,
        method: "GET",
      }),
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
