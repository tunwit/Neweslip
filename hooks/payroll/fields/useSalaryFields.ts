import { ApiResponse } from "@/types/response";
import {
  SalaryField,
  SalaryFieldGrouped,
} from "@/types/payroll/type.compensation";
import { Shop } from "@/types/type.shop";
import { fetchwithauth } from "@/utils/fetcher";
import { useSession } from "@clerk/nextjs";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useSalaryFields = (shopId: number) => {
  const { session } = useSession();
  const query = useQuery<ApiResponse<SalaryFieldGrouped>>({
    queryKey: ["salaryFields", session?.user?.emailAddresses],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/payroll/fields?shopId=${shopId}`,
        method: "GET",
      }),
    enabled: shopId > 0,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
