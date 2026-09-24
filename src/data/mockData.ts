/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SurveyData, RegistrationPlan, ChatMessage, RegistrationDetails, TimelineNode, OptionalAddonService } from '../types';

export const INITIAL_SURVEY_DATA: SurveyData = {
  coreNeeds: ['需公司主体', '需对公收款', '需开票'],
  companyDesc: '拟设立一家有限责任公司，主营跨境电商与海外品牌出海，团队5人，主要面向欧美与东南亚市场。',
  bizDesc: '从国内优质产业带采购家居数码生活品类，通过自建独立站与第三方跨境平台销售给海外消费者，需跨境结汇及报关。',
  scope: [
    '互联网销售（除销售需要许可的商品）',
    '货物进出口',
    '技术进出口',
    '供应链管理服务',
    '国内贸易代理',
    '国际货物运输代理',
    '信息技术咨询服务'
  ],
  license: [
    '海关进出口收发货人备案',
    '对外贸易经营者备案登记',
    '增值电信业务经营许可证（ICP备案）'
  ],
  sensitive: ['进出口'],
  invoiceReq: '增值税普通发票',
  monthlyAmount: '10 - 50 万',
  revenue: ['货物销售', '服务费'],
  revenueOther: '',
  shareholderType: ['自然人'],
  shareholderCount: '2 个',
  capitalRec: '是',
  capitalAmount: '100 万元人民币',
  regAddress: '是（需推荐）',
  officeSpace: '否'
};

