import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode, SVGProps } from 'react';

// --- TYPE DECLARATIONS FOR CANVAS GLOBAL VARIABLES ---
// These declarations tell TypeScript that these variables exist at runtime
// and resolves the "Cannot find name" error.
declare const __app_id: string | undefined;
declare const __initial_auth_token: string | undefined;

// --- TYPE DEFINITIONS ---
interface DashboardData {
  today: number;
  week: number;
  days28: number;
  allTime: number;
  wallet: number;
  consistencyDays: number;
}

interface Customer {
  name: string;
  userId: string;
}

interface SalesData {
  id: string;
  packageName: string;
  salesCount: number;
  price: number;
  customers: Customer[];
}

type PayoutStatus = 'Completed' | 'Processing' | 'Failed';

interface Payout {
  id: string;
  date: Date;
  amount: number;
  status: PayoutStatus;
}

interface LeaderboardEntry {
  username: string;
  todayEarning: number;
  weekEarning: number;
  monthEarning: number;
  totalAmountEarned: number;
  isCurrent?: boolean;
}

interface ReferralPackage {
  id: string;
  name: string;
  description: string;
  commission: string;
  variant: 'blue' | 'violet' | 'gold';
  price: number;
  features: string[];
}

type ViewId = 'dashboard' | 'referral' | 'mysales' | 'leaderboard' | 'payout' | 'settings' | 'srkbank';
type ToastType = 'success' | 'error';
type CardVariant = 'neutral' | 'gold' | 'emerald' | 'violet' | 'blue' | 'rose';

interface NavItem {
  id: ViewId;
  label: string;
  icon: React.FC<SVGProps<SVGSVGElement>>;
  color: string;
  external?: boolean;
}

// --- MANDATORY ENVIRONMENT CONFIG (NO MORE RED LINES) ---
const APP_ID: string = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const INITIAL_AUTH_TOKEN: string | null = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// --- MOCK DATA ---
const MOCK_DASHBOARD_DATA: DashboardData = { 
  today: 450, 
  week: 3200, 
  days28: 11500, 
  allTime: 51200, 
  wallet: 4890.50, 
  consistencyDays: 14 
};

const MOCK_SALES_DATA: SalesData[] = [
  { 
    id: 'bronze', 
    packageName: 'Bronze Access', 
    salesCount: 50, 
    price: 500, 
    customers: [
      { name: 'Alistair S.', userId: 'user-78a3' }, 
      { name: 'Brenda M.', userId: 'user-34b2' }, 
      { name: 'Carl P.', userId: 'user-c8c9' }
    ] 
  },
  { 
    id: 'silver', 
    packageName: 'Silver Mastery', 
    salesCount: 15, 
    price: 1500, 
    customers: [
      { name: 'Donna E.', userId: 'user-1f2d' }, 
      { name: 'Ethan T.', userId: 'user-9e4a' }
    ] 
  },
  { 
    id: 'gold', 
    packageName: 'Gold Elite', 
    salesCount: 5, 
    price: 5000, 
    customers: [
      { name: 'Fiona G.', userId: 'user-2h1g' }
    ] 
  },
];

const MOCK_PAYOUTS: Payout[] = [
  { id: 'p1', date: new Date('2025-10-15'), amount: 1250.00, status: 'Completed' },
  { id: 'p2', date: new Date('2025-11-01'), amount: 980.50, status: 'Completed' },
  { id: 'p3', date: new Date('2025-11-20'), amount: 310.75, status: 'Processing' },
  { id: 'p4', date: new Date('2025-12-05'), amount: 2000.00, status: 'Completed' },
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { username: 'AlphaTraderX', todayEarning: 500, weekEarning: 3500, monthEarning: 12000, totalAmountEarned: 55000 },
  { username: 'BenS (You)', todayEarning: 450, weekEarning: 3200, monthEarning: 11500, totalAmountEarned: 51200, isCurrent: true },
  { username: 'CryptoGuru', todayEarning: 390, weekEarning: 2900, monthEarning: 9800, totalAmountEarned: 45000 },
  { username: 'FinanceWhiz', todayEarning: 350, weekEarning: 2500, monthEarning: 8000, totalAmountEarned: 38000 },
  { username: 'MarketWizard', todayEarning: 300, weekEarning: 2000, monthEarning: 7500, totalAmountEarned: 35000 },
];

