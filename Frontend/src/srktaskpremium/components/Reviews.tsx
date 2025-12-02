import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: "Priya Sharma",
    role: "Lifestyle Influencer",
    content: "SRK Task completely changed how I monetize my 15k followers. The integration with the university ecosystem is seamless.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
  },
  {
    name: "Arjun Verma",
    role: "Student & Creator",
    content: "I've tried other platforms, but the payouts here are instant. Verified tasks mean I don't waste time on scams.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun"
  },
  {
    name: "Neha Gupta",
    role: "Digital Marketer",
    content: "The SRK Grow synergy is genius. I grow my profile and earn back the investment through tasks. It's a perfect loop.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha"
  },
  {
    name: "Rohan Das",
    role: "Micro-Influencer",
    content: "Finally, a premium platform that respects creators. The UI is beautiful and the support team is actually helpful.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan"
  },
  {
    name: "Kavita Singh",
    role: "Content Creator",
    content: "Consistent daily tasks and the payout transparency is unmatched. Highly recommended for anyone in the SRK ecosystem.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavita"
  }
];

const ReviewCard = ({ review }: { review: typeof reviews[0] }) => (
  <div className="w-[350px] md:w-[450px] p-8 rounded-3xl backdrop-blur-sm mx-4 flex-shrink-0 relative group transition-colors duration-300"
       style={{
           background: 'rgba(26, 20, 16, 0.4)',
           border: '1px solid rgba(182, 137, 56, 0.2)'
       }}
  >
     <div className="absolute top-8 right-8 text-srk-gold/10 group-hover:text-srk-gold/20 transition-colors">
         <Quote size={40} />
     </div>
     
     <div className="flex items-center gap-1 mb-6">
         {[1,2,3,4,5].map(i => (
             <Star key={i} size={16} className="fill-srk-gold text-srk-gold" />
         ))}
     </div>

     <p className="text-gray-300 text-lg mb-8 font-medium leading-relaxed">"{review.content}"</p>

     <div className="flex items-center gap-4">
         <div className="w-12 h-12 rounded-full border border-srk-bronze/30 p-1">
             <img src={review.avatar} alt={review.name} className="w-full h-full rounded-full bg-black/50" />
         </div>
         <div>
             <div className="text-white font-bold">{review.name}</div>
             <div className="text-srk-gold text-xs uppercase tracking-wider font-bold">{review.role}</div>
         </div>
     </div>
  </div>
);

export const Reviews = () => {
  return (
    <section id="reviews" className="py-32 relative overflow-hidden bg-srk-dark border-y border-white/5">
       {/* Bg */}
       <div className="absolute inset-0 bg-srk-gold/5 pointer-events-none" />
       
       <div className="max-w-7xl mx-auto px-6 text-center mb-20 relative z-10">
           <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-srk-gold to-white">Creators</span></h2>
           <p className="text-gray-400 font-medium">Join thousands of verified members earning daily.</p>
       </div>

       {/* Marquee */}
       <div className="relative flex overflow-x-hidden w-full">
           <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-srk-dark to-transparent z-10" />
           <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-srk-dark to-transparent z-10" />
           
           <motion.div 
             className="flex"
             animate={{ x: ["0%", "-50%"] }}
             transition={{ duration: 40, ease: "linear", repeat: Infinity }}
           >
               {reviews.map((review, i) => (
                   <ReviewCard key={i} review={review} />
               ))}
               {reviews.map((review, i) => (
                   <ReviewCard key={`dup-${i}`} review={review} />
               ))}
           </motion.div>
       </div>
    </section>
  );
};