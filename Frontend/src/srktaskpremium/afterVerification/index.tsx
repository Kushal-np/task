import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useAnimation } from 'framer-motion';
import { 
  X, ArrowRight, UserCircle, Eye, Link, Play, Upload, Youtube, Instagram, 
  Smartphone, CheckCircle, Clock, Zap, Shield, TrendingUp, DollarSign, Award, 
  Settings, Wallet, ListChecks, Sparkles, FileText, Send, Check, Facebook, 
  Ticket, AlertTriangle, LogOut, BarChart3, Users, Home, CreditCard, 
  ChevronRight, Camera, ShieldCheck, Star, TrendingDown, Activity,
  ExternalLink, Filter, Search, Crown, Target, Gift, Coins, Bell, 
  Calendar, Download, Share2, Heart, ThumbsUp, MessageSquare,
  MoreVertical, RefreshCw, Link2, Globe, Phone, Mail, MapPin,
  Trophy, Lock, CameraIcon, UserCheck, UsersIcon, Video, 
  MessageCircle, Hash, Music, Film, Mic, EyeOff, CheckSquare,
  AlertCircle, Info, PieChart, Cpu, Database, Cloud,
  ZapOff, GiftIcon, Tag, CreditCardIcon, ShoppingBag, WalletIcon
} from 'lucide-react';

// --- TYPE DEFINITIONS ---
type SocialPlatform = 'youtube' | 'instagram' | 'tiktok' | 'facebook' | 'twitter';
type TaskType = 'follow' | 'watch' | 'post' | 'like' | 'share';
type DashboardView = 'verification' | 'analytics' | 'tasks' | 'leaderboard' | 'coinExchange' | 'profile' | 'payout' | 'logout';
type TaskStatus = 'pending' | 'completed' | 'rejected' | 'in_review';

interface Task {
  id: string;
  type: TaskType;
  platform: SocialPlatform;
  title: string;
  coins: number;
  duration?: string;
  username?: string;
  embedId?: string;
  link?: string;
  desc: string;
  status?: TaskStatus;
  required?: string;
  proofType?: 'screenshot' | 'video' | 'link';
}

interface RejectedTaskEntry extends Task {
  rejectionReason: string;
  uploadedProofUrl: string;
  taskId: string;
  date: string;
  adminComment?: string;
  canRetry: boolean;
}

interface PlatformInfo {
  platform: SocialPlatform;
  icon: React.FC<any>;
  color: string;
  gradient: string;
  name: string;
}

interface LeaderboardEntry {
  rank: number;
  user: string;
  score: number;
  consistencyDays: number;
  isSelf?: boolean;
  avatar?: string;
  change?: 'up' | 'down' | 'stable';
  changeAmount?: number;
}

interface AnalyticsData {
  totalCoins: number;
  today: number;
  last7Days: number;
  last28Days: number;
  allTime: number;
  history: { date: string; coins: number }[];
  activityGraph: number[];
  completionRate: number;
  averageDaily: number;
  peakDay: { date: string; coins: number };
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
  level: number;
  xp: number;
  nextLevelXP: number;
  socialLinks: Record<SocialPlatform, string>;
  documentStatus: 'pending' | 'verified' | 'rejected';
}

// --- THEME CONFIGURATION ---
const THEME = {
  colors: {
    bgDeepBlack: '#0a0a0a',
    bgCard: 'rgba(26, 20, 16, 0.4)',
    goldAccent: '#b68938',
    goldLight: '#e1ba73',
    goldGradient: 'linear-gradient(135deg, #b68938 0%, #e1ba73 100%)',
    purpleGradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    blueGradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
    greenGradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    textWhite: '#F3F4F6',
    textGray: '#9CA3AF',
    greenSuccess: '#10B981',
    redAlert: '#EF4444',
    blueInfo: '#3B82F6',
    orangeWarn: '#F59E0B',
    purplePremium: '#8B5CF6',
    pinkVibrant: '#EC4899',
    cyanBright: '#06B6D4',
  },
  effects: {
    glass: 'backdrop-blur-xl',
    shadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    goldGlow: '0 0 20px rgba(182, 137, 56, 0.3)',
    purpleGlow: '0 0 20px rgba(139, 92, 246, 0.3)',
    blueGlow: '0 0 20px rgba(59, 130, 246, 0.3)',
  },
  animations: {
    float: 'float 6s ease-in-out infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    shimmer: 'shimmer 2s infinite linear',
  }
};

// --- ANIMATED BACKGROUND COMPONENT ---
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-20 left-1/4 w-96 h-96 bg-[#b68938]/10 rounded-full blur-[128px]"
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
          delay: 5
        }}
        className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#e1ba73]/10 rounded-full blur-[128px]"
      />
      
      {/* Floating particles */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[2px] bg-gradient-to-r from-[#b68938] to-[#e1ba73] rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, -30, 30, 0],
            x: [null, 15, -15, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
      
      {/* Animated grid lines */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-[#b68938]/20 to-transparent"
            style={{ top: `${i * 5}%` }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-[#e1ba73]/20 to-transparent"
            style={{ left: `${i * 5}%` }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.1 + 1,
            }}
          />
        ))}
      </div>
      
      {/* Shimmer effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#b68938]/5 to-transparent animate-pulse" />
    </div>
  );
};

// --- PREMIUM UI COMPONENTS ---
const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  delay?: number;
  gradient?: 'gold' | 'purple' | 'blue' | 'green';
}> = ({ children, className = '', hover = true, onClick, delay = 0, gradient = 'gold' }) => {
  const gradientMap = {
    gold: 'from-[#b68938]/20 via-[#b68938]/10 to-transparent',
    purple: 'from-[#8B5CF6]/20 via-[#8B5CF6]/10 to-transparent',
    blue: 'from-[#3B82F6]/20 via-[#3B82F6]/10 to-transparent',
    green: 'from-[#10B981]/20 via-[#10B981]/10 to-transparent',
  };

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      whileHover={hover ? { scale: 1.02, y: -4, transition: { duration: 0.2 } } : {}}
      className={`relative rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-white/2 hover:border-white/10 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradientMap[gradient]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-[#b68938]/0 to-transparent animate-[shimmer_2s_infinite]" />
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

const MagneticButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  small?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'premium';
  fullWidth?: boolean;
}> = ({ children, onClick, disabled, small, className = "", variant = 'primary', fullWidth = false }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-white/5 text-white hover:bg-white/10 border border-white/10';
      case 'danger':
        return 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20';
      case 'success':
        return 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20';
      case 'premium':
        return 'bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#8B5CF6] text-white hover:shadow-[0_0_40px_rgba(139,92,246,0.6)]';
      default:
        return 'bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black hover:shadow-[0_0_40px_rgba(182,137,56,0.6)]';
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={`
        relative rounded-full font-semibold uppercase tracking-widest
        active:scale-95 flex items-center gap-2 overflow-hidden group
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none
        focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950
        ${small ? 'px-6 py-3 text-xs' : 'px-8 py-4 text-sm'}
        ${fullWidth ? 'w-full' : ''}
        ${getVariantStyles()}
        ${className}
      `}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? '100%' : '-100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      
      {/* Particle effects on hover */}
      {isHovered && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{ x: -10, y: '50%', opacity: 1 }}
              animate={{ x: '110%', opacity: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            />
          ))}
        </>
      )}
      
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

const GradientText: React.FC<{
  children: React.ReactNode;
  className?: string;
  gradient?: 'gold' | 'purple' | 'blue' | 'green';
}> = ({ children, className = '', gradient = 'gold' }) => {
  const gradientMap = {
    gold: 'linear-gradient(135deg, #b68938 0%, #e1ba73 100%)',
    purple: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    blue: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
    green: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
  };

  return (
    <motion.span
      className={`bg-clip-text text-transparent font-bold ${className}`}
      style={{ backgroundImage: gradientMap[gradient] }}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{ duration: 5, repeat: Infinity }}
    >
      {children}
    </motion.span>
  );
};

