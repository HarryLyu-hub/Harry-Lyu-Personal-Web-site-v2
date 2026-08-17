export interface Dimension {
  id: string;
  nameEn: string;
  nameZh: string;
  leftEn: string;
  leftZh: string;
  rightEn: string;
  rightZh: string;
  descriptionZh: string;
  descriptionEn: string;
}

export interface CountryData {
  nameZh: string;
  nameEn: string;
  scores: { [dimensionId: string]: number }; // score from 1 to 10
}

export interface CaseStudy {
  id: string;
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  countryA: string; // En name e.g. "Germany"
  countryB: string; // En name e.g. "Japan"
}

export const DIMENSIONS: Dimension[] = [
  {
    id: "communicating",
    nameEn: "Communicating",
    nameZh: "沟通方式",
    leftEn: "Low-Context",
    leftZh: "低语境 (直白多言)",
    rightEn: "High-Context",
    rightZh: "高语境 (含蓄弦外之音)",
    descriptionZh: "低语境文化认为沟通应当简单、清晰、直白，重复信息可确保理解；高语境文化认为信息传递依赖共识背景，话语含蓄，需要‘听懂并阅读空气中话外音’。",
    descriptionEn: "Low-context cultures believe communication should be simple, clear, and direct, where repetition ensures understanding. High-context cultures rely on shared background alignment, where messages are implicit and require 'reading between the lines'."
  },
  {
    id: "evaluating",
    nameEn: "Evaluating",
    nameZh: "反馈评价",
    leftEn: "Direct Negative Feedback",
    leftZh: "直接否定性反馈",
    rightEn: "Indirect Negative Feedback",
    rightZh: "间接否定性反馈",
    descriptionZh: "直接反馈文化（如德国、比利时、荷兰）在批评时会直呼其名直指缺陷；间接反馈文化（如日本、中国、印尼）则习惯用柔和词汇、私下单独进行，甚至好言包裹批评。",
    descriptionEn: "Direct feedback cultures critique directly and pointedly, whereas indirect feedback cultures use softer language, conduct feedback in private, and wrap criticisms in positive cushions."
  },
  {
    id: "persuading",
    nameEn: "Persuading",
    nameZh: "说服逻辑",
    leftEn: "Principles-First",
    leftZh: "原理优先 (演绎法/严密逻辑推导)",
    rightEn: "Applications-First",
    rightZh: "应用优先 (归纳法/案例事实主推)",
    descriptionZh: "原理优先文化（如法国、德国、印度）习惯于先讲理论骨架，说服时偏好完整论证才做出结论；应用优先文化（如美国、中国）更急于看到具体商业落地、方案和事实论述。",
    descriptionEn: "Principles-first cultures prefer to build up the theoretical framework and methodology before making conclusions. Applications-first cultures favor case studies, concrete business results, and immediate facts."
  },
  {
    id: "leading",
    nameEn: "Leading",
    nameZh: "领导风格",
    leftEn: "Egalitarian",
    leftZh: "平权主义-组织扁平制",
    rightEn: "Hierarchical",
    rightZh: "等级主义-长官意志层级感",
    descriptionZh: "平权文化中领导和成员平辈相称，跨层级沟通非常自然；等级文化（如日本、沙特、印度、中国）中长官威严不可挑衅，任何越级汇报或淡化身份都可能招来无形暗礁。",
    descriptionEn: "Egalitarian cultures see leaders and members as equals, making cross-level communication natural. Hierarchical cultures revere authority, where bypassing steps or levels might lead to interpersonal friction."
  },
  {
    id: "deciding",
    nameEn: "Deciding",
    nameZh: "决策机制",
    leftEn: "Consensual",
    leftZh: "共识型决策",
    rightEn: "Top-Down",
    rightZh: "自上而下决策",
    descriptionZh: "共识决策需要全员、甚至各平行部门充分对齐（日本根回/Nemawashi），时间久但执行稳；自上而下决策（美国、中国、法国）由核心层拍板，执行中可随时微调迭代。",
    descriptionEn: "Consensual decision-making aligns the entire team or department (such as Japanese 'Nemawashi'), taking longer but executing solidly. Top-down decisions are quickly decided by leadership and adjusted dynamically."
  },
  {
    id: "trusting",
    nameEn: "Trusting",
    nameZh: "信任基础",
    leftEn: "Task-Based",
    leftZh: "任务导向 (契约制度信任)",
    rightEn: "Relationship-Based",
    rightZh: "关系导向 (情感人情信任)",
    descriptionZh: "任务型信任（美国、德国、新加坡）中人际交情与工作严格分离，靠合同及专业表现背书；关系型信任中，吃饭聚餐拉家常非常神圣，人情账户充足才有交付质量。",
    descriptionEn: "Task-based trust separates personal relations from work, relying on contracts and professional performance. Relationship-based trust values socializing, personal connections, and shared meals to establish business confidence."
  },
  {
    id: "disagreeing",
    nameEn: "Disagreeing",
    nameZh: "异议表达",
    leftEn: "Confrontational",
    leftZh: "公开直面异议",
    rightEn: "Avoids Confrontation",
    rightZh: "避免公开冲突",
    descriptionZh: "公开异议文化（法国、澳大利亚、以色列）推崇真理越辩越明，并不针对个人；规避冲突文化（日本、中国、泰国、墨西哥）则视会议争吵为极不礼貌的当众拆台。",
    descriptionEn: "Confrontational cultures believe debate and disagreement are constructive for seeking truth, without affecting personal relationships. Avoiding confrontation view public debate as disrespectful."
  },
  {
    id: "scheduling",
    nameEn: "Scheduling",
    nameZh: "时间管理",
    leftEn: "Linear-Time",
    leftZh: "线性时间 (分分计较/顺序推进)",
    rightEn: "Flexible-Time",
    rightZh: "弹性时间 (多线程/柔性缓冲区)",
    descriptionZh: "线性时间观将死线与日程表视若神明，迟到等同于违约；弹性时间观（印度、中东、巴西）中日程会被突发事件打破，随环境网络自我动态缝合。",
    descriptionEn: "Linear-time cultures treat deadlines and schedules as absolute commitments. Flexible-time cultures adapt to dynamic schedules, multitasking, and constant shifts according to relationships or circumstances."
  }
];

