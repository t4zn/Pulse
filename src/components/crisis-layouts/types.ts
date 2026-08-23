export { EthereumIcon, PolygonIcon } from "./Icons";

export interface RealCrisisPost {
  id: string;
  source: "USGS" | "EMSC" | "NASA";
  author: {
    name: string;
    verified: boolean;
    logoSrc: string;
  };
  timeAgo: string;
  timestamp: number;
  rawMagnitude: number;
  regionKey: string;
  headlineTitle: string;
  magnitude: string;
  severityLevel: "CRITICAL" | "HIGH" | "ELEVATED";
  depth: string;
  significance: string;
  officialUrl: string;
  fullDescription: string[];
  lat?: number;
  lon?: number;
}

export interface LayoutProps {
  posts: RealCrisisPost[];
  loading: boolean;
  expandedIds: Record<string, boolean>;
  toggleExpand: (id: string) => void;
  inlineDonateId: string | null;
  inlineClaimId: string | null;
  toggleInlineDonate: (id: string) => void;
  toggleInlineClaim: (id: string) => void;
  donateAmount: string;
  setDonateAmount: (val: string) => void;
  donateToken: "ETH" | "POL";
  setDonateToken: (val: "ETH" | "POL") => void;
  isSubmittingDonation: boolean;
  donationSuccessId: string | null;
  donationCids: Record<string, string>;
  handleConfirmDonation: (post: RealCrisisPost) => Promise<void>;
  isSubmittingClaim: boolean;
  claimSuccessId: string | null;
  claimCids: Record<string, string>;
  claimTxHashes: Record<string, string>;
  claimStatusMsg: string;
  handleConfirmClaim: (post: RealCrisisPost) => Promise<void>;
  getCryptoEstimate: (usdStr: string, token: "ETH" | "POL") => string;
  getApprovedAidAmount: (post: { id: string; rawMagnitude?: number; depth?: string }) => string;
  handleCopyLink: (id: string) => void;
  copiedId: string | null;
  connectedAddress?: string | null;
  isConnected?: boolean;
}

export interface LayoutOption {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  accent: string;
  iconName: string;
  description: string;
}

export const LAYOUT_OPTIONS: LayoutOption[] = [
  {
    id: "layout-1",
    name: "Mission Control HUD",
    subtitle: "Cyber-tactical dark operations center",
    tag: "Tactical HUD",
    accent: "from-cyan-500 to-blue-600",
    iconName: "Radio",
    description: "Dark tactical command console with live seismic wave visualizers, depth radar, and telemetry cards.",
  },
  {
    id: "layout-2",
    name: "Bento Grid Intelligence",
    subtitle: "Apple / Linear style modular bento cards",
    tag: "Bento Grid",
    accent: "from-indigo-500 to-purple-600",
    iconName: "LayoutGrid",
    description: "High-density modular intelligence grid with 2x2 featured crisis hero, slider donation, and quick ZK claim.",
  },
  {
    id: "layout-3",
    name: "Live Chronicle Pipeline",
    subtitle: "Chronological animated time-stream",
    tag: "Timeline Stream",
    accent: "from-amber-500 to-rose-600",
    iconName: "Activity",
    description: "Animated vertical energy pulse stream with time-elapsed badges, expanding story drawers, and field reports.",
  },
  {
    id: "layout-4",
    name: "Geospatial Cockpit",
    subtitle: "Dual-pane radar map & live queue",
    tag: "Split Map Feed",
    accent: "from-emerald-500 to-teal-600",
    iconName: "Compass",
    description: "Interactive geospatial crisis map on the left with live incident triage cards synced on the right.",
  },
  {
    id: "layout-5",
    name: "Bloomberg Terminal",
    subtitle: "Pro financial & relief liquidity desk",
    tag: "Financial Terminal",
    accent: "from-amber-400 to-yellow-600",
    iconName: "Terminal",
    description: "Monospace high-density financial triage deck with ticker tapes, liquidity orderbook, and fast keyboard shortcuts.",
  },
  {
    id: "layout-6",
    name: "Editorial Dispatch",
    subtitle: "Magazine cover story & journalistic layout",
    tag: "Luxury Editorial",
    accent: "from-rose-500 to-red-700",
    iconName: "Newspaper",
    description: "Elegant serif journalism, pull quotes, rich humanitarian badges, and sealed wax-stamp verification seals.",
  },
  {
    id: "layout-7",
    name: "Swiper Rescue Deck",
    subtitle: "Mobile-first gesture & card carousel",
    tag: "Card Deck",
    accent: "from-pink-500 to-rose-600",
    iconName: "Layers",
    description: "Stackable focus card deck with rotary relief dial, quick swipe navigation, and biometric ZK claim flow.",
  },
  {
    id: "layout-8",
    name: "Spatial Glass Cyberpunk",
    subtitle: "3D frosted glass & iridescent glows",
    tag: "Glassmorphic 3D",
    accent: "from-purple-500 to-pink-500",
    iconName: "Sparkles",
    description: "Frosted glass panels with ambient mouse glow, neon frequency bars, and cryptographic particle effects.",
  },
  {
    id: "layout-9",
    name: "Kanban Emergency Dispatch",
    subtitle: "Agile severity & triage pipeline",
    tag: "Kanban Board",
    accent: "from-blue-500 to-cyan-600",
    iconName: "Kanban",
    description: "Multi-column agile board categorized by Critical, High, Satellite, and Stabilized with pool liquidity stats.",
  },
  {
    id: "layout-10",
    name: "Swiss Minimalist Precision",
    subtitle: "Dieter Rams / Bauhaus high-contrast data",
    tag: "Swiss Typography",
    accent: "from-neutral-800 to-black",
    iconName: "Sliders",
    description: "Stark black & white Bauhaus grid, architectural line rules, hypocenter telemetry, and raw JSON toggle.",
  },
];
