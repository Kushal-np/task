import React, { useRef, useState, ComponentProps } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps extends ComponentProps<typeof motion.button> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick, 
  ...props 
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.25, y: y * 0.25 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles = "relative group px-10 py-5 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300";
  
  // Explicit gradient from instruction
  const primaryStyle = {
    background: 'linear-gradient(135deg, rgba(225, 186, 115, 0.9), rgba(182, 137, 56, 0.9))',
    boxShadow: '0 20px 60px rgba(182, 137, 56, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    color: '#000'
  };

  const secondaryStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(182, 137, 56, 0.3)',
    color: '#e1ba73'
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${className}`}
      style={variant === 'primary' ? primaryStyle : secondaryStyle}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};