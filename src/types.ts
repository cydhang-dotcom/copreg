/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SurveyData {
  coreNeeds: string[];
  companyDesc: string;
  bizDesc: string;
  scope: string[];
  license: string[];
  sensitive: string[];
  invoiceReq: string;
  monthlyAmount: string;
  revenue: string[];
  revenueOther: string;
  shareholderType: string[];
  shareholderCount: string;
  capitalRec: string;
  capitalAmount: string;
  regAddress: string;
  officeSpace: string;
}

export interface QuotationItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  originalPrice: number;
  isGift?: boolean;
  isFree?: boolean;
  tag?: string;
}

export type ServiceTierType = 'standard' | 'bundle_small' | 'bundle_general';

export interface RegistrationPlan {
  selectedTier: ServiceTierType;
  taxpayerTier: 'small' | 'general';
  tierName: string;
  companyNameProposal: string;
  companyType: string;
  taxpayerIdentity: string;
  taxReason: string;
  capitalAmount: string;
  capitalAdvice: string;
  registeredAddressAdvice: string;
  preQualifications: string[];
  postQualifications: string[];
  riskTips: string[];
  items: QuotationItem[];
  totalOriginal: number;
  totalDiscount: number;
  finalPrice: number;
  estimatedWorkdays: number;
  deliverables: string[];
}

export interface PaymentOrder {
  orderNo: string;
  createdAt: string;
  paidAt?: string;
  amount: number;
  paymentMethod: 'wechat' | 'alipay' | 'bank';
  status: 'pending' | 'paid';
  contactName: string;
  contactPhone: string;
  receiptNumber: string;
  invoiceType?: 'personal' | 'company_normal' | 'company_special';
  invoiceTitle: string;
  invoiceTaxId?: string;
  invoiceEmail?: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  role: 'customer' | 'advisor' | 'delivery' | 'ai';
  roleTag: string;
  avatar: string;
  timestamp: string;
  content: string;
  isSelf?: boolean;
  actionPayload?: {
    type: 'timeline' | 'docs' | 'signature';
    title: string;
    description: string;
  };
}

export interface Shareholder {
  id: string;
  name: string;
  idCard: string;
  phone: string;
  ratio: number;
  capitalAmount: number;
}

export interface UploadedDoc {
  id: string;
  name: string;
  type: string;
  required: boolean;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  fileName?: string;
  fileSize?: string;
  feedback?: string;
  updatedAt?: string;
}

export interface RegistrationDetails {
  primaryName: string;
  backupName1: string;
  backupName2: string;
  industryCategory: string;
  registeredCapital: string;
  legalRepresentative: {
    name: string;
    idCard: string;
    phone: string;
    email: string;
  };
  supervisor: {
    name: string;
    idCard: string;
    phone: string;
  };
  financeOfficer: {
    name: string;
    idCard: string;
    phone: string;
  };
  shareholders: Shareholder[];
  officeAddress: {
    region: string;
    detail: string;
    propertyType: string;
    area: string;
  };
  docs: UploadedDoc[];
}

export type ProcessStep =
  | 'survey'       // 1. 初步业务信息调研
  | 'proposal'     // 2. 注册方案与服务报价
  | 'agreement'    // 3. 服务确认与短信验证
  | 'payment'      // 4. 在线支付服务费用
  | 'group'        // 5. 专属服务群（含 AI 助手）
  | 'fill_details' // 6. 填写注册信息与上传资料
  | 'progress';    // 7. 客服核验与交付团队办理进度

export interface TimelineNode {
  id: string;
  stepNumber: number;
  title: string;
  operator: string;
  dept: string;
  time: string;
  status: 'done' | 'current' | 'waiting';
  detail: string;
  requiresAction?: boolean;
  actionName?: string;
}
