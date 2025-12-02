import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Wallet, CheckCircle, Users, Target } from 'lucide-react';

export const PhoneSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -20]), springConfig);
  const rotateY = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [-10, 0, 10]), springConfig);
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5], [0.8, 1]), springConfig);
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [100, -100]), springConfig);

  const contentY = useTransform(scrollYProgress, [0.2, 0.8], [0, -50]);

  return (
    <section ref={containerRef} className="py-32 px-4 bg-srk-dark relative overflow-hidden flex justify-center perspective-1000 min-h-screen items-center">
       {/* Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-srk-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
        
        {/* Phone */}
        <div className="flex justify-center lg:justify-end order-2 lg:order-1">
            <motion.div
            style={{ rotateX, rotateY, scale, y, transformStyle: "preserve-3d" }}
            className="relative w-[340px] h-[700px] bg-black rounded-[55px] border-[8px] border-[#1a1a1a] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)]"
            >
            <div className="absolute -inset-[3px] rounded-[60px] bg-gradient-to-tr from-[#b68938] via-[#e1ba73] to-[#b68938] -z-10 opacity-60" />

            <div className="w-full h-full bg-[#050505] rounded-[46px] overflow-hidden relative flex flex-col font-sans">
                {/* Island */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-b-3xl z-50 flex items-center justify-center gap-3 px-3">
                     <div className="w-2 h-2 rounded-full bg-srk-gold animate-pulse"></div>
                     <span className="text-[10px] text-gray-500 font-medium">SRK Task Active</span>
                </div>

                <motion.div style={{ y: contentY }} className="pt-14 px-6 pb-6 flex flex-col gap-8 h-full">
                    
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Hello,</div>
                            <div className="text-xl font-bold text-white">Rahul Kumar</div>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-srk-gold/30 p-1">
                             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" alt="User" className="w-full h-full rounded-full bg-[#111]" />
                        </div>
                    </div>

                    <div className="w-full aspect-[1.6] rounded-3xl p-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1410] to-black border border-srk-gold/20" />
                        <div className="absolute top-0 right-0 w-40 h-40 bg-srk-gold/10 blur-[50px] rounded-full" />
                        
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start">
                                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                                    <Wallet className="w-5 h-5 text-srk-gold" />
                                </div>
                                <div className="text-srk-gold text-[10px] font-bold tracking-widest bg-srk-gold/10 px-2 py-1 rounded">PRO MEMBER</div>
                            </div>
                            
                            <div>
                                <div className="text-gray-400 text-xs mb-1 uppercase tracking-wide">Total Earnings</div>
                                <div className="text-4xl font-bold text-white tracking-tight">₹24,500</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="py-3.5 rounded-xl bg-srk-gold text-black font-bold text-sm hover:bg-srk-bronze transition shadow-[0_0_15px_rgba(225,186,115,0.3)]">Withdraw</button>
                        <button className="py-3.5 rounded-xl bg-[#1a1a1c] text-white font-bold text-sm border border-white/10 hover:bg-[#222] transition">History</button>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-white font-bold text-sm mb-3">Active Tasks</h3>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-[#111] border border-white/5 backdrop-blur-md">
                                    <div className="w-10 h-10 rounded-full bg-[#1a1a1c] flex items-center justify-center shrink-0">
                                        {i === 1 ? <Users size={18} className="text-srk-gold" /> : <Target size={18} className="text-white" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-white text-sm font-medium truncate">Instagram Follow</div>
                                        <div className="text-[10px] text-gray-500">2 mins ago</div>
                                    </div>
                                    <div className="text-srk-gold font-bold text-sm shrink-0">+₹50</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
                
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
            </div>
            </motion.div>
        </div>

        {/* Text */}
        <div className="order-1 lg:order-2">
             <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
             >
                <h2 className="text-6xl font-bold leading-none mb-8 tracking-tight">
                    Available <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-srk-gold to-white">Everywhere.</span>
                </h2>
                <p className="text-xl text-gray-400 mb-10 leading-relaxed font-medium border-l-2 border-srk-gold/30 pl-6">
                    We've engineered a seamless mobile experience. Whether you're on a crowded train or in a quiet cafe, your earning potential is always in your pocket.
                </p>
                
                <div className="space-y-6">
                    {[
                        { title: "Universal Access", desc: "Works flawlessly on iOS, Android, and Web." },
                        { title: "Low Latency", desc: "Optimized for 4G/5G networks." },
                        { title: "Secure Payouts", desc: "Bank-grade encryption for all transactions." }
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-5 p-6 rounded-2xl bg-[#111] border border-white/5 hover:border-srk-gold/20 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-srk-gold/10 flex items-center justify-center text-srk-gold group-hover:scale-110 transition-transform">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-lg mb-1">{item.title}</h4>
                                <p className="text-gray-500 text-sm font-medium">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>

      </div>
    </section>
  );
};