export const AI_INDUSTRY_TEMPLATES = [
  {
    id: 'crossBorder',
    keys: ['跨境', '电商', '进出口', '外贸', '海外', '出口', '独立站', '亚马逊', 'shopee', 'lazada', '国际', '出海'],
    name: '跨境电商与出海贸易',
    companyType: '有限责任公司（自然人投资或控股）',
    suggestedCapital: '100 万元人民币（建议认缴5年内分期实缴）',
    taxType: '增值税小规模纳税人（年销售额500万以内享税收优惠，后续达标平滑升级一般纳税人）',
    taxReason: '初创阶段单月开票平稳，小规模纳税人可充分享受月度10万或季度30万以内免征增值税优惠政策。',
    scope: [
      '互联网销售（除销售需要许可的商品）',
      '货物进出口',
      '技术进出口',
      '供应链管理服务',
      '国内贸易代理',
      '国际货物运输代理',
      '信息技术咨询服务',
      '广告设计、代理'
    ],
    license: [
      '海关进出口收发货人备案（多证合一）',
      '对外贸易经营者备案',
      '外汇管理局名录登记与跨境结汇账户开立',
      'ICP/EDI电信业务备案'
    ],
    sensitive: ['进出口'],
    riskTips: [
      '跨境电商涉及跨境结汇合规，银行基本户开立后需及时向外汇局办理“贸易外汇收支企业名录”登记。',
      '新《公司法》实施后，认缴注册资本需在成立之日起5年内实缴完毕，建议资金规模不宜虚高，100万元适中稳健。',
      '商品如涉及食品、美妆等品类需前置/后置食品经营许可或化妆品经营备案。'
    ]
  },
  {
    id: 'tech',
    keys: ['软件', '技术', '开发', 'saas', 'it', '互联网', '平台', '系统', '科技', '信息', '数据', '数字化', '小程序', 'app', '人工智能', 'ai'],
    name: '软件和信息技术服务',
    companyType: '科技型有限责任公司',
    suggestedCapital: '100 万元人民币',
    taxType: '按开票需求评估：若直接面向大中型政企客户需开6%专票建议直接一般纳税人，否则首选小规模纳税人',
    taxReason: '科技类研发前期投入高、研发费用加计扣除政策利好，根据合同付款方要求决定纳税人身份。',
    scope: [
      '软件开发',
      '信息技术咨询服务',
      '技术服务、技术开发、技术咨询、技术交流、技术转让、技术推广',
      '计算机系统服务',
      '数据处理和存储支持服务',
      '人工智能应用软件开发',
      '网络与信息安全软件开发'
    ],
    license: [
      '国家增值电信业务经营许可证（ICP/EDI许可证）',
      '公安部网络安全等级保护（等保二级/三级）',
      '软件著作权登记（软著）'
    ],
    sensitive: ['网络文化/ICP'],
    riskTips: [
      '若提供在线付费订阅或撮合交易，需在设立后尽快申请ICP/EDI电信牌照。',
      '核心技术骨干持股建议设立持股平台（有限合伙企业）以稳定控制权并便于后续融资。'
    ]
  },
  {
    id: 'food',
    keys: ['餐饮', '食品', '饮食', '餐厅', '外卖', '烘焙', '咖啡', '茶饮', '生鲜'],
    name: '餐饮管理与食品经营',
    companyType: '有限责任公司',
    suggestedCapital: '50 万元人民币',
    taxType: '增值税小规模纳税人',
    taxReason: '餐饮终端消费者开票多为普票，小规模纳税人增值税征收率低，税负更轻。',
    scope: [
      '餐饮管理',
      '食品销售（仅销售预包装食品）',
      '外卖递送服务',
      '餐饮服务',
      '日用品销售',
      '企业管理咨询'
    ],
    license: [
      '食品经营许可证（后置许可，需场地现场核查）',
      '从业人员健康证',
      '生态环境部门排水排污备案',
      '消防安全检查合格意见书'
    ],
    sensitive: ['食品/餐饮'],
    riskTips: [
      '餐饮场地必须具备商业或餐饮用途产权证明，严禁在居民住宅楼内开设产生油烟餐饮。',
      '先办营业执照，再申请食品经营许可证并接受现场踏勘方可正式对外营业。'
    ]
  },
  {
    id: 'media',
    keys: ['文化', '传媒', '直播', '广告', '影视', '自媒体', 'mcn', '短视频', '内容', '演艺'],
    name: '文化传媒与数字创意',
    companyType: '文化传媒有限责任公司',
    suggestedCapital: '100 万元人民币',
    taxType: '小规模纳税人（后期根据签约平台结算规模可随时申请升为一般纳税人）',
    taxReason: '初期签约主播与品牌商赞助阶段流水多变，小规模纳税人管理成本低、报税简便。',
    scope: [
      '组织文化艺术交流活动',
      '广告设计、代理、发布',
      '企业形象策划',
      '摄影扩印服务',
      '数字内容制作服务（不含出版发行）',
      '文化娱乐经纪人服务',
      '互联网销售（除销售需要许可的商品）'
    ],
    license: [
      '广播电视节目制作经营许可证',
      '网络文化经营许可证（文网文）',
      '演出经纪机构设立审批（如涉及艺人/主播经纪）'
    ],
    sensitive: ['直播/MCN', '网络文化/ICP'],
    riskTips: [
      '涉及带货直播的，应在营业执照经营范围中务必体现互联网销售，并在开播前完成各平台企业号实名报备。',
      '如涉及艺人签约抽成，需注意演出经纪资质，避免无资质违规经营风险。'
    ]
  },
  {
    id: 'consulting',
    keys: ['咨询', '服务', '管理', '人力', '猎头', '财务', '财税', '代理', '法务'],
    name: '商务咨询与企业服务',
    companyType: '咨询服务有限责任公司',
    suggestedCapital: '50 万元人民币',
    taxType: '增值税小规模纳税人',
    taxReason: '咨询类进项发票较少，小规模纳税人可享受3%征收率按1%计征的普惠减税优惠。',
    scope: [
      '企业管理咨询',
      '信息咨询服务（不含许可类信息咨询服务）',
      '社会经济咨询服务',
      '市场营销策划',
      '会议及展览服务',
      '财务咨询（不含代理记账）'
    ],
    license: [
      '代理记账许可证（仅在涉及代理记账业务时需申请）',
      '人力资源服务许可证（仅涉及劳务中介/人才猎头时需申请）'
    ],
    sensitive: ['人力/劳务'],
    riskTips: [
      '咨询行业人员流动灵活，建议设立之初即规范劳动合同与知识产权保密协议。',
      '注意“代理记账”与“财务咨询”界限，未获财政部门代理记账许可证前不得对外提供代理记账服务。'
    ]
  }
];

export const DEFAULT_AI_TEMPLATE = AI_INDUSTRY_TEMPLATES[0];

export const ALL_ADDON_IDS = ['addon-bank', 'addon-tax', 'addon-social', 'addon-zero-tax'];