const MOCK_REFERRAL_PACKAGES: ReferralPackage[] = [
  { 
    id: 'starter', 
    name: 'Starter Access', 
    description: 'Perfect for beginners. Access essential tools and earn commission.', 
    commission: '10%', 
    variant: 'blue',
    price: 99,
    features: ['Basic access', '10% commission', 'Email support']
  },
  { 
    id: 'intermediate', 
    name: 'Pro Mastery', 
    description: 'Unlock advanced features and increase your earning potential.', 
    commission: '15%', 
    variant: 'violet',
    price: 299,
    features: ['Advanced tools', '15% commission', 'Priority support', 'Webinars']
  },
  { 
    id: 'pro', 
    name: 'Elite Partner', 
    description: 'The highest tier with exclusive benefits and top commission rates.', 
    commission: '20%', 
    variant: 'gold',
    price: 999,
    features: ['All features', '20% commission', '24/7 support', 'Private coaching', 'Early access']
  },
];

// --- UTILITY FUNCTIONS ---
const copyTextToClipboard = async (text: string): Promise<boolean> => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      return false;
    }
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    } catch (err) {
      document.body.removeChild(textarea);
      return false;
    }
  }
};

const formatCurrency = (value: number | undefined | null): string => 
  new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    minimumFractionDigits: 2 
  }).format(value || 0);

// Unused utility function, keeping it typed for completeness
/* const safeParseNumber = (value: number | string | unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}; */

// --- ICONS (Typed using React.FC<SVGProps<SVGSVGElement>>) ---
const HomeIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const ShareIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
    <polyline points="16 6 12 2 8 6"></polyline>
    <line x1="12" y1="2" x2="12" y2="15"></line>
  </svg>
);

const BanknoteIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2"></rect>
    <circle cx="12" cy="12" r="2"></circle>
    <path d="M6 12h.01M18 12h.01"></path>
  </svg>
);

const ShoppingBagIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const TrendingUpIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const WalletIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"></path>
  </svg>
);

const CopyIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const ChevronDownIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const MenuIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const XIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SettingsIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82-.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0 .33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H11a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08z"></path>
  </svg>
);

const CheckCircleIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

// --- VISUAL COMPONENTS ---

const BackgroundEffects: React.FC = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-[#1a1410] to-black"></div>
    <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#b68938]/20 rounded-full blur-[128px] animate-pulse opacity-50"></div>
    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#e1ba73]/20 rounded-full blur-[128px] animate-pulse opacity-50" style={{animationDelay: '1s'}}></div>
    <div className="absolute inset-0 bg-[linear-gradient(rgba(182,137,56,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(182,137,56,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
  </div>
);

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  variant?: CardVariant;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", hoverEffect = true, variant = 'neutral' }) => {
  const getBorderColor = (): string => {
    switch(variant) {
      case 'gold': return 'border-[#b68938]/30 hover:border-[#b68938]/60';
      case 'emerald': return 'border-emerald-500/20 hover:border-emerald-500/40';
      case 'violet': return 'border-violet-500/20 hover:border-violet-500/40';
      case 'blue': return 'border-blue-500/20 hover:border-blue-500/40';
      case 'rose': return 'border-rose-500/20 hover:border-rose-500/40';
      default: return 'border-white/10 hover:border-white/20';
    }
  };

  const getGlowColor = (): string => {
    switch(variant) {
      case 'gold': return 'hover:shadow-[0_0_40px_rgba(182,137,56,0.2)]';
      case 'emerald': return 'hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]';
      case 'violet': return 'hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]';
      case 'blue': return 'hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]';
      case 'rose': return 'hover:shadow-[0_0_40px_rgba(244,63,94,0.2)]';
      default: return 'hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]';
    }
  };

  return (
    <div className={`
      relative overflow-hidden
      bg-[rgba(26,20,16,0.4)] backdrop-blur-xl
      border rounded-3xl
      shadow-lg
      ${getBorderColor()}
      ${hoverEffect ? `transition-all duration-500 hover:-translate-y-1 ${getGlowColor()}` : ''}
      ${className}
    `}>
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
}

