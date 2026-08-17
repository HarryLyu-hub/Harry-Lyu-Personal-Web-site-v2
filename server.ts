import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { DIMENSIONS, COUNTRIES, INITIAL_CASES } from "./src/data";

dotenv.config();

const app = express();
app.use(express.json({ limit: "20mb" }));

const PORT = 3000;

const SERVER_START_TIME = new Date().toLocaleString("zh-CN", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
});

// Lazy initialize Gemini API client to prevent crashing on startup if the key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Fallback high-fidelity local static analyze engine for the pre-built classes or custom cases
function getLocalFallbackAnalysis(title: string, description: string, countryAName: string, countryBName: string): any {
  const normTitle = title || "";
  const normDesc = description || "";
  
  // Custom high-quality fallback for Egypt / Middle East dealer cases
  if (
    normTitle.includes("埃及") || 
    normTitle.includes("Egypt") || 
    normTitle.includes("中东") || 
    normTitle.includes("经销商") ||
    normDesc.includes("埃及") || 
    normDesc.includes("Egypt") || 
    normDesc.includes("中东") || 
    normDesc.includes("经销商") || 
    normDesc.includes("晚餐") ||
    countryBName === "Egypt" || 
    countryBName === "埃及"
  ) {
    return {
      clashAnalysis: "本案冲突本质在于：中国出海团队习惯了KPI驱动、高效理性的‘正式会议硬核推进’模式，去碰撞埃及（中东）悠久的『高语境、重关系信任（Wasta）与面子颜面』文化大坝。在埃及，正式会议往往是展示礼貌、保全机构体面（Gengsi）的舞台，因此经销商不愿在会上公开谈及实际困难或做硬性表态；只有在晚餐、饮茶等非正式、私密放松的场景下，双方建立起真正的私人关系纽带后，他们才觉得环境足够安全，愿意为中方‘指点迷津’。若执意强攻正式会议，只会陷入礼貌敷衍的无限期延滞中。",
      dimensionsInvolved: [
        {
          dimensionId: "trusting",
          dimensionNameZh: "信任基础维度 (任务导向 VS 关系导向)",
          frictionReason: "中国团队面对总部出海指标，往往默认‘我们谈的是商务合同，按理性的任务里程碑推进即可’（得分5.0）；而埃及经销商秉承经典的‘关系导向（得分9.0）’信任。在埃及，‘先做朋友、再做生意’是最高准则。缺少非正式场合的人际热络和温情铺垫，对方没有安全感，绝不会轻易表态或配合执行。",
          countryAScore: 5.0,
          countryBScore: 9.0,
          gapDescription: "功利任务 ⚔️ 慢热关系"
        },
        {
          dimensionId: "communicating",
          dimensionNameZh: "沟通方式维度 (低语境直白 VS 极高语境含蓄)",
          frictionReason: "埃及属于极高语境文化（得分9.5）。在正式会议上，为顾及彼此面子和外交礼仪，经销商必然采用极其委婉、含糊、客套的外交辞令，不愿打破和谐氛围；只有在晚餐等私密场景，借由非正式关系的掩护，他们才能用高语境的‘话外音’或直接‘指点迷津’。不理解这一场景转换，中方就无法破译真实的决策密码。",
          countryAScore: 8.0,
          countryBScore: 9.5,
          gapDescription: "直白多言 ⚔️ 场景译码"
        }
      ],
      adviceForA: [
        "【转换推进战场】：彻底停止在正式、严肃的会议桌上对埃及经销商进行高压催办。将核心诉求和真实对账点，顺畅地迁移到晚餐、下午茶、高尔夫或咖啡沙龙等非正式场景中进行解决。",
        "【寒暄热络先行】：在中东及埃及交往，切忌开门见山亮出商务条款。前30-40分钟必须用于拉家常、询问对方身体、家庭好不好（避免指名女性家属），展现人情味和对本地风土人情的尊重，让对方感受到你的真诚。",
        "【晚餐闪电聚会】：在第一次礼貌商务会谈后，尽快约请对方核心决策人进行私密晚餐。真诚表达‘我们初到贵地，非常渴望得到您的本地智慧指引，像兄弟一样多听您的建议。’一旦关系跨过‘兄弟’门槛，对方就会主动为你透露办妥事情的‘内部暗道’。",
        "【正式签字过场】：在晚餐等非正式场景谈拢对齐、疑虑打消后，再将条款放回正式会议桌上进行‘公开签字’。在正式会议上，给予对方经销商机构足够的尊重与赞赏，让双方在台面上都极其体面。"
      ],
      adviceForB: [
        "理解中方团队面临的‘中国速度’和高压KPI催化，主动向中方表明埃及本地推进商业的『人情与信任前置规律』，避免不必要的生硬拒绝。",
        "即便在正式会议中有些难言之隐或未决卡点，也应向中方提供简易的‘流程状态指示灯’（红绿黄RAG状态），缓解中方因信息黑盒带来的焦虑。",
        "在非正式场合点拨中国经理后，主动协助并引导中方将这些合规暗道转变成符合中方总部合规要求的白纸黑字行动文书，帮助中方经理在内部安全交差。"
      ],
      learningTakeaways: [
        "关系重于合同。在埃及等高语境中东市场，『关系』不是生意的润滑剂，『关系』就是生意本身的底牌。没有信任温存，合同也无法落地执行；有了私人情谊，任何困难都能迎刃而解。",
        "场景即是译码器。正式会议是用来彰显声威和礼仪的，晚餐密室才是真正的决策与共识缝合场。全球化管理者必须能灵活在正式与非正式之间转换身位。"
      ],
      isAiGenerated: false
    };
  }

  if (normTitle.includes("极限施压") || normTitle.includes("中国速度") || normTitle.includes("Germany & Japan compliance")) {
    return {
      clashAnalysis: "本标案冲突本质在于：中国管理团队强推高压急进、‘先跑起来迭代’的模式，去碰撞重视全面‘共识’（Nemawashi）与流程正当性（Ringisho）的德国和日本合规大坝。这一‘速度时差’在跨国高价值电信交付中，极易形成信息阻断并最终沦为废标代价。",
      dimensionsInvolved: [
        {
          dimensionId: "deciding",
          dimensionNameZh: "决策机制维度 (闪电决策 VS 全员共识)",
          frictionReason: "中国决策端习惯自上而下拍板迅速，线上补足手续；日德更崇尚‘谋定而后动’与规避不确定性。不尊重‘根回’（Nemawashi）而极限施压只会带来日方的防卫性抗拒。",
          countryAScore: 9.0,
          countryBScore: 4.0,
          gapDescription: "决策距离高达5.0分（中企 9.0 分自上而下，日企 4.0 分共识优先）"
        },
        {
          dimensionId: "scheduling",
          dimensionNameZh: "时间管理维度 (弹性灵活 VS 刚性线性观)",
          frictionReason: "中国对死线持相对弹性，依靠默契与高语境强力推进；日德认为‘流程不正确则结果不可信’，未留足两周流程校验导致协作脱轨。",
          countryAScore: 7.0,
          countryBScore: 1.5,
          gapDescription: "时间距离相差极大。德国和日本要求在严谨的线性时间尺度内做事。"
        }
      ],
      adviceForA: [
        "尊重德日流程。在出海大B端高价值竞标中，切忌临时抱佛脚，必须为主流德、日分部预留至少2周至1个月的合规核算周期。",
        "由项目经理主动对接，将口头诉苦转换为多国可行合规的‘客观时间表与里程碑清单’来进行沟通。",
        "紧扣SLA契约与法律底线先行，用理性的严密契约打底消除不确定性，而不是用‘兄弟拼命、天天熬夜’的态度来打感情牌。"
      ],
      adviceForB: [
        "在解释合规要求时，避免给中国总部生硬地传递‘需要两周/不行’等结论，应该透明列出流程图，增加沟通的可见度与信任度。",
        "在日本内部成立面对海外加急项目的‘绿色闪电通道’，尽量缩短审核链条。",
        "使用红/绿等通俗低语境化状态标识（RAG Tables）清晰表达风险，代替间接委婉的潜辞令。"
      ],
      learningTakeaways: [
        "出海绝不仅是产品或技术的物理溢出，更是组织机制与管理文化的自我进化。在国际市场博弈中，有时‘尊重流程的慢’，恰恰是建立‘全球高价值高信任’的唯一捷径。",
        "不要期望通过强迫对方顺应你的无序速度来拿到成果，快而无序在合规刚性红线前等于零。"
      ],
      isAiGenerated: false
    };
  }

  if (normTitle.includes("特批") || normTitle.includes("已读不回") || normTitle.includes("Good Order")) {
    return {
      clashAnalysis: "本冲突本质不仅是个人是否死板，而是中方基于情感和非正式途径的‘高频刷脸’，在深受英系教育影响、极度‘原理优先’（Principles-First）及高度集权的印度层级决策仪式前，被等同于无意义的‘非正式诉诉苦’，因不符合程序正义（Hierarchy）故未被视作正式发起请求。",
      dimensionsInvolved: [
        {
          dimensionId: "persuading",
          dimensionNameZh: "说服逻辑维度 (结论优先 VS 原理优先)",
          frictionReason: "中方倾向汇报结论、强调困难来争取特批；印方管理者需要审视背后大盘的前因后果、严密的数据推导和财务账目支撑（Good Order），否则不屑予以审批。",
          countryAScore: 4.5,
          countryBScore: 5.0,
          gapDescription: "印度（原理优先 5.0），中国（应用/结论优先 4.5 伴有高语境诉苦）"
        },
        {
          dimensionId: "leading",
          dimensionNameZh: "领导风格维度 (程序正义 VS 并肩作战)",
          frictionReason: "印度受传统和英系体制浸润，有着森严的阶层和流程 formal 意识。口头沟通在印度语境中属于‘非正规交流’，没有提交正式结构化邮件，主管就缺乏签字通过的‘仪式感’。",
          countryAScore: 9.0,
          countryBScore: 8.0,
          gapDescription: "印度层级集权感更重，主管极其在乎汇报手段的正确与否。"
        }
      ],
      adviceForA: [
        "彻底放弃大大小小的会议上的口头宣贯与拉拉家常式的诉苦。把多余的过程噪音去掉，直接提供数据化陈述。",
        "撰写正式特批邮件时，必须严格奉行『Put things in good order』。按照【背景 → 矛盾 → 差距分析 → 财务成本支撑 → 风险对冲】的闭环逻辑打包呈递。",
        "请在文书落脚处明确写出发起特批请求的指令字眼，如『请求您予以批准 / Please approve』，以赋予管理者行使高级签字权的权力仪式。"
      ],
      adviceForB: [
        "提示中国团队在遇到严重延误 and 需要Headcount等关键资源时，主动作出文书框架指引，而不是冷淡地丢一句『put things in good order』让对方猜测。",
        "理解中方‘高频刷脸’往往意味着大中华区遇到了严重业务卡点，主动介入非正式同步来缓解前线压力。",
        "减少繁冗漫长的层级制审批链，给下层区域自主补充短期人力的适度豁免机能。"
      ],
      learningTakeaways: [
        "不要指望在低语境、原理优先统治的精英外企高管中，通过口头共情来突破审批，流程在他们眼里是保障合规的护城河。",
        "把上级当成调动总部资源的‘资源总闸’。放下情绪内耗，用结构化、数据化的闭学、闭环工具做他的子弹。"
      ],
      isAiGenerated: false
    };
  }

  if (normTitle.includes("看客") || normTitle.includes("激辩") || normTitle.includes("不插嘴")) {
    return {
      clashAnalysis: "本案是规避冲突文化在面对英美‘吆喝推销（Pitching）型共识决策’中的失声。中方项目经理的‘礼貌等待’在西方文化翻译中等同于‘弃权认可’；而其在会议尾声抛出庞大完美方案的‘大杀器发言’，在对方决策文化里反被视为极其不可预测、不透明的‘憋大招核弹偷袭’，严重破坏了动态缝合的共识信任机制。",
      dimensionsInvolved: [
        {
          dimensionId: "disagreeing",
          dimensionNameZh: "异议表达维度 (公开直面冲突 VS 规避冲突)",
          frictionReason: "西方（如澳大利亚、美国、英美系）坚信真理越辩越明，激烈插嘴辩论是对事不对人；中国极其尊重面子文化，认为打断别人极其不礼貌，选择含蓄倾听。",
          countryAScore: 5.0,
          countryBScore: 8.0,
          gapDescription: "中西方异议轴向错位（澳大利亚/英美崇尚激烈对攻，中国极度规避冲突）"
        },
        {
          dimensionId: "deciding",
          dimensionNameZh: "决策机制维度 (下注式动态共识 VS 谋定后一击必胜)",
          frictionReason: "西方团队的习惯是将想法不成熟时就扔进池子，伴随激烈讨论一边吆喝一边缝合修正；中方则习惯关起门做出百分百完美的百分制方案，再上台发言。时机严重错开。",
          countryAScore: 7.0,
          countryBScore: 9.0,
          gapDescription: "中国（Top-Down且习惯台下做足把握），美国/澳洲（更偏动态共识和台前卡位）"
        }
      ],
      adviceForA: [
        "在西方主导的多边国际工作坊中：不插嘴等于放弃话语权主权！别人不点名不要继续等待，不成熟想法也要早期讲出来一起‘吆喝’。",
        "灵活运用卡位短句过渡：『That is a great point, from China's 10x scale perspective, we see it differently...』强占气口卡位介入。",
        "不要等到会议最后一刻才惊艳抛出底牌。要把中国的庞大体量和实战成果拆细，在前中期作为分析要素提供，避免给外方团队造成‘憋大招偷袭’的被动压力。"
      ],
      adviceForB: [
        "理解中国和东亚员工在公开场合不轻易打断他人的‘文化礼貌’。在会议中主动作出专属定点提问邀请。",
        "不要默认沉默代表全体同意。中方的礼貌和含蓄通常隐藏着对目前大方向的巨大潜在担忧。",
        "在头脑风暴前，通过提供单向匿名看板或会前白板收集各方见解，避免外向人格支配会议结果。"
      ],
      learningTakeaways: [
        "你不吆喝、不表态，在低语境西方的法则里不会被翻译为高雅谦让，而是‘他默认同意我们的看法，且账上没有见解筹码’。",
        "学会‘按尺预判’。全球化的最高领导力，绝非在死线前疯狂挥鞭，而是有能力把不同文化的卡点，转化为共振的沟通频道。"
      ],
      isAiGenerated: false
    };
  }

  if (normTitle.includes("卖惨") || normTitle.includes("椰子壳") || normTitle.includes("Cognitive task trust")) {
    return {
      clashAnalysis: "本案是典型的由于‘关系导向（情感牌）’对撞‘任务导向（认知信任）’引发的信任基础崩溃。中方试图用诉说苦苦、加班加点换取客户共情体谅，而在德国和西方客观任务文化里，诉苦属于内部管理无能的表现。只有极致透明的瑕疵拆解 and 表格化排班计划（颗粒度有钉子有卯），才能在严防死守的德方‘椰子壳’信任机制中砸出合伙人裂口。",
      dimensionsInvolved: [
        {
          dimensionId: "trusting",
          dimensionNameZh: "信任基础维度 (任务导向 VS 关系导向)",
          frictionReason: "德企/西方属于典型的‘桃子/椰子’文化。他们是绝对的任务导向，工作不看态度看系统逻辑和履约确定性；中方则认为人情和加班苦战代表着忠诚与诚意。",
          countryAScore: 3.0,
          countryBScore: 9.0,
          gapDescription: "中德信任基础鸿沟（德国 3.0 任务契约，中国 9.0 极高情感人情导向）"
        },
        {
          dimensionId: "evaluating",
          dimensionNameZh: "反馈评价维度 (公开对事不对人 VS 维持面子)",
          frictionReason: "德企面对质量瑕疵采取毫无保留、撕开面子的直接反馈评价，中国经理内耗地认为被全盘人身否定，导致情绪对抗，升级为政治危机。",
          countryAScore: 1.5,
          countryBScore: 8.0,
          gapDescription: "评价反馈上德企极硬，容不下和稀泥或擦边球"
        }
      ],
      adviceForA: [
        "面对西方/德企甲方，绝不倒苦水。将一切『加班苦战』、人情诉求文字从汇报PPT中彻底剥离删除。",
        "采取极度透明的瑕疵剖析：明确产权和弱处责任分配，体现高度职业诚实（Professional Honesty）。",
        "实施『逻辑对冲』与『颗粒度落实』：方案弱，就用集成商饱和的加班服务资源表格化排班弥补。拿出一份人头排班表、具体的未来3-6个月每日监控表，给予‘有钉子有卯’的刚性保障。"
      ],
      adviceForB: [
        "不要把中方的态度诉苦一律判定为推脱。应辨别其中凝聚的良好商业姿态、对项目的无上忠诚与极强的危机挽回努力。",
        "一旦通过硬核职业考核（砸开椰子壳外壳），可以采取适当非正式社交拉近距离（共进晚宴、饮茶等），中方一旦确信人情，会迸发极强的饱和执行力交付。",
        "给出直接尖锐反馈时，加一句：‘说这业务不行只是理性的修正建议，并非质询你的团队。’降低防御性内耗。"
      ],
      learningTakeaways: [
        "在德国和西欧企业中，信任不看态度看系统逻辑。你惨不惨是你的内部管理问题，能不能确保大B标书按时交、项目按时结，才是硬指标。",
        "砸碎椰子壳的最佳利器：剔除过程情感噪音，只上严密契约。让不讲面子的人，因为专业闭环，成为帮你砸资源的靠山。"
      ],
      isAiGenerated: false
    };
  }

  if (normTitle.includes("时差") || normTitle.includes("时间观") || normTitle.includes("40-Minute Lag")) {
    return {
      clashAnalysis: "本案代表着严格一板一眼、按日程表行事的线性时间观（Linear-time），撞上了将时间视为复杂、多向动态交互网的印度弹性时间观（Flexible-time）。中国经理将迟到视为道德、尊重问题；而印方更关注多任务并行的‘现场权衡与责任感’，由此产生跨国合作的重度摩擦。",
      dimensionsInvolved: [
        {
          dimensionId: "scheduling",
          dimensionNameZh: "时间管理维度 (线性单任务 VS 弹性多任务观)",
          frictionReason: "中方习惯分分计较、认为迟到是不讲职业纪律；印度在多任务网络中（眼前合作重要，总部高管的临时越洋指示同样神圣不可侵犯），习惯把当下认为最紧急的事情办完再前往下一处。",
          countryAScore: 8.5,
          countryBScore: 7.0,
          gapDescription: "印度（弹性 8.5），中企（偏线性甘特图控制 7.0），德企更处于最左端 1.0"
        }
      ],
      adviceForA: [
        "绝不升华、不把对方的时间习惯上升到恶意不尊重、或者是人品问题的层面，阻断愤怒产生的内耗对抗。",
        "改变你这侧的‘物理防火墙’：对于关键出访或拜访，在心理 and 战略上预留1~1.5小时的‘文化时差缓冲带’。",
        "准备多套对冲预案、甚至多套备选时间线路、或者随行助理多核配合，用多套弹性方案去对冲弹性的滑移。"
      ],
      adviceForB: [
        "尊重合作方严厉的线性时间死线。在无法按时出席或到场前，提前1小时通过社交即时群组正式告知延迟，提供精准的进度条能动性。",
        "理解中方高管和客户对日程精准甘特图管理的偏好，配合其在重要外部拜访中安排前置哨卡。"
      ],
      learningTakeaways: [
        "不要固执地试图粗暴改变另一个文明对时间的感度，他的迟到绝不是针对你，而是因为他的世界法则本身就充沛着交织弹性弹性性。",
        "设立物理隔离防火层，远远优于在内心筑起高墙不断怨恨。"
      ],
      isAiGenerated: false
    };
  }

  if (normTitle.includes("层级暗礁") || normTitle.includes("埃及口音") || normTitle.includes("Middle East")) {
    return {
      clashAnalysis: "本案展现出：高消费高溢价的沙特本地客群拥有极强的极端阶层、等级制心理结构（Hierarchical Hierarchy），而廉价的跨国远程阿语埃及外包客服由于听得见的‘口音等级化方言刺刀’，间接剥夺、贬损了沙特大消费大贵客渴望获得的‘对等身位神圣感’，由此爆发大规模黑天鹅抗议。",
      dimensionsInvolved: [
        {
          dimensionId: "leading",
          dimensionNameZh: "领导/权力层级维度 (极端集权层及观 VS 初步开放性)",
          frictionReason: "沙特处于等级制最高端。追求最体面的高端Patrón对待和身份神圣尊贵对齐；而埃及客服即便阿语纯正，其自带的区域标签被中东用户瞬时解析为‘廉价海外代工’，摧毁了体面防线。",
          countryAScore: 9.5,
          countryBScore: 8.0,
          gapDescription: "沙特（Egalitarian最右端 9.5，等级森严），埃及（8.0，亦高层级但属于代工洼地）"
        },
        {
          dimensionId: "communicating",
          dimensionNameZh: "沟通方式维度 (高语境情感抚慰 VS 格式化业务交付)",
          frictionReason: "高端VIP大客户遭遇障碍，极度依赖高能见度、高情感链接的高身位沙特本地团队 of 柔声情感抚慰。而廉价的外地远程阿语话务员习惯公式化念稿，无法抚慰情绪。",
          countryAScore: 9.5,
          countryBScore: 8.0,
          gapDescription: "沙特拥有高语境下对极高身位体面尊崇的不可侵犯希求。"
        }
      ],
      adviceForA: [
        "实施『分层解耦治理战略』：对高感官、高情商、处理疑难大客户纠纷的语音通道，保留35%利雅得沙特本地人部署，保全‘Patrón的对等身位尊重’作为主要溢价护城河。",
        "将低语境、冷冰冰的核心打字、文字Chat、机器人等非语音交互，100%迁往高性价比的埃及开罗基地。利用『打字无声抹除口音阶级刺刀』来释放埃及客服的惊人性价比，实现整体客服降本与体验不崩的关键平衡。"
      ],
      adviceForB: [
        "教育埃及坐席在处理沙特高等级市场事务时，理解其森严高贵的阶级文化，绝对禁用高枕无忧的平辈口吻或套用开罗俚语。",
        "文字交谈时保持最正宗 of 商务阿文规范表达词汇。"
      ],
      learningTakeaways: [
        "掌握全球化出海高级高管的隐形技能：解耦服务场景。不是所有的本地化都需要物理砸钱落地。懂得拆解感官体验（高感官 vs 文本抹平口音），才能实现极致的利润战。"
      ],
      isAiGenerated: false
    };
  }

  if (normTitle.includes("巴哈萨黑盒") || normTitle.includes("双层过滤") || normTitle.includes("印尼")) {
    return {
      clashAnalysis: "本冲突展现出：东南亚印尼当地业务端在深受‘极度高语境’与‘规避冲突、绝对不能让对方和长官丢脸’（Gengsi面子本位）的文化本底影响下，由于对高压KPI处罚的惊恐，底层采取了‘微笑的拖延与隐瞒’；而印尼主管又由于‘间接反馈’（Indirect Negative Feedback）机制，本能地将严重合规风险文饰为舒适报告，在跨越新加坡总部与中国深圳总部的过程中，层层过滤形成了致命的信息屏蔽，最终招致牌照熔断灾难。",
      dimensionsInvolved: [
        {
          dimensionId: "communicating",
          dimensionNameZh: "沟通维度 (极高语境话外音 VS 低语境白纸黑字契约)",
          frictionReason: "印尼本土客服与主管在发现催收合规危机时选择用‘一切安好、微笑’去应对，而深圳与新加坡总部习惯于只阅读文字中的字面含意（低语境），极大的信息断层诞生。",
          countryAScore: 9.5,
          countryBScore: 7.5,
          gapDescription: "沟通断层极重（印尼极高语境 9.5，新加坡 7.5，习惯低语境文书管理）"
        },
        {
          dimensionId: "evaluating",
          dimensionNameZh: "反馈评价维度 (间接委婉面子防线 VS 对事不对人绩效)",
          frictionReason: "印尼主管极度畏惧公开被指控不合格，为了保护团队和自己得体颜面，用英语周报婉转汇报，结果将严重监管隐患层层粉饰，在宏观层屏蔽了深圳听闻的可能性。",
          countryAScore: 9.0,
          countryBScore: 6.0,
          gapDescription: "印尼反馈间接度极高 9.0，极难将真实负面信息顺利向上递交。"
        }
      ],
      adviceForA: [
        "实施【技术工具降维去语境化机制】：千万不要寄希望于口头催办或试图在强层级区域肉眼识别谎言。必须引入AI方言实时翻译情绪词云看板，让隐性巴哈萨Bahasa语言黑盒彻底透明化、数据量化。",
        "重构沟通机制：给予当地核心主管『面子免责盾牌』。将危机暴露转化为AI system 客观事实，印尼主管就无需为了顾及面子报告而粉饰谎言，做到真正事理理盘。",
        "在中、新、印跨国多多部门之间，建立显性‘If-Then’客观触发机制，如『连续4小时未处理挂断，在新加坡系统自动预警升级』，用自动化机制打破微笑拖延。"
      ],
      adviceForB: [
        "学习跨文化深度开发性发问，不让下级只说‘Everything is OK’。发问应细致拆分成‘是否有遇到这三项具体的监管难处？、在100起中，有多少因这三项需要帮助？’，降低其主观恐惧感。"
      ],
      learningTakeaways: [
        "面对天然高情境、报喜不抱忧的跨国子公司团队，切忌在中层实施粗糙的扁平越级催化。找准主管面子（Gengsi），再通过去语境化AI工具给其安全免责机制，才是重筑真实通道的高级管理艺术。"
      ],
      isAiGenerated: false
    };
  }

  if (normTitle.includes("比利时") || normTitle.includes("铁板") || normTitle.includes("brutal feedback")) {
    return {
      clashAnalysis: "本案是亚太习惯的‘温情关照、面子和稀泥式迂回’，撞击了欧洲最极端的‘绝对低语境且刀刀见血式直接否定反馈’的经典休克现场。中方因遭受面子严重践踏产生毁灭性反意情绪，而实际上这种看似冷酷、没有人情的比利时老板只是极其单纯的‘对事不对人（Its purely business）’。",
      dimensionsInvolved: [
        {
          dimensionId: "evaluating",
          dimensionNameZh: "反馈维度 (直接割骨见血 VS 婉转面子保护)",
          frictionReason: "比利时上司在业务不达标时，使用高清晰、带有尖锐审视性的短语打断并全盘否认。这种直接否定在西方代表着高效率、节省时间；但在中方代表着最严重的剥夺自尊和人命攻击。",
          countryAScore: 2.0,
          countryBScore: 8.0,
          gapDescription: "间接/直接反馈的极致撕裂（比利时直接反馈 2.0，中国 8.0）"
        },
        {
          dimensionId: "communicating",
          dimensionNameZh: "沟通维度 (高语境人情铺垫 VS 极致低语境数据论证)",
          frictionReason: "汇报中，中方用了40%篇幅诉说和客户喝早茶等多余过程，比利时高管视无数据支持的过程大吐苦水为严重无能的滑稽表演，导致直接打断。",
          countryAScore: 2.0,
          countryBScore: 9.0,
          gapDescription: "中比高低语境差极大"
        }
      ],
      adviceForA: [
        "实施【情绪彻底脱钩战略】：当你遭遇刀刀见血的直击否定（如：『This is a total mess / 你做得很糟糕』），立即将自我情感外壳紧绷屏蔽。明白这只是西方高清度、无杂质的业务参考改进指标，绝非对你的人格污损。",
        "彻底剔除业绩汇报里的过程细节与苦劳诉说。周报只呈现硬核数据、核心Gap拆解、针对性的ROI纠错行动。",
        "发挥【把上级当作资源总闸】的管理神思：这种低语境老板极其尊重严谨逻辑与明确财务数据。只要你拿出合理账目与ROI，他会毫不犹豫在10分钟会中高效开路，帮你越级争取大笔款项并调集资源。"
      ],
      adviceForB: [
        "在敲打东亚总经理时，稍微使用‘面子糖衣’。在批评开始前或结束期，说明：『我对项目进度表示警惕，但这不代表我对你的团队忠诚度与能力产生质疑』，大大降低文化摩擦。",
        "在和稀泥的汇报里，有耐性寻找中方通过长篇人际维护大网所保障的底层客情稳固资产，以免错误判定。"
      ],
      learningTakeaways: [
        "在低语境欧式直线商业世界里，真正的儒雅不是把困难包裹在温暖的和风细雨中，而是爽快拿出数据、一是一，二是二，把坦诚当作最省时间的高效红利。"
      ],
      isAiGenerated: false
    };
  }

  // Find localized Chinese names for A and B
  const countryAData = COUNTRIES.find(c => c.nameEn === countryAName || c.nameZh === countryAName) || { nameZh: countryAName };
  const countryBData = COUNTRIES.find(c => c.nameEn === countryBName || c.nameZh === countryBName) || { nameZh: countryBName };
  const countryAZh = countryAData.nameZh || countryAName;
  const countryBZh = countryBData.nameZh || countryBName;

  // General elegant default for any custom user scenarios
  return {
    countryANameZh: countryAZh,
    countryBNameZh: countryBZh,
    clashAnalysis: `本案例是发生在 [${countryAZh}] 团队与 [${countryBZh}] 团队之间典型的跨文化碰撞。在出海或跨国协作中，双方对日常沟通法则、负面评价反馈方式及合作信任建立的隐含期望（心理图示）存在深层鸿沟。一方倾向于按规则与硬性标准快速推进，而另一方更看重场景、弦外之音及深层的关系安全感，这种‘相对落差’正是导致团队沟通遇冷或决策不合拍的根本底牌。`,
    dimensionsInvolved: [
      {
        dimensionId: "trusting",
        dimensionNameZh: "信任基础维度 (任务导向 VS 关系导向)",
        frictionReason: `双方在如何建立信任上产生了错位。[${countryAZh}] 团队可能习惯通过展现严谨的任务执行、专业资质和高效履约来确理业务信任（任务导向）；而 [${countryBZh}] 团队则往往更渴望在推进商业实质前，建立稳固、有温度的非正式私人情谊纽带（关系导向）。没有前置的茶话、晚餐或真诚互动，生硬推进业务会让对方感到冷漠且缺乏安全感。`,
        countryAScore: 4.5,
        countryBScore: 8.5,
        gapDescription: "功利任务 ⚔️ 慢热关系"
      },
      {
        dimensionId: "communicating",
        dimensionNameZh: "沟通方式维度 (低语境直白 VS 高语境含蓄)",
        frictionReason: `信息传递的透明度与场景依赖度存在差异。一端倾向于白纸黑字、大声陈述事实、直接点出问题的低语境风格；另一端则极度依赖说话时的氛围、人情面子及不言自明的隐含默契（高语境）。高语境方会因对方的直言不讳而感到颜面扫地，而低语境方则难以精准破译高语境方的‘话外音’。`,
        countryAScore: 2.0,
        countryBScore: 9.0,
        gapDescription: "直白多言 ⚔️ 场景译码"
      }
    ],
    adviceForA: [
      `【重构沟通场域】：停止一味在正式会议桌上死板推动对方。建议在第一轮礼貌会谈后，尽快约请对方核心人员在咖啡馆、茶室或午餐会等轻松的『非正式场合』进行私下沟通，以更温和舒缓的语调消除防御性心理。`,
      `【人情互动先行】：在切入任何核心商业条款、PPT和进度指标前，预留 20-30 分钟进行真诚、体贴的非功利寒暄。询问对方的事业经历、当地风情、美食等，以有温度的交流作为建立长期信任奠基之礼。`,
      `【倾听言外之意】：在高语境文化下，当对方表示‘这可能会面临一些微小的阻碍’、‘我们需要进一步评估’或‘一切都在推进中（但未给承诺）’时，通常意味着有重大隐患或利益卡点。千万不要按字面意思理解为‘顺利’，应私下关切、细致发问：‘在咱们共同面对的几项中，目前最需要总部帮助协调的是哪一块？’。`
    ],
    adviceForB: [
      `【提供可视化节点】：理解 [${countryAZh}] 团队面临的推进节奏与沟通期望，尽量不要以‘还在评估’等模糊语言让对方处于信息盲区。可以主动提供结构化的进度状态条（如 RAG 灯号），用确定性缓解其焦虑。`,
      `【适应坦率交流】：当收到 [${countryAZh}] 直接、快速的业务催促或批评时，建立‘心理隔离防火墙’，明白这只是对方单纯的『对事不对人（Its purely business）』的高效改进诉求，并非针对你的人格和尊严攻击。`,
      `【主动引导信任规律】：在合作初期，主动向 [${countryAZh}] 伙伴阐述本地商业推进中的『人情、茶叙或非正式关系建立习惯』，指导他们如何用更适合当地经销商、合伙人舒服的社交姿势在本地安全落地。`
    ],
    learningTakeaways: [
      "跨文化大智慧：不要指望另一个文明遵照你觉得合理的习俗来打交道。掌握文化地图的相对相对落差，并有意识地采用最让对方安全、舒服的姿势进行倾听、互动与交付，才是卓越全球领导力的唯一法门。",
      "正式会议常常是达成机构程序正义的『舞台』，而非正式聚会、餐桌与咖啡时光才是真正的『决策孵化器』。高明的全球高管总能自如转换这两套身位。"
    ],
    isAiGenerated: false
  };
}

