const CLIENT_KEY = "bodhi_mp_client_id";
const RECORDS_KEY = "bodhi_mp_records";

export interface MpRecord {
  id: string;
  type: string;
  title: string;
  summary: string;
  createdAt: string;
}

export function getClientId(): string {
  try {
    let id = wx.getStorageSync(CLIENT_KEY) as string;
    if (!id) {
      id = `mp_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      wx.setStorageSync(CLIENT_KEY, id);
    }
    return id;
  } catch {
    return `mp_${Date.now()}`;
  }
}

export function savePaidOrder(productId: string, orderId: string): void {
  try {
    wx.setStorageSync(`paid_${productId}`, orderId);
  } catch {
    /* ignore */
  }
}

export function getPaidOrder(productId: string): string | null {
  try {
    return (wx.getStorageSync(`paid_${productId}`) as string) || null;
  } catch {
    return null;
  }
}

export function saveRecord(record: Omit<MpRecord, "id" | "createdAt">): void {
  try {
    const entry: MpRecord = {
      ...record,
      id: `rec_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const existing = getRecords();
    wx.setStorageSync(RECORDS_KEY, [entry, ...existing].slice(0, 100));
  } catch {
    /* ignore */
  }
}

export function getRecords(): MpRecord[] {
  try {
    const raw = wx.getStorageSync(RECORDS_KEY);
    return Array.isArray(raw) ? (raw as MpRecord[]) : [];
  } catch {
    return [];
  }
}
