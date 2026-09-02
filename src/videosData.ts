export interface VideoModule {
  id: string;
  titleZh: string;
  titleEn: string;
  descZh: string;
  descEn: string;
  duration: string;
  caseCountryZh: string;
  caseCountryEn: string;
  tags: string[];
  videoUrl?: string;
  pdfFile: string;
  isFree: boolean;
}

export const VIDEO_MODULES: VideoModule[] = [
  {
    id: "M01",
    titleZh: "M01: 测试视频播放",
    titleEn: "M01: Test Video Playback",
    descZh: "深入剖析出海起步阶段的核心痛点：如何将国内饱受赞誉的“极速执行”范式，与海外成熟、严苛的合规及多边相关方预期对位。以印尼雅万高铁为典型区域视角案例，探讨跨国大工程落地时，如何打破物理外溢的粗放思路，转入精细化跨国契约及信任对齐通道。",
    descEn: "Deeply analyze the core pain points of going global at inception: How to align the highly praised domestic 'extreme execution' paradigm with mature, rigorous global regulations and multi-stakeholder expectations. Anchored on the Indonesia JKT-BDG High-Speed Rail as a regional case study, explore how to transcend crude physical overflow and move into standard international contracts.",
    duration: "14:22",
    caseCountryZh: "印尼 / 新加坡",
    caseCountryEn: "Indonesia / Singapore",
    tags: ["破题战略", "雅万高铁", "区域视角", "范式重置"],
    videoUrl: "https://github.com/HarryLyu-hub/Harry-Lyu-Personal-Web-site-v2/releases/download/videos-on-publish/M01.mp4",
    pdfFile: "/docs/M01.pdf",
    isFree: true
  },
  {
    id: "M02",
    titleZh: "M02: 沟通与反馈 · 低语境直白 vs. 高语境空气的跨国摩擦",
    titleEn: "M02: Communication & Evaluation - Low-Context Clarity vs. High-Context Air Frictions",
    descZh: "系统解构 Erin Meyer 文化大地图的第一、第二坐标轴（沟通与反馈）。对比低语境的直言不讳（如荷兰、英国）与高语境的含蓄委婉（如日本、印尼）撞击时的管理盲区。教你如何建立一套去语境化的看板反馈体系，避免因‘听不懂弦外之音’而导致的高管合作崩盘。",
    descEn: "Systematically dissect Erin Meyer's first two cultural dimensions (Communicating and Evaluating). Contrast low-context frankness (e.g., Netherlands, UK) with high-context implicitness (e.g., Japan, Indonesia). Learn to establish a de-contextualized dashboard feedback flow to prevent C-suite collaboration from collapsing.",
    duration: "16:15",
    caseCountryZh: "英国 / 荷兰 / 日本",
    caseCountryEn: "United Kingdom / Netherlands / Japan",
    tags: ["沟通反馈", "去语境化", "反馈屏障", "直接否定"],
    pdfFile: "/docs/M02.pdf",
    isFree: true
  },
  {
    id: "M03",
    titleZh: "M03: 说服与领导 · 原理优先与演绎论证的跨国破冰推进",
    titleEn: "M03: Persuading & Leading - Principles-First Reasoning vs. Direct Action Pipelines",
    descZh: "为什么向德、法高管做项目汇报时，他们总是在方法论、演绎推理和底层骨架上纠缠不清？而美国老板却只要事实、应用与落地收益？本节通过生动的多国邮件、汇报博弈案例，训练你掌握原理优先与应用优先的汇报双规，并打通平权与等级制的管理破冰链路。",
    descEn: "Why do German and French executives always demand rigorous methodologies, deductive reasoning, and structural frameworks, while American bosses want immediate facts and application? This session uses vivid cross-border emails and pitch cases to teach you both persuasion styles and how to navigate egalitarian vs. hierarchical divides.",
    duration: "15:40",
    caseCountryZh: "法国 / 德国 / 美国",
    caseCountryEn: "France / Germany / United States",
    tags: ["说服逻辑", "演绎证明", "平权管理", "领导风格"],
    pdfFile: "/docs/M03.pdf",
    isFree: false
  },
  {
    id: "M04",
    titleZh: "M04: 决策与分歧 · 共识型根回与首长负责制的动态平权平衡",
    titleEn: "M04: Deciding & Disagreeing - Consensual Nemawashi vs. Top-Down Velocity",
    descZh: "日本、瑞典、比利时的决策总是需要全员漫长对齐（根回/Nemawashi），而美国和中方高管更习惯自上而下拍板。当两股机制碰撞时，如何避免项目无限期搁置？本节拆解真实的跨国中外合资并购案，教你建立高效的平权决策对齐机制，并在冲突多发期进行健康的异议对位。",
    descEn: "Decision-making in Japan, Sweden, and Belgium demands long-term consensus (Nemawashi), whereas US and Chinese managers prefer rapid top-down approval. When these clash, projects stall. This module analyzes real joint venture mergers to teach consensus-building and conflict-resolution.",
    duration: "13:55",
    caseCountryZh: "瑞典 / 比利时 / 美国",
    caseCountryEn: "Sweden / Belgium / United States",
    tags: ["决策机制", "共识根回", "公开异议", "多边冲突"],
    pdfFile: "/docs/M04.pdf",
    isFree: false
  },
  {
    id: "M05",
    titleZh: "M05: 信任与时间 · 刚性契约制度与关系人情互信的张力协同",
    titleEn: "M05: Trusting & Scheduling - Rigid Contractual Deadlines vs. Flexible Relationship Buffers",
    descZh: "在中东、南美、甚至亚太，生意是建立在喝茶、聚餐和极其神圣的“人情账户”之上，死日程表随时可能给突发人情让路；而在德国、新加坡，专业合同与分钟级死线就是最高神明。本节详细指导中国管理者如何建立‘双轨信任机制’，在守住交付死线的同时做足人情润滑。",
    descEn: "In the Middle East, Latin America, and APAC, business is built on tea, dining, and relationship accounts, where calendars give way to events. In Germany and Singapore, precise contracts are absolute. Learn to run a 'dual-track trust mechanism' to secure timely delivery while protecting local ties.",
    duration: "14:10",
    caseCountryZh: "沙特阿拉伯 / 德国",
    caseCountryEn: "Saudi Arabia / Germany",
    tags: ["人情信任", "弹性时间", "契约保证", "死线管理"],
    pdfFile: "/docs/M05.pdf",
    isFree: false
  },
  {
    id: "M06",
    titleZh: "M06: 销售实操 · 季度末销售高管跨国 1x1 谈判桌博弈与对位",
    titleEn: "M06: Sales Negotiation - Closing High-Stakes Multi-National 1-on-1 Deals",
    descZh: "实战模拟季度末。针对新加坡的大型软件采购案与越南本地复杂的代理佣金冲突，复盘两场惊心动魄的 1x1 谈判实录。如何在新加披的任务型高契约谈判中巧妙卡位？如何在越南极其漫长的“关系缓冲带”中完成高难度利益交涉？吕华总教头为您全景拆局。",
    descEn: "Field simulation at the quarter-end: Analyzing high-stakes software procurement in Singapore and agency commission conflicts in Vietnam. Study two intense 1-on-1 negotiations to learn how to claim leverage in task-based deals and nudge relationship-oriented buyers.",
    duration: "12:50",
    caseCountryZh: "新加坡 / 越南",
    caseCountryEn: "Singapore / Vietnam",
    tags: ["高管谈判", "1对1实战", "利益交涉", "销售冲刺"],
    pdfFile: "/docs/M06.pdf",
    isFree: false
  },
  {
    id: "M07: 交付实操 · 交付主管化险为夷的跨国虚拟团队救命会",
    titleZh: "M07: 交付实操 · 交付主管化险为夷的跨国虚拟团队救命会",
    titleEn: "M07: Delivery Operations - How a CX Leader Salvages a Broken Global Virtual Team",
    descZh: "跨国交付突然遭遇突发Bug、多语言交割断层与印度外包团队的越级推诿。交付主管如何在两小时的紧急虚拟务虚会（Facilitation）中，避免美国客户疯狂发难与印度工程师的敷衍了事？教你用客观红黄绿（RAG）状态灯、结构化申请与强硬的跨文化控制力，迅速控制局面。",
    descEn: "Global delivery encounters high-risk bugs, language gaps, and Indian vendor escalation. How does an agile director lead a 2-hour emergency session to calm US customers and drive Indian BPO execution? Master RAG states, structured protocols, and cross-cultural escalation control.",
    duration: "15:15",
    caseCountryZh: "印度 / 美国",
    caseCountryEn: "India / United States",
    tags: ["交付危机", "虚拟会议", "印度外包", "客户止损"],
    pdfFile: "/docs/M07.pdf",
    isFree: false
  },
  {
    id: "M08",
    titleZh: "M08: 区域兵法 · 东南亚微笑黑盒下的双重博弈指标与本地化突破",
    titleEn: "M08: APAC Regional Manual - Unlocking the Southeast Asian 'Smile Blackbox'",
    descZh: "专攻东南亚（印尼、菲律宾、新加坡）！深入讲解由于‘极度看重面子、回避冲突’而在管理中产生的‘微笑隐瞒’盲区。当团队口头和报告老是说‘没问题’但实际上进度严重落后，如何通过 Bahasa 情绪词云、日常包容福利、以及 1对1 局部高感度关心打破微笑黑盒，释放真正的组织绩效？",
    descEn: "Focus on Southeast Asia (Indonesia, Philippines, Singapore)! Unveil the management blind spot of the 'Smile Cover-up' driven by face-preservation. When progress falls behind despite polite confirmation, learn to use Bahasa tone cues, local inclusive perks, and tactical 1-on-1 chats to drive execution.",
    duration: "17:30",
    caseCountryZh: "新加坡 / 印度尼西亚 / 菲律宾",
    caseCountryEn: "Singapore / Indonesia / Philippines",
    tags: ["东南亚兵法", "微笑黑盒", "避免冲突", "管理闭环"],
    pdfFile: "/docs/M08.pdf",
    isFree: false
  },
  {
    id: "M09",
    titleZh: "M09: 区域兵法 · 中东海湾国家的高语境款待与关系金字塔搭建",
    titleEn: "M09: Middle East Manual - High-Context Hospitality & Royal Relationship Pyramids",
    descZh: "专攻中东（沙特阿拉伯、阿联酋）！探索高语境、重面子和家族关系至上的海湾商业文化。本节全面拆解如何融入当地宏大的款待文化（Majlis），掌握高规格商务往来的仪式感，规避严苛的本土化雇佣政策、宗教合规红线，教中国管理者如何在利雅得和迪拜构建坚韧的本地合作金字塔。",
    descEn: "Focus on the Middle East (Saudi Arabia, UAE)! Dive deep into high-context, relationship-driven, and family-oriented GCC business codes. Learn to navigate Majlis hospitality protocols, royal family status cues, Saudization compliance, and religious taboos to lock in long-term deals.",
    duration: "16:45",
    caseCountryZh: "沙特阿拉伯 / 阿联酋",
    caseCountryEn: "Saudi Arabia / UAE",
    tags: ["中东出海", "海湾高语境", "宗教合规", "人情建组"],
    pdfFile: "/docs/M09.pdf",
    isFree: false
  },
  {
    id: "M10",
    titleZh: "M10: 区域兵法 · 拉美多边协作与高弹性时间的柔性对接指南",
    titleEn: "M10: LATAM Regional Manual - Navigating Flexible Calendars and Passion-Driven Work",
    descZh: "专攻拉美（巴西、墨西哥）！拉美文化的特点是极致热情、人际关系导向以及极度弹性的时间观。当中国总部的硬死线遭遇巴西本地‘明早给你’（Amanhã）的柔性缓冲时，该如何平稳过度？主训导师为您系统支招：建立双轨契约，拆碎交付颗粒，并在墨西哥和圣保罗本地搭建自驱的拉美明星战队。",
    descEn: "Focus on Latin America (Brazil, Mexico)! LATAM is marked by vibrant hospitality, deep relationship trust, and high flexible-time orientation. When strict Headquarters deadlines encounter local 'Amanhã' buffers, learn to run dual-track schedules, break down deliverables, and build local trust.",
    duration: "15:25",
    caseCountryZh: "巴西 / 墨西哥",
    caseCountryEn: "Brazil / Mexico",
    tags: ["拉美突破", "弹性时间观", "热情关系", "交付解耦"],
    pdfFile: "/docs/M10.pdf",
    isFree: false
  },
  {
    id: "M11",
    titleZh: "M11: 终极合围 · 欧美刚性契约与全球文化地图的完美大结局",
    titleEn: "M11: Ultimate Synthesis - The rigid Western Contract & Seamless Cultural Harmony",
    descZh: "11节大结局！合围欧美（美国、德国、比利时、英国）。回顾个人主义、低语境契约、以及‘对事不对人’的反馈轴心。总结如何从单一中式视角打破惯性，通过重构自身的心智模型（Global Mindset）实现破茧。为中企高管赋能长效的‘跨文化敏捷治理罗盘’，扬帆出海，真正制胜全球。",
    descEn: "Episode 11 Finale! Re-evaluate Western nodes (US, Germany, Belgium, UK) focusing on individualism, low-context contractual commitments, and brutal direct feedback. Acquire the ultimate Global Mindset, empower yourself with the agile cultural compass, and confidently orchestrate multi-national organizations.",
    duration: "18:10",
    caseCountryZh: "美国 / 德国 / 比利时 / 英国",
    caseCountryEn: "United States / Germany / Belgium / United Kingdom",
    tags: ["终极合围", "欧美出海", "跨国罗盘", "思维破茧"],
    pdfFile: "/docs/M11.pdf",
    isFree: false
  }
];
