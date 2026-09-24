/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ProcessStep, 
  SurveyData, 
  RegistrationPlan, 
  PaymentOrder, 
  ChatMessage, 
  RegistrationDetails, 
  TimelineNode,
  RegistrationApplication
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

const STORAGE_KEY = 'banbu_multi_applications_v2';

const createDefaultApplication = (id?: string, companyName?: string): RegistrationApplication => {
  const appId = id || 'app-' + Date.now();
  const initPlan = generatePlanFromSurvey(INITIAL_SURVEY_DATA, 'bundle_small');
  const initialOrderNo = 'ORD' + new Date().getFullYear() + '09' + Math.floor(100000 + Math.random() * 900000);

  return {
    id: appId,
    companyName: companyName || '云帆盛景出海跨境科技（深圳）有限公司',
    createdAt: new Date().toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) + ' 10:00',
    currentStep: 'survey',
    unlockedSteps: ['survey', 'proposal'],
    survey: JSON.parse(JSON.stringify(INITIAL_SURVEY_DATA)),
    plan: initPlan,
    order: {
      orderNo: initialOrderNo,
      createdAt: '2026-09-15 10:00',
      amount: initPlan.finalPrice,
      paymentMethod: 'wechat',
      status: 'pending',
      contactName: '林楚天',
      contactPhone: '13800138000',
      receiptNumber: 'RCP-89210482',
      invoiceTitle: '个人/企业'
    },
    messages: JSON.parse(JSON.stringify(INITIAL_CHAT_MESSAGES)),
    details: JSON.parse(JSON.stringify(INITIAL_REGISTRATION_DETAILS)),
    isDetailsSubmitted: false,
    timeline: JSON.parse(JSON.stringify(INITIAL_TIMELINE_NODES))
  };
};

