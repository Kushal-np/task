import React, { useState, useRef, useEffect } from 'react';
import { X, ArrowRight, UserCircle, Eye, Link, Play, Upload, Youtube, Instagram, Smartphone, CheckCircle, Clock, Zap, Shield, TrendingUp, DollarSign, Award, Settings, Wallet, ListChecks, Sparkles, FileText, Send, Check, Facebook, Ticket } from 'lucide-react';

// --- TYPE DEFINITIONS ---
// ReactNode type is now correctly used without being explicitly imported from 'react'.
type SocialPlatform = 'youtube' | 'instagram' | 'tiktok' | 'facebook' | 'twitter';
type TaskType = 'follow' | 'watch' | 'post';
type DashboardView = 'verification' | 'analytics' | 'profile' | 'payout' | 'leaderboard' | 'content' | 'coinExchange';

interface Task {
  id: string;
  type: TaskType;
  platform: SocialPlatform;
  title: string;
  coins: number;
  duration?: string; // For watch tasks
  username?: string; // For follow tasks
  embedId?: string; // For YouTube watch tasks
  link?: string; // For post/follow/general links
  desc: string; // Generic description for display
}

interface PlatformInfo {
  platform: SocialPlatform;
  icon: React.FC<any>;
  color: string;
  name: string;
}

interface LeaderboardEntry {
  rank: number;
  user: string;
  score: number;
  consistencyDays: number;
  isSelf?: boolean;
}

// --- DESIGN SYSTEM & UTILITY COMPONENTS ---

const COLORS = {
  accent: "#D4AF37",
  bgDark: "#0A0A0A",
  bgCard: "bg-zinc-900/50",
  border: "border-zinc-800",
  borderHover: "hover:border-amber-500/30",
  text: {
    primary: "text-white",
    secondary: "text-zinc-400",
    accent: "text-amber-400"
  }
};

