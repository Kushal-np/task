import React, { useState, useMemo, useEffect, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

// --- Type Definitions for Data Structures ---
interface User {
  id: string;
  name: string;
  role: 'Affiliate' | 'Client';
  package: string;
  balance: number;
  status: string;
  joinDate: string;
  referer: string; // Added referer field
}
interface MagneticButtonProps {
  // Fix: Explicitly define 'children' as ReactNode to resolve the TypeScript error
  children: ReactNode; 
  className?: string;
  onClick?: () => void;
}
interface TaskDetail {
  total: number;
  completed: number;
  status: 'Approved' | 'In Review' | 'Pending' | 'N/A';
  link: string;
}

interface PlatformTasks {
  follow: TaskDetail;
  video: TaskDetail;
  post: TaskDetail;
}

interface TaskMonitoringEntry {
  userId: string;
  platforms: {
    facebook: PlatformTasks;
    youtube: PlatformTasks;
    instagram: PlatformTasks;
    twitter: PlatformTasks;
    tiktok: PlatformTasks;
  };
}

interface PrivateTaskPerformance {
  userId: string;
  totalClicks: number;
  facebookClicks: number;
  youtubeClicks: number;
  instagramClicks: number;
  twitterClicks: number;
  tiktokClicks: number;
  link: string;
}

interface QueueItem {
  id: string;
  userId: string;
  amount: number;
  date: string;
  package?: string;
  status: string;
}

interface TrendItem {
  month: string;
  revenue: number;
  users: number;
}

interface AdminData {
  totalRevenue: number;
  totalPayouts: number;
  totalLiability: number;
  affiliateCount: number;
}

interface DashboardData extends AdminData {
  allUsers: User[];
  privateTaskPerformance: PrivateTaskPerformance[];
  taskMonitoringData: TaskMonitoringEntry[];
  trends: TrendItem[];
}

interface UserWithTasks extends User {
  completionPercentage: number;
  taskData: TaskMonitoringEntry;
}

// --- Theme Configuration ---
const THEME = {
  colors: {
    bgDeepBlack: '#0a0a0a',
    bgCard: 'rgba(26, 20, 16, 0.4)',
    goldAccent: '#b68938',
    goldLight: '#e1ba73',
    goldGradient: 'linear-gradient(135deg, #b68938 0%, #e1ba73 100%)',
    textWhite: '#F3F4F6',
    textGray: '#9CA3AF',
    greenSuccess: '#10B981',
    redAlert: '#EF4444',
    blueInfo: '#3B82F6',
    orangeWarn: '#F59E0B',
  },
  effects: {
    glass: 'backdrop-blur-xl',
    shadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    goldGlow: '0 0 20px rgba(182, 137, 56, 0.3)',
  }
};

// --- Mock Data with Referer field added ---
const ALL_USERS_DATA: User[] = [
  { id: 'AC32R7L', name: 'Alex Chen', role: 'Affiliate', package: 'SRK Prime', balance: 5200.50, status: 'Active', joinDate: '2025-01-15', referer: 'SRK Admin' },
  { id: 'DM18Y9P', name: 'David Martinez', role: 'Affiliate', package: 'SRK Gold', balance: 1200.00, status: 'Active', joinDate: '2025-03-22', referer: 'Alex Chen' },
  { id: 'EP40Q2K', name: 'Emily Peterson', role: 'Client', package: 'SRK Prime', balance: 0.00, status: 'Inactive', joinDate: '2024-11-01', referer: 'Self' },
  { id: 'SR11Z0G', name: 'Sara Ramirez', role: 'Affiliate', package: 'SRK Basic', balance: 450.75, status: 'Pending Verification', joinDate: '2025-10-29', referer: 'David Martinez' },
  { id: 'JK55T6A', name: 'John Kim', role: 'Client', package: 'SRK Gold', balance: 0.00, status: 'Active', joinDate: '2025-05-10', referer: 'Alex Chen' },
  { id: 'LT66B8C', name: 'Lisa Taylor', role: 'Affiliate', package: 'SRK Elite', balance: 10500.20, status: 'Active', joinDate: '2024-12-05', referer: 'Self' },
  { id: 'MG99X1F', name: 'Michael Garcia', role: 'Affiliate', package: 'SRK Prime', balance: 3200.75, status: 'Active', joinDate: '2025-07-18', referer: 'Lisa Taylor' },
  { id: 'RS77Y2H', name: 'Rachel Smith', role: 'Client', package: 'SRK Basic', balance: 0.00, status: 'Pending', joinDate: '2025-10-30', referer: 'Sara Ramirez' },
];

const PRIVATE_TASK_PERFORMANCE_DATA: PrivateTaskPerformance[] = [
  { userId: 'AC32R7L', totalClicks: 2125, facebookClicks: 850, youtubeClicks: 400, instagramClicks: 500, twitterClicks: 200, tiktokClicks: 175, link: 'https://srk.link/alex_prime' },
  { userId: 'LT66B8C', totalClicks: 3560, facebookClicks: 1200, youtubeClicks: 900, instagramClicks: 800, twitterClicks: 400, tiktokClicks: 260, link: 'https://srk.link/lisa_elite' },
  { userId: 'DM18Y9P', totalClicks: 980, facebookClicks: 300, youtubeClicks: 250, instagramClicks: 150, twitterClicks: 180, tiktokClicks: 100, link: 'https://srk.link/david_gold' },
  { userId: 'SR11Z0G', totalClicks: 150, facebookClicks: 50, youtubeClicks: 30, instagramClicks: 20, twitterClicks: 40, tiktokClicks: 10, link: 'https://srk.link/sara_basic' },
  { userId: 'MG99X1F', totalClicks: 1850, facebookClicks: 700, youtubeClicks: 450, instagramClicks: 350, twitterClicks: 200, tiktokClicks: 150, link: 'https://srk.link/michael_prime' },
];

const TASK_MONITORING_DATA: TaskMonitoringEntry[] = [
  {
    userId: 'AC32R7L',
    platforms: {
      facebook: { follow: { total: 1, completed: 1, status: 'Approved', link: 'facebook.com/alex-page' }, video: { total: 5, completed: 3, status: 'In Review', link: 'youtube.com/c/alex-channel' }, post: { total: 10, completed: 5, status: 'Pending', link: 'instagram.com/alex-gram' } },
      youtube: { follow: { total: 1, completed: 0, status: 'Pending', link: 'youtube.com/c/alex-channel' }, video: { total: 10, completed: 8, status: 'Approved', link: 'youtube.com/c/alex-channel' }, post: { total: 0, completed: 0, status: 'N/A', link: '' } },
      instagram: { follow: { total: 1, completed: 1, status: 'Approved', link: 'instagram.com/alex-gram' }, video: { total: 0, completed: 0, status: 'N/A', link: '' }, post: { total: 20, completed: 20, status: 'Approved', link: 'instagram.com/alex-gram' } },
      twitter: { follow: { total: 1, completed: 1, status: 'Approved', link: 'twitter.com/alex-tweet' }, video: { total: 0, completed: 0, status: 'N/A', link: '' }, post: { total: 15, completed: 15, status: 'Approved', link: 'twitter.com/alex-tweet' } },
      tiktok: { follow: { total: 1, completed: 0, status: 'Pending', link: 'tiktok.com/@alex-tok' }, video: { total: 15, completed: 12, status: 'In Review', link: 'tiktok.com/@alex-tok' }, post: { total: 0, completed: 0, status: 'N/A', link: '' } },
    },
  },
  {
    userId: 'DM18Y9P',
    platforms: {
      facebook: { follow: { total: 1, completed: 1, status: 'Approved', link: 'facebook.com/david-martinez' }, video: { total: 0, completed: 0, status: 'N/A', link: '' }, post: { total: 0, completed: 0, status: 'N/A', link: '' } },
      youtube: { follow: { total: 1, completed: 0, status: 'Pending', link: 'youtube.com/david-channel' }, video: { total: 0, completed: 0, status: 'N/A', link: '' }, post: { total: 0, completed: 0, status: 'N/A', link: '' } },
      instagram: { follow: { total: 1, completed: 0, status: 'Pending', link: 'instagram.com/david-gram' }, video: { total: 0, completed: 0, status: 'N/A', link: '' }, post: { total: 0, completed: 0, status: 'N/A', link: '' } },
      twitter: { follow: { total: 1, completed: 0, status: 'Pending', link: 'twitter.com/david-tweet' }, video: { total: 0, completed: 0, status: 'N/A', link: '' }, post: { total: 0, completed: 0, status: 'N/A', link: '' } },
      tiktok: { follow: { total: 1, completed: 0, status: 'Pending', link: 'tiktok.com/@david-tok' }, video: { total: 0, completed: 0, status: 'N/A', link: '' }, post: { total: 0, completed: 0, status: 'N/A', link: '' } },
    },
  },
  {
    userId: 'LT66B8C',
    platforms: {
      facebook: { follow: { total: 1, completed: 1, status: 'Approved', link: 'facebook.com/lisa-page' }, video: { total: 10, completed: 8, status: 'Approved', link: 'youtube.com/c/lisa-channel' }, post: { total: 15, completed: 12, status: 'In Review', link: 'instagram.com/lisa-gram' } },
      youtube: { follow: { total: 1, completed: 1, status: 'Approved', link: 'youtube.com/c/lisa-channel' }, video: { total: 25, completed: 22, status: 'Approved', link: 'youtube.com/c/lisa-channel' }, post: { total: 5, completed: 3, status: 'Pending', link: '' } },
      instagram: { follow: { total: 1, completed: 1, status: 'Approved', link: 'instagram.com/lisa-gram' }, video: { total: 15, completed: 14, status: 'Approved', link: '' }, post: { total: 30, completed: 28, status: 'Approved', link: 'instagram.com/lisa-gram' } },
      twitter: { follow: { total: 1, completed: 1, status: 'Approved', link: 'twitter.com/lisa-tweet' }, video: { total: 8, completed: 6, status: 'In Review', link: '' }, post: { total: 20, completed: 18, status: 'Approved', link: 'twitter.com/lisa-tweet' } },
      tiktok: { follow: { total: 1, completed: 1, status: 'Approved', link: 'tiktok.com/@lisa-tok' }, video: { total: 20, completed: 18, status: 'Approved', link: 'tiktok.com/@lisa-tok' }, post: { total: 10, completed: 8, status: 'Pending', link: '' } },
    },
  },
];

const mockQueueData = {
  payoutQueue: [
    { id: 'P001', userId: 'LT66B8C', amount: 1500.00, date: '2025-10-28', status: 'Pending' },
    { id: 'P002', userId: 'AC32R7L', amount: 800.00, date: '2025-10-27', status: 'In Review' },
    { id: 'P003', userId: 'DM18Y9P', amount: 350.00, date: '2025-10-29', status: 'Pending' },
    { id: 'P004', userId: 'MG99X1F', amount: 1200.00, date: '2025-10-30', status: 'Pending' },
  ],
  paymentVerificationQueue: [
    { id: 'V001', userId: 'SR11Z0G', amount: 99.00, date: '2025-10-29', package: 'Basic', status: 'Pending' },
    { id: 'V002', userId: 'EP40Q2K', amount: 199.00, date: '2025-10-28', package: 'Prime', status: 'Pending' },
    { id: 'V003', userId: 'RS77Y2H', amount: 99.00, date: '2025-10-30', package: 'Basic', status: 'Pending' },
  ],
  trends: [
    { month: 'Jan', revenue: 100, users: 50 },
    { month: 'Feb', revenue: 120, users: 65 },
    { month: 'Mar', revenue: 150, users: 80 },
    { month: 'Apr', revenue: 180, users: 95 },
    { month: 'May', revenue: 210, users: 110 },
    { month: 'Jun', revenue: 250, users: 130 },
    { month: 'Jul', revenue: 290, users: 145 },
    { month: 'Aug', revenue: 320, users: 160 },
    { month: 'Sep', revenue: 380, users: 180 },
    { month: 'Oct', revenue: 420, users: 200 },
  ]
};

const mockAdminData: AdminData = {
  totalRevenue: 285000.00,
  totalPayouts: 205000.00,
  totalLiability: 80000.00,
  affiliateCount: ALL_USERS_DATA.filter(u => u.role === 'Affiliate').length,
};

// --- Premium UI Components ---

const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  delay?: number;
}> = ({ children, className = '', hover = true, onClick, delay = 0 }) => {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      whileHover={hover ? { scale: 1.02, y: -4, transition: { duration: 0.2 } } : {}}
      className={`${THEME.effects.glass} rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-white/2 hover:border-white/10 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#b68938]/0 via-[#b68938]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

const GradientText: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <motion.span
    className={`bg-clip-text text-transparent font-bold ${className}`}
    style={{ backgroundImage: THEME.colors.goldGradient }}
    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
    transition={{ duration: 5, repeat: Infinity }}
  >
    {children}
  </motion.span>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getConfig = () => {
    switch (status) {
      case 'Active':
      case 'Approved':
        return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' };
      case 'Inactive':
      case 'Rejected':
        return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' };
      case 'Pending':
      case 'In Review':
      case 'Pending Verification':
        return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' };
      case 'Package Timed Out':
        return { bg: 'bg-rose-900/20', text: 'text-rose-300', border: 'border-rose-600/30' };
      default:
        return { bg: 'bg-zinc-500/10', text: 'text-zinc-400', border: 'border-zinc-500/20' };
    }
  };

  const config = getConfig();
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border} backdrop-blur-sm`}
    >
      {status}
    </motion.span>
  );
};

