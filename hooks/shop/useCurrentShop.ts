import { extractSlug } from "@/utils/extractSlug";
import { useParams } from "next/navigation";

export const useCurrentShop = () => {
    const params = useParams();
    const slug = Array.isArray(params.shopSlug) ? params.shopSlug[0] : params.shopSlug;
    if(!slug) return {id:null , name:null}

    const {name,id} = extractSlug(slug)
    return {id , name}
}