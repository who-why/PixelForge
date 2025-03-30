"use client";
import React from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const GenerateButton: React.FC = () => {
  return (
    <Link href="/generate">
      <motion.button
        className="bg-transparent border cursor-pointer border-[#6c6c8b] text-white py-3 px-8 rounded-full flex items-center hover:bg-[#3a3a52] transition-all duration-300"
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 15px rgba(159, 145, 255, 0.5)",
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        Generate
        <motion.div
          className="ml-2"
          initial={{ rotate: 0 }}
          whileHover={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Sparkles size={18} />
        </motion.div>
      </motion.button>
    </Link>
  );
};

export default GenerateButton;
