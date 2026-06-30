import type { ProductId } from "../config";

export const PRODUCTS: Record<
  ProductId,
  { id: ProductId; name: string; description: string; price: number }
> = {
  gua_premium: { id: "gua_premium", name: "周易卦象详批", description: "本卦·互卦·变卦深度解读", price: 8.8 },
  qian_premium: { id: "qian_premium", name: "灵签详批", description: "签诗逐句释义，针对您的问题深度分析", price: 6.6 },
  bazi_premium: { id: "bazi_premium", name: "八字精批", description: "四柱格局、五行喜忌、流年运势", price: 18.8 },
  ziwei_premium: { id: "ziwei_premium", name: "紫微斗数详批", description: "命宫十二宫、主星辅星格局", price: 18.8 },
  ziwei_charts_premium: { id: "ziwei_charts_premium", name: "紫微十二宫星曜表", description: "完整十二宫主星辅星表", price: 12.8 },
  qimen_premium: { id: "qimen_premium", name: "奇门遁甲详批", description: "九宫八门格局与行事宜忌", price: 8.8 },
  qimen_charts_premium: { id: "qimen_charts_premium", name: "奇门九宫专项盘", description: "完整九宫盘布局推演", price: 9.9 },
  dream_premium: { id: "dream_premium", name: "梦境详批", description: "周公解梦深度分析", price: 6.6 },
  xiang_premium: { id: "xiang_premium", name: "掌纹面相详批", description: "完整相学分析", price: 18.8 },
  naming_premium: { id: "naming_premium", name: "取名完整方案", description: "候选名字、寓意、音韵详解", price: 15.9 },
};
