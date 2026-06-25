export interface MeditationTrack {
  id: string;
  title: string;
  subtitle: string;
  duration: number;
  genre: string;
  license: string;
  icon: string;
  color: string;
  description: string;
  url: string;
}

export interface GuidedSession {
  id: string;
  title: string;
  subtitle: string;
  duration: number;
  steps: string[];
}

export interface MeditationCatalog {
  tracks: MeditationTrack[];
  guided: GuidedSession[];
  quote: { text: string; source: string };
}

export const MEDITATION_CATALOG: MeditationCatalog = {
  quote: {
    text: "息念放下，自性清明",
    source: "静坐心得",
  },
  tracks: [
    {
      id: "bodhi_theme",
      title: "清音序曲",
      subtitle: "晨光微照·心门渐开",
      duration: 177,
      genre: "序曲",
      license: "本站原创",
      icon: "🪷",
      color: "#c9a05c",
      description: "以轻柔旋律引路，适合静坐前的准备与调息。",
      url: "/meditation/bodhi_theme.mp3",
    },
    {
      id: "bodhi_garden",
      title: "幽径漫步",
      subtitle: "林深人静·万念渐息",
      duration: 171,
      genre: "自然",
      license: "本站原创",
      icon: "🌿",
      color: "#7BA686",
      description: "如行于幽径，步步远离喧嚣，适合午后静坐。",
      url: "/meditation/bodhi_garden.mp3",
    },
    {
      id: "bodhi_light",
      title: "轻云慢板",
      subtitle: "云淡风轻·意守当下",
      duration: 195,
      genre: "轻音乐",
      license: "本站原创",
      icon: "🪷",
      color: "#D4BC8A",
      description: "节奏舒缓，适合较长时间的静坐陪伴。",
      url: "/meditation/bodhi_light.mp3",
    },
    {
      id: "bodhi_crossing",
      title: "渡心河",
      subtitle: "放下挂碍·返照本心",
      duration: 219,
      genre: "沉思",
      license: "本站原创",
      icon: "🛶",
      color: "#3D5A80",
      description: "象征放下烦忧、回归内心的旋律。",
      url: "/meditation/bodhi_crossing.mp3",
    },
    {
      id: "palace_dawn",
      title: "晨钟暮鼓",
      subtitle: "日出而作·一日之始",
      duration: 168,
      genre: "晨修",
      license: "本站原创",
      icon: "🌅",
      color: "#E89B5C",
      description: "清晨第一坐的良伴，帮助身心迅速沉静。",
      url: "/meditation/palace_dawn.mp3",
    },
    {
      id: "zen_sit",
      title: "安住",
      subtitle: "调身调息·安住当下",
      duration: 156,
      genre: "正念",
      license: "本站原创",
      icon: "🧘",
      color: "#5A7C65",
      description: "节奏平稳，引导身心快速安住。",
      url: "/meditation/zen_sit.mp3",
    },
    {
      id: "zen_mind",
      title: "空山",
      subtitle: "山空人静·心自清凉",
      duration: 192,
      genre: "禅韵",
      license: "本站原创",
      icon: "☯️",
      color: "#8A8A8A",
      description: "在闹市中也能听见的内心静默。",
      url: "/meditation/zen_mind.mp3",
    },
    {
      id: "crystal_moon",
      title: "琉璃月",
      subtitle: "月华如水·照见本心",
      duration: 211,
      genre: "夜修",
      license: "本站原创",
      icon: "🌕",
      color: "#a3c5ab",
      description: "清澈悠远的旋律，适合夜间静坐。",
      url: "/meditation/crystal_moon.mp3",
    },
    {
      id: "great_compassion",
      title: "大悲咒",
      subtitle: "梵音庄严·慈悲摄心",
      duration: 246,
      genre: "梵唱",
      license: "传统佛曲",
      icon: "🙏",
      color: "#c43d3d",
      description: "传统大悲咒梵唱，庄严摄心。",
      url: "/meditation/great_compassion.mp3",
    },
    {
      id: "heart_sutra",
      title: "心经",
      subtitle: "般若妙义·照见空性",
      duration: 235,
      genre: "梵唱",
      license: "传统佛曲",
      icon: "📿",
      color: "#c9a05c",
      description: "《心经》梵唱，帮助收摄心神。",
      url: "/meditation/heart_sutra.mp3",
    },
  ],
  guided: [
    {
      id: "10min",
      title: "十分钟入门",
      subtitle: "零基础可练",
      duration: 600,
      steps: [
        "找一处安静角落，脊背自然挺直",
        "缓慢呼吸三次，吸四秒、呼六秒",
        "感受气息从鼻尖进出",
        "念头来了就让它走，轻轻回到呼吸",
        "结束时合掌，默念一句祝愿",
      ],
    },
    {
      id: "20min",
      title: "二十分钟正念",
      subtitle: "有一定基础",
      duration: 1200,
      steps: [
        "三次深长吐纳，放松肩颈",
        "专注鼻尖呼吸，不刻意控制",
        "从头到脚扫描身体，逐处放松",
        "看见念头升起，不评判、不跟随",
        "结束前默念：愿自他安乐",
      ],
    },
    {
      id: "namo",
      title: "持名静坐",
      subtitle: "以佛号摄心",
      duration: 900,
      steps: [
        "盘坐或正坐，双手自然安放",
        "心中默念「南无阿弥陀佛」",
        "一字一呼，不急不慢",
        "走神时，温和回到佛号",
        "下座前合掌，感恩这一坐",
      ],
    },
  ],
};

export function formatMeditationTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
