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
          <div className="relative z-10 flex items-center shrink-0">
            <div className="w-10 h-10 rounded-full bg-srk-gradient flex items-center justify-center shadow-[0_0_15px_rgba(182,137,56,0.3)]">
               <span className="font-bold text-black text-xl">S</span>
            </div>
            
            {/* Animated Text: Expands on Scroll */}
            <motion.div 
              style={{ width: logoTextWidth, opacity: logoTextOpacity }}
              className="overflow-hidden whitespace-nowrap flex items-center"
            >
               <span className="font-bold text-white text-xl tracking-wide ml-3">
                 SRK<span className="text-srk-gold">Task</span>
               </span>
            </motion.div>
          </div>

          {/* Desktop Links */}
          <div className="relative z-10 hidden md:flex items-center gap-10">
            {['Features', 'Trust', 'Synergy', 'Reviews'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                className="text-sm font-semibold text-gray-400 hover:text-srk-gold transition-colors relative group tracking-wider uppercase"
              >
                {item}
                <span className="absolute -bottom-1 left-1/2 w-0 h-[2px] bg-srk-bronze transition-all duration-300 group-hover:w-full group-hover:left-0" />
              </a>
            ))}
          </div>

          {/* Action */}
          <div className="relative z-10 flex items-center gap-4 shrink-0">
            <button className="hidden md:block px-6 py-2.5 rounded-full bg-white/5 hover:bg-srk-gold/10 text-srk-gold border border-srk-gold/30 font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(182,137,56,0.1)]">
              Start Earning
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
                className="text-3xl font-bold text-white hover:text-srk-gold transition-colors border-b border-white/5 pb-4"
              >
                {item}
              </a>
            ))}
            <button className="w-full py-5 rounded-2xl bg-srk-gradient text-black font-bold text-lg mt-4 shadow-[0_10px_30px_rgba(182,137,56,0.3)]">
                  Start Earning
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};