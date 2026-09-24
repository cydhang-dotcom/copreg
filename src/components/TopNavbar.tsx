/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { RegistrationApplication, ProcessStep } from '../types';
import { 
  Building2, 
  Plus, 
  ChevronDown, 
  Check, 
  Trash2, 
  Sparkles, 
  AlertCircle,
  FileCheck2,
  Clock,
  ExternalLink
} from 'lucide-react';

interface TopNavbarProps {
  currentStep?: ProcessStep;
  onSelectStep?: (step: ProcessStep) => void;
  unlockedSteps?: ProcessStep[];
  progressPct?: number;
  // Multi-service application props
  applications: RegistrationApplication[];
  currentAppId: string;
  onSwitchApplication: (id: string) => void;
  onAddNewApplication: () => void;
  onDiscardApplication: (id: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onSelectStep,
  applications,
  currentAppId,
  onSwitchApplication,
  onAddNewApplication,
  onDiscardApplication
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [confirmDiscardId, setConfirmDiscardId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeApp = applications.find(a => a.id === currentAppId) || applications[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setConfirmDiscardId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const getStepBadge = (step: ProcessStep, isPaid: boolean) => {
    if (isPaid) {
      return { text: '已支付 · 办理中', color: 'bg-emerald-50 text-[#1D6C5E] border-emerald-200' };
    }
    switch (step) {
      case 'survey':
        return { text: '意向调研中', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'proposal':
        return { text: '方案待确认', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'payment':
      case 'agreement':
        return { text: '待支付', color: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'group':
        return { text: '服务群对接中', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'fill_details':
        return { text: '资料填报中', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'progress':
        return { text: '开办进度追踪', color: 'bg-teal-50 text-teal-700 border-teal-200' };
      default:
        return { text: '进行中', color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const handleDiscardClick = (e: React.MouseEvent, appId: string) => {
    e.stopPropagation();
    if (confirmDiscardId === appId) {
      onDiscardApplication(appId);
      setConfirmDiscardId(null);
      setDropdownOpen(false);
    } else {
      setConfirmDiscardId(appId);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/70 transition-all">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3">
        
        {/* Left: Brand */}
        <div 
          onClick={() => onSelectStep && onSelectStep('survey')}
          className="flex items-center gap-2 cursor-pointer group shrink-0 select-none"
        >
          <div className="w-8 h-8 rounded-xl bg-[#E6F7F2] flex items-center justify-center text-[#2AA894]">
            <Sparkles className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-800 text-sm leading-tight">
                企业注册向导
              </span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#E6F7F2] text-[#1D6C5E] border border-[#2AA894]/30 leading-none">
                <Sparkles className="w-2.5 h-2.5 text-[#2AA894]" />
                AI
              </span>
            </div>
            <div className="text-[10px] tracking-wide text-slate-400 font-medium">
              智能设立与合规规划服务
            </div>
          </div>
        </div>

        {/* Right: Multi-service Application Switcher & New Registration */}
        <div className="flex items-center gap-2" ref={dropdownRef}>
          {/* Service Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              id="btn-switch-service-dropdown"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-slate-100 text-slate-800 text-xs font-medium transition-all cursor-pointer shadow-2xs group"
              title="切换当前办理的企业注册服务"
            >
              <Building2 className="w-3.5 h-3.5 text-[#2AA894] shrink-0" />
              <div className="flex items-center gap-1.5 text-left max-w-[130px] sm:max-w-[200px]">
                <span className="truncate font-semibold text-slate-800">
                  {activeApp ? activeApp.companyName : '当前注册服务'}
                </span>
                {applications.length > 1 && (
                  <span className="hidden sm:inline-flex text-[10px] font-semibold bg-emerald-100 text-[#1D6C5E] px-1.5 py-0.2 rounded-full">
                    {applications.length}个主体
                  </span>
                )}
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180 text-slate-700' : ''}`} />
            </button>

            {/* Dropdown Panel */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200/90 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-2.5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#2AA894]" />
                    <span className="text-xs font-bold text-slate-800">我的企业注册服务</span>
                    <span className="text-[10px] text-slate-400">（共 {applications.length} 个）</span>
                  </div>
                </div>

                {/* Applications list */}
                <div className="max-h-72 overflow-y-auto p-1.5 space-y-1">
                  {applications.map((app) => {
                    const isCurrent = app.id === currentAppId;
                    const isPaid = app.order.status === 'paid';
                    const badge = getStepBadge(app.currentStep, isPaid);
                    const canDiscard = !isPaid;

                    return (
                      <div
                        key={app.id}
                        onClick={() => {
                          onSwitchApplication(app.id);
                          setDropdownOpen(false);
                        }}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                          isCurrent
                            ? 'bg-[#F8FCFB] border-[#2AA894]/40 shadow-2xs'
                            : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-xs font-bold truncate ${isCurrent ? 'text-[#1D6C5E]' : 'text-slate-800'}`}>
                                {app.companyName}
                              </span>
                              {isCurrent && (
                                <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[10px] font-bold bg-[#2AA894] text-white shrink-0">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                  当前办理
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                              <span>套餐: {app.plan.tierName.split('（')[0]}</span>
                              <span>·</span>
                              <span>¥{app.plan.finalPrice}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-medium ${badge.color}`}>
                              {badge.text}
                            </span>
                          </div>
                        </div>

                        {/* Bottom bar of each item: creation date & discard option */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100/80 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-300" />
                            {app.createdAt}
                          </span>

                          <div className="flex items-center gap-2">
                            {canDiscard && (
                              <button
                                type="button"
                                onClick={(e) => handleDiscardClick(e, app.id)}
                                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                                  confirmDiscardId === app.id
                                    ? 'bg-rose-500 text-white font-bold animate-pulse'
                                    : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                }`}
                                title={confirmDiscardId === app.id ? '再次点击确认作废' : '未支付前可作废此服务'}
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>{confirmDiscardId === app.id ? '确定作废?' : '作废服务'}</span>
                              </button>
                            )}
                            {isPaid && (
                              <span className="text-emerald-700 flex items-center gap-0.5 font-medium">
                                <FileCheck2 className="w-3 h-3" />
                                已生效履约中
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer action in dropdown: Single clean '新增企业注册' button */}
                <div className="p-2 border-t border-slate-100 mt-1 bg-slate-50/60 rounded-b-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      onAddNewApplication();
                    }}
                    className="w-full py-2 rounded-xl bg-white border border-dashed border-[#2AA894]/50 hover:bg-[#E6F7F2] text-[#2AA894] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>新增企业注册</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
