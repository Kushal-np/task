import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode, SVGProps } from 'react';

// --- TYPE DECLARATIONS ---
declare const __app_id: string | undefined;
declare const __initial_auth_token: string | undefined;

// --- THEME CONSTANTS (Enhanced) ---
const GOLD_PRIMARY = '#E1BA73';
const GOLD_ACCENT = '#B68938';
const GOLD_LIGHT = '#F5E8D0';
const GOLD_DARK = '#9D7C4A';
const DARK_BG = '#0A0705';
const DARK_CARD = '#14110E';
const TEXT_LIGHT = '#F5F5F5';
const TEXT_DARK = '#1A1715';
const SUCCESS = '#10B981';
const ERROR = '#EF4444';
const WARNING = '#F59E0B';
const INFO = '#3B82F6';

// Glass effect styles
const GLASS_STYLE = {
  background: 'rgba(20, 17, 14, 0.85)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(225, 186, 115, 0.15)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
};

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
  avatar: string;
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
  rank: number;
  username: string;
  todayEarning: number;
  weekEarning: number;
  totalAmountEarned: number;
  avatarColor: string;
  avatarText: string;
  trend: 'up' | 'down' | 'stable';
  isCurrent?: boolean;
  shares: number;
  referralCount: number;
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

interface UserProfile {
  name: string;
  email: string;
  userId: string;
  avatarUrl: string;
  coins: number;
  totalShares: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

type ViewId = 'dashboard' | 'referral' | 'mysales' | 'leaderboard' | 'payout' | 'profile' | 'srkbank';
type ToastType = 'success' | 'error' | 'info';
type CardVariant = 'neutral' | 'gold' | 'emerald' | 'violet' | 'blue' | 'rose' | 'cyan';

interface NavItem {
  id: ViewId;
  label: string;
  icon: React.FC<SVGProps<SVGSVGElement>>;
  color: string;
  external?: boolean;
}

// --- ENVIRONMENT CONFIG ---
const APP_ID: string = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- UTILITY FUNCTIONS ---
const convertToRupees = (usd: number): number => usd * 83.5; // Approximate conversion rate
const formatRupees = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatCompactRupees = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
};

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

// --- MOCK DATA (Updated with Rupees) ---
const MOCK_DASHBOARD_DATA: DashboardData = { 
  today: convertToRupees(450), 
  week: convertToRupees(3200), 
  days28: convertToRupees(11500), 
  allTime: convertToRupees(51200), 
  wallet: convertToRupees(4890.50), 
  consistencyDays: 14 
};

const MOCK_SALES_DATA: SalesData[] = [
  { 
    id: 'bronze', 
    packageName: 'Bronze Access', 
    salesCount: 50, 
    price: convertToRupees(500), 
    customers: [
      { name: 'Alistair S.', userId: 'user-78a3', avatar: 'AS' }, 
      { name: 'Brenda M.', userId: 'user-34b2', avatar: 'BM' }, 
      { name: 'Carl P.', userId: 'user-c8c9', avatar: 'CP' }
    ] 
  },
  { 
    id: 'silver', 
    packageName: 'Silver Mastery', 
    salesCount: 15, 
    price: convertToRupees(1500), 
    customers: [
      { name: 'Donna E.', userId: 'user-1f2d', avatar: 'DE' }, 
      { name: 'Ethan T.', userId: 'user-9e4a', avatar: 'ET' }
    ] 
  },
  { 
    id: 'gold', 
    packageName: 'Gold Elite', 
    salesCount: 5, 
    price: convertToRupees(5000), 
    customers: [
      { name: 'Fiona G.', userId: 'user-2h1g', avatar: 'FG' }
    ] 
  },
];

const MOCK_PAYOUTS: Payout[] = [
  { id: 'p1', date: new Date('2025-10-15'), amount: convertToRupees(1250.00), status: 'Completed' },
  { id: 'p2', date: new Date('2025-11-01'), amount: convertToRupees(980.50), status: 'Completed' },
  { id: 'p3', date: new Date('2025-11-20'), amount: convertToRupees(310.75), status: 'Processing' },
  { id: 'p4', date: new Date('2025-12-05'), amount: convertToRupees(2000.00), status: 'Completed' },
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, username: 'AlphaTraderX', todayEarning: convertToRupees(500), weekEarning: convertToRupees(3500), totalAmountEarned: convertToRupees(55000), avatarColor: '#FFD700', avatarText: 'AT', trend: 'up', shares: 245, referralCount: 89 },
  { rank: 2, username: 'Ben Sharma', todayEarning: convertToRupees(450), weekEarning: convertToRupees(3200), totalAmountEarned: convertToRupees(51200), avatarColor: SUCCESS, avatarText: 'BS', trend: 'up', isCurrent: true, shares: 218, referralCount: 76 },
  { rank: 3, username: 'CryptoGuru', todayEarning: convertToRupees(390), weekEarning: convertToRupees(2900), totalAmountEarned: convertToRupees(45000), avatarColor: '#8B5CF6', avatarText: 'CG', trend: 'stable', shares: 192, referralCount: 65 },
  { rank: 4, username: 'FinanceWhiz', todayEarning: convertToRupees(350), weekEarning: convertToRupees(2500), totalAmountEarned: convertToRupees(38000), avatarColor: ERROR, avatarText: 'FW', trend: 'down', shares: 165, referralCount: 54 },
  { rank: 5, username: 'MarketWizard', todayEarning: convertToRupees(300), weekEarning: convertToRupees(2000), totalAmountEarned: convertToRupees(35000), avatarColor: INFO, avatarText: 'MW', trend: 'up', shares: 142, referralCount: 48 },
  { rank: 6, username: 'WealthMaster', todayEarning: convertToRupees(280), weekEarning: convertToRupees(1900), totalAmountEarned: convertToRupees(32000), avatarColor: WARNING, avatarText: 'WM', trend: 'up', shares: 128, referralCount: 42 },
  { rank: 7, username: 'TradePro', todayEarning: convertToRupees(250), weekEarning: convertToRupees(1800), totalAmountEarned: convertToRupees(30000), avatarColor: '#EC4899', avatarText: 'TP', trend: 'stable', shares: 115, referralCount: 38 },
  { rank: 8, username: 'InvestSensei', todayEarning: convertToRupees(220), weekEarning: convertToRupees(1700), totalAmountEarned: convertToRupees(28000), avatarColor: '#06B6D4', avatarText: 'IS', trend: 'down', shares: 98, referralCount: 34 },
  { rank: 9, username: 'AlphaInvestor', todayEarning: convertToRupees(200), weekEarning: convertToRupees(1600), totalAmountEarned: convertToRupees(26000), avatarColor: '#84CC16', avatarText: 'AI', trend: 'up', shares: 85, referralCount: 29 },
  { rank: 10, username: 'MarketMaven', todayEarning: convertToRupees(180), weekEarning: convertToRupees(1500), totalAmountEarned: convertToRupees(24000), avatarColor: '#F97316', avatarText: 'MM', trend: 'stable', shares: 72, referralCount: 26 },
];

