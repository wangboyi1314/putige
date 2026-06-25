import { Solar, Lunar } from "lunar-javascript";

const TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const DI_ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const WU_XING: Record<string, string> = {
  "甲": "木", "乙": "木", "丙": "火", "丁": "火", "戊": "土",
  "己": "土", "庚": "金", "辛": "金", "壬": "水", "癸": "水",
  "子": "水", "丑": "土", "寅": "木", "卯": "木", "辰": "土",
  "巳": "火", "午": "火", "未": "土", "申": "金", "酉": "金",
  "戌": "土", "亥": "水",
};

export type CalendarType = "solar" | "lunar";

export interface BaZiPillar {
  gan: string;
  zhi: string;
  ganZhi: string;
  wuXing: string;
  naYin: string;
}

export interface BaZiChart {
  year: BaZiPillar;
  month: BaZiPillar;
  day: BaZiPillar;
  hour: BaZiPillar;
  dayMaster: string;
  dayMasterWuXing: string;
  shengXiao: string;
  solarDate: string;
  lunarDate: string;
  inputCalendar: CalendarType;
  inputLabel: string;
  wuXingCount: Record<string, number>;
}

function toPillar(gan: string, zhi: string, naYin: string): BaZiPillar {
  return {
    gan,
    zhi,
    ganZhi: gan + zhi,
    wuXing: WU_XING[gan] ?? "",
    naYin,
  };
}

export interface BaZiInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  calendarType: CalendarType;
  isLeapMonth?: boolean;
}

export function calculateBaZi(input: BaZiInput): BaZiChart {
  const { year, month, day, hour, calendarType, isLeapMonth = false } = input;

  let solar: ReturnType<typeof Solar.fromYmdHms>;
  let inputLabel: string;

  if (calendarType === "lunar") {
    const lunarMonth = isLeapMonth ? -month : month;
    const lunar = Lunar.fromYmdHms(year, lunarMonth, day, hour, 0, 0);
    solar = lunar.getSolar();
    const leapTag = isLeapMonth ? "闰" : "";
    inputLabel = `农历${year}年${leapTag}${month}月${day}日 ${hour}时`;
  } else {
    solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
    inputLabel = `公历${year}年${month}月${day}日 ${hour}时`;
  }

  const lunar = solar.getLunar();
  const bazi = lunar.getEightChar();

  const pillars = [
    toPillar(bazi.getYearGan(), bazi.getYearZhi(), bazi.getYearNaYin()),
    toPillar(bazi.getMonthGan(), bazi.getMonthZhi(), bazi.getMonthNaYin()),
    toPillar(bazi.getDayGan(), bazi.getDayZhi(), bazi.getDayNaYin()),
    toPillar(bazi.getTimeGan(), bazi.getTimeZhi(), bazi.getTimeNaYin()),
  ];

  const wuXingCount: Record<string, number> = { 金: 0, 木: 0, 水: 0, 火: 0, 土: 0 };
  for (const p of pillars) {
    const wx = WU_XING[p.gan];
    if (wx) wuXingCount[wx]++;
    const wxZ = WU_XING[p.zhi];
    if (wxZ) wuXingCount[wxZ]++;
  }

  return {
    year: pillars[0],
    month: pillars[1],
    day: pillars[2],
    hour: pillars[3],
    dayMaster: bazi.getDayGan(),
    dayMasterWuXing: WU_XING[bazi.getDayGan()] ?? "",
    shengXiao: lunar.getYearShengXiao(),
    solarDate: `公历 ${solar.getYear()}年${solar.getMonth()}月${solar.getDay()}日 ${hour}时`,
    lunarDate: `农历 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    inputCalendar: calendarType,
    inputLabel,
    wuXingCount,
  };
}

export { TIAN_GAN, DI_ZHI, WU_XING };