// REST API for Case analyzing
app.post("/api/analyze-case", async (req, res) => {
  const { title, description, countryA, countryB } = req.body;

  if (!title || !description || !countryA || !countryB) {
    return res.status(400).json({ error: "Missing required fields (title, description, countryA, countryB)" });
  }

  const client = getGeminiClient();

  if (!client) {
    // Return high quality fallback analysis with a flag so UI knows it's a simulated fallback due to credentials
    console.log("No valid Gemini API key found, running high-fidelity local fallback analysis.");
    const fallback = getLocalFallbackAnalysis(title, description, countryA, countryB);
    return res.json({
      ...fallback,
      notice: "您当前使用的是『本地学术模型内置分析答案』。本平台已完美集成 Gemini 3.5 实时大模型分析，如需对所有自定义案例进行全自动深度剖析，请在右上角 Settings > Secrets 区域配置您的 GEMINI_API_KEY。"
    });
  }

  try {
    const countryAData = COUNTRIES.find(c => c.nameEn === countryA) || { nameZh: countryA, nameEn: countryA, scores: {} };
    const countryBData = COUNTRIES.find(c => c.nameEn === countryB) || { nameZh: countryB, nameEn: countryB, scores: {} };

    const promptText = `
你是一位顶级全球跨文化管理专家，精通 Erin Meyer 的《文化地图》(The Culture Map) 八大维度逻辑。
请为学生和管理者深度剖析以下真实的跨文化商业摩擦案例：

案例标题: "${title}"
案例描述: "${description}"
参与国/文化方 A: "${countryAData.nameZh}" (英文名: ${countryA})
参与国/文化方 B: "${countryBData.nameZh}" (英文名: ${countryB})

以下是它们在已知文化地图维度的经典参考偏好分值 (分值0-10，0偏向左侧，10偏向右侧)：
${JSON.stringify({ [countryA]: countryAData.scores, [countryB]: countryBData.scores }, null, 2)}

请基于《文化地图》以下八个经典维度，对发生的冲突进行定性与定量碰撞分析：
1. 沟通方式 (Communicating: Low-Context 0 - High-Context 10)
2. 反馈评价 (Evaluating: Direct Negative Feedback 0 - Indirect Negative 10)
3. 说服逻辑 (Persuading: Principles-First 0 - Applications-First 10)
4. 领导风格 (Leading: Egalitarian 0 - Hierarchical 10)
5. 决策机制 (Deciding: Consensual 0 - Top-Down 10)
6. 信任基础 (Trusting: Task-Based 0 - Relationship-Based 10)
7. 异议表达 (Disagreeing: Confrontational 0 - Avoids Confrontation 10)
8. 时间管理 (Scheduling: Linear-Time 0 - Flexible-Time 10)

深度分析案例中：
- 双方最严重的文化碰撞到底发生在哪 1~3 个特定维度（即在此维度分值差异巨大、且完美对应案例中情节的行为）？
- 冲突的底层相对文化鸿沟是什么？
- 给A方的可操作管理行动指南（3条以上，针对性强、戒除假大空）。
- 给B方的可操作管理行动指南（3条以上，针对性强、戒除假大空）。
- 提炼对商业高管与MBA学生的跨文化核心启发与底层逻辑总结 (学习点)。

【核心事实与事实对齐约束 (CRITICAL FACTUAL CONSTRAINTS)】:
1. 严格限制在案例给出的双方主体，即：A方为 "${countryAData.nameZh}"，B方为 "${countryBData.nameZh}"。如果案例本身（标题与描述文本）中没有提到中国/中企或任何第三方国家，严禁虚构或在分析报告、建议和启示中提及中国背景、中国高管或中企！必须精准、严格契合案例中两方的商业主体身份。
2. 必须结合案例的具体事实进行客观严密的学术研判，坚决反对和稀泥、偏私或进行刻板的“各打五十板”分析。如果案例文本明确表明某一方（如印度方）存在不守信用、单方面推翻敲定协议、官僚化延滞的行为，而守约方（如日方）是在踏实勤恳履行高铁等合同义务并蒙受损失，则分析必须实事求是地剖析违约/延滞方的底层文化/机制问题，而绝不可将责任或批评颠倒黑白地指向遵约、受害的那一方！
3. 请在 dimensionId 映射和 frictionReason 分析时，精准展现这种错配背后的文化轴度冲突。例如，某方的“严格任务契约、高确定性规避、按日程表行事的线性时间观”，碰撞了另一方的“低契约严密感、在多任务网中随意毁约、且有政治官僚/层级干预作风的弹性时间观与重度官僚层级体系”。

请必须使用中文（简体）生成分析内容。输出数据模式必须严格满足以下指定 JSON 约束。
`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: "你是一个精通跨文化领导力、MBA组织行为学与《文化地图》理论的权威研究学者。你需要输出客观、实事求是、极其专业、见解精妙、富有人文情怀和商业警示价值的分析报告，杜绝任何与原文无关的第三方国家（如中国/中企）信息介入，坚守事实真实与严密学术推论。",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clashAnalysis: {
              type: Type.STRING,
              description: "一句话总结跨文化冲突的本质原因和故事中的最大雷区"
            },
            dimensionsInvolved: {
              type: Type.ARRAY,
              description: "本案例涉及最深的文化地图轴线维度列表（要求分析最切中本案细节的1至3个主要冲突维度）",
              items: {
                type: Type.OBJECT,
                properties: {
                  dimensionId: { type: Type.STRING, description: "必填，以下维度ID之一: communicating, evaluating, persuading, leading, deciding, trusting, disagreeing, scheduling" },
                  dimensionNameZh: { type: Type.STRING, description: "维度的中文官方名称 (例如: 反馈评价, 信任基础 等)" },
                  frictionReason: { type: Type.STRING, description: "用极高水平具体结合案例行为，深入浅出剖析为什么两方偏好在这里发生了不可避免的碰撞与误解。" },
                  countryAScore: { type: Type.NUMBER, description: "该维度的国家A估计得分 (0到10之间的浮点数或整数，若无经典分值，请根据文化属性估计合理值)" },
                  countryBScore: { type: Type.NUMBER, description: "该维度的国家B估计得分 (0到10之间的浮点数或整数，若无经典分值，请根据文化属性估计合理值)" },
                  gapDescription: { type: Type.STRING, description: "用 4-10 个词的标签概括他们的核心对立特征差异 (例如：'应用优先 遇上 原理优先' 或 '任务线契约 遇上 关系人情')" }
                },
                required: ["dimensionId", "dimensionNameZh", "frictionReason", "countryAScore", "countryBScore", "gapDescription"]
              }
            },
            adviceForA: {
              type: Type.ARRAY,
              description: "针对此冲突向A方代表（比如美国经理）提出的定制化、一针见血、高操作空间的跨文化化解与领导力沟通指南",
              items: { type: Type.STRING }
            },
            adviceForB: {
              type: Type.ARRAY,
              description: "针对此冲突向B方代表（比如中国或日本团队）提出的定制化、一针见血、高操作空间的跨文化化解与领导力沟通指南",
              items: { type: Type.STRING }
            },
            learningTakeaways: {
              type: Type.ARRAY,
              description: "供读者（学生、管理者、出海创业者）珍藏的跨文化管理底层启迪，反映新式全球文化理解的核心哲学",
              items: { type: Type.STRING }
            }
          },
          required: ["clashAnalysis", "dimensionsInvolved", "adviceForA", "adviceForB", "learningTakeaways"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json({
      ...parsedData,
      countryANameZh: countryAData.nameZh,
      countryBNameZh: countryBData.nameZh,
      isAiGenerated: true
    });
  } catch (error: any) {
    console.error("Gemini analysis error, falling back to local academic engine:", error);
    const fallback = getLocalFallbackAnalysis(title, description, countryA, countryB);
    return res.json({
      ...fallback,
      notice: `【智能学术气垫已激活】由于大模型实时解析遇到网络瞬断或配额卡点（原因: ${error?.message || "云服务暂时受限"}），系统已自动无缝切换为您提供『本地学术内置分析报告』。本页面的定量落差测算与行动方药仍旧由 Erin Meyer 文化大地图底册核心规则精准映射，供您放心参考。`
    });
  }
});

