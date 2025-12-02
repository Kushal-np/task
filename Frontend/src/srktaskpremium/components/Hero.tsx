import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Users, Shield, Target, Coins } from 'lucide-react';
import { MagneticButton } from './ui/MagneticButton';

export const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  const steps = [
    { title: "Connect", desc: "Link SRK University Account", icon: Users },
    { title: "Verify", desc: "Complete KYC Process", icon: Shield },
    { title: "Task", desc: "Follow & Engage", icon: Target },
    { title: "Earn", desc: "Instant Wallet Credit", icon: Coins }
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 px-6 overflow-hidden">
      {/* Mesh Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-srk-dark to-black" />
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(182, 137, 56, 0.15), transparent 60%)' }} 
      />
      {/* Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(182, 137, 56, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(182, 137, 56, 0.1) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
        }}
      />

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left Content */}
        <div className="space-y-10 text-center lg:text-left">
           {/* Badge */}
           <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-xl border mx-auto lg:mx-0"
              style={{
                  background: 'rgba(26, 20, 16, 0.4)',
                  borderColor: 'rgba(182, 137, 56, 0.3)',
                  boxShadow: '0 8px 32px rgba(182, 137, 56, 0.1)'
              }}
            >
              <Sparkles className="w-4 h-4 text-srk-bronze animate-pulse" />
              <span className="text-sm font-medium bg-gradient-to-r from-srk-gold to-srk-bronze bg-clip-text text-transparent">
                Welcome to SRK Task Portal
              </span>
              <Sparkles className="w-4 h-4 text-srk-bronze animate-pulse" />
            </motion.div>

            {/* Headline with Exact Gradients */}
            <div className="relative">
                <h1 className="text-6xl md:text-8xl font-bold leading-none tracking-tight">
                  <span className="block mb-2 bg-gradient-to-r from-white via-srk-gold to-white bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                    Earn Through
                  </span>
                  <span className="block bg-gradient-to-r from-srk-gold via-srk-bronze to-srk-gold bg-clip-text text-transparent animate-gradient-slow bg-[length:200%_auto]">
                    Tasks
                  </span>
                </h1>
            </div>

            {/* Subtext */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-400 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Join thousands completing simple tasks. Multiple schemes coming soon. <span className="block mt-2 text-srk-bronze font-medium">Start your journey with SRK Group.</span>
            </motion.p>

            {/* Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4"
            >
              <MagneticButton>
                Join Now & Start Earning <ArrowRight size={20} className="ml-2" />
              </MagneticButton>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center lg:justify-start gap-6 pt-8 border-t border-white/5"
            >
                <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-12 h-12 rounded-full border-2 border-[#0a0705] bg-[#1a1410] flex items-center justify-center text-srk-gold relative z-0 hover:z-10 hover:scale-110 transition-transform">
                           <Users size={18} />
                        </div>
                    ))}
                </div>
                <div className="text-left">
                    <div className="text-white font-bold text-lg">50K+ Active Members</div>
                    <div className="text-sm text-srk-bronze font-medium">Verified by SRK University</div>
                </div>
            </motion.div>
        </div>

        {/* Right Content - Process Steps */}
        <div className="relative hidden lg:block h-[600px] pl-10">
            <motion.div 
               className="absolute left-[39px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-srk-bronze/40 to-transparent"
               initial={{ scaleY: 0 }}
               animate={{ scaleY: 1 }}
               transition={{ duration: 1.5 }}
            />
            
            <div className="flex flex-col justify-between h-full py-8">
                {steps.map((step, i) => (
                    <motion.div 
                       key={i}
                       initial={{ opacity: 0, x: 50 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: 0.5 + i * 0.2 }}
                       className="relative group pl-16"
                    >
                        {/* Node */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-srk-dark border-2 border-srk-gold z-10 group-hover:scale-150 transition-transform duration-300 shadow-[0_0_15px_rgba(225,186,115,0.5)]" />
                            <div className="absolute w-8 h-[1px] bg-srk-bronze/30 right-1/2 top-1/2" />
                        </div>
                        
                        {/* Card */}
                        <div className="backdrop-blur-sm p-6 rounded-2xl w-full max-w-md transition-all duration-500 hover:scale-105"
                             style={{
                                 background: 'rgba(26, 20, 16, 0.4)',
                                 border: '1px solid rgba(182, 137, 56, 0.2)',
                             }}
                        >
                            <div className="flex items-center gap-5">
                                <div className="p-3.5 rounded-xl bg-srk-bronze/10 text-srk-gold group-hover:bg-srk-gold group-hover:text-black transition-colors duration-300">
                                    <step.icon size={22} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg group-hover:text-srk-gold transition-colors">{step.title}</h4>
                                    <p className="text-sm text-gray-500 font-medium">{step.desc}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};