export const COUNTRIES: CountryData[] = [
  {
    nameZh: "美国",
    nameEn: "United States",
    scores: {
      communicating: 1.5,
      evaluating: 4.8,
      persuading: 8.5,
      leading: 3.0,
      deciding: 6.2,
      trusting: 1.8,
      disagreeing: 5.0,
      scheduling: 2.5
    }
  },
  {
    nameZh: "德国",
    nameEn: "Germany",
    scores: {
      communicating: 1.8,
      evaluating: 1.5,
      persuading: 1.5,
      leading: 3.8,
      deciding: 2.8,
      trusting: 2.8,
      disagreeing: 2.5,
      scheduling: 1.0
    }
  },
  {
    nameZh: "日本",
    nameEn: "Japan",
    scores: {
      communicating: 9.5,
      evaluating: 8.8,
      persuading: 5.0,
      leading: 8.8,
      deciding: 0.8,
      trusting: 7.8,
      disagreeing: 9.0,
      scheduling: 0.8
    }
  },
  {
    nameZh: "中国",
    nameEn: "China",
    scores: {
      communicating: 8.8,
      evaluating: 6.8,
      persuading: 5.0,
      leading: 9.2,
      deciding: 8.8,
      trusting: 8.2,
      disagreeing: 7.8,
      scheduling: 7.3
    }
  },
  {
    nameZh: "法国",
    nameEn: "France",
    scores: {
      communicating: 4.5,
      evaluating: 2.5,
      persuading: 2.0,
      leading: 6.5,
      deciding: 8.0,
      trusting: 6.8,
      disagreeing: 1.5,
      scheduling: 5.0
    }
  },
  {
    nameZh: "英国",
    nameEn: "United Kingdom",
    scores: {
      communicating: 4.2,
      evaluating: 6.3,
      persuading: 7.0,
      leading: 4.5,
      deciding: 4.6,
      trusting: 3.8,
      disagreeing: 5.8,
      scheduling: 3.2
    }
  },
  {
    nameZh: "印度",
    nameEn: "India",
    scores: {
      communicating: 7.7,
      evaluating: 6.7,
      persuading: 3.0,
      leading: 8.2,
      deciding: 8.2,
      trusting: 8.0,
      disagreeing: 7.0,
      scheduling: 8.5
    }
  },
  {
    nameZh: "巴西",
    nameEn: "Brazil",
    scores: {
      communicating: 6.5,
      evaluating: 6.5,
      persuading: 6.0,
      leading: 5.8,
      deciding: 5.7,
      trusting: 8.2,
      disagreeing: 6.3,
      scheduling: 7.5
    }
  },
  {
    nameZh: "比利时",
    nameEn: "Belgium",
    scores: {
      communicating: 2.0,
      evaluating: 2.0,
      persuading: 3.5,
      leading: 3.5,
      deciding: 5.5,
      trusting: 3.5,
      disagreeing: 3.5,
      scheduling: 2.0
    }
  },
  {
    nameZh: "新加坡",
    nameEn: "Singapore",
    scores: {
      communicating: 6.8,
      evaluating: 6.0,
      persuading: 5.5,
      leading: 6.0,
      deciding: 7.5,
      trusting: 6.7,
      disagreeing: 7.0,
      scheduling: 4.0
    }
  },
  {
    nameZh: "印尼",
    nameEn: "Indonesia",
    scores: {
      communicating: 9.5,
      evaluating: 9.0,
      persuading: 5.0,
      leading: 9.0,
      deciding: 8.5,
      trusting: 9.5,
      disagreeing: 9.0,
      scheduling: 8.5
    }
  },
  {
    nameZh: "沙特",
    nameEn: "Saudi Arabia",
    scores: {
      communicating: 8.3,
      evaluating: 8.0,
      persuading: 5.0,
      leading: 9.2,
      deciding: 8.4,
      trusting: 9.0,
      disagreeing: 7.2,
      scheduling: 8.8
    }
  },
  {
    nameZh: "埃及",
    nameEn: "Egypt",
    scores: {
      communicating: 8.0,
      evaluating: 7.0,
      persuading: 5.5,
      leading: 8.0,
      deciding: 8.0,
      trusting: 8.5,
      disagreeing: 8.0,
      scheduling: 8.0
    }
  },
  {
    nameZh: "墨西哥",
    nameEn: "Mexico",
    scores: {
      communicating: 7.5,
      evaluating: 6.5,
      persuading: 7.5,
      leading: 8.0,
      deciding: 8.0,
      trusting: 8.5,
      disagreeing: 8.0,
      scheduling: 8.0
    }
  },
  {
    nameZh: "阿联酋",
    nameEn: "UAE",
    scores: {
      communicating: 8.5,
      evaluating: 8.0,
      persuading: 5.5,
      leading: 9.2,
      deciding: 8.5,
      trusting: 9.0,
      disagreeing: 8.0,
      scheduling: 8.0
    }
  },
  {
    nameZh: "俄罗斯",
    nameEn: "Russia",
    scores: {
      communicating: 7.2,
      evaluating: 1.5,
      persuading: 2.0,
      leading: 8.4,
      deciding: 8.5,
      trusting: 7.2,
      disagreeing: 1.5,
      scheduling: 6.4
    }
  },
  {
    nameZh: "韩国",
    nameEn: "South Korea",
    scores: {
      communicating: 9.0,
      evaluating: 8.0,
      persuading: 5.0,
      leading: 9.0,
      deciding: 8.5,
      trusting: 8.5,
      disagreeing: 8.5,
      scheduling: 3.0
    }
  },
  {
    nameZh: "越南",
    nameEn: "Vietnam",
    scores: {
      communicating: 9.0,
      evaluating: 8.5,
      persuading: 5.5,
      leading: 8.5,
      deciding: 8.0,
      trusting: 9.0,
      disagreeing: 9.0,
      scheduling: 7.5
    }
  },
  {
    nameZh: "泰国",
    nameEn: "Thailand",
    scores: {
      communicating: 9.5,
      evaluating: 9.0,
      persuading: 6.0,
      leading: 8.5,
      deciding: 8.0,
      trusting: 9.5,
      disagreeing: 9.5,
      scheduling: 8.0
    }
  },
  {
    nameZh: "南非",
    nameEn: "South Africa",
    scores: {
      communicating: 4.5,
      evaluating: 5.0,
      persuading: 7.0,
      leading: 5.5,
      deciding: 6.5,
      trusting: 6.0,
      disagreeing: 5.0,
      scheduling: 6.0
    }
  },
  {
    nameZh: "西班牙",
    nameEn: "Spain",
    scores: {
      communicating: 6.0,
      evaluating: 4.0,
      persuading: 4.0,
      leading: 6.5,
      deciding: 7.5,
      trusting: 7.5,
      disagreeing: 3.0,
      scheduling: 7.0
    }
  },
  {
    nameZh: "葡萄牙",
    nameEn: "Portugal",
    scores: {
      communicating: 7.0,
      evaluating: 6.5,
      persuading: 3.5,
      leading: 7.0,
      deciding: 7.5,
      trusting: 8.0,
      disagreeing: 7.0,
      scheduling: 6.5
    }
  },
  {
    nameZh: "土耳其",
    nameEn: "Turkey",
    scores: {
      communicating: 7.5,
      evaluating: 7.0,
      persuading: 5.0,
      leading: 8.0,
      deciding: 8.0,
      trusting: 8.5,
      disagreeing: 6.0,
      scheduling: 7.0
    }
  },
  {
    nameZh: "瑞士",
    nameEn: "Switzerland",
    scores: {
      communicating: 1.5,
      evaluating: 2.0,
      persuading: 2.0,
      leading: 3.5,
      deciding: 2.5,
      trusting: 2.5,
      disagreeing: 4.0,
      scheduling: 1.0
    }
  },
  {
    nameZh: "加拿大",
    nameEn: "Canada",
    scores: {
      communicating: 2.0,
      evaluating: 4.5,
      persuading: 8.0,
      leading: 3.0,
      deciding: 5.5,
      trusting: 3.0,
      disagreeing: 5.5,
      scheduling: 2.5
    }
  },
  {
    nameZh: "菲律宾",
    nameEn: "Philippines",
    scores: {
      communicating: 9.5,
      evaluating: 9.0,
      persuading: 5.0,
      leading: 8.5,
      deciding: 7.5,
      trusting: 9.0,
      disagreeing: 9.0,
      scheduling: 8.5
    }
  },
  {
    nameZh: "意大利",
    nameEn: "Italy",
    scores: {
      communicating: 5.5,
      evaluating: 4.5,
      persuading: 3.5,
      leading: 6.0,
      deciding: 7.0,
      trusting: 7.5,
      disagreeing: 2.5,
      scheduling: 6.5
    }
  },
  {
    nameZh: "波兰",
    nameEn: "Poland",
    scores: {
      communicating: 4.0,
      evaluating: 3.5,
      persuading: 4.0,
      leading: 6.5,
      deciding: 6.5,
      trusting: 6.0,
      disagreeing: 3.5,
      scheduling: 4.0
    }
  },
  {
    nameZh: "香港（中国）",
    nameEn: "Hong Kong (China)",
    scores: {
      communicating: 8.0,
      evaluating: 7.0,
      persuading: 6.0,
      leading: 7.5,
      deciding: 7.5,
      trusting: 7.5,
      disagreeing: 7.5,
      scheduling: 4.0
    }
  },
  {
    nameZh: "澳大利亚",
    nameEn: "Australia",
    scores: {
      communicating: 2.0,
      evaluating: 4.5,
      persuading: 7.5,
      leading: 2.0,
      deciding: 5.0,
      trusting: 3.0,
      disagreeing: 3.5,
      scheduling: 2.0
    }
  },
  {
    nameZh: "尼日利亚",
    nameEn: "Nigeria",
    scores: {
      communicating: 7.5,
      evaluating: 6.5,
      persuading: 5.5,
      leading: 9.0,
      deciding: 8.5,
      trusting: 8.5,
      disagreeing: 5.5,
      scheduling: 8.5
    }
  }
];

