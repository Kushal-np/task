import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Menu, X, ArrowRight, TrendingUp, Users, Target, Zap, 
  CheckCircle, Shield, Sparkles, Globe, BarChart3, 
  ChevronRight, Package, Layers, Link2 
} from 'lucide-react';

// Enhanced Magnetic Button with Particle Effect
const MagneticButton = ({ children, className = "", onClick = () => {} }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef(null);

  const handleMouseMove = (e) => {
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
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? '100%' : '-100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// Enhanced Spotlight Card with 3D Tilt Effect
const SpotlightCard = ({ children, delay = 0, className = "" }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.1s ease-out'
      }}
      className={`relative backdrop-blur-md rounded-3xl border border-[rgba(182,137,56,0.2)] bg-[rgba(26,20,16,0.4)] hover:border-[rgba(182,137,56,0.4)] transition-all duration-300 ${className}`}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#b68938]/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      {children}
    </motion.div>
  );
};

// Navbar Component



const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Removed: useScroll() and all useTransform() hooks

  return (
    <>
      {/* This outer div ensures the navbar is fixed, full-width, and centered.
        'w-full flex justify-center' makes the inner content center-aligned. 
      */}
      <div className="fixed top-0 w-full flex justify-center z-[100] pointer-events-none">
        <motion.nav
          className="pointer-events-auto relative flex items-center justify-between px-6 py-4 md:px-10"
          style={{
            // Set fixed styles for the centered, static look
            width: '900px', // Fixed width for the centered bar
            borderRadius: '50px', // Fixed border radius
            backgroundColor: 'rgba(26, 20, 16, 0.8)', // Fixed background color
            backdropFilter: 'blur(20px)', // Fixed backdrop filter
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'rgba(182, 137, 56, 0.3)',
            maxWidth: '95vw', // Ensures it shrinks on very small screens
            marginTop: '24px' // Fixed margin to move it down from the very top
          }}
        >
          <div className="relative z-10 flex items-center shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] flex items-center justify-center shadow-[0_0_15px_rgba(182,137,56,0.3)]">
              <span className="font-bold text-black text-xl">S</span>
            </div>
            
            {/* The logo text must be visible, so we hardcode the styles */}
            <div className="overflow-hidden whitespace-nowrap flex items-center">
              <span className="font-bold text-white text-xl tracking-wide ml-3">
                SRK<span className="text-[#b68938]">Grow</span>
              </span>
            </div>
          </div>

          <div className="relative z-10 hidden md:flex items-center gap-10">
            {['Packages', 'Flow', 'Benefits', 'FAQ'].map((item) => (
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
            {['Packages', 'Flow', 'Benefits', 'FAQ'].map((item) => (
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

// You must ensure this component is exported and includes necessary imports (like React, useState, framer-motion, and lucide-react icons)
// export default Navbar;

// Hero Section with Enhanced Animations
const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-[#1a1410] to-black" />
      
      {/* Animated gradient orbs */}
      <motion.div 
        className="absolute top-20 left-1/4 w-96 h-96 bg-[#b68938]/20 rounded-full blur-[128px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
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
          delay: 1
        }}
      />

      <div className="absolute inset-0 z-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(182, 137, 56, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(182, 137, 56, 0.1) 1px, transparent 1px)',
            backgroundSize: '100px 100px',
          }}
        />
        
        {/* Floating particles */}
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
            background: 'rgba(26, 20, 16, 0.4)',
            borderColor: 'rgba(182, 137, 56, 0.3)',
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#b68938]/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
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
            style={{ backgroundSize: '200% 100%' }}
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
          The bridge between <span className="text-[#e1ba73] font-bold">SRK University</span> and <span className="text-[#e1ba73] font-bold">SRK Task</span>. Choose your growth package, unlock verified engagement, and watch your influence expand exponentially.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <MagneticButton>
            Select Your Package <ArrowRight size={20} className="ml-2" />
          </MagneticButton>
          <motion.button 
            className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold text-sm uppercase tracking-widest transition-all relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">See How It Works</span>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
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
            { label: 'Active Users', value: '50K+' },
            { label: 'Engagements', value: '10M+' },
            { label: 'Real Accounts', value: '99.9%' }
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
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Flow Section
const FlowSection = () => {
  const steps = [
    {
      number: "01",
      title: "SRK University",
      subtitle: "Verified Students",
      description: "Students register through the official SRK University portal with complete KYC verification.",
      icon: Shield,
      color: "from-blue-500 to-blue-600"
    },
    {
      number: "02",
      title: "SRK Grow",
      subtitle: "Package Selection",
      description: "You choose your growth package based on your needs - followers, likes, engagement, or comprehensive plans.",
      icon: Package,
      color: "from-[#b68938] to-[#e1ba73]",
      highlight: true
    },
    {
      number: "03",
      title: "SRK Task",
      subtitle: "Task Distribution",
      description: "Your selected package automatically generates verified tasks distributed to active SRK Task users.",
      icon: Target,
      color: "from-green-500 to-green-600"
    }
  ];

  return (
    <section id="flow" className="py-32 px-6 bg-[#0a0705] relative overflow-hidden">
      {/* Animated background patterns */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(182, 137, 56, 0.5) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        animate={{ backgroundPosition: ['0px 0px', '24px 24px'] }}
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
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-bold text-[#b68938] tracking-widest uppercase relative z-10">The Ecosystem</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b68938] to-[#e1ba73]">It Works</span>
          </h2>
          
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">
            A seamless three-step ecosystem connecting verified users, growth packages, and authentic engagement.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Enhanced Connection Lines */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 z-0 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-[#b68938] to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {steps.map((step, i) => (
            <SpotlightCard key={i} delay={i * 0.2} className={`relative z-10 group ${step.highlight ? 'ring-2 ring-[#b68938]/50' : ''}`}>
              <div className="p-8 relative">
                <div className="flex items-center justify-between mb-6">
                  <motion.span 
                    className="text-6xl font-bold text-white/5"
                    whileHover={{ scale: 1.1, color: 'rgba(182, 137, 56, 0.1)' }}
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
                
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#b68938] transition-colors">{step.title}</h3>
                <div className="text-[#b68938] font-bold text-sm uppercase tracking-wider mb-4">{step.subtitle}</div>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
                
                {step.highlight && (
                  <motion.div 
                    className="mt-6 px-4 py-2 rounded-lg bg-[#b68938]/10 border border-[#b68938]/30 relative overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-[#b68938]/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
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

// Enhanced Packages Section with Hover Effects
const PackagesSection = () => {
  const [showSpecificPackages, setShowSpecificPackages] = useState(false);

  const generalPackages = [
    {
      name: "Starter",
      price: "₹999",
      period: "one-time",
      description: "Perfect for testing the waters",
      features: [
        "500 Instagram Followers",
        "1,000 Post Likes",
        "100% Verified Accounts",
        "7-Day Delivery",
        "Basic Analytics"
      ],
      popular: false
    },
    {
      name: "Intermediate",
      price: "₹2,499",
      period: "one-time",
      description: "Most popular for creators",
      features: [
        "2,000 Instagram Followers",
        "5,000 Post Likes",
        "100% Verified Accounts",
        "3-Day Delivery",
        "Advanced Analytics",
        "Priority Support"
      ],
      popular: true
    },
    {
      name: "Pro",
      price: "₹4,999",
      period: "one-time",
      description: "For serious influencers",
      features: [
        "5,000 Instagram Followers",
        "15,000 Post Likes",
        "100% Verified Accounts",
        "24-Hour Delivery",
        "Premium Analytics",
        "Dedicated Manager",
        "Custom Targeting"
      ],
      popular: false
    },
  ];

  const specificPackages = [
    {
      name: "Facebook Boost",
      price: "₹3,999",
      period: "one-time",
      description: "Maximize your reach on Facebook.",
      features: [
        "2,500 Page Followers",
        "10,000 Post Engagements",
        "100% Verified Accounts",
        "5-Day Delivery",
        "Page Insights Report"
      ],
      popular: false,
      platform: "Facebook"
    },
    {
      name: "TikTok Trendsetter",
      price: "₹1,999",
      period: "one-time",
      description: "Go viral with targeted TikTok engagement.",
      features: [
        "5,000 Video Views",
        "2,000 Video Likes",
        "100% Verified Accounts",
        "48-Hour Delivery",
        "Trending Hashtag Suggestions"
      ],
      popular: true,
      platform: "TikTok"
    },
    {
      name: "Instagram Elite",
      price: "₹7,999",
      period: "one-time",
      description: "Dominate the 'gram with premium growth.",
      features: [
        "10,000 Instagram Followers",
        "30,000 Post Likes",
        "100% Verified Accounts",
        "Dedicated Manager",
        "Story View Boosts"
      ],
      popular: false,
      platform: "Instagram"
    }
  ];

  const PackageCard = ({ pkg, i }) => (
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
        className={`relative h-full ${pkg.popular ? 'ring-2 ring-[#b68938] md:scale-105' : ''}`}
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
          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          
          <h3 className="text-2xl font-bold text-white mb-2 relative z-10">{pkg.name}</h3>
          <p className="text-gray-500 text-sm mb-6 relative z-10">{pkg.description}</p>
          
          <div className="mb-8 relative z-10">
            <motion.span 
              className="text-5xl font-bold text-[#b68938]"
              whileHover={{ scale: 1.1 }}
            >
              {pkg.price}
            </motion.span>
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
                <CheckCircle size={20} className="text-[#b68938] shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">{feature}</span>
              </motion.li>
            ))}
          </ul>

          <motion.button
            className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all relative overflow-hidden group ${
              pkg.popular 
                ? 'bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black hover:shadow-[0_0_40px_rgba(182,137,56,0.5)]'
                : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {pkg.popular && (
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            <span className="relative z-10">Select Package</span>
          </motion.button>
        </div>
      </SpotlightCard>
    </motion.div>
  );

  return (
    <section id="packages" className="py-32 px-6 bg-gradient-to-b from-[#0a0705] to-black relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#b68938]/5 blur-[150px] rounded-full" />
      
      {/* Floating orbs */}
      <motion.div 
        className="absolute top-20 right-20 w-64 h-64 bg-[#e1ba73]/10 rounded-full blur-[80px]"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b68938] to-[#e1ba73]">Growth Package</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">
            Transparent pricing. No hidden fees. 100% verified engagement from real SRK Task users.
          </p>
        </div>

        {/* 1. General Packages (Always shown) */}
        <div className="grid md:grid-cols-3 gap-8">
          {generalPackages.map((pkg, i) => (
            <PackageCard key={`general-${i}`} pkg={pkg} i={i} />
          ))}
        </div>
        
        {/* 2. Specific Packages Button */}
        <div className="mt-16 text-center relative right-[25%] lg:right-[15%] translate-x-[+50%]">
            {!showSpecificPackages && (
                <MagneticButton onClick={() => setShowSpecificPackages(true)}>
                    View Platform-Specific Packages <ArrowRight size={20} className="ml-2" />
                </MagneticButton>
            )}
        </div>

        {/* 3. Conditional Specific Packages */}
        <AnimatePresence>
            {showSpecificPackages && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="overflow-hidden pt-16"
                >
                    <div className="text-center mb-10">
                        <h3 className="text-3xl font-bold text-white mb-3">
                            Platform-Specific Boosts
                        </h3>
                        <p className="text-gray-500">
                            Tailor your growth for maximum impact on specific social channels.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {specificPackages.map((pkg, i) => (
                            <PackageCard key={`specific-${i}`} pkg={pkg} i={i} />
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
const BenefitsSection = () => {
  const benefits = [
    {
      icon: Shield,
      title: "100% Verified Users",
      description: "Every engagement comes from KYC-verified SRK University students. Zero bots, zero fake accounts."
    },
    {
      icon: Zap,
      title: "Lightning Fast Delivery",
      description: "Watch your metrics grow in real-time. Our distributed network ensures rapid task completion."
    },
    {
      icon: BarChart3,
      title: "Transparent Analytics",
      description: "Track every follower, like, and engagement with detailed dashboards and real-time reporting."
    },
    {
      icon: Globe,
      title: "Organic Algorithm Boost",
      description: "Authentic engagement signals improve your content's reach across all social platforms."
    },
    {
      icon: Users,
      title: "Targeted Demographics",
      description: "Reach the audience that matters most to your brand with precision targeting options."
    },
    {
      icon: CheckCircle,
      title: "24/7 Dedicated Support",
      description: "Our expert team is always available to help you optimize your growth strategy."
    }
  ];

  return (
    <section id="benefits" className="py-32 px-6 bg-[#0a0705] relative overflow-hidden">
      {/* Animated background gradient */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full opacity-20"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ background: 'radial-gradient(circle at center, rgba(182, 137, 56, 0.1), transparent 70%)' }}
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b68938] to-[#e1ba73]">SRK Grow</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">
            Built on trust, powered by technology, and designed for sustainable growth.
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
              <SpotlightCard delay={i * 0.1} className="group hover:border-[#b68938]/50 transition-all h-full">
                <div className="p-8 relative">
                  {/* Hover glow effect */}
                  <motion.div 
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'radial-gradient(circle at center, rgba(182, 137, 56, 0.1), transparent 70%)' }}
                  />

                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-[#b68938]/15 flex items-center justify-center mb-6 relative"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <benefit.icon size={28} className="text-[#b68938] relative z-10" />
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

                  {/* Bottom accent line */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#b68938] to-[#e1ba73]"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
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

// Enhanced CTA Section
const CTASection = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#b68938]/20 via-black to-[#e1ba73]/20" />
      
      {/* Animated gradient background */}
      <motion.div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(182, 137, 56, 0.3), transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating particles */}
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
          style={{ background: 'rgba(26, 20, 16, 0.6)' }}
        >
          {/* Rotating gradient border effect */}
          <motion.div 
            className="absolute inset-0 rounded-3xl"
            style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(182, 137, 56, 0.3), transparent)',
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
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b68938] to-[#e1ba73]">Grow?</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-400 mb-10 leading-relaxed relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Join thousands of creators who've amplified their reach through the SRK ecosystem. Select your package and start growing today.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <MagneticButton>
              View All Packages <ArrowRight size={20} className="ml-2" />
            </MagneticButton>
            <motion.button 
              className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold text-sm uppercase tracking-widest transition-all relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">Contact Sales</span>
            </motion.button>
          </motion.div>

          <motion.div 
            className="mt-12 pt-8 border-t border-white/10 flex items-center justify-center gap-8 text-sm text-gray-500 flex-wrap relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            {['No Contract', 'Instant Activation', '24/7 Support'].map((item, i) => (
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
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
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
              The central hub for social media growth in the SRK ecosystem. Connecting verified users with authentic engagement opportunities.
            </p>
            <MagneticButton className="px-5 py-2 text-sm">
              Get Started
            </MagneticButton>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Platform</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              {['How It Works', 'Pricing', 'FAQ'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(/\s/g, '')}`} className="hover:text-[#b68938] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Ecosystem</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              {['SRK University', 'SRK Task', 'SRK Grow', 'Support'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-[#b68938] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">© 2024 SRK Grow. All rights reserved. Part of the SRK Ecosystem.</p>
          <div className="flex gap-6">
            {['Twitter', 'Instagram', 'LinkedIn'].map((social) => (
              <a key={social} href="#" className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-widest font-bold">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// FAQ Section
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How is SRK Grow different from other growth services?",
      answer: "SRK Grow is the only platform backed by a verified university ecosystem. Every engagement comes from KYC-verified students, ensuring 100% authentic interactions that comply with platform guidelines."
    },
    {
      question: "How long does it take to see results?",
      answer: "Delivery times vary by package: Starter (7 days), Growth (3 days), and Pro (24 hours). You'll see real-time progress in your dashboard as tasks are completed by verified users."
    },
    {
      question: "Are the followers and engagements permanent?",
      answer: "Yes! Since all engagements come from real, active accounts, they remain permanent. We maintain a 99%+ retention rate, far exceeding industry standards."
    },
    {
      question: "Can I target specific demographics?",
      answer: "Pro packages include custom targeting options. You can specify age ranges, locations, interests, and more to ensure your growth aligns with your target audience."
    },
    {
      question: "Is this safe for my account?",
      answer: "Absolutely. Our method uses only organic engagement from real users completing voluntary tasks. This is indistinguishable from natural growth and fully compliant with all platform terms of service."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets. All transactions are secured with bank-grade encryption through our payment partners."
    }
  ];

  return (
    <section id="faq" className="py-32 px-6 bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b68938] to-[#e1ba73]">Questions</span>
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
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#b68938] to-[#e1ba73] opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <span className="text-white font-bold text-lg pr-8 group-hover:text-[#b68938] transition-colors">{faq.question}</span>
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
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6 pt-2">
                      <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
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

// Main App Component
export default function PackageSelectionPage() {
  return (
    <div className="bg-black text-white min-h-screen" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
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
      <Hero />
      <FlowSection />
      <PackagesSection />
      <BenefitsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}