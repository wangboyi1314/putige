export type LineValue = 6 | 7 | 8 | 9;
export type YinYang = "yin" | "yang";

export interface Hexagram {
  number: number;
  name: string;
  symbol: string;
  guaCi: string;
  tuanCi: string;
  xiangCi: string;
  wenYan?: string;
}

export const HEXAGRAMS: Hexagram[] = [
  { number: 1, name: "乾", symbol: "䷀", guaCi: "元亨利贞。", tuanCi: "大哉乾元，万物资始，乃统天。", xiangCi: "天行健，君子以自强不息。" },
  { number: 2, name: "坤", symbol: "䷁", guaCi: "元亨，利牝马之贞。", tuanCi: "至哉坤元，万物资生，乃顺承天。", xiangCi: "地势坤，君子以厚德载物。" },
  { number: 3, name: "屯", symbol: "䷂", guaCi: "元亨利贞，勿用有攸往，利建侯。", tuanCi: "屯，刚柔始交而难生。", xiangCi: "云雷屯，君子以经纶。" },
  { number: 4, name: "蒙", symbol: "䷃", guaCi: "亨。匪我求童蒙，童蒙求我。", tuanCi: "蒙，山下有险，险而止，蒙。", xiangCi: "山下出泉，蒙；君子以果行育德。" },
  { number: 5, name: "需", symbol: "䷄", guaCi: "有孚，光亨，贞吉，利涉大川。", tuanCi: "需，须也；险在前也。", xiangCi: "云上于天，需；君子以饮食宴乐。" },
  { number: 6, name: "讼", symbol: "䷅", guaCi: "有孚窒惕，中吉，终凶。利见大人，不利涉大川。", tuanCi: "讼，上刚下险，险而健讼。", xiangCi: "天与水违行，讼；君子以作事谋始。" },
  { number: 7, name: "师", symbol: "䷆", guaCi: "贞，丈人吉，无咎。", tuanCi: "师，众也，贞正也。", xiangCi: "地中有水，师；君子以容民畜众。" },
  { number: 8, name: "比", symbol: "䷇", guaCi: "吉。原筮元永贞，无咎。", tuanCi: "比，吉也，比辅也。", xiangCi: "地上有水，比；先王以建万国，亲诸侯。" },
  { number: 9, name: "小畜", symbol: "䷈", guaCi: "亨。密云不雨，自我西郊。", tuanCi: "小畜；柔得位，而上下应之。", xiangCi: "风行天上，小畜；君子以懿文德。" },
  { number: 10, name: "履", symbol: "䷉", guaCi: "履虎尾，不咥人，亨。", tuanCi: "履，柔履刚也。", xiangCi: "上天下泽，履；君子以辨上下，定民志。" },
  { number: 11, name: "泰", symbol: "䷊", guaCi: "小往大来，吉亨。", tuanCi: "泰，小往大来，吉亨。", xiangCi: "天地交泰，后以财成天地之道。" },
  { number: 12, name: "否", symbol: "䷋", guaCi: "否之匪人，不利君子贞，大往小来。", tuanCi: "否之匪人，不利君子贞。", xiangCi: "天地不交，否；君子以俭德辟难。" },
  { number: 13, name: "同人", symbol: "䷌", guaCi: "同人于野，亨。利涉大川，利君子贞。", tuanCi: "同人，柔得位得中，而应乎乾。", xiangCi: "天与火，同人；君子以类族辨物。" },
  { number: 14, name: "大有", symbol: "䷍", guaCi: "元亨。", tuanCi: "大有，柔得尊位，大中而上下应之。", xiangCi: "火在天上，大有；君子以遏恶扬善。" },
  { number: 15, name: "谦", symbol: "䷎", guaCi: "亨，君子有终。", tuanCi: "谦，亨，天道下济而光明。", xiangCi: "地中有山，谦；君子以裒多益寡。" },
  { number: 16, name: "豫", symbol: "䷏", guaCi: "利建侯行师。", tuanCi: "豫，刚应而志行，顺以动。", xiangCi: "雷出地奋，豫；先王以作乐崇德。" },
  { number: 17, name: "随", symbol: "䷐", guaCi: "元亨利贞，无咎。", tuanCi: "随，刚来而下柔，动而说。", xiangCi: "泽中有雷，随；君子以向晦入宴息。" },
  { number: 18, name: "蛊", symbol: "䷑", guaCi: "元亨，利涉大川。先甲三日，后甲三日。", tuanCi: "蛊，刚上而柔下，巽而止。", xiangCi: "山下有风，蛊；君子以振民育德。" },
  { number: 19, name: "临", symbol: "䷒", guaCi: "元亨利贞。至于八月有凶。", tuanCi: "临，刚浸而长。", xiangCi: "泽上有地，临；君子以教思无穷。" },
  { number: 20, name: "观", symbol: "䷓", guaCi: "盥而不荐，有孚颙若。", tuanCi: "大观在上，顺而巽，中正以观天下。", xiangCi: "风行地上，观；先王以省方，观民设教。" },
  { number: 21, name: "噬嗑", symbol: "䷔", guaCi: "亨。利用狱。", tuanCi: "颐中有物，曰噬嗑。", xiangCi: "雷电噬嗑；先王以明罚敕法。" },
  { number: 22, name: "贲", symbol: "䷕", guaCi: "亨。小利有攸往。", tuanCi: "贲，亨；柔来而文刚。", xiangCi: "山下有火，贲；君子以明庶政。" },
  { number: 23, name: "剥", symbol: "䷖", guaCi: "不利有攸往。", tuanCi: "剥，剥也，柔变刚也。", xiangCi: "山附地上，剥；上以厚下，安宅。" },
  { number: 24, name: "复", symbol: "䷗", guaCi: "亨。出入无疾，朋来无咎。", tuanCi: "复亨；刚反，动而以顺行。", xiangCi: "雷在地中，复；先王以至日闭关。" },
  { number: 25, name: "无妄", symbol: "䷘", guaCi: "元亨利贞。其匪正有眚，不利有攸往。", tuanCi: "无妄，刚自外来，而为主于内。", xiangCi: "天下雷行，物与无妄；先王以茂对时育万物。" },
  { number: 26, name: "大畜", symbol: "䷙", guaCi: "利贞，不家食吉，利涉大川。", tuanCi: "大畜，刚健笃实辉光，日新其德。", xiangCi: "天在山中，大畜；君子以多识前言往行。" },
  { number: 27, name: "颐", symbol: "䷚", guaCi: "贞吉。观颐，自求口实。", tuanCi: "颐，贞吉，养正则吉也。", xiangCi: "山下有雷，颐；君子以慎言语，节饮食。" },
  { number: 28, name: "大过", symbol: "䷛", guaCi: "栋桡，利有攸往，亨。", tuanCi: "大过，大者过也。", xiangCi: "泽灭木，大过；君子以独立不惧，遁世无闷。" },
  { number: 29, name: "坎", symbol: "䷜", guaCi: "有孚，维心亨，行有尚。", tuanCi: "习坎，重险也。", xiangCi: "水洊至，习坎；君子以常德行，习教事。" },
  { number: 30, name: "离", symbol: "䷝", guaCi: "利贞，亨。畜牝牛，吉。", tuanCi: "离，丽也；日月丽乎天。", xiangCi: "明两作离，大人以继明照于四方。" },
  { number: 31, name: "咸", symbol: "䷞", guaCi: "亨，利贞，取女吉。", tuanCi: "咸，感也。柔上而刚下，二气感应以相与。", xiangCi: "山上有泽，咸；君子以虚受人。" },
  { number: 32, name: "恒", symbol: "䷟", guaCi: "亨，无咎，利贞，利有攸往。", tuanCi: "恒，久也。刚上而柔下，雷风恒。", xiangCi: "雷风，恒；君子以立不易方。" },
  { number: 33, name: "遁", symbol: "䷠", guaCi: "亨，小利贞。", tuanCi: "遁亨，遁而亨也。", xiangCi: "天下有山，遁；君子以远小人，不恶而严。" },
  { number: 34, name: "大壮", symbol: "䷡", guaCi: "利贞。", tuanCi: "大壮，大者壮也。", xiangCi: "雷在天上，大壮；君子以非礼弗履。" },
  { number: 35, name: "晋", symbol: "䷢", guaCi: "康侯用锡马蕃庶，昼日三接。", tuanCi: "晋，进也。明出地上，顺而丽乎大明。", xiangCi: "明出地上，晋；君子以自昭明德。" },
  { number: 36, name: "明夷", symbol: "䷣", guaCi: "利艰贞。", tuanCi: "明入地中，明夷。", xiangCi: "明入地中，明夷；君子以莅众，用晦而明。" },
  { number: 37, name: "家人", symbol: "䷤", guaCi: "利女贞。", tuanCi: "家人，女正位乎内，男正位乎外。", xiangCi: "风自火出，家人；君子以言有物而行有恒。" },
  { number: 38, name: "睽", symbol: "䷥", guaCi: "小事吉。", tuanCi: "睽，外刚而内柔，说而丽乎明。", xiangCi: "上火下泽，睽；君子以同而异。" },
  { number: 39, name: "蹇", symbol: "䷦", guaCi: "利西南，不利东北；利见大人，贞吉。", tuanCi: "蹇，难也，险在前也。", xiangCi: "山上有水，蹇；君子以反身修德。" },
  { number: 40, name: "解", symbol: "䷧", guaCi: "利西南，无所往，其来复吉。有攸往，夙吉。", tuanCi: "解，险以动，动而免乎险。", xiangCi: "雷雨作，解；君子以赦过宥罪。" },
  { number: 41, name: "损", symbol: "䷨", guaCi: "有孚，元吉，无咎，可贞，利有攸往。", tuanCi: "损，损下益上，其道上行。", xiangCi: "山下有泽，损；君子以惩忿窒欲。" },
  { number: 42, name: "益", symbol: "䷩", guaCi: "利有攸往，利涉大川。", tuanCi: "益，损上益下，民说无疆。", xiangCi: "风雷，益；君子以见善则迁，有过则改。" },
  { number: 43, name: "夬", symbol: "䷪", guaCi: "扬于王庭，孚号，有厉，告自邑，不利即戎，利有攸往。", tuanCi: "夬，决也，刚决柔也。", xiangCi: "泽上于天，夬；君子以施禄及下，居德则忌。" },
  { number: 44, name: "姤", symbol: "䷫", guaCi: "女壮，勿用取女。", tuanCi: "姤，遇也，柔遇刚也。", xiangCi: "天下有风，姤；后以施命诰四方。" },
  { number: 45, name: "萃", symbol: "䷬", guaCi: "亨。王假有庙，利见大人，亨，利贞。", tuanCi: "萃，聚也；顺以说，刚中而应。", xiangCi: "泽上于地，萃；君子以除戎器，戒不虞。" },
  { number: 46, name: "升", symbol: "䷭", guaCi: "元亨，用见大人，勿恤，南征吉。", tuanCi: "升，巽而顺，刚中而柔应。", xiangCi: "地中生木，升；君子以顺德，积小以高大。" },
  { number: 47, name: "困", symbol: "䷮", guaCi: "亨，贞，大人吉，无咎，有言不信。", tuanCi: "困，刚掩也。", xiangCi: "泽无水，困；君子以致命遂志。" },
  { number: 48, name: "井", symbol: "䷯", guaCi: "改邑不改井，无丧无得，往来井井。", tuanCi: "井，改邑不改井，乃以刚中也。", xiangCi: "木上有水，井；君子以劳民劝相。" },
  { number: 49, name: "革", symbol: "䷰", guaCi: "己日乃孚，元亨利贞，悔亡。", tuanCi: "革，水火相息，二女同居。", xiangCi: "泽中有火，革；君子以治历明时。" },
  { number: 50, name: "鼎", symbol: "䷱", guaCi: "元吉，亨。", tuanCi: "鼎，象也。以木巽火，亨饪也。", xiangCi: "木上有火，鼎；君子以正位凝命。" },
  { number: 51, name: "震", symbol: "䷲", guaCi: "亨。震来虩虩，笑言哑哑。", tuanCi: "震，亨。震来虩虩，恐致福也。", xiangCi: "洊雷，震；君子以恐惧修省。" },
  { number: 52, name: "艮", symbol: "䷳", guaCi: "艮其背，不获其身，行其庭，不见其人，无咎。", tuanCi: "艮，止也，时止则止，时行则行。", xiangCi: "兼山，艮；君子以思不出其位。" },
  { number: 53, name: "渐", symbol: "䷴", guaCi: "女归吉，利贞。", tuanCi: "渐之进也，女归吉也。", xiangCi: "山上有木，渐；君子以居贤德善俗。" },
  { number: 54, name: "归妹", symbol: "䷵", guaCi: "征凶，无攸利。", tuanCi: "归妹，天地之大义也。", xiangCi: "泽上有雷，归妹；君子以永终知敝。" },
  { number: 55, name: "丰", symbol: "䷶", guaCi: "亨，王假之，勿忧，宜日中。", tuanCi: "丰，大也。明以动，故丰。", xiangCi: "雷电皆至，丰；君子以折狱致刑。" },
  { number: 56, name: "旅", symbol: "䷷", guaCi: "小亨，旅贞吉。", tuanCi: "旅，小亨，柔得中乎外。", xiangCi: "山上有火，旅；君子以明慎用刑，而不留狱。" },
  { number: 57, name: "巽", symbol: "䷸", guaCi: "小亨，利攸往，利见大人。", tuanCi: "重巽以申命，刚巽乎中正而志行。", xiangCi: "随风，巽；君子以申命行事。" },
  { number: 58, name: "兑", symbol: "䷹", guaCi: "亨，利贞。", tuanCi: "兑，说也。刚中而柔外，说以利贞。", xiangCi: "丽泽，兑；君子以朋友讲习。" },
  { number: 59, name: "涣", symbol: "䷺", guaCi: "亨。王假有庙，利涉大川，利贞。", tuanCi: "涣，亨。刚来而不穷，柔得位乎外而上同。", xiangCi: "风行水上，涣；先王以享于帝立庙。" },
  { number: 60, name: "节", symbol: "䷻", guaCi: "亨。苦节不可贞。", tuanCi: "节，亨，刚柔分，而刚得中。", xiangCi: "泽上有水，节；君子以制数度，议德行。" },
  { number: 61, name: "中孚", symbol: "䷼", guaCi: "豚鱼吉，利涉大川，利贞。", tuanCi: "中孚，柔在内而刚得中。", xiangCi: "泽上有风，中孚；君子以议狱缓死。" },
  { number: 62, name: "小过", symbol: "䷽", guaCi: "亨，利贞，可小事，不可大事。", tuanCi: "小过，小者过而亨也。", xiangCi: "山上有雷，小过；君子以行过乎恭，丧过乎哀，用过乎俭。" },
  { number: 63, name: "既济", symbol: "䷾", guaCi: "亨，小利贞，初吉终乱。", tuanCi: "既济，亨，小者亨也。", xiangCi: "水在火上，既济；君子以思患而预防之。" },
  { number: 64, name: "未济", symbol: "䷿", guaCi: "亨，小狐汔济，濡其尾，无攸利。", tuanCi: "未济，亨；柔得中也。", xiangCi: "火在水上，未济；君子以慎辨物居方。" },
];

