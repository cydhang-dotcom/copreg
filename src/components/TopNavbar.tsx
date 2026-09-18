/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ProcessStep } from '../types';
import { Home, ShieldCheck } from 'lucide-react';

interface TopNavbarProps {
  currentStep?: ProcessStep;
  onSelectStep?: (step: ProcessStep) => void;
  unlockedSteps?: ProcessStep[];
  progressPct?: number;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onSelectStep
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/70 transition-all">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        
        {/* Left: Brand */}
        <div 
          onClick={() => onSelectStep && onSelectStep('survey')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-[#E6F7F2] flex items-center justify-center text-[#2AA894]">
            <Home className="w-4 h-4 stroke-[1.8]" />
          </div>
          <div>
            <div className="font-bold text-slate-800 text-sm leading-tight">
              企业设立需求调查
            </div>
            <div className="text-[10px] tracking-wide text-slate-400 font-medium uppercase">
              Business Setup
            </div>
          </div>
        </div>

        {/* Right: Clean Security Badge */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200/60 px-3 py-1 rounded-full select-none">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2AA894]" />
          <span>政务直通 · 资金托管</span>
        </div>

      </div>
    </header>
  );
};
