# 企业组织架构与财税规划评估报告 · AI 结构化提示词规范

本文档定义了由 AI 根据企业调研问卷（`SurveyData`）动态推演、生成纯 JSON 格式的**企业组织架构与财税规划评估报告**提示词工程规范，便于前台界面精准解析、模块化组装和高质量呈现。

---

## 1. System Prompt（系统角色与约束设定）

```text
你是一位深谙中国最新《公司法》（2024新规）、国家税务总局数电发票政策及市场监督管理局商事登记规则的资深企业架构师与高级注册税务师。
你的任务是：根据用户填写的企业设立调研信息（包含主营业务、经营范围、开票与营收预期、股东构成、场地安排、资金规模等），为用户量身定制一份高专业度、合规严密的《企业组织架构与财税规划评估报告》。

【核心原则与强制约束】：
1. 输出格式必须为纯 JSON，不要包裹任何 Markdown 标记（如不要使用 ```json 或 ```），不要输出任何 JSON 之外的寒暄、解释或前言后语。
2. 法律法规严谨度：严格依据新《公司法》第47条“有限责任公司认缴出资自成立之日起 5 年内缴足”的法定要求，以及一人有限责任公司财产独立、股东会决议、审计委员会等最新制度。
3. 针对性场景推演：
   - 股东构成：若包含法人股东（公司入股），必须输出母公司决议凭证与股权防僵局指引；若为多人合伙，设计退出与表决权机制；若为自然人单人，强调公私财产独立与年终审计。
   - 场地住所：若为自有/租赁商用场地，明确提示“禁止纯住宅注册、不动产权证书复印件盖章、房屋租赁合同及开户上门实地尽调门牌水牌”；若需集群挂靠，明确提示“商务秘书合规代收信函，规避经营异常名录”。
   - 财税身份：依据用户的开票类型、月开票量或年营收预期，智能推荐“小规模纳税人”或“一般纳税人”，并给出税率差异、进项专票抵扣逻辑与数电发票额度申请建议。
4. 语言风格：专业、精炼、客观、指导性强，每个分析维度拆解为 3 条结构清晰的实操要点（含【主题标头】与深度建议）。
```

---

## 2. User Prompt 模板（输入参数绑定）

```text
请根据以下企业用户填报的调研数据，推演并输出《企业组织架构与财税规划评估报告》的 JSON 数据：

【用户调研数据】：
1. 核心设立诉求：{{coreNeeds}}
2. 主营业务与模式：{{companyDesc}}（业务模式：{{bizDesc}}）
3. 拟经营范围：{{scope}}
4. 前置/后置许可资质诉求：{{license}}
5. 发票类型需求：{{invoiceReq}}
6. 预计月度开票规模：{{monthlyAmount}}
7. 预估年营收区间：{{revenue}}
8. 股东主体类型：{{shareholderType}}
9. 股东人数：{{shareholderCount}}
10. 注册资本意向金额：{{capitalAmount}}
11. 经营场所及场地状况：{{regAddress}}（自有场地情况：{{officeSpace}}）

请输出符合下方 Schema 的纯 JSON 对象：
```

---

## 3. JSON Output Schema（输出结构定义）

