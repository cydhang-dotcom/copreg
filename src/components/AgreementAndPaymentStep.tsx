/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RegistrationPlan, PaymentOrder } from '../types';
import { 
  FileText, 
  CheckCircle2, 
  Smartphone, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  QrCode, 
  Download, 
  Printer, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Award, 
  Check, 
  Receipt,
  ExternalLink,
  MessageSquare,
  Clock,
  HelpCircle,
  X,
  AlertCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface AgreementAndPaymentStepProps {
  plan: RegistrationPlan;
  order: PaymentOrder;
  onUpdateOrder?: (order: PaymentOrder | ((prev: PaymentOrder) => PaymentOrder)) => void;
  onPaymentSuccess?: () => void;
  onPaid?: (orderData: Partial<PaymentOrder>) => void;
  onBack: () => void;
  onProceedToFillDetails?: () => void;
}

export const AgreementAndPaymentStep: React.FC<AgreementAndPaymentStepProps> = ({
  plan,
  order,
  onUpdateOrder,
  onPaymentSuccess,
  onPaid,
  onBack,
  onProceedToFillDetails
}) => {
  const isPaid = order?.status === 'paid';

  const formatMoney = (val?: number | null) => {
    if (val === undefined || val === null || isNaN(val)) return '0';
    return val.toLocaleString();
  };

  const finalPrice = plan?.finalPrice ?? order?.amount ?? 2280;
  const totalOriginal = plan?.totalOriginal ?? 8180;
  const totalDiscount = plan?.totalDiscount ?? (totalOriginal - finalPrice);
  const items = plan?.items || [];

  // Agreement confirmation state
  const [hasAgreed, setHasAgreed] = useState(true);
  const [showAgreementModal, setShowAgreementModal] = useState(false);

  // Payment method
  const [payMethod, setPayMethod] = useState<'wechat' | 'alipay'>(
    order.paymentMethod === 'alipay' ? 'alipay' : 'wechat'
  );

  // Modal 1: Phone & SMS verification
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [contactName, setContactName] = useState(order.contactName || '林楚天');
  const [phone, setPhone] = useState(order.contactPhone || '13800138000');
  const [smsCode, setSmsCode] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Modal 2: Cashier modal
  const [showPayModal, setShowPayModal] = useState(false);
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  // Toast message
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Triggered when user clicks "立即支付"
  const handleStartPayment = () => {
    if (!hasAgreed) {
      showToast('请先勾选同意《企业设立及财税综合服务委托协议》');
      return;
    }
    // Open SMS verification modal as required
    setShowSmsModal(true);
  };

  // Send SMS verification code
  const handleSendSms = () => {
    if (!phone || phone.length < 11) {
      showToast('请输入正确的11位手机号');
      return;
    }
    setCountdown(60);
    setSmsCode('8866');
    showToast('短信验证码已发送至您的手机：8866（已自动填入）');

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

  // Submit SMS verification -> Open Payment Cashier
  const handleConfirmSmsAndProceedToPay = () => {
    if (!phone || phone.length < 11) {
      showToast('请输入有效手机号');
      return;
    }
    if (!smsCode || (smsCode !== '8866' && smsCode.length < 4)) {
      showToast('请输入正确的验证码（测试验证码：8866）');
      return;
    }

    // Verification passed, close SMS modal and open cashier modal
    setShowSmsModal(false);
    setShowPayModal(true);
  };

  // Confirm payment in Cashier modal
  const handleCompletePayment = () => {
    setIsProcessingPay(true);
    setTimeout(() => {
      setIsProcessingPay(false);
      setShowPayModal(false);

      const now = new Date().toLocaleString('zh-CN', { hour12: false });
      const updatedOrder: PaymentOrder = {
        ...order,
        status: 'paid',
        paidAt: now,
        paymentMethod: payMethod,
        contactName,
        contactPhone: phone,
        amount: plan.finalPrice
      };

      if (onUpdateOrder) {
        onUpdateOrder(updatedOrder);
      }
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
      if (onPaid) {
        onPaid(updatedOrder);
      }

      showToast('支付成功！委托代办已生效，已生成专属服务清单与企微顾问');
    }, 900);
  };

  // Checklist items for post-payment status display
  const checklistItems = [
    {
      title: '企业设立基础资料核验与网申材料编制',
      desc: '依《公司法》规范核验字号、股东出资比例及经营范围，已完成全套文书编制',
      status: 'completed',
      statusLabel: '已完成',
      dept: '系统 / 申报专员',
      time: '即时完成'
    },
    {
      title: '市场监督管理局行政审批送审与执照领办',
      desc: '专人对接属地市监行政审批大厅，电子实名签名核验后领办营业执照正副本原件',
      status: 'in_progress',
      statusLabel: '正在办理',
      dept: '市场监督管理局',
      time: '预计 1~2 工作日'
    },
    {
      title: '公安特行备案防伪芯片印章刻制（全套5枚）',
      desc: '公章、财务章、发票章、合同章、法人私章，特行刻印点内嵌芯片防伪备案',
      status: 'pending',
      statusLabel: '等待前置',
      dept: '公安局特行备案点',
      time: '执照下发后 4 小时'
    },
    {
      title: '合作商业银行对公账户绿色通道开户预约',
      desc: '招商银行/工商银行/平安银行专属客户经理绿色通道对接，专人协同网点开户',
      status: 'waiting',
      statusLabel: '待预约',
      dept: '合作商业银行',
      time: '证照齐全后次日'
    },
    {
      title: '国家电子税务局企业税种核定与登记',
      desc: '办理电子税务局实名登记、税种核定、发票票种及数电发票额度申领',
      status: 'pending',
      statusLabel: '等待前置',
      dept: '国家税务总局电子税局',
      time: '开户完成后 1 工作日'
    },
    {
      title: '专属财税专员建账与全年记账报税托管',
      desc: '持证资深会计师建立标准财务账套，按期纳税申报及汇算清缴',
      status: 'planned',
      statusLabel: '按期交付',
      dept: '专属财税团队',
      time: '全年 12 个月托管'
    },
    {
      title: '单位独立社保与住房公积金开户及托管',
      desc: '开立单位专属五险一金账户，按月协助员工增减员申报与基数核算',
      status: 'planned',
      statusLabel: '按需申报',
      dept: '人社局 / 公积金中心',
      time: '按月度办理'
    }
  ];

  return (
    <div className="pb-32">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#0F172A] text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#36B39E]" />
          <span>{toast}</span>
        </div>
      )}

      <div className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-4 relative z-10">

          {/* ========================================================= */}
          {/* ==================== STATE 1: UNPAID ==================== */}
          {/* ========================================================= */}
          {!isPaid ? (
            <div>
              {/* Header */}
              <section className="mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F7F2] text-[#2AA894] mb-3.5 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#36B39E]"></span>
                  <span>安全结算 · 确认委托方案与在线支付</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0F172A] tracking-tight leading-[1.2] mb-3.5">
                  安全结算，<br />
                  <span className="text-[#36B39E]">委托协议确认与在线支付</span>
                </h1>

                <p className="text-sm sm:text-[14.5px] text-[#64748B] max-w-2xl leading-relaxed">
                  请核对您的企业设立委托方案及明细费用。在线确认委托代办协议后，即可调起微信或支付宝支付。支付后即刻为您指派专属顾问与服务专员。
                </p>
              </section>

              {/* Section 1: Order Summary & Itemized Table */}
              <div className="rounded-3xl p-6 sm:p-8 mb-6 border border-slate-200 bg-white shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#E6F7F2] flex items-center justify-center text-[#36B39E]">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#0F172A]">委托代办方案与费用明细</h2>
                      <span className="text-xs text-slate-400">订单号：{order.orderNo}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#36B39E] bg-[#E6F7F2] px-3 py-1 rounded-full">
                    {plan.selectedTier === 'standard' ? '标准设立套餐' : plan.selectedTier === 'bundle_general' ? '一般人全包套餐' : '小规模全包套餐'}
                  </span>
                </div>

                {/* Items Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden mb-6">
                  <div className="bg-slate-50 px-4 py-2.5 grid grid-cols-12 text-xs font-bold text-slate-600 border-b border-slate-200">
                    <span className="col-span-6">服务项目及交付标准</span>
                    <span className="col-span-3 text-right">参考原价</span>
                    <span className="col-span-3 text-right">结算金额</span>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs text-slate-700">
                    {items.map((item, idx) => {
                      const orig = item?.originalPrice ?? item?.price ?? 0;
                      const current = item?.price ?? 0;
                      const isFreeItem = item?.isFree || item?.isGift || current === 0;

                      return (
                        <div key={item.id || idx} className="px-4 py-3 grid grid-cols-12 items-center hover:bg-slate-50/70 transition-colors">
                          <div className="col-span-6 pr-2">
                            <div className="font-bold text-slate-800 flex items-center gap-1.5 flex-wrap">
                              <span>{item.name}</span>
                              {isFreeItem && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                  政策全免
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 block mt-0.5">{item.desc}</span>
                          </div>
                          <div className="col-span-3 text-right text-slate-400 line-through">
                            ¥ {formatMoney(orig)}
                          </div>
                          <div className="col-span-3 text-right font-bold text-slate-900">
                            {isFreeItem ? (
                              <span className="text-emerald-600 font-bold">¥ 0 (免收)</span>
                            ) : (
                              <span>¥ {formatMoney(current)}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Calculation Bar */}
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>各项服务原价合计：</span>
                    <span className="line-through">¥ {formatMoney(totalOriginal)} 元</span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-600 font-medium">
                    <span>政策免收规费及套餐立减优惠：</span>
                    <span>- ¥ {formatMoney(totalDiscount)} 元</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm sm:text-base font-bold text-slate-900">
                    <span>最终应付金额（全包价）：</span>
                    <span className="text-2xl font-black text-[#36B39E]">¥ {formatMoney(finalPrice)} 元整</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Merged Service Agreement Confirmation */}
              <div className="rounded-3xl p-6 sm:p-8 mb-6 border border-slate-200 bg-white shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#E6F7F2] flex items-center justify-center text-[#36B39E]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#0F172A]">委托代理服务协议确认</h2>
                      <span className="text-xs text-slate-400">电子签约条款确认 · 保障双方合法权益</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAgreementModal(true)}
                    className="text-xs font-bold text-[#36B39E] hover:text-[#2AA894] underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>查看完整协议条款</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Agreement key clauses summary */}
                <div className="space-y-3 mb-5 text-xs sm:text-sm text-[#64748B]">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                    <Building2 className="w-4 h-4 text-[#36B39E] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800">委托服务范围：</span>
                      <span className="text-slate-600">
                        受托方负责为委托方办理企业名称自主申报、公司章程起草备案、政务网申材料编制送审、辅导股东电子签名、领办纸质营业执照正副本原件、公安特行备案防伪芯片印章5枚刻制及相应财税托管服务。
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#36B39E] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800">时效与履约保障：</span>
                      <span className="text-slate-600">
                        材料签署齐全后 3 个工作日内办结营业执照。若因受托方差错导致设立不成功，全额无理由退还已收代办费用。
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                    <Lock className="w-4 h-4 text-[#36B39E] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800">保密合规约定：</span>
                      <span className="text-slate-600">
                        全程实行金融级数据加密，双方签署严格保密义务，委托方提供的身份证明、股东信息仅用于本次企业开办政务申报。
                      </span>
                    </div>
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div className="p-4 rounded-2xl border-2 border-[#36B39E]/30 bg-[#F4FCFA] flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="checkbox-agreement"
                    checked={hasAgreed}
                    onChange={(e) => setHasAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-[#36B39E] border-slate-300 rounded focus:ring-[#36B39E] cursor-pointer"
                  />
                  <label htmlFor="checkbox-agreement" className="text-xs text-slate-700 leading-relaxed cursor-pointer select-none">
                    <span className="font-bold text-slate-900">我已阅读并完全同意</span>
                    <button
                      type="button"
                      onClick={() => setShowAgreementModal(true)}
                      className="text-[#36B39E] font-bold underline mx-1 hover:text-[#2AA894] cursor-pointer"
                    >
                      《企业设立及财税综合服务委托协议》
                    </button>
                    及
                    <span className="text-slate-900 font-bold mx-1">《商业秘密与个人数据保护条款》</span>
                    。点击下方立即支付即视为在线签署该委托协议。
                  </label>
                </div>
              </div>

              {/* Section 3: Payment Method Selection */}
              <div className="rounded-3xl p-6 sm:p-8 mb-6 border border-slate-200 bg-white shadow-xs">
                <h2 className="text-lg font-bold text-[#0F172A] mb-4">选择支付方式</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* WeChat Pay */}
                  <div
                    onClick={() => setPayMethod('wechat')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      payMethod === 'wechat'
                        ? 'border-[#36B39E] bg-[#F4FCFA] shadow-xs ring-1 ring-[#36B39E]/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
                        微
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block text-sm">微信支付</span>
                        <span className="text-xs text-slate-400">支持微信扫码 / 手机快捷支付</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      payMethod === 'wechat' ? 'border-[#36B39E] bg-[#36B39E] text-white' : 'border-slate-300'
                    }`}>
                      {payMethod === 'wechat' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Alipay */}
                  <div
                    onClick={() => setPayMethod('alipay')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      payMethod === 'alipay'
                        ? 'border-[#36B39E] bg-[#F4FCFA] shadow-xs ring-1 ring-[#36B39E]/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                        支
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block text-sm">支付宝</span>
                        <span className="text-xs text-slate-400">支持支付宝扫码 / 花呗分期</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      payMethod === 'alipay' ? 'border-[#36B39E] bg-[#36B39E] text-white' : 'border-slate-300'
                    }`}>
                      {payMethod === 'alipay' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="fixed left-0 right-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 py-3.5 px-6 shadow-lg">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={onBack}
                    className="px-6 py-2.5 rounded-full border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>返回修改方案</span>
                  </button>

                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block text-right">
                      <span className="text-xs text-slate-400 block">应付总额（已含优惠）</span>
                      <span className="text-xl font-black text-[#36B39E]">¥ {formatMoney(finalPrice)} 元</span>
                    </div>

                    <button
                      type="button"
                      id="btn-click-pay"
                      onClick={handleStartPayment}
                      className="px-8 py-3 rounded-full bg-[#36B39E] hover:bg-[#2AA894] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>立即支付 ¥{formatMoney(finalPrice)}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ======================================================= */
            /* ==================== STATE 2: PAID ==================== */
            /* ======================================================= */
            <div className="space-y-6">
              {/* Success Banner */}
              <div className="rounded-3xl p-6 sm:p-8 border border-emerald-200 bg-gradient-to-br from-[#F4FCFA] to-white shadow-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full mb-1">
                        支付成功 · 委托代办已生效
                      </div>
                      <h1 className="text-2xl font-black text-slate-900">
                        服务费用已缴清，政务代办专班已启动
                      </h1>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">实付金额（{order?.paymentMethod === 'alipay' ? '支付宝' : '微信支付'}）</span>
                    <span className="text-2xl font-black text-[#36B39E]">¥ {formatMoney(order?.amount ?? finalPrice)} 元</span>
                  </div>
                </div>

                <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block mb-0.5">订单编号</span>
                    <span className="font-semibold text-slate-800">{order.orderNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">经办人姓名</span>
                    <span className="font-semibold text-slate-800">{order.contactName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">经办联系电话</span>
                    <span className="font-semibold text-slate-800">{order.contactPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">支付时间</span>
                    <span className="font-semibold text-slate-800">{order.paidAt || '刚刚完成'}</span>
                  </div>
                </div>
              </div>

              {/* Requirement 1: Enterprise WeChat QR Code */}
              <div className="rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">添加企业微信专属客服</h2>
                      <span className="text-xs text-slate-400">1 对 1 专员全流程协同跟进，实时同步执照审批状态</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    在线服务中
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200">
                  {/* QR Code Container */}
                  <div className="w-40 h-40 bg-white p-3 rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col items-center justify-center relative shrink-0">
                    <QrCode className="w-28 h-28 text-slate-800" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center justify-center">
                        <span className="text-xs font-bold text-emerald-600">企微</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium">微信扫码添加</span>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">专属顾问：李经理（资深企业设立顾问）</span>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">企业微信官方认证</span>
                    </div>
                    <p className="leading-relaxed text-slate-600">
                      扫码添加顾问企业微信后，顾问将立即拉起专属设立保障群，协同行政审批专员、公安特行刻章专员与专属财税会计师，为您全程无忧代办。
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-500">
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200">✓ 进度实时同步</span>
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200">✓ 纸质证照同城闪送</span>
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200">✓ 7×24小时在线答疑</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Corporate Registration Materials */}
              <div className="rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900">企业注册申报资料</h2>
                      </div>
                      <span className="text-xs text-slate-400">政务服务系统企业设立登记与材料填报</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-bold text-slate-800">
                      政务服务申报材料档案系统（市监局网申库）
                    </p>
                    <p className="text-slate-500">
                      包含公司章程、股东会决议、法定代表人任职文件、经营场所证明等政务备案原件底稿。可在政务申报平台直接下载、核验或填报档案。
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onProceedToFillDetails) {
                        onProceedToFillDetails();
                      } else {
                        window.open('https://scjgj.beijing.gov.cn', '_blank', 'noopener,noreferrer');
                      }
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all shrink-0 cursor-pointer"
                  >
                    <span>在线注册资料登记</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Requirement 3: Service Checklist & Handling Status */}
              <div className="rounded-3xl p-6 sm:p-8 mb-6 border border-slate-200 bg-white shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#E6F7F2] flex items-center justify-center text-[#36B39E]">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">服务进度状态与办理清单 (Checklist)</h2>
                      <span className="text-xs text-slate-400">按照服务checklist清单实时呈现当前各事项办理状态</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#36B39E] bg-[#E6F7F2] px-3 py-1 rounded-full">
                    办理中：第 2 项 / 共 7 项
                  </span>
                </div>

                {/* Checklist items list */}
                <div className="space-y-3">
                  {checklistItems.map((item, index) => {
                    const isDone = item.status === 'completed';
                    const isInProgress = item.status === 'in_progress';

                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                          isDone
                            ? 'border-emerald-200 bg-emerald-50/40'
                            : isInProgress
                            ? 'border-[#36B39E] bg-[#F4FCFA] shadow-xs'
                            : 'border-slate-200 bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 shrink-0">
                            {isDone ? (
                              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            ) : isInProgress ? (
                              <div className="w-5 h-5 rounded-full bg-[#36B39E] text-white flex items-center justify-center animate-pulse">
                                <span className="w-2 h-2 rounded-full bg-white"></span>
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                                {index + 1}
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-sm font-bold ${isInProgress ? 'text-[#0F172A]' : isDone ? 'text-emerald-900' : 'text-slate-700'}`}>
                                {item.title}
                              </span>
                              <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                                {item.dept}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          <span className="text-xs text-slate-400 font-medium">{item.time}</span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-700'
                                : isInProgress
                                ? 'bg-[#36B39E] text-white shadow-2xs'
                                : 'bg-slate-200/70 text-slate-600'
                            }`}
                          >
                            {item.statusLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Service Completion Footer Note */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                <span>专班客服已启动在线协同 · 办理过程中若有任何疑问，请随时微信扫上方二维码与顾问专员沟通</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* ==================== MODAL 1: SMS VERIFICATION MODAL ==================== */}
      {/* ========================================================================= */}
      {showSmsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E6F7F2] text-[#36B39E] flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">经办人手机号安全核验</h3>
                  <span className="text-xs text-slate-400">核验签署人身份以完成协议确认</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSmsModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-[#F4FCFA] border border-[#D1F2EB] text-slate-700">
                <span className="font-bold text-[#36B39E]">协议确认通知：</span>
                您即将以经办人身份签署《企业设立及财税综合服务委托协议》，需通过手机短信验证码完成电子实名签署确权。
              </div>

              {/* Name field */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">经办人姓名</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#36B39E]"
                  placeholder="请输入经办人姓名"
                />
              </div>

              {/* Mobile field */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">经办人手机号</label>
                <input
                  type="tel"
                  maxLength={11}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#36B39E]"
                  placeholder="请输入11位手机号码"
                />
              </div>

              {/* SMS Code field */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">短信验证码</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value)}
                    placeholder="输入验证码 (测试填 8866)"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#36B39E]"
                  />
                  <button
                    type="button"
                    disabled={countdown > 0}
                    onClick={handleSendSms}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                      countdown > 0
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-[#E6F7F2] text-[#2AA894] hover:bg-[#D1F2EB]'
                    }`}
                  >
                    {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  测试环境快捷提示：点击「获取验证码」可自动填入 8866
                </span>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleConfirmSmsAndProceedToPay}
                  className="w-full py-3 rounded-xl bg-[#36B39E] hover:bg-[#2AA894] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>核验通过，前往支付（¥ {formatMoney(finalPrice)}）</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ==================== MODAL 2: CASHIER / PAY MODAL =================== */}
      {/* ===================================================================== */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="text-xs font-bold text-slate-500">
                收银台 · {payMethod === 'wechat' ? '微信官方安全支付' : '支付宝安全收银台'}
              </span>
              <button
                type="button"
                onClick={() => setShowPayModal(false)}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mb-4">
              <span className="text-xs text-slate-400 block mb-1">支付金额</span>
              <div className="text-3xl font-black text-[#36B39E]">¥ {formatMoney(finalPrice)}</div>
              <span className="text-[11px] text-slate-400 block mt-1">商户订单号：{order?.orderNo}</span>
            </div>

            {/* Simulated QR Box */}
            <div className="w-48 h-48 mx-auto bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center mb-4 relative">
              <QrCode className="w-36 h-36 text-slate-800" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                  <span className="text-xs font-bold text-[#36B39E]">
                    {payMethod === 'wechat' ? '微信' : '支'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              请打开手机{payMethod === 'wechat' ? '微信' : '支付宝'}扫一扫完成付款<br />
              <span className="text-[11px] text-slate-400">（演示环境可直接点击下方按钮模拟完成）</span>
            </p>

            <button
              type="button"
              disabled={isProcessingPay}
              onClick={handleCompletePayment}
              className="w-full py-3 rounded-xl bg-[#36B39E] hover:bg-[#2AA894] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isProcessingPay ? (
                <span>正在确认支付结果...</span>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>模拟完成支付（¥ {formatMoney(finalPrice)}）</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ============================================================================== */}
      {/* ==================== MODAL 3: FULL LEGAL AGREEMENT TEXT MODAL =============== */}
      {/* ============================================================================== */}
      {showAgreementModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F7F2] flex items-center justify-center text-[#36B39E]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">企业设立及财税综合服务委托协议</h3>
                  <span className="text-xs text-slate-400">合同编号：HT-2026-0917-8891</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAgreementModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-800 mb-1">委托方（甲方）：林楚天（经办代表）</p>
                <p className="font-bold text-slate-800">受托方（乙方）：企服云帆企业管理咨询（深圳）有限公司</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">第一条 委托事项与服务范围</h4>
                <p>
                  1.1 甲方因投资创业需要，正式委托乙方代为办理新设企业相关政务设立及财税建账服务。
                </p>
                <p>
                  1.2 乙方代办事项包含：拟定合规企业名称申报、起草公司章程及股东会决议、政务网申材料编制送审、辅导股东与法定代表人电子人脸签名、线下领办纸质营业执照正副本原件、公安特行芯片印章刻制备案，以及后续银行对公绿色开户预约及财税托管服务。
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">第二条 费用结算与支付</h4>
                <p>
                  2.1 委托代办费用总计人民币 ¥ {formatMoney(finalPrice)} 元整（含政务代办费、印章刻制及相应财税服务费）。
                </p>
                <p>
                  2.2 乙方承诺收费明细公开透明，绝无任何巧立名目的二次隐形加价。
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">第三条 服务时效与不成功全额退费承诺</h4>
                <p>
                  3.1 乙方承诺自甲方及全体股东完成电子实名认证签署之日起，一般于 1~3 个工作日内办结纸质营业执照。
                </p>
                <p>
                  3.2 若非因甲方提供虚假身份资料或政策不可抗力、而因乙方原因导致设立不通过的，乙方承诺 100% 全额退还已收代办费用。
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">第四条 商业保密与个人信息安全</h4>
                <p>
                  4.1 乙方严格遵照《个人信息保护法》及《网络安全法》，对甲方提供的股东身份证、住所信息及商业计划承担不可撤销之严格保密责任，严防资料外泄。
                </p>
              </div>
            </div>

            <div className="pt-4 mt-5 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setHasAgreed(true);
                  setShowAgreementModal(false);
                }}
                className="px-6 py-2.5 rounded-full bg-[#36B39E] hover:bg-[#2AA894] text-white text-xs font-bold cursor-pointer"
              >
                我已阅读并同意签署
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