export const OPTIONAL_ADDON_SERVICES: OptionalAddonService[] = [
  {
    id: 'addon-bank',
    name: '银行对公账户开通',
    desc: '合作商业银行免排队专属绿色通道，专人对接协助开立企业基本户、办理企业网银U盾及结算权限',
    price: 200,
    originalPrice: 400,
    unit: '次',
    defaultSelected: false
  },
  {
    id: 'addon-tax',
    name: '电子税务局开户',
    desc: '国家税务总局新电局税种核定、财务负责人实名绑定、数电发票开票额度核定及首月开业建账辅导',
    price: 100,
    originalPrice: 300,
    unit: '次',
    defaultSelected: false
  },
  {
    id: 'addon-social',
    name: '办理社保公积金开户',
    desc: '办理企业社保局独立单位专户开户、住房公积金管理中心单位缴存登记开户设立，开具官方设立凭据',
    price: 100,
    originalPrice: 300,
    unit: '次',
    defaultSelected: false
  },
  {
    id: 'addon-zero-tax',
    name: '企业零申报服务（全年12个月）',
    desc: '专人按期代办月度/季度增值税及附加税、企业所得税零申报，出具官方申报凭据，含年度所得税汇算清缴与年报指导',
    price: 600,
    originalPrice: 1200,
    unit: '年',
    defaultSelected: false
  }
];

