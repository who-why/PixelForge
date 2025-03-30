"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import ImageActions from "@/components/common/ImageActions";

const ImageGenerationInput = ({ generatedImage, setGeneratedImage }: any) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // First, modify how we process the image URL when receiving it
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
  
    setIsGenerating(true);
  
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to generate image");
      }
  
      const data = await response.json();
  
      // Ensure proper base64 format
      const processedImageUrl = data.imageUrl.startsWith('data:image') 
        ? data.imageUrl 
        : `data:image/jpeg;base64,${data.imageUrl}`;
      
      setGeneratedImage(processedImageUrl);
      
      // Save the base64 data without the prefix
      await fetch('/api/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          imageUrl: processedImageUrl.includes('base64,')
            ? processedImageUrl.split('base64,')[1]
            : processedImageUrl,
          type: 'generated'
        }),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-xl mt-8">
      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isGenerating && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            <span className="ml-3 text-white">
              Generating your masterpiece...
            </span>
          </div>
        )}

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="w-full p-4 pr-12 h-32 bg-[#2a2a42] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
          />
          <motion.button
            type="submit"
            className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={isGenerating}
          >
            <Sparkles size={20} />
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

const Generate = () => {
  const [displayedText, setDisplayedText] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const fullText = "Generate Awesome Image With PixelForge";

  useEffect(() => {
    if (displayedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.substring(0, displayedText.length + 1));
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [displayedText]);

  return (
    <div className="w-full min-h-screen flex flex-col gap-10 items-center justify-center text-white py-20 px-4">
    
      {!generatedImage && (
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {displayedText}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            |
          </motion.span>
        </motion.h1>
      )}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full flex flex-col items-center"
      >
        {generatedImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mt-8"
          >
            <div className="relative">
              <img
                src={generatedImage}
                alt="Generated image"
                className="max-w-[500px] h-[500px] rounded-xl shadow-2xl"
              />
              {/* <div className="absolute top-2 right-2">
                <ImageActions 
                  imageUrl={generatedImage.includes('base64,') 
                    ? generatedImage.split('base64,')[1] 
                    : generatedImage}
                  fileName="ai-generated"
                />
              </div> */}
            </div>
            <motion.button
              onClick={() => setGeneratedImage("")}
              className="mt-4 bg-[#2a2a42] text-white py-2 px-4 rounded-full hover:bg-[#3a3a52] transition-colors flex items-center justify-center mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Generate another image
            </motion.button>
          </motion.div>
        )}
      

        <ImageGenerationInput
          generatedImage={generatedImage}
          setGeneratedImage={setGeneratedImage}
        />
      </motion.div>

      <motion.div
        className="absolute top-0 left-0 w-full h-full -z-10 opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-blue-500 rounded-full blur-3xl"></div>
      </motion.div>
    </div>
  );
};

export default Generate;