const GradientText: React.FC<GradientTextProps> = ({ children, className = "", variant = 'gold' }) => {
  const getGradient = (): string => {
    switch(variant) {
      case 'gold': return 'from-[#b68938] via-[#e1ba73] to-[#b68938]';
      case 'emerald': return 'from-emerald-300 via-emerald-100 to-emerald-400';
      case 'violet': return 'from-violet-300 via-violet-100 to-violet-400';
      case 'blue': return 'from-blue-300 via-blue-100 to-blue-400';
      case 'rose': return 'from-rose-300 via-rose-100 to-rose-400';
      default: return 'from-gray-300 via-gray-100 to-gray-400';
    }
  };
  return (
    <span className={`bg-clip-text text-transparent bg-gradient-to-r ${getGradient()} ${className}`}>
      {children}
    </span>
  );
};

interface ToastProps {
  message: string | null;
  type?: ToastType;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || message === null) return null;

  const baseClasses: string = "fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-50 transition-all duration-300 ease-out flex items-center gap-2";
  
  let typeClasses: string = '';
  let iconPath: string = '';

  switch (type) {
    case 'success':
      typeClasses = 'bg-emerald-600 text-white';
      iconPath = "M20 6L9 17l-5-5";
      break;
    case 'error':
      typeClasses = 'bg-rose-600 text-white';
      iconPath = "M18 6L6 18M6 6l12 12";
      break;
    default:
      typeClasses = 'bg-gray-700 text-white';
      iconPath = "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z";
      break;
  }

  return (
    <div className={`${baseClasses} ${typeClasses}`} role="alert">
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={iconPath} />
      </svg>
      <span className="font-semibold text-sm">{message}</span>
    </div>
  );
};

// --- VIEW COMPONENTS ---

interface DashboardViewProps {
  data: DashboardData;
}

const DashboardView: React.FC<DashboardViewProps> = ({ data }) => {
  const cards = [
    { 
      label: "Today's Earning", 
      value: formatCurrency(data.today), 
      variant: 'gold' as CardVariant, 
      icon: <svg className="w-8 h-8 text-[#b68938]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> 
    },
    { 
      label: "Wallet Balance", 
      value: formatCurrency(data.wallet), 
      variant: 'emerald' as CardVariant, 
      icon: <WalletIcon className="w-8 h-8 text-emerald-500" />, 
      info: "Available to withdraw" 
    },
    { 
      label: "All Time Earning", 
      value: formatCurrency(data.allTime), 
      variant: 'violet' as CardVariant, 
      icon: <TrendingUpIcon className="w-8 h-8 text-violet-500" />, 
      size: "lg:col-span-1" 
    },
    { 
      label: "7 Days Earning", 
      value: formatCurrency(data.week), 
      variant: 'neutral' as CardVariant, 
      icon: <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> 
    },
    { 
      label: "28 Days Earning", 
      value: formatCurrency(data.days28), 
      variant: 'neutral' as CardVariant, 
      icon: <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="21"></line><path d="M12 15h.01"></path><path d="M16 15h.01"></path><path d="M8 15h.01"></path></svg> 
    },
    { 
      label: "Consistency", 
      value: `${data.consistencyDays} Days`, 
      variant: 'blue' as CardVariant, 
      icon: <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, 
      info: "Active Streak" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <GlassCard key={index} className={`${card.size || ''} p-8 group`} variant={card.variant}>
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-300 transition-colors">
              {card.label}
            </p>
            {card.icon}
          </div>
          
          <GradientText variant={card.variant} className="text-5xl font-black tracking-tight block mb-4">
            {card.value}
          </GradientText>
          
          {card.info && (
            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-gray-500 font-medium">{card.info}</p>
            </div>
          )}
        </GlassCard>
      ))}
    </div>
  );
};

