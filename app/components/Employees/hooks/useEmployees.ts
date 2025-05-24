import { extractSlug } from "@/utils/extractSlug";
import { fetchwithauth } from "@/utils/fetcher";
import {
  keepPreviousData,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { usePathname } from "next/navigation";

// interface useEmployeesProps {
//   search_query?: string;
//   page?: Number;
//   limit?: Number;
//   status?: "ACTIVE" | "INACTIVE" | "PARTTIME";
//   branchId?: Number;
// }
export const useEmployees = (search_query?: string) => {
  const pathname = usePathname().split("/");
  const slug = pathname[1];
  const data = extractSlug(slug);
  const queryParams = new URLSearchParams({
    shopId: data.id.toString(),
    ...(search_query && { search_query }),
  });
  const query = useSuspenseQuery({
    queryKey: ["employees", slug, search_query],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/employees?${queryParams}`,
        method: "GET",
      }),
    // refetchOnWindowFocus: false,
    // staleTime: 1000 * 60 * 5,
  });
  console.log(query.data);

  return query;
};
