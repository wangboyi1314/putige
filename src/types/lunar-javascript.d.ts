declare module "lunar-javascript" {
  export class Solar {
    static fromDate(date: Date): Solar;
    static fromYmdHms(y: number, m: number, d: number, h: number, mi: number, s: number): Solar;
    getLunar(): Lunar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
  }

  export class Lunar {
    static fromYmd(y: number, m: number, d: number): Lunar;
    static fromYmdHms(y: number, m: number, d: number, h: number, mi: number, s: number): Lunar;
    getSolar(): Solar;
    getYearInGanZhi(): string;
    getMonthInGanZhi(): string;
    getDayInGanZhi(): string;
    getYearShengXiao(): string;
    getMonthInChinese(): string;
    getDayInChinese(): string;
    getDayYi(): string[];
    getDayJi(): string[];
    getDayChongDesc(): string;
    getDaySha(): string;
    getJieQi(): string;
    getPrevJieQi(): { getName(): string } | null;
    getDayNaYin(): string;
    getPengZuGan(): string;
    getPengZuZhi(): string;
    getDayPositionXiDesc(): string;
    getDayPositionFuDesc(): string;
    getDayPositionCaiDesc(): string;
    getTimes(): LunarTime[];
    getEightChar(): EightChar;
  }

  export interface LunarTime {
    getZhi(): string;
    getMinHm(): string;
    getMaxHm(): string;
    getGanZhi(): string;
  }

  export interface EightChar {
    getYearGan(): string;
    getYearZhi(): string;
    getYearNaYin(): string;
    getMonthGan(): string;
    getMonthZhi(): string;
    getMonthNaYin(): string;
    getDayGan(): string;
    getDayZhi(): string;
    getDayNaYin(): string;
    getTimeGan(): string;
    getTimeZhi(): string;
    getTimeNaYin(): string;
  }
}
