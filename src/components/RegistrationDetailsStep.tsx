/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { RegistrationDetails, SurveyData, RegistrationPlan, PaymentOrder } from '../types';
import {
  RegistrationFullForm,
  ValidationErrorItem,
  FileAttachment,
  PersonRecord,
} from './registration/types';
import {
  createCompliantDemoForm,
  STORAGE_KEY,
  uid,
} from './registration/defaultData';
import { BasicInfoSection } from './registration/BasicInfoSection';
import { ShareholderSection } from './registration/ShareholderSection';
import { PersonnelSection } from './registration/PersonnelSection';
import { AuthorizationSection } from './registration/AuthorizationSection';
import { ReviewSection } from './registration/ReviewSection';
import { RecordModal } from './registration/RecordModal';
import { ShareholderTypeModal } from './registration/ShareholderTypeModal';
import { VerificationModal } from './registration/VerificationModal';
import { HelpModal } from './registration/HelpModal';
import { FilePreviewModal } from './registration/FilePreviewModal';
import {
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Save,
  CheckCircle2,
  AlertCircle,
  Send,
  MessageSquare,
  QrCode,
  X,
  FileText,
  Check,
  ChevronDown,
  ChevronUp,
  Compass,
  Sparkles,
  Building2,
  FileCheck2,
} from 'lucide-react';

interface RegistrationDetailsStepProps {
  details: RegistrationDetails;
  onUpdateDetails: (details: RegistrationDetails) => void;
  onSubmitForReview: () => void;
  onBackToGroup: () => void;
  companyName?: string;
  plan?: RegistrationPlan;
  survey?: SurveyData;
  order?: PaymentOrder;
}

const CHAPTERS = [
  { id: 0, num: '01', title: '基本信息', fullTitle: '企业基本信息' },
  { id: 1, num: '02', title: '股东出资', fullTitle: '股东及出资结构' },
  { id: 2, num: '03', title: '主要人员', fullTitle: '企业主要管理人员' },
  { id: 3, num: '04', title: '委托书办理', fullTitle: '法定代表人委托书签署' },
  { id: 4, num: '05', title: '确认提交', fullTitle: '信息确认并提交初审' },
];