```json
{
  "reportTitle": "企业组织架构与财税规划评估报告",
  "summary": "依据新《公司法》合规要求，结合您填报的实际设立特征（含股东构成与场地安排），为您智能推演的四大核心架构维度：",
  "diagnosticBar": {
    "businessDirection": "主营业务方向（12字内精炼概括）",
    "shareholderProfile": "如：含法人股东参股 / 自然人多元合伙（3人） / 自然人100%独资",
    "premiseArrangement": "如：自有/租赁实体商用场地 / 园区商务秘书集群合规托管",
    "taxIdentityProfile": "如：小规模纳税人（享普惠免税） / 一般纳税人（专票全额抵扣）"
  },
  "coreDecisions": {
    "orgStructure": {
      "dimensionIndex": "01",
      "dimensionTitle": "组织形式与股权架构",
      "tag": "如：法人与自然人合资 / 涉外商投资 / 绝对控股合伙 / 单人100%全资控股",
      "recommendedType": "如：有限责任公司（自然人投资或控股） / 有限责任公司（法人独资）",
      "points": [
        {
          "title": "要点标头（如【法人股东凭据】或【合伙防僵局】）",
          "content": "具体实操说明及法定合规指引（包含材料凭证、表决权设置或治理精简）"
        },
        {
          "title": "要点标头（如【治理精简配置】或【有限责任防火墙】）",
          "content": "如执行董事与经理权责、审计委员会替代监事会设立等新《公司法》优化建议"
        },
        {
          "title": "要点标头（如【公私财产独立】或【退出通道约定】）",
          "content": "如年度审计合规、公私账户划分或股权回购清算机制"
        }
      ]
    },
    "capitalPlanning": {
      "dimensionIndex": "02",
      "dimensionTitle": "注册资本与出资规划",
      "tag": "新《公司法》5年实缴",
      "recommendedCapital": "如：50 万元人民币 / 100 万元人民币",
      "capitalUnit": "（认缴出资额）",
      "points": [
        {
          "title": "【法定实缴期限】",
          "content": "明确新《公司法》第47条全体股东自设立起5年内实缴完毕的法定节奏与年报公示义务"
        },
        {
          "title": "【出资方式与留痕】",
          "content": "对公账户打款备注“投资款/出资款”留存银行回单凭证，支持知识产权/实物等作价入股要求"
        },
        {
          "title": "【出资额度适度性】",
          "content": "切忌盲目写虚高引发清算代偿风险，匹配初创期业务规模与实缴预算"
        }
      ]
    },
    "taxAndInvoice": {
      "dimensionIndex": "03",
      "dimensionTitle": "财税身份与发票统筹",
      "tag": "如：小规模纳税人 · 享普惠减免 / 一般纳税人 · 专票进项抵扣",
      "recommendedTaxIdentity": "小规模纳税人 或 一般纳税人",
      "points": [
        {
          "title": "【税负政策优势】",
          "content": "阐述增值税征收率1%/3%免税政策，或6%/13%专票抵扣对招投标/客户合作的利弊评估"
        },
        {
          "title": "【数电发票额度】",
          "content": "新办纳税人电子税务局实名开通与数电发票初始授信额度核定建议"
        },
        {
          "title": "【四流合一合规】",
          "content": "保持“业务合同、发票票据、银行资金流水、业务货物交付”四流一致的记账建账规范"
        }
      ]
    },
    "businessPremise": {
      "dimensionIndex": "04",
      "dimensionTitle": "经营场所与住所合规",
      "tag": "如：自有/租赁商用场地 · 无需挂靠 / 园区合规商务秘书集群托管",
      "recommendedPremise": "如：自有实体商用场所合规登记 / 商务秘书集群地址合规托管",
      "points": [
        {
          "title": "【规划用途红线】",
          "content": "商用、办公或厂房属性（严禁纯住宅直接登记，防范市监退件驳回）"
        },
        {
          "title": "【商事登记必备】",
          "content": "不动产权证复印件（产权人盖章/签字）、房屋租赁协议及租金支付凭证齐全"
        },
        {
          "title": "【核验尽调与信函】",
          "content": "实地门牌水牌、工位实景配合银行客户经理上门实地尽调，防范地址失联入异"
        }
      ]
    }
  },
  "industryComplianceTips": [
    "针对性行业资质提示1（如增值电信业务许可证/食品经营许可/医疗器械备案等）",
    "针对性敏感词/准入提示2（如涉及金融、教育、投资等前置审批核查）"
  ],
  "pitfallGuides": [
    {
      "step": 1,
      "title": "股权比例与出资节奏",
      "desc": "章程明确表决权与分红通道，避免对半均分产生治理僵局，合理规划5年实缴资金节奏。"
    },
    {
      "step": 2,
      "title": "公私账务与场地凭证",
      "desc": "对公流水与个人账户严格分离，实体场地备齐房产证与租赁合同备查，严禁虚构挂靠。"
    },
    {
      "step": 3,
      "title": "按期纳税与工商年报",
      "desc": "每月/季按期进行税务零申报或正常申报，每年6月30日前完成国家企业信用信息公示系统年报。"
    }
  ]
}
```

---

## 4. 示例：输入与模型生成 JSON 样例

### 输入数据示例：
```json
{
  "coreNeeds": ["快速拿到营业执照", "代理记账与报税", "银行开户代办"],
  "companyDesc": "智能AI客服与SaaS软件开发，为电商企业提供客服智能化自动化插件与API服务",
  "bizDesc": "研发销售软件，收取企业客户年度SaaS订阅费及私有化部署实施费",
  "scope": ["软件开发", "信息系统运行维护服务", "信息技术咨询服务", "互联网销售（除销售需要许可的商品）"],
  "license": ["增值电信业务经营许可证（ICP/EDI许可证）"],
  "invoiceReq": "普通发票为主（部分大客户要求增值税专用发票）",
  "monthlyAmount": "5万 - 10万元",
  "revenue": "100万 - 300万元",
  "shareholderType": ["境内自然人", "境内公司（法人股东）"],
  "shareholderCount": "2 个",
  "capitalAmount": "100 万元",
  "regAddress": "否，需要推荐合规孵化器/集群注册地址（节约租金成本）",
  "officeSpace": "否"
}
```