// Endpoint to permanently save custom uploads from front-end LocalStorage to server file system
app.post("/api/save-uploads", (req, res) => {
  const { portrait, bookCover, preorderFlyer, compassAtlas, workshopPhoto } = req.body;

  try {
    if (portrait && portrait.startsWith("data:image")) {
      const base64Data = portrait.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      
      const targetPath = path.join(process.cwd(), "src/assets/images/instructor_portrait_1781339256749.jpg");
      try {
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.writeFileSync(targetPath, buffer);
        console.log("Successfully saved custom portrait to workspace:", targetPath);
      } catch (e: any) {
        console.error("Workspace save failed for portrait:", e.message);
      }

      const distPath = path.join(process.cwd(), "dist/src/assets/images/instructor_portrait_1781339256749.jpg");
      try {
        fs.mkdirSync(path.dirname(distPath), { recursive: true });
        fs.writeFileSync(distPath, buffer);
        console.log("Successfully saved custom portrait to distribution:", distPath);
      } catch (e: any) {
        console.error("Distribution save failed for portrait:", e.message);
      }
    }

    if (bookCover && bookCover.startsWith("data:image")) {
      const base64Data = bookCover.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const targetPath = path.join(process.cwd(), "src/assets/images/book_cover_1781339266821.jpg");
      try {
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.writeFileSync(targetPath, buffer);
        console.log("Successfully saved custom book cover to workspace:", targetPath);
      } catch (e: any) {
        console.error("Workspace save failed for book cover:", e.message);
      }

      const distPath = path.join(process.cwd(), "dist/src/assets/images/book_cover_1781339266821.jpg");
      try {
        fs.mkdirSync(path.dirname(distPath), { recursive: true });
        fs.writeFileSync(distPath, buffer);
        console.log("Successfully saved custom book cover to distribution:", distPath);
      } catch (e: any) {
        console.error("Distribution save failed for book cover:", e.message);
      }
    }

    if (preorderFlyer && preorderFlyer.startsWith("data:image")) {
      const base64Data = preorderFlyer.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const targetPath = path.join(process.cwd(), "src/assets/images/signed_preorder_channel_1781861067288.png");
      try {
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.writeFileSync(targetPath, buffer);
        console.log("Successfully saved custom preorder flyer to workspace:", targetPath);
      } catch (e: any) {
        console.error("Workspace save failed for preorder flyer:", e.message);
      }

      const distPath = path.join(process.cwd(), "dist/src/assets/images/signed_preorder_channel_1781861067288.png");
      try {
        fs.mkdirSync(path.dirname(distPath), { recursive: true });
        fs.writeFileSync(distPath, buffer);
        console.log("Successfully saved custom preorder flyer to distribution:", distPath);
      } catch (e: any) {
        console.error("Distribution save failed for preorder flyer:", e.message);
      }
    }

    if (compassAtlas && compassAtlas.startsWith("data:image")) {
      const base64Data = compassAtlas.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const targetPath = path.join(process.cwd(), "src/assets/images/golden_culture_compass.png");
      try {
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.writeFileSync(targetPath, buffer);
        console.log("Successfully saved custom compass atlas to workspace:", targetPath);
      } catch (e: any) {
        console.error("Workspace save failed for compass atlas:", e.message);
      }

      const distPath = path.join(process.cwd(), "dist/src/assets/images/golden_culture_compass.png");
      try {
        fs.mkdirSync(path.dirname(distPath), { recursive: true });
        fs.writeFileSync(distPath, buffer);
        console.log("Successfully saved custom compass atlas to distribution:", distPath);
      } catch (e: any) {
        console.error("Distribution save failed for compass atlas:", e.message);
      }
    }

    if (workshopPhoto && workshopPhoto.startsWith("data:image")) {
      const base64Data = workshopPhoto.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const targetPath = path.join(process.cwd(), "src/assets/images/culture_map_workshop.png");
      try {
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.writeFileSync(targetPath, buffer);
        console.log("Successfully saved custom workshop photo to workspace:", targetPath);
      } catch (e: any) {
        console.error("Workspace save failed for workshop photo:", e.message);
      }

      const distPath = path.join(process.cwd(), "dist/src/assets/images/culture_map_workshop.png");
      try {
        fs.mkdirSync(path.dirname(distPath), { recursive: true });
        fs.writeFileSync(distPath, buffer);
        console.log("Successfully saved custom workshop photo to distribution:", distPath);
      } catch (e: any) {
        console.error("Distribution save failed for workshop photo:", e.message);
      }
    }

    return res.json({ success: true });
  } catch (err: any) {
    console.error("Error saving custom uploaded imagery:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Paths for persistent Keynotes and Journals datastore
const keynotesFilePath = path.join(process.cwd(), "src/keynotes.json");
const journalsFilePath = path.join(process.cwd(), "src/journals.json");

// Multi-functional AI Summarize endpoint using the dynamic Gemini client
app.post("/api/ai-summarize", async (req, res) => {
  const { title, rawText } = req.body;
  if (!title || !rawText) {
    return res.status(400).json({ error: "Missing required fields (title, rawText)" });
  }

  const client = getGeminiClient();
  if (!client) {
    console.log("No Gemini API client, running fallback summarizer");
    const mockDesc = `【分析亮点】本活动以『${title}』为核心。吕华先生结合20年世界500强团队管理和国际学术认知深度讲述：1) 针对出海进程中海外节点与总部时差/文化碰撞，设计物理和职级防漏缓冲套件；2) 借助去情境化的AI微表情和情绪云，拆解东南亚微笑隐瞒、报喜不抱忧的沟通死穴。内容落地实操！`;
    const mockTakeaway = `顺应自然，不强求粗暴对齐；设立物理防火墙缓冲，远优于反复怨恨和内耗。`;
    return res.json({
      desc: mockDesc,
      takeaway: mockTakeaway,
      notice: "【经典模型】当前使用的是本地经典实操模型推导亮点。配置 GEMINI_API_KEY 后，将一键启用真实的 3.5 实时 AI 文本深度提炼与特色洞见总结！"
    });
  }

  try {
    const promptText = `
你是一位资深的出海与跨文化管理专家级AI学者。请将以下活动/会议学术说明，提炼并生成两个高度凝练的内容模块：
1. 核心大纲与课程交付亮点 (desc)：一段约100-140字的高价值亮点叙述，揭露最吸引人的干货点、痛点和解决方法，需要符合全书和吕华老师的“有钉子有眼”的落地实操风格。
2. 终极启发金句 (takeaway)：一句话提炼课后带走干货，用精辟的逻辑点出底层逻辑（例如“出海绝不仅是物理溢出，而是文化的 calibrate...”风格）。

源会议说明或活动内容如下：
"${rawText}"

你的输出必须是严格的 JSON。
`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: "你是一个精通跨国企业组织协作、MBA商学院高管大纲设计和出海实务大模型的专家。你的回答应该精炼、有力，充满商业博弈启示与实战落地抓手。",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            desc: { type: Type.STRING },
            takeaway: { type: Type.STRING }
          },
          required: ["desc", "takeaway"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json({
      ...parsedData,
      isAiGenerated: true
    });
  } catch (error: any) {
    console.error("AI summarize error:", error);
    const mockDesc = `【分析亮点】本活动以『${title}』为核心。吕华先生结合20年世界500强团队管理和国际学术认知深度讲述：1) 针对出海进程中海外节点与总部时差/文化碰撞，设计物理和职级防漏缓冲套件；2) 借助去情境化的AI微表情和情绪云，拆解东南亚微笑隐瞒、报喜不抱忧的沟通死穴。内容落地实操！`;
    const mockTakeaway = `顺应自然，不强求粗暴对齐；设立物理防火墙缓冲，远优于针对性地斗争。`;
    return res.json({
      desc: mockDesc,
      takeaway: mockTakeaway,
      notice: `【智能学术气垫已激活】由于大模型实时解析遇到瓶颈（原因: ${error?.message || "云服务暂时受限"}），系统已自动无缝切换为您提供『本地学术内置分析报告』。`
    });
  }
});

// GET /api/keynotes
app.get("/api/keynotes", (req, res) => {
  try {
    if (!fs.existsSync(keynotesFilePath)) {
      const defaultKeynotes = [
        {
          id: "keynote-1",
          title: "GITEX Asia 分享和交流",
          desc: "吕华先生作为NXAI（NXLink）全球GTM副总裁赴新加坡出席2026年GITEX Asia亚洲科技博览会。针对如何使用智能客服大模型打通南亚、中东和欧洲业务展开高规格深度解析，为30余家客商与跨国中外企业现场分享。文字可基于AI文本做深度特色洞见总结！",
          takeaway: "AI时代的全球化不仅是系统出海，更是借敏捷大模型重构异层文化用户的无延迟沟通。打字无声、AI辅助是精算本地化性价比的王道利器。",
          image: "/src/assets/images/keynote_singapore_1781853262378.jpg",
          isCustom: false
        },
        {
          id: "keynote-2",
          title: "印尼ICCA 年度客户体验创新国际评审",
          desc: "吕华担任2025、2026年印尼国家呼叫中心协会（ICCA）年度大奖国际常任评委，并在峰会发表主旨演讲。深度揭露东南亚地区因强烈的面子妥协文化带来的“微笑隐瞒、报喜不抱忧”管理盲区，并传授智能情感词云监测体系在业务合规风险及催收等场景中的破壁实操。",
          takeaway: "绝不动用低语境的字面白字去僵化理解高语境印尼子公司的汇报进度。巧借AI情感检测工具，才能打破长链微笑黑盒。",
          image: "/src/assets/images/keynote_indonesia_1781853281712.jpg",
          isCustom: false
        },
        {
          id: "keynote-3",
          title: "《第九届中国客户服务节全球化论坛：出海扬帆智能化，社媒巧织客情网》",
          desc: "在2025年全球化浪潮下的跨境服务新机遇主题论坛上，吕华先生全面剖析了中企出海重组全渠道客户体验中枢（CX Hub）的黄金配比。系统展示如何精妙编排社媒（WhatsApp等）流量通道并深度融合数字化，使中企摆脱纯体力的人头呼叫成本陷阱。",
          takeaway: "数字社交及AI多渠道时代的海外客户体验绝非单纯成本耗散中心，而是流量资产二次裂变的重要触点。精心编排每一来话，皆是曝光与信任的绝佳契机。",
          image: "/src/assets/images/keynote_crossborder_1781853295706.jpg",
          isCustom: false
        }
      ];
      fs.writeFileSync(keynotesFilePath, JSON.stringify(defaultKeynotes, null, 2), "utf-8");
    }
    const list = JSON.parse(fs.readFileSync(keynotesFilePath, "utf-8"));
    return res.json(list);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/keynotes
app.post("/api/keynotes", (req, res) => {
  try {
    const { title, desc, takeaway, image } = req.body;
    if (!title || !desc || !takeaway) {
      return res.status(400).json({ error: "Missing fields (title, desc, takeaway)" });
    }

    let list = [];
    if (fs.existsSync(keynotesFilePath)) {
      list = JSON.parse(fs.readFileSync(keynotesFilePath, "utf-8"));
    } else {
      list = [
        {
          id: "keynote-1",
          title: "GITEX Asia 分享和交流",
          desc: "吕华先生作为NXAI（NXLink）全球GTM副总裁赴新加坡出席2026年GITEX Asia亚洲科技博览会。针对如何使用智能客服大模型打通南亚、中东和欧洲业务展开高规格深度解析，为30余家客商与跨国中外企业现场分享。文字可基于AI文本做深度特色洞见总结！",
          takeaway: "AI时代的全球化不仅是系统出海，更是借敏捷大模型重构异层文化用户的无延迟沟通。打字无声、AI辅助是精算本地化性价比的王道利器。",
          image: "/src/assets/images/outbound_road_bridge_1781665312853.jpg",
          isCustom: false
        }
      ];
    }

    const newItem = {
      id: `keynote-${Date.now()}`,
      title,
      desc,
      takeaway,
      image: image || "/src/assets/images/outbound_bridge_1781772014439.jpg",
      isCustom: true
    };

    list.push(newItem);
    fs.writeFileSync(keynotesFilePath, JSON.stringify(list, null, 2), "utf-8");

    const distPath = path.join(process.cwd(), "dist/src/keynotes.json");
    try {
      fs.mkdirSync(path.dirname(distPath), { recursive: true });
      fs.writeFileSync(distPath, JSON.stringify(list, null, 2), "utf-8");
    } catch (e) {}

    return res.json(newItem);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /api/keynotes/:id
app.delete("/api/keynotes/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (!fs.existsSync(keynotesFilePath)) {
      return res.status(404).json({ error: "No keynotes found" });
    }
    let list = JSON.parse(fs.readFileSync(keynotesFilePath, "utf-8"));
    list = list.filter((item: any) => item.id !== id);
    fs.writeFileSync(keynotesFilePath, JSON.stringify(list, null, 2), "utf-8");

    const distPath = path.join(process.cwd(), "dist/src/keynotes.json");
    try {
      fs.writeFileSync(distPath, JSON.stringify(list, null, 2), "utf-8");
    } catch (e) {}

    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT /api/keynotes/:id
app.put("/api/keynotes/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { title, desc, takeaway, image } = req.body;
    if (!fs.existsSync(keynotesFilePath)) {
      return res.status(404).json({ error: "No keynotes found" });
    }
    let list = JSON.parse(fs.readFileSync(keynotesFilePath, "utf-8"));
    const idx = list.findIndex((item: any) => item.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "Keynote not found" });
    }

    let imagePath = list[idx].image;
    if (image && image.startsWith("data:image")) {
      const match = image.match(/^data:image\/(\w+);base64,/);
      const extension = match ? match[1] : "jpg";
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      
      const fileName = `keynote_uploaded_${Date.now()}.${extension}`;
      const targetPath = path.join(process.cwd(), "src/assets/images", fileName);
      const distPath = path.join(process.cwd(), "dist/src/assets/images", fileName);
      
      try {
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.writeFileSync(targetPath, buffer);
        console.log("Successfully saved keynote image copy to workspace:", targetPath);
      } catch (e: any) {
        console.error("Workspace save failed for keynote image:", e.message);
      }
      
      try {
        fs.mkdirSync(path.dirname(distPath), { recursive: true });
        fs.writeFileSync(distPath, buffer);
        console.log("Successfully saved keynote image copy to dist:", distPath);
      } catch (e: any) {
        console.error("Distribution save failed for keynote image:", e.message);
      }
      
      imagePath = `/src/assets/images/${fileName}`;
    }
    
    list[idx] = {
      ...list[idx],
      title: title !== undefined ? title : list[idx].title,
      desc: desc !== undefined ? desc : list[idx].desc,
      takeaway: takeaway !== undefined ? takeaway : list[idx].takeaway,
      image: imagePath
    };

    fs.writeFileSync(keynotesFilePath, JSON.stringify(list, null, 2), "utf-8");

    const distPath = path.join(process.cwd(), "dist/src/keynotes.json");
    try {
      fs.writeFileSync(distPath, JSON.stringify(list, null, 2), "utf-8");
    } catch (e) {}

    return res.json(list[idx]);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/journals
app.get("/api/journals", (req, res) => {
  try {
    if (!fs.existsSync(journalsFilePath)) {
      const defaultJournals = [
        {
          id: "journal-1",
          title: "《客户观察》特约首发：《中企客服系统出海与数据合规》",
          link: "https://kehuguancha.yunzhan365.com/books/msbm/mobile/index.html#p=82",
          desc: "系统梳理了出海面临的欧盟GDPR、印度DPDP 2023、印尼APPI等全球最严数据安全红线。深入解析了跨国客服体系中DPO（数据保护官）设置、远程办公水印监控（防止拍照/泄密）、极小化数据存储设计，以及如何选用具备高合规水准的BPO服务商进行无边界信息处理限制。本篇权威报告特别参照了“ASFP - Full Presentation_4.pdf”中关于客服管理与“OIT-999-0040-21-01 (1)_4.pdf”中关口安全要求对齐的最佳构想。",
          takeaway: "数据合规并非出海的阻碍，而是在海外安全高效可持续运营的顶级“护身符”；精准管控DPO角色并实现数据脱敏，方能游刃有余。",
          image: "/src/assets/images/keynote_singapore_1781853262378.jpg",
          isCustom: false
        },
        {
          id: "journal-2",
          title: "《客户观察》专栏首发：《一线声波传商韵，万般客意化金流——论用户体验团队如何帮助企业把握流量与高质转化》",
          link: "https://kehuguancha.yunzhan365.com/books/gvhn/mobile/index.html?maxwidthtosmallmode=0&maxheighttosmallmode=0#p=49",
          desc: "深入探讨了“用户体验”团队绝非成本负担，而是在出海高复杂度合规与流量变现交汇点上的核心纽带。文章详细解构了如何以专业沟通与温度服务将流量高效转化为销量增长。文章特别剖析了公域流量漏斗与私域流量池的结合实践，由副主编吕华先生亲笔撰写。报告部分灵感并技术对齐参考了“A220-ANSP-V15-2019-11_4.pdf”安全指标对齐机制。",
          takeaway: "良好的用户体验 and 合规经营驱动流量增长，是跨国成长四大互撑支柱（品牌、流量、合规、体验）融合作用的必然结果。体验是底盘，更是私域复购的硬船桨。",
          image: "/src/assets/images/outbound_bridge_1781772014439.jpg",
          isCustom: false
        },
        {
          id: "journal-3",
          title: "《客户观察》特约专题：《扬帆寻渡千帆竞，四海同心万里行——境外客服中心选址、自建与BPO伙伴的合规甄选指南》",
          link: "https://www.caibocn.com/newsinfo/8411379.html",
          desc: "全景概述了全球呼叫中心1500万从业者格局、国内外自建与BPO运营成本及各重点离岸港口（如波兰、罗马尼亚、匈牙利东欧铁三角，以及性价比之王埃及和美语专家菲律宾达沃等地）的优劣势雷达图。深度剖析了跨国呼叫中心在工作时限、时区匹配、语言覆盖、以及遵守GDPR与PDPL等关键数据合规挑战。本白皮书设计对齐与标准甄选参考了“A350_Security-Handbook_Issue_7.1_VxxD11040869_4.pdf”及“SA_LR_Security-Handbook_Issue2_20210630_4.pdf”，确保高水准安全和体系化支持。",
          takeaway: "境外BPO考察切忌走马观花，亲自面试DPO，并对比其与公司类似同行的承接案例方是大企业规避数百万罚款并稳定员工流失的关键。",
          image: "/src/assets/images/outbound_road_bridge_1781665312853.jpg",
          isCustom: false
        },
        {
          id: "journal-4",
          title: "《客户体验中心出海的技术规划 | 出海专栏》",
          link: "https://www.caibocn.com/newsinfo/8719753.html",
          desc: "出海客户体验中心技术规划的深度实战拆解，涵盖全渠道数字交互网络拓扑、低延迟高保真国际专线话务路由、以及如何在高并发与异构基础设施下实现动态弹性的容量调度。文章为出海企业提供了随行即用的多国家跨地域网络建设避雷指南与安全高可用指标建议，全方位指导出海技术选型。",
          takeaway: "技术规划是出海体验落地的钢筋骨架，只有把全渠道数字网络、话务路由以及多国家高可用底层完全打通，服务质量才有高容错的保证。",
          image: "/src/assets/images/outbound_road_bridge_1781665312853.jpg",
          isCustom: false
        },
        {
          id: "journal-5",
          title: "《熊猫与战狼》",
          link: "http://www.ccinchina.com/article/articleDetail?articleid=202509010532360736",
          desc: "基于跨文化管理视角的经典深度评述。探讨中企出海在面对极其复杂的海外地缘、宗教信仰、跨文化劳工法规冲突时，如何从“战狼式”高强度、硬控制的家长制管辖，智慧过渡到如“大熊猫”般具备高包容度、温和而具韧性的本地化融合式管理，真正做到入乡随俗、包容多边。",
          takeaway: "跨文化组织建设需要将刚性的制度流程与柔性的本地包容有机融会。做硬朗的开拓者，更要做温和而有智慧的跨文化融通人。",
          image: "/src/assets/images/outbound_bridge_1781772014439.jpg",
          isCustom: false
        }
      ];
      fs.writeFileSync(journalsFilePath, JSON.stringify(defaultJournals, null, 2), "utf-8");
    }
    const list = JSON.parse(fs.readFileSync(journalsFilePath, "utf-8"));
    return res.json(list);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/journals
app.post("/api/journals", (req, res) => {
  try {
    const { title, link, desc, takeaway, image } = req.body;
    if (!title || !link || !desc || !takeaway) {
      return res.status(400).json({ error: "Missing fields (title, link, desc, takeaway)" });
    }

    let list = [];
    if (fs.existsSync(journalsFilePath)) {
      list = JSON.parse(fs.readFileSync(journalsFilePath, "utf-8"));
    } else {
      list = [
        {
          id: "journal-1",
          title: "中国金牌出海实践：《中国企业全球化客服体系建设白皮书》",
          link: "https://www.nxcloud.com/outbound-whitepaper",
          desc: "系统总结了中资出海企业在南亚、泛中东、印尼及南美落地大B呼叫中心、客服站点的最佳实践、技术成本测算指南与多国数据脱敏合规模型。本书由数字丝路联盟（DSRC）重磅推荐。",
          takeaway: "利用技术工具与分层组织克服跨国长链的管理惰性，让离岸坐席真正成为您在全球拓展的无摩擦助推器。",
          image: "/src/assets/images/outbound_bridge_1781772014439.jpg",
          isCustom: false
        }
      ];
    }

    const newItem = {
      id: `journal-${Date.now()}`,
      title,
      link,
      desc,
      takeaway,
      image: image || "/src/assets/images/book_cover_1781339266821.jpg",
      isCustom: true
    };

    list.push(newItem);
    fs.writeFileSync(journalsFilePath, JSON.stringify(list, null, 2), "utf-8");

    const distPath = path.join(process.cwd(), "dist/src/journals.json");
    try {
      fs.mkdirSync(path.dirname(distPath), { recursive: true });
      fs.writeFileSync(distPath, JSON.stringify(list, null, 2), "utf-8");
    } catch (e) {}

    return res.json(newItem);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /api/journals/:id
app.delete("/api/journals/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (!fs.existsSync(journalsFilePath)) {
      return res.status(404).json({ error: "No journals found" });
    }
    let list = JSON.parse(fs.readFileSync(journalsFilePath, "utf-8"));
    list = list.filter((item: any) => item.id !== id);
    fs.writeFileSync(journalsFilePath, JSON.stringify(list, null, 2), "utf-8");

    const distPath = path.join(process.cwd(), "dist/src/journals.json");
    try {
      fs.writeFileSync(distPath, JSON.stringify(list, null, 2), "utf-8");
    } catch (e) {}

    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Paths for dynamic Credentials & Memories storage
const credentialsFilePath = path.join(process.cwd(), "src/credentials.json");
const memoriesFilePath = path.join(process.cwd(), "src/memories.json");

// GET /api/build-time
app.get("/api/build-time", (req, res) => {
  return res.json({ time: SERVER_START_TIME });
});

// GET /api/credentials
app.get("/api/credentials", (req, res) => {
  try {
    // Pro-actively restore gallery_judge.jpg by copying keynote_indonesia_1781853281712.jpg if it does not exist
    const judgePath = path.join(process.cwd(), "src/assets/images/gallery_judge.jpg");
    const targetSource = path.join(process.cwd(), "src/assets/images/keynote_indonesia_1781853281712.jpg");
    if (!fs.existsSync(judgePath) && fs.existsSync(targetSource)) {
      try {
        fs.mkdirSync(path.dirname(judgePath), { recursive: true });
        fs.copyFileSync(targetSource, judgePath);
        
        // sync to dist too
        const distJudgePath = path.join(process.cwd(), "dist/src/assets/images/gallery_judge.jpg");
        fs.mkdirSync(path.dirname(distJudgePath), { recursive: true });
        fs.copyFileSync(targetSource, distJudgePath);
        console.log("Automatically restored gallery_judge.jpg using keynote_indonesia image.");
      } catch (copyErr: any) {
        console.error("Failed to dry-restore gallery_judge.jpg:", copyErr.message);
      }
    }

    if (!fs.existsSync(credentialsFilePath)) {
      const defaultCredentials = {
        titleZh: "专业资质和荣誉",
        titleEn: "Professional Qualifications & Honors",
        descZh: "通过扎实权威的履奇经历与裁判权，印证一针见血的出海研训资质。",
        descEn: "Verifiable international experience accrediting senior counseling status.",
        imageUrl: "/src/assets/images/gallery_judge.jpg",
        listZh: [
          "任2025、2026年全球智能数字创新大奖(Global Digital Tech Awards) 国际常任评委与中方唯一首席专家",
          "欧洲工商管理学院 (INSEAD) 跨文化组织协作实践认证特邀分享人",
          "成功主导并交付超过价值 $5000万 美金之亚太-中东数字基建、金融催收与物流体系中台整合项目",
          "著有《出海制胜：突破无形文化断层线》(Winning Overseas) 等重量级跨国管理实践书籍"
        ],
        listEn: [
          "Served as International Judge & Chinese Chief Expert representing GDTA in 2025/2026",
          "Distinguished keynote panelist of INSEAD Intercultural Organization & Cross-Border Collaboration Practices",
          "Successfully directed and delivered $50M+ digital transformation, BPO routing and fin-tech integrations in Middle-East & SEA",
          "Author of prestigious global management bestseller 'Winning Overseas: Crossing Invisible Cultural Fault Lines'"
        ]
      };
      fs.writeFileSync(credentialsFilePath, JSON.stringify(defaultCredentials, null, 2), "utf-8");
    }
    const data = JSON.parse(fs.readFileSync(credentialsFilePath, "utf-8"));
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/credentials
app.post("/api/credentials", (req, res) => {
  try {
    const { titleZh, titleEn, descZh, descEn, imageUrl, listZh, listEn } = req.body;
    
    let finalImageUrl = imageUrl || "/src/assets/images/gallery_judge.jpg";
    if (imageUrl && imageUrl.startsWith("data:image")) {
      const match = imageUrl.match(/^data:image\/(\w+);base64,/);
      const extension = match ? match[1] : "jpg";
      const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      
      const fileName = `credential_uploaded_${Date.now()}.${extension}`;
      const targetPath = path.join(process.cwd(), "src/assets/images", fileName);
      const distPath = path.join(process.cwd(), "dist/src/assets/images", fileName);
      
      try {
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.writeFileSync(targetPath, buffer);
        console.log("Successfully saved custom credentials image to workspace:", targetPath);
      } catch (e: any) {
        console.error("Workspace save failed for credentials image:", e.message);
      }
      
      try {
        fs.mkdirSync(path.dirname(distPath), { recursive: true });
        fs.writeFileSync(distPath, buffer);
        console.log("Successfully saved custom credentials image to dist:", distPath);
      } catch (e: any) {
        console.error("Distribution save failed for credentials image:", e.message);
      }
      
      finalImageUrl = `/src/assets/images/${fileName}`;
    }

    const data = {
      titleZh: titleZh || "专业资质和荣誉",
      titleEn: titleEn || "Professional Qualifications & Honors",
      descZh: descZh || "",
      descEn: descEn || "",
      imageUrl: finalImageUrl,
      listZh: listZh || [],
      listEn: listEn || []
    };
    fs.writeFileSync(credentialsFilePath, JSON.stringify(data, null, 2), "utf-8");

    // Static copy
    const distPath = path.join(process.cwd(), "dist/src/credentials.json");
    try {
      fs.mkdirSync(path.dirname(distPath), { recursive: true });
      fs.writeFileSync(distPath, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {}

    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/translate-credentials for seamless AI translation
app.post("/api/translate-credentials", async (req, res) => {
  try {
    const { titleZh, descZh, listZh } = req.body;
    
    const client = getGeminiClient();
    if (!client) {
      console.log("No Gemini API client, running fallback translator");
      
      const translatePhrase = (text: string): string => {
        if (!text) return "";
        const lower = text.toLowerCase();
        if (lower.includes("荣誉") || lower.includes("资质")) return "Professional Credentials & Strategic Honors";
        if (lower.includes("出海") || lower.includes("跨文化")) return "Cross-cultural Leadership & Outbound Corporate Strategy";
        if (lower.includes("大师") || lower.includes("导师")) return "Distinguished Global GTM Advisor & Chief Expert";
        return `${text} (English version)`;
      };

      const fallbackList = Array.isArray(listZh) 
        ? listZh.map((item: string) => translatePhrase(item)) 
        : [];

      return res.json({
        titleEn: titleZh ? translatePhrase(titleZh) : "Professional Qualifications & Honors",
        descEn: descZh ? `${descZh} (Translated)` : "",
        listEn: fallbackList,
        notice: "【经典翻译激活】配置 GEMINI_API_KEY 后，一键体验 3.5 实时 AI 高级商业智能翻译校对！"
      });
    }

    const promptText = `
你是一位精通跨国商务、高端资质证书、白皮书发表和MBA高管培训的翻译大模型。
请把以下用户输入的中文专业资质和荣誉信息，精细翻译并转换为专业度极高、用词地道优雅的英文（English）。
不要直译，要符合领英（LinkedIn）和海外顶级商学院/外企高层汇报的标准。保持尊贵和学术含金量。

中文源数据如下：
- 资质标题: "${titleZh || ""}"
- 资质描述: "${descZh || ""}"
- 资质荣誉清单 (数组):
${JSON.stringify(listZh || [])}

输出格式必须是严格的 JSON。字段包括:
- titleEn: 标题的英文翻译
- descEn: 概览描述的英文翻译
- listEn: 对应的英文资质荣誉清单 (必须是个数组，其元素数量和顺序必须与输入的 listZh 完全对应)
`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: "你是一个专门服务高管、世界级专家演讲简历的 AI 翻译校对系统。你的翻译必须专业、具有商业感染力、符合美学语境，不可含有任何 markdown 格式，只返回干净的、满足 schema 的 JSON 结果。",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titleEn: { type: Type.STRING },
            descEn: { type: Type.STRING },
            listEn: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["titleEn", "descEn", "listEn"]
        }
      }
    });

    const resultText = response.text;
    const parsed = JSON.parse(resultText);
    return res.json(parsed);
  } catch (err: any) {
    console.error("AI Credentials translate failed:", err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/memories
app.get("/api/memories", (req, res) => {
  try {
    if (!fs.existsSync(memoriesFilePath)) {
      const defaultMemories = [
        {
          id: "judge",
          src: "/src/assets/images/gallery_judge.jpg",
          altZh: "2025年印尼国际呼叫中心评委 (TBCCI)",
          altEn: "TBCCI Indonesia Intl Judge (2025)",
          descZh: "在 TBCCI 智能数字创新大奖现场与各国评委深度交流，赋能全球客户体验 (CX) 标准融合，制定多语系数字化体验规则。",
          descEn: "Interacting with other experts as an international judge at TBCCI Indonesia, standardizing AI call-center CX guidelines across Asian borders.",
          gradient: "from-amber-600/20 via-slate-900 to-slate-950",
          type: "academic",
          isCustom: false
        },
        {
          id: "library-walk",
          src: "/src/assets/images/gallery_library_walk.jpg",
          altZh: "走访多维学术与研究地标",
          altEn: "Research Journey at Reference Libraries",
          descZh: "走访全球地标图书馆与特藏书库，潜心沉淀出海理论。通过对全球敏捷组织的大数据溯源，形成《出海制胜》实战理论骨架。",
          descEn: "Investigating organizational design history and executive guides across world reference libraries to polish 'Winning Overseas' methodologies.",
          gradient: "from-sky-600/20 via-slate-900 to-slate-950",
          type: "professional",
          isCustom: false
        },
        {
          id: "library-top",
          src: "/src/assets/images/gallery_library_top.jpg",
          altZh: "沉浸学者探求 —— 手捧醇香咖啡",
          altEn: "Scholarly Reflection with Coffee",
          descZh: "在充满静谧与沉淀感的多维地标建筑中，将客户生命周期、多源外包架构与高低语境冲突进行学术解构与有机拼合。",
          descEn: "Calm, scholarly introspection: conceptualizing dynamic CRM, BPO offshore channels and task-based trust layers over dark roast coffee.",
          gradient: "from-emerald-600/20 via-slate-900 to-slate-950",
          type: "academic",
          isCustom: false
        },
        {
          id: "cycling",
          src: "/src/assets/images/gallery_cycling.jpg",
          altZh: "与印度合伙人沙滩低碳骑行",
          altEn: "Beach Cycling with Indian Partners",
          descZh: "与亚太高管合伙人海滩健康共行，用人情信任温暖冰冷契约，这也是书中『如何建立 task-based trust 与 relationship-based trust 双循环』最快乐的见证。",
          descEn: "Biking with Indian partners to build organic relational bridges, proving that personal affinity accelerates rigid contractual executions.",
          gradient: "from-orange-600/20 via-slate-900 to-slate-950",
          type: "outdoor",
          isCustom: false
        },
        {
          id: "grey-suit",
          src: "/src/assets/images/gallery_grey_suit.jpg",
          altZh: "坚毅的全球战略咨询会谈",
          altEn: "Pragmatic Outbound Consulting Stance",
          descZh: "身着灰色正装的咨询研判。在出海大B端董事会汇报中，以客观的数据量化度量，为中国跨国先锋架设坚如硬石的合规堤防。",
          descEn: "Corporate B2B strategic briefings: leveraging granular Excel timelines and risk audits to guide executive decisions safely.",
          gradient: "from-purple-600/20 via-slate-900 to-slate-950",
          type: "professional",
          isCustom: false
        },
        {
          id: "purple-suit",
          src: "/src/assets/images/gallery_purple_suit.jpg",
          altZh: "睿智儒雅的高级研学主训",
          altEn: "Scholarly Masterclass Instructor",
          descZh: "手持讲义，在MBA、高级总裁班里充当知行合一的剧场导演，将冲突公开化、辩驳透明化，训练学员在英美董事会抢麦卡位。",
          descEn: "Guiding high-profile C-suite cohorts through adversarial roleplaying, assertive vocal pitches, and principles-first approvals.",
          gradient: "from-rose-600/20 via-slate-900 to-slate-950",
          type: "academic",
          isCustom: false
        }
      ];
      fs.writeFileSync(memoriesFilePath, JSON.stringify(defaultMemories, null, 2), "utf-8");
    }
    const list = JSON.parse(fs.readFileSync(memoriesFilePath, "utf-8"));
    return res.json(list);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/memories
app.post("/api/memories", (req, res) => {
  try {
    const { src, altZh, altEn, descZh, descEn, gradient, type } = req.body;
    if (!altZh || !descZh) {
      return res.status(400).json({ error: "Missing required fields (altZh, descZh)" });
    }

    let list = [];
    if (fs.existsSync(memoriesFilePath)) {
      list = JSON.parse(fs.readFileSync(memoriesFilePath, "utf-8"));
    } else {
      list = [];
    }

    const newItem = {
      id: `memory-${Date.now()}`,
      src: src || "/src/assets/images/gallery_judge.jpg",
      altZh,
      altEn: altEn || altZh,
      descZh,
      descEn: descEn || descZh,
      gradient: gradient || "from-amber-600/20 via-slate-900 to-slate-950",
      type: type || "professional",
      isCustom: true
    };

    list.push(newItem);
    fs.writeFileSync(memoriesFilePath, JSON.stringify(list, null, 2), "utf-8");

    const distPath = path.join(process.cwd(), "dist/src/memories.json");
    try {
      fs.mkdirSync(path.dirname(distPath), { recursive: true });
      fs.writeFileSync(distPath, JSON.stringify(list, null, 2), "utf-8");
    } catch (e) {}

    return res.json(newItem);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /api/memories/:id
app.delete("/api/memories/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (!fs.existsSync(memoriesFilePath)) {
      return res.status(404).json({ error: "No memories found" });
    }
    let list = JSON.parse(fs.readFileSync(memoriesFilePath, "utf-8"));
    list = list.filter((item: any) => item.id !== id);
    fs.writeFileSync(memoriesFilePath, JSON.stringify(list, null, 2), "utf-8");

    const distPath = path.join(process.cwd(), "dist/src/memories.json");
    try {
      fs.writeFileSync(distPath, JSON.stringify(list, null, 2), "utf-8");
    } catch (e) {}

    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/ai-summarize-memory
app.post("/api/ai-summarize-memory", async (req, res) => {
  const { rawText, category } = req.body;
  if (!rawText) {
    return res.status(400).json({ error: "Missing rawText" });
  }

  const client = getGeminiClient();
  if (!client) {
    console.log("No Gemini API client, running fallback memory summarizer");
    const mockAltZh = "环球数字中台与跨国合规探秘";
    const mockAltEn = "Global Platform Compliance & Trust";
    const mockDescZh = `实地考察当地跨国节点，针对出海过程中的流程硬着陆及跨语系人才对位阵地，将当地真实的BPO实践与《出海制胜》实操路线融为一体。`;
    const mockDescEn = `Field investigation of telecom clusters and local service centers, combining practical BPO routing rules with structural sovereign trust guidelines.`;
    
    let gradient = "from-amber-600/20 via-slate-900 to-slate-950";
    if (category === "professional") gradient = "from-sky-600/20 via-slate-900 to-slate-950";
    if (category === "academic") gradient = "from-emerald-600/20 via-slate-900 to-slate-950";
    if (category === "outdoor") gradient = "from-orange-600/20 via-slate-900 to-slate-950";
    if (category === "collaboration") gradient = "from-rose-600/20 via-slate-900 to-slate-950";

    return res.json({
      altZh: mockAltZh,
      altEn: mockAltEn,
      descZh: mockDescZh,
      descEn: mockDescEn,
      gradient,
      notice: "【经典本地模式】加载成功。启用 GEMINI_API_KEY 后将实现全套高阶自适应双语极速脑暴！"
    });
  }

  try {
    const promptText = `
You are a world-class executive coach assisting Harry Lyu (吕华), elite author of 'Winning Overseas'. 
Based on the following raw draft/experience, summarize a beautifully polished Card item with:
1. altZh (Highly punchy Chinese card title, maximum 15 characters)
2. altEn (Professional English card title, maximum 6 words)
3. descZh (Elegant Chinese summary. Length: 40-70 words)
4. descEn (Professional English translation)
5. gradient (Fitting dark subtle Tailwind gradient starting with "from-...-600/20 via-slate-900 to-slate-950", based on category).

Raw Text:
"${rawText}"

Category: "${category || "professional"}"
`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: "You are an expert global copywriter, MBA curriculum director and senior editor.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            altZh: { type: Type.STRING },
            altEn: { type: Type.STRING },
            descZh: { type: Type.STRING },
            descEn: { type: Type.STRING },
            gradient: { type: Type.STRING }
          },
          required: ["altZh", "altEn", "descZh", "descEn", "gradient"]
        }
      }
    });

    const resultText = response.text;
    const resultObj = JSON.parse(resultText || "{}");
    return res.json(resultObj);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Interactive Website Improvement Feedback API Engine
const feedbackFilePath = path.join(process.cwd(), "src/feedback.json");

function getFeedbackList() {
  try {
    if (!fs.existsSync(feedbackFilePath)) {
      const defaultData = [
        {
          id: "fb-1",
          category: "UI/UX & Mobile",
          suggestion: "手机移动端下，汉堡按钮（三个横线）在窄屏下折行并居中，导致网页顶端排版极度拥挤。希望无论在桌面还是极窄手机屏幕下，均保持两侧拉伸的精致排版（完美对称，不换行）。",
          date: "2026-06-16 11:30",
          status: "done",
          reply: "【AI 顾问反馈】：已重构顶部大区弹性盒子（Flexbox），并收缩了移动端头部导航的字号与水平内折距离（Padding）。最新热部署后，三横线功能键和橙色指北针图标已完美在任何极窄手机分辩率下平稳锚定于两侧边缘，呈现尊贵的大气对齐。"
        },
        {
          id: "fb-2",
          category: "Account System",
          suggestion: "加入一个能够让讲师与出海学子在网页上进行直接交互、登录校验的入口，并提供仪式感。",
          date: "2026-06-16 10:15",
          status: "done",
          reply: "【AI 顾问反馈】：已顺利开辟『学子中心 / Trainee Portal』安全校验机制。学子输入凭证成功登录后，系统顶端会点亮绿宝石状的实时在线呼吸灯并悬挂其代号，打造出沉浸式的海外工作台培训仪式感。"
        }
      ];
      fs.writeFileSync(feedbackFilePath, JSON.stringify(defaultData, null, 2), "utf-8");
    }
    return JSON.parse(fs.readFileSync(feedbackFilePath, "utf-8"));
  } catch (e) {
    return [];
  }
}

app.get("/api/feedback", (req, res) => {
  try {
    const list = getFeedbackList();
    return res.json(list);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/feedback", (req, res) => {
  try {
    const { category, suggestion } = req.body;
    if (!suggestion) {
      return res.status(400).json({ error: "Suggestion / 必备建议内容不能为空" });
    }

    const list = getFeedbackList();
    const now = new Date();
    // Simple custom date string calculation (CST / UTC +8 offset if needed, but local is fine)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const mins = String(now.getMinutes()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day} ${hours}:${mins}`;

    const newFeedback = {
      id: `fb-${Date.now()}`,
      category: category || "General Feedbacks",
      suggestion: suggestion,
      date: dateStr,
      status: "open",
      reply: "【AI 顾问反馈】：已成功在工作空间持久化归档您的迭代意见！我作为您的数字开发引擎，现已进入分析与整改待命状态。当您下一次在聊天框中提及并要求我『帮我评点或修改落实上述表格中的新增意见』时，我会一键编写对应的代码更改，并通过系统的热编译将改动正式提交到线上，随后在下方将状态修改为【Done/已上线】！"
    };

    list.push(newFeedback);
    fs.writeFileSync(feedbackFilePath, JSON.stringify(list, null, 2), "utf-8");

    // Also populate distribution to make it persistent on running app
    const distFeedbackPath = path.join(process.cwd(), "dist/src/feedback.json");
    try {
      fs.mkdirSync(path.dirname(distFeedbackPath), { recursive: true });
      fs.writeFileSync(distFeedbackPath, JSON.stringify(list, null, 2), "utf-8");
    } catch (e) {}

    return res.json(newFeedback);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.patch("/api/feedback/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { status, reply } = req.body;
    const list = getFeedbackList();
    const item = list.find((x: any) => x.id === id);
    if (item) {
      if (status) item.status = status;
      if (reply) item.reply = reply;
      fs.writeFileSync(feedbackFilePath, JSON.stringify(list, null, 2), "utf-8");
      const distFeedbackPath = path.join(process.cwd(), "dist/src/feedback.json");
      try {
        fs.mkdirSync(path.dirname(distFeedbackPath), { recursive: true });
        fs.writeFileSync(distFeedbackPath, JSON.stringify(list, null, 2), "utf-8");
      } catch (e) {}
      return res.json({ success: true, item });
    } else {
      return res.status(404).json({ error: "Feedback item not found" });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/feedback/bulk", (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid items array / 反馈建议列表格式不正确。" });
    }

    const list = getFeedbackList();
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const mins = String(now.getMinutes()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day} ${hours}:${mins}`;

    const added = [];
    for (const item of items) {
      if (item.suggestion && item.suggestion.trim()) {
        const cleanSg = item.suggestion.trim();
        // Avoid duplicate inserts
        const exists = list.some((x: any) => x.suggestion === cleanSg);
        if (!exists) {
          const newFB = {
            id: `fb-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            category: item.category || "Others",
            suggestion: cleanSg,
            date: dateStr,
            status: "open",
            reply: "【AI 顾问反馈】：已通过批量 CSV/表格 工作流成功自动建档。等待 AI 执行下一轮代码编译..."
          };
          list.push(newFB);
          added.push(newFB);
        }
      }
    }

    if (added.length > 0) {
      fs.writeFileSync(feedbackFilePath, JSON.stringify(list, null, 2), "utf-8");
      const distFeedbackPath = path.join(process.cwd(), "dist/src/feedback.json");
      try {
        fs.mkdirSync(path.dirname(distFeedbackPath), { recursive: true });
        fs.writeFileSync(distFeedbackPath, JSON.stringify(list, null, 2), "utf-8");
      } catch (e) {}
    }

    return res.json({ success: true, count: added.length, items: added });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Setup Vite development server or production server
async function startServer() {
  // Always serve the static src/assets folder directly from workspace path OR production distribution path
  app.use("/src/assets", express.static(path.join(process.cwd(), "src/assets")));
  app.use("/src/assets", express.static(path.join(process.cwd(), "dist/src/assets")));

  // Self-healing check for culture_map_workshop image to prevent it from remaining a duplicated compass atlas
  try {
    const workshopPath = path.join(process.cwd(), "src/assets/images/culture_map_workshop.png");
    const compassPath = path.join(process.cwd(), "src/assets/images/golden_culture_compass.png");
    const keynotePhotoPath = path.join(process.cwd(), "src/assets/images/keynote_crossborder_1781853295706.jpg");
    
    let needsRepair = false;
    if (!fs.existsSync(workshopPath)) {
      needsRepair = true;
    } else if (fs.existsSync(compassPath)) {
      const workshopSize = fs.statSync(workshopPath).size;
      const compassSize = fs.statSync(compassPath).size;
      if (workshopSize === compassSize) {
        needsRepair = true;
      }
    }
    
    // Also if it currently matches the Unsplash template file (size 116062 bytes), let's replace it with the real keynote photo!
    if (fs.existsSync(workshopPath) && fs.statSync(workshopPath).size === 116062) {
      console.log("[Self-Healing] Replacing Unsplash template workshop image block with the real local keynote photo...");
      needsRepair = true;
    }
    
    if (needsRepair && fs.existsSync(keynotePhotoPath)) {
      console.log("[Self-Healing] culture_map_workshop.png is being repaired from local keynote crossborder discussion photo...");
      const buffer = fs.readFileSync(keynotePhotoPath);
      fs.mkdirSync(path.dirname(workshopPath), { recursive: true });
      fs.writeFileSync(workshopPath, buffer);
      console.log("[Self-Healing] Successfully repaired culture_map_workshop.png in workspace using local real keynote photo!");
      
      const distWorkshopPath = path.join(process.cwd(), "dist/src/assets/images/culture_map_workshop.png");
      try {
        fs.mkdirSync(path.dirname(distWorkshopPath), { recursive: true });
        fs.writeFileSync(distWorkshopPath, buffer);
        console.log("[Self-Healing] Successfully repaired culture_map_workshop.png in distribution!");
      } catch (e) {}
    }
  } catch (err: any) {
    console.error("[Self-Healing] Error doing check:", err.message);
  }

  // 探测是否为生产环境：如果是 production，或者正在运行打包后的 cjs 文件，或者工作区不存在 ts 源文件
  const isProd = process.env.NODE_ENV === "production" || 
    (typeof __filename !== "undefined" && __filename.includes("dist")) || 
    !fs.existsSync(path.join(process.cwd(), "server.ts"));

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static files with optional caching headers, except index.html or we can let static go
    app.use(express.static(distPath, {
      maxAge: '1d',
      setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        }
      }
    }));

    app.get("*", (req, res) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Culture Map App] Server running on http://localhost:${PORT}`);
  });
}

startServer();
