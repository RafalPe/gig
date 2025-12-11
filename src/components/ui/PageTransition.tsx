'use client';

import { motion } from 'framer-motion';
import { ReactNode, useEffect } from 'react';

export default function PageTransition({ 
  children, 
  className,
  yOffset = 10,
  duration = 0.5,
  delay = 0
}: { 
  children: ReactNode;
  className?: string; 
  yOffset?: number;
  duration?: number; 
  delay?: number;    
}) {
   useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ 
        duration, 
        delay,
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}