export function generatePlanFromSurvey(
  survey: SurveyData,
  tier: 'standard' | 'bundle_small' | 'bundle_general' | 'bundle' = 'bundle_small',
  taxpayerTier: 'small' | 'general' = 'small',
  userSelectedAddons?: string[]
): RegistrationPlan {
  // Find matching template
  const text = `${survey.companyDesc} ${survey.bizDesc}`.toLowerCase();
  let matched = AI_INDUSTRY_TEMPLATES[0];
  let maxScore = 0;

  AI_INDUSTRY_TEMPLATES.forEach(tpl => {
    let score = 0;
    tpl.keys.forEach(k => {
      if (text.includes(k.toLowerCase())) score += 1;
    });
    if (score > maxScore) {
      maxScore = score;
      matched = tpl;
    }
  });

  const normalizedTier: 'standard' | 'bundle_small' | 'bundle_general' =
    tier === 'standard'
      ? 'standard'
      : tier === 'bundle_general'
      ? 'bundle_general'
      : tier === 'bundle' && taxpayerTier === 'general'
      ? 'bundle_general'
      : 'bundle_small';

  const isGeneral = normalizedTier === 'bundle_general';
  const isBundle = normalizedTier !== 'standard';
  const autoTaxpayerTier: 'small' | 'general' = isGeneral ? 'general' : 'small';

  // 全年无忧服务：银行开户、税局开户、社保公积金开户及社保公积金服务已全部作为必选/默认服务内置于套餐内
  const activeAddons: string[] = normalizedTier === 'standard'
    ? (userSelectedAddons || [])
    : [];

  let items = [];
  let tierName = '';
  let deliverables: string[] = [];

  if (normalizedTier === 'standard') {
    tierName = '企业注册服务';
    items = [
      {
        id: 'item-std-gov',
        name: '全程政务网申代办及营业执照正副本',
        desc: '字号自主申报核准、新《公司法》章程规范备案、政务网申材料编制送审、全程代办并领办纸质营业执照正副本原件',
        price: 600,
        originalPrice: 800,
        tag: '政务代办'
      },
      {
        id: 'item-std-seal',
        name: '公安备案防伪芯片印章全套（5枚）',
        desc: '企业法定名称公章、财务专用章、法定代表人名章、发票专用章、合同专用章（含公安特行备案芯片防伪印鉴系统登记）',
        price: 0,
        originalPrice: 600,
        isFree: true,
        tag: '免除'
      },
      {
        id: 'item-std-fee',
        name: '现行市监登记规费与电子营业执照',
        desc: '国家减负惠企政策：免收工商设立行政登记规费，同步领办国家数字签名电子营业执照',
        price: 0,
        originalPrice: 300,
        isFree: true,
        tag: '免除'
      }
    ];

    deliverables = [
      '营业执照正副本（纸质原件 + 电子营业执照）',
      '公安备案防伪芯片印章5枚（公章、财务章、发票章、合同章、法人章）',
      '公司章程及股东会决议书（工商归档备案全套版）'
    ];
  } else if (normalizedTier === 'bundle_small') {
    tierName = '全年无忧服务（小规模）';
    items = [
      {
        id: 'item-bnd-gov',
        name: '全程政务网申代办及营业执照正副本【含企业注册套餐】',
        desc: '包含【企业注册服务】：字号申报、新《公司法》章程规范备案、政务网申材料编制送审、领办纸质营业执照正副本原件',
        price: 0,
        originalPrice: 800,
        isFree: true,
        tag: '免除'
      },
      {
        id: 'item-bnd-seal',
        name: '公安备案防伪芯片印章全套（5枚）【含企业注册套餐】',
        desc: '包含【企业注册服务】：公章、财务专用章、法人名章、发票专用章、合同专用章（含公安特行防伪芯片系统备案）',
        price: 0,
        originalPrice: 600,
        isFree: true,
        tag: '免除'
      },
      {
        id: 'item-bnd-fee',
        name: '现行市监登记规费与电子营业执照',
        desc: '国家行政审批登记规费全免，同步开通国家电子营业执照系统',
        price: 0,
        originalPrice: 300,
        isFree: true,
        tag: '免除'
      },
      {
        id: 'item-bnd-bank',
        name: '银行对公账户开通',
        desc: '合作商业银行免排队专属绿色通道，专人对接协助开立企业基本户、办理企业网银U盾及结算权限',
        price: 0,
        originalPrice: 400,
        isFree: true,
        tag: '免除'
      },
      {
        id: 'item-bnd-tax',
        name: '电子税务局开户',
        desc: '国家税务总局新电局税种核定、财务负责人实名绑定、数电发票开票额度核定及首月开业建账辅导',
        price: 0,
        originalPrice: 300,
        isFree: true,
        tag: '免除'
      },
      {
        id: 'item-bnd-social-setup',
        name: '办理社保公积金开户',
        desc: '办理企业社保局独立单位专户开户、住房公积金管理中心单位缴存登记开户设立，开具官方设立凭据',
        price: 0,
        originalPrice: 300,
        isFree: true,
        tag: '免除'
      },
      {
        id: 'item-bnd-social-service',
        name: '社保公积金服务',
        desc: '社保公积金系统企业专属专户全年合规状态维护与基数核定指导（注：本项不含员工增减员及代缴申报）',
        price: 0,
        originalPrice: 200,
        isFree: true,
        tag: '免除'
      },
      {
        id: 'item-bnd-account',
        name: '全年财务代记账服务（小规模纳税人 12个月）',
        desc: '资深注册会计师1对1负责：每月原始凭证审核、记账凭证装订、编制资产负债表与利润表、按期纳税申报（增值税、附加税、所得税、个税）及年度汇算清缴',
        price: 2500,
        originalPrice: 3600,
        tag: '小规模记账托管 ¥2,500'
      }
    ];

    deliverables = [
      '营业执照正副本（纸质原件 + 电子营业执照）【包含企业注册套餐】',
      '公安备案防伪芯片印章5枚（公章、财务章、发票章、合同章、法人章）【包含企业注册套餐】',
      '公司章程及股东会决议书（工商归档备案全套版）【包含企业注册套餐】',
      '银行基本户开户信息表与网银U盾',
      '电子税务局企业身份开通与新电局实名绑定凭据',
      '企业社保与住房公积金独立单位专户设立凭据',
      '全年小规模财务代记账服务协议与12期财务凭证账簿及纳税申报表'
    ];
  } else {
    tierName = '全年无忧服务（一般纳税人）';
    items = [
      {
        id: 'item-bnd-gov',
        name: '全程政务网申代办及营业执照正副本【含企业注册套餐】',
        desc: '包含【企业注册服务】：字号申报、新《公司法》章程规范备案、政务网申材料编制送审、领办纸质营业执照正副本原件',
        price: 0,
        originalPrice: 800,
        isFree: true,
        tag: '免除'
      },
      {
        id: 'item-bnd-seal',
        name: '公安备案防伪芯片印章全套（5枚）【含企业注册套餐】',
        desc: '包含【企业注册服务】：公章、财务专用章、法人名章、发票专用章、合同专用章（含公安特行防伪芯片系统备案）',
        price: 0,
        originalPrice: 600,
        isFree: true,
        tag: '免除'
      },
      {
        id: 'item-bnd-fee',
        name: '现行市监登记规费与电子营业执照',
        desc: '国家行政审批登记规费全免，同步开通国家电子营业执照系统',
        price: 0,
        originalPrice: 300,
        isFree: true,
        tag: '免除'
      },
      {
        id: 'item-bnd-bank',
        name: '银行对公账户开通',
        desc: '合作商业银行免排队专属绿色通道，专人对接协助开立企业基本户、办理企业网银U盾及结算权限',
        price: 0,
        originalPrice: 400,
        isFree: true,
        tag: '免除'
      },
      {
        id: 'item-bnd-tax',
        name: '电子税务局开户',
        desc: '国家税务总局新电局税种核定、财务负责人实名绑定、数电发票开票额度核定及首月开业建账辅导',
        price: 0,
        originalPrice: 300,
        isFree: true,
        tag: '免除'
      },
      {
        id: 'item-bnd-social-setup',
        name: '办理社保公积金开户',
        desc: '办理企业社保局独立单位专户开户、住房公积金管理中心单位缴存登记开户设立，开具官方设立凭据',
        price: 0,
        originalPrice: 300,
        isFree: true,
        tag: '免除'
      },
      {
        id: 'item-bnd-social-service',
        name: '社保公积金服务',
        desc: '社保公积金系统企业专属专户全年合规状态维护与基数核定指导（注：本项不含员工增减员及代缴申报）',
        price: 0,
        originalPrice: 200,
        isFree: true,
        tag: '免除'
      },
      {
        id: 'item-bnd-account',
        name: '全年财务代记账服务（一般纳税人 12个月）',
        desc: '资深注册会计师1对1负责：每月增值税专用发票进项认证勾选抵扣、原始凭证审核、记账凭证装订、编制财务报表、纳税申报及年度汇算清缴',
        price: 3000,
        originalPrice: 4600,
        tag: '一般人记账托管 ¥3,000'
      }
    ];

    deliverables = [
      '营业执照正副本（纸质原件 + 电子营业执照）【包含企业注册套餐】',
      '公安备案防伪芯片印章5枚（公章、财务章、发票章、合同章、法人章）【包含企业注册套餐】',
      '公司章程及股东会决议书（工商归档备案全套版）【包含企业注册套餐】',
      '银行基本户开户信息表与网银U盾',
      '电子税务局企业身份开通与新电局实名绑定凭据',
      '企业社保与住房公积金独立单位专户设立凭据',
      '全年一般纳税人财务代记账服务协议与12期财务账簿及专票申报底稿'
    ];
  }

  // 自选增值服务：仅在企业注册服务中提供可选加购（银行开户、税局开户、社保公积金开户、零申报服务）
  if (normalizedTier === 'standard') {
    if (activeAddons.includes('addon-bank')) {
      items.push({
        id: 'addon-bank',
        name: '银行对公账户开通',
        desc: '合作商业银行免排队专属绿色通道，专人对接协助开立企业基本户、办理企业网银U盾及结算权限',
        price: 200,
        originalPrice: 400,
        tag: '自选增值 ¥200/次'
      });
    }

    if (activeAddons.includes('addon-tax')) {
      items.push({
        id: 'addon-tax',
        name: '电子税务局开户',
        desc: '国家税务总局新电局税种核定、财务负责人实名绑定、数电发票开票额度核定及首月开业建账辅导',
        price: 100,
        originalPrice: 300,
        tag: '自选增值 ¥100/次'
      });
    }

    if (activeAddons.includes('addon-social')) {
      items.push({
        id: 'addon-social',
        name: '办理社保公积金开户',
        desc: '办理企业社保局独立单位专户开户、住房公积金管理中心单位缴存登记开户设立，开具官方设立凭据',
        price: 100,
        originalPrice: 300,
        tag: '自选增值 ¥100/次'
      });
    }

    if (activeAddons.includes('addon-zero-tax')) {
      items.push({
        id: 'addon-zero-tax',
        name: '企业零申报服务（全年12个月）',
        desc: '专人按期代办月度/季度增值税及附加税、企业所得税零申报，出具官方申报凭据，含年度所得税汇算清缴与年报指导',
        price: 600,
        originalPrice: 1200,
        tag: '自选增值 ¥600/年'
      });
      deliverables.push('全年企业税务零申报代办服务协议与各期申报回执凭据');
    }
  }

  const totalOriginal = items.reduce((sum, it) => sum + it.originalPrice, 0);
  
  // 费用计算：全年无忧服务一口价全包（小规模2500，一般纳税人3000），关闭自选服务不减价；企业注册服务基准600元加单项自选费
  let finalPrice = 0;
  if (normalizedTier === 'standard') {
    finalPrice = items.reduce((sum, it) => sum + it.price, 0);
  } else if (normalizedTier === 'bundle_small') {
    finalPrice = 2500;
  } else {
    finalPrice = 3000;
  }
  const totalDiscount = Math.max(0, totalOriginal - finalPrice);

  // 智能识别股东架构与入股特征
  const hasCorporate = survey.shareholderType?.some(t => t.includes('公司') || t.includes('法人'));
  const hasForeign = survey.shareholderType?.some(t => t.includes('境外') || t.includes('外资'));
  const isMulti = survey.shareholderCount === '2 个' || survey.shareholderCount === '3 个及以上';
  
  let dynamicCompanyType = matched.companyType;
  if (hasCorporate) {
    dynamicCompanyType = '多元有限责任公司（含法人/机构股东入股）';
  } else if (hasForeign) {
    dynamicCompanyType = '有限责任公司（涉外资参股）';
  } else if (isMulti) {
    dynamicCompanyType = '多元有限责任公司（自然人合伙设立）';
  } else if (survey.shareholderCount === '1 个') {
    dynamicCompanyType = '自然人独资有限责任公司';
  }

  const hasOwnAddr = survey.regAddress.includes('否');
  const dynamicRiskTips = [...matched.riskTips];
  if (hasCorporate) {
    dynamicRiskTips.unshift('对方作为法人股东入股，须提供母公司营业执照副本复印件（加盖公章）、法定代表人身份证及股东会决议；建议提前在章程中约定表决权比例，规避50:50股权僵局。');
  } else if (isMulti) {
    dynamicRiskTips.unshift('合伙设立有限责任公司，建议合理配置股权表决权比例（如67%绝对控制或51%相对控制），明确分红与退出机制，防范决策分歧风险。');
  }

  if (hasOwnAddr) {
    dynamicRiskTips.push('自有/租赁办公场地必须符合商事登记规划用途（商业/办公/厂房，住宅依法不得注册），备齐《不动产权证书》复印件与租赁协议，配合银行客户经理上门实地尽调拍照。');
  }

  return {
    selectedTier: normalizedTier,
    taxpayerTier: autoTaxpayerTier,
    tierName,
    companyNameProposal: survey.companyDesc.slice(0, 12) + '…（建议科技/贸易/实业组织字号）',
    companyType: dynamicCompanyType,
    taxpayerIdentity: autoTaxpayerTier === 'general' 
      ? '增值税一般纳税人（满足客户大额专票开具与全额进项税抵扣）' 
      : '增值税小规模纳税人（享受月度10万或季度30万以内免征增值税优惠）',
    taxReason: autoTaxpayerTier === 'general'
      ? '由于涉及专票开具或预计年销售额较高，选择一般纳税人便于下游合作企业进项抵扣与招投标。'
      : '初创阶段轻资产运营，小规模纳税人申报简便、充分享受国家普惠性减税降费优惠政策。',
    capitalAmount: survey.capitalRec === '否' ? survey.capitalAmount : '建议 100 万元人民币',
    capitalAdvice: '遵循新《公司法》注册资本5年内实缴规则，出资方式可选择货币、知识产权或实物，建议股东制定分期缴资计划。',
    registeredAddressAdvice: hasOwnAddr
      ? '使用自有或租赁实体商用场地登记，需备齐商业或办公用途《不动产权证书》及租赁合同，规范悬挂招牌并配合银行与市监上门实地尽调。'
      : '我们已为您匹配享受园区政策的合规商务秘书集群托管地址，保障工商税务专递信函通达，协同配合银行上门开户。',
    preQualifications: survey.sensitive.includes('进出口')
      ? ['海关进出口收发货人登记', '外汇管理局名录申报']
      : ['名称自主申报核准'],
    postQualifications: survey.license.length > 0 ? survey.license : matched.license,
    riskTips: dynamicRiskTips,
    items,
    selectedAddons: activeAddons,
    totalOriginal,
    totalDiscount,
    finalPrice,
    estimatedWorkdays: 3,
    deliverables
  };
}

