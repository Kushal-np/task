import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ArrowRight, Sparkles, Users, Shield, Target, Coins, 
  TrendingUp, Wallet, Zap, CheckCircle, Star, Quote, ArrowUpRight, 
  ChevronRight, Bot, Fingerprint, ShieldCheck, Globe, BarChart3,
  Clock, Award, Trophy, DollarSign,
  UserCheck, Smartphone, Wifi, Server, Package, Rocket,
  Cpu, Activity, Heart,
  MessageSquare, ThumbsUp, CreditCard,
  Play, Pause,
  Shield as ShieldIcon,
  Globe as GlobeIcon,
  TrendingUp as TrendingUpIcon,
  Users as UsersIcon,
  Target as TargetIcon,
  BarChart3 as BarChartIcon,
  Zap as ZapIcon,
  Wallet as WalletIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
// ===== TYPE DEFINITIONS =====
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverable?: boolean;
}

// ===== MAGNETIC BUTTON COMPONENT =====
const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className = "", onClick = () => {} }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
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
      className={`relative px-8 py-4 rounded-full bg-gradient-to-r from-[#e1ba73] via-[#d4af37] to-[#b68938] text-black font-bold text-sm md:text-base uppercase tracking-wider hover:shadow-[0_0_60px_rgba(225,186,115,0.7)] active:scale-95 flex items-center gap-2 overflow-hidden group ${className}`}
      style={{ 
        boxShadow: '0 8px 32px rgba(182, 137, 56, 0.4)',
        backgroundSize: '200% 100%',
        backgroundPosition: '0% 0%'
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? '100%' : '-100%' }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

// ===== SPOTLIGHT CARD COMPONENT =====
const SpotlightCard: React.FC<SpotlightCardProps> = ({ children, className = "", delay = 0, hoverable = true }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !hoverable) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    if (!hoverable) return;
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30, rotateX: 5 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
      className={`group relative rounded-3xl backdrop-blur-xl border bg-gradient-to-br from-white/5 to-transparent transition-all duration-500 ${hoverable ? 'hover:scale-[1.02] hover:shadow-[0_30px_60px_rgba(182,137,56,0.15)]' : ''} ${className}`}
      style={{
        background: 'rgba(26, 20, 16, 0.4)',
        borderColor: 'rgba(182, 137, 56, 0.2)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Animated spotlight effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(225, 186, 115, 0.1), transparent 40%)`,
        }}
      />

      {/* Gradient border glow */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-[#e1ba73]/0 via-[#e1ba73]/10 to-[#b68938]/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />
      
      {/* Inner content */}
      <div className="relative z-10 h-full">
        {children}
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-12 h-12 border-l border-t border-[#e1ba73]/20 rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 right-0 w-12 h-12 border-r border-t border-[#b68938]/20 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 w-12 h-12 border-l border-b border-[#e1ba73]/20 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 right-0 w-12 h-12 border-r border-b border-[#b68938]/20 rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

// ===== ENHANCED NAVBAR =====
const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const navbarAnimation = {
    hidden: { 
      y: -100,
      opacity: 0,
      width: "100%",
      borderRadius: "0px"
    },
    visible: { 
      y: 0,
      opacity: 1,
      width: "100%",
      borderRadius: "0px",
      transition: {
        duration: 2.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <>
      <motion.nav
        initial="hidden"
        animate="visible"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-linear-to-b from-black/95 via-[#0a0705]/95 to-black/95 backdrop-blur-xl py-3 shadow-[0_20px_60px_rgba(0,0,0,0.4)]' 
            : 'bg-transparent py-5'
        }`}
      >
        {/* Shine animation overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e1ba73]/10 to-transparent"
          animate={{ 
            x: ['-100%', '200%']
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "easeInOut"
          }}
        />

        {/* Navbar content */}
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="relative">
                <motion.div 
                  className="absolute -inset-2 bg-gradient-to-r from-[#e1ba73] to-[#b68938] rounded-full blur-lg"
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                />
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-[#e1ba73] to-[#b68938] flex items-center justify-center shadow-[0_0_40px_rgba(225,186,115,0.6)]">
                  <span className="font-bold text-black text-lg">S</span>
                </div>
              </div>
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-white">SRK</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e1ba73] to-[#b68938]">Task</span>
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              {['FEATURES', 'TRUST', 'SYNERGY', 'REVIEWS'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="relative text-sm font-bold tracking-widest uppercase group"
                >
                  <span className={`relative z-10 transition-colors duration-300 ${
                    isScrolled ? 'text-gray-300 group-hover:text-[#e1ba73]' : 'text-white/90 group-hover:text-white'
                  }`}>
                    {item}
                  </span>
                  <motion.div 
                    className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-[#e1ba73] to-[#b68938]"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#e1ba73]/0 via-[#e1ba73]/10 to-[#b68938]/0 rounded-lg opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
                </motion.a>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 40px rgba(225, 186, 115, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:block px-8 py-3 rounded-full bg-gradient-to-r from-[#e1ba73] to-[#b68938] text-black font-bold text-sm uppercase tracking-widest relative overflow-hidden"
            >
              <Link to="/afterVerified" className="relative z-10">START EARNING</Link>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.8 }}
              />
            </motion.button>

            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2 hover:text-[#e1ba73] transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <motion.div 
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#e1ba73] to-[#b68938]"
          style={{
            scaleX: scrollY.get(),
            transformOrigin: "0%"
          }}
        />
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-linear-to-b from-black to-[#0a0705] md:hidden pt-32 px-8 flex flex-col gap-6"
          >
            {['Features', 'Trust', 'Synergy', 'Reviews'].map((item, index) => (
              <motion.a 
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-3xl font-bold text-white hover:text-[#e1ba73] transition-colors border-b border-white/10 pb-4"
              >
                {item}
              </motion.a>
            ))}
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-5 rounded-2xl font-bold text-lg mt-4 bg-linear-to-r from-[#e1ba73] to-[#b68938] text-black shadow-[0_20px_60px_rgba(225,186,115,0.4)]"
            >
              Start Earning
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ===== ENHANCED HERO SECTION =====
const Hero: React.FC = () => {
  interface Step {
    title: string;
    desc: string;
    icon: React.ComponentType<any>;
    delay: number;
  }

  const steps: Step[] = [
    { title: "CONNECT", desc: "Link SRK University Account", icon: Users, delay: 0.2 },
    { title: "VERIFY", desc: "Complete KYC Process", icon: Shield, delay: 0.4 },
    { title: "TASK", desc: "Follow & Engage", icon: Target, delay: 0.6 },
    { title: "EARN", desc: "Instant Wallet Credit", icon: Coins, delay: 0.8 }
  ];

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [steps.length]);

  // Safe window dimensions for SSR
  const [windowSize, setWindowSize] = useState({ width: 1000, height: 1000 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 px-6 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0705] to-black" />
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[1px] h-[1px] bg-gradient-to-r from-[#e1ba73] to-[#b68938] rounded-full"
          initial={{
            x: Math.random() * windowSize.width,
            y: Math.random() * windowSize.height,
          }}
          animate={{
            y: [null, -30, 30, 0],
            x: [null, 15, -15, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(225, 186, 115, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(225, 186, 115, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Content */}
        <div className="space-y-8 text-center lg:text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-xl border border-[#b68938]/30 bg-gradient-to-r from-[#0a0705]/50 to-black/50"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e1ba73] animate-pulse" />
            <span className="text-xs font-bold text-[#e1ba73] tracking-widest uppercase">
              Welcome to SRK Task Portal
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#e1ba73] animate-pulse" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight"
          >
            <motion.span 
              className="block text-white mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Earn Through
            </motion.span>
            <motion.span 
              className="block text-transparent bg-clip-text bg-gradient-to-r from-[#e1ba73] via-[#d4af37] to-[#b68938]"
              style={{
                backgroundSize: '200% 100%',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Tasks
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-2"
          >
            <p className="text-lg md:text-xl text-gray-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              Join thousands completing simple tasks.
              <br />
              Multiple schemes coming soon.
            </p>
            <p className="text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#e1ba73] to-[#b68938] max-w-lg mx-auto lg:mx-0 leading-relaxed font-semibold">
              Start your journey with SRK Group.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center lg:justify-start gap-4"
          >
            <MagneticButton className="shadow-[0_0_50px_rgba(225,186,115,0.5)]">
              Join Now & Start Earning <ArrowRight size={20} className="ml-2" />
            </MagneticButton>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex items-center justify-center lg:justify-start gap-6 pt-8 border-t border-white/5"
          >
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <motion.div 
                  key={i} 
                  className="w-11 h-11 rounded-full border-2 border-[#0a0705] flex items-center justify-center text-[#b68938] bg-[#1a1410] relative z-0 hover:z-10"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Users size={18} />
                </motion.div>
              ))}
            </div>
            <div className="text-left">
              <div className="text-white font-bold text-base">50K+ Active Members</div>
              <div className="text-sm text-[#b68938] font-semibold">Verified by SRK University</div>
            </div>
          </motion.div>
        </div>

        {/* Right Content - Animated Steps */}
        <div className="relative hidden lg:block h-[600px] pl-10">
          {/* Animated line */}
          <motion.div 
            className="absolute left-[39px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#e1ba73]/20 via-[#b68938] to-[#e1ba73]/20"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          />
          
          <div className="flex flex-col justify-between h-full py-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 100, rotateY: 90 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ duration: 0.8, delay: step.delay, type: "spring" }}
                  className="relative group pl-16"
                  onMouseEnter={() => setActiveStep(i)}
                >
                  {/* Animated node */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center">
                    <motion.div 
                      className="relative"
                      animate={{ 
                        scale: activeStep === i ? [1, 1.5, 1] : 1,
                        boxShadow: activeStep === i 
                          ? ['0 0 0 0 rgba(225, 186, 115, 0)', '0 0 30px 10px rgba(225, 186, 115, 0.5)', '0 0 0 0 rgba(225, 186, 115, 0)']
                          : '0 0 15px rgba(225,186,115,0.5)'
                      }}
                      transition={{ 
                        scale: { duration: 2, repeat: Infinity },
                        boxShadow: { duration: 2, repeat: Infinity }
                      }}
                    >
                      <div className="w-4 h-4 rounded-full bg-[#0a0705] border-2 border-[#e1ba73] z-10" />
                    </motion.div>
                    <div className="absolute w-8 h-[1px] bg-gradient-to-r from-[#b68938]/30 to-transparent right-1/2 top-1/2" />
                  </div>
                  
                  {/* Step Card */}
                  <SpotlightCard className="w-full max-w-md" hoverable={false}>
                    <div className="p-6">
                      <div className="flex items-center gap-5">
                        <motion.div 
                          className="p-3.5 rounded-xl bg-gradient-to-br from-[#b68938]/20 to-[#e1ba73]/10 text-[#e1ba73]"
                          animate={{ 
                            rotate: activeStep === i ? [0, 5, -5, 0] : 0,
                            scale: activeStep === i ? [1, 1.1, 1] : 1
                          }}
                          transition={{ duration: 0.6 }}
                        >
                          <Icon size={22} />
                        </motion.div>
                        <div>
                          <motion.h4 
                            className="text-white font-bold text-lg mb-1"
                            animate={{ 
                              color: activeStep === i ? '#e1ba73' : '#ffffff'
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            {step.title}
                          </motion.h4>
                          <p className="text-sm text-gray-500 font-medium">{step.desc}</p>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <motion.div 
                        className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: activeStep === i ? "100%" : "0%" }}
                        transition={{ duration: 2 }}
                      >
                        <div className="h-full bg-gradient-to-r from-[#e1ba73] to-[#b68938] rounded-full" />
                      </motion.div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// ===== ANIMATED STATS BAR =====
const StatsBar: React.FC = () => {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  
  interface Stat {
    value: string;
    label: string;
    icon: React.ComponentType<any>;
    description: string;
    color: string;
  }

  const stats: Stat[] = [
    { 
      value: "500+", 
      label: "Active Tasks Available Now", 
      icon: Target, 
      description: "Real-time tasks across all platforms",
      color: "#e1ba73" 
    },
    { 
      value: "₹10L+", 
      label: "Total Payouts Processed", 
      icon: Wallet, 
      description: "Instant transfers to verified users",
      color: "#d4af37" 
    },
    { 
      value: "50K+", 
      label: "FVC & Manual Verification", 
      icon: Users, 
      description: "Human-verified quality control",
      color: "#b68938" 
    },
    { 
      value: "Global", 
      label: "Happy Users Globally", 
      icon: Globe, 
      description: "Trusted by creators worldwide",
      color: "#e1ba73" 
    }
  ];

  return (
    <section className="py-20 relative bg-gradient-to-b from-black/80 to-[#0a0705] overflow-hidden">
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(225, 186, 115, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(182, 137, 56, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(225, 186, 115, 0.1) 0%, transparent 50%)'
          ]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                onMouseEnter={() => setHoveredStat(index)}
                onMouseLeave={() => setHoveredStat(null)}
                className="relative group"
              >
                {/* Popup info */}
                <AnimatePresence>
                  {hoveredStat === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 p-4 rounded-2xl backdrop-blur-xl border border-[#b68938]/30 bg-gradient-to-b from-[#0a0705]/90 to-black/90 z-20 shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                    >
                      <div className="text-sm text-gray-300 font-medium text-center">
                        {stat.description}
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0a0705] border-b border-r border-[#b68938]/30 rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Stat Card */}
                <SpotlightCard className="h-full">
                  <div className="p-8 flex flex-col items-center text-center">
                    <motion.div
                      className="relative mb-6"
                      animate={{ 
                        rotate: hoveredStat === index ? 360 : 0,
                        scale: hoveredStat === index ? 1.1 : 1
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#e1ba73]/20 to-[#b68938]/20 blur-xl rounded-full" />
                      <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-black/80 to-[#1a1410] border border-white/5">
                        <Icon className="w-7 h-7" style={{ color: stat.color }} />
                      </div>
                    </motion.div>

                    <motion.div 
                      className="text-5xl font-bold mb-3"
                      animate={{
                        color: hoveredStat === index ? stat.color : '#ffffff'
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {stat.value}
                    </motion.div>

                    <div className="text-sm text-gray-400 font-medium tracking-wider uppercase">
                      {stat.label}
                    </div>

                    {/* Animated underline */}
                    <motion.div 
                      className="mt-6 h-[2px] bg-gradient-to-r from-transparent via-[#b68938] to-transparent"
                      initial={{ width: 0 }}
                      animate={{ width: hoveredStat === index ? "80%" : "40%" }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ===== ENHANCED TRUST GRID =====
const TrustGrid: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  interface Feature {
    icon: React.ComponentType<any>;
    title: string;
    desc: string;
    gradient: string;
    delay: number;
  }

  const features: Feature[] = [
    {
      icon: Bot,
      title: "Zero Bot Tolerance",
      desc: "Our proprietary AI filters reject 99.9% of automated traffic. Only real humans, real engagement.",
      gradient: "from-[#e1ba73] to-[#ff6b6b]",
      delay: 0.1
    },
    {
      icon: Fingerprint,
      title: "100% Verified Identities",
      desc: "Every earner passes mandatory KYC verification via the SRK University portal.",
      gradient: "from-[#b68938] to-[#4dabf7]",
      delay: 0.2
    },
    {
      icon: ShieldCheck,
      title: "Bank-Grade Security",
      desc: "256-bit encryption and secure escrow systems protect every transaction.",
      gradient: "from-[#e1ba73] to-[#51cf66]",
      delay: 0.3
    },
    {
      icon: Zap,
      title: "Instant Settlements",
      desc: "No waiting periods. Earnings are credited to your wallet in milliseconds.",
      gradient: "from-[#b68938] to-[#ffd43b]",
      delay: 0.4
    },
    {
      icon: Globe,
      title: "Global Reach",
      desc: "Access a diverse network of active users from 120+ countries ready to engage.",
      gradient: "from-[#e1ba73] to-[#339af0]",
      delay: 0.5
    },
    {
      icon: BarChart3,
      title: "Transparent Analytics",
      desc: "Real-time tracking of every click, follow, and interaction with granular reporting.",
      gradient: "from-[#b68938] to-[#da77f2]",
      delay: 0.6
    }
  ];

  return (
    <section id="trust" className="py-32 px-4 relative overflow-hidden bg-black">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(225, 186, 115, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(182, 137, 56, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)
            `
          }}
          animate={{
            background: [
              `
                radial-gradient(circle at 20% 30%, rgba(225, 186, 115, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(182, 137, 56, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)
              `,
              `
                radial-gradient(circle at 30% 40%, rgba(225, 186, 115, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(182, 137, 56, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 60% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)
              `,
              `
                radial-gradient(circle at 20% 30%, rgba(225, 186, 115, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(182, 137, 56, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)
              `
            ]
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        
        {/* Animated grid lines */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(225, 186, 115, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(225, 186, 115, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            backgroundPosition: 'center center'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-8 px-6 py-2.5 rounded-full border backdrop-blur-xl bg-gradient-to-r from-[#0a0705]/50 to-black/50"
            style={{
              borderColor: 'rgba(182, 137, 56, 0.3)',
              boxShadow: '0 8px 32px rgba(182, 137, 56, 0.1)'
            }}
          >
            <span className="text-xs font-bold text-[#e1ba73] tracking-[0.2em] uppercase">
              The SRK Standard
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight"
          >
            Uncompromising{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e1ba73] via-[#d4af37] to-[#b68938]">
              Quality
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed"
          >
            We don't just connect you; we protect the integrity of every interaction. Built on a foundation of trust and technology.
          </motion.p>
        </div>

        {/* Interactive Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: feature.delay }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                className="relative"
              >
                <SpotlightCard className="h-full">
                  <div className="p-8 lg:p-10 flex flex-col h-full">
                    {/* Icon Container with Line Animation */}
                    <div className="relative mb-8">
                      {/* Animated border circle */}
                      <motion.div 
                        className="absolute -inset-4 rounded-2xl"
                        style={{
                          background: `conic-gradient(from 0deg, ${hoveredCard === i ? feature.gradient : 'rgba(225, 186, 115, 0.1)'}, transparent)`
                        }}
                        animate={{ 
                          rotate: hoveredCard === i ? 360 : 0,
                          opacity: hoveredCard === i ? 1 : 0
                        }}
                        transition={{ 
                          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                          opacity: { duration: 0.3 }
                        }}
                      />
                      
                      {/* Icon */}
                      <motion.div 
                        className={`relative w-20 h-20 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br from-black/80 to-[#1a1410] border`}
                        style={{
                          borderColor: hoveredCard === i ? 
                            `hsl(${i * 60}, 70%, 50%)` : 
                            'rgba(182, 137, 56, 0.2)'
                        }}
                        animate={{ 
                          scale: hoveredCard === i ? 1.1 : 1,
                          rotate: hoveredCard === i ? [0, 5, -5, 0] : 0
                        }}
                        transition={{ 
                          scale: { duration: 0.3 },
                          rotate: { duration: 0.6 }
                        }}
                      >
                        <Icon 
                          size={32} 
                          className="text-[#e1ba73]" 
                          strokeWidth={1.5}
                        />
                      </motion.div>

                      {/* Line animation */}
                      <motion.div 
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-[#e1ba73] to-[#b68938] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: hoveredCard === i ? "80%" : "40%" }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                    
                    {/* Title with gradient effect */}
<motion.h3 
    className="text-xl lg:text-2xl font-bold mb-4 leading-tight"
    // FIX: Moved static text gradient hacks to the 'style' prop
    style={{
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent' // Default text color is transparent
    }}
    animate={{
        // Only animate the changing property (backgroundImage)
        backgroundImage: hoveredCard === i 
          ? `linear-gradient(135deg, ${feature.gradient})`
          : 'linear-gradient(135deg, #ffffff, #ffffff)',
    }}
    transition={{ duration: 0.3 }}
>
    {feature.title}
</motion.h3>
                    
                    {/* Description */}
                    <p className="text-gray-400 text-sm lg:text-base leading-relaxed font-medium mb-6">
                      {feature.desc}
                    </p>

                    {/* Progress line at bottom */}
                    <div className="mt-auto pt-6">
                      <motion.div 
                        className="h-[2px] rounded-full overflow-hidden"
                        initial={{ width: "0%" }}
                        animate={{ width: hoveredCard === i ? "100%" : "20%" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      >
                        <div 
                          className="h-full bg-gradient-to-r from-[#e1ba73] to-[#b68938]"
                          style={{
                            boxShadow: '0 0 20px rgba(225, 186, 115, 0.5)'
                          }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </SpotlightCard>

                {/* Glow effect when hovered */}
                <motion.div 
                  className="absolute inset-0 -z-10 rounded-3xl blur-2xl opacity-0"
                  style={{
                    background: `radial-gradient(circle at center, ${hoveredCard === i ? feature.gradient.replace('from-', '').replace('to-', '').split(' ')[0] : 'transparent'} 0%, transparent 70%)`
                  }}
                  animate={{ 
                    opacity: hoveredCard === i ? 0.3 : 0,
                    scale: hoveredCard === i ? 1.1 : 1
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ===== SYNERGY OF GROWTH SECTION =====
const SynergySection: React.FC = () => {
  const [flipped, setFlipped] = useState<number | null>(null);

  interface CardData {
    front: {
      title: string;
      subtitle: string;
      icon: React.ComponentType<any>;
      description: string;
      gradient: string;
      stats: string[];
    };
    back: {
      title: string;
      description: string;
      features: string[];
    };
  }

  const cards: CardData[] = [
    {
      front: {
        title: "SRK Grow",
        subtitle: "Premium Growth Engine",
        icon: Rocket,
        description: "Creators purchase authentic engagement to accelerate their social presence growth.",
        gradient: "from-[#e1ba73] via-[#d4af37] to-[#b68938]",
        stats: ["500+ Daily Orders", "99.8% Success Rate", "24/7 Support"]
      },
      back: {
        title: "Real Engagement",
        description: "Every interaction is from verified, real users ensuring platform-safe growth.",
        features: ["Manual Verification", "Human Quality Check", "Platform Compliant"]
      }
    },
    {
      front: {
        title: "SRK Task",
        subtitle: "Earning Platform",
        icon: DollarSign,
        description: "Complete simple tasks and earn instantly. Every task creates value for creators.",
        gradient: "from-[#b68938] via-[#d4af37] to-[#e1ba73]",
        stats: ["Instant Payouts", "500+ Tasks Daily", "Global Access"]
      },
      back: {
        title: "Verified Earnings",
        description: "Every task is verified and processed through secure blockchain technology.",
        features: ["Instant Processing", "Secure Transactions", "Real-time Tracking"]
      }
    }
  ];

  interface Stat {
    value: string;
    label: string;
    icon: React.ComponentType<any>;
    color: string;
  }

  const stats: Stat[] = [
    { value: "500+", label: "Active Tasks", icon: TargetIcon, color: "#e1ba73" },
    { value: "₹10L+", label: "Monthly Payouts", icon: WalletIcon, color: "#d4af37" },
    { value: "50K+", label: "Verified Users", icon: UsersIcon, color: "#b68938" },
    { value: "99.9%", label: "Success Rate", icon: Trophy, color: "#e1ba73" }
  ];

  return (
    <section id="synergy" className="py-32 px-4 relative overflow-hidden bg-black">
      {/* Dynamic background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0"
          style={{
            background: `
              conic-gradient(from 0deg at 50% 50%, 
                rgba(225, 186, 115, 0.05) 0deg, 
                rgba(182, 137, 56, 0.05) 120deg, 
                rgba(212, 175, 55, 0.05) 240deg, 
                rgba(225, 186, 115, 0.05) 360deg
              )
            `
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Gradient mesh */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 20%, rgba(225, 186, 115, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(182, 137, 56, 0.3) 0%, transparent 50%)
            `
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-8 px-6 py-2.5 rounded-full border border-[#b68938]/30 bg-gradient-to-r from-[#0a0705]/50 to-black/50 backdrop-blur-xl"
          >
            <TrendingUpIcon className="w-4 h-4 text-[#e1ba73]" />
            <span className="text-xs font-bold text-[#e1ba73] tracking-widest uppercase">Ecosystem Synergy</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight"
          >
            Synergy of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e1ba73] via-[#d4af37] to-[#b68938]">
              Growth
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            A perfect ecosystem loop where creators purchase growth on <span className="text-white font-bold">SRK Grow</span>, 
            which instantly creates paid tasks for you on <span className="text-white font-bold">SRK Task</span>.
          </motion.p>
        </div>

        {/* Flipping Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {cards.map((card, i) => {
            const Icon = card.front.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="relative h-[500px] perspective-1000"
                onMouseEnter={() => setFlipped(i)}
                onMouseLeave={() => setFlipped(null)}
              >
                <motion.div
                  className="relative w-full h-full preserve-3d"
                  animate={{ rotateY: flipped === i ? 180 : 0 }}
                  transition={{ duration: 0.8, type: "spring" }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Front Side */}
                  <div 
                    className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <SpotlightCard className="h-full">
                      <div className="p-10 h-full flex flex-col">
                        {/* Icon */}
                        <div className="mb-8">
                          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${card.front.gradient} flex items-center justify-center shadow-[0_20px_40px_rgba(182,137,56,0.3)]`}>
                            <Icon className="w-10 h-10 text-black" />
                          </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-3xl font-bold text-white mb-3">{card.front.title}</h3>
                        <p className="text-[#e1ba73] text-sm uppercase tracking-widest font-bold mb-6">
                          {card.front.subtitle}
                        </p>
                        <p className="text-gray-400 text-lg font-medium mb-8 leading-relaxed">
                          {card.front.description}
                        </p>

                        {/* Stats */}
                        <div className="mt-auto space-y-3">
                          {card.front.stats.map((stat, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#e1ba73] to-[#b68938]" />
                              <span className="text-sm text-gray-300 font-medium">{stat}</span>
                            </div>
                          ))}
                        </div>

                        {/* Flip hint */}
                        <motion.div 
                          className="absolute bottom-6 right-6 text-[#b68938]"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5 rotate-180" />
                        </motion.div>
                      </div>
                    </SpotlightCard>
                  </div>

                  {/* Back Side */}
                  <div 
                    className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <SpotlightCard className="h-full">
                      <div className="p-10 h-full flex flex-col bg-gradient-to-br from-[#1a1410] to-black">
                        <h3 className="text-3xl font-bold text-white mb-6">{card.back.title}</h3>
                        <p className="text-gray-400 text-lg font-medium mb-8 leading-relaxed">
                          {card.back.description}
                        </p>

                        {/* Features */}
                        <div className="space-y-4 mt-auto">
                          {card.back.features.map((feature, idx) => (
                            <motion.div 
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5"
                            >
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#e1ba73]/20 to-[#b68938]/20 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-[#e1ba73]" />
                              </div>
                              <span className="text-white font-medium">{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </SpotlightCard>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Connection Arrow */}
        <motion.div 
          className="hidden lg:flex items-center justify-center mb-20"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="relative flex items-center gap-4">
            <motion.div 
              className="w-48 h-[2px] bg-gradient-to-r from-[#e1ba73] to-[#b68938]"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ backgroundSize: '200% 100%' }}
            />
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                scale: { duration: 2, repeat: Infinity },
                rotate: { duration: 4, repeat: Infinity, ease: "linear" }
              }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-[#e1ba73] to-[#b68938] flex items-center justify-center shadow-[0_0_30px_rgba(225,186,115,0.5)]"
            >
              <ArrowRight className="w-6 h-6 text-black" />
            </motion.div>
            <motion.div 
              className="w-48 h-[2px] bg-gradient-to-r from-[#b68938] to-[#e1ba73]"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              style={{ backgroundSize: '200% 100%' }}
            />
          </div>
        </motion.div>

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 + 0.4 }}
                className="relative group"
                whileHover={{ scale: 1.05 }}
              >
                <SpotlightCard>
                  <div className="p-8 flex flex-col items-center text-center">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                      style={{ 
                        background: `rgba(${parseInt(stat.color.slice(1, 3), 16)}, ${parseInt(stat.color.slice(3, 5), 16)}, ${parseInt(stat.color.slice(5, 7), 16)}, 0.1)`,
                        border: `1px solid ${stat.color}40`
                      }}
                    >
                      <Icon className="w-7 h-7" style={{ color: stat.color }} />
                    </div>
                    
                    <div 
                      className="text-4xl font-bold mb-3"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </div>
                    
                    <div className="text-sm text-gray-400 font-medium tracking-wider uppercase">
                      {stat.label}
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ===== AVAILABLE EVERYWHERE SECTION =====
const AvailableEverywhere: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Responsive spring configs
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const bouncySpring = { stiffness: 150, damping: 15, restDelta: 0.001 };
  
  // Phone container animations - optimized for all screen sizes
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15]), springConfig);
  const rotateY = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [-10, 0, 10]), springConfig);
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.7, 1, 1, 0.9]), bouncySpring);
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [100, -100]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5]), springConfig);

  // Content animations
  const contentY = useTransform(scrollYProgress, [0.2, 0.8], [0, -30]);
  
  // Phone shine effect
  const shinePosition = useSpring(useTransform(scrollYProgress, [0, 1], ["-100%", "200%"]), springConfig);
  const shineOpacity = useSpring(useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.6, 0.6, 0]), springConfig);

  interface Feature {
    icon: React.ComponentType<any>;
    title: string;
    desc: string;
    delay: number;
  }

  const features: Feature[] = [
    { 
      icon: Smartphone, 
      title: "Universal Access", 
      desc: "Works flawlessly on iOS, Android, and Web.",
      delay: 0.1 
    },
    { 
      icon: Wifi, 
      title: "Low Latency", 
      desc: "Optimized for 4G/5G networks with real-time sync.",
      delay: 0.2 
    },
    { 
      icon: Server, 
      title: "Secure Payouts", 
      desc: "Bank-grade encryption for all transactions.",
      delay: 0.3 
    }
  ];

  const [notifications, setNotifications] = useState<boolean[]>([false, false, false]);
  const [isAnimating, setIsAnimating] = useState(true);
  const [balance, setBalance] = useState(24500);
  const [animatedBalance, setAnimatedBalance] = useState(24500);

  // Scroll-based notification triggers
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      console.log("Scroll progress in AvailableEverywhere:", latest);
      
      if (latest > 0.25 && !notifications[0]) {
        setTimeout(() => setNotifications(prev => [true, prev[1], prev[2]]), 300);
      }
      if (latest > 0.5 && !notifications[1]) {
        setTimeout(() => setNotifications(prev => [true, true, prev[2]]), 600);
      }
      if (latest > 0.75 && !notifications[2]) {
        setTimeout(() => setNotifications(prev => [true, true, true]), 900);
      }
      
      // Balance animation based on scroll
      if (latest > 0.4 && latest < 0.6) {
        const newBalance = 24500 + Math.floor(latest * 1000);
        setAnimatedBalance(newBalance);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, notifications]);

  // Continuous animations
  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setBalance(prev => {
        const randomChange = Math.floor(Math.random() * 100) - 50;
        const newBalance = Math.max(20000, prev + randomChange);
        setAnimatedBalance(newBalance);
        return newBalance;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  // Pulsing animation for dynamic island
  const [pulse, setPulse] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => prev === 1 ? 1.2 : 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Safe window dimensions for SSR
  const [windowSize, setWindowSize] = useState({ width: 1000, height: 1000 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section ref={containerRef} className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden min-h-[120vh] sm:min-h-[140vh] lg:min-h-[150vh]">
      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-gradient-to-r from-[#b68938]/5 to-transparent blur-[80px] sm:blur-[100px] lg:blur-[120px] rounded-full pointer-events-none" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[300px] sm:w-[450px] lg:w-[600px] h-[300px] sm:h-[450px] lg:h-[600px] bg-gradient-to-r from-[#b68938]/5 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[250px] sm:w-[375px] lg:w-[500px] h-[250px] sm:h-[375px] lg:h-[500px] bg-gradient-to-l from-[#e1ba73]/5 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        
        {/* Phone Mockup - Responsive sizing */}
        <div className="flex justify-center lg:justify-end order-2 lg:order-1">
          <motion.div
            style={{ 
              rotateX, 
              rotateY, 
              scale: scale as any, 
              y, 
              opacity,
              transformStyle: "preserve-3d" 
            }}
            className="relative w-[280px] sm:w-[320px] lg:w-[340px] h-[580px] sm:h-[660px] lg:h-[700px] bg-black rounded-[45px] sm:rounded-[50px] lg:rounded-[55px] border-[8px] sm:border-[9px] lg:border-[10px] border-[#1a1a1a] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] sm:shadow-[0_40px_80px_-18px_rgba(0,0,0,0.75)] lg:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Phone shine effect */}
            <motion.div
              style={{
                x: shinePosition,
                opacity: shineOpacity
              }}
              className="absolute inset-0 z-20 pointer-events-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-[-20deg]" />
            </motion.div>

            {/* Phone Frame Gradient */}
            <div className="absolute -inset-[3px] sm:-inset-[3.5px] lg:-inset-[4px] rounded-[50px] sm:rounded-[55px] lg:rounded-[60px] bg-gradient-to-tr from-[#b68938] via-[#e1ba73] to-[#b68938] -z-10 opacity-60" />

            {/* Phone Screen */}
            <div className="w-full h-full bg-[#050505] rounded-[38px] sm:rounded-[42px] lg:rounded-[46px] overflow-hidden relative flex flex-col font-sans">
              {/* Dynamic Island */}
              <motion.div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] sm:w-[110px] lg:w-[120px] h-[28px] sm:h-[31px] lg:h-[35px] bg-black rounded-b-3xl z-50 flex items-center justify-center gap-2 sm:gap-2.5 lg:gap-3 px-2 sm:px-2.5 lg:px-3 border-x border-b border-white/10"
                animate={{
                  scale: pulse,
                  boxShadow: pulse === 1.2 ? "0_0_20px_rgba(225,186,115,0.5)" : "none"
                }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="w-1.5 sm:w-1.5 lg:w-2 h-1.5 sm:h-1.5 lg:h-2 rounded-full bg-gradient-to-r from-[#e1ba73] to-[#b68938]"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[8px] sm:text-[9px] lg:text-[10px] text-gray-500 font-medium">SRK Active</span>
              </motion.div>

              {/* Content Container */}
              <motion.div 
                style={{ y: contentY }}
                className="pt-10 sm:pt-12 lg:pt-14 px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6 flex flex-col gap-5 sm:gap-6 lg:gap-8 h-full overflow-y-auto scrollbar-hide"
              >
                {/* User Header */}
                <motion.div 
                  className="flex justify-between items-center"
                  initial={false}
                  animate={{ x: notifications.some(n => n) ? [0, -5, 5, 0] : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Welcome back,</div>
                    <div className="text-lg sm:text-xl font-bold text-white">Rahul Kumar</div>
                  </div>
                  <motion.div 
                    className="w-10 sm:w-11 lg:w-12 h-10 sm:h-11 lg:h-12 rounded-full border border-[#b68938]/30 p-1"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img 
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" 
                      alt="User" 
                      className="w-full h-full rounded-full bg-[#111]" 
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=Rahul&background=111&color=e1ba73&bold=true`;
                      }}
                    />
                  </motion.div>
                </motion.div>

                {/* Balance Card */}
                <motion.div 
                  className="w-full aspect-[1.6] rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1a1410] to-black border border-[#b68938]/20" />
                  <motion.div 
                    className="absolute top-0 right-0 w-32 sm:w-36 lg:w-40 h-32 sm:h-36 lg:h-40 bg-gradient-to-br from-[#e1ba73]/10 to-[#b68938]/10 blur-[50px] sm:blur-[55px] lg:blur-[60px] rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                    }}
                  />
                  
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                      <motion.div 
                        className="p-1.5 sm:p-2 rounded-lg bg-white/5 border border-white/5"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Wallet className="w-4 sm:w-4.5 lg:w-5 h-4 sm:h-4.5 lg:h-5 text-[#e1ba73]" />
                      </motion.div>
                      <motion.div 
                        className="text-[#e1ba73] text-[8px] sm:text-[9px] lg:text-[10px] font-bold tracking-widest bg-gradient-to-r from-[#e1ba73]/20 to-[#b68938]/20 px-2 sm:px-2.5 lg:px-3 py-0.5 sm:py-1 rounded-full"
                        animate={{
                          background: [
                            "linear-gradient(to right, rgba(225,186,115,0.2), rgba(182,137,56,0.2))",
                            "linear-gradient(to right, rgba(225,186,115,0.3), rgba(182,137,56,0.3))",
                            "linear-gradient(to right, rgba(225,186,115,0.2), rgba(182,137,56,0.2))"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        PRO MEMBER
                      </motion.div>
                    </div>
                    
                    <div>
                      <div className="text-gray-400 text-[9px] sm:text-[10px] lg:text-xs mb-0.5 sm:mb-1 uppercase tracking-wide">Total Earnings</div>
                      <motion.div 
                        key={animatedBalance}
                        initial={{ scale: 1.1, opacity: 0.7 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight"
                      >
                        ₹{animatedBalance.toLocaleString()}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 sm:gap-3.5 lg:gap-4">
                  <motion.button 
                    className="py-2.5 sm:py-3 lg:py-3.5 rounded-xl bg-gradient-to-r from-[#e1ba73] to-[#b68938] text-black font-bold text-xs sm:text-sm relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">Withdraw</span>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-[#b68938] to-[#e1ba73] opacity-0 group-hover:opacity-100"
                      initial={false}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                  <motion.button 
                    className="py-2.5 sm:py-3 lg:py-3.5 rounded-xl bg-[#1a1a1c] text-white font-bold text-xs sm:text-sm border border-white/10 relative overflow-hidden group"
                    whileHover={{ scale: 1.05, borderColor: "#e1ba73" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">History</span>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-[#e1ba73]/10 to-[#b68938]/10 opacity-0 group-hover:opacity-100"
                      initial={false}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </div>

                {/* Animation Controls */}
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setIsAnimating(!isAnimating)}
                    className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#1a1a1c] text-[10px] sm:text-xs text-gray-400 border border-white/5 flex items-center gap-1.5 sm:gap-2 hover:border-[#e1ba73]/30 transition-colors"
                  >
                    {isAnimating ? <Pause size={10} className="sm:w-3 sm:h-3" /> : <Play size={10} className="sm:w-3 sm:h-3" />}
                    <span className="hidden sm:inline">{isAnimating ? 'Pause' : 'Play'}</span>
                  </button>
                </div>

                {/* Notifications Section */}
                <div className="flex-1">
                  <h3 className="text-white font-bold text-xs sm:text-sm mb-2 sm:mb-3">Recent Tasks</h3>
                  <div className="space-y-2 sm:space-y-2.5 lg:space-y-3">
                    {[
                      { icon: Users, title: "Instagram Follow", time: "Just now", amount: 50 },
                      { icon: Target, title: "YouTube View", time: "5 min ago", amount: 75 },
                      { icon: MessageSquare, title: "Comment Task", time: "10 min ago", amount: 35 }
                    ].map((task, index) => {
                      const Icon = task.icon;
                      return (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, x: -20, scale: 0.9 }}
                          animate={{ 
                            opacity: notifications[index] ? 1 : 0, 
                            x: notifications[index] ? 0 : -20,
                            scale: notifications[index] ? 1 : 0.9
                          }}
                          transition={{ 
                            duration: 0.5, 
                            delay: index * 0.2,
                            type: "spring",
                            stiffness: 200
                          }}
                          whileHover={{ 
                            scale: 1.02, 
                            borderColor: "#e1ba73",
                            backgroundColor: "rgba(26, 26, 26, 0.8)"
                          }}
                          className="flex items-center gap-3 sm:gap-3.5 lg:gap-4 p-3 sm:p-3.5 lg:p-4 rounded-xl sm:rounded-2xl bg-[#111] border border-white/5 backdrop-blur-md cursor-pointer"
                        >
                          <motion.div 
                            className="w-8 sm:w-9 lg:w-10 h-8 sm:h-9 lg:h-10 rounded-full bg-gradient-to-r from-[#e1ba73]/20 to-[#b68938]/20 flex items-center justify-center shrink-0"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Icon size={14} className="sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px] text-[#e1ba73]" />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-xs sm:text-sm font-medium truncate">{task.title}</div>
                            <div className="text-[9px] sm:text-[10px] text-gray-500">{task.time}</div>
                          </div>
                          <motion.div 
                            className="text-[#e1ba73] font-bold text-xs sm:text-sm shrink-0"
                            animate={{
                              scale: notifications[index] ? [1, 1.2, 1] : 1
                            }}
                            transition={{ 
                              duration: 0.3,
                              delay: index * 0.3
                            }}
                          >
                            +₹{task.amount}
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
              
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>

        {/* Text Content */}
        <div className="order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-none mb-6 sm:mb-7 lg:mb-8 tracking-tight">
              Available <br/>
              <motion.span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#e1ba73] to-white inline-block"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: "200% 200%"
                }}
              >
                Everywhere.
              </motion.span>
            </h2>
            
            <motion.p 
              className="text-base sm:text-lg lg:text-xl text-gray-400 mb-8 sm:mb-9 lg:mb-10 leading-relaxed font-medium border-l-4 border-[#b68938]/30 pl-4 sm:pl-5 lg:pl-6 py-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Your earning potential travels with you. Whether you're commuting, waiting, or relaxing, 
              access thousands of verified tasks instantly from any device.
            </motion.p>
            
            {/* Animated Features */}
            <div className="space-y-4 sm:space-y-5 lg:space-y-6">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: feature.delay }}
                    whileHover={{ 
                      x: 10,
                      borderColor: "#e1ba73",
                      boxShadow: "0 10px 30px rgba(225, 186, 115, 0.1)"
                    }}
                    className="flex items-start gap-3 sm:gap-4 lg:gap-5 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-white/5 to-transparent border border-white/5 transition-all duration-500 group cursor-pointer"
                  >
                    <motion.div 
                      className="w-10 sm:w-11 lg:w-12 h-10 sm:h-11 lg:h-12 rounded-xl bg-gradient-to-r from-[#e1ba73]/10 to-[#b68938]/10 flex items-center justify-center text-[#e1ba73]"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      animate={{
                        boxShadow: [
                          "0 0 0px rgba(225,186,115,0.2)",
                          "0 0 20px rgba(225,186,115,0.4)",
                          "0 0 0px rgba(225,186,115,0.2)"
                        ]
                      }}
                    >
                      <Icon size={20} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                    </motion.div>
                    <div>
                      <h4 className="text-white font-bold text-base sm:text-lg mb-0.5 sm:mb-1">{feature.title}</h4>
                      <p className="text-gray-500 text-xs sm:text-sm font-medium">{feature.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* App Store Badges */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 sm:mt-9 lg:mt-10 flex flex-wrap gap-3 sm:gap-3.5 lg:gap-4"
            >
              {[
                { platform: "App Store", icon: Smartphone },
                { platform: "Google Play", icon: Smartphone }
              ].map((store, i) => {
                const Icon = store.icon;
                return (
                  <motion.div 
                    key={i}
                    className="px-4 sm:px-5 lg:px-6 py-2.5 sm:py-2.5 lg:py-3 rounded-xl bg-gradient-to-r from-[#1a1a1c] to-black border border-white/10 hover:border-[#e1ba73]/30 transition-colors cursor-pointer relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 relative z-10">
                      <motion.div 
                        className="w-7 sm:w-7.5 lg:w-8 h-7 sm:h-7.5 lg:h-8 rounded-lg bg-white/10 flex items-center justify-center"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-3.5 sm:w-3.5 lg:w-4 h-3.5 sm:h-3.5 lg:h-4 text-white" />
                      </motion.div>
                      <div>
                        <div className="text-[10px] sm:text-xs text-gray-400">
                          {i === 0 ? "Download on" : "Get it on"}
                        </div>
                        <div className="text-white font-bold text-xs sm:text-sm">{store.platform}</div>
                      </div>
                    </div>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-[#e1ba73]/5 to-[#b68938]/5 opacity-0 group-hover:opacity-100"
                      initial={false}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ===== TRUSTED BY CREATORS SECTION =====
const TrustedByCreators: React.FC = () => {
  interface Review {
    name: string;
    role: string;
    content: string;
    avatar: string;
    rating: number;
    stats: { tasks: number; earnings: string };
  }

  const reviews: Review[] = [
    {
      name: "Priya Sharma",
      role: "Lifestyle Influencer",
      content: "SRK Task completely changed how I monetize my 15k followers. The integration with the university ecosystem is seamless.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      rating: 5,
      stats: { tasks: 250, earnings: "₹12,500" }
    },
    {
      name: "Arjun Verma",
      role: "Student & Creator",
      content: "I've tried other platforms, but the payouts here are instant. Verified tasks mean I don't waste time on scams.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
      rating: 5,
      stats: { tasks: 180, earnings: "₹9,000" }
    },
    {
      name: "Neha Gupta",
      role: "Digital Marketer",
      content: "The SRK Grow synergy is genius. I grow my profile and earn back the investment through tasks. It's a perfect loop.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha",
      rating: 5,
      stats: { tasks: 420, earnings: "₹21,000" }
    },
    {
      name: "Rohan Das",
      role: "Micro-Influencer",
      content: "Finally, a premium platform that respects creators. The UI is beautiful and the support team is actually helpful.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
      rating: 5,
      stats: { tasks: 310, earnings: "₹15,500" }
    },
    {
      name: "Kavita Singh",
      role: "Content Creator",
      content: "Consistent daily tasks and the payout transparency is unmatched. Highly recommended for anyone in the SRK ecosystem.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavita",
      rating: 5,
      stats: { tasks: 560, earnings: "₹28,000" }
    }
  ];

  interface Badge {
    icon: React.ComponentType<any>;
    label: string;
    value: string;
  }

  const badges: Badge[] = [
    { icon: ShieldCheck, label: "100% Verified", value: "50K+" },
    { icon: Zap, label: "Instant Payouts", value: "₹10L+" },
    { icon: Clock, label: "24/7 Support", value: "99.9%" },
    { icon: Globe, label: "Global Community", value: "120+" }
  ];

  // Safe window dimensions for SSR
  const [windowSize, setWindowSize] = useState({ width: 1000, height: 1000 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-b from-black to-[#0a0705]">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-[#e1ba73]/5 via-[#b68938]/5 to-[#e1ba73]/5"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ backgroundSize: '400% 100%' }}
        />
        
        {/* Floating elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-[#e1ba73]/10 to-[#b68938]/10 blur-3xl"
            initial={{
              x: Math.random() * windowSize.width,
              y: Math.random() * windowSize.height,
            }}
            animate={{
              x: [null, Math.random() * 100 - 50],
              y: [null, Math.random() * 100 - 50],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-8 px-6 py-2.5 rounded-full border border-[#b68938]/30 bg-gradient-to-r from-[#0a0705]/50 to-black/50 backdrop-blur-xl"
          >
            <Heart className="w-4 h-4 text-[#e1ba73]" />
            <span className="text-xs font-bold text-[#e1ba73] tracking-widest uppercase">Community Love</span>
            <Heart className="w-4 h-4 text-[#e1ba73]" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
          >
            Trusted by{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e1ba73] to-white">Creators</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium"
          >
            Join thousands of verified creators who trust SRK Task for consistent earnings and premium experience.
          </motion.p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {reviews.slice(0, 3).map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative group"
            >
              <SpotlightCard>
                <div className="p-8">
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 text-[#e1ba73]/10 group-hover:text-[#e1ba73]/20 transition-colors">
                    <Quote size={40} />
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} size={16} className="fill-[#e1ba73] text-[#e1ba73]" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-300 text-lg mb-8 font-medium leading-relaxed">
                    "{review.content}"
                  </p>

                  {/* User Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full border-2 border-[#b68938]/30 p-1">
                      <img 
                        src={review.avatar} 
                        alt={review.name} 
                        className="w-full h-full rounded-full bg-black/50"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${review.name.split(' ')[0]}&background=111&color=e1ba73&bold=true`;
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-white font-bold">{review.name}</div>
                      <div className="text-[#e1ba73] text-xs uppercase tracking-wider font-bold">{review.role}</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#e1ba73]" />
                      <span className="text-sm text-gray-400">{review.stats.tasks} tasks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-[#e1ba73]" />
                      <span className="text-sm text-gray-400">{review.stats.earnings} earned</span>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {badges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 + 0.3 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 text-center group hover:border-[#e1ba73]/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#e1ba73]/10 to-[#b68938]/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-[#e1ba73]" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">{badge.value}</div>
                <div className="text-sm text-gray-400 font-medium">{badge.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

// ===== FINAL CTA =====
const FinalCTA: React.FC = () => {
  // Safe window dimensions for SSR
  const [windowSize, setWindowSize] = useState({ width: 1000, height: 1000 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="py-40 px-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-[#0a0705] via-black to-[#0a0705]"
          animate={{
            background: [
              'radial-gradient(circle at 30% 50%, rgba(225, 186, 115, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(182, 137, 56, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 30%, rgba(225, 186, 115, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 70%, rgba(182, 137, 56, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 30% 50%, rgba(225, 186, 115, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(182, 137, 56, 0.15) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-[#e1ba73] to-[#b68938]"
            initial={{
              x: Math.random() * windowSize.width,
              y: Math.random() * windowSize.height,
            }}
            animate={{
              y: [null, -100, 100, 0],
              x: [null, 50, -50, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: "spring" }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ rotate: -5, scale: 0.9 }}
            animate={{ rotate: 5, scale: 1 }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, repeatType: "reverse" },
              scale: { duration: 2, repeat: Infinity, repeatType: "reverse" }
            }}
            className="inline-flex items-center gap-3 mb-8 px-6 py-3 rounded-full border border-[#b68938]/30 bg-gradient-to-r from-[#0a0705]/80 to-black/80 backdrop-blur-xl"
          >
            <Star className="w-5 h-5 text-[#e1ba73] animate-pulse" />
            <span className="text-sm font-bold tracking-widest uppercase text-[#e1ba73]">Limited Time Offer</span>
            <Star className="w-5 h-5 text-[#e1ba73] animate-pulse" />
          </motion.div>
          
          {/* Main Heading */}
          <motion.h2 
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 5, repeat: Infinity }}
            style={{
              background: 'linear-gradient(90deg, #e1ba73, #ffffff, #b68938, #e1ba73)',
              backgroundSize: '300% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Ready to Claim Your<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e1ba73] via-white to-[#b68938]">
              Reward?
            </span>
          </motion.h2>
          
          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Join the fastest-growing community of social influencers and start earning instantly through verified tasks.
            No experience required. Start today.
          </motion.p>
          
          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <MagneticButton className="px-12 py-5 text-lg font-bold shadow-[0_0_80px_rgba(225,186,115,0.6)]">
              Create Your Free Account Now <Zap className="w-6 h-6 ml-3 animate-pulse" />
            </MagneticButton>
          </motion.div>
          
          {/* Trust Note */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-sm text-gray-500 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#b68938]" />
            <span>Trusted by 50,000+ creators worldwide. No hidden fees.</span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

// ===== FOOTER =====
const Footer: React.FC = () => {
  return (
    <footer className="pt-32 pb-12 border-t border-white/5 relative overflow-hidden bg-black">
      {/* Footer background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0705] to-black" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#e1ba73] to-[#b68938] rounded-xl blur opacity-60" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-r from-[#e1ba73] to-[#b68938] flex items-center justify-center font-bold text-black text-xl">
                  S
                </div>
              </div>
              <span className="text-2xl font-bold text-white">SRK Task</span>
            </div>
            
            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed font-medium">
              The premier platform for social influence monetization and verified ecosystem growth. 
              Built for the modern creator. Part of the SRK Ecosystem.
            </p>
            
            <div className="flex items-center gap-4">
              <MagneticButton className="px-5 py-2 text-sm">
                Join the Network
              </MagneticButton>
              <a href="#" className="text-sm text-[#e1ba73] font-bold flex items-center gap-2 hover:text-white transition-colors group">
                University Portal 
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Platform</h4>
            <ul className="space-y-4 text-gray-500 text-sm font-medium">
              {['How It Works', 'Features', 'Pricing', 'API', 'Documentation'].map(item => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase().replace(/\s/g, '-')}`} 
                    className="hover:text-[#e1ba73] transition-colors flex items-center gap-1 group"
                  >
                    {item}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Company</h4>
            <ul className="space-y-4 text-gray-500 text-sm font-medium">
              {['About Us', 'Careers', 'Blog', 'Contact', 'Privacy Policy'].map(item => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase().replace(/\s/g, '-')}`} 
                    className="hover:text-[#e1ba73] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-xs text-gray-600 font-medium">
            © 2024 SRK Task. All rights reserved. | Optimized for the SRK Ecosystem.
          </p>
          <div className="flex gap-6">
            {['Twitter', 'Instagram', 'LinkedIn', 'Discord'].map(social => (
              <a 
                key={social} 
                href="#" 
                className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-widest font-bold"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// ===== MAIN COMPONENT =====
const TaskLandingPage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <main className="bg-black min-h-screen text-white overflow-x-hidden">
      {/* Noise texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-40 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }} 
      />

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Large floating orbs */}
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-[#e1ba73]/10 to-[#b68938]/10 blur-[128px] rounded-full"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
          className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-r from-[#b68938]/10 to-[#e1ba73]/10 blur-[128px] rounded-full"
        />
      </div>

      {/* Components */}
      <Navbar />
      <Hero />
      <StatsBar />
      <TrustGrid />
      <SynergySection />
      <AvailableEverywhere />
      <TrustedByCreators />
      <FinalCTA />
      <Footer />

      {/* Global Styles */}
    
      {/* FIX: Replaced the unsupported styled-jsx syntax with a standard 
        <style> element to correctly apply global CSS styles 
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        
        body {
          background-color: #000000;
          color: #ffffff;
          font-family: 'Manrope', sans-serif;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0a0705;
          border-radius: 6px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #b68938, #e1ba73);
          border-radius: 6px;
          border: 2px solid #0a0705;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #e1ba73, #b68938);
        }
        
        /* Selection */
        ::selection {
          background: rgba(225, 186, 115, 0.3);
          color: white;
        }
        
        ::-moz-selection {
          background: rgba(225, 186, 115, 0.3);
          color: white;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 100px;
        }
        
        /* Focus styles */
        :focus-visible {
          outline: 2px solid #e1ba73;
          outline-offset: 2px;
          border-radius: 4px;
        }
        
        /* Image optimization */
        img {
          -webkit-user-drag: none;
          user-select: none;
          -webkit-user-select: none;
        }
        
        /* Gradient Animation */
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        /* Float Animation */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        /* Pulse Animation */
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        /* Smooth transitions */
        * {
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }
        
        /* Better text rendering */
        h1, h2, h3, h4, h5, h6 {
          text-rendering: optimizeLegibility;
          letter-spacing: -0.02em;
        }
      `}} />
    </main>
  );
};

export default TaskLandingPage;