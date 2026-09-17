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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100/90 transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Brand */}
        <div 
          onClick={() => onSelectStep && onSelectStep('survey')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#E6F7F2] flex items-center justify-center text-[#36B39E] transition-transform group-hover:scale-105">
            <Home className="w-5 h-5 stroke-[1.8]" />
          </div>
          <div>
            <div className="font-bold text-[#0F172A] text-base leading-tight tracking-tight">
              企业设立需求调查
            </div>
            <div className="text-[10px] tracking-wider text-slate-400 font-semibold uppercase mt-0.5">
              BUSINESS SETUP SURVEY
            </div>
          </div>
        </div>

        {/* Right: Clean Security / Service Guarantee Badge */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-full select-none">
          <ShieldCheck className="w-4 h-4 text-[#36B39E]" />
          <span>政务直通通道 · 资金安全托管</span>
        </div>

      </div>
    </header>
  );
};