const StatusBadge: React.FC<{ status: string; small?: boolean; pulse?: boolean }> = ({ status, small = false, pulse = false }) => {
  const getConfig = () => {
    switch (status) {
      case 'Active':
      case 'Approved':
      case 'Completed':
      case 'Verified':
        return { 
          bg: 'bg-emerald-500/10', 
          text: 'text-emerald-400', 
          border: 'border-emerald-500/20',
          icon: <CheckCircle size={small ? 10 : 12} />
        };
      case 'Inactive':
      case 'Rejected':
        return { 
          bg: 'bg-rose-500/10', 
          text: 'text-rose-400', 
          border: 'border-rose-500/20',
          icon: <X size={small ? 10 : 12} />
        };
      case 'Pending':
      case 'In Review':
      case 'Pending Verification':
      case 'Available':
        return { 
          bg: 'bg-amber-500/10', 
          text: 'text-amber-400', 
          border: 'border-amber-500/20',
          icon: <Clock size={small ? 10 : 12} />
        };
      case 'Premium':
      case 'SRK Grow':
        return { 
          bg: 'bg-purple-500/10', 
          text: 'text-purple-400', 
          border: 'border-purple-500/20',
          icon: <Crown size={small ? 10 : 12} />
        };
      default:
        return { 
          bg: 'bg-zinc-500/10', 
          text: 'text-zinc-400', 
          border: 'border-zinc-500/20',
          icon: <Info size={small ? 10 : 12} />
        };
    }
  };

  const config = getConfig();
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        boxShadow: pulse ? ['0 0 0 0 rgba(59, 130, 246, 0.7)', '0 0 0 10px rgba(59, 130, 246, 0)'] : 'none'
      }}
      transition={{ 
        duration: 0.3,
        boxShadow: pulse ? { repeat: Infinity, duration: 1.5 } : {}
      }}
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border} backdrop-blur-sm ${small ? 'px-2 py-0.5 text-xs' : ''}`}
    >
      {config.icon}
      {status}
    </motion.span>
  );
};

const FloatingNotification: React.FC<{
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  const getConfig = () => {
    switch (type) {
      case 'success':
        return { bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', icon: <CheckCircle className="text-emerald-400" /> };
      case 'error':
        return { bg: 'bg-rose-500/20', border: 'border-rose-500/30', icon: <AlertTriangle className="text-rose-400" /> };
      default:
        return { bg: 'bg-blue-500/20', border: 'border-blue-500/30', icon: <Info className="text-blue-400" /> };
    }
  };

  const config = getConfig();

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className={`fixed top-6 right-6 ${config.bg} border ${config.border} backdrop-blur-lg rounded-xl p-4 min-w-[300px] z-50`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/5">
          {config.icon}
        </div>
        <p className="text-sm text-white flex-1">{message}</p>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

// --- DATA ---
const socialIcons: Record<SocialPlatform, React.FC<any>> = { 
  youtube: Youtube, 
  instagram: Instagram, 
  tiktok: Smartphone, 
  facebook: Facebook, 
  twitter: X 
};

const allPlatforms: PlatformInfo[] = [
  { 
    platform: 'youtube', 
    icon: Youtube, 
    color: 'text-red-600', 
    gradient: 'from-red-500/20 to-red-600/20',
    name: 'YouTube' 
  },
  { 
    platform: 'instagram', 
    icon: Instagram, 
    color: 'text-pink-500', 
    gradient: 'from-pink-500/20 to-purple-600/20',
    name: 'Instagram' 
  },
  { 
    platform: 'facebook', 
    icon: Facebook, 
    color: 'text-blue-600', 
    gradient: 'from-blue-500/20 to-blue-700/20',
    name: 'Facebook' 
  },
  { 
    platform: 'twitter', 
    icon: X, 
    color: 'text-sky-400', 
    gradient: 'from-sky-400/20 to-sky-600/20',
    name: 'X / Twitter' 
  },
  { 
    platform: 'tiktok', 
    icon: Smartphone, 
    color: 'text-black', 
    gradient: 'from-black/20 to-pink-500/20',
    name: 'TikTok' 
  }
];

const followTasks: Task[] = [
  { 
    id: 'f-yt-1', 
    type: 'follow', 
    platform: 'youtube', 
    username: '@SRKUniversity', 
    coins: 150, 
    desc: 'Subscribe to official YouTube channel and stay subscribed for 7 days', 
    title: 'Subscribe Channel',
    status: 'pending',
    required: 'Screenshot showing subscription',
    proofType: 'screenshot'
  },
  { 
    id: 'f-ig-1', 
    type: 'follow', 
    platform: 'instagram', 
    username: '@srk_official', 
    coins: 120, 
    desc: 'Follow the official Instagram page and like 3 recent posts', 
    title: 'Follow Page',
    status: 'pending',
    required: 'Screenshot showing follow and likes',
    proofType: 'screenshot'
  },
  { 
    id: 'f-fb-1', 
    type: 'follow', 
    platform: 'facebook', 
    username: 'SRKOfficialPage', 
    coins: 130, 
    desc: 'Like and Follow the Facebook page, share one post', 
    title: 'Like & Follow',
    status: 'pending',
    required: 'Screenshot showing like, follow, and share',
    proofType: 'screenshot'
  },
  { 
    id: 'f-tw-1', 
    type: 'follow', 
    platform: 'twitter', 
    username: '@SRK_X_Acc', 
    coins: 110, 
    desc: 'Follow the official X (Twitter) account and retweet pinned tweet', 
    title: 'Follow X Account',
    status: 'pending',
    required: 'Screenshot showing follow and retweet',
    proofType: 'screenshot'
  },
  { 
    id: 'f-tt-1', 
    type: 'follow', 
    platform: 'tiktok', 
    username: '@srk_campus', 
    coins: 100, 
    desc: 'Follow SRK on TikTok, like 5 videos', 
    title: 'Follow TikTok',
    status: 'pending',
    required: 'Screenshot showing follow and likes',
    proofType: 'screenshot'
  }
];

const watchTasks: Task[] = [
  { 
    id: 'w-yt-1', 
    type: 'watch', 
    platform: 'youtube', 
    title: 'Welcome to SRK 2025', 
    coins: 200, 
    duration: '4:20', 
    embedId: 'dQw4w9WgXcQ', 
    desc: 'Watch the official welcome video completely without skipping.',
    status: 'pending',
    required: 'Video must play to 100% completion',
    proofType: 'video'
  },
  { 
    id: 'w-ig-1', 
    type: 'watch', 
    platform: 'instagram', 
    title: 'Campus Life Reel', 
    coins: 180, 
    duration: '0:45', 
    embedId: '', 
    desc: 'Watch the latest Campus Life Reel and comment your thoughts.',
    status: 'pending',
    required: 'Screenshot showing watched reel and comment',
    proofType: 'screenshot'
  },
  { 
    id: 'w-tt-1', 
    type: 'watch', 
    platform: 'tiktok', 
    title: 'Day in the Life Vlog', 
    coins: 150, 
    duration: '1:10', 
    embedId: '', 
    desc: 'View the official day-in-the-life video and share it.',
    status: 'pending',
    required: 'Screenshot showing video view and share',
    proofType: 'screenshot'
  },
];

const postTasks: Task[] = [
  { 
    id: 'p-fb-1', 
    type: 'post', 
    platform: 'facebook', 
    title: 'Share Admission Post', 
    coins: 100, 
    desc: 'Share the latest admission post to your wall with caption.', 
    status: 'pending',
    required: 'Screenshot showing post shared on timeline',
    proofType: 'screenshot'
  },
  { 
    id: 'p-tw-1', 
    type: 'post', 
    platform: 'twitter', 
    title: 'Retweet Event', 
    coins: 90, 
    desc: 'Retweet the official event announcement from X with comment.', 
    status: 'pending',
    required: 'Screenshot showing retweet with comment',
    proofType: 'screenshot'
  },
  { 
    id: 'p-ig-1', 
    type: 'post', 
    platform: 'instagram', 
    title: 'Story Share', 
    coins: 120, 
    desc: 'Share SRK story to your Instagram story for 24 hours.', 
    status: 'pending',
    required: 'Screenshot showing story share',
    proofType: 'screenshot'
  },
];

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, user: 'Nova_Star', score: 9800, consistencyDays: 125, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nova', change: 'up', changeAmount: 2 },
  { rank: 2, user: 'SRK_Guru', score: 8500, consistencyDays: 98, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guru', change: 'stable' },
  { rank: 3, user: 'You', score: 8200, consistencyDays: 105, isSelf: true, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You', change: 'up', changeAmount: 1 },
  { rank: 4, user: 'Ace_User', score: 7900, consistencyDays: 62, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ace', change: 'down', changeAmount: 1 },
  { rank: 5, user: 'Galaxy_7', score: 7500, consistencyDays: 45, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Galaxy', change: 'up', changeAmount: 3 },
  { rank: 6, user: 'TaskMaster', score: 7200, consistencyDays: 88, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Task', change: 'stable' },
  { rank: 7, user: 'CoinCollector', score: 6900, consistencyDays: 76, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Coin', change: 'up', changeAmount: 2 },
  { rank: 8, user: 'EarnPro', score: 6500, consistencyDays: 92, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Earn', change: 'down', changeAmount: 1 },
];

const analyticsData: AnalyticsData = {
  totalCoins: 1250,
  today: 470,
  last7Days: 1520,
  last28Days: 4500,
  allTime: 8200,
  history: [
    { date: 'Today', coins: 470 },
    { date: 'Yesterday', coins: 320 },
    { date: '2 days ago', coins: 280 },
    { date: '3 days ago', coins: 210 },
    { date: '4 days ago', coins: 180 },
    { date: '5 days ago', coins: 90 },
    { date: '6 days ago', coins: 60 },
  ],
  activityGraph: [30, 50, 80, 60, 95, 70, 85, 90, 75, 65, 85, 95],
  completionRate: 87,
  averageDaily: 320,
  peakDay: { date: 'Jan 15, 2024', coins: 520 }
};

const userProfile: UserProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+91 9876543210',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  joinDate: 'Jan 1, 2024',
  level: 5,
  xp: 1250,
  nextLevelXP: 2000,
  socialLinks: {
    youtube: '',
    instagram: '',
    facebook: '',
    twitter: '',
    tiktok: '',
  },
  documentStatus: 'pending'
};

// --- MAIN APP COMPONENT ---
const SRKPortal: React.FC = () => {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [dashView, setDashView] = useState<DashboardView>('verification');
  const [showVerification, setShowVerification] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [payoutRequested, setPayoutRequested] = useState(false);
  const [taskCategory, setTaskCategory] = useState<TaskType | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
  const [playingVideo, setPlayingVideo] = useState<Task | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [balance, setBalance] = useState<number>(1250);
  const [eligible, setEligible] = useState<number>(1000);
  const [verifyingTask, setVerifyingTask] = useState<Task | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [rejectedTasks, setRejectedTasks] = useState<RejectedTaskEntry[]>([
    { 
      ...followTasks[0], 
      rejectionReason: "Screenshot blurry, username not visible.", 
      uploadedProofUrl: 'https://placehold.co/400x300/27272a/FFF?text=Subscription+Proof', 
      taskId: 'f-yt-1',
      id: 'f-yt-1-rejected',
      date: '2024-01-15',
      adminComment: 'Please ensure your username is clearly visible in the screenshot',
      canRetry: true
    },
    { 
      ...watchTasks[1], 
      rejectionReason: "Incomplete watch time, video paused at 80%.", 
      uploadedProofUrl: 'https://placehold.co/400x300/27272a/FFF?text=Watch+Proof', 
      taskId: 'w-ig-1',
      id: 'w-ig-1-rejected',
      date: '2024-01-14',
      adminComment: 'Video must be watched completely. Please try again.',
      canRetry: true
    },
    { 
      ...postTasks[0], 
      rejectionReason: "Shared post is private. Make it public.", 
      uploadedProofUrl: 'https://placehold.co/400x300/27272a/FFF?text=Share+Proof', 
      taskId: 'p-fb-1',
      id: 'p-fb-1-rejected',
      date: '2024-01-13',
      adminComment: 'Please set post visibility to public',
      canRetry: true
    },
  ]);
  const [reviewingRejectedTask, setReviewingRejectedTask] = useState<RejectedTaskEntry | null>(null);
  const [identityVerificationStep, setIdentityVerificationStep] = useState<'start' | 'upload' | 'review'>('start');
  const [notifications, setNotifications] = useState<Array<{ id: number; message: string; type: 'success' | 'error' | 'info' }>>([]);
  const [activeTasks, setActiveTasks] = useState<Task[]>([...followTasks, ...watchTasks, ...postTasks]);
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [showPlatformTasks, setShowPlatformTasks] = useState<{platform: SocialPlatform; tasks: Task[]} | null>(null);

  // Add notification
  const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Complete a task
  const completeTask = (taskId: string) => {
    setActiveTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, status: 'completed' as TaskStatus } : task
      )
    );
    setCompleted(prev => [...prev, taskId]);
    
    const task = activeTasks.find(t => t.id === taskId);
    if (task) {
      setBalance(prev => prev + task.coins);
      setEligible(prev => prev + task.coins);
      addNotification(`Task completed! +${task.coins} Coins earned!`, 'success');
    }
  };

  // --- LANDING VIEW ---
  const LandingView = () => (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 text-center px-6 max-w-6xl">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-6">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent animate-gradient">
              EARN THROUGH TASKS
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Transform your social engagement into real rewards. Complete verified tasks, earn coins, and unlock premium features.
          </p>
          
          {/* Animated stats */}
          <div className="flex justify-center gap-8 mb-12">
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '500K+', label: 'Coins Earned' },
              { value: '98%', label: 'Success Rate' },
              { value: '24/7', label: 'Support' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-amber-400">{stat.value}</div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <MagneticButton 
            onClick={() => {
              setView('dashboard');
              addNotification('Welcome to SRK Portal!', 'success');
            }} 
            className="text-lg relative"
          >
            <span className="flex items-center gap-3">
              <Sparkles size={24} />
              Join Now & Start Earning
              <ArrowRight size={24} />
            </span>
            
            {/* Floating coins animation */}
            <motion.div
              className="absolute -top-4 -right-4"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Coins size={20} className="text-amber-400" />
            </motion.div>
          </MagneticButton>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { icon: <Zap size={32} />, title: 'Instant Rewards', desc: 'Get coins immediately after task completion', color: 'from-amber-500/20 to-yellow-500/20' },
            { icon: <Shield size={32} />, title: 'Verified Tasks', desc: 'All tasks are verified for authenticity', color: 'from-blue-500/20 to-cyan-500/20' },
            { icon: <TrendingUp size={32} />, title: 'Growth Opportunities', desc: 'Unlock higher rewards with SRK Grow', color: 'from-purple-500/20 to-pink-500/20' },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <GlassCard hover gradient={index === 0 ? 'gold' : index === 1 ? 'blue' : 'purple'}>
                <div className="p-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <div className="text-amber-400">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-zinc-400">{feature.desc}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Floating animated elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-10 opacity-20"
        >
          <Coins size={40} className="text-amber-400" />
        </motion.div>
        <motion.div
          animate={{
            y: [0, 20, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 right-10 opacity-20"
        >
          <Trophy size={40} className="text-purple-400" />
        </motion.div>
      </div>
    </div>
  );

  // --- VERIFICATION MODAL ---
  const VerificationModal = () => {
    const [name, setName] = useState('');
    const [document, setDocument] = useState<File | null>(null);
    const [documentPreview, setDocumentPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setDocument(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setDocumentPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSubmit = () => {
      if (!name.trim() || !document) {
        addNotification('Please fill all fields and upload document', 'error');
        return;
      }

      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsApproved(true);
        setShowVerification(false);
        setIdentityVerificationStep('start');
        addNotification('Identity verification submitted successfully!', 'success');
        // Update profile status
        setProfile(prev => ({ ...prev, documentStatus: 'verified' }));
      }, 2000);
    };

    const handleMockApprove = () => {
      setIsApproved(true);
      setShowVerification(false);
      setProfile(prev => ({ ...prev, documentStatus: 'verified' }));
      addNotification('Identity verified successfully! All features unlocked.', 'success');
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
        <GlassCard className="w-full max-w-2xl p-8 relative">
          <button 
            onClick={() => setShowVerification(false)} 
            className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>

          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 flex items-center justify-center"
            >
              <ShieldCheck size={40} className="text-amber-400" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">Identity Verification</h2>
            <p className="text-zinc-400">Verify your identity to unlock all earning features</p>
          </div>

          {identityVerificationStep === 'start' ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Full Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name as per ID"
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Government ID Document</label>
                <div 
                  className={`border-2 border-dashed ${documentPreview ? 'border-amber-500/50' : 'border-white/10'} rounded-xl p-8 text-center hover:border-amber-500/30 transition-colors cursor-pointer`}
                  onClick={() => document.getElementById('document-upload')?.click()}
                >
                  <input
                    type="file"
                    id="document-upload"
                    onChange={handleDocumentUpload}
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                  {documentPreview ? (
                    <div className="space-y-4">
                      <img 
                        src={documentPreview} 
                        alt="Document preview" 
                        className="max-h-48 mx-auto rounded-lg object-contain"
                      />
                      <p className="text-sm text-amber-400">Document uploaded: {document?.name}</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setDocument(null);
                          setDocumentPreview(null);
                        }}
                        className="text-sm text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={40} className="mx-auto mb-4 text-zinc-400" />
                      <p className="text-zinc-400 mb-2">Click to upload ID (Aadhar, Passport, etc.)</p>
                      <p className="text-xs text-zinc-500">Max file size: 5MB • JPG, PNG, PDF</p>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <MagneticButton 
                  onClick={handleSubmit}
                  disabled={!name.trim() || !document || isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw size={16} className="animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    'Submit for Verification'
                  )}
                </MagneticButton>

                <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                  <p className="text-sm text-amber-400 mb-2 flex items-center gap-2">
                    <Zap size={16} /> For testing purposes only:
                  </p>
                  <button
                    onClick={handleMockApprove}
                    className="text-sm text-white hover:text-amber-300 underline flex items-center gap-1"
                  >
                    <Sparkles size={14} /> Click here to mock approve and see all options
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </GlassCard>
      </div>
    );
  };

  // --- SIDEBAR COMPONENT ---
  const Sidebar = () => {
    const navItems: { view: DashboardView; icon: React.FC<any>; label: string; requiresApproval?: boolean; badge?: number }[] = [
      { view: 'verification', icon: Shield, label: 'Verification', badge: !isApproved ? 1 : undefined },
      { view: 'analytics', icon: BarChart3, label: 'Analytics', requiresApproval: true },
      { view: 'tasks', icon: ListChecks, label: 'Tasks', requiresApproval: true, badge: rejectedTasks.length },
      { view: 'leaderboard', icon: Trophy, label: 'Leaderboard', requiresApproval: true },
      { view: 'coinExchange', icon: DollarSign, label: 'Coin Exchange', requiresApproval: true },
      { view: 'profile', icon: UserCircle, label: 'Profile', requiresApproval: true },
      { view: 'payout', icon: Wallet, label: 'Legacy Payout', requiresApproval: true },
      { view: 'logout', icon: LogOut, label: 'Logout' },
    ];

    return (
      <aside className="w-full lg:w-64 flex-shrink-0">
        <GlassCard className="h-full p-6">
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] flex items-center justify-center"
            >
              <span className="font-bold text-black text-xl">S</span>
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-white">SRK Portal</h1>
              <p className="text-xs text-zinc-400">Earn Through Tasks</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isDisabled = item.requiresApproval && !isApproved;
              const isActive = dashView === item.view;
              
              return (
                <motion.button
                  key={item.view}
                  onClick={() => {
                    if (!isDisabled && item.view !== 'logout') {
                      setDashView(item.view);
                    }
                    if (item.view === 'logout') {
                      setView('landing');
                      addNotification('Logged out successfully', 'info');
                    }
                  }}
                  whileHover={!isDisabled ? { x: 5 } : {}}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative
                    ${isActive 
                      ? 'bg-gradient-to-r from-[#b68938]/20 to-[#b68938]/10 text-white border border-white/10' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                    ${item.view === 'logout' ? 'mt-8 border-t border-white/10 pt-8' : ''}
                  `}
                  disabled={isDisabled}
                >
                  <Icon size={18} className={isActive ? 'text-amber-400' : ''} />
                  <span className="text-sm font-medium">{item.label}</span>
                  
                  {item.badge && (
                    <span className="ml-auto px-2 py-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                  
                  {isDisabled && (
                    <Lock size={14} className="ml-auto text-zinc-500" />
                  )}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-400 rounded-r-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Balance display */}
          <div className="mt-8 p-4 bg-gradient-to-r from-[#b68938]/10 to-[#e1ba73]/10 rounded-xl border border-white/10">
            <p className="text-xs text-zinc-400 mb-1">Your Balance</p>
            <div className="flex items-center gap-2">
              <Coins size={16} className="text-amber-400" />
              <p className="text-lg font-bold text-white">{balance.toLocaleString()} Coins</p>
            </div>
            <p className="text-xs text-zinc-500 mt-1">Eligible: {eligible} Coins</p>
          </div>
        </GlassCard>
      </aside>
    );
  };

  // --- VERIFICATION VIEW ---
  const VerificationView = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          <GradientText>Account Verification</GradientText>
        </h1>
        <p className="text-zinc-400">Complete verification to unlock all earning features</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Identity Verification Card */}
        <GlassCard hover>
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 15 }}
                  className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 flex items-center justify-center"
                >
                  <ShieldCheck size={24} className="text-amber-400" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-white">Identity Verification</h3>
                  <p className="text-sm text-zinc-400">Required for earning</p>
                </div>
              </div>
              <StatusBadge status={isApproved ? 'Verified' : 'Pending'} pulse={!isApproved} />
            </div>

            <p className="text-zinc-400 mb-6">
              Verify your identity to access tasks, analytics, leaderboard, and coin exchange features.
              Upload a government-issued ID document for verification.
            </p>

            {!isApproved ? (
              <MagneticButton onClick={() => setShowVerification(true)} className="w-full">
                <span className="flex items-center justify-center gap-2">
                  <Camera size={18} />
                  Start Verification
                </span>
              </MagneticButton>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center gap-3"
              >
                <CheckCircle size={20} className="text-emerald-400" />
                <span className="text-sm text-emerald-300">Your identity has been verified! All features are now unlocked.</span>
              </motion.div>
            )}
          </div>
        </GlassCard>

        {/* SRK Grow Package Card (Only shows after verification) */}
        {isApproved && (
          <GlassCard hover gradient="purple" className="relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
            
            <div className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center"
                  >
                    <Crown size={24} className="text-purple-400" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-white">SRK Grow Package</h3>
                    <p className="text-sm text-zinc-400">Premium features</p>
                  </div>
                </div>
                <StatusBadge status={hasPurchased ? 'Active' : 'Available'} />
              </div>

              <ul className="space-y-3 mb-6">
                {[
                  'Profile customization & social links',
                  'Request custom promotion tasks',
                  'Higher commission rates (up to 30% more)',
                  'Priority support & faster verification',
                  'Advanced analytics dashboard',
                  'Exclusive leaderboard badges',
                  'Early access to new features',
                  'Custom task scheduling'
                ].map((feature, idx) => (
                  <motion.li 
                    key={feature} 
                    className="flex items-center gap-2 text-zinc-300"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Check size={16} className="text-purple-400" />
                    {feature}
                  </motion.li>
                ))}
              </ul>

              <div className="flex items-center justify-between mb-6">
                <span className="text-zinc-400">One-time payment</span>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl font-bold text-purple-400"
                >
                  Rs. 999
                </motion.div>
              </div>

              {!hasPurchased ? (
                <MagneticButton 
                  onClick={() => {
                    setHasPurchased(true);
                    addNotification('SRK Grow Package activated successfully!', 'success');
                  }}
                  variant="premium"
                  className="w-full"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Crown size={18} />
                    Purchase Package
                  </span>
                </MagneticButton>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20 flex items-center gap-3"
                >
                  <Sparkles size={20} className="text-purple-400" />
                  <span className="text-sm text-purple-300">Package active! Check Profile tab for premium features.</span>
                </motion.div>
              )}
            </div>
          </GlassCard>
        )}
      </div>

      {/* Progress indicator */}
      {!isApproved && (
        <GlassCard className="mt-8">
          <div className="p-6">
            <h4 className="text-lg font-bold text-white mb-4">Verification Progress</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Step 1: Identity Verification</span>
                <StatusBadge status={isApproved ? 'Completed' : 'Pending'} small />
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-500"
                  initial={{ width: '0%' }}
                  animate={{ width: isApproved ? '50%' : '0%' }}
                  transition={{ duration: 1 }}
                />
              </div>
              
              <div className="flex items-center justify-between opacity-50">
                <span className="text-zinc-400">Step 2: SRK Grow Package</span>
                <StatusBadge status={hasPurchased ? 'Completed' : 'Locked'} small />
              </div>
              <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: '0%' }}
                  animate={{ width: hasPurchased ? '100%' : isApproved ? '50%' : '0%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );

  // --- ANALYTICS VIEW ---
  const AnalyticsView = () => {
    const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'all'>('week');
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);

    const StatCard = ({ title, value, icon: Icon, change, gradient }: any) => (
      <GlassCard hover gradient={gradient}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Icon size={24} className="text-amber-400" />
            </motion.div>
            <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </div>
          </div>
          <p className="text-sm text-zinc-400 mb-2">{title}</p>
          <motion.p 
            key={value}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-bold text-white"
          >
            {value.toLocaleString()} Coins
          </motion.p>
        </div>
      </GlassCard>
    );

    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              <GradientText>Performance Analytics</GradientText>
            </h1>
            <p className="text-zinc-400">Track your earnings and activity in real-time</p>
          </div>
          <div className="flex gap-2">
            {(['day', 'week', 'month', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-white'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <StatCard title="Total Coins" value={analyticsData.totalCoins} icon={Wallet} change={12.5} gradient="gold" />
          </div>
          <div>
            <StatCard title="Today" value={analyticsData.today} icon={Activity} change={8.2} gradient="blue" />
          </div>
          <div>
            <StatCard title="7 Days" value={analyticsData.last7Days} icon={TrendingUp} change={15.3} gradient="green" />
          </div>
          <div className="md:col-span-2">
            <StatCard title="28 Days" value={analyticsData.last28Days} icon={Calendar} change={22.7} gradient="purple" />
          </div>
          <div className="md:col-span-2">
            <StatCard title="All Time" value={analyticsData.allTime} icon={Award} change={45.8} gradient="gold" />
          </div>
        </div>

        {/* Detailed Analytics Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Activity Graph */}
          <GlassCard className="lg:col-span-2">
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-6">Activity Graph</h3>
              <div className="h-48 flex items-end justify-between gap-1">
                {analyticsData.activityGraph.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${value}%` }}
                    transition={{ duration: 1, delay: index * 0.05 }}
                    className="flex-1 relative group"
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <div 
                      className={`w-full bg-gradient-to-t from-amber-500 to-yellow-500 rounded-t-lg transition-all duration-300 ${
                        hoveredBar === index ? 'opacity-100' : 'opacity-80'
                      }`}
                      style={{ height: `${value}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    {/* Tooltip on hover */}
                    {hoveredBar === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/10 px-3 py-2 rounded-lg shadow-lg z-10"
                      >
                        <p className="text-xs text-white whitespace-nowrap">
                          Day {index + 1}: {value} Coins
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-zinc-500 mt-4">
                <span>Day 1</span>
                <span>Day 6</span>
                <span>Day 12</span>
              </div>
            </div>
          </GlassCard>

          {/* Stats & History */}
          <div className="space-y-6">
            <GlassCard>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-6">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Completion Rate</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-green-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${analyticsData.completionRate}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                      <span className="text-white font-medium">{analyticsData.completionRate}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Average Daily</span>
                    <span className="text-white font-medium">{analyticsData.averageDaily} Coins</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Peak Day</span>
                    <span className="text-amber-400 font-medium">{analyticsData.peakDay.coins} Coins</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-6">Recent History</h3>
                <div className="space-y-4 max-h-48 overflow-y-auto">
                  {analyticsData.history.map((day, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
                          <Calendar size={14} className="text-amber-400" />
                        </div>
                        <span className="text-zinc-400">{day.date}</span>
                      </div>
                      <span className="text-white font-medium">+{day.coins} Coins</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  };

  // --- TASKS VIEW ---
  const TasksView = () => {
    if (!isApproved) {
      return (
        <GlassCard className="p-12 text-center">
          <Shield size={48} className="text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">Verification Required</h3>
          <p className="text-zinc-400 mb-8">Complete identity verification to access earning tasks</p>
          <MagneticButton onClick={() => setDashView('verification')}>
            Go to Verification
          </MagneticButton>
        </GlassCard>
      );
    }

    // Platform Tasks Modal
    const PlatformTasksModal = () => {
      if (!showPlatformTasks) return null;

      const platformInfo = allPlatforms.find(p => p.platform === showPlatformTasks.platform);
      const Icon = platformInfo?.icon;

      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
          <GlassCard className="w-full max-w-4xl max-h-[90vh] overflow-auto p-8 relative">
            <button onClick={() => setShowPlatformTasks(null)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg">
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${platformInfo?.gradient} flex items-center justify-center`}>
                {Icon && React.createElement(Icon, { size: 32, className: platformInfo?.color })}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">{platformInfo?.name} Tasks</h2>
                <p className="text-zinc-400">{showPlatformTasks.tasks.length} available tasks</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {showPlatformTasks.tasks.map((task, idx) => (
                <GlassCard key={task.id} hover delay={idx * 0.1}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">{task.title}</h4>
                        <p className="text-sm text-zinc-400">{task.desc}</p>
                      </div>
                      <StatusBadge status={task.status || 'Available'} small />
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Coins size={16} className="text-amber-400" />
                        <span className="text-lg font-bold text-amber-400">+{task.coins}</span>
                      </div>
                      {task.duration && (
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Clock size={14} />
                          <span className="text-sm">{task.duration}</span>
                        </div>
                      )}
                    </div>

                    <MagneticButton 
                      small 
                      onClick={() => {
                        setShowPlatformTasks(null);
                        if (task.type === 'watch') {
                          setPlayingVideo(task);
                        } else {
                          setVerifyingTask(task);
                        }
                      }}
                      className="w-full"
                    >
                      {task.type === 'watch' ? 'Watch Video' : 'Start Task'}
                    </MagneticButton>
                  </div>
                </GlassCard>
              ))}
            </div>
          </GlassCard>
        </div>
      );
    };

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            <GradientText>Earning Tasks</GradientText>
          </h1>
          <p className="text-zinc-400">Complete tasks to earn coins. Click on any category to view available tasks.</p>
        </div>

        {/* Task Categories */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { 
              type: 'follow' as TaskType, 
              icon: Users, 
              title: 'Follow & Subscribe', 
              desc: 'Follow social accounts and subscribe to channels', 
              color: 'from-blue-500/20 to-cyan-500/20',
              tasks: followTasks 
            },
            { 
              type: 'watch' as TaskType, 
              icon: Play, 
              title: 'Watch & Earn', 
              desc: 'Watch videos and earn coins', 
              color: 'from-red-500/20 to-pink-500/20',
              tasks: watchTasks 
            },
            { 
              type: 'post' as TaskType, 
              icon: Share2, 
              title: 'Post & Share', 
              desc: 'Share content on social media', 
              color: 'from-green-500/20 to-emerald-500/20',
              tasks: postTasks 
            },
          ].map((category) => {
            const Icon = category.icon;
            const platformTasks = category.tasks.reduce((acc: Record<SocialPlatform, Task[]>, task) => {
              if (!acc[task.platform]) acc[task.platform] = [];
              acc[task.platform].push(task);
              return acc;
            }, {});

            return (
              <GlassCard 
                key={category.type} 
                hover 
                onClick={() => setTaskCategory(category.type)}
                className="cursor-pointer"
              >
                <div className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-6`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{category.title}</h3>
                  <p className="text-zinc-400 mb-6">{category.desc}</p>
                  
                  {/* Platform icons */}
                  <div className="flex gap-2 mb-6">
                    {Object.entries(platformTasks).map(([platform, tasks]) => {
                      const platformInfo = allPlatforms.find(p => p.platform === platform);
                      const PlatformIcon = platformInfo?.icon;
                      return (
                        <button
                          key={platform}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowPlatformTasks({
                              platform: platform as SocialPlatform,
                              tasks: tasks
                            });
                          }}
                          className={`p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors`}
                        >
                          {PlatformIcon && React.createElement(PlatformIcon, { 
                            size: 20, 
                            className: platformInfo?.color 
                          })}
                        </button>
                      );
                    })}
                  </div>

                  <MagneticButton small className="w-fit">
                    View Tasks <ArrowRight size={16} />
                  </MagneticButton>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Rejected Tasks Section */}
        {rejectedTasks.length > 0 && (
          <GlassCard className="bg-gradient-to-br from-red-900/20 to-rose-900/20 border-red-500/30">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle size={28} className="text-red-400" />
                <div>
                  <h3 className="text-2xl font-bold text-white">Rejected Tasks</h3>
                  <p className="text-zinc-400">Review and resubmit your rejected tasks</p>
                </div>
                <span className="ml-auto px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
                  {rejectedTasks.length} pending
                </span>
              </div>
              
              <div className="space-y-4">
                {rejectedTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${allPlatforms.find(p => p.platform === task.platform)?.gradient} flex items-center justify-center`}>
                        {React.createElement(socialIcons[task.platform], { 
                          size: 20, 
                          className: allPlatforms.find(p => p.platform === task.platform)?.color 
                        })}
                      </div>
                      <div>
                        <p className="font-medium text-white">{task.title}</p>
                        <p className="text-sm text-zinc-400">{task.rejectionReason}</p>
                        <p className="text-xs text-zinc-500 mt-1">{task.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setReviewingRejectedTask(task)}
                        className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium"
                      >
                        Review
                      </button>
                      {task.canRetry && (
                        <button
                          onClick={() => {
                            const originalTask = activeTasks.find(t => t.id === task.taskId);
                            if (originalTask) {
                              setVerifyingTask(originalTask);
                              setRejectedTasks(prev => prev.filter(t => t.id !== task.id));
                              addNotification('Task ready for resubmission', 'info');
                            }
                          }}
                          className="px-4 py-2 bg-amber-500/10 text-amber-400 rounded-lg hover:bg-amber-500/20 transition-colors text-sm font-medium"
                        >
                          Retry
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>
        )}

        {/* Completed Tasks */}
        {completed.length > 0 && (
          <GlassCard className="bg-gradient-to-br from-emerald-900/20 to-green-900/20 border-emerald-500/30">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle size={28} className="text-emerald-400" />
                <div>
                  <h3 className="text-2xl font-bold text-white">Completed Tasks</h3>
                  <p className="text-zinc-400">Tasks you've successfully completed</p>
                </div>
                <span className="ml-auto px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
                  {completed.length} completed
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completed.slice(0, 6).map((taskId, idx) => {
                  const task = activeTasks.find(t => t.id === taskId);
                  if (!task) return null;
                  const platformInfo = allPlatforms.find(p => p.platform === task.platform);
                  
                  return (
                    <motion.div
                      key={taskId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 bg-white/5 rounded-xl"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg ${platformInfo?.gradient} flex items-center justify-center`}>
                          {React.createElement(socialIcons[task.platform], { 
                            size: 16, 
                            className: platformInfo?.color 
                          })}
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{task.title}</p>
                          <p className="text-xs text-zinc-500">{platformInfo?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-400 text-sm font-medium">+{task.coins} Coins</span>
                        <CheckCircle size={14} className="text-emerald-400" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        )}

        <PlatformTasksModal />
      </div>
    );
  };

  // --- TASK MODALS ---
  const PlatformSelectorModal = ({ type, onClose }: any) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
      <GlassCard className="w-full max-w-4xl max-h-[90vh] overflow-auto p-8 relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg">
          <X size={20} />
        </button>

        <h2 className="text-3xl font-bold text-white mb-6">Select Platform</h2>
        <p className="text-zinc-400 mb-8">Choose a platform to view available {type} tasks</p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {allPlatforms.map((p) => {
            const Icon = p.icon;
            const taskCount = type === 'follow' ? followTasks.filter(t => t.platform === p.platform).length :
                           type === 'watch' ? watchTasks.filter(t => t.platform === p.platform).length :
                           postTasks.filter(t => t.platform === p.platform).length;
            
            return (
              <GlassCard 
                key={p.platform}
                hover
                onClick={() => {
                  setSelectedPlatform(p.platform);
                }}
                className="cursor-pointer"
              >
                <div className="p-6 text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-gradient-to-br ${p.gradient}`}
                  >
                    <Icon size={28} className={p.platform === 'tiktok' ? 'text-white' : p.color} />
                  </motion.div>
                  <p className="font-semibold text-white mb-1">{p.name}</p>
                  <p className="text-sm text-zinc-400">{taskCount} tasks</p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );

  // Platform Specific Task Modal
  const PlatformSpecificTaskModal = ({ platform, type, onClose, onBack }: any) => {
    const tasks = type === 'follow' ? followTasks.filter(t => t.platform === platform) :
                  type === 'watch' ? watchTasks.filter(t => t.platform === platform) :
                  postTasks.filter(t => t.platform === platform);
    
    const platformInfo = allPlatforms.find(p => p.platform === platform);
    const Icon = platformInfo?.icon;
    
    const handleTaskClick = (task: Task) => {
      if (task.type === 'watch') {
        setPlayingVideo(task);
      } else {
        setVerifyingTask(task);
      }
      onClose();
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
        <GlassCard className="w-full max-w-4xl max-h-[90vh] overflow-auto p-8 relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg">
            <X size={20} />
          </button>

          <button 
            onClick={onBack} 
            className="absolute top-6 left-6 p-2 text-zinc-400 hover:text-white flex items-center gap-1"
          >
            <ArrowRight size={16} className="rotate-180" /> Back
          </button>

          <div className="text-center mt-4 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${platformInfo?.gradient} flex items-center justify-center`}>
                {Icon && React.createElement(Icon, { size: 28, className: platformInfo?.color })}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">{platformInfo?.name} {type.charAt(0).toUpperCase() + type.slice(1)} Tasks</h2>
                <p className="text-zinc-400">{tasks.length} available tasks</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {tasks.length > 0 ? tasks.map((task, idx) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard hover className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {task.type === 'watch' ? (
                        <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={`https://img.youtube.com/vi/${task.embedId || 'dQw4w9WgXcQ'}/hqdefault.jpg`}
                            alt={task.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Play size={24} className="text-white" />
                          </div>
                          {task.duration && (
                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
                              {task.duration}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center flex-shrink-0">
                          {task.type === 'follow' ? <Users size={20} className="text-amber-400" /> : <Share2 size={20} className="text-amber-400" />}
                        </div>
                      )}
                      
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">{task.title}</h4>
                        <p className="text-sm text-zinc-400 mb-2">{task.desc}</p>
                        {task.username && (
                          <p className="text-sm text-zinc-500">Account: {task.username}</p>
                        )}
                        <p className="text-xs text-amber-400 mt-2">{task.required}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Coins size={20} className="text-amber-400" />
                        <span className="text-xl font-bold text-amber-400">+{task.coins}</span>
                      </div>
                      
                      <MagneticButton 
                        small 
                        onClick={() => handleTaskClick(task)}
                        className="!px-6"
                      >
                        {task.type === 'watch' ? 'Watch Video' : 'Start Task'}
                      </MagneticButton>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )) : (
              <div className="text-center p-10 bg-white/5 rounded-xl">
                <p className="text-lg font-semibold text-zinc-400">No {type} tasks available for {platformInfo?.name}</p>
                <p className="text-sm text-zinc-500 mt-2">Check back later for new tasks</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    );
  };

  // Verification Upload Modal
  const VerificationUploadModal = ({ task, onClose }: any) => {
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setScreenshot(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSubmit = () => {
      if (!screenshot) {
        addNotification('Please upload a screenshot first', 'error');
        return;
      }

      setIsUploading(true);
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            completeTask(task.id);
            addNotification(`Proof submitted for ${task.title}`, 'success');
            setTimeout(() => onClose(), 1000);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    };

    const platformInfo = allPlatforms.find(p => p.platform === task.platform);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
        <GlassCard className="w-full max-w-2xl p-8 relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg">
            <X size={20} />
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 flex items-center justify-center mx-auto mb-4">
              <Upload size={28} className="text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Submit Proof</h2>
            <p className="text-zinc-400">Upload screenshot for verification</p>
          </div>

          <div className="space-y-6">
            {/* Task Info */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platformInfo?.gradient} flex items-center justify-center`}>
                  {platformInfo?.icon && React.createElement(platformInfo.icon, { 
                    size: 20, 
                    className: platformInfo.color 
                  })}
                </div>
                <div>
                  <h4 className="font-bold text-white">{task.title}</h4>
                  <p className="text-sm text-zinc-400">{task.desc}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Coins size={20} className="text-amber-400" />
                  <span className="text-lg font-bold text-amber-400">+{task.coins}</span>
                </div>
              </div>
              <p className="text-sm text-amber-400 bg-amber-500/10 p-3 rounded-lg">
                📸 {task.required}
              </p>
            </GlassCard>

            {/* Upload Area */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Upload Screenshot Proof
              </label>
              <div 
                className={`border-2 border-dashed ${preview ? 'border-amber-500/50' : 'border-white/10'} rounded-xl p-8 text-center hover:border-amber-500/30 transition-colors cursor-pointer`}
                onClick={() => document.getElementById('screenshot-upload')?.click()}
              >
                <input
                  type="file"
                  id="screenshot-upload"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".jpg,.jpeg,.png"
                  disabled={isUploading}
                />
                
                {preview ? (
                  <div className="space-y-4">
                    <img 
                      src={preview} 
                      alt="Screenshot preview" 
                      className="max-h-48 mx-auto rounded-lg object-contain"
                    />
                    <p className="text-sm text-amber-400">Screenshot ready for submission</p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setScreenshot(null);
                        setPreview(null);
                      }}
                      className="text-sm text-red-400 hover:text-red-300"
                      disabled={isUploading}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={40} className="mx-auto mb-4 text-zinc-400" />
                    <p className="text-zinc-400 mb-2">Click to upload screenshot</p>
                    <p className="text-xs text-zinc-500">JPG, PNG • Max 5MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-500"
                    initial={{ width: '0%' }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <MagneticButton 
              onClick={handleSubmit}
              disabled={!screenshot || isUploading}
              className="w-full"
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw size={16} className="animate-spin" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Send size={16} />
                  Submit Proof
                </span>
              )}
            </MagneticButton>
          </div>
        </GlassCard>
      </div>
    );
  };

  // Video Player Modal
  const VideoPlayerModal = ({ task, onClose }: any) => {
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      if (isComplete) return;
      
      const interval = setInterval(() => {
        if (isPlaying && progress < 100) {
          setProgress(prev => {
            const newProgress = Math.min(prev + 0.5, 100);
            if (newProgress === 100) {
              setIsComplete(true);
              addNotification('Video watched completely!', 'success');
            }
            return newProgress;
          });
        }
      }, 100);

      return () => clearInterval(interval);
    }, [isPlaying, progress, isComplete]);

    const handlePlay = () => {
      setIsPlaying(true);
      if (videoRef.current) {
        videoRef.current.play();
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };

    const handleComplete = () => {
      setIsComplete(true);
      completeTask(task.id);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-sm">
        <GlassCard className="w-full max-w-4xl p-8 relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg z-10">
            <X size={20} />
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">{task.title}</h2>
            <p className="text-zinc-400">{task.desc}</p>
          </div>

          {/* Video Player */}
          <div className="aspect-video bg-zinc-900 rounded-xl mb-6 overflow-hidden relative">
            {task.platform === 'youtube' && task.embedId ? (
              <iframe
                src={`https://www.youtube.com/embed/${task.embedId}?autoplay=1&controls=1`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                title={task.title}
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onEnded={() => setIsComplete(true)}
                  controls
                >
                  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                </video>
                
                {/* Custom overlay */}
                {!isPlaying && !isComplete && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <button
                      onClick={handlePlay}
                      className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Play size={32} className="text-white ml-2" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Progress and Controls */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Progress</span>
              <span className="text-2xl font-bold text-amber-400">{Math.round(progress)}%</span>
            </div>
            
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-500"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Control buttons */}
            <div className="flex gap-4">
              <button
                onClick={isPlaying ? handlePause : handlePlay}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  isPlaying 
                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                    : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                }`}
              >
                {isPlaying ? 'Pause' : 'Play'} Video
              </button>

              <div className="flex-1" />

              {isComplete ? (
                <MagneticButton 
                  onClick={() => {
                    onClose();
                    setVerifyingTask(task);
                  }}
                  className="!px-8"
                >
                  <span className="flex items-center gap-2">
                    <Camera size={16} />
                    Submit Screenshot
                  </span>
                </MagneticButton>
              ) : (
                <MagneticButton 
                  onClick={handleComplete}
                  disabled={!isComplete}
                  className="!px-8"
                >
                  {isComplete ? 'Complete' : 'Watch to Complete'}
                </MagneticButton>
              )}
            </div>

            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center gap-3"
              >
                <CheckCircle size={20} className="text-emerald-400" />
                <span className="text-sm text-emerald-300">
                  Video watched completely! You earned +{task.coins} Coins
                </span>
              </motion.div>
            )}
          </div>
        </GlassCard>
      </div>
    );
  };

  // Rejected Task Review Modal
  const RejectedTaskReviewModal = ({ task, onClose }: any) => {
    const originalTask = activeTasks.find(t => t.id === task.taskId);
    const platformInfo = allPlatforms.find(p => p.platform === task.platform);

    const handleRetry = () => {
      if (originalTask) {
        setVerifyingTask(originalTask);
        setRejectedTasks(prev => prev.filter(t => t.id !== task.id));
        addNotification('Task ready for resubmission', 'info');
        onClose();
      }
    };

    const handleCancel = () => {
      setRejectedTasks(prev => prev.filter(t => t.id !== task.id));
      addNotification('Task removed from rejected list', 'info');
      onClose();
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
        <GlassCard className="w-full max-w-2xl p-8 relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg">
            <X size={20} />
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500/20 to-rose-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Task Rejected</h2>
            <p className="text-zinc-400">Review why your task was rejected</p>
          </div>

          <div className="space-y-6">
            {/* Task Details */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platformInfo?.gradient} flex items-center justify-center`}>
                  {platformInfo?.icon && React.createElement(platformInfo.icon, { 
                    size: 20, 
                    className: platformInfo.color 
                  })}
                </div>
                <div>
                  <h4 className="font-bold text-white">{task.title}</h4>
                  <p className="text-sm text-zinc-400">{task.desc}</p>
                </div>
                <div className="ml-auto">
                  <Coins size={20} className="text-amber-400" />
                  <span className="text-lg font-bold text-amber-400">+{task.coins}</span>
                </div>
              </div>
            </GlassCard>

            {/* Rejection Details */}
            <div className="space-y-4">
              <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                <h4 className="font-bold text-red-400 mb-2">Rejection Reason</h4>
                <p className="text-white">{task.rejectionReason}</p>
              </div>

              {task.adminComment && (
                <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                  <h4 className="font-bold text-amber-400 mb-2">Admin Comment</h4>
                  <p className="text-white">{task.adminComment}</p>
                </div>
              )}

              {/* Uploaded Proof */}
              <div>
                <h4 className="font-bold text-zinc-400 mb-2">Your Submission</h4>
                <div className="aspect-video w-full bg-zinc-800 rounded-xl overflow-hidden border border-white/10">
                  <img 
                    src={task.uploadedProofUrl} 
                    alt="Uploaded proof" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-2 text-center">Submitted on {task.date}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              {task.canRetry ? (
                <MagneticButton onClick={handleRetry} className="flex-1">
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw size={16} />
                    Retry Task
                  </span>
                </MagneticButton>
              ) : (
                <button
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
                >
                  Remove from List
                </button>
              )}
              
              <button
                onClick={onClose}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  };

  // Request Task Modal
  const RequestTaskModal = ({ onClose }: any) => {
    const [step, setStep] = useState(1);
    const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
    const [taskType, setTaskType] = useState<TaskType | null>(null);
    const [taskUrl, setTaskUrl] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
      if (!selectedPlatform || !taskType || !taskUrl.trim()) {
        addNotification('Please fill all required fields', 'error');
        return;
      }

      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        addNotification('Task request submitted successfully!', 'success');
        onClose();
      }, 2000);
    };

    const renderStep = () => {
      switch (step) {
        case 1:
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Select Platform</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {allPlatforms.map(p => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.platform}
                      onClick={() => {
                        setSelectedPlatform(p.platform);
                        setStep(2);
                      }}
                      className={`p-4 rounded-xl transition-all ${
                        selectedPlatform === p.platform
                          ? 'bg-gradient-to-br ' + p.gradient
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <Icon size={24} className={`mx-auto mb-2 ${selectedPlatform === p.platform ? 'text-white' : p.color}`} />
                      <p className="text-sm font-medium text-white">{p.name}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          );

        case 2:
          return (
            <div className="space-y-6">
              <button onClick={() => setStep(1)} className="text-sm text-zinc-400 hover:text-white flex items-center gap-1">
                <ArrowRight size={14} className="rotate-180" /> Back
              </button>
              
              <h3 className="text-xl font-bold text-white">Select Task Type</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { type: 'follow' as TaskType, icon: Users, label: 'Follow/Subscribe' },
                  { type: 'watch' as TaskType, icon: Play, label: 'Watch Video' },
                  { type: 'post' as TaskType, icon: Share2, label: 'Post/Share' },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.type}
                      onClick={() => {
                        setTaskType(item.type);
                        setStep(3);
                      }}
                      className={`p-6 rounded-xl transition-all ${
                        taskType === item.type
                          ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <Icon size={24} className="text-amber-400 mx-auto mb-3" />
                      <p className="font-medium text-white">{item.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          );

        case 3:
          return (
            <div className="space-y-6">
              <button onClick={() => setStep(2)} className="text-sm text-zinc-400 hover:text-white flex items-center gap-1">
                <ArrowRight size={14} className="rotate-180" /> Back
              </button>
              
              <h3 className="text-xl font-bold text-white">Task Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Task URL
                  </label>
                  <input
                    type="url"
                    value={taskUrl}
                    onChange={(e) => setTaskUrl(e.target.value)}
                    placeholder="Enter the URL for the task"
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what you want to promote..."
                    rows={4}
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <MagneticButton 
                onClick={handleSubmit}
                disabled={!taskUrl.trim() || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw size={16} className="animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  'Submit Request'
                )}
              </MagneticButton>
            </div>
          );
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
        <GlassCard className="w-full max-w-2xl p-8 relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg">
            <X size={20} />
          </button>

          <div className="text-center mb-8">
            <Ticket size={40} className="text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Request Custom Task</h2>
            <p className="text-zinc-400">Step {step} of 3</p>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-zinc-800 rounded-full mt-4 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-500"
                initial={{ width: '0%' }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {renderStep()}
        </GlassCard>
      </div>
    );
  };

  // --- LEADERBOARD VIEW ---
  const LeaderboardView = () => {
    const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredData = leaderboardData.filter(user =>
      user.user.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              <GradientText>Leaderboard</GradientText>
            </h1>
            <p className="text-zinc-400">Top performers and your ranking</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>
            
            <div className="flex gap-2">
              {(['weekly', 'monthly', 'allTime'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeRange === range
                      ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-white'
                      : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {filteredData.slice(0, 3).map((user, index) => (
            <motion.div
              key={user.rank}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex flex-col items-center ${index === 1 ? '-mt-8' : ''}`}
            >
              {/* Rank Badge */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                index === 0 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                index === 1 ? 'bg-gradient-to-r from-zinc-400 to-zinc-300' :
                'bg-gradient-to-r from-amber-700 to-orange-600'
              }`}>
                <span className="text-2xl font-bold text-white">#{user.rank}</span>
              </div>
              
              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`w-24 h-24 rounded-full border-4 mb-4 overflow-hidden ${
                  index === 0 ? 'border-yellow-500' :
                  index === 1 ? 'border-zinc-400' :
                  'border-amber-700'
                } ${user.isSelf ? 'ring-4 ring-purple-500/50' : ''}`}
              >
                <img 
                  src={user.avatar} 
                  alt={user.user}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              {/* User Info */}
              <div className={`text-center px-6 py-4 rounded-xl w-full ${
                index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20' :
                index === 1 ? 'bg-gradient-to-r from-zinc-500/20 to-zinc-400/20' :
                'bg-gradient-to-r from-amber-700/20 to-orange-700/20'
              }`}>
                <p className="font-bold text-white text-lg mb-1">{user.user}</p>
                {user.isSelf && (
                  <span className="text-xs text-purple-400 font-medium mb-2">YOU</span>
                )}
                <p className="text-3xl font-bold mt-2 mb-1">{user.score.toLocaleString()}</p>
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp size={12} className="text-green-400" />
                  <span className="text-xs text-zinc-400">{user.consistencyDays} days</span>
                </div>
                
                {/* Rank Change */}
                {user.change && (
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs mt-2 ${
                    user.change === 'up' ? 'bg-green-500/20 text-green-400' :
                    user.change === 'down' ? 'bg-red-500/20 text-red-400' :
                    'bg-zinc-500/20 text-zinc-400'
                  }`}>
                    {user.change === 'up' ? '↑' : user.change === 'down' ? '↓' : '→'}
                    {user.changeAmount || ''}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rest of leaderboard */}
        <GlassCard>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-zinc-400 font-medium">Rank</th>
                    <th className="text-left py-3 px-4 text-zinc-400 font-medium">User</th>
                    <th className="text-left py-3 px-4 text-zinc-400 font-medium">Score</th>
                    <th className="text-left py-3 px-4 text-zinc-400 font-medium">Consistency</th>
                    <th className="text-left py-3 px-4 text-zinc-400 font-medium">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice(3).map((user) => (
                    <motion.tr
                      key={user.rank}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`border-b border-white/5 last:border-0 hover:bg-white/5 ${
                        user.isSelf ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10' : ''
                      }`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-zinc-500 font-bold">#{user.rank}</span>
                          {user.rank <= 3 && (
                            <Award size={16} className={user.rank === 1 ? 'text-yellow-500' : user.rank === 2 ? 'text-zinc-400' : 'text-amber-700'} />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={user.avatar} 
                            alt={user.user}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className={`font-medium ${user.isSelf ? 'text-purple-400' : 'text-white'}`}>
                              {user.user}
                            </p>
                            {user.isSelf && (
                              <span className="text-xs text-purple-400">You</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Coins size={16} className="text-amber-400" />
                          <span className="font-bold text-white">{user.score.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-blue-400" />
                          <span className="text-zinc-300">{user.consistencyDays} days</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {user.change && (
                          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                            user.change === 'up' ? 'bg-green-500/20 text-green-400' :
                            user.change === 'down' ? 'bg-red-500/20 text-red-400' :
                            'bg-zinc-500/20 text-zinc-400'
                          }`}>
                            {user.change === 'up' ? '↑' : user.change === 'down' ? '↓' : '→'}
                            {user.changeAmount || ''}
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Your Position */}
            {leaderboardData.find(u => u.isSelf) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy size={20} className="text-purple-400" />
                    <div>
                      <p className="font-bold text-white">Your Position</p>
                      <p className="text-sm text-zinc-400">Keep earning to climb higher!</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-400">#{leaderboardData.find(u => u.isSelf)?.rank}</p>
                    <p className="text-sm text-zinc-400">{leaderboardData.find(u => u.isSelf)?.score.toLocaleString()} points</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </GlassCard>
      </div>
    );
  };

  // --- COIN EXCHANGE VIEW ---
  const CoinExchangeView = () => {
    const EXCHANGE_RATE = 100;
    const TDS_RATE = 0.15;
    const MIN_WITHDRAWAL = 500;
    
    const [exchangeAmount, setExchangeAmount] = useState(0);
    const rupeeRate = 1 / EXCHANGE_RATE;
    const grossAmount = exchangeAmount * rupeeRate;
    const tdsAmount = grossAmount * TDS_RATE;
    const netAmount = grossAmount - tdsAmount;
    
    const isValidAmount = exchangeAmount > 0 && exchangeAmount <= eligible;
    const meetsMinimum = exchangeAmount >= MIN_WITHDRAWAL;
    const canRequest = isValidAmount && meetsMinimum && !payoutRequested;

    const handleMaxClick = () => {
      setExchangeAmount(eligible);
    };

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            <GradientText>Coin Exchange</GradientText>
          </h1>
          <p className="text-zinc-400">Convert your coins to cash and request payout</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <GlassCard>
              <div className="p-8">
                <h3 className="text-xl font-bold text-white mb-6">Exchange Calculator</h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-zinc-400">
                        Coins to Exchange (Max: {eligible.toLocaleString()} Coins)
                      </label>
                      <button
                        onClick={handleMaxClick}
                        className="text-sm text-amber-400 hover:text-amber-300"
                      >
                        Use Max
                      </button>
                    </div>
                    
                    <div className="relative mb-2">
                      <input
                        type="range"
                        min="0"
                        max={eligible}
                        value={exchangeAmount}
                        onChange={(e) => setExchangeAmount(parseInt(e.target.value))}
                        className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500"
                      />
                      <div className="flex justify-between text-xs text-zinc-500 mt-2">
                        <span>0</span>
                        <span>{eligible.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <input
                        type="number"
                        value={exchangeAmount}
                        onChange={(e) => setExchangeAmount(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      />
                    </div>
                  </div>

                  {/* Exchange Info Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <GlassCard className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-zinc-400 mb-1">Exchange Rate</p>
                        <p className="text-lg font-bold text-white">100 : 1</p>
                        <p className="text-xs text-zinc-500">Coins : Rupees</p>
                      </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-zinc-400 mb-1">Min Withdrawal</p>
                        <p className="text-lg font-bold text-white">{MIN_WITHDRAWAL}</p>
                        <p className="text-xs text-zinc-500">Coins</p>
                      </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-zinc-400 mb-1">TDS Rate</p>
                        <p className="text-lg font-bold text-white">15%</p>
                        <p className="text-xs text-zinc-500">Deduction</p>
                      </div>
                    </GlassCard>
                  </div>

                  {/* Calculation Breakdown */}
                  <GlassCard className="p-6">
                    <h4 className="font-bold text-white mb-4">Calculation Breakdown</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Selected Coins:</span>
                        <span className="text-white font-medium">{exchangeAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Gross Amount:</span>
                        <span className="text-white font-bold">Rs. {grossAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-red-400">
                        <span>TDS Deduction (15%):</span>
                        <span>- Rs. {tdsAmount.toFixed(2)}</span>
                      </div>
                      <div className="h-px bg-white/10 my-2" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Net Amount:</span>
                        <span className="text-green-400">Rs. {netAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Submit Button */}
                  <MagneticButton
                    onClick={() => {
                      setPayoutRequested(true);
                      addNotification(`Payout request submitted for Rs. ${netAmount.toFixed(2)}`, 'success');
                    }}
                    disabled={!canRequest}
                    className="w-full"
                  >
                    {payoutRequested ? 'Request Submitted ✓' : 
                     canRequest ? `Request Rs. ${netAmount.toFixed(2)} Payout` : 
                     'Cannot Request Payout'}
                  </MagneticButton>
                  
                  {/* Validation Messages */}
                  {exchangeAmount > 0 && !meetsMinimum && (
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-yellow-400 text-sm">
                        Minimum withdrawal is {MIN_WITHDRAWAL} coins
                      </p>
                    </div>
                  )}
                  
                  {exchangeAmount > eligible && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-red-400 text-sm">
                        Cannot exceed eligible balance of {eligible} coins
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Balance Card */}
            <GlassCard>
              <div className="p-6">
                <h4 className="text-lg font-bold text-white mb-4">Your Balance</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Total Coins:</span>
                    <div className="flex items-center gap-2">
                      <Coins size={16} className="text-amber-400" />
                      <span className="text-white font-bold">{balance.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Eligible:</span>
                    <span className="text-green-400 font-bold">{eligible.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Locked:</span>
                    <span className="text-amber-400 font-bold">{(balance - eligible).toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-zinc-400 mb-1">
                    <span>Withdrawal Progress</span>
                    <span>{Math.round((eligible / balance) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-500"
                      style={{ width: `${(eligible / balance) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Recent Transactions */}
            <GlassCard>
              <div className="p-6">
                <h4 className="text-lg font-bold text-white mb-4">Recent Transactions</h4>
                <div className="space-y-3">
                  {[
                    { date: 'Today', coins: '+470', type: 'Task Completion', status: 'completed' },
                    { date: 'Yesterday', coins: '+320', type: 'Video Watch', status: 'completed' },
                    { date: '2 days ago', coins: '+280', type: 'Follow Task', status: 'completed' },
                    { date: '3 days ago', coins: '-500', type: 'Withdrawal', status: 'pending' },
                  ].map((tx, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex justify-between items-center p-2 hover:bg-white/5 rounded-lg"
                    >
                      <div>
                        <p className="text-sm text-white">{tx.type}</p>
                        <p className="text-xs text-zinc-500">{tx.date}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${tx.coins.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.coins}
                        </p>
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                          tx.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {tx.status}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Payout Status */}
            {payoutRequested && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard gradient="green">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle size={24} className="text-green-400" />
                      <h4 className="text-lg font-bold text-white">Payout Requested</h4>
                    </div>
                    <p className="text-sm text-zinc-300 mb-4">
                      Your payout request for Rs. {netAmount.toFixed(2)} has been submitted successfully.
                    </p>
                    <div className="text-xs text-zinc-400">
                      <p>• Processing time: 24-48 hours</p>
                      <p>• Payment method: Bank Transfer</p>
                      <p>• TDS certificate will be provided</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- PROFILE VIEW ---
  const ProfileView = () => {
    if (!isApproved) {
      return (
        <GlassCard className="p-12 text-center">
          <Shield size={48} className="text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">Verification Required</h3>
          <p className="text-zinc-400 mb-8">Complete identity verification to access profile features</p>
          <MagneticButton onClick={() => setDashView('verification')}>
            Go to Verification
          </MagneticButton>
        </GlassCard>
      );
    }

    const [socialLinks, setSocialLinks] = useState(profile.socialLinks);
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
      setProfile(prev => ({ ...prev, socialLinks }));
      setIsEditing(false);
      addNotification('Profile updated successfully', 'success');
    };

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            <GradientText>Profile Settings</GradientText>
          </h1>
          <p className="text-zinc-400">Manage your profile, social links, and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Info Card */}
            <GlassCard>
              <div className="p-8">
                <div className="flex items-center gap-6 mb-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <img 
                      src={profile.avatar} 
                      alt={profile.name}
                      className="w-24 h-24 rounded-full border-4 border-white/10"
                    />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center">
                      <span className="text-black font-bold">{profile.level}</span>
                    </div>
                  </motion.div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{profile.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <StatusBadge status={isApproved ? 'Verified' : 'Pending'} />
                      {hasPurchased && <StatusBadge status="SRK Grow" pulse />}
                      <StatusBadge status={`Level ${profile.level}`} />
                    </div>
                    <p className="text-zinc-400">{profile.email} • {profile.phone}</p>
                    <p className="text-sm text-zinc-500 mt-1">Member since {profile.joinDate}</p>
                  </div>
                </div>

                {/* XP Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-zinc-400">
                    <span>Level Progress</span>
                    <span>{profile.xp} / {profile.nextLevelXP} XP</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(profile.xp / profile.nextLevelXP) * 100}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <p className="text-xs text-zinc-500 text-center">
                    {profile.nextLevelXP - profile.xp} XP needed for Level {profile.level + 1}
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Social Media Links */}
            <GlassCard>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Social Media Links</h3>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <MagneticButton small onClick={handleSave}>
                        Save Changes
                      </MagneticButton>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                    >
                      Edit Links
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {allPlatforms.map((p) => {
                    const Icon = p.icon;
                    return (
                      <div key={p.platform} className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center flex-shrink-0`}>
                          <Icon size={20} className={p.platform === 'tiktok' ? 'text-white' : p.color} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">{p.name}</p>
                          {isEditing ? (
                            <input
                              type="url"
                              value={socialLinks[p.platform]}
                              onChange={(e) => setSocialLinks({...socialLinks, [p.platform]: e.target.value})}
                              placeholder={`Enter your ${p.name} profile URL`}
                              className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent text-sm"
                            />
                          ) : (
                            <p className="text-sm text-zinc-400 truncate">
                              {socialLinks[p.platform] || 'Not linked yet'}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </GlassCard>

            {/* Custom Task Request (SRK Grow Only) */}
            {hasPurchased && (
              <GlassCard gradient="purple" className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
                <div className="p-8 relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <Ticket size={24} className="text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Request Custom Task</h3>
                      <p className="text-zinc-400">Available with SRK Grow Package</p>
                    </div>
                  </div>
                  
                  <p className="text-zinc-300 mb-6">
                    Propose your own content for promotion. Our team will review and create custom tasks for you.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { icon: Video, label: 'Video Promotion' },
                      { icon: Share2, label: 'Social Share' },
                      { icon: Users, label: 'Followers Campaign' },
                      { icon: MessageCircle, label: 'Content Review' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 bg-white/5 rounded-xl">
                        <item.icon size={20} className="text-purple-400 mb-2" />
                        <p className="text-sm font-medium text-white">{item.label}</p>
                      </div>
                    ))}
                  </div>

                  <MagneticButton 
                    onClick={() => setShowRequestModal(true)}
                    variant="premium"
                    className="w-full"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles size={16} />
                      Request New Task
                    </span>
                  </MagneticButton>
                </div>
              </GlassCard>
            )}
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <GlassCard>
              <div className="p-6">
                <h4 className="text-lg font-bold text-white mb-4">Account Stats</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Tasks Completed:</span>
                    <span className="text-white font-bold">{completed.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Success Rate:</span>
                    <span className="text-green-400 font-bold">92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Avg Daily Earn:</span>
                    <span className="text-amber-400 font-bold">{analyticsData.averageDaily}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Total Earned:</span>
                    <span className="text-purple-400 font-bold">{analyticsData.allTime} Coins</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="p-6">
                <h4 className="text-lg font-bold text-white mb-4">Achievements</h4>
                <div className="space-y-3">
                  {[
                    { icon: Trophy, label: 'First Task', achieved: true },
                    { icon: Zap, label: '7 Day Streak', achieved: true },
                    { icon: Crown, label: 'Top 10', achieved: false },
                    { icon: Star, label: 'Perfect Week', achieved: true },
                  ].map((achievement, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        achievement.achieved 
                          ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20' 
                          : 'bg-zinc-800/50'
                      }`}>
                        <achievement.icon size={18} className={
                          achievement.achieved ? 'text-amber-400' : 'text-zinc-600'
                        } />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{achievement.label}</p>
                        <p className="text-xs text-zinc-500">
                          {achievement.achieved ? 'Achieved' : 'Locked'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>

            {hasPurchased && (
              <GlassCard gradient="purple">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Crown size={20} className="text-purple-400" />
                    <h4 className="text-lg font-bold text-white">SRK Grow Benefits</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    <li className="flex items-center gap-2">
                      <Check size={12} className="text-purple-400" />
                      Priority task approval
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={12} className="text-purple-400" />
                      Higher coin rewards
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={12} className="text-purple-400" />
                      Custom task requests
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={12} className="text-purple-400" />
                      Advanced analytics
                    </li>
                  </ul>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- LEGACY PAYOUT VIEW ---
  const LegacyPayoutView = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          <GradientText>Legacy Payout</GradientText>
        </h1>
        <p className="text-zinc-400">This system is deprecated. Please use the new Coin Exchange.</p>
      </div>

      <GlassCard className="max-w-3xl">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
              <AlertTriangle size={28} className="text-amber-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">System Deprecated</h3>
              <p className="text-zinc-400">This payout system is no longer in use.</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <p className="text-zinc-300">
              The legacy payout system has been replaced by the new <span className="text-amber-400">Coin Exchange</span> feature.
              All payout functionality has been moved to the new system with improved rates and faster processing.
            </p>
            
            <div className="p-4 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-xl border border-amber-500/20">
              <h4 className="font-bold text-amber-400 mb-2">Important Notice</h4>
              <ul className="text-sm text-zinc-300 space-y-1">
                <li>• Legacy payouts will be discontinued on March 31, 2024</li>
                <li>• All existing balances have been migrated to Coin Exchange</li>
                <li>• New features include better rates and instant processing</li>
                <li>• TDS certificates are now automatically generated</li>
              </ul>
            </div>
          </div>

          <MagneticButton 
            onClick={() => setDashView('coinExchange')}
            className="w-full"
          >
            <span className="flex items-center justify-center gap-2">
              <ArrowRight size={16} />
              Go to Coin Exchange
            </span>
          </MagneticButton>
        </div>
      </GlassCard>
    </div>
  );

  // --- DASHBOARD VIEW ---
  const DashboardView = () => {
    const views: Record<DashboardView, { component: React.FC; title: string; desc: string }> = {
      verification: { component: VerificationView, title: 'Verification', desc: 'Verify your account' },
      analytics: { component: AnalyticsView, title: 'Analytics', desc: 'View your earnings' },
      tasks: { component: TasksView, title: 'Tasks', desc: 'Complete earning tasks' },
      leaderboard: { component: LeaderboardView, title: 'Leaderboard', desc: 'Top performers' },
      coinExchange: { component: CoinExchangeView, title: 'Coin Exchange', desc: 'Convert coins to cash' },
      profile: { component: ProfileView, title: 'Profile', desc: 'Manage your account' },
      payout: { component: LegacyPayoutView, title: 'Legacy Payout', desc: 'Deprecated system' },
      logout: { component: () => null, title: '', desc: '' },
    };

    const CurrentView = views[dashView].component;

    return (
      <div className="min-h-screen">
        <AnimatedBackground />
        
        <div className="relative z-10">
          {/* Header */}
          <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] flex items-center justify-center cursor-pointer"
                    onClick={() => setView('landing')}
                  >
                    <span className="font-bold text-black">S</span>
                  </motion.div>
                  <div>
                    <h1 className="text-xl font-bold text-white">
                      <GradientText>SRK Portal</GradientText>
                    </h1>
                    <p className="text-xs text-zinc-400">Earn Through Tasks</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Balance Display */}
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full group">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Coins size={16} className="text-amber-400" />
                    </motion.div>
                    <span className="text-white font-bold">{balance.toLocaleString()}</span>
                    <span className="text-zinc-400 text-sm">Coins</span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight size={16} className="text-zinc-500" />
                    </div>
                  </div>
                  
                  {/* Notification Bell */}
                  <button className="p-2 hover:bg-white/10 rounded-lg relative">
                    <Bell size={20} className="text-zinc-400" />
                    {rejectedTasks.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {rejectedTasks.length}
                      </span>
                    )}
                  </button>
                  
                  <MagneticButton small onClick={() => setDashView('coinExchange')}>
                    <Wallet size={16} />
                    Withdraw
                  </MagneticButton>
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <div className="lg:w-64">
                <Sidebar />
              </div>

              {/* Main Content */}
              <main className="flex-1 min-w-0">
                <div className="mb-8">
                  <motion.div
                    key={dashView}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h1 className="text-4xl font-bold text-white mb-2">
                      <GradientText>{views[dashView].title}</GradientText>
                    </h1>
                    <p className="text-zinc-400">{views[dashView].desc}</p>
                  </motion.div>
                </div>

                <CurrentView />
              </main>
            </div>
          </div>
        </div>

        {/* Modals */}
        <AnimatePresence>
          {showVerification && <VerificationModal />}
          {taskCategory && !selectedPlatform && (
            <PlatformSelectorModal type={taskCategory} onClose={() => setTaskCategory(null)} />
          )}
          {selectedPlatform && taskCategory && (
            <PlatformSpecificTaskModal 
              platform={selectedPlatform} 
              type={taskCategory}
              onClose={() => { setSelectedPlatform(null); setTaskCategory(null); }} 
              onBack={() => setSelectedPlatform(null)}
            />
          )}
          {verifyingTask && (
            <VerificationUploadModal task={verifyingTask} onClose={() => setVerifyingTask(null)} />
          )}
          {playingVideo && (
            <VideoPlayerModal task={playingVideo} onClose={() => setPlayingVideo(null)} />
          )}
          {reviewingRejectedTask && (
            <RejectedTaskReviewModal 
              task={reviewingRejectedTask} 
              onClose={() => setReviewingRejectedTask(null)} 
            />
          )}
          {showRequestModal && (
            <RequestTaskModal onClose={() => setShowRequestModal(false)} />
          )}
        </AnimatePresence>

        {/* Notifications */}
        <AnimatePresence>
          {notifications.map((notification) => (
            <FloatingNotification
              key={notification.id}
              message={notification.message}
              type={notification.type}
              onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(182, 137, 56, 0.3);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(182, 137, 56, 0.5);
        }
        
        /* Selection */
        ::selection {
          background: rgba(182, 137, 56, 0.3);
          color: white;
        }
        
        /* Smooth transitions */
        * {
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }
        
        /* Focus styles */
        :focus-visible {
          outline: 2px solid rgba(182, 137, 56, 0.5);
          outline-offset: 2px;
        }
        
        /* Mobile optimizations */
        @media (max-width: 640px) {
          .text-7xl, .text-8xl {
            font-size: 3.5rem;
          }
        }
      `}</style>
      
      {view === 'landing' ? <LandingView /> : <DashboardView />}
    </div>
  );
};

export default SRKPortal;