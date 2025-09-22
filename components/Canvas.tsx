/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { RotateCcwIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import Spinner from './Spinner';
import { AnimatePresence, motion } from 'framer-motion';

interface CanvasProps {
  displayImageUrl: string | null;
  onStartOver: () => void;
  isLoading: boolean;
  loadingMessage: string;
  onSelectPose: (index: number) => void;
  poseInstructions: string[];
  currentPoseIndex: number;
  availablePoseKeys: string[];
}

const Canvas: React.FC<CanvasProps> = ({ displayImageUrl, onStartOver, isLoading, loadingMessage, onSelectPose, poseInstructions, currentPoseIndex, availablePoseKeys }) => {
  const [isPoseMenuOpen, setIsPoseMenuOpen] = useState(false);
  
  const handlePreviousPose = () => {
    if (isLoading || availablePoseKeys.length <= 1) return;

    const currentPoseInstruction = poseInstructions[currentPoseIndex];
    const currentIndexInAvailable = availablePoseKeys.indexOf(currentPoseInstruction);
    
    // Fallback if current pose not in available list (shouldn't happen)
    if (currentIndexInAvailable === -1) {
        onSelectPose((currentPoseIndex - 1 + poseInstructions.length) % poseInstructions.length);
        return;
    }

    const prevIndexInAvailable = (currentIndexInAvailable - 1 + availablePoseKeys.length) % availablePoseKeys.length;
    const prevPoseInstruction = availablePoseKeys[prevIndexInAvailable];
    const newGlobalPoseIndex = poseInstructions.indexOf(prevPoseInstruction);
    
    if (newGlobalPoseIndex !== -1) {
        onSelectPose(newGlobalPoseIndex);
    }
  };

  const handleNextPose = () => {
    if (isLoading) return;

    const currentPoseInstruction = poseInstructions[currentPoseIndex];
    const currentIndexInAvailable = availablePoseKeys.indexOf(currentPoseInstruction);

    // Fallback or if there are no generated poses yet
    if (currentIndexInAvailable === -1 || availablePoseKeys.length === 0) {
        onSelectPose((currentPoseIndex + 1) % poseInstructions.length);
        return;
    }
    
    const nextIndexInAvailable = currentIndexInAvailable + 1;
    if (nextIndexInAvailable < availablePoseKeys.length) {
        // There is another generated pose, navigate to it
        const nextPoseInstruction = availablePoseKeys[nextIndexInAvailable];
        const newGlobalPoseIndex = poseInstructions.indexOf(nextPoseInstruction);
        if (newGlobalPoseIndex !== -1) {
            onSelectPose(newGlobalPoseIndex);
        }
    } else {
        // At the end of generated poses, generate the next one from the master list
        const newGlobalPoseIndex = (currentPoseIndex + 1) % poseInstructions.length;
        onSelectPose(newGlobalPoseIndex);
    }
  };
  
  return (
    <div className="w-full h-full flex items-center justify-center p-4 relative animate-luxury-zoom-in group perspective-luxury">
      {/* Start Over Button */}
      <button 
          onClick={onStartOver}
          className="absolute top-6 left-6 z-30 flex items-center justify-center text-center luxury-button-secondary py-3 px-6 rounded-2xl transition-all duration-300 ease-in-out active:scale-95 text-sm font-semibold uppercase tracking-wider"
      >
          <RotateCcwIcon className="w-4 h-4 mr-2" />
          NEW SESSION
      </button>

      {/* Image Display or Placeholder */}
      <div className="relative w-full h-full flex items-center justify-center luxury-card-3d rounded-3xl overflow-hidden">
        {displayImageUrl ? (
          <img
            key={displayImageUrl} // Use key to force re-render and trigger animation on image change
            src={displayImageUrl}
            alt="Virtual try-on model"
            className="max-w-full max-h-full object-contain transition-opacity duration-500 animate-luxury-fade-in rounded-2xl luxury-glow"
          />
        ) : (
            <div className="w-[400px] h-[600px] glass-luxury border border-gold-500/30 rounded-2xl flex flex-col items-center justify-center luxury-glow">
              <Spinner />
              <p className="text-md font-serif gold-accent mt-6 tracking-wider">Preparing Avatar...</p>
            </div>
        )}
        
        <AnimatePresence>
          {isLoading && (
              <motion.div
                  className="absolute inset-0 glass-luxury backdrop-blur-xl flex flex-col items-center justify-center z-20 rounded-2xl luxury-glow-intense"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
              >
                  <Spinner />
                  {loadingMessage && (
                      <p className="text-lg font-serif gold-accent mt-6 text-center px-4 tracking-wide">{loadingMessage}</p>
                  )}
              </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pose Controls */}
      {displayImageUrl && !isLoading && (
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          onMouseEnter={() => setIsPoseMenuOpen(true)}
          onMouseLeave={() => setIsPoseMenuOpen(false)}
        >
          {/* Pose popover menu */}
          <AnimatePresence>
              {isPoseMenuOpen && (
                  <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute bottom-full mb-4 w-72 glass-luxury backdrop-blur-xl rounded-2xl p-4 border border-gold-500/30 luxury-glow"
                  >
                      <div className="grid grid-cols-2 gap-3">
                          {poseInstructions.map((pose, index) => (
                              <button
                                  key={pose}
                                  onClick={() => onSelectPose(index)}
                                  disabled={isLoading || index === currentPoseIndex}
                                  className="w-full text-left text-xs font-medium text-platinum-100 p-3 rounded-xl hover:bg-gold-500/20 disabled:opacity-70 disabled:bg-gold-500/30 disabled:font-bold disabled:cursor-not-allowed transition-all duration-200 font-serif tracking-wide"
                              >
                                  {pose}
                              </button>
                          ))}
                      </div>
                  </motion.div>
              )}
          </AnimatePresence>
          
          <div className="flex items-center justify-center gap-3 glass-luxury backdrop-blur-xl rounded-2xl p-3 border border-gold-500/30 luxury-glow">
            <button 
              onClick={handlePreviousPose}
              aria-label="Previous pose"
              className="p-3 rounded-xl hover:bg-gold-500/20 active:scale-90 transition-all disabled:opacity-50 luxury-button-secondary"
              disabled={isLoading}
            >
              <ChevronLeftIcon className="w-5 h-5 text-platinum-100" />
            </button>
            <span className="text-sm font-semibold text-platinum-100 w-52 text-center truncate font-serif tracking-wide" title={poseInstructions[currentPoseIndex]}>
              {poseInstructions[currentPoseIndex]}
            </span>
            <button 
              onClick={handleNextPose}
              aria-label="Next pose"
              className="p-3 rounded-xl hover:bg-gold-500/20 active:scale-90 transition-all disabled:opacity-50 luxury-button-secondary"
              disabled={isLoading}
            >
              <ChevronRightIcon className="w-5 h-5 text-platinum-100" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;