export const RegistrationDetailsStep: React.FC<RegistrationDetailsStepProps> = ({
  details,
  onUpdateDetails,
  onSubmitForReview,
  onBackToGroup,
  companyName,
  plan,
  survey,
  order,
}) => {
  // Main form state
  const [form, setForm] = useState<RegistrationFullForm>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.basic && parsed.people) {
          if (!parsed.basic.board) parsed.basic.board = '不设董事会';
          if (!parsed.basic.singleDirector) parsed.basic.singleDirector = '由总经理代行职务（不设董事）';
          if (parsed.basic.unanimous === undefined || parsed.basic.unanimous === null) parsed.basic.unanimous = true;
          if (!parsed.basic.regAddressNature) parsed.basic.regAddressNature = '租赁用房';
          if (!parsed.basic.workAddressNature) parsed.basic.workAddressNature = '商业租赁';
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load cached registration form', e);
    }
    return createCompliantDemoForm(
      details.legalRepresentative?.name || '林楚天',
      details.legalRepresentative?.phone || '13800138000'
    );
  });

  const [currentChapter, setCurrentChapter] = useState<number>(0);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals state
  const [showTypeModal, setShowTypeModal] = useState<boolean>(false);
  const [editRecordState, setEditRecordState] = useState<{
    kind: 'share' | 'role';
    isNew: boolean;
    recordId?: string;
    targetType?: '自然人' | '企业' | '其他';
  } | null>(null);

  const [previewFile, setPreviewFile] = useState<FileAttachment | null>(null);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [showWecomModal, setShowWecomModal] = useState<boolean>(false);
  const [showDiffGuide, setShowDiffGuide] = useState<boolean>(true);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const updateForm = (partial: Partial<RegistrationFullForm>) => {
    setForm((prev) => ({ ...prev, ...partial }));
    setIsDirty(true);
  };

  // Validation engine
  const validate = (): ValidationErrorItem[] => {
    const errs: ValidationErrorItem[] = [];
    const add = (
      s: number,
      id: string,
      msg: string,
      record?: { kind: 'share' | 'role'; id: string }
    ) => {
      errs.push({ s, id, msg, record });
    };

    const b = form.basic;
    // Chapter 0: Basic
    if (!b.org) add(0, 'org', '请选择企业组织形式');
    if (b.org === '其他' && !b.orgOther.trim()) add(0, 'orgOther', '请填写具体组织形式');
    if (!b.scope.trim()) add(0, 'scope', '请填写经营范围');
    if (!b.capital.trim() || !/^\d+$/.test(b.capital.trim()) || Number(b.capital.trim()) <= 0) {
      add(0, 'capital', '注册资本需填写大于 0 的非负整数金额（万元）');
    }
    if (!b.names.some((n) => n.trim().length > 0)) {
      add(0, 'name-0', '请至少填写一个拟注册名称');
    }
    b.names.forEach((n, idx) => {
      if (idx >= 3 && !n.trim()) {
        add(0, `name-${idx}`, `请填写新增的第 ${idx + 1} 个企业名称，或移除该项`);
      }
    });
    // 法定注册地址校验
    if (!b.regRecommend) {
      if (!b.regAddress?.trim()) {
        add(0, 'regAddress', '请填写法定注册详细地址，或勾选由服务商提供');
      }
      if (!b.regAddressNature) {
        add(0, 'regAddressNature', '未勾选由服务商提供时，需选择法定注册地址性质');
      }
      if (!b.regFiles || b.regFiles.length === 0) {
        add(0, 'regFiles', '未勾选由服务商提供时，需上传法定注册场地证明材料');
      }
    }

    // 实际经营办公地址校验
    if (!b.workRecommend) {
      if (!b.workAddress?.trim()) {
        add(0, 'workAddress', '请填写实际经营办公地址，或勾选由服务商提供');
      }
      if (!b.workAddressNature) {
        add(0, 'workAddressNature', '未勾选由服务商提供时，需选择实际经营办公地址性质');
      }
      if (!b.workFiles || b.workFiles.length === 0) {
        add(0, 'workFiles', '未勾选由服务商提供时，需上传实际经营办公场地证明材料');
      }
    }

    if (b.board === '设董事会') {
      const dNum = Number(b.directors);
      if (!b.directors || isNaN(dNum) || dNum < 3) {
        add(0, 'directors', '设立董事会成员人数至少为 3 人');
      }
    }
    if (b.singleSupervisor === '不设监事' && b.unanimous === false) {
      add(0, 'unanimous', '不设监事须经全体股东一致同意确认');
    }

    // Chapter 1: Shareholders
    if (form.shareholders.length < 1) {
      add(1, 'shareholders', '请添加至少 1 位股东');
    }
    form.shareholders.forEach((s, idx) => {
      const p = s.personId ? form.people[s.personId] : null;
      const title = s.type === '自然人' ? p?.name || '未命名' : s.name || '未命名';
      const prefix = `股东 ${idx + 1}（${title}）：`;
      const sErrors: string[] = [];

      if (s.type === '自然人') {
        if (!p?.name.trim()) sErrors.push('请填写姓名');
        if (!p?.phone.trim()) sErrors.push('请填写联系电话');
        if (!p?.address.trim()) sErrors.push('请填写居住地址');
        const hasFront = (p?.files || []).some((f) => f.slot === 'idFront');
        const hasBack = (p?.files || []).some((f) => f.slot === 'idBack');
        if (!hasFront || !hasBack) sErrors.push('请补齐身份证人像面和国徽面照片');
      } else if (s.type === '企业') {
        if (!s.name.trim()) sErrors.push('请填写企业全称');
        if (!s.code.trim()) sErrors.push('请填写统一社会信用代码');
        const hasLicense = (s.files || []).some((f) => f.slot === 'license');
        if (!hasLicense) sErrors.push('请上传加盖公章的营业执照照片');
      } else {
        if (!s.name.trim()) sErrors.push('请填写股东说明');
      }

      const ratioNum = Number(s.ratio);
      if (!s.ratio || isNaN(ratioNum) || ratioNum <= 0 || ratioNum > 100) {
        sErrors.push('出资比例需大于 0 且不超过 100%');
      }
      if (s.amount && (isNaN(Number(s.amount)) || Number(s.amount) < 0)) {
        sErrors.push('出资金额需为非负数字');
      }

      if (sErrors.length > 0) {
        add(1, `share-${s.id}`, prefix + sErrors.join('；'), { kind: 'share', id: s.id });
      }
    });

    // Chapter 2: Key Personnel
    const assignedRoles = form.roles.flatMap((r) => r.roles);
    const requiredRoles = ['法定代表人', '财务负责人', '联系人'];

    const hasDirector =
      b.board === '设董事会' ||
      b.singleDirector === '设 1 名董事' ||
      b.singleDirector === '设1名董事' ||
      b.singleDirector === '董事';

    const hasSupervisor =
      b.singleSupervisor === '设 1 名监事' ||
      b.singleSupervisor === '设1名监事' ||
      b.singleSupervisor === '一名监事';

    const hasGeneralManagerExercising =
      b.board === '不设董事会' &&
      (b.singleDirector?.includes('总经理') ||
       b.singleDirector?.includes('代行') ||
       b.singleDirector?.includes('经理') ||
       !hasDirector);

    if (hasDirector) requiredRoles.push('董事');
    if (hasGeneralManagerExercising) requiredRoles.push('总经理');
    if (hasSupervisor) requiredRoles.push('监事');

    requiredRoles.forEach((reqRole) => {
      if (!assignedRoles.includes(reqRole)) {
        add(2, 'roles', `根据基本信息设置要求，主要管理人员必须指定【${reqRole}】`);
      }
    });

    form.roles.forEach((r, idx) => {
      const p = form.people[r.personId];
      const pErrors: string[] = [];
      if (!p?.name.trim()) pErrors.push('请填写姓名');
      if (!p?.phone.trim()) pErrors.push('请填写电话');
      if (!p?.address.trim()) pErrors.push('请填写居住地址');
      if (!r.roles || r.roles.length === 0) pErrors.push('请选择人员角色');

      if (r.roles.includes('监事')) {
        const conflicts = r.roles.filter((x) =>
          ['董事', '法定代表人', '总经理', '财务负责人'].includes(x)
        );
        if (conflicts.length > 0) {
          pErrors.push(`依据《公司法》规定，监事不得兼任【${conflicts.join('、')}】职务`);
        }
      }

      const hasFront = (p?.files || []).some((f) => f.slot === 'idFront');
      const hasBack = (p?.files || []).some((f) => f.slot === 'idBack');
      if (!hasFront || !hasBack) pErrors.push('请补齐身份证正反面照片');

      if (pErrors.length > 0) {
        add(2, `role-${r.id}`, `主要人员 ${idx + 1}（${p?.name || '未命名'}）：${pErrors.join('；')}`, {
          kind: 'role',
          id: r.id,
        });
      }
    });

    // Chapter 3: Authorization
    if (!form.authorization.files || form.authorization.files.length === 0) {
      add(3, 'auth', '请上传已签字盖章的法定代表人委托书');
    }

    // Chapter 4: Confirm
    if (!form.confirm.accurate) {
      add(4, 'accurate', '请勾选信息真实性确认');
    }

    return errs;
  };

  const allErrors = useMemo(() => validate(), [form]);

  // Chapter completion states
  const chapterStates = useMemo(() => {
    return [0, 1, 2, 3, 4].map((chIdx) => {
      const chErrors = allErrors.filter((e) => e.s === chIdx);
      return chErrors.length === 0 ? 'complete' : 'partial';
    });
  }, [allErrors]);

  const completedCount = chapterStates.filter((s) => s === 'complete').length;
  const currentChapterErrors = allErrors.filter((e) => e.s === currentChapter);
  const currentErrorsMap = useMemo(() => {
    const map: Record<string, string> = {};
    currentChapterErrors.forEach((e) => {
      map[e.id] = e.msg;
    });
    return map;
  }, [currentChapterErrors]);

  // Save draft locally
  const handleSaveDraft = (silent = false) => {
    const nowStr = new Date().toLocaleString('zh-CN', { hour12: false });
    const snapshot: RegistrationFullForm = {
      ...form,
      savedAt: nowStr,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      setForm(snapshot);
      setIsDirty(false);
      if (!silent) showToast(`申报草稿已成功保存 · ${nowStr}`);
      return true;
    } catch (e) {
      showToast('草稿保存完成');
      return false;
    }
  };

  const handleResetToDemo = () => {
    const demo = createCompliantDemoForm(
      details.legalRepresentative?.name || '林楚天',
      details.legalRepresentative?.phone || '13800138000'
    );
    setForm(demo);
    setIsDirty(true);
    setShowHelpModal(false);
    showToast('已载入全套合规示例数据');
  };

  // Step Navigation
  const handleGoChapter = (chIdx: number) => {
    setCurrentChapter(Math.max(0, Math.min(4, chIdx)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (currentChapter < 4) {
      handleGoChapter(currentChapter + 1);
    }
  };

  const handlePrev = () => {
    if (currentChapter > 0) {
      handleGoChapter(currentChapter - 1);
    }
  };

  // Submit trigger
  const handleSubmitStart = () => {
    if (form.status === 'submitted') {
      showToast('正在前往“服务进度状态与办理清单”...');
      onSubmitForReview();
      return;
    }
    if (allErrors.length > 0) {
      const firstErr = allErrors[0];
      handleGoChapter(firstErr.s);
      showToast(`仍有 ${allErrors.length} 项信息待完善，请先补充`);
      return;
    }
    setShowVerifyModal(true);
  };

  // Verification success
  const handleVerifySuccess = (phone: string) => {
    setShowVerifyModal(false);
    const nowStr = new Date().toLocaleString('zh-CN', { hour12: false });
    const updated: RegistrationFullForm = {
      ...form,
      status: 'submitted',
      submittedAt: nowStr,
      submissionPhone: phone,
    };
    setForm(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}

    // Sync back to parent App state
    const primaryName = form.basic.names.find((n) => n.trim().length > 0) || '云帆盛景电子商务（深圳）有限公司';
    const repRole = form.roles.find((r) => r.roles.includes('法定代表人')) || form.roles[0];
    const repPerson = repRole ? form.people[repRole.personId] : null;

    onUpdateDetails({
      ...details,
      primaryName,
      registeredCapital: `${form.basic.capital} 万元人民币`,
      legalRepresentative: {
        name: repPerson?.name || '林楚天',
        idCard: '440301199308123418',
        phone: repPerson?.phone || phone,
        email: repPerson?.email || 'contact@company.com',
      },
      shareholders: form.shareholders.map((s) => {
        const sp = s.personId ? form.people[s.personId] : null;
        return {
          id: s.id,
          name: s.type === '自然人' ? sp?.name || '股东' : s.name,
          idCard: '440301199308123418',
          phone: sp?.phone || phone,
          ratio: Number(s.ratio) || 50,
          capitalAmount: Number(s.amount) || 50,
        };
      }),
    });

    showToast('申报资料已成功提交！正在跳转到“服务进度状态与办理清单”...');
    setTimeout(() => {
      onSubmitForReview();
    }, 400);
  };

  // Modal Save/Delete Handlers
  const handleSaveModalRecord = (payload: {
    kind: 'share' | 'role';
    isNew: boolean;
    record: any;
    person?: PersonRecord;
    linked: boolean;
  }) => {
    const { kind, isNew, record, person, linked } = payload;
    const nextPeople = { ...form.people };

    if (person) {
      if (!record.personId) {
        record.personId = person.id || uid();
      }
      nextPeople[record.personId] = { ...person, id: record.personId };
    }

    if (kind === 'share') {
      let nextShareholders = [...form.shareholders];
      if (isNew) {
        nextShareholders.push(record);
      } else {
        nextShareholders = nextShareholders.map((s) => (s.id === record.id ? record : s));
      }
      setForm((prev) => ({
        ...prev,
        people: nextPeople,
        shareholders: nextShareholders,
      }));
    } else {
      let nextRoles = [...form.roles];
      if (isNew) {
        nextRoles.push(record);
      } else {
        nextRoles = nextRoles.map((r) => (r.id === record.id ? record : r));
      }
      setForm((prev) => ({
        ...prev,
        people: nextPeople,
        roles: nextRoles,
      }));
    }

    setIsDirty(true);
    setEditRecordState(null);
    showToast('记录已保存');
  };

  const handleDeleteModalRecord = () => {
    if (!editRecordState || editRecordState.isNew || !editRecordState.recordId) return;
    const { kind, recordId } = editRecordState;

    if (kind === 'share') {
      setForm((prev) => ({
        ...prev,
        shareholders: prev.shareholders.filter((s) => s.id !== recordId),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        roles: prev.roles.filter((r) => r.id !== recordId),
      }));
    }

    setIsDirty(true);
    setEditRecordState(null);
    showToast('记录已删除');
  };

  return (
    <div className="pb-32">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#0F172A] text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#36B39E]" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        {/* ==================== 1. 全流程路线定位导航（解决“不知道现在哪里”） ==================== */}
        <section className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2AA894] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2AA894]"></span>
              </span>
              <span className="text-xs font-bold text-slate-800">企业开办全流程定位</span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">· 正在进行第 4 环节（政务申报与合规初审）</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#1D6C5E] bg-[#E6F7F2] px-2.5 py-0.5 rounded-full border border-[#2AA894]/25">
                阶段 4 / 5 · 履约执行中
              </span>
            </div>
          </div>

          {/* 5-step horizontal progression cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {/* Step 1 */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-200/60 text-slate-600">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#1D6C5E] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 font-medium leading-none mb-1">第 1 步 · 已完成</div>
                <div className="text-xs font-semibold text-slate-700 truncate leading-tight">需求意向评估</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-200/60 text-slate-600">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#1D6C5E] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 font-medium leading-none mb-1">第 2 步 · 已完成</div>
                <div className="text-xs font-semibold text-slate-700 truncate leading-tight">设立方案确认</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-200/60 text-slate-600">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#1D6C5E] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 font-medium leading-none mb-1">第 3 步 · 已签约</div>
                <div className="text-xs font-semibold text-slate-700 truncate leading-tight">协议签署与支付</div>
              </div>
            </div>

            {/* Step 4 (Current) */}
            <div className="col-span-2 sm:col-span-1 flex items-center gap-2 p-2 rounded-xl bg-gradient-to-r from-[#F4FBF9] to-white border-2 border-[#2AA894] text-[#1D6C5E] shadow-2xs ring-2 ring-[#2AA894]/15">
              <div className="w-5 h-5 rounded-full bg-[#2AA894] text-white flex items-center justify-center shrink-0 text-[11px] font-bold">
                4
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-[#2AA894] font-bold leading-none mb-1">当前进行中</div>
                <div className="text-xs font-bold text-[#1D6C5E] truncate leading-tight">申报资料填报初审</div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="col-span-2 sm:col-span-1 flex items-center gap-2 p-2 rounded-xl bg-slate-50/50 border border-slate-200/40 text-slate-400">
              <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 text-[11px] font-medium">
                5
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 leading-none mb-1">下一步待办</div>
                <div className="text-xs font-medium text-slate-500 truncate leading-tight">市监局审批领照</div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 2. 当前模块标题与业务背景 ==================== */}
        <section className="mb-5">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-[#E6F7F2] text-[#1D6C5E] border border-[#2AA894]/30 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2AA894]" />
              <span className="font-bold">政务履约阶段 · 第 4 步</span>
              <span className="text-[#2AA894]">·</span>
              <span>企业注册申报资料填报与初审</span>
            </div>

            <button
              type="button"
              onClick={onBackToGroup}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-medium transition-all shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>返回服务进度与办理清单</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1.5 text-slate-900">
                <span className="text-[#2AA894]">第 4 步：</span><span className="text-[#1D6C5E]">企业注册申报资料填报与初审</span>
              </h1>
              <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                您已完成前期需求规划与费用支付。现在进入法定工商设立申报阶段，本表单用于采集录入市场监督管理局政务系统所需的法定真实信息，初审合格后自动生成法定章程并交由市监局审批。
              </p>
            </div>

            {companyName && (
              <div className="shrink-0 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-right sm:text-left">
                <div className="text-[10px] text-slate-400 font-medium">当前办理主体</div>
                <div className="text-xs font-bold text-slate-800 truncate max-w-[220px]">
                  {companyName}
                </div>
                {order?.orderNo && (
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    单号: {order.orderNo}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ==================== 3. 填报指引与前后差异对照卡片（解决“和前面页面的差异在哪里”） ==================== */}
        <section className="mb-6 rounded-2xl border border-[#36B39E]/35 bg-gradient-to-br from-[#F4FBF9] via-white to-amber-50/20 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E6F7F2] text-[#2AA894] flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2 flex-wrap">
                  <span>💡 填报指引：当前环节与第 1 步「需求评估」的区别与联系</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-[#1D6C5E] font-medium border border-[#2AA894]/20">
                    前序数据已自动带入
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  第 1 步是「意向摸底与方案选型」，当前是「市监局正式行政申报与合规初审」，两者分工不同。
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDiffGuide(!showDiffGuide)}
              className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            >
              <span>{showDiffGuide ? '收起对比' : '展开差异对比'}</span>
              {showDiffGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showDiffGuide && (
            <div className="mt-3.5 pt-3 border-t border-slate-200/70 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Previous Step 1 */}
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      前面第 1 步：需求与意向评估
                    </span>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                      意向摸底与选型
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-slate-600 text-[11px] leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 font-bold shrink-0">· 核心目的：</span>
                      <span>摸清开办设想，为您匹配设立方案（如小规模/一般人）并核算服务报价。</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 font-bold shrink-0">· 填报内容：</span>
                      <span>轻量意向调研，只需选择大概方向，<strong>无需提供身份证号、精确字号或任职信息</strong>。</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 font-bold shrink-0">· 法律性质：</span>
                      <span>商务咨询参考，不具备行政法律约束，不提交政务审批系统。</span>
                    </li>
                  </ul>
                </div>

                {/* Current Step 4 */}
                <div className="p-3 rounded-xl bg-[#F4FBF9] border border-[#2AA894]/40 text-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2AA894]/20">
                    <span className="font-bold text-[#1D6C5E] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#2AA894]" />
                      当前第 4 步：申报资料填报与初审
                    </span>
                    <span className="text-[10px] text-[#1D6C5E] bg-emerald-100 font-bold px-1.5 py-0.5 rounded border border-[#2AA894]/20">
                      正式履约申报
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-slate-700 text-[11px] leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#2AA894] font-bold shrink-0">· 核心目的：</span>
                      <span>录入市场监督管理局设立登记网办系统，用于<strong>核发官方营业执照与公章刻制</strong>。</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#2AA894] font-bold shrink-0">· 填报内容：</span>
                      <span>法定实名核验，需<strong>精确备选名称、法人/股东实名身份证、监事财务备案及住所证明</strong>。</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#2AA894] font-bold shrink-0">· 法律性质：</span>
                      <span><strong>法定政务申报资料</strong>，班步合规团队初审后生成法定《公司章程》交工商局审查。</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Seamless inheritance notice */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-start sm:items-center gap-2 text-[11px] text-slate-600">
                <div className="w-4 h-4 rounded-full bg-[#2AA894] text-white flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <div>
                  <span className="font-bold text-[#1D6C5E]">免重复填写保障：</span>
                  <span>
                    您在第 1 步选择的行业方向、建议资本（{survey?.capitalAmount || '50 万元'}）、经营范围及联系人已全部自动带入本页基础数据。您无需从零构思，只需完善法定实名与任职身份等市监局必需项！
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ==================== DELICATE CONNECTED CIRCLE STEPPER (NO BOXES) ==================== */}
        <div className="mb-6 pt-1 px-1">
          <div className="relative">
            {/* Connecting Track Line behind circles (center aligned with w-6 circles, top-3 = 12px) */}
            <div className="absolute top-3 left-[10%] right-[10%] h-[1.5px] bg-slate-200/80 -z-0 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#2AA894] to-[#36B39E] transition-all duration-500 ease-out rounded-full"
                style={{
                  width: `${(Math.max(currentChapter, completedCount) / (CHAPTERS.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* 5 Connected Circle Step Nodes */}
            <div className="grid grid-cols-5 relative z-10">
              {CHAPTERS.map((ch) => {
                const isActive = currentChapter === ch.id;
                const isCompleted = chapterStates[ch.id] === 'complete';
                const stepNumber = ch.id + 1;

                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => handleGoChapter(ch.id)}
                    className="group flex flex-col items-center text-center cursor-pointer focus:outline-none transition-all"
                  >
                    {/* Compact Circle Node */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-bold transition-all duration-200 ${
                        isActive
                          ? 'bg-white border-2 border-[#2AA894] text-[#1D6C5E] ring-3 ring-[#2AA894]/20 shadow-2xs'
                          : isCompleted
                          ? 'bg-[#2AA894] text-white shadow-2xs group-hover:bg-[#239983]'
                          : 'bg-white border border-slate-200 text-slate-400 group-hover:border-slate-300 group-hover:text-slate-600'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : (
                        stepNumber
                      )}
                    </div>

                    {/* Step Title Label */}
                    <span
                      className={`mt-1.5 text-xs sm:text-[13px] tracking-tight truncate max-w-full px-1 transition-colors ${
                        isActive
                          ? 'text-[#1D6C5E] font-bold'
                          : isCompleted
                          ? 'text-slate-700 font-medium group-hover:text-slate-900'
                          : 'text-slate-400 font-normal group-hover:text-slate-600'
                      }`}
                    >
                      {ch.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Current Chapter Error Banner */}
        {currentChapterErrors.length > 0 && (
          <div className="mb-5 p-4 rounded-xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-800 space-y-1 animate-in fade-in">
            <div className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>本章节尚有 {currentChapterErrors.length} 项需完善，填写完成后可继续下一步：</span>
            </div>
            <ul className="list-disc pl-5 space-y-0.5 text-amber-700 text-[11px]">
              {currentChapterErrors.map((e, i) => (
                <li key={i}>{e.msg}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ==================== ACTIVE CHAPTER CONTENT ==================== */}
        <div>
          {currentChapter === 0 && (
            <BasicInfoSection
              data={form.basic}
              onChange={(basic) => updateForm({ basic })}
              errors={currentErrorsMap}
              onPreviewFile={(file) => setPreviewFile(file)}
              onToast={showToast}
            />
          )}

          {currentChapter === 1 && (
            <ShareholderSection
              shareholders={form.shareholders}
              people={form.people}
              onAddShareholder={() => setShowTypeModal(true)}
              onEditShareholder={(id) => {
                setEditRecordState({ kind: 'share', isNew: false, recordId: id });
              }}
              errors={currentErrorsMap}
            />
          )}

          {currentChapter === 2 && (
            <PersonnelSection
              roles={form.roles}
              people={form.people}
              basic={form.basic}
              onAddPersonnel={() => {
                setEditRecordState({ kind: 'role', isNew: true });
              }}
              onEditPersonnel={(id) => {
                setEditRecordState({ kind: 'role', isNew: false, recordId: id });
              }}
              onGoBasic={() => handleGoChapter(0)}
              errors={currentErrorsMap}
            />
          )}

          {currentChapter === 3 && (
            <AuthorizationSection
              data={form.authorization}
              roles={form.roles}
              people={form.people}
              onChange={(authorization) => updateForm({ authorization })}
              onPreviewFile={(file) => setPreviewFile(file)}
              onToast={showToast}
            />
          )}

          {currentChapter === 4 && (
            <ReviewSection
              form={form}
              onGoChapter={handleGoChapter}
              onUpdateConfirm={(confirmPartial) => {
                updateForm({ confirm: { ...form.confirm, ...confirmPartial } });
              }}
              onPreviewFile={(file) => setPreviewFile(file)}
              onProceedToDelivery={onSubmitForReview}
              errors={currentErrorsMap}
            />
          )}
        </div>
      </div>

      {/* ==================== STICKY BOTTOM ACTION BAR (MATCHING SYSTEM STYLE) ==================== */}
      <div className="fixed left-0 right-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 py-3 px-4 sm:px-6 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={currentChapter === 0 ? onBackToGroup : handlePrev}
              className="px-3.5 sm:px-5 py-2 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{currentChapter === 0 ? '返回企微沟通群' : '上一项'}</span>
            </button>

            {/* 草稿已保存 / 保存草稿 */}
            <button
              type="button"
              onClick={() => handleSaveDraft(false)}
              className="px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="点击手动保存当前填报草稿"
            >
              <Save className="w-3.5 h-3.5 text-[#36B39E]" />
              <span>{isDirty ? '保存草稿' : '草稿已保存'}</span>
            </button>

            {/* 填报须知 */}
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="查看填报规范与申报指引"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>填报须知</span>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:block text-right">
              <span className="text-[11px] text-slate-400 block">
                {form.savedAt ? `已自动保存 ${form.savedAt}` : '带 * 字段为必填项'}
              </span>
            </div>

            {currentChapter < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 sm:px-6 py-2.5 rounded-full bg-[#36B39E] hover:bg-[#2AA894] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>下一项</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitStart}
                className="px-6 sm:px-7 py-2.5 rounded-full bg-[#36B39E] hover:bg-[#2AA894] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#36B39E]/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>确认并提交申请</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ==================== DIALOG MODALS ==================== */}

      {/* Shareholder Type Modal */}
      {showTypeModal && (
        <ShareholderTypeModal
          onSelect={(type) => {
            setShowTypeModal(false);
            setEditRecordState({
              kind: 'share',
              isNew: true,
              targetType: type,
            });
          }}
          onClose={() => setShowTypeModal(false)}
        />
      )}

      {/* Record Editor Modal */}
      {editRecordState && (
        <RecordModal
          kind={editRecordState.kind}
          isNew={editRecordState.isNew}
          shareRecord={
            editRecordState.kind === 'share'
              ? editRecordState.isNew
                ? {
                    id: uid(),
                    type: editRecordState.targetType || '自然人',
                    personId: null,
                    name: '',
                    code: '',
                    ratio: '',
                    amount: '',
                    method: ['货币'],
                    files: [],
                  }
                : form.shareholders.find((s) => s.id === editRecordState.recordId)
              : undefined
          }
          roleRecord={
            editRecordState.kind === 'role'
              ? editRecordState.isNew
                ? {
                    id: uid(),
                    personId: '',
                    roles: [],
                  }
                : form.roles.find((r) => r.id === editRecordState.recordId)
              : undefined
          }
          people={form.people}
          existingRoles={form.roles}
          basic={form.basic}
          onSave={handleSaveModalRecord}
          onDelete={handleDeleteModalRecord}
          onClose={() => setEditRecordState(null)}
          onPreviewFile={(file) => setPreviewFile(file)}
        />
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <HelpModal
          onResetToDemo={handleResetToDemo}
          onClose={() => setShowHelpModal(false)}
          onOpenWecom={() => setShowWecomModal(true)}
        />
      )}

      {/* SMS Phone Verification Modal */}
      {showVerifyModal && (
        <VerificationModal
          defaultPhone={form.submissionPhone || details.legalRepresentative?.phone || '13800138000'}
          onVerifySuccess={handleVerifySuccess}
          onClose={() => setShowVerifyModal(false)}
        />
      )}

      {/* WeCom QR Code Modal */}
      {showWecomModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full p-5 border border-slate-200 animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#2AA894]" />
                <span className="text-xs font-bold text-slate-800">专属顾问企业微信</span>
              </div>
              <button
                type="button"
                onClick={() => setShowWecomModal(false)}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="w-36 h-36 mx-auto bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col items-center justify-center my-2">
              <QrCode className="w-28 h-28 text-slate-800" />
            </div>
            <p className="text-xs font-semibold text-slate-800 mt-2">李经理 · 资深设立顾问</p>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 inline-block mt-1">
              企业微信官方认证
            </span>
            <p className="text-[11px] text-slate-400 mt-2">微信扫一扫添加，专属顾问全程跟进代办</p>
          </div>
        </div>
      )}
    </div>
  );
};
