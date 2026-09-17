/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TimelineNode, RegistrationPlan, RegistrationDetails, PaymentOrder } from '../types';
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Send, 
  Truck, 
  FileCheck, 
  Award, 
  RefreshCw, 
  PenTool, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink,
  HelpCircle,
  QrCode,
  Building,
  Landmark,
  FileBadge,
  Printer,
  Download,
  PhoneCall,
  Check
} from 'lucide-react';

interface ProgressAndReviewStepProps {
  timeline: TimelineNode[];
  plan: RegistrationPlan;
  details: RegistrationDetails;
  order: PaymentOrder;
  onUpdateTimeline: (nodes: TimelineNode[]) => void;
  onGoToChat: () => void;
}

export const ProgressAndReviewStep: React.FC<ProgressAndReviewStepProps> = ({
  timeline,
  plan,
  details,
  order,
  onUpdateTimeline,
  onGoToChat
}) => {
  // Branch mode simulation: 'complete' (资料齐全直接转交) vs 'incomplete' (资料不齐或有误)
  const [branchMode, setBranchMode] = useState<'complete' | 'incomplete'>('complete');
  const [isFixSubmitted, setIsFixSubmitted] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [showSealModal, setShowSealModal] = useState(false);
  const [bankBooked, setBankBooked] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleFixAndResubmit = () => {
    setIsFixSubmitted(true);
    showToast('已重新上传清晰证件扫描件，客服 Lisa 正在进行二次复核…');
    setTimeout(() => {
      setBranchMode('complete');
      showToast('客服 Lisa 复核通过！资料齐全无误，已正式转交政务交付团队 D');
    }, 1500);
  };

  const handleCompleteSignature = () => {
    setIsSigned(true);
    setShowSignModal(false);
    showToast('全体股东活体人脸识别比对一致，电子签名已回传市政务网申系统！');

    // Update timeline nodes to advance through 6, 7, 8, 9
    const updated = timeline.map((node) => {
      if (node.stepNumber === 6) {
        return {
          ...node,
          status: 'done' as const,
          detail: '全体股东及法定代表人已通过微信小程序完成活体人脸识别与数字证书电子签名。',
          requiresAction: false
        };
      }
      if (node.stepNumber === 7) {
        return {
          ...node,
          status: 'done' as const,
          time: '已核发',
          detail: '市场监督管理局已审核通过！统一社会信用代码已生成：91440300MA5H8X921K。'
        };
      }
      if (node.stepNumber === 8) {
        return {
          ...node,
          status: 'done' as const,
          time: '已刻制',
          detail: '公安特行备案芯片防伪印章已雕刻成型并录入市公安防伪印鉴系统。'
        };
      }
      if (node.stepNumber === 9) {
        return {
          ...node,
          status: 'done' as const,
          time: '已寄出',
          detail: '顺丰特快专递单号 SF14892749281 已发出，预计次日送达经营场所。'
        };
      }
      return node;
    });

    onUpdateTimeline(updated);
  };

  return (
    <div className="pb-32">
      
      <div className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-4 relative z-10">

          {/* Top Step Heading - states current step clearly */}
          <section className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F7F2] text-[#2AA894] mb-2.5 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
              <span>办理进度追踪</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2">
              企业开办与政务交付办理进度
            </h1>

            <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl leading-relaxed">
              实时追踪客服初审、市监局政务网申审批、公安备案印章刻制及物流进度。
            </p>
          </section>

          {/* ==================== 01 核心状态指标看板 ==================== */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-[#64748B] block mb-1">受理流水号</span>
              <span className="font-mono font-bold text-xs sm:text-sm text-[#0F172A]">
                {order.orderNo || 'ORD-2026-09-8812'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-[#64748B] block mb-1">市监审批状态</span>
              <span className="font-bold text-xs sm:text-sm text-[#2AA894] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {isSigned ? '终审通过 · 已核准' : '等待股东人脸签名'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-[#64748B] block mb-1">防伪印章刻制</span>
              <span className="font-bold text-xs sm:text-sm text-[#0F172A]">
                {isSigned ? '5枚全套已备案出件' : '等待出照联动刻制'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-[#64748B] block mb-1">顺丰专递物流</span>
              <span className="font-bold text-xs sm:text-sm text-[#0F172A]">
                {isSigned ? 'SF14892749281' : '出照后当日揽件'}
              </span>
            </div>
          </div>

          {/* ==================== 02 资料审核与协同流转状态 ==================== */}
          <div className="rounded-3xl p-6 sm:p-8 mb-6 border border-slate-200 bg-white shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F7F2] text-[#2AA894] select-none mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
                  <span>协同状态</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">
                  资料审核与协同流转模拟 (Review & Handover Flow)
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  点击切换体验：【资料齐全无误 · 直接转交政务交付】与【资料有误 · 客服跟进指引补正】
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setBranchMode('complete');
                    setIsFixSubmitted(false);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    branchMode === 'complete'
                      ? 'bg-[#E6F7F2] text-[#2AA894] border-[#48BFA2]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  资料齐全 · 转交交付
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBranchMode('incomplete');
                    setIsFixSubmitted(false);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    branchMode === 'incomplete'
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  资料有误 · 提示补正
                </button>
              </div>
            </div>

            {/* Branch Content Banner */}
            {branchMode === 'incomplete' ? (
              <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-amber-900 block">
                      客服 Lisa 发送补正通知 (C → U)：证件扫描件边缘反光
                    </span>
                    <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                      “林总您好！您上传的法定代表人身份证反面国徽面有拍摄反光，遮挡了有效期限。请重新补充上传清晰文件，客服将即时为您安排加急复核！”
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFixAndResubmit}
                  disabled={isFixSubmitted}
                  className="w-full sm:w-auto px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium shadow-xs transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFixSubmitted ? 'animate-spin' : ''}`} />
                  <span>{isFixSubmitted ? '正在重新复核…' : '一键重新上传清晰证件'}</span>
                </button>
              </div>
            ) : (
              <div className="mt-4 p-4 rounded-2xl bg-[#F4FCFA] border border-[#D1F2EB] flex items-center justify-between gap-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2AA894] shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-[#0F172A] block">
                      客服初审合格 (C → D)：订单及全套办理资料已转交政务交付团队
                    </span>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      法定代表人与股东身份证明、经营场所住所文件齐全规范，交付专员张经理已完成政务系统建档网申。
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#2AA894] bg-white px-3 py-1 rounded-full border border-[#D1F2EB] shrink-0">
                  审核流转中
                </span>
              </div>
            )}
          </div>

          {/* ==================== 03 电子签名急需待办提示卡 ==================== */}
          {!isSigned && branchMode === 'complete' && (
            <div className="bg-[#F4FCFA] rounded-3xl p-6 sm:p-7 border border-[#D1F2EB] shadow-xs mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#55C5A7] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <PenTool className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 animate-pulse">
                        政务系统待办通知 (S → U)
                      </span>
                      <h3 className="font-bold text-[#0F172A] text-base">
                        全体股东与法定代表人进行人脸识别与电子签名
                      </h3>
                    </div>
                    <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                      依据政务登记规定，请法定代表人【{details.legalRepresentative.name}】及全体股东完成微信端活体人脸识别及 CA 电子签名。签署完成后市监局秒级出照！
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSignModal(true)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#55C5A7] hover:bg-[#48BFA2] text-white font-medium text-xs sm:text-sm shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <PenTool className="w-4 h-4" />
                  <span>立即进行人脸电子签名</span>
                </button>
              </div>
            </div>
          )}

          {/* ==================== 04 全流程办理全景进度图 ==================== */}
          <div className="rounded-3xl p-6 sm:p-8 mb-6 border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F7F2] text-[#2AA894] select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
                <span>全景节点 · 9大关键办理阶段</span>
              </div>

              <button
                type="button"
                onClick={onGoToChat}
                className="text-xs font-semibold text-[#2AA894] hover:text-[#48BFA2] flex items-center gap-1 cursor-pointer"
              >
                <span>联系群内顾问</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight mb-6">
              企业设立全流程办理全景图
            </h2>

            {/* Timeline Nodes */}
            <div className="space-y-6 relative pl-4 sm:pl-6 border-l-2 border-slate-100">
              {timeline.map((node) => {
                const isDone = node.status === 'done';
                const isCurrent = node.status === 'current';

                return (
                  <div key={node.id} className="relative group">
                    {/* Status Dot */}
                    <div className={`absolute -left-[23px] sm:-left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                      isDone
                        ? 'bg-[#55C5A7] text-white ring-2 ring-[#55C5A7]/20'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                        : 'bg-slate-300'
                    }`}>
                      {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 font-mono">0{node.stepNumber}</span>
                        <h4 className={`text-xs sm:text-sm font-bold ${
                          isDone ? 'text-[#0F172A]' : isCurrent ? 'text-blue-700' : 'text-slate-500'
                        }`}>
                          {node.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-medium text-slate-600">{node.operator} · {node.dept}</span>
                        <span>•</span>
                        <span>{node.time}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#64748B] leading-relaxed pl-4 sm:pl-5 bg-slate-50 p-3 rounded-2xl border border-slate-100 mt-1.5">
                      {node.detail}
                    </p>

                    {node.requiresAction && !isSigned && (
                      <div className="pl-4 sm:pl-5 mt-2">
                        <button
                          type="button"
                          onClick={() => setShowSignModal(true)}
                          className="px-4 py-1.5 rounded-full bg-[#55C5A7] hover:bg-[#48BFA2] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <PenTool className="w-3.5 h-3.5" />
                          <span>{node.actionName || '立即办理'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ==================== 05 交付成果物：营业执照正本与防伪印章 ==================== */}
          {isSigned && (
            <div className="rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xs mb-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Award className="w-6 h-6 text-[#2AA894]" />
                  <div>
                    <h3 className="font-bold text-base text-[#0F172A]">企业设立交付成果物（已出照及刻制）</h3>
                    <span className="text-xs text-[#64748B]">已核准统一社会信用代码，支持扫码验真与下载</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSealModal(true)}
                    className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs border border-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    <span>查看印章备案卡</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLicenseModal(true)}
                    className="px-4 py-1.5 rounded-full bg-[#E6F7F2] hover:bg-[#D1F2EB] text-[#2AA894] font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>查看电子营业执照样件</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">企业法定名称：</span>
                    <span className="font-bold text-[#0F172A]">{details.primaryName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">统一社会信用代码：</span>
                    <span className="font-mono font-bold text-[#2AA894]">91440300MA5H8X921K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">法定代表人：</span>
                    <span className="font-bold text-[#0F172A]">{details.legalRepresentative.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">注册资本：</span>
                    <span className="font-bold text-[#0F172A]">{plan.capitalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">成立日期：</span>
                    <span className="font-bold text-[#0F172A]">2026年09月16日</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-[#0F172A] font-bold">
                    <Truck className="w-4 h-4 text-[#2AA894]" />
                    <span>顺丰特快寄送专递（SF14892749281）</span>
                  </div>
                  <p className="text-[#64748B] leading-relaxed">
                    加急保价专递包：营业执照正副本原件、公安防伪芯片章5枚、公司章程归档原件、密码卡。
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-[#2AA894] bg-[#E6F7F2] px-2.5 py-1 rounded-xl font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>顺丰已于深圳湾营业点揽件，预计次日上午 10:00 前送达</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    收件地址：{details.officeAddress.region} {details.officeAddress.detail}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 06 银行开户与首期税务建账启用 ==================== */}
          <div className="rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xs mb-8">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Landmark className="w-5 h-5 text-[#2AA894]" />
                <div>
                  <h3 className="font-bold text-base text-[#0F172A]">对公银行开户预约与首期税务建账</h3>
                  <span className="text-xs text-[#64748B]">凭执照与印章即可无缝前往银行开立对公基本账户</span>
                </div>
              </div>

              <button
                type="button"
                disabled={bankBooked}
                onClick={() => {
                  setBankBooked(true);
                  showToast('已成功预约招商银行高新支行绿色通道开户专窗！');
                }}
                className="px-5 py-2 rounded-full bg-[#55C5A7] hover:bg-[#48BFA2] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {bankBooked ? '已预约招行绿色通道' : '一键预约合作银行开户'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#64748B]">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-[#0F172A] block mb-1">招商银行（高新支行）</span>
                <p className="text-[#64748B]">免网银年费、免首年账户管理费，开户即赠送企业银企直联系统。</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-[#0F172A] block mb-1">中国工商银行（科技园支行）</span>
                <p className="text-[#64748B]">跨境结汇首选通道，支持多币种国际结算与贸易外汇收支名录登记。</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-[#0F172A] block mb-1">首月财税合规陪伴包</span>
                <p className="text-[#64748B]">资深注册会计师王老师已为您搭建电子税务局初始账套与发票核定。</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Signature Modal */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl flex flex-col border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#2AA894]" />
                <h3 className="font-bold text-[#0F172A] text-sm">政务人脸识别与数字证书在线签名</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSignModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="text-xs text-[#64748B] space-y-3 mb-4">
              <p>请法定代表人【{details.legalRepresentative.name}】进行工商设立登记签名核验。</p>
              
              {/* Simulated Signature Box */}
              <div className="border-2 border-dashed border-slate-300 rounded-2xl h-36 bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="text-slate-400 text-xs flex flex-col items-center gap-1">
                  <PenTool className="w-6 h-6 text-slate-400" />
                  <span>在虚线框内完成手写签名（演示模式支持一键签署）</span>
                </div>
                <div className="absolute font-cursive text-3xl text-slate-800 rotate-[-5deg] font-bold select-none opacity-85">
                  林楚天
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                点击确认即代表您已授权生成国家市场监督管理局认可的个人 CA 数字证书并完成实名署名。
              </p>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSignModal(false)}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleCompleteSignature}
                className="px-6 py-2 rounded-full bg-[#55C5A7] hover:bg-[#48BFA2] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                完成签署并提交政务系统
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Business License Modal */}
      {showLicenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-[#FFFDF7] rounded-3xl max-w-xl w-full p-7 shadow-2xl border-4 border-[#C5A059] relative flex flex-col max-h-[90vh] overflow-y-auto">
            {/* Watermark Emblem */}
            <div className="text-center pb-4 border-b border-[#C5A059]/40 mb-4">
              <div className="w-12 h-12 rounded-full border-2 border-red-600 mx-auto mb-2 flex items-center justify-center text-red-600 font-bold text-xs">
                国徽
              </div>
              <h2 className="text-xl font-extrabold tracking-widest text-[#5A3E1B]">营业执照</h2>
              <span className="text-[10px] tracking-wider text-[#8C6D3F] block font-serif">（正本）</span>
              <p className="text-xs font-mono font-bold text-slate-800 mt-1">
                统一社会信用代码：91440300MA5H8X921K
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-800 leading-relaxed">
              <div className="flex">
                <span className="w-24 font-bold text-[#5A3E1B] shrink-0">名 称：</span>
                <span className="font-bold">{details.primaryName}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-bold text-[#5A3E1B] shrink-0">类 型：</span>
                <span>{plan.companyType}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-bold text-[#5A3E1B] shrink-0">法定代表人：</span>
                <span className="font-bold">{details.legalRepresentative.name}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-bold text-[#5A3E1B] shrink-0">注册资本：</span>
                <span>{plan.capitalAmount}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-bold text-[#5A3E1B] shrink-0">成立日期：</span>
                <span>2026年09月16日</span>
              </div>
              <div className="flex">
                <span className="w-24 font-bold text-[#5A3E1B] shrink-0">住 所：</span>
                <span>{details.officeAddress.region} {details.officeAddress.detail}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-bold text-[#5A3E1B] shrink-0">经营范围：</span>
                <span className="text-[11px] text-slate-600">{plan.preQualifications.concat(plan.postQualifications).join('；')}等</span>
              </div>
            </div>

            {/* Official SAMR Stamp */}
            <div className="mt-6 flex justify-between items-end pt-4 border-t border-[#C5A059]/30">
              <div className="text-center">
                <div className="w-16 h-16 bg-white border border-slate-300 p-1 flex items-center justify-center">
                  <QrCode className="w-14 h-14" />
                </div>
                <span className="text-[9px] text-slate-400 block mt-1">国家企业信用信息公示系统扫码验证</span>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-[#5A3E1B] block">登记机关：深圳市市场监督管理局</span>
                <span className="text-xs text-slate-500 block">核准日期：2026年09月16日</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                  showToast('已唤起打印程序');
                }}
                className="px-4 py-2 rounded-full border border-[#C5A059] text-xs font-bold text-[#5A3E1B] hover:bg-[#C5A059]/10 cursor-pointer"
              >
                打印执照样件
              </button>
              <button
                type="button"
                onClick={() => setShowLicenseModal(false)}
                className="px-5 py-2 rounded-full bg-[#5A3E1B] text-white text-xs font-bold cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Seal Inspection Modal */}
      {showSealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl flex flex-col border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-[#0F172A] text-sm">公安特行备案防伪芯片印章清单（5枚全套）</h3>
              <button
                type="button"
                onClick={() => setShowSealModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { name: '企业法定名称章（公章）', spec: '圆形直径40mm，内置RFID防伪芯片，公安特行备案号：4403010091823' },
                { name: '财务专用章', spec: '圆形直径38mm，专用于银行对公支票与财务往来款项' },
                { name: '法定代表人名章（私章）', spec: '方形18×18mm，用于银行开户与工商申报' },
                { name: '发票专用章', spec: '椭圆形40×30mm，符合国家税务总局发票印章规范' },
                { name: '合同专用章', spec: '圆形直径38mm，专用于对外商业协议与采购合同签署' }
              ].map((s, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#0F172A] block">{s.name}</span>
                    <span className="text-[#64748B] text-[11px]">{s.spec}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E6F7F2] text-[#2AA894] text-[10px] font-semibold">
                    已办结出件
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSealModal(false)}
                className="px-5 py-2 rounded-full bg-[#55C5A7] hover:bg-[#48BFA2] text-white text-xs font-semibold cursor-pointer"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in duration-150">
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};
