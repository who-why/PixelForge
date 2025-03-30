"use client"
import React, { useState, useEffect } from 'react';
import { Star, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Gallery image data
const galleryImages = [
  {
    id: 1,
    url: "https://plus.unsplash.com/premium_photo-1661872680599-bfb0a671f8b1?q=80&w=1986&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "AI generated cyberpunk portrait",
    hasUserRating: true,
    userRating: {
      name: "Leslie Alexander",
      rating: 5.0,
      avatars: [
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1780&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
      ]
    }
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    alt: "AI generated portrait with digital elements",
    hasUserRating: false
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80",
    alt: "AI generated colorful portrait",
    hasUserRating: false,
    hasPrompt: true,
    prompt: "Create a futuristic cityscape at dusk with neon lights, skyscrapers, flying cars, and a lively digital market"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    alt: "AI generated abstract art",
    hasUserRating: true,
    userRating: {
      name: "Mark Johnson",
      rating: 4.8,
      avatars: [
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1780&q=80"
      ]
    }
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1638803040283-7a5ffd48dad5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    alt: "AI generated futuristic landscape",
    hasUserRating: false,
    hasPrompt: true,
    prompt: "Generate a serene alien landscape with floating islands, bioluminescent plants, and twin moons in the sky"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
    alt: "AI generated digital art",
    hasUserRating: false
  }
];

const Gallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance the slider
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(galleryImages.length / 3));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Get current set of 3 images
  const getCurrentImages = () => {
    const startIdx = currentIndex * 3;
    return [
      galleryImages[startIdx % galleryImages.length],
      galleryImages[(startIdx + 1) % galleryImages.length],
      galleryImages[(startIdx + 2) % galleryImages.length]
    ];
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(galleryImages.length / 3));
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + Math.ceil(galleryImages.length / 3)) % Math.ceil(galleryImages.length / 3));
  };

  const currentImages = getCurrentImages();

  // Animation variants
  const sliderVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0
    })
  };

  return (
    <div className="mt-32 relative w-full">
      {/* Gallery images */}
      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div 
            key={currentIndex}
            custom={direction}
            variants={sliderVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="flex justify-between"
          >
            {currentImages.map((image, index) => (
              <div key={image.id} className={`w-1/3 ${index === 0 ? 'pr-2' : index === 1 ? 'px-2' : 'pl-2'}`}>
                <motion.img 
                  src={image.url} 
                  alt={image.alt} 
                  className="w-full h-64 object-cover rounded-lg"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                />
                
                {/* User rating overlay */}
                {image.hasUserRating && (
                  <motion.div 
                    className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-full py-2 px-4 flex items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex -space-x-2 mr-3">
                      {image.userRating?.avatars.map((avatar, idx) => (
                        <img 
                          key={idx}
                          src={avatar} 
                          alt="User avatar" 
                          className="w-8 h-8 rounded-full border-2 border-white"
                        />
                      ))}
                    </div>
                    <span className="text-white mr-2">{image.userRating?.name}</span>
                    <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="text-white">{image.userRating?.rating}</span>
                  </motion.div>
                )}
                
                {/* Prompt overlay */}
                {image.hasPrompt && (
                  <motion.div 
                    className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-full py-2 px-4 flex items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full mr-3">
                      <Sparkles size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">Prompt</div>
                      <div className="text-gray-300 text-xs max-w-xs truncate">
                        {image.prompt}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <motion.button
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-colors"
        onClick={handlePrev}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronLeft size={24} />
      </motion.button>
      
      <motion.button
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-colors"
        onClick={handleNext}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight size={24} />
      </motion.button>

      {/* Pagination dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: Math.ceil(galleryImages.length / 3) }).map((_, index) => (
          <motion.button
            key={index}
            className={`w-2 h-2 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-white/30'}`}
            onClick={() => {
              setIsAutoPlaying(false);
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            whileHover={{ scale: 1.5 }}
            animate={{ scale: currentIndex === index ? 1.2 : 1 }}
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;