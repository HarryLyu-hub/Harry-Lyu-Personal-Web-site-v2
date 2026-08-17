export interface TranslationMap {
  brandTitle: string;
  brandSubtitle: string;
  badgeModel: string;
  langToggle: string;
  studentPortal: string;
  studentLogin: string;
  studentID: string;
  studentIDPlace: string;
  studentLoginBtn: string;
  studentCancel: string;
  studentWelcome: string;
  studentLogout: string;
  isRegistered: string;
  anonymousMode: string;
  
  // Tabs
  tabAbout: string;
  tabBook: string;
  tabVideos: string;
  tabWorkshops: string;
  tabTool: string;
  tabPricing: string;
  tabContact: string;

  // Cookie
  cookieText: string;
  cookieAccept: string;
  cookieDecline: string;

  // About Section
  aboutTitle: string;
  aboutSubtitle: string;
  trainerSubtitle: string;
  aboutBioPara1: string;
  aboutBioPara2: string;
  tagNegotiator: string;
  tagCXCoach: string;
  tagKeynote: string;
  aboutShowcase: string;
  aboutShowcaseSub: string;
  keynoteTopic: string;
  keynoteKeyPoints: string;
  keynotes: { title: string; desc: string; takeaway: string }[];
  awardsTitle: string;
  awardsList: string[];

  // Book Section
  bookSectionTitle: string;
  bookSectionSubtitle: string;
  bookDesc: string;
  bookChapterTitle: string;
  bookChapters: string[];
  bookActionHeader: string;
  bookFormName: string;
  bookFormAddress: string;
  bookFormEmail: string;
  bookFormPhone: string;
  bookFormDedication: string;
  bookFormSubmit: string;
  bookFormSuccess: string;

  // Education & Workshops Section
  workshopTitle: string;
  workshopSubtitle: string;
  cxTitle: string;
  cxDesc: string;
  cxSyllabus: string[];
  mapTitle: string;
  mapDesc: string;
  mapSyllabus: string[];
  durationLabel: string;
  formatLabel: string;
  audienceLabel: string;

  // Interactive Tools Section
  toolSectionTitle: string;
  toolSectionSubtitle: string;
  compareTitle: string;
  compareDesc: string;
  axisTitle: string;
  axisClickTip: string;
  axisLeft: string;
  axisRight: string;
  explainerTitle: string;
  explainerTip: string;
  caseTitle: string;
  caseDesc: string;
  caseBtnAnalyze: string;
  caseAnalyzing: string;
  sandboxTitle: string;
  sandboxDesc: string;
  sandboxInputTitle: string;
  sandboxInputDesc: string;
  sandboxBtnSubmit: string;
  sandboxClear: string;
  pastClinics: string;

  // Contact Section
  contactTitle: string;
  contactSubtitle: string;
  contactDirectMail: string;
  contactDirectPhone: string;
  contactFormHeadline: string;
  contactFormName: string;
  contactFormEmail: string;
  contactFormPhone: string;
  contactFormCompany: string;
  contactFormRole: string;
  contactFormNotes: string;
  contactFormConsent: string;
  contactFormSubmit: string;
  contactSuccess: string;
}

