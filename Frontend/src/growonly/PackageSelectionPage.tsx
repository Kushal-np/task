// App.tsx
import React, { useState, useRef, useEffect, useCallback, useMemo,type ChangeEvent, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  TrendingUp,
  Users,
  Target,
  Zap,
  CheckCircle,
  Shield,
  Sparkles,
  Globe,
  BarChart3,
  ChevronRight,
  Package,
  ArrowLeft,
  Upload,
  Smartphone,
  Building,
  Loader2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Video,
  ThumbsUp,
  type
  LucideIcon,
} from "lucide-react";

// ============= CONSTANTS & TYPES =============
const GOLD_PRIMARY = '#b68938';
const GOLD_ACCENT = '#e1ba73';
const SUCCESS = '#10B981';
const INFO = '#3B82F6';

type SocialPlatform = 'youtube' | 'facebook' | 'instagram' | 'twitter' | 'tiktok';
type EngagementType = 'follow' | 'reach';
type PackageType = 'starter' | 'intermediate' | 'pro';

interface PackageDetails {
  id: PackageType;
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  features: string[];
  followerOptions: number[];
  reachOptions: {
    videos: number;
    likesPerVideo: number;
  }[];
  period: string;
  popular?: boolean;
}

interface UserDetails {
  name: string;
  email: string;
  phone: string;
  socialLink: string;
  platform: SocialPlatform;
  engagementType: EngagementType;
  selectedOption: number;
  packageType: PackageType;
  additionalInfo?: string;
}

interface CheckoutUserDetails extends Omit<UserDetails, 'phone'> {
  phone: string;
  password: string;
  confirmPassword: string;
  country: string;
  gender: string;
  promoCode: string;
}

interface StatusModalProps {
  status: { type: 'success' | 'error'; message?: string } | null;
  userName: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface StatusState {
  type: 'success' | 'error';
  message: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

interface PromoCodeOwner {
  name: string;
  discount: number;
}

interface OrderDetails {
  packageType: PackageType;
  platform: SocialPlatform;
  engagementType: EngagementType;
  selectedOption: number;
  amount: string;
  timestamp: string;
  transactionId: string;
  name: string;
  email: string;
  phone: string;
  socialLink: string;
}

const SOCIAL_COLORS: Record<SocialPlatform, string> = {
  youtube: '#FF0000',
  facebook: '#1877F2',
  instagram: '#E4405F',
  twitter: '#1DA1F2',
  tiktok: '#000000'
};

const PACKAGES_DATA: Record<PackageType, PackageDetails> = {
  starter: {
    id: 'starter',
    name: "Starter",
    price: "₹900",
    originalPrice: "₹1500",
    period: "one-time",
    description: "Perfect for testing the waters",
    features: [
      "500 Instagram Followers",
      "1,000 Post Likes",
      "100% Verified Accounts",
      "7-Day Delivery",
      "Basic Analytics",
    ],
    followerOptions: [200],
    reachOptions: [
      { videos: 1, likesPerVideo: 200 },
      { videos: 2, likesPerVideo: 100 },
      { videos: 4, likesPerVideo: 50 }
    ],
    popular: false,
  },
  intermediate: {
    id: 'intermediate',
    name: "Intermediate",
    price: "₹2,499",
    originalPrice: "₹3,999",
    period: "one-time",
    description: "Most popular for creators",
    features: [
      "2,000 Instagram Followers",
      "5,000 Post Likes",
      "100% Verified Accounts",
      "3-Day Delivery",
      "Advanced Analytics",
      "Priority Support",
    ],
    followerOptions: [500],
    reachOptions: [
      { videos: 1, likesPerVideo: 500 },
      { videos: 2, likesPerVideo: 250 },
      { videos: 4, likesPerVideo: 125 },
      { videos: 8, likesPerVideo: 63 }
    ],
    popular: true,
  },
  pro: {
    id: 'pro',
    name: "Pro",
    price: "₹4,999",
    originalPrice: "₹7,999",
    period: "one-time",
    description: "For serious influencers",
    features: [
      "5,000 Instagram Followers",
      "15,000 Post Likes",
      "100% Verified Accounts",
      "24-Hour Delivery",
      "Premium Analytics",
      "Dedicated Manager",
      "Custom Targeting",
    ],
    followerOptions: [700],
    reachOptions: [
      { videos: 1, likesPerVideo: 700 },
      { videos: 2, likesPerVideo: 350 },
      { videos: 4, likesPerVideo: 175 },
      { videos: 8, likesPerVideo: 88 },
      { videos: 12, likesPerVideo: 58 }
    ],
    popular: false,
  },
};

// ============= UTILITY COMPONENTS =============

// Magnetic Button Component
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className = "", onClick = () => {} }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
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
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={`relative px-8 py-4 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black font-bold text-sm uppercase tracking-widest transition-all hover:shadow-[0_0_40px_rgba(182,137,56,0.7)] active:scale-95 flex items-center gap-2 overflow-hidden group ${className}`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "100%" : "-100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// Spotlight Card Component
interface SpotlightCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({ children, delay = 0, className = "" }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      onMouseMove={handleMouseMove as any}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.1s ease-out",
      }}
      className={`relative backdrop-blur-md rounded-3xl border border-[rgba(182,137,56,0.2)] bg-[rgba(26,20,16,0.4)] hover:border-[rgba(182,137,56,0.4)] transition-all duration-300 ${className}`}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#b68938]/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      {children}
    </motion.div>
  );
};

// ============= SOCIAL PLATFORM SELECTION COMPONENTS =============

interface IconProps {
  className?: string;
}

const YoutubeIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
  </svg>
);

const FacebookIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
  </svg>
);

const InstagramIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const TwitterIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
  </svg>
);

const TikTokIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const StatusModal: React.FC<StatusModalProps> = ({ status, userName, onClose, onSuccess }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      if (status?.type === "success") {
        onSuccess();
      } else {
        onClose();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick as any}
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className={`max-w-md w-full rounded-3xl p-8 relative overflow-hidden ${
          status?.type === "success"
            ? "bg-gradient-to-br from-green-900/30 to-emerald-900/30"
            : "bg-gradient-to-br from-red-900/30 to-rose-900/30"
        } border ${
          status?.type === "success"
            ? "border-green-500/30"
            : "border-red-500/30"
        } backdrop-blur-xl`}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
              status?.type === "success"
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : "bg-gradient-to-r from-red-500 to-rose-500"
            }`}
          >
            {status?.type === "success" ? (
              <CheckCircle size={40} className="text-white" />
            ) : (
              <X size={40} className="text-white" />
            )}
          </motion.div>

          <h2 className="text-3xl font-bold mb-4">
            {status?.type === "success" ? "Request Received!" : "Payment Failed"}
          </h2>

          <p className="text-gray-300 mb-8 leading-relaxed">
            {status?.type === "success"
              ? `Dear ${userName}, your payment request has been submitted successfully. You'll receive dashboard access after system verification.`
              : "There was an issue processing your payment. Please try again or contact support."}
          </p>

          <div className="flex gap-4 justify-center">
            {status?.type === "error" && (
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold text-sm uppercase tracking-widest transition-all"
              >
                Try Again
              </button>
            )}
            <button
              onClick={() => {
                if (status?.type === "success") {
                  onSuccess();
                } else {
                  onClose();
                }
              }}
              className={`px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all ${
                status?.type === "success"
                  ? "bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black hover:shadow-[0_0_30px_rgba(182,137,56,0.5)]"
                  : "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
              }`}
            >
              {status?.type === "success" ? "Continue" : "Back to Packages"}
            </button>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Click anywhere outside this box to {status?.type === "success" ? "continue" : "close"}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface SocialPlatformCardProps {
  platform: SocialPlatform;
  selected: boolean;
  onClick: () => void;
}