const TRIGRAM_BITS: Record<string, number> = {
  "乾": 7, "兑": 6, "离": 5, "震": 4,
  "巽": 3, "坎": 2, "艮": 1, "坤": 0,
};

const KING_WEN: Record<string, number> = {};
for (const h of HEXAGRAMS) {
  KING_WEN[h.name] = h.number;
}

export function lineToYinYang(v: LineValue): YinYang {
  return v === 7 || v === 9 ? "yang" : "yin";
}

export function isChanging(v: LineValue): boolean {
  return v === 6 || v === 9;
}

export function tossCoins(): LineValue {
  let heads = 0;
  for (let i = 0; i < 3; i++) {
    if (Math.random() < 0.5) heads++;
  }
  if (heads === 3) return 9;
  if (heads === 2) return 8;
  if (heads === 1) return 7;
  return 6;
}

function linesToTrigram(lines: YinYang[]): number {
  let bits = 0;
  for (let i = 0; i < 3; i++) {
    if (lines[i] === "yang") bits |= 1 << i;
  }
  return bits;
}

const TRIGRAM_NAMES = ["坤", "艮", "坎", "巽", "震", "离", "兑", "乾"];

function trigramToName(bits: number): string {
  return TRIGRAM_NAMES[bits] ?? "坤";
}