interface ReferralViewProps {
  userId: string;
  showToast: (message: string, type?: ToastType) => void;
}

const ReferralView: React.FC<ReferralViewProps> = ({ userId, showToast }) => {
  const [copiedPackage, setCopiedPackage] = useState<string | null>(null);
  
  const handleCopy = async (referralLink: string, packageId: string): Promise<void> => {
    const success = await copyTextToClipboard(referralLink);
    if (success) {
      setCopiedPackage(packageId);
      showToast(`${MOCK_REFERRAL_PACKAGES.find(p => p.id === packageId)?.name} link copied!`, 'success');
      setTimeout(() => setCopiedPackage(null), 2000);
    } else {
      showToast('Failed to copy link. Please try again.', 'error');
    }
  };

  const generateReferralLink = (packageId: string): string => {
    const baseUrl: string = `https://app.srkbank.io`;
    const encodedUserId: string = encodeURIComponent(userId || 'demo-user');
    const encodedPackageId: string = encodeURIComponent(packageId);
    return `${baseUrl}/affiliate?ref=${encodedUserId}&package=${encodedPackageId}&source=referral`;
  };

  return (
    <div className="space-y-10">
      {/* Header Card */}
      <GlassCard className="p-10 text-center" variant="gold">
        <div className="flex flex-col items-center">
          <ShareIcon className="w-16 h-16 text-[#e1ba73]/80 mx-auto mb-6" />
          <h3 className="text-4xl font-bold mb-4 text-white">
            <GradientText variant="gold">Share & Earn Commission</GradientText>
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
            Each package has a unique referral link. Earn different commission rates based on the package your referral purchases.
          </p>
          <div className="mt-6 px-4 py-2 bg-black/40 rounded-full border border-[#b68938]/30">
            <span className="text-sm text-gray-400">Your Referral ID: </span>
            <span className="font-mono text-[#e1ba73] font-bold">{userId || 'demo-user'}</span>
          </div>
        </div>
      </GlassCard>

      {/* Package Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {MOCK_REFERRAL_PACKAGES.map((pkg: ReferralPackage) => {
          const referralLink: string = generateReferralLink(pkg.id);
          
          const getPackageStyles = () => {
            switch(pkg.variant) {
              case 'violet':
                return {
                  button: 'bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800',
                  gradient: 'from-violet-500 to-purple-600',
                  border: 'border-violet-500/30',
                  bg: 'bg-violet-900/10',
                  text: 'text-violet-300'
                };
              case 'gold':
                return {
                  button: 'bg-gradient-to-r from-[#b68938] to-[#d4af37] hover:from-[#d4af37] hover:to-[#b68938]',
                  gradient: 'from-[#e1ba73] to-[#d4af37]',
                  border: 'border-[#b68938]/40',
                  bg: 'bg-[#b68938]/10',
                  text: 'text-[#e1ba73]'
                };
              default: // blue
                return {
                  button: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700',
                  gradient: 'from-blue-400 to-cyan-500',
                  border: 'border-blue-500/30',
                  bg: 'bg-blue-900/10',
                  text: 'text-blue-300'
                };
            }
          };

          const styles = getPackageStyles();

          return (
            <GlassCard 
              key={pkg.id} 
              className="p-8 flex flex-col h-full transform hover:scale-[1.02] transition-transform duration-300" 
              variant={pkg.variant}
            >
              {/* Package Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-2xl font-extrabold text-white mb-1">{pkg.name}</h4>
                    <p className={`text-sm font-semibold ${styles.text}`}>
                      {pkg.commission} Commission Rate
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${styles.bg} ${styles.border} border`}>
                    <span className="text-lg font-black text-white">
                      {formatCurrency(pkg.price)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">{pkg.description}</p>
                
                {/* Features List */}
                <div className="space-y-2 mb-6">
                  {pkg.features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircleIcon className={`w-4 h-4 ${styles.text}`} />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Commission Badge */}
              <div className="mb-6">
                <div className={`inline-flex items-center px-4 py-2 rounded-full ${styles.bg} ${styles.border} border`}>
                  <span className={`text-lg font-black ${styles.text}`}>
                    Earn {pkg.commission} per sale
                  </span>
                </div>
              </div>
              
              {/* Link Section */}
              <div className="mt-auto">
                <div className="mb-3">
                  <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">
                    Unique Referral Link:
                  </p>
                  <div className="relative group">
                    <input
                      readOnly
                      value={referralLink}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm font-mono truncate pr-24 hover:border-white/20 transition-colors"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <div className="absolute right-1 top-1 bottom-1 flex items-center">
                      <button
                        onClick={() => handleCopy(referralLink, pkg.id)}
                        className={`h-full px-5 rounded-lg font-bold text-sm text-white transition-all duration-300 uppercase flex items-center gap-2 ${styles.button} ${
                          copiedPackage === pkg.id ? 'scale-95' : ''
                        }`}
                      >
                        {copiedPackage === pkg.id ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <CopyIcon className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* QR Code Preview (Optional) */}
                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                  <span>Link for {pkg.name.toLowerCase()} package</span>
                  <span className="font-mono bg-black/30 px-2 py-1 rounded">
                    {pkg.id}
                  </span>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Stats Summary */}
      <GlassCard className="p-8" variant="neutral">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 border border-white/10 rounded-2xl bg-black/20">
            <div className="text-3xl font-black text-white mb-2">3</div>
            <p className="text-gray-400 text-sm">Active Packages</p>
          </div>
          <div className="text-center p-6 border border-white/10 rounded-2xl bg-black/20">
            <div className="text-3xl font-black text-[#e1ba73] mb-2">20%</div>
            <p className="text-gray-400 text-sm">Max Commission</p>
          </div>
          <div className="text-center p-6 border border-white/10 rounded-2xl bg-black/20">
            <div className="text-3xl font-black text-emerald-400 mb-2">{formatCurrency(12500)}</div>
            <p className="text-gray-400 text-sm">Total Referral Earnings</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

interface MySalesViewProps {
  salesData: SalesData[];
}

const MySalesView: React.FC<MySalesViewProps> = ({ salesData }) => {
  const [detailsOpen, setDetailsOpen] = useState<string | null>(null);

  if (!salesData || salesData.length === 0) {
    return (
      <GlassCard className="p-16 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <ShoppingBagIcon className="w-10 h-10 text-gray-600" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Sales Yet</h3>
        <p className="text-gray-500">Your journey begins now.</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {salesData.map((pkg: SalesData) => (
        <GlassCard key={pkg.id} className="p-0" hoverEffect={false}>
          <div
            className="p-8 flex flex-col md:flex-row md:items-center cursor-pointer hover:bg-white/5 transition-colors rounded-3xl"
            onClick={() => setDetailsOpen(detailsOpen === pkg.id ? null : pkg.id)}
          >
            <div className="flex-grow mb-4 md:mb-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="px-3 py-1 rounded-full bg-violet-600/10 border border-violet-600/20 text-xs font-bold text-violet-400 uppercase">
                  Item
                </span>
                <h4 className="text-2xl font-bold text-white">{pkg.packageName}</h4>
              </div>
              <p className="text-sm text-gray-500">
                Value: <span className="text-violet-300 font-medium">{formatCurrency(pkg.price)}</span>
              </p>
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-8">
              <div className="text-right">
                <span className="block text-3xl font-black text-white">{pkg.salesCount}</span>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Sold</p>
              </div>
              <div className={`
                w-10 h-10 rounded-full border border-white/10 flex items-center justify-center 
                transition-all duration-300
                ${detailsOpen === pkg.id ? 'bg-violet-500 text-white rotate-180' : 'bg-white/5 text-gray-400'}
              `}>
                <ChevronDownIcon className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className={`
            overflow-hidden transition-all duration-500
            ${detailsOpen === pkg.id ? 'max-h-[500px]' : 'max-h-0'}
          `}>
            <div className="px-8 pb-8">
              <div className="bg-black/40 rounded-2xl border border-white/5 p-6">
                <h5 className="text-xs uppercase tracking-widest text-gray-500 mb-6 font-bold">Buyers</h5>
                <div className="space-y-3">
                  {pkg.customers?.map((customer: Customer, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-violet-600/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-sm font-bold text-violet-400">
                          {customer.name.charAt(0)}
                        </div>
                        <span className="font-bold text-gray-200">{customer.name}</span>
                      </div>
                      <span className="text-xs font-mono text-gray-600 bg-black/60 px-3 py-1.5 rounded-lg border border-white/5">
                        {customer.userId}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

interface LeaderboardViewProps {
  leaderboardData: LeaderboardEntry[];
}

const LeaderboardView: React.FC<LeaderboardViewProps> = ({ leaderboardData }) => {
  return (
    <GlassCard className="pb-4" hoverEffect={false} variant="gold">
      <div className="p-8 border-b border-white/10">
        <h3 className="text-2xl font-bold text-white">Top Sellers</h3>
        <p className="text-gray-500 text-sm mt-1">Global performance rankings by total earning</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-8 py-5 font-bold text-left">Rank</th>
              <th className="px-6 py-5 font-bold text-left">User</th>
              <th className="px-6 py-5 font-bold text-right">Today</th>
              <th className="px-6 py-5 font-bold text-right hidden md:table-cell">Week</th>
              <th className="px-6 py-5 font-bold text-right hidden lg:table-cell">Month</th>
              <th className="px-8 py-5 font-bold text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {leaderboardData.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-600">Loading...</td></tr>
            ) : (
              leaderboardData.map((entry: LeaderboardEntry, index: number) => {
                const isCurrentUser: boolean | undefined = entry.isCurrent;
                return (
                  <tr key={index} className={`transition-colors ${isCurrentUser ? 'bg-amber-600/10 hover:bg-amber-600/20' : 'hover:bg-white/5'}`}>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className={`
                        w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm
                        ${index === 0 ? 'bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black shadow-lg shadow-amber-900/50' : 
                          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                          index === 2 ? 'bg-gradient-to-br from-orange-700 to-orange-900 text-white' :
                          'text-gray-500 bg-white/5'}
                      `}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`font-semibold ${isCurrentUser ? 'text-amber-300' : 'text-gray-400'}`}>
                        {entry.username}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-gray-400 font-mono text-sm">
                      {formatCurrency(entry.todayEarning)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-gray-500 font-mono text-sm hidden md:table-cell">
                      {formatCurrency(entry.weekEarning)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-gray-500 font-mono text-sm hidden lg:table-cell">
                      {formatCurrency(entry.monthEarning)}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-right font-bold text-white font-mono">
                      {formatCurrency(entry.totalAmountEarned)}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

interface PayoutViewProps {
  payouts: Payout[];
}

const PayoutView: React.FC<PayoutViewProps> = ({ payouts }) => {
  const getStatusStyle = (status: PayoutStatus): string => {
    switch (status) {
      case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Processing': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Failed': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <GlassCard className="p-0" hoverEffect={false} variant="emerald">
      <div className="p-8 border-b border-white/10">
        <h3 className="text-2xl font-bold text-white">Payout History</h3>
        <p className="text-sm text-gray-500 mt-1">Review your completed and pending transactions</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black/20">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
              <th className="px-8 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
              <th className="px-8 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {payouts.length === 0 ? (
              <tr><td colSpan={3} className="px-8 py-12 text-center text-gray-500">No transactions recorded.</td></tr>
            ) : (
              payouts.map((payout: Payout) => (
                <tr key={payout.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-300 font-medium">
                    {payout.date instanceof Date ? payout.date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : String(payout.date)}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-right text-white font-mono">
                    {formatCurrency(payout.amount)}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-center">
                    <span className={`px-4 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full border ${getStatusStyle(payout.status)}`}>
                      {payout.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

interface SettingsViewProps {
  userId: string;
  appId: string;
}

const SettingsView: React.FC<SettingsViewProps> = ({ userId, appId }) => {
  return (
    <div className="space-y-6 max-w-4xl">
      <GlassCard className="p-8" variant="rose">
        <h3 className="text-2xl font-bold mb-4 text-white">Account Information</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-gray-400 font-medium">User ID:</span>
            <span className="font-mono text-sm text-rose-300 break-all">{userId || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-gray-400 font-medium">App ID:</span>
            <span className="font-mono text-sm text-gray-500 break-all">{appId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 font-medium">Email:</span>
            <span className="font-mono text-sm text-gray-300">user@example.com (Mock)</span>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-8" hoverEffect={true}>
        <h3 className="text-2xl font-bold mb-4 text-white">Security & Access</h3>
        <p className="text-gray-500 mb-6">Manage your password, two-factor authentication, and connected devices.</p>
        <button className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors border border-white/10">
          Update Security Settings
        </button>
      </GlassCard>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const initialEarningData: DashboardData = { 
  today: 0, 
  week: 0, 
  days28: 0, 
  allTime: 0, 
  wallet: 0, 
  consistencyDays: 0 
};

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, color: 'text-[#e1ba73]' },
  { id: 'referral', label: 'Referral', icon: ShareIcon, color: 'text-blue-400' },
  { id: 'mysales', label: 'My Sales', icon: ShoppingBagIcon, color: 'text-violet-400' },
  { id: 'leaderboard', label: 'Leaderboard', icon: TrendingUpIcon, color: 'text-emerald-400' },
  { id: 'payout', label: 'Payout', icon: WalletIcon, color: 'text-cyan-400' },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, color: 'text-rose-400' },
  { id: 'srkbank', label: 'SRK Bank', icon: BanknoteIcon, external: true, color: 'text-gray-500' },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewId>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<ToastType>('success');
  const [userId, setUserId] = useState<string>('demo-user-12345');
  const [dashboardData, setDashboardData] = useState<DashboardData>(initialEarningData);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);
  const [payoutHistory, setPayoutHistory] = useState<Payout[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const currentTitle: string = useMemo(() => 
    navItems.find(item => item.id === currentView)?.label || 'Dashboard', 
    [currentView]
  );

  const showToast = useCallback((message: string, type: ToastType = 'success'): void => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const openSrkBank = (): void => {
    window.open('https://www.srkbank.example.com', '_blank');
    showToast('Redirecting to SRK Bank...');
  };

  const handleNavigation = (viewId: ViewId): void => {
    if (viewId === 'srkbank') {
      openSrkBank();
    } else {
      setCurrentView(viewId);
      setIsSidebarOpen(false);
    }
  };

  // Load mock data (replaces Firebase functionality)
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setDashboardData(MOCK_DASHBOARD_DATA);
      setSalesData(MOCK_SALES_DATA);
      setPayoutHistory(MOCK_PAYOUTS);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const renderCurrentView = (): ReactNode => {
    if (isLoading) {
      return (
        <GlassCard className="p-16 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/50 border-t-2 border-white/50 border-[#e1ba73] mb-4"></div>
          <h3 className="text-xl font-bold text-white mb-2">Loading Dashboard...</h3>
          <p className="text-gray-500">Preparing your data. Please wait.</p>
        </GlassCard>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <DashboardView data={dashboardData} />;
      case 'referral':
        return <ReferralView userId={userId} showToast={showToast} />;
      case 'mysales':
        return <MySalesView salesData={salesData} />;
      case 'leaderboard':
        return <LeaderboardView leaderboardData={leaderboardData} />;
      case 'payout':
        return <PayoutView payouts={payoutHistory} />;
      case 'settings':
        return <SettingsView userId={userId} appId={APP_ID} />;
      default:
        return <DashboardView data={dashboardData} />;
    }
  };
  
  interface SidebarProps {
      isMobile: boolean;
  }

  const Sidebar: React.FC<SidebarProps> = ({ isMobile }) => (
    <div className={`
      ${isMobile ? 'fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300' : 'hidden md:fixed md:top-0 md:left-0 md:h-full md:w-64 md:flex'}
      ${isMobile && isSidebarOpen ? 'translate-x-0' : (isMobile ? '-translate-x-full' : '')}
      flex-col
      bg-[#140f0a]/90 backdrop-blur-xl border-r border-[#b68938]/10
      shadow-xl shadow-black/50
    `}>
      {/* Sidebar Header/Logo */}
      <div className="h-20 flex items-center justify-between p-4 px-6 border-b border-[#b68938]/10">
        <h1 className="text-3xl font-black">
          <GradientText variant="gold" className="tracking-widest">SRK</GradientText> 
          <span className='font-light text-white'> GROW</span>
        </h1>
        {isMobile && (
          <button onClick={() => setIsSidebarOpen(false)} className="text-white hover:text-[#e1ba73]">
            <XIcon className="w-6 h-6" />
          </button>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex flex-col space-y-2 p-6 flex-grow">
        {navItems.map((item: NavItem) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id)}
            className={`
              flex items-center space-x-4 p-3 rounded-xl transition-all duration-300 text-left
              ${currentView === item.id && !item.external 
                ? 'bg-[#b68938]/20 text-[#e1ba73] font-semibold border border-[#b68938]/40 shadow-md'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'}
              ${item.external ? 'border border-gray-700/50 hover:border-gray-600/50 hover:bg-white/5' : ''}
            `}
          >
            {React.createElement(item.icon, { className: `w-5 h-5 ${item.color} ${item.external ? 'opacity-50' : ''}` })}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Profile/Footer */}
      <div className="p-6 border-t border-[#b68938]/10">
          <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#b68938]/20 border-2 border-[#e1ba73] flex items-center justify-center text-sm font-bold text-[#e1ba73]">
                  {userId ? userId.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-xs">
                  <p className="font-semibold text-white">Affiliate User</p>
                  <p className="text-gray-500 font-mono break-all" title={userId}>
                    {userId || 'Loading...'}
                  </p>
              </div>
          </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-inter relative overflow-hidden">
      <BackgroundEffects />

      {/* Sidebar (Desktop & Mobile) */}
      <Sidebar isMobile={false} />
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
      <Sidebar isMobile={true} />

      {/* Main Content */}
      <main className="transition-all duration-300 md:ml-64 p-4 sm:p-8 relative z-10">
        
        {/* Header/Mobile Nav Toggle */}
        <header className="flex items-center justify-between h-16 mb-8 border-b border-white/5 pb-4">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-white hover:text-[#e1ba73]">
              <MenuIcon className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-extralight text-white">
              <GradientText variant="gold">{currentTitle}</GradientText>
            </h2>
          </div>
          {isLoading && (
            <div className="flex items-center space-x-2 text-sm text-[#e1ba73]">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              <span>Loading...</span>
            </div>
          )}
        </header>

        {/* View Content */}
        {renderCurrentView()}
      </main>

      {/* Toast Notification */}
      {toastMessage && <Toast message={toastMessage} type={toastType} />}
    </div>
  );
}

export default App;