/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RegistrationDetails, UploadedDoc } from '../types';
import { 
  Building2, 
  Users, 
  MapPin, 
  UploadCloud, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  FileText, 
  Sparkles, 
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  FileCheck,
  ShieldCheck,
  Paperclip
} from 'lucide-react';

interface RegistrationDetailsStepProps {
  details: RegistrationDetails;
  onUpdateDetails: (details: RegistrationDetails) => void;
  onSubmitForReview: () => void;
  onBackToGroup: () => void;
}

export const RegistrationDetailsStep: React.FC<RegistrationDetailsStepProps> = ({
  details,
  onUpdateDetails,
  onSubmitForReview,
  onBackToGroup
}) => {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleUploadMock = (docId: string) => {
    const updatedDocs = details.docs.map((d) => {
      if (d.id === docId) {
        return {
          ...d,
          status: 'uploaded' as const,
          fileName: d.name + '_高清扫描件.pdf',
          fileSize: '1.8 MB',
          updatedAt: '刚刚'
        };
      }
      return d;
    });
    onUpdateDetails({ ...details, docs: updatedDocs });
    showToast('资料上传成功并已通过系统清晰度检测！');
  };

  const handleUploadAllMock = () => {
    const updatedDocs = details.docs.map((d) => ({
      ...d,
      status: 'uploaded' as const,
      fileName: d.name + '_电子扫描件.pdf',
      fileSize: '1.5 MB',
      updatedAt: '刚刚'
    }));
    onUpdateDetails({ ...details, docs: updatedDocs });
    showToast('已一键齐备全部申办资料！');
  };

  const handleShareholderRatioChange = (id: string, ratio: number) => {
    const updated = details.shareholders.map((s) => {
      if (s.id === id) {
        return { ...s, ratio, capitalAmount: ratio };
      }
      return s;
    });
    onUpdateDetails({ ...details, shareholders: updated });
  };

  const handleAddShareholder = () => {
    const newId = `sh-${Date.now()}`;
    const newSh = {
      id: newId,
      name: '新股东',
      idCard: '440301199001010011',
      phone: '13800000000',
      ratio: 0,
      capitalAmount: 0
    };
    onUpdateDetails({
      ...details,
      shareholders: [...details.shareholders, newSh]
    });
    showToast('已添加新股东');
  };

  const handleRemoveShareholder = (id: string) => {
    if (details.shareholders.length <= 1) {
      showToast('至少需保留一名股东');
      return;
    }
    const updated = details.shareholders.filter((s) => s.id !== id);
    onUpdateDetails({ ...details, shareholders: updated });
  };

  const totalRatio = details.shareholders.reduce((sum, s) => sum + s.ratio, 0);

  const handleFinalSubmit = () => {
    if (!details.primaryName.trim()) {
      showToast('请填写企业主选公司全称');
      return;
    }
    if (!details.legalRepresentative.name || !details.legalRepresentative.idCard) {
      showToast('请完整填写法定代表人身份信息');
      return;
    }
    if (totalRatio !== 100) {
      showToast(`股东持股比例之和必须等于 100%（当前合计：${totalRatio}%）`);
      return;
    }

    const missingRequiredDoc = details.docs.find(d => d.required && d.status === 'pending');
    if (missingRequiredDoc) {
      showToast(`请先上传必备资料：${missingRequiredDoc.name}`);
      return;
    }

    onSubmitForReview();
  };

  return (
    <div className="pb-32">
      
      <div className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-4 relative z-10">

          {/* Hero Section */}
          <section className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F7F2] text-[#2AA894] mb-3.5 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
              <span>申报阶段 · U-S 填写企业注册信息与上传资料</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0F172A] tracking-tight leading-[1.2] mb-3.5">
              政务申报，<br />
              <span className="text-[#48BFA2]">企业登记信息与资料归集上传</span>
            </h1>

            <p className="text-sm sm:text-[14.5px] text-[#64748B] max-w-2xl leading-relaxed">
              请准确录入企业字号申报信息、董监高人员架构并上传证件原件扫描件，提交后系统将即时提醒客服专员开展合规核验。
            </p>
          </section>

          <div className="space-y-6">
            
            {/* ==================== 01 企业字号自主申报 ==================== */}
            <div className="rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F7F2] text-[#2AA894] select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
                  <span>01 · 字号申报</span>
                </div>
                <span className="text-xs font-semibold text-[#2AA894] bg-[#E6F7F2] px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>市监核名预估通过率：96%</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight mb-4">
                企业自主申报名称与备选字号
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    主选公司全称 <span className="text-red-500">*</span>
                    <span className="text-slate-400 font-normal ml-2">格式：行政区划 + 字号 + 行业特征 + 组织形式</span>
                  </label>
                  <input
                    type="text"
                    value={details.primaryName}
                    onChange={(e) => onUpdateDetails({ ...details, primaryName: e.target.value })}
                    className="w-full p-3 rounded-2xl border border-slate-200 outline-none focus:border-[#48BFA2] font-bold text-[#0F172A] text-sm bg-white"
                    placeholder="如：云帆盛景出海跨境科技（深圳）有限公司"
                  />
                </div>

                {/* Real-time Name Diagnostic Check Box */}
                <div className="p-4 rounded-2xl bg-[#F4FCFA] border border-[#D1F2EB] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-white text-[#2AA894] border border-[#D1F2EB] font-medium">
                      ✓ 行政区划：深圳
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-white text-[#2AA894] border border-[#D1F2EB] font-medium">
                      ✓ 核心字号：云帆盛景（无驰名冲突）
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-white text-[#2AA894] border border-[#D1F2EB] font-medium">
                      ✓ 行业表述符合国民经济行业分类
                    </span>
                  </div>
                  <span className="text-[#2AA894] font-semibold">符合自主申报规则</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">备选用名 1（主选重名时代为提交）</label>
                    <input
                      type="text"
                      value={details.backupName1}
                      onChange={(e) => onUpdateDetails({ ...details, backupName1: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#48BFA2] text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">备选用名 2</label>
                    <input
                      type="text"
                      value={details.backupName2}
                      onChange={(e) => onUpdateDetails({ ...details, backupName2: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#48BFA2] text-xs bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== 02 法定代表人与董监高 ==================== */}
            <div className="rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F7F2] text-[#2AA894] select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
                  <span>02 · 董监高架构</span>
                </div>
                <span className="text-xs text-slate-400">依据新《公司法》规范法定职责</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight mb-4">
                法定代表人、监事与财务负责人
              </h2>

              {/* Legal Representative */}
              <div className="mb-5">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#36B39E]" />
                  <span>法定代表人（执行公司事务负责人）</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-slate-500 block mb-1">姓名 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={details.legalRepresentative.name}
                      onChange={(e) => onUpdateDetails({
                        ...details,
                        legalRepresentative: { ...details.legalRepresentative, name: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#48BFA2] font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1">身份证号 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={details.legalRepresentative.idCard}
                      onChange={(e) => onUpdateDetails({
                        ...details,
                        legalRepresentative: { ...details.legalRepresentative, idCard: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#48BFA2] font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1">手机号码 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={details.legalRepresentative.phone}
                      onChange={(e) => onUpdateDetails({
                        ...details,
                        legalRepresentative: { ...details.legalRepresentative, phone: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#48BFA2] font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1">政务联络邮箱</label>
                    <input
                      type="email"
                      value={details.legalRepresentative.email}
                      onChange={(e) => onUpdateDetails({
                        ...details,
                        legalRepresentative: { ...details.legalRepresentative, email: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#48BFA2]"
                    />
                  </div>
                </div>
              </div>

              {/* Supervisor & Finance Officer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-800 block mb-2">监事人员信息（不可与法人为同一人）</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-slate-500 block mb-1">监事姓名</label>
                      <input
                        type="text"
                        value={details.supervisor.name}
                        onChange={(e) => onUpdateDetails({
                          ...details,
                          supervisor: { ...details.supervisor, name: e.target.value }
                        })}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">监事身份证号</label>
                      <input
                        type="text"
                        value={details.supervisor.idCard}
                        onChange={(e) => onUpdateDetails({
                          ...details,
                          supervisor: { ...details.supervisor, idCard: e.target.value }
                        })}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-800 block mb-2">财务负责人信息（电子税局实名绑定）</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-slate-500 block mb-1">财务负责人姓名</label>
                      <input
                        type="text"
                        value={details.financeOfficer.name}
                        onChange={(e) => onUpdateDetails({
                          ...details,
                          financeOfficer: { ...details.financeOfficer, name: e.target.value }
                        })}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">财务负责人身份证号</label>
                      <input
                        type="text"
                        value={details.financeOfficer.idCard}
                        onChange={(e) => onUpdateDetails({
                          ...details,
                          financeOfficer: { ...details.financeOfficer, idCard: e.target.value }
                        })}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== 03 股东构成与出资比例 ==================== */}
            <div className="rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F7F2] text-[#2AA894] select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
                  <span>03 · 股权架构</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    totalRatio === 100 
                      ? 'bg-[#E6F7F2] text-[#2AA894]' 
                      : 'bg-red-50 text-red-600'
                  }`}>
                    持股合计：{totalRatio}% {totalRatio === 100 ? '（合规100%）' : '（需等于100%）'}
                  </span>
                  <button
                    type="button"
                    onClick={handleAddShareholder}
                    className="px-3 py-1 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>添加股东</span>
                  </button>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight mb-4">
                股东构成与持股出资比例
              </h2>

              {/* Visual Equity Bar */}
              <div className="mb-5">
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  {details.shareholders.map((sh, idx) => {
                    const colors = ['bg-[#48BFA2]', 'bg-blue-500', 'bg-amber-500', 'bg-purple-500'];
                    return (
                      <div
                        key={sh.id}
                        style={{ width: `${sh.ratio}%` }}
                        className={`h-full ${colors[idx % colors.length]} transition-all duration-300 relative group`}
                        title={`${sh.name}: ${sh.ratio}%`}
                      />
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                  {details.shareholders.map((sh, idx) => {
                    const dots = ['bg-[#48BFA2]', 'bg-blue-500', 'bg-amber-500', 'bg-purple-500'];
                    return (
                      <span key={sh.id} className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${dots[idx % dots.length]}`}></span>
                        <span>{sh.name} ({sh.ratio}%)</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Shareholder List */}
              <div className="space-y-3">
                {details.shareholders.map((sh) => (
                  <div key={sh.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 flex-1">
                      <div>
                        <span className="text-slate-400 block mb-0.5">股东姓名</span>
                        <input
                          type="text"
                          value={sh.name}
                          onChange={(e) => {
                            const updated = details.shareholders.map((s) => s.id === sh.id ? { ...s, name: e.target.value } : s);
                            onUpdateDetails({ ...details, shareholders: updated });
                          }}
                          className="w-full p-2 rounded-xl border border-slate-200 bg-white font-semibold"
                        />
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">身份证号</span>
                        <input
                          type="text"
                          value={sh.idCard}
                          onChange={(e) => {
                            const updated = details.shareholders.map((s) => s.id === sh.id ? { ...s, idCard: e.target.value } : s);
                            onUpdateDetails({ ...details, shareholders: updated });
                          }}
                          className="w-full p-2 rounded-xl border border-slate-200 bg-white font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">持股比例 (%)</span>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={sh.ratio}
                          onChange={(e) => handleShareholderRatioChange(sh.id, Number(e.target.value))}
                          className="w-full p-2 rounded-xl border border-slate-200 bg-white font-bold text-[#2AA894]"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveShareholder(sh.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors self-end sm:self-center cursor-pointer"
                      title="删除股东"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ==================== 04 注册地址与经营场所 ==================== */}
            <div className="rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F7F2] text-[#2AA894] select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
                  <span>04 · 场地信息</span>
                </div>
                <span className="text-xs text-[#2AA894] bg-[#E6F7F2] px-3 py-1 rounded-full font-semibold">
                  已核验产权编码
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight mb-4">
                企业法定注册地址与经营场地
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="text-slate-500 block mb-1">地址全称（需与房产证明/租赁凭证完全一致）</label>
                  <input
                    type="text"
                    value={details.officeAddress.region}
                    onChange={(e) => onUpdateDetails({
                      ...details,
                      officeAddress: { ...details.officeAddress, region: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#48BFA2]"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">房号 / 工位编号</label>
                  <input
                    type="text"
                    value={details.officeAddress.detail}
                    onChange={(e) => onUpdateDetails({
                      ...details,
                      officeAddress: { ...details.officeAddress, detail: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#48BFA2]"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">房屋规划用途</label>
                  <input
                    type="text"
                    value={details.officeAddress.propertyType}
                    onChange={(e) => onUpdateDetails({
                      ...details,
                      officeAddress: { ...details.officeAddress, propertyType: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#48BFA2]"
                  />
                </div>
              </div>
            </div>

            {/* ==================== 05 申办资料扫描件上传 ==================== */}
            <div className="rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F7F2] text-[#2AA894] select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
                  <span>05 · 资料归集</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleUploadAllMock}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E6F7F2] text-[#2AA894] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>一键齐备资料示例</span>
                  </button>
                  <span className="text-xs text-slate-400">支持 PDF、JPG、PNG 格式</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight mb-4">
                申办资料电子原件上传
              </h2>

              <div className="space-y-3">
                {details.docs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-[#48BFA2] transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-[#E6F7F2] text-[#2AA894] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-[#0F172A]">{doc.name}</span>
                          {doc.required && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                              必交
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <span>{doc.type}</span>
                          {doc.fileName && (
                            <>
                              <span>•</span>
                              <span className="text-[#2AA894] font-mono font-medium">{doc.fileName}</span>
                              <span>({doc.fileSize})</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {doc.status === 'uploaded' ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2AA894] bg-[#E6F7F2] px-3 py-1 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>已上传</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUploadMock(doc.id)}
                            className="text-xs text-slate-400 underline hover:text-slate-700 cursor-pointer"
                          >
                            重新上传
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleUploadMock(doc.id)}
                          className="px-4 py-2 rounded-full bg-white border border-slate-200 hover:border-[#48BFA2] hover:bg-[#F4FCFA] hover:text-[#2AA894] text-xs font-medium text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <UploadCloud className="w-3.5 h-3.5 text-[#36B39E]" />
                          <span>点击上传文件</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Floating Bottom Bar */}
      <div className="fixed left-0 right-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 py-3.5 px-6 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackToGroup}
            className="px-6 py-2.5 rounded-full border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回服务群</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-7 py-2.5 rounded-full bg-[#55C5A7] hover:bg-[#48BFA2] text-white text-sm font-medium shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>提交并提醒客服核验</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in duration-150">
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};
