/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloudIcon } from './icons';
import { Compare } from './ui/compare';
import { generateModelImage } from '../services/geminiService';
import Spinner from './Spinner';
import { getFriendlyErrorMessage } from '../lib/utils';

interface StartScreenProps {
  onModelFinalized: (modelUrl: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onModelFinalized }) => {
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
  const [generatedModelUrl, setGeneratedModelUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
        setError('Please select an image file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        setUserImageUrl(dataUrl);
        setIsGenerating(true);
        setGeneratedModelUrl(null);
        setError(null);
        try {
            const result = await generateModelImage(file);
            setGeneratedModelUrl(result);
        } catch (err) {
            setError(getFriendlyErrorMessage(err, 'Failed to create model'));
            setUserImageUrl(null);
        } finally {
            setIsGenerating(false);
        }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const reset = () => {
    setUserImageUrl(null);
    setGeneratedModelUrl(null);
    setIsGenerating(false);
    setError(null);
  };

  const screenVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <AnimatePresence mode="wait">
      {!userImageUrl ? (
        <motion.div
          key="uploader"
          className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 perspective-luxury"
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left luxury-card-3d p-12 rounded-3xl">
            <div className="max-w-2xl">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <div className="w-3 h-3 bg-gold-500 rounded-full mr-3 animate-luxury-float luxury-glow"></div>
                <span className="gold-accent font-serif font-semibold tracking-[0.2em] uppercase text-sm">Bespoke Fashion Experience</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold luxury-heading leading-[0.9] mb-8">
                SPANNICK
                <br />
                <span className="text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.3em] text-gold-400">DESIGNERS</span>
              </h1>
              <p className="text-lg md:text-xl text-platinum-200 leading-relaxed mb-10 font-light">
                Where tradition meets innovation. Upload your photograph and witness our atelier's AI craft your personal fashion avatar, ready to showcase our exclusive menswear collection with unparalleled sophistication.
              </p>
              <div className="w-32 h-0.5 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 mx-auto lg:mx-0 mb-10 luxury-glow"></div>
              <div className="flex flex-col items-center lg:items-start w-full gap-4">
                <label htmlFor="image-upload-start" className="w-full relative flex items-center justify-center px-12 py-5 text-base font-bold luxury-button-primary rounded-2xl cursor-pointer group transition-all duration-300">
                  <UploadCloudIcon className="w-6 h-6 mr-4" />
                  BEGIN YOUR TRANSFORMATION
                </label>
                <input id="image-upload-start" type="file" className="hidden" accept="image/png, image/jpeg, image/webp, image/avif, image/heic, image/heif" onChange={handleFileChange} />
                <p className="text-platinum-300 text-base text-center lg:text-left font-light leading-relaxed">Select a clear, full-body photograph. Portrait compositions are acceptable, though full-body images yield optimal results for our luxury fitting experience.</p>
                <p className="text-platinum-400 text-sm mt-2 text-center lg:text-left font-light">By proceeding, you consent to responsible and lawful use of our premium AI styling atelier.</p>
                {error && <p className="text-red-300 text-base mt-4 p-4 glass-luxury rounded-xl border border-red-400/30 luxury-glow">{error}</p>}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center perspective-luxury">
            <Compare
              firstImage="https://storage.googleapis.com/gemini-95-icons/asr-tryon.jpg"
              secondImage="https://storage.googleapis.com/gemini-95-icons/asr-tryon-model.png"
              slideMode="drag"
              className="w-full max-w-sm aspect-[2/3] rounded-3xl bg-black/30 border-2 border-gold-500/40 shadow-2xl luxury-card-3d luxury-glow"
            />
            <div className="mt-6 text-center">
              <p className="gold-accent font-serif font-semibold text-sm uppercase tracking-[0.2em]">Drag to Compare</p>
              <p className="text-platinum-300 text-xs mt-2 font-light">Witness the transformation in real-time</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="compare"
          className="w-full max-w-7xl mx-auto h-full flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 perspective-luxury"
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="md:w-1/2 flex-shrink-0 flex flex-col items-center md:items-start luxury-card-3d p-10 rounded-3xl">
            <div className="text-center md:text-left max-w-lg">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <div className="w-2 h-2 bg-gold-500 rounded-full mr-3 animate-luxury-float luxury-glow"></div>
                <span className="gold-accent font-serif font-semibold tracking-[0.2em] uppercase text-xs">Transformation Complete</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold luxury-heading leading-tight mb-6">
                Your Bespoke
                <br />
                <span className="text-3xl md:text-4xl font-light tracking-[0.2em] text-gold-400">AVATAR</span>
              </h1>
              <p className="text-base md:text-lg text-platinum-200 leading-relaxed font-light">
                Witness your metamorphosis. Drag the slider to reveal your sophisticated digital persona, meticulously crafted for the finest menswear experience.
              </p>
            </div>
            
            {isGenerating && (
              <div className="flex items-center gap-4 text-lg gold-accent font-serif mt-10 glass-luxury p-6 rounded-2xl luxury-glow">
                <Spinner />
                <span>Crafting your bespoke avatar...</span>
              </div>
            )}

            {error && 
              <div className="text-center md:text-left text-red-300 max-w-md mt-10 glass-luxury p-6 rounded-2xl border border-red-400/30 luxury-glow">
                <p className="font-serif font-bold text-lg mb-3">Transformation Interrupted</p>
                <p className="text-base mb-4">{error}</p>
                <button onClick={reset} className="text-base font-semibold gold-accent hover:text-gold-300 transition-colors font-serif">Retry Transformation</button>
              </div>
            }
            
            <AnimatePresence>
              {generatedModelUrl && !isGenerating && !error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col sm:flex-row items-center gap-6 mt-10"
                >
                  <button 
                    onClick={reset}
                    className="w-full sm:w-auto px-10 py-4 text-base font-bold luxury-button-secondary rounded-2xl cursor-pointer transition-all duration-300"
                  >
                    SELECT DIFFERENT IMAGE
                  </button>
                  <button 
                    onClick={() => onModelFinalized(generatedModelUrl)}
                    className="w-full sm:w-auto relative inline-flex items-center justify-center px-12 py-4 text-base font-bold luxury-button-primary rounded-2xl cursor-pointer group transition-all duration-300"
                  >
                    ENTER ATELIER →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="md:w-1/2 w-full flex items-center justify-center perspective-luxury">
            <div 
              className={`relative rounded-3xl transition-all duration-700 ease-in-out luxury-card-3d ${isGenerating ? 'border-2 border-gold-500/60 animate-pulse luxury-glow-intense' : 'border-2 border-gold-500/40 luxury-glow'}`}
            >
              <Compare
                firstImage={userImageUrl}
                secondImage={generatedModelUrl ?? userImageUrl}
                slideMode="drag"
                className="w-[280px] h-[420px] sm:w-[320px] sm:h-[480px] lg:w-[400px] lg:h-[600px] rounded-3xl bg-black/30 shadow-2xl"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StartScreen;
