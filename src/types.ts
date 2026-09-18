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

export interface OptionalAddonService {
  id: string;
  name: string;
  desc: string;
  price: number;
  unit: string;
  defaultSelected?: boolean;
}

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
  selectedAddons?: string[];
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
  | 'survey'       // 1. 初步业务信息调研与评估
  | 'proposal'     // 2. 注册方案与服务报价确认
  | 'agreement'    // 3. 服务确认与短信验证（合并于支付）
  | 'payment'      // 3. 协议确认与在线支付服务费用
  | 'group'        // 4. 专属服务群（含专员与智能助手）
  | 'fill_details' // 独立专项模块：企业注册申报资料填报与初审
  | 'progress';    // 5. 企业开办与政务交付办理进度追踪

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