const MOCK_REFERRAL_PACKAGES: ReferralPackage[] = [
  { 
    id: 'starter', 
    name: 'Starter Access', 
    description: 'Perfect for beginners.', 
    commission: '10%', 
    variant: 'blue',
    price: convertToRupees(99),
    features: ['Basic access', '10% commission', 'Email support']
  },
  { 
    id: 'intermediate', 
    name: 'Pro Mastery', 
    description: 'Unlock advanced features.', 
    commission: '15%', 
    variant: 'violet',
    price: convertToRupees(299),
    features: ['Advanced tools', '15% commission', 'Priority support', 'Webinars']
  },
  { 
    id: 'pro', 
    name: 'Elite Partner', 
    description: 'Exclusive benefits.', 
    commission: '20%', 
    variant: 'gold',
    price: convertToRupees(999),
    features: ['All features', '20% commission', '24/7 support', 'Private coaching']
  },
];

const MOCK_USER_PROFILE: UserProfile = {
  name: 'Ben Sharma',
  email: 'ben.sharma@example.com',
  userId: 'user-abc123',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ben&backgroundColor=ffd700',
  coins: 2450,
  totalShares: 218,
  emailNotifications: true,
  pushNotifications: false,
};

// --- ICONS ---
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
    <path d="M21 12V7H5a2 2 0 1 1 0-4h14v4"></path>
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4z"></path>
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

const UserIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const CheckCircleIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const SparklesIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L13.063 8.5A2 2 0 0 0 14.5 9.937l6.135 1.581a.5.5 0 0 1 0 .962L14.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"></path>
  </svg>
);

const WithdrawIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
    <rect x="2" y="6" width="20" height="12" rx="2"></rect>
  </svg>
);

const CoinIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
    <line x1="9" y1="9" x2="9.01" y2="9"></line>
    <line x1="15" y1="9" x2="15.01" y2="9"></line>
  </svg>
);

const ShareCountIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

const NotificationIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

