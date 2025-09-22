/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const REMIX_SUGGESTIONS = [
  "Luxury Enhancement: Generate personalized lookbooks with styling notes.",
  "Premium Feature: Integrate with luxury fashion houses for authentic pieces.",
  "Atelier Addition: Add bespoke accessories and custom tailoring options.",
  "Style Intelligence: AI-powered style scoring and recommendations.",
  "Personal Collection: Save and curate your exclusive wardrobe.",
  "Color Mastery: Generate premium colorways and fabric variations.",
];

interface FooterProps {
  isOnDressingScreen?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isOnDressingScreen = false }) => {
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSuggestionIndex((prevIndex) => (prevIndex + 1) % REMIX_SUGGESTIONS.length);
    }, 4000); // Change suggestion every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className={`fixed bottom-0 left-0 right-0 glass-luxury border-t border-gold-500/20 p-4 z-50 ${isOnDressingScreen ? 'hidden sm:block' : ''}`}>
      <div className="mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-platinum-300 max-w-7xl px-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-gold-500 rounded-full animate-pulse-gold"></div>
          <p className="font-serif text-gold-400">
            Spannick Designers © 2024 - Luxury Menswear Atelier
          </p>
        </div>
        <div className="h-4 mt-1 sm:mt-0 flex items-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={suggestionIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="text-center sm:text-right font-serif italic text-gold-300"
              >
                {REMIX_SUGGESTIONS[suggestionIndex]}
              </motion.p>
            </AnimatePresence>
        </div>
      </div>
    </footer>
  );
};

export default Footer;