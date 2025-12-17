export function extractSlug(slug: string): { name: string; id: number } {
  const match = slug.match(/^(.*)-(\d+)$/);
  if (!match) return { name: "null", id: -1 };

  const [, name, id] = match;
  return { name: name.replaceAll("-", " "), id: parseInt(id, 10) };
}
