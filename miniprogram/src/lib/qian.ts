import qianData from "./qian-full.json";

export interface QianStick {
  number: number;
  level: "上上" | "上吉" | "中吉" | "中平" | "下" | "下下";
  poem: string;
  story: string;
  meaning: string;
}

export const QIAN_STICKS: QianStick[] = qianData as QianStick[];

export function drawQian(): QianStick {
  const index = Math.floor(Math.random() * QIAN_STICKS.length);
  return QIAN_STICKS[index];
}