export const INITIAL_REGISTRATION_DETAILS: RegistrationDetails = {
  primaryName: '云帆盛景出海跨境科技（深圳）有限公司',
  backupName1: '智航跨境数字供应链（深圳）有限公司',
  backupName2: '帆扬互联电子商务（深圳）有限公司',
  industryCategory: '互联网销售 / 软件和信息技术服务业',
  registeredCapital: '100 万元人民币',
  legalRepresentative: {
    name: '林楚天',
    idCard: '440301199308123418',
    phone: '13800138000',
    email: 'chutian.lin@yunfancross.com'
  },
  supervisor: {
    name: '张宇哲',
    idCard: '440301199504092211',
    phone: '13911223344'
  },
  financeOfficer: {
    name: '陈美仪',
    idCard: '440301199102141527',
    phone: '13799887766'
  },
  shareholders: [
    {
      id: 'sh-1',
      name: '林楚天',
      idCard: '440301199308123418',
      phone: '13800138000',
      ratio: 70,
      capitalAmount: 70
    },
    {
      id: 'sh-2',
      name: '张宇哲',
      idCard: '440301199504092211',
      phone: '13911223344',
      ratio: 30,
      capitalAmount: 30
    }
  ],
  officeAddress: {
    region: '深圳市南山区粤海街道高新南四道18号创维半导体设计大厦西座8层',
    detail: '806室',
    propertyType: '商业办公 / 孵化基地',
    area: '120 ㎡'
  },
  docs: [
    {
      id: 'doc-1',
      name: '法定代表人身份证人像面及国徽面',
      type: '身份证明文件',
      required: true,
      status: 'uploaded',
      fileName: '林楚天_身份证正反面高清扫描件.pdf',
      fileSize: '1.8 MB',
      updatedAt: '今天 10:24'
    },
    {
      id: 'doc-2',
      name: '监事及股东身份证扫描件',
      type: '身份证明文件',
      required: true,
      status: 'uploaded',
      fileName: '张宇哲_股东身份证扫描件.pdf',
      fileSize: '1.4 MB',
      updatedAt: '今天 10:25'
    },
    {
      id: 'doc-3',
      name: '经营场所使用证明（房产证明/租赁合同）',
      type: '住所合规文件',
      required: true,
      status: 'uploaded',
      fileName: '南山高新区房屋租赁凭证_电子签章.pdf',
      fileSize: '3.2 MB',
      updatedAt: '今天 10:26'
    },
    {
      id: 'doc-4',
      name: '全体投资人签署的企业设立申请与公司章程',
      type: '工商法定文书',
      required: true,
      status: 'uploaded',
      fileName: '系统自动生成章程草案_已预审.pdf',
      fileSize: '890 KB',
      updatedAt: '今天 10:28'
    }
  ]
};

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: '企服系统助手',
    role: 'ai',
    roleTag: '7x24h 智能AI',
    avatar: '🤖',
    timestamp: '10:00',
    content: '🎉 恭喜您成功签约！系统已为您创建【云帆盛景企业设立专属交付服务群】。我们已指派资深企业顾问 Lisa、交付主管张经理及 7×24 小时智能 AI 助手全流程护航。'
  },
  {
    id: 'msg-2',
    sender: 'Lisa（资深企业顾问）',
    role: 'advisor',
    roleTag: '专属顾问',
    avatar: '👩‍💼',
    timestamp: '10:01',
    content: '林总您好！我是您的专属企业顾问 Lisa。接下来由我和交付团队为您办理公司设立。办理总周期预计为 3 个工作日，主要节点如下：\n1. 今天：核对公司字号与股东架构，线上上传证件资料。\n2. 明天：市监局自主核名并网申，推送股东全体人脸核验电子签名。\n3. 后天：领发执照与刻章备案，顺丰专递到您手中，并预约银行开户！'
  },
  {
    id: 'msg-3',
    sender: '张经理（交付团队主管）',
    role: 'delivery',
    roleTag: '交付专员',
    avatar: '👨‍💼',
    timestamp: '10:02',
    content: '林总好！交付通道已开通，请您点击群上方的「填写注册信息与上传资料」按钮，或者直接在群里发送文件。我们会在 30 分钟内完成第一轮合规预核验！'
  },
  {
    id: 'msg-4',
    sender: '企服系统助手',
    role: 'ai',
    roleTag: '7x24h 智能AI',
    avatar: '🤖',
    timestamp: '10:02',
    content: '💡 您可以随时向我提问：例如“需要股东都到现场吗？”、“新公司法实缴资本怎么算？”、“刻章需要哪些手续？”等，AI 助手将实时秒级解答。'
  }
];

