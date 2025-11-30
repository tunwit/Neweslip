import { Branch } from "@/types/branch";
import { EmployeeDocument, EmployeeDocumentWithUploader } from "@/types/employeeDocument";
import { EmployeeStats } from "@/types/employeeStats";
import { ApiResponse } from "@/types/response";
import { ShopDocumentWithUploader } from "@/types/shopDocument";
import { extractSlug } from "@/utils/extractSlug";
import { fetchwithauth } from "@/utils/fetcher";
import { useQuery, UseQueryResult, useSuspenseQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

interface useShopDocumentsProps {
  shopId: number
  search_query: string
}
export const useShopDocuments = ({ shopId ,search_query}:useShopDocumentsProps) => {
  const query = useQuery<ApiResponse<ShopDocumentWithUploader[]>>({
    queryKey: ["shop","document", shopId,search_query],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/shop/${shopId}/documents?search_query=${search_query}`,
        method: "GET",
      }),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
