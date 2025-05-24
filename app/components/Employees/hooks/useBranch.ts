import { extractSlug } from "@/utils/extractSlug";
import { fetchwithauth } from "@/utils/fetcher";
import { useSuspenseQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

export const useBranch = () => {
  const pathname = usePathname().split("/");
  const slug = pathname[1];
  const data = extractSlug(slug);
  const query = useSuspenseQuery({
    queryKey: ["branch", slug],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/shop/branch?shopId=${data.id}`,
        method: "GET",
      }),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
