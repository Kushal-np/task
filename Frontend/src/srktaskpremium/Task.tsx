import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustGrid } from './components/TrustGrid';
import { Features } from './components/Features';
import { PhoneSection } from './components/PhoneSection';
import { Reviews } from './components/Reviews';
import { Footer } from './components/Footer';
import { Zap, Star } from 'lucide-react';
import { MagneticButton } from './components/ui/MagneticButton';
import { motion } from 'framer-motion';

// Final CTA Component
const FinalCta = () => {
    return (
        <section className="py-32 px-6 relative z-10 overflow-hidden">
            <div className="max-w-4xl mx-auto text-center relative">
                {/* Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-srk-gold/10 blur-[100px] rounded-full -z-10" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative p-12 rounded-[3rem] border border-srk-bronze/30 bg-[#0f0c08]/80 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
                >
                    <Star className="w-12 h-12 text-srk-gold mx-auto mb-8 animate-pulse" />
                    
                    <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                        Ready to Claim Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-srk-gold to-white">Reward?</span>
                    </h2>
                    
                    <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10 font-medium">
                        Join the fastest-growing community of social influencers and start earning instantly through verified tasks.
                    </p>
                    
                    <div className="flex justify-center">
                        <MagneticButton className="px-10 py-4 text-lg">
                            Create Your Free Account <Zap className="w-5 h-5 ml-2" />
                        </MagneticButton>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

function  PageDoesntExist() {
  return (
    <main className="bg-[#050505] min-h-screen text-white selection:bg-srk-gold selection:text-black overflow-x-hidden font-sans">
      <Navbar />
      <Hero />
      <TrustGrid />
      <Features />
      <PhoneSection />
      <Reviews />
      <FinalCta />
      <Footer />
    </main>
  );
}

export default PageDoesntExist;