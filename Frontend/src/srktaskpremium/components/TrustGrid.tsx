import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Fingerprint, 
  ShieldCheck, 
  Globe, 
  Zap, 
  BarChart3 
} from 'lucide-react';
import { SpotlightCard } from './ui/SpotlightCard';

const features = [
  {
    icon: Bot,
    title: "Zero Bot Tolerance",
    desc: "Our proprietary AI filters reject 99.9% of automated traffic. Only real humans, real engagement.",
    color: "text-srk-gold"
  },
  {
    icon: Fingerprint,
    title: "100% Verified Identities",
    desc: "Every earner passes mandatory KYC verification via the SRK University portal.",
    color: "text-srk-bronze"
  },
  {
    icon: ShieldCheck,
    title: "Bank-Grade Security",
    desc: "256-bit encryption and secure escrow systems protect every transaction.",
    color: "text-srk-gold"
  },
  {
    icon: Zap,
    title: "Instant Settlements",
    desc: "No waiting periods. Earnings are credited to your wallet in milliseconds.",
    color: "text-srk-bronze"
  },
  {
    icon: Globe,
    title: "Global Reach",
    desc: "Access a diverse network of active users from 120+ countries ready to engage.",
    color: "text-srk-gold"
  },
  {
    icon: BarChart3,
    title: "Transparent Analytics",
    desc: "Real-time tracking of every click, follow, and interaction with granular reporting.",
    color: "text-srk-bronze"
  }
];

export const TrustGrid = () => {
  return (
    <section id="trust" className="py-32 px-4 relative z-10 bg-[#0a0705]">
      {/* Texture */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(182, 137, 56, 0.5) 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
      />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-5 px-5 py-2 rounded-full border border-srk-bronze/30 bg-srk-dark/50"
          >
            <span className="text-xs font-bold text-srk-gold tracking-widest uppercase">The SRK Standard</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
          >
            Uncompromising <span className="text-transparent bg-clip-text bg-gradient-to-r from-srk-gold to-srk-bronze">Quality</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-400 max-w-2xl mx-auto text-lg font-medium"
          >
            We don't just connect you; we protect the integrity of every interaction. Built on a foundation of trust and technology.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <SpotlightCard key={i} delay={i * 0.1} className="h-full group hover:border-srk-gold/50 transition-colors">
              <div className="p-8 flex flex-col h-full">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                     style={{ background: 'rgba(182, 137, 56, 0.15)' }}
                >
                  <feature.icon size={28} className="text-srk-gold" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-srk-gold transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  {feature.desc}
                </p>

                <div className="mt-auto pt-8">
                   <div className="h-[1px] w-12 bg-srk-bronze/30 group-hover:w-full group-hover:bg-srk-gold transition-all duration-700 ease-out" />
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};