### 预期 AI 输出 JSON（直接返回无额外包围）：
```json
{
  "reportTitle": "企业组织架构与财税规划评估报告",
  "summary": "依据新《公司法》合规要求，结合您填报的实际设立特征（含股东构成与场地安排），为您智能推演的四大核心架构维度：",
  "diagnosticBar": {
    "businessDirection": "AI客服与SaaS软件开发",
    "shareholderProfile": "含法人股东参股",
    "premiseArrangement": "商务秘书集群合规托管",
    "taxIdentityProfile": "小规模纳税人（享普惠免税）"
  },
  "coreDecisions": {
    "orgStructure": {
      "dimensionIndex": "01",
      "dimensionTitle": "组织形式与股权架构",
      "tag": "法人与自然人合资",
      "recommendedType": "多元有限责任公司（含法人股东投资）",
      "points": [
        {
          "title": "【法人股东凭据】",
          "content": "对方公司作为法人股东入股，须备齐其母公司营业执照副本复印件（加盖公章）、法人身份证复印件及母公司出具的合法《股东会决议》。"
        },
        {
          "title": "【表决权防僵局】",
          "content": "建议创始人团队保持 67% 绝对控制权或 51% 相对控制权，切忌配置 50:50 等额股权，从源头防止后续软件版本研发与融资决策僵局。"
        },
        {
          "title": "【内部治理优化】",
          "content": "新《公司法》允许设立审计委员会替代传统监事会，法定代表人可由经理担任，简化合资初期的日常行政与审批流转成本。"
        }
      ]
    },
    "capitalPlanning": {
      "dimensionIndex": "02",
      "dimensionTitle": "注册资本与出资规划",
      "tag": "新《公司法》5年实缴",
      "recommendedCapital": "100 万元人民币",
      "capitalUnit": "（认缴出资额）",
      "points": [
        {
          "title": "【法定实缴期限】",
          "content": "新《公司法》第47条明确：全体股东认缴出资额须自公司成立之日起 5 年内缴足，按年度向市监局公示实缴到资进度。"
        },
        {
          "title": "【多方协同出资】",
          "content": "法人股东与自然人股东按章程持股比例分批汇入企业对公基本户，银行附言注明“出资款”，留存银行进账单入账。"
        },
        {
          "title": "【知识产权作价】",
          "content": "初创研发团队亦可依法采用成熟的核心软件著作权或发明专利作价入股，需出具正规第三方资产评估报告及财税验资。"
        }
      ]
    },
    "taxAndInvoice": {
      "dimensionIndex": "03",
      "dimensionTitle": "财税身份与发票统筹",
      "tag": "小规模纳税人 · 享普惠减免",
      "recommendedTaxIdentity": "小规模纳税人（兼备数电专票代开）",
      "points": [
        {
          "title": "【税负政策优势】",
          "content": "初期月营收在 10 万元（季度 30 万元）以内免征增值税；若大客户阶段性索取增值税专用发票，可通过电子税务局按 1% 征收率开具。"
        },
        {
          "title": "【数电发票额度】",
          "content": "办税员完成实名认证后即刻开通数电发票系统，预估初期单月额度核定在 10-20 万元，随业务扩大可在线提额。"
        },
        {
          "title": "【四流合一合规】",
          "content": "软件SaaS服务交付过程中，确保软件技术合同、数电发票品目、银行收款流水与系统开通工单日志一致，防范税务疑点。"
        }
      ]
    },
    "businessPremise": {
      "dimensionIndex": "04",
      "dimensionTitle": "经营场所与住所合规",
      "tag": "园区合规商务秘书集群托管",
      "recommendedPremise": "科技自贸园区商务秘书集群地址合规托管",
      "points": [
        {
          "title": "【大幅节约租金】",
          "content": "轻资产SaaS团队初期无需租赁高额实体写字楼，免除每月押二付三租金沉淀，降低启动资金消耗。"
        },
        {
          "title": "【官方信函代收】",
          "content": "商务秘书中心统一配备专人负责接收市监局年检抽查信件与税务核查公函，彻底防范因无人签收被列入“经营异常名录”。"
        },
        {
          "title": "【银行绿色开户】",
          "content": "凭市监局备案地址证明与园区托管协议，联动合作商业银行开辟专属初创绿色通道，快速核实办理企业对公基本户。"
        }
      ]
    }
  },
  "industryComplianceTips": [
    "拟涉及 SaaS 软件及在线商业化运营，若后续向终端企业提供收费在线信息查询服务，建议设立后尽早向省通信管理局申请《增值电信业务经营许可证（ICP/EDI）》。",
    "软件销售合同中注意拆分“软件著作权授权费（增值税）”与“实施技术开发服务费”，合规享受软件企业增值税即征即退或研发费用加计扣除政策。"
  ],
  "pitfallGuides": [
    {
      "step": 1,
      "title": "股权比例与章程约定",
      "desc": "法人入股与自然人合伙需在章程明确表决权与分红规则，禁止对半均分导致决策陷入僵局。"
    },
    {
      "step": 2,
      "title": "公私账务严格隔离",
      "desc": "企业对公资金切勿使用个人微信或支付宝私卡过账，规范记账并索取合规发票，防范股东个人连带清偿风险。"
    },
    {
      "step": 3,
      "title": "资质前置合规布局",
      "desc": "线上平台软件上线前务必备齐增值电信资质与公安网安备案，防范因无证经营面临平台下架与行政处罚。"
    }
  ]
}
```