export const INITIAL_CASES: CaseStudy[] = [
  {
    id: "case-ppt-1",
    titleZh: "‘极限施压下的废标代价’：当中企速度碰上日德合规流程",
    titleEn: "Extreme Deadline Pressure Fail: China speed meets Germany & Japan compliance",
    descriptionZh: "一个中企跨国出海电信标案中，国内管理者习惯‘先跑起来，边跑边调’。为竞标强令全球交付团队必须在7天内，交出覆盖欧洲、美国、日本等多国极其复杂的总集成投标书。中方国内子团队3天不眠不休极速搞定，美国花费5天，德国完成高精度测算耗时6天。而日本本土团队因为内部流程和极其严苛防差错审核机制（Ringisho决策规避风险），告知‘合规核算至少要两周’。在管理层强令限期下，日本团队因合规限制拒绝盲目应付，最终导致7天内投出的整包标书出现空缺，在日本本地判定为废标。团队极为沮丧，直到两个月后低价中标的竞争对手因在德、日合规错漏百出无法交付、客户重新宽限两周招标，中方秉持对日本‘根回’流程的敬畏并给予充分对齐打磨，才最终无瑕疵完美中标。这揭示了在跨国、跨法区的高价值B端交付中，尊重当地流程和法律底线才是最高效率。",
    countryA: "China",
    countryB: "Japan"
  },
  {
    id: "case-ppt-2",
    titleZh: "‘特批申请的已读不回’：口口声声高频刷新 VS 原理优先 Good Order",
    titleEn: "The Read-but-Ignored特批: Chinese訴苦 relationship meets Indian systematic framework",
    descriptionZh: "在澳门一个交付面临严重延迟的基建IT项目中，核心痛点是急需在当地特批补充 Headcount 编制。中方项目经理开启‘高频刷脸模式’，在多个跨国电话会议中向印度大老板大倒苦水、强调项目多辛苦、客户天天重度投诉。印度老板在会上每次都礼貌点头表示知晓，可随后中方发出的多封英文申请邮件却如石沉大海。中方再次电话直接催促，印度老板只给了一句话：『Harry, can you put all the things in good order?』中方原以为对方是死板、官僚、故意卡扣。直到认知重组后明白，受英系教育的印度管理精英拥有极强的“原理优先” (Principles-First) 的分析性心智，且在集权秩序（Hierarchical）下，口头诉苦、开会叫苦根本不算作『正式发起申请』，无法用作他们向上级汇报或财务审计的凭证。改换策略后，中方摒弃了一切口头感情牌，递交了一份按照【背景、矛盾、差距分析、财务成本支撑、风险对照】极其完整的数据闭环中英分析邮件。结果：3天之内大老板就立刻爽快签下了特批文件。",
    countryA: "India",
    countryB: "China"
  },
  {
    id: "case-ppt-3",
    titleZh: "‘国际Workshop中的沉默看客’：中式含蓄礼貌与英美会中下注游戏",
    titleEn: "The Silent Watchers to Nuclear Ambush: China non-confrontation meets Anglo-Saxon pitching play",
    descriptionZh: "在一个包含澳大利亚、印度、新加坡等多国成员参加的‘全球交付痛点研讨会’上，澳大利亚和英美管理者们激烈讨论，甚至当场打断、论攻。中方项目经理Harry由于习惯中式的‘尊长礼貌’和自上而下的秩序，以为总会有主持人或长官出来主持和分发发言权，于是全场保持安静倾听。讨论快结束时，新加坡同事出于善意‘拉了一把’邀请中方发言。Harry一开口就给出了基于中国10倍体量和大数据的降维级实战解决方案。全场虽被方案质量极大震撼，却不叫好，反而陷入焦虑和被动的尴尬防备中。因为西方的‘决策游戏规则’（Disagreeing & Deciding）认为，工作坊是大家一边下注、一边实时吆喝和推销（Pitching）的动态过程。不发言在他们的文化语意中等同于『承认账户里没有筹码，或者默认同意前面定下的方向』。Harry在讨论结束期突然抛出颠覆性的王牌数据，在西方人眼中并不是儒雅谦逊，而属于‘憋大招核弹偷袭/暗中掀桌子’，这迫使他们不得不推倒刚刚费尽唇舌建立的全部大方向，带来极大合作不安感。",
    countryA: "United States",
    countryB: "China"
  },
  {
    id: "case-ppt-4",
    titleZh: "‘椰子壳文化的硬裂变’：中企卖惨牌对撞德企有钉子有卯认知信任",
    titleEn: "Smashing the German Coconut: Chinese emotion vs Cognitive task trust",
    descriptionZh: "中资硬件集成商在承接某德系知名车企的B端交付产品中，由于技术磨合出现些许瑕疵备受指责。在紧急跨国投诉会上，中方项目经理大打‘人情牌’，极力向德方诉苦、强调‘我们团队为了这项目，天天深夜加班、毫无功劳也有苦劳，我已经尽一切可能去催了’。然而这反而激怒了德企主管，他们当场指责中方态度‘不专业、无能、试图逃避明确责任分配’。项目陷入终止危机。随后中方高管下场救场，将沟通逻辑彻底反转——完全剔除无意义的“卖惨宣贯”，采取极度透明的客观拆解，承认产品瑕疵，将责任和产权清晰剥离（谁的代码、哪块能力弱、德企需要协同哪项工作），并利用‘逻辑对冲’：承认技术落后，但承诺利用集成商饱和的人力资源进行100%全班次人海兜底。拉出一份未来3A6个月、排班至人头、甚至备用方案按日汇报的可视化Excel表格。这套‘有钉子有卯’的系统逻辑瞬间击中极其注重‘认知信任 / 任务导向’（Task-Based Cognitive Trust）的典型椰子树文化，德方主管瞬间安定并解除对立，后续在私底下更愿意提供内部信息形成利益共同体。",
    countryA: "Germany",
    countryB: "China"
  },
  {
    id: "case-ppt-5",
    titleZh: "‘上海滩的40分钟时差’：当线性时间观撞击印式弹性多维时空",
    titleEn: "The 40-Minute Lag: Linear-Time vs Flexible-Time in Sino-Indian Collaboration",
    descriptionZh: "一位印度副总裁前往上海，中方团队制定了极其精准严密的出访拜访日程。第一天，双方对齐早上9：00在酒店大堂集合，一同出发拜访大客户，但等到9点40分，印度领导才缓缓走下电梯，耸耸肩、晃了晃脑袋。第二天，同样的迟到再次发生。中方项目经理出于‘线性时间观’（Linear-Time）感到受到极大的轻视、认为印度高管‘缺乏职业纪律、不尊重中方客户’，从而在内心积累了强烈的对抗情绪。直到深入沟通才知道，印方的底层时间逻辑是‘弹性时间观’（Flexible-Time）。在印度人眼里，时间并不是按甘特图前进的单轨铁路，而是一张复杂的动态多任务网络。当总部大老板中途在他们要下楼时突然拨入突发越洋电话，在印方的文化排序和系统权重里，处理总部紧急危机反而是最‘高度负责’且有张力的，哪怕这会让后面的客户迟到几十分钟。若想破局，绝对不要执念去改变一个族群的文化，而应当依靠人为预留1.5倍以上的‘文化时差防火墙’，运用物理防火墙与对冲预案来化解时间延差。",
    countryA: "India",
    countryB: "China"
  },
  {
    id: "case-ppt-6",
    titleZh: "‘层级暗礁与口音阶级’：头部OTO海外客服为何服务不动沙特？",
    titleEn: "The Class Accents of Middle East: Egypt remote seating meets Saudi deep hierarchy",
    descriptionZh: "某头部OTO跨境搬迁出海中，为了最大化人力红利。公司将客服服务基地从高昂成本的沙特利雅得降维迁移到了人力资源充沛、月度薪资仅三分之一的埃及开罗（月薪$2000降至$600），并派遣埃及人提供纯正流畅的远程阿语客服。然而迁移后，满意度极速坍缩、黑天鹅差评激增。中国主管拉家常后才探知真相：在高语境（High-Context）与极其严苛社会身份阶层（Hierarchical）的中东，沙特本地用户天然在文化坐标系里将自己置于极其崇高的‘Patrón (极端身份等级) 顶点’，而远程带有浓郁埃及口音的客服，在他们的社会潜意识里，瞬间被辨析为‘廉价的国外低级外包服务’。听得见的埃及口音不是方言，而充当了中东社会里的阶层身份刺刀。这让高消费的沙特大贵宾感到极大地被贬损。为此破局，中方采取了‘分层解耦治理’：将主观体验、代表顶级身位感、处理投诉和高溢价的语音通话高感官通道，35%保留原班人马部署在利雅得沙特本地，给予沙特最体面的‘对等身位尊重’；而将冷冰冰、低语境的文本、在线Chat/机器人聊天等文字中性化服务，65%全部托管在埃及开罗基地通过打字抹平口音。实现了体验满意度(94%)与运营成本优化的奇迹平衡。",
    countryA: "Saudi Arabia",
    countryB: "Egypt"
  },
  {
    id: "case-ppt-7",
    titleZh: "‘双层过滤下的巴哈萨黑盒’：中新印三方催收危机的面子与微尘粉饰",
    titleEn: "The Indonesian Bahasa Blackbox: High-context face filters critical regulatory alerts",
    descriptionZh: "一个总部设在中国深圳、区部在新加坡、催收执行放在印尼雅加达的跨境多边金融项目中，深圳总部每周收到的印尼汇报邮件都是‘一切安好、指标合规’。但突发印尼金融管理局（OJK）由于一例逼迫民生的催收，对集团下达了直接注销本地展业牌照的一票否决最后通牒。高层震惊，为什么如此重大的隐患在引爆前两周内毫无警报？这源于‘双层文化过滤’。印尼本地电话人员属于极高的面子和极低冲突性文化（Avoids Confrontation + High-Context）。由于对强高压KPI的恐惧，下属对当地主管采用了‘微笑的拖延’并故意瞒报。而印尼主管（关系本位 + 间接反馈）在跨国英文周会上，潜意识将‘0.3%违规动作’用婉转修饰词层层粉饰，传递给新加坡和中国。这在他们心中代表着‘不让老板丢脸、保全团队尊严’，但在中国主管听来却全然屏蔽了危机。破局之策是建立‘去语境化AI系统看板’，强制用 Bahas 语音翻译实时词云和声调警报红绿灯（数据化客观事实），彻底给中层管理赋予免责盾牌，破开隐性屏蔽。",
    countryA: "Singapore",
    countryB: "Indonesia"
  },
  {
    id: "case-ppt-8",
    titleZh: "‘撞上比利时钢铁板’：当亚太舒适圈温情遇见低语境冷面数字",
    titleEn: "Smashing Belgium Steel Plate: China context comfort meets low-context brutal feedback",
    descriptionZh: "某大中华区商拓总经理想比利时总部运营大老板汇报一例因政策调整造成的客情延期。中方习惯亚太总监的温情，在PPT上花了40%篇幅大谈特谈客情维护、如何跟客户喝早茶平息情绪、兄弟们多么辛苦。谁知比利时主管在会议15分钟时，直接打断并冷冰冰说：『你这业务不合格（This is a total mess）。这项目季度极为危险，我看不见任何你的个人能力。』中方代表深受伤害、当晚失眠，陷入极度情绪对抗不愿配合。这正是直接否定反馈（Direct Negative Feedback）文化对比中式面子包裹。欧洲低语境核心在于‘对事不对人（Its purely business）’。一年的绝惨磨合后，中方管理者彻底心态逆转：1. 不向西方上司吐无意义苦水，周报剥离所有苦劳叙事、只呈现精确数字、Gap百分差与精准纠偏ROI；2. 认同这只是高清度业务参考指标而非人身攻击；3. 惊喜发现这种比利时主管甚至由于‘没废话、简单粗暴原则优先’，只要拿出合理的ROI，他会极其简单高效地帮你特批砸重金、要权力，成为最好的业务后台支撑伞。",
    countryA: "Belgium",
    countryB: "China"
  },
  {
    id: "case-ppt-9",
    titleZh: "‘墨西哥法老式拍板与阿米巴的相撞’：中式自主算账 vs 墨式长官主权与家庭优先",
    titleEn: "Mexico Hierarchical Command meets Amoeba Self-Accounting",
    descriptionZh: "一家深圳中资跨境供应链企业在墨西哥设立本地仓储与客服履约中心，中方引入精细化的‘阿米巴自主经营体’（Amoeba Self-Accounting）模式，鼓励本地基层班组自己算账、成本优化和越级提改进方案。然而在墨西哥，这一模式引发了严重的管理阻力。墨西哥本地团队习惯于极强的‘长官主权’（Hierarchical Command）与家庭优先文化（Relationship-Based），员工认为跨层级提方案是对直属长官权威的冒犯（Disrespect），且极度排斥在周末或非工作时间响应紧急抢修。中方项目总监一度指责本地经理‘缺乏进取心与主观能动性’。经诊断后，中方重塑了战术策略：摒弃扁平化直通提方案的冲击，改为‘尊重长官主权+家族式温情荣誉激励’。所有优化建议均由中方与本地主管私下沟通后，由本地主管在每周例会上向全员亲自发布，并颁发‘家庭荣誉徽章与专项奖金’。这一调整瞬间激活了墨方团队的执行忠诚度，履约差错率当月下降68%。",
    countryA: "Mexico",
    countryB: "China"
  },
  {
    id: "case-ppt-10",
    titleZh: "‘法国工会的原则优先与急查对决’：当深圳急件碰上法式原理架构考量",
    titleEn: "Shenzhen Speed Meets French Principles-First Architecture",
    descriptionZh: "在某中资SaaS巨头拓展欧洲市场、向法国高端奢侈品集团交付客户关系管理（CRM）中枢时，中方深圳产研团队秉持‘快速迭代、边上线边补丁’的敏捷风格，要求法方技术总监在48小时内签署并同意接口热升级许可。法方架构师不仅拒绝签署，更提交了一份长达35页的系统架构原理与风险论证报告，质疑中方的底层技术架构‘缺乏演绎法严密性（Principles-First），存在隐形漏洞’。中方急于推进项目，尝试跨过技术团队直接向法方C-Suite高层进行商务说服，却激怒了法方技术团队，导致项目被提请法国工会（Labor Union）审查而被迫暂停。救场阶段，中方派驻了具备欧洲留学背景的首席架构师，摒弃了‘商务压迫与敏捷急件’的说法，转而完全顺应法式的‘原理优先’逻辑：花3天时间绘制了完整的全链路UML时序图、数据流转闭环论证与安全边界数学模型，并邀请法方架构师共同发表联席署名技术白皮书。这套极其尊重原理和学术严密性的沟通彻底征服了法方团队，项目不仅提前解冻上线，更被法方集团推选为年度最佳跨国技术创新标杆。",
    countryA: "France",
    countryB: "China"
  },
  {
    id: "case-ppt-11",
    titleZh: "‘越南越级汇报与阿语面子防线’：东南亚中层沟通与多国BPO交织阵地",
    titleEn: "Vietnam Cross-Level Escalation vs High-Context Middle Management Shield",
    descriptionZh: "某跨境泛娱乐App在胡志明市搭建亚太多语言BPO客服基地，同时服务越南、印尼及沙特用户。中方驻越南运营主管发现，越南本地年轻一线客服在遇到疑难客情时，经常绕过本地越南籍中层组长，直接在微信/Lark群里向中方总监越级私信叫苦。而越南籍中层组长感到‘严重丢面子（Face Loss）’，在日常考评中对越级的一线员工进行隐蔽排挤，导致一线离职率飙升至月均25%。与此对应的是，当地服务中东沙特市场的阿语小组，在出现高额退款纠纷时，由于阿语高语境与防面子破损（Avoids Confrontation），组长总是选择‘私下把问题包揽压下’，直到财务审计时才暴露数万美元的呆账。面对这一‘越级与隐瞒交织’的乱局，中方采取了‘双向接口标准化’战术：1. 对越南团队设立‘三级工单降维升级机制’，明确只有经过工单系统校验且组长2小时未处理的痛点，才触发中方总监预警，既堵住了无序越级，又保障了响应通路，并增设‘优秀组长协同奖’保护中层面子；2. 对沙特/阿语小组引入‘去语境化AI退款自动审计规则’，由系统实时判定异常退款阈值，将责任归因归结于‘系统规则提示’而非‘个人过错’，彻底解开了面子顾虑。两套方案同步落地后，基地综合人员流失率骤降至5%以内，客情响应时效提升300%。",
    countryA: "Vietnam",
    countryB: "China"
  }
];
