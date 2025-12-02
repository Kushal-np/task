import React from 'react';
import { SpotlightCard } from './ui/SpotlightCard';
import { TrendingUp, Target, ArrowRight, Shield, Zap, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export const Features = () => {
  return (
    <section id="features" className="py-32 px-4 relative z-10 bg-srk-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
             <h2 className="text-5xl font-bold mb-6 tracking-tight">
               Synergy of <span className="text-transparent bg-clip-text bg-gradient-to-r from-srk-gold to-srk-bronze">Growth</span>
             </h2>
             <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">
                 The perfect ecosystem loop. Creators purchase growth on <span className="text-white font-bold">SRK Grow</span>, which translates instantly into paid tasks for you on <span className="text-white font-bold">SRK Task</span>.
             </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[minmax(200px,auto)]">
            
            {/* The Loop */}
            <SpotlightCard className="md:col-span-6 lg:col-span-8 row-span-2 p-10">
                <div className="h-full flex flex-col relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="p-3 rounded-xl bg-srk-bronze/10 text-srk-gold border border-srk-bronze/20">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-xs font-bold tracking-widest text-srk-gold/50 uppercase">Ecosystem Core</span>
                    </div>
                    
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">The Growth Engine</h3>
                    
                    <div className="flex flex-col md:flex-row items-center gap-6 mt-auto">
                        <div className="flex-1 bg-white/5 rounded-2xl p-6 border border-white/5 w-full">
                            <div className="text-gray-500 text-xs uppercase mb-2 font-bold tracking-wider">Source</div>
                            <h4 className="text-xl font-bold text-white mb-1">SRK Grow</h4>
                            <p className="text-sm text-gray-400">Creators buy engagement</p>
                        </div>
                        
                        <div className="hidden md:flex items-center justify-center">
                            <motion.div 
                                animate={{ x: [0, 8, 0] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            >
                                <ArrowRight className="text-srk-gold" size={32} />
                            </motion.div>
                        </div>
                        <div className="md:hidden py-4">
                            <ArrowRight className="text-srk-gold rotate-90" size={24} />
                        </div>

                        <div className="flex-1 bg-srk-gold/10 rounded-2xl p-6 border border-srk-gold/30 w-full relative overflow-hidden group">
                            <div className="absolute inset-0 bg-srk-gold/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                            <div className="relative z-10">
                                <div className="text-srk-gold text-xs uppercase mb-2 font-bold tracking-wider">Destination</div>
                                <h4 className="text-xl font-bold text-white mb-1">SRK Task</h4>
                                <p className="text-sm text-srk-gold/80">You get paid instantly</p>
                            </div>
                        </div>
                    </div>
                </div>
            </SpotlightCard>

            {/* Active Tasks */}
            <SpotlightCard className="md:col-span-3 lg:col-span-4 p-8">
                <div className="flex flex-col h-full justify-between">
                    <Target className="text-srk-gold mb-4" size={32} />
                    <div>
                        <div className="text-5xl font-bold text-white mb-2 tracking-tight">500+</div>
                        <div className="text-sm text-gray-400 font-medium">Active Tasks Available Now</div>
                    </div>
                </div>
            </SpotlightCard>

            {/* Total Payouts */}
            <SpotlightCard className="md:col-span-3 lg:col-span-4 p-8">
                <div className="flex flex-col h-full justify-between">
                    <Wallet className="text-white mb-4" size={32} />
                    <div>
                        <div className="text-5xl font-bold text-white mb-2 tracking-tight">₹10L+</div>
                        <div className="text-sm text-gray-400 font-medium">Total Payouts Processed</div>
                    </div>
                </div>
            </SpotlightCard>

            {/* Users */}
            <SpotlightCard className="md:col-span-3 lg:col-span-4 p-8">
                 <div className="flex flex-col h-full justify-between">
                    <div className="flex -space-x-3 mb-4">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full bg-white/10 border-2 border-srk-dark" />
                        ))}
                    </div>
                    <div>
                        <div className="text-5xl font-bold text-white mb-2 tracking-tight">50K+</div>
                        <div className="text-sm text-gray-400 font-medium">Happy Users Globally</div>
                    </div>
                </div>
            </SpotlightCard>

            {/* Security */}
            <SpotlightCard className="md:col-span-3 lg:col-span-4 p-8 flex items-center gap-5">
                 <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white shrink-0 border border-white/10">
                     <Shield size={28} />
                 </div>
                 <div>
                     <h4 className="text-white font-bold text-lg mb-1">Verified Trust</h4>
                     <p className="text-xs text-gray-400">KYC & Manual Verification</p>
                 </div>
            </SpotlightCard>

             {/* Speed */}
             <SpotlightCard className="md:col-span-6 lg:col-span-4 p-8 flex items-center gap-5">
                 <div className="w-14 h-14 rounded-2xl bg-srk-bronze/10 flex items-center justify-center text-srk-gold shrink-0 border border-srk-bronze/20">
                     <Zap size={28} />
                 </div>
                 <div>
                     <h4 className="text-white font-bold text-lg mb-1">Lightning Fast</h4>
                     <p className="text-xs text-gray-400">Real-time task tracking</p>
                 </div>
            </SpotlightCard>
        </div>
      </div>
    </section>
  );
};