---

## 5. 前端 React / TypeScript 组件组装方式

前端接收到 AI 返回的 JSON 后，直接使用如下类型接口进行组装：

```tsx
import React from 'react';
import { Building, Scale, Receipt, Landmark, ShieldCheck } from 'lucide-react';

export interface ReportJsonData {
  reportTitle: string;
  summary: string;
  diagnosticBar: {
    businessDirection: string;
    shareholderProfile: string;
    premiseArrangement: string;
    taxIdentityProfile: string;
  };
  coreDecisions: {
    orgStructure: DecisionDimension;
    capitalPlanning: DecisionDimension;
    taxAndInvoice: DecisionDimension;
    businessPremise: DecisionDimension;
  };
  industryComplianceTips: string[];
  pitfallGuides: Array<{ step: number; title: number | string; desc: string }>;
}

export interface DecisionDimension {
  dimensionIndex: string;
  dimensionTitle: string;
  tag: string;
  recommendedType?: string;
  recommendedCapital?: string;
  capitalUnit?: string;
  recommendedTaxIdentity?: string;
  recommendedPremise?: string;
  points: Array<{ title: string; content: string }>;
}

export const ReportView: React.FC<{ data: ReportJsonData }> = ({ data }) => {
  const { diagnosticBar, coreDecisions, pitfallGuides } = data;
  const d = coreDecisions;

  return (
    <div className="rounded-2xl p-6 border border-slate-200 bg-white">
      {/* 顶部标题 */}
      <h2 className="text-lg font-bold text-slate-900">{data.reportTitle}</h2>
      <p className="text-xs text-slate-500 mt-1 mb-4">{data.summary}</p>

      {/* 意向诊断核对条 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 mb-5 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">拟营业务方向</span>
          <span className="font-semibold text-slate-800">{diagnosticBar.businessDirection}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">股东构成特征</span>
          <span className="font-semibold text-[#1D6C5E]">{diagnosticBar.shareholderProfile}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">经营场所安排</span>
          <span className="font-semibold text-slate-800">{diagnosticBar.premiseArrangement}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">财税身份定位</span>
          <span className="font-semibold text-slate-800">{diagnosticBar.taxIdentityProfile}</span>
        </div>
      </div>

      {/* 2x2 四大核心架构建议卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {[d.orgStructure, d.capitalPlanning, d.taxAndInvoice, d.businessPremise].map((dim, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">
                {dim.dimensionIndex} · {dim.dimensionTitle}
              </span>
              <span className="text-[11px] text-[#1D6C5E] bg-[#E6F7F2] px-2 py-0.5 rounded-md font-medium">
                {dim.tag}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900 mb-2">
              {dim.recommendedType || dim.recommendedCapital || dim.recommendedTaxIdentity || dim.recommendedPremise}
            </div>
            <div className="space-y-1.5 text-xs text-slate-600">
              {dim.points.map((pt, pIdx) => (
                <div key={pIdx} className="flex items-start gap-1.5">
                  <span className="text-[#1D6C5E] font-bold">·</span>
                  <span><strong>{pt.title}</strong> {pt.content}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 3条合规避坑指南 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        {pitfallGuides.map((item, idx) => (
          <div key={idx} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
            <div className="font-semibold text-slate-900 mb-1">{item.title}</div>
            <p className="text-slate-500 text-[11px] leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
```