export default function App() {
  // Initialize multiple applications from localStorage or defaults
  const [applications, setApplications] = useState<RegistrationApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}

    // Initial default: 1 active default application
    return [createDefaultApplication('app-1', '云帆盛景跨境科技（主体 1）')];
  });

  const [currentAppId, setCurrentAppId] = useState<string>(() => {
    return applications[0]?.id || 'app-1';
  });

  // Current active application
  const activeApp = applications.find(a => a.id === currentAppId) || applications[0] || createDefaultApplication();

  // Keep state synced to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch (e) {}
  }, [applications]);

  // Update current application state helper
  const updateActiveApp = (updater: (prev: RegistrationApplication) => RegistrationApplication) => {
    setApplications(prev => prev.map(app => {
      if (app.id === activeApp.id) {
        return updater(app);
      }
      return app;
    }));
  };

  // Helper to extract company name from survey/details dynamically
  const extractCompanyName = (app: RegistrationApplication): string => {
    if (app.details?.primaryName && app.details.primaryName.trim()) {
      return app.details.primaryName;
    }
    if (app.plan?.companyNameProposal && app.plan.companyNameProposal.trim()) {
      return app.plan.companyNameProposal;
    }
    if (app.survey?.companyDesc && app.survey.companyDesc.trim()) {
      const desc = app.survey.companyDesc.trim();
      return desc.length > 16 ? desc.slice(0, 16) + '…' : desc;
    }
    return `企业设立服务（主体 ${app.id.slice(-4)}）`;
  };

  // 1. Switch active application
  const handleSwitchApplication = (id: string) => {
    setCurrentAppId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 2. Add new application
  const handleAddNewApplication = () => {
    const newCount = applications.length + 1;
    const newId = 'app-' + Date.now();
    const newApp: RegistrationApplication = {
      id: newId,
      companyName: `新创企业设立（主体 ${newCount}）`,
      createdAt: new Date().toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) + ' ' + new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      currentStep: 'survey',
      unlockedSteps: ['survey', 'proposal'],
      // Blank survey for clean new application
      survey: {
        coreNeeds: ['需公司主体', '需对公收款'],
        companyDesc: '',
        bizDesc: '',
        scope: ['技术服务、技术开发', '互联网销售（除销售需要许可的商品）'],
        license: [],
        sensitive: [],
        invoiceReq: '增值税普通发票',
        monthlyAmount: '0 - 10 万',
        revenue: ['服务费'],
        revenueOther: '',
        shareholderType: ['自然人'],
        shareholderCount: '1 个',
        capitalRec: '是',
        capitalAmount: '50 万元人民币',
        regAddress: '是（需推荐）',
        officeSpace: '否'
      },
      plan: generatePlanFromSurvey({
        coreNeeds: ['需公司主体'],
        companyDesc: '',
        bizDesc: '',
        scope: [],
        license: [],
        sensitive: [],
        invoiceReq: '增值税普通发票',
        monthlyAmount: '0 - 10 万',
        revenue: ['服务费'],
        revenueOther: '',
        shareholderType: ['自然人'],
        shareholderCount: '1 个',
        capitalRec: '是',
        capitalAmount: '50 万元人民币',
        regAddress: '是（需推荐）',
        officeSpace: '否'
      }, 'bundle_small'),
      order: {
        orderNo: 'ORD' + new Date().getFullYear() + '09' + Math.floor(100000 + Math.random() * 900000),
        createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
        amount: 2500,
        paymentMethod: 'wechat',
        status: 'pending',
        contactName: activeApp.order?.contactName || '林楚天',
        contactPhone: activeApp.order?.contactPhone || '13800138000',
        receiptNumber: 'RCP-' + Math.floor(10000000 + Math.random() * 90000000),
        invoiceTitle: '个人/企业'
      },
      messages: JSON.parse(JSON.stringify(INITIAL_CHAT_MESSAGES)),
      details: {
        primaryName: '',
        backupName1: '',
        backupName2: '',
        industryCategory: '软件和信息技术服务业',
        registeredCapital: '50 万元人民币',
        legalRepresentative: {
          name: activeApp.order?.contactName || '林楚天',
          idCard: '',
          phone: activeApp.order?.contactPhone || '13800138000',
          email: ''
        },
        supervisor: {
          name: '',
          idCard: '',
          phone: ''
        },
        financeOfficer: {
          name: '',
          idCard: '',
          phone: ''
        },
        shareholders: [
          {
            id: 'sh-new-1',
            name: activeApp.order?.contactName || '林楚天',
            idCard: '',
            phone: activeApp.order?.contactPhone || '13800138000',
            ratio: 100,
            capitalAmount: 50
          }
        ],
        officeAddress: {
          region: '广东省深圳市南山区',
          detail: '',
          propertyType: '商业办公 / 园区商务秘书地址托管',
          area: '60'
        },
        docs: JSON.parse(JSON.stringify(INITIAL_REGISTRATION_DETAILS.docs))
      },
      isDetailsSubmitted: false,
      timeline: JSON.parse(JSON.stringify(INITIAL_TIMELINE_NODES))
    };

    setApplications(prev => [...prev, newApp]);
    setCurrentAppId(newId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. Discard current/target application (before payment)
  const handleDiscardApplication = (appId: string) => {
    setApplications(prev => {
      const target = prev.find(a => a.id === appId);
      // Safety check: Cannot discard paid applications
      if (target && target.order.status === 'paid') {
        return prev;
      }
      const remaining = prev.filter(a => a.id !== appId);
      if (remaining.length === 0) {
        // If all discarded, create a fresh new one
        const fresh = createDefaultApplication('app-' + Date.now(), '新创企业设立（主体 1）');
        setCurrentAppId(fresh.id);
        return [fresh];
      }
      if (currentAppId === appId) {
        setCurrentAppId(remaining[0].id);
      }
      return remaining;
    });
  };

  // Step unlock helper
  const unlockStep = (step: ProcessStep) => {
    updateActiveApp(prev => {
      if (!prev.unlockedSteps.includes(step)) {
        return {
          ...prev,
          unlockedSteps: [...prev.unlockedSteps, step]
        };
      }
      return prev;
    });
  };

  // Step 1: Submit Survey -> S-->>U: 验证手机号并生成注册方案与服务报价
  const handleSurveySubmit = (verifiedPhone?: string) => {
    updateActiveApp(prev => {
      const generated = generatePlanFromSurvey(prev.survey, 'bundle_small');
      const updatedName = prev.survey.companyDesc?.trim()
        ? (prev.survey.companyDesc.length > 18 ? prev.survey.companyDesc.slice(0, 18) + '…' : prev.survey.companyDesc)
        : prev.companyName;

      return {
        ...prev,
        companyName: updatedName,
        plan: generated,
        order: {
          ...prev.order,
          amount: generated.finalPrice,
          contactPhone: verifiedPhone || prev.order.contactPhone
        },
        currentStep: 'proposal',
        unlockedSteps: prev.unlockedSteps.includes('proposal') ? prev.unlockedSteps : [...prev.unlockedSteps, 'proposal']
      };
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2: Confirm Proposal -> Go to Payment (Merged Agreement & Payment)
  const handleProposalProceed = (phone?: string) => {
    updateActiveApp(prev => ({
      ...prev,
      order: {
        ...prev.order,
        contactPhone: phone || prev.order.contactPhone
      },
      currentStep: 'payment',
      unlockedSteps: prev.unlockedSteps.includes('payment') ? prev.unlockedSteps : [...prev.unlockedSteps, 'payment']
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 3: Payment Success -> S-->>C: 同步已确认订单 & unlock Service Group
  const handlePaymentSuccess = () => {
    updateActiveApp(prev => ({
      ...prev,
      order: {
        ...prev.order,
        status: 'paid',
        paidAt: new Date().toLocaleString('zh-CN', { hour12: false })
      },
      unlockedSteps: prev.unlockedSteps.includes('group') ? prev.unlockedSteps : [...prev.unlockedSteps, 'group']
    }));
  };

  // Proceed from Payment to Service Group
  const handleProceedToGroup = () => {
    updateActiveApp(prev => ({
      ...prev,
      currentStep: 'group',
      unlockedSteps: prev.unlockedSteps.includes('group') ? prev.unlockedSteps : [...prev.unlockedSteps, 'group']
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Proceed from Group to Fill Details
  const handleProceedToFillDetails = () => {
    updateActiveApp(prev => ({
      ...prev,
      currentStep: 'fill_details',
      unlockedSteps: prev.unlockedSteps.includes('fill_details') ? prev.unlockedSteps : [...prev.unlockedSteps, 'fill_details']
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 6: Submit details for review -> 跳转到“服务进度状态与办理清单”页，并更新填报状态
  const handleSubmitForReview = () => {
    updateActiveApp(prev => {
      const companyFinalName = prev.details.primaryName?.trim() || prev.companyName;
      return {
        ...prev,
        companyName: companyFinalName,
        isDetailsSubmitted: true,
        order: {
          ...prev.order,
          status: 'paid',
          paidAt: prev.order.paidAt || new Date().toLocaleString('zh-CN', { hour12: false })
        },
        currentStep: 'payment',
        unlockedSteps: prev.unlockedSteps.includes('payment') ? prev.unlockedSteps : [...prev.unlockedSteps, 'payment']
      };
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle chat message in Service Group
  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: `${activeApp.order.contactName || '您'}`,
      role: 'customer',
      roleTag: '经办人',
      avatar: '👤',
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      content: text,
      isSelf: true
    };

    updateActiveApp(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg]
    }));

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
        replyContent = `收到企业负责人咨询！针对【${activeApp.companyName}】，专属交付专员与 AI 助手正在为您跟进。您的问题已同步记录在工单系统，若有需要也可以随时在群内沟通。`;
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

      updateActiveApp(prev => ({
        ...prev,
        messages: [...prev.messages, botReply]
      }));
    }, 600);
  };

  // Calculate progress percentage dynamically
  const isCoreDone = activeApp.survey.coreNeeds.length > 0;
  const isBizDone = activeApp.survey.companyDesc.trim() !== '' && activeApp.survey.bizDesc.trim() !== '';
  const isInvoiceDone = activeApp.survey.invoiceReq !== '' && activeApp.survey.monthlyAmount !== '' && activeApp.survey.revenue.length > 0;
  const isEquityDone = activeApp.survey.shareholderType.length > 0 && activeApp.survey.shareholderCount !== '';
  const isCapitalDone = activeApp.survey.capitalRec === '是' || (activeApp.survey.capitalRec === '否' && activeApp.survey.capitalAmount.trim() !== '');
  const isAddressDone = activeApp.survey.regAddress !== '' && activeApp.survey.officeSpace !== '';
  const doneCount = [isCoreDone, isBizDone, isInvoiceDone, isEquityDone, isCapitalDone, isAddressDone].filter(Boolean).length;

  let currentProgressPct = 9;
  if (activeApp.currentStep === 'survey') {
    currentProgressPct = doneCount === 0 ? 9 : Math.max(9, Math.round((doneCount / 6) * 100));
  } else if (activeApp.currentStep === 'proposal') {
    currentProgressPct = 35;
  } else if (activeApp.currentStep === 'payment' || activeApp.currentStep === 'agreement') {
    currentProgressPct = 60;
  } else if (activeApp.currentStep === 'group') {
    currentProgressPct = 75;
  } else if (activeApp.currentStep === 'fill_details') {
    currentProgressPct = 88;
  } else if (activeApp.currentStep === 'progress') {
    currentProgressPct = 100;
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0F172A] relative flex flex-col selection:bg-[#E6F7F2] selection:text-[#2AA894]">
      
      {/* Top Navbar with Multi-Service Application Switcher & Add New Service */}
      <TopNavbar
        currentStep={activeApp.currentStep}
        onSelectStep={(step) => {
          if (activeApp.unlockedSteps.includes(step)) {
            updateActiveApp(prev => ({ ...prev, currentStep: step }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        unlockedSteps={activeApp.unlockedSteps}
        progressPct={currentProgressPct}
        applications={applications}
        currentAppId={activeApp.id}
        onSwitchApplication={handleSwitchApplication}
        onAddNewApplication={handleAddNewApplication}
        onDiscardApplication={handleDiscardApplication}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1">
        {activeApp.currentStep === 'survey' && (
          <SurveyStep
            key={activeApp.id + '-survey'}
            survey={activeApp.survey}
            onChange={(newSurvey) => {
              updateActiveApp(prev => ({ ...prev, survey: newSurvey }));
            }}
            onSubmit={handleSurveySubmit}
            defaultPhone={activeApp.order.contactPhone}
          />
        )}

        {activeApp.currentStep === 'proposal' && (
          <ProposalStep
            key={activeApp.id + '-proposal'}
            plan={activeApp.plan}
            survey={activeApp.survey}
            contactPhone={activeApp.order.contactPhone}
            onUpdatePlan={(newPlan) => {
              updateActiveApp(prev => ({
                ...prev,
                plan: newPlan,
                order: { ...prev.order, amount: newPlan.finalPrice }
              }));
            }}
            onProceed={handleProposalProceed}
            onBack={() => {
              updateActiveApp(prev => ({ ...prev, currentStep: 'survey' }));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDiscardCurrentService={() => handleDiscardApplication(activeApp.id)}
          />
        )}

        {activeApp.currentStep === 'agreement' && (
          <AgreementAndPaymentStep
            key={activeApp.id + '-agreement'}
            plan={activeApp.plan}
            order={activeApp.order}
            isDetailsSubmitted={activeApp.isDetailsSubmitted}
            onUpdateOrder={(orderUpdater) => {
              updateActiveApp(prev => ({
                ...prev,
                order: typeof orderUpdater === 'function' ? orderUpdater(prev.order) : orderUpdater
              }));
            }}
            onPaymentSuccess={handlePaymentSuccess}
            onProceedToFillDetails={handleProceedToFillDetails}
            onBack={() => {
              updateActiveApp(prev => ({ ...prev, currentStep: 'proposal' }));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDiscardCurrentService={() => handleDiscardApplication(activeApp.id)}
          />
        )}

        {activeApp.currentStep === 'payment' && (
          <AgreementAndPaymentStep
            key={activeApp.id + '-payment'}
            plan={activeApp.plan}
            order={activeApp.order}
            isDetailsSubmitted={activeApp.isDetailsSubmitted}
            onUpdateOrder={(orderUpdater) => {
              updateActiveApp(prev => ({
                ...prev,
                order: typeof orderUpdater === 'function' ? orderUpdater(prev.order) : orderUpdater
              }));
            }}
            onPaymentSuccess={handlePaymentSuccess}
            onProceedToFillDetails={handleProceedToFillDetails}
            onBack={() => {
              updateActiveApp(prev => ({ ...prev, currentStep: 'proposal' }));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDiscardCurrentService={() => handleDiscardApplication(activeApp.id)}
          />
        )}

        {activeApp.currentStep === 'group' && (
          <ServiceGroupStep
            key={activeApp.id + '-group'}
            plan={activeApp.plan}
            order={activeApp.order}
            messages={activeApp.messages}
            onSendMessage={handleSendMessage}
            onProceedToFillDetails={handleProceedToFillDetails}
          />
        )}

        {activeApp.currentStep === 'fill_details' && (
          <RegistrationDetailsStep
            key={activeApp.id + '-fill_details'}
            details={activeApp.details}
            onUpdateDetails={(newDetails) => {
              updateActiveApp(prev => ({ ...prev, details: newDetails }));
            }}
            onSubmitForReview={handleSubmitForReview}
            onBackToGroup={() => {
              updateActiveApp(prev => ({ ...prev, currentStep: 'payment' }));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeApp.currentStep === 'progress' && (
          <ProgressAndReviewStep
            key={activeApp.id + '-progress'}
            timeline={activeApp.timeline}
            plan={activeApp.plan}
            details={activeApp.details}
            order={activeApp.order}
            onUpdateTimeline={(newTimeline) => {
              updateActiveApp(prev => ({ ...prev, timeline: newTimeline }));
            }}
            onGoToChat={() => {
              updateActiveApp(prev => ({ ...prev, currentStep: 'group' }));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

    </div>
  );
}
