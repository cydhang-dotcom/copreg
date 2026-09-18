/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ProcessStep, 
  SurveyData, 
  RegistrationPlan, 
  PaymentOrder, 
  ChatMessage, 
  RegistrationDetails, 
  TimelineNode 
} from './types';
import { 
  INITIAL_SURVEY_DATA, 
  generatePlanFromSurvey, 
  INITIAL_REGISTRATION_DETAILS, 
  INITIAL_CHAT_MESSAGES, 
  INITIAL_TIMELINE_NODES 
} from './data/mockData';
import { TopNavbar } from './components/TopNavbar';
import { SurveyStep } from './components/SurveyStep';
import { ProposalStep } from './components/ProposalStep';
import { AgreementAndPaymentStep } from './components/AgreementAndPaymentStep';
import { ServiceGroupStep } from './components/ServiceGroupStep';
import { RegistrationDetailsStep } from './components/RegistrationDetailsStep';
import { ProgressAndReviewStep } from './components/ProgressAndReviewStep';

export default function App() {
  const [currentStep, setCurrentStep] = useState<ProcessStep>('survey');
  const [unlockedSteps, setUnlockedSteps] = useState<ProcessStep[]>(['survey', 'proposal']);

  // Core Survey state
  const [survey, setSurvey] = useState<SurveyData>(INITIAL_SURVEY_DATA);

  // Proposal / Plan state (defaults to bundle_small: 小规模纳税人)
  const [plan, setPlan] = useState<RegistrationPlan>(() => generatePlanFromSurvey(INITIAL_SURVEY_DATA, 'bundle_small'));

  // Payment order state
  const [order, setOrder] = useState<PaymentOrder>({
    orderNo: 'ORD' + new Date().getFullYear() + '09' + Math.floor(100000 + Math.random() * 900000),
    createdAt: '2026-09-15 10:00',
    amount: plan.finalPrice,
    paymentMethod: 'wechat',
    status: 'pending',
    contactName: '林楚天',
    contactPhone: '13800138000',
    receiptNumber: 'RCP-89210482',
    invoiceTitle: '个人/企业'
  });

  // Service Group chat state
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);

  // Detailed Registration and Docs upload state
  const [details, setDetails] = useState<RegistrationDetails>(INITIAL_REGISTRATION_DETAILS);

  // Timeline / Delivery progress state
  const [timeline, setTimeline] = useState<TimelineNode[]>(INITIAL_TIMELINE_NODES);

  // Helper to unlock step
  const unlockStep = (step: ProcessStep) => {
    if (!unlockedSteps.includes(step)) {
      setUnlockedSteps(prev => [...prev, step]);
    }
  };

  // Step 1: Submit Survey -> S-->>U: 生成注册方案与服务报价
  const handleSurveySubmit = () => {
    const generated = generatePlanFromSurvey(survey, 'bundle_small');
    setPlan(generated);
    setOrder(prev => ({ ...prev, amount: generated.finalPrice }));
    unlockStep('proposal');
    setCurrentStep('proposal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2: Confirm Proposal -> Go to Payment (Merged Agreement & Payment)
  const handleProposalProceed = (phone?: string) => {
    if (phone) {
      setOrder(prev => ({ ...prev, contactPhone: phone }));
    }
    unlockStep('payment');
    setCurrentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 3: Payment Success -> S-->>C: 同步已确认订单 & unlock Service Group
  const handlePaymentSuccess = () => {
    unlockStep('group');
  };

  // Proceed from Payment to Service Group
  const handleProceedToGroup = () => {
    unlockStep('group');
    setCurrentStep('group');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Proceed from Group to Fill Details
  const handleProceedToFillDetails = () => {
    unlockStep('fill_details');
    setCurrentStep('fill_details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 6: Submit details for review -> S-->>C: 提醒资料待核验
  const handleSubmitForReview = () => {
    unlockStep('progress');
    setCurrentStep('progress');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle chat message in Service Group
  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: '林楚天（您）',
      role: 'customer',
      roleTag: '经办人',
      avatar: '👤',
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      content: text,
      isSelf: true
    };

    setMessages(prev => [...prev, userMsg]);

    // Intelligent automated reply
    setTimeout(() => {
      let replyContent = '';
      let replySender = '企服系统助手';
      let replyRole: 'ai' | 'advisor' | 'delivery' = 'ai';
      let replyTag = '7x24h 智能AI';
      let replyAvatar = '🤖';

      const lower = text.toLowerCase();

      if (lower.includes('现场') || lower.includes('到场') || lower.includes('面签')) {
        replySender = 'Lisa（资深企业顾问）';
        replyRole = 'advisor';
        replyTag = '专属顾问';
        replyAvatar = '👩‍💼';
        replyContent = '林总放心！现在的设立流程已实现全流程政务网办。法定代表人与股东无需到任何政务大厅现场，只需在市监局审核后通过微信或支付宝小程序做人脸活体实名认证并签名即可！';
      } else if (lower.includes('5年') || lower.includes('实缴') || lower.includes('资本')) {
        replyContent = '根据2024年7月起施行的新《公司法》第四十七条：有限责任公司全体股东认缴的出资额由股东按照公司章程的规定自公司成立之日起五年内缴足。我们已根据您的预期，为您规划了合理合规的出资节奏。';
      } else if (lower.includes('章') || lower.includes('公章') || lower.includes('刻章')) {
        replySender = '张经理（交付团队主管）';
        replyRole = 'delivery';
        replyTag = '交付专员';
        replyAvatar = '👨‍💼';
        replyContent = '我们为您包含的全套印章为公安特行备案的芯片防伪印章（公章、财务章、发票章、合同章、法人私章）。执照下发后由公安指定刻章点刻制，章体内植入加密芯片防伪，具有完全法律效力！';
      } else if (lower.includes('开户') || lower.includes('银行')) {
        replyContent = '办理完营业执照与印章后，我们将为您预约合作商业银行（招商/工行/平安等）的绿色开户通道。您只需带上执照正本、公章三章、法人身份证原件前往即可，一般 1 个工作日内可启用账户及网银。';
      } else if (lower.includes('范围') || lower.includes('字号') || lower.includes('名字')) {
        replySender = 'Lisa（资深企业顾问）';
        replyRole = 'advisor';
        replyTag = '专属顾问';
        replyAvatar = '👩‍💼';
        replyContent = '字号建议由 2~4 个汉字组成，避免与同行业已有知名企业重名；经营范围将按照国家市场监督管理总局统一标准规范表述填写，您可以点击上方按钮填报！';
      } else {
        replyContent = `收到林总的咨询！专属交付专员与 AI 助手正在为您跟进。您的问题已同步记录在工单系统，若有需要也可以随时在群内沟通。`;
      }

      const botReply: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: replySender,
        role: replyRole,
        roleTag: replyTag,
        avatar: replyAvatar,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        content: replyContent
      };

      setMessages(prev => [...prev, botReply]);
    }, 600);
  };

  // Calculate progress percentage dynamically
  const isCoreDone = survey.coreNeeds.length > 0;
  const isBizDone = survey.companyDesc.trim() !== '' && survey.bizDesc.trim() !== '';
  const isInvoiceDone = survey.invoiceReq !== '' && survey.monthlyAmount !== '' && survey.revenue.length > 0;
  const isEquityDone = survey.shareholderType.length > 0 && survey.shareholderCount !== '';
  const isCapitalDone = survey.capitalRec === '是' || (survey.capitalRec === '否' && survey.capitalAmount.trim() !== '');
  const isAddressDone = survey.regAddress !== '' && survey.officeSpace !== '';
  const doneCount = [isCoreDone, isBizDone, isInvoiceDone, isEquityDone, isCapitalDone, isAddressDone].filter(Boolean).length;

  let currentProgressPct = 9;
  if (currentStep === 'survey') {
    currentProgressPct = doneCount === 0 ? 9 : Math.max(9, Math.round((doneCount / 6) * 100));
  } else if (currentStep === 'proposal') {
    currentProgressPct = 35;
  } else if (currentStep === 'payment' || currentStep === 'agreement') {
    currentProgressPct = 60;
  } else if (currentStep === 'group') {
    currentProgressPct = 75;
  } else if (currentStep === 'fill_details') {
    currentProgressPct = 88;
  } else if (currentStep === 'progress') {
    currentProgressPct = 100;
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0F172A] relative flex flex-col selection:bg-[#E6F7F2] selection:text-[#2AA894]">
      
      {/* Top Navbar */}
      <TopNavbar
        currentStep={currentStep}
        onSelectStep={(step) => {
          if (unlockedSteps.includes(step)) {
            setCurrentStep(step);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        unlockedSteps={unlockedSteps}
        progressPct={currentProgressPct}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1">
        {currentStep === 'survey' && (
          <SurveyStep
            survey={survey}
            onChange={setSurvey}
            onSubmit={handleSurveySubmit}
          />
        )}

        {currentStep === 'proposal' && (
          <ProposalStep
            plan={plan}
            survey={survey}
            contactPhone={order.contactPhone}
            onUpdatePlan={(newPlan) => {
              setPlan(newPlan);
              setOrder(prev => ({ ...prev, amount: newPlan.finalPrice }));
            }}
            onProceed={handleProposalProceed}
            onBack={() => {
              setCurrentStep('survey');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentStep === 'agreement' && (
          <AgreementAndPaymentStep
            plan={plan}
            order={order}
            onUpdateOrder={setOrder}
            onPaymentSuccess={handlePaymentSuccess}
            onProceedToFillDetails={handleProceedToFillDetails}
            onBack={() => {
              setCurrentStep('proposal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentStep === 'payment' && (
          <AgreementAndPaymentStep
            plan={plan}
            order={order}
            onUpdateOrder={setOrder}
            onPaymentSuccess={handlePaymentSuccess}
            onProceedToFillDetails={handleProceedToFillDetails}
            onBack={() => {
              setCurrentStep('proposal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentStep === 'group' && (
          <ServiceGroupStep
            plan={plan}
            order={order}
            messages={messages}
            onSendMessage={handleSendMessage}
            onProceedToFillDetails={handleProceedToFillDetails}
          />
        )}

        {currentStep === 'fill_details' && (
          <RegistrationDetailsStep
            details={details}
            onUpdateDetails={setDetails}
            onSubmitForReview={handleSubmitForReview}
            onBackToGroup={() => {
              setCurrentStep('payment');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentStep === 'progress' && (
          <ProgressAndReviewStep
            timeline={timeline}
            plan={plan}
            details={details}
            order={order}
            onUpdateTimeline={setTimeline}
            onGoToChat={() => {
              setCurrentStep('group');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

    </div>
  );
}
