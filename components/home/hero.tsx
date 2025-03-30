"use client"
import React from 'react';
import { Sparkles, FileText, RotateCcw, Square } from 'lucide-react';
import GenerateButton from '@/components/ui/GenerateButton';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  // Animation variants for text
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const wordVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  const decorationVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.5
      }
    }
  };

  
  const titleWords = ["Create", "Powerful", "AI", "art", "or"];
  const subtitleWords = ["image", "in", "seconds"];

  return (
    <div className="flex flex-col items-center mt-20 relative">
    
      <motion.div 
        className="absolute top-0 left-1/4 -translate-x-20 -translate-y-10"
        variants={decorationVariants}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <motion.div 
          className="bg-[#2a2a42] p-3 rounded-full"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.8 }}
        >
          <RotateCcw size={20} className="text-white" />
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="absolute top-1/4 right-1/4 translate-x-20"
        variants={decorationVariants}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        <motion.div 
          className="bg-[#2a2a42] p-3 rounded-full"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.8 }}
        >
          <Sparkles size={20} className="text-white" />
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="absolute top-1/4 left-1/2 -translate-y-32"
        variants={decorationVariants}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        <motion.div 
          className="bg-[#2a2a42] p-3 rounded-full"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.8 }}
        >
          <FileText size={20} className="text-white" />
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-0 right-1/4 translate-y-20"
        variants={decorationVariants}
        initial="hidden"
        animate="visible"
        custom={4}
      >
        <motion.div 
          className="bg-[#2a2a42] p-3 rounded-full"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.8 }}
        >
          <Square size={20} className="text-white" />
        </motion.div>
      </motion.div>
      
      {/* Main content */}
      <motion.h1 
        className="text-white text-6xl font-bold text-center leading-tight"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-wrap justify-center gap-x-5">
          {titleWords.map((word, index) => (
            <motion.span key={index} variants={wordVariants}>
              {word}
            </motion.span>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-x-5 text-[#b8b8d9]">
          {subtitleWords.map((word, index) => (
            <motion.span key={index} variants={wordVariants}>
              {word}
            </motion.span>
          ))}
        </div>
      </motion.h1>
      
      <motion.p 
        className="text-[#b8b8d9] text-center mt-6 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        Create amazing images effortlessly with AI technology just share your ideas, and watch them
        come to life in seconds!
      </motion.p>
      
      <motion.div 
        className="mt-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 10 }}
      >
        <GenerateButton />
      </motion.div>
    </div>
  );
};

export default Hero;