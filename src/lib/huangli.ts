import { Solar, Lunar } from "lunar-javascript";

export interface HuangLiInfo {
  solarDate: string;
  lunarDate: string;
  ganZhi: string;
  shengXiao: string;
  yi: string[];
  ji: string[];
  chong: string;
  sha: string;
  jieQi: string;
  wuXing: string;
  pengZu: string;
  xiShen: string;
  fuShen: string;
  caiShen: string;
}

export function getTodayHuangLi(date?: Date): HuangLiInfo {
  const d = date ?? new Date();
  const solar = Solar.fromDate(d);
  const lunar = solar.getLunar();

  const yi = lunar.getDayYi();
  const ji = lunar.getDayJi();

  return {
    solarDate: `${solar.getYear()}年${solar.getMonth()}月${solar.getDay()}日`,
    lunarDate: `农历${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    ganZhi: `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInGanZhi()}月 ${lunar.getDayInGanZhi()}日`,
    shengXiao: lunar.getYearShengXiao(),
    yi: yi.length > 0 ? yi : ["诸事皆宜"],
    ji: ji.length > 0 ? ji : ["诸事不忌"],
    chong: lunar.getDayChongDesc(),
    sha: lunar.getDaySha(),
    jieQi: lunar.getJieQi() || lunar.getPrevJieQi()?.getName() || "无",
    wuXing: lunar.getDayNaYin(),
    pengZu: `${lunar.getPengZuGan()} ${lunar.getPengZuZhi()}`,
    xiShen: lunar.getDayPositionXiDesc(),
    fuShen: lunar.getDayPositionFuDesc(),
    caiShen: lunar.getDayPositionCaiDesc(),
  };
}

export interface ShiChen {
  id: string;
  name: string;
  time: string;
  ganZhi: string;
  luck: "吉" | "凶" | "平";
}

export function getShiChen(date?: Date): ShiChen[] {
  const d = date ?? new Date();
  const solar = Solar.fromDate(d);
  const lunar = solar.getLunar();
  const times = lunar.getTimes();

  const luckMap: Record<string, "吉" | "凶" | "平"> = {
    "子": "平", "丑": "吉", "寅": "吉", "卯": "凶",
    "辰": "吉", "巳": "平", "午": "吉", "未": "平",
    "申": "凶", "酉": "吉", "戌": "平", "亥": "凶",
  };

  return times.map((t, index) => ({
    id: `${t.getGanZhi()}-${t.getMinHm()}-${index}`,
    name: t.getZhi(),
    time: `${t.getMinHm()} - ${t.getMaxHm()}`,
    ganZhi: t.getGanZhi(),
    luck: luckMap[t.getZhi()] ?? "平",
  }));
}
