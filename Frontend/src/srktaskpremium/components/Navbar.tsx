import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  // Animation Transforms
  // 0 -> 100px scroll range for the transition
  const width = useTransform(scrollY, [0, 100], ['100%', '900px']);
  const y = useTransform(scrollY, [0, 100], [0, 24]);
  const borderRadius = useTransform(scrollY, [0, 100], [0, 50]);
  const backgroundColor = useTransform(scrollY, [0, 100], ['rgba(26, 20, 16, 0)', 'rgba(26, 20, 16, 0.8)']);
  const borderColor = useTransform(scrollY, [0, 100], ['rgba(182, 137, 56, 0)', 'rgba(182, 137, 56, 0.3)']);
  const backdropFilter = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(20px)']);
  const flashOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  // Logo Text Animation
  // Starts hidden (0 width), expands to visible (~120px) on scroll
  const logoTextWidth = useTransform(scrollY, [0, 150], [0, 120]);
  const logoTextOpacity = useTransform(scrollY, [0, 150], [0, 1]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full flex justify-center z-[100] pointer-events-none">
        <motion.nav
          className="pointer-events-auto relative flex items-center justify-between px-6 py-4 md:px-10 transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden"
          style={{ 
            width,
            y,
            borderRadius,
            backgroundColor,
            borderColor,
            backdropFilter,
            borderWidth: '1px',
            borderStyle: 'solid',
            maxWidth: '95vw' // Ensures mobile responsiveness despite fixed pixel width transform
          }}
        >
          {/* Gold Flash Animation - Appears on Scroll */}
          <motion.div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(225, 186, 115, 0.15) 50%, transparent 100%)',
              opacity: flashOpacity
            }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ 
              repeat: Infinity, 
              duration: 3, 
              ease: "easeInOut",
              repeatDelay: 1
            }}
          />

          {/* Logo */}
          <div className="relative z-10 flex items-center shrink-0 group">
            <div className="relative">
              {/* Outer glow rings */}
              <div className="absolute inset-0 rounded-full bg-srk-gold/20 blur-xl animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-srk-gold/10 blur-2xl" />
              
              {/* Main logo */}
              <div className="relative w-10 h-10 rounded-full bg-srk-gradient flex items-center justify-center shadow-[0_0_30px_rgba(182,137,56,0.5),0_0_60px_rgba(182,137,56,0.3)] transition-all group-hover:shadow-[0_0_40px_rgba(182,137,56,0.7),0_0_80px_rgba(182,137,56,0.4)]">
                 <span className="font-bold text-black text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">S</span>
              </div>
            </div>
            
            {/* Animated Text: Expands on Scroll */}
            <motion.div 
              style={{ width: logoTextWidth, opacity: logoTextOpacity }}
              className="overflow-hidden whitespace-nowrap flex items-center"
            >
               <span className="font-bold text-white text-xl tracking-wide ml-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                 SRK<span className="text-srk-gold drop-shadow-[0_0_15px_rgba(182,137,56,0.6)]">Task</span>
               </span>
            </motion.div>
          </div>

          {/* Desktop Links */}
          <div className="relative z-10 hidden md:flex items-center gap-10">
            {['Features', 'Trust', 'Synergy', 'Reviews'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                className="text-sm font-semibold text-gray-400 hover:text-srk-gold transition-all duration-300 relative group tracking-wider uppercase hover:drop-shadow-[0_0_8px_rgba(182,137,56,0.6)]"
              >
                {item}
                <span className="absolute -bottom-1 left-1/2 w-0 h-[2px] bg-srk-bronze shadow-[0_0_8px_rgba(182,137,56,0.8)] transition-all duration-300 group-hover:w-full group-hover:left-0" />
              </a>
            ))}
          </div>

          {/* Action */}
          <div className="relative z-10 flex items-center gap-4 shrink-0">
            <button className="hidden md:block relative group px-6 py-2.5 rounded-full bg-white/5 hover:bg-srk-gold/10 text-srk-gold border border-srk-gold/30 font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(182,137,56,0.2)] hover:shadow-[0_0_30px_rgba(182,137,56,0.5),0_0_60px_rgba(182,137,56,0.3)]">
              {/* Button glow effect */}
              <span className="absolute inset-0 rounded-full bg-srk-gold/0 group-hover:bg-srk-gold/5 blur transition-all" />
              <span className="relative">Start Earning</span>
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-1 hover:text-srk-gold transition-colors hover:drop-shadow-[0_0_8px_rgba(182,137,56,0.8)]"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-[#0a0705]/98 backdrop-blur-3xl md:hidden pt-32 px-8 flex flex-col gap-8"
          >
            {['Features', 'Trust', 'Synergy', 'Reviews'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-bold text-white hover:text-srk-gold transition-all duration-300 border-b border-white/5 pb-4 hover:drop-shadow-[0_0_15px_rgba(182,137,56,0.6)] hover:border-srk-gold/20"
              >
                {item}
              </a>
            ))}
            <button className="relative group w-full py-5 rounded-2xl bg-srk-gradient text-black font-bold text-lg mt-4 shadow-[0_10px_40px_rgba(182,137,56,0.4)] hover:shadow-[0_15px_60px_rgba(182,137,56,0.6)] transition-all hover:scale-[1.02] active:scale-[0.98]">
              {/* Button inner glow */}
              <span className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/10 blur-sm transition-all" />
              <span className="relative drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">Start Earning</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};