interface MagneticButtonProps {
  children: React.ReactNode; // Using React.ReactNode here
  onClick: () => void;
  disabled?: boolean;
  small?: boolean;
  className?: string;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ children, onClick, disabled, small, className = "" }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.1;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.1;
    setPos({ x, y });
  };

  return (
    <button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setPos({ x: 0, y: 0 });
        setIsHovered(false);
      }}
      onClick={onClick}
      disabled={disabled}
      style={{ 
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: 'transform 0.15s ease-out'
      }}
      className={`
        relative overflow-hidden group
        ${small ? 'px-6 py-3 text-xs' : 'px-8 py-4 text-sm'}
        rounded-full font-bold uppercase tracking-widest
        bg-gradient-to-r from-[#b68938] to-[#e1ba73]
        text-black
        transition-all duration-300
        hover:shadow-[0_0_40px_rgba(182,137,56,0.7)]
        active:scale-95
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none
        
        // FIX: Remove default focus ring and add custom amber focus ring
        focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950
        
        ${className}
      `}
    >
      {/* Animated shine effect */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
        style={{
          transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
          transition: 'transform 0.6s ease-in-out'
        }}
      />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

interface CardProps {
  children: React.ReactNode; // Using React.ReactNode here
  className?: string;
  onClick?: () => void;
  // FIX: Added Mouse Event Handlers
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}

const Card: React.FC<CardProps> = ({ children, className = "", onClick, onMouseEnter, onMouseLeave }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXValue = ((y - centerY) / centerY) * -3;
    const rotateYValue = ((x - centerX) / centerX) * 3;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setRotateX(0);
    setRotateY(0);
    if (onMouseLeave) onMouseLeave(e); // Propagate external handler
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave} // Internal tilt logic calls external prop
      onMouseEnter={onMouseEnter} // External prop
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.1s ease-out'
      }}
      className={`
        relative backdrop-blur-md rounded-3xl 
        border border-[rgba(182,137,56,0.2)] 
        bg-[rgba(26,20,16,0.4)]
        hover:border-[rgba(182,137,56,0.4)]
        transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Gradient glow on hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#b68938]/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.FC<any>;
  isCoins: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, isCoins }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="p-6 group"
      // These props now correctly exist on the Card component
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="w-14 h-14 rounded-2xl bg-[#b68938]/15 flex items-center justify-center mb-6 relative overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
        style={{
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        <Icon size={28} className="text-[#b68938] relative z-10" />
        
        {isHovered && (
          <div 
            className="absolute inset-0 rounded-2xl bg-[#b68938]/20 animate-ping"
            style={{ animationDuration: '1s' }}
          />
        )}
      </div>

      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-3">
        {title}
      </p>

      <p 
        className={`text-4xl font-bold transition-all duration-300 ${
          isHovered 
            ? 'bg-gradient-to-r from-[#b68938] to-[#e1ba73] bg-clip-text text-transparent' 
            : 'text-white'
        }`}
      >
        {/* Changed Pts to Coins */}
        {isCoins ? `${value} Coins` : `Rs. ${value.toFixed(2)}`}
      </p>

      <div className="mt-4 h-1 bg-gradient-to-r from-[#b68938] to-[#e1ba73] rounded-full transition-all duration-300 origin-left" 
        style={{ 
          transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left'
        }}
      />
    </Card>
  );
};

// --- DATA STRUCTURES ---

const socialIcons: Record<SocialPlatform, React.FC<any>> = { 
  youtube: Youtube, 
  instagram: Instagram, 
  tiktok: Smartphone, 
  facebook: Facebook, 
  twitter: X 
};

// Updated platforms list including TikTok
const allPlatforms: PlatformInfo[] = [
  { platform: 'youtube', icon: Youtube, color: 'text-red-600', name: 'YouTube' },
  { platform: 'instagram', icon: Instagram, color: 'text-pink-500', name: 'Instagram' },
  { platform: 'facebook', icon: Facebook, color: 'text-blue-600', name: 'Facebook' },
  { platform: 'twitter', icon: X, color: 'text-sky-400', name: 'X / Twitter' },
  { platform: 'tiktok', icon: Smartphone, color: 'text-black bg-white rounded-full p-0.5', name: 'TikTok' }
];

// Tasks
const followTasks: Task[] = [
  { id: 'f-yt-1', type: 'follow', platform: 'youtube', username: '@SRKUniversity', coins: 150, desc: 'Subscribe to official YouTube channel', title: 'Subscribe Channel' },
  { id: 'f-ig-1', type: 'follow', platform: 'instagram', username: '@srk_official', coins: 120, desc: 'Follow the official Instagram page', title: 'Follow Page' },
  { id: 'f-fb-1', type: 'follow', platform: 'facebook', username: 'SRKOfficialPage', coins: 130, desc: 'Like and Follow the Facebook page', title: 'Like & Follow' },
  { id: 'f-tw-1', type: 'follow', platform: 'twitter', username: '@SRK_X_Acc', coins: 110, desc: 'Follow the official X (Twitter) account', title: 'Follow X Account' },
  { id: 'f-tt-1', type: 'follow', platform: 'tiktok', username: '@srk_campus', coins: 100, desc: 'Follow SRK on TikTok', title: 'Follow TikTok' }
];

const watchTasks: Task[] = [
  { id: 'w-yt-1', type: 'watch', platform: 'youtube', title: 'Welcome to SRK 2025', coins: 200, duration: '4:20', embedId: 'dQw4w9WgXcQ', desc: 'Watch the official welcome video.' },
  { id: 'w-ig-1', type: 'watch', platform: 'instagram', title: 'Campus Life Reel', coins: 180, duration: '0:45', embedId: '', desc: 'Watch the latest Campus Life Reel.' },
  { id: 'w-tt-1', type: 'watch', platform: 'tiktok', title: 'Day in the Life Vlog', coins: 150, duration: '1:10', embedId: '', desc: 'View the official day-in-the-life video.' },
];

const postTasks: Task[] = [
  { id: 'p-fb-1', type: 'post', platform: 'facebook', title: 'Share Admission Post', coins: 100, desc: 'Share the latest admission post to your wall.' },
  { id: 'p-tw-1', type: 'post', platform: 'twitter', title: 'Retweet Event', coins: 90, desc: 'Retweet the official event announcement from X.' },
];

// Leaderboard with Consistency Days
const leaderboard: LeaderboardEntry[] = [
  { rank: 1, user: 'Nova_Star', score: 9800, consistencyDays: 125 },
  { rank: 2, user: 'SRK_Guru', score: 8500, consistencyDays: 98 },
  { rank: 3, user: 'You', score: 8200, consistencyDays: 105, isSelf: true },
  { rank: 4, user: 'Ace_User', score: 7900, consistencyDays: 62 },
  { rank: 5, user: 'Galaxy_7', score: 7500, consistencyDays: 45 }
];

// --- MAIN APP COMPONENT ---

const SRKPortal: React.FC = () => {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [dashView, setDashView] = useState<DashboardView>('verification');
  const [showVerification, setShowVerification] = useState(false);
  const [isApproved, setIsApproved] = useState(true); // Changed initial state for demonstration
  const [hasPurchased, setHasPurchased] = useState(true); // Changed initial state for demonstration
  const [payoutRequested, setPayoutRequested] = useState(false);
  const [taskCategory, setTaskCategory] = useState<TaskType | null>(null); // Preserved throughout platform selection
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
  const [playingVideo, setPlayingVideo] = useState<Task | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [balance, setBalance] = useState<number>(1250); // Now Coins
  const [eligible, setEligible] = useState<number>(1000); // Now Coins
  const [verifyingTask, setVerifyingTask] = useState<Task | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false); // New state for profile task request

  // --- SUB COMPONENTS (UNCHANGED LOGIC) ---

  const Landing: React.FC = () => (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10 text-center px-6">
        <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-6">
          <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            SRK
          </span> Portal
        </h1>
        <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Empowering users through verified tasks and rewarding engagement opportunities
        </p>
        <MagneticButton onClick={() => setView('dashboard')}>
          <span className="flex items-center gap-2">
            Enter Console <ArrowRight size={20} />
          </span>
        </MagneticButton>
      </div>
    </div>
  );

  interface TabButtonProps { view: DashboardView; icon: React.FC<any>; label: string; }
  const TabButton: React.FC<TabButtonProps> = ({ view: v, icon: Icon, label }) => {
    const active = dashView === v;
    return (
      <button
        onClick={() => setDashView(v)}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left
          ${active ? 'bg-amber-500/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}
        `}
      >
        <Icon size={18} className={active ? 'text-amber-400' : 'text-zinc-500'} />
        <span className="text-sm font-medium">{label}</span>
      </button>
    );
  };

  // Restored and enhanced Verification View
  const VerificationView: React.FC = () => (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl">
      {/* 1. Identity Verification Status Card */}
      <Card className="p-8 group relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-700">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Shield size={24} className="text-amber-400" /> Identity Verification
          </h3>
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
            isApproved 
              ? 'bg-green-600/20 text-green-400 border border-green-700' 
              : 'bg-red-600/20 text-red-400 border border-red-700'
          }`}>
            {isApproved ? 'VERIFIED' : 'PENDING'}
          </span>
        </div>

        <p className="text-zinc-400 mb-6">
          Your account status determines access to earning tasks. Verification typically takes 24 hours.
        </p>

        {!isApproved && (
          <MagneticButton onClick={() => setShowVerification(true)} className="w-full">
            <span className="flex items-center gap-2">
              Start Verification <Check size={18} />
            </span>
          </MagneticButton>
        )}

        {isApproved && (
          <div className="p-3 bg-zinc-800/50 rounded-xl flex items-center gap-3">
            <CheckCircle size={20} className="text-green-400" />
            <span className="text-sm text-zinc-300">You are fully verified and unlocked all tasks.</span>
          </div>
        )}
      </Card>

      {/* 2. SRK Grow Package Card */}
      <Card className="p-8 group relative overflow-hidden ring-2 ring-[#b68938]/30">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-700">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Zap size={24} className="text-amber-400" /> SRK Grow Package
          </h3>
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
            hasPurchased 
              ? 'bg-blue-600/20 text-blue-400 border border-blue-700' 
              : 'bg-yellow-600/20 text-yellow-400 border border-yellow-700'
          }`}>
            {hasPurchased ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
        
        <p className="text-zinc-400 mb-6">
          Unlock Profile Customization and the ability to **Request New Tasks** for promotion.
        </p>

        <div className="flex justify-between items-center text-zinc-300 mb-6">
          <span className="text-sm">Price:</span>
          <span className="text-lg font-bold text-amber-400">Rs. 999 (One-time)</span>
        </div>

        {!hasPurchased && (
          <MagneticButton onClick={() => setHasPurchased(true)} className="w-full">
            <span className="flex items-center gap-2">
              Purchase Package <DollarSign size={18} />
            </span>
          </MagneticButton>
        )}
        
        {hasPurchased && (
          <div className="p-3 bg-zinc-800/50 rounded-xl flex items-center gap-3">
            <Sparkles size={20} className="text-blue-400" />
            <span className="text-sm text-zinc-300">Package active. Check the Profile tab!</span>
          </div>
        )}
      </Card>
    </div>
  );

  const AnalyticsView: React.FC = () => (
    <div className="max-w-6xl space-y-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* isCoins: true for the new 'Coins' terminology */}
        <StatCard title="Total Coins" value={balance} icon={Wallet} isCoins={true} />
        <StatCard title="Today" value={470} icon={Clock} isCoins={true} />
        <StatCard title="Last 7 Days" value={1520} icon={TrendingUp} isCoins={true} />
        <StatCard title="Last 28 Days" value={4500} icon={TrendingUp} isCoins={true} />
      </div>

      <Card className="p-8">
        <h3 className="text-lg font-bold mb-6">Activity Graph</h3>
        <div className="h-48 flex items-end justify-between gap-2">
          {[30, 50, 80, 60, 95, 70, 85].map((h, i) => (
            <div key={i} className="flex-1 bg-zinc-800 rounded-t-lg relative overflow-hidden group hover:bg-zinc-700 transition-all">
              <div className="absolute inset-x-0 bottom-0 bg-amber-500/80" style={{ height: `${h}%` }} />
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-zinc-500 mt-4">Daily earnings over the last week</p>
      </Card>
    </div>
  );

  // Profile Editor with New Task Request Feature
  const ProfileEditor: React.FC = () => {
    if (!hasPurchased) {
      return (
        <Card className="p-12 text-center max-w-2xl">
          <Shield size={40} className="text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-3">Package Required</h3>
          <p className="text-zinc-400 mb-8">Purchase SRK Grow to access profile customization and task requests.</p>
          <MagneticButton onClick={() => setDashView('verification')}>
            Go to Packages
          </MagneticButton>
        </Card>
      );
    }

    return (
      <div className="max-w-2xl space-y-8">
        {/* Section 1: Social Media Links */}
        <Card className="p-8 space-y-6">
          <h3 className="text-xl font-bold mb-6">Social Media Links</h3>
          {Object.keys(socialIcons).map((platform) => {
            const Icon = socialIcons[platform as SocialPlatform];
            return (
              <div key={platform}>
                <label className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
                  <Icon size={16} className="text-amber-400" />
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </label>
                <input
                  type="url"
                  placeholder={`Enter ${platform} URL`}
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:border-amber-500 outline-none transition-all"
                />
              </div>
            );
          })}
          {/* This MagneticButton now works correctly */}
          <MagneticButton className="w-full" onClick={() => console.log('Saving changes')}>Save Changes</MagneticButton>
        </Card>

        {/* Section 2: Request New Task */}
        <Card className="p-8 space-y-4 bg-zinc-800/60 ring-2 ring-amber-500/30">
          <div className="flex items-center gap-4">
            <Ticket size={28} className="text-amber-400" />
            <h3 className="text-xl font-bold">Request a New Task</h3>
          </div>
          <p className="text-zinc-400 text-sm">
            Propose content (Video, Post, or Follow) you want SRK to promote and earn coins.
          </p>
          <MagneticButton onClick={() => setShowRequestModal(true)} className="w-full">
            <span className="flex items-center justify-center gap-2">
              Start New Request <ArrowRight size={16} />
            </span>
          </MagneticButton>
        </Card>
      </div>
    );
  };
  
  // New: Request Task Modal (Nested Modals/Conditional Rendering)
  interface RequestTaskModalProps {
    onClose: () => void;
  }
  
  const RequestTaskModal: React.FC<RequestTaskModalProps> = ({ onClose }) => {
    const [step, setStep] = useState<'platform' | 'type' | 'url'>('platform');
    const [reqPlatform, setReqPlatform] = useState<SocialPlatform | null>(null);
    const [reqType, setReqType] = useState<TaskType | null>(null);
    const [urlInput, setUrlInput] = useState<string>('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    // Step 1: Platform Selection
    const PlatformSelection: React.FC = () => (
      <div className="grid grid-cols-3 gap-4">
        {allPlatforms.map(p => (
          <Card 
            key={p.platform} 
            className="p-4 flex flex-col items-center text-center transition-all group hover:scale-[1.05] cursor-pointer"
            onClick={() => { setReqPlatform(p.platform); setStep('type'); }}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${p.color} group-hover:bg-amber-500/10`}>
              {React.createElement(p.icon, { size: 24, className: p.color.includes('bg-white') ? 'text-black' : p.color })}
            </div>
            <p className="font-semibold text-xs">{p.name}</p>
          </Card>
        ))}
      </div>
    );

    // Step 2: Task Type Selection
    const TypeSelection: React.FC = () => {
      const platformName = allPlatforms.find(p => p.platform === reqPlatform)?.name || 'Platform';
      return (
        <div className="space-y-4">
          <p className="text-zinc-400 mb-4">What kind of content are you requesting for **{platformName}**?</p>
          <div className="grid grid-cols-3 gap-4">
            {[{t: 'watch', i: Play}, {t: 'post', i: FileText}, {t: 'follow', i: UserCircle}].map(item => (
              <Card 
                key={item.t} 
                className="p-6 flex flex-col items-center text-center transition-all group hover:scale-[1.05] cursor-pointer"
                onClick={() => { setReqType(item.t as TaskType); setStep('url'); }}
              >
                {React.createElement(item.i, { size: 24, className: 'text-amber-400 mb-2' })}
                <p className="font-semibold">{item.t.charAt(0).toUpperCase() + item.t.slice(1)}</p>
              </Card>
            ))}
          </div>
          <button onClick={() => setStep('platform')} className="text-sm text-zinc-500 hover:text-white mt-4 flex items-center gap-1">
            <ArrowRight size={14} className="rotate-180" /> Back
          </button>
        </div>
      );
    };

    // Step 3: URL Input
    const URLInput: React.FC = () => {
      const platformName = allPlatforms.find(p => p.platform === reqPlatform)?.name;
      const placeholder = reqType === 'follow' 
        ? `Enter ${platformName} Profile URL` 
        : `Enter ${platformName} ${reqType} URL`;

      const handleSubmit = () => {
        if (!urlInput.trim()) return;
        setIsSubmitted(true);
        // Simulate API call to submit request
        setTimeout(() => {
          setUrlInput('');
          setStep('platform');
          setReqPlatform(null);
          setReqType(null);
          setIsSubmitted(false);
          onClose();
        }, 2000);
      };

      if (isSubmitted) {
        return (
          <div className="text-center p-10 bg-green-900/20 rounded-xl">
            <CheckCircle size={40} className="text-green-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-white">Request Submitted!</h4>
            <p className="text-zinc-400 mt-2">Our team will review your {reqType} request on {platformName}.</p>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <p className="text-sm text-zinc-400">
            Requesting a **{reqType}** task for **{platformName}**. Please provide the exact URL.
          </p>
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              URL
            </label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:border-amber-500 outline-none transition-all"
            />
          </div>
          
          <MagneticButton onClick={handleSubmit} disabled={!urlInput.trim()} className="w-full">
            Submit {reqType?.toUpperCase()} Request
          </MagneticButton>

          <button onClick={() => setStep('type')} className="text-sm text-zinc-500 hover:text-white flex items-center gap-1">
            <ArrowRight size={14} className="rotate-180" /> Back
          </button>
        </div>
      );
    };

    const getTitle = () => {
      switch (step) {
        case 'platform': return 'Step 1: Select Platform';
        case 'type': return 'Step 2: Select Task Type';
        case 'url': return 'Step 3: Submit URL';
        default: return 'New Task Request';
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
        <Card className="w-full max-w-xl p-8 relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-zinc-800 rounded-lg">
            <X size={20} />
          </button>

          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Ticket size={24} className="text-amber-400" /> {getTitle()}
          </h2>
          <div className="h-1 w-full bg-zinc-800 rounded-full mb-6">
            <div 
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${step === 'platform' ? 33 : step === 'type' ? 66 : 100}%` }}
            />
          </div>

          {step === 'platform' && <PlatformSelection />}
          {step === 'type' && <TypeSelection />}
          {step === 'url' && <URLInput />}
        </Card>
      </div>
    );
  };

  const PayoutView: React.FC = () => {
    const eligible = 1000;
    
    return (
      <div className="max-w-3xl space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <StatCard title="Total Balance" value={balance} icon={Wallet} isCoins={true} />
          <StatCard title="Eligible" value={eligible} icon={DollarSign} isCoins={true} />
        </div>

        <Card className="p-8">
          <h3 className="text-xl font-bold mb-4">Legacy Withdrawal View</h3>
          <p className="text-zinc-400 mb-6 text-sm">
            Please use the new <span className="text-amber-400">Coin Exchange</span> tab for all withdrawals.
          </p>
          <div className="text-4xl font-bold mb-8">
            <span className="text-amber-400">Rs. {(eligible * 0.01).toFixed(2)}</span>
            <span className="text-zinc-600 text-base font-normal ml-2">available Rupee equivalent</span>
          </div>
          <MagneticButton onClick={() => setDashView('coinExchange')} className="w-full">
            Go to Coin Exchange
          </MagneticButton>
        </Card>
      </div>
    );
  };
  
  const CoinExchangeView: React.FC = () => {
    const EXCHANGE_RATE = 100; // 100 Coins = Rs. 1.00 Gross Amount
    const TDS_RATE = 0.15; // 15% Tax Deducted at Source
    const MIN_WITHDRAWAL = 500; // Minimum coins for payout

    const rupeeRate = 1 / EXCHANGE_RATE;
    const [exchangeAmount, setExchangeAmount] = useState<number>(0);
    const [currencyInput, setCurrencyInput] = useState<string>('');
    
    const grossAmount = exchangeAmount * rupeeRate;
    const tdsAmount = grossAmount * TDS_RATE;
    const netAmount = grossAmount - tdsAmount;

    const isValidAmount = exchangeAmount > 0 && exchangeAmount <= eligible;
    const meetsMinimum = exchangeAmount >= MIN_WITHDRAWAL;
    const canRequest = isValidAmount && meetsMinimum && !payoutRequested;

    const handleCoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const coins = parseInt(input, 10) || 0;
      
      setExchangeAmount(coins);
      if (input) {
        const gross = coins * rupeeRate;
        const net = gross * (1 - TDS_RATE);
        setCurrencyInput(net.toFixed(2));
      } else {
        setCurrencyInput('');
      }
    };
    
    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const desiredNetAmount = parseFloat(input) || 0;
      
      const grossAmountRequired = desiredNetAmount / (1 - TDS_RATE);
      const coins = Math.floor(grossAmountRequired / rupeeRate);
      
      setCurrencyInput(input);
      setExchangeAmount(coins);
    };

    return (
      <div className="max-w-3xl space-y-8">
        <div className="grid grid-cols-2 gap-4">
          {/* Changed Points to Coins */}
          <StatCard title="Total Coins" value={balance} icon={Wallet} isCoins={true} />
          <StatCard title="Eligible for Exchange" value={eligible} icon={DollarSign} isCoins={true} />
        </div>

        <Card className="p-8">
          <h3 className="text-xl font-bold mb-4">Coin Exchange Console</h3>
          <p className="text-zinc-400 mb-6 text-sm">
            Exchange your eligible **coins** for a cash payout. All payouts are subject to a **15% TDS** deduction.
          </p>

          <div className="mb-8 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 flex items-center justify-between">
            <p className="text-sm text-zinc-400">Exchange Rate:</p>
            <p className="text-lg font-bold text-amber-400">
              {EXCHANGE_RATE} Coins = Rs. {(rupeeRate * EXCHANGE_RATE).toFixed(2)} Gross Amount
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Coins to Exchange (Max: {eligible} Coins)
              </label>
              <input
                type="number"
                value={exchangeAmount === 0 && !exchangeAmount.toString().includes('.') ? '' : exchangeAmount}
                onChange={handleCoinChange}
                min="0"
                max={eligible}
                placeholder="Enter coins amount"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:border-amber-500 outline-none transition-all"
              />
            </div>

            <div className="flex justify-center">
              <span className="text-zinc-500 font-bold p-2 bg-zinc-950 rounded-full border border-zinc-800">
                <X size={16} className="rotate-45" />
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Desired Net Depositable Amount (Rs.)
              </label>
              <input
                type="number"
                value={currencyInput}
                onChange={handleCurrencyChange}
                step="0.01"
                placeholder="Enter desired amount (Net)"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:border-amber-500 outline-none transition-all"
              />
              <p className="mt-2 text-xs text-zinc-500">
                Coins needed for this Net Amount: {exchangeAmount} Coins
              </p>
            </div>
            
            <div className="pt-4 border-t border-zinc-800 space-y-2">
              <h4 className="text-sm font-bold text-white">Summary for {exchangeAmount} Coins:</h4>
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Gross Amount Equivalent:</span>
                <span className="text-white">Rs. {grossAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-red-400">
                <span>TDS Deduction (15%):</span>
                <span>-Rs. {tdsAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-zinc-700">
                <span>Net Depositable Amount:</span>
                <span className="text-green-400">Rs. {netAmount.toFixed(2)}</span>
              </div>
            </div>
            
            {exchangeAmount > eligible && (
              <p className="text-red-400 text-sm font-medium">
                Error: Cannot exchange more than your eligible {eligible} coins.
              </p>
            )}
            
            {(exchangeAmount > 0 && exchangeAmount < MIN_WITHDRAWAL) && (
              <p className="text-yellow-400 text-sm font-medium">
                Warning: Minimum withdrawal is {MIN_WITHDRAWAL} coins.
              </p>
            )}
          </div>

          <div className="mt-8">
            <MagneticButton 
              onClick={() => { 
                if (canRequest) {
                  setPayoutRequested(true); 
                }
              }} 
              disabled={!canRequest} 
              className="w-full"
            >
              {payoutRequested ? 'Request Pending' : 
              canRequest ? `Request Rs. ${netAmount.toFixed(2)} Payout` : 'Cannot Request Payout'}
            </MagneticButton>
            
            {payoutRequested && (
              <div className="mt-4 p-3 text-center bg-green-900/20 border border-green-800 rounded-xl text-green-400 text-sm font-medium">
                Payout request submitted successfully for Rs. {netAmount.toFixed(2)} NET!
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  // Enhanced Leaderboard View
  const LeaderboardView: React.FC = () => {
    return (
      <div className="max-w-3xl">
        <Card className="p-6">
          <div className="flex justify-between items-center px-4 py-2 border-b border-zinc-700 mb-2">
            <span className="w-12 text-zinc-500 font-bold text-sm">#</span>
            <span className="flex-1 ml-4 text-zinc-500 font-bold text-sm">User</span>
            <span className="w-24 text-right text-zinc-500 font-bold text-sm">Coins</span>
            <span className="w-32 text-right text-zinc-500 font-bold text-sm">Consistency</span>
          </div>
          {leaderboard.map(user => (
            <div
              key={user.rank}
              className={`flex items-center p-4 rounded-xl transition-all ${
                user.isSelf ? 'bg-amber-500/10 border border-amber-500/30' : 'hover:bg-zinc-800/50'
              }`}
            >
              <div className="w-12 text-center">
                {user.rank <= 3 ? (
                  <Award size={20} className={user.rank === 1 ? 'text-amber-400' : user.rank === 2 ? 'text-zinc-400' : 'text-orange-400'} />
                ) : (
                  <span className="text-zinc-500 font-bold">{user.rank}</span>
                )}
              </div>
              <div className="flex-1 ml-4">
                <p className={`font-medium ${user.isSelf ? 'text-amber-400' : 'text-white'}`}>{user.user}</p>
              </div>
              
              {/* Score (Coins) */}
              <p className="text-lg font-bold text-green-400 w-24 text-right">{user.score}</p>
              
              {/* Consistency Days */}
              <div className="w-32 text-right flex items-center justify-end gap-2">
                <Clock size={16} className="text-blue-400" />
                <span className="text-base font-semibold text-zinc-300">{user.consistencyDays} Days</span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    );
  };
  
  // Tasks View
  const TasksView: React.FC = () => {
    if (!isApproved) {
      return (
        <Card className="p-12 text-center max-w-2xl">
          <Shield size={40} className="text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-3">Verification Required</h3>
          <p className="text-zinc-400 mb-8">Complete verification to access earning tasks.</p>
          <MagneticButton onClick={() => setDashView('verification')}>
            Go to Verification
          </MagneticButton>
        </Card>
      );
    }

    return (
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl">
        <Card className="p-8 flex flex-col" onClick={() => setTaskCategory('follow')}>
          <UserCircle size={32} className="text-amber-400 mb-4" />
          <h3 className="text-2xl font-bold mb-3">Follow & Subscribe</h3>
          <p className="text-zinc-400 mb-6 flex-1">Connect with SRK social accounts to earn coins.</p>
          <MagneticButton small className="w-fit" onClick={() => setTaskCategory('follow')}>
            View Tasks <ArrowRight size={16} />
          </MagneticButton>
        </Card>

        <Card className="p-8 flex flex-col" onClick={() => setTaskCategory('watch')}>
          <Eye size={32} className="text-amber-400 mb-4" />
          <h3 className="text-2xl font-bold mb-3">Watch & Earn</h3>
          <p className="text-zinc-400 mb-6 flex-1">View videos and complete watch requirements.</p>
          <MagneticButton small className="w-fit" onClick={() => setTaskCategory('watch')}>
            Start Watching <ArrowRight size={16} />
          </MagneticButton>
        </Card>
        
        {/* New Post Task Card */}
        <Card className="p-8 flex flex-col" onClick={() => setTaskCategory('post')}>
          <FileText size={32} className="text-amber-400 mb-4" />
          <h3 className="text-2xl font-bold mb-3">Post & Share</h3>
          <p className="text-zinc-400 mb-6 flex-1">Share content on social platforms for coins.</p>
          <MagneticButton small className="w-fit" onClick={() => setTaskCategory('post')}>
            View Posts <ArrowRight size={16} />
          </MagneticButton>
        </Card>
      </div>
    );
  };

  // Helper function to get tasks by *only* the specific type and platform
  const getTasks = (type: TaskType, platform: SocialPlatform) => {
    let allTasks: Task[] = [];
    switch (type) {
      case 'follow': allTasks = followTasks; break;
      case 'watch': allTasks = watchTasks; break;
      case 'post': allTasks = postTasks; break;
    }
    // CRITICAL: Filter by the type selected by the user AND the chosen platform
    return allTasks.filter(t => t.platform === platform && t.type === type);
  };
  
  // Platform Selector Modal (Updated to always show all 5 icons)
  const PlatformSelectorModal: React.FC<{ type: TaskType, onClose: () => void }> = ({ type, onClose }) => {
    const title = type === 'follow' ? 'Follow/Subscribe Tasks' : type === 'watch' ? 'Watch & Earn Videos' : 'Post & Share Tasks';
    const desc = `Select a platform to view available ${type} tasks. All platforms are shown, tasks depend on availability.`;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto p-8 relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-zinc-800 rounded-lg transition-all">
            <X size={20} />
          </button>

          <h2 className="text-3xl font-bold mb-3">{title}</h2>
          <p className="text-zinc-400 mb-8">{desc}</p>

          <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
            {allPlatforms.map(p => {
              const platformTasks = getTasks(type, p.platform); // Get actual tasks count for display
              const hasTasks = platformTasks.length > 0;
              
              return (
                <Card 
                  key={p.platform} 
                  className={`p-4 flex flex-col items-center text-center transition-all group hover:scale-[1.03] ${
                    hasTasks ? 'cursor-pointer' : 'cursor-default opacity-50'
                  }`}
                  onClick={() => {
                    // Do not check for hasTasks here; the user clicked on a platform
                    // We only want to ensure the task list later correctly filters.
                    // We must keep taskCategory state for the next step.
                    setSelectedPlatform(p.platform); 
                  }}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${p.color} group-hover:bg-amber-500/10`}>
                    {React.createElement(p.icon, { size: 24, className: p.color.includes('bg-white') ? 'text-black' : p.color })}
                  </div>
                  <p className="font-semibold text-white group-hover:text-amber-400 text-sm">{p.name}</p>
                  <span className="text-xs text-zinc-500 mt-1">{platformTasks.length} tasks</span>
                </Card>
              );
            })}
          </div>
          <div className="mt-8">
            <MagneticButton small onClick={onClose}>Close</MagneticButton>
          </div>
        </Card>
      </div>
    );
  };

  // Platform Specific Task Modal (Now uses both platform AND type for strict filtering)
  interface PlatformSpecificTaskModalProps { 
      platform: SocialPlatform; 
      type: TaskType; // Now explicitly required for filtering
      onClose: () => void; 
      onBack: () => void; // Added back button functionality
  }

  const PlatformSpecificTaskModal: React.FC<PlatformSpecificTaskModalProps> = ({ platform, type, onClose, onBack }) => {
    // CRITICAL FIX: Only get tasks matching BOTH the selected platform AND the initial task type
    const tasks = getTasks(type, platform);
    
    const platformInfo = allPlatforms.find(p => p.platform === platform) || {} as PlatformInfo;
    const Icon = platformInfo.icon;
    
    const isWatch = (task: Task) => task.type === 'watch';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto p-8 relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-zinc-800 rounded-lg transition-all">
            <X size={20} />
          </button>

          <button 
            onClick={onBack} 
            className="absolute top-6 left-6 p-2 text-zinc-400 hover:text-white flex items-center gap-1 transition-all"
          >
            <ArrowRight size={16} className="rotate-180" /> Back
          </button>

          <div className="text-center mt-4">
            <h2 className="text-3xl font-bold mb-1 flex items-center justify-center gap-3">
              {Icon && React.createElement(Icon, { size: 28, className: platformInfo.color.includes('bg-white') ? 'text-black' : platformInfo.color })}
              {platformInfo.name} - {type.toUpperCase()} Tasks
            </h2>
            <p className="text-zinc-400 mb-6">Complete the specific **{type}** tasks below to earn coins.</p>
          </div>

          <div className="space-y-4">
            {tasks.length > 0 ? tasks.map(task => (
              <Card key={task.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  {/* Thumbnail/Icon */}
                  {isWatch(task) && task.embedId ? (
                    <img
                      src={`https://placehold.co/128x80/27272a/FFF?text=Video+Link`}
                      alt={task.title}
                      className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      {task.type === 'follow' && <UserCircle size={24} className="text-amber-400" />}
                      {task.type === 'post' && <FileText size={24} className="text-amber-400" />}
                    </div>
                  )}
                  
                  {/* Task Description */}
                  <div>
                    <span className="text-xs font-bold uppercase text-zinc-500">{task.type}</span>
                    <p className="font-medium text-white">{task.desc}</p>
                    <p className="text-sm text-zinc-500">{task.username || task.duration || 'Link provided in modal'}</p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                  <span className="text-green-400 font-bold whitespace-nowrap order-first sm:order-last">+{task.coins} Coins</span>
                  
                  {/* Action Button - Watch/Open Link */}
                  {isWatch(task) ? (
                    <MagneticButton small onClick={() => setPlayingVideo(task)}>
                      Watch Video
                    </MagneticButton>
                  ) : (
                    <MagneticButton small onClick={() => console.log(`Opening link for ${task.title}...`)}>
                      Open Link
                    </MagneticButton>
                  )}

                  {/* Verification Button */}
                  <MagneticButton 
                    small 
                    onClick={() => { onClose(); setVerifyingTask(task); }} // Close task modal, open verification
                    className="!from-zinc-700 !to-zinc-600 text-white"
                  >
                    <span className="flex items-center gap-1">
                      <Send size={14} /> Verify
                    </span>
                  </MagneticButton>
                </div>
              </Card>
            )) : (
              <div className="text-center p-10 bg-zinc-800/50 rounded-xl border border-zinc-700">
                <p className="text-lg font-semibold text-zinc-400">No {type} tasks currently available for {platformInfo.name}.</p>
                <p className="text-sm text-zinc-500 mt-2">Check back later or try a different platform.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  // Combined Task Modals (Updated priority/state handling)
  const TaskModals: React.FC = () => {
    if (verifyingTask) {
      return <VerificationUploadModal task={verifyingTask} onClose={() => setVerifyingTask(null)} />;
    }
    
    if (playingVideo) {
      return <VideoPlayer task={playingVideo} onClose={() => setPlayingVideo(null)} />;
    }
    
    // Now requires both platform and category to be set for the specific task list
    if (selectedPlatform && taskCategory) {
      return <PlatformSpecificTaskModal 
        platform={selectedPlatform} 
        type={taskCategory}
        onClose={() => { setSelectedPlatform(null); setTaskCategory(null); }} 
        onBack={() => setSelectedPlatform(null)} // Go back to platform selection
      />;
    }

    if (taskCategory) {
      return <PlatformSelectorModal 
        type={taskCategory} 
        onClose={() => setTaskCategory(null)} 
      />;
    }
    
    return null;
  };
  
  // Task Verification Upload Modal (Updated to use Coins)
  interface VerificationUploadModalProps { task: Task; onClose: () => void; }
  const VerificationUploadModal: React.FC<VerificationUploadModalProps> = ({ task, onClose }) => {
    const taskTitle = task.title;
    const isFollowTask = task.type === 'follow';
    const taskDetails = isFollowTask 
      ? `${task.username} on ${task.platform.toUpperCase()}` 
      : `${task.platform.toUpperCase()} ${task.type.toUpperCase()}: ${task.title}`;

    const [screenshotFileName, setScreenshotFileName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setScreenshotFileName(file.name);
      } else {
        setScreenshotFileName('');
      }
      setSubmissionSuccess(false);
    };

    const handleSubmit = () => {
      if (!screenshotFileName) return;

      setIsSubmitting(true);
      setSubmissionSuccess(false);
      
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmissionSuccess(true);
      }, 1500);
    };

    const canSubmit = screenshotFileName && !isSubmitting && !submissionSuccess;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
        <Card className="w-full max-w-xl p-8 relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-zinc-800 rounded-lg transition-all">
            <X size={20} />
          </button>

          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <FileText size={20} className="text-amber-400" /> Submit Proof
          </h3>
          <p className="text-sm text-zinc-400 mb-6">
            Verification for: <span className="text-white font-medium">{taskTitle}</span> (+{task.coins} Coins)
          </p>

          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 mb-6">
              <p className="text-xs text-zinc-400 mb-1">Task Requirement:</p>
              <p className="font-semibold text-white">
                  {taskDetails}
              </p>
          </div>

          <div>
            <label htmlFor="screenshot-upload" className="block text-sm font-medium text-zinc-400 mb-2">
              Upload Proof Screenshot (.jpg, .png)
            </label>
            <input
              type="file"
              id="screenshot-upload"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              disabled={isSubmitting || submissionSuccess}
            />
            <label 
              htmlFor="screenshot-upload"
              className={`
                w-full flex items-center justify-between p-4 rounded-xl transition-all
                ${isSubmitting || submissionSuccess ? 'cursor-not-allowed' : 'cursor-pointer hover:border-amber-500/50'}
                ${submissionSuccess ? 'bg-green-900/30 border border-green-700' : 'bg-zinc-900 border border-zinc-800'}
              `}
            >
              <span className={submissionSuccess ? 'text-green-400' : 'text-zinc-500'}>
                {screenshotFileName || 'Click to select file...'}
              </span>
              <Upload size={20} className={submissionSuccess ? 'text-green-400' : 'text-zinc-500'} />
            </label>
            <p className="mt-2 text-xs text-zinc-500">
                Ensure the screenshot clearly shows your username and the completion status.
            </p>
          </div>

          <MagneticButton 
            onClick={handleSubmit} 
            disabled={!canSubmit} 
            className="w-full mt-8"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Clock size={16} className="animate-spin" /> Submitting...
              </span>
            ) : submissionSuccess ? (
              <span className="flex items-center justify-center gap-2">
                <Check size={16} /> Verification Sent
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Submit Proof <Send size={16} />
              </span>
            )}
          </MagneticButton>

          {submissionSuccess && (
            <div className="mt-4 p-3 text-center bg-green-900/20 border border-green-800 rounded-xl text-green-400 text-sm font-medium">
              Proof uploaded! You can now close this modal.
            </div>
          )}
        </Card>
      </div>
    );
  };

  // Video Player Modal (Updated to use Coins)
  interface VideoPlayerProps { task: Task; onClose: () => void; }
  const VideoPlayer: React.FC<VideoPlayerProps> = ({ task, onClose }) => {
    const [progress, setProgress] = useState(0);
    const isComplete = progress >= 100;

    useEffect(() => {
      if (isComplete) return;
      const timer = setInterval(() => {
        setProgress(p => {
          const next = Math.min(p + 1, 100);
          if (next === 100) {
            setCompleted(c => [...c, task.id]);
          }
          return next;
        });
      }, 300); // 30 seconds total simulation time
      return () => clearInterval(timer);
    }, [isComplete, task]);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-sm">
        <Card className="w-full max-w-4xl p-8 relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-zinc-800 rounded-lg">
            <X size={20} />
          </button>

          <h3 className="text-2xl font-bold mb-6">{task.title} ({task.platform.toUpperCase()} Video)</h3>

          <div className="aspect-video bg-zinc-900 rounded-xl mb-6 overflow-hidden">
            {/* Using a placeholder for non-YouTube videos (Instagram, TikTok) */}
            {task.platform === 'youtube' && task.embedId ? (
              <iframe
                src={`https://www.youtube.com/embed/${task.embedId}?autoplay=1&controls=0&mute=1`}
                className="w-full h-full"
                allow="autoplay"
                title={task.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                <p className="text-zinc-400 text-lg">
                  {task.platform.toUpperCase()} Player Placeholder
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Progress</span>
              <span className="text-2xl font-bold text-amber-400">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            {isComplete && (
              <div className="flex items-center justify-between font-medium">
                <p className="text-green-400 flex items-center gap-2">
                  <CheckCircle size={18} /> Watch Time Complete! (+{task.coins} Coins)
                </p>
                <MagneticButton 
                    small 
                    onClick={() => { onClose(); setVerifyingTask(task); }} 
                    className="!from-zinc-700 !to-zinc-600 text-white"
                  >
                    <span className="flex items-center gap-1">
                      <Send size={14} /> Submit Screenshot Proof
                    </span>
                </MagneticButton>
              </div>
            )}
            {!isComplete && (
                <p className="text-sm text-zinc-500">
                    Keep the video playing until progress reaches 100% to complete the task.
                </p>
            )}
          </div>
        </Card>
      </div>
    );
  };
  
  // Verification Modal (Unchanged)
  const VerificationModal: React.FC = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
      <Card className="w-full max-w-2xl p-8 relative">
        <h3 className="text-2xl font-bold mb-4">Start Identity Verification</h3>
        <p className="text-zinc-400 mb-6">Please provide the necessary documents for verification to unlock your earning potential.</p>
        <div className="space-y-4">
            <input type="text" placeholder="Full Legal Name" className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:border-amber-500 outline-none" />
            <input type="file" className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-400 focus:border-amber-500 outline-none" />
            <p className="text-xs text-zinc-500">Upload Government Issued ID (e.g., Aadhar, Passport)</p>
        </div>
        <MagneticButton onClick={() => { setIsApproved(true); setShowVerification(false); }} className="w-full">
            Submit for Review
        </MagneticButton>
        <button onClick={() => setShowVerification(false)} className="w-full mt-4 text-sm text-zinc-500 hover:text-white">Cancel</button>
      </Card>
    </div>
  );
  
  // Dashboard
  const Dashboard: React.FC = () => {
    const views: Record<DashboardView, { component: React.FC; title: string; desc: string; }> = {
      verification: { component: VerificationView, title: 'Profile Verification', desc: 'Complete your profile check to unlock earning tasks' },
      analytics: { component: AnalyticsView, title: 'Performance Analytics', desc: 'Overview of your earnings and activity' },
      profile: { component: ProfileEditor, title: 'Account Settings', desc: 'Manage your profile and social media links' },
      payout: { component: PayoutView, title: 'Legacy Payout', desc: 'This view is deprecated, please use Coin Exchange' },
      leaderboard: { component: LeaderboardView, title: 'Leaderboard', desc: 'Top performers in the SRK Portal' },
      content: { component: TasksView, title: 'Earning Tasks', desc: 'View and complete tasks to earn coins' },
      coinExchange: { component: CoinExchangeView, title: 'Coin Exchange', desc: 'Convert your coins to cash and request payout' },
    };

    const current = views[dashView];
    const ContentComponent = current.component;

    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8 lg:py-16">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <Card className="p-6 lg:sticky lg:top-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
                  <UserCircle size={20} className="text-amber-400" />
                  <span className="font-semibold">Console</span>
                </div>

                <div className="space-y-1 mb-6">
                  <TabButton view="verification" icon={Shield} label="Verification" />
                  <TabButton view="analytics" icon={TrendingUp} label="Analytics" />
                  <TabButton view="content" icon={ListChecks} label="Tasks" />
                  <TabButton view="leaderboard" icon={Award} label="Leaderboard" />
                  <TabButton view="coinExchange" icon={DollarSign} label="Coin Exchange" />
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <TabButton view="profile" icon={Settings} label="Profile" />
                  <TabButton view="payout" icon={Wallet} label="Legacy Payout" />
                </div>

                <button
                  onClick={() => setView('landing')}
                  className="mt-6 w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <ArrowRight size={18} className="rotate-180" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </Card>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-[#b68938] to-[#e1ba73] bg-clip-text text-transparent">
                  {current.title}
                </h1>
                <p className="text-zinc-400">{current.desc}</p>
              </div>

              <ContentComponent />
            </main>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      {view === 'landing' && <Landing />}
      {view === 'dashboard' && <Dashboard />}
      {showVerification && <VerificationModal />}
      
      {/* Task & Video Modals */}
      <TaskModals /> 
      
      {/* New Request Task Modal */}
      {showRequestModal && <RequestTaskModal onClose={() => setShowRequestModal(false)} />}
    </div>
  );
};

export default SRKPortal;