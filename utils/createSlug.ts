import slugify from "slugify";

export function createSlug(name: string, id: string) {
  return slugify(`${name}-${id}`); 
}
