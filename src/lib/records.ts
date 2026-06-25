const STORAGE_KEY = "bodhi_records";

export interface RecordItem {
  id: string;
  type: "lamp" | "gua" | "qian" | "bazi" | "dream" | "xiang" | "naming";
  title: string;
  summary: string;
  createdAt: string;
}

export function getRecords(): RecordItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RecordItem[]) : [];
  } catch {
    return [];
  }
}

export function saveRecord(item: Omit<RecordItem, "id" | "createdAt">): RecordItem {
  const record: RecordItem = {
    ...item,
    id: `rec_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const existing = getRecords();
  const updated = [record, ...existing].slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return record;
}

export function deleteRecord(id: string): void {
  const updated = getRecords().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function findRecordByCode(code: string): RecordItem | null {
  const records = getRecords();
  return records.find((r) => r.id.endsWith(code) || r.id === code) ?? null;
}
