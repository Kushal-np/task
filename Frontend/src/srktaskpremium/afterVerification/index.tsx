import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence} from 'framer-motion';
import { 
  Menu, X, ArrowRight, UserCircle, Play, Upload, Youtube, Instagram, 
  Smartphone, CheckCircle, Clock, Zap, Shield, TrendingUp, DollarSign, Award, Wallet, ListChecks, Sparkles, Send, Check, Facebook, 
  Ticket, AlertTriangle, LogOut, BarChart3, Users,   
  ChevronRight, Camera, ShieldCheck, Star, Activity
  , Search, Crown, Coins, Info,
  Calendar, Share2,  
   RefreshCw, 
  Trophy, Lock, Video, 
  MessageCircle,
   
  
  PenTool,
  
  Loader2,
  ChevronLeft,
  
 
  Trash2,
  Type,
  Pause
} from 'lucide-react';


// Add this after the imports section
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

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
          className="absolute w-0.5 h-[2px] bg-linear-to-r from-[#b68938] to-[#e1ba73] rounded-full"
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
            className="absolute h-[1px] w-full bg-linear-to-r from-transparent via-[#b68938]/20 to-transparent"
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
  small?: boolean;
}> = ({ children, className = '', hover = true, onClick, delay = 0, gradient = 'gold', small = false }) => {
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
      whileHover={hover ? { scale: small ? 1.02 : 1.02, y: -4, transition: { duration: 0.2 } } : {}}
      className={`relative ${small ? 'rounded-xl' : 'rounded-2xl'} border border-white/5 bg-gradient-to-br from-white/5 to-white/2 hover:border-white/10 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 ${small ? 'rounded-xl' : 'rounded-2xl'} bg-gradient-to-br ${gradientMap[gradient]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Animated border */}
      <div className={`absolute inset-0 ${small ? 'rounded-xl' : 'rounded-2xl'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#b68938]/0 to-transparent animate-[shimmer_2s_infinite]" />
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

// --- VIDEO FEATURE COMPONENT ---
// Replace the VideoFeature component with this updated version:
// Replace the VideoFeature component with this SIMPLER WORKING VERSION:


// --- SIGNATURE DRAWING COMPONENT ---
interface SignaturePadProps {
  onSave: (signature: string) => void;
  width?: number;
  height?: number;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, width = 400, height = 200 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineColor, setLineColor] = useState('#FFFFFF');
  const [lineWidth, setLineWidth] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Set background
    ctx.fillStyle = 'rgba(26, 20, 16, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [width, height, lineColor, lineWidth]);

  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { x, y } = getCanvasCoordinates(e);
    
    setIsDrawing(true);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { x, y } = getCanvasCoordinates(e);
    
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(26, 20, 16, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const signature = canvas.toDataURL('image/png');
    onSave(signature);
  };

  return (
    <GlassCard>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-linear-to-r from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
            <PenTool size={24} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Digital Signature</h3>
            <p className="text-zinc-400">Draw your signature in the box below</p>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="relative mb-6">
          <canvas
            ref={canvasRef}
            className="w-full h-48 rounded-lg border-2 border-white/10 cursor-crosshair touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          
          {/* Drawing Guide */}
          <div className="absolute top-2 left-2 text-xs text-zinc-500 bg-black/60 px-2 py-1 rounded">
            Draw here
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Brush Size */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-3">
              Brush Size: {lineWidth}px
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="10"
                value={lineWidth}
                onChange={(e) => setLineWidth(parseInt(e.target.value))}
                className="flex-1 h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
              <div className="flex gap-2">
                {[1, 3, 5, 8, 10].map((size) => (
                  <button
                    key={size}
                    onClick={() => setLineWidth(size)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      lineWidth === size
                        ? 'bg-amber-500/20 border border-amber-500/30'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div
                      className="rounded-full bg-white"
                      style={{ width: size, height: size }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-3">
              Pen Color
            </label>
            <div className="flex gap-3">
              {[
                { color: '#FFFFFF', name: 'White' },
                { color: '#000000', name: 'Black' },
                { color: '#3B82F6', name: 'Blue' },
                { color: '#10B981', name: 'Green' },
                { color: '#8B5CF6', name: 'Purple' },
                { color: '#EF4444', name: 'Red' },
                { color: '#F59E0B', name: 'Orange' },
                { color: '#06B6D4', name: 'Cyan' },
              ].map(({ color, name }) => (
                <button
                  key={color}
                  onClick={() => setLineColor(color)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
                    lineColor === color
                      ? 'bg-white/20'
                      : 'hover:bg-white/10'
                  }`}
                  title={name}
                >
                  <div
                    className="w-6 h-6 rounded-full border border-white/20"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-zinc-400">{name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={clearSignature}
              className="flex-1 px-6 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Clear
            </button>
            
            <button
              onClick={() => {
                clearSignature();
                // Add sample signature
                const canvas = canvasRef.current;
                const ctx = canvas?.getContext('2d');
                if (!canvas || !ctx) return;

                const name = "John Doe";
                ctx.font = 'italic 28px Arial';
                ctx.fillStyle = lineColor;
                ctx.textAlign = 'center';
                ctx.fillText(name, canvas.width / 2, canvas.height / 2);
              }}
              className="flex-1 px-6 py-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Type size={18} />
              Sample
            </button>
            
            <MagneticButton
              onClick={saveSignature}
              className="flex-1"
            >
              <Check size={18} />
              Save Signature
            </MagneticButton>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-white/5 rounded-xl">
            <h4 className="font-medium text-white mb-2">Tips for best results:</h4>
            <ul className="text-sm text-zinc-400 space-y-1">
              <li className="flex items-center gap-2">
                <Check size={12} className="text-green-400" />
                Sign naturally as you would on paper
              </li>
              <li className="flex items-center gap-2">
                <Check size={12} className="text-green-400" />
                Use a stylus or your finger for better control
              </li>
              <li className="flex items-center gap-2">
                <Check size={12} className="text-green-400" />
                Make sure your signature is clear and readable
              </li>
              <li className="flex items-center gap-2">
                <Check size={12} className="text-green-400" />
                Keep it within the drawing area
              </li>
            </ul>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

// --- VERIFICATION MODAL ---
interface VerificationModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    documentFile: null as File | null,
    selfieImage: null as string | null,
    signature: null as string | null,
    fullName: '',
    dob: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);

  // Camera state
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const totalSteps = 5;
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // Camera logic
  const startCamera = useCallback(async () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    setCameraError(null);
    setIsCameraActive(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().then(() => {
          setIsCameraActive(true);
          setCameraError(null);
        }).catch(e => {
          console.error("Video Autoplay Blocked:", e);
          setCameraError("Autoplay blocked. Try refreshing or check browser settings.");
        });
      }
    } catch (err: any) {
      console.error("Camera access failed:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError("Camera access denied. Please grant permission in your browser settings.");
      } else if (err.name === "NotFoundError") {
        setCameraError("No camera found on this device.");
      } else {
        setCameraError(`Error: ${err.message}`);
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    if (currentStep === 2 && !formData.selfieImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      if (currentStep === 2) {
        stopCamera();
      }
    };
  }, [currentStep, startCamera, stopCamera, formData.selfieImage]);

  const takePicture = () => {
    if (!isCameraActive || !videoRef.current || !canvasRef.current) {
      setCameraError("Camera not active or stream failed.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setFormData(f => ({ ...f, selfieImage: dataUrl }));
      stopCamera();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(f => ({ ...f, documentFile: file }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleSignatureSave = (signature: string) => {
    setFormData(f => ({ ...f, signature }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionStatus(null);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (Math.random() > 0.1) {
      setSubmissionStatus('success');
      setCurrentStep(totalSteps);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } else {
      setSubmissionStatus('error');
      setCurrentStep(totalSteps);
    }
    setIsSubmitting(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">1. Upload Document</h2>
            <p className="text-gray-400">Please upload a valid government-issued ID (e.g., Passport, Driver's License).</p>
            
            <div className="border-2 border-dashed border-[#ac9976] rounded-lg p-8 text-center bg-gray-700/50">
              <Upload className="w-8 h-8 mx-auto from-[#ac9976] to-[#e1ba73] mb-3" />
              <input 
                type="file" 
                id="documentUpload"
                accept=".pdf,image/jpeg,image/png"
                onChange={handleFileChange} 
                className="hidden"
              />
              <label 
                htmlFor="documentUpload"
                className="cursor-pointer text-amber-400 hover:text-amber-300 font-medium transition"
              >
                {formData.documentFile ? formData.documentFile.name : 'Click to select file'}
              </label>
              <p className="text-xs text-gray-500 mt-1">PDF or image files up to 5MB.</p>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                onClick={nextStep} 
                disabled={!formData.documentFile}
                className="px-6 py-2 bg-linear-to-r from-[#ac9976] to-[#e1ba73] text-black font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next: Selfie <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">2. Selfie Capture</h2>
            <p className="text-gray-400">Please position your face clearly within the frame for a live photo.</p>
            
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-inner">
              <video 
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover transition-opacity duration-500 ${isCameraActive ? 'opacity-100' : 'opacity-10'}`}
              />
              <canvas ref={canvasRef} className="hidden" />

              {!isCameraActive && !formData.selfieImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 p-4 text-center">
                  {cameraError ? (
                    <>
                      <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
                      <p className="text-red-400 font-medium mb-4">{cameraError}</p>
                    </>
                  ) : (
                    <>
                      <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-2" />
                      <p className="text-white font-medium mb-4">Initializing camera...</p>
                    </>
                  )}
                  <button 
                    onClick={startCamera}
                    className="bg-linear-to-r from-[#ac9976] to-[#e1ba73] hover:opacity-90 text-black font-semibold py-2 px-6 rounded-lg flex items-center transition"
                  >
                    <Camera className="w-5 h-5 mr-2" /> Start Camera
                  </button>
                </div>
              )}

              {formData.selfieImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90">
                  <img src={formData.selfieImage} alt="Selfie Preview" className="max-h-full max-w-full object-contain rounded-xl shadow-xl border-4 border-amber-500"/>
                  <button 
                    onClick={() => { setFormData(f => ({ ...f, selfieImage: null })); startCamera(); }}
                    className="absolute top-2 right-2 p-2 bg-red-600 rounded-full text-white hover:bg-red-700 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4">
              <button 
                onClick={prevStep} 
                className="text-gray-400 hover:text-white transition px-4 py-2 flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </button>
              
              {!formData.selfieImage ? (
                <button 
                  onClick={takePicture} 
                  disabled={!isCameraActive}
                  className="p-3 bg-linear-to-r from-[#ac9976] to-yellow-500 rounded-full hover:opacity-90 disabled:opacity-50 transition shadow-lg"
                >
                  <Camera className="w-6 h-6 text-black" />
                </button>
              ) : (
                <button 
                  onClick={nextStep} 
                  className="px-6 py-2 bg-linear-to-r from-[#ac9976] to-yellow-500 text-black font-medium rounded-lg hover:opacity-90 transition flex items-center"
                >
                  Next: Signature <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">3. Digital Signature</h2>
            <p className="text-gray-400">Draw your signature in the box below</p>
            
            <SignaturePad onSave={handleSignatureSave} />
            
            <div className="flex justify-between pt-4">
              <button 
                onClick={prevStep} 
                className="text-gray-400 hover:text-white transition px-4 py-2 flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </button>
              <button 
                onClick={nextStep} 
                disabled={!formData.signature}
                className="px-6 py-2 bg-linear-to-r from-[#ac9976] to-[#e1ba73] text-black font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >

                Next: Details
                 <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">4. Personal Details</h2>
            <div className="space-y-4">
              <input 
                type="text"
                name="fullName"
                placeholder="Full Name (as per ID)"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-amber-500/50 focus:border-amber-500/50"
              />
              <input 
                type="date"
                name="dob"
                placeholder="Date of Birth"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-amber-500/50 focus:border-amber-500/50"
              />
              
              {/* Signature Preview */}
              {formData.signature && (
                <div>
                  <p className="text-gray-400 mb-2">Signature Preview:</p>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <img 
                      src={formData.signature} 
                      alt="Signature Preview" 
                      className="h-20 mx-auto object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <button 
                onClick={prevStep} 
                className="text-gray-400 hover:text-white transition px-4 py-2 flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </button>
              <button 
                onClick={nextStep} 
                disabled={!formData.fullName || !formData.dob || !formData.signature}
                className="px-6 py-2 bg-linear-to-r from-[#ac9976] to-[#e1ba73]  text-black font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next: Review <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">5. Review and Submit</h2>
            <div className="space-y-3 p-4 bg-white/5 rounded-lg">
              <div className="text-sm">
                <span className="font-semibold text-gray-400">Document:</span> <span className="text-white ml-2">{formData.documentFile?.name || 'Missing'}</span>
              </div>
              <div className="text-sm">
                <span className="font-semibold text-gray-400">Selfie:</span> 
                <span className="text-white ml-2">{formData.selfieImage ? 'Captured' : 'Missing'}</span>
                {formData.selfieImage && (
                  <img src={formData.selfieImage} alt="Selfie" className="w-16 h-auto mt-2 rounded-md border border-amber-500" />
                )}
              </div>
              <div className="text-sm">
                <span className="font-semibold text-gray-400">Signature:</span> 
                <span className="text-white ml-2">{formData.signature ? 'Provided' : 'Missing'}</span>
                {formData.signature && (
                  <img src={formData.signature} alt="Signature" className="w-32 h-auto mt-2 rounded-md border border-amber-500" />
                )}
              </div>
              <div className="text-sm">
                <span className="font-semibold text-gray-400">Name:</span> <span className="text-white ml-2">{formData.fullName || 'Missing'}</span>
              </div>
              <div className="text-sm">
                <span className="font-semibold text-gray-400">DOB:</span> <span className="text-white ml-2">{formData.dob || 'Missing'}</span>
              </div>
              <div className="text-sm text-amber-400 pt-3 italic">
                I confirm that all information provided is accurate and true.
              </div>
            </div>

            {submissionStatus === 'success' ? (
              <div className="text-center p-6 bg-linear-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl">
                <CheckCircle className="w-12 h-12 mx-auto text-emerald-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Verification Submitted!</h3>
                <p className="text-gray-400">Your identity verification is under review. This may take 1-2 business days.</p>
                <div className="mt-4 text-sm text-emerald-400">
                  Redirecting to Tasks tab...
                </div>
              </div>
            ) : submissionStatus === 'error' ? (
              <div className="text-center p-6 bg-linear-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl">
                <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Submission Failed</h3>
                <p className="text-gray-400">An error occurred. Please check your connection and try again.</p>
                <button 
                  onClick={() => setCurrentStep(4)} 
                  className="mt-4 px-6 py-2 bg-linear-to-r from-amber-500 to-yellow-500 text-black font-medium rounded-lg hover:opacity-90 transition"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="flex justify-between pt-4">
                <button 
                  onClick={prevStep} 
                  className="text-gray-400 hover:text-white transition px-4 py-2 flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || !formData.documentFile || !formData.selfieImage || !formData.signature || !formData.fullName || !formData.dob}
                  className="px-6 py-2 bg-linear-to-r from-emerald-500 to-green-500 text-white font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                  ) : (
                    <><Send className="w-4 h-4 mr-2" /> Submit Verification</>
                  )}
                </button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-linear-to-br from-[#1a1410]/90 to-[#0a0a0a]/90 border border-amber-500/20 rounded-2xl shadow-2xl">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              <span className="bg-linear-to-r from-[#ac9976] to-[#e1ba73] bg-clip-text text-transparent">
                <GradientText>

                Identity Verification
                </GradientText>
              </span>
            </h1>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
            <h2 className="text-lg font-semibold from-[#ac9976] to-[#e1ba73] text-center mb-2">
              Step {currentStep} of {totalSteps - (submissionStatus ? 1 : 0)}
            </h2>
            <div className="w-full bg-white/10 rounded-full h-2.5">
              <div 
                className="bg-linear-to-r from-[#ac9976] to-[#e1ba73] h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (currentStep / totalSteps) * 100)}%` }}
              />
            </div>
          </div>

          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const AfterVerified: React.FC = () => {
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  const [notifications, setNotifications] = useState<Array<{ id: number; message: string; type: 'success' | 'error' | 'info' }>>([]);
  const [activeTasks, setActiveTasks] = useState<Task[]>([...followTasks, ...watchTasks, ...postTasks]);
  const [profile, setProfile] = useState<UserProfile>(userProfile);
const MobileMenu = () => (
  <>
    {/* Hamburger Button */}
    <button
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      className="lg:hidden fixed top-6 right-6 z-50 p-2 bg-black/50 backdrop-blur-sm rounded-lg border border-white/10"
    >
      <Menu size={24} className="text-white" />
    </button>

    {/* Mobile Menu Overlay */}
    {isMenuOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="lg:hidden fixed inset-0 z-40 bg-black/90 backdrop-blur-sm"
        onClick={() => setIsMenuOpen(false)}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: "spring", damping: 25 }}
          className="absolute right-0 top-0 h-full w-80 bg-linear-to-b from-[#1a1410] to-[#0a0a0a] border-l border-white/10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Close Button */}
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            {/* Mobile Sidebar Content */}
            <div className="space-y-4">
              {/* Balance Display */}
              <GlassCard small>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <Coins size={20} className="from-[#ac9976] to-[#e1ba73]" />
                    <div>
                      <p className="text-sm text-zinc-400">Your Balance</p>
                      <p className="text-xl font-bold text-white">{balance.toLocaleString()} Coins</p>
                      <p className="text-xs text-zinc-500">Eligible: {eligible} Coins</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Navigation */}
              <div className="space-y-2">
                {[
                  { view: 'verification', icon: Shield, label: 'Verification', badge: !isApproved ? 1 : undefined },
                  { view: 'analytics', icon: BarChart3, label: 'Analytics', requiresApproval: true },
                  { view: 'tasks', icon: ListChecks, label: 'Tasks', badge: rejectedTasks.length },
                  { view: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
                  { view: 'coinExchange', icon: DollarSign, label: 'Coin Exchange' },
                  { view: 'profile', icon: UserCircle, label: 'Profile' },
                  { view: 'payout', icon: Wallet, label: 'Legacy Payout' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isDisabled = item.requiresApproval && !isApproved;
                  const isActive = dashView === item.view;
                  
                  return (
                    <button
                      key={item.view}
                      onClick={() => {
                        if (!isDisabled) {
                        
                          setIsMenuOpen(false);
                        }
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                        ${isActive 
                          ? 'bg-linear-to-r from-[#b68938]/20 to-[#b68938]/10 text-white border border-white/10' 
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                        }
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      disabled={isDisabled}
                    >
                      <Icon size={20} className={isActive ? 'from-[#ac9976] to-[#e1ba73]' : ''} />
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {isDisabled && <Lock size={16} className="ml-auto text-zinc-500" />}
                    </button>
                  );
                })}
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  setView('landing');
                  setIsMenuOpen(false);
                  addNotification('Logged out successfully', 'info');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all mt-8"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </>
);
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

  // Handle verification success
  const handleVerificationSuccess = () => {
    setIsApproved(true);
    setDashView('tasks');
    addNotification('Verification submitted successfully! You can now access all features.', 'success');
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
            <span className="bg-linear-to-r from-[#ac9976] to-[#e1ba73] bg-clip-text text-transparent animate-gradient">
              <GradientText>

              EARN THROUGH TASKS
              </GradientText>
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
                <div className="text-3xl font-bold from-[#ac9976] to-[#e1ba73]">{stat.value}</div>
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
            <span className="flex items-center justify-center gap-3">
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
              <Coins size={20} className="from-[#ac9976] to-[#e1ba73]" />
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
                  <div className={`w-14 h-14 rounded-2xl bg-div-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <div className="from-[#ac9976] to-[#e1ba73]">{feature.icon}</div>
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
          <Coins size={40} className="from-[#ac9976] to-[#e1ba73]" />
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
      <aside className="w-full lg:w-64 shrink">
        <GlassCard className="h-full p-6">
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-full bg-div-to-r from-[#b68938] to-[#e1ba73] flex items-center justify-center"
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
                      ? 'bg-linear-to-r from-[#b68938]/20 to-[#b68938]/10 text-white border border-white/10' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                    ${item.view === 'logout' ? 'mt-8 border-t border-white/10 pt-8' : ''}
                  `}
                  disabled={isDisabled}
                >
                  <Icon size={18} className={isActive ? 'from-[#ac9976] to-[#e1ba73]' : ''} />
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
          <div className="mt-8 p-4 bg-linear-to-r from-[#b68938]/10 to-[#e1ba73]/10 rounded-xl border border-white/10">
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
                  className="w-12 h-12 rounded-xl bg-linear-to-r from-amber-500/20 to-yellow-500/20 flex items-center justify-center"
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
            <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-pink-500/5" />
            
            <div className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 rounded-xl bg-linear-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center"
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
                  className="h-full bg-div-to-r from-amber-500 to-yellow-500"
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
                  className="h-full bg-div-to-r from-purple-500 to-pink-500"
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
              className="w-12 h-12 rounded-xl bg-div-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center"
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
                    ? 'bg-div-to-r from-amber-500/20 to-yellow-500/20 text-white'
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
                      className={`w-full bg-div-to-t from-amber-500 to-yellow-500 rounded-t-lg transition-all duration-300 ${
                        hoveredBar === index ? 'opacity-100' : 'opacity-80'
                      }`}
                      style={{ height: `${value}%` }}
                    >
                      <div className="absolute inset-0 bg-div-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
                        <div className="w-8 h-8 rounded-lg bg-div-to-r from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
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
    const [showVideoFeature, setShowVideoFeature] = useState(false);
    setShowVideoFeature(false);
    if (!isApproved) {
      return (
        <GlassCard className="p-12 text-center">
          <Shield size={48} className="text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">Verification Required</h3>
          <p className="text-zinc-400 mb-8">Complete identity verification to access tasks</p>
          <MagneticButton onClick={() => setDashView('verification')}>
            Go to Verification
          </MagneticButton>
        </GlassCard>
      );
    }

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            <GradientText>Earning Tasks</GradientText>
          </h1>
          <p className="text-zinc-400">Complete tasks to earn coins. Click on any category to view available tasks.</p>
        </div>

        {/* Video Feature Toggle */}
        <div className="flex justify-end">

        </div>

        {/* Video Feature Section */}
        {showVideoFeature && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
          </motion.div>
        )}

        {/* Task Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { type: 'follow' as TaskType, icon: Users, label: 'Follow Tasks', color: 'from-emerald-500/20 to-green-500/20', count: followTasks.length },
            { type: 'watch' as TaskType, icon: Play, label: 'Watch Tasks', color: 'from-blue-500/20 to-cyan-500/20', count: watchTasks.length },
            { type: 'post' as TaskType, icon: Share2, label: 'Post Tasks', color: 'from-purple-500/20 to-pink-500/20', count: postTasks.length },
          ].map((category) => {
            const Icon = category.icon;
            return (
              <GlassCard 
                key={category.type}
                hover 
                gradient={category.type === 'follow' ? 'green' : category.type === 'watch' ? 'blue' : 'purple'}
                onClick={() => setTaskCategory(category.type)}
                className="cursor-pointer"
              >
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-div-to-br ${category.color} flex items-center justify-center`}>
                      <Icon size={28} className={
                        category.type === 'follow' ? 'text-emerald-400' : 
                        category.type === 'watch' ? 'text-blue-400' : 
                        'text-purple-400'
                      } />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{category.label}</h3>
                      <p className="text-zinc-400">{category.count} available tasks</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins size={20} className="text-amber-400" />
                      <span className="text-lg font-bold text-amber-400">
                        {category.type === 'follow' ? '150+' : 
                         category.type === 'watch' ? '200+' : 
                         '120+'} Coins
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <span>Click to view</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Rejected Tasks Section */}
        {rejectedTasks.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white">Rejected Tasks</h3>
                <p className="text-zinc-400">Review and retry these tasks</p>
              </div>
              <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
                {rejectedTasks.length} tasks need attention
              </span>
            </div>

            <div className="space-y-4">
              {rejectedTasks.slice(0, 3).map((task) => {
                const platformInfo = allPlatforms.find(p => p.platform === task.platform);
                return (
                  <GlassCard key={task.id} hover>
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-div-to-br ${platformInfo?.gradient} flex items-center justify-center shrink`}>
                            {platformInfo?.icon && React.createElement(platformInfo.icon, { 
                              size: 20, 
                              className: platformInfo.color 
                            })}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-white mb-2">{task.title}</h4>
                            <p className="text-sm text-zinc-400 mb-2">{task.desc}</p>
                            <div className="flex items-center gap-2">
                              <AlertTriangle size={14} className="text-red-400" />
                              <p className="text-sm text-red-400">{task.rejectionReason}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Coins size={20} className="text-amber-400" />
                            <span className="text-xl font-bold text-amber-400">+{task.coins}</span>
                          </div>
                          
                          <MagneticButton 
                            small 
                            onClick={() => setReviewingRejectedTask(task)}
                            className="!px-6"
                          >
                            <RefreshCw size={16} />
                            Review
                          </MagneticButton>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
              
              {rejectedTasks.length > 3 && (
                <div className="text-center">
                  <button 
                    onClick={() => setDashView('tasks')}
                    className="text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    View all {rejectedTasks.length} rejected tasks →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Active Tasks */}

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
              <div className={`w-16 h-16 rounded-2xl bg-div-to-br ${platformInfo?.gradient} flex items-center justify-center`}>
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
                        <div className="relative w-32 h-20 rounded-lg overflow-hidden shrink">
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
                        <div className="w-12 h-12 rounded-xl bg-div-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center shrink">
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
                        className="px-6!"
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
            <div className="w-16 h-16 rounded-full bg-div-to-r from-amber-500/20 to-yellow-500/20 flex items-center justify-center mx-auto mb-4">
              <Upload size={28} className="text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Submit Proof</h2>
            <p className="text-zinc-400">Upload screenshot for verification</p>
          </div>

          <div className="space-y-6">
            {/* Task Info */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-div-to-br ${platformInfo?.gradient} flex items-center justify-center`}>
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
                    className="h-full bg-div-to-r from-amber-500 to-yellow-500"
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
// Video Player Modal with Request Task Feature
// Video Player Modal with Request Task Feature
// Video Player Modal with Timestamp Submission
// Video Player Modal with Timestamp Submission
const VideoPlayerModal = ({ task, onClose }: any) => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showTimestampModal, setShowTimestampModal] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [player, setPlayer] = useState<any>(null);
  const [selectedTimestamps, setSelectedTimestamps] = useState<number[]>([]);
  const progressInterval = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  setPlayer(null);
  // YouTube API initialization
  useEffect(() => {
    if (task.platform === 'youtube' && task.embedId) {
      // Load YouTube IFrame API if not already loaded
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      // Function to initialize player once API is ready


      // If API is already loaded, create player immediately
      if (window.YT && window.YT.Player) {
        console.log('YT API already loaded, creating player...');
        window.onYouTubeIframeAPIReady();
      }
    }

    return () => {
      stopProgressTracking();
      if (player) {
        try {
          player.destroy();
        } catch (error) {
          console.error('Error destroying player:', error);
        }
      }
    };
  }, []);

  const startProgressTracking = () => {
    console.log('Starting progress tracking...');
    
    // Clear any existing interval
    stopProgressTracking();

    progressInterval.current = setInterval(() => {
      try {
        if (task.platform === 'youtube' && player) {
          const currentTime = player.getCurrentTime();
          const duration = player.getDuration();
          
          if (duration > 0) {
            const progressPercent = (currentTime / duration) * 100;
            console.log('YouTube progress:', currentTime, '/', duration, '=', progressPercent + '%');
            
            setProgress(progressPercent);
            setWatchTime(Math.floor(currentTime));

            if (progressPercent >= 100) {
              setIsComplete(true);
              setProgress(100);
              stopProgressTracking();
            }
          }
        } else if (task.platform !== 'youtube' && videoRef.current) {
          const video = videoRef.current;
          const currentTime = video.currentTime;
          const duration = video.duration;
          
          if (duration > 0) {
            const progressPercent = (currentTime / duration) * 100;
            console.log('HTML5 video progress:', currentTime, '/', duration, '=', progressPercent + '%');
            
            setProgress(progressPercent);
            setWatchTime(Math.floor(currentTime));

            if (progressPercent >= 100) {
              setIsComplete(true);
              setProgress(100);
              stopProgressTracking();
            }
          }
        }
      } catch (error) {
        console.error('Error in progress tracking:', error);
        stopProgressTracking();
      }
    }, 500); // Update every 500ms for smoother progress
  };

  const stopProgressTracking = () => {
    console.log('Stopping progress tracking...');
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  const handlePlay = () => {
    console.log('Play button clicked');
    if (task.platform === 'youtube' && player) {
      player.playVideo();
      setIsPlaying(true);
    } else if (task.platform !== 'youtube' && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    console.log('Pause button clicked');
    if (task.platform === 'youtube' && player) {
      player.pauseVideo();
      setIsPlaying(false);
    } else if (task.platform !== 'youtube' && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSendTimestamps = () => {
    console.log('Send timestamps clicked');
    setShowTimestampModal(true);
  };

  const handleSubmitTimestamps = () => {
    // Calculate video length and create timestamp report
    const reportData = {
      taskId: task.id,
      taskTitle: task.title,
      platform: task.platform,
      videoLength: totalDuration,
      progressPercentage: progress,
      selectedTimestamps: selectedTimestamps,
      totalDuration: totalDuration,
      watchTime: watchTime,
      submittedAt: new Date().toISOString()
    };

    console.log('Submitting timestamps to admin:', reportData);
    
    // Show success notification
    addNotification('Timestamps sent to admin successfully! Request submitted.', 'success');
    
    // Close modal and complete task
    setShowTimestampModal(false);
    completeTask(task.id);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const toggleTimestamp = (timestamp: number) => {
    setSelectedTimestamps(prev => {
      if (prev.includes(timestamp)) {
        return prev.filter(t => t !== timestamp);
      } else {
        return [...prev, timestamp];
      }
    });
  };

  // Generate timestamp options based on video length
  const generateTimestamps = () => {
    if (totalDuration === 0) return [];
    
    const timestamps = [];
    const interval = Math.ceil(totalDuration / 10); // Divide video into 10 parts
    
    for (let i = interval; i < totalDuration; i += interval) {
      timestamps.push(Math.min(i, totalDuration - 1));
    }
    
    return timestamps.slice(0, 8); // Return max 8 timestamps
  };

  // Handle HTML5 video events
  const handleVideoPlay = () => {
    console.log('HTML5 video playing');
    setIsPlaying(true);
    startProgressTracking();
  };

  const handleVideoPause = () => {
    console.log('HTML5 video paused');
    setIsPlaying(false);
    stopProgressTracking();
  };

  const handleVideoEnded = () => {
    console.log('HTML5 video ended');
    setIsPlaying(false);
    setIsComplete(true);
    setProgress(100);
    stopProgressTracking();
  };

  const handleVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    console.log('HTML5 video metadata loaded:', video.duration);
    setTotalDuration(video.duration);
  };

  const handleVideoTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    if (video.duration > 0) {
      const progressPercent = (video.currentTime / video.duration) * 100;
      setProgress(progressPercent);
      setWatchTime(Math.floor(video.currentTime));
    }
  };

  // Timestamp Modal Component
  const TimestampModal = () => (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-6 bg-black/95 backdrop-blur-sm">
      <GlassCard className="w-full max-w-md p-8 relative">
        <button onClick={() => setShowTimestampModal(false)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg">
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-div-to-r from-amber-500/20 to-yellow-500/20 flex items-center justify-center mx-auto mb-4">
            <Clock size={28} className="text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Submit Timestamps</h2>
          <p className="text-zinc-400">Select timestamps from the video</p>
        </div>

        <div className="space-y-6">
          {/* Video Summary */}
          <GlassCard className="p-6">
            <h4 className="font-bold text-white mb-4">Video Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-zinc-400">Video Length:</span>
                <span className="text-white font-medium">{formatTime(totalDuration)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Watched:</span>
                <span className="text-white font-medium">{formatTime(watchTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Completion:</span>
                <span className="text-amber-400 font-bold">{progress.toFixed(1)}%</span>
              </div>
            </div>
          </GlassCard>

          {/* Timestamp Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-4">
              Select timestamps to submit (optional):
            </label>
            <div className="grid grid-cols-2 gap-3">
              {generateTimestamps().map((timestamp, index) => (
                <button
                  key={index}
                  onClick={() => toggleTimestamp(timestamp)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedTimestamps.includes(timestamp)
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">{formatTime(timestamp)}</div>
                    <div className="text-xs text-zinc-400 mt-1">
                      {Math.round((timestamp / totalDuration) * 100)}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-500 mt-3 text-center">
              Selected: {selectedTimestamps.length} timestamps
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setShowTimestampModal(false)}
              className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <MagneticButton 
              onClick={handleSubmitTimestamps}
              className="flex-1"
            >
              <Send size={16} />
              Send Timestamps
            </MagneticButton>
          </div>

          {/* Admin Info */}
          <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck size={16} className="text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Admin Review</span>
            </div>
            <p className="text-xs text-zinc-400">
              Your timestamps will be reviewed by admin. If approved, you'll receive your {task.coins} coins.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-sm">
      <GlassCard className="w-full max-w-4xl p-8 relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg z-10">
          <X size={20} />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            {task.platform === 'youtube' && <Youtube size={24} className="text-red-600" />}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{task.title}</h2>
              <p className="text-zinc-400">{task.desc}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Coins size={20} className="text-amber-400" />
              <span className="text-xl font-bold text-amber-400">+{task.coins}</span>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="aspect-video bg-black rounded-xl mb-6 overflow-hidden relative">
          {task.platform === 'youtube' ? (
            <div 
              id="youtube-player" 
              className="w-full h-full"
              style={{ minHeight: '400px' }}
            />
          ) : (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                id="html5-video-player"
                className="w-full h-full object-cover"
                controls={false}
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                onEnded={handleVideoEnded}
                onLoadedMetadata={handleVideoLoadedMetadata}
                onTimeUpdate={handleVideoTimeUpdate}
              >
                <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Custom play button overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <button
                    onClick={handlePlay}
                    className="w-20 h-20 rounded-full bg-div-to-r from-amber-500 to-yellow-500 flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Play size={32} className="text-white ml-2" />
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Custom controls overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-4">
              <button
                onClick={isPlaying ? handlePause : handlePlay}
                className="w-12 h-12 rounded-full bg-div-to-r from-amber-500 to-yellow-500 flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <Pause size={20} className="text-white" />
                ) : (
                  <Play size={20} className="text-white ml-1" />
                )}
              </button>
              
              <div className="flex-1">
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>{formatTime(watchTime)}</span>
                  <span>{formatTime(totalDuration)}</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-div-to-r from-amber-500 to-yellow-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress and Controls */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-zinc-400">Watch Progress</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-500">
                    {formatTime(watchTime)} / {totalDuration > 0 ? formatTime(totalDuration) : '0:00'}
                  </span>
                </div>
              </div>
              <span className="text-2xl font-bold text-amber-400">{progress.toFixed(1)}%</span>
            </div>
            
            <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-div-to-r from-amber-500 to-yellow-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-zinc-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex gap-4">
            <button
              onClick={isPlaying ? handlePause : handlePlay}
              disabled={task.platform === 'youtube' && !player}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                isPlaying 
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                  : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
              } ${task.platform === 'youtube' && !player ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isPlaying ? (
                <>
                  <Pause size={16} />
                  Pause Video
                </>
              ) : (
                <>
                  <Play size={16} />
                  Play Video
                </>
              )}
            </button>

            <div className="flex-1" />

            {/* Send Timestamps Button - Only when video is 100% complete */}
            {isComplete ? (
              <MagneticButton 
                onClick={handleSendTimestamps}
                className="px-8!"
              >
                <span className="flex items-center gap-2">
                  <Send size={16} />
                  Send Timestamps
                </span>
              </MagneticButton>
            ) : (
              <button
                disabled
                className="px-6 py-3 bg-zinc-800 text-zinc-600 rounded-xl font-medium cursor-not-allowed"
              >
                Complete ({progress.toFixed(0)}%)
              </button>
            )}
          </div>

          {/* Status Messages */}
          {progress > 0 && !isComplete && (
            <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-amber-400" />
                <div>
                  <p className="text-sm text-amber-300 font-medium">Video in progress</p>
                  <p className="text-xs text-zinc-400">
                    Watch the video completely to earn {task.coins} coins. 
                    {progress < 50 ? ' Keep watching!' : ' Almost there!'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {isComplete && (
            <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-emerald-400" />
                <div>
                  <p className="text-sm text-emerald-300 font-medium">Video watched completely!</p>
                  <p className="text-xs text-zinc-400">
                    Click "Send Timestamps" to submit your watch report and claim {task.coins} coins.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-white/5 rounded-xl">
            <h4 className="font-medium text-white mb-2 flex items-center gap-2">
              <Info size={16} className="text-blue-400" />
              How to earn coins:
            </h4>
            <ul className="text-sm text-zinc-400 space-y-1">
              <li className="flex items-center gap-2">
                <Check size={12} className="text-green-400" />
                Click "Play Video" button to start watching
              </li>
              <li className="flex items-center gap-2">
                <Check size={12} className="text-green-400" />
                Watch the video completely until progress reaches 100%
              </li>
              <li className="flex items-center gap-2">
                <Check size={12} className="text-green-400" />
                Once 100% complete, "Send Timestamps" button will appear
              </li>
              <li className="flex items-center gap-2">
                <Check size={12} className="text-green-400" />
                Click "Send Timestamps" to submit watch report and claim coins
              </li>
            </ul>
          </div>
        </div>
      </GlassCard>

      {/* Timestamp Modal */}
      {showTimestampModal && <TimestampModal />}
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
            <div className="w-16 h-16 rounded-full bg-divt-to-r from-red-500/20 to-rose-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Task Rejected</h2>
            <p className="text-zinc-400">Review why your task was rejected</p>
          </div>

          <div className="space-y-6">
            {/* Task Details */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-div-to-br ${platformInfo?.gradient} flex items-center justify-center`}>
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
                          ? 'bg-div-to-br ' + p.gradient
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
                          ? 'bg-div-to-br from-amber-500/20 to-yellow-500/20'
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
                className="h-full bg-div-to-r from-amber-500 to-yellow-500"
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
                      ? 'bg-div-to-r from-amber-500/20 to-yellow-500/20 text-white'
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
                index === 0 ? 'bg-div-to-r from-yellow-500 to-amber-500' :
                index === 1 ? 'bg-div-to-r from-zinc-400 to-zinc-300' :
                'bg-div-to-r from-amber-700 to-orange-600'
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
                index === 0 ? 'bg-div-to-r from-yellow-500/20 to-amber-500/20' :
                index === 1 ? 'bg-div-to-r from-zinc-500/20 to-zinc-400/20' :
                'bg-div-to-r from-amber-700/20 to-orange-700/20'
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
                        user.isSelf ? 'bg-div-to-r from-purple-500/10 to-pink-500/10' : ''
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
                className="mt-6 p-4 bg-div-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20"
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
                      className="h-full bg-div-to-r from-emerald-500 to-green-500"
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
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-div-to-r from-amber-500 to-yellow-500 flex items-center justify-center">
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
                      className="h-full bg-div-to-r from-purple-500 to-pink-500"
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
                        <div className={`w-12 h-12 rounded-xl bg-div-to-br ${p.gradient} flex items-center justify-center flex-shrink-0`}>
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
                <div className="absolute inset-0 bg-div-to-br from-purple-500/10 via-transparent to-pink-500/10" />
                <div className="p-8 relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-div-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
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
                          ? 'bg-div-to-r from-amber-500/20 to-yellow-500/20' 
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
            <div className="w-16 h-16 rounded-xl bg-div-to-r from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
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
            
            <div className="p-4 bg-div-to-r from-amber-500/10 to-yellow-500/10 rounded-xl border border-amber-500/20">
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
                    className="w-10 h-10 rounded-full bg-div-to-r from-[#b68938] to-[#e1ba73] flex items-center justify-center cursor-pointer"
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

                  
                  <MagneticButton small onClick={() => setDashView('coinExchange')}>
                    <Wallet size={16} />
                    Withdraw
                  </MagneticButton>
                </div>
              </div>
            </div>
          </header>
 <MobileMenu />
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
          {showVerification && (
            <VerificationModal 
              onClose={() => setShowVerification(false)} 
              onSuccess={handleVerificationSuccess}
            />
          )}
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
 <style dangerouslySetInnerHTML={{__html: `
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
     `}} /> 
      
      {view === 'landing' ? <LandingView /> : <DashboardView />}
    </div>
  );
};

export default AfterVerified;