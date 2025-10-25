"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

interface CharByCharTextProps {
  text: string;
  className?: string;
  initialDelay?: number;
  staggerDelay?: number;
}

export function CharByCharText({
  text,
  className,
  initialDelay = 0.3,
  staggerDelay = 0.4,
}: CharByCharTextProps) {
  const words = useMemo(() => {
    return text.split(" ");
  }, [text]);

  // Hemen tüm kelimeleri görünür yap, sadece opacity değişikliği olsun
  const allWordIndexes = Array.from({ length: words.length }, (_, i) => i);

  return (
    <h2 className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0 }} 
          animate={{ 
            opacity: 1,
            transition: { 
              duration: 0.5, 
              delay: initialDelay + index * staggerDelay,
              ease: "easeInOut" 
            }
          }}
          style={{ 
            display: "inline-block",
            marginRight: index < words.length - 1 ? "0.3em" : 0,
            position: "relative" // Sabit pozisyon için
          }}
        >
          {word}
        </motion.span>
      ))}
    </h2>
  );
} 