// --- VISUAL COMPONENTS ---
const BackgroundEffects: React.FC = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0A0705] via-[#1A120B] to-[#0A0705]"></div>
    <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#E1BA73]/10 rounded-full blur-[128px] animate-pulse opacity-30"></div>
    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#B68938]/10 rounded-full blur-[128px] animate-pulse opacity-30" style={{animationDelay: '1s'}}></div>
    <div className="absolute inset-0 bg-[linear-gradient(rgba(225,186,115,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(225,186,115,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
  </div>
);

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  variant?: CardVariant;
  colSpan?: 1 | 2;
  rowSpan?: 1 | 2;
  padding?: 'sm' | 'md' | 'lg';
  blur?: 'sm' | 'md' | 'lg';
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = "", 
  hoverEffect = true, 
  variant = 'neutral',
  colSpan = 1,
  rowSpan = 1,
  padding = 'md',
  blur = 'md'
}) => {
  const getVariantColor = (): string => {
    switch(variant) {
      case 'gold': return GOLD_PRIMARY;
      case 'emerald': return SUCCESS;
      case 'violet': return '#8B5CF6';
      case 'blue': return INFO;
      case 'rose': return ERROR;
      case 'cyan': return '#06B6D4';
      default: return GOLD_LIGHT;
    }
  };

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6'
  };

  const colSpanClasses = {
    1: 'col-span-1',
    2: 'col-span-1 md:col-span-2'
  };

  const rowSpanClasses = {
    1: 'row-span-1',
    2: 'row-span-1 md:row-span-2'
  };

  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg'
  };

  const variantColor = getVariantColor();

  return (
    <div 
      className={`
        relative overflow-hidden
        rounded-2xl
        transition-all duration-300
        ${colSpanClasses[colSpan]}
        ${rowSpanClasses[rowSpan]}
        ${paddingClasses[padding]}
        ${blurClasses[blur]}
        ${hoverEffect ? 'hover:scale-[1.02] hover:shadow-2xl' : ''}
        ${className}
      `}
      style={{
        background: variant === 'neutral' 
          ? 'rgba(20, 17, 14, 0.7)'
          : `linear-gradient(135deg, ${variantColor}05, transparent 70%)`,
        border: `1px solid ${variant === 'neutral' ? 'rgba(225, 186, 115, 0.15)' : `${variantColor}30`}`,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      {hoverEffect && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-transparent via-white/3 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${variantColor}15, transparent 70%)`
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10" />
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
      case 'gold': return `from-[${GOLD_PRIMARY}] via-[${GOLD_LIGHT}] to-[${GOLD_ACCENT}]`;
      case 'emerald': return 'from-emerald-300 to-emerald-500';
      case 'violet': return 'from-violet-300 to-violet-500';
      case 'blue': return 'from-blue-300 to-blue-500';
      case 'rose': return 'from-rose-300 to-rose-500';
      case 'cyan': return 'from-cyan-300 to-cyan-500';
      default: return 'from-gray-300 to-gray-500';
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
  
  switch (type) {
    case 'success':
      typeClasses = `bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border border-emerald-500/30`;
      break;
    case 'error':
      typeClasses = `bg-gradient-to-r from-rose-600 to-rose-500 text-white border border-rose-500/30`;
      break;
    case 'info':
      typeClasses = `bg-gradient-to-r from-${GOLD_ACCENT} to-${GOLD_PRIMARY} text-white border border-${GOLD_PRIMARY}/30`;
      break;
    default:
      typeClasses = 'bg-gray-700 text-white';
      break;
  }

  return (
    <div className={`${baseClasses} ${typeClasses} backdrop-blur-md`} role="alert">
      {type === 'success' && <CheckCircleIcon className="w-4 h-4" />}
      <span className="font-semibold text-sm">{message}</span>
    </div>
  );
};

// --- VIEW COMPONENTS ---
interface DashboardViewProps {
  data: DashboardData;
  showToast: (message: string, type?: ToastType) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ data, showToast }) => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    // Simulate API call to SRK Bank
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      showToast('Withdrawal request sent to SRK Bank!', 'success');
    } catch (error) {
      showToast('Withdrawal failed. Please try again.', 'error');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const stats = [
    { 
      label: "Today", 
      value: formatRupees(data.today), 
      variant: 'gold' as CardVariant, 
      change: '+12%',
      icon: <SparklesIcon className="w-4 h-4" />,
      description: "Earnings today"
    },
    { 
      label: "Wallet", 
      value: formatRupees(data.wallet), 
      variant: 'emerald' as CardVariant,
      info: "Available for withdrawal",
      icon: <WalletIcon className="w-4 h-4" />,
      description: "Current balance"
    },
    { 
      label: "7 Days", 
      value: formatRupees(data.week), 
      variant: 'violet' as CardVariant,
      change: '+8%',
      icon: <TrendingUpIcon className="w-4 h-4" />,
      description: "Weekly earnings"
    },
    { 
      label: "All Time", 
      value: formatRupees(data.allTime), 
      variant: 'gold' as CardVariant,
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>,
      description: "Total earnings"
    },
    { 
      label: "28 Days", 
      value: formatRupees(data.days28), 
      variant: 'blue' as CardVariant,
      change: '+5%',
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="21"></line>
      </svg>,
      description: "Monthly earnings"
    },
    { 
      label: "Consistency", 
      value: `${data.consistencyDays} Days`, 
      variant: 'emerald' as CardVariant,
      info: "Active streak",
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>,
      description: "Daily activity streak"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Withdraw Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm">Your earnings and performance at a glance</p>
        </div>
        <button
          onClick={handleWithdraw}
          disabled={isWithdrawing || data.wallet <= 0}
          className={`
            relative overflow-hidden group
            px-6 py-3 rounded-xl
            font-bold text-sm
            transition-all duration-300
            flex items-center justify-center gap-2
            ${data.wallet <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          `}
          style={{
            background: `linear-gradient(135deg, ${GOLD_PRIMARY}, ${GOLD_ACCENT})`,
            boxShadow: `0 4px 20px ${GOLD_PRIMARY}40`
          }}
        >
          {isWithdrawing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              <WithdrawIcon className="w-4 h-4" />
              Withdraw {formatRupees(data.wallet)}
            </>
          )}
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
        </button>
      </div>

      {/* Small Tile Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat, index) => (
          <GlassCard key={index} variant={stat.variant} padding="sm" className="min-h-[140px]">
            <div className="h-full flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-[10px] text-gray-500">{stat.description}</p>
                </div>
                <div className="p-1.5 rounded-lg" style={{ 
                  background: stat.variant === 'gold' ? `${GOLD_PRIMARY}20` : 
                             stat.variant === 'emerald' ? `${SUCCESS}20` :
                             stat.variant === 'violet' ? `rgba(139, 92, 246, 0.2)` :
                             stat.variant === 'blue' ? `${INFO}20` :
                             'rgba(255, 255, 255, 0.1)'
                }}>
                  {React.cloneElement(stat.icon, {
                    className: `${stat.icon.props.className} ${
                      stat.variant === 'gold' ? `text-[${GOLD_PRIMARY}]` :
                      stat.variant === 'emerald' ? `text-[${SUCCESS}]` :
                      stat.variant === 'violet' ? 'text-[#8B5CF6]' :
                      stat.variant === 'blue' ? `text-[${INFO}]` :
                      'text-gray-400'
                    }`
                  })}
                </div>
              </div>
              
              <div className="mt-auto">
                <div className={`text-xl font-bold ${
                  stat.variant === 'gold' ? 'text-[#E1BA73]' :
                  stat.variant === 'emerald' ? 'text-emerald-400' :
                  stat.variant === 'violet' ? 'text-violet-400' :
                  stat.variant === 'blue' ? 'text-blue-400' :
                  'text-white'
                }`}>
                  {stat.value}
                </div>
                
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                  {stat.change && (
                    <span className={`text-xs font-medium ${
                      stat.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {stat.change}
                    </span>
                  )}
                  {stat.info && (
                    <span className="text-xs text-gray-500">{stat.info}</span>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard colSpan={2} variant="neutral">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-white">Performance Trends</h3>
              <p className="text-xs text-gray-500">Last 7 days earnings</p>
            </div>
            <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1 rounded-full">
              ↑ 18% this month
            </span>
          </div>
          <div className="h-40 flex items-end gap-2">
            {[40, 65, 80, 60, 75, 90, 85].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div 
                  className="w-full rounded-t-lg transition-all duration-300 group-hover:opacity-80"
                  style={{
                    height: `${height}%`,
                    background: `linear-gradient(to top, ${GOLD_PRIMARY}40, ${GOLD_ACCENT}60)`,
                    border: `1px solid ${GOLD_PRIMARY}50`,
                    borderBottom: 'none',
                    boxShadow: `0 -4px 12px ${GOLD_PRIMARY}30`
                  }}
                />
                <div className="mt-2">
                  <span className="text-xs text-gray-500">Day {i+1}</span>
                  <div className="text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{Math.round(height * 1250)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard variant="gold">
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E1BA73] to-[#B68938] rounded-full blur-lg opacity-50"></div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center relative z-10" style={{
                background: `linear-gradient(135deg, ${GOLD_PRIMARY}30, ${GOLD_ACCENT}50)`,
                border: `2px solid ${GOLD_PRIMARY}40`
              }}>
                <div className="text-2xl font-bold" style={{ color: GOLD_PRIMARY }}>
                  {data.consistencyDays}
                </div>
              </div>
            </div>
            <p className="text-sm font-medium text-white">Day Streak</p>
            <p className="text-xs text-gray-400 mt-1">Keep going!</p>
            <div className="mt-6 w-full">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Start</span>
                <span>Goal: 30 days</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min((data.consistencyDays / 30) * 100, 100)}%`,
                    background: `linear-gradient(90deg, ${GOLD_PRIMARY}, ${GOLD_ACCENT})`,
                    boxShadow: `0 0 20px ${GOLD_PRIMARY}40`
                  }}
                />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
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
      showToast('Link copied to clipboard!', 'success');
      setTimeout(() => setCopiedPackage(null), 2000);
    } else {
      showToast('Failed to copy link', 'error');
    }
  };

  const generateReferralLink = (packageId: string): string => {
    return `https://app.srkbank.io/affiliate?ref=${userId}&package=${packageId}`;
  };

  return (
    <div className="space-y-6">
      {/* Referral Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <GlassCard variant="gold" padding="sm">
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: GOLD_PRIMARY }}>3</div>
            <p className="text-xs text-gray-400 mt-1">Active Packages</p>
          </div>
        </GlassCard>
        
        <GlassCard variant="violet" padding="sm">
          <div className="text-center">
            <div className="text-lg font-bold text-violet-400">20%</div>
            <p className="text-xs text-gray-400 mt-1">Max Commission</p>
          </div>
        </GlassCard>
        
        <GlassCard variant="emerald" padding="sm">
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-400">{formatRupees(12500)}</div>
            <p className="text-xs text-gray-400 mt-1">Total Earned</p>
          </div>
        </GlassCard>
        
        <GlassCard variant="blue" padding="sm">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">42</div>
            <p className="text-xs text-gray-400 mt-1">Total Referrals</p>
          </div>
        </GlassCard>
      </div>

      {/* Package Cards in Compact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MOCK_REFERRAL_PACKAGES.map((pkg: ReferralPackage) => {
          const referralLink: string = generateReferralLink(pkg.id);
          
          const getPackageStyles = () => {
            switch(pkg.variant) {
              case 'violet':
                return {
                  bg: 'bg-violet-500/10',
                  border: 'border-violet-500/30',
                  text: 'text-violet-300',
                  button: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700',
                  iconBg: 'bg-violet-500/20',
                  glow: 'violet'
                };
              case 'gold':
                return {
                  bg: `bg-[${GOLD_PRIMARY}]/10`,
                  border: `border-[${GOLD_PRIMARY}]/30`,
                  text: `text-[${GOLD_PRIMARY}]`,
                  button: `bg-gradient-to-r from-[${GOLD_ACCENT}] to-[${GOLD_PRIMARY}] hover:from-[${GOLD_PRIMARY}] hover:to-[${GOLD_ACCENT}]`,
                  iconBg: `bg-[${GOLD_PRIMARY}]/20`,
                  glow: 'gold'
                };
              default: // blue
                return {
                  bg: 'bg-blue-500/10',
                  border: 'border-blue-500/30',
                  text: 'text-blue-300',
                  button: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700',
                  iconBg: 'bg-blue-500/20',
                  glow: 'blue'
                };
            }
          };

          const styles = getPackageStyles();

          return (
            <GlassCard key={pkg.id} variant={pkg.variant} className="min-h-[300px]">
              <div className="h-full flex flex-col">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-white text-lg mb-1">{pkg.name}</h4>
                      <p className={`text-sm font-medium ${styles.text}`}>
                        {pkg.commission} Commission
                      </p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg ${styles.bg} ${styles.border} border text-sm font-bold text-white`}>
                      {formatRupees(pkg.price)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">{pkg.description}</p>
                  
                  <div className="space-y-2">
                    {pkg.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${styles.iconBg}`}>
                          <CheckCircleIcon className="w-3 h-3" style={{ color: styles.text }} />
                        </div>
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-auto space-y-3">
                  <div>
                    <input
                      readOnly
                      value={referralLink}
                      className="w-full text-sm bg-black/30 border border-white/10 rounded-lg p-2 text-white font-mono truncate"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                  </div>
                  
                  <button
                    onClick={() => handleCopy(referralLink, pkg.id)}
                    className={`relative overflow-hidden group w-full py-2.5 rounded-lg font-bold text-sm text-white transition-all duration-300 flex items-center justify-center gap-2 ${styles.button} ${
                      copiedPackage === pkg.id ? 'scale-95' : ''
                    }`}
                  >
                    {copiedPackage === pkg.id ? (
                      <>
                        <CheckCircleIcon className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <CopyIcon className="w-4 h-4" />
                        Copy Link
                      </>
                    )}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                  </button>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

interface MySalesViewProps {
  salesData: SalesData[];
}

const MySalesView: React.FC<MySalesViewProps> = ({ salesData }) => {
  const [detailsOpen, setDetailsOpen] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Sales Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <GlassCard variant="gold" padding="sm">
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: GOLD_PRIMARY }}>
              {salesData.reduce((sum, p) => sum + p.salesCount, 0)}
            </div>
            <p className="text-xs text-gray-400 mt-1">Total Sales</p>
          </div>
        </GlassCard>
        
        <GlassCard variant="emerald" padding="sm">
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-400">
              {formatRupees(salesData.reduce((sum, p) => sum + (p.salesCount * p.price), 0))}
            </div>
            <p className="text-xs text-gray-400 mt-1">Total Revenue</p>
          </div>
        </GlassCard>
        
        <GlassCard variant="violet" padding="sm">
          <div className="text-center">
            <div className="text-lg font-bold text-violet-400">
              {salesData.length}
            </div>
            <p className="text-xs text-gray-400 mt-1">Active Packages</p>
          </div>
        </GlassCard>
        
        <GlassCard variant="blue" padding="sm">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">
              {salesData.reduce((sum, p) => sum + p.customers.length, 0)}
            </div>
            <p className="text-xs text-gray-400 mt-1">Total Customers</p>
          </div>
        </GlassCard>
      </div>

      {/* Sales Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {salesData.map((pkg: SalesData) => (
          <GlassCard key={pkg.id} variant="neutral" className="min-h-[200px]">
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-white text-lg mb-1">{pkg.packageName}</h4>
                  <p className="text-sm text-gray-500">
                    Price: <span className="text-violet-300 font-medium">{formatRupees(pkg.price)}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-white">{pkg.salesCount}</div>
                  <p className="text-xs text-gray-500">Sales</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Revenue</span>
                  <span className="font-bold text-white">{formatRupees(pkg.salesCount * pkg.price)}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-1.5 rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.min((pkg.salesCount / 100) * 100, 100)}%`,
                      background: `linear-gradient(90deg, ${GOLD_PRIMARY}, ${GOLD_ACCENT})`,
                      boxShadow: `0 0 10px ${GOLD_PRIMARY}40`
                    }}
                  />
                </div>
              </div>
              
              <div className="mt-auto pt-3 border-t border-white/5">
                <button
                  onClick={() => setDetailsOpen(detailsOpen === pkg.id ? null : pkg.id)}
                  className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 group"
                >
                  {detailsOpen === pkg.id ? 'Hide' : 'Show'} Customers
                  <ChevronDownIcon className={`w-4 h-4 transition-transform ${detailsOpen === pkg.id ? 'rotate-180' : ''} group-hover:scale-110`} />
                </button>
              </div>
              
              {detailsOpen === pkg.id && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <div className="space-y-2">
                    {pkg.customers.map((customer: Customer, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center text-violet-300 font-bold text-xs">
                            {customer.avatar}
                          </div>
                          <span className="text-sm text-gray-300">{customer.name}</span>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">{customer.userId}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

interface LeaderboardViewProps {
  leaderboardData: LeaderboardEntry[];
}

const LeaderboardView: React.FC<LeaderboardViewProps> = ({ leaderboardData }) => {
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'all'>('all');

  const getSortedData = useMemo(() => {
    const sorted = [...leaderboardData].sort((a, b) => {
      switch (timeFilter) {
        case 'today': return b.todayEarning - a.todayEarning;
        case 'week': return b.weekEarning - a.weekEarning;
        default: return b.totalAmountEarned - a.totalAmountEarned;
      }
    });
    
    return sorted.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  }, [leaderboardData, timeFilter]);

  const getDisplayAmount = (entry: LeaderboardEntry) => {
    switch (timeFilter) {
      case 'today': return entry.todayEarning;
      case 'week': return entry.weekEarning;
      default: return entry.totalAmountEarned;
    }
  };

  const getDisplayLabel = () => {
    switch (timeFilter) {
      case 'today': return 'Today';
      case 'week': return 'This Week';
      default: return 'All Time';
    }
  };

  const TrendIcon = ({ trend, size = 'sm' }: { trend: 'up' | 'down' | 'stable'; size?: 'sm' | 'lg' }) => {
    const colors = {
      up: 'text-emerald-400',
      down: 'text-rose-400',
      stable: 'text-gray-400'
    };

    const sizeClasses = {
      sm: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center ${
        trend === 'up' ? 'bg-emerald-500/20' : 
        trend === 'down' ? 'bg-rose-500/20' : 
        'bg-gray-500/20'
      }`}>
        <svg className={`${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-gray-400'} ${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {trend === 'up' ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
          ) : trend === 'down' ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14" />
          )}
        </svg>
      </div>
    );
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return {
        bg: 'bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-300',
        text: 'text-black',
        border: 'border-yellow-400/50',
        shadow: 'shadow-lg shadow-yellow-500/30'
      };
      case 2: return {
        bg: 'bg-gradient-to-br from-gray-400 via-gray-300 to-gray-200',
        text: 'text-black',
        border: 'border-gray-300/50',
        shadow: 'shadow-lg shadow-gray-500/20'
      };
      case 3: return {
        bg: 'bg-gradient-to-br from-amber-700 via-amber-600 to-amber-500',
        text: 'text-white',
        border: 'border-amber-600/50',
        shadow: 'shadow-lg shadow-amber-700/20'
      };
      default: return {
        bg: 'bg-gradient-to-br from-gray-800/50 to-gray-900/50',
        text: 'text-gray-300',
        border: 'border-gray-700/50',
        shadow: ''
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
          <p className="text-gray-400 text-sm">Top performers this {timeFilter}</p>
        </div>
        
        {/* Filter Controls */}
        <div className="flex gap-2">
          {(['today', 'week', 'all'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`
                relative overflow-hidden group
                px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-300
                ${timeFilter === filter
                  ? `text-black bg-gradient-to-r from-[${GOLD_PRIMARY}] to-[${GOLD_ACCENT}]`
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }
              `}
            >
              {filter === 'today' ? 'Today' : filter === 'week' ? 'Week' : 'All Time'}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {getSortedData.slice(0, 3).map((entry) => {
          const rankStyle = getRankColor(entry.rank);
          return (
            <GlassCard key={entry.rank} variant={entry.rank === 1 ? 'gold' : 'neutral'} className="min-h-[280px]">
              <div className="h-full flex flex-col items-center text-center">
                {/* Rank Badge with Glass Effect */}
                <div className={`relative mb-4 ${entry.rank <= 3 ? 'scale-110' : ''}`}>
                  <div className={`absolute inset-0 ${rankStyle.bg} rounded-full blur-md opacity-50`}></div>
                  <div className={`relative w-14 h-14 rounded-full flex items-center justify-center ${rankStyle.bg} ${rankStyle.border} border-2 ${rankStyle.shadow}`}>
                    <span className={`font-bold text-lg ${rankStyle.text}`}>#{entry.rank}</span>
                  </div>
                </div>
                
                {/* Avatar with Glass Effect */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-lg"></div>
                  <div className="relative w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl"
                       style={{ 
                         backgroundColor: entry.avatarColor,
                         boxShadow: `0 8px 32px ${entry.avatarColor}40`
                       }}>
                    {entry.avatarText}
                  </div>
                  {entry.isCurrent && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-bold rounded-full border border-emerald-400/30">
                      You
                    </div>
                  )}
                </div>
                
                {/* User Info */}
                <h3 className={`font-bold text-lg mb-1 ${entry.isCurrent ? 'text-emerald-400' : 'text-white'}`}>
                  {entry.username}
                </h3>
                
                {/* Stats */}
                <div className="mt-3 grid grid-cols-2 gap-3 w-full">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Shares</div>
                    <div className="font-bold text-white">{entry.shares}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Referrals</div>
                    <div className="font-bold text-white">{entry.referralCount}</div>
                  </div>
                </div>
                
                {/* Earnings */}
                <div className="mt-auto w-full pt-4 border-t border-white/5">
                  <div className="text-xl font-bold" style={{ color: GOLD_PRIMARY }}>
                    {formatCompactRupees(getDisplayAmount(entry))}
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <TrendIcon trend={entry.trend} size="lg" />
                    <span className="text-xs text-gray-500">{getDisplayLabel()}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Leaderboard List */}
      <GlassCard variant="neutral" blur="lg">
        <div className="space-y-2">
          {getSortedData.slice(3).map((entry) => {
            const rankStyle = getRankColor(entry.rank);
            return (
              <div
                key={entry.rank}
                className={`
                  relative overflow-hidden group
                  flex items-center justify-between p-4 rounded-xl transition-all duration-300
                  ${entry.isCurrent ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-900/5' : 'hover:bg-white/5'}
                  border border-transparent hover:border-white/10
                `}
              >
                {/* Background Glow Effect */}
                {entry.isCurrent && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent"></div>
                )}
                
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Rank */}
                  <div className={`relative ${entry.rank <= 10 ? 'scale-110' : ''}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${rankStyle.bg} ${rankStyle.border} border`}>
                      <span className={`font-bold ${rankStyle.text}`}>#{entry.rank}</span>
                    </div>
                  </div>
                  
                  {/* Avatar */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-md"></div>
                    <div className="relative w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base"
                         style={{ 
                           backgroundColor: entry.avatarColor,
                           boxShadow: `0 4px 20px ${entry.avatarColor}30`
                         }}>
                      {entry.avatarText}
                    </div>
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium truncate ${entry.isCurrent ? 'text-emerald-400' : 'text-white'}`}>
                        {entry.username}
                      </span>
                      {entry.isCurrent && (
                        <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-full border border-emerald-400/30">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <ShareCountIcon className="w-3 h-3" />
                        <span>{entry.shares} shares</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <UserIcon className="w-3 h-3" />
                        <span>{entry.referralCount} refs</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <TrendIcon trend={entry.trend} />
                  <div className="text-right">
                    <div className="font-bold text-white">{formatCompactRupees(getDisplayAmount(entry))}</div>
                    <p className="text-xs text-gray-500">
                      {getDisplayLabel()}
                    </p>
                  </div>
                </div>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
};

interface PayoutViewProps {
  payouts: Payout[];
}

const PayoutView: React.FC<PayoutViewProps> = ({ payouts }) => {
  const getStatusStyle = (status: PayoutStatus): { bg: string; text: string; icon: ReactNode } => {
    switch (status) {
      case 'Completed': return { 
        bg: 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/5', 
        text: 'text-emerald-400',
        icon: <CheckCircleIcon className="w-3 h-3" />
      };
      case 'Processing': return { 
        bg: 'bg-gradient-to-r from-blue-500/10 to-blue-600/5', 
        text: 'text-blue-400',
        icon: <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      };
      case 'Failed': return { 
        bg: 'bg-gradient-to-r from-rose-500/10 to-rose-600/5', 
        text: 'text-rose-400',
        icon: <XIcon className="w-3 h-3" />
      };
      default: return { 
        bg: 'bg-gradient-to-r from-gray-500/10 to-gray-600/5', 
        text: 'text-gray-400',
        icon: null
      };
    }
  };

  const stats = [
    {
      label: 'Total Payouts',
      value: formatRupees(payouts.reduce((sum, p) => sum + p.amount, 0)),
      variant: 'gold' as CardVariant
    },
    {
      label: 'Completed',
      value: formatRupees(payouts.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0)),
      variant: 'emerald' as CardVariant
    },
    {
      label: 'Processing',
      value: formatRupees(payouts.filter(p => p.status === 'Processing').reduce((sum, p) => sum + p.amount, 0)),
      variant: 'blue' as CardVariant
    },
    {
      label: 'Transactions',
      value: payouts.length.toString(),
      variant: 'violet' as CardVariant
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <GlassCard key={index} variant={stat.variant} padding="sm">
            <div className="text-center">
              <div className={`text-lg font-bold ${
                stat.variant === 'gold' ? 'text-[#E1BA73]' :
                stat.variant === 'emerald' ? 'text-emerald-400' :
                stat.variant === 'blue' ? 'text-blue-400' :
                'text-violet-400'
              }`}>
                {stat.value}
              </div>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Payout History */}
      <GlassCard variant="neutral" blur="lg">
        <div className="space-y-3">
          {payouts.map((payout: Payout) => {
            const statusStyle = getStatusStyle(payout.status);
            return (
              <div key={payout.id} className="group relative">
                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent group-hover:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-amber-500/10 rounded-xl blur-sm"></div>
                      <div className="relative w-12 h-12 rounded-xl flex items-center justify-center" style={{
                        background: `linear-gradient(135deg, ${GOLD_PRIMARY}20, ${GOLD_ACCENT}40)`,
                        border: `1px solid ${GOLD_PRIMARY}30`
                      }}>
                        <WalletIcon className="w-5 h-5" style={{ color: GOLD_PRIMARY }} />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {payout.date instanceof Date 
                          ? payout.date.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : String(payout.date)}
                      </p>
                      <p className="text-xs text-gray-500">Transaction #{payout.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text} flex items-center gap-1.5 border ${statusStyle.text.replace('text-', 'border-')}/30`}>
                      {statusStyle.icon}
                      {payout.status}
                    </span>
                    <div className="text-right">
                      <div className="font-bold text-white">{formatRupees(payout.amount)}</div>
                      <div className="text-xs text-gray-500">Amount</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
};

interface ProfileViewProps {
  profile: UserProfile;
  showToast: (message: string, type?: ToastType) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, showToast }) => {
  const [emailNotifications, setEmailNotifications] = useState(profile.emailNotifications);
  const [pushNotifications, setPushNotifications] = useState(profile.pushNotifications);

  const handleNotificationToggle = (type: 'email' | 'push') => {
    if (type === 'email') {
      setEmailNotifications(!emailNotifications);
      showToast(
        emailNotifications ? 'Email notifications disabled' : 'Email notifications enabled',
        'info'
      );
    } else {
      setPushNotifications(!pushNotifications);
      showToast(
        pushNotifications ? 'Push notifications disabled' : 'Push notifications enabled',
        'info'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <GlassCard variant="gold" className="overflow-hidden">
        <div className="relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#E1BA73]/10 via-transparent to-[#B68938]/5"></div>
          
          <div className="relative z-10 p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Avatar */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#E1BA73] via-[#B68938] to-[#E1BA73] rounded-full blur-xl opacity-30"></div>
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/10">
                  <img 
                    src={profile.avatarUrl} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center border-4 border-gray-900">
                  <div className="text-lg font-bold text-white">✓</div>
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-2">{profile.name}</h2>
                <p className="text-gray-400 mb-4">{profile.email}</p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="bg-white/5 rounded-xl px-4 py-3 min-w-[140px]">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <CoinIcon className="w-4 h-4" />
                      <span className="text-sm">Coins</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{profile.coins.toLocaleString()}</div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl px-4 py-3 min-w-[140px]">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <ShareCountIcon className="w-4 h-4" />
                      <span className="text-sm">Total Shares</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{profile.totalShares.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Account Details & Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Information */}
        <GlassCard variant="neutral">
          <div className="space-y-6">
            <h3 className="font-bold text-white text-lg">Account Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">User ID</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 text-sm font-mono text-gray-300 bg-white/5 p-3 rounded-lg">
                    {profile.userId}
                  </div>
                  <button
                    onClick={() => {
                      copyTextToClipboard(profile.userId);
                      showToast('User ID copied!', 'success');
                    }}
                    className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <CopyIcon className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">Email Address</label>
                <div className="text-sm text-gray-300 bg-white/5 p-3 rounded-lg">
                  {profile.email}
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">Member Since</label>
                <div className="text-sm text-gray-300 bg-white/5 p-3 rounded-lg">
                  January 2024
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Notification Settings */}
        <GlassCard variant="neutral">
          <div className="space-y-6">
            <h3 className="font-bold text-white text-lg">Notification Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <NotificationIcon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Email Notifications</p>
                    <p className="text-xs text-gray-500">Receive updates via email</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationToggle('email')}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${emailNotifications ? 'bg-emerald-500' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${emailNotifications ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <NotificationIcon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Push Notifications</p>
                    <p className="text-xs text-gray-500">Receive browser notifications</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationToggle('push')}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${pushNotifications ? 'bg-blue-500' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${pushNotifications ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/5">
              <button
                onClick={() => showToast('Settings saved successfully!', 'success')}
                className="w-full py-3 rounded-lg font-bold text-white transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, ${GOLD_PRIMARY}, ${GOLD_ACCENT})`,
                  boxShadow: `0 4px 20px ${GOLD_PRIMARY}40`
                }}
              >
                Save Settings
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
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
  { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, color: `text-[${GOLD_PRIMARY}]` },
  { id: 'referral', label: 'Referral', icon: ShareIcon, color: 'text-blue-400' },
  { id: 'mysales', label: 'My Sales', icon: ShoppingBagIcon, color: 'text-violet-400' },
  { id: 'leaderboard', label: 'Leaderboard', icon: TrendingUpIcon, color: 'text-emerald-400' },
  { id: 'payout', label: 'Payout', icon: WalletIcon, color: 'text-cyan-400' },
  { id: 'profile', label: 'Profile', icon: UserIcon, color: 'text-gray-300' },
  { id: 'srkbank', label: 'SRK Bank', icon: BanknoteIcon, external: true, color: 'text-gray-400' },
];

const GrowDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewId>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<ToastType>('success');
  const [dashboardData, setDashboardData] = useState<DashboardData>(initialEarningData);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [payoutHistory, setPayoutHistory] = useState<Payout[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER_PROFILE);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    showToast('Redirecting to SRK Bank...', 'info');
  };

  const handleNavigation = (viewId: ViewId): void => {
    if (viewId === 'srkbank') {
      openSrkBank();
    } else {
      setCurrentView(viewId);
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setDashboardData(MOCK_DASHBOARD_DATA);
      setSalesData(MOCK_SALES_DATA);
      setLeaderboardData(MOCK_LEADERBOARD);
      setPayoutHistory(MOCK_PAYOUTS);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const renderCurrentView = (): ReactNode => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl min-h-[140px] animate-pulse" style={{
              background: 'rgba(20, 17, 14, 0.8)',
              border: '1px solid rgba(225, 186, 115, 0.1)',
            }} />
          ))}
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <DashboardView data={dashboardData} showToast={showToast} />;
      case 'referral':
        return <ReferralView userId={userProfile.userId} showToast={showToast} />;
      case 'mysales':
        return <MySalesView salesData={salesData} />;
      case 'leaderboard':
        return <LeaderboardView leaderboardData={leaderboardData} />;
      case 'payout':
        return <PayoutView payouts={payoutHistory} />;
      case 'profile':
        return <ProfileView profile={userProfile} showToast={showToast} />;
      default:
        return <DashboardView data={dashboardData} showToast={showToast} />;
    }
  };

  const Sidebar: React.FC<{ isMobile: boolean }> = ({ isMobile }) => (
    <div className={`
      ${isMobile ? 'fixed top-0 left-0 h-full w-64 z-50 transition-transform duration-300' : 'hidden md:flex md:fixed md:top-0 md:left-0 md:h-full md:w-64'}
      ${isMobile && isSidebarOpen ? 'translate-x-0' : (isMobile ? '-translate-x-full' : '')}
      flex-col
      shadow-2xl
      backdrop-blur-xl
    `}
    style={{
      background: 'rgba(20, 17, 14, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(225, 186, 115, 0.15)',
      boxShadow: '0 0 60px rgba(225, 186, 115, 0.1)'
    }}>
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#E1BA73] to-[#B68938] rounded-full blur-md opacity-70"></div>
            <div className="relative w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[#E1BA73] to-[#B68938]">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="font-bold text-white text-lg">SRK GROW</h1>
            <p className="text-xs" style={{ color: GOLD_PRIMARY }}>Gold Edition</p>
          </div>
          {isMobile && (
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="ml-auto p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <XIcon className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex flex-col space-y-1 p-4 flex-grow">
        {navItems.map((item: NavItem) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id)}
            className={`
              relative overflow-hidden group
              flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 text-left
              ${currentView === item.id && !item.external 
                ? `bg-gradient-to-r from-[${GOLD_PRIMARY}]/10 to-[${GOLD_PRIMARY}]/5 text-[${GOLD_PRIMARY}] font-medium border border-[${GOLD_PRIMARY}]/20`
                : 'text-gray-400 hover:text-white hover:bg-white/5'}
              ${item.external ? 'border border-gray-700/50 hover:border-gray-600/50' : ''}
            `}
          >
            {React.createElement(item.icon, { className: `w-5 h-5 ${item.color}` })}
            <span>{item.label}</span>
            {currentView === item.id && !item.external && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-1.5 h-6 rounded-l" 
                   style={{ 
                     background: `linear-gradient(180deg, ${GOLD_PRIMARY}, ${GOLD_ACCENT})`,
                     boxShadow: `0 0 10px ${GOLD_PRIMARY}`
                   }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        ))}
      </nav>

      {/* Profile Footer */}
      <div className="p-4 border-t border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#E1BA73] to-[#B68938] rounded-full blur-md opacity-50"></div>
            <div className="relative w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-[#E1BA73] to-[#B68938]">
              {userProfile.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="text-sm flex-1 min-w-0">
            <p className="font-medium text-white truncate">{userProfile.name}</p>
            <p className="text-gray-500 truncate" title={userProfile.userId}>{userProfile.userId}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-white font-sans relative overflow-hidden" style={{ backgroundColor: DARK_BG }}>
      <BackgroundEffects />
      
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebars */}
      <Sidebar isMobile={false} />
      <Sidebar isMobile={true} />

      {/* Main Content */}
      <main className="transition-all duration-300 md:ml-64">
        <div className="p-4 sm:p-6 relative z-10">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between mb-6 pb-4 border-b border-gray-800/50">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors backdrop-blur-sm"
              style={{
                background: 'rgba(20, 17, 14, 0.7)',
                border: '1px solid rgba(225, 186, 115, 0.15)'
              }}
            >
              <MenuIcon className="w-6 h-6 text-gray-400" />
            </button>
            <h2 className="text-lg font-bold text-white">{currentTitle}</h2>
            <div className="w-6" />
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">{currentTitle}</h2>
            {isLoading && (
              <div className="flex items-center space-x-2 text-sm" style={{ color: GOLD_PRIMARY }}>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                <span>Loading...</span>
              </div>
            )}
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(100vh-160px)] pr-2">
            {renderCurrentView()}
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && <Toast message={toastMessage} type={toastType} />}
    </div>
  );
}

export default GrowDashboard;