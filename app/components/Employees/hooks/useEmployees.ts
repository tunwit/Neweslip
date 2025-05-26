import { extractSlug } from "@/utils/extractSlug";
import { fetchwithauth } from "@/utils/fetcher";
import {
  keepPreviousData,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface useEmployeesProps {
  search_query?: string;
  branch?: number;
  page?: Number;
  limit?: Number;
  status?: "ALL" | "ACTIVE" | "INACTIVE" | "PARTTIME" | undefined;
  branchId?: Number;
}
export const useEmployees = ({
  search_query,
  branch,
  status,
  page,
  limit,
  branchId,
}: useEmployeesProps) => {
  const pathname = usePathname().split("/");
  const slug = pathname[1];
  const { name, id } = extractSlug(slug);
  console.log(status);

  const queryParams = new URLSearchParams({
    shopId: id.toString(),
    ...(search_query && { search_query: search_query }),
    ...(branch && branch !== -1 && { branchId: branch.toString() }),
    ...(status && status !== "ALL" && { status: status }),
    ...(page && { page: page.toString() }),
  });
  const query = useQuery({
    queryKey: ["employees", slug, search_query, page, branch, status],
    queryFn: () => {
      return fetchwithauth({
        endpoint: `/employees?${queryParams}`,
        method: "GET",
      });
    },
    placeholderData: keepPreviousData,
    // refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
  return query;
};
