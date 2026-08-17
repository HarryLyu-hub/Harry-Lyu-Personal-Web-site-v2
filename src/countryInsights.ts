export interface CountryInsight {
  executiveSummaryZh: string;
  executiveSummaryEn: string;
  highlightsZh: Array<{
    dimensionId: string;
    title: string;
    text: string;
  }>;
  highlightsEn: Array<{
    dimensionId: string;
    title: string;
    text: string;
  }>;
}

export const COUNTRY_INSIGHTS: { [countryEn: string]: CountryInsight } = {
  "China": {
    executiveSummaryZh: "综上所述，中国职场兼具高语境的人情关怀与深沉的权威尊崇。决策高度依赖自上而下的核心意志，但在基层落实时极其看重‘人际面子’与长期人情账户。出海高管须谨记：事情的成败往往在工作之外的温情流动与信任建立，严禁随意越级或在公开场合直接给予生硬的负面反馈。",
    executiveSummaryEn: "In summary, Chinese business culture elegantly blends warm relationship networks with absolute hierarchical respect. Decisions are driven top-down by central authorities, yet execution hinges on maintaining mutual 'face' and long-term personal trust. Outbound managers should prioritize relationship-building outside formal meetings and avoid public direct confrontation.",
    highlightsZh: [
      {
        dimensionId: "communicating",
        title: "含蓄表达与潜台词",
        text: "沟通偏向高语境，信息多隐藏于字里行间。注重言语委婉，需要听话听音，通过关系铺垫来传递真实意图。"
      },
      {
        dimensionId: "leading",
        title: "尊重绝对权威与层级",
        text: "领导作风偏向家长式，重视组织内的长幼尊卑和层级链条。越级汇报或公开质疑领导被视为严重的职业失礼。"
      },
      {
        dimensionId: "trusting",
        title: "先建立关系，后做生意",
        text: "信任基础牢牢扎根于长期的私人交情。没有深厚的情感信任积淀，任何纯商业条款的推进都可能遭遇无形阻力。"
      }
    ],
    highlightsEn: [
      {
        dimensionId: "communicating",
        title: "High-Context Nuance",
        text: "Communication is rich with subtext and subtle implication. Read between the lines to catch the unspoken alignment."
      },
      {
        dimensionId: "leading",
        title: "Hierarchical Chain",
        text: "Strong paternalistic structure. Hierarchy is deeply respected; skip-level reporting or public contradiction is a major taboo."
      },
      {
        dimensionId: "trusting",
        title: "Relationship-Based Trust",
        text: "Trust must be cultivated personally over dinners and tea before business can move forward securely."
      }
    ]
  },
  "United States": {
    executiveSummaryZh: "综上所述，美国职场崇尚高度的个人主义与绝对的结果导向。组织氛围偏向扁平，团队成员敢于直言不讳地表达异议。一切商务逻辑围绕‘冷冰冰但极其精确’的合同条款运转。出海高管不可试图靠‘人情拉拢’解决合规或流程漏洞，而是应当展示极致的工作效率与数据闭环。",
    executiveSummaryEn: "In summary, American corporate culture champions rigorous individualism and quantifiable results. The workplace is highly egalitarian, and confronting disagreement directly is seen as a sign of professional integrity. Everything revolves around precise contracts rather than personal favors. Outbound leaders must focus on data-driven efficiency.",
    highlightsZh: [
      {
        dimensionId: "communicating",
        title: "低语境极其直白高效",
        text: "奉行‘对事不对人’。沟通力求精准、直球，所有的事实、假设、决定必须白纸黑字记录，拒绝任何隐晦的猜测。"
      },
      {
        dimensionId: "deciding",
        title: "高效扁平的自上而下决策",
        text: "虽然在决策前鼓励全员发表意见（看似平等），但一旦老板做出了终极决定，所有人必须立即服从并迅速产出成果。"
      },
      {
        dimensionId: "trusting",
        title: "任务优先，合作即信任",
        text: "信任完全基于当下你的专业交付质量。合同签完即代表合作开始，不需要通过私人聚会、喝酒去维持关系账户。"
      }
    ],
    highlightsEn: [
      {
        dimensionId: "communicating",
        title: "Explicit Clarity",
        text: "Highly explicit and literal. No reading between the lines. Feedback is direct and constructive for continuous improvement."
      },
      {
        dimensionId: "deciding",
        title: "Egalitarian But Top-Down",
        text: "Extremely fast, centralized decision-making once input is gathered. Speed is prioritized over exhaustive consensus."
      },
      {
        dimensionId: "trusting",
        title: "Task-Based Transactional",
        text: "Trust is built through professional delivery and legal contracts, requiring zero emotional or social bonding."
      }
    ]
  },
  "Japan": {
    executiveSummaryZh: "综上所述，日本职场将集体共识（Ringi 禀议）与流程极致严谨视作灵魂。任何决策都必须历经漫长的全员通气与铺垫（Nemawashi 根回），绝不允许空降高管强推决策。反馈方式极度柔和，需具备高强度的‘阅读空气’能力。出海企业在本地推进时，千万不可急功近利，必须展现对流程的绝对敬畏。",
    executiveSummaryEn: "In summary, Japanese business life is anchored on collective alignment and meticulous operational discipline. Deciding requires a slow, bottom-up consensus process (Ringi), and managers must never force direct changes without soft pre-alignment (Nemawashi). Leaders must possess exceptional radar to 'read the air' and decode heavily cushioned feedback.",
    highlightsZh: [
      {
        dimensionId: "communicating",
        title: "极高语境与阅读空气",
        text: "极为看重和谐氛围（WA）。日本人几乎从不说‘不’，而会用‘这有些困难’作为代替。必须敏感捕捉各种婉拒的信号。"
      },
      {
        dimensionId: "deciding",
        title: "自下而上的集体协商制",
        text: "决策极其依赖‘禀议书’系统，全员签字才能下达。这虽然导致决策极其缓慢，但一旦通过，执行起来堪称绝对同步、分秒不差。"
      },
      {
        dimensionId: "disagreeing",
        title: "极力回避公开正面冲突",
        text: "视公开争论为对团队和谐的破坏，会造成当事人极大的难堪。所有的不同意见都必须在会前私下进行温和协调。"
      }
    ],
    highlightsEn: [
      {
        dimensionId: "communicating",
        title: "Reading the Air",
        text: "High-context in the extreme. Harmony (WA) is vital. A polite nod or silence often means disagreement; never expect a flat 'no'."
      },
      {
        dimensionId: "deciding",
        title: "Slow Consensual Alignment",
        text: "Bottom-up 'Ringi' decision-making. Demands extensive pre-alignment ('Nemawashi') which guarantees perfect alignment in execution."
      },
      {
        dimensionId: "disagreeing",
        title: "Avoid Conflict at All Costs",
        text: "Direct debate causes loss of face. Confrontation is avoided; dissent is delivered through polite, delicate phrasing privately."
      }
    ]
  },
  "France": {
    executiveSummaryZh: "综上所述，法国职场闪耀着卓越的理性思辨与智识骄傲。在沟通层面，他们优雅含蓄、讲究语境，但在讨论问题时，又极其热衷于针锋相对的学术交锋。决策过程具有极强的‘拿破仑印记’（高度依赖领袖一锤定音）。出海高管须具备深厚的方法论架构，并在遭遇反对时保持风度，视其为对方尊重你智力水准的体现。",
    executiveSummaryEn: "In summary, French corporate life shines with structural methodology and intellectual debates. While contextually delicate and polite in social settings, they embrace sharp, passionate, analytical argument as a sign of respect and logical clarity. The hierarchy remains strong ('Napoleon trace') in final decisions. Be prepared to defend your frameworks with impeccable theory.",
    highlightsZh: [
      {
        dimensionId: "persuading",
        title: "原理先行与方法论崇拜",
        text: "法国人在沟通项目或提议时，必须先阐明底层的哲学框架与理论假设（Why），直接抛出结论（How）会被视为缺乏逻辑深度。"
      },
      {
        dimensionId: "disagreeing",
        title: "热爱智力辩论与公开交锋",
        text: "将激烈的争论视为增进了解、还原真理的必经之路。争论归争论，私下里的同事关系依然可以维持优雅体面。"
      },
      {
        dimensionId: "deciding",
        title: "高度集权的领袖决断",
        text: "尽管法国人追求平等，但其组织决策权高度向顶层靠拢。最终执行拿主意的大多是极少数精英阶层（极具拿破仑式威严）。"
      }
    ],
    highlightsEn: [
      {
        dimensionId: "persuading",
        title: "Principles-First (Why First)",
        text: "Theoretical and conceptual foundations must be built before recommendations. Practical application without 'why' is rejected."
      },
      {
        dimensionId: "disagreeing",
        title: "Intellectual Confrontation",
        text: "Vigorous debate is seen as a sign of intellectual engagement and passion. Separation between ideas and personal relationship is absolute."
      },
      {
        dimensionId: "deciding",
        title: "Centralized Leader Deciding",
        text: "Despite social egalitarian beliefs, executive power is centralized. The leader decides alone, reflecting a deep Cartesian hierarchy."
      }
    ]
  },
  "Germany": {
    executiveSummaryZh: "综上所述，德国职场是一台精密运转、恪守死线的超级工业机器。他们拒绝任何即兴发挥或不守时的行为。在说服逻辑上注重系统原理和严密实证，在反馈上直球对决。出海高管只要展示出无可挑剔的技术实力、严格守时的专业度，以及对书面协议的绝对敬畏，就能在德获得极高的企业尊崇。",
    executiveSummaryEn: "In summary, German business runs like a precision-engineered industrial engine. Improvisation or lack of preparation is viewed as unprofessionalism. They prioritize theoretical principles followed by structural evidence. Build trust by delivering structured documentation and respecting absolute schedules.",
    highlightsZh: [
      {
        dimensionId: "persuading",
        title: "严密原理先行与技术论证",
        text: "极其注重底层技术逻辑。需要你展示完美的事前论证和系统图表，靠热情高昂的销售演讲在这里是行不通的。"
      },
      {
        dimensionId: "evaluating",
        title: "极为尖锐直接的负面反馈",
        text: "德国人讲求客观事实。反馈意见时会毫无遮掩地指出你的代码或方案漏洞，绝非针对你个人，而是为了追求事物的极致完美。"
      },
      {
        dimensionId: "scheduling",
        title: "死线绝对神圣不可侵犯",
        text: "线性时间的典型代表。开会迟到5分钟或延误项目节点，在德国商务礼仪里会被判定为严重失信、无可原谅。"
      }
    ],
    highlightsEn: [
      {
        dimensionId: "persuading",
        title: "Principles-First Logic",
        text: "Detailed system architecture and logic must be pristine. Presentation should be clinical, fact-based, and highly structured."
      },
      {
        dimensionId: "evaluating",
        title: "Direct & Explicit Criticism",
        text: "Direct negative feedback is delivered clearly without emotional sugar-coating. It is a sign of respect for the task's success."
      },
      {
        dimensionId: "scheduling",
        title: "Sacred Linear Time",
        text: "Deadlines and agendas are set in stone. Punctuality is the absolute baseline of respect. Improvisation represents poor planning."
      }
    ]
  },
  "India": {
    executiveSummaryZh: "综上所述，印度职场将深厚的家族人情网络与神奇的即兴解决智慧（Jugaad）融为一体。这里的时间观念高度流动，且层级权力极其森严。出海高管既要保持温和的倾听姿态并给足尊严，又要在执行死线前设定密集的进度检查哨，如此才能在变动频发的本地市场中游刃有余。",
    executiveSummaryEn: "In summary, Indian business culture intertwines rich relationship bonding with highly flexible improvisational wisdom (Jugaad). Time is fluid, yet corporate authority is strongly hierarchical. Outbound managers should build deep empathy while establishing frequent milestone check-ins to navigate dynamic execution environments.",
    highlightsZh: [
      {
        dimensionId: "scheduling",
        title: "高度弹性与环境变化包容",
        text: "由于基础设施和市场变化迅速，印度人习惯了计划赶不上变化。对他们而言，灵活应对和临时补救（Jugaad）是真正的核心竞争力。"
      },
      {
        dimensionId: "leading",
        title: "阶级感强烈与威权尊崇",
        text: "组织层级十分森严，基层员工极少公开反驳高管。管理者需要主动发出极其明确具体的指令，而不是空泛地让他们‘发挥想象力’。"
      },
      {
        dimensionId: "communicating",
        title: "热情但含蓄的高语境表达",
        text: "沟通温和且极重感情纽带，由于不愿意得罪人或破坏和谐，即便项目落后，印度员工也会出于礼貌回复‘好的，没问题’。"
      }
    ],
    highlightsEn: [
      {
        dimensionId: "scheduling",
        title: "Highly Fluid Time",
        text: "Schedules are dynamic. Indian teams excel at 'Jugaad'—creative, flexible improvisation in the face of sudden external bottlenecks."
      },
      {
        dimensionId: "leading",
        title: "Strong Hierarchical Gap",
        text: "Significant hierarchy and status respect. Staff rarely contradict superiors. Leaders must issue granular directives to guarantee success."
      },
      {
        dimensionId: "communicating",
        title: "Polite Relation-Based Nuance",
        text: "Warm but soft context. Indian colleagues may agree ('Yes, sir') to preserve a pleasant atmosphere, even if constraints make delivery impossible."
      }
    ]
  }
};

