import { extractSlug } from "@/utils/extractSlug";
import { fetchwithauth } from "@/utils/fetcher";
import {
  keepPreviousData,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { usePathname } from "next/navigation";

interface useEmployeesProps {
  search_query?: string;
  page?: Number;
  limit?: Number;
  status?: "ACTIVE" | "INACTIVE" | "PARTTIME";
  branchId?: Number;
}
export const useEmployees = ({
  search_query,
  page,
  limit,
  status,
  branchId,
}: useEmployeesProps) => {
  const pathname = usePathname().split("/");
  const slug = pathname[1];
  const { name, id } = extractSlug(slug);
  const queryParams = new URLSearchParams({
    shopId: id.toString(),
    ...(search_query && { search_query: search_query }),
    ...(page && { page: page.toString() }),
  });
  const query = useQuery({
    queryKey: ["employees", slug, search_query, page],
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
