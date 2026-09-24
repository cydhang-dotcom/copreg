/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SurveyData } from '../types';
import { 
  Home, 
  CreditCard, 
  FileText, 
  Users, 
  Sparkles, 
  Check, 
  X, 
  ArrowRight,
  Smartphone,
  ShieldCheck,
  Loader2,
  BrainCircuit,
  Bot
} from 'lucide-react';
import { AI_INDUSTRY_TEMPLATES, DEFAULT_AI_TEMPLATE, INITIAL_SURVEY_DATA } from '../data/mockData';

interface SurveyStepProps {
  survey: SurveyData;
  onChange: (updated: SurveyData) => void;
  onSubmit: (phone?: string) => void;
  defaultPhone?: string;
}

export const SurveyStep: React.FC<SurveyStepProps> = ({
  survey,
  onChange,
  onSubmit,
  defaultPhone
}) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [aiTagInputScope, setAiTagInputScope] = useState('');
  const [aiTagInputLicense, setAiTagInputLicense] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 手机号与验证码弹窗状态（生成需求方案前置）
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phone, setPhone] = useState(defaultPhone || '13800138000');
  const [smsCode, setSmsCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  // AI 智能分析与方案生成 Loading 状态
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generationStepIndex, setGenerationStepIndex] = useState(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Toggle coreNeeds item helper (support both clean and legacy label values)
  const isCoreNeedChecked = (val: string) => {
    return survey.coreNeeds.some(item => item.includes(val) || val.includes(item));
  };

  const toggleCoreNeed = (val: string) => {
    const exists = isCoreNeedChecked(val);
    if (exists) {
      onChange({
        ...survey,
        coreNeeds: survey.coreNeeds.filter(item => !item.includes(val) && !val.includes(item))
      });
    } else {
      onChange({
        ...survey,
        coreNeeds: [...survey.coreNeeds, val]
      });
    }
  };

  // Card completion checks
  const isCard1Done = survey.coreNeeds && survey.coreNeeds.length > 0;
  const isCard2Done = !!survey.companyDesc?.trim() && !!survey.bizDesc?.trim();
  const isCard3Done = !!survey.invoiceReq && !!survey.monthlyAmount && survey.revenue && survey.revenue.length > 0;
  const isCard4Done = survey.shareholderType && survey.shareholderType.length > 0 && !!survey.shareholderCount && !!survey.capitalRec;
  const isCard5Done = !!survey.regAddress && !!survey.officeSpace;

  const completedCount = [isCard1Done, isCard2Done, isCard3Done, isCard4Done, isCard5Done].filter(Boolean).length;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Toggle array item helper
  const toggleArrayItem = (field: 'revenue' | 'shareholderType' | 'sensitive', item: string) => {
    const list = survey[field];
    if (list.includes(item)) {
      onChange({ ...survey, [field]: list.filter(x => x !== item) });
    } else {
      onChange({ ...survey, [field]: [...list, item] });
    }
  };

  // AI smart suggestion
  const handleAiGenerate = () => {
    if (!survey.companyDesc && !survey.bizDesc) {
      showToast('请先填写企业描述与业务描述，AI 将据此智能分析');
      document.getElementById('sec-biz')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsAiLoading(true);

    setTimeout(() => {
      const text = `${survey.companyDesc} ${survey.bizDesc}`.toLowerCase();
      let matched = DEFAULT_AI_TEMPLATE;
      let maxScore = 0;

      AI_INDUSTRY_TEMPLATES.forEach(tpl => {
        let score = 0;
        tpl.keys.forEach(k => {
          if (text.includes(k.toLowerCase())) score++;
        });
        if (score > maxScore) {
          maxScore = score;
          matched = tpl;
        }
      });

      onChange({
        ...survey,
        scope: [...matched.scope],
        license: [...matched.license],
        sensitive: [...matched.sensitive]
      });

      setIsAiLoading(false);
      setAiGenerated(true);
      showToast(`已依据「${matched.name}」模型自动生成经营范围与资质建议！`);
    }, 650);
  };

  const addScopeTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !survey.scope.includes(trimmed)) {
      onChange({ ...survey, scope: [...survey.scope, trimmed] });
      setAiTagInputScope('');
    }
  };

  const removeScopeTag = (tag: string) => {
    onChange({ ...survey, scope: survey.scope.filter(t => t !== tag) });
  };

  const addLicenseTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !survey.license.includes(trimmed)) {
      onChange({ ...survey, license: [...survey.license, trimmed] });
      setAiTagInputLicense('');
    }
  };

  const removeLicenseTag = (tag: string) => {
    onChange({ ...survey, license: survey.license.filter(t => t !== tag) });
  };

  const handleSendSms = () => {
    if (!phone || phone.trim().length !== 11) {
      showToast('请输入正确的11位手机号码');
      return;
    }
    setCountdown(60);
    setSmsCode('8866');
    showToast('验证码已发送（测试环境验证码：8866）');

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleConfirmAndGenerate = () => {
    if (!phone || phone.trim().length !== 11) {
      showToast('请输入有效的11位手机号码');
      return;
    }
    if (!smsCode || smsCode.trim().length < 4) {
      showToast('请输入短信验证码');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setShowPhoneModal(false);
      
      // 开启 AI 深度推演方案 Loading
      setIsGeneratingPlan(true);
      setGenerationStepIndex(0);

      // 阶段 1: 解析业务特征与股权架构 (700ms)
      const t1 = setTimeout(() => {
        setGenerationStepIndex(1);
      }, 700);

      // 阶段 2: 检索商事登记规范与财税优惠政策 (1500ms)
      const t2 = setTimeout(() => {
        setGenerationStepIndex(2);
      }, 1500);

      // 阶段 3: 优化注册资本实缴与配套服务包定价 (2300ms)
      const t3 = setTimeout(() => {
        setGenerationStepIndex(3);
      }, 2300);

      // 完成并切换至定制方案报告 (3100ms)
      const t4 = setTimeout(() => {
        setIsGeneratingPlan(false);
        onSubmit(phone);
      }, 3100);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }, 350);
  };

  const handleValidateAndSubmit = () => {
    if (!isCard1Done) {
      showToast('请先完善「01 · 核心诉求」（至少选 1 项）');
      scrollToSection('sec-core');
      return;
    }
    if (!isCard2Done) {
      showToast('请完整填写「02 · 企业与业务」的企业与业务描述');
      scrollToSection('sec-biz');
      return;
    }
    if (!isCard3Done) {
      showToast('请先完善「03 · 开票与收入」的必选项目');
      scrollToSection('sec-invoice');
      return;
    }
    if (!isCard4Done) {
      showToast('请先完善「04 · 股权与资本」的股东类型与人数');
      scrollToSection('sec-equity');
      return;
    }
    if (!isCard5Done) {
      showToast('请先确认「05 · 地址与场地」需求');
      scrollToSection('sec-address');
      return;
    }
    
    // 打开手机号验证码弹框
    setShowPhoneModal(true);
  };

  const handleReset = () => {
    onChange({
      coreNeeds: [],
      companyDesc: '',
      bizDesc: '',
      scope: [],
      license: [],
      sensitive: [],
      invoiceReq: '',
      monthlyAmount: '',
      revenue: [],
      revenueOther: '',
      shareholderType: [],
      shareholderCount: '',
      capitalRec: '是',
      capitalAmount: '',
      regAddress: '',
      officeSpace: ''
    });
    setAiGenerated(false);
    showToast('已重置调查问卷内容');
  };

  return (
    <div className="pb-32">
      
      <div className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-4 relative z-10">
          
          {/* ==================== Top Step Heading ==================== */}
          <section className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F7F2] text-[#2AA894] mb-2.5 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
              <span>第 1 步 · 需求评估</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1.5">
              <span className="text-[#2AA894]">第 1 步：</span><span className="text-[#1D6C5E]">填写企业开办基本信息与需求评估</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              用于评估企业组织形式与税务开票方案，经营范围支持使用 AI 智能提取与调整。
            </p>
          </section>

          {/* ==================== 01 核心诉求 ==================== */}
          <div 
            id="sec-core"
            className={`rounded-2xl p-5 sm:p-6 mb-5 border transition-all duration-300 relative overflow-hidden ${
              isCard1Done
                ? 'border-[#2AA894]/30 bg-gradient-to-br from-[#F7FCFA] via-white to-white shadow-[0_4px_16px_-4px_rgba(42,168,148,0.08)]'
                : 'border-slate-200/80 bg-white hover:border-slate-300'
            }`}
          >
            {/* 左侧轻盈亮条 */}
            {isCard1Done && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#4ED1BC] to-[#2AA894] opacity-90 shadow-[0_0_6px_rgba(78,209,188,0.3)] z-10" />
            )}
            {/* 右上角柔和微光背景 */}
            {isCard1Done && (
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#E6F7F2]/35 rounded-full blur-2xl pointer-events-none" />
            )}

            <div className="flex items-center justify-between mb-3.5 relative z-10">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold select-none transition-colors ${
                isCard1Done ? 'bg-[#E6F7F2] text-[#1D6C5E] border border-[#2AA894]/30 shadow-xs' : 'bg-slate-100 text-slate-600'
              }`}>
                {isCard1Done ? (
                  <Check className="w-3.5 h-3.5 text-[#2AA894] stroke-[3]" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                )}
                <span>01 · 核心诉求</span>
              </div>

              {isCard1Done ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E6F7F2] text-[#1D6C5E] border border-[#36B39E]/30 shadow-xs select-none">
                  <Check className="w-3 h-3 text-[#2AA894] stroke-[3]" />
                  <span>已完善</span>
                </div>
              ) : (
                <span className="text-xs select-none text-slate-400 px-2 py-0.5 rounded-full bg-slate-100 font-medium">
                  必选
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight mb-4">
              您开设企业最核心的诉求是什么？
            </h2>

            {/* 2x2 Grid of 4 Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  title: '需公司主体',
                  sub: '营业执照 / 公章',
                  icon: <Home className="w-4 h-4 stroke-[1.8]" />,
                  value: '需公司主体'
                },
                {
                  title: '需对公收款',
                  sub: '开立并使用对公账户',
                  icon: <CreditCard className="w-4 h-4 stroke-[1.8]" />,
                  value: '需对公收款'
                },
                {
                  title: '需开票',
                  sub: '增值税普通发票 / 专用发票',
                  icon: <FileText className="w-4 h-4 stroke-[1.8]" />,
                  value: '需开票'
                },
                {
                  title: '需用工并缴社保',
                  sub: '劳动合同 / 社保公积金',
                  icon: <Users className="w-4 h-4 stroke-[1.8]" />,
                  value: '需用工并缴社保'
                }
              ].map((opt) => {
                const checked = isCoreNeedChecked(opt.value);
                return (
                  <div
                    key={opt.value}
                    onClick={() => toggleCoreNeed(opt.value)}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-colors cursor-pointer select-none ${
                      checked
                        ? 'border-[#36B39E] bg-[#F8FCFB]'
                        : 'border-slate-200/80 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#E6F7F2] flex items-center justify-center text-[#2AA894] shrink-0">
                        {opt.icon}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800 leading-snug">
                          {opt.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {opt.sub}
                        </div>
                      </div>
                    </div>

                    {/* Radio / Check Circle */}
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      checked
                        ? 'bg-[#36B39E] border-[#36B39E] text-white'
                        : 'border-slate-300 bg-white'
                    }`}>
                      {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ==================== 02 企业与业务 ==================== */}
          <div 
            id="sec-biz"
            className={`rounded-2xl p-5 sm:p-6 mb-5 border transition-all duration-300 relative overflow-hidden ${
              isCard2Done
                ? 'border-[#2AA894]/30 bg-gradient-to-br from-[#F7FCFA] via-white to-white shadow-[0_4px_16px_-4px_rgba(42,168,148,0.08)]'
                : 'border-slate-200/80 bg-white hover:border-slate-300'
            }`}
          >
            {/* 左侧轻盈亮条 */}
            {isCard2Done && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#4ED1BC] to-[#2AA894] opacity-90 shadow-[0_0_6px_rgba(78,209,188,0.3)] z-10" />
            )}
            {/* 右上角柔和微光背景 */}
            {isCard2Done && (
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#E6F7F2]/35 rounded-full blur-2xl pointer-events-none" />
            )}

            <div className="flex items-center justify-between mb-3.5 relative z-10">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold select-none transition-colors ${
                isCard2Done ? 'bg-[#E6F7F2] text-[#1D6C5E] border border-[#2AA894]/30 shadow-xs' : 'bg-slate-100 text-slate-600'
              }`}>
                {isCard2Done ? (
                  <Check className="w-3.5 h-3.5 text-[#2AA894] stroke-[3]" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                )}
                <span>02 · 企业与业务</span>
              </div>

              {isCard2Done ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E6F7F2] text-[#1D6C5E] border border-[#36B39E]/30 shadow-xs select-none">
                  <Check className="w-3 h-3 text-[#2AA894] stroke-[3]" />
                  <span>已完善</span>
                </div>
              ) : (
                <span className="text-xs select-none text-slate-400 px-2 py-0.5 rounded-full bg-slate-100 font-medium">
                  必填
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight mb-4">
              请描述拟设立企业的情况
            </h2>

            <div className="space-y-3.5">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                  企业描述 <span className="text-amber-600 text-[10px] font-semibold">必填</span>
                </label>
                <textarea
                  value={survey.companyDesc}
                  onChange={(e) => onChange({ ...survey, companyDesc: e.target.value })}
                  rows={2}
                  placeholder="例如：拟设立有限责任公司，主营跨境电商，计划面向欧美市场。"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200/80 focus:border-[#36B39E] outline-none transition-colors resize-y text-slate-800"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                  业务描述 <span className="text-amber-600 text-[10px] font-semibold">必填</span>
                </label>
                <textarea
                  value={survey.bizDesc}
                  onChange={(e) => onChange({ ...survey, bizDesc: e.target.value })}
                  rows={2}
                  placeholder="例如：国内采购商品，通过独立站销售给海外消费者并提供售后服务。"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200/80 focus:border-[#36B39E] outline-none transition-colors resize-y text-slate-800"
                />
              </div>
            </div>

            {/* AI Suggestion Box */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
                aiGenerated ? 'bg-slate-50/70 border-slate-200/80' : 'bg-[#F8FCFB] border-[#CDEFE7]'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/70 flex items-center justify-center text-[#2AA894] shrink-0">
                    <Sparkles className="w-4 h-4 text-[#2AA894]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-800">AI 智能提取科目</span>
                      <span className={`text-[10px] px-2 py-0.2 rounded-full font-medium ${
                        aiGenerated ? 'bg-[#E6F7F2] text-[#2AA894]' : 'bg-slate-200/70 text-slate-600'
                      }`}>
                        {aiGenerated ? '已生成' : '待生成'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      智能生成工商经营范围、许可资质与敏感要素
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isAiLoading}
                  onClick={handleAiGenerate}
                  className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-[#36B39E] hover:bg-[#2AA894] text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
                  <span>{isAiLoading ? '分析中…' : aiGenerated ? '重新生成' : 'AI 智能填充'}</span>
                </button>
              </div>

              {/* Scope Tags */}
              <div className="mt-3.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                  初步经营范围 <span className="text-slate-400 text-[10px] font-normal">支持添加或删除</span>
                </label>
                <div className="min-h-[42px] p-2 border border-slate-200/80 rounded-xl bg-white flex flex-wrap items-center gap-1.5 focus-within:border-[#36B39E] transition-colors">
                  {survey.scope.length === 0 ? (
                    <span className="text-xs text-slate-400 pl-1">
                      点击上方「AI 智能填充」或在右侧输入后回车添加
                    </span>
                  ) : (
                    survey.scope.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#E6F7F2] text-[#2AA894]"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeScopeTag(tag)}
                          className="w-3.5 h-3.5 rounded hover:text-red-500 flex items-center justify-center transition-colors"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))
                  )}
                  <input
                    type="text"
                    placeholder="+ 回车添加科目"
                    value={aiTagInputScope}
                    onChange={(e) => setAiTagInputScope(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addScopeTag(aiTagInputScope);
                      }
                    }}
                    className="text-xs px-2 py-1 outline-none flex-1 min-w-[110px] bg-transparent text-slate-800"
                  />
                </div>
              </div>

              {/* License Tags */}
              <div className="mt-3.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                  涉及许可 / 备案资质 <span className="text-slate-400 text-[10px] font-normal">AI 建议 / 可自定义</span>
                </label>
                <div className="min-h-[42px] p-2 border border-slate-200/80 rounded-xl bg-white flex flex-wrap items-center gap-1.5 focus-within:border-[#36B39E] transition-colors">
                  {survey.license.length === 0 ? (
                    <span className="text-xs text-slate-400 pl-1">
                      暂无前置许可，或输入后回车添加
                    </span>
                  ) : (
                    survey.license.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#E6F7F2] text-[#2AA894]"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeLicenseTag(tag)}
                          className="w-3.5 h-3.5 rounded hover:text-red-500 flex items-center justify-center transition-colors"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))
                  )}
                  <input
                    type="text"
                    placeholder="+ 回车添加资质"
                    value={aiTagInputLicense}
                    onChange={(e) => setAiTagInputLicense(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLicenseTag(aiTagInputLicense);
                      }
                    }}
                    className="text-xs px-2 py-1 outline-none flex-1 min-w-[110px] bg-transparent text-slate-800"
                  />
                </div>
              </div>

              {/* Sensitive Checklist */}
              <div className="mt-3.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                  涉及敏感行业要素
                </label>
                <div className="flex flex-wrap gap-1.5 p-2.5 border border-slate-200/80 rounded-xl bg-white">
                  {[
                    '教培', '医疗/器械', '食品/餐饮', '进出口', '直播/MCN',
                    '金融/理财', '人力/劳务', '建筑/施工', '危化/环保', '网络文化/ICP', '其他'
                  ].map((item) => {
                    const checked = survey.sensitive.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleArrayItem('sensitive', item)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                          checked
                            ? 'bg-[#E6F7F2] text-[#2AA894] border border-[#36B39E]/50'
                            : 'bg-slate-50 text-slate-600 border border-slate-200/70 hover:bg-slate-100'
                        }`}
                      >
                        {checked && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ==================== 03 开票与收入 ==================== */}
          <div 
            id="sec-invoice"
            className={`rounded-2xl p-5 sm:p-6 mb-5 border transition-all duration-300 relative overflow-hidden ${
              isCard3Done
                ? 'border-[#2AA894]/30 bg-gradient-to-br from-[#F7FCFA] via-white to-white shadow-[0_4px_16px_-4px_rgba(42,168,148,0.08)]'
                : 'border-slate-200/80 bg-white hover:border-slate-300'
            }`}
          >
            {/* 左侧轻盈亮条 */}
            {isCard3Done && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#4ED1BC] to-[#2AA894] opacity-90 shadow-[0_0_6px_rgba(78,209,188,0.3)] z-10" />
            )}
            {/* 右上角柔和微光背景 */}
            {isCard3Done && (
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#E6F7F2]/35 rounded-full blur-2xl pointer-events-none" />
            )}

            <div className="flex items-center justify-between mb-3.5 relative z-10">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold select-none transition-colors ${
                isCard3Done ? 'bg-[#E6F7F2] text-[#1D6C5E] border border-[#2AA894]/30 shadow-xs' : 'bg-slate-100 text-slate-600'
              }`}>
                {isCard3Done ? (
                  <Check className="w-3.5 h-3.5 text-[#2AA894] stroke-[3]" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                )}
                <span>03 · 开票与收入</span>
              </div>

              {isCard3Done ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E6F7F2] text-[#1D6C5E] border border-[#36B39E]/30 shadow-xs select-none">
                  <Check className="w-3 h-3 text-[#2AA894] stroke-[3]" />
                  <span>已完善</span>
                </div>
              ) : (
                <span className="text-xs select-none text-slate-400 px-2 py-0.5 rounded-full bg-slate-100 font-medium">
                  必选
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight mb-4">
              开票需求与收入结构
            </h2>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  近期开票要求 <span className="text-amber-600 text-[10px] font-semibold">必选</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['不确定', '增值税专用发票', '增值税普通发票'].map((val) => {
                    const active = survey.invoiceReq === val;
                    return (
                      <button
                        type="button"
                        key={val}
                        onClick={() => onChange({ ...survey, invoiceReq: val })}
                        className={`py-2 px-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                          active
                            ? 'border-[#36B39E] bg-[#F8FCFB] text-[#2AA894]'
                            : 'border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  预计月开票额 <span className="text-amber-600 text-[10px] font-semibold">必选</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['< 10 万', '10 - 50 万', '50 - 200 万', '> 200 万'].map((val) => {
                    const active = survey.monthlyAmount === val;
                    return (
                      <button
                        type="button"
                        key={val}
                        onClick={() => onChange({ ...survey, monthlyAmount: val })}
                        className={`py-2 px-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                          active
                            ? 'border-[#36B39E] bg-[#F8FCFB] text-[#2AA894]'
                            : 'border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  收入模式 <span className="text-amber-600 text-[10px] font-semibold">至少选 1 项</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {['服务费', '货物销售', '平台抽佣', '项目/阶段款', '其他'].map((val) => {
                    const active = survey.revenue.includes(val);
                    return (
                      <button
                        type="button"
                        key={val}
                        onClick={() => toggleArrayItem('revenue', val)}
                        className={`py-1.5 px-3 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                          active
                            ? 'border-[#36B39E] bg-[#F8FCFB] text-[#2AA894]'
                            : 'border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {active && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{val}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ==================== 04 股权与资本 ==================== */}
          <div 
            id="sec-equity"
            className={`rounded-2xl p-5 sm:p-6 mb-5 border transition-all duration-300 relative overflow-hidden ${
              isCard4Done
                ? 'border-[#2AA894]/30 bg-gradient-to-br from-[#F7FCFA] via-white to-white shadow-[0_4px_16px_-4px_rgba(42,168,148,0.08)]'
                : 'border-slate-200/80 bg-white hover:border-slate-300'
            }`}
          >
            {/* 左侧轻盈亮条 */}
            {isCard4Done && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#4ED1BC] to-[#2AA894] opacity-90 shadow-[0_0_6px_rgba(78,209,188,0.3)] z-10" />
            )}
            {/* 右上角柔和微光背景 */}
            {isCard4Done && (
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#E6F7F2]/35 rounded-full blur-2xl pointer-events-none" />
            )}

            <div className="flex items-center justify-between mb-3.5 relative z-10">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold select-none transition-colors ${
                isCard4Done ? 'bg-[#E6F7F2] text-[#1D6C5E] border border-[#2AA894]/30 shadow-xs' : 'bg-slate-100 text-slate-600'
              }`}>
                {isCard4Done ? (
                  <Check className="w-3.5 h-3.5 text-[#2AA894] stroke-[3]" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                )}
                <span>04 · 股权与资本</span>
              </div>

              {isCard4Done ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E6F7F2] text-[#1D6C5E] border border-[#36B39E]/30 shadow-xs select-none">
                  <Check className="w-3 h-3 text-[#2AA894] stroke-[3]" />
                  <span>已完善</span>
                </div>
              ) : (
                <span className="text-xs select-none text-slate-400 px-2 py-0.5 rounded-full bg-slate-100 font-medium">
                  必选
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight mb-4">
              股东结构与资本规模
            </h2>

            <div className="space-y-3.5">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  股东类型 <span className="text-amber-600 text-[10px] font-semibold">至少选 1 项</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['自然人', '公司股东', '境外主体'].map((val) => {
                    const active = survey.shareholderType.includes(val);
                    return (
                      <button
                        type="button"
                        key={val}
                        onClick={() => toggleArrayItem('shareholderType', val)}
                        className={`py-2 px-2.5 rounded-lg border text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                          active
                            ? 'border-[#36B39E] bg-[#F8FCFB] text-[#2AA894]'
                            : 'border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {active && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{val}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  股东人数 <span className="text-amber-600 text-[10px] font-semibold">必选</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['1 个', '2 个', '3 个及以上'].map((val) => {
                    const active = survey.shareholderCount === val;
                    return (
                      <button
                        type="button"
                        key={val}
                        onClick={() => onChange({ ...survey, shareholderCount: val })}
                        className={`py-2 px-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                          active
                            ? 'border-[#36B39E] bg-[#F8FCFB] text-[#2AA894]'
                            : 'border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  是否需要注册资本专家建议 <span className="text-amber-600 text-[10px] font-semibold">必选</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '是 · 需要专家建议（默认）', value: '是' },
                    { label: '否 · 已有明确数额', value: '否' }
                  ].map((opt) => {
                    const active = survey.capitalRec === opt.value;
                    return (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => onChange({ ...survey, capitalRec: opt.value })}
                        className={`py-2 px-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                          active
                            ? 'border-[#36B39E] bg-[#F8FCFB] text-[#2AA894]'
                            : 'border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ==================== 05 地址与场地 ==================== */}
          <div 
            id="sec-address"
            className={`rounded-2xl p-5 sm:p-6 mb-6 border transition-all duration-300 relative overflow-hidden ${
              isCard5Done
                ? 'border-[#2AA894]/30 bg-gradient-to-br from-[#F7FCFA] via-white to-white shadow-[0_4px_16px_-4px_rgba(42,168,148,0.08)]'
                : 'border-slate-200/80 bg-white hover:border-slate-300'
            }`}
          >
            {/* 左侧轻盈亮条 */}
            {isCard5Done && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#4ED1BC] to-[#2AA894] opacity-90 shadow-[0_0_6px_rgba(78,209,188,0.3)] z-10" />
            )}
            {/* 右上角柔和微光背景 */}
            {isCard5Done && (
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#E6F7F2]/35 rounded-full blur-2xl pointer-events-none" />
            )}

            <div className="flex items-center justify-between mb-3.5 relative z-10">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold select-none transition-colors ${
                isCard5Done ? 'bg-[#E6F7F2] text-[#1D6C5E] border border-[#2AA894]/30 shadow-xs' : 'bg-slate-100 text-slate-600'
              }`}>
                {isCard5Done ? (
                  <Check className="w-3.5 h-3.5 text-[#2AA894] stroke-[3]" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                )}
                <span>05 · 地址与场地</span>
              </div>

              {isCard5Done ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E6F7F2] text-[#1D6C5E] border border-[#36B39E]/30 shadow-xs select-none">
                  <Check className="w-3 h-3 text-[#2AA894] stroke-[3]" />
                  <span>已完善</span>
                </div>
              ) : (
                <span className="text-xs select-none text-slate-400 px-2 py-0.5 rounded-full bg-slate-100 font-medium">
                  必选
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight mb-4">
              注册地址与办公场地需求
            </h2>

            <div className="space-y-3.5">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  是否需要推荐注册地址 <span className="text-amber-600 text-[10px] font-semibold">必选</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['是（需推荐）', '否（自有地址）'].map((val) => {
                    const active = survey.regAddress === val;
                    return (
                      <button
                        type="button"
                        key={val}
                        onClick={() => onChange({ ...survey, regAddress: val })}
                        className={`py-2 px-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                          active
                            ? 'border-[#36B39E] bg-[#F8FCFB] text-[#2AA894]'
                            : 'border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  是否需要推荐实体办公场地 <span className="text-amber-600 text-[10px] font-semibold">必选</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['是', '否'].map((val) => {
                    const active = survey.officeSpace === val;
                    return (
                      <button
                        type="button"
                        key={val}
                        onClick={() => onChange({ ...survey, officeSpace: val })}
                        className={`py-2 px-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                          active
                            ? 'border-[#36B39E] bg-[#F8FCFB] text-[#2AA894]'
                            : 'border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {val === '是' ? '是 · 需要推荐' : '否 · 暂不需要'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ==================== Bottom Floating Bar ==================== */}
      <div className="fixed left-0 right-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 py-3 px-6 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 select-none text-xs text-slate-500">
            <span className={`w-1.5 h-1.5 rounded-full transition-colors ${completedCount === 5 ? 'bg-[#2AA894]' : 'bg-slate-400'}`}></span>
            <span>
              已完成 <span className="font-semibold text-slate-700">{completedCount}</span> / 5 项
            </span>
            {completedCount === 5 && (
              <span className="text-[#2AA894] font-medium hidden sm:inline">· 已就绪</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2 rounded-full border border-slate-200/80 bg-white text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer select-none"
            >
              重置
            </button>

            <button
              type="button"
              onClick={handleValidateAndSubmit}
              className="px-6 py-2 rounded-full bg-[#36B39E] hover:bg-[#2AA894] text-white text-xs font-medium transition-colors active:scale-95 flex items-center gap-1.5 cursor-pointer select-none shadow-xs"
            >
              <span>生成需求方案</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* ==================== Phone & SMS Verification Modal (生成需求方案弹窗) ==================== */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 sm:p-6 border border-slate-200/80 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E6F7F2] text-[#2AA894] flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">验证手机号生成方案</h3>
                  <span className="text-[11px] text-slate-400">用于同步企业设立报告与办理跟进</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPhoneModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Mobile field */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">
                  联系手机号码 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium select-none">
                    +86
                  </span>
                  <input
                    type="tel"
                    maxLength={11}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-12 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#36B39E] focus:ring-1 focus:ring-[#36B39E]"
                    placeholder="请输入11位手机号码"
                  />
                </div>
              </div>

              {/* SMS Code field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-700">
                    短信验证码 <span className="text-red-500">*</span>
                  </label>
                  {countdown > 0 && (
                    <span className="text-[10px] text-[#2AA894]">测试码已填充: 8866</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value.trim())}
                    placeholder="输入验证码"
                    className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono tracking-wider text-slate-900 focus:outline-none focus:border-[#36B39E] focus:ring-1 focus:ring-[#36B39E]"
                  />
                  <button
                    type="button"
                    disabled={countdown > 0}
                    onClick={handleSendSms}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                      countdown > 0
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-[#E6F7F2] text-[#2AA894] hover:bg-[#D1F2EB] active:scale-95'
                    }`}
                  >
                    {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
                  </button>
                </div>
              </div>

              {/* Security Hint */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2AA894] shrink-0 mt-0.5" />
                <span>信息严格保密，验证通过后即刻生成您的企业设立定制方案。</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowPhoneModal(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  id="btn-verify-phone-generate-proposal"
                  disabled={isVerifying}
                  onClick={handleConfirmAndGenerate}
                  className="px-5 py-2 rounded-full bg-[#36B39E] hover:bg-[#2AA894] text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  <span>{isVerifying ? '正在生成…' : '验证并生成方案'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== AI Generating Proposal Loading Modal ==================== */}
      {isGeneratingPlan && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 border border-slate-200/80 shadow-2xl relative overflow-hidden">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1D6C5E] via-[#36B39E] to-emerald-400 animate-pulse" />

            <div className="text-center mb-6 pt-2">
              <div className="relative w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-[#E6F7F2] animate-ping opacity-35" />
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1D6C5E] to-[#36B39E] text-white flex items-center justify-center shadow-lg relative z-10">
                  <BrainCircuit className="w-8 h-8 animate-pulse text-white" />
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 tracking-tight flex items-center justify-center gap-2">
                <span>AI 财税与合规引擎正在推演</span>
                <Loader2 className="w-4 h-4 text-[#2AA894] animate-spin shrink-0" />
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                正结合新《公司法》合规准则、股东架构及经营特征为您定制最优落地方案，请稍候片刻…
              </p>
            </div>

            {/* Dynamic Step Progress */}
            <div className="space-y-3 bg-slate-50/80 rounded-xl p-4 border border-slate-100 text-xs mb-5">
              {[
                { label: '解析业务分类与行业经营范围特征', desc: '智能匹配最新国民经济行业代码与许可资质' },
                { label: '推演股权治理架构与新公司法实缴期限', desc: '按股东构成设计表决权机制与 5 年出资规划' },
                { label: '核对经营场所类型与税务身份纳税方案', desc: '评估商用场地合规性，测算小规模或一般纳税人税负' },
                { label: '生成专属企业设立方案评估报告与服务清单', desc: '正在装配基础服务项目、增值服务包与优惠价格' },
              ].map((step, idx) => {
                const isFinished = generationStepIndex > idx;
                const isCurrent = generationStepIndex === idx;

                return (
                  <div key={idx} className="flex items-start gap-3 transition-all duration-300">
                    <div className="mt-0.5 shrink-0">
                      {isFinished ? (
                        <div className="w-4 h-4 rounded-full bg-[#1D6C5E] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full border-2 border-[#36B39E] border-t-transparent animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 bg-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-semibold ${
                        isFinished ? 'text-slate-800' : isCurrent ? 'text-[#1D6C5E]' : 'text-slate-400'
                      }`}>
                        {step.label}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#1D6C5E] to-[#36B39E] h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, (generationStepIndex + 1) * 25)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 px-0.5">
              <span className="flex items-center gap-1">
                <Bot className="w-3 h-3 text-[#2AA894]" />
                <span>智能引擎运算中</span>
              </span>
              <span>{Math.min(100, (generationStepIndex + 1) * 25)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in duration-150">
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
