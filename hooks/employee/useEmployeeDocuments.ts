import { Branch } from "@/types/branch";
import {
  EmployeeDocument,
  EmployeeDocumentWithUploader,
} from "@/types/employeeDocument";
import { EmployeeStats } from "@/types/employeeStats";
import { ApiResponse } from "@/types/response";
import { extractSlug } from "@/utils/extractSlug";
import { fetchwithauth } from "@/utils/fetcher";
import {
  useQuery,
  UseQueryResult,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { usePathname } from "next/navigation";

interface useEmployeeDocumentsProps {
  employeeId: number;
}
export const useEmployeeDocuments = ({
  employeeId,
}: useEmployeeDocumentsProps) => {
  const query = useQuery<ApiResponse<EmployeeDocumentWithUploader[]>>({
    queryKey: ["employees", "document", employeeId],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/employees/${employeeId}/documents`,
        method: "GET",
      }),
    enabled: employeeId > 0,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
