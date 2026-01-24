import { Employee, EmployeeWithShop } from "@/types/employee";
import {
  EMPLOYEE_ORDERBY,
  EMPLOYEE_SORTBY,
  EMPLOYEE_STATUS,
} from "@/types/enum/enum";
import { PaginatedResponse } from "@/types/response";
import { extractSlug } from "@/utils/extractSlug";
import { fetchwithauth } from "@/utils/fetcher";
import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { usePathname } from "next/navigation";

interface useEmployeesProps {
  sortBy?: EMPLOYEE_SORTBY;
  orderBy?: EMPLOYEE_ORDERBY;
  search_query?: string;
  page?: number;
  limit?: number;
  status?: EMPLOYEE_STATUS | null;
  branchId?: number;
}
export const useEmployees = ({
  sortBy,
  orderBy,
  search_query,
  status,
  page,
  limit,
  branchId,
}: useEmployeesProps) => {
  const pathname = usePathname().split("/");
  const slug = pathname[2];
  const { name, id } = extractSlug(slug);

  const queryParams = new URLSearchParams({
    shopId: id.toString(),
    ...(search_query && { search_query: search_query }),
    ...(branchId && branchId !== -1 && { branchId: branchId.toString() }),
    ...(status && status !== null && { status: status }),
    ...(page && { page: page.toString() }),
    ...(limit && { limit: limit.toString() }),
    ...(sortBy && { sortBy: sortBy.toString().toLocaleUpperCase() }),
    ...(orderBy && { orderBy: orderBy.toString().toLocaleUpperCase() }),
  });

  return useQuery<PaginatedResponse<EmployeeWithShop[]>>({
    queryKey: [
      "employees",
      slug,
      search_query,
      page,
      branchId,
      status,
      sortBy,
      orderBy,
    ],
    queryFn: () => {
      return fetchwithauth({
        endpoint: `/shops/${id}/employees?${queryParams}`,
        method: "GET",
      });
    },
    placeholderData: keepPreviousData,
    // refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};