// Generic generator for any country to display 2-3 most distinct scales and a smart outbound manager profile
export function getCountryProfile(
  countryEn: string,
  scores: { [id: string]: number },
  isEn: boolean
): { executiveSummary: string; highlights: Array<{ dimensionId: string; title: string; text: string }> } {
  // If we have a curated insight, return it
  if (COUNTRY_INSIGHTS[countryEn]) {
    const data = COUNTRY_INSIGHTS[countryEn];
    return {
      executiveSummary: isEn ? data.executiveSummaryEn : data.executiveSummaryZh,
      highlights: isEn ? data.highlightsEn : data.highlightsZh
    };
  }

  // Otherwise, compute dynamically based on scores!
  // Sort dimensions by their extreme deviation from neutral (5.5)
  const sortedDims = Object.entries(scores)
    .map(([dimId, score]) => ({
      dimId,
      score,
      deviation: Math.abs(score - 5.5)
    }))
    .sort((a, b) => b.deviation - a.deviation);

  // Take the top 3 extreme dimensions
  const topDims = sortedDims.slice(0, 3);

  // Dimension details lookup
  const dimNames: { [id: string]: { zh: string; en: string; leftZh: string; rightZh: string; leftEn: string; rightEn: string } } = {
    communicating: { zh: "沟通风格", en: "Communication Style", leftZh: "直白低语境", rightZh: "含蓄高语境", leftEn: "Low-Context", rightEn: "High-Context" },
    evaluating: { zh: "评价反馈", en: "Feedback Approach", leftZh: "直接负面反馈", rightZh: "委婉间接反馈", leftEn: "Direct Criticism", rightEn: "Indirect Criticism" },
    persuading: { zh: "说服说理", en: "Persuasion Logic", leftZh: "原理先行", rightZh: "实用主义/案例先行", leftEn: "Principles-First", rightEn: "Applications-First" },
    leading: { zh: "领导力层级", en: "Leadership Hierarchy", leftZh: "平等扁平", rightZh: "森严层级", leftEn: "Egalitarian", rightEn: "Hierarchical" },
    deciding: { zh: "决策机制", en: "Decision Making", leftZh: "集体共识", rightZh: "自上而下", leftEn: "Consensual", rightEn: "Top-Down" },
    trusting: { zh: "信任基础", en: "Trust Foundation", leftZh: "就事论事/任务型", rightZh: "关系驱动", leftEn: "Task-Based", rightEn: "Relationship-Based" },
    disagreeing: { zh: "异议表达", en: "Disagreeing", leftZh: "敢于公开争论", rightZh: "极力回避冲突", leftEn: "Confrontational", rightEn: "Avoids Conflict" },
    scheduling: { zh: "时间节点", en: "Time Management", leftZh: "线性死板时间", rightZh: "高度弹性时间", leftEn: "Linear-Time", rightEn: "Flexible-Time" }
  };

  const highlights = topDims.map(({ dimId, score }) => {
    const meta = dimNames[dimId];
    const sideZh = score < 5.5 ? meta.leftZh : meta.rightZh;
    const sideEn = score < 5.5 ? meta.leftEn : meta.rightEn;
    const descZh = `在此维度得分 ${score}/10，表明该国职场高度偏向‘${sideZh}’。高管在与其打交道时，需要灵活调适节奏，多用该国惯用的语境推进商务沟通。`;
    const descEn = `Scoring ${score}/10 on this axis highlights a strong tendency toward '${sideEn}'. Managers should adapt their expectations and match the local workflow parameters.`;

    return {
      dimensionId: dimId,
      title: isEn ? `${meta.en}: ${sideEn}` : `${meta.zh}：倾向 ${sideZh}`,
      text: isEn ? descEn : descZh
    };
  });

  // Synthesize an executive summary
  const extremeLeading = scores["leading"] || 5.5;
  const extremeTrusting = scores["trusting"] || 5.5;
  const extremeCommunicating = scores["communicating"] || 5.5;

  let summaryZh = `综上所述，该国职场呈现出一种独特的文化特征。在组织权力上偏向${extremeLeading > 5.5 ? "自上而下的层级集中化管理，下属极其敬畏主管意见" : "扁平宽松、崇尚平权，员工敢于越级或发表独立言论"}；在信任和社交关系上，他们偏重${extremeTrusting > 5.5 ? "深厚的人情纽带与长期私人感情沉淀，事情能否做成极度依赖关系信任账户" : "理性的任务交付，注重合同边界，无需浪费过多的私人应酬"}。跨国高管应结合其在沟通上${extremeCommunicating > 5.5 ? "高度含蓄、顾及面子" : "直球对决、不拖泥带水"}的鲜明特质，做有针对性的治理方案设计。`;
  let summaryEn = `In summary, this country displays a highly unique cultural profile. Power structures tend to be ${extremeLeading > 5.5 ? "strongly hierarchical with deep paternalistic respect" : "flat and egalitarian, empowering employees to speak out independently"}. Trust is constructed primarily around ${extremeTrusting > 5.5 ? "deep, long-term personal relationships and warm emotional connections" : "rigorous task delivery, explicit contracts, and professional integrity"}. Outbound executives should carefully balance this with their ${extremeCommunicating > 5.5 ? "implicit, high-context" : "direct, explicit"} communication norms.`;

  return {
    executiveSummary: isEn ? summaryEn : summaryZh,
    highlights
  };
}
