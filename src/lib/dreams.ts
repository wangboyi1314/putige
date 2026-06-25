import dreamData from "./dreams-full.json";

export interface DreamEntry {
  keyword: string;
  category: string;
  classic: string;
  luck: "吉" | "凶" | "平";
  brief: string;
}

export const DREAM_ENTRIES: DreamEntry[] = dreamData as DreamEntry[];

export const DREAM_CATEGORIES = [...new Set(DREAM_ENTRIES.map((d) => d.category))];

export function searchDream(query: string): DreamEntry[] {
  const q = query.trim();
  if (!q) return [];
  return DREAM_ENTRIES.filter(
    (d) =>
      d.keyword.includes(q) ||
      d.brief.includes(q) ||
      d.category.includes(q)
  );
}

export function getDreamByKeyword(keyword: string): DreamEntry | undefined {
  return DREAM_ENTRIES.find((d) => d.keyword === keyword);
}

export function getDreamsByCategory(category: string): DreamEntry[] {
  return DREAM_ENTRIES.filter((d) => d.category === category);
}