;
const SocialPlatformCard: React.FC<SocialPlatformCardProps> = ({ platform, selected, onClick }) => {
  const getPlatformLabel = () => {
    switch (platform) {
      case 'youtube': return 'YouTube';
      case 'facebook': return 'Facebook';
      case 'instagram': return 'Instagram';
      case 'twitter': return 'Twitter';
      case 'tiktok': return 'TikTok';
      default: return platform;
    }
  };

  const color = SOCIAL_COLORS[platform];
  const label = getPlatformLabel();

  // Define the icon component based on platform
  const PlatformIcon = () => {
    switch (platform) {
      case 'youtube': return <YoutubeIcon className="w-8 h-8"  />;
      case 'facebook': return <FacebookIcon className="w-8 h-8"  />;
      case 'instagram': return <InstagramIcon className="w-8 h-8"  />;
      case 'twitter': return <TwitterIcon className="w-8 h-8"  />;
      case 'tiktok': return <TikTokIcon className="w-8 h-8"  />;
      default: return <YoutubeIcon className="w-8 h-8"  />;
    }
  };

  return (
    <motion.div
      className={`
        relative p-6 rounded-2xl cursor-pointer
        transition-all duration-300
        ${selected ? 'ring-2 ring-offset-2 ring-offset-[#0a0705]' : ''}
      `}
      style={{
        background: 'rgba(20, 17, 14, 0.8)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${selected ? color : 'rgba(182, 137, 56, 0.2)'}`,
        boxShadow: selected ? `0 0 30px ${color}40` : '0 4px 20px rgba(0, 0, 0, 0.2)',
      }}
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${color}20, ${color}40)`,
            border: `2px solid ${color}30`,
          }}
        >
          <PlatformIcon />
        </div>
        
        <div className="text-center">
          <h3 className="font-bold text-lg text-white">{label}</h3>
          <p className="text-sm text-gray-400 mt-1">Select this platform</p>
        </div>
        
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: color }}
          >
            <CheckCircle size={16} className="text-white" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

interface EngagementOptionProps {
  type: 'follow' | 'reach';
  selected: boolean;
  onClick: () => void;
  packageData: PackageDetails;
}

const EngagementOption: React.FC<EngagementOptionProps> = ({ type, selected, onClick, packageData }) => {
  const isFollow = type === 'follow';
  
  return (
    <motion.div
      className={`
        relative p-8 rounded-2xl cursor-pointer overflow-hidden
        transition-all duration-300
        ${selected ? 'ring-2 ring-offset-2 ring-offset-[#0a0705]' : ''}
      `}
      style={{
        background: isFollow 
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))'
          : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${isFollow ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
        boxShadow: selected ? `0 0 40px ${isFollow ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)'}` : 'none',
      }}
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isFollow ? 'bg-emerald-500/20' : 'bg-blue-500/20'}`}>
              {isFollow ? (
                <Users size={24} className={isFollow ? 'text-emerald-400' : 'text-blue-400'} />
              ) : (
                <Video size={24} className={isFollow ? 'text-emerald-400' : 'text-blue-400'} />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {isFollow ? 'Follow/Subscribe' : 'Reach & Engagement'}
              </h3>
              <p className="text-sm text-gray-400">
                {isFollow ? 'Grow your follower base' : 'Increase post engagement'}
              </p>
            </div>
          </div>
          
          {selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${isFollow ? 'bg-emerald-500' : 'bg-blue-500'}`}
            >
              <CheckCircle size={16} className="text-white" />
            </motion.div>
          )}
        </div>
        
        <div className="space-y-4">
          {isFollow ? (
            <div>
              <p className="text-gray-300 mb-3">Get followers/subscribers for your profile:</p>
              <div className="grid grid-cols-1 gap-3">
                {packageData.followerOptions.map((count, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Users size={20} className="text-emerald-400" />
                        <span className="text-white font-medium">{count} Followers</span>
                      </div>
                      <span className="text-emerald-400 font-bold">{packageData.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-300 mb-3">Get likes for your posts/videos:</p>
              <div className="grid grid-cols-1 gap-3">
                {packageData.reachOptions.map((option, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <ThumbsUp size={20} className="text-blue-400" />
                        <div>
                          <span className="text-white font-medium">{option.videos} Video{option.videos > 1 ? 's' : ''}</span>
                          <span className="text-gray-400 text-sm ml-2">
                            ({option.likesPerVideo} likes per video)
                          </span>
                        </div>
                      </div>
                      <span className="text-blue-400 font-bold">
                        Total: {option.videos * option.likesPerVideo} likes
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{
            background: isFollow 
              ? `linear-gradient(90deg, #10B981, #10B98180)`
              : `linear-gradient(90deg, #3B82F6, #3B82F680)`,
          }}
          initial={{ width: selected ? '100%' : '0%' }}
          animate={{ width: selected ? '100%' : '0%' }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

interface SelectionOptionProps {
  option: { videos?: number; likesPerVideo?: number; followers?: number };
  type: 'follow' | 'reach';
  index: number;
  selected: boolean;
  onClick: () => void;
  packageData: PackageDetails;
}

const SelectionOption: React.FC<SelectionOptionProps> = ({ option, type, index, selected, onClick, packageData }) => {
  const isFollow = type === 'follow';
  
  return (
    <motion.div
      className={`
        relative p-6 rounded-xl cursor-pointer transition-all duration-300
        ${selected ? 'ring-2' : 'hover:bg-white/5'}
      `}
      style={{
        background: selected 
          ? (isFollow ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)')
          : 'rgba(255, 255, 255, 0.03)',
        border: `1px solid ${selected 
          ? (isFollow ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.4)')
          : 'rgba(182, 137, 56, 0.2)'}`,
        boxShadow: selected 
          ? (isFollow 
              ? '0 0 20px rgba(16, 185, 129, 0.2)' 
              : '0 0 20px rgba(59, 130, 246, 0.2)')
          : 'none',
        backdropFilter: 'blur(10px)',
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isFollow ? 'bg-emerald-500/20' : 'bg-blue-500/20'}`}>
            {isFollow ? (
              <Users size={20} className={isFollow ? 'text-emerald-400' : 'text-blue-400'} />
            ) : (
              <Video size={20} className={isFollow ? 'text-emerald-400' : 'text-blue-400'} />
            )}
          </div>
          
          <div>
            {isFollow ? (
              <div>
                <h4 className="text-lg font-bold text-white">{option.followers} Followers</h4>
                <p className="text-sm text-gray-400">One-time growth for your profile</p>
              </div>
            ) : (
              <div>
                <h4 className="text-lg font-bold text-white">
                  {option.videos} Video{option.videos && option.videos > 1 ? 's' : ''}
                </h4>
                <p className="text-sm text-gray-400">
                  {option.likesPerVideo} likes per video • Total: {(option.videos || 0) * (option.likesPerVideo || 0)} likes
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-xl font-bold ${isFollow ? 'text-emerald-400' : 'text-blue-400'}`}>
            {packageData.price}
          </div>
          <div className="text-sm text-gray-500">one-time</div>
        </div>
      </div>
      
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: isFollow ? '#10B981' : '#3B82F6' }}
        >
          <CheckCircle size={12} className="text-white" />
        </motion.div>
      )}
    </motion.div>
  );
};

// ============= PACKAGE SELECTION FLOW =============

interface PackageSelectionFlowProps {
  selectedPackage: PackageDetails;
  onComplete: (userDetails: UserDetails) => void;
  onBack: () => void;
}

const PackageSelectionFlow: React.FC<PackageSelectionFlowProps> = ({ 
  selectedPackage, 
  onComplete,
  onBack 
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
  const [engagementType, setEngagementType] = useState<EngagementType | null>(null);
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [userDetails, setUserDetails] = useState<CheckoutUserDetails>({
    name: '',
    email: '',
    password: '' , 
    confirmPassword: '',
    country: '',
    gender: '',
    promoCode: '',
    phone: '',
    socialLink: '',
    platform: selectedPlatform as SocialPlatform,
    engagementType: engagementType as EngagementType,
    selectedOption: 0,
    packageType: selectedPackage.id,
    additionalInfo: ''
  });

  const socialPlatforms: SocialPlatform[] = ['youtube', 'facebook', 'instagram', 'twitter', 'tiktok'];

  const handlePlatformSelect = (platform: SocialPlatform) => {
    setSelectedPlatform(platform);
    setStep(2);
  };

  const handleEngagementSelect = (type: EngagementType) => {
    setEngagementType(type);
    setStep(3);
  };

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    setStep(4);
  };

  const handleUserDetailsChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!selectedPlatform || !engagementType || !userDetails.name || !userDetails.email || !userDetails.phone) {
      alert('Please fill in all required fields');
      return;
    }

    const finalDetails: UserDetails = {
      name: userDetails.name,
      email: userDetails.email,
      phone: userDetails.phone,
      platform: selectedPlatform,
      engagementType,
      selectedOption,
      packageType: selectedPackage.id,
      socialLink: userDetails.socialLink || `https://${selectedPlatform}.com/your-profile`,
      additionalInfo: userDetails.additionalInfo
    };

    onComplete(finalDetails);
  };

  const getSelectedOptionDetails = () => {
    if (engagementType === 'follow') {
      return {
        followers: selectedPackage.followerOptions[selectedOption],
        description: `${selectedPackage.followerOptions[selectedOption]} followers/subscribers`
      };
    } else {
      const option = selectedPackage.reachOptions[selectedOption];
      return {
        videos: option.videos,
        likesPerVideo: option.likesPerVideo,
        totalLikes: option.videos * option.likesPerVideo,
        description: `${option.videos} video${option.videos > 1 ? 's' : ''} with ${option.likesPerVideo} likes each (Total: ${option.videos * option.likesPerVideo} likes)`
      };
    }
  };

  const optionDetails = getSelectedOptionDetails();

  return (
    <div className="min-h-screen bg-black text-white pt-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-[#b68938] transition-colors mb-6 group"
          >
            <ArrowLeft size={20} />
            <span className="font-bold text-sm uppercase tracking-widest">
              Back to Packages
            </span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{selectedPackage.name} Package</h1>
              <p className="text-gray-400 mt-2">{selectedPackage.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#b68938]">
                {selectedPackage.price}
              </div>
              <div className="text-sm text-gray-500">one-time payment</div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold
                    ${step >= stepNum 
                      ? 'bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black' 
                      : 'bg-white/5 text-gray-400'}
                  `}
                >
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div
                    className={`
                      w-16 md:w-24 h-1 mx-2
                      ${step > stepNum 
                        ? 'bg-gradient-to-r from-[#b68938] to-[#e1ba73]' 
                        : 'bg-white/10'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-sm text-gray-400">
            <span className={step >= 1 ? 'text-white' : ''}>Choose Platform</span>
            <span className={step >= 2 ? 'text-white' : ''}>Select Type</span>
            <span className={step >= 3 ? 'text-white' : ''}>Choose Option</span>
            <span className={step >= 4 ? 'text-white' : ''}>Your Details</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-8">
          {/* Step 1: Platform Selection */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-3">Choose Your Social Platform</h2>
                <p className="text-gray-400">
                  Select the platform where you want to grow your presence. Only one platform can be selected.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {socialPlatforms.map((platform) => (
                  <SocialPlatformCard
                    key={platform}
                    platform={platform}
                    selected={selectedPlatform === platform}
                    onClick={() => handlePlatformSelect(platform)}
                  />
                ))}
              </div>
              
              <div className="text-center text-sm text-gray-500 mt-8">
                <p>Only one social media platform can be selected per order.</p>
                <p>All processes will be handled specifically for the chosen platform.</p>
              </div>
            </motion.div>
          )}

          {/* Step 2: Engagement Type Selection */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-3">Choose Engagement Type</h2>
                <p className="text-gray-400">
                  Select how you want to grow on 
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EngagementOption
                  type="follow"
                  selected={engagementType === 'follow'}
                  onClick={() => handleEngagementSelect('follow')}
                  packageData={selectedPackage}
                />
                <EngagementOption
                  type="reach"
                  selected={engagementType === 'reach'}
                  onClick={() => handleEngagementSelect('reach')}
                  packageData={selectedPackage}
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: Option Selection */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-3">
                  Select Your {engagementType === 'follow' ? 'Follower' : 'Reach'} Option
                </h2>
                <p className="text-gray-400">
                  Choose the specific package option that fits your needs
                </p>
              </div>
              
              <div className="space-y-4">
                {engagementType === 'follow' ? (
                  selectedPackage.followerOptions.map((followers, index) => (
                    <SelectionOption
                      key={index}
                      option={{ followers }}
                      type="follow"
                      index={index}
                      selected={selectedOption === index}
                      onClick={() => handleOptionSelect(index)}
                      packageData={selectedPackage}
                    />
                  ))
                ) : (
                  selectedPackage.reachOptions.map((option, index) => (
                    <SelectionOption
                      key={index}
                      option={option}
                      type="reach"
                      index={index}
                      selected={selectedOption === index}
                      onClick={() => handleOptionSelect(index)}
                      packageData={selectedPackage}
                    />
                  ))
                )}
              </div>
              
              <div className="text-center text-sm text-gray-500 mt-8">
                <p>All likes/views will be delivered from verified, real accounts.</p>
                <p>Delivery time: {selectedPackage.id === 'starter' ? '7 days' : selectedPackage.id === 'intermediate' ? '3 days' : '24 hours'}</p>
              </div>
            </motion.div>
          )}

          {/* Step 4: User Details */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-3">Your Details</h2>
                <p className="text-gray-400">
                  Please provide your details to proceed with the order
                </p>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="backdrop-blur-md rounded-3xl border border-[rgba(182,137,56,0.2)] bg-[rgba(26,20,16,0.4)] p-6 sticky top-32"
                  >
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2">Order Summary</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-white/10">
                        <span className="text-gray-400">Package</span>
                        <span className="font-bold text-white">{selectedPackage.name}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/10">
                        <span className="text-gray-400">Platform</span>
                        <span className="font-bold text-white capitalize">{selectedPlatform}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/10">
                        <span className="text-gray-400">Type</span>
                        <span className="font-bold text-white">
                          {engagementType === 'follow' ? 'Follow/Subscribe' : 'Reach & Engagement'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/10">
                        <span className="text-gray-400">Option</span>
                        <span className="font-bold text-white text-right">{optionDetails.description}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/10">
                        <span className="text-gray-400">Price</span>
                        <span className="text-2xl font-bold text-[#b68938]">
                          {selectedPackage.price}
                        </span>
                      </div>
                    </div>

                    {selectedPackage.originalPrice && (
                      <div className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-[#b68938]/20 to-[#e1ba73]/20 border border-[#b68938]/30 text-center">
                        <span className="text-[#e1ba73] font-bold text-sm">
                          Save {selectedPackage.originalPrice}
                        </span>
                      </div>
                    )}
                  </motion.div>
                </div>
                
                {/* User Details Form */}
                <div className="lg:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-xl rounded-3xl border border-[#b68938]/30 p-8"
                    style={{ background: "rgba(26, 20, 16, 0.6)" }}
                  >
                    <h2 className="text-3xl font-bold mb-2">Personal Information</h2>
                    <p className="text-gray-400 mb-8">
                      Please provide your details to proceed with the purchase.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={userDetails.name}
                          onChange={handleUserDetailsChange}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#b68938] focus:ring-1 focus:ring-[#b68938] transition-all"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={userDetails.email}
                          onChange={handleUserDetailsChange}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#b68938] focus:ring-1 focus:ring-[#b68938] transition-all"
                          placeholder="you@example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                          Password *
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={userDetails.password}
                          onChange={handleUserDetailsChange}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#b68938] focus:ring-1 focus:ring-[#b68938] transition-all"
                          placeholder="Create a strong password"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                          Confirm Password *
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={userDetails.confirmPassword}
                          onChange={handleUserDetailsChange}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#b68938] focus:ring-1 focus:ring-[#b68938] transition-all"
                          placeholder="Confirm your password"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={userDetails.phone}
                          onChange={handleUserDetailsChange}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#b68938] focus:ring-1 focus:ring-[#b68938] transition-all"
                          placeholder="+91 9876543210"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                          Country *
                        </label>
                        <select
                          name="country"
                          value={userDetails.country}
                          onChange={handleUserDetailsChange}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#b68938] focus:ring-1 focus:ring-[#b68938] transition-all appearance-none cursor-pointer"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23b68938' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: "right 0.5rem center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "1.5em 1.5em",
                            paddingRight: "2.5rem"
                          }}
                        >
                          <option value="" className="bg-[#1a1410] text-white">
                            Select your country
                          </option>
                          <option value="Nepal" className="bg-[#1a1410] text-white">
                            Nepal
                          </option>
                          <option value="India" className="bg-[#1a1410] text-white">
                            India
                          </option>
                          <option value="Bangladesh" className="bg-[#1a1410] text-white">
                            Bangladesh
                          </option>
                          <option value="Sri Lanka" className="bg-[#1a1410] text-white">
                            Sri Lanka
                          </option>
                          <option value="Other" className="bg-[#1a1410] text-white">
                            Other
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={userDetails.gender}
                          onChange={handleUserDetailsChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#b68938] focus:ring-1 focus:ring-[#b68938] transition-all appearance-none cursor-pointer"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23b68938' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: "right 0.5rem center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "1.5em 1.5em",
                            paddingRight: "2.5rem"
                          }}
                        >
                          <option value="" className="bg-[#1a1410] text-white">
                            Select gender
                          </option>
                          <option value="male" className="bg-[#1a1410] text-white">
                            Male
                          </option>
                          <option value="female" className="bg-[#1a1410] text-white">
                            Female
                          </option>
                          <option value="other" className="bg-[#1a1410] text-white">
                            Other
                          </option>
                          <option value="prefer-not-to-say" className="bg-[#1a1410] text-white">
                            Prefer not to say
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                        </label>
                        <input
                          type="url"
                          name="socialLink"
                          value={userDetails.socialLink}
                          onChange={handleUserDetailsChange}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#b68938] focus:ring-1 focus:ring-[#b68938] transition-all"
                          placeholder={`https://${selectedPlatform}.com/your-username`}
                        />
                      </div>
                    </div>


                    {/* Terms & Conditions */}
                    <div className="mb-8">
                      <label className="flex items-start space-x-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          required
                          className="w-5 h-5 rounded bg-white/5 border border-white/10 focus:ring-[#b68938] focus:ring-2 focus:ring-offset-2 focus:ring-offset-black text-[#b68938] transition-all"
                        />
                        <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                          I agree to the Terms & Conditions and Privacy Policy. I understand that all engagements come from verified SRK University students and the delivery time is {selectedPackage.id === 'starter' ? '7 days' : selectedPackage.id === 'intermediate' ? '3 days' : '24 hours'}.
                        </span>
                      </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-6 border-t border-white/10">
                      <button
                        onClick={() => setStep(3)}
                        className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold text-sm uppercase tracking-widest transition-all"
                      >
                        Back
                      </button>
                      
                      <button
                        onClick={handleSubmit}
                        className="px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black hover:shadow-[0_0_30px_rgba(182,137,56,0.5)] hover:scale-105 active:scale-95"
                      >
                        Complete Order for {selectedPackage.price}
                      </button>
                    </div>

                    {/* Secure Payment Note */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Shield size={16} className="text-[#b68938]" />
                        <span>Your information is secured with 256-bit SSL encryption</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============= EXISTING COMPONENTS (KEEPING ORIGINAL) =============

// Navbar Component
const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 w-full flex justify-center z-[100] pointer-events-none">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-auto relative flex items-center justify-between px-6 py-4 md:px-10"
          style={{
            width: "900px",
            borderRadius: "50px",
            backgroundColor: "rgba(26, 20, 16, 0.8)",
            backdropFilter: "blur(20px)",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "rgba(182, 137, 56, 0.3)",
            maxWidth: "95vw",
            marginTop: "24px",
          }}
        >
          <div className="relative z-10 flex items-center shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] flex items-center justify-center shadow-[0_0_15px_rgba(182,137,56,0.3)]">
              <span className="font-bold text-black text-xl">S</span>
            </div>

            <div className="overflow-hidden whitespace-nowrap flex items-center">
              <span className="font-bold text-white text-xl tracking-wide ml-3">
                SRK<span className="text-[#b68938]">Grow</span>
              </span>
            </div>
          </div>

          <div className="relative z-10 hidden md:flex items-center gap-10">
            {["Packages", "Flow", "Benefits", "FAQ"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-semibold text-gray-400 hover:text-[#b68938] transition-colors relative group tracking-wider uppercase"
              >
                {item}
                <span className="absolute -bottom-1 left-1/2 w-0 h-[2px] bg-[#e1ba73] transition-all duration-300 group-hover:w-full group-hover:left-0" />
              </a>
            ))}
          </div>

          <div className="relative z-10 flex items-center gap-4 shrink-0">
            <button className="hidden md:block px-6 py-2.5 rounded-full bg-white/5 hover:bg-[#b68938]/10 text-[#b68938] border border-[#b68938]/30 font-bold text-xs uppercase tracking-widest transition-all hover:scale-105">
              Get Started
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-1"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </motion.nav>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-[#0a0705]/98 backdrop-blur-3xl md:hidden pt-32 px-8 flex flex-col gap-8"
          >
            {["Packages", "Flow", "Benefits", "FAQ"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-bold text-white hover:text-[#b68938] transition-colors border-b border-white/5 pb-4"
              >
                {item}
              </a>
            ))}
            <button className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black font-bold text-lg mt-4">
              Get Started
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Hero Section
const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-[#1a1410] to-black" />

      <motion.div
        className="absolute top-20 left-1/4 w-96 h-96 bg-[#b68938]/20 rounded-full blur-[128px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#e1ba73]/20 rounded-full blur-[128px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="absolute inset-0 z-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(182, 137, 56, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(182, 137, 56, 0.1) 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        />

        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#b68938] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-xl border mb-8 relative group overflow-hidden"
          style={{
            background: "rgba(26, 20, 16, 0.4)",
            borderColor: "rgba(182, 137, 56, 0.3)",
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#b68938]/20 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <TrendingUp className="w-4 h-4 text-[#e1ba73] animate-pulse" />
          <span className="text-sm font-medium bg-gradient-to-r from-[#b68938] to-[#e1ba73] bg-clip-text text-transparent relative z-10">
            Growth Made Simple
          </span>
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-bold leading-none tracking-tight mb-8">
          <motion.span
            className="block mb-2 bg-gradient-to-r from-white via-[#b68938] to-white bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Amplify Your
          </motion.span>
          <motion.span
            className="block bg-gradient-to-r from-[#b68938] via-[#e1ba73] to-[#b68938] bg-clip-text text-transparent animate-gradient-slow"
            style={{ backgroundSize: "200% 100%" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Social Reach
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12"
        >
          The bridge between{" "}
          <span className="text-[#e1ba73] font-bold">SRK University</span> and{" "}
          <span className="text-[#e1ba73] font-bold">SRK Task</span>. Choose
          your growth package, unlock verified engagement, and watch your
          influence expand exponentially.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a href="#packages">
            <MagneticButton>
              Select Your Package <ArrowRight size={20} className="ml-2" />
            </MagneticButton>
          </a>
          <motion.button
            className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold text-sm uppercase tracking-widest transition-all relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">See How It Works</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-12 pt-16 flex-wrap"
        >
          {[
            { label: "Active Users", value: "50K+" },
            { label: "Engagements", value: "10M+" },
            { label: "Real Accounts", value: "99.9%" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + i * 0.1 }}
            >
              <motion.div
                className="text-4xl font-bold text-[#b68938] mb-2"
                whileHover={{ scale: 1.1 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Flow Section
const FlowSection: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "SRK University",
      subtitle: "Verified Students",
      description:
        "Students register through the official SRK University portal with complete KYC verification.",
      icon: Shield,
      color: "from-blue-500 to-blue-600",
    },
    {
      number: "02",
      title: "SRK Grow",
      subtitle: "Package Selection",
      description:
        "You choose your growth package based on your needs - followers, likes, engagement, or comprehensive plans.",
      icon: Package,
      color: "from-[#b68938] to-[#e1ba73]",
      highlight: true,
    },
    {
      number: "03",
      title: "SRK Task",
      subtitle: "Task Distribution",
      description:
        "Your selected package automatically generates verified tasks distributed to active SRK Task users.",
      icon: Target,
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <section
      id="flow"
      className="py-32 px-6 bg-[#0a0705] relative overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(182, 137, 56, 0.5) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        animate={{ backgroundPosition: ["0px 0px", "24px 24px"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-5 px-5 py-2 rounded-full border border-[#e1ba73]/30 bg-[#1a1410]/50 backdrop-blur-sm relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#b68938]/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-bold text-[#b68938] tracking-widest uppercase relative z-10">
              The Ecosystem
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            How{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b68938] to-[#e1ba73]">
              It Works
            </span>
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">
            A seamless three-step ecosystem connecting verified users, growth
            packages, and authentic engagement.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 z-0 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-[#b68938] to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {steps.map((step, i) => (
            <SpotlightCard
              key={i}
              delay={i * 0.2}
              className={`relative z-10 group ${
                step.highlight ? "ring-2 ring-[#b68938]/50" : ""
              }`}
            >
              <div className="p-8 relative">
                <div className="flex items-center justify-between mb-6">
                  <motion.span
                    className="text-6xl font-bold text-white/5"
                    whileHover={{
                      scale: 1.1,
                      color: "rgba(182, 137, 56, 0.1)",
                    }}
                  >
                    {step.number}
                  </motion.span>
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <step.icon size={32} className="text-white" />
                  </motion.div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#b68938] transition-colors">
                  {step.title}
                </h3>
                <div className="text-[#b68938] font-bold text-sm uppercase tracking-wider mb-4">
                  {step.subtitle}
                </div>
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>

                {step.highlight && (
                  <motion.div
                    className="mt-6 px-4 py-2 rounded-lg bg-[#b68938]/10 border border-[#b68938]/30 relative overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-[#b68938]/20 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="flex items-center gap-2 text-[#b68938] text-sm font-bold relative z-10">
                      <Sparkles size={16} />
                      <span>You Are Here</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// Checkout Page Component (Simplified - Direct Payment)
interface CheckoutPageProps {
  selectedPackage: PackageDetails;
  userDetails: UserDetails;
  onBack: () => void;
  onComplete: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ selectedPackage: pkg, userDetails, onBack, onComplete }) => {
  const [formData, setFormData] = useState({
    name: userDetails.name,
    email: userDetails.email,
    phone: userDetails.phone,
    promocode: "",
    country: "",
    paymentMethod: "",
    transactionId: "",
  });
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(pkg?.price || "₹0");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [status, setStatus] = useState<StatusState | null>(null);
  const [userName, setUserName] = useState(userDetails.name.split(" ")[0] || "User");
  const [promoOwner, setPromoOwner] = useState("");

  const paymentMethods: PaymentMethod[] = [
    { id: "esewa", name: "eSewa", icon: Smartphone, color: "#5D3FD3" },
    { id: "khalti", name: "Khalti", icon: Smartphone, color: "#5C2D91" },
    {
      id: "mobile_banking",
      name: "Mobile Banking",
      icon: Smartphone,
      color: "#0D9488",
    },
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      icon: Building,
      color: "#0891B2",
    },
  ];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyPromo = () => {
    if (formData.promocode.trim() === "") {
      return;
    }
    
    const promoCode = formData.promocode.trim().toLowerCase();
    
    if (promoCode === "ram25" || promoCode === "rambahadur") {
      setPromoApplied(true);
      setDiscount(25);
      setPromoOwner("Ram Bahadur");
      
      const numericPrice = parseInt(pkg.price.replace(/[^0-9]/g, ""));
      const discountedPrice = numericPrice * 0.75;
      setFinalPrice(`₹${discountedPrice.toFixed(0)}`);
      
      setStatus({
        type: "success",
        message: `Promo code applied! 25% discount from ${promoOwner}`,
      });
      setTimeout(() => {
        setStatus(null);
      }, 3000);
    } else {
      setStatus({
        type: "error",
        message: "Invalid promo code",
      });
      setTimeout(() => {
        setStatus(null);
      }, 3000);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentProof(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.paymentMethod || !paymentProof) {
      setStatus({
        type: "error",
        message: "Please select payment method and upload proof",
      });
      setTimeout(() => setStatus(null), 3000);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const isSuccess = Math.random() > 0.2;
    
    setIsSubmitting(false);
    
    if (isSuccess) {
      setStatus({
        type: "success",
        message: "Payment submitted successfully!",
      });
      setTimeout(() => {
        setShowStatusModal(true);
      }, 1000);
    } else {
      setStatus({
        type: "error",
        message: "Payment failed. Please try again.",
      });
      setTimeout(() => {
        setShowStatusModal(true);
      }, 1000);
    }
  };

  const handleStatusModalClose = () => {
    setShowStatusModal(false);
  };

  const handleStatusModalSuccess = () => {
    onComplete(); // Trigger the completion callback
  };

  return (
    <div className="min-h-screen bg-black text-white pt-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-[#b68938] transition-colors group"
          >
            <ArrowLeft size={20} />
            <span className="font-bold text-sm uppercase tracking-widest">
              Back to Package Selection
            </span>
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black font-bold">
                1
              </div>
              <div className="w-16 h-1 mx-2 bg-gradient-to-r from-[#b68938] to-[#e1ba73]" />
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-gray-500 font-bold">
                2
              </div>
            </div>
            <span className="text-sm text-gray-400 font-bold uppercase tracking-widest">
              Complete Payment
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-md rounded-3xl border border-[rgba(182,137,56,0.2)] bg-[rgba(26,20,16,0.4)] p-6 sticky top-32"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {pkg.name} Package
                </h3>
                <p className="text-gray-500 text-sm">
                  {pkg.description}
                </p>
              </div>

              <div className="mb-8">
                {promoApplied ? (
                  <>
                    <div className="text-4xl font-bold text-[#b68938] mb-2">
                      {finalPrice}
                      <span className="text-lg text-gray-500 line-through ml-2">
                        {pkg.price}
                      </span>
                    </div>
                    <div className="text-green-400 text-sm font-bold">
                      You saved {discount}% with promo code!
                    </div>
                  </>
                ) : (
                  <div className="text-4xl font-bold text-[#b68938] mb-2">
                    {pkg.price}
                  </div>
                )}
                <div className="text-gray-500">{pkg.period}</div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-400">Platform:</span>
                  <span className="font-bold text-white capitalize">
                    {userDetails.platform}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-400">Type:</span>
                  <span className="font-bold text-white">
                    {userDetails.engagementType === 'follow' ? 'Follow/Subscribe' : 'Reach & Engagement'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-400">Option:</span>
                  <span className="font-bold text-white text-right">
                    {userDetails.engagementType === 'follow' 
                      ? `${pkg.followerOptions[userDetails.selectedOption]} followers`
                      : `${pkg.reachOptions[userDetails.selectedOption].videos} videos with ${pkg.reachOptions[userDetails.selectedOption].likesPerVideo} likes each`
                    }
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="font-bold text-white">Features:</h4>
                {pkg.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle
                      size={18}
                      className="text-[#b68938] shrink-0"
                    />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {pkg.popular && (
                <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#b68938]/20 to-[#e1ba73]/20 border border-[#b68938]/30 text-center">
                  <span className="text-[#e1ba73] font-bold text-sm">
                    Most Popular Choice
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl rounded-3xl border border-[#b68938]/30 p-8"
              style={{ background: "rgba(26, 20, 16, 0.6)" }}
            >
              <h2 className="text-3xl font-bold mb-2">
                Complete Your Payment
              </h2>
              <p className="text-gray-400 mb-8">
                Select payment method and upload proof to finalize your order.
              </p>

              <form onSubmit={handleSubmit}>
                {/* Promo Code Section */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                    Promo Code (Optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="promocode"
                      value={formData.promocode}
                      onChange={handleInputChange}
                      disabled={promoApplied}
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#b68938] focus:ring-1 focus:ring-[#b68938] transition-all disabled:opacity-50"
                      placeholder="Enter promo code if any"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={promoApplied}
                      className={`px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all ${
                        promoApplied
                          ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black hover:shadow-[0_0_20px_rgba(182,137,56,0.5)] active:scale-95"
                      }`}
                    >
                      {promoApplied ? "Applied" : "Apply"}
                    </button>
                  </div>
                  
                  {promoApplied && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-400" />
                        <span className="text-green-400 text-sm">
                          25% discount applied! Promo code from: {promoOwner}
                        </span>
                      </div>
                    </motion.div>
                  )}
                  
                  {status && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`mt-3 px-4 py-2 rounded-lg border ${
                        status.type === "success"
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-red-500/10 border-red-500/30"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={
                          status.type === "success" ? "text-green-400" : "text-red-400"
                        }>
                          {status.type === "success" ? "✓" : "✗"}
                        </span>
                        <span className={
                          status.type === "success" ? "text-green-400" : "text-red-400"
                        }>
                          {status.message}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Payment Method */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">
                    Select Payment Method *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {paymentMethods.map((method) => (
                      <motion.button
                        key={method.id}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            paymentMethod: method.id,
                          }))
                        }
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                          formData.paymentMethod === method.id
                            ? "border-[#b68938] bg-[#b68938]/10"
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        }`}
                      >
                        <method.icon
                          size={24}
                          style={{ color: method.color }}
                        />
                        <span className="text-white font-bold text-sm">
                          {method.name}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Payment Proof Upload */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">
                      Payment Proof (Screenshot) *
                    </label>
                    <div
                      onClick={() =>
                        document.getElementById("payment-proof")?.click()
                      }
                      className="border-2 border-dashed border-[#b68938]/30 rounded-2xl p-8 text-center cursor-pointer hover:border-[#b68938]/50 transition-all group"
                    >
                      <input
                        type="file"
                        id="payment-proof"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Upload className="w-12 h-12 text-[#b68938]/50 mx-auto mb-4 group-hover:text-[#b68938] transition-colors" />
                      <p className="text-gray-400 mb-2">
                        Click to upload payment proof
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                      {paymentProof && (
                        <div className="mt-4">
                          <img
                            src={paymentProof}
                            alt="Payment proof"
                            className="w-32 h-32 object-cover rounded-xl mx-auto"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">
                      Transaction ID / Reference *
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 rounded-2xl bg-[rgba(26,20,16,0.8)] backdrop-blur-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 transition-all duration-300 hover:bg-[rgba(26,20,16,0.9)]"
                      placeholder="Enter transaction ID or reference number"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Enter the transaction ID from your payment receipt
                    </p>
                  </div>
                </div>

                {/* Payment Instructions */}
                <div className="bg-[#0a0705]/50 rounded-2xl p-6 mb-8">
                  <h4 className="font-bold text-white mb-4">
                    Payment Instructions
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Make payment to the selected payment method</li>
                    <li>• Upload clear screenshot of payment confirmation</li>
                    <li>• Enter your transaction ID</li>
                    <li>• Verification takes 24-48 hours</li>
                    <li>• You'll receive email confirmation upon approval</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end items-center pt-6 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={
                      isSubmitting || !formData.paymentMethod || !paymentProof || !formData.transactionId
                    }
                    className={`px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all flex items-center gap-2 ${
                      isSubmitting || !formData.paymentMethod || !paymentProof || !formData.transactionId
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black hover:shadow-[0_0_30px_rgba(182,137,56,0.5)] hover:scale-105 active:scale-95"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Processing...
                      </>
                    ) : (
                      `Submit Payment ${promoApplied ? finalPrice : pkg.price}`
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Status Modal */}
      <AnimatePresence>
        {showStatusModal && (
          <StatusModal
            status={status}
            userName={userName}
            onClose={handleStatusModalClose}
            onSuccess={handleStatusModalSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Packages Section Component
interface PackagesSectionProps {
  onPackageSelect: (pkg: PackageDetails) => void;
}

interface PackageCardProps {
  pkg: PackageDetails;
  i: number;
  onPackageSelect: (pkg: PackageDetails) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg, i, onPackageSelect }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: i * 0.1 }}
    whileHover={{ y: -10 }}
    className="relative"
  >
    <SpotlightCard
      delay={i * 0.1}
      className={`relative h-full ${
        pkg.popular ? "ring-2 ring-[#b68938] md:scale-105" : ""
      }`}
    >
      {pkg.popular && (
        <motion.div
          className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black text-xs font-bold uppercase tracking-widest shadow-lg"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Most Popular
        </motion.div>
      )}

      <div className="p-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        <h3 className="text-2xl font-bold text-white mb-2 relative z-10">
          {pkg.name}
        </h3>
        <p className="text-gray-500 text-sm mb-6 relative z-10">
          {pkg.description}
        </p>

        <div className="mb-8 relative z-10">
          <motion.span
            className="text-5xl font-bold text-[#b68938]"
            whileHover={{ scale: 1.1 }}
          >
            {pkg.price}
          </motion.span>
          {pkg.originalPrice && (
            <span className="text-lg text-gray-500 line-through ml-2">
              {pkg.originalPrice}
            </span>
          )}
          <span className="text-gray-500 ml-2">{pkg.period}</span>
        </div>

        <ul className="space-y-4 mb-8 relative z-10">
          {pkg.features.map((feature, fi) => (
            <motion.li
              key={fi}
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + fi * 0.05 }}
            >
              <CheckCircle
                size={20}
                className="text-[#b68938] shrink-0 mt-0.5"
              />
              <span className="text-gray-300 text-sm">{feature}</span>
            </motion.li>
          ))}
        </ul>

        <motion.button
          onClick={() => onPackageSelect(pkg)}
          className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all relative overflow-hidden group ${
            pkg.popular
              ? "bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black hover:shadow-[0_0_40px_rgba(182,137,56,0.5)]"
              : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {pkg.popular && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
          <span className="relative z-10">Select Package</span>
        </motion.button>
      </div>
    </SpotlightCard>
  </motion.div>
);

const PackagesSection: React.FC<PackagesSectionProps> = ({ onPackageSelect }) => {
  const [showSpecificPackages, setShowSpecificPackages] = useState(false);

  const generalPackages = [
    PACKAGES_DATA.starter,
    PACKAGES_DATA.intermediate,
    PACKAGES_DATA.pro,
  ];

  const specificPackages = [
    {
      id: 'facebook' as PackageType,
      name: "Facebook Boost",
      price: "₹3,999",
      originalPrice: "₹4,999",
      period: "one-time",
      description: "Maximize your reach on Facebook.",
      features: [
        "2,500 Page Followers",
        "10,000 Post Engagements",
        "100% Verified Accounts",
        "5-Day Delivery",
        "Page Insights Report",
      ],
      followerOptions: [2500],
      reachOptions: [
        { videos: 1, likesPerVideo: 10000 },
        { videos: 2, likesPerVideo: 5000 }
      ],
      popular: false,
    },
    {
      id: 'tiktok' as PackageType,
      name: "TikTok Trendsetter",
      price: "₹1,999",
      originalPrice: "₹2,999",
      period: "one-time",
      description: "Go viral with targeted TikTok engagement.",
      features: [
        "5,000 Video Views",
        "2,000 Video Likes",
        "100% Verified Accounts",
        "48-Hour Delivery",
        "Trending Hashtag Suggestions",
      ],
      followerOptions: [2000],
      reachOptions: [
        { videos: 1, likesPerVideo: 5000 },
        { videos: 2, likesPerVideo: 2500 }
      ],
      popular: true,
    },
    {
      id: 'instagram' as PackageType,
      name: "Instagram Elite",
      price: "₹7,999",
      originalPrice: "₹9,999",
      period: "one-time",
      description: "Dominate the 'gram with premium growth.",
      features: [
        "10,000 Instagram Followers",
        "30,000 Post Likes",
        "100% Verified Accounts",
        "Dedicated Manager",
        "Story View Boosts",
      ],
      followerOptions: [10000],
      reachOptions: [
        { videos: 1, likesPerVideo: 30000 },
        { videos: 2, likesPerVideo: 15000 }
      ],
      popular: false,
    },
  ];

  return (
    <section
      id="packages"
      className="py-32 px-6 bg-gradient-to-b from-[#0a0705] to-black relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#b68938]/5 blur-[150px] rounded-full" />

      <motion.div
        className="absolute top-20 right-20 w-64 h-64 bg-[#e1ba73]/10 rounded-full blur-[80px]"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Choose Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b68938] to-[#e1ba73]">
              Growth Package
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">
            Transparent pricing. No hidden fees. 100% verified engagement from
            real SRK Task users.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {generalPackages.map((pkg, i) => (
            <PackageCard key={`general-${i}`} pkg={pkg} i={i} onPackageSelect={onPackageSelect} />
          ))}
        </div>

        <AnimatePresence>
          {showSpecificPackages && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="overflow-hidden pt-16"
            >
              <div className="text-center mb-10">
                <h3 className="text-3xl font-bold text-white mb-3">
                  Platform-Specific Boosts
                </h3>
                <p className="text-gray-500">
                  Tailor your growth for maximum impact on specific social
                  channels.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {specificPackages.map((pkg, i) => (
                  <PackageCard key={`specific-${i}`} pkg={pkg} i={i} onPackageSelect={onPackageSelect} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// Benefits Section
const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: Shield,
      title: "100% Verified Users",
      description:
        "Every engagement comes from KYC-verified SRK University students. Zero bots, zero fake accounts.",
    },
    {
      icon: Zap,
      title: "Lightning Fast Delivery",
      description:
        "Watch your metrics grow in real-time. Our distributed network ensures rapid task completion.",
    },
    {
      icon: BarChart3,
      title: "Transparent Analytics",
      description:
        "Track every follower, like, and engagement with detailed dashboards and real-time reporting.",
    },
    {
      icon: Globe,
      title: "Organic Algorithm Boost",
      description:
        "Authentic engagement signals improve your content's reach across all social platforms.",
    },
    {
      icon: Users,
      title: "Targeted Demographics",
      description:
        "Reach the audience that matters most to your brand with precision targeting options.",
    },
    {
      icon: CheckCircle,
      title: "24/7 Dedicated Support",
      description:
        "Our expert team is always available to help you optimize your growth strategy.",
    },
  ];

  return (
    <section
      id="benefits"
      className="py-32 px-6 bg-[#0a0705] relative overflow-hidden"
    >
      <motion.div
        className="absolute top-0 left-0 w-full h-full opacity-20"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "radial-gradient(circle at center, rgba(182, 137, 56, 0.1), transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b68938] to-[#e1ba73]">
              SRK Grow
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">
            Built on trust, powered by technology, and designed for sustainable
            growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <SpotlightCard
                delay={i * 0.1}
                className="group hover:border-[#b68938]/50 transition-all h-full"
              >
                <div className="p-8 relative">
                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        "radial-gradient(circle at center, rgba(182, 137, 56, 0.1), transparent 70%)",
                    }}
                  />

                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-[#b68938]/15 flex items-center justify-center mb-6 relative"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <benefit.icon
                      size={28}
                      className="text-[#b68938] relative z-10"
                    />
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-[#b68938]/20"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                  </motion.div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#b68938] transition-colors relative z-10">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                    {benefit.description}
                  </p>

                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#b68938] to-[#e1ba73]"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// FAQ Section
const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How is SRK Grow different from other growth services?",
      answer:
        "SRK Grow is the only platform backed by a verified university ecosystem. Every engagement comes from KYC-verified students, ensuring 100% authentic interactions that comply with platform guidelines.",
    },
    {
      question: "How long does it take to see results?",
      answer:
        "Delivery times vary by package: Starter (7 days), Growth (3 days), and Pro (24 hours). You'll see real-time progress in your dashboard as tasks are completed by verified users.",
    },
    {
      question: "Are the followers and engagements permanent?",
      answer:
        "Yes! Since all engagements come from real, active accounts, they remain permanent. We maintain a 99%+ retention rate, far exceeding industry standards.",
    },
    {
      question: "Can I target specific demographics?",
      answer:
        "Pro packages include custom targeting options. You can specify age ranges, locations, interests, and more to ensure your growth aligns with your target audience.",
    },
    {
      question: "Is this safe for my account?",
      answer:
        "Absolutely. Our method uses only organic engagement from real users completing voluntary tasks. This is indistinguishable from natural growth and fully compliant with all platform terms of service.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit/debit cards, UPI, net banking, and digital wallets. All transactions are secured with bank-grade encryption through our payment partners.",
    },
  ];

  return (
    <section id="faq" className="py-32 px-6 bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b68938] to-[#e1ba73]">
              Questions
            </span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="backdrop-blur-sm rounded-2xl border border-[rgba(182,137,56,0.2)] bg-[rgba(26,20,16,0.4)] overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/5 transition-all group relative"
              >
                <motion.div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#b68938] to-[#e1ba73] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-white font-bold text-lg pr-8 group-hover:text-[#b68938] transition-colors">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronRight className="text-[#b68938] shrink-0" size={24} />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6 pt-2">
                      <p className="text-gray-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Still have questions?</p>
          <button className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-[#b68938] border border-[#b68938]/30 font-bold text-sm uppercase tracking-widest transition-all">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

// CTA Section
interface CTASectionProps {
  onPackageSelect: (pkg: PackageDetails) => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onPackageSelect }) => {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#b68938]/20 via-black to-[#e1ba73]/20" />

      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(182, 137, 56, 0.3), transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-[#b68938] rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="backdrop-blur-xl rounded-3xl p-12 md:p-16 border border-[#b68938]/30 relative overflow-hidden group"
          style={{ background: "rgba(26, 20, 16, 0.6)" }}
        >
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              background:
                "conic-gradient(from 0deg, transparent, rgba(182, 137, 56, 0.3), transparent)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Sparkles className="w-12 h-12 text-[#b68938] mx-auto mb-6" />
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Ready to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b68938] to-[#e1ba73]">
              Grow?
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-gray-400 mb-10 leading-relaxed relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Join thousands of creators who've amplified their reach through the
            SRK ecosystem. Select your package and start growing today.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <a href="#packages">
              <MagneticButton>
                View All Packages <ArrowRight size={20} className="ml-2" />
              </MagneticButton>
            </a>
            <motion.button
              onClick={() =>
                onPackageSelect(PACKAGES_DATA.intermediate)
              }
              className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold text-sm uppercase tracking-widest transition-all relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">Get Started Now</span>
            </motion.button>
          </motion.div>

          <motion.div
            className="mt-12 pt-8 border-t border-white/10 flex items-center justify-center gap-8 text-sm text-gray-500 flex-wrap relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            {["No Contract", "Instant Activation", "24/7 Support"].map(
              (item, i) => (
                <motion.div
                  key={item}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <CheckCircle size={16} className="text-[#b68938]" />
                  <span>{item}</span>
                </motion.div>
              )
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer Component
const Footer: React.FC = () => {
  const socialLinks = [
    { icon: Facebook, label: "Facebook", color: "#1877F2" },
    { icon: Instagram, label: "Instagram", color: "#E4405F" },
    { icon: Twitter, label: "Twitter", color: "#1DA1F2" },
    { icon: Linkedin, label: "LinkedIn", color: "#0A66C2" },
    { icon: Youtube, label: "YouTube", color: "#FF0000" },
  ];

  return (
    <footer className="bg-black pt-20 pb-12 border-t border-white/5 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] flex items-center justify-center">
                <span className="font-bold text-black text-xl">S</span>
              </div>
              <span className="font-bold text-white text-xl tracking-wide">
                SRK<span className="text-[#b68938]">Grow</span>
              </span>
            </div>
            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
              The central hub for social media growth in the SRK ecosystem.
              Connecting verified users with authentic engagement opportunities.
            </p>
            <a href="#packages">
              <MagneticButton className="px-5 py-2 text-sm">
                Get Started
              </MagneticButton>
            </a>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Platform</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              {["How It Works", "Pricing", "FAQ"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(/\s/g, "")}`}
                    className="hover:text-[#b68938] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Ecosystem</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              {["SRK University", "SRK Task", "SRK Grow", "Support"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-[#b68938] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-gray-600">
              © 2024 SRK Grow. All rights reserved. Part of the SRK Ecosystem.
            </p>

            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors group"
                  style={{ border: `1px solid ${social.color}40` }}
                >
                  <social.icon
                    size={18}
                    className="text-gray-400 group-hover:text-white transition-colors"
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-600">
              Designed with ❤️ for the SRK community | support@srikgrow.com
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Order Confirmation Component
interface OrderConfirmationProps {
  orderDetails: OrderDetails;
  onBack: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ orderDetails, onBack }) => {
  const packageData = PACKAGES_DATA[orderDetails.packageType];

  return (
    <div className="min-h-screen bg-black text-white pt-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-[#b68938]/30 relative overflow-hidden"
          style={{ background: "rgba(26, 20, 16, 0.6)" }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] flex items-center justify-center"
            >
              <CheckCircle size={40} className="text-black" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Order{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b68938] to-[#e1ba73]">
                Confirmed!
              </span>
            </h2>

            <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
              Your {packageData.name} package has been successfully ordered. 
              Our team will contact you within 24 hours to begin the process.
            </p>

            <div className="bg-[#0a0705]/50 rounded-2xl p-6 mb-8 max-w-md mx-auto border border-[#b68938]/20">
              <h3 className="font-bold text-white mb-4 text-lg">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Package:</span>
                  <span className="font-bold">{packageData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Platform:</span>
                  <span className="font-bold capitalize">{orderDetails.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="font-bold">
                    {orderDetails.engagementType === 'follow' ? 'Follow/Subscribe' : 'Reach & Engagement'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-xl font-bold text-[#b68938]">
                    {packageData.price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Order ID:</span>
                  <span className="text-[#e1ba73] font-mono">
                    SRK{Date.now().toString().slice(-8)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={onBack}
                className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold text-sm uppercase tracking-widest transition-all"
              >
                Back to Packages
              </button>
              <button className="px-6 py-3 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black font-bold text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(182,137,56,0.5)] transition-all">
                View Dashboard
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-sm text-gray-500">
                You'll receive an email confirmation shortly. For any queries, contact support@srikgrow.com
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Main App Component
const PackageSelectionPage: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<PackageDetails | null>(null);
  const [isPackageSelectionFlow, setIsPackageSelectionFlow] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [userDetailsForCheckout, setUserDetailsForCheckout] = useState<UserDetails | null>(null);

  const handlePackageSelect = (pkg: PackageDetails) => {
    setSelectedPackage(pkg);
    setIsPackageSelectionFlow(true);
    window.scrollTo(0, 0);
  };

  const handlePackageFlowComplete = (userDetails: UserDetails) => {
    setUserDetailsForCheckout(userDetails);
    setIsPackageSelectionFlow(false);
    setIsCheckout(true);
    window.scrollTo(0, 0);
  };

  const handlePackageFlowBack = () => {
    setIsPackageSelectionFlow(false);
    setSelectedPackage(null);
    window.scrollTo(0, 0);
  };

  const handleCheckoutComplete = () => {
    setIsCheckout(false);
    if (selectedPackage && userDetailsForCheckout) {
      setOrderDetails({
        ...userDetailsForCheckout,
        packageType: selectedPackage.id,
        timestamp: new Date().toISOString(),
        amount: selectedPackage.price,
        transactionId: `SRK${Date.now().toString().slice(-8)}`
      });
      setIsOrderConfirmed(true);
      window.scrollTo(0, 0);
    }
  };

  const handleCheckoutBack = () => {
    setIsCheckout(false);
    setIsPackageSelectionFlow(true);
    window.scrollTo(0, 0);
  };

  const handleBackToPackages = () => {
    setIsOrderConfirmed(false);
    setSelectedPackage(null);
    setOrderDetails(null);
    setUserDetailsForCheckout(null);
    window.scrollTo(0, 0);
  };

  // Render different views based on state
  if (isPackageSelectionFlow && selectedPackage) {
    return (
      <div
        className="bg-black text-white min-h-screen"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        <style>{`
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient-slow {
            animation: gradient 8s ease infinite;
          }
          ::-webkit-calendar-picker-indicator {
            filter: invert(1);
          }
        `}</style>

        <Navbar />
        <PackageSelectionFlow
          selectedPackage={selectedPackage}
          onComplete={handlePackageFlowComplete}
          onBack={handlePackageFlowBack}
        />
        <Footer />
      </div>
    );
  }

  if (isCheckout && selectedPackage && userDetailsForCheckout) {
    return (
      <div
        className="bg-black text-white min-h-screen"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        <style>{`
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient-slow {
            animation: gradient 8s ease infinite;
          }
          ::-webkit-calendar-picker-indicator {
            filter: invert(1);
          }
        `}</style>

        <Navbar />
        <CheckoutPage
          selectedPackage={selectedPackage}
          userDetails={userDetailsForCheckout}
          onBack={handleCheckoutBack}
          onComplete={handleCheckoutComplete}
        />
        <Footer />
      </div>
    );
  }

  if (isOrderConfirmed && orderDetails) {
    return (
      <div
        className="bg-black text-white min-h-screen"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        <style>{`
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient-slow {
            animation: gradient 8s ease infinite;
          }
        `}</style>

        <Navbar />
        <OrderConfirmation
          orderDetails={orderDetails}
          onBack={handleBackToPackages}
        />
        <Footer />
      </div>
    );
  }

  // Main Landing Page View
  return (
    <div
      className="bg-black text-white min-h-screen"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-slow {
          animation: gradient 8s ease infinite;
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <Navbar />
      <Hero />
      <FlowSection />
      <PackagesSection onPackageSelect={handlePackageSelect} />
      <BenefitsSection />
      <FAQSection />
      <CTASection onPackageSelect={handlePackageSelect} />
      <Footer />
    </div>
  );
};

export default PackageSelectionPage;