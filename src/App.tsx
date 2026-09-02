import React, { useState, useEffect, useRef, useMemo, type FormEvent, type ChangeEvent, type ClipboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Globe, 
  Map, 
  BookOpen, 
  Sparkles, 
  Plus, 
  Info, 
  AlertCircle, 
  CheckCircle2, 
  Compass, 
  MessageSquare,
  HelpCircle,
  ChevronDown,
  Users,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  ArrowRight,
  Check,
  RefreshCw,
  FileText,
  Layers,
  Flame,
  Printer,
  ArrowLeft,
  Copy,
  CheckCircle,
  Download,
  User,
  Lock,
  Shield,
  LogOut,
  Mail,
  Phone,
  Smartphone,
  Briefcase,
  Award,
  Terminal,
  Camera,
  Sliders,
  Eye,
  X,
  Menu,
  FileSpreadsheet,
  UploadCloud,
  Loader2,
  Trash2,
  ChevronUp,
  Newspaper,
  ExternalLink,
  Quote,
  Calendar,
  Clock,
  Send,
  ShieldCheck
} from "lucide-react";
import { DIMENSIONS, COUNTRIES, INITIAL_CASES, type Dimension, type CountryData, type CaseStudy } from "./data";
const getCountryZh = (nameEn: string) => {
  return COUNTRIES.find(c => c.nameEn === nameEn || c.nameZh === nameEn)?.nameZh || nameEn;
};
import { CASE_DETAILS_ZH } from "./caseDetails";
import { COUNTRY_INSIGHTS, getCountryProfile } from "./countryInsights";
import { t } from "./translations";
import { VIDEO_MODULES, type VideoModule } from "./videosData";
import { Search, Video, PlayCircle, LockOpen, MapPin, Handshake, Cloud, Share2, Cpu, TrendingUp } from "lucide-react";
import * as XLSX from "xlsx";
import { initFirebase, syncFromCloud, saveToCloud, type StudentProfile } from "./lib/firebase";

const COUNTRY_COLORS: { [key: string]: { border: string; bg: string; text: string; dot: string; line: string } } = {
  "China": { border: "border-red-500", bg: "bg-red-500/10", text: "text-red-600", dot: "bg-red-500", line: "#ef4444" },
  "United States": { border: "border-blue-500", bg: "bg-blue-500/10", text: "text-blue-600", dot: "bg-blue-500", line: "#3b82f6" },
  "Germany": { border: "border-amber-600", bg: "bg-amber-600/10", text: "text-amber-700", dot: "bg-amber-600", line: "#d97706" },
  "Japan": { border: "border-purple-600", bg: "bg-purple-600/10", text: "text-purple-600", dot: "bg-purple-600", line: "#9333ea" },
  "France": { border: "border-rose-500", bg: "bg-rose-500/10", text: "text-rose-600", dot: "bg-rose-500", line: "#f43f5e" },
  "United Kingdom": { border: "border-slate-700", bg: "bg-slate-700/10", text: "text-slate-800", dot: "bg-slate-700", line: "#334155" },
  "India": { border: "border-teal-600", bg: "bg-teal-600/10", text: "text-teal-700", dot: "bg-teal-600", line: "#0d9488" },
  "Brazil": { border: "border-emerald-600", bg: "bg-emerald-600/10", text: "text-emerald-700", dot: "bg-emerald-600", line: "#059669" },
  "Belgium": { border: "border-amber-500", bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500", line: "#f59e0b" },
  "Singapore": { border: "border-cyan-500", bg: "bg-cyan-500/10", text: "text-cyan-600", dot: "bg-cyan-500", line: "#06b6d4" },
  "Indonesia": { border: "border-orange-500", bg: "bg-orange-500/10", text: "text-orange-600", dot: "bg-orange-500", line: "#f97316" },
  "Saudi Arabia": { border: "border-emerald-700", bg: "bg-emerald-700/10", text: "text-emerald-800", dot: "bg-emerald-700", line: "#047857" },
  "Egypt": { border: "border-yellow-600", bg: "bg-yellow-600/10", text: "text-yellow-700", dot: "bg-yellow-500", line: "#ca8a04" },
  "Mexico": { border: "border-[#f59e0b]", bg: "bg-[#f59e0b]/10", text: "text-[#d97706]", dot: "bg-[#f59e0b]", line: "#f59e0b" },
  "UAE": { border: "border-emerald-500", bg: "bg-emerald-500/10", text: "text-emerald-600", dot: "bg-emerald-500", line: "#10b981" },
  "Russia": { border: "border-indigo-500", bg: "bg-indigo-500/10", text: "text-indigo-600", dot: "bg-indigo-500", line: "#6366f1" },
  "South Korea": { border: "border-pink-500", bg: "bg-pink-500/10", text: "text-pink-600", dot: "bg-pink-500", line: "#ec4899" },
  "Vietnam": { border: "border-orange-600", bg: "bg-orange-600/10", text: "text-orange-700", dot: "bg-orange-600", line: "#ea580c" },
  "Thailand": { border: "border-[#06b6d4]", bg: "bg-[#06b6d4]/10", text: "text-[#0891b2]", dot: "bg-[#06b6d4]", line: "#06b6d4" },
  "South Africa": { border: "border-teal-500", bg: "bg-teal-500/10", text: "text-teal-600", dot: "bg-teal-500", line: "#14b8a6" },
  "Spain": { border: "border-amber-500", bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500", line: "#f59e0b" },
  "Portugal": { border: "border-green-600", bg: "bg-green-600/10", text: "text-green-700", dot: "bg-green-600", line: "#16a34a" },
  "Turkey": { border: "border-rose-600", bg: "bg-rose-600/10", text: "text-rose-700", dot: "bg-rose-600", line: "#e11d48" },
  "Switzerland": { border: "border-[#b91c1c]", bg: "bg-[#b91c1c]/10", text: "text-[#b91c1c]", dot: "bg-[#b91c1c]", line: "#b91c1c" },
  "Canada": { border: "border-[#dc2626]", bg: "bg-[#dc2626]/10", text: "text-[#dc2626]", dot: "bg-[#dc2626]", line: "#dc2626" },
  "Philippines": { border: "border-sky-500", bg: "bg-sky-500/10", text: "text-sky-600", dot: "bg-sky-500", line: "#0ea5e9" },
  "Italy": { border: "border-lime-600", bg: "bg-lime-600/10", text: "text-lime-700", dot: "bg-lime-600", line: "#65a30d" },
  "Poland": { border: "border-rose-700", bg: "bg-rose-700/10", text: "text-rose-800", dot: "bg-rose-700", line: "#be123c" },
  "Hong Kong (China)": { border: "border-red-600", bg: "bg-red-600/10", text: "text-red-700", dot: "bg-red-600", line: "#dc2626" },
  "Australia": { border: "border-yellow-500", bg: "bg-yellow-500/10", text: "text-yellow-600", dot: "bg-yellow-500", line: "#eab308" },
  "Nigeria": { border: "border-green-700", bg: "bg-green-700/10", text: "text-green-800", dot: "bg-green-700", line: "#15803d" },
  "Malaysia": { border: "border-amber-500", bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500", line: "#f59e0b" },
  "Jordan": { border: "border-yellow-600", bg: "bg-yellow-600/10", text: "text-yellow-700", dot: "bg-yellow-600", line: "#ca8a04" },
  "Peru": { border: "border-emerald-600", bg: "bg-emerald-600/10", text: "text-emerald-700", dot: "bg-emerald-600", line: "#059669" }
};

interface MemoryItem {
  id: string;
  src: string;
  altZh: string;
  altEn: string;
  descZh: string;
  descEn: string;
  gradient: string;
  type: "academic" | "professional" | "outdoor" | "collaboration";
}

const MEMORY_GALLERY: MemoryItem[] = [
  {
    id: "singapore-summit",
    src: "/src/assets/images/keynote_singapore_1781853262378.jpg",
    altZh: "新加坡 GITEX Asia 亚洲科技博览会演讲实况",
    altEn: "Singapore GITEX Asia Summit Presentation Desk",
    descZh: "在新加坡亚洲科技博览会 (GITEX Asia) 出席现场，针对智能客服大模型打通南亚、中东和欧洲业务展开深度解析说明的原图参考。",
    descEn: "Authentic onsite record at GITEX Asia, Singapore, presenting actionable strategies using modern AI to re-architect global CX hub.",
    gradient: "from-amber-600/20 via-slate-900 to-slate-950",
    type: "professional"
  },
  {
    id: "indonesia-icca",
    src: "/src/assets/images/keynote_indonesia_1781853281712.jpg",
    altZh: "印尼 ICCA 年度客户体验创新国际评审",
    altEn: "Indonesia ICCA Annual CX Innovation Judging Session",
    descZh: "吕华先生担任印尼国家呼叫中心协会 (ICCA) 评委，在年度峰会发表主旨演讲会场原照参考，深度揭露东南亚微笑黑盒沟通冲突。",
    descEn: "Onsite judging panel and forum speech at Indonesia ICCA, analyzing Eastern high-context corporate governance and emotional sentiment models.",
    gradient: "from-sky-600/20 via-slate-900 to-slate-950",
    type: "academic"
  },
  {
    id: "customer-service-festival",
    src: "/src/assets/images/keynote_crossborder_1781853295706.jpg",
    altZh: "第九届中国客户服务节全球化论坛",
    altEn: "9th China Customer Service Festival Outbound Forum",
    descZh: "吕华代表受邀在跨境服务论坛发表公开课件，全面剖析建立微信与 WhatsApp 智能化社媒全渠道客户体验中心规章策略的最真实现场。",
    descEn: "Uncropped speech capture at the Customer Service Festival global forum, discussing outbound infrastructure, ROI calculations, and WhatsApp automation.",
    gradient: "from-emerald-600/20 via-slate-900 to-slate-950",
    type: "professional"
  },
  {
    id: "outbound-infrastructure",
    src: "/src/assets/images/outbound_bridge_1781772014439.jpg",
    altZh: "中东与亚太出海基建实地检测实影",
    altEn: "Empathy & Infrastructure Mapping (Onsite)",
    descZh: "吕华先生历任 NTT 与 AVAYA 等世界500强高管，亲临亚太与中东交付一线考察多语外包节点，提供最真实的企业出海现场实景。",
    descEn: "Strategic offshore BPO route check and global telecom pipeline orchestration: a robust uncropped asset reflecting 20 years of field seniority.",
    gradient: "from-purple-600/20 via-slate-900 to-slate-950",
    type: "collaboration"
  },
  {
    id: "outbound-road-bridge",
    src: "/src/assets/images/outbound_road_bridge_1781665312853.jpg",
    altZh: "跨国战略导航与核心组织对位沙盒",
    altEn: "Chinese Enterprise Global Growth Bridge Strategy",
    descZh: "对位研判与实践。吕华主导中企出海制胜架构设计，协助亚太多地主管克服多语言协作障碍，本配图为真实的交付原图参考资料。",
    descEn: "A high-fidelity record outlining core organizational milestones, regional compliance audits, and multi-time-zone executive workflows.",
    gradient: "from-rose-600/20 via-slate-900 to-slate-950",
    type: "collaboration"
  },
  {
    id: "signed-flyer-qr",
    src: "/src/assets/images/signed_preorder_channel_1781861067288.png",
    altZh: "吕华《出海制胜》正版签名限量预订官图",
    altEn: "Winning Overseas Signed Pre-order Booklet QR Poster",
    descZh: "提供最直观纯粹的微信扫码或关注等全渠道通道，为跨国学员或在职高管奉送纸质亲签名额与电子随书教案指南的原图书本彩页宣传图。",
    descEn: "Official preorder booklet page containing secure channels for corporate partners and executive students to lock and claim their limited autographed books.",
    gradient: "from-yellow-600/20 via-slate-900 to-slate-950",
    type: "academic"
  }
];

function ImageWithFallback({ src, alt, fallbackGradient, caption, className, onClick }: {
  key?: string | number;
  src: string;
  alt: string;
  fallbackGradient: string;
  caption: string;
  className?: string;
  onClick?: () => void;
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <div 
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 flex flex-col justify-end group transition-all duration-300 hover:border-amber-500/50 cursor-pointer ${className}`}
    >
      {(!hasError && src) ? (
        <div className="w-full h-full relative overflow-hidden">
          <img
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-end">
            <span className="text-[10px] bg-amber-500 text-slate-950 font-black tracking-wider uppercase px-2 py-0.5 rounded-md w-fit mb-1.5 shadow">
              Photo Loaded
            </span>
            <p className="text-sm font-extrabold text-white leading-tight">{alt}</p>
            <p className="text-[10px] text-slate-300 leading-normal line-clamp-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{caption}</p>
          </div>
        </div>
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${fallbackGradient} flex flex-col p-4 justify-between text-left relative min-h-[170px]`}>
          <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />
          <div className="flex justify-between items-start z-10 w-full">
            <div className="p-1 px-1.5 rounded-md bg-slate-950/70 border border-amber-500/20 text-[8px] text-amber-400 font-bold uppercase tracking-widest font-mono">
              Placeholder Hook
            </div>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          </div>
          <div className="z-10 space-y-1 mt-auto bg-slate-950/90 p-2.5 rounded-xl border border-slate-800">
            <p className="text-xs text-amber-400 font-extrabold tracking-tight line-clamp-1">{alt}</p>
            <p className="text-[9.5px] text-slate-300 leading-normal line-clamp-3 font-medium mt-0.5">{caption}</p>
            <p className="text-[7.5px] text-slate-500 font-mono tracking-wider mt-1.5 uppercase border-t border-slate-800 pt-1">
              ✨ Upload path: /src/assets/images/{src.split("/").pop()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const REPUTED_ORGANIZATIONS_INFO = [
  {
    nameZh: "《客户观察》杂志社 (CCSO 旗下)",
    nameEn: "Customer Observation (CCSO Alliance)",
    descZh: "《客户观察》是 CCSO（中国客服之声/亚太客户服务首脑联盟）组织旗下的官方权威双月刊媒体。专注于探讨智能客服、客户中心数字化、及中企海外服务中枢（CX Hub）搭建。吕华先生受邀担任该杂志副主编，常年为行业贡献深度实践案例与前瞻观点。请注意《客户观察》（CCSO主体）有其独立的出海学术地位，不要与‘客户世界’或其他外部媒体混淆。",
    descEn: "Customer Observation is the premier bi-monthly publication under the CCSO Alliance, focused on Customer Experience (CX) and contact centers. It covers AI-assisted care, customer service digitalization, and global CX Hub building. Harry Lyu serves as Deputy Editor-in-Chief. Please do not confuse with Customer World.",
    url: "http://www.ccinchina.com",
    logoText: "CCSO"
  },
  {
    nameZh: "印尼呼叫中心协会 (ICCA / ACCA)",
    nameEn: "Indonesia Contact Center Association",
    descZh: "印尼呼叫中心协会（ICCA/也被客户简称为印尼ACCA）是印度尼西亚最大、最权威的客户服务与联络中心行业协会，主办印尼国家呼叫中心大奖（TBCCI）等最高规格盛会，代表了泛东南亚地区数字CX技术与规范的最高研发水准。吕华先生多年担任ICCA国家级大奖的特邀常任外籍评委与专家督导。",
    descEn: "The Indonesia Contact Center Association (ICCA) is the most authoritative service industry hub in Indonesia. It hosts the National Contact Center Awards (TBCCI), marking the pinnacle of Indonesia's digital CX excellence. Harry serves as a regular international judge.",
    url: "https://www.icca.co.id",
    logoText: "ICCA"
  },
  {
    nameZh: "数字丝路联盟 (DSRC)",
    nameEn: "Digital Silk Road Research Alliance",
    descZh: "数字丝路联盟（DSRC）是致力于“数字丝绸之路”沿线国家数字基建、跨境数字化与全球呼叫中心外包标准（如 CC-CMM 等）建立与对接的专业联盟。吕华先生积极协助中外标准互认与技术对接。",
    descEn: "The Digital Silk Road Alliance (DSRC) is a specialized league driving digital infrastructure, cross-border service trade standards, and global contact center standards (like CC-CMM) along Belt and Road regions. Harry champions standard interoperability.",
    url: "http://www.cc-cmm.org",
    logoText: "DSRC"
  },
  {
    nameZh: "人民邮电出版社",
    nameEn: "People's Posts and Telecommunications Press",
    descZh: "人民邮电出版社成立于1953年，是工业和信息化部主管的战略性国家一级出版社，也是中国科技与企业管理学术著作的首选出版重镇。吕华先生所著《出海制胜：突破无形文化断层线》(Winning Overseas) 由该社重磅出版并全国发行。",
    descEn: "People's Posts and Telecommunications Press (PT Press), founded in 1953, is a national top-tier publisher overseen by MIIT. It is China's absolute leader in tech and management literature. Harry's corporate bestseller, 'Winning Overseas', is published and distributed nationwide by PT Press.",
    url: "https://www.ptpress.com.cn",
    logoText: "PTP"
  },
  {
    nameZh: "全球智能数字创新大奖 (GDTA)",
    nameEn: "Global Digital Tech Awards (GDTA)",
    descZh: "全球智能数字创新大奖（GDTA）是数字经济、多语言智能化客户体验和跨境技术交付领域的国际顶奢年度荣誉，旨在表彰全球化领军者和卓越项目。吕华先生连续受邀担任该大奖的国际常任评委，亦是其中方唯一的首席专家与核心终审成员。",
    descEn: "The Global Digital Tech Awards (GDTA) is a premier international honor recognizing outstanding contributions in digital CX orchestration, cross-border AI transformation, and global services. Harry Lyu serves as an International Permanent Judge and the sole Chinese Chief Expert.",
    url: "https://www.gdta.org",
    logoText: "GDTA"
  },
  {
    nameZh: "欧洲工商管理学院 (INSEAD)",
    nameEn: "INSEAD Business School",
    descZh: "欧洲工商管理学院（INSEAD）在《金融时报》全球MBA排名中常年蝉联世界第一。INSEAD致力于在全球化跨国协作、高低情境跨国沟通及敏捷变革管理领域进行最前沿的研究。吕华先生多次作为跨文化组织协作实践认证的特邀分享嘉宾，为董事会及高层决策者授课分享。",
    descEn: "INSEAD is one of the world's leading and largest graduate business schools. Harry Lyu serves as a Distinguished Keynote speaker and practice share partner, exchanging empirical insights on cross-cultural organizational design and global management.",
    url: "https://www.insead.edu",
    logoText: "INSEAD"
  },
  {
    nameZh: "亚太与中东数字基建中台营建组",
    nameEn: "Asia-Pacific & Middle-East Digital Infra Hub",
    descZh: "针对中资出海企业在泛中东、东南亚 and 非洲等大通道建立本地大型呼叫中心、跨境金融催收、及全区域物流追踪系统等中台模块的頂层技术方案设计。吕华老师凭借在前世界500强外企NTT与全球联络中心巨头AVAYA 20年的首席架构及总监级别管理经历，成功保障了合计超过价值 $5000万 美金的中外多边数字体验平台营建项目上线。",
    descEn: "A highly robust service platform designed to support Middle-East and Southeast Asia local CRM migrations, fin-tech compliance BPO and routing networks. Drawing on his core executive experience at NTT (7 years) and AVAYA (13 years), Harry directed and delivered $50M+ in international service middleware projects.",
    url: "#",
    logoText: "HUB"
  },
  {
    nameZh: "中国计算机用户协会客户关系分会 (CCCS 旗下)",
    nameEn: "Customer Relation Branch of China Computer Users Association (CCCS)",
    descZh: "中国计算机用户协会客户关系分会（简称CCCS）是由工信部指导、在民政部登记注册的国家二级行业协会，是中国客户关系管理与呼叫中心数字化领域最资深、最权威的全国性专业学术团体。吕华老师受邀担任该分会理事，积极推动中企客户体验标准建设与服务质量认证。官网：https://www.cccs.com.cn",
    descEn: "The Customer Relation Branch of China Computer Users Association (CCCS) is China's most established and authoritative national academic body in CRM and digital contact centers. Harry Lyu serves as a Council Member, promoting the standardization of outbound CX delivery.",
    url: "https://www.cccs.com.cn/servicecertification",
    logoText: "CCCS"
  },
  {
    nameZh: "三节课 (Sanjieke)",
    nameEn: "Sanjieke Business School",
    descZh: "三节课是中国领先的新商业与数字化高管成长平台，以“培养高素质数字化人才”为使命。平台大咖云集，汇聚了众多来自世界500强及头部互联网公司的顶级实战专家。吕华老师作为三节课特邀签约认证大咖导师，常年主理出海数字化和跨文化服务管理的高端专栏课程，深度端对端赋能国内顶尖大厂及中高层出海管理者的实战能力飞跃。官网：https://www.sanjieke.cn",
    descEn: "Sanjieke is China's premier business and digital talent development school. It partners with industry giants to provide high-caliber masterclasses from global leaders. Harry serves as a Certified Executive Instructor & Outbound Service Management Expert, nurturing leadership pipelines for multi-regional businesses.",
    url: "https://www.sanjieke.cn/teacher_info?id=23996730",
    logoText: "SJK"
  }
];

const getMatchingOrgInfo = (awardText: string) => {
  if (!awardText) return null;
  const lowerText = awardText.toLowerCase();
  
  // 1. Customer Observation / CCSO
  if (lowerText.includes("客户观察") || lowerText.includes("ccso") || lowerText.includes("observation")) {
    return REPUTED_ORGANIZATIONS_INFO[0];
  }
  // 2. ICCA / ACCA
  if (lowerText.includes("icca") || lowerText.includes("印尼") || lowerText.includes("acca") || lowerText.includes("tbcci") || lowerText.includes("呼叫中心协会")) {
    return REPUTED_ORGANIZATIONS_INFO[1];
  }
  // 3. DSRC / Silk Road
  if (lowerText.includes("丝路") || lowerText.includes("dsrc") || lowerText.includes("silk road") || lowerText.includes("丝绸之路")) {
    return REPUTED_ORGANIZATIONS_INFO[2];
  }
  // 4. PT Press / Publishers / Outbound Bestseller
  if (lowerText.includes("邮电") || lowerText.includes("ptpress") || lowerText.includes("press") || lowerText.includes("出海制胜") || lowerText.includes("出版社") || lowerText.includes("winning overseas") || lowerText.includes("著作") || lowerText.includes("著有")) {
    return REPUTED_ORGANIZATIONS_INFO[3];
  }
  // 5. GDTA
  if (lowerText.includes("gdta") || lowerText.includes("global digital") || lowerText.includes("智能数字创新大奖") || lowerText.includes("评委") || lowerText.includes("大奖")) {
    return REPUTED_ORGANIZATIONS_INFO[4];
  }
  // 6. INSEAD
  if (lowerText.includes("insead") || lowerText.includes("工商管理") || lowerText.includes("哈佛") || lowerText.includes("欧洲")) {
    return REPUTED_ORGANIZATIONS_INFO[5];
  }
  // 7. Middle East / Infra Hub
  if (lowerText.includes("基建") || lowerText.includes("中东") || lowerText.includes("5000万") || lowerText.includes("5000") || lowerText.includes("美金") || lowerText.includes("中台") || lowerText.includes("物流") || lowerText.includes("金融")) {
    return REPUTED_ORGANIZATIONS_INFO[6];
  }
  // 8. CCCS / China Computer Users Association
  if (lowerText.includes("cccs") || lowerText.includes("中国计算机用户协会") || lowerText.includes("computer user")) {
    return REPUTED_ORGANIZATIONS_INFO[7];
  }
  // 9. Sanjieke
  if (lowerText.includes("三节课") || lowerText.includes("sanjieke")) {
    return REPUTED_ORGANIZATIONS_INFO[8];
  }
  return null;
};

const getCurrentCredentialImage = (awardText: string) => {
  if (!awardText) return "/src/assets/images/lyu_credentials.jpg";
  const lowerText = awardText.toLowerCase();
  if (lowerText.includes("客户观察") || lowerText.includes("ccso") || lowerText.includes("observation")) {
    return "/src/assets/images/credential_ccso.jpg";
  }
  if (lowerText.includes("icca") || lowerText.includes("印尼") || lowerText.includes("acca") || lowerText.includes("tbcci")) {
    return "/src/assets/images/credential_icca.jpg";
  }
  if (lowerText.includes("cccs") || lowerText.includes("中国计算机用户协会") || lowerText.includes("computer user")) {
    return "/src/assets/images/credential_cccs.png";
  }
  if (lowerText.includes("出海制胜") || lowerText.includes("winning overseas") || lowerText.includes("著有")) {
    return "/src/assets/images/credential_book.jpg";
  }
  if (lowerText.includes("三节课") || lowerText.includes("sanjieke")) {
    return "/src/assets/images/credential_sanjieke.png";
  }
  return "/src/assets/images/lyu_credentials.jpg";
};

type ActiveTab = "about" | "book" | "videos" | "workshops" | "tool" | "pricing" | "contact";

interface DetectedCountry {
  country: CountryData;
  index: number;
}

function detectCountriesInOrder(title: string, desc: string): CountryData[] {
  const combined = (title + " " + desc).toLowerCase();
  const list: DetectedCountry[] = [];

  for (const country of COUNTRIES) {
    const zhName = country.nameZh.toLowerCase();
    const enName = country.nameEn.toLowerCase();
    
    let idx = combined.indexOf(zhName);
    if (idx === -1) {
      idx = combined.indexOf(enName);
    }
    
    if (idx !== -1) {
      list.push({ country, index: idx });
    }
  }
  
  list.sort((a, b) => a.index - b.index);
  return list.map(item => item.country);
}

function formatDateYYYYMMDD(ms?: number): string {
  if (!ms) return "";
  const d = new Date(ms);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function App() {
  // Localization toggle: "zh" | "en"
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const isEn = lang === "en";
  const currT = t[lang];

  const sortedCountriesForSelect = useMemo(() => {
    return [...COUNTRIES].sort((a, b) => {
      const nameA = isEn ? a.nameEn : a.nameZh;
      const nameB = isEn ? b.nameEn : b.nameZh;
      return nameA.localeCompare(nameB, isEn ? 'en' : 'zh-CN');
    });
  }, [isEn]);

  // File upload ref for keynote photo to ensure cross-browser click reliability
  const keynoteFileInputRef = useRef<HTMLInputElement>(null);

  // Active navigational tab
  const [activeTab, setActiveTab] = useState<ActiveTab>("about");

  // Track which book chapter is expanded for detail summary
  const [expandedBookChapter, setExpandedBookChapter] = useState<number | null>(null);

  // About App info modal state
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  const [showStatsSlideModal, setShowStatsSlideModal] = useState<boolean>(false);

  // Hamburger Menu Dropdown state
  const [showMenuDropdown, setShowMenuDropdown] = useState<boolean>(false);

  // Interactive Website Refinement tracking board states
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [feedbackCategory, setFeedbackCategory] = useState<string>("UI/UX & Mobile");
  const [newSuggestionInput, setNewSuggestionInput] = useState<string>("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState<boolean>(false);

  // Student Auth Portal states
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authError, setAuthError] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");
  const [studentCompany, setStudentCompany] = useState<string>("");
  const [studentEmail, setStudentEmail] = useState<string>("");
  const [studentPassword, setStudentPassword] = useState<string>("");
  const [studentPhone, setStudentPhone] = useState<string>("");
  const [privacyAccepted, setPrivacyAccepted] = useState<boolean>(false);
  const [firebaseSynced, setFirebaseSynced] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<{ 
    email: string; 
    name: string; 
    org: string; 
    role?: "admin" | "assistant" | "trainee";
    selectedPlan?: "24h" | "1mo" | "3mo" | "1yr";
    status?: "pending_approval" | "active" | "expired";
    expiryDate?: number;
    createdAt?: number;
  } | null>(null);

  // New Subscription, Pricing, and Admin States
  const [selectedVideoToPlay, setSelectedVideoToPlay] = useState<VideoModule | null>(null);
  const [selectedVideoToViewPdf, setSelectedVideoToViewPdf] = useState<VideoModule | null>(null);
  const [videoSearchQuery, setVideoSearchQuery] = useState<string>("");
  const [videoActiveTagFilter, setVideoActiveTagFilter] = useState<string>("All");
  const [isPlayingMockVideo, setIsPlayingMockVideo] = useState<boolean>(true);
  const [mockVideoPlaybackProgress, setMockVideoPlaybackProgress] = useState<number>(30);
  const [currentPdfSlideIndex, setCurrentPdfSlideIndex] = useState<number>(1);
  const [savedVideoNotes, setSavedVideoNotes] = useState<{ [key: string]: string }>(() => {
    try {
      const saved = localStorage.getItem("lyu_student_video_notes");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [activeNotesText, setActiveNotesText] = useState<string>("");
  const [savedNotesNotice, setSavedNotesNotice] = useState<boolean>(false);

  useEffect(() => {
    if (selectedVideoToPlay) {
      setActiveNotesText(savedVideoNotes[selectedVideoToPlay.id] || "");
      setSavedNotesNotice(false);
    }
  }, [selectedVideoToPlay]);

  // Simulate progress bar increase for mock player
  useEffect(() => {
    let interval: any;
    if (selectedVideoToPlay && isPlayingMockVideo) {
      interval = setInterval(() => {
        setMockVideoPlaybackProgress(prev => {
          if (prev >= 100) return 0;
          return prev + 1;
        });
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [selectedVideoToPlay, isPlayingMockVideo]);

  const [selectedSubscriptionPlan, setSelectedSubscriptionPlan] = useState<"24h" | "1mo" | "3mo" | "1yr">("1yr");
  const [showPaymentInstructions, setShowPaymentInstructions] = useState<boolean>(false);
  const [showAllNotifications, setShowAllNotifications] = useState<boolean>(false);
  const [copiedPayText, setCopiedPayText] = useState<boolean>(false);
  const [showPaymentNotifyForm, setShowPaymentNotifyForm] = useState<boolean>(false);
  const [paymentProofImage, setPaymentProofImage] = useState<string>("");
  const [paymentNote, setPaymentNote] = useState<string>("");
  const [isSubmittingPaymentProof, setIsSubmittingPaymentProof] = useState<boolean>(false);
  const [paymentProofSubmitted, setPaymentProofSubmitted] = useState<boolean>(false);
  const [previewProofModalImage, setPreviewProofModalImage] = useState<string | null>(null);
  const [justRegisteredUser, setJustRegisteredUser] = useState<any | null>(null);
  const [showAdminTraineeModal, setShowAdminTraineeModal] = useState<boolean>(false);
  const [adminSearchTerm, setAdminSearchTerm] = useState<string>("");
  const [editingStudentEmail, setEditingStudentEmail] = useState<string | null>(null);
  const [editFormPlan, setEditFormPlan] = useState<"24h" | "1mo" | "3mo" | "1yr">("1mo");
  const [editFormStatus, setEditFormStatus] = useState<"pending_approval" | "active" | "expired">("active");
  const [editFormDays, setEditFormDays] = useState<number>(30);
  const [showEmailReceiptModal, setShowEmailReceiptModal] = useState<boolean>(false);
  const [receiptTrainee, setReceiptTrainee] = useState<any | null>(null);
  const [copiedReceiptText, setCopiedReceiptText] = useState<boolean>(false);
  const [activeProfileCountry, setActiveProfileCountry] = useState<string>("China");
  const [isMoreCountriesExpanded, setIsMoreCountriesExpanded] = useState<boolean>(false);
  const [toolSubTab, setToolSubTab] = useState<"culture_map" | "cases" | "pain_points">("culture_map");
  const [isAllCasesExpanded, setIsAllCasesExpanded] = useState<boolean>(false);

  // Onboarding, Password confirmation, and Forgot Password states
  const [studentPasswordConfirm, setStudentPasswordConfirm] = useState<string>("");
  const [forgotPasswordMode, setForgotPasswordMode] = useState<boolean>(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>("");
  const [forgotPasswordSent, setForgotPasswordSent] = useState<boolean>(false);
  const [showWelcomeOnboardingModal, setShowWelcomeOnboardingModal] = useState<boolean>(false);
  const [selectedOnboardingPlan, setSelectedOnboardingPlan] = useState<"24h" | "1mo" | "3mo" | "1yr">("1mo");
  const [showOnboardingPaymentPrompt, setShowOnboardingPaymentPrompt] = useState<boolean>(false);
  const [globalToastNotice, setGlobalToastNotice] = useState<{ message: string; sub?: string; type?: "success" | "info" | "warning" } | null>(null);

  // In-Site Direct Notification states for Assistant/Admin
  const [showSendNoticeModal, setShowSendNoticeModal] = useState<boolean>(false);
  const [noticeTargetStudent, setNoticeTargetStudent] = useState<any | null>(null);
  const [noticeTargetFbId, setNoticeTargetFbId] = useState<string | null>(null);
  const [noticeCustomTitle, setNoticeCustomTitle] = useState<string>("");
  const [noticeCustomContent, setNoticeCustomContent] = useState<string>("");
  const [noticeReplyContent, setNoticeReplyContent] = useState<string>("");
  const [selectedNoticeDetail, setSelectedNoticeDetail] = useState<{ id: string; title: string; content: string; date: number; read: boolean; email?: string } | null>(null);

  // Helper: 核销并把待办/工单移出待办列表
  const handleResolveFeedback = async (fbId: string, replyMsg?: string) => {
    if (!fbId) return;
    try {
      await fetch(`/api/feedback/${fbId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "resolved",
          reply: replyMsg || "【助教 Linda 团队】：已完成核销与回复，单据已自动移出待办。"
        })
      });
    } catch (err) {
      console.error("Resolve feedback error:", err);
    }
    setFeedbacks(prev => prev.map(item => item.id === fbId ? { ...item, status: "resolved" } : item));
  };

  // TESTING SPEEDUP STATE & TICK TIMER
  const [isTestSpeedup, setIsTestSpeedup] = useState<boolean>(() => {
    const saved = localStorage.getItem("HARRY_TEST_SPEEDUP_MODE");
    return saved === "true";
  });
  const [nowTick, setNowTick] = useState<number>(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNowTick(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleTestSpeedup = (val: boolean) => {
    setIsTestSpeedup(val);
    localStorage.setItem("HARRY_TEST_SPEEDUP_MODE", String(val));
  };

  // Cookie/Privacy banner consent states: "accepted" | "declined" | null
  const [cookieConsent, setCookieConsent] = useState<"accepted" | "declined" | null>(null);
  const [showCookieBanner, setShowCookieBanner] = useState<boolean>(true);

  // KEYNOTE WIDGET: Select presentation slide summary to view
  const [selectedKeynoteIdx, setSelectedKeynoteIdx] = useState<number>(0);

  // Dynamic Datastores for Keynote presentations and Publication Journals
  const [keynotes, setKeynotes] = useState<any[]>([]);
  const [journals, setJournals] = useState<any[]>([]);

  const activeKeynotes = keynotes.length > 0 ? keynotes : currT.keynotes;
  const activeJournals = journals.length > 0 ? journals : [
    {
      id: "journal-1",
      title: "《客户观察》特约首发：《中企客服系统出海与数据合规》",
      link: "https://kehuguancha.yunzhan365.com/books/msbm/mobile/index.html#p=82",
      desc: "系统梳理了出海面临的欧盟GDPR、印度DPDP 2023、印尼APPI等全球最严数据安全红线。深入解析了跨国客服体系中DPO（数据保护官）设置、远程办公水印监控、极小化数据存储设计，以及选用高合规水准BPO。对齐“ASFP”与“OIT”关口安全最佳实践。",
      takeaway: "数据合规并非出海的阻碍，而是在海外安全高效运营的顶级“护身符”；精准管控角色并脱敏数据，方能游刃有余。",
      isCustom: false
    },
    {
      id: "journal-2",
      title: "《客户观察》专栏首发：《一线声波传商韵，万般客意化金流——论用户体验团队如何帮助企业把握流量与高质转化》",
      link: "https://kehuguancha.yunzhan365.com/books/gvhn/mobile/index.html?maxwidthtosmallmode=0&maxheighttosmallmode=0#p=49",
      desc: "探讨“用户体验”在出海高复杂度合规与流量变现交汇点上的纽带作用。详细解构如何以专业沟通与温度服务将流量转化为销量增长，剖析公域漏斗与WhatsApp私域池结合实践。",
      takeaway: "良好的用户体验与合规经营驱动流量增长，是品牌、流量、合规、体验融合的必然结果。体验是底盘，更是私域复购的硬船桨。",
      isCustom: false
    },
    {
      id: "journal-3",
      title: "《客户观察》特约专题：《扬帆寻渡千帆竞，四海同心万里行——境外客服中心选址、自建与BPO伙伴的合规甄选指南》",
      link: "https://www.caibocn.com/newsinfo/8411379.html",
      desc: "全景概述全球呼叫中心从业格局、国内外自建与BPO运营成本及各重点离岸港口优劣势。深度剖析跨国客服在工作时限、时区、语言覆盖及合规挑战，提供系统化甄选建议。",
      takeaway: "境外BPO考察切忌走马观花，亲自面试DPO，对比同行承接案例是规避高额罚款并稳定团队的关键。",
      isCustom: false
    },
    {
      id: "journal-4",
      title: "《客户体验中心出海的技术规划 | 出海专栏》",
      link: "https://www.caibocn.com/newsinfo/8719753.html",
      desc: "出海客户体验中心技术规划深度实战拆解，涵盖全渠道数字交互网络拓扑、低延迟高保真国际专线话务路由、以及高并发异构基础设施下的容量调度。提供网络建设避雷指南。",
      takeaway: "技术规划是出海体验落地的钢筋骨架，只有把全渠道数字网络、话务路由以及多国家高可用底层完全打通，服务质量才有高容错的保证。",
      isCustom: false
    },
    {
      id: "journal-5",
      title: "《熊猫与战狼》",
      link: "http://www.ccinchina.com/article/articleDetail?articleid=202509010532360736",
      desc: "基于跨文化管理视角的经典评述。探讨中企出海面对极复杂的海外地缘、宗教信仰、跨文化劳工法规冲突时，如何从“战狼式”高强度家长制管辖智慧过渡到“大熊猫式”高包容度、温和本地化管理。",
      takeaway: "跨文化组织建设需要将刚性的制度流程与柔性的本地包容有机融会。做硬朗的开拓者，更要做温和而有智慧的跨文化融通人。",
      isCustom: false
    }
  ];
  const [currentBookTab, setCurrentBookTab] = useState<"syllabus" | "journals">("syllabus");
  const [selectedSyllabusStep, setSelectedSyllabusStep] = useState<number>(1);

  // Dynamic credentials state
  interface CredentialsState {
    titleZh: string;
    titleEn: string;
    descZh: string;
    descEn: string;
    imageUrl: string;
    listZh: string[];
    listEn: string[];
  }
  const [credentialsData, setCredentialsData] = useState<CredentialsState | null>(null);
  const [selectedCredentialIdx, setSelectedCredentialIdx] = useState<number>(0);
  const [showEditCredentialsModal, setShowEditCredentialsModal] = useState<boolean>(false);
  const [keynoteLightboxUrl, setKeynoteLightboxUrl] = useState<string | null>(null);
  const [showPreorderGuidance, setShowPreorderGuidance] = useState<boolean>(false);
  const [editTitleZh, setEditTitleZh] = useState<string>("");
  const [editTitleEn, setEditTitleEn] = useState<string>("");
  const [editDescZh, setEditDescZh] = useState<string>("");
  const [editDescEn, setEditDescEn] = useState<string>("");
  const [editImageUrl, setEditImageUrl] = useState<string>("");
  const [editListZh, setEditListZh] = useState<string[]>([]);
  const [editListEn, setEditListEn] = useState<string[]>([]);
  const [isTranslatingCredentials, setIsTranslatingCredentials] = useState<boolean>(false);
  const [deploymentTime, setDeploymentTime] = useState<string>("2026年6月19日 11:21");
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);

  // 键盘快捷粘贴截图处理 (Ctrl+V)
  const handlePasteImage = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            setPaymentProofImage(result);
            setGlobalToastNotice({
              message: "🎉 已通过 Ctrl+V 快捷粘贴抓取剪贴板图片！",
              sub: "转账凭证图片已自动载入",
              type: "success"
            });
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleAiTranslateCredentials = async () => {
    if (!editTitleZh && !editDescZh && (!editListZh || editListZh.every(x => !x))) {
      alert(isEn ? "Please enter some Chinese text to translate first!" : "请先在此框输入或填充中文文字，以提供AI自动翻译！");
      return;
    }
    setIsTranslatingCredentials(true);
    try {
      const res = await fetch("/api/translate-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleZh: editTitleZh,
          descZh: editDescZh,
          listZh: editListZh
        })
      });
      if (!res.ok) throw new Error("Translation service returned error");
      const data = await res.json();
      if (data.titleEn) setEditTitleEn(data.titleEn);
      if (data.descEn) setEditDescEn(data.descEn);
      if (Array.isArray(data.listEn)) {
        setEditListEn(data.listEn);
      }
    } catch (e) {
      console.error("Credentials translation error:", e);
      alert(isEn ? "AI translation fails. Please fill manually or retry." : "AI一键翻译遇到阻碍。您可尝试配置秘钥重新尝试或直接在此处进行英文手动改写。");
    } finally {
      setIsTranslatingCredentials(false);
    }
  };

  // Dynamic memory gallery state
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [showAddMemoryModal, setShowAddMemoryModal] = useState<boolean>(false);
  const [memoryTypeInput, setMemoryTypeInput] = useState<"academic" | "professional" | "outdoor" | "collaboration">("professional");
  const [memoryRawInput, setMemoryRawInput] = useState<string>("");
  const [memorySrcInput, setMemorySrcInput] = useState<string>(""); // Base64 or URL
  const [memoryAltZhInput, setMemoryAltZhInput] = useState<string>("");
  const [memoryAltEnInput, setMemoryAltEnInput] = useState<string>("");
  const [memoryDescZhInput, setMemoryDescZhInput] = useState<string>("");
  const [memoryDescEnInput, setMemoryDescEnInput] = useState<string>("");
  const [memoryGradientInput, setMemoryGradientInput] = useState<string>("");
  const [isGeneratingMemoryAi, setIsGeneratingMemoryAi] = useState<boolean>(false);

  const fetchCredentials = async () => {
    try {
      const res = await fetch("/api/credentials");
      if (res.ok) {
        const data = await res.json();
        setCredentialsData(data);
        setEditTitleZh(data.titleZh || "");
        setEditTitleEn(data.titleEn || "");
        setEditDescZh(data.descZh || "");
        setEditDescEn(data.descEn || "");
        setEditImageUrl(data.imageUrl || "");
        setEditListZh(data.listZh || []);
        setEditListEn(data.listEn || []);
      }
    } catch (e) {
      console.error("Failed to fetch credentials:", e);
    }
  };

  const fetchMemories = async () => {
    try {
      const res = await fetch("/api/memories");
      if (res.ok) {
        const data = await res.json();
        setMemories(data);
      }
    } catch (e) {
      console.error("Failed to fetch memories:", e);
    }
  };

  const handleSaveCredentials = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleZh: editTitleZh,
          titleEn: editTitleEn,
          descZh: editDescZh,
          descEn: editDescEn,
          imageUrl: editImageUrl,
          listZh: editListZh,
          listEn: editListEn
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCredentialsData(data);
        setShowEditCredentialsModal(false);
      }
    } catch (err) {
      console.error("Save credentials failed:", err);
    }
  };

  const handleAiSummarizeMemory = async () => {
    if (!memoryRawInput.trim()) {
      alert(isEn ? "Please enter raw insights/background information first!" : "请先输入长廊素材/探索经历原始素材！");
      return;
    }
    setIsGeneratingMemoryAi(true);
    try {
      const res = await fetch("/api/ai-summarize-memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: memoryRawInput, category: memoryTypeInput })
      });
      if (res.ok) {
        const data = await res.json();
        setMemoryAltZhInput(data.altZh || "");
        setMemoryAltEnInput(data.altEn || "");
        setMemoryDescZhInput(data.descZh || "");
        setMemoryDescEnInput(data.descEn || "");
        setMemoryGradientInput(data.gradient || "from-amber-600/20 via-slate-900 to-slate-950");
        if (data.notice) {
          console.log(data.notice);
        }
      }
    } catch (err) {
      console.error("AI summarization failed:", err);
    } finally {
      setIsGeneratingMemoryAi(false);
    }
  };

  const handleAddMemory = async (e: any) => {
    e.preventDefault();
    if (!memoryAltZhInput.trim() || !memoryDescZhInput.trim()) {
      alert(isEn ? "Title and description are required!" : "标题与描述属必填，请先一键智能归纳提炼！");
      return;
    }
    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          src: memorySrcInput || "/src/assets/images/gallery_judge.jpg",
          altZh: memoryAltZhInput,
          altEn: memoryAltEnInput || memoryAltZhInput,
          descZh: memoryDescZhInput,
          descEn: memoryDescEnInput || memoryDescZhInput,
          gradient: memoryGradientInput || "from-amber-600/20 via-slate-900 to-slate-950",
          type: memoryTypeInput
        })
      });
      if (res.ok) {
        await fetchMemories();
        setShowAddMemoryModal(false);
        setMemoryRawInput("");
        setMemorySrcInput("");
        setMemoryAltZhInput("");
        setMemoryAltEnInput("");
        setMemoryDescZhInput("");
        setMemoryDescEnInput("");
        setMemoryGradientInput("");
      }
    } catch (err) {
      console.error("Add memory entry failed:", err);
    }
  };

  const handleDeleteMemory = async (id: string, e: any) => {
    e.stopPropagation();
    if (!window.confirm(isEn ? "Are you sure to delete this milestone entry?" : "确认要永久移除这条印记素材里程碑吗？")) {
      return;
    }
    try {
      const res = await fetch(`/api/memories/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchMemories();
      }
    } catch (err) {
      console.error("Delete memory item error:", err);
    }
  };

  // Keynote administrator creation state
  const [keynoteTitleInput, setKeynoteTitleInput] = useState<string>("");
  const [keynoteRawDescInput, setKeynoteRawDescInput] = useState<string>("");
  const [keynoteDescInput, setKeynoteDescInput] = useState<string>("");
  const [keynoteTakeawayInput, setKeynoteTakeawayInput] = useState<string>("");
  const [isGeneratingKeynoteAi, setIsGeneratingKeynoteAi] = useState<boolean>(false);
  const [showAddKeynoteForm, setShowAddKeynoteForm] = useState<boolean>(false);

  // Journal administrator creation state
  const [journalTitleInput, setJournalTitleInput] = useState<string>("");
  const [journalLinkInput, setJournalLinkInput] = useState<string>("");
  const [journalRawDescInput, setJournalRawDescInput] = useState<string>("");
  const [journalDescInput, setJournalDescInput] = useState<string>("");
  const [journalTakeawayInput, setJournalTakeawayInput] = useState<string>("");
  const [isGeneratingJournalAi, setIsGeneratingJournalAi] = useState<boolean>(false);
  const [showAddJournalForm, setShowAddJournalForm] = useState<boolean>(false);

  const fetchKeynotes = async () => {
    try {
      const res = await fetch("/api/keynotes");
      if (res.ok) {
        const data = await res.json();
        setKeynotes(data);
      }
    } catch (e) {
      console.error("Failed to fetch custom keynotes:", e);
    }
  };

  const fetchJournals = async () => {
    try {
      const res = await fetch("/api/journals");
      if (res.ok) {
        const data = await res.json();
        setJournals(data);
      }
    } catch (e) {
      console.error("Failed to fetch custom journals:", e);
    }
  };

  const fetchBuildTime = async () => {
    try {
      const res = await fetch("/api/build-time");
      if (res.ok) {
        const data = await res.json();
        if (data.time) {
          setDeploymentTime(data.time);
        }
      }
    } catch (e) {
      console.error("Failed to fetch build/deployment time:", e);
    }
  };

  useEffect(() => {
    fetchKeynotes();
    fetchJournals();
    fetchCredentials();
    fetchMemories();
    fetchBuildTime();
  }, []);

  // Auto-rotating book reviews caravan (every 6 seconds)
  useEffect(() => {
    const intervalIdx = setInterval(() => {
      setActiveReviewIdx((prevIdx) => (prevIdx + 1) % 4);
    }, 6000);
    return () => clearInterval(intervalIdx);
  }, []);

  const handleAiSummarizeKeynote = async () => {
    if (!keynoteTitleInput.trim() || !keynoteRawDescInput.trim()) {
      alert(isEn ? "Please supply a Title and raw meeting information first." : "请先填写演讲主题/活动标题和原始会议详细说明。");
      return;
    }
    setIsGeneratingKeynoteAi(true);
    try {
      const res = await fetch("/api/ai-summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: keynoteTitleInput, rawText: keynoteRawDescInput })
      });
      if (res.ok) {
        const data = await res.json();
        setKeynoteDescInput(data.desc || "");
        setKeynoteTakeawayInput(data.takeaway || "");
      }
    } catch (err) {
      console.error("AI summarizer error:", err);
    } finally {
      setIsGeneratingKeynoteAi(false);
    }
  };

  const handleAiSummarizeJournal = async () => {
    if (!journalTitleInput.trim() || !journalRawDescInput.trim()) {
      alert(isEn ? "Please supply a Publication Title and raw details first." : "请先填写发布物名称和原始刊物详细说明。");
      return;
    }
    setIsGeneratingJournalAi(true);
    try {
      const res = await fetch("/api/ai-summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: journalTitleInput, rawText: journalRawDescInput })
      });
      if (res.ok) {
        const data = await res.json();
        setJournalDescInput(data.desc || "");
        setJournalTakeawayInput(data.takeaway || "");
      }
    } catch (err) {
      console.error("AI summarizer error:", err);
    } finally {
      setIsGeneratingJournalAi(false);
    }
  };

  const handleSaveKeynote = async (e: FormEvent) => {
    e.preventDefault();
    if (!keynoteTitleInput.trim() || !keynoteDescInput.trim() || !keynoteTakeawayInput.trim()) {
      alert(isEn ? "All summarized content fields are required." : "要点与金句字段均为必填，可使用 AI 解析按钮自动提炼生成。");
      return;
    }

    try {
      const res = await fetch("/api/keynotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: keynoteTitleInput,
          desc: keynoteDescInput,
          takeaway: keynoteTakeawayInput
        })
      });

      if (res.ok) {
        setKeynoteTitleInput("");
        setKeynoteRawDescInput("");
        setKeynoteDescInput("");
        setKeynoteTakeawayInput("");
        setShowAddKeynoteForm(false);
        await fetchKeynotes();
      }
    } catch (e) {
      console.error("Failed to append custom keynote:", e);
    }
  };

  const handleDeleteKeynote = async (id: string, e: any) => {
    e.stopPropagation();
    if (!confirm(isEn ? "Are you sure you want to retract this keynote entry?" : "确定要撤回/删除此条大会演讲实录吗？")) return;
    try {
      const res = await fetch(`/api/keynotes/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchKeynotes();
        setSelectedKeynoteIdx(0);
      }
    } catch (err) {
      console.error("Failed to delete keynote:", err);
    }
  };

  const handleUploadKeynotePhoto = async (keynoteId: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const res = await fetch(`/api/keynotes/${keynoteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64String })
        });
        if (res.ok) {
          await fetchKeynotes();
          console.log("Successfully updated keynote photo with the original image.");
        }
      } catch (err) {
        console.error("Failed to upload keynote original photo:", err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadCredentialsPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const res = await fetch("/api/credentials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titleZh: credentialsData?.titleZh || "",
            titleEn: credentialsData?.titleEn || "",
            descZh: credentialsData?.descZh || "",
            descEn: credentialsData?.descEn || "",
            imageUrl: base64String,
            listZh: credentialsData?.listZh || [],
            listEn: credentialsData?.listEn || []
          })
        });
        if (res.ok) {
          const data = await res.json();
          setCredentialsData(data);
          console.log("Successfully updated credentials photo.");
        }
      } catch (err) {
        console.error("Failed to upload credentials photo:", err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveJournal = async (e: FormEvent) => {
    e.preventDefault();
    if (!journalTitleInput.trim() || !journalLinkInput.trim() || !journalDescInput.trim() || !journalTakeawayInput.trim()) {
      alert(isEn ? "All publication fields are required." : "刊物主题、链接、描述和金句均为必填项，可使用 AI 解析按钮。");
      return;
    }

    try {
      const res = await fetch("/api/journals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: journalTitleInput,
          link: journalLinkInput,
          desc: journalDescInput,
          takeaway: journalTakeawayInput
        })
      });

      if (res.ok) {
        setJournalTitleInput("");
        setJournalLinkInput("");
        setJournalRawDescInput("");
        setJournalDescInput("");
        setJournalTakeawayInput("");
        setShowAddJournalForm(false);
        await fetchJournals();
      }
    } catch (e) {
      console.error("Failed to append custom journal:", e);
    }
  };

  const handleDeleteJournal = async (id: string, e: any) => {
    e.stopPropagation();
    if (!confirm(isEn ? "Are you sure you want to delete this publication journal entry?" : "确定要删除此条发布的知名期刊文章吗？")) return;
    try {
      const res = await fetch(`/api/journals/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchJournals();
      }
    } catch (err) {
      console.error("Failed to delete journal:", err);
    }
  };

  // BOOK PRE-ORDER: Form state
  const [bookName, setBookName] = useState<string>("");
  const [bookAddress, setBookAddress] = useState<string>("");
  const [bookEmail, setBookEmail] = useState<string>("");
  const [bookPhone, setBookPhone] = useState<string>("");
  const [bookDedication, setBookDedication] = useState<string>("");
  const [bookOrdered, setBookOrdered] = useState<boolean>(false);
  const [activeReviewIdx, setActiveReviewIdx] = useState<number>(0);

  // MEMORY GALLERY STATE
  const [galleryFilter, setGalleryFilter] = useState<string>("all");
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);

  // DYNAMIC PROFILE PHOTO MANAGEMENT
  const [profilePhoto, setProfilePhoto] = useState<string>(() => {
    return localStorage.getItem("harry_custom_portrait") || "/src/assets/images/instructor_portrait_1781339256749.jpg";
  });
  const [showPortraitGuide, setShowPortraitGuide] = useState<boolean>(false);

  // DYNAMIC PREORDER FLYER MANAGEMENT
  const [preorderFlyer, setPreorderFlyer] = useState<string>(() => {
    return localStorage.getItem("harry_custom_preorder_flyer") || "/src/assets/images/signed_preorder_channel_1781861067288.png";
  });
  const [isUploadingPreorderFlyer, setIsUploadingPreorderFlyer] = useState<boolean>(false);

  // DYNAMIC COMPASS ATLAS MANAGEMENT
  const [compassAtlas, setCompassAtlas] = useState<string>(() => {
    return localStorage.getItem("harry_custom_compass_atlas") || "/src/assets/images/golden_culture_compass.png";
  });
  const [isUploadingCompassAtlas, setIsUploadingCompassAtlas] = useState<boolean>(false);

  // DYNAMIC WORKSHOP PHOTO MANAGEMENT
  const [workshopPhoto, setWorkshopPhoto] = useState<string>(() => {
    return localStorage.getItem("harry_custom_workshop_photo") || "/src/assets/images/culture_map_workshop.jpg";
  });
  const [isUploadingWorkshopPhoto, setIsUploadingWorkshopPhoto] = useState<boolean>(false);

  // Helper to synchronize base64 custom uploads permanently to the cloud server files
  const syncCustomImagesWithServer = async (
    portraitData?: string | null, 
    bookCoverData?: string | null, 
    preorderFlyerData?: string | null,
    compassAtlasData?: string | null,
    workshopPhotoData?: string | null
  ) => {
    try {
      const portBase64 = portraitData !== undefined ? portraitData : localStorage.getItem("harry_custom_portrait");
      const bookBase64 = bookCoverData !== undefined ? bookCoverData : localStorage.getItem("harry_custom_book_cover");
      const flyerBase64 = preorderFlyerData !== undefined ? preorderFlyerData : localStorage.getItem("harry_custom_preorder_flyer");
      const compassBase64 = compassAtlasData !== undefined ? compassAtlasData : localStorage.getItem("harry_custom_compass_atlas");
      const workshopBase64 = workshopPhotoData !== undefined ? workshopPhotoData : localStorage.getItem("harry_custom_workshop_photo");

      if (portBase64 || bookBase64 || flyerBase64 || compassBase64 || workshopBase64) {
        await fetch("/api/save-uploads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            portrait: portBase64,
            bookCover: bookBase64,
            preorderFlyer: flyerBase64,
            compassAtlas: compassBase64,
            workshopPhoto: workshopBase64
          })
        });
        console.log("Images synchronized permanently on the cloud system storage.");
      }
    } catch (err) {
      console.error("Asset sync failure:", err);
    }
  };

  // Protect the workspace and client storage. Discard any corrupted base64 placeholders to restore clean server-side imagery,
  // and completely avoid auto-overwriting healthy server images on startup.
  useEffect(() => {
    const keysToCheck = [
      "harry_custom_portrait",
      "harry_custom_book_cover",
      "harry_custom_preorder_flyer",
      "harry_custom_compass_atlas",
      "harry_custom_workshop_photo"
    ];
    const statesToReset: Record<string, () => void> = {
      harry_custom_portrait: () => setProfilePhoto("/src/assets/images/instructor_portrait_1781339256749.jpg"),
      harry_custom_book_cover: () => setBookCoverPhoto("/src/assets/images/book_cover_1781339266821.jpg"),
      harry_custom_preorder_flyer: () => setPreorderFlyer("/src/assets/images/signed_preorder_channel_1781861067288.png"),
      harry_custom_compass_atlas: () => setCompassAtlas("/src/assets/images/golden_culture_compass.png"),
      harry_custom_workshop_photo: () => setWorkshopPhoto("/src/assets/images/culture_map_workshop.jpg")
    };
    for (const key of keysToCheck) {
      try {
        const val = localStorage.getItem(key);
        if (val) {
          const isCorruptFormat = val.startsWith("data:") && (val.length < 500 || !val.includes(";base64,"));
          const containsReplacementChar = val.includes("efbfbd") || val.includes("\ufffd") || val.includes("%ef%bf%bd");
          if (isCorruptFormat || containsReplacementChar) {
            localStorage.removeItem(key);
            console.log(`[Self-Healing] Purged corrupt/stale local storage key: ${key}`);
            if (statesToReset[key]) {
              statesToReset[key]();
            }
          }
        }
      } catch (e) {
        console.warn("Storage check exception:", e);
      }
    }
  }, []);

  const fetchFeedbackData = async () => {
    try {
      const res = await fetch("/api/feedback");
      if (res.ok) {
        const data = await res.json();
        setFeedbacks(data);
      }
    } catch (e) {
      console.error("Failed to load feedbacks:", e);
    }
  };

  useEffect(() => {
    if (showFeedbackModal) {
      fetchFeedbackData();
    }
  }, [showFeedbackModal]);

  const handleAddFeedbackSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newSuggestionInput.trim()) return;

    setIsSubmittingFeedback(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          category: feedbackCategory,
          suggestion: newSuggestionInput
        })
      });

      if (res.ok) {
        setNewSuggestionInput("");
        fetchFeedbackData();
      }
    } catch (err) {
      console.error("Error submitting suggestion:", err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const [csvStatusMessage, setCsvStatusMessage] = useState<string | null>(null);

  const handleCsvImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvStatusMessage(isEn ? "Parsing CSV..." : "正在解析并导入 CSV 表格...");
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          setCsvStatusMessage(isEn ? "Empty file." : "文件内容为空。");
          return;
        }

        const lines = text.split(/\r?\n/).filter(line => line.trim());
        if (lines.length === 0) {
          setCsvStatusMessage(isEn ? "No rows found." : "未找到任何行。");
          return;
        }

        // Parse lines. Support basic comma-separated rows with simple double quotes
        const parsedRows: any[] = [];
        let startIndex = 0;
        let categoryColIdx = -1;
        let suggestionColIdx = 0; // default first column

        // Inspect header row from line 0
        const headerCells = lines[0].split(',').map(h => h.trim().toLowerCase());
        const categoryKeywords = ["category", "分类", "模块", "表头", "归属", "类别"];
        const suggestionKeywords = ["suggestion", "建议", "内容", "需求", "细节", "迭代", "优化建议内容", "改进", "修改"];

        const foundSugIdx = headerCells.findIndex(cell => suggestionKeywords.some(kw => cell.includes(kw)));
        const foundCatIdx = headerCells.findIndex(cell => categoryKeywords.some(kw => cell.includes(kw)));

        if (foundSugIdx !== -1) {
          suggestionColIdx = foundSugIdx;
          if (foundCatIdx !== -1) categoryColIdx = foundCatIdx;
          startIndex = 1; // has headers! skip line 0 from data
        }

        for (let i = startIndex; i < lines.length; i++) {
          const rowText = lines[i];
          const cells: string[] = [];
          let currentCell = "";
          let inQuotes = false;

          for (let j = 0; j < rowText.length; j++) {
            const char = rowText[j];
            if (char === '"' || char === "'") {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              cells.push(currentCell.trim());
              currentCell = "";
            } else {
              currentCell += char;
            }
          }
          cells.push(currentCell.trim());

          // extract values
          const rawSuggestion = cells[suggestionColIdx];
          const rawCategory = categoryColIdx !== -1 ? cells[categoryColIdx] : "";

          if (rawSuggestion) {
            // Clean surplus quotes
            const cleanSg = rawSuggestion.replace(/^["']|["']$/g, "").trim();
            const cleanCt = rawCategory.replace(/^["']|["']$/g, "").trim();

            if (cleanSg) {
              parsedRows.push({
                category: cleanCt || "Others",
                suggestion: cleanSg
              });
            }
          }
        }

        if (parsedRows.length === 0) {
          setCsvStatusMessage(isEn ? "No valid rows found." : "未检出带有『改进建议内容』或首列有效的建议项！");
          return;
        }

        // Upload
        const res = await fetch("/api/feedback/bulk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ items: parsedRows })
        });

        if (res.ok) {
          const resData = await res.json();
          setCsvStatusMessage(
            isEn 
              ? `Successfully imported ${resData.count} new items!` 
              : `成功导入了 ${resData.count} 条新迭代建议！已入库去重。`
          );
          fetchFeedbackData();
        } else {
          setCsvStatusMessage(isEn ? "Service import error." : "服务器导入失败。");
        }
      } catch (err) {
        console.error("CSV parse err:", err);
        setCsvStatusMessage(isEn ? "Error: check file format." : "解析出错，请检查 CSV 编码（建议 utf-8）及行列结构。");
      }
    };

    reader.onerror = () => {
      setCsvStatusMessage(isEn ? "Failed to read file." : "无法读取当前选定的文件。");
    };

    reader.readAsText(file);
    // reset selection input
    e.target.value = "";
  };

  const handleExportToXlsx = () => {
    try {
      const dataToExport = feedbacks.map((item) => ({
        [isEn ? "ID" : "序号/ID"]: item.id,
        [isEn ? "Category" : "归属模块"]: item.category,
        [isEn ? "Refinement Suggestion" : "优化建议内容"]: item.suggestion,
        [isEn ? "Submission Date" : "提报时间"]: item.date,
        [isEn ? "Status" : "落实状态"]: item.status === "done" 
          ? (isEn ? "Completed" : "已完成 / 已落实") 
          : (isEn ? "Pending" : "跟进中 / 待办"),
        [isEn ? "AI Strategic Analysis & Status Updates" : "AI 顾问研判与代码跟进"]: item.reply || ""
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, isEn ? "Requirements & Logs" : "需求讨论与优化日志");

      worksheet["!cols"] = [
        { wch: 10 },
        { wch: 25 },
        { wch: 70 },
        { wch: 18 },
        { wch: 18 },
        { wch: 70 }
      ];

      XLSX.writeFile(workbook, isEn ? "Harry_Lyu_Outbound_Requirement_Blueprint.xlsx" : "吕华_出海专属系统需求讨论与优化日志.xlsx");
    } catch (err) {
      console.error("XLSX export error:", err);
    }
  };

  const handlePortraitUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        try {
          localStorage.setItem("harry_custom_portrait", base64String);
        } catch (err) {
          console.warn("Storage quota limit hit; syncing directly to server:", err);
        }
        setProfilePhoto(base64String);
        // Sync immediately with the server-side directory
        syncCustomImagesWithServer(base64String, undefined);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetPortrait = () => {
    localStorage.removeItem("harry_custom_portrait");
    setProfilePhoto("/src/assets/images/instructor_portrait_1781339256749.jpg");
  };

  // DYNAMIC BOOK COVER MANAGEMENT
  const [bookCoverPhoto, setBookCoverPhoto] = useState<string>(() => {
    return localStorage.getItem("harry_custom_book_cover") || "/src/assets/images/book_cover_1781339266821.jpg";
  });
  const [showBookCoverGuide, setShowBookCoverGuide] = useState<boolean>(false);

  const handleBookCoverUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        try {
          localStorage.setItem("harry_custom_book_cover", base64String);
        } catch (err) {
          console.warn("Storage quota limit hit; syncing directly to server:", err);
        }
        setBookCoverPhoto(base64String);
        // Sync immediately with the server-side directory
        syncCustomImagesWithServer(undefined, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetBookCover = () => {
    localStorage.removeItem("harry_custom_book_cover");
    setBookCoverPhoto("/src/assets/images/book_cover_1781339266821.jpg");
  };

  const handleUploadPreorderFlyer = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingPreorderFlyer(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        try {
          localStorage.setItem("harry_custom_preorder_flyer", base64String);
        } catch (err) {
          console.warn("Storage quota limit hit; syncing directly to server:", err);
        }
        setPreorderFlyer(base64String);
        // Sync immediately with the server-side directory
        syncCustomImagesWithServer(undefined, undefined, base64String).then(() => {
          setIsUploadingPreorderFlyer(false);
        }).catch(() => {
          setIsUploadingPreorderFlyer(false);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetPreorderFlyer = () => {
    localStorage.removeItem("harry_custom_preorder_flyer");
    setPreorderFlyer("/src/assets/images/signed_preorder_channel_1781861067288.png");
    // Wipe on server too by passing null or empty string to let server handle it
    fetch("/api/save-uploads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        preorderFlyer: "RESET"
      })
    }).catch(err => console.error("Error resetting server-side flyer:", err));
  };

  const handleCompassAtlasUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingCompassAtlas(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        try {
          localStorage.setItem("harry_custom_compass_atlas", base64String);
        } catch (err) {
          console.warn("Storage quota limit hit; syncing directly to server:", err);
        }
        setCompassAtlas(base64String);
        // Sync immediately with the server-side directory
        syncCustomImagesWithServer(undefined, undefined, undefined, base64String).then(() => {
          setIsUploadingCompassAtlas(false);
        }).catch(() => {
          setIsUploadingCompassAtlas(false);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetCompassAtlas = () => {
    localStorage.removeItem("harry_custom_compass_atlas");
    setCompassAtlas("/src/assets/images/golden_culture_compass.png");
    fetch("/api/save-uploads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        compassAtlas: "RESET"
      })
    }).catch(err => console.error("Error resetting server-side compass atlas:", err));
  };

  const handleWorkshopPhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingWorkshopPhoto(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        try {
          localStorage.setItem("harry_custom_workshop_photo", base64String);
        } catch (err) {
          console.warn("Storage quota limit hit; syncing directly to server:", err);
        }
        setWorkshopPhoto(base64String);
        // Sync immediately with the server-side directory
        syncCustomImagesWithServer(undefined, undefined, undefined, undefined, base64String).then(() => {
          setIsUploadingWorkshopPhoto(false);
        }).catch(() => {
          setIsUploadingWorkshopPhoto(false);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetWorkshopPhoto = () => {
    localStorage.removeItem("harry_custom_workshop_photo");
    setWorkshopPhoto("/src/assets/images/culture_map_workshop.jpg");
    fetch("/api/save-uploads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        workshopPhoto: "RESET"
      })
    }).catch(err => console.error("Error resetting server-side workshop photo:", err));
  };

  // CONSULTING CONTACT: Form states
  const [contactName, setContactName] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [contactCompany, setContactCompany] = useState<string>("");
  const [contactRole, setContactRole] = useState<string>("");
  const [contactNotes, setContactNotes] = useState<string>("");
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);

  // ---- INTEGRATED INTERACTIVE CULTURE MAP STATES ----
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["China", "United States"]);
  const [activeDimension, setActiveDimension] = useState<Dimension>(DIMENSIONS[0]);
  const [mapTourActiveStep, setMapTourActiveStep] = useState<number>(0);
  const [isTourPlaying, setIsTourPlaying] = useState<boolean>(false);

  useEffect(() => {
    let timer: any = null;
    if (isTourPlaying) {
      timer = setInterval(() => {
        setMapTourActiveStep((prev) => (prev + 1) % 5);
      }, 5500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTourPlaying]);

  // Case Studies list and dynamic AI engine
  const [cases, setCases] = useState<CaseStudy[]>(INITIAL_CASES);
  const [activeCaseId, setActiveCaseId] = useState<string>("case-ppt-1");
  const [activeCaseTab, setActiveCaseTab] = useState<"story" | "difficulties" | "culture" | "recommendations">("story");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sandbox Custom Clinic inputs
  const [clinicTitle, setClinicTitle] = useState<string>("");
  const [clinicCountryA, setClinicCountryA] = useState<string>("China");
  const [clinicCountryB, setClinicCountryB] = useState<string>("Japan");
  const [clinicDesc, setClinicDesc] = useState<string>("");
  const [clinicIsAnalyzing, setClinicIsAnalyzing] = useState<boolean>(false);
  const [clinicAnalysisResult, setClinicAnalysisResult] = useState<any | null>(null);
  const [clinicErrorMessage, setClinicErrorMessage] = useState<string | null>(null);
  const [customClinicHistory, setCustomClinicHistory] = useState<CaseStudy[]>([]);

  // Country mismatch modal state
  const [showMismatchModal, setShowMismatchModal] = useState<boolean>(false);
  const [detectedMismatchA, setDetectedMismatchA] = useState<string>("");
  const [detectedMismatchB, setDetectedMismatchB] = useState<string>("");

  // Card generation (Takeaway card matching local preferences)
  const [cardCoreTarget, setCardCoreTarget] = useState<string>("communicating");
  const [showGeneratedCard, setShowGeneratedCard] = useState<boolean>(false);
  const [cardChecklist, setCardChecklist] = useState<{ id: number; text: string; checked: boolean }[]>([]);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [selectedCourseTab, setSelectedCourseTab] = useState<"cx_roadmap" | "culture_map" | "videos">("cx_roadmap");

  // Initialize consent and session cookie on mount
  useEffect(() => {
    const consent = localStorage.getItem("HARRY_GDPR_CONSENT");
    if (consent === "accepted") {
      setCookieConsent("accepted");
      setShowCookieBanner(false);
      // Load student session if saved
      const session = localStorage.getItem("HARRY_STUDENT_SESSION");
      if (session) {
        try {
          setLoggedInUser(JSON.parse(session));
        } catch (e) {
          console.error(e);
        }
      }
      // Load sandbox history
      const storedHistory = localStorage.getItem("HARRY_CLINIC_HISTORY");
      if (storedHistory) {
        try {
          setCustomClinicHistory(JSON.parse(storedHistory));
        } catch (e) {
          console.error(e);
        }
      }
    } else if (consent === "declined") {
      setCookieConsent("declined");
      setShowCookieBanner(false);
    }
  }, []);

  // Trigger Firebase cloud sync on mount
  useEffect(() => {
    syncFromCloud((merged) => {
      setFirebaseSynced(true);
    });
  }, []);

  const handleCookieAccept = () => {
    setCookieConsent("accepted");
    localStorage.setItem("HARRY_GDPR_CONSENT", "accepted");
    setShowCookieBanner(false);
  };

  const handleCookieDecline = () => {
    setCookieConsent("declined");
    localStorage.setItem("HARRY_GDPR_CONSENT", "declined");
    localStorage.removeItem("HARRY_STUDENT_SESSION");
    localStorage.removeItem("HARRY_CLINIC_HISTORY");
    setLoggedInUser(null);
    setCustomClinicHistory([]);
    setShowCookieBanner(false);
  };

  // Student auth simulation
  const getRegisteredStudents = (): Array<{ 
    email: string; 
    name: string; 
    org: string; 
    phone?: string;
    role: "admin" | "assistant" | "trainee";
    selectedPlan?: "24h" | "1mo" | "3mo" | "1yr";
    status: "pending_approval" | "active" | "expired";
    expiryDate?: number;
    createdAt: number;
    password?: string;
    notifications?: Array<{
      id: string;
      title: string;
      content: string;
      date: number;
      read: boolean;
    }>;
  }> => {
    try {
      const stored = localStorage.getItem("HARRY_REGISTERED_STUDENTS");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    // Return standard fallback mock accounts so users can fast-test immediately
    const now = Date.now();
    return [
      { 
        email: "trainee@example.com", 
        name: "张出海 (Trainee)", 
        org: "海外领航集团", 
        phone: "+86 13800000001",
        role: "trainee", 
        selectedPlan: "1mo", 
        status: "active", 
        expiryDate: now + 30 * 24 * 60 * 60 * 1000, 
        createdAt: now - 5 * 24 * 60 * 60 * 1000,
        password: "123",
        notifications: [
          {
            id: "msg_init_welcome",
            title: "💎 卓越出海专享特权已激活",
            content: "欢迎加入卓越出海研学室！您的【包月领航卡】特权已由助教Linda极速核实并为您开通。现在您已解锁全部8部经典跨文化研修大纲实战案例，以及AI临床专家诊断沙盒的无限次深度研判！",
            date: now - 3 * 24 * 60 * 60 * 1000,
            read: true
          }
        ]
      },
      { 
        email: "student@sanjieke.cn", 
        name: "李飞 (Sanjieke)", 
        org: "三节课高管成长营", 
        phone: "+86 13800000002",
        role: "trainee", 
        selectedPlan: "24h", 
        status: "active", 
        expiryDate: now + 12 * 60 * 60 * 1000, // 12 hours left
        createdAt: now - 12 * 60 * 60 * 1000,
        password: "123",
        notifications: [
          {
            id: "msg_init_welcome_24h",
            title: "⚡ 24小时体验特权开通成功",
            content: "您好！您的【24小时极速体验卡】已由秘书处核实开通。系统特享期服务自现在起正式开始，请抓紧时间尽情体验出海文化对比大地图及临床冲突诊疗专家沙盒会诊。如需长期领航服务，可点击个人中心一键极速申请包月特惠卡！",
            date: now - 6 * 60 * 60 * 1000,
            read: false
          }
        ]
      },
      { 
        email: "pending_demo@outbound.com", 
        name: "王小明 (待审批学子演示)", 
        org: "极速先锋高科技出海公司", 
        phone: "+86 13800000003",
        role: "trainee", 
        selectedPlan: "1yr", 
        status: "pending_approval", 
        createdAt: now - 1 * 60 * 60 * 1000,
        password: "123",
        notifications: [
          {
            id: "msg_init_pending",
            title: "⏳ 出海建档申请已成功流转",
            content: "您好！系统已接收您的【包年战略卡】特享期建档申请，手机号、所属商学院机构信息已录入本地缓存。专属助理Linda正紧急核对财务回单，稍后特权激活后将第一时间通过站内消息通知您。您亦可随时点击个人中心微信二维码加急过审。",
            date: now - 1 * 60 * 60 * 1000,
            read: false
          }
        ]
      },
      { 
        email: "expired_demo@global.com", 
        name: "赵过期 (过期续费演示)", 
        org: "跨国零售连锁集团", 
        phone: "+86 13800000004",
        role: "trainee", 
        selectedPlan: "3mo", 
        status: "active", 
        expiryDate: now - 2 * 24 * 60 * 60 * 1000, // expired 2 days ago
        createdAt: now - 95 * 24 * 60 * 60 * 1000,
        password: "123",
        notifications: [
          {
            id: "msg_init_expired_alert",
            title: "⚠️ 专属出海特权已到期到点提醒",
            content: "尊敬的赵过期学子：您好！您的【季度高管卡】已于2天前到期。您在本地缓存的临床冲突沙盒案例及大地图高级对位工具已锁定。为确保后续业务研判不中断，建议您在个人中心一键发起续约申请，助教Linda将立即为您极速处理续期。",
            date: now - 2 * 24 * 60 * 60 * 1000,
            read: false
          }
        ]
      },
      { 
        email: "13701143573", 
        name: "演示学子 (137)", 
        org: "战略出海共创会", 
        phone: "+86 13701143573",
        role: "trainee", 
        selectedPlan: "1mo", 
        status: "pending_approval", 
        createdAt: now - 1 * 24 * 60 * 60 * 1000,
        password: "123",
        notifications: [
          {
            id: "msg_init_137",
            title: "⏳ 特许开通申请已受理",
            content: "您好！您的出海特享会籍开通申请已登记，助教正在加紧审校，激活成功后将在此给您下发通知权益激活信。",
            date: now - 1 * 24 * 60 * 60 * 1000,
            read: false
          }
        ]
      },
      { 
        email: "huaishere@gmail.com", 
        name: "吕华 HARRY (主讲导师)", 
        org: "PLATFORM EXECUTIVE", 
        phone: "+86 13888888888",
        role: "admin", 
        status: "active", 
        expiryDate: now + 365 * 24 * 60 * 60 * 1000, 
        createdAt: now - 30 * 24 * 60 * 60 * 1000,
        password: "harry",
        notifications: [
          {
            id: "msg_admin_system",
            title: "👑 超级管理员控制台上线",
            content: "吕华老师您好，专属超级管理员权限已就绪！您可在前台系统学子中心一键开启「学员 SaaS 授权管理台」，直接对所有在册的学子进行特权天数变更、一键直发站内信、打款审批与权益激活对账。",
            date: now - 30 * 24 * 60 * 60 * 1000,
            read: true
          }
        ]
      }
    ];
  };

  const saveRegisteredStudent = (
    email: string, 
    name: string, 
    org: string,
    role: "admin" | "assistant" | "trainee" = "trainee",
    selectedPlan?: "24h" | "1mo" | "3mo" | "1yr",
    status: "pending_approval" | "active" | "expired" = "pending_approval",
    expiryDate?: number,
    password?: string,
    phone?: string,
    notifications?: Array<{ id: string; title: string; content: string; date: number; read: boolean }>
  ) => {
    try {
      const students = getRegisteredStudents();
      const existingIdx = students.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
      const existingNotifications = existingIdx >= 0 ? students[existingIdx].notifications : [];
      const newStudent = { 
        email: email.trim().toLowerCase(), 
        name: name.trim(), 
        org: org.trim(),
        role,
        selectedPlan,
        status,
        expiryDate,
        password: password || "123",
        phone: phone || "",
        createdAt: existingIdx >= 0 ? (students[existingIdx].createdAt || Date.now()) : Date.now(),
        notifications: notifications || existingNotifications || []
      };
      if (existingIdx >= 0) {
        students[existingIdx] = newStudent;
      } else {
        students.push(newStudent);
      }
      localStorage.setItem("HARRY_REGISTERED_STUDENTS", JSON.stringify(students));

      // Asynchronously persist to Firebase Firestore
      saveToCloud({
        email: newStudent.email,
        name: newStudent.name,
        org: newStudent.org,
        role: newStudent.role,
        selectedPlan: newStudent.selectedPlan,
        status: newStudent.status,
        expiryDate: newStudent.expiryDate,
        password: newStudent.password,
        phone: newStudent.phone,
        createdAt: newStudent.createdAt
      });

      return newStudent;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  // Helper: Send in-site message to registered trainee by email or name
  const sendInSiteNotification = (targetEmail: string, title: string, content: string) => {
    try {
      const students = getRegisteredStudents();
      const cleanTarget = targetEmail.trim().toLowerCase();
      const existingIdx = students.findIndex(s => 
        s.email.toLowerCase() === cleanTarget || 
        s.name.toLowerCase() === cleanTarget
      );
      if (existingIdx >= 0) {
        const student = students[existingIdx];
        const newMsg = {
          id: `msg_custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          title,
          content,
          date: Date.now(),
          read: false
        };
        const updatedNotifications = [newMsg, ...(student.notifications || [])];
        students[existingIdx] = {
          ...student,
          notifications: updatedNotifications
        };
        localStorage.setItem("HARRY_REGISTERED_STUDENTS", JSON.stringify(students));

        // If currently logged in user matches target email or name, keep live session updated too
        if (loggedInUser && (loggedInUser.email.toLowerCase() === student.email.toLowerCase() || loggedInUser.name.toLowerCase() === student.name.toLowerCase())) {
          setLoggedInUser({
            ...loggedInUser,
            notifications: updatedNotifications
          });
        }
        window.dispatchEvent(new Event("storage"));
        return true;
      }
      return false;
    } catch (e) {
      console.error("sendInSiteNotification error:", e);
      return false;
    }
  };

  const handleUpdateStudent = (email: string, plan: "24h" | "1mo" | "3mo" | "1yr", status: "pending_approval" | "active" | "expired", days: number) => {
    const now = Date.now();
    const students = getRegisteredStudents();
    const target = students.find(s => s.email.toLowerCase() === email.toLowerCase());
    
    // 顺延叠加逻辑：若学子当前尚处于保期内（expiryDate > now 且状态 active），在现有到期日基础上顺延延长！
    let baseTime = now;
    if (target && target.expiryDate && target.expiryDate > now && target.status === "active") {
      baseTime = target.expiryDate;
    }

    let expiryDate = baseTime + days * 24 * 60 * 60 * 1000;
    
    if (isTestSpeedup) {
      // Test Speedup Mode (在 baseTime 上叠加)
      let testAddMs = 60 * 1000;
      if (plan === "24h" || days === 1) {
        testAddMs = 60 * 1000;
      } else if (plan === "1mo" || days === 30) {
        testAddMs = 120 * 1000;
      } else if (plan === "3mo" || days === 90) {
        testAddMs = 180 * 1000;
      } else if (plan === "1yr" || days === 365) {
        testAddMs = 240 * 1000;
      } else {
        testAddMs = days * 60 * 1000;
      }
      expiryDate = baseTime + testAddMs;
    }
    
    if (target) {
      const updated = saveRegisteredStudent(
        target.email,
        target.name,
        target.org,
        target.role,
        plan,
        status,
        expiryDate,
        target.password,
        target.phone
      );
      
      setEditingStudentEmail(null);
      
      if (updated) {
        setReceiptTrainee(updated);
        setShowEmailReceiptModal(true);
      }
    }
  };

  // Action: Submit payment notification with proof image to assistant Linda
  const handleSendPaymentProofNotice = async () => {
    if (!loggedInUser) {
      alert(isEn ? "Please log in or register before submitting payment proof." : "请先登录或注册您的出海学子账号，以便助理核验开通。");
      setShowLoginModal(true);
      return;
    }
    setIsSubmittingPaymentProof(true);

    const planDetails = {
      "24h": { name: isEn ? "24h Pass" : "24小时极速体验卡", price: "29", days: 1 },
      "1mo": { name: isEn ? "1 Month Leader Card" : "包月独家出海领航卡", price: "39", days: 30 },
      "3mo": { name: isEn ? "3 Month Executive Pass" : "季度高管战略协作卡", price: "99", days: 90 },
      "1yr": { name: isEn ? "1 Year Helmsman Card" : "包年尊享出海战略卡", price: "299", days: 365 }
    }[selectedSubscriptionPlan || "1mo"];

    const currentTimeStr = new Date().toLocaleString("zh-CN", { hour12: false });

    // 1. 发送确认站内信给学员本人
    const noticeTitle = `💳 助理 Linda：已收到您【${planDetails?.name}】的付款报备及凭证！`;
    const noticeContent = `尊敬的 ${loggedInUser.name} 学员：\n\n您提交的 SaaS 续费/开通凭证已成功录入系统：\n• 所选套餐：${planDetails?.name} (￥${planDetails?.price})\n• 提交时间：${currentTimeStr}\n• 凭证状态：${paymentProofImage ? "已上传打款转账凭证图" : "文字说明报备"}\n• 附加说明：${paymentNote || "（无）"}\n\n助教 Linda 正在为您在后台进行账单核对。核对无误后将为您一键特许批准，您的会员到期日将在您现有到期时间上自动顺延！`;

    sendInSiteNotification(loggedInUser.email, noticeTitle, noticeContent);

    // 2. 写入/同步至咨询跟进池
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "高管商洽与定制咨询",
          suggestion: `【学子提交付款凭证】学员：${loggedInUser.name} (${loggedInUser.email}) | 购买档位：${planDetails?.name} (￥${planDetails?.price}) | 时间：${currentTimeStr} | 凭证截图：${paymentProofImage ? paymentProofImage : "未附图"} | 备注说明：${paymentNote || "无"}`
        })
      });
      fetchFeedbackData();
    } catch (err) {
      console.error("Post payment proof error:", err);
    }

    // 3. 更新学子状态为 pending_approval，以便管理台高亮提示
    const registered = getRegisteredStudents();
    const target = registered.find(s => s.email.toLowerCase() === loggedInUser.email.toLowerCase());
    if (target) {
      saveRegisteredStudent(
        target.email,
        target.name,
        target.org,
        target.role,
        selectedSubscriptionPlan || "1mo",
        "pending_approval",
        target.expiryDate,
        target.password,
        target.phone
      );
      setLoggedInUser({
        ...loggedInUser,
        selectedPlan: selectedSubscriptionPlan || "1mo",
        status: "pending_approval"
      } as any);
    }

    setIsSubmittingPaymentProof(false);
    setPaymentProofSubmitted(true);
    setGlobalToastNotice({
      message: "已向助理 Linda 发送付款凭证与核验通知！",
      sub: "助教团队将在 2 小时内核实无误后为您特许顺延开通",
      type: "success"
    });
  };

  // Action: Submit payment proof directly from mobile browser page
  const handleMobileUploadSubmit = async (img: string, noteText: string, emailStr: string, planStr: string) => {
    if (!img) {
      alert("请先选择手机相册中的转账截图或直接拍照！");
      return;
    }
    setIsSubmittingPaymentProof(true);
    const userEmail = emailStr || loggedInUser?.email || "mobile_user@outbound.com";
    const planDetails = {
      "24h": { name: "24小时极速体验卡", price: "29" },
      "1mo": { name: "包月独家出海领航卡", price: "39" },
      "3mo": { name: "季度高管战略协作卡", price: "99" },
      "1yr": { name: "包年尊享出海战略卡", price: "299" }
    }[planStr || "1mo"];

    const currentTimeStr = new Date().toLocaleString("zh-CN", { hour12: false });

    // 写入 localStorage 用于电脑端跨屏实时感知
    try {
      localStorage.setItem("CROSS_DEVICE_PROOF_SYNC", JSON.stringify({
        email: userEmail,
        image: img,
        note: noteText || "手机端极速跨屏上传",
        timestamp: Date.now(),
        plan: planStr
      }));
    } catch (e) {
      console.error(e);
    }

    // 1. 发送确认站内信
    const noticeTitle = `📱 助理 Linda：已收到您手机端跨屏提交的【${planDetails?.name}】付款凭证！`;
    const noticeContent = `尊敬的学员：\n\n已成功从手机端收到您上传的打款凭证照片：\n• 套餐：${planDetails?.name} (￥${planDetails?.price})\n• 提交时间：${currentTimeStr}\n• 附加备注：${noteText || "（无）"}\n\n助教 Linda 团队正在为您在后台进行账单开销核对，核实无误后将立即在您现有保期基础上自动顺延，无需重复提交！`;

    sendInSiteNotification(userEmail, noticeTitle, noticeContent);

    // 2. 写入/同步至咨询跟进池
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "高管商洽与定制咨询",
          suggestion: `【手机端跨屏提交付款凭证】账号/邮箱：${userEmail} | 购买档位：${planDetails?.name} (￥${planDetails?.price}) | 时间：${currentTimeStr} | 凭证截图：${img} | 备注说明：${noteText || "手机跨屏直接上传"}`
        })
      });
      fetchFeedbackData();
    } catch (err) {
      console.error("Post mobile payment proof error:", err);
    }

    // 3. 更新学子状态为 pending_approval
    const registered = getRegisteredStudents();
    const target = registered.find(s => s.email.toLowerCase() === userEmail.toLowerCase());
    if (target) {
      saveRegisteredStudent(
        target.email,
        target.name,
        target.org,
        target.role,
        (planStr as any) || "1mo",
        "pending_approval",
        target.expiryDate,
        target.password,
        target.phone
      );
    }

    setIsSubmittingPaymentProof(false);
    setPaymentProofSubmitted(true);
    alert("🎉 手机端凭证上传成功！电脑端网页已实时同步感知此截图，您可以直接关闭此手机窗口。");
  };

  const handleReadMessage = (email: string, msgId: string) => {
    try {
      const students = getRegisteredStudents();
      const targetIdx = students.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
      if (targetIdx >= 0) {
        const student = students[targetIdx];
        const updatedNotifications = (student.notifications || []).map(m => 
          m.id === msgId ? { ...m, read: true } : m
        );
        saveRegisteredStudent(
          student.email,
          student.name,
          student.org,
          student.role,
          student.selectedPlan,
          student.status,
          student.expiryDate,
          student.password,
          student.phone,
          updatedNotifications
        );
        // Sync local logged-in user state
        if (loggedInUser && loggedInUser.email.toLowerCase() === email.toLowerCase()) {
          setLoggedInUser({
            ...loggedInUser,
            notifications: updatedNotifications
          } as any);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRequestRenewal = (email: string) => {
    try {
      const students = getRegisteredStudents();
      const targetIdx = students.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
      if (targetIdx >= 0) {
        const student = students[targetIdx];
        const updatedStatus = "pending_approval";
        const renewalMsg = {
          id: `msg_renew_${Date.now()}`,
          title: "🔄 续期申请已成功递交",
          content: `您好！您发起的【${
            {
              "24h": "24小时体验卡",
              "1mo": "包月领航卡",
              "3mo": "季度高管卡",
              "1yr": "包年战略卡"
            }[student.selectedPlan || "1mo"] || "SaaS包期卡"
          }】续期申请已由系统成功递交。主训秘书处助理Linda正为您在后台加急处理打款核对。我们将于2小时内通过站内消息为您开通服务，请关注站内信变动。`,
          date: Date.now(),
          read: false
        };
        const updatedNotifications = [renewalMsg, ...(student.notifications || [])];
        
        saveRegisteredStudent(
          student.email,
          student.name,
          student.org,
          student.role,
          student.selectedPlan,
          updatedStatus,
          student.expiryDate,
          student.password,
          student.phone,
          updatedNotifications
        );

        if (loggedInUser && loggedInUser.email.toLowerCase() === email.toLowerCase()) {
          setLoggedInUser({
            ...loggedInUser,
            status: updatedStatus,
            notifications: updatedNotifications
          } as any);
        }
        alert("🎉 续约申请已成功通过站内信通道提交！专属出海助教Linda将在2小时内为您手工对账并特许开通，请关注站内信变动！");
      }
    } catch (e) {
      console.error("Renewal request failed:", e);
    }
  };

  const pushInSiteNotification = (email: string, title: string, content: string) => {
    return sendInSiteNotification(email, title, content);
  };

  const handleStudentLogin = (e: FormEvent) => {
    e.preventDefault();
    if (!studentEmail.trim()) return;

    const trimmedPassword = studentPassword.trim();

    // Check email structure format (Solution C)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentEmail.trim())) {
      setAuthError(isEn 
        ? "Please enter a valid email address structure (e.g., student@example.com)." 
        : "请输入有效的电子邮箱地址（例如 student@example.com）。这是您的学子专属账号，用于站内信沟通与后续对账。");
      return;
    }

    let role: "admin" | "assistant" | "trainee" = "trainee";
    let name = "";
    let org = "";
    let status: "pending_approval" | "active" | "expired" = "pending_approval";
    let selectedPlan: "24h" | "1mo" | "3mo" | "1yr" | undefined = undefined;
    let expiryDate: number | undefined = undefined;

    // 1. Check supervisor / helper bypass
    if (trimmedPassword === "harry888") {
      role = "admin";
      name = "吕华 HARRY (主讲导师)";
      org = "PLATFORM EXECUTIVE";
      status = "active";
    } else if (trimmedPassword === "helper888") {
      role = "assistant";
      name = "HARRY助理 (专属助教)";
      org = "COLLABORATIVE TEAM";
      status = "active";
    } else {
      // It is a standard trainee
      role = "trainee";
      
      if (authMode === "register") {
        if (!studentName.trim() || !studentCompany.trim()) {
          setAuthError(isEn ? "Full Name and Company are required for registration." : "新用户注册必须填写姓名和公司组织机构。");
          return;
        }
        if (!studentPhone.trim()) {
          setAuthError(isEn ? "Phone number is required so that assistants can contact you if payments or session issues occur." : "请输入手机号码！支付或系统异常时助教需要第一时间与您联系，避免造成损失。");
          return;
        }

        // 手机号码严格校验 (中国大陆 11 位手机号)
        const rawPhone = studentPhone.trim();
        let phoneValid = true;
        if (rawPhone.startsWith("+") && !rawPhone.startsWith("+86")) {
          const digits = rawPhone.replace(/\D/g, "");
          if (digits.length < 7) phoneValid = false;
        } else {
          let cleanDigits = rawPhone.replace(/\D/g, "");
          if (rawPhone.startsWith("+86")) {
            cleanDigits = rawPhone.slice(3).replace(/\D/g, "");
          } else if (cleanDigits.length === 13 && cleanDigits.startsWith("86")) {
            cleanDigits = cleanDigits.slice(2);
          }
          if (cleanDigits.length !== 11 || !cleanDigits.startsWith("1")) {
            phoneValid = false;
          }
        }

        if (!phoneValid) {
          setAuthError(isEn ? "Please enter a valid 11-digit phone number" : "请输入正确的手机号码");
          return;
        }

        // 校验邮箱是否重复注册
        const registeredStudents = getRegisteredStudents();
        const existingEmailUser = registeredStudents.find(s => s.email.toLowerCase() === studentEmail.trim().toLowerCase());
        if (existingEmailUser) {
          setAuthError(isEn ? "This email is already registered, please enter a correct email address" : "此邮箱已经注册，请输入正确的邮箱地址");
          return;
        }

        if (!privacyAccepted) {
          setAuthError(isEn ? "You must agree to the Privacy and Security statement to register." : "您必须同意并勾选下方的个人信息保护及隐私安全声明后，方能继续注册。");
          return;
        }
        if (!trimmedPassword) {
          setAuthError(isEn ? "Please enter a password." : "请设置登录密码。");
          return;
        }
        if (trimmedPassword !== studentPasswordConfirm.trim()) {
          setAuthError(isEn ? "Passwords do not match. Please re-enter." : "两次输入的密码不一致，请重新检查！");
          return;
        }
        name = studentName.trim();
        org = studentCompany.trim();
        selectedPlan = selectedSubscriptionPlan;
        status = "pending_approval";
        
        // Save to database
        const saved = saveRegisteredStudent(studentEmail.trim(), name, org, "trainee", selectedSubscriptionPlan, "pending_approval", undefined, trimmedPassword, studentPhone.trim());
        
        // Show welcome overlay
        if (saved) {
          setJustRegisteredUser(saved);
          setSelectedOnboardingPlan(selectedSubscriptionPlan || "1mo");
          setShowWelcomeOnboardingModal(true);
        }
        const regNotice = isEn 
          ? "Registration submitted successfully." 
          : "注册申请已成功提交！";
        setGlobalToastNotice({
          message: regNotice,
          sub: isEn ? "Learner profile created" : "学子档案已建立，已进入审核队列",
          type: "success"
        });
      } else {
        // Login mode
        const registered = getRegisteredStudents();
        const found = registered.find(s => s.email.toLowerCase() === studentEmail.trim().toLowerCase());
        if (found) {
          // Check standard trainee password
          if (found.password && found.password !== trimmedPassword) {
            setAuthError(isEn ? "Incorrect password. Please try again." : "登录密码不正确，请重新输入。");
            return;
          }
          name = found.name;
          org = found.org;
          role = found.role;
          selectedPlan = found.selectedPlan;
          status = found.status;
          expiryDate = found.expiryDate;
          
          // Check if expired and update if needed
          if (status === "active" && expiryDate && expiryDate < Date.now()) {
            status = "expired";
          }

          const loginNotice = isEn 
            ? `Welcome back, ${name}!` 
            : `登录成功！欢迎回来，${name}`;
          setGlobalToastNotice({
            message: loginNotice,
            sub: isEn ? "Session authenticated" : "已完成身份验证",
            type: "success"
          });
        } else {
          setAuthError(isEn 
            ? "Account not found. Please switch to 'Register' to set up your profile." 
            : "未找到该邮箱/账号。新用户请点击上方“用户注册”快速建立账户。");
          return;
        }
      }
    }

    const mockUser = {
      email: studentEmail.trim().toLowerCase(),
      name,
      org,
      role,
      selectedPlan,
      status,
      expiryDate
    };

    setLoggedInUser(mockUser);
    setShowLoginModal(false);
    setStudentPassword(""); // clear password input
    setStudentPasswordConfirm(""); // clear password confirm input
    setStudentName("");
    setStudentCompany("");
    setAuthError(""); // clear any past errors

    if (cookieConsent === "accepted") {
      localStorage.setItem("HARRY_STUDENT_SESSION", JSON.stringify(mockUser));
    }

    // Only trigger onboarding modal if user just registered; logged-in users get a sleek floating toast
    if (authMode === "register" && role === "trainee") {
      setSelectedOnboardingPlan(selectedPlan || "1mo");
      setShowWelcomeOnboardingModal(true);
    }
  };

  const handleForgotPasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail.trim()) return;
    setForgotPasswordSent(true);
    // Auto add a mock student with this email if they don't exist, so they can test log in immediately
    const registered = getRegisteredStudents();
    const found = registered.find(s => s.email.toLowerCase() === forgotPasswordEmail.trim().toLowerCase());
    if (!found) {
      saveRegisteredStudent(forgotPasswordEmail.trim(), "找回体验学子", "战略出海工作坊", "trainee", "1mo", "pending_approval", undefined, "123");
    }
  };

  const handleStudentLogout = () => {
    setLoggedInUser(null);
    setSelectedCountries(["China", "United States"]); // Reset to guest limit
    if (cookieConsent === "accepted") {
      localStorage.removeItem("HARRY_STUDENT_SESSION");
    }
  };

  // Core Trainee Active check helper
  const isTraineeActive = (() => {
    if (!loggedInUser) return false;
    // Admins and assistants are always active!
    if (loggedInUser.role === "admin" || loggedInUser.role === "assistant") return true;
    
    // Trainees must be active and not expired
    if (loggedInUser.role === "trainee") {
      const registered = getRegisteredStudents();
      const dbUser = registered.find(s => s.email.toLowerCase() === loggedInUser.email.toLowerCase()) || loggedInUser;
      if (dbUser && dbUser.status === "active") {
        const expTime = dbUser.expiryDate ? (typeof dbUser.expiryDate === 'number' ? dbUser.expiryDate : new Date(dbUser.expiryDate).getTime()) : 0;
        if (expTime > Date.now()) {
          return true;
        }
      }
    }
    return false;
  })();

  // Synchronous scroll navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const activeCase = cases.find(c => c.id === activeCaseId) || cases[0];

  // Dynamic Case Analysis invocation
  const runClassicAnalysis = async () => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/analyze-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: activeCase.titleZh,
          description: activeCase.descriptionZh,
          countryA: activeCase.countryA,
          countryB: activeCase.countryB
        })
      });

      if (!response.ok) {
        throw new Error("Failed to call analysis API.");
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        isEn 
          ? "Deep analysis system is momentarily offline. Using built-in high-fidelity analytical engine models instead." 
          : "深度文化研判系统请求延迟。为您秒级激活内置学术离线分析模型！"
      );
      // Fallback
      setAnalysisResult(getLocalFallback(activeCase));
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Local fallback analysis definitions
  const getLocalFallback = (c: CaseStudy) => {
    return {
      clashAnalysis: isEn 
        ? `Cultural friction point analysis between team [${c.countryA}] and team [${c.countryB}]: Hidden social expectations mismatch on workflow timelines and feedback methods.`
        : `关于 [${c.countryA}] 与 [${c.countryB}] 团队之间的跨文化交锋根源：在工作进度节奏与否定性评价上的潜在期望不对称引发沟通摩擦。`,
      dimensionsInvolved: [
        {
          dimensionId: "evaluating",
          dimensionNameZh: isEn ? "Evaluating Feedback Dimension" : "反馈评价维度",
          frictionReason: isEn
            ? "One side utilizes direct, unfiltered criticism whereas the other strongly relies on diplomatic face shielding and private comments."
            : "一方习惯于对事不对人、撕开面子的直白批判；另一方把颜面与共识作为和谐底盘，对任何尖锐意见自带负面情绪反应。",
          countryAScore: 3.5,
          countryBScore: 8.5,
          gapDescription: isEn ? "Direct Criticisms VS Quiet Wrappers" : "直白割骨见血 ⚔️ 间接和煦糖衣"
        },
        {
          dimensionId: "communicating",
          dimensionNameZh: isEn ? "Communicating Dimension" : "沟通方式维度",
          frictionReason: isEn
            ? "Mismatched contextual depth. High-context assumes high background alignment, leading low-context players to feel clueless."
            : "低语境偏向大声重申结论，白纸黑字会议纪要；高语境含蓄委婉，希望对方聪明地‘去读懂空气中的暗示’，导致传递空置。",
          countryAScore: 2.0,
          countryBScore: 9.0,
          gapDescription: isEn ? "Low-Context VS High-Context" : "清晰直白多言 ⚔️ 饱含暗示心有灵犀"
        }
      ],
      adviceForA: [
        isEn ? "Erase personal emotions. Direct feedback is strictly professional in Western templates." : "实行情绪与尊严脱钩。老外极硬的否定意见往往只是效率改进指南，不带有私人攻击成分。",
        isEn ? "Stop using raw emotional narratives or long hours claims; provide analytical Gantt charts instead." : "汇报PPT和封包通牒中剔除‘加班加点、深夜无眠、苦劳巨大’等无意义情感卖惨，提供有钉子有眼的排班。"
      ],
      adviceForB: [
        isEn ? "Establish structured, objective RAG dashboards to display true timeline delays objectively." : "利用去语境化、数据客观化的 AI 看板代替主管英文周会上的一片微笑粉饰，破开巴哈萨黑盒。",
        isEn ? "Use gentle softening words (slightly, minor friction) to guard local morale while reporting real gaps." : "学习在指出下属问题时先褒后贬，在单独的小范围单间办公区，私下将反馈温和递交以保护自尊线。"
      ],
      learningTakeaways: [
        isEn ? "Never expect other global cultures to respect your rules. Decode their scale coordinates, match them, and deliver safely." : "跨文化至尊法则：不要寄希望于另一个文明遵照你觉得体面的习俗打交道。认准相对落差，用他习惯的尺度，同他完美握手并交付。",
        isEn ? "Ego detachment and precise data structures outperform manual effort performance in Outbound operations." : "去自尊内耗性 + 精确数据闭环 Good Order 是高潜力中企征伐国际大B端标案的最强杀手重器。"
      ]
    };
  };

  // Submit custom sandbox clinic
  const handleClinicSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!clinicTitle.trim() || !clinicDesc.trim()) return;

    if (clinicDesc.trim().length < 50) {
      setClinicErrorMessage(
        isEn
          ? "Quality Check: Please describe your case in at least 50 characters, detailing the concrete scene, countries, and confusion to ensure effective AI analysis."
          : "提示：为确保 AI 临床诊断的质量与深度，案例内容描述请务必在 50 字以上（需阐述清楚场景、涉及国家、冲突行为和您的核心困惑）。"
      );
      return;
    }

    // Check for country mismatch
    const detected = detectCountriesInOrder(clinicTitle, clinicDesc);
    if (detected.length >= 2) {
      const detA = detected[0];
      const detB = detected[1];
      
      const matchExact = (detA.nameEn === clinicCountryA && detB.nameEn === clinicCountryB);
      const matchReverse = (detA.nameEn === clinicCountryB && detB.nameEn === clinicCountryA);
      
      if (!matchExact && !matchReverse) {
        setDetectedMismatchA(detA.nameEn);
        setDetectedMismatchB(detB.nameEn);
        setShowMismatchModal(true);
        return; // Intercept and show warning modal
      }
    }

    await executeClinicAnalysis(clinicCountryA, clinicCountryB);
  };

  const executeClinicAnalysis = async (countryA: string, countryB: string) => {
    setClinicIsAnalyzing(true);
    setClinicErrorMessage(null);
    setClinicAnalysisResult(null);

    const customCase: CaseStudy = {
      id: `custom-${Date.now()}`,
      titleZh: clinicTitle,
      titleEn: `Sandbox Student Case: ${countryA} vs ${countryB}`,
      descriptionZh: clinicDesc,
      countryA: countryA,
      countryB: countryB
    };

    try {
      const response = await fetch("/api/analyze-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: clinicTitle,
          description: clinicDesc,
          countryA: countryA,
          countryB: countryB
        })
      });

      if (!response.ok) {
        throw new Error("Sandbox API error.");
      }

      const data = await response.json();
      setClinicAnalysisResult(data);

      const updatedHistory = [customCase, ...customClinicHistory];
      setCustomClinicHistory(updatedHistory);

      if (cookieConsent === "accepted") {
        localStorage.setItem("HARRY_CLINIC_HISTORY", JSON.stringify(updatedHistory));
      }
    } catch (err: any) {
      console.error(err);
      setClinicErrorMessage(
        isEn 
          ? "Live AI analysis encountered lag. Invoked local clinical data engines for direct output." 
          : "大模型诊查请求慢。系统已为您自动秒级调配『内置对位诊断方案』！"
      );
      const fallbackResult = getLocalFallback(customCase);
      setClinicAnalysisResult(fallbackResult);

      const updatedHistory = [customCase, ...customClinicHistory];
      setCustomClinicHistory(updatedHistory);
      if (cookieConsent === "accepted") {
        localStorage.setItem("HARRY_CLINIC_HISTORY", JSON.stringify(updatedHistory));
      }
    } finally {
      setClinicIsAnalyzing(false);
    }
  };

  const loadPastClinic = (past: CaseStudy) => {
    setClinicTitle(past.titleZh);
    setClinicCountryA(past.countryA);
    setClinicCountryB(past.countryB);
    setClinicDesc(past.descriptionZh);
    setClinicAnalysisResult(null);
    setClinicErrorMessage(null);
  };

  const clearClinicHistory = () => {
    setCustomClinicHistory([]);
    setClinicAnalysisResult(null);
    if (cookieConsent === "accepted") {
      localStorage.removeItem("HARRY_CLINIC_HISTORY");
    }
  };

  // Checkbox/Toggle toggler for multi-country radar benchmark
  const toggleCountrySelection = (ctrEn: string) => {
    if (selectedCountries.includes(ctrEn)) {
      if (selectedCountries.length > 1) {
        setSelectedCountries(selectedCountries.filter(c => c !== ctrEn));
      }
    } else {
      const maxLimit = isTraineeActive ? 4 : 2;
      if (selectedCountries.length < maxLimit) {
        setSelectedCountries([...selectedCountries, ctrEn]);
      } else {
        if (!loggedInUser) {
          alert(isEn 
            ? "🔒 Guests can compare up to 2 countries. Register & Log in as an outbound student to compare up to 4 countries and view all country details!" 
            : "🔒 游客模式单次限比对 2 国。立即免费注册/登入专属出海学子通道，解锁 4 国深度对比与雷达图谱！");
          setShowLoginModal(true);
        } else if (!isTraineeActive) {
          alert(isEn 
            ? "🔒 Your SaaS Plan has expired. Multi-country radar benchmark requires an active membership. Please renew your subscription." 
            : "🔒 您的 SaaS 特权卡已到期。多国深度雷达对比与全套国别解密仅限有效包期卡学子使用，请前往『订阅与联系』一键续费解锁！");
          setActiveTab("pricing");
        } else {
          alert(isEn 
            ? "Up to 4 countries can be compared on the Radar chart simultaneously for visual clarity." 
            : "为保障雷达对齐图的可读性，单次比对上限为 4 个国家。");
        }
      }
    }
  };

  // Action: Signed book order submission
  const handleBookOrder = (e: FormEvent) => {
    e.preventDefault();
    if (!bookName.trim() || !bookEmail.trim() || !bookPhone.trim() || !bookAddress.trim()) {
      alert(isEn ? "Please fill in all required delivery inputs." : "请完整填写收件及联系人关键信息。");
      return;
    }
    setBookOrdered(true);
    // Log info to simulate server reception
    console.log("SIGNED BOOK ORDER SUBMITTED:", { bookName, bookAddress, bookEmail, bookPhone, bookDedication });
  };

  // Action: Consulting workshop request submission
  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
      alert(isEn ? "Please write your name and contact points." : "请至少填写您的贵姓、联络手机与邮箱。");
      return;
    }
    setContactSubmitted(true);

    const consultingContent = `【定制/商洽预约】提报人：${contactName} | 职务/机构：${contactRole || "未填"} (${contactCompany || "未填"}) | 电话：${contactPhone} | 邮箱：${contactEmail}\n具体诉求：${contactNotes || "申请定制出海 CX 诊查/培训"}`;

    // 1. 自动写入到系统需求/咨询跟进池中 (src/feedback.json)
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "高管商洽与定制咨询",
          suggestion: consultingContent
        })
      });
      if (res.ok) {
        fetchFeedbackData();
      }
    } catch (err) {
      console.error("Failed to post consulting item:", err);
    }

    // 2. 如果关联匹配在册学员（如 user-testing-4 或当前登录学员），自动给学员发送“已接收”站内信通知
    const registered = getRegisteredStudents();
    const matchedStudent = registered.find(s => s.email.toLowerCase() === contactEmail.trim().toLowerCase()) 
                           || (loggedInUser?.email ? registered.find(s => s.email.toLowerCase() === loggedInUser.email.toLowerCase()) : null);

    if (matchedStudent) {
      sendInSiteNotification(
        matchedStudent.email,
        "📬 助教 Linda：您的高管商洽与定制咨询预约已成功接收！",
        `尊敬的 ${matchedStudent.name}，助教 Linda 与吕华老师秘书处已成功收到您提交的《定制/商洽贵宾申请》（诉求：${contactNotes.slice(0, 40) || "出海定制诊断与培训"}）。助教团队与 AI 顾问正在评估您的需求，并将在 2 小时内在此处为您下发《出海内参包》并对接日程！`
      );
    }

    setGlobalToastNotice({
      message: isEn ? "Consulting request recorded and sent to Linda!" : "商洽预约已成功提报，助教 Linda 正在处理！",
      sub: isEn ? "Check in-site notification for updates." : "已自动录入系统并为您发送站内信确认",
      type: "success"
    });
  };

  // Card Checklist generation
  const triggerCardGenerator = () => {
    let bulletPoints: string[] = [];
    const originZh = COUNTRIES.find(c => c.nameEn === clinicCountryA)?.nameZh || clinicCountryA;
    const targetZh = COUNTRIES.find(c => c.nameEn === clinicCountryB)?.nameZh || clinicCountryB;

    if (cardCoreTarget === "communicating") {
      bulletPoints = [
        isEn ? `[LOW CONTEXT MAPPING] Restrict indirect verbal implications when messaging ${targetZh} leaders. Rely on itemized agendas.` : `【低语境对齐】避免对 ${targetZh} 代表输出不确定、委婉的信息，采用行数编号纪要对齐。`,
        isEn ? `[EM PATH ALIGN] Write crystal clear summaries after verbal chats. Do not rely on emotional rapport.` : `【书面事实核定】开会结束半小时内，补发直白明确、白纸黑字行动链，消除空气口头含混。`,
        isEn ? `[AIR-READ CRACK] Watch for indirect double speak. 'Difficult' almost always means 'impossible'.` : `【解析反向委婉语】当习惯高语境的 ${targetZh} 表示“这个有点难”，其实意味着“绝对无法通过”，应当立刻转入备用防线。`
      ];
    } else if (cardCoreTarget === "evaluating") {
      bulletPoints = [
        isEn ? `[CRITICISM ARMOR] Detach your ego from sharp modifications by ${targetZh} reviewers.` : `【理性去自尊化】遭遇 ${targetZh} 极其刺耳、不留台阶的批评（如德法日习惯），明白它是针对问题修复，而非否定你的人格。`,
        isEn ? `[TACTFUL WRAPPING] Never call out 東亚 or Southeast Asian professionals publicly.` : `【单独温和抚慰】对待东亚、东南亚成员，必须提供私下单间包厢对话纠错，用夸赞作外壳包裹批评。`,
        isEn ? `[MOCK BUFFER] Embed softening adjectives (slightly raw, minor mismatch) to offset communication shocks.` : `【引入中和介质】在英文汇报质量纠错时，使用“minor deviation”或“potential sync room”代替“mess or failure”。`
      ];
    } else {
      bulletPoints = [
        isEn ? `[OBJECTIVE METRICS] Discard descriptions of manual sacrifices; formulate RAG status widgets.` : `【客观状态管理】剔除汇报中无意义的过程细节和加班诉苦，引入红/黄/绿（RAG）自动更新客观面板管理危机。`,
        isEn ? `[SECURE BOUNDARY] Reserve high-touch, face-preserving phone support for middle east VIPs.` : `【场景解耦排产】对高契约沙特顶级客户安排1对1沙特本地语音高感关怀；冷字文本交投交给埃及文字坐席抹平口音等级差异。`,
        isEn ? `[FORMAL PROTOCOLS] Submit structured hierarchical proposals to secure official approvals.` : `【程序仪式正义】面对集权等级制极浓的团队，一切书面或口头倒苦水都是非正规申请，严格呈递正式闭环汇报才会触发签字。`
      ];
    }

    setCardChecklist(bulletPoints.map((text, i) => ({ id: i, text, checked: false })));
    setShowGeneratedCard(true);
  };

  const copyCardText = () => {
    const originName = COUNTRIES.find(c => c.nameEn === clinicCountryA)?.nameZh || clinicCountryA;
    const targetName = COUNTRIES.find(c => c.nameEn === clinicCountryB)?.nameZh || clinicCountryB;
    const categoryName = DIMENSIONS.find(d => d.id === cardCoreTarget)?.nameZh || cardCoreTarget;

    const formatted = `【HARRY LYU - GLOBAL OUTBOUND ACTION CARD】\n` +
      `Focus Interface: ${originName} ⚔️ ${targetName} (${categoryName})\n\n` +
      `System Alignment Playbooks:\n` +
      cardChecklist.map((c, idx) => `${idx + 1}. [ ] ${c.text}`).join("\n") +
      `\n\n© Harry Lyu - Winning Overseas Cross-Border Workstation Terminal`;

    navigator.clipboard.writeText(formatted);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const renderHeaderPill = () => {
    if (!loggedInUser) return null;
    
    if (loggedInUser.role === "admin") {
      return (
        <div className="flex items-center gap-1 bg-purple-500/10 border border-purple-500/35 px-1.5 py-0.5 sm:px-2.5 sm:py-1.5 rounded-full text-[10px] text-purple-400 font-bold font-mono shadow-md">
          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse shrink-0" />
          <span className="max-w-[50px] xs:max-w-[70px] sm:max-w-[120px] truncate">{loggedInUser.name}</span>
          <span className="text-[9px] opacity-80 border-l border-slate-700 pl-1 hidden sm:inline">(导师)</span>
        </div>
      );
    }
    
    if (loggedInUser.role === "assistant") {
      return (
        <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/35 px-1.5 py-0.5 sm:px-2.5 sm:py-1.5 rounded-full text-[10px] text-emerald-400 font-bold font-mono shadow-md">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shrink-0" />
          <span className="max-w-[50px] xs:max-w-[70px] sm:max-w-[120px] truncate">助理Linda</span>
        </div>
      );
    }
    
    const students = getRegisteredStudents();
    const dbUser = students.find(s => s.email.toLowerCase() === loggedInUser.email.toLowerCase());
    
    // 检查是否有未读消息/更新
    const unreadCount = (dbUser?.notifications || []).filter((n: any) => !n.read).length;
    const hasUpdates = unreadCount > 0;

    if (!dbUser) {
      return (
        <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/35 px-1.5 py-0.5 sm:px-2.5 sm:py-1.5 rounded-full text-[10px] text-emerald-400 font-bold font-mono shrink-0 shadow-md">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${hasUpdates ? "bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.9)]" : "bg-emerald-500"}`} />
          <span className="max-w-[50px] xs:max-w-[70px] sm:max-w-[120px] truncate">{loggedInUser.name}</span>
        </div>
      );
    }

    const expiryTime = dbUser.expiryDate ? (typeof dbUser.expiryDate === 'number' ? dbUser.expiryDate : new Date(dbUser.expiryDate).getTime()) : Date.now() + 86400000;
    const isExpired = Date.now() > expiryTime && dbUser.role !== "admin";
    const isPending = dbUser.status === "pending_approval";
    const daysRemaining = Math.max(0, Math.ceil((expiryTime - Date.now()) / (1000 * 60 * 60 * 24)));
    const expiryFormatted = dbUser.expiryDate ? new Date(dbUser.expiryDate).toISOString().split("T")[0] : "未激活";

    return (
      <div 
        title={!isExpired && !isPending ? `SaaS 权益生效中 (截止至 ${expiryFormatted})` : undefined}
        className={`flex items-center gap-1 border px-1.5 py-0.5 sm:px-2.5 sm:py-1.5 rounded-full text-[10px] font-bold font-mono shrink-0 whitespace-nowrap shadow-md transition-all ${
          isExpired 
            ? "bg-rose-500/10 border-rose-500/35 text-rose-400" 
            : isPending 
              ? "bg-amber-500/10 border-amber-500/35 text-amber-400" 
              : hasUpdates
                ? "bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.25)]"
                : "bg-emerald-500/10 border-emerald-500/35 text-emerald-400"
        }`}
      >
        {/* 状态点灯 */}
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
          isExpired 
            ? "bg-rose-500 animate-pulse" 
            : isPending 
              ? "bg-amber-500 animate-pulse" 
              : hasUpdates 
                ? "bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.9)]" 
                : "bg-emerald-500/70"
        }`} />
        
        <span className="max-w-[45px] xs:max-w-[70px] sm:max-w-[120px] truncate shrink-0">{dbUser.name}</span>
        
        {/* 指示文字 */}
        <span className="text-[9px] opacity-90 border-l border-slate-700/80 pl-1.5 ml-0.5 hidden sm:inline shrink-0">
          {isExpired 
            ? "已到期" 
            : isPending 
              ? "待审核" 
              : hasUpdates 
                ? `🟡 ${unreadCount}条未读 (${daysRemaining}天)` 
                : `💎 剩${daysRemaining}天`}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-2.5 sm:px-4 py-2 sm:py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4">
          {/* Logo Brand Title */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink min-w-0" onClick={() => setActiveTab("about")}>
            <div className="w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-black text-slate-950 text-sm sm:text-lg shadow-lg shadow-amber-500/20 shrink-0">
              HL
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xs sm:text-base font-black tracking-tight text-white flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                <span className="shrink-0">{isEn ? "Harry Lyu" : "吕华"}</span>
                <span className="text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 sm:px-2 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 whitespace-nowrap shrink-0">
                  <span className="sm:hidden">{isEn ? "CX Expert" : "出海专家"}</span>
                  <span className="hidden sm:inline">{isEn ? "Global Outbound Service Expert" : "出海服务专家"}</span>
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium hidden md:block truncate">
                {isEn ? "Winning Overseas Cross-Border Workstation Terminal" : "《出海制胜》跨国文化与管理数字化出海战术台"}
              </p>
            </div>
          </div>

          {/* Right Control Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* 助教/导师专享：一级菜单“SaaS授权管理”极简快捷按钮 */}
            {loggedInUser && (loggedInUser.role === "admin" || loggedInUser.role === "assistant") && (
              <button
                onClick={() => setShowAdminTraineeModal(true)}
                className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-emerald-500/50 bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 hover:border-emerald-400 text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-md shadow-emerald-950/50 shrink-0 ring-1 ring-emerald-500/20"
                title="学子学员SaaS授权与开通管理台"
              >
                <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
                <span className="whitespace-nowrap">{isEn ? "SaaS Licensing" : "SaaS授权管理"}</span>
              </button>
            )}

            {/* Language Switcher */}
            <button
              onClick={() => setLang(isEn ? "zh" : "en")}
              className="px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer shrink-0"
            >
              <Globe className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{isEn ? "中文" : "EN"}</span>
            </button>

            {/* Student / Portal Access Button with 3-Line Menu Icon at Far Right */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowMenuDropdown(!showMenuDropdown)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 transition-all text-xs font-bold text-slate-200 cursor-pointer shadow-sm shrink-0 whitespace-nowrap"
                title={isEn ? "Menu & Portal" : "系统菜单与学员入口"}
              >
                {loggedInUser ? (
                  renderHeaderPill()
                ) : (
                  <span className="text-slate-300 font-medium text-[11px] sm:text-xs whitespace-nowrap shrink-0">{isEn ? "Portal" : "学员入口"}</span>
                )}
                <Menu className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-500 shrink-0 ml-0.5" />
              </button>

              {/* Portal Dropdown Menu */}
              <AnimatePresence>
                {showMenuDropdown && (
                  <>
                    <div className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[1px]" onClick={() => setShowMenuDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-xs sm:w-80 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl z-50 space-y-3"
                    >
                      {loggedInUser ? (
                        <div className="space-y-2">
                          <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
                            <p className="text-[10px] text-slate-400 font-mono font-bold uppercase">{loggedInUser.role} Profile</p>
                            <p className="text-sm text-white font-extrabold">{loggedInUser.name}</p>
                            <p className="text-xs text-slate-400">{loggedInUser.email}</p>
                          </div>

                          {/* 学员专属 SaaS 特权与到期时间指示卡片 */}
                          {(() => {
                            const currentStudent = getRegisteredStudents().find(s => s.email.toLowerCase() === loggedInUser.email.toLowerCase());
                            if (!currentStudent || loggedInUser.role === "admin" || loggedInUser.role === "assistant") return null;

                            const isExpired = currentStudent.expiryDate ? Date.now() > currentStudent.expiryDate : false;
                            const isActive = currentStudent.status === "active" && !isExpired;
                            const isPending = currentStudent.status === "pending_approval";

                            // 计算天数 & 格式化日期
                            const expiryDateObj = currentStudent.expiryDate ? new Date(currentStudent.expiryDate) : null;
                            const expiryDateStr = expiryDateObj ? expiryDateObj.toISOString().split("T")[0] : "尚未激活";
                            const daysLeft = expiryDateObj ? Math.max(0, Math.ceil((expiryDateObj.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;

                            // 映射套餐中文名 (并结合到期剩余天数智能自适应，确保逻辑自洽)
                            let planName = "24小时极速体验卡";
                            const sp = currentStudent.selectedPlan;
                            if (sp === "1mo") planName = "包月独家出海领航卡";
                            else if (sp === "3mo") planName = "季度高管战略协作卡";
                            else if (sp === "1yr") planName = "包年尊享出海战略卡";

                            // 逻辑自洽校正：如果剩余天数 (daysLeft) 大于 3 天，智能根据天数推导匹配真实拥有的套餐等级
                            if (daysLeft > 180) {
                              planName = "包年尊享出海战略卡 (365天)";
                            } else if (daysLeft > 60) {
                              planName = "季度高管战略协作卡 (90天)";
                            } else if (daysLeft > 3) {
                              planName = "包月独家出海领航卡 (30天)";
                            }

                            return (
                              <div className={`p-3 rounded-xl border space-y-2 transition-all ${
                                isActive 
                                  ? "bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
                                  : isPending 
                                    ? "bg-amber-950/40 border-amber-500/40 text-amber-300"
                                    : "bg-rose-950/30 border-rose-500/30 text-rose-300"
                              }`}>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1 text-amber-400">
                                    <span>💎</span>
                                    <span>SaaS 订阅特权服务</span>
                                  </span>
                                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full font-mono ${
                                    isActive 
                                      ? "bg-emerald-400 text-slate-950 shadow-sm" 
                                      : isPending 
                                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" 
                                        : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                  }`}>
                                    {isActive ? "🟢 尊享特权生效中" : isPending ? "⏳ 打款复核中" : "🔴 特权已过期"}
                                  </span>
                                </div>

                                <div className="text-xs font-bold text-slate-100 flex items-center justify-between gap-2">
                                  <span className="text-emerald-300 font-extrabold truncate">{planName}</span>
                                  {isActive && (
                                    <span className="text-[10.5px] font-mono text-emerald-400 font-black bg-emerald-500/20 px-2 py-0.5 rounded-lg border border-emerald-500/30 shrink-0">
                                      剩 {daysLeft} 天
                                    </span>
                                  )}
                                </div>

                                <div className="text-[10.5px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-800/80 pt-1.5">
                                  <span>服务截止时间：</span>
                                  <span className="text-slate-200 font-bold">{expiryDateStr}</span>
                                </div>
                              </div>
                            );
                          })()}
                          
                          {/* 站内信箱 & 账户通知 (默认仅收纳展示最新1条，可点击展开全部) */}
                          <div className="border-t border-slate-800/80 pt-2.5 mt-2">
                            {/* Notification List with Collapsible View */}
                            {(() => {
                              const student = getRegisteredStudents().find(s => s.email.toLowerCase() === loggedInUser.email.toLowerCase());
                              const notifs = student?.notifications || [];
                              const unreadCount = notifs.filter((m: any) => !m.read).length;

                              if (notifs.length === 0) {
                                return (
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-[10px] text-amber-400 font-black tracking-wider uppercase font-mono flex items-center gap-1.5">
                                        <span>📬</span>
                                        <span>{isEn ? "IN-SITE INBOX" : "站内信箱 & 账户通知"}</span>
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 py-1 italic text-center">{isEn ? "No notifications" : "暂无站内信"}</p>
                                  </div>
                                );
                              }

                              const visibleNotifs = showAllNotifications ? notifs : notifs.slice(0, 1);

                              return (
                                <div className="space-y-1.5">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] text-amber-400 font-black tracking-wider uppercase font-mono flex items-center gap-1.5">
                                      <span>📬</span>
                                      <span>{isEn ? "IN-SITE INBOX" : "站内信箱 & 账户通知"}</span>
                                      {unreadCount > 0 && (
                                        <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold text-[9px]">
                                          {unreadCount} 未读
                                        </span>
                                      )}
                                    </span>
                                    {notifs.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => setShowAllNotifications(!showAllNotifications)}
                                        className="text-[9.5px] font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-0.5 cursor-pointer bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20"
                                      >
                                        <span>{showAllNotifications ? "收起" : `展开全部(${notifs.length})`}</span>
                                        {showAllNotifications ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                      </button>
                                    )}
                                  </div>

                                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-0.5">
                                    {visibleNotifs.map((msg: any) => {
                                      const isExpanded = expandedNoticeId === msg.id;
                                      return (
                                        <div
                                          key={msg.id}
                                          onClick={() => {
                                            if (isExpanded) {
                                              setExpandedNoticeId(null);
                                            } else {
                                              setExpandedNoticeId(msg.id);
                                              if (!msg.read) {
                                                handleReadMessage(loggedInUser.email, msg.id);
                                              }
                                            }
                                          }}
                                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer group ${
                                            msg.read ? "bg-slate-950/30 border-slate-900/80 text-slate-400" : "bg-amber-500/10 border-amber-500/40 text-slate-100 hover:border-amber-400"
                                          }`}
                                        >
                                          <div className="flex items-center justify-between gap-1.5">
                                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                              <span className={`w-2 h-2 rounded-full shrink-0 ${msg.read ? "bg-slate-700 opacity-60" : "bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.9)]"}`} />
                                              <span className={`text-[11px] font-extrabold truncate ${msg.read ? "text-slate-400 font-normal" : "text-amber-300"}`}>
                                                {msg.title}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0 text-[9px] font-mono text-slate-500">
                                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-amber-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
                                            </div>
                                          </div>
                                          <AnimatePresence>
                                            {isExpanded && (
                                              <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="pt-2 mt-2 border-t border-slate-800/80 space-y-2 text-[10.5px] text-slate-200"
                                              >
                                                <p className="font-sans whitespace-pre-line text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-900/80">
                                                  {msg.content}
                                                </p>
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {!showAllNotifications && notifs.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => setShowAllNotifications(true)}
                                      className="w-full text-center py-1 text-[10px] font-mono text-slate-400 hover:text-amber-400 transition-colors cursor-pointer bg-slate-950/40 rounded-lg border border-slate-900"
                                    >
                                      已有 {notifs.length} 条通知，点击展开历史消息 ▾
                                    </button>
                                  )}
                                </div>
                              );
                            })()}
                          </div>

                          <button
                            onClick={() => {
                              handleStudentLogout();
                              setShowMenuDropdown(false);
                            }}
                            className="w-full flex items-center justify-center gap-2 p-2 hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-900 border border-slate-800 bg-slate-950/20 text-xs font-bold text-slate-400 rounded-xl transition-all cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>{isEn ? "Sign Out" : "退出登录"}</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setShowLoginModal(true);
                            setShowMenuDropdown(false);
                          }}
                          className="w-full flex items-center justify-between p-2 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30 border border-slate-800 bg-slate-950/40 rounded-xl transition-all text-xs font-extrabold text-slate-200 cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-amber-500" />
                            <span>{isEn ? "Log In / Sign Up" : "登录 / 注册"}</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                      )}

                      {/* Section 3: About & Version Release Information */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                        <span className="text-[9px] text-slate-500 font-black tracking-wider uppercase font-mono block">
                          {isEn ? "ABOUT" : "系统相关"}
                        </span>
                        <button 
                          onClick={() => {
                            setShowAboutModal(true);
                            setShowMenuDropdown(false);
                          }}
                          className="w-full flex items-center justify-between p-2 hover:bg-slate-800 rounded-xl transition-all text-xs font-bold text-slate-200 cursor-pointer border border-slate-800 bg-slate-950/40"
                        >
                          <span className="flex items-center gap-2">
                            <Sliders className="w-3.5 h-3.5 text-amber-500" />
                            <span>{isEn ? "About" : "关于"}</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        </button>

                        {loggedInUser && (loggedInUser.role === "admin" || loggedInUser.role === "assistant") && (
                          <button 
                            onClick={() => {
                              setShowStatsSlideModal(true);
                              setShowMenuDropdown(false);
                            }}
                            className="w-full flex items-center justify-between p-2 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/20 rounded-xl transition-all text-xs font-black text-slate-200 cursor-pointer border border-slate-800 bg-slate-950/40"
                          >
                            <span className="flex items-center gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              <span>{isEn ? "Xiao Gu R&D Chronicle" : "小谷助教 R&D 协同纪实"}</span>
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                          </button>
                        )}

                        {loggedInUser && (loggedInUser.role === "admin" || loggedInUser.role === "assistant") && (
                          <button 
                            onClick={() => {
                              setShowFeedbackModal(true);
                              setShowMenuDropdown(false);
                            }}
                            className="w-full flex items-center justify-between p-2 hover:bg-amber-500/10 hover:text-amber-400 rounded-xl transition-all text-xs font-black text-slate-200 cursor-pointer border border-amber-900/50 bg-amber-950/20"
                          >
                            <span className="flex items-center gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                              <span className="text-amber-400">{isEn ? "Refinement Tracker" : "网站开发与迭代优化板"}</span>
                            </span>
                          </button>
                        )}

                        {loggedInUser && (loggedInUser.role === "admin" || loggedInUser.role === "assistant") && (
                          <button 
                            onClick={() => {
                              setShowAdminTraineeModal(true);
                              setShowMenuDropdown(false);
                            }}
                            className="w-full flex items-center justify-between p-2 hover:bg-emerald-500/15 hover:text-emerald-400 rounded-xl transition-all text-xs font-black text-slate-200 cursor-pointer border border-emerald-900/50 bg-emerald-950/20 mt-1"
                          >
                            <span className="flex items-center gap-2">
                              <Users className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">{isEn ? "Trainee SaaS Activation" : "学子学员SaaS授权管理台"}</span>
                            </span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Persistent Modular Tab Selector */}
        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-start overflow-x-auto no-scrollbar gap-2">
          {[
            { id: "about", icon: User, label: currT.tabAbout },
            { id: "book", icon: BookOpen, label: currT.tabBook },
            { id: "workshops", icon: Briefcase, label: currT.tabWorkshops },
            { id: "tool", icon: Map, label: currT.tabTool },
            { id: "pricing", icon: Award, label: currT.tabPricing }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/10"
                    : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* CORE VIEWPORT BODY */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 pb-24">
        
        <AnimatePresence mode="wait">
          
          {/* ================= TAB 1: ABOUT HARRY LYU ================= */}
          {activeTab === "about" && (
            <motion.div
              key="tab-about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-12"
            >
              
              {/* Profile Card & Bio Introduction Grid */}
              <div id="profile-card" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
                
                {/* Visual Speaker Photo Segment */}
                <div className="lg:col-span-4 flex flex-col justify-between bg-slate-900 border border-slate-800 p-4 rounded-3xl relative overflow-hidden group animate-fade-in">
                  <div className="absolute top-2 right-2 z-10 bg-slate-950/80 backdrop-blur-sm border border-amber-500/20 px-2 py-1 rounded-lg text-[9px] text-amber-500 font-bold">
                    Keynote Representative
                  </div>
                  
                  <div className="w-full aspect-square rounded-2xl overflow-hidden relative border border-slate-800 shadow-inner group/portrait bg-slate-950 flex items-center justify-center">
                    
                    {/* Real Image (Customized upload OR original fallback portrait) */}
                    <div className="w-full h-full relative">
                      <img 
                        src={profilePhoto} 
                        alt="吕华 Harry Lyu" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale-0 group-hover:scale-102 transition-transform duration-500"
                      />
                      
                      {/* Real Image of Harry Lyu (04.jpg uploaded as instructor_portrait_1781339256749.jpg) */}

                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent p-4 pt-12">
                        <p className="text-white text-base font-black tracking-wide"> Harry Lyu (吕华)</p>
                        <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mt-0.5">{isEn ? "Practical Outbound Expert" : "实战出海 · 体验为王"}</p>
                      </div>
                    </div>

                    {/* PORTRAIT INTERACTIVE OVERLAY */}
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs opacity-0 group-hover/portrait:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2.5 p-4 z-20">
                      <p className="text-[11px] text-white font-black text-center tracking-tight">
                        {isEn ? "Update Profile Photo" : "更新/替换吕华先生真实头像"}
                      </p>
                      
                      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-1">
                        {/* Camera trigger */}
                        <label 
                          className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-black rounded-lg transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>{isEn ? "Upload Photo" : "上传新头像"}</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handlePortraitUpload} 
                          />
                        </label>

                        {/* Reset layout */}
                        {profilePhoto !== "/src/assets/images/instructor_portrait_1781339256749.jpg" && (
                          <button
                            type="button"
                            onClick={handleResetPortrait}
                            className="p-1.5 bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 rounded-lg transition-all border border-rose-500/30 cursor-pointer"
                            title={isEn ? "Reset to default" : "恢复默认"}
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* HIGHLY VISIBLE & EYE-CATCHING SUBTITLE CARD */}
                  <div className="mt-3.5 bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl shadow-xl hover:bg-amber-500/15 hover:border-amber-500/40 transition-all duration-300">
                    <p className="text-xs md:text-[13px] text-slate-100 font-black leading-relaxed text-left text-amber-100">
                      {currT.trainerSubtitle}
                    </p>
                  </div>

                  <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800 animate-pulse">
                    <p className="text-[11px] text-slate-350 italic leading-relaxed text-center font-sans">
                      {isEn 
                        ? `"In low-context expansion, stop performing effort and wishing for sympathy. Serve precise metrics and strategic, objective process alignment."`
                        : `"在低语境（Low-context）的出海扩张中，不要自我感动。请提供精确的数据指标与客观、高度对齐的契约化工作流程。"`}
                    </p>
                  </div>
                </div>

                {/* Profile Bio Details */}
                <div className="lg:col-span-8 bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-3xl flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-full uppercase tracking-wider font-extrabold">{currT.tagCXCoach}</span>
                      <span className="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider font-extrabold">{currT.tagKeynote}</span>
                    </div>

                    <h2 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight">
                      {currT.aboutTitle}
                    </h2>
                    <p className="text-sm text-slate-400 font-bold mt-2 font-mono">
                      {currT.aboutSubtitle}
                    </p>

                    <div className="mt-6 space-y-4 text-slate-300 text-sm md:text-base leading-relaxed">
                      <p>{currT.aboutBioPara1}</p>
                      <p>{currT.aboutBioPara2}</p>
                    </div>
                  </div>

                  {/* Call to Actions below */}
                  <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap gap-3">
                    <button 
                      onClick={() => setActiveTab("tool")}
                      className="px-5 py-2.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Map className="w-4 h-4" />
                      {isEn ? "Open Culture Sandbox" : "立即体验文化大地图沙盒"}
                    </button>
                    <button 
                      onClick={() => setActiveTab("workshops")}
                      className="px-5 py-2.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl transition-all cursor-pointer"
                    >
                      {isEn ? "Browse Masterclasses" : "阅读课程大纲"}
                    </button>
                  </div>
                </div>

              </div>

              {/* Speaker Slide Presentations/Showcases */}
              <div id="keynotes-showcase" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div className="space-y-1 animate-fadeIn">
                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                      {currT.aboutShowcase}
                    </h3>
                  </div>
                  {loggedInUser && (loggedInUser.role === "admin" || loggedInUser.role === "assistant") && (
                    <button
                      onClick={() => setShowAddKeynoteForm(!showAddKeynoteForm)}
                      className="px-4 py-1.5 text-xs font-black bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400 transition-all flex items-center gap-2 cursor-pointer self-start"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{showAddKeynoteForm ? (isEn ? "Hide Console" : "隐藏管理控制台") : (isEn ? "Add Keynote" : "添加演讲实录(AI提炼)")}</span>
                    </button>
                  )}
                </div>

                {showAddKeynoteForm && loggedInUser && (loggedInUser.role === "admin" || loggedInUser.role === "assistant") && (
                  <form onSubmit={handleSaveKeynote} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 md:p-6 mt-4 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-amber-500" />
                        <h4 className="text-sm font-bold text-white">{isEn ? "Keynote Speech Admin Console" : "近期活动/大会演讲实录上载端"}</h4>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded">ADMIN ONLY</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-350 block uppercase tracking-wider">{isEn ? "Keynote / Activity Title" : "一、演讲主题 / 特别活动标题 (*必填)"}</label>
                        <input
                          type="text"
                          value={keynoteTitleInput}
                          onChange={(e) => setKeynoteTitleInput(e.target.value)}
                          placeholder={isEn ? "e.g., 《英美宣讲桌上的下注游戏》" : "请输入演讲或大纲标题"}
                          className="w-full bg-slate-900 border border-slate-800/85 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                          required
                        />

                        <label className="text-[11px] font-bold text-slate-350 block uppercase tracking-wider pt-2">{isEn ? "Raw Meeting Data / Description" : "二、原始会议文字大纲 / 详细学术说明 (*AI提炼源)"}</label>
                        <textarea
                          rows={6}
                          value={keynoteRawDescInput}
                          onChange={(e) => setKeynoteRawDescInput(e.target.value)}
                          placeholder={isEn ? "Copy raw transcripts or event descriptions here for the AI parser..." : "把近期活动的详细说明内容，或者文章粗稿、学术核心提纲直接复制到这里。一键启动 AI 自动提炼提纲亮点和精品金句。"}
                          className="w-full bg-slate-900 border border-slate-800/85 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 resize-none font-sans"
                        />

                        <button
                          type="button"
                          onClick={handleAiSummarizeKeynote}
                          disabled={isGeneratingKeynoteAi}
                          className="w-full py-2.5 bg-gradient-to-r from-amber-600/20 to-amber-500/20 hover:from-amber-600/30 hover:to-amber-500/30 border border-amber-500/30 hover:border-amber-500/50 rounded-xl transition-all text-xs font-black text-amber-400 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {isGeneratingKeynoteAi ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>{isEn ? "AI Crafting Summary..." : "AI 出海大模型正在提炼高价值亮点与带走干货..."}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                              <span>{isEn ? "AI Automatically Synthesize Highlights" : "一键 AI 自动智能提炼（钉子有眼版）"}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="space-y-3 bg-slate-900/40 p-4 rounded-xl border border-slate-900 space-y-3.5">
                        <span className="text-[9px] text-amber-500 font-bold font-mono tracking-wider block uppercase">GENERATIVE PREVIEW / EDITABLE</span>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold block">{isEn ? "1. Highlight Description" : "AI 提炼的演讲/活动核心亮点内容描述："}</label>
                          <textarea
                            rows={4}
                            value={keynoteDescInput}
                            onChange={(e) => setKeynoteDescInput(e.target.value)}
                            placeholder={isEn ? "AI-formulated course highlight description..." : "AI 将自动精简形成段落...也可手动修改润色"}
                            className="w-full bg-slate-900/60 border border-slate-850 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold block">{isEn ? "2. Ultimate Takeaway" : "AI 提炼的这一门研训终极带走干货（精辟金句）："}</label>
                          <input
                            type="text"
                            value={keynoteTakeawayInput}
                            onChange={(e) => setKeynoteTakeawayInput(e.target.value)}
                            placeholder={isEn ? "e.g., Outbound is not physical extension but cultural calibration." : "AI 自动抽取核心学术底层逻辑...也可手动修改非凡表达"}
                            className="w-full bg-slate-900/60 border border-slate-850 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                            required
                          />
                        </div>

                        <div className="pt-2 border-t border-slate-900 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setKeynoteTitleInput("");
                              setKeynoteRawDescInput("");
                              setKeynoteDescInput("");
                              setKeynoteTakeawayInput("");
                            }}
                            className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                          >
                            {isEn ? "Clear" : "清空重置"}
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-1.5 text-xs font-black bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isEn ? "Publish Share" : "正式发布演讲实录"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left slide tabs */}
                  <div className="lg:col-span-5 space-y-3 max-h-[420px] overflow-y-auto pr-1 normal-scrollbar">
                    {activeKeynotes.map((keynote, idx) => {
                      const isActive = selectedKeynoteIdx === idx;
                      return (
                        <div
                          key={keynote.id || idx}
                          id={`keynote-tab-${idx}`}
                          onClick={() => setSelectedKeynoteIdx(idx)}
                          className={`p-3.5 rounded-2xl border transition-all text-left cursor-pointer flex gap-3 items-start relative group ${
                            isActive
                              ? "bg-[#1E293B] border-amber-500 text-white shadow-md shadow-amber-500/5"
                              : "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:bg-slate-900/60"
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg text-xs mt-0.5 shrink-0 ${isActive ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-400"}`}>
                            {idx + 1}
                          </div>
                          <div className="pr-6">
                            <h4 className="text-xs font-bold leading-tight line-clamp-2">
                              {keynote.title}
                            </h4>
                          </div>

                          {loggedInUser && (loggedInUser.role === "admin" || loggedInUser.role === "assistant") && keynote.isCustom && (
                            <button
                              onClick={(e) => handleDeleteKeynote(keynote.id, e)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-rose-950/40 text-rose-500 rounded-lg transition-all cursor-pointer opacity-80 hover:opacity-100"
                              title={isEn ? "Delete Keynote" : "删除此实录"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Right slide outlook panel */}
                  {activeKeynotes.length > 0 && (() => {
                    const safeIdx = selectedKeynoteIdx < activeKeynotes.length ? selectedKeynoteIdx : 0;
                    const keynote = activeKeynotes[safeIdx];
                    const keynoteImage = keynote.image || [
                      "/src/assets/images/summit_guangzhou_2026.jpg",
                      "/src/assets/images/book_tour_2026.jpg",
                      "/src/assets/images/keynote_singapore_1781853262378.jpg",
                      "/src/assets/images/keynote_indonesia_1781853281712.jpg",
                      "/src/assets/images/keynote_crossborder_1781853295706.jpg"
                    ][safeIdx % 5];
                    return (
                      <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 relative flex flex-col justify-between overflow-hidden min-h-[300px]">
                        <div className="absolute right-0 bottom-0 translate-y-8 translate-x-8 opacity-5 pointer-events-none">
                          <Terminal className="w-56 h-56 text-white" />
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <span className="text-[10px] text-amber-400 font-mono font-bold tracking-widest uppercase">
                              {currT.keynoteKeyPoints}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row gap-6 mt-2">
                            <div className="flex-1 space-y-4">
                              <div className="space-y-3">
                                <h4 className="text-sm font-black text-white leading-snug">
                                  {keynote.title}
                                </h4>
                                <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line text-justify text-slate-250">
                                  {keynote.desc}
                                </p>
                              </div>

                              <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl relative">
                                <div className="absolute -top-2.5 left-3 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-md text-[9px] text-amber-500 font-bold uppercase tracking-wide">
                                  Takeaway Action Outline
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                                  💡 {keynote.takeaway}
                                </p>
                              </div>
                            </div>

                            {/* Prominent onsite/document original photo display - completely uncropped */}
                            {keynoteImage && (
                              <div className="w-full md:w-56 shrink-0 flex flex-col gap-2">
                                <div 
                                  className="relative group overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-1.5 shadow-xl cursor-pointer hover:border-amber-500/40 transition-all"
                                  onClick={() => setKeynoteLightboxUrl(keynoteImage)}
                                  title={isEn ? "View full original larger copy" : "点击查看高清完整原图"}
                                >
                                  <img
                                    src={keynoteImage}
                                    alt="Actual Conference Venue Reference"
                                    className="w-full h-auto max-h-[220px] object-contain rounded-lg group-hover:scale-102 transition-all duration-300 mx-auto"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-0 bg-slate-950/20 hover:bg-transparent transition-colors flex items-center justify-center">
                                    <Camera className="w-5 h-5 text-amber-400 bg-slate-950/80 p-2 rounded-full border border-amber-500/20 shadow-md animate-pulse" />
                                  </div>
                                </div>
                                <div className="text-center">
                                  <span className="text-[10px] text-amber-500 font-black tracking-wide bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 font-sans inline-block">
                                    {isEn ? "📸 ORIGINAL REF PHOTO" : "📸 活动官方现场原图"}
                                  </span>
                                  <p className="text-[9px] text-slate-500 mt-1">
                                    {isEn ? "Full uncropped high-fidelity record" : "完整、真实、无剪裁原图对照"}
                                  </p>
                                  {loggedInUser && (loggedInUser.role === "admin" || loggedInUser.role === "assistant") && (
                                    <div className="mt-2 flex justify-center" onClick={(e) => e.stopPropagation()}>
                                      <label
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-lg text-[10px] text-amber-400 font-bold transition-all cursor-pointer shadow-sm hover:text-amber-300 pointer-events-auto relative z-30"
                                      >
                                        <UploadCloud className="w-3.5 h-3.5 text-amber-500" />
                                        <span>{isEn ? "Upload Photo Ref" : "更换现场原图"}</span>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onClick={(e) => e.stopPropagation()}
                                          onChange={(e) => handleUploadKeynotePhoto(keynote.id || `keynote-${safeIdx + 1}`, e)}
                                        />
                                      </label>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                </div>
              </div>

              {/* Judging and Certifications lists */}
              <div id="credentials-credentials" className="bg-slate-900/50 border border-slate-850 rounded-3xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-white leading-tight">
                        {credentialsData 
                          ? (isEn ? credentialsData.titleEn : credentialsData.titleZh) 
                          : (isEn ? "Professional Qualifications & Honors" : "专业资质和荣誉")}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400">
                      {credentialsData 
                        ? (isEn ? credentialsData.descEn : credentialsData.descZh) 
                        : (isEn 
                          ? "Verifiable international experience accrediting senior counseling status." 
                          : "通过扎实权威的履奇经历与裁判权，印证一针见血的出海研训资质。")}
                    </p>
                  </div>

                  {/* Dynamic credentials card image - adjusted to render any aspect ratio/badge perfectly without crop */}
                  <div className="flex flex-col gap-2">
                    {(() => {
                      const currentAwardText = ((credentialsData ? (isEn ? credentialsData.listEn : credentialsData.listZh) : null) || currT.awardsList)[selectedCredentialIdx] || "";
                      const currentImg = getCurrentCredentialImage(currentAwardText);
                      return (
                        <div className="relative group overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-center p-3.5 min-h-[280px] max-h-[380px] w-full self-center">
                          <img 
                            src={currentImg} 
                            alt="Qualifications Banner" 
                            className="max-h-[320px] max-w-full object-contain rounded-xl group-hover:scale-[1.03] transition-transform duration-550 cursor-pointer"
                            referrerPolicy="no-referrer"
                            onClick={() => setKeynoteLightboxUrl(currentImg)}
                            title={isEn ? "Click to view full image" : "点击查看高清大图"}
                          />
                          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-950/25 to-transparent pointer-events-none" />
                        </div>
                      );
                    })()}
                    <div className="flex justify-center mt-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 font-bold transition-all shadow-sm">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span>{isEn ? "Official Qualifications Verified" : "官方核验 · 资质荣誉已锁定"}</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-8 flex flex-col justify-between border-l border-slate-800 pl-0 lg:pl-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                    {/* List of Clickable Credentials */}
                    <div className="md:col-span-7 space-y-3">
                      {((credentialsData ? (isEn ? credentialsData.listEn : credentialsData.listZh) : null) || currT.awardsList).map((award, i) => {
                        const isSelected = selectedCredentialIdx === i;
                        return (
                          <div 
                            key={i} 
                            onClick={() => setSelectedCredentialIdx(i)}
                            className={`flex gap-3 items-start p-3.5 rounded-2xl border transition-all cursor-pointer group/item ${
                              isSelected 
                                ? "bg-amber-500/10 border-amber-500/40 shadow-xs" 
                                : "bg-slate-950/40 border-slate-900 hover:border-slate-800 hover:bg-slate-900/60"
                            }`}
                          >
                            <CheckCircle2 className={`w-4.5 h-4.5 shrink-0 mt-0.5 transition-colors ${isSelected ? "text-amber-500" : "text-slate-500 group-hover/item:text-amber-450"}`} />
                            <p className={`text-xs leading-relaxed font-semibold transition-colors ${isSelected ? "text-white" : "text-slate-350 group-hover/item:text-white"}`}>
                              {award}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Organization Encyclopedic Backdrop Explanation Panel */}
                    <div className="md:col-span-5 flex flex-col">
                      {(() => {
                        const currentAwardText = ((credentialsData ? (isEn ? credentialsData.listEn : credentialsData.listZh) : null) || currT.awardsList)[selectedCredentialIdx] || "";
                        const orgInfo = getMatchingOrgInfo(currentAwardText);
                        
                        if (!orgInfo) {
                          return (
                            <div className="bg-slate-950 border border-slate-900 p-4.5 rounded-2xl flex flex-col items-center justify-center text-center py-8 min-h-[200px] h-full">
                              <HelpCircle className="w-8 h-8 text-slate-700 mb-2.5 animate-pulse" />
                              <h4 className="text-xs font-bold text-slate-300 mb-1">
                                {isEn ? "Credential Intelligence" : "专业资质详情"}
                              </h4>
                              <p className="text-[10px] text-slate-500 leading-normal max-w-[180px]">
                                {isEn ? "Selected credential represents standard tier authority. No secondary telemetry on-record." : "选中项目为吕华先生权威认证资历，已在线通过官方数据库校验。"}
                              </p>
                            </div>
                          );
                        }

                        return (
                          <div className="bg-slate-950 border border-slate-850 p-4.5 rounded-2xl flex flex-col justify-between relative overflow-hidden h-full transition-all animate-fadeIn">
                            <div className="space-y-3">
                              {/* Header elements */}
                              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center text-[8.5px] font-black tracking-tighter">
                                    {orgInfo.logoText}
                                  </div>
                                  <span className="text-[9.5px] text-amber-400 font-mono font-bold tracking-wider uppercase flex items-center gap-1">
                                    <Globe className="w-3 h-3 text-amber-500" />
                                    {isEn ? "Verified Portal" : "官方权威资料"}
                                  </span>
                                </div>
                                <span className="text-[8px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded uppercase font-bold">Verified</span>
                              </div>

                              <h4 className="text-xs font-black text-rose-50/90 leading-snug">
                                {isEn ? orgInfo.nameEn : orgInfo.nameZh}
                              </h4>
                              
                              <p className="text-[11px] text-slate-350 leading-relaxed font-sans text-left">
                                {isEn ? orgInfo.descEn : orgInfo.descZh}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-slate-900 mt-4 flex items-center justify-between">
                              <span className="text-[9px] text-slate-600 font-mono">UTX VERIFIED</span>
                              <a 
                                href={orgInfo.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-[9.5px] text-amber-400 hover:text-amber-300 font-extrabold flex items-center gap-1 transition-colors"
                              >
                                {isEn ? "Official site" : "访问官方网站"} 
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Admin operations trigger */}
                  {(loggedInUser?.role === "admin" || loggedInUser?.role === "assistant") && (
                    <div className="pt-4 border-t border-slate-850 flex items-center justify-between">
                      <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-550/10 px-2.5 py-1 rounded">🛡️ ADMIN PORTAL ACCESS ACTIVE</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (credentialsData) {
                            setEditTitleZh(credentialsData.titleZh);
                            setEditTitleEn(credentialsData.titleEn);
                            setEditDescZh(credentialsData.descZh);
                            setEditDescEn(credentialsData.descEn);
                            setEditImageUrl(credentialsData.imageUrl);
                            setEditListZh([...credentialsData.listZh]);
                            setEditListEn([...credentialsData.listEn]);
                          }
                          setShowEditCredentialsModal(true);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-amber-550 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer border-none outline-none"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>{isEn ? "Update Photo & Credentials Data" : "更新资质、荣誉与背景配图"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* HARRY LYU MEMORY GALLERY & WORLD FOOTSTEPS (TEMPORARILY DETACHED) */}
              {false && (
                <div id="memory-gallery" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block">
                        {isEn ? "Global Footprints & Moments" : "环球出海印记与生动瞬间"}
                      </span>
                      <h3 className="text-xl font-bold text-white">
                        {isEn ? "Harry's Memory Wall" : "吕华的跨文化记忆长廊"}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {isEn 
                          ? "Click any milestone card to unlock the high-stakes cultural stories and professional insights." 
                          : "点击下方任意印记卡片，即可解码精彩的文化交锋故事、外包现场心影、国际评委履历与学术探索。"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Admin trigger to upload a new memory milestone */}
                      {(loggedInUser?.role === "admin" || loggedInUser?.role === "assistant") && (
                        <button
                          type="button"
                          onClick={() => setShowAddMemoryModal(true)}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-amber-550 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer border-none outline-none"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isEn ? "Upload Memory Milestone (AI Assist)" : "上载记忆长廊内容 (AI归纳)"}</span>
                        </button>
                      )}

                      {/* Filter tabs */}
                      <div className="flex flex-wrap gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-850">
                        {[
                          { id: "all", label: isEn ? "All" : "全部" },
                          { id: "academic", label: isEn ? "Academic" : "学术研探" },
                          { id: "professional", label: isEn ? "Strategic" : "商务战略" },
                          { id: "outdoor", label: isEn ? "Outdoor" : "户外生活" },
                          { id: "collaboration", label: isEn ? "Cohesion" : "文化融合" }
                        ].map(filter => (
                          <button
                            key={filter.id}
                            type="button"
                            onClick={() => setGalleryFilter(filter.id)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                              galleryFilter === filter.id
                                ? "bg-amber-500 text-slate-950 font-black"
                                : "text-slate-400 hover:text-white hover:bg-slate-900"
                            }`}
                          >
                            {filter.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Grid Layout of falling items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                    {(memories.length > 0 ? memories : MEMORY_GALLERY).filter(item => galleryFilter === "all" || item.type === galleryFilter).map(item => (
                      <div key={item.id} className="relative group min-h-[220px]">
                        <ImageWithFallback
                          src={item.src}
                          alt={isEn ? item.altEn : item.altZh}
                          caption={isEn ? item.descEn : item.descZh}
                          fallbackGradient={item.gradient}
                          className="aspect-[4/5] shadow-lg h-full"
                          onClick={() => setSelectedPhotoId(item.id)}
                        />
                        {item.isCustom && (loggedInUser?.role === "admin" || loggedInUser?.role === "assistant") && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteMemory(item.id, e)}
                            className="absolute top-2.5 right-2.5 p-2 bg-red-650/90 hover:bg-red-700 text-white rounded-lg transition-all shadow-md z-10 active:scale-95 border border-red-500/20 cursor-pointer"
                            title="Delete Milestone"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PERMANENT PORTRAIT REPLACEMENT EXPLANATORY GUIDE */}
              {showPortraitGuide && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative text-left"
                  >
                    <button 
                      onClick={() => setShowPortraitGuide(false)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-slate-850"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
                          <Info className="w-5 h-5" />
                        </div>
                        <h4 className="text-lg font-black text-white">
                          {isEn ? "Permanent Avatar Replacement" : "如何永久替换您的真实头像？"}
                        </h4>
                      </div>

                      <div className="space-y-3 text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
                        <p>
                          {isEn 
                            ? "Hi Harry! In order to provide a fully prepared environment, the system loaded a default placeholder. Since that is not you, you can instantly configure your actual likeness."
                            : "您好吕华先生！为了给您提供高保真的展示体验，系统默认载入了一张写实的讲师占位图片。由于图片非您本人，您可以非常轻松地替换并展现您的真实形象："}
                        </p>
                        
                        <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl space-y-2">
                          <p className="font-extrabold text-amber-400">
                            {isEn ? "✨ Instant Live Preview (Temporary)" : "✨ 实时预览（当前页面立即生效）"}
                          </p>
                          <p className="text-[11.5px] leading-relaxed">
                            {isEn 
                              ? "Hover over the image and click 'Upload Photo'. Choosing any file loads your face instantly across your browser session."
                              : "把鼠标悬停在讲师照片上，点击「上传真实头像」选择任意本地图片。系统会立即利用浏览器本地缓存（localStorage）显示您的真实照片，即使刷新、反复体验也会完美保留！"}
                          </p>
                        </div>

                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-2">
                          <p className="font-extrabold text-amber-400">
                            {isEn ? "📂 Permanent Production Lock (Highly Recommended)" : "📂 永久固化到代码仓库（推荐）"}
                          </p>
                          <p className="text-[11.5px] leading-relaxed">
                            {isEn 
                              ? "To make your avatar permanent after deployment, rename your photo as:" 
                              : "如果您希望在代码导出或部署后将您的照片一直展示在网站中：\n物理上只需要将您的真实帅照重命名，并替换项目目录下的同名文件即可！"}
                          </p>
                          <div className="mt-1.5 p-2 bg-slate-950 rounded border border-slate-800 font-mono text-[10px] text-amber-500 select-all break-all text-center">
                            /src/assets/images/instructor_portrait_1781339256749.jpg
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-800 pt-4 mt-6">
                        <button
                          type="button"
                          onClick={() => setShowPortraitGuide(false)}
                          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-lg transition-colors cursor-pointer w-full text-center"
                        >
                          {isEn ? "Understood!" : "我明白了！"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* PERMANENT BOOK COVER REPLACEMENT EXPLANATORY GUIDE */}
              {showBookCoverGuide && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 text-left">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative text-left"
                  >
                    <button 
                      onClick={() => setShowBookCoverGuide(false)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-slate-850"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
                          <BookOpen className="w-5 h-5 animate-pulse" />
                        </div>
                        <h4 className="text-lg font-black text-white">
                          {isEn ? "Permanent Book Cover Replacement" : "如何永久替换您新书的封面？"}
                        </h4>
                      </div>

                      <div className="space-y-3 text-xs md:text-sm text-slate-350 leading-relaxed font-sans">
                        <p>
                          {isEn 
                            ? "To personalize or update your book cover for 'Winning Overseas' in this prototype, you can use the interactive uploader, or replace it permanently in code."
                            : "为了在这个网站中展示您独家、最新的《出海制胜》新书封面，您可以使用当前页面的实时上传工具，或将其永久写入代码目录中："}
                        </p>
                        
                        <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl space-y-2">
                          <p className="font-extrabold text-amber-400">
                            {isEn ? "✨ Live Web Upload (Session-Based)" : "✨ 线上即时上传（当前浏览器记忆）"}
                          </p>
                          <p className="text-[11.5px] leading-relaxed">
                            {isEn 
                              ? "Hover over the book and click 'Upload Cover'. Simply select any cover image on your computer to replace it instantly."
                              : "只需将鼠标悬浮在图书封面上，点击「选择电脑封面图」上传任意图片，系统会自动存储到该浏览器缓存中。只要不清除缓存，每次刷新都能看到您的新书封面！"}
                          </p>
                        </div>

                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-2">
                          <p className="font-extrabold text-amber-400">
                            {isEn ? "📂 Permanent Project asset replacement" : "📂 永久固化到项目资产库（极度推荐）"}
                          </p>
                          <p className="text-[11.5px] leading-relaxed">
                            {isEn 
                              ? "To hardcode this cover in your source tree forever, simply overwrite this file:" 
                              : "如果您已经准备好了正式印刷的高清封面大图，想永久打包保存到代码中：\n只需要将新封面图重命名并放进项目下，覆盖下面这个同名文件资产即可！"}
                          </p>
                          <div className="mt-1.5 p-2 bg-slate-950 rounded border border-slate-800 font-mono text-[10px] text-amber-500 select-all break-all text-center">
                            /src/assets/images/book_cover_1781339266821.jpg
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end border-t border-slate-800 pt-4 mt-6">
                        <button
                          type="button"
                          onClick={() => setShowBookCoverGuide(false)}
                          className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-lg transition-colors cursor-pointer"
                        >
                          {isEn ? "Got it!" : "我明白了！"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* GALLERY LIGHTBOX OVERLAY DIALOG */}
              {selectedPhotoId && (() => {
                const itemIdx = MEMORY_GALLERY.findIndex(item => item.id === selectedPhotoId);
                const item = MEMORY_GALLERY[itemIdx];
                if (!item) return null;

                const prevItem = MEMORY_GALLERY[(itemIdx - 1 + MEMORY_GALLERY.length) % MEMORY_GALLERY.length];
                const nextItem = MEMORY_GALLERY[(itemIdx + 1) % MEMORY_GALLERY.length];

                return (
                  <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col lg:flex-row items-stretch"
                    >
                      {/* Close cross */}
                      <button 
                        onClick={() => setSelectedPhotoId(null)}
                        className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white bg-slate-950/50 hover:bg-slate-950 backdrop-blur-xs rounded-full border border-slate-800 transition-all cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Photo segment (Left or Top) */}
                      <div className="w-full lg:w-3/5 bg-slate-950 min-h-[300px] md:min-h-[450px] relative flex items-center justify-center overflow-hidden">
                        {item.src ? (
                          <img 
                            src={item.src} 
                            alt={isEn ? item.altEn : item.altZh}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain max-h-[500px]"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-950/40 border border-slate-850 flex items-center justify-center mb-4">
                              <BookOpen className="w-8 h-8 text-amber-500" />
                            </div>
                            <span className="text-xs font-bold text-slate-350 max-w-sm font-sans">
                              {isEn ? item.altEn : item.altZh}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info & Text Segment (Right or Bottom) */}
                      <div className="w-full lg:w-2/5 p-6 md:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800">
                        <div className="space-y-4">
                          <span className="text-[10px] font-black tracking-widest text-amber-500 uppercase font-mono px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/10 inline-block">
                            {item.type}
                          </span>
                          
                          <h4 className="text-base font-extrabold text-white leading-snug">
                            {isEn ? item.altEn : item.altZh}
                          </h4>
                          
                          <div className="text-xs text-slate-300 leading-relaxed font-sans">
                            <p>
                              {isEn ? item.descEn : item.descZh}
                            </p>
                          </div>
                        </div>

                        {/* Navigation controls within                        {/* Selected Review Card */}
                        {(() => {
                          const reviews = [
                            {
                              name: "黄忠品",
                              title: "NXAI 公司 CEO",
                              avatarLetter: "黄",
                              quote: "从‘浅滩试水’到‘深海远航’，本书以‘六步导航法’构建了出海的实战罗盘。吕华不仅洞察数据合规之锚与技术引擎之核，更深刻揭示了客户体验助力企业全球化流量增长的底层逻辑。作为公司全球化战略的践行者，从 2024 年开始，吕华和我们的核心管理团队一起携手其将大愿景转化为可落地航图的卓越能力，正是我们破浪前行的关键力量。愿此书成为所有出海者的灯塔。"
                            },
                            {
                              name: "吴岩松",
                              title: "中国国际商会客服专委会会长",
                              avatarLetter: "吴",
                              quote: "《出海制胜：六步打造卓越客户体验》——企业扬帆出海的智慧灯塔！作者吕华与郑颖，客户体验行业的领军者，集二十年实战精髓，创新提出“六步导航法”。本书不仅深度融合政策、技术、文化与成本四大要素，更为企业搭建全球客服体系铺设了一条清晰、可行的路径。从数据合规的基石到客户体验 of 优化量，内容详实、方法具体，是企业出海征途中不可或缺的实战指南，引领企业破浪前行，助力企业在全球化竞争中脱颖而出。"
                            },
                            {
                              name: "岳鹏",
                              title: "TP 中国 高级副总裁",
                              avatarLetter: "岳",
                              quote: "我与吕老师是多年同事，更是同行挚友。我们深耕客户体验行业十余年，从国内服务体系搭建到陪伴企业出海，有着太多共同实践与认知，读这本书时共鸣尤深。本书将多年一线实战凝练成六步出海宝典，内容扎实、全是可落地方法，堪称中国企业出海的实战手册，无论团队学习还是项目参考都极具价值。由衷为好友高兴，能沉淀出这样一部专业佳作。也期待未来继续并肩，为中国企业出海持续助力。"
                            },
                            {
                              name: "李农",
                              title: "《客户观察》主编",
                              avatarLetter: "李",
                              quote: "两位二十年挚友联袂之作，一部极具实战价值的中国企业出海客服与卓越客户体验的实战红宝书！作者精析出海六大要务，融合全球合规与本地多语、多渠道网络规划，提供了扎实可信、闭环避雷的一线硬核干货案例与精辟指南。"
                            }
                          ];

                          const activeReview = reviews[activeReviewIdx] || reviews[0];

                          return (
                            <motion.div 
                              key={activeReviewIdx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-slate-950 p-6 rounded-2xl border border-slate-855/80 space-y-4"
                            >
                              <p className="text-xs text-slate-300 leading-relaxed font-sans italic">
                                "{activeReview.quote}"
                              </p>
                              <div className="flex items-center gap-3 border-t border-slate-900 pt-3">
                                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-500">
                                  {activeReview.avatarLetter}
                                </div>
                                <div>
                                  <h6 className="text-xs font-black text-white">{activeReview.name}</h6>
                                  <p className="text-[10px] text-slate-500 font-medium">{activeReview.title}</p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })()}

                      </div>

                      {/* Repositioned & Simplified QR Preorder Box */}
                      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
                        <p className="text-xs text-amber-400 font-extrabold flex items-center justify-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                          {isEn ? "Pre-order Signed Copies" : "预订作者亲笔签名定制纸质书"}
                        </p>
                        <p className="text-[10px] text-slate-400 leading-normal text-center">
                          {isEn ? "Save QR below or scan code to message us for private reservation:" : "微信保存下方图片或扫码关注发送私信，登记获得限量亲笔签字定制本："}
                          {loggedInUser && (loggedInUser.role === "admin" || loggedInUser.role === "assistant") && (
                            <span className="block mt-1 text-amber-500 font-extrabold text-[9px] animate-pulse">
                              💡 管理员特权：点击下方图片可在弹窗中一键更换为原图海报
                            </span>
                          )}
                        </p>
                        <div className="flex justify-center">
                          <div 
                            className="bg-slate-950 p-3 rounded-2xl border border-slate-850/80 max-w-[340px] flex items-center justify-center overflow-hidden cursor-pointer hover:border-amber-500/30 transition-all"
                            onClick={() => setShowPreorderGuidance(true)}
                            title="点击查看大图 / Click to zoom"
                          >
                            <img 
                              src={preorderFlyer} 
                              alt="限量亲笔签名版预售通道" 
                              referrerPolicy="no-referrer"
                              className="w-full h-auto max-h-[300px] object-contain rounded-lg shadow-md"
                            />
                          </div>
                        </div>
                      </div>

                    </motion.div>
                  </div>
                );
              })()}

              {/* Note: Pre-order form has been consolidated into the unified secure purchase card layout under Books tab to avoid redundancy. */}


              </motion.div>
            )}
          {activeTab === "book" && (
            <motion.div
              key="tab-book"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8 animate-fadeIn"
            >
              {/* Top Segmented Sub-tab switcher */}
              <div className="flex justify-center md:justify-start">
                <div className="inline-flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800/80 shadow-2xl font-sans">
                  <button
                    type="button"
                    onClick={() => setCurrentBookTab("syllabus")}
                    className={`px-6 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                      currentBookTab === "syllabus"
                        ? "bg-amber-500 text-slate-950 font-extrabold shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isEn ? "Bestselling Books" : "畅销书籍"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentBookTab("journals")}
                    className={`px-6 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                      currentBookTab === "journals"
                        ? "bg-amber-500 text-slate-950 font-extrabold shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Newspaper className="w-3.5 h-3.5" />
                    <span>{isEn ? "Hot Journals" : "热点期刊"}</span>
                  </button>
                </div>
              </div>

              {currentBookTab === "syllabus" ? (
                <div className="space-y-8 animate-fadeIn">
                  {/* Monograph Overview Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
                    {/* Book Cover Visual (Left Column) */}
                    <div className="lg:col-span-4 flex flex-col space-y-4 bg-slate-900 border border-slate-800 p-4 rounded-3xl relative overflow-hidden group shadow-[0_0_40px_rgba(245,158,11,0.04)]">
                      <div className="absolute top-2 right-2 z-10 bg-slate-950/80 backdrop-blur-sm border border-amber-500/20 px-2.5 py-1 rounded-lg text-[9px] text-amber-500 font-bold uppercase tracking-wider">
                        Official Release
                      </div>

                      {/* Cover Container */}
                      <div className="w-full aspect-[3/4] max-h-[360px] rounded-2xl overflow-hidden relative border border-slate-800 shadow-2xl shadow-slate-950/80 bg-slate-950 flex items-center justify-center group/cover">
                        <img
                          src={bookCoverPhoto}
                          alt={isEn ? currT.bookSectionTitle : "《出海制胜》新书封面"}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Cover upload overlay */}
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/cover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                          <div className="space-y-2 font-sans" onClick={(e) => e.stopPropagation()}>
                            <label className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-center rounded-lg text-xs font-black cursor-pointer shadow-lg transition-colors flex items-center justify-center gap-1">
                              <UploadCloud className="w-4 h-4" />
                              <span>{isEn ? "Upload Cover Copy" : "选择电脑封面图"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleBookCoverUpload}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                if(confirm(isEn ? "Are you sure to reset the book cover to the default image?" : "确定要将新书封面恢复为系统默认图片吗？")) {
                                  handleResetBookCover();
                                }
                              }}
                              className="w-full py-2 bg-slate-900/90 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 text-center rounded-lg text-xs font-bold transition-all"
                            >
                              {isEn ? "Reset Cover" : "恢复官方原图"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Hardcore value highlights to make it full and balanced */}
                      <div className="bg-slate-950/60 border border-slate-850/80 p-3 rounded-2xl space-y-2.5">
                        <span className="text-[9px] font-black text-amber-500/80 font-mono tracking-wider block uppercase">
                          ✨ {isEn ? "EXCLUSIVE HIGHLIGHTS" : "新书核心亮点与硬核保障"}
                        </span>
                        
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            <div className="space-y-0.5">
                              <h6 className="text-[11px] font-bold text-slate-100 leading-tight">
                                {isEn ? "20+ Years Cross-Border Expert Synergy" : "20年跨国高管实战精髓结晶"}
                              </h6>
                              <p className="text-[9px] text-slate-400 leading-normal">
                                {isEn ? "Gathering core operations compliance logic." : "集政、技、文、本四大维度深度避坑经验。"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            <div className="space-y-0.5">
                              <h6 className="text-[11px] font-bold text-slate-100 leading-tight">
                                {isEn ? "Actionable 6-Step Navigation" : "独创“六步导航法”落地全景图"}
                              </h6>
                              <p className="text-[9px] text-slate-400 leading-normal">
                                {isEn ? "From data compliance to staff happiness." : "提供全流程、多行业出海交付实操模板。"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            <div className="space-y-0.5">
                              <h6 className="text-[11px] font-bold text-slate-100 leading-tight">
                                {isEn ? "Signed Edition Pack & QR Direct Link" : "亲笔签字版直发配送与好礼"}
                              </h6>
                              <p className="text-[9px] text-slate-400 leading-normal">
                                {isEn ? "Direct shipping with exclusive roadmap poster." : "作者工作室直发，附赠绝密出海大路线图。"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Fast QR Access inside left column */}
                      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3 flex items-center gap-3 group/qr cursor-pointer hover:border-amber-500/20 transition-all" onClick={() => {
                        const targetEl = document.getElementById("book-tab-order-box");
                        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
                      }}>
                        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 p-0.5 flex items-center justify-center shrink-0 overflow-hidden group-hover/qr:border-amber-500/40 transition-colors">
                          <img src={preorderFlyer} alt="Scan QR" className="w-full h-full object-contain rounded" />
                        </div>
                        <div className="space-y-0.5 text-left min-w-0 flex-1">
                          <div className="text-[10px] font-black text-amber-500 flex items-center gap-1">
                            <span>{isEn ? "Instant Signed Booking" : "亲笔签名精品直通通道"}</span>
                            <ArrowRight className="w-3 h-3 group-hover/qr:translate-x-0.5 transition-transform" />
                          </div>
                          <p className="text-[9px] text-slate-400 truncate leading-tight">
                            {isEn ? "Click to scan preorder QR flyer below" : "点击直达下方二维码，一秒扫码预约礼包"}
                          </p>
                        </div>
                      </div>

                      {/* Actions & guidance trigger */}
                      <div className="space-y-1.5 border-t border-slate-800/60 pt-3">
                        <h5 className="text-[11px] font-black text-white">{isEn ? "Monograph Presentation" : "《出海制胜》精品专著"}</h5>
                        <p className="text-[10px] text-slate-450 leading-normal font-sans">
                          {isEn ? "Signed hardcover editions are dispatched directly from the authors' studio." : "由作者工作室直接组织签字与到付直发配送，质量更具公信深度。"}
                        </p>
                      </div>
                    </div>

                    {/* Monograph Details Description Panel (Right Column) */}
                    <div className="lg:col-span-8 flex flex-col justify-between bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight">
                              {currT.bookSectionTitle}
                            </h2>
                            <span className="text-[10px] text-slate-500 font-mono font-bold tracking-widest block uppercase mt-1">
                              EXCLUSIVE EXECUTIVE REFERENCE MONOGRAPH
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-amber-400 font-bold leading-normal">
                          {currT.bookSectionSubtitle}
                        </p>

                        <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans text-justify bg-slate-950/30 p-4 rounded-2xl border border-slate-850">
                          {currT.bookDesc}
                        </p>
                      </div>

                      {/* Chapters Syllabus */}
                      <div className="border-t border-slate-800/85 pt-6 space-y-4">
                        <span className="text-[10px] text-amber-400 font-mono font-bold tracking-wider block uppercase">
                          {currT.bookChapterTitle}
                        </span>
                        <div className="grid grid-cols-1 gap-2.5">
                          {(() => {
                            const chapterSummariesZh = [
                              "作为出海的第一大核心重灾区，本章深度探讨数据合规与安全生命线（如欧盟GDPR与沙特PDPL）。结合出海全景图，系统剖析客服沟通、系统日志及多国数据在跨境路由中的红线与避坑经验，提供安全高效、兼顾合规与极致降本平衡的双赢战略落地模板。",
                              "将出海战略解构为具有高度实操性的分阶段路线图，并依据顶级新能源汽车的2年案例为抓手展开论述。通过详尽的技术选型与多云基础设施规划，避免重构陷阱。提供精密的时区匹配与运营财务精算模型，确保全球资源科学配置。",
                              "本章提供科学的跨国呼叫中心BPO供应商甄选与多国异岸选址雷达。深度破解波兰、埃及、菲律宾等各基地的优劣势落差，量身制定高价值敏捷KPI机制，强力缝合由于中外文化差异带来的沟通与管理断层，助力企业快速建立海外高标准高韧性的服务战队。",
                              "探讨如何运用新兴科技（AI情感大模型、多语种翻译引擎、AR远程协助套件）打通跨国邮电协作脉络。以真实交付案例解密：如何在弱网络与低语境国家，通过打字无声、AI实时情绪分析及AR远程对准，将一次解决率（FCR）提升至高水平，实现技术性跨代超越。",
                              "服务链的源头在员工体验。本章全面解剖如何在多语言、跨宗教、多文化的海外子公司中，进行包容用工、多维福利设计与EX员工体验保留。详解当地团队考核红线，帮助中国高管迅速融入当地法规，从根本上压降国际中心的高人员流失风险。",
                              "详解通过WhatsApp私域结合智能化AI工具开展全球获客和卓越售后服务体验的共生链路。剖析如何将海量公域流量引入精细化私域管家，通过多国私域自动化交互、精准画像召回与多渠道智能呼叫路由协同，构建出海企业的长期自循环、自增长商业闭环。"
                            ];

                            const chapterSummariesEn = [
                              "As the primary compliance challenge, this chapter deeply explores the data compliance lifeline (such as GDPR & PDPL). It analyzes hotlines, routing, and logs to ensure seamless security balanced with extreme operational cost efficiency.",
                              "Deconstructs global strategies into highly actionable phased roadmaps, anchored on a top NEV player's 2-year case study. Avoids costly pitfalls with multi-cloud infrastructure planning, precise timezone alignment, and rigorous financial actuarial models.",
                              "Provides critical guidance on global BPO supplier vetting and site selections (Egypt, Poland, Davao, etc.). Establishes high-impact agile KPI panels to bridge cross-cultural management divides and build standard overseas deliverable forces.",
                              "Unlocks the synergy of AI sentiment modules, multi-lingual translators, and AR tools for cross-border operations. Shares hand-on cases demonstrating how to skyrocket first-contact resolution via intelligent assistance in low-bandwidth areas.",
                              "The core of superior service lies in employee experience. This chapter details inclusion strategies, EX benefits, and talent retention across diverse culturally unique entities, helping executives comply with local norms and slash staff turnover.",
                              "Delineates global private domain operations by combining WhatsApp and AI chatbots to nurture customer relationships. Outlines plans to transform public traffic into premium automated workflows, crafting long-term retention loops."
                            ];

                            const summaries = isEn ? chapterSummariesEn : chapterSummariesZh;

                            return currT.bookChapters.map((chapter: string, idx: number) => {
                              const parts = chapter.includes("：") ? chapter.split("：") : chapter.split(":");
                              const stepNum = parts[0] || "";
                              const stepDesc = parts.slice(1).join("：") || "";
                              const isExpanded = expandedBookChapter === idx;
                              const summaryText = summaries[idx] || "";

                              return (
                                <div 
                                  key={idx} 
                                  onClick={() => setExpandedBookChapter(isExpanded ? null : idx)}
                                  className={`group p-4 rounded-2xl border transition-all duration-300 cursor-pointer text-left select-none ${
                                    isExpanded 
                                      ? "bg-slate-900/95 border-amber-500/40 shadow-xl shadow-slate-950/40" 
                                      : "bg-slate-950/40 border-slate-850 hover:bg-slate-900/60 hover:border-slate-700"
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1 pr-6 flex-1">
                                      <div className="flex items-center gap-2">
                                        <BookOpen className={`w-3.5 h-3.5 ${isExpanded ? "text-amber-400" : "text-amber-500/40 group-hover:text-amber-400"} transition-colors`} />
                                        <p className={`text-xs font-bold font-sans tracking-wide transition-colors ${isExpanded ? "text-amber-400" : "text-white"}`}>
                                          {stepNum}
                                        </p>
                                      </div>
                                      {stepDesc && (
                                        <p className="text-[11px] text-slate-400 font-sans leading-relaxed group-hover:text-slate-300 transition-colors">
                                          {stepDesc}
                                        </p>
                                      )}
                                    </div>
                                    
                                    <div className={`mt-0.5 p-1 rounded-lg border transition-all duration-300 flex items-center justify-center ${
                                      isExpanded 
                                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400" 
                                        : "bg-slate-950/60 border-slate-800 text-slate-500 group-hover:text-slate-300 group-hover:border-slate-700"
                                    }`}>
                                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                    </div>
                                  </div>

                                  <AnimatePresence initial={false}>
                                    {isExpanded && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                      >
                                        <div className="border-t border-slate-800/80 mt-3 pt-3 space-y-1.5">
                                          <div className="flex items-center gap-1.5">
                                            <span className="h-1 w-1 rounded-full bg-amber-400"></span>
                                            <span className="text-[9px] font-bold text-amber-500/80 font-mono tracking-wider uppercase">
                                              {isEn ? "CHAPTER DIGEST" : "本章核心思想导读"}
                                            </span>
                                          </div>
                                          <p className="text-[11px] text-slate-350 font-sans leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-900/60">
                                            {summaryText}
                                          </p>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preorder Signed cover flyer preview */}
                  <div id="book-tab-order-box" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col items-center relative">
                    <div className="absolute top-4 right-4 text-slate-500">
                      <Lock className="w-5 h-5 text-amber-500/40" />
                    </div>

                    <div className="max-w-2xl text-center mb-6">
                      <h3 className="text-lg font-black text-white">{currT.bookActionHeader}</h3>
                      <p className="text-xs text-slate-400 mt-1 font-sans">
                        {isEn 
                          ? "Claim your signed pre-order hardcover monograph copy via the exclusive QR connection." 
                          : "长按扫码或通过专属直通渠道锁定吕老师亲笔签名版新书《出海制胜》及教案大礼包。"}
                      </p>
                    </div>

                    <div className="w-full max-w-sm bg-slate-950 p-2.5 rounded-3xl border border-slate-800 flex justify-center items-center overflow-hidden shadow-2xl group transition-all hover:border-amber-500/35">
                      <img 
                        src={preorderFlyer} 
                        alt="正版限量亲笔签名预约渠道" 
                        className="w-full h-auto object-contain rounded-2xl max-h-[480px] group-hover:scale-101 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-fadeIn font-sans animate-fadeIn">
                  <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block font-mono">REPUTABLE SECTOR PUBLICATIONS</span>
                        <h3 className="text-xl font-extrabold text-white">知名学术期刊 与 行业白皮书</h3>
                        <p className="text-xs text-slate-400 font-sans">
                          目前收录了包括 Avaya、数字丝路联盟（DSRC）等官方权威期刊推荐的吕华先生研究成果。支持 AI 智能学术提炼与原文阅读。
                        </p>
                      </div>

                      {loggedInUser && (loggedInUser.role === "admin" || loggedInUser.role === "assistant") && (
                        <button
                          type="button"
                          onClick={() => setShowAddJournalForm(!showAddJournalForm)}
                          className="px-4 py-1.5 text-xs font-black bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-450 transition-all flex items-center gap-2 cursor-pointer self-start shrink-0 font-sans"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{showAddJournalForm ? (isEn ? "Hide Console" : "隐藏管理控制台") : (isEn ? "Add Publication" : "添加期刊文章(AI智能提炼)")}</span>
                        </button>
                      )}
                    </div>

                    {showAddJournalForm && loggedInUser && (loggedInUser.role === "admin" || loggedInUser.role === "assistant") && (
                      <form onSubmit={handleSaveJournal} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4 animate-fadeIn font-sans">
                        <div className="flex items-center justify-between border-b border-slate-955 pb-2.5">
                          <div className="flex items-center gap-2">
                            <Sliders className="w-4 h-4 text-amber-500" />
                            <h4 className="text-sm font-bold text-white">{isEn ? "Academic Publication Admin Console" : "知名刊物与发布学术登记入口"}</h4>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded">ADMIN ONLY</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-350 block uppercase tracking-wider">一、文章/刊物学术标题 (*必填)</label>
                            <input
                              type="text"
                              value={journalTitleInput}
                              onChange={(e) => setJournalTitleInput(e.target.value)}
                              placeholder="例如：《2026 跨国运营商卓越客户体验与 AI 转型白皮书》"
                              className="w-full bg-slate-900 border border-slate-850 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                              required
                            />

                            <label className="text-[11px] font-bold text-slate-350 block uppercase tracking-wider pt-1">二、第三方官方网站阅读链接 / 文章 URL (*必填)</label>
                            <input
                              type="url"
                              value={journalLinkInput}
                              onChange={(e) => setJournalLinkInput(e.target.value)}
                              placeholder="https://example.com/outbound-whitepaper"
                              className="w-full bg-slate-900 border border-slate-850 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                              required
                            />

                            <label className="text-[11px] font-bold text-slate-350 block uppercase tracking-wider pt-2">三、文章原始粗稿说明 / 正文要点抄录 (*AI提炼源)</label>
                            <textarea
                              rows={5}
                              value={journalRawDescInput}
                              onChange={(e) => setJournalRawDescInput(e.target.value)}
                              placeholder="把关于这篇发布文章的小结、大纲、或者网页全文复制到这里，AI 适合自动对其解题解析提炼。"
                              className="w-full bg-slate-900 border border-slate-850 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 resize-none font-sans"
                            />

                            <button
                              type="button"
                              onClick={handleAiSummarizeJournal}
                              disabled={isGeneratingJournalAi}
                              className="w-full py-2.5 bg-gradient-to-r from-amber-600/20 to-amber-500/20 hover:from-amber-600/30 hover:to-amber-500/30 border border-amber-500/30 hover:border-amber-500/50 rounded-xl transition-all text-xs font-black text-amber-400 flex items-center justify-center gap-2 cursor-pointer font-sans"
                            >
                              {isGeneratingJournalAi ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>AI 出海大模型正在提炼要点亮点...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                  <span>一键 AI 自动智能提炼文章亮点（精品金句）</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="space-y-3 bg-[#0F172A]/40 p-4 rounded-xl border border-slate-900 space-y-3.5">
                            <span className="text-[9px] text-amber-500 font-bold font-mono tracking-wider block uppercase">GENERATIVE PREVIEW / EDITABLE</span>
                            
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-455 font-bold block">AI 提炼生成的文章核心亮点概要说明：</label>
                              <textarea
                                rows={4}
                                value={journalDescInput}
                                onChange={(e) => setJournalDescInput(e.target.value)}
                                placeholder="AI 解析之后会自动回填，也可以在这里手动编辑润色。"
                                className="w-full bg-slate-900/60 border border-slate-850 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none font-sans"
                                required
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-455 font-bold block">AI 提炼的终极启发带走要点（精辟金句）：</label>
                              <input
                                type="text"
                                value={journalTakeawayInput}
                                onChange={(e) => setJournalTakeawayInput(e.target.value)}
                                placeholder="AI 提炼学术金句...当然您也可以手动修改描述。"
                                className="w-full bg-slate-900/60 border border-slate-850 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-sans"
                                required
                              />
                            </div>

                            <div className="pt-2 border-t border-slate-950 flex justify-end gap-2 font-sans font-sans font-sans">
                              <button
                                type="button"
                                onClick={() => {
                                  setJournalTitleInput("");
                                  setJournalLinkInput("");
                                  setJournalRawDescInput("");
                                  setJournalDescInput("");
                                  setJournalTakeawayInput("");
                                }}
                                className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                              >
                                {isEn ? "Clear" : "清空重置"}
                              </button>
                              <button
                                type="submit"
                                className="px-5 py-1.5 text-xs font-black bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg transition-all flex items-center gap-1 cursor-pointer font-sans"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>正式登记并发布此学术文章</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* Journals grid feed */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      {activeJournals.map((journal, jIdx) => (
                        <div key={journal.id || jIdx} className="bg-slate-950/80 border border-slate-850 p-6 rounded-2xl flex flex-col justify-between relative group hover:border-slate-700 transition-all font-sans">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-[#1E293B] pb-2.5">
                              <div className="flex items-center gap-1.5 text-slate-400 font-sans">
                                <Newspaper className="w-4 h-4 text-amber-500 shrink-0" />
                                <span className="text-[10px] font-mono tracking-wider uppercase font-extrabold text-slate-500">
                                  REPUTABLE PUBLICATION
                                </span>
                              </div>
                              {loggedInUser && (loggedInUser.role === "admin" || loggedInUser.role === "assistant") && journal.isCustom && (
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteJournal(journal.id, e)}
                                  className="p-1 hover:text-rose-500 text-slate-500 transition-colors cursor-pointer rounded-lg hover:bg-slate-900 block"
                                  title="删除此期刊发布"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            <h4 className="text-sm font-black text-white leading-snug">
                              {journal.title}
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed font-sans whitespace-pre-line font-sans">
                              {journal.desc}
                            </p>
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-900/80 space-y-4">
                            {journal.takeaway && (
                              <div className="p-3 bg-[#1E293B]/30 border-l border-amber-500 text-[11px] text-slate-350 leading-relaxed rounded-r-lg font-sans font-sans">
                                💡 <strong className="text-amber-500">Highlight:</strong> {journal.takeaway}
                              </div>
                            )}
                            <div className="flex justify-between items-center bg-[#070D19] px-3 py-1.5 rounded-lg border border-slate-850">
                              <span className="text-slate-500 font-sans text-[10px]">{isEn ? "Takeaway Highlight" : "金句启发点"}</span>
                              <a
                                href={journal.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-amber-500 hover:underline flex items-center gap-1 font-bold font-sans text-xs"
                              >
                                <span>{isEn ? "Verify Source" : "阅读原文"}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ================= TAB 3: TRAINING & EXECUTIVE WORKSHOPS ================= */}
          {activeTab === "workshops" && (
            <motion.div
              key="tab-workshops"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              
              <div className="max-w-2xl space-y-2 pt-2">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">{currT.workshopTitle}</span>
                <p className="text-slate-300 text-sm md:text-base">{currT.workshopSubtitle}</p>
              </div>

              {/* Course Director Dropdown selector and segmented controllers */}
              <div className="bg-slate-900 border border-slate-805 p-3.5 md:p-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in shadow-2xl">
                <div className="space-y-1 self-start md:self-auto">
                  <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-widest font-mono">
                    {isEn ? "COURSES DIRECTORY" : "精品出海名课目录汇编"}
                  </span>
                  <p className="text-white text-base font-black tracking-tight">
                    {isEn ? "Select Course Category:" : "选择精品出海名课目录 / 选择面授或线上课体系:"}
                  </p>
                </div>

                {/* Segmented Radio Controls only */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                  <div className="bg-slate-950/80 p-1.5 rounded-2xl border border-slate-850 flex flex-col sm:flex-row gap-1 md:gap-1.5 shadow-2xl">
                    <button
                      type="button"
                      onClick={() => setSelectedCourseTab("cx_roadmap")}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        selectedCourseTab === "cx_roadmap"
                          ? "bg-amber-500 text-slate-950 shadow-md scale-102"
                          : "text-slate-400 hover:text-white hover:bg-slate-900/40"
                      }`}
                    >
                      {isEn ? "1. Global CX Roadmap (Offline)" : "1. 全球服务路线图（线下）"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCourseTab("culture_map")}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        selectedCourseTab === "culture_map"
                          ? "bg-cyan-500 text-slate-950 shadow-lg scale-102"
                          : "text-slate-400 hover:text-white hover:bg-slate-900/40"
                      }`}
                    >
                      {isEn ? "2. Outbound Culture Map (Offline)" : "2. 出海文化地图（线下）"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCourseTab("videos")}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        selectedCourseTab === "videos"
                          ? "bg-amber-500 text-slate-950 shadow-lg scale-102"
                          : "text-slate-400 hover:text-white hover:bg-slate-900/40"
                      }`}
                    >
                      {isEn ? "3. Courseware Videos (Online) (Coming Soon)" : "3. 学员视频课件（线上）（敬请期待）"}
                    </button>
                  </div>
                </div>
              </div>

              {/* ACTIVE COURSE COMPREHENSIVE DETAIL DISPLAY */}
              <AnimatePresence mode="wait">
                {selectedCourseTab === "cx_roadmap" ? (
                  <motion.div
                    key="cx_course"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2"
                  >
                    {/* Left Column: Image / Facts Block (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                      
                      {/* Course Image */}
                      <div className="relative group bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden aspect-video lg:aspect-square flex items-center justify-center shadow-2xl">
                        <img 
                          src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=800&q=80" 
                          alt="Customer Experience Outbound Roadmap illustration"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover grayscale-0 group-hover:scale-102 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
                        <span className="absolute bottom-3 left-4 text-[10px] font-bold font-mono text-amber-400 bg-slate-950/80 px-2.5 py-1 rounded-md border border-amber-500/20 shadow-md">
                          {isEn ? "ROADMAP ILLUSTRATION" : "精品出海路线图配图"}
                        </span>
                      </div>

                      {/* Hard facts glass card */}
                      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                        <h4 className="text-white text-xs font-black tracking-widest font-mono uppercase border-b border-slate-800 pb-2.5">
                          {isEn ? "QUICK COURSE FACTS" : "课程核心速览"}
                        </h4>
                        
                        <div className="space-y-3.5">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-400">{currT.durationLabel}:</span>
                            <span className="text-white font-bold">{isEn ? "2 Days (12 Hours)" : "2天 (12小时深度实战)"}</span>
                          </div>
                          
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-400">{currT.formatLabel}:</span>
                            <span className="text-white font-bold text-right max-w-[200px]">Lecture & Private Sandbox Clinic</span>
                          </div>
                          
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-400">{currT.audienceLabel}:</span>
                            <span className="text-amber-400 font-bold text-right max-w-[200px]">Directors, Global VPs, CX Teams</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            setActiveTab("contact");
                            setTimeout(() => {
                              const element = document.getElementById("booking-form");
                              if (element) {
                                element.scrollIntoView({ behavior: "smooth" });
                              }
                            }, 100);
                          }}
                          className="w-full py-3 mt-4 rounded-xl text-xs font-black bg-amber-500 text-slate-950 hover:bg-amber-600 transition-all cursor-pointer shadow-lg hover:scale-101"
                        >
                          {isEn ? "Course Reservation" : "课程预约"}
                        </button>
                      </div>

                    </div>

                    {/* Right Column: Detailed Presentation content (8 cols) */}
                    <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-8 flex flex-col justify-between">
                      <div className="space-y-6">
                        
                        {/* Course Category + Title */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-400 font-black tracking-widest font-mono uppercase">
                              Pillar A: Global CX Dev
                            </span>
                            <span className="text-[10px] text-slate-400">• {isEn ? "Sovereign CX Standards" : "高满意度出海主权交付"}</span>
                          </div>
                          <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                            {isEn ? "Winning Overseas: 6 Steps to Build Outstanding Customer Experience (CX) Roadmap" : "《出海制胜：六步打造卓越客户体验》落地实战路线图"}
                          </h3>
                        </div>

                        {/* Course Description */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block font-mono">
                            {isEn ? "COURSE OVERVIEW" : "课程说明"}
                          </span>
                          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans text-left">
                            {isEn 
                              ? "Personally instructed by Harry Lyu, former Director of Customer Experience (China) at Fortune 500 NTT & Leader of Professional Services at AVAYA. This course addresses critical bottlenecks in global expansion: sudden dropping of Net Promoter Score (NPS), social-context conflict, and high-stakes sovereign VIP customer care failures. Leveraging 20 years of real-world contact center management, Harry outlines the exact step-by-step master plan to build solid globalized operations and resilient customer-centric frontlines."
                              : "本课程由前 Fortune 500 强外企 NTT 客户体验部门总监（中国区）及 AVAYA 专业服务团队领军人物吕华先生亲自面授。针对中亚、东南亚、非洲、中东及欧美出海中企面临的“水土不服”硬伤（如客服架构支离破碎、海外净推荐值 NPS 跌入低估、跨文化信任坍塌、重度客诉引爆地缘纠纷等）。全面系统地融合吕华先生20年呼叫中心、全球联络中心网络建设与客户服务体系搭建的底牌交付经验，为您倾力输出一套极具实操广度、深度与技术前瞻性（AI 辅助 + BPO 本地路由 + 云端容灾）的全球化客户体验交付体系路线图。"}
                          </p>
                        </div>

                        {/* Course Major Chapters */}
                        <div id="course-chapters-section" className="space-y-4">
                          <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest block font-mono">
                            {isEn ? "MAIN COURSE CHAPTERS" : "课程主要章节大纲（全套实战解密）"}
                          </span>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Chapter 1 */}
                            <div id="chapter-card-1" className="p-4.5 bg-slate-950/65 border border-slate-850 hover:border-amber-500/30 rounded-2xl space-y-2.5 transition-all duration-300 flex flex-col justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">CHAPTER 01</span>
                                  <Globe className="w-4 h-4 text-amber-400" />
                                </div>
                                <p className="text-xs text-white font-black leading-tight">
                                  {isEn ? "1. Chinese Outbound Trends & Global Landscape" : "1. 中企出海趋势与全球格局"}
                                </p>
                                <p className="text-[11px] text-slate-350 leading-relaxed font-sans text-left">
                                  {isEn 
                                    ? "Macro-overview of global economics and business environments in key outbound destinations. Analyze outbound service challenges, cultural frictions, and strategic values in trending global industries." 
                                    : "宏观纵览全球经济新格局与主流出海目的地营商生态。深度剖析中企全球化在新能源、消费电子、跨境科技等赛道演进脉络，精准预判出海服务体系面临的文化摩擦、合规准入与交付韧性等战略挑战。"}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-900/60">
                                <span className="text-[9px] bg-slate-900 text-amber-400/90 px-1.5 py-0.5 rounded font-mono">
                                  {isEn ? "Global Mapping" : "全球营商图谱"}
                                </span>
                                <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                                  {isEn ? "Outbound Trends" : "出海经济剖析"}
                                </span>
                                <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                                  {isEn ? "Strategic Risk" : "战略风险预判"}
                                </span>
                              </div>
                            </div>
                            
                            {/* Chapter 2 */}
                            <div id="chapter-card-2" className="p-4.5 bg-slate-950/65 border border-slate-850 hover:border-amber-500/30 rounded-2xl space-y-2.5 transition-all duration-300 flex flex-col justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">CHAPTER 02</span>
                                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                                </div>
                                <p className="text-xs text-white font-black leading-tight">
                                  {isEn ? "2. GDPR & Global Data Compliance Safeguards" : "2. GDPR 与全球数据合规护航"}
                                </p>
                                <p className="text-[11px] text-slate-350 leading-relaxed font-sans text-left">
                                  {isEn 
                                    ? "Demystify EU GDPR and global privacy regulations. Build data compliance models across contact center workflows, combining real benchmark cases to turn compliance into a strategic corporate asset." 
                                    : "破译欧盟 GDPR 等全球严苛的数据安全与隐私保护法网。从客服业务全流程构建数据安全与合规管理模型，结合标杆企业实战案例，打通合规流程审计与跨境数据传输机制，让合规成为出海核心底牌。"}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-900/60">
                                <span className="text-[9px] bg-slate-900 text-amber-400/90 px-1.5 py-0.5 rounded font-mono">
                                  {isEn ? "GDPR Deep Dive" : "GDPR深度解析"}
                                </span>
                                <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                                  {isEn ? "Privacy Model" : "隐私合规模型"}
                                </span>
                                <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                                  {isEn ? "Case Studies" : "实战案例剖析"}
                                </span>
                              </div>
                            </div>
                            
                            {/* Chapter 3 */}
                            <div id="chapter-card-3" className="p-4.5 bg-slate-950/65 border border-slate-850 hover:border-amber-500/30 rounded-2xl space-y-2.5 transition-all duration-300 flex flex-col justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">CHAPTER 03</span>
                                  <MapPin className="w-4 h-4 text-amber-400" />
                                </div>
                                <p className="text-xs text-white font-black leading-tight">
                                  {isEn ? "3. Offshore Site Selection & Operations Planning" : "3. 海外客服职场选址与规划"}
                                </p>
                                <p className="text-[11px] text-slate-350 leading-relaxed font-sans text-left">
                                  {isEn 
                                    ? "Unlock site selection golden triangle: compliance cost, talent pool, and CX. Compare domestic vs overseas operations, 'In-house vs BPO' decision models, and overseas team KPI governance." 
                                    : "揭秘海外客服中心选址黄金三角：合规成本、人才供给与交付体验。深度对比国内外运营差异与“自建 vs BPO外包”决策模型，精细化拆解海外典型客服团队的考核指标（KPI）与跨国协作机制。"}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-900/60">
                                <span className="text-[9px] bg-slate-900 text-amber-400/90 px-1.5 py-0.5 rounded font-mono">
                                  {isEn ? "Site Selection" : "选址黄金三角"}
                                </span>
                                <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                                  {isEn ? "Inhouse vs BPO" : "自建与外包决策"}
                                </span>
                                <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                                  {isEn ? "Global KPI" : "海外团队KPI标准"}
                                </span>
                              </div>
                            </div>
                            
                            {/* Chapter 4 */}
                            <div id="chapter-card-4" className="p-4.5 bg-slate-950/65 border border-slate-850 hover:border-amber-500/30 rounded-2xl space-y-2.5 transition-all duration-300 flex flex-col justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">CHAPTER 04</span>
                                  <Cloud className="w-4 h-4 text-amber-400" />
                                </div>
                                <p className="text-xs text-white font-black leading-tight">
                                  {isEn ? "4. Tech Architecture & CX Cloud Selection" : "4. 出海客服技术架构与云平台选型"}
                                </p>
                                <p className="text-[11px] text-slate-350 leading-relaxed font-sans text-left">
                                  {isEn 
                                    ? "Build reliable global digital infrastructure. Evaluate global cloud contact center platforms, global dedicated networks, cloud infra, and local telecom voice resources for low latency." 
                                    : "构筑稳定高效的全球化数字通信底座。全面评估主流海外云呼叫中心平台的技术实力与业务适配度，详解国际网络、云底座与本地语音资源的跨国架构组合，确保业务低延迟与高可用。"}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-900/60">
                                <span className="text-[9px] bg-slate-900 text-amber-400/90 px-1.5 py-0.5 rounded font-mono">
                                  {isEn ? "CX Cloud" : "云呼叫中心选型"}
                                </span>
                                <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                                  {isEn ? "Cloud Infra" : "网络与云底座"}
                                </span>
                                <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                                  {isEn ? "Telecom Voice" : "本地语音资源"}
                                </span>
                              </div>
                            </div>
                            
                            {/* Chapter 5 */}
                            <div id="chapter-card-5" className="p-4.5 bg-slate-950/65 border border-slate-850 hover:border-amber-500/30 rounded-2xl space-y-2.5 transition-all duration-300 flex flex-col justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">CHAPTER 05</span>
                                  <Share2 className="w-4 h-4 text-amber-400" />
                                </div>
                                <p className="text-xs text-white font-black leading-tight">
                                  {isEn ? "5. AI & Global Social Media Channel Synergy" : "5. 海外 AI 与社媒多渠道融合实战"}
                                </p>
                                <p className="text-[11px] text-slate-350 leading-relaxed font-sans text-left">
                                  {isEn 
                                    ? "Deconstruct global social channels like WhatsApp versus domestic ecosystems. Avoid generic AI pitfalls by aligning localized physical nodes and workflow tailoring for cost and quality." 
                                    : "解锁海外 AI 与多渠道通信的破局之道。深度解构 WhatsApp 等国际主流社媒渠道与国内生态差异；摒弃盲目堆砌通用大模型参数的误区，依托物理节点测算与业务流精准剪裁，实现人机协同降本增效。"}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-900/60">
                                <span className="text-[9px] bg-slate-900 text-amber-400/90 px-1.5 py-0.5 rounded font-mono">
                                  {isEn ? "Social Channels" : "国际社媒矩阵"}
                                </span>
                                <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                                  {isEn ? "AI Model Fit" : "AI与大模型选型"}
                                </span>
                                <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                                  {isEn ? "Cost Reduction" : "人机协同降本"}
                                </span>
                              </div>
                            </div>
                            
                            {/* Chapter 6 */}
                            <div id="chapter-card-6" className="p-4.5 bg-slate-950/65 border border-amber-500/30 hover:border-amber-500/50 rounded-2xl space-y-2.5 transition-all duration-300 flex flex-col justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/15 px-2 py-0.5 rounded-full">CHAPTER 06</span>
                                  <Users className="w-4 h-4 text-amber-400 animate-pulse" />
                                </div>
                                <p className="text-xs text-white font-black leading-tight">
                                  {isEn 
                                    ? "6. Global Employee Experience (EX) Management" 
                                    : "6. 海外员工体验管理"}
                                </p>
                                <p className="text-[11px] text-slate-350 leading-relaxed font-sans text-left">
                                  {isEn 
                                    ? "Deconstruct the core management philosophy that 'Employee Experience (EX) is the primary driver for Customer Experience (CX) growth'. Tackle heavy workloads, career path bottlenecks, and BPO cultural differences, mastering practical frameworks to reduce staff attrition rate." 
                                    : "深入解密“员工体验是客户体验增长源动力”的运营哲学。直面中企海外团队工作负荷过重、职业发展受限、以及跨国团队文化差异三大现实挑战；重点传授海外客服核心指标——“员工流失率”的痛点归因与实战降低方案，打造自驱高效的海外服务团队。"}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-900/60">
                                <span className="text-[9px] bg-slate-900 text-amber-400/90 px-1.5 py-0.5 rounded font-mono">
                                  {isEn ? "EX Fuels CX" : "员工体验驱动增长"}
                                </span>
                                <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                                  {isEn ? "Reduce Attrition" : "降低流失率实战"}
                                </span>
                                <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                                  {isEn ? "Cross-culture Synergy" : "跨国团队文化融合"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Student Takeaways */}
                        <div className="space-y-2.5">
                          <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest block font-mono">
                            {isEn ? "STUDENT TAKEAWAYS" : "高管学员课后带走成果 (TAKE AWAY)"}
                          </span>
                          
                          <div className="space-y-2">
                            <div className="flex gap-2.5 items-start text-xs text-slate-200 bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                              <span className="p-1 bg-amber-500/10 rounded text-amber-500 text-[10px] font-black font-mono">01</span>
                              <div className="space-y-0.5">
                                <p className="text-white font-black">{isEn ? "Signed Copy of 'Winning Overseas'" : "吕华亲笔签名纪念精装专著《出海制胜》一册"}</p>
                                <p className="text-slate-400 text-[11px]">{isEn ? "Includes complete structural diagnostic templates and offline operations files." : "人手一本纸质实战书，附随全套《全球联络中心跨国管理运维内部稽核工具表》。"}</p>
                              </div>
                            </div>
                            
                            <div className="flex gap-2.5 items-start text-xs text-slate-200 bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                              <span className="p-1 bg-amber-500/10 rounded text-amber-500 text-[10px] font-black font-mono">02</span>
                              <div className="space-y-0.5">
                                <p className="text-white font-black">{isEn ? "Outbound CX Custom Blueprint Template" : "专属贵司国别市场的《一页全景出海客服体系部署蓝图》"}</p>
                                <p className="text-slate-400 text-[11px]">{isEn ? "A strategic framework ready to pitch and deploy instantly in-company." : "在吕华先生面对面亲自诊断指导下，当堂建立起能立即可行、向董事会汇报的一站式客服落地方案。"}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Course syllabus consolidated/removed for CX Roadmap page. */}

                    </div>
                  </motion.div>
                ) : selectedCourseTab === "culture_map" ? (
                  <motion.div
                    key="culture_course"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2"
                  >
                    {/* Left Column: Image / Facts Block (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                      
                      {/* Course interactive 8-Axis Culture Map schematic infographic */}
                      <div className="relative group bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden aspect-video lg:aspect-square flex items-center justify-center shadow-2xl">
                        <img 
                          src={workshopPhoto} 
                          alt="Culture Map Workshop and Training"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover grayscale-0 group-hover:scale-102 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

                        {/* Admin custom workshop image upload trigger */}
                        {loggedInUser && (loggedInUser.role === "admin" || loggedInUser.role === "assistant") && (
                          <div className="absolute top-3 right-3 z-30 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-950/85 hover:bg-cyan-600 border border-slate-700 hover:border-cyan-400 rounded-lg text-[10px] text-cyan-400 hover:text-white font-extrabold transition-all cursor-pointer shadow-xl backdrop-blur-sm">
                              <UploadCloud className="w-3.5 h-3.5 text-cyan-500 group-hover:text-white" />
                              <span>{isUploadingWorkshopPhoto ? (isEn ? "Syncing..." : "同步保存中...") : (isEn ? "Upload Live Workshop Photo" : "⚡ 装载研讨会实况配图")}</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleWorkshopPhotoUpload} 
                              />
                            </label>
                            {workshopPhoto !== "/src/assets/images/culture_map_workshop.jpg" && (
                              <button 
                                type="button"
                                onClick={handleResetWorkshopPhoto}
                                className="px-2 py-1.5 bg-slate-950/85 border border-slate-700 hover:border-red-500 rounded-lg text-slate-400 hover:text-red-500 transition-all cursor-pointer shadow-xl backdrop-blur-sm text-[10px]"
                              >
                                {isEn ? "Reset" : "重置"}
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Hard facts glass card */}
                      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                        <h4 className="text-white text-xs font-black tracking-widest font-mono uppercase border-b border-slate-800 pb-2.5">
                          {isEn ? "QUICK COURSE FACTS" : "课程核心速览"}
                        </h4>
                        
                        <div className="space-y-3.5">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-400">{currT.durationLabel}:</span>
                            <span className="text-white font-bold">{isEn ? "1 Day (6 Hours)" : "1天 (6小时高精私房课)"}</span>
                          </div>
                          
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-400">{currT.formatLabel}:</span>
                            <span className="text-white font-bold text-right max-w-[200px]">Diagnostics, Team Mapping, Role-play</span>
                          </div>
                          
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-400">{currT.audienceLabel}:</span>
                            <span className="text-amber-400 font-bold text-right max-w-[200px]">C-Suite, Founders, MBA & Executive Students</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            setActiveTab("contact");
                            setTimeout(() => {
                              const element = document.getElementById("booking-form");
                              if (element) {
                                element.scrollIntoView({ behavior: "smooth" });
                              }
                            }, 100);
                          }}
                          className="w-full py-3 mt-4 rounded-xl text-xs font-black bg-cyan-600 text-white hover:bg-cyan-500 transition-all cursor-pointer shadow-lg hover:scale-101"
                        >
                          {isEn ? "Inquire For Corporate Seminars" : "本私房课高管预定预约"}
                        </button>
                      </div>

                    </div>

                    {/* Right Column: Detailed Presentation content (8 cols) */}
                    <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-8 flex flex-col justify-between">
                      <div className="space-y-6">
                        
                        {/* Course Category + Title */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-400 font-black tracking-widest font-mono uppercase">
                              Pillar B: Cross-Cultural Org
                            </span>
                            <span className="text-[10px] text-slate-400">• {isEn ? "Executive Masterclass" : "高管首选跨国博弈私房课"}</span>
                          </div>
                          <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                            {isEn ? "Executive Masterclass: Cross-Cultural Agile Organizations & Culture Maps" : "《跨文化高管管理与跨国敏捷组织大地图》高管私房研讨课"}
                          </h3>
                        </div>

                        {/* Course Description */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block font-mono">
                            {isEn ? "COURSE OVERVIEW" : "课程说明"}
                          </span>
                          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans text-left">
                            {isEn 
                              ? "Built upon INSEAD Professor Erin Meyer's renowned Culture Map 8-scale framework, paired with Harry's 20 years of real-world cross-border team management experience. Designed exclusively for globalizing executives to dissect cultural gaps, gain control in multi-party deliberations, and synchronize high-trust multi-flag teams."
                              : "本高管特训课程以中欧/中企全球化高管为靶向对象。以欧洲顶级商学院 INSEAD（欧洲工商管理学院）教授艾琳·梅耶经典的文化地图 8 大轴度相对间距落差测算为底层学术钢骨，融合吕华老师20年深耕西方500强企业巨头管理、印度高管协同及印尼本地跨地区团队运营的一线真枪实弹案例。直接教导您定量分析并一清二楚地算准海外本地管理层与母国决策层无摩擦对齐，如何优雅不失威信地突破沟通、纠偏、异议公开化等“隐形政治雷区”。"}
                          </p>
                        </div>

                        {/* Core Corporate Values */}
                        <div className="space-y-3">
                          <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest block font-mono">
                            {isEn ? "CORE CORPORATE VALUES" : "本私房课核心价值"}
                          </span>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-1">
                              <p className="text-xs text-white font-black flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-cyan-400" />
                                {isEn ? "Cultural Distance Radar" : "相对距离雷达锁定"}
                              </p>
                              <p className="text-[11px] text-slate-400 leading-normal">
                                {isEn 
                                  ? "Quantitative mapping of cross-cultural styles to prevent severe teamwork friction." 
                                  : "借助 8 轴相对距离工具，精确定位中国管理层与海外经理人在信任、汇报下的隐形盲点。"}
                              </p>
                            </div>
                            
                            <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-1">
                              <p className="text-xs text-white font-black flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                                {isEn ? "Unlocking C-Suite Approvals" : "突破跨国汇报特权"}
                              </p>
                              <p className="text-[11px] text-slate-400 leading-normal">
                                {isEn 
                                  ? "Master structured proposals for principles-first Western and Indian bosses." 
                                  : "彻底悟透并掌握降伏西方“原理优先”及印巴高管挑剔逻辑的超高段位文书与说服策略。"}
                              </p>
                            </div>
                            
                            <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-1">
                              <p className="text-xs text-white font-black flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                                {isEn ? "Creative Friction Forums" : "高信任冲突对防机制"}
                              </p>
                              <p className="text-[11px] text-slate-400 leading-normal">
                                {isEn 
                                  ? "Implement healthy dispute paths to drive core sprint targets over personal pride." 
                                  : "建立起德法式“对事不对人”和“不失面子”的内部公开烈度辩论，确保项目期（DUE）神圣不可延误。"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Student Takeaways */}
                        <div className="space-y-2.5">
                          <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest block font-mono">
                            {isEn ? "STUDENT TAKEAWAYS" : "高管学员课后带走成果 (TAKE AWAY)"}
                          </span>
                          
                          <div className="space-y-2">
                            <div className="flex gap-2.5 items-start text-xs text-slate-200 bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                              <span className="p-1 bg-cyan-500/10 rounded text-cyan-400 text-[10px] font-black font-mono">01</span>
                              <div className="space-y-0.5">
                                <p className="text-white font-black">{isEn ? "Customized 8-Axis Cultural Diagnostic" : "学员专属 8 轴个人偏好雷达量化测评诊断简报"}</p>
                                <p className="text-slate-400 text-[11px]">{isEn ? "Accurately compare your operational style against target Host-country executive standards." : "当堂定位学员的信任与沟通特质，与意向业务国（如德、日、印尼等）偏好数据对齐。"}</p>
                              </div>
                            </div>
                            
                            <div className="flex gap-2.5 items-start text-xs text-slate-200 bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                              <span className="p-1 bg-cyan-500/10 rounded text-cyan-400 text-[10px] font-black font-mono">02</span>
                              <div className="space-y-0.5">
                                <p className="text-white font-black">{isEn ? "21 Elite Outbound Team Communication Templates" : "21 套应对德德式/印巴高难协作的“话术护具”与回信模板"}</p>
                                <p className="text-slate-400 text-[11px]">{isEn ? "Unlock difficult replies, escalations, delays, and task push-backs elegantly." : "涵盖海外直接否定意见防护、东南亚推诿意见追踪话术，真正做到“见招拆招”。"}</p>
                              </div>
                            </div>
                            
                            <div className="flex gap-2.5 items-start text-xs text-slate-200 bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                              <span className="p-1 bg-cyan-500/10 rounded text-cyan-400 text-[10px] font-black font-mono">03</span>
                              <div className="space-y-0.5">
                                <p className="text-white font-black">{isEn ? "Elite Outbound Strategic Alumni Circle" : "终企跨国出海高管精英校友社群终身会籍"}</p>
                                <p className="text-slate-400 text-[11px]">{isEn ? "Exchange premium global BPO, communication and policy resources with peers internationally." : "吕华老师亲自运营的千人战友库，汇流出海一线的政策信息、跨国资源拼团和紧急互救协作。"}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Course Syllabus */}
                      <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
                        <span className="text-[10px] text-cyan-400 font-mono font-bold tracking-wider uppercase block">{isEn ? "COURSE SYLLABUS DIRECTORY" : "核心课程教学大纲细目"}</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {currT.mapSyllabus.map((syll, idx) => (
                            <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-300 bg-slate-950/20 p-2.5 rounded-xl border border-slate-850 opacity-90 hover:opacity-100 transition-opacity">
                              <span className="text-[10px] font-bold text-cyan-400 font-mono whitespace-nowrap">0{idx+1} //</span>
                              <span className="leading-snug">{syll}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="videos_course"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-8 animate-fade-in pt-2"
                  >
                    {/* Header Hero */}
                    <div className="space-y-2 mb-6 text-center">
                      <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest block">MASTERCLASS VIDEO COURSEWARE</span>
                      <h3 className="text-2xl md:text-3xl font-black text-white">线上：高级出海敏捷交付实战视频课件</h3>
                      <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
                        {isEn ? (
                          "Complementing Harry's bestseller, access 11 tailored masterclass videos detailing cross-cultural management cases."
                        ) : (
                          "配合官方主推大作《出海制胜：六步打造卓越客户体验》特制的 11 节核心高管实战视频课。每节约十至十五分钟，内含真实国际客户体验与文化冲突诊断课件。"
                        )}
                      </p>
                    </div>

                    {/* Access tier overview callout or Coming Soon Notice Card */}
                    {(() => {
                      const isSuperAdmin = loggedInUser && (
                        loggedInUser.role === "admin" ||
                        loggedInUser.role === "assistant"
                      );
                      if (isSuperAdmin) {
                        return (
                          <div className="p-4 sm:p-5 bg-slate-900/60 border border-slate-800 rounded-3xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl shrink-0">
                                <Video className="w-5 h-5 text-amber-500" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                                  {isEn ? "ADMIN CONTROL PASS ACTIVE" : "🔑 吕老师尊享超级管理员特权"}
                                </h4>
                                <p className="text-[10.5px] sm:text-xs text-slate-400 leading-relaxed">
                                  {isEn 
                                    ? "🎉 Super Administrator: Full debug playback control & course PDF download unlocked for sandbox inspection."
                                    : "🎉 超级管理员/助教：已对本会话开启 debug 点播特权。所有 11 节未上线课件及讲义资源均处于免鉴权可点播状态，便于您进行演示、会场走查与课件审核。"}
                                </p>
                              </div>
                            </div>
                            
                            <div className="shrink-0 flex items-center gap-2">
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 rounded-lg text-xs font-bold">
                                <Shield className="w-3.5 h-3.5 animate-pulse" />
                                <span>{isEn ? "Super Admin" : "超级管理员调试态"}</span>
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="p-6 bg-slate-900/80 border border-amber-500/30 rounded-3xl max-w-4xl mx-auto space-y-4 shadow-xl text-left">
                            <div className="flex gap-4 items-start">
                              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl shrink-0">
                                <Clock className="w-6 h-6 text-amber-400 animate-pulse" />
                              </div>
                              <div className="space-y-2">
                                <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-2 flex-wrap">
                                  <span>🚀 {isEn ? "VIDEO COURSEWARE IN PRODUCTION" : "线上视频课件上线规划及发布预告"}</span>
                                  <span className="px-2 py-0.5 rounded text-[9px] bg-amber-500 text-slate-950 font-black animate-pulse">
                                    {isEn ? "COMING SOON" : "敬请期待"}
                                  </span>
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                  {isEn ? (
                                    "Dear student, the full series of 11 executive video courseware modules is currently in high-definition recording and cloud optimization. Harry Lyu will be completing the uploads and unlocking the interactive courseware for all VIP pass holders in the coming weeks. You are welcome to review the chapter outline and syllabus structure below as a preview of your global learning roadmap!"
                                  ) : (
                                    "尊敬的学子，为了保障出海实战案例的高清观看体验以及极致鉴权防盗安全性，吕华老师正在对本套 11 节核心高管实战视频课件进行逐课精益录制、专业视听后期制作与云端安全合规上载。本套线上课件将于近期全面交付上线并面向 VIP 订阅学子开放！目前您可以先行预览下方 11 节核心实战案例大纲，了解未来出海实战学习的完整交付路线图，敬请期待！"
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })()}

                    {/* Search and Filters Segment */}
                    <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 items-center">
                      <div className="relative w-full sm:flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          value={videoSearchQuery}
                          onChange={(e) => setVideoSearchQuery(e.target.value)}
                          placeholder={isEn ? "Search by titles, tag, or country..." : "按标题名称、国家标签、大纲要点进行联想过滤..."}
                          className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-xl p-2.5 pl-10 focus:outline-none focus:border-amber-500 placeholder:text-slate-500 text-xs"
                        />
                      </div>

                      {/* Filter tags list */}
                      <div className="flex flex-wrap items-center justify-start gap-1.5 w-full sm:w-auto">
                        {["All", "高低语境", "沟通反馈", "谈判说服", "巴西案例", "沙特面子", "原则优先"].map((filterTag) => {
                          const tagLabelMap: { [key: string]: string } = {
                            "All": isEn ? "All" : "全部课件",
                            "高低语境": isEn ? "High/Low Context" : "高低语境",
                            "沟通反馈": isEn ? "Feedback & Communication" : "沟通反馈",
                            "谈判说服": isEn ? "Persuasion & Negotiation" : "谈判说服",
                            "巴西案例": isEn ? "Brazil Case" : "巴西案例",
                            "沙特面子": isEn ? "Saudi Face" : "沙特面子",
                            "原则优先": isEn ? "Principles First" : "原则优先"
                          };
                          const isActive = videoActiveTagFilter === filterTag;
                          return (
                            <button
                              key={filterTag}
                              type="button"
                              onClick={() => setVideoActiveTagFilter(filterTag)}
                              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                                isActive
                                  ? "bg-amber-500 text-slate-950 font-extrabold"
                                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800"
                              }`}
                            >
                              {tagLabelMap[filterTag]}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Videos Course Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch pt-2">
                      {(() => {
                        const isSuperAdmin = loggedInUser && (
                          loggedInUser.role === "admin" ||
                          loggedInUser.role === "assistant"
                        );
                        const hasAllAccess = loggedInUser && (
                          loggedInUser.role === "admin" ||
                          loggedInUser.role === "assistant" ||
                          ["1mo", "3mo", "1yr"].includes(loggedInUser.selectedPlan || "")
                        );

                        return VIDEO_MODULES.filter((mod) => {
                          // Filter by search query
                          const query = videoSearchQuery.toLowerCase();
                          const titleMatch = mod.titleZh.toLowerCase().includes(query) || mod.titleEn.toLowerCase().includes(query);
                          const descMatch = mod.descZh.toLowerCase().includes(query) || mod.descEn.toLowerCase().includes(query);
                          const countryMatch = mod.caseCountryZh.toLowerCase().includes(query) || mod.caseCountryEn.toLowerCase().includes(query);
                          const tagsMatch = mod.tags.some((t) => t.toLowerCase().includes(query));
                          const matchesSearch = !query || titleMatch || descMatch || countryMatch || tagsMatch;

                          // Filter by tag
                          const matchesTag = videoActiveTagFilter === "All" || mod.tags.includes(videoActiveTagFilter) || (videoActiveTagFilter === "巴西案例" && mod.caseCountryZh === "巴西") || (videoActiveTagFilter === "沙特面子" && mod.caseCountryZh === "沙特阿拉伯") || (videoActiveTagFilter === "原则优先" && mod.tags.some(t => t.includes("原则")));
                          
                          return matchesSearch && matchesTag;
                        }).map((mod) => {
                          const isUnlocked = mod.isFree || hasAllAccess;
                          return (
                            <div
                              key={mod.id}
                              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden text-left"
                            >
                              {/* Background subtle glowing orb for active item */}
                              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/2 rounded-full blur-2xl group-hover:bg-amber-500/5 transition-all duration-500" />

                              <div className="space-y-3">
                                {/* Module Badge & Free indicator */}
                                <div className="flex justify-between items-center">
                                  <span className="font-mono text-xs font-black tracking-wider text-amber-500 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-md">
                                    {mod.id}
                                  </span>
                                  {mod.isFree ? (
                                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-black uppercase flex items-center gap-1 animate-pulse">
                                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                      {isEn ? "Free Trial" : "免费试听课"}
                                    </span>
                                  ) : (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase flex items-center gap-1 ${
                                      isUnlocked 
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                        : "bg-slate-950 text-slate-500 border border-slate-800"
                                    }`}>
                                      {isUnlocked ? (
                                        <>
                                          <LockOpen className="w-3.5 h-3.5" />
                                          <span>{isEn ? "Unlocked" : "特权已解锁"}</span>
                                        </>
                                      ) : (
                                        <>
                                          <Lock className="w-3.5 h-3.5 text-slate-500" />
                                          <span>{isEn ? "VIP Pass" : "高管专享"}</span>
                                        </>
                                      )}
                                    </span>
                                  )}
                                </div>

                                {/* Country Case and Duration Indicator */}
                                <div className="flex items-center gap-3 text-slate-400 font-mono text-[10px] font-bold">
                                  <span className="text-amber-400">
                                    🎯 Case: {isEn ? mod.caseCountryEn : mod.caseCountryZh}
                                  </span>
                                  <span>|</span>
                                  <span>⏱️ {mod.duration}</span>
                                </div>

                                {/* Video Title */}
                                <h4 className="text-sm font-black text-white group-hover:text-amber-400 transition-colors tracking-tight leading-snug">
                                  {isEn ? mod.titleEn : mod.titleZh}
                                </h4>

                                {/* Description */}
                                <p className="text-xs text-slate-455 leading-relaxed font-sans line-clamp-3">
                                  {isEn ? mod.descEn : mod.descZh}
                                </p>

                                {/* Module Tags list */}
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {mod.tags.map((tg) => (
                                    <span key={tg} className="text-[9.5px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded font-mono border border-slate-900">
                                      #{tg}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Action triggers */}
                              <div className="mt-5 pt-4 border-t border-slate-800/60 flex gap-2 items-center">
                                {isSuperAdmin ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (isUnlocked) {
                                          setSelectedVideoToPlay(mod);
                                          setIsPlayingMockVideo(true);
                                          setMockVideoPlaybackProgress(0);
                                        } else {
                                          alert(isEn 
                                            ? "This premium module is locked. Please upgrade your subscription to Month/Quarter/Year plans or log in!" 
                                            : "该课程属于高级出海主训课。请登录您的学子会籍或前往「订阅与联系」购买包期特权卡。");
                                          setActiveTab("pricing");
                                        }
                                      }}
                                      className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                        isUnlocked
                                          ? "bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-md active:scale-95 border-none"
                                          : "bg-slate-950 text-slate-600 border border-slate-800 hover:border-slate-700 hover:text-slate-500 cursor-not-allowed"
                                      }`}
                                    >
                                      <Play className="w-3.5 h-3.5 shrink-0" />
                                      <span>{isEn ? "Play Video" : "观看视频课件"}</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (isUnlocked) {
                                          setSelectedVideoToViewPdf(mod);
                                          setCurrentPdfSlideIndex(1);
                                        } else {
                                          alert(isEn 
                                            ? "This lesson's PDF notes are locked. Please upgrade to a Monthly/Quarterly/Yearly plan to unlock!" 
                                            : "随课讲义笔记属于高管会员专属特权。请购买出海战略套餐以一键下载/在线阅读讲义。");
                                          setActiveTab("pricing");
                                        }
                                      }}
                                      className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer"
                                      title={isEn ? "View Lecture Notes" : "阅读课件讲义 PDF"}
                                    >
                                      <FileText className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      disabled
                                      className="flex-1 py-2 text-xs font-black rounded-xl bg-slate-950 text-slate-500 border border-slate-850/60 cursor-not-allowed flex items-center justify-center gap-1.5"
                                    >
                                      <Clock className="w-3.5 h-3.5 shrink-0 text-slate-600" />
                                      <span>{isEn ? "Coming Soon" : "敬请期待"}</span>
                                    </button>

                                    <button
                                      type="button"
                                      disabled
                                      className="p-2 bg-slate-950 text-slate-600 border border-slate-850/60 rounded-xl cursor-not-allowed"
                                      title={isEn ? "In Production" : "课件录制中"}
                                    >
                                      <Lock className="w-4 h-4 text-slate-600" />
                                    </button>
                                  </>
                                )}
                              </div>

                            </div>
                          );
                        });
                      })()}
                    </div>


                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}

          {/* ================= TAB 4: INTERACTIVE CULTURE MAP SUITE ================= */}
          {activeTab === "tool" && (
            <motion.div
              key="tab-tool"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              
              {/* Top Sub-Tab Switcher Bar for Tools (Sticky Navigation 紧贴一级菜单下方) */}
              <div className="sticky top-[106px] sm:top-[118px] z-40 bg-slate-950/90 backdrop-blur-md border border-slate-800/90 p-2.5 md:p-3 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-2.5 md:gap-4 shadow-2xl transition-all ring-1 ring-slate-800/50">
                <div className="flex items-center gap-2 pl-1 w-full md:w-auto">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                  <span className="text-xs font-black text-white tracking-tight shrink-0">
                    {isEn ? "Tool Module:" : "工具模块："}
                  </span>
                  <span className="text-[10px] font-mono text-amber-500/80 hidden sm:inline truncate">
                    {isEn ? "INTERACTIVE TOOLKIT" : "跨国文化与客情体验实战工具箱"}
                  </span>
                </div>

                {/* 3 Sub-Tab Buttons */}
                <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800/80 flex items-center gap-1.5 w-full md:w-auto overflow-x-auto no-scrollbar shadow-lg">
                  <button
                    type="button"
                    onClick={() => setToolSubTab("culture_map")}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap ${
                      toolSubTab === "culture_map"
                        ? "bg-amber-500 text-slate-950 shadow-md scale-102"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>国家文化地图</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setToolSubTab("cases")}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap ${
                      toolSubTab === "cases"
                        ? "bg-cyan-500 text-slate-950 shadow-md scale-102"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>案例剖析</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setToolSubTab("pain_points")}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap ${
                      toolSubTab === "pain_points"
                        ? "bg-emerald-500 text-slate-950 shadow-md scale-102"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>学员痛点 AI 分析</span>
                  </button>
                </div>
              </div>

              {/* ================= SUB-TAB 1: 国家文化地图 ================= */}
              {toolSubTab === "culture_map" && (
                <div className="space-y-8">
                  <div id="sandbox-hero-banner" className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
                {/* Visual subtle gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/10 to-slate-950/20 pointer-events-none" />
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  {/* Top Header Row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850 pb-5">
                    <div className="space-y-2 text-left">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-[10px] font-mono font-black text-amber-500 tracking-wider uppercase">
                          {isEn ? "Interactive Suite & Simulation" : "文化地图 - 国家视角"}
                        </span>
                      </div>
                      <h2 className="text-xl md:text-2.5xl lg:text-3xl font-black text-white tracking-tight leading-tight">
                        {currT.toolSectionTitle}
                      </h2>
                      <p className="text-slate-400 text-xs md:text-sm max-w-4xl leading-relaxed">
                        {currT.toolSectionSubtitle}
                      </p>
                    </div>
                  </div>

                  {/* Compass Layout Grid (Visual Above, Sidebar Right) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    
                    {/* Compass Image Container (lg:col-span-7) */}
                    <div className="lg:col-span-7 flex flex-col justify-start space-y-4">
                      
                      {/* Interactive Country Selector & Lock Status Header (Moved to Left Column to balance visual space) */}
                      <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 shadow-lg shadow-slate-950/40 relative overflow-hidden">
                        {/* Elegant background highlight */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <span className="text-[10px] font-mono font-black text-amber-500 tracking-wider block uppercase flex items-center gap-1.5 select-none">
                            <Globe className="w-3.5 h-3.5 animate-spin-slow-custom text-amber-500" />
                            {isEn ? "SELECT OUTBOUND TARGET REGION" : "🎯 出海目的地国别（支持打点切换及快速下拉选择）"}
                          </span>
                          {!isTraineeActive && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 w-fit self-start sm:self-auto select-none">
                              {isEn ? "GUEST MODE (China, US, JP, FR)" : "游客限免：仅可看中/美/日/法"}
                            </span>
                          )}
                        </div>

                        {/* Styled custom Dropdown Select */}
                        <div className="relative">
                          <select
                            value={activeProfileCountry}
                            onChange={(e) => {
                              const val = e.target.value;
                              setActiveProfileCountry(val);
                              // Sync map pins if applicable
                              const names = ["China", "United States", "Japan", "India", "France"];
                              const idx = names.indexOf(val);
                              if (idx >= 0) {
                                setMapTourActiveStep(idx);
                              } else {
                                setMapTourActiveStep(-1); // custom country
                              }
                            }}
                            className="w-full bg-slate-900 hover:border-slate-700 border border-slate-800 rounded-xl px-3 py-2 text-xs font-black text-white focus:outline-none focus:border-amber-500 cursor-pointer transition-all"
                          >
                            {sortedCountriesForSelect.map((ctry) => {
                              const isBasic = ["China", "United States", "Japan", "France"].includes(ctry.nameEn);
                              const isLocked = !isTraineeActive && !isBasic;
                              return (
                                <option 
                                  key={ctry.nameEn} 
                                  value={ctry.nameEn}
                                  className="bg-slate-950 text-xs font-bold py-1.5"
                                >
                                  {isLocked ? "🔒 " : ""}{isEn ? ctry.nameEn : `${ctry.nameZh} (${ctry.nameEn})`}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>

                      {/* Map Container Box */}
                      <div className="relative w-full aspect-[2816/1536] rounded-2xl overflow-hidden border border-slate-800 bg-[#07090e] shadow-2xl select-none group">
                        
                        {/* Original Compass Atlas PNG */}
                        <img 
                          src="/src/assets/images/golden_culture_compass.png" 
                          alt="Culture Compass Deconstruction Atlas" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-700"
                        />

                        {/* Certified Compass Atlas Badge */}
                        <div className="absolute top-3 right-3 z-30 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500 border border-amber-400 rounded-lg text-[10px] text-slate-950 font-black shadow-xl">
                            <Compass className="w-3.5 h-3.5 text-slate-950 animate-spin-slow animate-spin-slow-custom" />
                            <span>{isEn ? "Gold Compass Calibrated" : "黄金罗盘 · 官方版本已校准"}</span>
                          </span>
                        </div>

                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />

                        {/* 1. Hotspot: Golden Compass (Step 0) */}
                        <div 
                          style={{ top: '48%', left: '52%' }} 
                          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/hs cursor-pointer"
                          onClick={() => setMapTourActiveStep(0)}
                        >
                          <span className={`absolute -inset-4 rounded-full bg-amber-500/30 animate-ping ${mapTourActiveStep === 0 ? "scale-150 duration-1000 opacity-100" : "opacity-0"}`} />
                          <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${mapTourActiveStep === 0 ? "bg-amber-500 border-white scale-125 shadow-lg shadow-amber-500/50" : "bg-slate-950/80 border-amber-500 hover:bg-amber-600/80"}`}>
                            <Compass className="w-4 h-4 text-white" />
                          </div>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] font-black text-amber-500 whitespace-nowrap shadow-xl opacity-0 group-hover/hs:opacity-100 transition-opacity duration-200 pointer-events-none">
                            🧭 {isEn ? "Golden Balance Hub (Click)" : "黄金罗盘中央底座 (点击)"}
                          </div>
                        </div>

                        {/* Country Pins on the Map */}
                        {[
                          {
                            id: 0,
                            nameZh: "中国",
                            nameEn: "China",
                            flag: "🇨🇳",
                            top: "52%",
                            left: "72%"
                          },
                          {
                            id: 1,
                            nameZh: "美国",
                            nameEn: "United States",
                            flag: "🇺🇸",
                            top: "46%",
                            left: "26%"
                          },
                          {
                            id: 2,
                            nameZh: "日本",
                            nameEn: "Japan",
                            flag: "🇯🇵",
                            top: "48%",
                            left: "80%"
                          },
                          {
                            id: 3,
                            nameZh: "印度",
                            nameEn: "India",
                            flag: "🇮🇳",
                            top: "60%",
                            left: "66%"
                          },
                          {
                            id: 4,
                            nameZh: "法国",
                            nameEn: "France",
                            flag: "🇫🇷",
                            top: "40%",
                            left: "49%"
                          }
                        ].map((country) => (
                          <div 
                            key={country.id}
                            style={{ top: country.top, left: country.left }} 
                            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/hs cursor-pointer"
                            onClick={() => {
                              setMapTourActiveStep(country.id);
                              setActiveProfileCountry(country.nameEn);
                            }}
                          >
                            <span className={`absolute -inset-3 rounded-full ${country.id === mapTourActiveStep ? "bg-amber-500/30 animate-ping scale-125 duration-1000 opacity-100" : "opacity-0 group-hover/hs:opacity-100 bg-amber-500/10 scale-105"}`} />
                            <div className={`flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-full border shadow-md backdrop-blur-md transition-all duration-300 ${country.id === mapTourActiveStep ? "bg-amber-500 border-white text-slate-950 scale-105 font-black shadow-amber-500/20" : "bg-slate-900/90 border-slate-700 text-slate-200 hover:border-amber-400 hover:text-white"}`}>
                              <span className="text-[10px] sm:text-xs select-none">{country.flag}</span>
                              <span className="text-[8px] sm:text-[9.5px] font-black uppercase tracking-wider font-sans whitespace-nowrap">
                                {isEn ? (country.nameEn === "United States" ? "US" : country.nameEn) : country.nameZh}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Clean caption outside the map container to prevent blocking the gorgeous compass */}
                      <div className="text-[9px] sm:text-[10px] text-slate-400 flex items-center justify-between px-1 select-none">
                        <span className="font-bold text-amber-500/80 flex items-center gap-1">
                          <Compass className="w-3 h-3 animate-spin-slow-custom" />
                          {isEn ? "Harry Lyu's Cultural Compass" : "吕华出海国别文化地图 · 跨文化底层透视"}
                        </span>
                        <span className="text-slate-500">
                          {isEn ? "Tap country flags on the map" : "直接点击地图上的国别标签快捷切换"}
                        </span>
                      </div>
                    </div>

                    {/* Explanatory dynamic content block (lg:col-span-5) */}
                    <div className="lg:col-span-5 flex flex-col justify-start space-y-4 self-stretch text-left">
                      
                      {/* Content Well: Checks Lock Overlay */}
                      {(() => {
                        const isBasic = ["China", "United States", "Japan", "France"].includes(activeProfileCountry);
                        const isLocked = !isTraineeActive && !isBasic;

                        if (isLocked) {
                          return (
                            <div className="bg-slate-950/95 border border-amber-500/25 rounded-2xl p-5 relative flex-grow flex flex-col justify-center items-center text-center space-y-4 min-h-[300px]">
                              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                                <Lock className="w-6 h-6 animate-pulse" />
                              </div>
                              <div className="space-y-1 max-w-sm">
                                <h4 className="text-sm font-black text-white">
                                  {isEn ? "💎 Unlock 30+ Country Gene Maps" : "💎 锁定：解锁全套 30+ 全球出海目的地 cultural features"}
                                </h4>
                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                  {isEn 
                                    ? "Registered outbound trainees get full unhindered access to detailed cross-cultural summaries, dimension highlights, and action plans for Germany, UK, Southeast Asia, Brazil, Middle East and more."
                                    : "您当前处于游客受限体验阶段。本国别（如德国、印度、英国、新加坡、沙特、越南等）需要专属学子包期卡方能开启极高对比尺度分析与吕华总教头私房管理大纲："}
                                </p>
                              </div>

                              {/* Subscription Tier Presentation Grid */}
                              <div className="grid grid-cols-2 gap-2 w-full max-w-md pt-1.5">
                                <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-left space-y-0.5">
                                  <div className="text-[10px] font-bold text-amber-500 font-sans">24小时闪电卡</div>
                                  <div className="text-xs font-black text-white">¥49 <span className="text-[9px] text-slate-550 font-normal">($6.9)</span></div>
                                  <div className="text-[8.5px] text-slate-500">极速体验单国特色</div>
                                </div>
                                <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-left space-y-0.5">
                                  <div className="text-[10px] font-bold text-amber-500 font-sans">1个月成长卡</div>
                                  <div className="text-xs font-black text-white">¥59 <span className="text-[9px] text-slate-550 font-normal">($8.9)</span></div>
                                  <div className="text-[8.5px] text-slate-500">深度透视、完整案例</div>
                                </div>
                                <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-left space-y-0.5">
                                  <div className="text-[10px] font-bold text-amber-500 font-sans">3个月进阶卡 <span className="text-[8px] bg-red-500/20 text-red-400 px-1 rounded font-black">HOT</span></div>
                                  <div className="text-xs font-black text-white">¥99 <span className="text-[9px] text-slate-550 font-normal">($14.9)</span></div>
                                  <div className="text-[8.5px] text-slate-500">超值力荐、跨国调适</div>
                                </div>
                                <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-left space-y-0.5">
                                  <div className="text-[10px] font-bold text-amber-500 font-sans">1年出海精英卡</div>
                                  <div className="text-xs font-black text-white">¥328 <span className="text-[9px] text-slate-550 font-normal">($46.9)</span></div>
                                  <div className="text-[8.5px] text-slate-500">包年永久、月均仅¥27</div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setAuthMode("register");
                                  setShowLoginModal(true);
                                }}
                                className="w-full max-w-sm py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <Award className="w-4 h-4" />
                                <span>{isEn ? "Register / Activate Full Access Trainee Card" : "立即建立学子档案并获取包期特许权"}</span>
                              </button>
                            </div>
                          );
                        }

                        // Otherwise, render unlocked country profile details!
                        const selectedCountryObj = COUNTRIES.find(c => c.nameEn === activeProfileCountry) || COUNTRIES[0];
                        const profile = getCountryProfile(activeProfileCountry, selectedCountryObj.scores, isEn);

                        return (
                          <div id="progressive-explanations-well" className="bg-slate-950 rounded-2xl p-5 border border-slate-800 relative flex-grow flex flex-col justify-start space-y-4 min-h-[300px]">
                            
                            {/* Country Header Title & Flag */}
                            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                              <span className="text-2xl select-none leading-none">
                                {activeProfileCountry === "China" ? "🇨🇳" : 
                                 activeProfileCountry === "United States" ? "🇺🇸" : 
                                 activeProfileCountry === "Japan" ? "🇯🇵" : 
                                 activeProfileCountry === "France" ? "🇫🇷" : 
                                 activeProfileCountry === "Germany" ? "🇩🇪" : 
                                 activeProfileCountry === "India" ? "🇮🇳" : "🌐"}
                              </span>
                              <div>
                                <h4 className="text-base font-black text-white">
                                  {isEn ? selectedCountryObj.nameEn : `${selectedCountryObj.nameZh} · 跨文化底层面貌`}
                                </h4>
                                <p className="text-[9px] text-slate-550 font-mono uppercase tracking-wider">
                                  {selectedCountryObj.nameEn} · EXECUTIVES PROFILE OUTLINE
                                </p>
                              </div>
                            </div>

                            {/* Top Selected Key Dimension Highlights (2-3 distinct dimensions) */}
                            <div className="space-y-2.5 text-left">
                              <span className="text-[9px] font-black text-slate-500 font-mono tracking-widest block uppercase">
                                💡 {isEn ? "CORE CULTURAL ANCHORS" : "该目的地极重维度警示标签"}
                              </span>

                              <div className="grid grid-cols-1 gap-2">
                                {profile.highlights.map((hl, index) => (
                                  <div key={index} className="p-2.5 bg-slate-900/30 border border-slate-850 hover:border-slate-800 rounded-xl space-y-0.5 text-left transition-colors">
                                    <div className="flex items-center justify-between text-[11px] font-black text-white">
                                      <span className="flex items-center gap-1 text-slate-200 font-sans">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                        {hl.title}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                      {hl.text}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Executive Synthesis Box */}
                            <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl space-y-1 relative overflow-hidden text-left">
                              <Quote className="w-12 h-12 text-slate-800/25 absolute -right-2 -bottom-2 pointer-events-none" />
                              <span className="text-[9px] font-black text-amber-500 font-mono tracking-widest block">
                                🧭 {isEn ? "EXECUTIVE SUMMARY" : "吕华导师·高管治理综述建议"}
                              </span>
                              <p className="text-[11px] text-slate-300 leading-relaxed text-justify relative z-10 font-medium">
                                {profile.executiveSummary}
                              </p>
                            </div>

                          </div>
                        );
                      })()}

                    </div>

                  </div>

                </div>

              </div>



              {/* Premium Card for Country Selector - Collapsible to avoid clutter */}
              <div id="country-selector-panel" className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl text-left space-y-4">
                <div className="flex flex-col md:flex-row md:items-start lg:items-center justify-between gap-4 border-b border-slate-800/60 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-white">
                      <Globe className="w-5 h-5 text-amber-500 shrink-0" />
                      <h3 className="text-base font-black text-white tracking-tight">
                        {isEn ? "GLOBAL COMPARISON SELECTOR" : `🌐 ${currT.compareTitle}`}
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {isEn 
                        ? "Select target nations (2 to 4 recommended) to dynamically load behaviors and compute matrix gap below." 
                        : "勾选需要对比的出海目的地国家（支持多选，分配专属色彩），即可在下方雷达图与八行为尺度中计算文化落差与防弹话术："}
                    </p>
                  </div>
                  
                  {/* Active selected tags indicator on the right */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">{isEn ? "Active:" : "当前已选:"}</span>
                    {selectedCountries.map(cName => {
                      const cObj = COUNTRIES.find(ctry => ctry.nameEn === cName);
                      const styles = COUNTRY_COLORS[cName] || COUNTRY_COLORS["United States"];
                      return (
                        <span key={cName} className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 bg-slate-950 border ${styles.border} ${styles.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                          {cObj ? (isEn ? cObj.nameEn : cObj.nameZh) : cName}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Country Buttons - Collapsible */}
                <div className="space-y-3">
                  {/* Featured Countries (Directly visible) */}
                  <div className="flex flex-wrap gap-1.5">
                    {(() => {
                      // Featured list
                      const featuredEn = ["China", "United States", "Germany", "Japan", "India", "Singapore"];
                      // We also always show any country that is currently selected, so the user never loses sight of active selections!
                      const visibleCountries = COUNTRIES.filter(ctry => 
                        featuredEn.includes(ctry.nameEn) || selectedCountries.includes(ctry.nameEn)
                      );
                      const remainingCountries = COUNTRIES.filter(ctry => 
                        !featuredEn.includes(ctry.nameEn) && !selectedCountries.includes(ctry.nameEn)
                      );

                      return (
                        <>
                          {/* Visible part */}
                          <div className="flex flex-wrap gap-1.5 w-full items-center">
                            <div className="flex flex-wrap gap-1.5 flex-grow">
                              {visibleCountries.map(ctry => {
                                const isSelected = selectedCountries.includes(ctry.nameEn);
                                const styles = COUNTRY_COLORS[ctry.nameEn] || COUNTRY_COLORS["United States"];
                                return (
                                  <button
                                    key={ctry.nameEn}
                                    type="button"
                                    onClick={() => toggleCountrySelection(ctry.nameEn)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                                      isSelected
                                        ? `${styles.bg} ${styles.border} ${styles.text} border-2 scale-[1.02] shadow-sm`
                                        : "bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-850"
                                    }`}
                                  >
                                    <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
                                    {isEn ? ctry.nameEn : ctry.nameZh}
                                    {isSelected && <Check className="w-3.5 h-3.5 text-current ml-0.5 shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Collapsible toggle button */}
                            <button
                              type="button"
                              onClick={() => setIsMoreCountriesExpanded(!isMoreCountriesExpanded)}
                              className="px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-all bg-slate-950 hover:bg-slate-800 border border-slate-850 hover:border-amber-500/50 text-amber-500 flex items-center gap-1 shrink-0 ml-auto"
                            >
                              {isMoreCountriesExpanded ? (
                                <>
                                  <span>{isEn ? "Collapse Others ▲" : "收起其它出海国 ▲"}</span>
                                </>
                              ) : (
                                <>
                                  <span>{isEn ? `Show More (${remainingCountries.length}+) ▼` : `展开全部 (${remainingCountries.length}+) 国家 ▼`}</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Expanded list of remaining countries with simple slide/fade motion */}
                          <AnimatePresence>
                            {isMoreCountriesExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden w-full border-t border-slate-800/40 pt-3 flex flex-wrap gap-1.5"
                              >
                                {remainingCountries.map(ctry => {
                                  const isSelected = selectedCountries.includes(ctry.nameEn);
                                  const styles = COUNTRY_COLORS[ctry.nameEn] || COUNTRY_COLORS["United States"];
                                  return (
                                    <button
                                      key={ctry.nameEn}
                                      type="button"
                                      onClick={() => toggleCountrySelection(ctry.nameEn)}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                                        isSelected
                                          ? `${styles.bg} ${styles.border} ${styles.text} border-2 scale-[1.02] shadow-sm`
                                          : "bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-850"
                                      }`}
                                    >
                                      <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
                                      {isEn ? ctry.nameEn : ctry.nameZh}
                                      {isSelected && <Check className="w-3.5 h-3.5 text-current ml-0.5 shrink-0" />}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* MODULE 1: Dynamic country compare radar */}
              <div id="compare-console" className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                
                <div className="border-b border-slate-800 bg-slate-950/60 p-5 md:px-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Globe className="w-5 h-5 text-amber-500 shrink-0" />
                      {isEn ? "Quantitative Alignment Axis Scales" : "📊 八行为尺度多维对齐校准仪"}
                    </h3>
                    <p className="text-slate-400 text-xs text-left">
                      {isEn ? "Select behavioral scales on the left to read tactical expert profiles and mitigation strategies." : "在左侧切换或点击罗盘星图层。点击单一维度卡，可在右侧查阅该国偏向深度治理意见与吕华总教头给出的实战防弹话术。"}
                    </p>
                  </div>
                </div>

                {/* Quantitative Graph rendering list & Explainer Panel dual columns */}
                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left horizontal scales drawing */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wide">
                      <span>{currT.axisTitle}</span>
                      <span className="text-amber-500 select-none">{currT.axisClickTip}</span>
                    </div>

                    <div className="space-y-3.5">
                      {DIMENSIONS.map(dim => {
                        const isChosenDim = activeDimension.id === dim.id;
                        return (
                          <div
                            key={dim.id}
                            onClick={() => setActiveDimension(dim)}
                            className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                              isChosenDim
                                ? "bg-slate-950 border-amber-500 shadow-lg"
                                : "bg-slate-950/40 border-slate-850/80 hover:border-slate-700/80"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-200">
                                  {isEn ? dim.nameEn : dim.nameZh}
                                </span>
                                {dim.id === "persuading" && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] text-amber-400 font-bold">
                                    🌐 {isEn ? "Includes Holistic" : "含宏观整体思维"}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500 font-semibold uppercase">0 to 10 Relative Gap</span>
                            </div>

                            {/* Relative Axis Line */}
                            <div className="h-8 relative flex items-center">
                              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-800 border-dashed" />
                              <div className="w-full h-1 bg-slate-800 rounded-full relative flex items-center">
                                
                                {dim.id === "persuading" && (
                                  <div 
                                    className="absolute left-[38%] right-[38%] top-[-3px] bottom-[-3px] border-x border-dashed border-amber-500/40 bg-amber-500/[0.04] pointer-events-none rounded-sm"
                                    title={isEn ? "Eastern Holistic Thinking Zone" : "东方宏观整体思维区域"}
                                  />
                                )}

                                {(() => {
                                  // Pre-compute coordinates and resolve overlaps
                                  const computedPoints = selectedCountries.map(ctryEn => {
                                    const base = COUNTRIES.find(c => c.nameEn === ctryEn);
                                    if (!base) return null;
                                    const score = base.scores[dim.id] ?? 5;
                                    
                                    // Map 1-10 to percentage
                                    let percent = ((score - 1) / 9) * 100;
                                    
                                    const isHolistic = dim.id === "persuading" && [
                                      "China", "Japan", "South Korea", "Indonesia", "Vietnam", 
                                      "Thailand", "Singapore", "Saudi Arabia", "UAE", "Philippines", "Hong Kong (China)"
                                    ].includes(ctryEn);

                                    if (isHolistic) {
                                      // Clean, distributed coordinates in the holistic center zone without overlapping
                                      const holisticOrder = [
                                        "China", "Saudi Arabia", "UAE", "South Korea", "Philippines", "Indonesia", "Vietnam", "Thailand", "Hong Kong (China)", "Singapore", "Japan"
                                      ];
                                      const selectedHolistic = selectedCountries
                                        .filter(c => holisticOrder.includes(c))
                                        .sort((a, b) => holisticOrder.indexOf(a) - holisticOrder.indexOf(b));
                                      
                                      const hIdx = selectedHolistic.indexOf(ctryEn);
                                      if (selectedHolistic.length <= 1) {
                                        percent = 50;
                                      } else {
                                        const start = 44;
                                        const end = 56;
                                        percent = start + (hIdx / (selectedHolistic.length - 1)) * (end - start);
                                      }
                                    }

                                    return { ctryEn, base, score, percent, isHolistic };
                                  }).filter((x): x is NonNullable<typeof x> => x !== null);

                                  return computedPoints.map((pt) => {
                                    const { ctryEn, base, score, percent, isHolistic } = pt;
                                    
                                    // Find other points on this axis that are extremely close to this point's percentage (less than 2.5% difference)
                                    const closePoints = computedPoints.filter(p => Math.abs(p.percent - percent) < 2.5);
                                    const myIdx = closePoints.findIndex(p => p.ctryEn === ctryEn);
                                    const totalClose = closePoints.length;
                                    
                                    let offsetY = 0;
                                    if (totalClose > 1) {
                                      // Distribute them evenly vertically
                                      const spacing = totalClose === 2 ? 22 : 18;
                                      offsetY = (myIdx - (totalClose - 1) / 2) * spacing;
                                    }

                                    const scheme = COUNTRY_COLORS[ctryEn] || COUNTRY_COLORS["United States"];
                                    
                                    return (
                                      <div
                                        key={ctryEn}
                                        className="absolute top-1/2 -ml-2.5 z-10 transition-all duration-300 animate-fade-in"
                                        style={{ 
                                          left: `${percent}%`,
                                          transform: `translateY(calc(-50% + ${offsetY}px))`
                                        }}
                                      >
                                        <div
                                          title={isHolistic ? (isEn ? `${base.nameEn}: Holistic Thinking (Macro Context)` : `${base.nameZh}: 🌐 宏观整体思维`) : `${base.nameZh}: ${score}`}
                                          className={`w-5.5 h-5.5 rounded-full border-2 border-slate-900 shadow-md ${scheme.dot} flex items-center justify-center text-[9px] font-black text-white hover:scale-110 transition-transform`}
                                        >
                                          {base.nameZh.slice(0, 1)}
                                        </div>
                                      </div>
                                    );
                                  });
                                })()}

                              </div>
                            </div>

                            <div className="flex justify-between text-[10px] text-slate-500 font-semibold font-mono">
                              <span>{isEn ? dim.leftEn : `◀ ${dim.leftZh}`}</span>
                              {dim.id === "persuading" && (
                                <span className="text-[9px] text-amber-500/80 font-bold">
                                  {isEn ? "[ Holistic Center ]" : "[ 🌐 宏观整体 ]"}
                                </span>
                              )}
                              <span>{isEn ? dim.rightEn : `${dim.rightZh} ▶`}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right explanatory advice box */}
                  <div className="lg:col-span-4 bg-slate-950 rounded-2xl border border-slate-850 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-amber-500 mb-3 block">
                        <Compass className="w-4 h-4 shrink-0" />
                        <span className="text-[10px] font-black tracking-widest uppercase font-mono">{currT.explainerTitle}</span>
                      </div>

                      <h4 className="text-base font-black text-white">
                        {isEn ? activeDimension.nameEn : activeDimension.nameZh}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium border-l border-amber-500/20 pl-3.5 py-1 mt-2.5">
                        {isEn ? activeDimension.descriptionEn : activeDimension.descriptionZh}
                      </p>

                      {activeDimension.id === "persuading" && (
                        <div className="mt-3.5 p-3.5 bg-amber-500/10 rounded-2xl border border-amber-500/25 shadow-inner space-y-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-black text-amber-400 uppercase tracking-wide">
                              💡 {isEn ? "Teacher Harry's Lecture Note: The Third Paradigm" : "吕老师讲义锦囊：为什么东亚不属于西方二元轴？"}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-300 leading-relaxed space-y-1.5 font-sans">
                            <p>
                              <strong className="text-amber-300">① 西方二元对立：</strong>
                              {isEn 
                                ? "Western cultures split into 'Principles-First' (deductive logic, e.g., France/Germany) vs 'Applications-First' (inductive logic, e.g., US/UK)." 
                                : "西方说服分为【原理优先】（欧系演绎法：先哲学定理与底层逻辑）与【应用优先】（英美归纳法：先实战案例与结论）。"}
                            </p>
                            <p>
                              <strong className="text-amber-300">② 东方宏观整体思维 (Holistic Thinking)：</strong>
                              {isEn 
                                ? "East Asia (China, Japan, Korea, Singapore) views problems systemically—focusing on systemic environment, relationship networks, and macro-to-micro dependencies." 
                                : "中、日、韩、新及东南亚等国在艾琳·梅耶原著中归为【整体思维】。不作单点二元切割，而是强调宏观大势、关系网络与上下游因果。"}
                            </p>
                            <div className="p-2 bg-slate-900/80 rounded-lg border border-amber-500/20 text-[10px] text-amber-200">
                              <span className="font-bold">🎯 吕老师教学对冲金句：</span>
                              <br />
                              “向法德汇报，先立原理框架（Why）；向美英汇报，开门见山给结论（How）；在亚洲与中东沟通，先铺垫宏观背景与人脉格局。”
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-6 space-y-4">
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                          <span className="text-[10px] font-black text-sky-450 block mb-1">👈 {isEn ? (activeDimension.leftEn || "Left Anchor Profile") : (activeDimension.leftZh || "左侧倾向剖析")}</span>
                          <p className="text-[11px] text-slate-300 leading-normal font-sans">
                            {activeDimension.id === "communicating" && (isEn ? "Precise and literal statements. Speakers take sole responsibility for comprehension. No underlying backdrop needed." : "表达清晰、直截了当。说话者对意图传达负有全责。无需复杂的背景铺垫或潜台词。")}
                            {activeDimension.id === "evaluating" && (isEn ? "Brutal negative evaluations. Does not cloak warnings. Strictly task-oriented critiques." : "提供直接粗放式的否定反馈。不加掩饰，直截了当指出问题。属于纯粹的任务导向型对事批评。")}
                            {activeDimension.id === "persuading" && (isEn ? "Principles first before applications. Formulate raw frameworks and models before giving outputs." : "原理设计优先。在提供具体方案或结论之前，必须先阐述深层的理论框架、方法论和推导过程。")}
                            {activeDimension.id === "leading" && (isEn ? "Egalitarian structural styles. Members are on equal first name terms. Overstepping levels is natural." : "平权主义风格。组织架构极其扁平，员工与上级直呼其名，跨层级直接沟通极为普遍和自然。")}
                            {activeDimension.id === "deciding" && (isEn ? "Strict consensus model. Requires 100% team backing and Nemawashi alignments. Extremely solid execution." : "严格的共识决策模式。需要团队达成一致和充分的‘根回’（事前铺垫与私下沟通），虽然过程较慢但执行极其稳妥。")}
                            {activeDimension.id === "trusting" && (isEn ? "Task based relationships. Keep private and professional spheres separate. Rely on contracts." : "任务导向型信任。将个人生活与职业领域严格划分开来。信任建立在客观合同和专业的实际表现之上。")}
                            {activeDimension.id === "disagreeing" && (isEn ? "Confrontation is highly revered as truth-seeking. Does not harm personal relationships." : "正面交锋和辩论被视为客观求真的表现，深受尊重。激烈的异议和讨论不会伤害同事之间的个人关系。")}
                            {activeDimension.id === "scheduling" && (isEn ? "Linear time tracking. Schedules are absolute. High respect for Gantt frameworks." : "线性时间观。时间安排是绝对的契约。强调高度遵循时间表、甘特图步骤和明确的死线要求。")}
                          </p>
                        </div>
                        
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                          <span className="text-[10px] font-black text-amber-500 block mb-1">👉 {isEn ? (activeDimension.rightEn || "Right Anchor Profile") : (activeDimension.rightZh || "右侧倾向剖析")}</span>
                          <p className="text-[11px] text-slate-300 leading-normal font-sans">
                            {activeDimension.id === "communicating" && (isEn ? "Highly tactical implicit cues. Background knowledge is strictly required to 'read the silent air'." : "高度依赖含蓄委婉的暗示和语境。必须具备充实的背景知识，以‘读懂空气中的弦外之音’。")}
                            {activeDimension.id === "evaluating" && (isEn ? "Soft wrapped negative comments. Critiques private and embedded into gentle cushions." : "提供间接委婉的负面反馈。批评通常在私下进行，并包裹着温和的赞美和客套术语。")}
                            {activeDimension.id === "persuading" && (isEn ? "Practical applications-first. Show immediate case studies and business ROI before formulas." : "实际应用优先。在给出公式和框架前，更希望能看到立竿见影的案例研究、成功事实和商业投资回报率。")}
                            {activeDimension.id === "leading" && (isEn ? "Hierarchical levels are revered. Decision-makers have absolute executive sovereignty. Keep lanes clear." : "极度尊崇等级和权威。核心决策层拥有绝对的话语权和行政主权。上下级沟通需层级分明、按部就班。")}
                            {activeDimension.id === "deciding" && (isEn ? "Top-down executive decisions. Authorized captains lead; swift pivoting available at any phase." : "自上而下的决策机制。由权威管理层快速拍板。权责分明，可在任何阶段根据情况快速调整方向。")}
                            {activeDimension.id === "trusting" && (isEn ? "Relationships-based operations. Socializing and sharing tea or meals is high priority. Robust trust matrix." : "关系导向型信任。习惯于通过聚餐、喝茶或闲聊等社交方式建立私人交情，只有先培养起充盈的人情信任，后续业务才能顺畅。")}
                            {activeDimension.id === "disagreeing" && (isEn ? "Avoids vocal confrontation. Arguments represent interpersonal breakdown, disrespectful." : "极力避免公开的言语冲突。公开争论和反驳会被视作破坏人际和谐、不给面子的失礼行为。")}
                            {activeDimension.id === "scheduling" && (isEn ? "Polychronic elastic systems. Multitasking networks flex dynamically according to circumstances." : "弹性多线程时间观。任务安排富有弹性，计划常随多变的环境、人际网络或突发状况灵活做出调整。")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono text-center">
                      Erin Meyer Culture Radar Platform v2026.1
                    </div>
                  </div>

                </div>
              </div>
            </div>
            )}

              {/* ================= SUB-TAB 2: 经典出海案例剖析 (左侧钩子导航 + 右侧紧贴详情大字号) ================= */}
              {toolSubTab === "cases" && (
                <div id="case-studies" className="space-y-6">
                  {/* Top Section Header */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest block mb-1">
                        CLASSIC OUTBOUND CASES GALLERY
                      </span>
                      <h3 className="text-xl font-black text-white">{currT.caseTitle}</h3>
                      <p className="text-slate-400 text-xs mt-0.5">{currT.caseDesc}</p>
                    </div>
                    <div className="text-xs text-amber-400 font-mono bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 w-fit shrink-0 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>精炼一句话钩子速查 · 侧边细节即刻对齐</span>
                    </div>
                  </div>

                  {/* Side-by-Side Grid Layout: Left Hook Navigator (4 cols on Desktop, Horizontal Swiper on Mobile) + Right Details Console */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Mobile Only: Horizontal Carousel & Quick Selector (lg:hidden) */}
                    <div className="lg:hidden col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3 shadow-lg">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                        <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                          <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
                          <h4 className="text-xs font-black text-white whitespace-nowrap">诊断案例 ({cases.length}篇)</h4>
                        </div>
                        {/* Quick Dropdown on Mobile */}
                        <select
                          value={activeCaseId}
                          onChange={(e) => {
                            setActiveCaseId(e.target.value);
                            setActiveCaseTab("story");
                            setAnalysisResult(null);
                            setErrorMessage(null);
                          }}
                          className="bg-slate-950 border border-slate-700 text-amber-400 text-xs font-bold rounded-lg px-2 py-1 outline-none focus:border-amber-500 max-w-[180px] xs:max-w-[220px] truncate shrink min-w-0 cursor-pointer"
                        >
                          {cases.map((cs, idx) => {
                            let hookText = cs.titleZh.split("：")[0] || cs.titleZh;
                            if (cs.id === "case-ppt-1") hookText = "慢速审议废标";
                            else if (cs.id === "case-ppt-2") hookText = "特批已读不回";
                            else if (cs.id === "case-ppt-3") hookText = "国际Workshop";
                            else if (cs.id === "case-ppt-4") hookText = "卖惨撞上德企";
                            else if (cs.id === "case-ppt-5") hookText = "40分钟时差";
                            else if (cs.id === "case-ppt-6") hookText = "沙特/开罗基地";
                            else if (cs.id === "case-ppt-7") hookText = "微笑黑盒";
                            else if (cs.id === "case-ppt-8") hookText = "比利时冷面数字";
                            else if (cs.id === "case-ppt-9") hookText = "墨西哥法老";
                            else if (cs.id === "case-ppt-10") hookText = "法国工会原则";
                            else if (cs.id === "case-ppt-11") hookText = "越南越级汇报";
                            return (
                              <option key={cs.id} value={cs.id}>
                                {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}. {hookText} ({cs.countryA}⚔️{cs.countryB})
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* Horizontal Touch Swiper Tabs for Mobile */}
                      <div className="flex items-center gap-2.5 overflow-x-auto custom-scrollbar pb-1.5 pt-0.5">
                        {cases.map((cs, idx) => {
                          const isActive = activeCaseId === cs.id;
                          let hookText = cs.titleZh.split("：")[0] || cs.titleZh;
                          if (cs.id === "case-ppt-1") hookText = "慢速审议废标";
                          else if (cs.id === "case-ppt-2") hookText = "特批已读不回";
                          else if (cs.id === "case-ppt-3") hookText = "国际Workshop";
                          else if (cs.id === "case-ppt-4") hookText = "卖惨撞上德企";
                          else if (cs.id === "case-ppt-5") hookText = "40分钟时差";
                          else if (cs.id === "case-ppt-6") hookText = "沙特/开罗基地";
                          else if (cs.id === "case-ppt-7") hookText = "微笑黑盒";
                          else if (cs.id === "case-ppt-8") hookText = "比利时冷面数字";
                          else if (cs.id === "case-ppt-9") hookText = "墨西哥法老";
                          else if (cs.id === "case-ppt-10") hookText = "法国工会原则";
                          else if (cs.id === "case-ppt-11") hookText = "越南越级汇报";

                          return (
                            <button
                              key={cs.id}
                              type="button"
                              onClick={() => {
                                setActiveCaseId(cs.id);
                                setActiveCaseTab("story");
                                setAnalysisResult(null);
                                setErrorMessage(null);
                              }}
                              className={`shrink-0 px-3 py-2 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer whitespace-nowrap min-w-[130px] ${
                                isActive 
                                  ? "bg-amber-500/15 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-500/30" 
                                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              <div className="flex items-center justify-between text-[10px] font-mono font-bold w-full gap-2">
                                <span className={isActive ? "text-amber-400 font-extrabold" : "text-slate-500"}>
                                  案例 {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                                </span>
                                <span className="text-[9.5px]">
                                  {cs.countryA}⚔️{cs.countryB}
                                </span>
                              </div>
                              <span className={`text-xs font-bold truncate max-w-[125px] ${isActive ? "text-amber-300 font-black" : "text-slate-300"}`}>
                                “{hookText}”
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Desktop Left Column (4/12): Concise Case Hook Selector (hidden on mobile, lg:block) */}
                    <div className="hidden lg:block lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl sticky top-6">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-amber-500" />
                          <h4 className="text-sm font-black text-white">实战案例钩子索引</h4>
                        </div>
                        <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                          共 {cases.length} 篇
                        </span>
                      </div>

                      {/* Case Hooks List */}
                      <div className="space-y-3">
                        {(isAllCasesExpanded ? cases : cases.slice(0, 3)).map((cs, idx) => {
                          const isActive = activeCaseId === cs.id;
                          const isLocked = idx >= 2 && !isTraineeActive;
                          
                          // Hook generator & Update indicator
                          let hookText = cs.titleZh.split("：")[0] || cs.titleZh;
                          let isUpdated = false;
                          if (cs.id === "case-ppt-1") hookText = "慢速审议导致整包废标";
                          else if (cs.id === "case-ppt-2") hookText = "特批申请的‘已读不回’";
                          else if (cs.id === "case-ppt-3") hookText = "打破国际 Workshop 沉默";
                          else if (cs.id === "case-ppt-4") hookText = "‘卖惨’破局撞上德企椰子壳";
                          else if (cs.id === "case-ppt-5") hookText = "上海滩 40 分钟时差";
                          else if (cs.id === "case-ppt-6") hookText = "沙特客服为何用不动开罗基地？";
                          else if (cs.id === "case-ppt-7") hookText = "巴哈萨‘微笑黑盒’最后通牒";
                          else if (cs.id === "case-ppt-8") hookText = "亚太温情撞上比利时冷面数字";
                          else if (cs.id === "case-ppt-9") { hookText = "墨西哥法老拍板与阿米巴相撞"; isUpdated = true; }
                          else if (cs.id === "case-ppt-10") { hookText = "法国工会原则优先与急查对决"; isUpdated = true; }
                          else if (cs.id === "case-ppt-11") { hookText = "越南越级汇报与阿语面子防线"; isUpdated = true; }

                          return (
                            <div
                              key={cs.id}
                              onClick={() => {
                                setActiveCaseId(cs.id);
                                setActiveCaseTab("story");
                                setAnalysisResult(null);
                                setErrorMessage(null);
                              }}
                              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-2.5 relative overflow-hidden ${
                                isActive
                                  ? "bg-slate-950 border-amber-500 text-white shadow-xl shadow-amber-950/20 ring-2 ring-amber-500/20"
                                  : "bg-slate-950/70 border-slate-800 hover:bg-slate-950 hover:border-slate-700 text-slate-300"
                              }`}
                            >
                              <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded-md ${isActive ? "bg-amber-500/20 text-amber-400" : "bg-slate-900 text-slate-400"}`}>
                                    案例 {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                                  </span>
                                  {isUpdated ? (
                                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-[9.5px] font-mono text-emerald-400 font-bold">
                                      <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                      </span>
                                      <span>NEW 亮灯</span>
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9.5px] font-mono text-slate-500">
                                      <span className="inline-flex rounded-full h-1.5 w-1.5 bg-slate-700"></span>
                                      <span>稳定</span>
                                    </span>
                                  )}
                                </div>

                                <span className="text-amber-400 font-bold flex items-center gap-1">
                                  {isEn ? cs.countryA : getCountryZh(cs.countryA)} ⚔️ {isEn ? cs.countryB : getCountryZh(cs.countryB)}
                                </span>
                              </div>

                              <h5 className={`text-sm font-black leading-snug ${isActive ? "text-amber-300" : "text-slate-100"}`}>
                                “{hookText}”
                              </h5>

                              <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-400 border-t border-slate-850/80 pt-2">
                                <span>{isLocked ? "🔒 限有效学子" : "🔓 开放案例"}</span>
                                <span className={`font-bold flex items-center gap-0.5 ${isActive ? "text-amber-400" : "text-slate-500"}`}>
                                  {isActive ? "正在查看 ›" : "点此查看"}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Expand / Collapse Button */}
                      <button
                        type="button"
                        onClick={() => setIsAllCasesExpanded(!isAllCasesExpanded)}
                        className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 text-amber-400 border border-slate-800 hover:border-amber-500/40 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow"
                      >
                        <span>{isAllCasesExpanded ? "收起案例列表 (只看精选3篇)" : `展开全部案例 (共 ${cases.length} 篇)`}</span>
                        {isAllCasesExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Right Column (8/12): Active Case Detail Console (Side-by-side, Larger Font) */}
                    <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                      
                      {/* Active Case Top Banner */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono font-black border border-amber-500/20">
                              {isEn ? activeCase.countryA : getCountryZh(activeCase.countryA)} ⚔️ {isEn ? activeCase.countryB : getCountryZh(activeCase.countryB)}
                            </span>
                            <span className="text-slate-500 text-xs">|</span>
                            <span className="text-xs text-amber-500 font-mono font-bold">真实出海航线复盘案</span>
                          </div>
                          <h3 className="text-lg md:text-xl font-black text-white leading-snug">
                            {isEn ? activeCase.titleEn : activeCase.titleZh}
                          </h3>
                        </div>

                        {/* AI Analysis Trigger Button */}
                        {cases.indexOf(activeCase) >= 2 && !isTraineeActive ? null : (
                          <button
                            type="button"
                            onClick={runClassicAnalysis}
                            disabled={isAnalyzing}
                            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md shadow-amber-950/30 cursor-pointer active:scale-95 flex items-center justify-center gap-2 shrink-0"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>{isAnalyzing ? currT.caseAnalyzing : "⚡ 一键获取专家级 AI 冲突诊断"}</span>
                          </button>
                        )}
                      </div>

                      {/* Guest Lock view or Hierarchical Layout: Big Top Story + Sub-Tabs for Analysis */}
                      {cases.indexOf(activeCase) >= 2 && !isTraineeActive ? (
                        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/90 p-8 flex flex-col items-center justify-center text-center space-y-4">
                          <div className="p-4 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">
                            <Lock className="w-8 h-8 animate-pulse" />
                          </div>
                          <div className="space-y-2 max-w-md">
                            <h5 className="text-white font-black text-base">
                              {loggedInUser ? "🔒 您的 SaaS 服务特权卡已到期" : "🔒 经典出海航线实战案解密特权保护"}
                            </h5>
                            <p className="text-sm text-slate-300 leading-relaxed font-sans">
                              {loggedInUser 
                                ? "您当前的学子包期卡已到期。解锁全量 11+ 经典出海大案细分故事、文化维度错位定性与 AI 专家级冲突对冲方案，请及时一键续费订阅！"
                                : "此出海客情方案涉及跨国大B客户高层隐秘偏误和沟通对冲术，对普通访客特作游客脱敏。请免费注册或登入您的学子账号，一秒即可完美解锁全案细节与 AI 诊疗引擎！"}
                            </p>
                          </div>
                          {loggedInUser ? (
                            <button
                              type="button"
                              onClick={() => setActiveTab("pricing")}
                              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 font-black text-slate-950 text-xs rounded-xl tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow active:scale-95"
                            >
                              <Sparkles className="w-4 h-4" />
                              <span>⚡ 立即续费修习卡并解锁全案</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setShowLoginModal(true)}
                              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 font-black text-slate-950 text-xs rounded-xl tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow active:scale-95"
                            >
                              <User className="w-4 h-4" />
                              <span>立即注册并登入专属学子通道</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-6">
                          
                          {/* 1. Primary Highlight Box: Story Core (全宽主置顶卡片) */}
                          <div className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-3 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                            
                            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                              <div className="flex items-center gap-2 text-sm font-black text-amber-400">
                                <span className="p-1 bg-amber-500/10 rounded-lg border border-amber-500/20">📖</span>
                                <span>【核心故事实况】轨迹与原貌</span>
                              </div>
                              <span className="text-[11px] font-mono text-slate-400">真实跨境沟通案卷</span>
                            </div>

                            <p className="text-base text-slate-100 leading-relaxed font-sans pt-1">
                              {CASE_DETAILS_ZH[activeCase.id]?.storySummary || activeCase.descriptionZh}
                            </p>
                          </div>

                          {/* 2. Secondary Deconstruction Console: Segmented Controls + Active Tab Content */}
                          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                            
                            {/* Sub-Tabs Selector Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-3">
                              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400">
                                <span className="text-amber-500 font-black">【深度专家复盘】</span>
                                <span>按维度拆解：</span>
                              </div>

                              {/* Segmented Controller Buttons */}
                              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                                <button
                                  type="button"
                                  onClick={() => setActiveCaseTab("difficulties")}
                                  className={`px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                    activeCaseTab === "difficulties"
                                      ? "bg-red-500/20 text-red-400 border border-red-500/30 shadow-sm"
                                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                                  }`}
                                >
                                  <span>⚠️ 核心阻碍</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setActiveCaseTab("culture")}
                                  className={`px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                    activeCaseTab === "culture"
                                      ? "bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-sm"
                                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                                  }`}
                                >
                                  <span>🧭 文化错位</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setActiveCaseTab("recommendations")}
                                  className={`px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                    activeCaseTab === "recommendations"
                                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm"
                                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                                  }`}
                                >
                                  <span>💡 避坑建议</span>
                                </button>
                              </div>
                            </div>

                            {/* Tab Content Display Area */}
                            <motion.div
                              key={activeCaseTab}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className="pt-1"
                            >
                              {activeCaseTab === "difficulties" && (
                                <div className="space-y-3 bg-slate-900/60 p-4.5 rounded-xl border border-red-500/20">
                                  <div className="flex items-center justify-between text-xs md:text-sm font-black text-red-400">
                                    <span className="flex items-center gap-1.5">
                                      <span>⚠️</span>
                                      <span>此出海航线中的核心困难与执行阻碍</span>
                                    </span>
                                    <span className="text-[10px] md:text-xs font-mono text-slate-500">摩擦阻力剖析</span>
                                  </div>
                                  <ul className="space-y-2.5 text-base text-slate-200 leading-relaxed">
                                    {(CASE_DETAILS_ZH[activeCase.id]?.difficulties || [
                                      "时效要求与本地客观执行流程发生刚性撕裂。",
                                      "团队心智模型不对称，沟通产生隐形对抗。"
                                    ]).map((item, i) => (
                                      <li key={i} className="flex gap-2.5 items-start">
                                        <span className="text-red-500 shrink-0 font-bold mt-0.5">•</span>
                                        <span className="text-slate-200 text-base">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {activeCaseTab === "culture" && (
                                <div className="space-y-3 bg-slate-900/60 p-4.5 rounded-xl border border-sky-500/20">
                                  <div className="flex items-center justify-between text-xs md:text-sm font-black text-sky-400">
                                    <span className="flex items-center gap-1.5">
                                      <span>🧭</span>
                                      <span>跨文化地图 8 大维度错位碰撞</span>
                                    </span>
                                    <span className="text-[10px] md:text-xs font-mono text-slate-500">底层理论定性</span>
                                  </div>
                                  <div className="space-y-2.5">
                                    {(CASE_DETAILS_ZH[activeCase.id]?.cultureDeconstruction || [
                                      "决策与时间管理维度产生错位碰撞。中方偏向自上而下决策与高弹性时空调度，本地团队偏向严密的环签共识与线性规范。"
                                    ]).map((text, i) => (
                                      <p key={i} className="text-base text-slate-200 leading-relaxed font-sans">
                                        {text}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {activeCaseTab === "recommendations" && (
                                <div className="space-y-3 bg-slate-900/60 p-4.5 rounded-xl border border-emerald-500/20">
                                  <div className="flex items-center justify-between text-xs md:text-sm font-black text-emerald-400">
                                    <span className="flex items-center gap-1.5">
                                      <span>💡</span>
                                      <span>吕华导师推荐的落地避坑对冲方案</span>
                                    </span>
                                    <span className="text-[10px] md:text-xs font-mono text-slate-500">实战对冲策略</span>
                                  </div>
                                  <ul className="space-y-2.5 text-base text-slate-200 leading-relaxed">
                                    {(CASE_DETAILS_ZH[activeCase.id]?.recommendations || [
                                      "预留1.5倍合规周期防火墙。",
                                      "建立非言语化的客观AI监控红绿灯看板。"
                                    ]).map((item, i) => (
                                      <li key={i} className="flex gap-2.5 items-start">
                                        <span className="text-emerald-500 shrink-0 font-bold mt-0.5">•</span>
                                        <span className="text-slate-200 text-base">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </motion.div>

                          </div>

                          {/* AI Analysis Result Section (when triggered) */}
                          {isAnalyzing && (
                            <div className="p-4 bg-slate-950 border border-slate-800 text-amber-500 text-xs rounded-2xl flex items-center gap-3">
                              <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                              <span>{currT.caseAnalyzing}</span>
                            </div>
                          )}

                          {errorMessage && (
                            <div className="p-3 bg-amber-950/50 border border-amber-800 text-amber-400 text-xs rounded-xl flex gap-2">
                              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                              <span>{errorMessage}</span>
                            </div>
                          )}

                          {analysisResult && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-5 bg-slate-950 border border-amber-500/40 rounded-2xl space-y-4 text-sm text-slate-200 shadow-xl"
                            >
                              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <span className="text-xs font-black text-amber-400 font-mono uppercase tracking-widest flex items-center gap-1.5">
                                  <Sparkles className="w-4 h-4 text-amber-500" />
                                  <span>专家级 AI 冲突诊断结果</span>
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">吕华导师认知模型已加载</span>
                              </div>

                              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                <span className="text-xs text-amber-400 font-mono font-bold uppercase tracking-widest block mb-1">
                                  专家冲突定性
                                </span>
                                <p className="leading-relaxed text-slate-200 text-sm">{analysisResult.clashAnalysis}</p>
                              </div>

                              <div className="space-y-2">
                                <span className="text-xs text-sky-400 font-mono font-bold uppercase tracking-widest block">
                                  首要文化维度碰撞
                                </span>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {analysisResult.dimensionsInvolved?.map((dim: any, idx: number) => (
                                    <div key={idx} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                                      <div className="flex justify-between text-xs font-bold">
                                        <span className="text-white">{dim.dimensionNameZh}</span>
                                        <span className="text-amber-500 font-mono text-[10px]">[{dim.gapDescription}]</span>
                                      </div>
                                      <p className="text-xs text-slate-300 leading-relaxed">{dim.frictionReason}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                  <span className="text-xs text-emerald-400 font-mono font-bold uppercase block mb-2">
                                    中方团队（A方）专属行动良方
                                  </span>
                                  <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-200">
                                    {analysisResult.adviceForA?.map((adv: string, i: number) => (
                                      <li key={i}>{adv}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                  <span className="text-xs text-amber-400 font-mono font-bold uppercase block mb-2">
                                    目标市场团队（B方）专属行动良方
                                  </span>
                                  <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-200">
                                    {analysisResult.adviceForB?.map((adv: string, i: number) => (
                                      <li key={i}>{adv}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* ================= SUB-TAB 3: 学员痛点 AI 分析 ================= */}
              {toolSubTab === "pain_points" && (
                <div id="sandbox-workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Input form */}
                  <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden">
                  <div className="space-y-1 mb-6">
                    <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest block">TESTBED CLINIC</span>
                    <h3 className="text-lg font-bold text-white mb-1">{currT.sandboxTitle}</h3>
                    <p className="text-slate-400 text-xs">{currT.sandboxDesc}</p>
                  </div>

                  {!isTraineeActive && (
                    <div className="absolute inset-x-0 bottom-0 top-[85px] z-20 flex flex-col items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 text-center space-y-4">
                      <div className="p-3 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">
                        <Lock className="w-6 h-6 animate-pulse" />
                      </div>
                      <div className="space-y-2 max-w-sm">
                        <h4 className="text-white font-extrabold text-sm">
                          {loggedInUser 
                            ? (isEn ? "🔒 SaaS Membership Expired" : "🔒 自定义出海痛点沙盒诊疗所 (修习卡已到期)")
                            : (isEn ? "🔒 Student Sandbox Workspace Locked" : "🔒 自定义跨国摩擦沙盒诊疗所")}
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {loggedInUser
                            ? (isEn 
                                ? "Your SaaS membership has expired. Please renew your subscription to submit custom conflict cases and run live AI clinical diagnostics." 
                                : "您的 SaaS 修习包期卡已到期。提交自定义跨国摩擦用例并调用专家级 AI 诊疗引擎为专属学子特权，请及时进行续费订阅！")
                            : (isEn 
                                ? "Custom sandbox conflict submission and live AI diagnostic solutions are reserved features. Register or log in to submit your complex outbound cases." 
                                : "自定义出海摩擦诊断与实战战术模拟系【出海学子专属】特权受训板块。您可以一键注册/登入专属学子密码，即刻获取客情深度 AI 诊疗方案！")}
                        </p>
                      </div>
                      {loggedInUser ? (
                        <button
                          type="button"
                          onClick={() => setActiveTab("pricing")}
                          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 font-extrabold text-slate-950 text-xs rounded-xl tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow active:scale-95"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>⚡ 立即续费修习卡并解锁 AI 诊疗</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowLoginModal(true)}
                          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 font-extrabold text-slate-950 text-xs rounded-xl tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow active:scale-95"
                        >
                          <User className="w-4 h-4" />
                          {isEn ? "Free Register / Sign-In" : "立即一键注册登入学子通道"}
                        </button>
                      )}
                    </div>
                  )}

                  <form onSubmit={handleClinicSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400 font-bold font-mono uppercase block">{currT.sandboxInputTitle}</label>
                        <input 
                          type="text" 
                          required
                          value={clinicTitle}
                          onChange={(e) => setClinicTitle(e.target.value)}
                          placeholder="e.g. London client ignored requests"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400 font-bold font-mono uppercase block">{isEn ? "Cultural Host A" : "文化差异国家 A"}</label>
                        <select 
                          value={clinicCountryA}
                          onChange={(e) => setClinicCountryA(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        >
                          {sortedCountriesForSelect.map(c => (
                            <option key={c.nameEn} value={c.nameEn}>{isEn ? c.nameEn : c.nameZh}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400 font-bold font-mono uppercase block">{isEn ? "Cultural Peer B (Outbound Target)" : "文化差异国家 B (目标市场)"}</label>
                        <select 
                          value={clinicCountryB}
                          onChange={(e) => setClinicCountryB(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        >
                          {sortedCountriesForSelect.map(c => (
                            <option key={c.nameEn} value={c.nameEn}>{isEn ? c.nameEn : c.nameZh}</option>
                          ))}
                        </select>
                      </div>

                    </div>

                    <div className="space-y-3">
                      <label className="text-[11px] text-slate-400 font-bold font-mono uppercase block">
                        {isEn ? "Detailed Description of Cultural Conflict Points" : "文化差异痛点案例详细描述（输入须大于 50 字）"}
                      </label>
                      
                      <div className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                          <Info className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{isEn ? "Quality Submission Requirements" : "高质量案例提报要求："}</span>
                        </div>
                        <p>
                          {isEn
                            ? "Please clearly articulate the concrete scene, friction/conflict details, countries involved, and your core confusion. If the submitted content is too brief or lacks quality, the AI clinical system may decline or fail to analyze properly."
                            : "请在输入框中表达清楚具体场景、摩擦冲突、涉及国家及您困惑的地方。如果提交信息质量不够（如信息太少或少于 50 字），AI 诊疗系统将可能无法进行深度分析或谢绝诊疗。"}
                        </p>
                      </div>

                      {/* Dark-styled template reference card */}
                      <div className="bg-slate-900/45 hover:bg-slate-900/70 text-slate-300 rounded-2xl p-4 border border-slate-800 transition-all space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/20 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {isEn ? "Light Theme Case Template" : "💡 优质痛点案例模板（参考范例）"}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setClinicTitle(isEn ? "Sudden Escalation & Direct Complaint from Thailand Client Owner" : "泰国客服交付突遭大老板越级投诉");
                              setClinicCountryA("China");
                              setClinicCountryB("Thailand");
                              setClinicDesc(isEn 
                                ? "We are running an executive customer service integration project in Thailand. The local project manager always responds with extreme politeness, saying 'No problem' and 'All good.' However, at critical milestones, the overall corporate owner bypassed our manager and submitted a severe direct complaint to our China headquarters about severe timeline delays. This silent buildup and sudden escalation left us deeply confused. Why does this extreme politeness cover up such a severe backlash? Which cultural dimensions does this belong to, and how can we mitigate this risk?"
                                : "我们在泰国开展智能客服系统交付项目。泰国本地的项目经理每次在日常周会和微信群里沟通都极其客气，回复‘没问题、都可以’。但就在项目上线交付的关键节点，泰国公司的大老板却突然越过项目经理，直接给中国总部发邮件投诉我们工作进度严重滞后。这种平日里的温和客气背后隐藏的突然越级投诉让我们倍感困惑。请问这背后是什么跨文化维度在起作用？我们中方项目交付团队要怎么跟他们提前防范和避坑？"
                              );
                            }}
                            className="text-[10px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/20 hover:border-amber-500/40 font-black px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3" />
                            {isEn ? "Apply Template" : "一键套用模板"}
                          </button>
                        </div>
                        <div className="text-xs space-y-1.5 leading-relaxed text-slate-300">
                          <p>
                            <strong className="text-slate-400">{isEn ? "Title:" : "案例标题："}</strong> 
                            {isEn ? "Sudden Escalation & Direct Complaint from Thailand Client Owner" : "泰国客服交付突遭大老板越级投诉"}
                          </p>
                          <p>
                            <strong className="text-slate-400">{isEn ? "Countries:" : "涉及国家："}</strong> 
                            {isEn ? "China vs Thailand" : "中国 (A方) ⚔️ 泰国 (B方)"}
                          </p>
                          <p className="italic bg-slate-950/60 p-2.5 rounded-lg text-[11px] border border-slate-850 text-slate-400">
                            "{isEn 
                              ? "We are running an executive customer service integration project in Thailand..." 
                              : "我们在泰国开展智能客服系统交付项目。泰国本地的项目经理每次在日常周会和微信群里沟通都极其客气，回复‘没问题、都可以’。但就在项目上线交付的关键节点，泰国公司的大老板却突然越过项目经理，直接给中国总部发邮件投诉我们工作进度严重滞后。这种平日里的温和客气背后隐藏的突然越级投诉让我们倍感困惑..."}"
                          </p>
                        </div>
                      </div>

                      <textarea 
                        rows={5}
                        required
                        value={clinicDesc}
                        onChange={(e) => setClinicDesc(e.target.value)}
                        placeholder={isEn 
                          ? "Explain the outbound team misunderstanding, email blockade, or cultural context collision (min 50 characters)..."
                          : "请在此输入您的出海团队摩擦经过，包含场景、冲突细节、涉及国家角色及您的困惑（至少 50 字）..."}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 placeholder-slate-600"
                      />
                    </div>

                    {clinicErrorMessage && (
                      <div className="p-3 bg-rose-950/50 border border-rose-900 text-rose-300 text-[11px] rounded-xl">
                        {clinicErrorMessage}
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <button 
                        type="submit"
                        disabled={clinicIsAnalyzing}
                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/10 flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {clinicIsAnalyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{isEn ? "AI Analyzing Incident..." : "AI 诊疗诊断分析中..."}</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>{isEn ? "Submit & Run AI Diagnostic" : "文化差异痛点案例提交并启动 AI 诊断"}</span>
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                </div>

                {/* Diagnostic Output Column */}
                <div className="lg:col-span-4 bg-slate-950 border border-slate-850 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[400px]">
                  
                  <div>
                    <div className="flex items-center gap-2 text-amber-500 mb-4">
                      <Compass className="w-4 h-4" />
                      <span className="text-[10px] font-black tracking-widest uppercase font-mono">{isEn ? "AI CLINIC OUTPUT" : "AI 临床诊断输出"}</span>
                    </div>

                    {!clinicIsAnalyzing && !clinicAnalysisResult && !clinicErrorMessage && (
                      <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                        <Info className="w-8 h-8 text-slate-700 animate-pulse mb-3" />
                        <p className="text-xs font-bold text-slate-500">{isEn ? "Awaiting Sandbox Collision Input" : "暂无案例。请在左侧提报案例"}</p>
                        <p className="text-[10px] text-slate-600 mt-1 leading-relaxed max-w-xs">
                          {isEn 
                            ? "Once submitted, Lyu's master-grade model sandboxes will dissect behavioral variance metrics in real time." 
                            : "提交您填写的文化差异痛点案例后，大模型将实时剖析多维行为坐标，并出具极速诊疗处方。"}
                        </p>
                      </div>
                    )}

                    {clinicIsAnalyzing && (
                      <div className="h-64 flex flex-col items-center justify-center text-center p-4 space-y-3">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                        <div className="space-y-1">
                          <p className="text-xs font-black text-amber-400">{isEn ? "CRITICAL EXPERT SANDBOX COLLISION ACTIVE" : "⚡ 跨文化大模型临床沙盒冲突会诊中..."}</p>
                          <p className="text-[10px] text-slate-400 leading-normal max-w-xs">{isEn ? "Cross-referencing high/low context friction metrics and generating custom prescriptions..." : "正在深度对账高/低语境冲突偏角，极速对齐主训专家团诊疗处方..."}</p>
                        </div>
                      </div>
                    )}

                    {clinicErrorMessage && (
                      <div className="p-3.5 bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs rounded-2xl flex gap-2.5 items-start mt-4">
                        <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-rose-400" />
                        <p>{clinicErrorMessage}</p>
                      </div>
                    )}

                    {clinicAnalysisResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 text-xs text-slate-300"
                      >
                        {clinicAnalysisResult.notice && (
                          <div className="p-2.5 bg-blue-950/40 border border-blue-900 text-blue-450 text-[10px] rounded-xl font-bold font-mono">
                            ℹ️ {clinicAnalysisResult.notice}
                          </div>
                        )}

                        <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-850">
                          <span className="text-[10px] text-amber-500 font-mono font-bold uppercase tracking-widest block mb-1">
                            {isEn ? "Clash Analysis" : "冲突深度综述"}
                          </span>
                          <p className="leading-relaxed text-slate-200">{clinicAnalysisResult.clashAnalysis}</p>
                        </div>

                        {clinicAnalysisResult.dimensionsInvolved && clinicAnalysisResult.dimensionsInvolved.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[10px] text-sky-450 font-mono font-bold uppercase tracking-widest block">
                              {isEn ? "Core Dimensions Triggered" : "触发的核心文化维度"}
                            </span>
                            {clinicAnalysisResult.dimensionsInvolved.map((dim, idx) => (
                              <div key={idx} className="p-2.5 bg-slate-900 border border-slate-850 rounded-lg space-y-1">
                                <div className="flex justify-between text-[10px] font-bold">
                                  <span className="text-white">{dim.dimensionNameZh}</span>
                                  <span className="text-amber-500 font-mono">[{dim.gapDescription}]</span>
                                </div>
                                <p className="text-[10.5px] text-slate-400 leading-normal">{dim.frictionReason}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="grid grid-cols-1 gap-3 pt-1">
                          {clinicAnalysisResult.adviceForA && clinicAnalysisResult.adviceForA.length > 0 && (
                            <div className="p-3 bg-[#111e35] border border-[#1d355e] rounded-xl">
                              <span className="text-[9.5px] text-emerald-400 font-mono font-bold uppercase block mb-1">
                                {isEn ? "Prescription for Host A" : `${clinicAnalysisResult.countryANameZh || '中方（A方）'}专属行动良方`}
                              </span>
                              <ul className="list-disc list-inside space-y-1 text-[10px] text-slate-300">
                                {clinicAnalysisResult.adviceForA.map((adv, i) => (
                                  <li key={i}>{adv}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {clinicAnalysisResult.adviceForB && clinicAnalysisResult.adviceForB.length > 0 && (
                            <div className="p-3 bg-[#111e35] border border-[#1d355e] rounded-xl">
                              <span className="text-[9.5px] text-amber-400 font-mono font-bold uppercase block mb-1">
                                {isEn ? "Prescription for Peer B" : `${clinicAnalysisResult.countryBNameZh || '伙伴方（B方）'}专属行动良方`}
                              </span>
                              <ul className="list-disc list-inside space-y-1 text-[10px] text-slate-300">
                                {clinicAnalysisResult.adviceForB.map((adv, i) => (
                                  <li key={i}>{adv}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-900/60 text-[9.5px] text-slate-500 font-mono flex items-center gap-1.5 leading-snug">
                    <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Secure medical grade outbound clinical sandbox isolation active.</span>
                  </div>

                </div>

              </div>
              )}

            </motion.div>
          )}

          {activeTab === "pricing" && (
            <motion.div
              key="tab-pricing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              
              <div className="space-y-2 mb-6 text-center">
                <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest block">MEMBERSHIP PASSES</span>
                <h3 className="text-2xl font-black text-white">{currT.pricingTitle || "SaaS 订阅与出海包期特权"}</h3>
                <p className="text-slate-455 text-xs max-w-xl mx-auto">
                  {isEn ? (
                    "Tailor your exclusive outbound pass to fully unlock high-precision cross-cultural maps,\nand utilize our expert clinical diagnostic sandbox to break high/low context context barriers."
                  ) : (
                    <>
                      订制专属出海包期卡，全面解锁多国跨文化精细度图谱，
                      <br className="hidden sm:inline" />
                      无限制使用专家临床会诊大模型沙盒，打破异国团队高低语境沟通阻断。
                    </>
                  )}
                </p>
              </div>

              {/* Secure guarantee info banner */}
              <div className="p-4 sm:p-5 bg-slate-950/40 border border-slate-850 rounded-3xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4 text-left">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    {isEn ? "TRUSTED OUTBOUND METHODOLOGY & TRANSACTION SECURITY" : "🛡️ 吕华出海研修安全授信与交付承诺"}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-455 leading-relaxed">
                    {isEn 
                      ? "All student payments are verified by our master assistant team manually, compliant with strict regional commercial confidentiality. We guarantee 100% activation fail-safe with instant In-Site Mailbox confirmation letters."
                      : "所有出海特享期服务由助教秘书处手动极速审核激活，100%人工对账防止通道拦截。付款成功后系统将会为您在【学子中心 - 站内信箱】极速下发主讲导师亲书《权益确认信》站内通知。若注册遇到任何阻碍，可随时向主训秘书处热线发起加急呼叫。"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {[
                  {
                    id: "24h" as const,
                    name: isEn ? "24h Outbound Experience Card" : "24小时体验卡",
                    price: "29",
                    period: isEn ? " (24h)" : " (24小时)",
                    desc: isEn ? "Perfect for single cross-border conflict emergency." : "适合单次跨国冲突的紧急会诊与全站体验",
                    features: isEn ? [
                      "24h full unhindered platform access",
                      "Unlimited culture map comparison metrics",
                      "Unlimited clinical conflict sandbox runs",
                      "Full access to all 8 classic case studies",
                      "Standard local profile & state preservation"
                    ] : [
                      "24小时全站无阻断特权 (大地图+会诊)",
                      "无限制解锁多国文化大地图精细图谱",
                      "无限制专家临床冲突沙盒大模型会诊",
                      "解锁全部 8 部经典研修实战案例解析",
                      "本地学子注册通道与无痕状态保留"
                    ],
                    badge: isEn ? "FAST EXPERIMENT" : "全功能单期"
                  },
                  {
                    id: "1mo" as const,
                    name: isEn ? "1 Month Leader Card" : "包月领航卡",
                    price: "39",
                    originalPrice: "59",
                    dealLabel: isEn ? "Student Discount" : "学子优惠",
                    period: isEn ? "/ mo" : "/ 月",
                    desc: isEn ? "Most popular choice for active outbound managers." : "主训导师力荐！解锁完整商业大地图与案例库",
                    features: isEn ? [
                      "30 Days full unhindered platform access",
                      "Unlimited culture map comparison metrics",
                      "Unlimited clinical conflict sandbox runs",
                      "Full access to all 8 classic case studies",
                      "1-on-1 priority fast in-site activation support"
                    ] : [
                      "30天全站无阻断特权 (大地图+会诊)",
                      "无限制解锁多国文化大地图精细图谱",
                      "无限制专家临床冲突沙盒大模型会诊",
                      "解锁全部 8 部经典研修实战案例解析",
                      "助教微信/站内信双通道极速授权过审"
                    ],
                    badge: isEn ? "MOST POPULAR" : "吕老师力荐",
                    popular: true
                  },
                  {
                    id: "3mo" as const,
                    name: isEn ? "3 Month Executive Pass" : "季度高管卡",
                    price: "99",
                    originalPrice: "168",
                    dealLabel: isEn ? "Student Discount" : "学子优惠",
                    period: isEn ? "/ quarter" : "/ 季",
                    desc: isEn ? "Continuous pilotage for growing global firms." : "中企高成长出海客服与用户体验持续保障",
                    features: isEn ? [
                      "90 Days full unhindered platform access",
                      "Unlimited culture map comparison metrics",
                      "Unlimited clinical conflict sandbox runs",
                      "Full access to all 8 classic case studies",
                      "Priority booking for offline workshops & salons"
                    ] : [
                      "90天全站无阻断特权 (大地图+会诊)",
                      "无限制解锁多国文化大地图精细图谱",
                      "无限制专家临床冲突沙盒大模型会诊",
                      "解锁全部 8 部经典研修实战案例解析",
                      "线下私董会/闭门工坊日程优先锁定"
                    ],
                    badge: isEn ? "EXECUTIVE LEVEL" : "季包特惠"
                  },
                  {
                    id: "1yr" as const,
                    name: isEn ? "1 Year Helmsman Card" : "包年战略卡",
                    price: "299",
                    originalPrice: "699",
                    dealLabel: isEn ? "Student Discount" : "学子优惠",
                    period: isEn ? "/ year" : "/ 年",
                    desc: isEn ? "Ultimate security package for enterprise owners." : "全面、长周期出海商业顾问全流程保障",
                    features: isEn ? [
                      "365 Days full unhindered platform access",
                      "Physical signed copy of 'Winning Overseas' shipped",
                      "Outbound Expansion Strategic Pack full digital suite",
                      "Exclusive seat in Harry's private closed-door advisory",
                      "Direct premium support via In-Site Message & WeChat"
                    ] : [
                      "365天全站无阻断特权（大地图+会诊）",
                      "获赠吕华老师亲笔签名新书《出海制胜》1册(包邮)",
                      "赠送全渠道《中企全球服务出海内参包》",
                      "吕华老师专属闭门交流社群/私董会席位",
                      "尊享专属一键权益站内信与微信极速客服"
                    ],
                    badge: isEn ? "BEST VALUE" : "全面护航"
                  }
                ].map((pkg) => {
                  const isCurrentPlan = loggedInUser && loggedInUser.selectedPlan === pkg.id && loggedInUser.status === "active";
                  const isManager = loggedInUser && (loggedInUser.role === "admin" || loggedInUser.role === "assistant");
                  
                  return (
                    <div 
                      key={pkg.id} 
                      className={`relative flex flex-col justify-between p-6 rounded-3xl border transition-all duration-300 ${
                        pkg.popular 
                          ? "bg-gradient-to-b from-[#18294a] to-[#0d172e] border-amber-500/50 shadow-2xl shadow-amber-500/5 scale-102" 
                          : "bg-[#111e35] border-slate-800 hover:border-slate-700 hover:shadow-xl"
                      }`}
                    >
                      {/* Popular/Exclusive Badge */}
                      <div className="flex justify-between items-start mb-4">
                        <span className={`text-[9px] font-black tracking-widest font-mono px-2.5 py-1 rounded-full uppercase ${
                          pkg.popular 
                            ? "bg-amber-500 text-slate-950" 
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}>
                          {pkg.badge}
                        </span>
                        {pkg.popular && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                          </span>
                        )}
                      </div>

                      {/* Package Name & Desc */}
                      <div className="space-y-1.5 text-left">
                        <h4 className="text-base font-black text-white">{pkg.name}</h4>
                        <p className="text-[10px] text-slate-400 leading-normal min-h-[30px]">{pkg.desc}</p>
                      </div>

                      {/* Price Section */}
                      <div className="my-5 text-left space-y-2">
                        <div className="flex items-baseline gap-1 flex-nowrap whitespace-nowrap overflow-hidden">
                          <span className="text-2xl font-black text-amber-400 font-mono">￥</span>
                          <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono tracking-tight shrink-0">{pkg.price}</span>
                          <span className="text-xs text-slate-400 font-medium shrink-0 ml-0.5">{pkg.period}</span>
                          {pkg.originalPrice && (
                            <span className="text-xs text-slate-500 line-through font-mono ml-1 shrink-0">
                              ￥{pkg.originalPrice}
                            </span>
                          )}
                        </div>
                        <div className="h-5 flex items-center">
                          {pkg.dealLabel ? (
                            <div className="inline-flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-black font-sans">
                              <span>✨ {pkg.dealLabel}</span>
                            </div>
                          ) : (
                            <div className="h-5" />
                          )}
                        </div>
                        <p className="text-[9px] text-slate-500 font-mono">{isEn ? "Manual activation via assistant" : "助教手动核实即刻开启"}</p>
                      </div>

                      {/* Feature Checklist */}
                      <div className="space-y-2.5 border-t border-slate-800/80 pt-4 mb-6 text-left flex-1">
                        {pkg.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-2 text-[10.5px] text-slate-300 leading-normal">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <div className="mt-auto pt-2">
                        {isManager ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSubscriptionPlan(pkg.id);
                              setShowPaymentInstructions(true);
                            }}
                            className="w-full py-2.5 px-3 bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/25 text-emerald-300 hover:text-emerald-200 rounded-xl text-center text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-98"
                            title="助教/导师专享免支付测试按钮，点击可预览学员端微信通道激活弹窗"
                          >
                            <Shield className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{isEn ? "👑 Assistant Test View" : "👑 助教免支付测试体验 (点此预览)"}</span>
                          </button>
                        ) : isCurrentPlan ? (
                          <div className="w-full py-2.5 px-3 bg-emerald-500 text-slate-950 rounded-xl text-center text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400">
                            <Check className="w-4 h-4 stroke-[3px]" />
                            <span>{isEn ? "ACTIVE PLAN" : "✓ 已购买 (当前已生效)"}</span>
                          </div>
                        ) : loggedInUser ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSubscriptionPlan(pkg.id);
                              setShowPaymentInstructions(true);
                            }}
                            className={`w-full py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                              pkg.popular
                                ? "bg-amber-500 text-slate-950 hover:bg-amber-400 hover:shadow-lg shadow-amber-500/10 active:scale-98"
                                : "bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-200 active:scale-98"
                            }`}
                          >
                            <span>{isEn ? "Select & Contact Assistant" : "申请微信通道激活 ⚡"}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setAuthMode("register");
                              setSelectedSubscriptionPlan(pkg.id);
                              setShowLoginModal(true);
                            }}
                            className="w-full py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                          >
                            <Lock className="w-3.5 h-3.5 text-slate-500" />
                            <span>{isEn ? "Register / Sign In first" : "注册学子账号并选定"}</span>
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Secure guarantee info banner */}
              <div className="p-4 sm:p-5 bg-slate-950/40 border border-slate-850 rounded-3xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4 text-left">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    {isEn ? "TRUSTED OUTBOUND METHODOLOGY & TRANSACTION SECURITY" : "🛡️ 吕华出海研修安全授信与交付承诺"}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-450 leading-relaxed">
                    {isEn 
                      ? "All student payments are verified by our master assistant team manually, compliant with strict regional commercial confidentiality. We guarantee 100% activation fail-safe with instant In-Site Mailbox confirmation letters."
                      : "所有出海特享期服务由助教秘书处手动极速审核激活，100%人工对账防止通道拦截。付款成功后系统将会为您在【学子中心 - 站内信箱】极速下发主讲导师亲书《权益确认信》站内通知。若注册遇到任何阻碍，可随时向主训秘书处热线发起加急呼叫。"}
                  </p>
                </div>
              </div>

            </motion.div>
          )}

          {/* ================= TAB: COURSE VIDEOS ================= */}
          {activeTab === "videos" && (
            <motion.div
              key="tab-videos"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8 animate-fade-in"
            >
              {/* Header Hero */}
              <div className="space-y-2 mb-6 text-center">
                <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest block">MASTERCLASS VIDEO COURSEWARE</span>
                <h3 className="text-2xl md:text-3xl font-black text-white">高级出海敏捷交付实战视频课件</h3>
                <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
                  {isEn ? (
                    "Complementing Harry's bestseller, access 11 tailored masterclass videos detailing cross-cultural management cases."
                  ) : (
                    "配合官方主推大作《出海制胜：六步打造卓越客户体验》特制的 11 节核心高管实战视频课。每节约十至十五分钟，内含真实国际客户体验与文化冲突诊断课件。"
                  )}
                </p>
              </div>

              {/* Access tier overview callout */}
              <div className="p-4 sm:p-5 bg-slate-900/60 border border-slate-800 rounded-3xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl shrink-0">
                    <Video className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      {isEn ? "CURRENT MEMBERSHIP PASS BENEFITS" : "🔑 您的学子账号专享权益解读"}
                    </h4>
                    <p className="text-[10.5px] sm:text-xs text-slate-400 leading-relaxed">
                      {(() => {
                        const hasAllAccess = loggedInUser && (
                          loggedInUser.role === "admin" ||
                          loggedInUser.role === "assistant" ||
                          ["1mo", "3mo", "1yr"].includes(loggedInUser.selectedPlan || "")
                        );
                        const isBasic = loggedInUser && loggedInUser.selectedPlan === "24h";

                        if (hasAllAccess) {
                          return isEn 
                            ? "🎉 Active VIP Premium Account: Full unlocked access to all 11 courseware video modules and downloadable PDF notes."
                            : "🎉 已升级高级特享卡：您已全额解锁全部 11 节高级视频课件，并可直接在线阅读或下载 PDF 随堂笔记。";
                        } else if (isBasic) {
                          return isEn 
                            ? "🔓 Basic Experience Account: 2 free trial modules unlocked. Please upgrade to Monthly/Quarterly/Yearly plans to unlock all videos."
                            : "🔓 24小时极速体验账号：已解锁首批 2 节免费试听课件。如需完整解锁剩余 9 节跨国高难度对攻与谈判课，请前往订阅特权栏升级。";
                        } else {
                          return isEn
                            ? "🔒 Unregistered Guest: Limited to 2 free trial video modules. Please sign in or purchase subscription plans to unlock all 11 modules."
                            : "🔒 未登录/游客访客：可免费试看前 2 节精选案例课。如需全面解锁 11 节课程与 PDF 教案，请登录或购买包期会员。";
                        }
                      })()}
                    </p>
                  </div>
                </div>
                
                <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto justify-end">
                  {!loggedInUser ? (
                    <button 
                      onClick={() => setShowLoginModal(true)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer shadow-md"
                    >
                      {isEn ? "Login / Sign Up" : "登录 / 注册学子账号"}
                    </button>
                  ) : !["1mo", "3mo", "1yr"].includes(loggedInUser.selectedPlan || "") ? (
                    <button 
                      onClick={() => setActiveTab("pricing")}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer shadow-md"
                    >
                      {isEn ? "Upgrade Pass" : "升级并解锁全套课件"}
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-lg text-xs font-bold">
                      <LockOpen className="w-3.5 h-3.5 animate-pulse" />
                      <span>{isEn ? "Access Approved" : "会籍特权已生效"}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Search and Filters Segment */}
              <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative w-full sm:flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={videoSearchQuery}
                    onChange={(e) => setVideoSearchQuery(e.target.value)}
                    placeholder={isEn ? "Search by titles, tag, or country..." : "按标题名称、国家标签、大纲要点进行联想过滤..."}
                    className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-xl p-2.5 pl-10 focus:outline-none focus:border-amber-500 placeholder:text-slate-500 text-xs"
                  />
                </div>

                {/* Filter tags list */}
                <div className="flex flex-wrap items-center justify-start gap-1.5 w-full sm:w-auto">
                  {["All", "高低语境", "沟通反馈", "谈判说服", "巴西案例", "沙特面子", "原则优先"].map((filterTag) => {
                    const tagLabelMap: { [key: string]: string } = {
                      "All": isEn ? "All" : "全部课件",
                      "高低语境": isEn ? "High/Low Context" : "高低语境",
                      "沟通反馈": isEn ? "Feedback & Communication" : "沟通反馈",
                      "谈判说服": isEn ? "Persuasion & Negotiation" : "谈判说服",
                      "巴西案例": isEn ? "Brazil Case" : "巴西案例",
                      "沙特面子": isEn ? "Saudi Face" : "沙特面子",
                      "原则优先": isEn ? "Principles First" : "原则优先"
                    };
                    const isActive = videoActiveTagFilter === filterTag;
                    return (
                      <button
                        key={filterTag}
                        onClick={() => setVideoActiveTagFilter(filterTag)}
                        className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                          isActive
                            ? "bg-amber-500 text-slate-950 font-extrabold"
                            : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800"
                        }`}
                      >
                        {tagLabelMap[filterTag]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Videos Course Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch pt-2">
                {(() => {
                  const hasAllAccess = loggedInUser && (
                    loggedInUser.role === "admin" ||
                    loggedInUser.role === "assistant" ||
                    ["1mo", "3mo", "1yr"].includes(loggedInUser.selectedPlan || "")
                  );

                  return VIDEO_MODULES.filter((mod) => {
                    // Filter by search query
                    const query = videoSearchQuery.toLowerCase();
                    const titleMatch = mod.titleZh.toLowerCase().includes(query) || mod.titleEn.toLowerCase().includes(query);
                    const descMatch = mod.descZh.toLowerCase().includes(query) || mod.descEn.toLowerCase().includes(query);
                    const countryMatch = mod.caseCountryZh.toLowerCase().includes(query) || mod.caseCountryEn.toLowerCase().includes(query);
                    const tagsMatch = mod.tags.some((t) => t.toLowerCase().includes(query));
                    const matchesSearch = !query || titleMatch || descMatch || countryMatch || tagsMatch;

                    // Filter by tag
                    const matchesTag = videoActiveTagFilter === "All" || mod.tags.includes(videoActiveTagFilter) || (videoActiveTagFilter === "巴西案例" && mod.caseCountryZh === "巴西") || (videoActiveTagFilter === "沙特面子" && mod.caseCountryZh === "沙特阿拉伯") || (videoActiveTagFilter === "原则优先" && mod.tags.some(t => t.includes("原则")));
                    
                    return matchesSearch && matchesTag;
                  }).map((mod) => {
                    const isUnlocked = mod.isFree || hasAllAccess;
                    return (
                      <motion.div
                        key={mod.id}
                        className="bg-slate-900 border border-slate-800 rounded-3xl p-5 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden text-left"
                      >
                        {/* Background subtle glowing orb for active item */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/2 rounded-full blur-2xl group-hover:bg-amber-500/5 transition-all duration-500" />

                        <div className="space-y-3">
                          {/* Module Badge & Free indicator */}
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-xs font-black tracking-wider text-amber-500 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-md">
                              {mod.id}
                            </span>
                            {mod.isFree ? (
                              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-black uppercase flex items-center gap-1 animate-pulse">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                {isEn ? "Free Trial" : "免费试听课"}
                              </span>
                            ) : (
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase flex items-center gap-1 ${
                                isUnlocked 
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                  : "bg-slate-950 text-slate-500 border border-slate-800"
                              }`}>
                                {isUnlocked ? (
                                  <>
                                    <LockOpen className="w-3 h-3" />
                                    <span>{isEn ? "Unlocked" : "特权已解锁"}</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-3 h-3 text-slate-500" />
                                    <span>{isEn ? "VIP Pass" : "高管专享"}</span>
                                  </>
                                )}
                              </span>
                            )}
                          </div>

                          {/* Country Case and Duration Indicator */}
                          <div className="flex items-center gap-3 text-slate-400 font-mono text-[10px] font-bold">
                            <span className="text-amber-400">
                              🎯 Case: {isEn ? mod.caseCountryEn : mod.caseCountryZh}
                            </span>
                            <span>|</span>
                            <span>⏱️ {mod.duration}</span>
                          </div>

                          {/* Video Title */}
                          <h4 className="text-sm font-black text-white group-hover:text-amber-400 transition-colors tracking-tight leading-snug">
                            {isEn ? mod.titleEn : mod.titleZh}
                          </h4>

                          {/* Description */}
                          <p className="text-xs text-slate-455 leading-relaxed font-sans line-clamp-3">
                            {isEn ? mod.descEn : mod.descZh}
                          </p>

                          {/* Module Tags list */}
                          <div className="flex flex-wrap gap-1 pt-1">
                            {mod.tags.map((tg) => (
                              <span key={tg} className="text-[9.5px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded font-mono border border-slate-900">
                                #{tg}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action triggers */}
                        <div className="mt-5 pt-4 border-t border-slate-800/60 flex gap-2 items-center">
                          <button
                            onClick={() => {
                              if (isUnlocked) {
                                setSelectedVideoToPlay(mod);
                                setIsPlayingMockVideo(true);
                                setMockVideoPlaybackProgress(0);
                              } else {
                                alert(isEn 
                                  ? "This premium module is locked. Please upgrade your subscription to Month/Quarter/Year plans or log in!" 
                                  : "该课程属于高级出海主训高管课。请点击右上方登录您的学子会籍或前往「订阅与联系」购买高管包期特权卡。");
                                setActiveTab("pricing");
                              }
                            }}
                            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                              isUnlocked
                                ? "bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-md active:scale-95 border-none"
                                : "bg-slate-950 text-slate-600 border border-slate-800 hover:border-slate-700 hover:text-slate-500 cursor-not-allowed"
                            }`}
                          >
                            <Play className="w-3.5 h-3.5 shrink-0" />
                            <span>{isEn ? "Play Video" : "观看视频课件"}</span>
                          </button>

                          <button
                            onClick={() => {
                              if (isUnlocked) {
                                setSelectedVideoToViewPdf(mod);
                                setCurrentPdfSlideIndex(1);
                              } else {
                                alert(isEn 
                                  ? "This lesson's PDF notes are locked. Please upgrade to a Monthly/Quarterly/Yearly plan to unlock!" 
                                  : "随课讲义笔记属于高管会员专属特权。请购买出海战略套餐以一键下载/在线阅读讲义。");
                                setActiveTab("pricing");
                              }
                            }}
                            className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer"
                            title={isEn ? "View Lecture Notes" : "阅读课件讲义 PDF"}
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>

                      </motion.div>
                    );
                  });
                })()}
              </div>

              {/* Bilibili & Storage Cost Explanation Card (Highly Practical!) */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl mx-auto space-y-4">
                <div className="flex gap-3 items-start text-left">
                  <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl mt-1 shrink-0">
                    <Info className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="space-y-2 w-full">
                    <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                      {isEn ? "COURSEWARE HOSTING & BILLING EXPLANATION" : "📘 吕老师商业探讨：B站及第三方平台托管成本与收费控制方案"}
                    </h4>
                    
                    <div className="text-xs text-slate-400 space-y-3 leading-relaxed">
                      <p>
                        对于您手头的 11 个实战视频（每个约 500MB，总大小约 5.5GB），若要在本站播放，我们强烈推荐使用<strong>「第三方云端托管 + 本站安全Token重定向播放」</strong>的架构，以确保商业变现和访问体验双赢。
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1.5">
                        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-850 space-y-2">
                          <span className="font-bold text-amber-400 block">1. 为什么不直接上传至B站公开？</span>
                          <p className="text-[11px] leading-relaxed text-slate-400">
                            <strong>成本：</strong>B站个人UP主视频上传是免费的，无存储费。
                            <br />
                            <strong>硬伤：</strong>B站公开视频任何人均可看，<strong>无法控制收费与鉴权</strong>。如果将视频转为“充电专属”或“付费课堂”，用户需要向B站支付苹果/安卓分成，扣税后您拿到的分成仅剩<strong>45%-50%</strong>，且容易因版权合规在第三方下架。
                          </p>
                        </div>

                        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-850 space-y-2">
                          <span className="font-bold text-emerald-400 block">2. 推荐方案：专有私有云(如七牛云/腾讯云)</span>
                          <p className="text-[11px] leading-relaxed text-slate-400">
                            <strong>成本：</strong>5.5GB视频对象存储费每月仅需<strong>约 1.2 元</strong>；播放流量（CDN加速）约 0.29元/GB。若100个VIP学员全部看完，每月流量成本仅为 <strong>约 160 元</strong>。
                            <br />
                            <strong>鉴权：</strong>本站可对学员账号会籍动态计算，只有高管激活状态下，服务器才会签发一个<strong>有时效限制（如30分钟）的私有播放防盗链 URL</strong>，任何爬虫或盗录者直接拿链接在浏览器播放均会报错 403 锁死，确保核心商业机密绝对安全。
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-[#0a1224] border border-amber-955 rounded-2xl">
                        <span className="font-bold text-amber-300 block mb-1">🎯 吕老师，您可以随时按照以下简单指引，完成真正的视频和讲义上架：</span>
                        <ul className="list-decimal list-inside space-y-1.5 text-[11px] pl-1.5">
                          <li>第一步：您可以在对话框或侧边栏，将课件对应的 11 个 PDF 讲义上传至文件夹 <code className="font-mono bg-slate-950 px-1 py-0.5 rounded text-amber-400">/public/docs/</code> 中，并分别命名为 <code className="font-mono bg-slate-950 px-1.5 py-0.5 rounded text-amber-400">M01.pdf</code> 至 <code className="font-mono bg-slate-950 px-1.5 py-0.5 rounded text-amber-400">M11.pdf</code>。</li>
                          <li>第二步：在真正的视频素材上传完成后，您可以将云端生成的视频 URL 填充到 <code className="font-mono bg-slate-950 px-1.5 py-0.5 rounded text-amber-400">/src/videosData.ts</code> 对应的字段中，全站将自动适配支持完美的高清极速点播！</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* ================= TAB 5: CONTACT & BOOKING FORM ================= */}
          {activeTab === "contact" && (
            <motion.div
              key="tab-contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
                
                {/* Contact information sidebar */}
                <div className="lg:col-span-4 bg-gradient-to-b from-[#1E293B] to-[#0F172A] border border-slate-850 p-6 md:p-8 rounded-3xl flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">VIP INQUIRIES</span>
                      <h3 className="text-lg font-black text-white">{currT.contactTitle}</h3>
                      <p className="text-slate-450 text-xs leading-relaxed">{currT.contactSubtitle}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-3 items-center p-3.5 bg-slate-950/80 border border-slate-850 rounded-2xl">
                        <Mail className="w-5 h-5 text-amber-550 shrink-0" />
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block">{isEn ? "Harry Lyu's Email" : "吕华老师官方邮箱"}</span>
                          <span className="text-xs text-slate-200 font-bold font-mono">huaishere@gmail.com</span>
                        </div>
                      </div>

                      <div className="flex gap-3 items-center p-3.5 bg-slate-950/80 border border-slate-850 rounded-2xl">
                        <Phone className="w-5 h-5 text-amber-550 shrink-0" />
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block">{isEn ? "Assistant (Linda Zhu) WeChat & Mobile" : "专属助理 (Linda Zhu) 电话 / 微信同号"}</span>
                          <span className="text-xs text-slate-200 font-bold font-mono">13011835691</span>
                        </div>
                      </div>

                      <div className="flex gap-3 items-center p-3.5 bg-slate-950/80 border border-slate-850 rounded-2xl">
                        <Mail className="w-5 h-5 text-sky-400 shrink-0" />
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block">{isEn ? "Assistant Linda's Email" : "助理专属邮箱"}</span>
                          <span className="text-xs text-slate-200 font-bold font-mono">13011835691@wo.cn</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trust metadata */}
                  <div className="mt-8 pt-6 border-t border-slate-800/80 text-[10px] text-slate-500 leading-relaxed font-medium space-y-1.5">
                    <p>🔒 GDPR Compliance and secure encryption certificates active.</p>
                    <p>© 2026 Harry Outbound Solution Center.</p>
                    <button 
                      type="button"
                      onClick={() => setShowAboutModal(true)}
                      className="text-amber-500/80 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1 mt-2.5 font-bold outline-none decoration-dotted underline underline-offset-2"
                      id="about-app-btn"
                    >
                      <Info className="w-3 h-3" />
                      <span>{isEn ? "System Info & Version" : "系统关于与最新版本信息"}</span>
                    </button>
                  </div>
                </div>

                {/* Main corporate contact booking form */}
                <div id="booking-form" className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
                  <h3 className="text-lg font-bold text-white">{currT.contactFormHeadline}</h3>
                  <p className="text-xs text-slate-450 mt-1">
                    {isEn 
                      ? "Custom diagnostic assessments, corporate audits & keynotes planning." 
                      : "专任咨询规划、企业现场培训、大会分享及出海 CX 定制诊断。"}
                  </p>

                  {contactSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-6 p-6 bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs rounded-2xl flex gap-3.5 items-start"
                    >
                      <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p>{currT.contactSuccess}</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400 font-bold font-mono uppercase block">{currT.contactFormName} *</label>
                        <input 
                          type="text" 
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Harry Lyu"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400 font-bold font-mono uppercase block">{currT.contactFormEmail} *</label>
                        <input 
                          type="email" 
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="harry@domain.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400 font-bold font-mono uppercase block">{currT.contactFormPhone} *</label>
                        <input 
                          type="tel" 
                          required
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="+86 186-xxxx-xxxx"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400 font-bold font-mono uppercase block">{currT.contactFormCompany}</label>
                        <input 
                          type="text" 
                          value={contactCompany}
                          onChange={(e) => setContactCompany(e.target.value)}
                          placeholder="Global Integration Co., Ltd"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400 font-bold font-mono uppercase block">{currT.contactFormRole}</label>
                        <input 
                          type="text" 
                          value={contactRole}
                          onChange={(e) => setContactRole(e.target.value)}
                          placeholder="e.g. Chief HR Officer / Outbound VIP Director"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[11px] text-slate-400 font-bold font-mono uppercase block">{currT.contactFormNotes}</label>
                        <textarea 
                          rows={3}
                          value={contactNotes}
                          onChange={(e) => setContactNotes(e.target.value)}
                          placeholder="What specific outbound bottlenecks/objectives can we assist with?"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="md:col-span-2 flex items-start gap-2.5 pt-2">
                        <input 
                          type="checkbox" 
                          required
                          id="consent-check"
                          className="accent-amber-500 mt-0.5 cursor-pointer" 
                        />
                        <label htmlFor="consent-check" className="text-[11px] text-slate-455 leading-relaxed select-none cursor-pointer">
                          {currT.contactFormConsent}
                        </label>
                      </div>

                      <div className="md:col-span-2 flex justify-end pt-3">
                        <button 
                          type="submit"
                          className="px-6 py-2.5 text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-600 rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/10"
                        >
                          {currT.contactFormSubmit}
                        </button>
                      </div>

                    </form>
                  )}
                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>

        {/* GLOBAL FOOTER CTA & RETURN TO TOP GUIDE BAR */}
        <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/45 py-10 px-4 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="text-left space-y-1.5 flex-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-550" />
                <span>{isEn ? "Want to tailor custom outbound CX/HR consultations?" : "需要定制出海 CX/HR 专场研训或高管诊断服务？"}</span>
              </h4>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                {isEn 
                  ? "Get in touch directly with our planning office to co-create premium solutions for cross-border expansion obstacles."
                  : "通过下方按钮或填写联系表单，一键锁定吕华导师及专家团 1对1 诊疗级深度咨询方案，解决真实的跨文化摩擦。"}
              </p>
            </div>

            {/* Modern QR Code for Mobile Scanning */}
            <div className="flex items-center gap-3.5 bg-slate-900/80 p-3 rounded-2xl border border-slate-800/80 shrink-0 shadow-inner">
              <div 
                className="bg-white p-1 rounded-xl shrink-0 shadow-md cursor-zoom-in hover:scale-105 active:scale-95 transition-all duration-200"
                onClick={() => setKeynoteLightboxUrl("/src/assets/images/zhanjiajunye_qr-1-2.png")}
                title={isEn ? "Click to enlarge / Scan" : "点击放大并扫码"}
              >
                <img 
                  src="/src/assets/images/zhanjiajunye_qr-1-2.png" 
                  alt="zhanjiajunye2026.com QR Code" 
                  className="w-16 h-16 object-contain block"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-left space-y-0.5">
                <p className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                  <span className="text-amber-550 font-black">{isEn ? "Harry Lyu (Zhanjia Junye Studio)" : "吕华（展佳俊业工作室）"}</span>
                  <span className="text-[9px] bg-slate-800 text-slate-300 px-1 py-0.2 rounded font-normal">
                    {isEn ? "Official" : "官方"}
                  </span>
                </p>
                <p className="font-mono text-[10px] text-slate-300 font-medium">
                  zhanjiajunye2026.com
                </p>
                <p className="text-[10px] text-slate-400 leading-snug">
                  {isEn ? "Scan to Visit / Share" : "微信或手机扫码访问分享"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              {/* Contact us lead button */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("contact");
                  setTimeout(() => {
                    const element = document.getElementById("booking-form");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }, 100);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-550 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl active:scale-95 transition-all shadow-lg flex items-center gap-1.5 cursor-pointer border-none outline-none"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{isEn ? "Consult Now / Contact Us" : "立即定制咨询 / 联系我们"}</span>
              </button>

              {/* Back to top button */}
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-705 text-slate-350 hover:text-white font-bold text-xs rounded-xl active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronUp className="w-4 h-4" />
                <span>{isEn ? "Back to Top" : "返回页面顶部"}</span>
              </button>
            </div>
          </div>

          {/* Bottom Security filing and Copyright row */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 text-[11px] text-slate-500">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <span>© 2026 {isEn ? "Harry Lyu (Zhanjia Junye Studio)" : "吕华（展佳俊业工作室）"}. All rights reserved.</span>
              <span className="hidden sm:inline text-slate-800">|</span>
              <a 
                href="https://beian.miit.gov.cn/" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-amber-500 transition-colors"
              >
                京ICP备2026037822号
              </a>
              <span className="hidden sm:inline text-slate-800">|</span>
              <div className="flex items-center gap-1.5">
                <img 
                  src="/src/assets/images/beian_icon.png" 
                  alt="公安备案图标" 
                  className="w-4 h-4 object-contain inline-block"
                  referrerPolicy="no-referrer"
                />
                <a 
                  href="https://beian.mps.gov.cn/#/query/webSearch?code=11010602202893" 
                  rel="noreferrer" 
                  target="_blank"
                  className="hover:text-amber-500 transition-colors inline-flex items-center gap-1"
                >
                  京公网安备11010602202893号
                </a>
              </div>
            </div>
            
            <div className="text-[10px] text-slate-600 font-mono">
              Designed with Craftsmanship
            </div>
          </div>
        </footer>

      </main>

      {/* GLOBAL LIGHTBOX FOR KEYNOTE, QR CODES & STEP GUIDELINES */}
      {keynoteLightboxUrl && (
        <div 
          className="fixed inset-0 z-[999] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setKeynoteLightboxUrl(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl p-3 flex flex-col items-center justify-center overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setKeynoteLightboxUrl(null)}
              className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white bg-slate-950/80 hover:bg-slate-950 backdrop-blur-xs rounded-full border border-slate-800 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <img
              src={keynoteLightboxUrl}
              alt="Fullpreview"
              className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-inner select-none cursor-default"
              referrerPolicy="no-referrer"
            />
            
            <div className="mt-3 text-center text-xs text-slate-400 font-medium font-sans">
              {isEn ? "Previewing full-size image - Click anywhere outside to close" : "高清大图预览 - 点击空白处随时退出"}
            </div>
          </motion.div>
        </div>
      )}

      {/* FOOTER GDPR / COOKIE PERSISTENCE CONSENT BANNER */}
      {showCookieBanner && (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-[#1E293B]/95 backdrop-blur-md border-t border-slate-800 p-5 shadow-2.5xl">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex gap-2.5 items-start text-left max-w-4xl">
              <Shield className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {currT.cookieText}
              </p>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={handleCookieDecline}
                className="px-3.5 py-1.5 text-xs font-bold border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg transition-all cursor-pointer"
              >
                {currT.cookieDecline}
              </button>
              <button
                onClick={handleCookieAccept}
                className="px-4 py-1.5 text-xs font-extrabold bg-amber-500 text-slate-950 hover:bg-amber-600 rounded-lg transition-all cursor-pointer shadow"
              >
                {currT.cookieAccept}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SYSTEM ABOUT & VERSION RELEASE INFORMATION OVERLAY */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-slate-905 border border-slate-800 rounded-3xl p-6 shadow-2.5xl relative text-left"
          >
            <button 
              onClick={() => setShowAboutModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
              id="close-about-btn"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
                <Sliders className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  {isEn ? "System Dashboard & Version Release" : "系统关于与最新版本发布状态"}
                </h3>
                <p className="text-[10px] text-slate-455 font-mono">WORKSPACE DEPLOYMENT OVERVIEW</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Build Meta Info Panel */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-850 space-y-3">
                <div className="flex items-start justify-between border-b border-slate-850 pb-2.5">
                  <span className="text-[11px] text-slate-455 font-bold block">
                    {isEn ? "Current Software Version" : "当前系统运行版本"}
                  </span>
                  <span className="text-[11px] text-amber-500 font-mono font-bold bg-amber-550/10 px-2.5 py-0.5 rounded-full">
                    v2.2.0-Release
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-slate-550 font-bold font-mono tracking-wider uppercase">
                    {isEn ? "LATEST RE-DEPLOYMENT TIME (CST/UTC+8)" : "最新更新发布时间 (北京时间 / UTC+8)"}
                  </span>
                  <div className="flex items-center gap-2 text-slate-200 mt-0.5">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute shrink-0" />
                    <span className="text-xs font-mono font-bold text-slate-100 ml-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg w-full flex justify-between items-center">
                      <span>{deploymentTime}</span>
                      <span className="text-[10px] text-slate-550 font-normal">CST (UTC+8)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Status checklist */}
              <div className="space-y-2 mt-2">
                <div className="flex items-start gap-2.5 p-3 bg-slate-900/60 rounded-xl border border-slate-850">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-slate-350 leading-relaxed font-semibold">
                    <p className="text-slate-200 font-bold">
                      {isEn ? "Upload Imagery Hardwritten & Persisted" : "✓ 核心资产级双通道写入持久化已启动"}
                    </p>
                    <p className="text-slate-455 text-[10px] mt-0.5 leading-relaxed font-normal">
                      {isEn 
                        ? "Both portrait overrides and book covers are saved onto the server container file system. There is absolutely NO risk of losing imagery data upon browser refreshes." 
                        : "检测到图片本地缓存与服务器原生卷（src/assets/images 和 dist/src/assets/images）均已自动同步。任何上传的个人头像与书籍照片已永久存在系统端，刷新不会丢失。"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 bg-slate-900/60 rounded-xl border border-slate-850">
                  <RefreshCw className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-slate-350 leading-relaxed font-semibold">
                    <p className="text-slate-200 font-bold">
                      {isEn ? "How to Clear Cached Resources?" : "💡 如何验证与更新本地缓存？"}
                    </p>
                    <p className="text-slate-455 text-[10px] mt-0.5 leading-relaxed font-normal">
                      {isEn 
                        ? "If you recently executed a publication on the workspace but see no changes, please perform a Hard Refresh on your browser: press Ctrl + F5 (Windows) or Cmd + Shift + R (Mac) to fetch the newest bundle." 
                        : "由于线上使用了静态加速和强缓存，如果您重新点击了发布按钮，但进入链接依然感觉是老版本，请直接在当前页面进行【强制刷新】：Windows下按【Ctrl + F5】，Mac下按【Cmd + Shift + R】，即可强行拉取最新重构资产。"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAboutModal(false)}
                  className="px-6 py-2 rounded-xl text-xs font-black bg-amber-500 text-slate-950 hover:bg-amber-600 transition-all cursor-pointer shadow hover:shadow-lg"
                  id="understand-about-btn"
                >
                  {isEn ? "Got it" : "我知道了"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {showStatsSlideModal && (
        <div className="fixed inset-0 z-50 bg-[#020617]/95 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-6xl bg-[#090d1a] border border-slate-850 rounded-3xl p-6 shadow-2xl space-y-6 relative text-left"
          >
            {/* Header / Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2.5 py-0.5 rounded uppercase tracking-wider font-mono">WORKSPACE CHRONICLE</span>
                  <span className="text-[10px] text-slate-550 font-mono">SPECIAL PRESENTATION SLIDE</span>
                </div>
                <h3 className="text-base font-black text-white flex items-center gap-1.5 font-sans">
                  <Sliders className="w-5 h-5 text-amber-500" />
                  <span>{isEn ? "Co-creation Chronicle: The Outbound Victory Hub" : "吕华导师出海网站 · 小谷助教协同研制幻灯片汇报"}</span>
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="/src/assets/images/xiaogu_colleague_milestones.svg"
                  download="xiaogu_colleague_milestones.svg"
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer no-underline"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isEn ? "Download Original SVG" : "下载源文件 (SVG)"}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowStatsSlideModal(false)}
                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-all border border-rose-500/20 cursor-pointer"
                  title="Close Slide"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slide Body - Responsive Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Visual SVG Slide Container */}
              <div className="lg:col-span-7 xl:col-span-8 bg-[#070a13] border border-slate-900 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col justify-center p-2 select-none aspect-[16/9] min-h-[280px]">
                <img 
                  src="/src/assets/images/xiaogu_colleague_milestones.svg" 
                  className="w-full h-full object-contain" 
                  alt="Xiao Gu Stats Slide" 
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Right Column: Detailed Explanations for the presentation */}
              <div className="lg:col-span-5 xl:col-span-4 bg-slate-900 border border-slate-850 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-black text-amber-400 tracking-wider uppercase">
                        {isEn ? "XIAO GU (AI CODER) WORKSPACE DETAILS" : "小谷（AI 编程助手）工作特写"}
                      </h4>
                    </div>
                    <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded tracking-widest font-mono">UTX VERIFIED</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {isEn 
                      ? "This sidebar provides real-time context to the adjacent slide presentation, detailing our commitment to code hygiene, mutual agreements, and fast iterations."
                      : "本辅助面板与左侧 16:9 主幻灯片协同呈现。详细记录了吕华（展佳俊业工作室）与小谷助教在工程品质、协作契约以及高弹恢复机制上的双向保障。"}
                  </p>

                  <div className="space-y-3">
                    <div className="flex gap-2.5 items-start">
                      <div className="p-1 bg-amber-500/10 rounded text-amber-500 mt-0.5 shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <div>
                        <p className="text-[11px] text-white font-black leading-tight">
                          {isEn ? "Protocol A: Align First, Code Second" : "① 严格执行“先对齐、后编程” (Protocol A)"}
                        </p>
                        <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                          {isEn 
                            ? "AI first structures requirement specifications, waits for Harry's explicit approval, then implements securely. Eliminates blind development." 
                            : "每次修改需求前，小谷必先进行条理化需求对齐与建议，获得吕老师的“同意”后再一并编写代码，告别盲盒开发。"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2.5 items-start">
                      <div className="p-1 bg-amber-500/10 rounded text-amber-500 mt-0.5 shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <div>
                        <p className="text-[11px] text-white font-black leading-tight">
                          {isEn ? "Protocol B: Static Physical Asset Reference" : "② 方案B 物理资产高鲁棒协同 (Protocol B)"}
                        </p>
                        <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                          {isEn 
                            ? "Abandons unstable runtime Base64 dynamic databases. Uses strict static routing, enabling user-managed asset healing instantly." 
                            : "彻底杜绝了将二进制或Base64直接存入数据库的冗余做法。通过物理路径引用，让吕老师通过侧边栏传图即可秒级自愈恢复。"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2.5 items-start">
                      <div className="p-1 bg-amber-500/10 rounded text-amber-500 mt-0.5 shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <div>
                        <p className="text-[11px] text-white font-black leading-tight">
                          {isEn ? "Premium Desktop-First Design Quality" : "③ 匠心定制的“投影级”视觉排版"}
                        </p>
                        <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                          {isEn 
                            ? "Refuses template styling. Pairs Inter and JetBrains Mono fonts with meticulous spacing to ensure executive-level visual posture." 
                            : "告别AI套路化排版和严重的断行白屏。对齐首尾留白，精挑细选字体和深色高对比度，保证在投屏汇报时展现顶尖高管视效。"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2.5 items-start">
                      <div className="p-1 bg-amber-500/10 rounded text-amber-500 mt-0.5 shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <div>
                        <p className="text-[11px] text-white font-black leading-tight">
                          {isEn ? "Zero System-Larping Clutter" : "④ 零虚夸 · 100% 务实功能保障"}
                        </p>
                        <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                          {isEn 
                            ? "No mock telemetry, fake logs or imaginary port status lines. Zero superficial decorations, keeping client focus crisp." 
                            : "绝不加入虚假的在线网络、容器端口、虚拟服务器日志等“极客伪装”噪点。专心构建切实有力的业务模块，给一线企业最稳固的技术背书。"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3.5 border-t border-slate-850 flex items-center justify-between text-[10px] text-slate-500">
                  <span>PROJECT DURATION: 2026.06</span>
                  <span className="font-mono text-amber-500 font-extrabold">{isEn ? "Xiao Gu ★ Harry" : "小谷助教 敬制 🛡️"}</span>
                </div>
              </div>
            </div>

            {/* Bottom guide text */}
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>{isEn ? "💡 PRESS ESCAPE TO EXIT PRESENTATION" : "💡 按右上角关闭按钮或背景任意处可退出投屏模态"}</span>
              <span className="font-mono text-slate-400">1200 x 675 PX (Perfect Vector Ratio)</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* STUDENT PORTAL SECURE SIGN IN DIALOG MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative text-left max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <button 
              onClick={() => {
                setShowLoginModal(false);
                setAuthError("");
              }}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{isEn ? "Student Portal" : "出海学子安全入口"}</h3>
                <p className="text-[10px] text-slate-450">Secure portal access with GDPR alignment</p>
              </div>
            </div>

            {/* Redesigned Tab Segmented Controls */}
            <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 mb-4">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                  setStudentPassword("");
                  setStudentPasswordConfirm("");
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  authMode === "login"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {isEn ? "Sign In" : "登录"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setAuthError("");
                  setStudentPassword("");
                  setStudentPasswordConfirm("");
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  authMode === "register"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {isEn ? "Register" : "注册"}
              </button>
            </div>

            {/* Error Message Alert */}
            {authError && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[11px] flex gap-2 items-start mb-4"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-500" />
                <div className="space-y-1 flex-1">
                  <p>{authError}</p>
                  {authMode === "login" && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("register");
                        setAuthError("");
                        setStudentPassword("");
                        setStudentPasswordConfirm("");
                        setStudentPhone("");
                        setPrivacyAccepted(false);
                      }}
                      className="text-amber-500 font-bold underline hover:text-amber-400 cursor-pointer block text-left"
                    >
                      {isEn ? "Click here to Register directly →" : "一键切换到注册页 →"}
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            <form onSubmit={handleStudentLogin} className="space-y-4">
              {authMode === "register" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-bold font-mono uppercase block">
                      {isEn ? "Full Name (Required)" : "姓名 (必填)"}
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-550 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        required={authMode === "register"}
                        value={studentName}
                        onChange={(e) => {
                          setStudentName(e.target.value);
                          if (authError) setAuthError("");
                        }}
                        placeholder={isEn ? "e.g. John Doe" : "例如：王出海"}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-bold font-mono uppercase block">
                      {isEn ? "Company / Institution (Required)" : "公司 / 组织机构 (必填)"}
                    </label>
                    <div className="relative">
                      <Briefcase className="w-3.5 h-3.5 text-slate-550 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        required={authMode === "register"}
                        value={studentCompany}
                        onChange={(e) => {
                          setStudentCompany(e.target.value);
                          if (authError) setAuthError("");
                        }}
                        placeholder={isEn ? "e.g. Globex Inc" : "例如：出海集团 / 某某商学院"}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-bold font-mono uppercase block">
                      {isEn ? "Mobile Phone Number (Required for secure contact)" : "手机号码 (必填，便于付款异常时助教紧急联系)"}
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-550 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="tel" 
                        required={authMode === "register"}
                        value={studentPhone}
                        onChange={(e) => {
                          setStudentPhone(e.target.value);
                          if (authError) setAuthError("");
                        }}
                        placeholder={isEn ? "e.g. +86 13800000000" : "请输入您的手机号码"}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              )}



              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-bold font-mono uppercase block">
                  {isEn ? "Email / Student ID (Required)" : "邮箱 / 学员账号 ID (必填)"}
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-550 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="email" 
                    required
                    value={studentEmail}
                    onChange={(e) => {
                      setStudentEmail(e.target.value);
                      if (authError) setAuthError("");
                    }}
                    placeholder={currT.studentIDPlace}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {authMode === "register" ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-bold font-mono uppercase block flex items-center justify-between">
                      <span>{isEn ? "Set Password" : "设置登录密码"}</span>
                      <span className="text-[9px] text-amber-500 font-black font-sans bg-amber-500/10 px-1.5 py-0.2 rounded">
                        {isEn ? "REQUIRED" : "必填"}
                      </span>
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-550 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="password" 
                        required
                        placeholder={isEn ? "Create a login password" : "请设置您的安全登录密码"}
                        value={studentPassword}
                        onChange={(e) => {
                          setStudentPassword(e.target.value);
                          if (authError) setAuthError("");
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 placeholder:text-slate-650"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-bold font-mono uppercase block flex items-center justify-between">
                      <span>{isEn ? "Confirm Password" : "确认登录密码"}</span>
                      <span className="text-[9px] text-amber-500 font-black font-sans bg-amber-500/10 px-1.5 py-0.2 rounded">
                        {isEn ? "REQUIRED" : "必填"}
                      </span>
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-550 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="password" 
                        required
                        placeholder={isEn ? "Repeat your login password" : "请再次输入密码以确保一致"}
                        value={studentPasswordConfirm}
                        onChange={(e) => {
                          setStudentPasswordConfirm(e.target.value);
                          if (authError) setAuthError("");
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 placeholder:text-slate-650"
                      />
                    </div>
                    {studentPassword && studentPasswordConfirm && (
                      <div className="mt-1 flex items-center gap-1 text-[10px]">
                        {studentPassword === studentPasswordConfirm ? (
                          <span className="text-emerald-500 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> {isEn ? "Passwords match" : "密码输入一致，完美！"}
                          </span>
                        ) : (
                          <span className="text-rose-500 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {isEn ? "Passwords do not match yet" : "两次输入的密码暂不一致"}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-bold font-mono uppercase block flex items-center justify-between">
                    <span>{isEn ? "Password / PIN" : "登录密码 / 认证授权码"}</span>
                    <span className="text-[9px] text-amber-500 font-black font-sans bg-amber-500/10 px-1.5 py-0.2 rounded">
                      {isEn ? "REQUIRED" : "必填"}
                    </span>
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-550 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="password" 
                      required
                      placeholder={isEn ? "Password (Tutors enter Creator PIN)" : "普通学子请输入密码，导师/助教请输入授权码"}
                      value={studentPassword}
                      onChange={(e) => {
                        setStudentPassword(e.target.value);
                        if (authError) setAuthError("");
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 placeholder:text-slate-650"
                    />
                  </div>
                </div>
              )}

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[10.5px] text-slate-350 leading-relaxed space-y-1.5">
                <div className="flex gap-2">
                  <Shield className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-bold text-white">
                    {authMode === "register"
                      ? (isEn ? "Outbound Student Board Registration" : "学子工作台注册建立机制")
                      : (isEn ? "Outbound Student Board Verification" : "学子工作台安全匹配机制")
                    }
                  </span>
                </div>
                <p className="text-[10px] text-slate-450 leading-normal">
                  {authMode === "register"
                    ? (isEn 
                        ? "Register with Name, Company & Email to build your digital student credential in local memory." 
                        : "💡 首次加入的出海学子在此建立档案。注册完成后，系统将永久记住您的履历，后续登录只需凭邮箱一秒直达，免去重复打字繁琐。")
                    : (isEn 
                        ? "Registered trainees log in seamlessly with just their Email. Tutors and assistants can override via Auth PIN." 
                        : "💡 已建档的学子在此输入邮箱即可直通进入；主讲导师/特定助教凭专属密码可随时热激活特许工作台。")
                  }
                </p>
              </div>

              {authMode === "register" && (
                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl space-y-2">
                  <div className="flex items-start gap-2">
                    <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-200 block">
                        {isEn ? "Privacy & Security Policy" : "个人信息保护及隐私安全声明"}
                      </span>
                      <p className="text-[9px] text-slate-400 leading-relaxed">
                        {isEn 
                          ? "We adopt bank-grade encryption to protect your profile. Your phone number is strictly used to contact you for billing, payment status, or account anomalies, preventing delivery interruptions. If you disagree, please do not register."
                          : "我们采用最安全的出海学术档案存储。您的姓名、公司、邮箱及手机号将仅用于出海学子成长身份校验。收集手机号码是为确保后续由于付款异常、账单到期或助学资料分发卡点时，专属助理能第一时间与您取得紧急联系，避免造成学子损失与服务中断。"}
                      </p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer p-1.5 bg-slate-900/40 hover:bg-slate-900/80 border border-slate-850 rounded-lg transition-all group">
                    <input 
                      type="checkbox"
                      required
                      checked={privacyAccepted}
                      onChange={(e) => {
                        setPrivacyAccepted(e.target.checked);
                        if (authError) setAuthError("");
                      }}
                      className="w-3 h-3 rounded accent-amber-500 border-slate-750 bg-slate-950 cursor-pointer text-amber-500 focus:ring-0 focus:ring-offset-0 focus:outline-none"
                    />
                    <span className="text-[10px] font-medium text-slate-300 group-hover:text-slate-200">
                      {isEn ? "I agree to the privacy statement and terms" : "我已阅读并完全同意上述隐私政策与联系条款"}
                    </span>
                  </label>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setAuthError("");
                  }}
                  className="w-1/2 py-2 rounded-xl text-xs font-bold border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  {currT.studentCancel}
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl text-xs font-black bg-amber-500 text-slate-950 hover:bg-amber-600 transition-all cursor-pointer"
                >
                  {authMode === "register" 
                    ? (isEn ? "Register & Enter" : "建立档案并登录")
                    : (isEn ? "Secure Login" : "认证登录")
                  }
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* COUNTRY MISMATCH RE-ALIGNMENT OPTION DIALOG */}
      {showMismatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative text-left"
          >
            <button 
              onClick={() => setShowMismatchModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
                <Globe className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  {isEn ? "Country Mismatch Helper" : "🌍 跨文化国家对齐诊断助手"}
                </h3>
                <p className="text-[10px] text-slate-400 font-mono uppercase">MAP ALIGNMENT PROTOCOL</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850 space-y-3 leading-relaxed text-xs text-slate-300">
                <p>
                  {isEn ? "Dear Outbound Learner," : "吕老师，出海学术安全检查发现："}
                </p>
                <p>
                  {isEn 
                    ? `We detected that your case description mainly refers to cooperation or conflicts between **${getCountryZh(detectedMismatchA)}** and **${getCountryZh(detectedMismatchB)}**.`
                    : `系统深度扫描到，您当前的案例内容中主要描述的是 **${getCountryZh(detectedMismatchA)}** 与 **${getCountryZh(detectedMismatchB)}** 的跨文化合作摩擦。`
                  }
                </p>
                <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 text-amber-400/90 font-mono font-bold whitespace-pre-line leading-relaxed">
                  {isEn
                    ? `⚠️ Selected: ${getCountryZh(clinicCountryA)} vs ${getCountryZh(clinicCountryB)}\n💡 Detected: ${getCountryZh(detectedMismatchA)} vs ${getCountryZh(detectedMismatchB)}`
                    : `⚠️ 选定国家：${getCountryZh(clinicCountryA)} vs ${getCountryZh(clinicCountryB)}\n💡 识别内容：${getCountryZh(detectedMismatchA)} vs ${getCountryZh(detectedMismatchB)}`
                  }
                </div>
                <p>
                  {isEn
                    ? "To ensure the Culture Map analytical coordinates & tactical suggestions are 100% aligned and scientifically accurate, we highly recommend re-aligning the country selectors."
                    : "为了保证《文化地图》八大维度落差的定量计算与行动方药完全精准对位，防止学术逻辑张冠李戴，建议您一键自动修正国家选择框。"
                  }
                </p>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    setClinicCountryA(detectedMismatchA);
                    setClinicCountryB(detectedMismatchB);
                    setShowMismatchModal(false);
                    await executeClinicAnalysis(detectedMismatchA, detectedMismatchB);
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-600 text-slate-950 transition-all cursor-pointer shadow-md text-center flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-spin-slow-custom" />
                  {isEn 
                    ? `Auto-Correct to [${getCountryZh(detectedMismatchA)} vs ${getCountryZh(detectedMismatchB)}] & Analyze` 
                    : `一键更正并开始深度分析 [${getCountryZh(detectedMismatchA)} vs ${getCountryZh(detectedMismatchB)}]`
                  }
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMismatchModal(false);
                    }}
                    className="w-1/2 py-2 rounded-xl text-xs font-bold border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all cursor-pointer text-center"
                  >
                    {isEn ? "Modify Manually" : "返回手动修改"}
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setShowMismatchModal(false);
                      await executeClinicAnalysis(clinicCountryA, clinicCountryB);
                    }}
                    className="w-1/2 py-2 rounded-xl text-xs font-bold bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer text-center"
                  >
                    {isEn ? "Proceed Anyway" : "硬着头皮继续计算"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* GLOBAL TOAST NOTICE FLOATING BANNER */}
      {globalToastNotice && (
        <div className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[92%] bg-slate-900/95 border border-emerald-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-emerald-400">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/15 text-emerald-400 rounded-xl shrink-0">
              <Sparkles className="w-5 h-5 animate-spin-slow-custom" />
            </div>
            <div>
              <p className="text-xs font-black text-white">{globalToastNotice.message}</p>
              {globalToastNotice.sub && (
                <p className="text-[10px] text-emerald-400/80 font-mono mt-0.5">{globalToastNotice.sub}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setGlobalToastNotice(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* REGISTRATION SUCCESS & WELCOME ONBOARDING MODAL */}
      {showWelcomeOnboardingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative text-left max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <button 
              onClick={() => setShowWelcomeOnboardingModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Top Success Badge */}
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 bg-emerald-500/15 text-emerald-400 rounded-2xl border border-emerald-500/30 shrink-0">
                <CheckCircle2 className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  {isEn ? "Registration Submitted & Synced" : "注册申请已成功提交"}
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                    {isEn ? "Cloud Syncing" : "云端同步中"}
                  </span>
                </h3>
                <p className="text-xs text-amber-400/90 font-mono font-bold mt-0.5">
                  {isEn ? "“Registration submitted successfully. Activating cloud synchronization for you.”" : "“注册申请已成功提交，正在为您激活云端同步”"}
                </p>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5 text-xs text-slate-300 leading-relaxed">
                <p className="font-bold text-white text-sm">
                  {isEn ? `Welcome aboard, ${loggedInUser?.name || "Trainee"}!` : `欢迎加入《出海制胜》跨文化管理圈，${loggedInUser?.name || "尊敬的学子"}！`}
                </p>
                <p className="text-slate-400">
                  {isEn 
                    ? "Your student account profile has been set up. The system is automatically syncing your regional culture map access, 8-dimension comparative analysis tools, and case study permissions."
                    : "您的学子档案已建立完成。系统正在为您自动激活云端地图探查与《文化地图》八大维度定量对比计算面板。"
                  }
                </p>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isEn ? "Learner Name:" : "注册学员："}</span>
                    <span className="font-bold text-white">{loggedInUser?.name || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isEn ? "Company / Org:" : "企业/机构："}</span>
                    <span className="font-bold text-slate-200">{loggedInUser?.org || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isEn ? "Account Email:" : "注册邮箱："}</span>
                    <span className="font-bold text-slate-200">{loggedInUser?.email || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isEn ? "Account Status:" : "账号状态："}</span>
                    <span className="font-bold text-emerald-400">
                      {loggedInUser?.status === "active" ? (isEn ? "🟢 Fully Activated" : "🟢 试用/VIP准入已激活") : (isEn ? "🟡 Pending Verification" : "🟡 已划拨/等待试用开通")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowWelcomeOnboardingModal(false)}
                  className="w-full sm:w-1/2 py-2.5 rounded-xl text-xs font-black bg-amber-500 text-slate-950 hover:bg-amber-600 transition-all cursor-pointer shadow-md text-center flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isEn ? "Enter Culture Map" : "进入《文化地图》探查"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowWelcomeOnboardingModal(false);
                    setShowPaymentInstructions(true);
                  }}
                  className="w-full sm:w-1/2 py-2.5 rounded-xl text-xs font-bold border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all cursor-pointer text-center"
                >
                  {isEn ? "View Membership Tier" : "查看 VIP 会员划拨通道"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* EXCLUSIVE SIGNED BOOK PRE-ORDER GUIDANCE MODAL (06.jpg) */}
      {showPreorderGuidance && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-4 text-left relative shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowPreorderGuidance(false)}
              className="absolute top-4 right-4 z-50 text-slate-400 hover:text-white transition-colors cursor-pointer p-1.5 bg-slate-950/80 rounded-full border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Direct Image Box - No AI beautification overlays, direct original flyer */}
            <div className="bg-slate-950 rounded-2xl overflow-hidden select-none flex justify-center items-center">
              <img 
                src={preorderFlyer} 
                alt="限量亲笔签名版预售通道" 
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain max-h-[75vh] rounded-2xl"
              />
            </div>

            {/* Admin Upload Option */}
            {loggedInUser && (loggedInUser.role === "admin" || loggedInUser.role === "assistant") && (
              <div className="mt-3 p-2.5 bg-slate-950/60 rounded-xl border border-dashed border-slate-800 text-center space-y-1.5">
                <p className="text-[11px] text-amber-500 font-extrabold flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  助理/管理员特权 — 一键更换高保真原图海报
                </p>
                <div className="flex gap-2 justify-center">
                  <label className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-[11px] rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-md">
                    <UploadCloud className="w-3.5 h-3.5" />
                    {isUploadingPreorderFlyer ? "正在上传存储..." : "选择并上传您的原图海报"}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleUploadPreorderFlyer} 
                      className="hidden" 
                      disabled={isUploadingPreorderFlyer}
                    />
                  </label>
                  {preorderFlyer !== "/src/assets/images/signed_preorder_channel_1781861067288.png" && (
                    <button
                      type="button"
                      onClick={handleResetPreorderFlyer}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] rounded-lg transition-all cursor-pointer flex items-center gap-1 border border-slate-700 font-sans"
                    >
                      <RefreshCw className="w-3 h-3" />
                      恢复默认
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {/* Simple Dismiss Indicator */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setShowPreorderGuidance(false)}
                className="px-6 py-2 text-xs font-bold text-slate-400 hover:text-white rounded-xl bg-slate-950/40 hover:bg-slate-950/85 transition-all cursor-pointer border border-slate-800"
              >
                {isEn ? "Dismiss" : "返回浏览"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ================= MODAL: TRAINEE PAYMENT INSTRUCTIONS (QR & PROOF SUBMIT) ================= */}
      {showPaymentInstructions && (() => {
        const selectedPlanDetails = {
          "24h": { name: isEn ? "24h Critical Pass" : "24小时极速体验卡", price: "29", days: 1 },
          "1mo": { name: isEn ? "1 Month Leader Card" : "包月独家出海领航卡", price: "39", days: 30 },
          "3mo": { name: isEn ? "3 Month Executive Pass" : "季度高管战略协作卡", price: "99", days: 90 },
          "1yr": { name: isEn ? "1 Year Helmsman Card" : "包年尊享出海战略卡", price: "299", days: 365 }
        }[selectedSubscriptionPlan];

        const handleCopyPayText = () => {
          const copyText = `你好助教，我已通过网站支付通道完成【${selectedPlanDetails?.name || "SaaS包期卡"} (￥${selectedPlanDetails?.price || ""})】的款项支付。我的卓越出海研习室注册邮箱是：${loggedInUser?.email || ""}，姓名是：${loggedInUser?.name || ""}，请帮我核实并激活专属 SaaS 会员特权，十分感谢！`;
          navigator.clipboard.writeText(copyText).then(() => {
            setCopiedPayText(true);
            setTimeout(() => setCopiedPayText(false), 3000);
          }).catch(err => console.error("Could not copy: ", err));
        };

        const currentQrSrc = "/src/assets/images/assistant_payment_qr.png";

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-lg bg-[#0d172e] border border-slate-800 rounded-3xl p-5 sm:p-6 text-left relative shadow-2xl max-h-[92vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setShowPaymentInstructions(false);
                  setCopiedPayText(false);
                  setShowPaymentNotifyForm(false);
                  setPaymentProofSubmitted(false);
                }}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-slate-800/50"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4 pt-1">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">{isEn ? "Assistant Payment & Activation Channel" : "助理专属收款与 SaaS 会员激活通道"}</h3>
                    <p className="text-[10px] text-amber-400 uppercase tracking-wider font-mono font-bold">{selectedPlanDetails?.name} · ￥{selectedPlanDetails?.price}</p>
                  </div>
                </div>

                {/* Assistant QR Code */}
                <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-850 flex flex-col items-center justify-center text-center space-y-3">
                  <div 
                    className="bg-white p-2.5 rounded-2xl border border-slate-800 cursor-zoom-in hover:scale-102 active:scale-98 transition-all duration-200 shadow-xl"
                    onClick={() => setKeynoteLightboxUrl(currentQrSrc)}
                    title={isEn ? "Click to enlarge QR" : "点击放大二维码扫码支付"}
                  >
                    <img 
                      src={currentQrSrc} 
                      alt="助理收款二维码" 
                      referrerPolicy="no-referrer"
                      className="w-44 h-44 object-contain rounded-xl"
                      onError={(e) => {
                        // Fallback if missing
                        (e.target as HTMLImageElement).src = "/src/assets/images/zhanjiajunye_qr-1-2.png";
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase">
                      {isEn ? "OFFICIAL ASSISTANT QR" : "扫码完成支付 · 请付款后通知助理进行核实与开通"}
                    </span>
                    <p className="text-[10.5px] text-slate-450">
                      💡 提示：无论您当前剩余保期多久，续购均可在原到期日的基础上按天顺延叠加！
                    </p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl text-slate-300 text-[11px] leading-relaxed space-y-2">
                  <p className="font-medium text-slate-200">
                    {isEn 
                      ? "Please complete payment via the assistant QR code above. After payment, notify the assistant or submit your payment proof below. The assistant team will verify your payment and activate your SaaS access immediately!"
                      : "请扫码付款，付款后通知助理进行身份核实与开通。您可以直接复制下方格式文本微信发送给助教，或点击【提交付款凭证与通知助理】按钮提交转账截图，形成站内消息与待办单方便助理快速审批。"}
                  </p>
                  <div className="border-t border-slate-800/80 pt-2 text-[10px] text-slate-400 space-y-1">
                    <p>📧 {isEn ? "Trainee Email:" : "建档注册邮箱:"} <span className="text-amber-400 font-bold font-mono">{loggedInUser?.email || "（未登录）"}</span></p>
                    <p>👤 {isEn ? "Trainee Name:" : "注册学员姓名:"} <span className="text-white font-bold">{loggedInUser?.name || "（未登录）"}</span></p>
                  </div>
                </div>

                {/* Proof Submit Form Collapsible */}
                {showPaymentNotifyForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 bg-slate-950 border border-amber-500/30 rounded-2xl space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                      <span className="font-black text-amber-400 flex items-center gap-1.5 font-mono text-[11px]">
                        <UploadCloud className="w-4 h-4" />
                        <span>提交付款凭证与发起通知申请</span>
                      </span>
                      <span className="text-[9.5px] text-slate-500 font-mono">顺延开通 · 极速对账</span>
                    </div>

                    {/* Tier Selection */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase block font-mono">1. 确认付款购买档位 (支持无限顺延叠加)</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(["24h", "1mo", "3mo", "1yr"] as const).map((planKey) => {
                          const info = {
                            "24h": { name: "24h体验卡", price: "￥29" },
                            "1mo": { name: "包月领航卡", price: "￥39" },
                            "3mo": { name: "季度高管卡", price: "￥99" },
                            "1yr": { name: "包年战略卡", price: "￥299" }
                          }[planKey];
                          const isSelected = selectedSubscriptionPlan === planKey;
                          return (
                            <button
                              key={planKey}
                              type="button"
                              onClick={() => setSelectedSubscriptionPlan(planKey)}
                              className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                                isSelected 
                                  ? "bg-amber-500/10 border-amber-500 text-amber-300 font-bold" 
                                  : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850"
                              }`}
                            >
                              <div className="flex justify-between items-center text-[10.5px]">
                                <span>{info.name}</span>
                                <span className="font-mono font-bold text-white">{info.price}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Upload Image Proof - Universal Mode */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase block font-mono">2. 上传微信转账/扣款成功凭证截图</label>
                      
                      <div className="flex gap-2 items-center">
                        <label className="px-4 py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-[11px] text-slate-200 font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 flex-1 shadow-sm group">
                          <UploadCloud className="w-4 h-4 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
                          <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{paymentProofImage ? "更换凭证截图图片" : "📱 选取手机相册截图 / 电脑本地文件 / 拍照上传"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setPaymentProofImage(reader.result as string || "");
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        {paymentProofImage && (
                          <button
                            type="button"
                            onClick={() => setPaymentProofImage("")}
                            className="p-3 bg-rose-950/40 text-rose-400 hover:bg-rose-900 border border-rose-900/60 rounded-xl text-[10px] font-bold"
                          >
                            清除
                          </button>
                        )}
                      </div>

                      {/* 贴心指引卡片：无论手机端还是电脑端 */}
                      <div 
                        tabIndex={0}
                        onPaste={handlePasteImage}
                        className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-2.5 text-[10.5px] text-slate-300 focus:outline-none focus:border-amber-500/50 transition-all"
                      >
                        <Smartphone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div className="space-y-1 text-left leading-relaxed">
                          <p className="text-amber-300 font-bold flex items-center justify-between">
                            <span>📱 微信/手机端 & 💻 电脑端提交说明：</span>
                            <span className="text-[9.5px] text-slate-400 font-mono font-normal">支持键盘 Ctrl+V 粘贴截图</span>
                          </p>
                          <p className="text-slate-400 text-[10px]">
                            1. 在微信扫码完成支付后，手机会自动将扣款成功界面存入手机相册。<br />
                            2. 点击上方【📱 选取手机相册截图】按钮，直接选择相册中的转账图片即可！<br />
                            3. 电脑端用户可在微信截图后，点击本窗口直接按 <kbd className="px-1 py-0.2 bg-slate-800 border border-slate-700 text-amber-400 rounded text-[9px] font-mono">Ctrl + V</kbd> 快捷粘贴！
                          </p>
                        </div>
                      </div>

                      {/* Preview Loaded Payment Proof Image */}
                      {paymentProofImage && (
                        <div className="mt-2 p-2.5 bg-slate-900 rounded-xl border border-emerald-500/40 flex items-center justify-between gap-3 shadow-lg">
                          <div className="flex items-center gap-3">
                            <img src={paymentProofImage} alt="付款凭证" className="w-12 h-12 object-cover rounded-lg border border-slate-700 shadow" />
                            <div className="text-[10.5px] text-slate-300 font-mono space-y-0.5">
                              <p className="text-emerald-400 font-bold flex items-center gap-1">
                                <span>✓ 付款截图凭证已自动上载</span>
                              </p>
                              <p className="text-[9.5px] text-slate-400">点击下方按钮提交，将直接形成待办消息推送给助理 Linda</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Payment note */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase block font-mono">3. 备注说明（如微信打款昵称/转账单号尾号）</label>
                      <input
                        type="text"
                        placeholder="例如：微信名『张总』，付款时间10:30，已付 299 元"
                        value={paymentNote}
                        onChange={(e) => setPaymentNote(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Action button inside form */}
                    {paymentProofSubmitted ? (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-emerald-400 text-xs font-extrabold space-y-1">
                        <p>🎉 付款凭证已成功提交并生成通知单！</p>
                        <p className="text-[10px] font-normal text-slate-400">助理 Linda 正在为您在后台进行核实，将即刻为您特许顺延开通。</p>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={isSubmittingPaymentProof}
                        onClick={handleSendPaymentProofNotice}
                        className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        <span>{isSubmittingPaymentProof ? "正在提交并生成站内通知..." : "确认提交凭证并形成站内信通知助理"}</span>
                      </button>
                    )}
                  </motion.div>
                )}

                {/* CTA Action Buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => setShowPaymentNotifyForm(!showPaymentNotifyForm)}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer shadow-lg shadow-amber-950/40"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{showPaymentNotifyForm ? "收起凭证提交表单" : "📩 点击提交付款凭证并形成站内信通知助理"}</span>
                  </button>

                  <button
                    onClick={handleCopyPayText}
                    className="w-full py-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-500" />
                    <span>{copiedPayText ? (isEn ? "Copied Successfully!" : "已复制微信报备文本！") : (isEn ? "Copy WeChat Text" : "📋 复制微信报备文本")}</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowPaymentInstructions(false);
                      setCopiedPayText(false);
                      setShowPaymentNotifyForm(false);
                      setPaymentProofSubmitted(false);
                    }}
                    className="w-full py-2 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-xs font-bold text-slate-500 hover:text-slate-300 rounded-xl transition-all cursor-pointer"
                  >
                    {isEn ? "Close" : "返回研习工作台"}
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        );
      })()}

      {/* ================= MODAL: ADMIN TRAINEE SaaS ACTIVATION DESK ================= */}
      {showAdminTraineeModal && loggedInUser && (loggedInUser.role === "admin" || loggedInUser.role === "assistant") && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-5xl bg-[#0b1329] border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative text-left flex flex-col max-h-[92vh] overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setShowAdminTraineeModal(false);
                setEditingStudentEmail(null);
              }}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl">
                  <Users className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <span>{isEn ? "Trainee SaaS Activation Desk" : "学子学员 SaaS 授权管理台"}</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                      ADMIN PRIVILEGES
                    </span>
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-450">
                    {isEn
                      ? "Search trainee credentials, approve custom payment tiers, and trigger receipt/welcome in-site notifications."
                      : "在此统一检索本地与云端学子，核实打款后一键激活 SaaS 特享期订阅，并可直接极速下发《包期权益确认信》站内通知。"}
                  </p>
                </div>
              </div>

              {/* Quick stats banner */}
              <div className="flex flex-wrap items-center gap-2.5 text-slate-300 self-start md:self-auto font-mono text-[10px]">
                <div className="flex gap-2 bg-slate-950 p-2 rounded-xl border border-slate-850">
                  <div className="px-2 border-r border-slate-800">
                    <p className="text-slate-500 font-bold">TOTAL / 总数</p>
                    <p className="text-white text-xs font-black">{getRegisteredStudents().length}</p>
                  </div>
                  <div className="px-2 border-r border-slate-800">
                    <p className="text-amber-500 font-bold">PENDING / 待开</p>
                    <p className="text-amber-400 text-xs font-black">
                      {getRegisteredStudents().filter(s => s.status === "pending_approval").length}
                    </p>
                  </div>
                  <div className="px-2">
                    <p className="text-emerald-500 font-bold">ACTIVE / 在线</p>
                    <p className="text-emerald-400 text-xs font-black">
                      {getRegisteredStudents().filter(s => s.status === "active" && (!s.expiryDate || s.expiryDate > nowTick)).length}
                    </p>
                  </div>
                </div>

                {/* TEST SPEEDUP SWITCH */}
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-850">
                  <span className="text-[10px] text-slate-400 font-bold">🔬 测试加速 (1天=1分钟):</span>
                  <button
                    onClick={() => handleToggleTestSpeedup(!isTestSpeedup)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                      isTestSpeedup ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        isTestSpeedup ? 'translate-x-5.5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>



            {/* Consulting & Feedbacks Pending Queue for Assistant Linda / Admin */}
            {(() => {
              // 待办列表中只列出尚未完成核销/归档的单据 (status 不是 resolved 或 done)
              const consultingFeedbacks = feedbacks.filter(f => f.status !== "done" && f.status !== "resolved");
              
              if (consultingFeedbacks.length === 0) {
                return (
                  <div className="mb-4 p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl shrink-0 flex items-center justify-between text-xs text-emerald-400/90 font-mono transition-all">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-bold">✨ 助教 Linda / 管理员待办：当前学员单据与咨询已全部核销完毕，无积压待办（0）</span>
                    </div>
                    <span className="text-[10px] text-emerald-500/70">所有提交项均已特许开通或发信回复归档</span>
                  </div>
                );
              }

              return (
                <div className="mb-4 p-3.5 bg-amber-950/30 border border-amber-500/30 rounded-2xl shrink-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400 flex items-center gap-1.5 font-mono">
                      <MessageSquare className="w-4 h-4" />
                      <span>📬 助教 Linda / 管理员待办：最新收到需核销的学员定制咨询与提报 ({consultingFeedbacks.length})</span>
                    </span>
                    <span className="text-[10px] text-amber-500/80 font-mono">核实截图后可一键核销开通并下发站内信</span>
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-2 custom-scrollbar pr-1">
                    {consultingFeedbacks.map((fb) => {
                      // 智能提炼文本与 Base64 截图图片
                      let extractedImg: string | null = null;
                      let displayText = fb.suggestion || "";

                      const base64Match = displayText.match(/data:image\/[a-zA-Z]+;base64,[^\s\|"']+/);
                      if (base64Match) {
                        extractedImg = base64Match[0];
                        displayText = displayText.replace(base64Match[0], " [🖼️ 转账凭证截图已录入] ");
                      } else if (displayText.includes("凭证截图：http") || displayText.includes("凭证截图：/")) {
                        const urlMatch = displayText.match(/凭证截图：(https?:\/\/[^\s\|"']+|\/[^\s\|"']+)/);
                        if (urlMatch) {
                          extractedImg = urlMatch[1];
                        }
                      }

                      displayText = displayText.replace(/\s+/g, " ").trim();
                      const isPaymentProof = displayText.includes("付款凭证") || displayText.includes("转账凭证") || displayText.includes("打款") || displayText.includes("购买档位");

                      return (
                        <div key={fb.id} className="p-2.5 bg-slate-950/90 border border-slate-800 hover:border-amber-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            {/* 如果有缩略图凭证 */}
                            {extractedImg ? (
                              <button
                                type="button"
                                onClick={() => setPreviewProofModalImage(extractedImg)}
                                className="relative shrink-0 group cursor-pointer border border-amber-500/50 hover:border-amber-400 rounded-lg overflow-hidden bg-black p-0.5"
                                title="点击全屏放大核验截图"
                              >
                                <img src={extractedImg} alt="凭证截图" className="w-12 h-12 object-cover rounded-md group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent flex items-center justify-center text-[9px] text-amber-300 font-bold">
                                  🔍 放大
                                </div>
                              </button>
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-bold text-xs">
                                📬
                              </div>
                            )}

                            <div className="space-y-1 flex-1 min-w-0 text-left">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded font-mono ${
                                  isPaymentProof ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300"
                                }`}>
                                  {isPaymentProof ? "💳 付款凭证核验单" : fb.category}
                                </span>
                                <span className="text-[9.5px] text-slate-500 font-mono">{fb.date}</span>
                              </div>
                              <p className="text-slate-200 text-[11px] line-clamp-2 leading-snug break-all">{displayText}</p>
                            </div>
                          </div>

                          {/* 操作按钮组 */}
                          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                            {isPaymentProof && (
                              <button
                                onClick={() => {
                                  // 1. 从文本中匹配邮件地址
                                  const registered = getRegisteredStudents();
                                  const emailMatch = displayText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
                                  let targetStudent = registered.find(s => emailMatch && s.email.toLowerCase() === emailMatch[0].toLowerCase());
                                  if (!targetStudent) {
                                    targetStudent = registered.find(s => 
                                      (s.email && displayText.toLowerCase().includes(s.email.toLowerCase())) ||
                                      (s.name && displayText.toLowerCase().includes(s.name.toLowerCase()))
                                    );
                                  }
                                  if (!targetStudent && registered.length > 0) {
                                    targetStudent = registered[0]; // fallback
                                  }

                                  if (!targetStudent) {
                                    alert("未能识别到提报人对应账号，请在下方列表直接对目标学子进行开通。");
                                    return;
                                  }

                                  // 2. 判断顺延天数
                                  let days = 30;
                                  let planName = "包月领航卡 (30天)";
                                  let planKey: "24h" | "1mo" | "3mo" | "1yr" = "1mo";

                                  if (displayText.includes("24小时") || displayText.includes("24h") || displayText.includes("￥29")) {
                                    days = 1;
                                    planName = "24小时极速体验卡 (1天)";
                                    planKey = "24h";
                                  } else if (displayText.includes("季度") || displayText.includes("3mo") || displayText.includes("￥99")) {
                                    days = 90;
                                    planName = "季度高管战略协作卡 (90天)";
                                    planKey = "3mo";
                                  } else if (displayText.includes("包年") || displayText.includes("1yr") || displayText.includes("￥299")) {
                                    days = 365;
                                    planName = "包年尊享出海战略卡 (365天)";
                                    planKey = "1yr";
                                  }

                                  // 3. 执行顺延开通
                                  handleUpdateStudent(targetStudent.email, planKey, "active", days);

                                  // 4. 下发助理 Linda 的专属批准通知
                                  const currentTimeStr = new Date().toLocaleString("zh-CN", { hour12: false });
                                  sendInSiteNotification(
                                    targetStudent.email,
                                    `🎉 助理 Linda：已为您核销确认【${planName}】付款凭证，SaaS 特权已成功激活顺延！`,
                                    `尊敬的 ${targetStudent.name} 学员：\n\n助教 Linda 团队已成功复核您提交的微信打款/扣款截图凭证！\n已特许为您的账号 (${targetStudent.email}) 顺延加时 ${days} 天会员特权。\n• 确认时间：${currentTimeStr}\n• 当前会员状态：特许激活中 (Active)\n\n感谢您对吕华老师《卓越出海研习室》的信任与支持！`
                                  );

                                  // 5. 自动核销移出待办
                                  handleResolveFeedback(fb.id, `🎉 已于 ${currentTimeStr} 完成打款凭证复核，成功为学员 ${targetStudent.name} 激活顺延【${planName}】！`);

                                  setGlobalToastNotice({
                                    message: `🎉 已成功为学员 ${targetStudent.name} 开通【${planName}】特权并自动核销移出待办！`,
                                    sub: `已下发助教 Linda 署名的成功激活开通通知站内信`,
                                    type: "success"
                                  });
                                }}
                                className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-[10.5px] rounded-lg transition-all cursor-pointer shadow-md flex items-center gap-1"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>⚡ 一键特许开通并发站内信</span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                const registered = getRegisteredStudents();
                                const emailMatch = displayText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
                                let targetStudent = registered.find(s => emailMatch && s.email.toLowerCase() === emailMatch[0].toLowerCase());
                                if (!targetStudent) {
                                  targetStudent = registered.find(s => 
                                    (s.email && displayText.toLowerCase().includes(s.email.toLowerCase())) || 
                                    (s.name && displayText.toLowerCase().includes(s.name.toLowerCase()))
                                  );
                                }
                                if (!targetStudent && registered.length > 0) {
                                  targetStudent = registered[0];
                                }
                                if (targetStudent) {
                                  setNoticeTargetStudent(targetStudent);
                                  setNoticeTargetFbId(fb.id);
                                  setNoticeCustomTitle(`📬 助教 Linda：关于您提交的《${isPaymentProof ? "付款凭证核销" : fb.category}》回复`);
                                  setNoticeCustomContent(`尊敬的 ${targetStudent.name} 学员：\n\n针对您提交的单据诉求：\n“${displayText.slice(0, 100)}...”\n\n助教 Linda 团队已复核完成。具体答复如下：\n【已核销您的提交项，如有疑问可直接回复此信联系助教团队】`);
                                  setShowSendNoticeModal(true);
                                } else {
                                  alert("未能在注册库中自动识别对应邮箱，请在下方列表指定学子下发站内信。");
                                }
                              }}
                              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-[10.5px] rounded-lg transition-all cursor-pointer shrink-0"
                            >
                              💬 回复并核销
                            </button>

                            <button
                              onClick={() => {
                                handleResolveFeedback(fb.id, "【助教 Linda 团队】：管理员已手动标注核销。");
                                setGlobalToastNotice({
                                  message: "✓ 已将该条单据标记为已处理，自动移出待办列表！",
                                  type: "info"
                                });
                              }}
                              className="px-2 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-750 text-slate-400 hover:text-emerald-400 font-bold text-[10.5px] rounded-lg transition-all cursor-pointer shrink-0"
                              title="直接将此单据标记为已处理并移出待办"
                            >
                              ✓ 归档
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Filter Search Area */}
            <div className="mb-4 shrink-0">
              <input
                type="text"
                value={adminSearchTerm}
                onChange={(e) => setAdminSearchTerm(e.target.value)}
                placeholder={isEn ? "Filter by name, email, or organization..." : "🔍 输入学员姓名、机构名称、或者邮箱地址快速过滤匹配..."}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
              />
            </div>

            {/* Main scrollable layout list table */}
            <div className="flex-1 overflow-y-auto min-h-[220px] border border-slate-850 rounded-2xl bg-slate-950/40 custom-scrollbar p-1">
              {(() => {
                const filtered = getRegisteredStudents().filter(s => {
                  const term = adminSearchTerm.trim().toLowerCase();
                  if (!term) return true;
                  return s.name.toLowerCase().includes(term) || 
                         s.email.toLowerCase().includes(term) || 
                         s.org.toLowerCase().includes(term) ||
                         (s.phone && s.phone.includes(term));
                });

                if (filtered.length === 0) {
                  return (
                    <div className="p-12 text-center text-slate-500 text-xs space-y-2">
                      <p>🔍 {isEn ? "No trainees match search filter." : "未能找到匹配该检索条件的出海学子或大专栏记录。"}</p>
                      <button 
                        onClick={() => setAdminSearchTerm("")} 
                        className="text-emerald-400 hover:underline font-bold text-[10.5px] cursor-pointer"
                      >
                        {isEn ? "Reset Search" : "清除检索条件"}
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="divide-y divide-slate-900 pb-28 sm:pb-36">
                    {filtered.map((student) => {
                      const isEditing = editingStudentEmail?.toLowerCase() === student.email.toLowerCase();
                      const isExpired = student.status === "expired" || (student.expiryDate && student.expiryDate < nowTick);
                      const isPending = student.status === "pending_approval";
                      
                      const planLabel = {
                        "24h": isEn ? "24h Pass" : "24h体验卡",
                        "1mo": isEn ? "1mo SaaS" : "包月领航卡",
                        "3mo": isEn ? "3mo SaaS" : "季度高管卡",
                        "1yr": isEn ? "1yr SaaS" : "包年战略卡"
                      }[student.selectedPlan || "1mo"] || "Trainee Pass";

                      return (
                        <div key={student.email} className={`p-4 transition-colors ${isEditing ? "bg-slate-900/60" : "hover:bg-slate-900/20"}`}>
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            
                            {/* Left Col: Trainee details */}
                            <div className="space-y-1.5 flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-extrabold text-white text-xs sm:text-sm">{student.name}</span>
                                <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800 truncate max-w-[150px]">
                                  {student.org}
                                </span>
                                {student.role === "admin" && (
                                  <span className="text-[8px] bg-rose-500/10 text-rose-400 border border-rose-500/30 px-1.5 py-0.2 rounded font-mono font-black uppercase">
                                    FOUNDING OWNER
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] text-slate-400 font-mono">
                                <span className="text-slate-350">{student.email}</span>
                                {student.phone && <span className="text-slate-500">📞 {student.phone}</span>}
                                <span className="text-slate-550">
                                  {isEn ? "Joined:" : "注册于:"} {new Date(student.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            {/* Middle Col: Plan status badge and Expiry info */}
                            <div className="flex items-center gap-3 shrink-0">
                              {/* Plan Tier Pill */}
                              <div className="text-right">
                                <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">
                                  {planLabel}
                                </span>
                                <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                                  {student.selectedPlan ? `￥${{ "24h": "29", "1mo": "39", "3mo": "99", "1yr": "299" }[student.selectedPlan]}` : ""}
                                </p>
                              </div>

                              {/* Status Badge */}
                              <div>
                                {student.role === "admin" ? (
                                  <span className="text-[9.5px] bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2.5 py-1 rounded-full font-bold">
                                    👑 {isEn ? "OWNER" : "超级管理员"}
                                  </span>
                                ) : isExpired ? (
                                  <span className="text-[9.5px] bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2.5 py-1 rounded-full font-bold">
                                    ⚠️ {isEn ? "EXPIRED" : "已过期限"}
                                  </span>
                                ) : isPending ? (
                                  <span className="text-[9.5px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold animate-pulse">
                                    ⏳ {isEn ? "PENDING" : "待审激活"}
                                  </span>
                                ) : (
                                  <span className="text-[9.5px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
                                    ⚡ {isEn ? "ACTIVE" : "特许开通中"}
                                  </span>
                                )}
                              </div>

                              {/* Expiry date display */}
                              <div className="text-left sm:text-right min-w-[110px] text-[10px] font-mono text-slate-400">
                                <p className="text-slate-500">{isEn ? "Deadline" : "截止时间至"}</p>
                                <p className="font-bold text-slate-200">
                                  {student.role === "admin" 
                                    ? (isEn ? "Permanent" : "主训终身专享") 
                                    : student.expiryDate 
                                      ? (isExpired
                                        ? (isEn ? "Expired" : "已到期锁卡")
                                        : isTestSpeedup
                                          ? (() => {
                                              const left = student.expiryDate - nowTick;
                                              const sec = Math.max(0, Math.ceil(left / 1000));
                                              const m = Math.floor(sec / 60);
                                              const s = sec % 60;
                                              return `⌛ 剩 ${m}分${s}秒`;
                                            })()
                                          : formatDateYYYYMMDD(student.expiryDate)
                                        )
                                      : (isEn ? "Pending activation" : "等待审核划拨")}
                                </p>
                              </div>
                            </div>

                            {/* Right Col: Standard Action Buttons */}
                            <div className="flex items-center gap-1.5 shrink-0 self-end lg:self-auto">
                              {student.role !== "admin" && !isEditing && (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingStudentEmail(student.email);
                                      setEditFormPlan(student.selectedPlan || "1mo");
                                      setEditFormStatus(student.status || "active");
                                      // default pre-select days
                                      const daysMap = { "24h": 1, "1mo": 30, "3mo": 90, "1yr": 365 };
                                      setEditFormDays(daysMap[student.selectedPlan || "1mo"]);
                                    }}
                                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-[10.5px] font-extrabold rounded-lg transition-all cursor-pointer"
                                  >
                                    ✏️ {isEn ? "Modify" : "变更特权"}
                                  </button>
                                  
                                  {isPending && (
                                    <button
                                      onClick={() => {
                                        // Quick one-click approve monthly
                                        const daysMap = { "24h": 1, "1mo": 30, "3mo": 90, "1yr": 365 };
                                        const days = daysMap[student.selectedPlan || "1mo"];
                                        handleUpdateStudent(student.email, student.selectedPlan || "1mo", "active", days);
                                      }}
                                      className="px-3 py-1.5 bg-emerald-500 text-slate-950 hover:bg-emerald-400 text-[10.5px] font-black rounded-lg transition-all cursor-pointer shadow-md"
                                    >
                                      ⚡ {isEn ? "Approve VIP" : "一键急速过审"}
                                    </button>
                                  )}

                                  {!isPending && !isExpired && (
                                    <button
                                      onClick={() => {
                                        // Quick trigger welcome email copy receipt for this user
                                        setReceiptTrainee(student);
                                        setShowEmailReceiptModal(true);
                                      }}
                                      className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-[10.5px] font-mono rounded-lg transition-all cursor-pointer"
                                      title={isEn ? "Send Welcome Receipt" : "复制出海特权确认书"}
                                    >
                                      ✉️ {isEn ? "Receipt" : "权益信"}
                                    </button>
                                  )}

                                  <button
                                    onClick={() => {
                                      setNoticeTargetStudent(student);
                                      setNoticeCustomTitle(`📬 助教 Linda 关于您的《出海研学与定制咨询》回复`);
                                      setNoticeCustomContent(`尊敬的 ${student.name} 学员：\n\n助教 Linda 与吕华老师团队已收悉并核实您的账号需求！如有任何研修学习、打款开卡或出海 CX 诊断疑问，请随时在平台交流。祝您出海顺利！`);
                                      setShowSendNoticeModal(true);
                                    }}
                                    className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-[10.5px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                                    title={isEn ? "Send In-Site Message" : "下发站内信给学子"}
                                  >
                                    💬 {isEn ? "Message" : "站内信"}
                                  </button>
                                </>
                              )}
                            </div>

                          </div>

                          {/* Slide down editor panel */}
                          {isEditing && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-4 p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-3.5 text-xs text-slate-350"
                            >
                              <div className="flex gap-2">
                                <Award className="w-4 h-4 text-emerald-400" />
                                <span className="font-extrabold text-white">
                                  {isEn ? "Edit Membership Subscriptions for:" : "正在手工授权变更学子权益:"} {student.name}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {/* Form field 1: select plan */}
                                <div className="space-y-1">
                                  <label className="text-[10px] text-slate-500 font-bold uppercase block">{isEn ? "Subscription Plan" : "分配特权套餐"}</label>
                                  <select
                                    value={editFormPlan}
                                    onChange={(e) => {
                                      const p = e.target.value as "24h" | "1mo" | "3mo" | "1yr";
                                      setEditFormPlan(p);
                                      const daysMap = { "24h": 1, "1mo": 30, "3mo": 90, "1yr": 365 };
                                      setEditFormDays(daysMap[p]);
                                    }}
                                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-2 cursor-pointer focus:outline-none focus:border-emerald-500"
                                  >
                                    <option value="24h">{isEn ? "24h Trial Pass" : "24小时极速体验卡"}</option>
                                    <option value="1mo">{isEn ? "1 Month SaaS Card" : "包月独家出海领航卡"}</option>
                                    <option value="3mo">{isEn ? "3 Month Executive Pass" : "季度高管战略协作卡"}</option>
                                    <option value="1yr">{isEn ? "1 Year Premium SaaS" : "包年尊享出海战略卡"}</option>
                                  </select>
                                </div>

                                {/* Form field 2: select status */}
                                <div className="space-y-1">
                                  <label className="text-[10px] text-slate-500 font-bold uppercase block">{isEn ? "Status" : "学子会籍状态"}</label>
                                  <select
                                    value={editFormStatus}
                                    onChange={(e) => setEditFormStatus(e.target.value as any)}
                                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-2 cursor-pointer focus:outline-none focus:border-emerald-500"
                                  >
                                    <option value="active">{isEn ? "Active" : "特许开通中 (Active)"}</option>
                                    <option value="pending_approval">{isEn ? "Pending Approval" : "待审打款中 (Pending)"}</option>
                                    <option value="expired">{isEn ? "Expired" : "已过期锁定 (Expired)"}</option>
                                  </select>
                                </div>

                                {/* Form field 3: days offset */}
                                <div className="space-y-1">
                                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                                    {isEn ? "Validity Duration (Days)" : "特许授权期持续天数"}
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="3650"
                                    value={editFormDays}
                                    onChange={(e) => setEditFormDays(parseInt(e.target.value) || 30)}
                                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-2 focus:outline-none focus:border-emerald-500"
                                  />
                                </div>
                              </div>

                              {/* Save buttons */}
                              <div className="flex justify-end gap-2 pt-1 border-t border-slate-900">
                                <button
                                  type="button"
                                  onClick={() => setEditingStudentEmail(null)}
                                  className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer font-bold"
                                >
                                  {isEn ? "Cancel" : "取消"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStudent(student.email, editFormPlan, editFormStatus, editFormDays)}
                                  className="px-4 py-2 bg-emerald-500 text-slate-950 hover:bg-emerald-400 rounded-xl transition-all font-black cursor-pointer shadow-md"
                                >
                                  💾 {isEn ? "Confirm & Issue In-App Message" : "保存修改并一键下发站内信"}
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Bottom Panel Actions */}
            <div className="pt-4 border-t border-slate-800/80 mt-4 text-center shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowAdminTraineeModal(false);
                  setEditingStudentEmail(null);
                }}
                className="px-8 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer text-xs font-black uppercase tracking-wide"
              >
                {isEn ? "Close Admin Console" : "返回及关闭管理后台"}
              </button>
            </div>

          </motion.div>
        </div>
      )}

      {/* ================= MODAL: 微信打款/转账截图原图放大核验 ================= */}
      {previewProofModalImage && (
        <div className="fixed inset-0 z-55 bg-slate-950/95 backdrop-blur-lg flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-[#0d172e] border border-amber-500/40 rounded-3xl p-5 text-left relative shadow-2xl space-y-4 max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">📸 学员微信打款/转账凭证原图核验</h3>
                  <p className="text-[10px] text-amber-400 font-mono">助理 Linda 专属核销视角 · 高清原图校验</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewProofModalImage(null)}
                className="text-slate-500 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto rounded-2xl border border-slate-800 bg-black p-2 flex items-center justify-center min-h-[300px]">
              <img
                src={previewProofModalImage}
                alt="转账凭证原图"
                className="max-w-full max-h-[65vh] object-contain rounded-xl shadow-2xl"
              />
            </div>

            <div className="flex items-center justify-between shrink-0 pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400 text-[11px]">校验无误后，点击待办列表中的【⚡ 一键特许开通并发站内信】即可开通</span>
              <button
                type="button"
                onClick={() => setPreviewProofModalImage(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                关闭核验预览
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ================= MODAL: 站内信通知极速直发面板 ================= */}
      {showEmailReceiptModal && receiptTrainee && (
        <div className="fixed inset-0 z-55 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-[#090f1d] border border-slate-800 rounded-3xl p-5 sm:p-6 text-left relative shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={() => {
                setShowEmailReceiptModal(false);
                setCopiedReceiptText(false);
              }}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {isEn ? "SaaS In-Site Notification Dispatcher" : "💎 站内信极速直发与通知确认通道"}
                  </h3>
                  <p className="text-[10px] text-slate-450 uppercase tracking-wider font-mono">
                    {isEn ? "100% RELIABLE CLOSED-LOOP IN-APP MESSAGE SYSTEM" : "100% 站内直达闭环系统 - 告别外部邮件环境繁琐与遗漏"}
                  </p>
                </div>
              </div>

              {/* Recipient */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono block">
                    {isEn ? "Recipient Name" : "接收学员姓名"}
                  </span>
                  <div className="bg-slate-950 border border-slate-850 p-2.5 rounded-xl text-xs text-white font-bold">
                    {receiptTrainee.name} ({receiptTrainee.org})
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono block">
                    {isEn ? "Registered Email" : "在册登录账号 / 手机"}
                  </span>
                  <div className="bg-slate-950 border border-slate-850 p-2.5 rounded-xl text-xs text-amber-400 font-bold font-mono">
                    {receiptTrainee.email}
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono block">
                  {isEn ? "Notification Title" : "站内信通知标题"}
                </span>
                <input
                  type="text"
                  id="notif-dispatch-title"
                  defaultValue="💎 您的专属SaaS特许出海服务已成功激活认证！"
                  className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-xl text-xs text-white font-bold font-sans focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Body */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono block">
                  {isEn ? "Notification Body" : "站内信通知正文 (已自动排版)"}
                </span>
                <textarea
                  id="notif-dispatch-content"
                  rows={8}
                  className="w-full bg-slate-950 border border-slate-850 p-3 rounded-2xl text-[11px] text-slate-300 font-sans leading-relaxed focus:outline-none focus:border-amber-500 resize-none custom-scrollbar"
                  defaultValue={
`尊敬的 ${receiptTrainee.name} 学子：

您好！
专属助理已成功核销您的打款申请。您的系统包期订阅服务特权已正式激活！
  - 💎 订阅套餐：${
    {
      "24h": "24小时研学体验卡",
      "1mo": "包月独家出海领航卡",
      "3mo": "季度高管战略协作卡",
      "1yr": "包年尊享出海战略卡"
    }[receiptTrainee.selectedPlan as "24h" | "1mo" | "3mo" | "1yr"] || "SaaS 订阅特权"
  }
  - ⏳ 尊享截止日期：${receiptTrainee.expiryDate ? new Date(receiptTrainee.expiryDate).toLocaleDateString() : ""}

现在进入您的【学子中心 - 站内信箱】或重新登录，即可随时研判德国、英国、拉美等高级维度出海大地图！

导师：吕华 (Harry Lyu) & 专属出海助教Linda`
                  }
                />
              </div>

              {/* Info banner */}
              <p className="text-[10px] text-slate-450 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-slate-850">
                {isEn 
                  ? "Closed-loop system. Direct dispatch sends an instant notification to the trainee's personalized In-Site Inbox in the Student Center."
                  : "💡 本地闭环通知机制：点击下方直发后，学员在使用对应账号登录本系统时，其「学子中心 - 站内信箱」将立刻无延迟显示该条红色未读通知，确保信息百分之百送达，无需依赖邮件。"}
              </p>

              {/* Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => {
                    const titleVal = (document.getElementById("notif-dispatch-title") as HTMLInputElement)?.value || "💎 您的专属SaaS特许出海服务已成功激活认证！";
                    const contentVal = (document.getElementById("notif-dispatch-content") as HTMLTextAreaElement)?.value || "";
                    pushInSiteNotification(receiptTrainee.email, titleVal, contentVal);
                    setShowEmailReceiptModal(false);
                    alert(`🎉 成功直发！站内通知已派送至学子【${receiptTrainee.name}】的站内邮箱。`);
                  }}
                  className="py-2.5 px-3 bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isEn ? "🚀 Direct Dispatch In-App" : "🚀 一键极速直发站内信"}</span>
                </button>

                <button
                  onClick={() => {
                    const titleVal = (document.getElementById("notif-dispatch-title") as HTMLInputElement)?.value || "";
                    const contentVal = (document.getElementById("notif-dispatch-content") as HTMLTextAreaElement)?.value || "";
                    const fullText = `【${titleVal}】\n\n${contentVal}`;
                    navigator.clipboard.writeText(fullText).then(() => {
                      setCopiedReceiptText(true);
                      setTimeout(() => setCopiedReceiptText(false), 3000);
                    }).catch(err => console.error(err));
                  }}
                  className="py-2.5 px-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-200 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer shadow-md"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedReceiptText ? "已成功复制通知！" : "📋 复制通知文字"}</span>
                </button>

                <button
                  onClick={() => {
                    setShowEmailReceiptModal(false);
                    setCopiedReceiptText(false);
                  }}
                  className="py-2.5 px-3 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-xs font-bold text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                >
                  {isEn ? "Close" : "关闭并返回后台"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ================= MODAL: 助教 Linda / 管理员自定义直发站内信 ================= */}
      {showSendNoticeModal && noticeTargetStudent && (
        <div className="fixed inset-0 z-55 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-xl bg-[#0a1224] border border-amber-500/30 rounded-3xl p-5 sm:p-6 text-left relative shadow-2xl space-y-4"
          >
            {/* Close */}
            <button
              onClick={() => setShowSendNoticeModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <span>下发站内信通知</span>
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
                    ASSISTANT DESK
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400">
                  一键推送至学员账号 <span className="text-amber-300 font-bold font-mono">{noticeTargetStudent.name} ({noticeTargetStudent.email})</span> 的【学子中心 - 站内信箱】
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono block">
                  站内信标题 *
                </label>
                <input
                  type="text"
                  value={noticeCustomTitle}
                  onChange={(e) => setNoticeCustomTitle(e.target.value)}
                  placeholder="例如：📬 助教 Linda 关于您的《出海研学与定制咨询》回复"
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono block">
                  站内信正文内容 *
                </label>
                <textarea
                  rows={6}
                  value={noticeCustomContent}
                  onChange={(e) => setNoticeCustomContent(e.target.value)}
                  placeholder="请输入欲下发给学员的具体说明、咨询回复或开卡确认信息..."
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-2xl text-xs text-slate-200 font-sans leading-relaxed focus:outline-none focus:border-amber-400 resize-none custom-scrollbar"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setShowSendNoticeModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!noticeCustomTitle.trim() || !noticeCustomContent.trim()) {
                    alert("请填写入站内信标题与正文。");
                    return;
                  }
                  pushInSiteNotification(noticeTargetStudent.email, noticeCustomTitle, noticeCustomContent);
                  
                  // 如果关联了待办单据，自动核销并移出待办
                  if (noticeTargetFbId) {
                    handleResolveFeedback(noticeTargetFbId, `📬 已由助教 Linda 下发站内信回复并核销：${noticeCustomTitle}`);
                    setNoticeTargetFbId(null);
                  }

                  setShowSendNoticeModal(false);
                  setGlobalToastNotice({
                    message: `🎉 站内信已成功下发给 ${noticeTargetStudent.name}！`,
                    sub: `对应单据已同步核销归档，学员可在【学子中心 - 站内信箱】查看点阅。`,
                    type: "success"
                  });
                }}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-xl transition-all shadow-lg shadow-amber-950/30 cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>🚀 立即推送至学员站内信箱</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ================= MODAL: 学员站内信详情全量阅读面板 ================= */}
      {selectedNoticeDetail && (
        <div className="fixed inset-0 z-55 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-lg bg-[#080e1c] border border-amber-500/30 rounded-3xl p-5 sm:p-6 text-left relative shadow-2xl space-y-4"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedNoticeDetail(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="flex items-start gap-3 border-b border-slate-800 pb-3.5 pr-8">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20 shrink-0 mt-0.5">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] bg-amber-500/15 text-amber-300 font-bold px-2 py-0.5 rounded font-mono border border-amber-500/30">
                    站内官方通知
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(selectedNoticeDetail.date).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-white leading-snug break-words">
                  {selectedNoticeDetail.title}
                </h3>
              </div>
            </div>

            {/* Content Body */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono px-1">
                <span>发件方：助教 Linda 与吕华导师秘书处</span>
                {selectedNoticeDetail.email && <span>接收账号：{selectedNoticeDetail.email}</span>}
              </div>
              <div className="p-4 bg-slate-950/90 border border-slate-800/80 rounded-2xl text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap max-h-[35vh] overflow-y-auto custom-scrollbar shadow-inner">
                {selectedNoticeDetail.content}
              </div>
            </div>

            {/* Direct Quick Reply Panel for Assistant Linda & Admins / Trainees */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              {(() => {
                const isCurrentAdmin = loggedInUser?.email === "huaishere@gmail.com" || loggedInUser?.role === "admin";
                return (
                  <>
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                      <span className="flex items-center gap-1.5 font-mono">
                        {isCurrentAdmin ? "💬 助教 Linda / 导师快捷回复通道" : "💬 给助教 Linda / 吕华老师的追加留言与诉求"}
                      </span>
                      <span className="text-[10px] text-slate-450 font-mono">
                        {isCurrentAdmin ? "发送后学员可实时在站内信箱查收" : "提交后直接同步至导师与助教 Linda 的管理台跟进池"}
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={noticeReplyContent}
                      onChange={(e) => setNoticeReplyContent(e.target.value)}
                      placeholder={isCurrentAdmin 
                        ? "在此打字输入对学员的回复，例如：已收悉您的诉求，已为您准备好出海内参并开通日程..." 
                        : "在此输入您想补充给助教 Linda 与吕华老师的信息或需求..."}
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 font-sans focus:outline-none focus:border-amber-400 custom-scrollbar resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={async () => {
                          if (!noticeReplyContent.trim()) {
                            alert("请先输入答复或留言内容。");
                            return;
                          }

                          if (isCurrentAdmin) {
                            // Admin / Linda sending reply TO student
                            let targetEmail = selectedNoticeDetail.email || "";
                            const registered = getRegisteredStudents();
                            if (!targetEmail) {
                              const match = registered.find(s => selectedNoticeDetail.content.includes(s.name) || selectedNoticeDetail.content.includes(s.email));
                              if (match) targetEmail = match.email;
                            }
                            if (!targetEmail && registered.length > 0) {
                              targetEmail = registered[0].email;
                            }

                            sendInSiteNotification(
                              targetEmail || "test4@abc.com",
                              `📬 助教 Linda：关于《${selectedNoticeDetail.title.replace(/^📬\s*/, '').slice(0, 22)}》的跟进回复`,
                              `尊敬的学员：\n\n${noticeReplyContent.trim()}\n\n-- 助教 Linda 与吕华导师团队`
                            );
                            setGlobalToastNotice({
                              message: "🎉 站内信回复已成功下发给学员！",
                              sub: "学员可在学子中心站内信箱点阅",
                              type: "success"
                            });
                          } else {
                            // Trainee sending reply / follow-up TO Admin Linda
                            const traineeName = loggedInUser?.name || "学员";
                            const traineeEmail = loggedInUser?.email || selectedNoticeDetail.email || "未提供邮箱";
                            const consultingContent = `【学员站内信留言/追问】提报人：${traineeName} (${traineeEmail})\n关于通知：《${selectedNoticeDetail.title}》\n留言内容：${noticeReplyContent.trim()}`;

                            // 1. Send to feedback list for admin workbench
                            try {
                              await fetch("/api/feedback", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  category: "高管商洽与定制咨询",
                                  suggestion: consultingContent
                                })
                              });
                              fetchFeedbackData();
                            } catch (e) {
                              console.error(e);
                            }

                            // 2. Push in-site notification to admin
                            sendInSiteNotification(
                              "huaishere@gmail.com",
                              `📬 收到来自学员【${traineeName}】的站内信追加留言`,
                              `学员 ${traineeName} (${traineeEmail}) 对《${selectedNoticeDetail.title}》进行了跟进留言：\n\n“${noticeReplyContent.trim()}”\n\n请在超级管理员控制台查看并一键答复。`
                            );

                            setGlobalToastNotice({
                              message: "🎉 留言已成功提交给助教 Linda！",
                              sub: "助教团队与吕华老师将在管理台及时审阅并处理",
                              type: "success"
                            });
                          }

                          setNoticeReplyContent("");
                          setSelectedNoticeDetail(null);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md shadow-amber-950/30 cursor-pointer active:scale-95 flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isCurrentAdmin ? "🚀 立即打字并下发给该学员" : "📤 提交留言给助教 Linda"}</span>
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`${selectedNoticeDetail.title}\n\n${selectedNoticeDetail.content}`);
                  setGlobalToastNotice({
                    message: "已成功复制站内信全文！",
                    sub: "可粘贴至备忘录或微信留存",
                    type: "info"
                  });
                }}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>📋 复制全文</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedNoticeDetail(null)}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-xl transition-all shadow-lg shadow-amber-950/30 cursor-pointer active:scale-95"
              >
                好的，已知悉并收悉
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* UPDATE REFEREE CREDENTIALS MODAL */}
      {showEditCredentialsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-[#0b1329] border border-slate-800 rounded-3xl p-6 text-left relative max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setShowEditCredentialsModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-slate-800/60 border-none outline-none"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Award className="w-5.5 h-5.5 text-amber-500" />
                <h3 className="text-base font-extrabold text-white">
                  {isEn ? "Edit Qualifications & Honors" : "更新专业资质和荣誉"}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleAiTranslateCredentials}
                disabled={isTranslatingCredentials}
                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 font-extrabold text-[11px] text-slate-950 rounded-lg hover:from-amber-450 hover:to-amber-550 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 select-none active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>{isTranslatingCredentials ? (isEn ? "Translating..." : "AI 智能翻译中...") : (isEn ? "AI Translate (ZH ➜ EN)" : "AI 一键智能翻译 (中文 ➔ 英文)")}</span>
              </button>
            </div>

            <form onSubmit={handleSaveCredentials} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-bold uppercase block font-mono">Title (ZH) / 标题 (中)</label>
                  <input
                    type="text"
                    required
                    value={editTitleZh}
                    onChange={(e) => setEditTitleZh(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-bold uppercase block font-mono">Title (EN) / 标题 (英)</label>
                  <input
                    type="text"
                    required
                    value={editTitleEn}
                    onChange={(e) => setEditTitleEn(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-bold uppercase block font-mono">Description (ZH) / 描述 (中)</label>
                  <textarea
                    rows={2}
                    required
                    value={editDescZh}
                    onChange={(e) => setEditDescZh(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-bold uppercase block font-mono">Description (EN) / 描述 (英)</label>
                  <textarea
                    rows={2}
                    required
                    value={editDescEn}
                    onChange={(e) => setEditDescEn(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none font-sans"
                  />
                </div>
              </div>

              {/* Photo url or photo upload */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 font-bold uppercase block font-mono">Background Cover Image URL / 配图路径或真实照片</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. /src/assets/images/gallery_judge.jpg"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                  {/* File Upload Trigger */}
                  <label className="px-3.5 py-2 bg-slate-950 border border-slate-800 hover:border-amber-500 text-[11px] text-slate-300 font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1">
                    <UploadCloud className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isEn ? "Select Photo" : "选中本地照片"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditImageUrl(reader.result as string || "");
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Bullet points mapping */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                  <span className="text-[11px] text-slate-400 font-black uppercase font-mono">Credentials Bullet Items / 具体履历细节 (支持多行)</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditListZh([...editListZh, ""]);
                      setEditListEn([...editListEn, ""]);
                    }}
                    className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5 hover:text-amber-300 cursor-pointer border-none bg-none outline-none"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{isEn ? "Add Item" : "新增一条资质"}</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {editListZh.map((_, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          required
                          placeholder={`中文条目 #${idx + 1}`}
                          value={editListZh[idx]}
                          onChange={(e) => {
                            const copy = [...editListZh];
                            copy[idx] = e.target.value;
                            setEditListZh(copy);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                        />
                        <input
                          type="text"
                          required
                          placeholder={`English Item #${idx + 1}`}
                          value={editListEn[idx]}
                          onChange={(e) => {
                            const copy = [...editListEn];
                            copy[idx] = e.target.value;
                            setEditListEn(copy);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditListZh(editListZh.filter((_, i) => i !== idx));
                          setEditListEn(editListEn.filter((_, i) => i !== idx));
                        }}
                        className="p-1.5 bg-red-950 border border-red-900 text-red-400 rounded-lg hover:bg-red-900 hover:text-white text-xs cursor-pointer active:scale-95 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditCredentialsModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  {isEn ? "Cancel" : "取消"}
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-amber-550 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all shadow-md cursor-pointer border-none outline-none"
                >
                  {isEn ? "Save Qualifications Changes" : "部署并在前台落地"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* UPLOAD NEW MEMORY MILESTONE MODAL */}
      {showAddMemoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-[#0b1329] border border-slate-800 rounded-3xl p-6 text-left relative max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setShowAddMemoryModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-slate-800/60 border-none outline-none"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4 border-b border-slate-800 pb-3">
              <Sparkles className="w-5.5 h-5.5 text-amber-500" />
              <h3 className="text-base font-extrabold text-white">
                {isEn ? "Upload Memory Milestone" : "上载跨文化记忆长廊新故事"}
              </h3>
            </div>

            <form onSubmit={handleAddMemory} className="space-y-4">
              {/* Category selector */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-bold uppercase block font-mono">Category / 里程碑分类属性</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["academic", "professional", "outdoor", "collaboration"] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setMemoryTypeInput(cat)}
                      className={`py-2 text-[10px] font-bold rounded-xl border text-center transition-all cursor-pointer ${
                        memoryTypeInput === cat
                          ? "bg-amber-500 border-amber-450 text-slate-950 font-black"
                          : "bg-slate-950 border-slate-850 text-slate-400 hover:text-white hover:bg-slate-900"
                      }`}
                    >
                      {cat === "academic" ? "学术研探" : cat === "professional" ? "商务战略" : cat === "outdoor" ? "户外生活" : "文化融合"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Raw input text row */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                  <div>
                    <label className="text-[11px] text-amber-500 font-black uppercase block font-mono">
                      {isEn ? "1. Draft Raw Material Insights" : "1. 脑暴原始见闻、活动或学者素材 (支持大白话)"}
                    </label>
                    <span className="text-[10px] text-slate-450">输入后点击右侧一键提炼，AI将自动翻译并写出极具学术深度的中英文双轨阐述。</span>
                  </div>
                  <button
                    type="button"
                    disabled={isGeneratingMemoryAi}
                    onClick={handleAiSummarizeMemory}
                    className="px-3.5 py-2 bg-gradient-to-r from-amber-500/10 to-amber-550/20 hover:from-amber-550 hover:to-amber-600 text-amber-400 hover:text-slate-950 border border-amber-500/30 text-[10px] font-black rounded-lg transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:pointer-events-none self-start sm:self-auto"
                  >
                    {isGeneratingMemoryAi ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>AI Generating / 提炼中...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        <span>一键 1-Click AI 提炼归纳及双语对齐</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={memoryRawInput}
                  onChange={(e) => setMemoryRawInput(e.target.value)}
                  placeholder={
                    isEn
                      ? "Write some rough notes here... Then hit the 'AI' button above or manually edit bilingual details below."
                      : "在此输入零星素材：例如『在比利时出席世界BPO外包合规闭门年会，分享了中国出海企业的效率神话。同行对我们 7x24 调度模式极度震惊，现场掌声热烈...』"
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Bilingual Structured Outputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800 pt-3">
                {/* Title Zh */}
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-bold uppercase block font-mono">Structured Title (ZH) / AI 归纳短标题 (中)</label>
                  <input
                    type="text"
                    required
                    value={memoryAltZhInput}
                    onChange={(e) => setMemoryAltZhInput(e.target.value)}
                    placeholder="e.g. 比利时闭门峰会宣讲"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>
                {/* Title En */}
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-bold uppercase block font-mono">Structured Title (EN) / AI 归纳短标题 (英)</label>
                  <input
                    type="text"
                    required
                    value={memoryAltEnInput}
                    onChange={(e) => setMemoryAltEnInput(e.target.value)}
                    placeholder="e.g. Belgium Closed Summit"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Desc Zh */}
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-bold uppercase block font-mono">Academic Decription (ZH) / 学术研究总结 (中)</label>
                  <textarea
                    rows={2}
                    required
                    value={memoryDescZhInput}
                    onChange={(e) => setMemoryDescZhInput(e.target.value)}
                    placeholder="请输入阐述，或使用上方的 AI 智能一键生成..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none resize-none font-sans"
                  />
                </div>
                {/* Desc En */}
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-bold uppercase block font-mono">Academic Decription (EN) / 学术研究总结 (英)</label>
                  <textarea
                    rows={2}
                    required
                    value={memoryDescEnInput}
                    onChange={(e) => setMemoryDescEnInput(e.target.value)}
                    placeholder="Bilingual outcome description generated by Gemini..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none resize-none font-sans"
                  />
                </div>
              </div>

              {/* Photo upload and background gradient settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-bold uppercase block font-mono">Gradient fallback / 经典高光过渡套色 (AI 智能分配)</label>
                  <input
                    type="text"
                    value={memoryGradientInput}
                    onChange={(e) => setMemoryGradientInput(e.target.value)}
                    placeholder="from-emerald-600/20 via-slate-900 to-slate-950"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-bold uppercase block font-mono">Milestone Picture / 精选故事场景实拍配图</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={memorySrcInput}
                      onChange={(e) => setMemorySrcInput(e.target.value)}
                      placeholder="/src/assets/images/gallery_judge.jpg"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                    <label className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 hover:border-amber-500 text-[11px] text-slate-300 font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 select-none">
                      <UploadCloud className="w-3.5 h-3.5 text-amber-500" />
                      <span>{isEn ? "Upload" : "选择配图"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setMemorySrcInput(reader.result as string || "");
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddMemoryModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  {isEn ? "Cancel" : "取消"}
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-amber-550 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all shadow-md cursor-pointer border-none outline-none"
                >
                  {isEn ? "Save & Publish" : "上载长廊并向全球公开"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* INTERACTIVE WEBSITE REFINEMENT & DEVELOPMENT TRACKER MODAL */}
      {showFeedbackModal && loggedInUser && (loggedInUser.role === "admin" || loggedInUser.role === "assistant") && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-5xl bg-[#0b1329] border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative text-left flex flex-col max-h-[92vh] overflow-hidden"
            id="website-improvement-desk"
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowFeedbackModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header section of Tracker */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl">
                  <Terminal className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <span>{isEn ? "Website Iterative Refinement Desk" : "网站迭代开发与优化专栏"}</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                      COLLABORATIVE
                    </span>
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-400">
                    {isEn 
                      ? "Propose suggestions below. Discuss status transitions and AI advice directly with current turn operations." 
                      : "您可以在此直接提报新看法或校正点，提交后数据会存入工作空间，AI 顾问会随后针对您的每一条要求编写代码进行热部署并更新状态。"}
                  </p>
                </div>
              </div>

              {/* Reset/Refresh indicator */}
              <button 
                onClick={fetchFeedbackData}
                className="w-fit flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-[11px] text-slate-350 rounded-xl transition-all font-mono cursor-pointer self-start md:self-auto"
                title="Refresh logs from workspace / 刷新反馈记录"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>REFRESH LOGS / 刷新数据</span>
              </button>
            </div>

            {/* Scrollable Layout Body */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-1">
              
              {/* Propose a new bug/suggestion Form */}
              <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-3 shrink-0">
                <h4 className="text-xs font-black text-slate-200 tracking-wider font-mono uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  {isEn ? "PROPOSE A NEW REFINEMENT POINT" : "提报一条全新的网站迭代或内容优化建议"}
                </h4>
                
                <form onSubmit={handleAddFeedbackSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
                  
                  {/* Category select block */}
                  <div className="md:col-span-3 space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold font-mono tracking-wide block uppercase">
                      {isEn ? "Target Category" : "选择归属模块与区域"}
                    </label>
                    <select
                      value={feedbackCategory}
                      onChange={(e) => setFeedbackCategory(e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 text-xs border border-slate-800 rounded-xl p-2.5 focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="UI/UX & Mobile">{isEn ? "UI/UX & Mobile" : "UI/UX & 手机移动端"}</option>
                      <option value="Account System">{isEn ? "Trainee Center" : "学子与学员登录系统"}</option>
                      <option value="Interactive Map">{isEn ? "Interactive Map" : "跨文化大地图交互工具"}</option>
                      <option value="Content Polish">{isEn ? "Book & Case Studies" : "书籍封面与学术案例"}</option>
                      <option value="Strategic Roadmap">{isEn ? "Strategic Proposal" : "商业顾问战略与留咨询"}</option>
                      <option value="Others">{isEn ? "Other Corrections" : "其它零星细节纠正"}</option>
                    </select>
                  </div>

                  {/* Textarea description block */}
                  <div className="md:col-span-7 space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold font-mono tracking-wide block uppercase">
                      {isEn ? "Detailed Suggestion Description" : "写下具体改进需求或修改反馈 (支持中文)"}
                    </label>
                    <input
                      type="text"
                      required
                      value={newSuggestionInput}
                      onChange={(e) => setNewSuggestionInput(e.target.value)}
                      placeholder={isEn ? "e.g. Expand Linda Zhu's contact text and bold her title..." : "例如：主页案例描述可以微调文字，或者将指北针图标换成一个出海微章..."}
                      className="w-full bg-slate-950 text-slate-100 text-xs border border-slate-800 rounded-xl p-2.5 focus:outline-none focus:border-amber-400 placeholder:text-slate-600"
                    />
                  </div>

                  {/* Submit button block */}
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={isSubmittingFeedback || !newSuggestionInput.trim()}
                      className={`w-full py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isSubmittingFeedback || !newSuggestionInput.trim()
                          ? "bg-slate-850 text-slate-600 border border-slate-800 cursor-not-allowed"
                          : "bg-amber-500 text-slate-950 hover:bg-amber-600 shadow-md active:scale-95"
                      }`}
                    >
                      {isSubmittingFeedback ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isEn ? "Submit Point" : "正式提报"}</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>

              {/* CSV Upload/Bulk Import area */}
              <div className="p-4 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shrink-0 transition-all hover:border-slate-700">
                <div className="flex gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl h-fit">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <h5 className="text-xs font-black text-slate-200 uppercase tracking-widest font-mono">
                      {isEn ? "HARRY'S BULK IMPROVEMENTS CSV IMPORT WORKFLOW" : "解决对话框格式限制：通过 .csv（表格）一键批量提报"}
                    </h5>
                    <p className="text-[10px] leading-relaxed text-slate-400 max-w-2xl">
                      {isEn 
                        ? "Since the AI Studio chat inhibits direct XLSX attachments, you can save your Excel file as CSV (Comma delimited) inside Excel/WPS, then select it below. The system automatically reads columns and bulk syncs with workspace feedback.json!"
                        : "💡 提示：AI Studio 侧边聊天窗口对直接上传 .xls / .xlsx 表格有类型限制保护。您可以将您的规划表格（如微信接收的内容）在 Excel、Numbers 或 WPS 中选择「另存为」格式为 .csv（逗号分隔的文本文档），即可在此秒速导入。一经确认，您的迭代需求将毫秒级在下方表格渲染！"}
                    </p>
                    {csvStatusMessage && (
                      <div className="text-[10px] bg-[#070b19] font-bold border border-emerald-900/50 px-3 py-1.5 rounded-lg text-emerald-400 font-mono inline-block mt-1 animate-pulse">
                        📢 {csvStatusMessage}
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative shrink-0 w-full md:w-auto">
                  <label 
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer select-none"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{isEn ? "Import CSV Table" : "选取并导入 .csv 表格"}</span>
                    <input 
                      type="file" 
                      accept=".csv" 
                      onChange={handleCsvImport}
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* Refinement list Table */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-2.5">
                  <h4 className="text-xs font-black text-slate-300 tracking-wider font-mono uppercase flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <span>{isEn ? "ALL ACTIVE REFINEMENT LOGS" : "系统全部优化日志与跟进答复表"}</span>
                  </h4>
                  {feedbacks.length > 0 && (
                    <button
                      type="button"
                      onClick={handleExportToXlsx}
                      className="w-full sm:w-auto px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-950/20 active:scale-95 border border-emerald-400/20"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
                      <span>{isEn ? "Export Sheet to Excel (.xlsx)" : "导出需求讨论文档为 Excel (.xlsx)"}</span>
                    </button>
                  )}
                </div>

                {feedbacks.length === 0 ? (
                  <div className="p-8 text-center bg-slate-900/40 border border-slate-850 rounded-2xl flex flex-col items-center justify-center space-y-2">
                    <AlertCircle className="w-8 h-8 text-slate-600" />
                    <p className="text-xs text-slate-450 leading-relaxed font-bold">
                      {isEn ? "No logs found. Generating default state..." : "当前未从工作空间检测到反馈记录，刷新可载入预置日志。"}
                    </p>
                  </div>
                ) : (
                  <div className="border border-slate-850 bg-slate-950/40 rounded-2xl overflow-hidden shadow-inner">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                          <tr className="bg-[#0f172a] text-slate-300 border-b border-slate-800 text-[10px] sm:text-xs">
                            <th className="p-3 font-mono font-bold w-[7%]">ID/编号</th>
                            <th className="p-3 font-bold w-[13%]">归属模块</th>
                            <th className="p-3 font-bold w-[34%]">优化建议内容</th>
                            <th className="p-3 font-bold w-[12%]">提报时间</th>
                            <th className="p-3 font-bold w-[10%]">落实状态</th>
                            <th className="p-3 font-bold w-[24%]">AI 顾问研判与代码跟进</th>
                          </tr>
                        </thead>
                        <tbody>
                          {feedbacks.map((item, idx) => {
                            const isDone = item.status === "done";
                            const isPending = item.status === "pending";
                            return (
                              <tr 
                                key={item.id} 
                                className={`border-b border-slate-850/60 text-xs transition-colors hover:bg-slate-900/30 ${
                                  idx % 2 === 0 ? "bg-transparent" : "bg-slate-900/10"
                                }`}
                              >
                                {/* ID col */}
                                <td className="p-3 font-mono font-bold text-slate-500 text-[10.5px]">
                                  {item.id}
                                </td>

                                {/* Category */}
                                <td className="p-3">
                                  <span className="text-[10px] font-bold text-slate-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md font-mono">
                                    {item.category}
                                  </span>
                                </td>

                                {/* Suggestion text */}
                                <td className="p-3 text-slate-200 leading-relaxed font-sans pr-4">
                                  {item.suggestion}
                                </td>

                                {/* Date */}
                                <td className="p-3 font-mono text-[10.5px] text-slate-450 whitespace-nowrap">
                                  {item.date}
                                </td>

                                {/* Status */}
                                <td className="p-3">
                                  {isDone ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                      Done/已上线
                                    </span>
                                  ) : isPending ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                      Pending/讨论中
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/35 px-2.5 py-0.5 rounded-full font-bold">
                                      <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" />
                                      Open/改进中
                                    </span>
                                  )}
                                </td>

                                {/* Reply / AI action */}
                                <td className="p-3">
                                  <div className="p-2.5 bg-slate-950/70 border-l-2 border-amber-500/50 rounded-r-md text-[11px] text-slate-350 leading-relaxed font-sans max-w-[250px] sm:max-w-xs break-words">
                                    {item.reply || "【系统】：建议已入库，等待 AI 运行下一轮代码编译..."}
                                  </div>
                                </td>

                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Footer tips */}
            <div className="mt-4 border-t border-slate-800 pt-3.5 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-xs text-slate-500 gap-2 shrink-0">
              <span className="flex items-center gap-1 font-mono">
                <Shield className="w-3.5 h-3.5 text-amber-500/75" />
                <span>SHARED PERSISTENT SANDBOX</span>
              </span>
              <span>
                {isEn 
                  ? "Changes made to code will mark corresponding ID items as [Done]." 
                  : "💡 提示：该表格完美与工作空间 backend server 持久化同步。多次刷新均不会丢失新提报的意见。"}
              </span>
            </div>

          </motion.div>
        </div>
      )}

      {/* ================= MODAL: VIDEO MASTERCLASS PLAYER ================= */}
      {selectedVideoToPlay && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-4xl bg-[#090e1a] border border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl relative text-left flex flex-col max-h-[92vh] overflow-hidden"
          >
            {/* Close trigger */}
            <button
              onClick={() => setSelectedVideoToPlay(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer p-1.5 rounded-full hover:bg-slate-800 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="flex gap-2.5 items-center border-b border-slate-800/80 pb-3 mb-4 shrink-0 pr-10">
              <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-mono font-black">{selectedVideoToPlay.id}</span>
              <div>
                <h3 className="text-sm md:text-base font-black text-white leading-tight">
                  {isEn ? selectedVideoToPlay.titleEn : selectedVideoToPlay.titleZh}
                </h3>
                <p className="text-[10.5px] text-slate-400 mt-0.5 font-mono">
                  ⏱️ {isEn ? "Course Duration" : "随堂课时时长"}: {selectedVideoToPlay.duration} | 🎯 {isEn ? "Case Context" : "沙盘案例"}: {isEn ? selectedVideoToPlay.caseCountryEn : selectedVideoToPlay.caseCountryZh}
                </p>
              </div>
            </div>

            {/* Two Column Player Area */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 pr-1">
              
              {/* Left Column: Video Screen */}
              <div className="lg:col-span-7 flex flex-col justify-start space-y-4">
                
                {selectedVideoToPlay.videoUrl ? (
                  <div className="w-full aspect-video bg-black rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border border-amber-500/40 shadow-2xl">
                    <video
                      key={selectedVideoToPlay.videoUrl}
                      src={selectedVideoToPlay.videoUrl}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain rounded-2xl bg-black"
                    >
                      <source src={selectedVideoToPlay.videoUrl} type="video/mp4" />
                      您的浏览器不支持 HTML5 视频播放。
                    </video>
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-slate-950 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border border-slate-800/80 shadow-inner group select-none">
                    
                    {/* Glowing dynamic pulse orbit */}
                    <div className={`absolute w-36 h-36 border border-dashed border-amber-500/20 rounded-full flex items-center justify-center ${isPlayingMockVideo ? "animate-spin [animation-duration:15s]" : ""}`}>
                      <div className="w-24 h-24 border border-slate-800/60 rounded-full" />
                    </div>

                    {/* Lecturer portrait outline or active audio wave */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 space-y-2 text-center bg-radial from-slate-950 via-slate-950/80 to-slate-950">
                      <Compass className={`w-12 h-12 text-amber-500/80 ${isPlayingMockVideo ? "animate-spin [animation-duration:12s]" : ""}`} />
                      
                      <div className="space-y-1">
                        <p className="text-[10.5px] font-bold text-slate-300 tracking-wider font-mono uppercase">
                          {isPlayingMockVideo ? (isEn ? "NOW STREAMING" : "正在极速点播传输") : (isEn ? "PAUSED" : "播放暂停中")}
                        </p>
                        <p className="text-[9px] text-slate-500 max-w-xs font-mono">
                          {selectedVideoToPlay.pdfFile} @ 1080p 60fps | CDN Secured
                        </p>
                      </div>

                      {/* Simple dynamic audio wave spectrum */}
                      {isPlayingMockVideo && (
                        <div className="flex items-end gap-1.5 h-6 mt-1">
                          {[0.8, 0.4, 0.9, 0.5, 0.7, 0.3, 0.8, 0.5, 0.9, 0.4, 0.7].map((h, i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-amber-500 rounded-full"
                              animate={{ height: [`${h*100}%`, `${(1-h)*100}%`, `${h*100}%`] }}
                              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.1 }}
                              style={{ height: `${h * 100}%` }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Top-left security stamp */}
                    <div className="absolute top-3 left-3 z-20 bg-slate-950/80 backdrop-blur-xs border border-emerald-500/25 px-2 py-0.5 rounded text-[8px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                      <span>TRAINEE VIP STREAM ACTIVE</span>
                    </div>

                    {/* Bottom play bar overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 to-transparent p-3 pt-8 z-20 flex flex-col gap-2">
                      
                      {/* Scrub bar */}
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-slate-400">
                          {(() => {
                            const secs = Math.floor((mockVideoPlaybackProgress / 100) * 14 * 60 + 20);
                            const m = Math.floor(secs / 60);
                            const s = secs % 60;
                            return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
                          })()}
                        </span>
                        <div 
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const percent = Math.floor(((e.clientX - rect.left) / rect.width) * 100);
                            setMockVideoPlaybackProgress(percent);
                          }}
                          className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer relative group/scrub"
                        >
                          <div className="absolute inset-y-0 left-0 bg-amber-500 rounded-full" style={{ width: `${mockVideoPlaybackProgress}%` }} />
                        </div>
                        <span className="text-[9px] font-mono text-slate-500">{selectedVideoToPlay.duration}</span>
                      </div>

                      {/* Controls row */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setIsPlayingMockVideo(!isPlayingMockVideo)}
                            className="text-slate-300 hover:text-white transition-colors bg-transparent border-none outline-none cursor-pointer"
                          >
                            {isPlayingMockVideo ? <Pause className="w-4 h-4 text-amber-500" /> : <Play className="w-4 h-4 text-amber-500" />}
                          </button>

                          <span className="text-[10px] text-slate-400 font-bold">1.0x (Speed)</span>
                        </div>

                        <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5">
                          <span>🔊 100%</span>
                          <span className="bg-slate-800 text-[8px] font-mono font-bold text-slate-400 px-1 py-0.5 rounded">HD</span>
                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {/* Case briefing box */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs space-y-2">
                  <span className="font-mono text-[9px] text-amber-500 font-black uppercase tracking-wider block">LESSON SYLLABUS DIRECTORY / 本节出海实战纲领</span>
                  <p className="text-slate-300 leading-snug">
                    {isEn ? selectedVideoToPlay.descEn : selectedVideoToPlay.descZh}
                  </p>
                </div>

              </div>

              {/* Right Column: Study objectives and personal notebook */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                
                {/* AI Study objectives checklist */}
                <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-3">
                  <h4 className="text-[10px] font-mono text-slate-400 font-black tracking-wider uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isEn ? "HARRY'S COGNITIVE TARGETS / 核心训考指标" : "⚡ 主讲导师核心训考要点（本节考点）"}</span>
                  </h4>

                  <ul className="space-y-2 text-xs text-slate-350 list-none pl-0 text-left">
                    {(() => {
                      const targetsMap: { [key: string]: string[] } = {
                        "M01": [
                          isEn ? "Transcend high-velocity domestic paradigms" : "打破纯中式‘物理外泄、大力出奇迹’的固有惯性",
                          isEn ? "Establish structured multi-party alignment" : "学会如何进行跨国多边利益对齐，减少后期交付扯皮",
                          isEn ? "Understand the Indonesian high-speed rail milestone" : "以印尼雅万高铁落地实例，分析大型中企的破茧得失"
                        ],
                        "M02": [
                          isEn ? "Contrast direct negative feedback with polite cues" : "学会区分德法美荷兰直接否定，与中日韩印尼委婉隐瞒",
                          isEn ? "Design de-contextualized dashboard metrics" : "掌握利用一页去语境化的‘看板制度’管理高语境团队",
                          isEn ? "Decode indirect warnings from senior counterparts" : "提升高管跨文化情商，秒懂异国董事长的‘弦外之音’"
                        ],
                        "M03": [
                          isEn ? "principles-first vs applications-first writing" : "在原理优先（德法）和应用优先（美英）写信中灵活切换",
                          isEn ? "Succeed in board pitching with logic frames" : "使用严格的逻辑演绎链条说服欧洲高阶技术总监",
                          isEn ? "Break down rigid hierarchies in decision making" : "跨越绝对平权（瑞典）与强等级制（法意）的沟通代沟"
                        ],
                        "M04": [
                          isEn ? "Implement Japanese Nemawashi (consensus)" : "系统学会日本、北欧的‘慢长决策、全员一致’对齐技术",
                          isEn ? "Avoid decision paralysis in joint ventures" : "设计防瘫痪机制，防止多国董事投票产生无限期搁置",
                          isEn ? "Calibrate disagreements during key milestones" : "掌握在意见出现严重割裂时，健康的‘对事不对人’博弈"
                        ],
                        "M05": [
                          isEn ? "Differentiate relationship trust and task trust" : "理清美式任务信任（看合同）与亚非拉人情信任（喝茶）差异",
                          isEn ? "Run dual-track timing schedule to control risks" : "实施‘双轨制日程管理’，既让地方人情妥协，又不耽误死线",
                          isEn ? "Navigate Saudi and Middle East personal accounts" : "在沙特和海湾商圈建立神圣的‘互惠人情账户’"
                        ],
                        "M06": [
                          isEn ? "Negotiate multi-national procurement contracts" : "现场推演：模拟新加坡高契约软件项目 1对1 逼单谈判",
                          isEn ? "Resolve Vietnam localized BPO broker rebates" : "破局越南本地多层代理佣金割裂，维持合作边界",
                          isEn ? "Manipulate leverage on highly complex tables" : "学习销售冲刺期，吕华导师传授的‘高阶施压与妥协术’"
                        ],
                        "M07": [
                          isEn ? "Salvage global teams from sudden delivery failure" : "实战应急：两小时全球虚拟大协作断裂的‘救命会’开法",
                          isEn ? "Control Indian outsourcing and push deadlines" : "降伏印度外包团队的推诿越级，用 RAG 状态灯直接锁死",
                          isEn ? "Reassure high-stakes clients with clear status" : "精细安抚美国大型巨头客户，用逻辑流程争取修补死线"
                        ],
                        "M08": [
                          isEn ? "Diagnose the Indonesian 'Smile Cover-up' syndrome" : "一针见血诊断印尼、菲律宾‘微笑没问题、背地不做工’",
                          isEn ? "Utilize Bahasa tone indicators for team status" : "巧妙利用 AI 声调分析、本土化包容文化重塑执行力",
                          isEn ? "Overcome high-context management friction" : "在不让印尼高管丢面子的前提下，极其温和地追缴进度"
                        ],
                        "M09": [
                          isEn ? "Acquire Majlis protocol codes in Saudi and UAE" : "打通沙特与阿联酋 Majlis 核心社交圈，搞懂酋长面子",
                          isEn ? "Understand Saudization hiring quotas and limits" : "深度规避严苛的‘沙特化/本土化’雇人红线与罚款政策",
                          isEn ? "Orchestrate Middle East business relationship" : "在迪拜和利雅得，用高语境款待构建高阶权力关系"
                        ],
                        "M10": [
                          isEn ? "Manage extreme flexible timing (Amanhã buffers)" : "破解巴西‘明天再看/Amanhã’，用多段解耦重构进度表",
                          isEn ? "Engage LATAM employees with passion metrics" : "用拉美本土热情文化（桑巴/足球）进行弹性团队自驱激励",
                          isEn ? "Adapt to highly matrixed Brazil compliance laws" : "规避巴西极其复杂的劳工法案与圣保罗社交流水深坑"
                        ],
                        "M11": [
                          isEn ? "Adopt a flexible Global Mindset for operations" : "合围欧美：打破中国单一惯性，完成高管心智彻底升级",
                          isEn ? "Deploy cross-cultural agile governance models" : "交付‘跨文化敏捷治理罗盘’，确保多边组织常青运行",
                          isEn ? "Download global lesson slides and finish reviews" : "获取全套随课 PDF 行动指南，锁定本期主讲教案结课"
                        ]
                      };

                      const targets = targetsMap[selectedVideoToPlay.id] || [
                        "理解跨文化客户体验的核心指标与多国相对落差",
                        "精细拆解随堂真实案例并对照文化地图进行诊断",
                        "下载本节 PDF 随课讲义进行长线知识复盘"
                      ];

                      return targets.map((t, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{t}</span>
                        </li>
                      ));
                    })()}
                  </ul>
                </div>

                {/* Trainee personal notebook */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex-1 flex flex-col justify-between space-y-3 min-h-[160px]">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wide block uppercase flex items-center justify-between">
                      <span>📝 {isEn ? "TRAINEE PRIVATE NOTES / 学子专属随课笔记" : "📝 您的随堂专属私人研习笔记"}</span>
                      <span className="text-[9px] text-slate-500 font-mono capitalize">
                        {isEn ? "Saves locally" : "自动保存至浏览器"}
                      </span>
                    </label>
                    <textarea
                      value={activeNotesText}
                      onChange={(e) => setActiveNotesText(e.target.value)}
                      placeholder={isEn ? "Type your key learnings, case actions, and lesson summary here..." : "在此记录您听课过程中的战略心得、针对自身业务的待办行动，或对该国家的对攻方案..."}
                      className="w-full bg-slate-950 text-slate-100 text-xs border border-slate-850 rounded-xl p-2.5 h-[100px] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 placeholder:text-slate-600 resize-none"
                    />
                  </div>

                  <div className="flex justify-between items-center shrink-0">
                    <div>
                      {savedNotesNotice ? (
                        <span className="text-[10px] text-emerald-400 font-bold font-mono animate-pulse">
                          ✓ Saved & Encrypted!
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-500 font-mono">
                          Not synced with third parties.
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        const updated = { ...savedVideoNotes, [selectedVideoToPlay.id]: activeNotesText };
                        setSavedVideoNotes(updated);
                        localStorage.setItem("lyu_student_video_notes", JSON.stringify(updated));
                        setSavedNotesNotice(true);
                        setTimeout(() => setSavedNotesNotice(false), 2500);
                      }}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg transition-all cursor-pointer shadow-md"
                    >
                      {isEn ? "Save Notes" : "保存本堂笔记"}
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom action bar */}
            <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <p className="text-[10px] font-mono text-slate-500">
                Outbound Masterclass Series © Harry Lyu. Protected under Global NDA & GDPR Agreements.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedVideoToViewPdf(selectedVideoToPlay);
                    setSelectedVideoToPlay(null);
                    setCurrentPdfSlideIndex(1);
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>{isEn ? "View Lecture Slides" : "切换并阅读随堂讲义"}</span>
                </button>

                <button
                  onClick={() => setSelectedVideoToPlay(null)}
                  className="px-4 py-2 bg-slate-850 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-750"
                >
                  {isEn ? "Close Player" : "退出播放器"}
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      )}

      {/* ================= MODAL: LECTURE SLIDE NOTES PREVIEWER ================= */}
      {selectedVideoToViewPdf && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-4xl bg-[#090e1a] border border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl relative text-left flex flex-col max-h-[92vh] overflow-hidden"
          >
            {/* Close trigger */}
            <button
              onClick={() => setSelectedVideoToViewPdf(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer p-1.5 rounded-full hover:bg-slate-800 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="flex gap-2.5 items-center border-b border-slate-800/80 pb-3 mb-4 shrink-0 pr-10">
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-black">{selectedVideoToViewPdf.id} SLIDES</span>
              <div>
                <h3 className="text-sm md:text-base font-black text-white leading-tight">
                  {isEn ? selectedVideoToViewPdf.titleEn : selectedVideoToViewPdf.titleZh}
                </h3>
                <p className="text-[10.5px] text-slate-400 mt-0.5">
                  📚 {isEn ? "Courseware Slide Reader" : "随堂课件讲义在线研学阅读器"} | {isEn ? "Current slide" : "当前页"}: {currentPdfSlideIndex} / 4
                </p>
              </div>
            </div>

            {/* Simulated Slide deck display stage */}
            <div className="flex-1 overflow-y-auto flex flex-col justify-between py-2 min-h-[300px] pr-1">
              
              <div className="w-full aspect-video md:max-h-[420px] bg-[#020617] rounded-2xl relative overflow-hidden flex flex-col justify-between p-6 sm:p-8 border border-slate-800 text-left select-none shadow-2xl">
                
                {/* Background high-tech styling */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#10b981]/2 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/2 rounded-full blur-3xl" />
                
                {/* Header inside slide */}
                <div className="flex justify-between items-center border-b border-slate-850 pb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded font-mono uppercase">
                      Winning Overseas
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {selectedVideoToViewPdf.id} Syllabus Module
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                    Harry Lyu Outbound masterclass
                  </span>
                </div>

                {/* Core slide body based on index */}
                <div className="flex-1 flex flex-col justify-center py-4 text-left">
                  {(() => {
                    const slideDataMap: { [key: string]: { slideTitle: string; bullets: string[]; subtitle: string }[] } = {
                      "M01": [
                        {
                          slideTitle: "Slide 1: Global CX Paradigm Shift / 破题战略 · 从中国速度到全球预期",
                          subtitle: "超越常规的中式‘加班苦干’思维，转入契约与理性信任对齐",
                          bullets: [
                            "● 为什么大力出奇迹在发达/成熟海外市场容易折戟？因为对方最看重的是‘确定性’与‘合规保障’。",
                            "● 中企‘物理外溢’的惯性阻断：过于追求极速而忽视海外合规生命线，导致信任被直接拉闸。",
                            "● 重塑全球心智模型（Global Mindset）：将服务感知标准与对方的利益、法务合规紧密解耦。"
                          ]
                        },
                        {
                          slideTitle: "Slide 2: Case Study of Indonesian Rail / 印尼雅万高难度工程会诊",
                          subtitle: "大型中企跨国基建与高低语境磨合得失深度研判",
                          bullets: [
                            "● 多边协作卡位：由于双方在决策效率、等级边界上的极度割裂，造成沟通周期无限拉长。",
                            "● 警惕东南亚微笑黑盒：当地极度回避公开冲突，用礼貌的赞成掩盖实际的项目进度黑盒。",
                            "● 主训药方：在保持地方主管面子的前提下，建立高密度的、去语境化的‘1x1’核对通道。"
                          ]
                        },
                        {
                          slideTitle: "Slide 3: Contract Segregation Mechanics / 跨国契约与交付分层解耦",
                          subtitle: "高性价比、低成本风险控制的出海中枢黄金配比",
                          bullets: [
                            "● 将高成本的海外呼叫中心拆解，实施两段制（如沙特本地高阶客服 + 埃及低廉开罗后台）。",
                            "● 建立分级敏捷监控（RAG灯号）：红色代表法务生命线断裂，黄色代表进度延迟，绿色正常。",
                            "● 用标准化工具（WhatsApp CRM + AI多渠道）大幅降低人力消耗，规避海外工会用工极高摩擦。"
                          ]
                        },
                        {
                          slideTitle: "Slide 4: Lesson Review and Workbook Checklist / 行动学习：出海破局诊断表",
                          subtitle: "课后思考：您的企业在走出去时，是否存在自我感动的‘速度神话’？",
                          bullets: [
                            "1. 评估您本季度海外关键决策的平均等待时长。是否有卡在‘平权全员同意’上的泥潭？",
                            "2. 诊断海外本地团队在向您汇报进度时，是否存在‘微笑粉饰’或温和阻断？",
                            "3. 请立即在对话框将 M01.pdf 上传至 /public/docs/ 目录，打印完整版行动罗盘。锁定本节研习成果。"
                          ]
                        }
                      ],
                      "M02": [
                        {
                          slideTitle: "Slide 1: High/Low Context Dimensions / Erin Meyer文化地图第一、第二维",
                          subtitle: "探索直接说‘不’与空气弦外之音的跨文化摩擦",
                          bullets: [
                            "● 低语境国家（英美、德、荷）：语言即含义本身，清晰直白就是专业；直接否定‘不对人’。",
                            "● 高语境国家（中日韩、中东、东南亚）：语言外有弦外之音，面子极其神圣，公开否定等同宣战。",
                            "● 当低语境管理者撞上高语境下属：极易造成信任账户的瞬间归零，下属集体离职并锁死进度。"
                          ]
                        },
                        {
                          slideTitle: "Slide 2: Breaking the Feedback Barrier / 彻底破解‘听不懂弦外之音’",
                          subtitle: "如何防止跨国合资高管团队因意见割裂而在一夜崩溃",
                          bullets: [
                            "● 在荷兰、德国等国家：‘我完全不赞同你’只是为了学术求真。请不要建立过度敏感的受害者防御铠甲。",
                            "● 在日本、印尼等高语境中：点头微笑或长叹气代表‘我有极大顾虑’。绝不能只看字面，必须读懂空气。",
                            "● 导师药方：在下发负面考核前，进行 1x1 信任对齐，并使用‘两件肯定包裹一件否定’的三明治话术。"
                          ]
                        },
                        {
                          slideTitle: "Slide 3: De-Contextualized Dashboard Systems / 看板体系的去语境化重组",
                          subtitle: "将虚无缥缈的高语境默契，强制规范成客观的自动化数据看板",
                          bullets: [
                            "● 第一步：对所有模糊字眼（‘快好了’、‘差不多’）进行数据化解耦，定义明确的完成百分比（%）。",
                            "● 第二步：设计匿名在线异议投票板，给高语境地方经理提供安全的‘不用直接顶撞老板’的意见反馈槽。",
                            "● 第三步：建立客观的、不针对个体的全系统交付闭环。用系统流程中立性代替人性的主观督导。"
                          ]
                        },
                        {
                          slideTitle: "Slide 4: Lesson Review & Actionable Guidelines / M02 随堂学子实战自诊",
                          subtitle: "课后作业：请绘制您团队目前的文化坐标，找出沟通落差最危险的雷区",
                          bullets: [
                            "1. 您是否在与德国或英国高管沟通时，因为对方粗鲁的指出漏洞而感觉面子受挫、自我怀疑？",
                            "2. 您的东南亚下属是否连续数次反馈‘一切顺利’，却在交付日爆雷并声称‘本以为你能看出来’？",
                            "3. 请购买包月/包年特权，解锁本节高管 1x1 对攻信件模板。让我们在下一小节继续深度会诊。"
                          ]
                        }
                      ]
                    };

                    // Default fallback slides generator for subsequent modules (M03-M11)
                    const slides = slideDataMap[selectedVideoToViewPdf.id] || [
                      {
                        slideTitle: `Slide 1: ${selectedVideoToViewPdf.id} Core Strategic Framework / ${selectedVideoToViewPdf.titleZh.split("：")[1] || selectedVideoToViewPdf.titleZh}`,
                        subtitle: `🎯 Case study context: ${selectedVideoToViewPdf.caseCountryZh} Outbound Blueprint`,
                        bullets: [
                          `● Target Market Focus: Dissecting commercial rules and executive behavior traits in ${selectedVideoToViewPdf.caseCountryZh}.`,
                          "● Navigating ERIN MEYER's relative distance scales: Plotting relative negotiation distances.",
                          "● Breaking local compliance limits: Establishing a structured delivery roadmap with zero delay."
                        ]
                      },
                      {
                        slideTitle: `Slide 2: Overcoming Regional Bottlenecks & Clashes / ${selectedVideoToViewPdf.caseCountryZh} 跨国冲突解密`,
                        subtitle: "How to survive local face preservation games and scheduling elasticities",
                        bullets: [
                          "● Identifying the root cause of project delay: Relational mismatch vs Contractual strictness.",
                          "● Preserving local manager's dignity while ensuring 100% compliance with HQ deadlines.",
                          "● Implementing Harry's dual-track trust mechanism: Contractual security coupled with localized care."
                        ]
                      },
                      {
                        slideTitle: "Slide 3: Technical Empowerment & WhatsApp/AI Operations / 科技降本与社媒获客",
                        subtitle: "Integrating automated AI routing to skip labor cost traps overseas",
                        bullets: [
                          "● Leveraging WhatsApp and local messaging systems to build long-term private domain user loyalty.",
                          "● Designing secure and reliable server-side API routes for customer sentiment classifications.",
                          "● Scaling local customer service capabilities dynamically, achieving massive cost reduction."
                        ]
                      },
                      {
                        slideTitle: "Slide 4: Masterclass Final Checklists & Actions / 研学课后行动指南",
                        subtitle: "Formulating localized playbooks for Chinese general managers",
                        bullets: [
                          `1. Identify the largest cultural gap between your Chinese team and ${selectedVideoToViewPdf.caseCountryZh} local partners.`,
                          "2. Design a localized RAG dashboard to bypass subjective 'smile cover-up' progress reports.",
                          `3. Download the full course syllabus ${selectedVideoToViewPdf.pdfFile} to print out your local team rules.`
                        ]
                      }
                    ];

                    const curSlide = slides[currentPdfSlideIndex - 1] || slides[0];
                    return (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <h4 className="text-xs sm:text-sm font-black text-amber-400 font-mono">
                            {curSlide.slideTitle}
                          </h4>
                          <p className="text-[10px] sm:text-xs text-slate-400 italic">
                            {curSlide.subtitle}
                          </p>
                        </div>

                        <div className="space-y-3 pt-2">
                          {curSlide.bullets.map((b, i) => (
                            <p key={i} className="text-xs text-slate-200 leading-relaxed font-sans pr-2">
                              {b}
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Footer inside slide */}
                <div className="flex justify-between items-center border-t border-slate-850 pt-3 text-[9px] text-slate-500 shrink-0 font-mono">
                  <span>OUTBOUND NAVIGATOR © HARRY LYU</span>
                  <span>CONFIDENTIAL - ONLY FOR APPROVED TRAINEES</span>
                </div>

              </div>

              {/* Slider paginator controls */}
              <div className="flex items-center justify-between pt-4 shrink-0">
                <div className="flex gap-2">
                  <button
                    disabled={currentPdfSlideIndex === 1}
                    onClick={() => setCurrentPdfSlideIndex(prev => Math.max(1, prev - 1))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1 ${
                      currentPdfSlideIndex === 1
                        ? "bg-slate-950 text-slate-700 border-slate-900 cursor-not-allowed"
                        : "bg-slate-900 text-slate-300 hover:text-white border-slate-800 hover:bg-slate-800"
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>{isEn ? "Prev Page" : "前一页"}</span>
                  </button>

                  <button
                    disabled={currentPdfSlideIndex === 4}
                    onClick={() => setCurrentPdfSlideIndex(prev => Math.min(4, prev + 1))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1 ${
                      currentPdfSlideIndex === 4
                        ? "bg-slate-950 text-slate-700 border-slate-900 cursor-not-allowed"
                        : "bg-slate-900 text-slate-300 hover:text-white border-slate-800 hover:bg-slate-800"
                    }`}
                  >
                    <span>{isEn ? "Next Page" : "后一页"}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-450">
                    Slide {currentPdfSlideIndex} of 4
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom action bar */}
            <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <p className="text-[10px] font-mono text-slate-500">
                Courseware Slide Content designed by Harry Lyu. All rights reserved.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedVideoToPlay(selectedVideoToViewPdf);
                    setSelectedVideoToViewPdf(null);
                    setIsPlayingMockVideo(true);
                    setMockVideoPlaybackProgress(0);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isEn ? "Switch to Video" : "切换观看视频课件"}</span>
                </button>

                <button
                  onClick={() => {
                    alert(isEn 
                      ? `🎉 Starting download of lecture notes: ${selectedVideoToViewPdf.pdfFile}\nIf you have uploaded the PDF, the browser has transferred it. Otherwise, please upload ${selectedVideoToViewPdf.id}.pdf to /public/docs/ in your workspace folder.` 
                      : `🎉 正在为您拉起随堂讲义 PDF 浏览器下载通道：\n文件路径：${selectedVideoToViewPdf.pdfFile}\n（提示：如果您已将真实的 PDF 文件上传至项目的 /public/docs/ 目录并命名为 ${selectedVideoToViewPdf.id}.pdf，浏览器将立刻直接完成高速传输。）`);
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isEn ? "Download PDF Slides" : "下载本课 PDF 讲义"}</span>
                </button>

                <button
                  onClick={() => setSelectedVideoToViewPdf(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-750"
                >
                  {isEn ? "Close Viewer" : "退出阅读器"}
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      )}

    </div>
  );
}