export const t: { zh: TranslationMap; en: TranslationMap } = {
  zh: {
    brandTitle: "吕华（展佳俊业工作室） Harry Lyu",
    brandSubtitle: "环球出海商业顾问 · 跨文化工作坊主训导师",
    badgeModel: "文化大地图模型",
    langToggle: "English / 英文",
    studentPortal: "学子专区",
    studentLogin: "卓越出海班学员登录",
    studentID: "邮箱 / 学员账号 ID",
    studentIDPlace: "请输入您的企业邮箱或学员 ID",
    studentLoginBtn: "认证登录",
    studentCancel: "返回",
    studentWelcome: "您好，出海研习生",
    studentLogout: "安全退出",
    isRegistered: "终身研学护航会员(VIP)",
    anonymousMode: "无痕访客模式",
    
    tabAbout: "关于吕华",
    tabBook: "书籍专著",
    tabVideos: "学员视频课件",
    tabWorkshops: "培训中心",
    tabTool: "工具",
    tabPricing: "订阅与联系",
    tabContact: "定制咨询/联系",

    cookieText: "我们十分看重您的隐私。本应用使用 LocalStorage 和安全 Cookie 记录学员偏好、自主沙盒案例和学习进度。根据 GDPR 合规要求，您可以选择同意或拒绝存储行为。如果拒绝，系统将不记录任何持久化信息，并自动切换为纯内存沙盒模式。",
    cookieAccept: "同意全部并授权持久化",
    cookieDecline: "拒绝并开启严格匿名",

    aboutTitle: "出海服务专家",
    aboutSubtitle: "跨文化敏捷组织学、大B端战略整合与核心CX(客户体验)专家",
    trainerSubtitle: "实战派服务出海专家，引领多个头部企业客户体验系统全球落地，涉及新能源，手机，互联网金融以及家电等热点出海行业",
    aboutBioPara1: "吕华(Harry Lyu) ，计算机应用专业，毕业于西安电子科技大学。现任国内头部出海跨国运营商NXAI（牛信云）公司副总裁，印尼呼叫中心协会（ICCA）国际评委，著有《出海制胜：六步打造卓越客户体验》等行业专著，担任CCSO认证讲师以及《客户观察》副主编。",
    aboutBioPara2: "作为拥有20年呼叫中心与全球客户体验管理经验的资深专家，他曾长期服务于世界500强企业NTT（7年）及AVAYA（13年），历任跨国运营商客户体验与员工体验部总监、大中华区专业服务部总监等核心要职。他自2017年起致力于中企海外客服中心的全球化建设，从全球视角融合多年跨国经历、整合全球资源，主导了汽车制造、智能硬件、跨境零售及金融科技等领域多家头部机构的出海通讯与客户服务架构。他坚持“诚信、专注、创新”理念，帮助出海企业实现全球布局、技术赋能与持续优化，为迈向全球化的从业者输出极具实操价值的策略与方法论。",
    tagNegotiator: "国际文化谈判专家",
    tagCXCoach: "全球体验(CX)重塑督导",
    tagKeynote: "顶级大会 Keynote 演讲人",
    aboutShowcase: "顶级峰会参与和分享",
    aboutShowcaseSub: "Harry 常驻大会的热门授课主题与核心课件结构，点击主题预览要点",
    keynoteTopic: "主题",
    keynoteKeyPoints: "核心大纲与课程交付亮点",
    keynotes: [
      {
        title: "GITEX Asia 分享和交流",
        desc: "吕华先生作为NXAI（NXLink）全球GTM副总裁赴新加坡出席2026年GITEX Asia亚洲科技博览会。针对如何使用智能客服大模型打通南亚、中东和欧洲业务展开高规格深度解析，为30余家客商与跨国中外企业现场分享。文字可基于AI文本做深度特色洞见总结！",
        takeaway: "AI时代的全球化不仅是系统出海，更是借敏捷大模型重构异层文化用户的无延迟沟通。打字无声、AI辅助是精算本地化性价比的王道利器。"
      },
      {
        title: "印尼ICCA 年度客户体验创新国际评审",
        desc: "吕华担任2025、2026年印尼国家呼叫中心协会（ICCA）年度大奖国际常任评委，并在峰会发表主旨演讲。深度揭露东南亚地区因强烈的面子妥协文化带来的“微笑隐瞒、报喜不抱忧”管理盲区，并传授智能情感词云监测体系在业务合规风险及催收等场景中的破壁实操。",
        takeaway: "绝不动用低语境的字面白字去僵化理解高语境印尼子公司的汇报进度。巧借AI情感检测工具，才能打破长链微笑黑盒。"
      },
      {
        title: "《第九届中国客户服务节全球化论坛：出海扬帆智能化，社媒巧织客情网》",
        desc: "在2025年全球化浪潮下的跨境服务新机遇主题论坛上，吕华先生全面剖析了中企出海重组全渠道客户体验中枢（CX Hub）的黄金配比。系统展示如何精妙编排社媒（WhatsApp等）流量通道并深度融合数字化，使中企摆脱纯体力的人头呼叫成本陷阱。",
        takeaway: "数字社交及AI多渠道时代的海外客户体验绝非单纯成本耗散中心，而是流量资产二次裂变的重要触点。精心编排每一来话，皆是曝光与信任的绝佳契机。"
      }
    ],
    awardsTitle: "国际裁判经历、学术荣誉与行业影响力资质",
    awardsList: [
      "受邀担任印尼客户体验协会 (ICCA) 国家级呼叫中心大奖 (TBCCI) 国际常任评委",
      "受邀担任中国计算机用户协会客户关系分会 (CCCS) 理事，推动跨境多渠道客户体验标准建设与服务认证",
      "受邀担任《客户观察》杂志副主编，深度主理中企全球化出海专题栏目",
      "受邀担任新商业数字化高管成长平台“三节课”(Sanjieke) 签约认证大咖导师，赋能中高层出海数字管理实力成长",
      "著有《出海制胜：六步打造卓越客户体验》等重量级跨国管理实践书籍"
    ],

    bookSectionTitle: "《出海制胜：六步打造卓越客户体验》",
    bookSectionSubtitle: "全渠道首发的中国高管海外破茧指南 ―― 重磅作者亲签签名版限量抢兑",
    bookDesc: "本书是吕华先生结合 20 年全球客户体验与多国跨国运营实战经验，专为中国出海企业重磅打造的卓越交付指南。全书围绕极具场景落地价值的“出海 CX 六步导航模型”，系统化、全景式剖析数据合规生命线、全球交付路线图、海外呼叫中心 BPO 外包选址与 KPI 体系、AI+AR 科技降本引擎、异国包容用工与本地化员工体验（EX）保留，以及 WhatsApp+AI 客户体验私域增长等核心策略。为您提供随行即用的行动指引与避雷针，助建可持续、高效能的全球化服务航道。",
    bookChapterTitle: "《出海制胜》标志性六步核心章节导览",
    bookChapters: [
      "第一步：“数据合规”是出海巨轮的锚 —— 详解行业全景图、合规生命线、CX场景合规及降本平衡术",
      "第二步：“路线图思维”是指引出海巨轮的灯塔 —— 1至4级架构里程碑、技术选型避坑指南及财务精算",
      "第三步：优秀的合作伙伴如同出海巨轮上的好水手 —— 掌握敏捷KPI罗盘、中外运营三大断层治理与BPO选址雷达",
      "第四步：出海巨轮的引擎是技术 —— “慢即快”全球邮电通航法则及AI+AR战力实战案例解密",
      "第五步：好的员工体验是出海巨轮的水手福祉 —— 解锁服务利润链引擎、多国总经理实战应对极客合散",
      "第六步：客户体验是出海巨轮的续航之本 —— 公域私域WhatsApp+AI体验获客体系与大流量进化共生论"
    ],
    bookActionHeader: "企业通道：申领作者亲笔签名特惠版",
    bookFormName: "联系人姓名",
    bookFormAddress: "纸质书邮寄地址 (省、市、区/县、具体街道及手机)",
    bookFormEmail: "企业注册邮箱 (后续配送通知与教学教案打包随附)",
    bookFormPhone: "联络手机",
    bookFormDedication: "专属签名赠言/特制抬头 (例: '赠 极致出海技术团队')",
    bookFormSubmit: "立即预定一册亲签本 ($19.9 / 纸质到付)",
    bookFormSuccess: "🎉 预定成功！出海研讨工坊秘书处已经登记您的专属名额。配送追踪单及随书跨国协作行动手册电子档已成功下发至您的【学子中心 - 站内信箱】。请在配送人到付时支付基础邮资（符合本地数据保存协议）。",

    workshopTitle: "核心高管培训课程与战略工坊",
    workshopSubtitle: "摒弃泛泛而谈的学术教条，让高管、留学生和MBA带着即时可用的战略成果离场",
    cxTitle: "第一支柱：客户体验(CX)重塑与全球化出海交付",
    cxDesc: "探讨在将出海业务从中国极速‘物理外溢’到海外的过程，由于服务高/低语境错位、社会身份阶层差异造成的NPS暴跌。通过分层解耦(如沙特本地语音+埃及低价开罗文字)、去语境看板实时监控，构建精益客户感知防线。",
    cxSyllabus: [
      "中式情感/诉苦型服务与海外任务契约型期望撞击解密",
      "高语境下对极致面子尊重的客诉高感控制与解法",
      "利用Bahasa情绪声调词云AI看板打破‘温和粉饰隐瞒’",
      "出海跨国VIP客情管理的 1对1 局部高身位对等防线"
    ],
    mapTitle: "第二支柱：出海敏捷组织文化大地图与演训",
    mapDesc: "基于 Erin Meyer 的 INSEAD 8轴模型。全面定量剖析多国骨干在协作时相对距离。训练如何卡位多边会议话语权、如何与原理优先的欧洲及印系老板做 Good Order 邮件审批，如何保护规避冲突文化底下的面子又不延误死线。",
    mapSyllabus: [
      "八个维度的中西方相对距离落差测算实操",
      "印度原理优先(Principles-First)邮件文书逆袭写作法",
      "德法‘对事不对人’Brutal反馈防御护具心态建立",
      "多国异议轴心公开对攻卡位与头脑风暴破局"
    ],
    durationLabel: "总时长 / Duration",
    formatLabel: "形式 / Format",
    audienceLabel: "适用受众 / Target Audience",

    toolSectionTitle: "文化地图 - 国家视角",
    toolSectionSubtitle: "量化多边贸易差，诊治企业出海痛点。支持大模型动态演习与离线对位分析。",
    compareTitle: "文化尺度 - 多国对比",
    compareDesc: "勾选参与项目的多国代表（支持多达4个，不同颜色代表），计算各个行为维度落差：",
    axisTitle: "行为考核尺度轴",
    axisClickTip: "💡 点击任意维度条可解锁右侧详细解读与双向破局良方",
    axisLeft: "◀ 偏左坐标",
    axisRight: "偏右坐标 ▶",
    explainerTitle: "维度深度剖析",
    explainerTip: "在上方选取要看通透的行为维度线，即可在此获取极高商业价值的跨国管理药方。",
    caseTitle: "经典案例解析厅",
    caseDesc: "这 8 部来自培训大纲的真实跨国折戟案例。点击一窥 Harry 先生是如何在大模型或本地对位学中给出精准处方的：",
    caseBtnAnalyze: "一键启动深度跨国研判 (支持 Gemini 实时诊断)",
    caseAnalyzing: "专家会诊引擎正在研判真实情节，预计耗时2秒...",
    sandboxTitle: "学生案例临床会诊 (Sandbox Clinic)",
    sandboxDesc: "您自己、企业或学研过程中发生过什么真实的跨国误解？直接递交给研判沙盒。支持结合双方分值计算，定制您可随之行动的良方：",
    sandboxInputTitle: "冲突标题 / 情节定位",
    sandboxInputDesc: "描述具体经过（比如：德国客户连续三次说‘不行’并直斥数据乱、印尼伙伴老是微笑点头但到期没做完等）",
    sandboxBtnSubmit: "提交大模型研判 / 离线备份诊断",
    sandboxClear: "清空历史",
    pastClinics: "工作室讨论案例库",

    contactTitle: "预约高管工坊与定制出海方案学",
    contactSubtitle: "为高潜力成长型中企和跨国名校商学院提供高水准实干课程。我们在遵守GDPR安全协议和您的Cookie首肯下，保护您的商洽申请。",
    contactDirectMail: "官方电子邮箱",
    contactDirectPhone: "主训秘书处热线",
    contactFormHeadline: "定制/商洽贵宾申请通道",
    contactFormName: "申请人贵姓/称呼",
    contactFormEmail: "商务电子邮件",
    contactFormPhone: "联络话务手机",
    contactFormCompany: "供职单位/企业名称",
    contactFormRole: "供职职位 / MBA所在班级",
    contactFormNotes: "诉求与出海协作卡点 (例如：想安排20名总监的闭门文化工坊、希望获取定制化CX诊查等)",
    contactFormConsent: "我同意 GDPR 数据安全及 Cookie 同意协议，并允许将数据安全地缓存于研习室终端。",
    contactFormSubmit: "立即发送定制讲学申请 (秘书处2小时内专人反馈)",
    contactSuccess: "🎉 申请提交成功！主训教师 吕华 的秘书处已在系统仪表盘成功收到了您的战略协作预约。我们将于2小时内为您在系统【学子中心 - 站内信箱】下发正式的《出海内参包》并接洽日程安排。请点击右上角登录/注册并留意站内信通知，安全合规无痕机制已生效。"
  },
  en: {
    brandTitle: "Harry Lyu",
    brandSubtitle: "Global Expansion Consultant & Cross-Cultural Main Trainer",
    badgeModel: "Culture Map Framework",
    langToggle: "中文 / Chinese Version",
    studentPortal: "Student Center",
    studentLogin: "Going Global Masterclass Auth",
    studentID: "Email / Student Access ID",
    studentIDPlace: "Enter your corporate email or student access ID",
    studentLoginBtn: "Authenticate Portal",
    studentCancel: "Go Back",
    studentWelcome: "Welcome back, Global Trainee",
    studentLogout: "Secure Logout",
    isRegistered: "Lifetime Learning VIP Member",
    anonymousMode: "Strict Incognito Visitor Mode",

    tabAbout: "About Harry Lyu",
    tabBook: "Books & Monographs",
    tabVideos: "Course Videos",
    tabWorkshops: "Training Center",
    tabTool: "Tool",
    tabPricing: "Subscriptions & Contact",
    tabContact: "Contact & Booking",

    cookieText: "We deeply appreciate your privacy. This application leverages clean LocalStorage and local state to cache your study progress, sandbox designs, and contact forms. Under GDPR compliance, you can elect to Accept or Decline storage cookies. If declined, no tracker tokens or cookies will be retained, and custom cases will solely run in transient browser memory.",
    cookieAccept: "Accept All & Allow Save",
    cookieDecline: "Decline & Run Anonymously",

    aboutTitle: "Global Outbound Service Expert",
    aboutSubtitle: "Expert in Cross-Cultural Agile Organizations, Enterprise Architecture Alignment, and Customer Experience (CX)",
    trainerSubtitle: "Hands-on global expansion service expert, leading global CX system deployment for multiple industry leaders across hot sectors: new energy, mobile, fintech, and smart home appliances.",
    aboutBioPara1: "Harry Lyu, majoring in Computer Applications from Xidian University, currently serves as Vice President of NXAI, a leading multinational outbound operator, and an international judge for the Indonesian Cloud Contact Center Association (ICCA). Author of 'Winning Overseas: Six Steps to Build an Outstanding Customer Experience', Harry is a 20-year veteran in contact centers and global customer experience (CX) management. He spent 7 years at Fortune 500 NTT and 13 years at AVAYA respectively, serving in key executive roles including Director of CX & EX and Greater China Professional Services Director.",
    aboutBioPara2: "An accredited CCSO instructor and Deputy Editor of the 'Customer Observation' journal, Harry has dedicated himself since 2017 to the global capacity building of outbound customer service centers for Chinese enterprises. He possesses extensive practical experience orchestrating overseas communications and service frameworks for leading automotive manufacturers, smartphone brands, and fintech giants. Driven by details and strategic alignment, Harry assists globalizing businesses in deep analysis, local compliance, and technological innovation to guide robust outbound growth.",
    tagNegotiator: "Intl Cultural Negotiator",
    tagCXCoach: "Global CX Redesign Consultant",
    tagKeynote: "Top-Tier Conference Keynote",
    aboutShowcase: "Keynote Speeches & Lecture Slides",
    aboutShowcaseSub: "Harry's most requested training seminars and presentation structures. Click to inspect core takeaways.",
    keynoteTopic: "Seminar Topic",
    keynoteKeyPoints: "Syllabus Structure & High-End Takeaways",
    keynotes: [
      {
        title: "From Singapore to the World: Agile Re-Architecting of Global Customer Experience (CX) with Large AI Models",
        desc: "Harry Lyu attended GITEX Asia 2026 in Singapore as the global Vice President of NXAI, demonstrating how innovative intelligence communication frameworks seamlessly resolve structural CX frictions for multi-national players across Southeast Asia, Europe, and Africa.",
        takeaway: "AI-driven globalization is not just deploying software; it's using intelligent machinery to establish frictionless connections with local users."
      },
      {
        title: "Indonesia TBCCI National Summit: The Smile Blackbox & High-stakes AI Sentiment Monitoring",
        desc: "Serving as a permanent international judge for ICCA Indonesia (2025/2026) and a standout keynote speaker, Harry dissects why eastern high-context 'avoidance of conflict' gets mistranslated as a perfect progress report, while sharing real-world solutions through AI sentiment analysis.",
        takeaway: "Never read high-context verbal agreements at face value. De-contextualize critical tracking data with AI models to resolve hidden multi-tier administrative friction."
      },
      {
        title: "The 9th China Customer Service Festival: Outbound Journeys & Orchestrating Global Social Commerce Experience",
        desc: "At the 2025 Cross-Border Service Opportunities Forum, Harry dissected the golden allocation ratio of outbound contact centers, showing how to engineer high-velocity social-messaging (WhatsApp, etc.) pipelines to secure massive cost and retention advantages.",
        takeaway: "Global customer service in the digital channel era is no longer a cost sink but a powerful secondary engine for traffic and organic virality."
      }
    ],
    awardsTitle: "International Credentials, Judging Roles & System Accreditations",
    awardsList: [
      "International Permanent Judge & Expert Mentor for Indonesia Contact Center Association (ICCA) National Awards",
      "Council Member of the Customer Relation Branch of China Computer Users Association (CCCS), driving standardizations",
      "Deputy Editor-in-Chief of 'Customer Observation' Magazine, directing the exclusive Outbound Global CX Column",
      "Certified Executive Mentor & Outbound SME for 'Sanjieke', China's premier digital business school, empowering elite international leaders",
      "Author of prestigious global management bestseller 'Winning Overseas: Six Steps to Build an Outstanding Customer Experience'"
    ],

    bookSectionTitle: "Winning Overseas: Six Steps to Build an Outstanding Customer Experience",
    bookSectionSubtitle: "The Ultimate Practical Guide for Outbound Executives — Reserve a Signed Copy Online",
    bookDesc: "Combining 20 years of global customer experience (CX) and multinational operation excellence, this book is Harry Lyu's signature practical guide for Chinese companies going global. Culturally and strategically anchored around the high-impact '6-Step CX Navigator Model,' it systematically covers global data compliance (GDPR/PDPL), international delivery roadmaps, offshore BPO supplier selections, AI+AR remote tech weapons, local employee experience (EX) retention, and LTV-driven WhatsApp+AI private-domain loops. Ditch the academic handbooks and acquire plug-and-play local operational execution plans.",
    bookChapterTitle: "Signature Chapters to Explore",
    bookChapters: [
      "Step 1: Outbound Data Compliance as the Anchor — Strategic Mapping, Legal Boundaries, CX Security, and Delivery Siting",
      "Step 2: Roadmap Thinking as the Lighthouse — Timeline Scales, Technical Milestone Indicators, and Multi-Zone Infrastructures",
      "Step 3: Great Partners as Skilled Sailors — KPI Calibration, Bridging Operational Disconnections, and Global BPO Selectors",
      "Step 4: Technology as the Outbound Propulsion — The 'Slow is Fast' Law of Global Communication, and AI+AR Remote Weapons",
      "Step 5: Good Employee Experience (EX) as Sailor Welfare — Decoding the Service-Profit Chain, Regional Autonomies, and Staff Attrition Traps",
      "Step 6: Customer Experience (CX) as Outbound Fuel — Double-Wheel Growth Engines, WhatsApp+AI Retargeting, and Long-Term Ecosystems"
    ],
    bookActionHeader: "Corporate VIP Lane: Order Author-Signed Hardcopy",
    bookFormName: "Full Name",
    bookFormAddress: "Detailed Mail Address (Street, City, Zip, Phone)",
    bookFormEmail: "Corporate Email (For delivery notice and digital syllabus download)",
    bookFormPhone: "Contact Phone Number",
    bookFormDedication: "Custom Dedication (e.g. 'To the Global Tech Architecture Team')",
    bookFormSubmit: "Reserve Signed Copy ($19.9 / Delivery Pay)",
    bookFormSuccess: "🎉 Pre-order recorded! The workshop secretary has reserved your exclusive copy. A tracking code and digital Cross-Border Execution Booklet have been dispatched to your in-site mailbox and personal center notification feed. Please pay the postage on safe arrival, keeping with our GDPR consent parameters.",

    workshopTitle: "Executive Masterclasses & Master Workshops",
    workshopSubtitle: "Eradicate generic academic theories. Ensure your executives and advanced students leave with robust, plug-and-play outputs.",
    cxTitle: "Pillar A: Customer Experience (CX) Design for Global Outbound",
    cxDesc: "Analyzing severe NPS drops when moving service layouts overseas. Learn to manage conflicting communication context differences and hierarchy expectations by weaponizing layered voice-text segregation, AI-driven voice tonality charts, and emotional buffer zones.",
    cxSyllabus: [
      "Decoding APAC emotion/working-hard narratives vs Western task expectations",
      "High-context customer escalations & face preservation buffers in the Middle East",
      "Breaking polite Indonesian cover-ups with objective AI word-cloud triggers",
      "1-on-1 equal dignity strategies for premium executive clients overseas"
    ],
    mapTitle: "Pillar B: Cross-Cultural Scrum & The Agile Outbound Map",
    mapDesc: "Deep quantitative assessment of team alignment modeled after Erin Meyer's INSEAD research. Focus on pitching control in Anglo-Saxon boards, principles-first business writing for European/Indian executives, and ensuring deadlines align while keeping faces safe.",
    mapSyllabus: [
      "Eight-dimensional relative distance plotting and calculations in practice",
      "Principles-First (inductive) email modeling to expedite C-suite approvals",
      "Brutal feedback armor: Surviving direct Western evaluations with zero ego-depletion",
      "Vocal pitching and brainstorming alignment across opposing confrontational lines"
    ],
    durationLabel: "Duration",
    formatLabel: "Format",
    audienceLabel: "Target Audience",

    toolSectionTitle: "Culture Map - Country Perspective",
    toolSectionSubtitle: "Quantify absolute cultural variance, pinpoint project bottlenecks, and run Gemini AI diagnosis or offline-proof clinical advice.",
    compareTitle: "Culture Scales - Country Comparison",
    compareDesc: "Toggle countries for your venture (displays up to 4). Measure the horizontal distance across key leadership parameters below:",
    axisTitle: "The Eight Cultural Scales",
    axisClickTip: "💡 Click on any scale bar to prompt the C-suite action plan and bilateral adjustments on the right",
    axisLeft: "◀ Left Anchor",
    axisRight: "Right Anchor ▶",
    explainerTitle: "Dimension Deep Dive",
    explainerTip: "Select any dimension above to display its corresponding elite executive battle medicine and action plan.",
    caseTitle: "The Seminar Case Study Gallery",
    caseDesc: "Review these 8 high-stakes real case files harvested from Harry's executive seminars. Click to run the Gemini AI model or static scholarly check:",
    caseBtnAnalyze: "Launch Professional Analysis (Gemini 3.5 live diagnosis)",
    caseAnalyzing: "Analyzing case dynamics... Generating strategic prescriptions (approx 2s)...",
    sandboxTitle: "The Outbound Sandbox Clinic",
    sandboxDesc: "Encountered a perplexing cross-border deadlock or misaligned client action? Input the parameters here to chart relative scores and custom prescriptions:",
    sandboxInputTitle: "Brief Case Title / Project Region",
    sandboxInputDesc: "Narrate specific incidents (e.g., German CTO rejecting drafts directly, Brazilian team skipping stand-ups, Indian client bypassing hierarchy to email executives, etc.)",
    sandboxBtnSubmit: "Invoke AI Diagnosis / Offline Prescriptions",
    sandboxClear: "Reset Records",
    pastClinics: "Historical Case Archive & Diagnosis Logs",

    contactTitle: "Inquire About Executive Workshops & Strategy Alignments",
    contactSubtitle: "Providing top-tier commercial training and academic sessions for high-growth tech firms and elite business schools, strictly guarded under GDPR rules.",
    contactDirectMail: "Official Inquiries",
    contactDirectPhone: "Workshop Hotline",
    contactFormHeadline: "Corporate Custom Workshop Application",
    contactFormName: "Full Name",
    contactFormEmail: "Professional Email",
    contactFormPhone: "Direct Phone Number",
    contactFormCompany: "Corporate Entity / Sponsor Institution",
    contactFormRole: "Your Corporate Title / MBA Cohort",
    contactFormNotes: "Project Pain points & Corporate Needs (e.g. Require a 20-person closed-door CX workshop, seek custom digital audits, etc.)",
    contactFormConsent: "I agree to GDPR data guidelines and allow secure preference local storage.",
    contactFormSubmit: "Submit Strategy Request (Secretary responds within 2 hours)",
    contactSuccess: "🎉 Request submitted! Main trainer Harry Lyu's secretary has received your brief on the workspace dashboard. A curated 'Outbound Expansion Strategic Pack' and schedule options will be sent directly to your In-site mailbox in the Student Center within 2 hours. Please log in or sign up to check."
  }
};
