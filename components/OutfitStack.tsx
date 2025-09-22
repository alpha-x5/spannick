/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { OutfitLayer } from '../types';
import { Trash2Icon } from './icons';

interface OutfitStackProps {
  outfitHistory: OutfitLayer[];
  onRemoveLastGarment: () => void;
}

const OutfitStack: React.FC<OutfitStackProps> = ({ outfitHistory, onRemoveLastGarment }) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-serif tracking-[0.1em] text-platinum-100 border-b border-gold-500/30 pb-3 mb-4 luxury-heading">Ensemble Stack</h2>
      <div className="space-y-2">
        {outfitHistory.map((layer, index) => (
          <div
            key={layer.garment?.id || 'base'}
            className="flex items-center justify-between glass-luxury p-4 rounded-xl animate-luxury-fade-in border border-gold-500/20 luxury-glow"
          >
            <div className="flex items-center overflow-hidden">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 mr-4 text-xs font-bold text-black bg-gold-500 rounded-full luxury-glow font-serif">
                  {index + 1}
                </span>
                {layer.garment && (
                    <img src={layer.garment.url} alt={layer.garment.name} className="flex-shrink-0 w-14 h-14 object-cover rounded-xl mr-4 border border-gold-500/30 luxury-glow" />
                )}
                <span className="font-semibold text-platinum-100 truncate font-serif tracking-wide" title={layer.garment?.name}>
                  {layer.garment ? layer.garment.name : 'Base Avatar'}
                </span>
            </div>
            {index > 0 && index === outfitHistory.length - 1 && (
               <button
                onClick={onRemoveLastGarment}
                className="flex-shrink-0 text-platinum-400 hover:text-red-400 transition-colors p-3 rounded-xl hover:bg-red-500/20 luxury-button-secondary"
                aria-label={`Remove ${layer.garment?.name}`}
              >
                <Trash2Icon className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
        {outfitHistory.length === 1 && (
            <p className="text-center text-sm text-platinum-300 pt-6 font-serif italic">Your curated pieces will appear here. Select an item from the atelier collection below.</p>
        )}
      </div>
    </div>
  );
};

export default OutfitStack;