export const INITIAL_TIMELINE_NODES: TimelineNode[] = [
  {
    id: 'tl-1',
    stepNumber: 1,
    title: '企业设立需求确认与方案定制',
    operator: '系统自动生成',
    dept: '智能系统',
    time: '2026-09-15 10:00',
    status: 'done',
    detail: '客户提交初步业务调研问卷，系统根据行业算法生成《定制设立方案与服务报价单》。'
  },
  {
    id: 'tl-2',
    stepNumber: 2,
    title: '服务协议确认与在线安全支付',
    operator: '客户 林楚天',
    dept: '结算中心',
    time: '2026-09-15 10:05',
    status: 'done',
    detail: '完成短信验证码安全核验与在线缴费，系统已自动开具电子付款凭证并指派专属顾问。'
  },
  {
    id: 'tl-3',
    stepNumber: 3,
    title: '建立专属服务群与办理节点告知',
    operator: '顾问 Lisa / 智能AI',
    dept: '客户服务部',
    time: '2026-09-15 10:06',
    status: 'done',
    detail: '已拉起企微专属交付保障群，明确申报步骤、资料清单及责任交付时效。'
  },
  {
    id: 'tl-4',
    stepNumber: 4,
    title: '详细注册信息申报与资料上传',
    operator: '客户 / 系统预审',
    dept: '登记中心',
    time: '2026-09-15 10:28',
    status: 'done',
    detail: '企业字号自主排查、法定代表人及股东身份核实完毕，证件扫描件及住所证明已上传。'
  },
  {
    id: 'tl-5',
    stepNumber: 5,
    title: '客服人员合规初审与订单资料转交',
    operator: '客服 Lisa',
    dept: '客户服务部',
    time: '2026-09-15 10:45',
    status: 'current',
    detail: '客服团队核对申报字号与身份证清晰度。资料齐全无误，已正式转交政务交付团队。'
  },
  {
    id: 'tl-6',
    stepNumber: 6,
    title: '市场监督管理局网申与股东电子签名',
    operator: '交付团队 张经理',
    dept: '政务交付部',
    time: '待办',
    status: 'waiting',
    detail: '政务平台提交立项，需全体股东及法定代表人完成移动端微信/支付宝小程序人脸活体电子签名。',
    requiresAction: true,
    actionName: '进行人脸电子签名'
  },
  {
    id: 'tl-7',
    stepNumber: 7,
    title: '市监局审核出件与营业执照核发',
    operator: '行政审批中心',
    dept: '市场监督管理局',
    time: '预计 1 工作日内',
    status: 'waiting',
    detail: '审批通过后，生成统一社会信用代码并打印营业执照正副本原件。'
  },
  {
    id: 'tl-8',
    stepNumber: 8,
    title: '公安局特行备案芯片防伪印章刻制',
    operator: '指定印章中心',
    dept: '公安局印章备案系统',
    time: '预计 1 工作日内',
    status: 'waiting',
    detail: '防伪公章、财务章、法人私章、发票章、合同章五枚全套芯片章刻制及备案卡发放。'
  },
  {
    id: 'tl-9',
    stepNumber: 9,
    title: '执照印章顺丰专递与银行开户预约',
    operator: '顺丰速运专员',
    dept: '物流交付部',
    time: '出照后当日寄发',
    status: 'waiting',
    detail: '加急顺丰特快寄送至客户指定收件地址，同步推送银行预约开户号及开业财税指南。'
  }
];
