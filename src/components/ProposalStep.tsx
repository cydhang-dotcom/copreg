/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RegistrationPlan, SurveyData, ServiceTierType } from '../types';
import { generatePlanFromSurvey } from '../data/mockData';
import { 
  Building, 
  Receipt, 
  AlertTriangle, 
  Gift, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  FileBadge, 
  Clock, 
  Printer, 
  Check, 
  Info,
  X,
  ShieldCheck,
  Landmark,
  FileSpreadsheet,
  Users,
  Sparkles
} from 'lucide-react';

interface ProposalStepProps {
  plan: RegistrationPlan;
  survey: SurveyData;
  onProceed: () => void;
  onBack: () => void;
  onUpdatePlan?: (newPlan: RegistrationPlan) => void;
}

export const ProposalStep: React.FC<ProposalStepProps> = ({
  plan,
  survey,
  onProceed,
  onBack,
  onUpdatePlan
}) => {
  // Service tiers: 'bundle_small' (default) | 'bundle_general' | 'standard'
  const initialTier: ServiceTierType = 
    plan.selectedTier === 'standard' 
      ? 'standard' 
      : plan.selectedTier === 'bundle_general' 
      ? 'bundle_general' 
      : 'bundle_small';

  const [selectedTier, setSelectedTier] = useState<ServiceTierType>(initialTier);
  const [showReportModal, setShowReportModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const formatMoney = (val?: number | null) => {
    if (val === undefined || val === null || isNaN(val)) return '0';
    return val.toLocaleString();
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Handler to switch tier
  const handleTierSelect = (tier: ServiceTierType) => {
    setSelectedTier(tier);
    const updatedPlan = generatePlanFromSurvey(survey, tier);
    if (onUpdatePlan) {
      onUpdatePlan(updatedPlan);
    }
  };

  const activePlan = plan.selectedTier === selectedTier
    ? plan
    : generatePlanFromSurvey(survey, selectedTier);

  return (
    <div className="pb-32">
      
      <div className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-4 relative z-10">
          
          {/* Hero Section */}
          <section className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F7F2] text-[#2AA894] mb-3.5 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
              <span>定制方案 · 专属企业设立方案与透明报价</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0F172A] tracking-tight leading-[1.2] mb-3.5">
              量身定制，<br />
              <span className="text-[#48BFA2]">专属设立方案与透明报价</span>
            </h1>

            <p className="text-sm sm:text-[14.5px] text-[#64748B] max-w-2xl leading-relaxed">
              系统已根据您的业务画像（{survey.companyDesc.slice(0, 20)}…）、经营范围规划与财税要求，精准匹配新《公司法》规范，为您生成定制办理方案及明细报价。
            </p>
          </section>

          {/* ==================== 01 架构与组织形式 ==================== */}
          <div 
            id="sec-proposal-arch"
            className="rounded-3xl p-6 sm:p-8 mb-6 border border-slate-200 bg-white shadow-xs transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F7F2] text-[#2AA894] select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
                <span>01 · 架构诊断</span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2AA894] bg-[#E6F7F2] px-3 py-1 rounded-full">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" /> 智能诊断通过
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight mb-2">
              企业架构与组织形式建议
            </h2>
            <p className="text-sm text-[#64748B] mb-6">
              基于《中华人民共和国公司法》及属地市场监督管理局规范标准综合评估。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 block mb-1">推荐企业组织类型</span>
                <span className="font-bold text-[#2AA894] text-sm block">{activePlan.companyType}</span>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  有限责任公司股东以认缴出资额为限承担有限责任，有效保护创业者个人财产风险隔离，是商业招投标、线上经营与对公结算的主流形态。
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 block mb-1">纳税人身份规划建议</span>
                <span className="font-bold text-[#0F172A] text-sm block">{activePlan.taxpayerIdentity}</span>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  {activePlan.taxReason}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 block mb-1">注册资本与出资规划</span>
                <span className="font-bold text-[#0F172A] text-sm block">{activePlan.capitalAmount}</span>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  新《公司法》已明确认缴出资需在成立之日起5年内实缴完毕。建议资金规模与实际业务节奏相匹配，规避过高出资导致的股东实缴压力。
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 block mb-1">注册地址合规策略</span>
                <span className="font-bold text-[#0F172A] text-sm block">
                  {survey.regAddress.includes('是') ? '自贸园区标准合规商务秘书集群注册地址' : '自有商业办公场所合规备案登记'}
                </span>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  {activePlan.registeredAddressAdvice}
                </p>
              </div>
            </div>

            {/* Scope and Qualifications */}
            <div className="mt-5 pt-4 border-t border-slate-100 space-y-4">
              <div>
                <span className="text-xs font-bold text-[#0F172A] block mb-2">规范化拟申报经营范围（市监局标准规范表述）：</span>
                <div className="flex flex-wrap gap-1.5">
                  {survey.scope.map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full text-xs bg-[#E6F7F2] text-[#2AA894] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {activePlan.postQualifications.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-[#0F172A] block mb-2">后续需协同办理的行业许可 / 资质清单：</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activePlan.postQualifications.map((l) => (
                      <span key={l} className="px-3 py-1 rounded-full text-xs bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                        · {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Tips */}
              <div className="p-4 rounded-2xl bg-[#FEF9EE] border border-[#FDE68A]">
                <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900 mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>资深企服合规专家提醒</span>
                </div>
                <ul className="space-y-1 text-xs text-amber-800 list-disc list-inside">
                  {activePlan.riskTips.map((tip, idx) => (
                    <li key={idx} className="leading-relaxed">{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ==================== 02 套餐方案选择 ==================== */}
          <div className="rounded-3xl p-6 sm:p-8 mb-6 border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F7F2] text-[#2AA894] select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
                <span>02 · 服务套餐</span>
              </div>
              <span className="text-xs text-slate-400">点击卡片直接切换 · 明细清单实时联动</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight mb-2">
              服务套餐选择
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              根据您的财税运营需求选择适合的服务方案，点击卡片即可与下方费用明细清单实时联动。
            </p>

            {/* 3 distinct service packages in clean, balanced grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 items-stretch">
              
              {/* Package 1: 标准套餐 */}
              <div
                id="tier-card-standard"
                onClick={() => handleTierSelect('standard')}
                className={`p-5 sm:p-6 rounded-2xl cursor-pointer transition-all flex flex-col justify-between ${
                  selectedTier === 'standard'
                    ? 'border-2 border-[#36B39E] bg-[#F4FCFA] shadow-md ring-2 ring-[#36B39E]/10'
                    : 'border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                      基础设立 · 仅办证照
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                      selectedTier === 'standard' ? 'bg-[#36B39E] border-[#36B39E] text-white shadow-2xs' : 'border-slate-300 bg-white'
                    }`}>
                      {selectedTier === 'standard' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-[#0F172A]">标准设立套餐</h3>
                  <p className="text-xs text-slate-400 mt-1 mb-3">已有专职财务人员，仅委托办理执照与印章</p>

                  <div className="py-3 my-3 border-y border-slate-100 flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-bold text-slate-400">¥</span>
                      <span className={`text-2xl sm:text-3xl font-black ${selectedTier === 'standard' ? 'text-[#36B39E]' : 'text-[#0F172A]'}`}>
                        600
                      </span>
                      <span className="text-xs text-slate-400 line-through ml-1.5">¥ 1,700</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#2AA894] bg-[#E6F7F2] px-2 py-0.5 rounded-full">
                      立省 ¥1,100
                    </span>
                  </div>

                  {/* Clean, single-line features */}
                  <ul className="space-y-2.5 text-xs text-slate-700 my-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#36B39E] shrink-0" />
                      <span>全程政务网申与执照正副本领办</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#36B39E] shrink-0" />
                      <span>公安备案防伪芯片印章全套5枚 <strong className="text-emerald-600 font-normal">（免费）</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#36B39E] shrink-0" />
                      <span>市监行政审批登记规费 <strong className="text-emerald-600 font-normal">（¥0免收）</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#36B39E] shrink-0" />
                      <span>公司章程与股东会决议标准编制</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-400 pt-1 border-t border-slate-100">
                      <span className="w-4 text-center font-bold text-slate-300 shrink-0">—</span>
                      <span>不含银行开户与后续代理记账</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-100">
                  <button
                    type="button"
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedTier === 'standard'
                        ? 'bg-[#36B39E] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {selectedTier === 'standard' ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>当前已选方案</span>
                      </>
                    ) : (
                      <span>选择此方案</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Package 2: 全年无忧小规模全包 - 默认推荐 */}
              <div
                id="tier-card-bundle-small"
                onClick={() => handleTierSelect('bundle_small')}
                className={`p-5 sm:p-6 rounded-2xl cursor-pointer transition-all flex flex-col justify-between relative ${
                  selectedTier === 'bundle_small'
                    ? 'border-2 border-[#36B39E] bg-[#F4FCFA] shadow-md ring-2 ring-[#36B39E]/20'
                    : 'border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6F7F2] text-[#2AA894]">
                      ★ 95%初创首选 · 小规模
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                      selectedTier === 'bundle_small' ? 'bg-[#36B39E] border-[#36B39E] text-white shadow-2xs' : 'border-slate-300 bg-white'
                    }`}>
                      {selectedTier === 'bundle_small' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-[#0F172A]">全年无忧小规模全包</h3>
                  <p className="text-xs text-slate-400 mt-1 mb-3">含工商设立、芯片印章及全年12个月记账托管</p>

                  <div className="py-3 my-3 border-y border-slate-100 flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-bold text-slate-400">¥</span>
                      <span className="text-2xl sm:text-3xl font-black text-[#36B39E]">
                        2,500
                      </span>
                      <span className="text-xs text-slate-400 line-through ml-1.5">¥ 8,400</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#2AA894] bg-[#E6F7F2] px-2 py-0.5 rounded-full">
                      立省 ¥5,900
                    </span>
                  </div>

                  {/* Clean, single-line features */}
                  <ul className="space-y-2.5 text-xs text-slate-700 my-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#36B39E] shrink-0" />
                      <span>标准设立全套（执照正副本 + 芯片5章）</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#36B39E] shrink-0" />
                      <span>合作银行开户绿色通道（专人免排队）</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#36B39E] shrink-0" />
                      <span>电子税务局开户与税种核定</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#36B39E] shrink-0" />
                      <span>小规模记账报税托管 <strong className="text-blue-600 font-normal">（全年12个月）</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#36B39E] shrink-0" />
                      <span>单位社保与公积金独立开户及月度托管</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-100">
                  <button
                    type="button"
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedTier === 'bundle_small'
                        ? 'bg-[#36B39E] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {selectedTier === 'bundle_small' ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>当前已选方案</span>
                      </>
                    ) : (
                      <span>选择此方案</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Package 3: 全年无忧一般人全包 */}
              <div
                id="tier-card-bundle-general"
                onClick={() => handleTierSelect('bundle_general')}
                className={`p-5 sm:p-6 rounded-2xl cursor-pointer transition-all flex flex-col justify-between relative ${
                  selectedTier === 'bundle_general'
                    ? 'border-2 border-[#36B39E] bg-[#F4FCFA] shadow-md ring-2 ring-[#36B39E]/20'
                    : 'border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                      专票抵扣 · 一般纳税人
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                      selectedTier === 'bundle_general' ? 'bg-[#36B39E] border-[#36B39E] text-white shadow-2xs' : 'border-slate-300 bg-white'
                    }`}>
                      {selectedTier === 'bundle_general' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-[#0F172A]">一般人全包套餐</h3>
                  <p className="text-xs text-slate-400 mt-1 mb-3">需开具专票、有进项税额抵扣需求的成长型企业</p>

                  <div className="py-3 my-3 border-y border-slate-100 flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-bold text-slate-400">¥</span>
                      <span className={`text-2xl sm:text-3xl font-black ${selectedTier === 'bundle_general' ? 'text-[#36B39E]' : 'text-[#0F172A]'}`}>
                        3,000
                      </span>
                      <span className="text-xs text-slate-400 line-through ml-1.5">¥ 9,400</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#2AA894] bg-[#E6F7F2] px-2 py-0.5 rounded-full">
                      立省 ¥6,400
                    </span>
                  </div>

                  {/* Clean, single-line features */}
                  <ul className="space-y-2.5 text-xs text-slate-700 my-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#36B39E] shrink-0" />
                      <span>标准设立全套（执照正副本 + 芯片5章）</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#36B39E] shrink-0" />
                      <span>合作银行开户绿色通道（专人免排队）</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#36B39E] shrink-0" />
                      <span>增值税一般人认定与开票额度核定</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#36B39E] shrink-0" />
                      <span>专票记账与进项认证抵扣 <strong className="text-blue-600 font-normal">（全年12个月）</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#36B39E] shrink-0" />
                      <span>单位社保与公积金独立开户及月度托管</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-100">
                  <button
                    type="button"
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedTier === 'bundle_general'
                        ? 'bg-[#36B39E] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {selectedTier === 'bundle_general' ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>当前已选方案</span>
                      </>
                    ) : (
                      <span>选择此方案</span>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ==================== 03 服务项目与透明报价清单 ==================== */}
          <div className="rounded-3xl p-6 sm:p-8 mb-6 border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F7F2] flex items-center justify-center text-[#36B39E]">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">服务项目与透明报价清单</h2>
                  <span className="text-xs text-slate-400">
                    按照所选服务呈现明细清单 · 该免费的就全额免费 · 绝无后续二次隐形收费
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#2AA894] bg-[#E6F7F2] px-3 py-1 rounded-full font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>时效：约 3 工作日</span>
              </div>
            </div>

            {/* Current Selected Tier Badge */}
            <div className="mb-4 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className="text-slate-500 whitespace-nowrap">当前计算清单所选方案：</span>
                <span className="font-bold text-[#0F172A] bg-white px-2.5 py-1 rounded-lg border border-slate-200 whitespace-nowrap shadow-2xs">
                  {activePlan.tierName}（¥ {formatMoney(activePlan.finalPrice)} 元）
                </span>
              </div>
              <div className="text-xs text-[#2AA894] font-medium leading-normal">
                {selectedTier === 'standard'
                  ? '包含：工商代办及营业执照正副本、公安备案防伪芯片印章全套'
                  : '包含：工商设立、印章全套、银行绿色通道、电子税局、社保公积金开户、全年代账及托管'}
              </div>
            </div>

            {/* Itemized List */}
            <div className="divide-y divide-slate-100">
              {activePlan.items.map((item) => (
                <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                      item.price === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.price === 0 ? <Check className="w-4 h-4 stroke-[2.5]" /> : <FileBadge className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-[#0F172A]">{item.name}</span>
                        {item.tag && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.price === 0 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-10 sm:pl-0">
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1">
                      <span className={`text-xs sm:text-sm font-black ${
                        item.price === 0 ? 'text-emerald-600' : 'text-[#0F172A]'
                      }`}>
                        {item.price === 0 ? '¥ 0 (免费)' : `¥ ${formatMoney(item.price)}`}
                      </span>
                      <span className="text-[11px] text-slate-400 line-through">
                        ¥ {formatMoney(item.originalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Zero-fee notice */}
            <div className="mt-4 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800">
              <Info className="w-4 h-4 text-[#36B39E] shrink-0" />
              <span>
                <strong>透明报价承诺：</strong>公安特行备案防伪芯片印章全套全免（¥0）、市监局政务审批规费全免（¥0）。所选套餐外绝无任何巧立名目二次收费。
              </span>
            </div>

            {/* Cost Summary Box */}
            <div className="mt-5 p-5 rounded-2xl bg-[#F4FCFA] border border-[#C5EFE3] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap whitespace-nowrap">
                  <span>项目原价合计：¥ {formatMoney(activePlan.totalOriginal)}</span>
                  <span>·</span>
                  <span className="text-[#2AA894] font-semibold">
                    政策减免与套餐优惠：- ¥ {formatMoney(activePlan.totalDiscount)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedTier === 'standard'
                    ? '包含：全程政务网申代办、营业执照正副本原件申领、公安备案防伪芯片印章全套5枚及政务规费减免'
                    : selectedTier === 'bundle_small'
                    ? '包含：网申执照、防伪芯片五章、银行通道、电子税局、社保公积金开户、全年12个月小规模记账报税与托管'
                    : '包含：网申执照、防伪芯片五章、银行通道、一般人税局认定、社保公积金开户、全年12个月专票记账报税与托管'}
                </p>
              </div>

              <div className="flex items-center md:items-end justify-between md:justify-center md:flex-col gap-1 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#C5EFE3]/60">
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">最终应付总额</span>
                <div className="text-3xl font-black text-[#36B39E] whitespace-nowrap tracking-tight flex items-baseline">
                  <span className="text-xl mr-1 font-bold">¥</span>
                  <span>{formatMoney(activePlan.finalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== 04 交付清单与物料凭据 ==================== */}
          <div className="rounded-3xl p-6 sm:p-8 mb-6 border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F7F2] text-[#2AA894] select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
                <span>交付清单</span>
              </div>
              <span className="text-xs text-[#2AA894] font-semibold">办结出件成果物</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mb-3">
              签约完成后您将收到的全套实体与电子交付物
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {activePlan.deliverables.map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#36B39E] shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Floating Bottom Bar */}
      <div className="fixed left-0 right-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 py-3.5 px-6 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 rounded-full border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回修改调研</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#36B39E]" />
              <span>查看正式方案报告</span>
            </button>

            <button
              type="button"
              id="btn-confirm-proposal-proceed"
              onClick={() => {
                if (onUpdatePlan) {
                  onUpdatePlan(activePlan);
                }
                onProceed();
              }}
              className="px-7 py-3 rounded-full bg-[#36B39E] hover:bg-[#2AA894] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>确认方案（¥ {formatMoney(activePlan.finalPrice)}）· 前往结算</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F7F2] flex items-center justify-center text-[#36B39E]">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">企业设立定制方案与报价确认书</h3>
                  <span className="text-xs text-slate-400">方案编号：REP-2026-0916-088</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#475569]">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-sm text-[#0F172A]">企业概况评估</div>
                <div>主营方向：{survey.companyDesc}</div>
                <div>具体模式：{survey.bizDesc}</div>
                <div>拟定组织类型：{activePlan.companyType}</div>
                <div>注册资本规划：{activePlan.capitalAmount}</div>
                <div>选定服务套餐：<strong className="text-[#2AA894]">{activePlan.tierName}</strong>（¥ {formatMoney(activePlan.finalPrice)}）</div>
              </div>

              <div>
                <div className="font-bold text-sm text-[#0F172A] mb-2">已规划拟申报经营范围</div>
                <div className="flex flex-wrap gap-1.5">
                  {survey.scope.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-full bg-[#E6F7F2] text-[#2AA894]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-bold text-sm text-[#0F172A] mb-1">服务保障条款</div>
                <p className="text-slate-500 leading-relaxed">
                  本方案承诺全程办理透明，受托办理范围含全程政务网申代办、执照申领、公安备案防伪五章刻制及后续开户与财税服务。因平台自身原因导致登记失败全额退款。
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>打印报告</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReportModal(false);
                  if (onUpdatePlan) {
                    onUpdatePlan(activePlan);
                  }
                  onProceed();
                }}
                className="px-6 py-2 rounded-full bg-[#55C5A7] hover:bg-[#48BFA2] text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                确认并前往签约
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in duration-150">
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
