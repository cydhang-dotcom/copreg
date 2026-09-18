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
  Info
} from 'lucide-react';
import { AI_INDUSTRY_TEMPLATES, DEFAULT_AI_TEMPLATE, INITIAL_SURVEY_DATA } from '../data/mockData';

interface SurveyStepProps {
  survey: SurveyData;
  onChange: (updated: SurveyData) => void;
  onSubmit: () => void;
}

export const SurveyStep: React.FC<SurveyStepProps> = ({
  survey,
  onChange,
  onSubmit
}) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [aiTagInputScope, setAiTagInputScope] = useState('');
  const [aiTagInputLicense, setAiTagInputLicense] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const handleValidateAndSubmit = () => {
    if (survey.coreNeeds.length === 0) {
      showToast('请至少选择一项核心需求');
      document.getElementById('sec-core')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!survey.companyDesc.trim() || !survey.bizDesc.trim()) {
      showToast('请完整填写企业描述与业务描述');
      document.getElementById('sec-biz')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    onSubmit();
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
          
          {/* ==================== Top Step Heading & Tips ==================== */}
          <section className="mb-5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E6F7F2] text-[#2AA894] mb-2 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
              <span>第 1 步 · 需求评估</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
              <span className="text-[#2AA894]">第 1 步：</span><span className="text-[#1D6C5E]">填写企业开办基本信息与需求评估</span>
            </h1>

            {/* Flat Tips Bar */}
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 flex items-center gap-2.5 text-xs text-amber-900 leading-relaxed">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                用于评估组织形式与税务开票方案。带 <span className="text-amber-800 font-semibold">必填</span> 项建议完整提供，经营范围可使用 AI 智能生成。
              </span>
            </div>
          </section>

          {/* ==================== 01 核心需求 ==================== */}
          <div 
            id="sec-core"
            className="rounded-2xl p-5 sm:p-6 mb-5 border border-slate-200/80 bg-white transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E6F7F2] text-[#2AA894] select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
                <span>01 · 核心诉求</span>
              </div>
              <span className="text-xs text-slate-400">据此配置银行开户与财税方案</span>
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
            className="rounded-2xl p-5 sm:p-6 mb-5 border border-slate-200/80 bg-white transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E6F7F2] text-[#2AA894] select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
                <span>02 · 企业与业务</span>
              </div>
              <span className="text-xs text-slate-400">用于生成经营范围与合规建议</span>
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
            className="rounded-3xl p-6 sm:p-8 mb-6 border border-slate-200 bg-white shadow-xs transition-all"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F7F2] text-[#2AA894] mb-3 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
              <span>03 · 开票与收入</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight mb-2">
              开票需求与收入结构
            </h2>
            <p className="text-sm text-[#64748B] mb-6">
              用于税务方案与纳税人身份评估。
            </p>

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
            className="rounded-2xl p-5 sm:p-6 mb-5 border border-slate-200/80 bg-white transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E6F7F2] text-[#2AA894] select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
                <span>04 · 股权与资本</span>
              </div>
              <span className="text-xs text-slate-400">影响公司类型与认缴期限</span>
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
            className="rounded-2xl p-5 sm:p-6 mb-6 border border-slate-200/80 bg-white transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E6F7F2] text-[#2AA894] select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
                <span>05 · 地址与场地</span>
              </div>
              <span className="text-xs text-slate-400">用于配置合规挂靠或场地租赁</span>
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

      {/* ==================== Flat Bottom Floating Bar ==================== */}
      <div className="fixed left-0 right-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/70 py-3 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          
          <div className="text-xs text-slate-400 select-none">
            填写完成后将自动生成服务方案与透明报价
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
              className="px-6 py-2 rounded-full bg-[#36B39E] hover:bg-[#2AA894] text-white text-xs font-medium transition-colors active:scale-95 flex items-center gap-1.5 cursor-pointer select-none"
            >
              <span>生成需求方案</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in duration-150">
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
