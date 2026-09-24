/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RegistrationPlan, SurveyData, ServiceTierType, OptionalAddonService } from '../types';
import { generatePlanFromSurvey, OPTIONAL_ADDON_SERVICES, ALL_ADDON_IDS } from '../data/mockData';
import { exportProposalToPdf } from '../utils/exportPdf';
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
  Sparkles,
  Smartphone,
  FileText,
  Scale,
  Trash2,
  FileDown,
  Loader2
} from 'lucide-react';

interface ProposalStepProps {
  plan: RegistrationPlan;
  survey: SurveyData;
  contactPhone?: string;
  onProceed: (phone?: string) => void;
  onBack: () => void;
  onUpdatePlan?: (newPlan: RegistrationPlan) => void;
  onDiscardCurrentService?: () => void;
}

export const ProposalStep: React.FC<ProposalStepProps> = ({
  plan,
  survey,
  contactPhone,
  onProceed,
  onBack,
  onUpdatePlan,
  onDiscardCurrentService
}) => {
  // Service tiers: 'bundle_small' (default) | 'bundle_general' | 'standard'
  const initialTier: ServiceTierType = 
    plan.selectedTier === 'standard' 
      ? 'standard' 
      : plan.selectedTier === 'bundle_general' 
      ? 'bundle_general' 
      : 'bundle_small';

  const [selectedTier, setSelectedTier] = useState<ServiceTierType>(initialTier);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(() => {
    // 企业注册服务：默认不勾选自选服务；全年无忧套餐已全部内置必选和默认服务
    if (initialTier === 'standard') {
      return (plan.selectedAddons || []).filter(id => ALL_ADDON_IDS.includes(id));
    }
    return [];
  });
  const [showReportModal, setShowReportModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const formatMoney = (val?: number | null) => {
    if (val === undefined || val === null || isNaN(val)) return '0';
    return val.toLocaleString();
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleExportPdf = async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    showToast('正在生成《企业商事设立与合规规划评估报告》PDF，请稍候...');
    try {
      await exportProposalToPdf({
        survey,
        plan: activePlan,
        selectedTier,
        selectedAddons,
        companyName: survey.companyDesc,
        contactPhone
      });
      showToast('《企业商事设立与合规规划评估报告》已成功存为 PDF 并下载！');
    } catch (err) {
      console.error('Export PDF failed:', err);
      showToast('已唤起浏览器打印/另存为PDF');
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Handler to switch tier
  const handleTierSelect = (tier: ServiceTierType) => {
    setSelectedTier(tier);
    // 企业注册服务：保留有效自选项；全年无忧套餐：已全部内置必选/默认服务，无需外挂自选项
    let nextAddons: string[];
    if (tier === 'standard') {
      nextAddons = selectedAddons.filter(id => ALL_ADDON_IDS.includes(id));
    } else {
      nextAddons = [];
    }
    setSelectedAddons(nextAddons);
    const updatedPlan = generatePlanFromSurvey(
      survey,
      tier,
      tier === 'bundle_general' ? 'general' : 'small',
      nextAddons
    );
    if (onUpdatePlan) {
      onUpdatePlan(updatedPlan);
    }
  };

  // Handler to toggle optional addon service
  const handleToggleAddon = (addonId: string) => {
    const isCurrentlyActive = selectedAddons.includes(addonId);
    const nextAddons = isCurrentlyActive
      ? selectedAddons.filter(id => id !== addonId)
      : [...selectedAddons, addonId];
    setSelectedAddons(nextAddons);
    const updatedPlan = generatePlanFromSurvey(
      survey,
      selectedTier,
      selectedTier === 'bundle_general' ? 'general' : 'small',
      nextAddons
    );
    if (onUpdatePlan) {
      onUpdatePlan(updatedPlan);
    }
  };

  const activePlan = (plan.selectedTier === selectedTier && JSON.stringify(plan.selectedAddons || []) === JSON.stringify(selectedAddons))
    ? plan
    : generatePlanFromSurvey(survey, selectedTier, selectedTier === 'bundle_general' ? 'general' : 'small', selectedAddons);

  // 基础核心服务项目（固定高度，不因下方增值服务勾选而增减行，避免上下抖动）
  const basePackageItems = activePlan.items.filter(item => !item.id.startsWith('addon-'));

  // 智能识别股东架构与场地入股特征
  const hasCorporateShareholder = survey.shareholderType?.some(t => t.includes('公司') || t.includes('法人'));
  const hasForeignShareholder = survey.shareholderType?.some(t => t.includes('境外') || t.includes('外资'));
  const isMultiShareholder = survey.shareholderCount === '2 个' || survey.shareholderCount === '3 个及以上';
  const hasOwnAddress = survey.regAddress?.includes('否') || survey.officeSpace === '是';
  const isGeneralTaxpayer = activePlan.taxpayerTier === 'general';

  return (
    <div className="pb-32">
      
      <div className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-4 relative z-10">
          
          {/* Top Step Heading - states current step clearly */}
          <section className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F7F2] text-[#2AA894] mb-2.5 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
              <span>第 2 步 · 方案与报价确认</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1.5">
              <span className="text-[#2AA894]">第 2 步：</span><span className="text-[#1D6C5E]">确认服务方案与费用明细</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              根据您的业务特征与财税要求生成建议方案，支持按需切换套餐与单列加购增值服务。
            </p>
          </section>

          {/* ==================== 01 架构与组织形式规划建议 (智能合规与动态排版) ==================== */}
          <div 
            id="sec-proposal-arch"
            className="rounded-2xl p-5 sm:p-6 mb-6 border border-slate-200/80 bg-white shadow-2xs transition-all"
          >
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E6F7F2] text-[#1D6C5E] select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
                <span>01 · 设立规划建议报告</span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={handleExportPdf}
                  disabled={isExportingPdf}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1D6C5E] hover:text-[#0F172A] bg-[#E6F7F2]/90 hover:bg-[#E6F7F2] border border-[#2AA894]/30 rounded-lg transition-all cursor-pointer active:scale-98 disabled:opacity-60 shadow-2xs"
                  title="将本企业商事设立规划评估报告保存为正式公文 PDF 文件"
                >
                  {isExportingPdf ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1D6C5E]" />
                      <span>正在生成 PDF...</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="w-3.5 h-3.5 text-[#1D6C5E]" />
                      <span>存为 PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Title & Context Description */}
            <div className="mb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                企业组织架构与财税规划评估报告
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                依据新《公司法》合规要求，结合您填报的实际设立特征（含股东构成与场地安排），为您智能推演的四大核心架构维度：
              </p>
            </div>

            {/* 意向诊断核对条 (确保无论股东入股或自有地址均准确呈现) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-50/90 border border-slate-200/70 mb-5 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">拟营业务方向</span>
                <span className="font-semibold text-slate-800 truncate block" title={survey.companyDesc || '现代数字化服务'}>
                  {survey.companyDesc?.trim() ? (survey.companyDesc.length > 12 ? survey.companyDesc.slice(0, 12) + '…' : survey.companyDesc) : '现代数字化服务'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">股东构成特征</span>
                <span className="font-semibold text-[#1D6C5E] truncate block">
                  {hasCorporateShareholder 
                    ? '含法人股东参股' 
                    : (hasForeignShareholder 
                      ? '涉外资合伙' 
                      : (isMultiShareholder ? `自然人合伙（${survey.shareholderCount}）` : '自然人独资（1人）'))}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">经营场所安排</span>
                <span className="font-semibold text-slate-800 truncate block">
                  {hasOwnAddress ? '自有/租赁商用场所' : '商务秘书集群合规托管'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">财税身份定位</span>
                <span className="font-semibold text-slate-800 truncate block">
                  {isGeneralTaxpayer ? '一般纳税人（专票抵扣）' : '小规模纳税人（享免税）'}
                </span>
              </div>
            </div>

            {/* 4 Core Decisions Robust Vertical Stack Layout (上下排列，不要左右分列) */}
            <div className="flex flex-col gap-3.5 mb-5">
              {/* 1. 组织形式与股权架构 */}
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50/80 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-[#1D6C5E]" />
                      <span>01 · 组织形式与股权架构</span>
                    </span>
                    <span className="text-[11px] text-[#1D6C5E] bg-[#E6F7F2] px-2 py-0.5 rounded-md font-medium">
                      {hasCorporateShareholder 
                        ? '法人与自然人合资' 
                        : (hasForeignShareholder 
                          ? '涉外商投资合伙' 
                          : (isMultiShareholder ? `自然人合伙 · ${survey.shareholderCount}` : '单人100%全资控股'))}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 mb-2">
                    {activePlan.companyType}
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
                    {hasCorporateShareholder ? (
                      <>
                        <div className="flex items-start gap-1.5">
                          <span className="text-[#1D6C5E] font-bold shrink-0">·</span>
                          <span><strong>【法人股东凭据】</strong> 对方公司作为法人股东入股，须提供其母公司营业执照副本（加盖公章）、法人身份证复印件及母公司出具的《股东会决议》。</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-[#1D6C5E] font-bold shrink-0">·</span>
                          <span><strong>【股权防僵局】</strong> 建议合理设计表决权比例（如 67% 绝对控制权或 51% 相对控制权），避免 50:50 势均力敌引发经营决策僵局。</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-[#1D6C5E] font-bold shrink-0">·</span>
                          <span><strong>【治理精简配置】</strong> 新《公司法》法定代表人可由执行董事或经理担任；可设立审计委员会替代监事会，精简内部治理层级。</span>
                        </div>
                      </>
                    ) : isMultiShareholder ? (
                      <>
                        <div className="flex items-start gap-1.5">
                          <span className="text-[#1D6C5E] font-bold shrink-0">·</span>
                          <span><strong>【合伙机制】</strong> 建议在公司章程中明确约定表决权比例、分红机制及股权转让退出通道，维护合伙团队长期稳定性。</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-[#1D6C5E] font-bold shrink-0">·</span>
                          <span><strong>【内部治理】</strong> 依据新《公司法》，可设立审计委员会替代监事会，精简治理层级，显著降低合伙初期的决策沟通成本。</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-[#1D6C5E] font-bold shrink-0">·</span>
                          <span><strong>【有限责任】</strong> 各股东以认缴出资额为限承担有限责任，建立法定风险防火墙，个人与家庭财产不受连带追索。</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start gap-1.5">
                          <span className="text-[#1D6C5E] font-bold shrink-0">·</span>
                          <span><strong>【完全掌控】</strong> 股东享有 100% 决策控制权，日常经营与签约敏捷高效，免去合伙协商流程。</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-[#1D6C5E] font-bold shrink-0">·</span>
                          <span><strong>【财产独立】</strong> 依据新《公司法》，一人有限责任公司应当在每一会计年度终了时进行审计，确保公司财产与个人财产严格独立。</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-[#1D6C5E] font-bold shrink-0">·</span>
                          <span><strong>【股权扩展】</strong> 后续若引入合伙人或员工期权池，可随时通过增资扩股或股权转让平滑变更为多元合伙公司。</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. 建议注册资本与出资规划 */}
              <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/20 hover:bg-amber-50/40 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-amber-600" />
                      <span>02 · 注册资本与出资规划</span>
                    </span>
                    <span className="text-[11px] text-amber-800 bg-amber-100/70 border border-amber-200/60 px-2 py-0.5 rounded-md font-medium">
                      新《公司法》5年实缴
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 mb-2 flex items-baseline gap-1.5">
                    <span className="text-[#1D6C5E] text-base">{activePlan.capitalAmount}</span>
                    <span className="text-xs text-slate-400 font-normal">（认缴出资额）</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
                    <div className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold shrink-0">·</span>
                      <span><strong>【法定实缴期限】</strong> 新《公司法》第47条明确：全体股东认缴出资额须自公司成立之日起 5 年内缴足，按期公示实缴进度。</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold shrink-0">·</span>
                      <span><strong>【多方出资协同】</strong> 各股东按各自认缴比例分批汇入公司对公账户，转账备注“投资款”，妥善留存银行对公回单与财务凭证。</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold shrink-0">·</span>
                      <span><strong>【出资形式多样】</strong> 支持货币出资，亦可用知识产权（专利/软著）、实物设备等作价出资；建议规模匹配初期周转，避免虚高。</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. 建议纳税身份与发票统筹 */}
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50/80 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Receipt className="w-4 h-4 text-[#1D6C5E]" />
                      <span>03 · 财税身份与发票统筹</span>
                    </span>
                    <span className="text-[11px] text-slate-700 bg-slate-200/60 px-2 py-0.5 rounded-md font-medium">
                      {isGeneralTaxpayer ? '一般纳税人 · 专票进项抵扣' : '小规模纳税人 · 享普惠减免'}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 mb-2">
                    {activePlan.taxpayerIdentity.split('（')[0]}
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
                    <div className="flex items-start gap-1.5">
                      <span className="text-[#1D6C5E] font-bold shrink-0">·</span>
                      <span><strong>【税负政策优势】</strong> {isGeneralTaxpayer 
                        ? '增值税税率通常为6%或13%，取得的进项专票可全额认证抵扣，适合对接大型政企招投标与外贸出口退税。' 
                        : '享受国家月度10万元（季度30万元）以下免征增值税等减免政策，征收率仅1%或3%，初创期综合税负低。'}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-[#1D6C5E] font-bold shrink-0">·</span>
                      <span><strong>【数电发票额度】</strong> 电子税务局完成新设立实名登记后，根据初期业务诉求即时核定“数电发票”授信开票额度，随开随送达。</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-[#1D6C5E] font-bold shrink-0">·</span>
                      <span><strong>【四流合一合规】</strong> 严格保持“业务合同、发票票面、银行资金流水、服务或货物交付”真实一致，从源头规范建账与月度申报。</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. 经营场所与住所合规 */}
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50/80 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Landmark className="w-4 h-4 text-[#1D6C5E]" />
                      <span>04 · 经营场所与住所合规</span>
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                      hasOwnAddress 
                        ? 'text-blue-700 bg-blue-50 border border-blue-200/50' 
                        : 'text-[#1D6C5E] bg-[#E6F7F2]'
                    }`}>
                      {hasOwnAddress ? '自有/租赁商用场地 · 无需挂靠' : '园区合规商务秘书集群托管'}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 mb-2">
                    {hasOwnAddress ? '自有实体商用场所合规登记' : '商务秘书集群地址合规托管'}
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
                    {hasOwnAddress ? (
                      <>
                        <div className="flex items-start gap-1.5">
                          <span className="text-blue-600 font-bold shrink-0">·</span>
                          <span><strong>【规划用途红线】</strong> 房屋规划用途必须为“商业”、“办公”或“工业厂房”，<strong>纯居民住宅依法不得直接注册</strong>（防止被市监驳回）。</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-blue-600 font-bold shrink-0">·</span>
                          <span><strong>【商事登记必备】</strong> 备齐房东《不动产权证书》复印件（产权人盖章或签字）、规范《房屋租赁合同》及租金支付凭证（转租需出具转租授权书）。</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-blue-600 font-bold shrink-0">·</span>
                          <span><strong>【实地核验尽调】</strong> 办公场地门牌标识清晰、悬挂公司招牌并有实体工位，随时配合开户银行客户经理上门实地拍照尽调，确保工商信函正常签收。</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start gap-1.5">
                          <span className="text-[#1D6C5E] font-bold shrink-0">·</span>
                          <span><strong>【节省房租资金】</strong> 专为初创与轻资产团队定制，免去初期每月数千至数万元的实体办公室租金与押金，降低创业启动成本。</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-[#1D6C5E] font-bold shrink-0">·</span>
                          <span><strong>【政务信函通达】</strong> 专属政务秘书常态化代收市场监管局、税务局及司法专递信件，防范因地址失联被列入“经营异常名录”。</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-[#1D6C5E] font-bold shrink-0">·</span>
                          <span><strong>【协同银行开户】</strong> 提供经市监局备案的正规园区场地证明，专人协助对接合作银行绿色通道，顺利完成企业对公账户开立。</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 经营范围与资质建议 */}
            <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-200/70 mb-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FileBadge className="w-4 h-4 text-[#1D6C5E]" />
                  <span>营业执照拟定经营范围</span>
                </span>
                <span className="text-[11px] text-slate-500">
                  共选定 {survey.scope.length} 项 · 依营业执照依法自主经营
                </span>
              </div>

              {/* 营业执照标准格式文本 */}
              <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200/60 leading-relaxed mb-3">
                <span className="font-semibold text-slate-900">一般项目：</span>
                {survey.scope.join('；')}。（除依法须经批准的项目外，凭营业执照依法自主开展经营活动）
              </div>

              {/* 快速直观的标签展示 */}
              <div className="flex flex-wrap gap-1.5">
                {survey.scope.map((item) => (
                  <span 
                    key={item}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white text-slate-700 border border-slate-200/80 shadow-2xs"
                  >
                    <Check className="w-3 h-3 text-[#1D6C5E]" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>

              {/* 后置资质说明（如涉及） */}
              {activePlan.postQualifications.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-slate-200/60 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-800 font-medium mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>后续资质提醒（证照分离，不影响先领营业执照）：</span>
                  </div>
                  <p className="text-slate-600 pl-5 leading-relaxed text-[11px] sm:text-xs">
                    您涉及的【<strong className="text-slate-800">{activePlan.postQualifications.join('、')}</strong>】属于后置许可或备案事项。根据国家“证照分离”政策，营业执照办结后由专员协同办理即可，设立初期不影响领照。
                  </p>
                </div>
              )}
            </div>

            {/* 3条开业合规避坑动态指南 (上下排列，不要左右分列) */}
            <div className="mb-4">
              <h3 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1D6C5E]" />
                <span>初创期合规避坑建议（针对性提示）</span>
              </h3>
              
              <div className="flex flex-col gap-2.5 text-xs text-slate-600">
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1D6C5E]"></span>
                    <span>
                      {hasCorporateShareholder || isMultiShareholder ? '1. 股权比例与章程约定' : '1. 出资节奏把控'}
                    </span>
                  </div>
                  <p className="text-slate-500 leading-relaxed text-[11px]">
                    {hasCorporateShareholder || isMultiShareholder 
                      ? '法人股东入股或多人合伙时，必须在章程中清晰约定表决权与分红机制，规避50:50对半开导致公司治理僵局。' 
                      : '新《公司法》规定5年内认缴到位。按实际资金节奏汇入对公账户，保留好银行电子回单与财务记账凭证。'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1D6C5E]"></span>
                    <span>
                      {hasOwnAddress ? '2. 场地凭据与门牌水牌' : '2. 公私账务分明'}
                    </span>
                  </div>
                  <p className="text-slate-500 leading-relaxed text-[11px]">
                    {hasOwnAddress 
                      ? '自有场地必须核查房产证用途（禁止纯住宅），提前悬挂企业名称招牌并配备工位，配合银行经理上门实地尽调。' 
                      : '公司对公账户切勿与个人微信或私卡混用。对外业务往来注意保持合同、发票与流水一致，规范记账。'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1D6C5E]"></span>
                    <span>3. 按期报税与年报</span>
                  </div>
                  <p className="text-slate-500 leading-relaxed text-[11px]">
                    即使刚成立无收入也须按期做“零申报”；每年 1-6 月按时在国家信用系统报送企业年报，避免地址失联。
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Subtle Note */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-400">
              <span>* 方案依据新《公司法》及商事登记标准生成，供设立规划参考，最终以登记主管机关核准为准。</span>
              <span className="hidden sm:inline">商事登记合规指导标准</span>
            </div>
          </div>

          {/* ==================== 02 套餐方案选择 ==================== */}
          <div className="rounded-2xl p-5 sm:p-6 mb-5 border border-slate-200/80 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E6F7F2] text-[#2AA894] select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
                <span>02 · 服务套餐</span>
              </div>
              <span className="text-xs text-slate-400">点击卡片切换方案 · 清单实时联动</span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight mb-4">
              服务套餐选择
            </h2>

            {/* 3 distinct service packages */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-stretch">
              
              {/* Package 1: 企业注册服务 */}
              <div
                id="tier-card-standard"
                onClick={() => handleTierSelect('standard')}
                className={`p-4 sm:p-4.5 rounded-xl cursor-pointer transition-colors flex flex-col justify-between ${
                  selectedTier === 'standard'
                    ? 'border border-[#36B39E] bg-[#F8FCFB]'
                    : 'border border-slate-200/80 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      基础设立 · 仅办证照
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                      selectedTier === 'standard' ? 'bg-[#36B39E] border-[#36B39E] text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {selectedTier === 'standard' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-800">企业注册服务</h3>
                  <p className="text-xs text-slate-400 mt-0.5 mb-2.5">已有专职财务，仅委托办理执照与印章</p>

                  <div className="py-2 my-2 border-y border-slate-100 flex items-baseline justify-between">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xs font-bold text-slate-400">¥</span>
                      <span className={`text-xl sm:text-2xl font-black ${selectedTier === 'standard' ? 'text-[#36B39E]' : 'text-slate-800'}`}>
                        600
                      </span>
                      <span className="text-xs text-slate-400 line-through ml-1.5">¥1,700</span>
                    </div>
                    <span className="text-[11px] font-medium text-[#2AA894] bg-[#E6F7F2] px-1.5 py-0.5 rounded">
                      省 ¥1,100
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 my-3">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#36B39E] shrink-0" />
                      <span>全程政务网申与执照申领</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#36B39E] shrink-0" />
                      <span>公安特行芯片印章5枚（已含）</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#36B39E] shrink-0" />
                      <span>市监行政审批规费（已含）</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#36B39E] shrink-0" />
                      <span>公司章程与股东决议编制</span>
                    </li>
                    <li className="flex items-center gap-1.5 text-slate-400 pt-1 border-t border-slate-100">
                      <span className="w-3.5 text-center text-slate-300 shrink-0">—</span>
                      <span>可选加购银行开户(¥200)/税局开户(¥100)/社保公积金开户(¥100)/零申报服务(¥600/年)</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2.5 mt-1 border-t border-slate-100">
                  <button
                    type="button"
                    className={`w-full py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                      selectedTier === 'standard'
                        ? 'bg-[#36B39E] text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {selectedTier === 'standard' ? (
                      <>
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>已选此方案</span>
                      </>
                    ) : (
                      <span>选择此方案</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Package 2: 全年无忧服务（小规模） */}
              <div
                id="tier-card-bundle-small"
                onClick={() => handleTierSelect('bundle_small')}
                className={`p-4 sm:p-4.5 rounded-xl cursor-pointer transition-colors flex flex-col justify-between ${
                  selectedTier === 'bundle_small'
                    ? 'border border-[#36B39E] bg-[#F8FCFB]'
                    : 'border border-slate-200/80 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-medium text-[#2AA894] bg-[#E6F7F2] px-2 py-0.5 rounded-md">
                      推荐 · 含企业注册
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                      selectedTier === 'bundle_small' ? 'bg-[#36B39E] border-[#36B39E] text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {selectedTier === 'bundle_small' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-800">全年无忧（小规模）</h3>
                  <p className="text-xs text-slate-400 mt-0.5 mb-2.5">含工商设立全套 + 12个月记账报税</p>

                  <div className="py-2 my-2 border-y border-slate-100 flex items-baseline justify-between">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xs font-bold text-slate-400">¥</span>
                      <span className="text-xl sm:text-2xl font-black text-[#36B39E]">
                        2,500
                      </span>
                      <span className="text-xs text-slate-400 line-through ml-1.5">¥6,500</span>
                    </div>
                    <span className="text-[11px] font-medium text-[#2AA894] bg-[#E6F7F2] px-1.5 py-0.5 rounded">
                      省 ¥4,000
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 my-3">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#36B39E] shrink-0" />
                      <span>含企业注册全程网申与执照正副本</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#36B39E] shrink-0" />
                      <span>公安备案防伪芯片印章5枚</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#36B39E] shrink-0" />
                      <span>市监行政审批规费（已含）</span>
                    </li>
                    <li className="flex items-center gap-1.5 text-[#2AA894]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#36B39E] shrink-0" />
                      <span>含银行/税局/社保公积金开户及社保服务</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#36B39E] shrink-0" />
                      <span>全年财务代记账服务（小规模 12个月）</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2.5 mt-1 border-t border-slate-100">
                  <button
                    type="button"
                    className={`w-full py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                      selectedTier === 'bundle_small'
                        ? 'bg-[#36B39E] text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {selectedTier === 'bundle_small' ? (
                      <>
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>已选此方案</span>
                      </>
                    ) : (
                      <span>选择此方案</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Package 3: 全年无忧服务（一般纳税人） */}
              <div
                id="tier-card-bundle-general"
                onClick={() => handleTierSelect('bundle_general')}
                className={`p-4 sm:p-4.5 rounded-xl cursor-pointer transition-colors flex flex-col justify-between ${
                  selectedTier === 'bundle_general'
                    ? 'border border-[#36B39E] bg-[#F8FCFB]'
                    : 'border border-slate-200/80 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      专票抵扣 · 含企业注册
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                      selectedTier === 'bundle_general' ? 'bg-[#36B39E] border-[#36B39E] text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {selectedTier === 'bundle_general' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-800">全年无忧（一般纳税人）</h3>
                  <p className="text-xs text-slate-400 mt-0.5 mb-2.5">开具专票、有进项税额抵扣需求企业</p>

                  <div className="py-2 my-2 border-y border-slate-100 flex items-baseline justify-between">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xs font-bold text-slate-400">¥</span>
                      <span className={`text-xl sm:text-2xl font-black ${selectedTier === 'bundle_general' ? 'text-[#36B39E]' : 'text-slate-800'}`}>
                        3,000
                      </span>
                      <span className="text-xs text-slate-400 line-through ml-1.5">¥7,500</span>
                    </div>
                    <span className="text-[11px] font-medium text-[#2AA894] bg-[#E6F7F2] px-1.5 py-0.5 rounded">
                      省 ¥4,500
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 my-3">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#36B39E] shrink-0" />
                      <span>含企业注册全程网申与执照正副本</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#36B39E] shrink-0" />
                      <span>公安备案防伪芯片印章5枚</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#36B39E] shrink-0" />
                      <span>市监行政审批规费（已含）</span>
                    </li>
                    <li className="flex items-center gap-1.5 text-blue-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#36B39E] shrink-0" />
                      <span>含银行/税局/社保公积金开户及社保服务</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#36B39E] shrink-0" />
                      <span>全年财务代记账服务（一般纳税人 12个月）</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2.5 mt-1 border-t border-slate-100">
                  <button
                    type="button"
                    className={`w-full py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                      selectedTier === 'bundle_general'
                        ? 'bg-[#36B39E] text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {selectedTier === 'bundle_general' ? (
                      <>
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>已选此方案</span>
                      </>
                    ) : (
                      <span>选择此方案</span>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ==================== 03 服务项目与自选增值服务清单 ==================== */}
          <div className="rounded-2xl p-5 sm:p-6 mb-5 border border-slate-200/80 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E6F7F2] flex items-center justify-center text-[#36B39E]">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-800">
                    <span className="text-[#2AA894] mr-1">03 ·</span>服务项目与自选增值服务清单
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#2AA894] bg-[#E6F7F2] px-2.5 py-0.5 rounded-full font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>时效：约 3 工作日</span>
              </div>
            </div>

            {/* Current Selected Tier Info */}
            <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200/70 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-400">已选方案：</span>
                <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200/70">
                  {activePlan.tierName}
                </span>
                <span className="text-slate-500">
                  基准标价：¥ {selectedTier === 'standard' ? '600' : selectedTier === 'bundle_small' ? '2,500' : '3,000'} 元
                </span>
              </div>
              <div className="text-xs text-[#2AA894]">
                {selectedTier === 'standard'
                  ? '包含：执照正副本 + 公安备案防伪5章 + 市监规费减免'
                  : '包含：企业注册全套 + 全年代理记账 + 银行开户/税局开户/社保公积金等必选与默认服务'}
              </div>
            </div>

            {/* Single Unified Service List (套餐服务与自选服务不分区合并) */}
            <div className="divide-y divide-slate-100 text-xs rounded-xl border border-slate-100 px-3 bg-white">
              {/* 1. 套餐标配/必选服务项目（勾选不可变，前面都是绿色的勾子） */}
              {basePackageItems.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-5 h-5 rounded-md bg-[#E6F7F2] text-[#2AA894] flex items-center justify-center shrink-0 select-none">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-medium text-slate-800">{item.name}</span>
                        {item.tag && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                            item.price === 0 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                              : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                          }`}>
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">{item.desc}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-baseline gap-1.5 justify-end">
                      <span className={`font-bold ${
                        item.price === 0 ? 'text-[#2AA894] font-medium text-xs' : 'text-slate-800'
                      }`}>
                        {item.price === 0 ? '已含' : `¥${formatMoney(item.price)}`}
                      </span>
                      <span className="text-[11px] text-slate-400 line-through">
                        ¥{formatMoney(item.originalPrice)}
                      </span>
                    </div>
                    {item.originalPrice > item.price && (
                      <span className="text-[10px] text-[#2AA894] font-medium block mt-0.5 text-right">
                        {item.price === 0 ? `免收 ¥${formatMoney(item.originalPrice)}` : `已省 ¥${formatMoney(item.originalPrice - item.price)}`}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* 2. 企业注册服务内可选付费增值服务（前面是可选的 checkbox，点击可勾选/取消） */}
              {selectedTier === 'standard' && OPTIONAL_ADDON_SERVICES.map((addon) => {
                const isSelected = selectedAddons.includes(addon.id);

                return (
                  <div
                    key={addon.id}
                    onClick={() => handleToggleAddon(addon.id)}
                    className="py-2.5 flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-50/70 transition-colors select-none group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* 可选的 checkbox */}
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? 'bg-[#36B39E] border border-[#36B39E] text-white'
                            : 'border border-slate-300 bg-white group-hover:border-[#36B39E]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`font-medium ${isSelected ? 'text-slate-800' : 'text-slate-700'}`}>
                            {addon.name}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded border ${
                              isSelected
                                ? 'text-[#2AA894] bg-[#E6F7F2] border-[#36B39E]/30'
                                : 'text-slate-500 bg-slate-100 border-slate-200'
                            }`}
                          >
                            {isSelected ? '已加选' : '可选加购'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">{addon.desc}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-baseline gap-1.5 justify-end">
                        <span className={`font-bold ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}>
                          ¥{addon.price}
                        </span>
                        <span className="text-[11px] text-slate-400">/{addon.unit}</span>
                        <span className="text-[11px] text-slate-400 line-through">
                          ¥{formatMoney(addon.originalPrice)}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#2AA894] font-medium block mt-0.5 text-right">
                        已免 ¥{formatMoney(addon.originalPrice - addon.price)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Combined Cost Summary Box */}
            <div className="mt-5 p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-2 flex-wrap">
                  <span>项目原价：¥{formatMoney(activePlan.totalOriginal)}</span>
                  <span>·</span>
                  <span className="text-[#2AA894] font-medium">
                    政策减免与套餐优惠：-¥{formatMoney(activePlan.totalDiscount)}
                  </span>
                  {selectedTier === 'standard' && selectedAddons.length > 0 && (
                    <>
                      <span>·</span>
                      <span className="text-slate-600 font-medium">
                        加选增值服务（{selectedAddons.length}项）：+¥{formatMoney(activePlan.finalPrice - 600)}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-slate-600">
                  {selectedTier === 'standard'
                    ? '已选【企业注册服务】：政务代办、执照申领、公安防伪芯片5章及规费全免' + (selectedAddons.length > 0 ? `，加选 ${selectedAddons.length} 项可选增值服务。` : '。')
                    : selectedTier === 'bundle_small'
                    ? '已选【全年无忧（小规模）】：含企业注册全套、小规模代理记账，以及银行开户、税局开户、社保公积金开户与社保公积金服务。'
                    : '已选【全年无忧（一般纳税人）】：含企业注册全套、一般纳税人专票记账，以及银行开户、税局开户、社保公积金开户与社保公积金服务。'}
                </p>
              </div>

              <div className="flex items-center md:items-end justify-between md:justify-center md:flex-col gap-0.5 shrink-0 pt-2.5 md:pt-0 border-t md:border-t-0 border-slate-200/60">
                <span className="text-xs text-slate-400 whitespace-nowrap">最终应付总额</span>
                <div className="text-2xl font-black text-[#36B39E] whitespace-nowrap tracking-tight flex items-baseline">
                  <span className="text-lg mr-0.5 font-bold">¥</span>
                  <span>{formatMoney(activePlan.finalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Bottom Bar */}
      <div className="fixed left-0 right-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 py-3 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>返回修改调研</span>
            </button>

            {onDiscardCurrentService && (
              <button
                type="button"
                onClick={() => setShowDiscardConfirm(true)}
                className="px-3 py-2 rounded-full border border-rose-200/80 bg-rose-50/60 hover:bg-rose-100 text-rose-600 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                title="未支付前可作废此服务"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">作废此服务</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#36B39E]" />
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
              className="px-6 py-2.5 rounded-full bg-[#36B39E] hover:bg-[#2AA894] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>确认方案（¥ {formatMoney(activePlan.finalPrice)}）</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Discard Confirmation Modal */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-base font-bold text-slate-900 text-center mb-2">
              确认作废当前注册服务？
            </h3>
            <p className="text-xs text-slate-500 text-center leading-relaxed mb-6">
              作废后，当前未支付的方案及意向调研记录将被清除。您可以重新发起新的公司设立服务。
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowDiscardConfirm(false)}
                className="py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                再想想
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDiscardConfirm(false);
                  if (onDiscardCurrentService) {
                    onDiscardCurrentService();
                  }
                }}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                确认作废
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <h3 className="text-base font-bold text-[#0F172A]">企业商事设立规划与合规评估报告</h3>
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
                <div>经营住所安排：{hasOwnAddress ? '自有/租赁实体商用场所登记' : '商务秘书集群地址合规托管'}</div>
                <div>财税身份规划：{activePlan.taxpayerIdentity.split('（')[0]}</div>
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
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                className="px-5 py-2 rounded-full border border-[#2AA894]/30 bg-[#E6F7F2]/60 hover:bg-[#E6F7F2] text-xs font-semibold text-[#1D6C5E] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isExportingPdf ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1D6C5E]" />
                    <span>正在导出 PDF...</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-3.5 h-3.5 text-[#1D6C5E]" />
                    <span>存为 PDF</span>
                  </>
                )}
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
                className="px-6 py-2 rounded-full bg-[#36B39E] hover:bg-[#2AA894] text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                确认方案
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