// --- Enhanced Magnetic Button ---
const MagneticButton = ({ children, className = "", onClick = () => {} }: MagneticButtonProps) => {
  // Add type for position state
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  // Type for the button reference, using the browser's 'HTMLButtonElement'
  const buttonRef = useRef<HTMLButtonElement>(null); 

  const handleMouseMove = (e: MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={`relative px-6 py-3 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black font-semibold text-sm uppercase tracking-widest hover:shadow-[0_0_40px_rgba(182,137,56,0.6)] active:scale-95 flex items-center gap-2 overflow-hidden group ${className}`}
      style={{ boxShadow: '0 4px 20px rgba(182, 137, 56, 0.3)' }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? '100%' : '-100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

// --- Floating Particles Background ---
const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[1px] h-[1px] bg-gradient-to-r from-[#b68938] to-[#e1ba73] rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, -20, 20, 0],
            x: [null, 10, -10, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

const FloatingNavBar: React.FC<{
  activeView: string;
  setActiveView: (view: string) => void;
}> = ({ activeView, setActiveView }) => {
  const { scrollY } = useScroll(); // Add useScroll here
  
  const navItems = [
    { id: 'global', label: 'Overview', icon: '🌐' },
    { id: 'taskmonitoring', label: 'Tasks', icon: '📊' },
    { id: 'privatetasks', label: 'Private', icon: '🎯' },
    { id: 'userlist', label: 'Users', icon: '👥' },
    { id: 'affiliatelist', label: 'Affiliates', icon: '🌟' },
    { id: 'createuser', label: 'Create', icon: '➕' },
    { id: 'payoutqueue', label: 'Payouts', icon: '💰' },
    { id: 'paymentverify', label: 'Verify', icon: '✅' },
    { id: 'trend', label: 'Trends', icon: '📈' },
  ];

  const navOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const navBlur = useTransform(scrollY, [0, 100], [0, 12]);
  const navScale = useTransform(scrollY, [0, 100], [0.95, 1]);
  const navY = useTransform(scrollY, [0, 100], [-20, 0]);

  return (
    <motion.nav
      style={{
        opacity: navOpacity,
        backdropFilter: `blur(${navBlur}px)`,
        scale: navScale,
        y: navY,
      }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden lg:block"
    >
      {/* ADD THIS NAVIGATION CONTENT */}
      <div className="flex items-center gap-1 p-1 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${
              activeView === item.id
                ? 'bg-gradient-to-r from-[#b68938]/20 to-[#e1ba73]/20 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium text-sm">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
};
// --- View Components ---
const GlobalOverviewView: React.FC<{ data: DashboardData }> = ({ data }) => {
  const stats = [
    {
      label: 'Total Revenue',
      value: `₹${data.totalRevenue.toLocaleString()}`,
      trend: '+12.5%',
      description: 'Monthly growth',
      icon: '💰'
    },
    {
      label: 'Total Liability',
      value: `₹${data.totalLiability.toLocaleString()}`,
      trend: '-3.2%',
      description: 'Outstanding balance',
      icon: '📊'
    },
    {
      label: 'Active Affiliates',
      value: data.affiliateCount.toString(),
      trend: '+8',
      description: 'Active this month',
      icon: '👥'
    },
    {
      label: 'Pending Payouts',
      value: mockQueueData.payoutQueue.length.toString(),
      trend: '3 New',
      description: 'Awaiting processing',
      icon: '⏳'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 space-y-8"
    >
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-white"
          >
            <GradientText>Global Overview</GradientText>
          </motion.h1>
          <motion.p 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 mt-2"
          >
            Real-time monitoring of platform performance
          </motion.p>
        </div>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center gap-2 text-sm text-gray-400"
        >
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-emerald-500"
          />
          <span>Live Data</span>
          <span className="text-gray-500">•</span>
          <span>Updated just now</span>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <GlassCard key={stat.label} hover delay={index}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-2">{stat.label}</p>
                  <motion.p 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="text-3xl font-bold text-white"
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="p-3 rounded-xl bg-gradient-to-br from-[#b68938]/20 to-transparent"
                >
                  <span className="text-xl">{stat.icon}</span>
                </motion.div>
              </div>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                <span className="text-sm text-gray-500">{stat.description}</span>
                <motion.span 
                  whileHover={{ scale: 1.1 }}
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    stat.trend.startsWith('+') 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : 'bg-rose-500/10 text-rose-400'
                  }`}
                >
                  {stat.trend}
                </motion.span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Performance Chart */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <GlassCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-white">Performance Trends</h2>
                <p className="text-gray-400 text-sm">Revenue & User Growth</p>
              </div>
              <div className="relative">
                <select className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm appearance-none pr-8">
                  <option>Last 6 months</option>
                  <option>Last year</option>
                  <option>All time</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="text-gray-400">▼</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {data.trends.slice(-6).map((trend, index) => (
                <motion.div 
                  key={trend.month}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-16 text-right">
                    <span className="text-sm font-medium text-white">{trend.month}</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-400 font-medium">Revenue: ₹{trend.revenue}K</span>
                      <span className="text-white font-bold">+{(trend.revenue / 10).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(trend.revenue / 420) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className="h-full rounded-full"
                        style={{ background: THEME.colors.goldGradient }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-400 font-medium">Users: {trend.users}</span>
                      <span className="text-white font-bold">+{(trend.users / 2).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(trend.users / 200) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.2 + 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: THEME.colors.blueInfo }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

const TaskMonitoringView: React.FC<{ data: DashboardData }> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    data.taskMonitoringData.length > 0 ? data.taskMonitoringData[0].userId : null
  );
  const [activePlatform, setActivePlatform] = useState<'facebook' | 'youtube' | 'instagram' | 'twitter' | 'tiktok'>('facebook');
  const [userStatuses, setUserStatuses] = useState<Record<string, string>>({});

  const usersWithTasks: UserWithTasks[] = useMemo(() => {
    return data.allUsers
      .filter(u => data.taskMonitoringData.some(t => t.userId === u.id))
      .map(user => {
        const taskData = data.taskMonitoringData.find(t => t.userId === user.id)!;
        const platforms = Object.values(taskData.platforms);
        
        let totalRequired = 0;
        let totalCompleted = 0;
        
        platforms.forEach(p => {
          (Object.keys(p) as Array<keyof PlatformTasks>).forEach(taskKey => {
            totalRequired += p[taskKey].total;
            totalCompleted += p[taskKey].completed;
          });
        });

        const completionPercentage = totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 0;

        return {
          ...user,
          status: userStatuses[user.id] || user.status,
          completionPercentage,
          taskData,
        };
      })
      .filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.completionPercentage - a.completionPercentage);
  }, [data.allUsers, data.taskMonitoringData, userStatuses, searchQuery]);

  useEffect(() => {
    if (!usersWithTasks.find(u => u.id === selectedUserId) && usersWithTasks.length > 0) {
      setSelectedUserId(usersWithTasks[0].id);
    }
  }, [usersWithTasks, selectedUserId]);

  const currentUser = usersWithTasks.find(u => u.id === selectedUserId);
  const platformTasks = currentUser?.taskData?.platforms[activePlatform];

  const handleTimeoutPackage = () => {
    if (!currentUser) return;
    const isConfirmed = window.confirm(
      `Confirm TIMEOUT for ${currentUser.name} (${currentUser.id})? This will suspend earnings for 7 days.`
    );
    if (isConfirmed) {
      setUserStatuses(prev => ({
        ...prev,
        [currentUser.id]: 'Package Timed Out'
      }));
    }
  };

  const platforms = [
    { id: 'facebook' as const, label: 'Facebook', color: '#1877F2', icon: '📘' },
    { id: 'youtube' as const, label: 'YouTube', color: '#FF0000', icon: '📺' },
    { id: 'instagram' as const, label: 'Instagram', color: '#C13584', icon: '📷' },
    { id: 'twitter' as const, label: 'Twitter', color: '#1DA1F2', icon: '🐦' },
    { id: 'tiktok' as const, label: 'TikTok', color: '#69C9D0', icon: '🎵' },
  ];

  const taskCategories = [
    { id: 'follow' as const, label: 'Follow Task' },
    { id: 'video' as const, label: 'Video View' },
    { id: 'post' as const, label: 'Post/Content Share' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold text-white">
          <GradientText>Task Monitoring</GradientText>
        </h1>
        <p className="text-gray-400 mt-2">Track and manage affiliate task completion</p>
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - User List */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Search Affiliates</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <span className="text-gray-500">🔍</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Select Affiliate ({usersWithTasks.length})
                  </label>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {usersWithTasks.map((user, index) => (
                      <motion.button
                        key={user.id}
                        onClick={() => setSelectedUserId(user.id)}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                          selectedUserId === user.id
                            ? 'bg-gradient-to-r from-white/10 to-white/5 border border-white/20 shadow-lg'
                            : 'bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white group-hover:text-[#e1ba73] transition-colors">{user.name}</p>
                            <p className="text-sm text-gray-400">{user.id}</p>
                          </div>
                          <div className="text-right">
                            <motion.div 
                              whileHover={{ scale: 1.1 }}
                              className="text-xl font-bold text-white"
                            >
                              {user.completionPercentage}%
                            </motion.div>
                            <StatusBadge status={user.status} />
                          </div>
                        </div>
                        <div className="mt-3 w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${user.completionPercentage}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="h-2 rounded-full"
                            style={{ background: THEME.colors.goldGradient }}
                          />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Task Details */}
            <div className="lg:col-span-2">
              {currentUser ? (
                <div className="space-y-6">
                  {/* User Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <motion.h2 
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-2xl font-bold text-white"
                      >
                        {currentUser.name}
                      </motion.h2>
                      <div className="flex items-center gap-3 mt-2">
                        <StatusBadge status={currentUser.status} />
                        <span className="text-gray-400">{currentUser.package}</span>
                        <motion.span 
                          whileHover={{ scale: 1.1 }}
                          className="text-white font-bold bg-gradient-to-r from-[#b68938]/20 to-[#e1ba73]/20 px-3 py-1 rounded-full"
                        >
                          ₹{currentUser.balance.toFixed(2)}
                        </motion.span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleTimeoutPackage}
                      className="px-4 py-2 bg-gradient-to-r from-rose-600/20 to-rose-700/20 text-rose-300 border border-rose-600/30 rounded-lg hover:bg-rose-600/30 transition-colors flex items-center gap-2 text-sm"
                    >
                      <span>⏱️</span>
                      Timeout Package
                    </motion.button>
                  </div>

                  {/* Platform Tabs */}
                  <div className="flex flex-wrap gap-2">
                    {platforms.map(platform => (
                      <motion.button
                        key={platform.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActivePlatform(platform.id)}
                        className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-all ${
                          activePlatform === platform.id
                            ? 'bg-white/10 text-white shadow-lg'
                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="text-lg">{platform.icon}</span>
                        <span className="font-medium">{platform.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Task Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {taskCategories.map(category => {
                      const tasks = platformTasks?.[category.id];
                      if (!tasks || tasks.status === 'N/A') return null;

                      const percent = tasks.total > 0 ? Math.round((tasks.completed / tasks.total) * 100) : 0;
                      const platform = platforms.find(p => p.id === activePlatform);

                      return (
                        <GlassCard key={category.id} hover>
                          <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white">{category.label}</span>
                              </div>
                              <motion.span 
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                className="text-2xl font-bold"
                                style={{ color: platform?.color }}
                              >
                                {percent}%
                              </motion.span>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percent}%` }}
                                  transition={{ duration: 1 }}
                                  className="h-2 rounded-full"
                                  style={{ backgroundColor: platform?.color }}
                                />
                              </div>
                              <div className="flex justify-between text-sm text-gray-400">
                                <span>{tasks.completed}/{tasks.total} tasks</span>
                                <StatusBadge status={tasks.status} />
                              </div>
                            </div>

                            {tasks.link && (
                              <a
                                href={`https://${tasks.link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-sm text-blue-400 hover:text-blue-300 truncate hover:underline"
                              >
                                🔗 {tasks.link}
                              </a>
                            )}
                          </div>
                        </GlassCard>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-gray-400">Select an affiliate to view task details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const PrivateTasksView: React.FC<{ data: DashboardData }> = ({ data }) => {
  const [sortBy, setSortBy] = useState<'total' | 'facebook' | 'youtube'>('total');

  const sortedData = useMemo(() => {
    return [...data.privateTaskPerformance].sort((a, b) => {
      if (sortBy === 'total') return b.totalClicks - a.totalClicks;
      if (sortBy === 'facebook') return b.facebookClicks - a.facebookClicks;
      return b.youtubeClicks - a.youtubeClicks;
    });
  }, [data.privateTaskPerformance, sortBy]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">
            <GradientText>Private Task Performance</GradientText>
          </h1>
          <p className="text-gray-400 mt-2">Click analytics for private affiliate links</p>
        </div>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <span className="text-gray-400 text-sm">Sort by:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm appearance-none pr-8"
            >
              <option value="total">Total Clicks</option>
              <option value="facebook">Facebook</option>
              <option value="youtube">YouTube</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="text-gray-400 text-xs">▼</span>
            </div>
          </div>
        </motion.div>
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Affiliate</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Total Clicks</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Facebook</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">YouTube</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Instagram</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Link</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((task, index) => {
                  const user = data.allUsers.find(u => u.id === task.userId);
                  return (
                    <motion.tr
                      key={task.userId}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-white">{user?.name || task.userId}</p>
                          <p className="text-sm text-gray-400">{task.userId}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="text-2xl font-bold text-white"
                        >
                          {task.totalClicks.toLocaleString()}
                        </motion.div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white font-medium">{task.facebookClicks.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white font-medium">{task.youtubeClicks.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white font-medium">{task.instagramClicks.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-6">
                        <a
                          href={task.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm truncate max-w-[200px] inline-block hover:underline flex items-center gap-1"
                        >
                          <span>🔗</span>
                          {task.link}
                        </a>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const UserListView: React.FC<{ data: DashboardData; filterRole?: 'Affiliate' | 'Client' }> = ({ data, filterRole }) => {
  const users = filterRole ? data.allUsers.filter(u => u.role === filterRole) : data.allUsers;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                         user.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = Array.from(new Set(users.map(u => u.status)));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold text-white">
          <GradientText>{filterRole ? `${filterRole}s` : 'All Users'}</GradientText>
        </h1>
        <p className="text-gray-400 mt-2">Manage platform users and their status</p>
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <span className="text-gray-500">🔍</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm appearance-none pr-8"
                >
                  <option value="all">All Status</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="text-gray-400 text-xs">▼</span>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">User ID</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Name</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Role</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Package</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Balance</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Referer</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <code className="text-sm font-mono text-white group-hover:text-[#e1ba73] transition-colors">
                        {user.id}
                      </code>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-white">{user.name}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'Affiliate' 
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-white font-medium">{user.package}</span>
                    </td>
                    <td className="py-4 px-6">
                      <motion.span 
                        whileHover={{ scale: 1.1 }}
                        className="text-2xl font-bold"
                        style={{ color: THEME.colors.goldAccent }}
                      >
                        ₹{user.balance.toFixed(2)}
                      </motion.span>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.referer === 'Self' 
                          ? 'bg-gray-500/10 text-gray-300 border border-gray-500/20'
                          : 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                      }`}>
                        {user.referer}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const AffiliateListView: React.FC<{ data: DashboardData }> = (props) => 
  <UserListView {...props} filterRole="Affiliate" />;

const CreateUserView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Client',
    package: 'SRK Basic',
    balance: '0',
    promoCode: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`User ${formData.name} created successfully with promo code: ${formData.promoCode || 'None'}`);
    setFormData({ 
      name: '', 
      email: '', 
      role: 'Client', 
      package: 'SRK Basic', 
      balance: '0',
      promoCode: '' 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold text-white">
          <GradientText>Create New User</GradientText>
        </h1>
        <p className="text-gray-400 mt-2">Register new clients or affiliates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
                  <div className="relative">
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent appearance-none pr-8"
                    >
                      <option value="Client">Client</option>
                      <option value="Affiliate">Affiliate</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <span className="text-gray-400">▼</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Package</label>
                  <div className="relative">
                    <select
                      value={formData.package}
                      onChange={(e) => setFormData({...formData, package: e.target.value})}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent appearance-none pr-8"
                    >
                      <option value="SRK Basic">SRK Basic (₹8,249)</option>
                      <option value="SRK Gold">SRK Gold (₹24,916)</option>
                      <option value="SRK Prime">SRK Prime (₹41,583)</option>
                      <option value="SRK Elite">SRK Elite (₹83,166)</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <span className="text-gray-400">▼</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Initial Balance (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.balance}
                      onChange={(e) => setFormData({...formData, balance: e.target.value})}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 pl-8 text-white focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Promo Code (Optional)</label>
                  <input
                    type="text"
                    value={formData.promoCode}
                    onChange={(e) => setFormData({...formData, promoCode: e.target.value})}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent"
                    placeholder="Enter promo code"
                  />
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 rounded-xl font-bold text-lg text-black transition-all duration-300 hover:shadow-[0_0_40px_rgba(182,137,56,0.5)] relative overflow-hidden"
                style={{ background: THEME.colors.goldGradient }}
              >
                <span className="relative z-10">Create User Account</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>
            </form>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-white">142</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <p className="text-sm text-gray-400">Active Affiliates</p>
                <p className="text-2xl font-bold text-white">86</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <p className="text-sm text-gray-400">Avg Balance</p>
                <p className="text-2xl font-bold text-white">₹1,03,792</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

const PayoutQueueView: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const handleProcess = (id: string) => {
    alert(`Processing payout ${id}...`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">
            <GradientText>Payout Queue</GradientText>
          </h1>
          <p className="text-gray-400 mt-2">Process affiliate payout requests</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            Total: <span className="text-white font-bold">₹{mockQueueData.payoutQueue.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}</span>
          </span>
        </div>
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    <input
                      type="checkbox"
                      className="rounded border-white/20 bg-black/30 checked:bg-[#b68938]"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelected(mockQueueData.payoutQueue.map(p => p.id));
                        } else {
                          setSelected([]);
                        }
                      }}
                    />
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Request ID</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">User ID</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Amount (₹)</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockQueueData.payoutQueue.map((payout, index) => (
                  <motion.tr
                    key={payout.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selected.includes(payout.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelected([...selected, payout.id]);
                          } else {
                            setSelected(selected.filter(id => id !== payout.id));
                          }
                        }}
                        className="rounded border-white/20 bg-black/30 checked:bg-[#b68938]"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <code className="text-sm font-mono text-white group-hover:text-[#e1ba73] transition-colors">{payout.id}</code>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-white">{payout.userId}</span>
                    </td>
                    <td className="py-4 px-6">
                      <motion.span 
                        whileHover={{ scale: 1.1 }}
                        className="text-2xl font-bold"
                        style={{ color: THEME.colors.goldAccent }}
                      >
                        ₹{payout.amount.toFixed(2)}
                      </motion.span>
                    </td>
                    <td className="py-4 px-6 text-gray-400">{payout.date}</td>
                    <td className="py-4 px-6">
                      <StatusBadge status={payout.status} />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleProcess(payout.id)}
                          className="px-4 py-2 bg-emerald-600/20 text-emerald-300 rounded-lg hover:bg-emerald-600/30 transition-colors text-sm"
                        >
                          Process
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {selected.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center"
            >
              <span className="text-gray-400">{selected.length} selected</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  alert(`Processing ${selected.length} payouts...`);
                  setSelected([]);
                }}
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Bulk Process Selected
              </motion.button>
            </motion.div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
};

const PaymentVerificationView: React.FC = () => {
  const handleVerify = (id: string) => {
    alert(`Payment ${id} verified successfully! User will now receive their payment.`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold text-white">
          <GradientText>Payment Verification</GradientText>
        </h1>
        <p className="text-gray-400 mt-2">Verify new package payments</p>
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Verification ID</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">User ID</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Package</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Amount (₹)</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockQueueData.paymentVerificationQueue.map((verification, index) => (
                  <motion.tr
                    key={verification.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <code className="text-sm font-mono text-white group-hover:text-[#e1ba73] transition-colors">{verification.id}</code>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-white">{verification.userId}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-white font-medium">{verification.package}</span>
                    </td>
                    <td className="py-4 px-6">
                      <motion.span 
                        whileHover={{ scale: 1.1 }}
                        className="text-2xl font-bold"
                        style={{ color: THEME.colors.goldAccent }}
                      >
                        ₹{verification.amount?.toFixed(2) || '0.00'}
                      </motion.span>
                    </td>
                    <td className="py-4 px-6 text-gray-400">{verification.date}</td>
                    <td className="py-4 px-6">
                      <StatusBadge status={verification.status} />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleVerify(verification.id)}
                          className="px-4 py-2 bg-emerald-600/20 text-emerald-300 rounded-lg hover:bg-emerald-600/30 transition-colors text-sm"
                        >
                          Verify Payment
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const PerformanceTrendView: React.FC<{ data: DashboardData }> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold text-white">
          <GradientText>Performance Trends</GradientText>
        </h1>
        <p className="text-gray-400 mt-2">Platform growth analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-6">Revenue Growth</h3>
            <div className="space-y-6">
              {data.trends.slice(-6).map((trend, index) => {
                const maxRevenue = Math.max(...data.trends.map(t => t.revenue));
                const width = (trend.revenue / maxRevenue) * 100;
                
                return (
                  <motion.div
                    key={trend.month}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-16 text-right">
                      <span className="text-sm font-medium text-white">{trend.month}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-emerald-400 font-medium">₹{trend.revenue}K</span>
                        <span className="text-white font-bold">+{(trend.revenue / 10).toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-800/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full rounded-full"
                          style={{ background: THEME.colors.goldGradient }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-6">User Growth</h3>
            <div className="space-y-6">
              {data.trends.slice(-6).map((trend, index) => {
                const maxUsers = Math.max(...data.trends.map(t => t.users));
                const width = (trend.users / maxUsers) * 100;
                
                return (
                  <motion.div
                    key={trend.month}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-16 text-right">
                      <span className="text-sm font-medium text-white">{trend.month}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-blue-400 font-medium">{trend.users} users</span>
                        <span className="text-white font-bold">+{(trend.users / 2).toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-800/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: THEME.colors.blueInfo }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

// --- Premium Sidebar Component with improved mobile background ---
const Sidebar: React.FC<{
  activeView: string;
  setActiveView: (view: string) => void;
  isMobile?: boolean;
  onClose?: () => void;
}> = ({ activeView, setActiveView, isMobile = false, onClose }) => {
  const navItems = [
    { id: 'global', label: 'Global Overview', icon: '🌐' },
    { id: 'taskmonitoring', label: 'Task Monitoring', icon: '📊' },
    { id: 'privatetasks', label: 'Private Tasks', icon: '🎯' },
    { id: 'userlist', label: 'All Users', icon: '👥' },
    { id: 'affiliatelist', label: 'Affiliates Only', icon: '🌟' },
    { id: 'createuser', label: 'Create User', icon: '➕' },
    { id: 'payoutqueue', label: 'Payout Queue', icon: '💰' },
    { id: 'paymentverify', label: 'Payment Verification', icon: '✅' },
    { id: 'trend', label: 'Performance Trends', icon: '📈' },
  ];

  return (
    <>
      {isMobile && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <motion.div
        initial={isMobile ? { x: -300 } : {}}
        animate={isMobile ? { x: 0 } : {}}
        exit={isMobile ? { x: -300 } : {}}
        className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0'}
          flex-col w-64
        `}
      >
        <div className={`flex-1 flex flex-col ${isMobile ? 'bg-gradient-to-b from-[#1a140f] to-[#0f0a05]' : ''}`}>
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] flex items-center justify-center"
              >
                <span className="font-bold text-black text-xl">S</span>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  SRK<span className="text-[#b68938]">Admin</span>
                </h1>
                <p className="text-xs text-gray-400">Premium Dashboard</p>
              </div>
              {isMobile && onClose && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="ml-auto p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <span className="text-white">✕</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => {
                  setActiveView(item.id);
                  if (isMobile && onClose) onClose();
                }}
                whileHover={{ x: 10 }}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-xl
                  transition-all duration-200 text-left
                  ${activeView === item.id
                    ? 'bg-gradient-to-r from-[#b68938]/20 to-[#b68938]/10 text-white shadow-lg border border-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center text-lg
                  ${activeView === item.id ? 'bg-[#b68938]/20' : 'bg-white/5'}
                `}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center">
                <span className="text-gray-400">⚙️</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Admin Panel</p>
                <p className="text-xs text-gray-400">v2.0.1</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

// --- Main App Component ---
const GrowOnlyAdminDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('global');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const data: DashboardData = {
    allUsers: ALL_USERS_DATA,
    privateTaskPerformance: PRIVATE_TASK_PERFORMANCE_DATA,
    taskMonitoringData: TASK_MONITORING_DATA,
    trends: mockQueueData.trends,
    ...mockAdminData
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setIsNavVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const renderView = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full border-2 border-transparent border-t-white border-r-white"
          />
        </div>
      );
    }

    switch (activeView) {
      case 'global': return <GlobalOverviewView data={data} />;
      case 'taskmonitoring': return <TaskMonitoringView data={data} />;
      case 'privatetasks': return <PrivateTasksView data={data} />;
      case 'userlist': return <UserListView data={data} />;
      case 'affiliatelist': return <AffiliateListView data={data} />;
      case 'createuser': return <CreateUserView />;
      case 'payoutqueue': return <PayoutQueueView />;
      case 'paymentverify': return <PaymentVerificationView />;
      case 'trend': return <PerformanceTrendView data={data} />;
      default: return <GlobalOverviewView data={data} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f0a05] to-black" />
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-1/4 w-96 h-96 bg-[#b68938]/10 rounded-full blur-[128px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
          className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#e1ba73]/10 rounded-full blur-[128px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(182,137,56,0.1)_0%,transparent_50%)]" />
      </div>

      <FloatingParticles />

      {/* Desktop Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <Sidebar
            activeView={activeView}
            setActiveView={setActiveView}
            isMobile
            onClose={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Floating Navigation Bar */}
<FloatingNavBar
  activeView={activeView}
  setActiveView={setActiveView}
  // Remove scrollY={scrollY} prop
/>

      {/* Main Content */}
      <main ref={mainRef} className="lg:ml-64 min-h-screen">
        {/* Top Bar */}
        <motion.header
          initial={{ y: 0 }}
          animate={{ y: isNavVisible ? 0 : -100 }}
          transition={{ duration: 0.3 }}
          className="sticky top-0 z-30 p-4 sm:p-6 border-b border-white/10 bg-black/80 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <span className="text-white text-lg">☰</span>
              </motion.button>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {activeView === 'global' ? 'Global Overview' :
                   activeView === 'taskmonitoring' ? 'Task Monitoring' :
                   activeView === 'privatetasks' ? 'Private Tasks' :
                   activeView === 'userlist' ? 'All Users' :
                   activeView === 'affiliatelist' ? 'Affiliates Only' :
                   activeView === 'createuser' ? 'Create User' :
                   activeView === 'payoutqueue' ? 'Payout Queue' :
                   activeView === 'paymentverify' ? 'Payment Verification' :
                   activeView === 'trend' ? 'Performance Trends' : 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-400">
                  Last updated: Today, 2:45 PM
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="hidden sm:flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full"
              >
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-emerald-500"
                />
                <span>Live</span>
              </motion.div>
              <MagneticButton className="px-4 py-2 text-sm" onClick={() => window.location.reload()}>
                <span>🔄</span>
                Refresh Data
              </MagneticButton>
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-4 sm:p-6"
        >
          {renderView()}
        </motion.div>

        {/* Footer */}
        <footer className="mt-8 p-6 border-t border-white/10 text-center text-gray-400 text-sm">
          <p>© 2024 SRK Admin Dashboard. All rights reserved.</p>
          <p className="mt-1">Version 2.0.1 • Premium Theme</p>
        </footer>
      </main>

      {/* Custom CSS */}
            <style dangerouslySetInnerHTML={{__html: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
                * { 
                    font-family: 'Inter', sans-serif; 
                    /* Consolidated transition rule */
                    transition: background-color 0.2s ease, border-color 0.2s ease; 
                }

                /* Custom Scrollbar */
                .custom-scrollbar {
                  scrollbar-width: thin;
                  scrollbar-color: rgba(182, 137, 56, 0.3) transparent;
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: transparent;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background-color: rgba(182, 137, 56, 0.3);
                  border-radius: 3px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background-color: rgba(182, 137, 56, 0.5);
                }
                
                /* Selection */
                ::selection {
                  background: rgba(182, 137, 56, 0.3);
                  color: white;
                }
                
                /* Focus styles */
                :focus-visible {
                  outline: 2px solid #b68938;
                  outline-offset: 2px;
                }
                
                /* Glass effect enhancement */
                .glass-card {
                  position: relative;
                  overflow: hidden;
                }
                
                .glass-card::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: -100%;
                  width: 100%;
                  height: 100%;
                  background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(255, 255, 255, 0.1),
                    transparent
                  );
                  transition: left 0.5s;
                }
                
                .glass-card:hover::before {
                  left: 100%;
                }

                /* Better mobile visibility */
                @media (max-width: 768px) {
                  .glass-card {
                    background: rgba(26, 20, 16, 0.8) !important;
                    backdrop-filter: blur(20px) !important;
                  }
                  
                  table {
                    display: block;
                    overflow-x: auto;
                    white-space: nowrap;
                  }
                  
                  td, th {
                    min-width: 120px;
                  }
                }
                /* Placeholder content style removed */
            `}} /> 
    </div>
  );
};

export default GrowOnlyAdminDashboard;