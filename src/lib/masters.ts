export interface Master {
  id: string;
  name: string;
  title: string;
  style: string;
  description: string;
}

export const MASTERS: Master[] = [
  {
    id: "huiming",
    name: "慧明长老",
    title: "古寺住持",
    style: "庄重持重，引经据典",
    description:
      "通读《渊海子平》《滴天髓》，言语稳重克制。适合希望深度解读、看古籍出处的施主。",
  },
  {
    id: "mingxin",
    name: "明心师父",
    title: "尼众法师",
    style: "慈悲温柔，劝人向善",
    description: "语调温和，慈悲为怀。适合家庭、感情、亲人祈福场景。",
  },
  {
    id: "xuanzhen",
    name: "玄真道长",
    title: "山中道人",
    style: "直爽通透，说大白话",
    description: "山中道人，不爱绕弯子。把命理讲成大白话，适合急性子。",
  },
];

export function getMaster(id: string): Master {
  return MASTERS.find((m) => m.id === id) ?? MASTERS[0];
}
