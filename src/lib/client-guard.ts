const CLIENT_KEY = "bodhi_client_id";

export function getClientId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(CLIENT_KEY);
  if (!id) {
    const rand = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
    id = `cid_${Date.now()}_${rand}`;
    sessionStorage.setItem(CLIENT_KEY, id);
  }
  return id;
}

export function interpretRequestHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "X-Bodhi-Client": getClientId(),
  };
}