function hexagramFromTrigrams(upper: string, lower: string): Hexagram {
  const upperBits = TRIGRAM_BITS[upper] ?? 0;
  const lowerBits = TRIGRAM_BITS[lower] ?? 0;
  const number = upperBits * 8 + lowerBits + 1;
  return HEXAGRAMS[number - 1] ?? HEXAGRAMS[0];
}

export interface GuaResult {
  lines: LineValue[];
  benGua: Hexagram;
  huGua: Hexagram;
  bianGua: Hexagram | null;
  changingLines: number[];
}

export function castHexagram(lines: LineValue[]): GuaResult {
  const yinYang = lines.map(lineToYinYang);
  const lower = trigramToName(linesToTrigram(yinYang.slice(0, 3)));
  const upper = trigramToName(linesToTrigram(yinYang.slice(3, 6)));
  const benGua = hexagramFromTrigrams(upper, lower);

  const huLower = trigramToName(linesToTrigram([yinYang[1], yinYang[2], yinYang[3]]));
  const huUpper = trigramToName(linesToTrigram([yinYang[2], yinYang[3], yinYang[4]]));
  const huGua = hexagramFromTrigrams(huUpper, huLower);

  const changingLines = lines
    .map((l, i) => (isChanging(l) ? i + 1 : -1))
    .filter((i) => i > 0);

  let bianGua: Hexagram | null = null;
  if (changingLines.length > 0) {
    const changed = yinYang.map((yy, i) => {
      if (isChanging(lines[i])) return yy === "yang" ? "yin" : "yang";
      return yy;
    });
    const bLower = trigramToName(linesToTrigram(changed.slice(0, 3)));
    const bUpper = trigramToName(linesToTrigram(changed.slice(3, 6)));
    bianGua = hexagramFromTrigrams(bUpper, bLower);
  }

  return { lines, benGua, huGua, bianGua, changingLines };
}

export function getHexagramByNumber(n: number): Hexagram {
  return HEXAGRAMS[Math.max(1, Math.min(64, n)) - 1];
}
