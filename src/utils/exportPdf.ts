/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { RegistrationPlan, SurveyData, ServiceTierType } from '../types';

interface ExportPdfOptions {
  survey: SurveyData;
  plan: RegistrationPlan;
  selectedTier?: ServiceTierType;
  selectedAddons?: string[];
  companyName?: string;
  contactPhone?: string;
}

export async function exportProposalToPdf(options: ExportPdfOptions): Promise<void> {
  const { survey, plan, companyName, contactPhone } = options;

  const displayCompanyName = companyName || survey.companyDesc || '新创拟设企业';
  const reportNo = 'BB-EV-' + new Date().getFullYear() + String(new Date().getMonth() + 1).padStart(2, '0') + String(new Date().getDate()).padStart(2, '0') + '-' + Math.floor(1000 + Math.random() * 9000);
  const genDate = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });

  // 评估特征推导
  const hasCorporateShareholder = survey.shareholderType?.some(t => t.includes('公司') || t.includes('法人'));
  const hasForeignShareholder = survey.shareholderType?.some(t => t.includes('境外') || t.includes('外资'));
  const isMultiShareholder = survey.shareholderCount === '2 个' || survey.shareholderCount === '3 个及以上';
  const hasOwnAddress = survey.regAddress?.includes('否') || survey.officeSpace === '是';
  const isGeneralTaxpayer = plan.taxpayerTier === 'general';

  // 创建用于渲染的高保真 A4 正式评估公文节点
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '-99999px';
  container.style.left = '0';
  container.style.width = '794px'; // 96 DPI A4 标称宽度
  container.style.backgroundColor = '#FFFFFF';
  container.style.color = '#0F172A';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
  container.style.padding = '42px 48px';
  container.style.boxSizing = 'border-box';
  container.style.zIndex = '-999';

  // 正式评估报告模板（无任何费用、结账、购物车与价格信息，纯权威公文排版）
  container.innerHTML = `
    <!-- 头部品牌与标识 -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 12px; border-bottom: 2px solid #0F172A; margin-bottom: 20px;">
      <div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 18px; font-weight: 900; color: #1D6C5E; letter-spacing: 1px;">班步企服</span>
          <span style="font-size: 11px; color: #64748B; font-weight: 600; padding-left: 8px; border-left: 1.5px solid #CBD5E1;">企业商事设立与规划系统</span>
        </div>
        <div style="font-size: 9.5px; color: #94A3B8; margin-top: 3px; letter-spacing: 0.5px;">
          BANBU ENTERPRISE CONSULTING & REGISTRATION
        </div>
      </div>
      <div style="text-align: right; font-size: 10px; color: #64748B;">
        <span>方案编号：</span><span style="font-family: monospace; font-weight: 600; color: #0F172A;">${reportNo}</span>
      </div>
    </div>

    <!-- 报告主标题 -->
    <div style="text-align: center; margin-bottom: 22px;">
      <h1 style="font-size: 20px; font-weight: 900; color: #0F172A; margin: 0 0 6px 0; letter-spacing: 1px;">
        新创企业商事设立规划与财税合规评估报告
      </h1>
      <div style="font-size: 10.5px; color: #64748B;">
        依据新《中华人民共和国公司法》及国家市场监督管理总局商事制度改革规范评估出具
      </div>
    </div>

    <!-- 正式元数据核验表格 (Metadata Table) -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10.5px;">
      <tbody>
        <tr>
          <td style="width: 15%; padding: 6px 10px; background-color: #F8FAFC; border: 1px solid #CBD5E1; color: #475569; font-weight: 600;">报告编号</td>
          <td style="width: 35%; padding: 6px 10px; border: 1px solid #CBD5E1; color: #0F172A; font-weight: 700; font-family: monospace;">${reportNo}</td>
          <td style="width: 15%; padding: 6px 10px; background-color: #F8FAFC; border: 1px solid #CBD5E1; color: #475569; font-weight: 600;">评估基准日</td>
          <td style="width: 35%; padding: 6px 10px; border: 1px solid #CBD5E1; color: #0F172A; font-weight: 600;">${genDate}</td>
        </tr>
        <tr>
          <td style="padding: 6px 10px; background-color: #F8FAFC; border: 1px solid #CBD5E1; color: #475569; font-weight: 600;">拟设主体名称</td>
          <td style="padding: 6px 10px; border: 1px solid #CBD5E1; color: #0F172A; font-weight: 700;">${displayCompanyName}</td>
          <td style="padding: 6px 10px; background-color: #F8FAFC; border: 1px solid #CBD5E1; color: #475569; font-weight: 600;">所属行业分类</td>
          <td style="padding: 6px 10px; border: 1px solid #CBD5E1; color: #0F172A; font-weight: 600;">${survey.companyDesc || '现代科技与商贸服务业'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 10px; background-color: #F8FAFC; border: 1px solid #CBD5E1; color: #475569; font-weight: 600;">法定组织形式</td>
          <td style="padding: 6px 10px; border: 1px solid #CBD5E1; color: #0F172A; font-weight: 600;">${plan.companyType}</td>
          <td style="padding: 6px 10px; background-color: #F8FAFC; border: 1px solid #CBD5E1; color: #475569; font-weight: 600;">规划出资规模</td>
          <td style="padding: 6px 10px; border: 1px solid #CBD5E1; color: #0F172A; font-weight: 700;">${plan.capitalAmount}（5年认缴）</td>
        </tr>
      </tbody>
    </table>

    <!-- 第一部分：主体画像与设立建议 -->
    <div style="margin-bottom: 20px;">
      <div style="border-left: 3.5px solid #0F172A; padding-left: 8px; font-size: 12.5px; font-weight: 800; color: #0F172A; margin-bottom: 8px;">
        第一部分 · 设立核心要素梳理与落地指导意见
      </div>

      <!-- 核心要素与具体指导意见表格 -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 10px;">
        <thead>
          <tr style="background-color: #F1F5F9; color: #475569;">
            <th style="width: 18%; padding: 6px 8px; border: 1px solid #CBD5E1; font-weight: 700; text-align: left;">设立要素</th>
            <th style="width: 28%; padding: 6px 8px; border: 1px solid #CBD5E1; font-weight: 700; text-align: left;">拟定方案</th>
            <th style="width: 54%; padding: 6px 8px; border: 1px solid #CBD5E1; font-weight: 700; text-align: left;">具体建议与意见</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 7px 8px; border: 1px solid #E2E8F0; font-weight: 600; color: #0F172A;">股权架构设计</td>
            <td style="padding: 7px 8px; border: 1px solid #E2E8F0; color: #475569;">
              ${hasCorporateShareholder ? '法人/机构股东入股' : (isMultiShareholder ? `多人合伙（${survey.shareholderCount}）` : '100% 自然人独资控股')}
            </td>
            <td style="padding: 7px 8px; border: 1px solid #E2E8F0; color: #334155; line-height: 1.5;">
              ${hasCorporateShareholder 
                ? '备齐母公司出资决议与营业执照公章要件，章程中明确约定表决权机制，严防50:50等额持股僵局。' 
                : (isMultiShareholder 
                  ? '建议创始团队配置67%绝对控制权或51%相对控制权，章程中提前约定分红节奏、议事规则及股东退出机制。' 
                  : '自然人一人独资决策高效，但日常须规范建账，每年度出具审计财报，确保个人财产与公司财产严格独立。')}
            </td>
          </tr>
          <tr>
            <td style="padding: 7px 8px; border: 1px solid #E2E8F0; font-weight: 600; color: #0F172A;">资本认缴规划</td>
            <td style="padding: 7px 8px; border: 1px solid #E2E8F0; color: #475569;">${plan.capitalAmount}（契合5年期限）</td>
            <td style="padding: 7px 8px; border: 1px solid #E2E8F0; color: #334155; line-height: 1.5;">
              注册资本与实际业务规模相匹配，依新《公司法》第47条自成立起5年内缴足；出资款须由股东银行账户转入公司基本户并备注“投资款”，留存回单。
            </td>
          </tr>
          <tr>
            <td style="padding: 7px 8px; border: 1px solid #E2E8F0; font-weight: 600; color: #0F172A;">财税身份统筹</td>
            <td style="padding: 7px 8px; border: 1px solid #E2E8F0; color: #475569;">${isGeneralTaxpayer ? '增值税一般纳税人' : '增值税小规模纳税人'}</td>
            <td style="padding: 7px 8px; border: 1px solid #E2E8F0; color: #334155; line-height: 1.5;">
              ${isGeneralTaxpayer 
                ? '适用于大中型企业大额采购或专票结算需求，规范建账并专人跟进进项专票认证抵扣与月度纳税申报。' 
                : '初创期首选享月销10万/季销30万内免征增值税普惠政策，核算报税成本低；后续需要可随时申请转为一般纳税人。'}
            </td>
          </tr>
          <tr>
            <td style="padding: 7px 8px; border: 1px solid #E2E8F0; font-weight: 600; color: #0F172A;">经营住所规划</td>
            <td style="padding: 7px 8px; border: 1px solid #E2E8F0; color: #475569;">${hasOwnAddress ? '自有/租赁实体商用场地' : '合规商务秘书集群托管'}</td>
            <td style="padding: 7px 8px; border: 1px solid #E2E8F0; color: #334155; line-height: 1.5;">
              ${hasOwnAddress 
                ? '产权性质须为商业、办公或厂房，严禁住宅性质登记；挂牌并配备办公设施，以备银行尽调及市监抽查。' 
                : '大幅节省初创期实体场地租金押金，建立专人代收信函机制，保证政务信函通达有效，防范失联被列入异常名录。'}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 综述文本框 -->
      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 8px 12px; font-size: 10px; color: #334155; line-height: 1.6;">
        <strong>【商事设立指导意见】</strong>经商事设立规则系统审核，拟设主体<strong>《${displayCompanyName}》</strong>设立路径明确，股权结构明晰，出资规划符合新《公司法》第47条法定认缴期限约束，行业资质与经营范围表述规范。建议按照上述规划建议，依法依规推进政务设立核准流程。
      </div>
    </div>

    <!-- 第二部分：四大核心商事设立维度深度评估意见 -->
    <div style="margin-bottom: 20px;">
      <div style="border-left: 3.5px solid #0F172A; padding-left: 8px; font-size: 12.5px; font-weight: 800; color: #0F172A; margin-bottom: 10px;">
        第二部分 · 四大核心设立维度深度评估意见
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px;">
        <!-- 维度 1 -->
        <div style="border: 1px solid #CBD5E1; border-radius: 4px; padding: 8px 12px; background-color: #FFFFFF;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 11px; font-weight: 700; color: #0F172A;">一、组织形式与股权治理架构评估</span>
            <span style="font-size: 9.5px; color: #475569; background-color: #F1F5F9; padding: 1px 6px; border-radius: 2px;">
              法定类型：${plan.companyType}
            </span>
          </div>
          <div style="font-size: 10px; color: #475569; line-height: 1.55;">
            ${hasCorporateShareholder 
              ? '<strong>【治理重点】</strong>因包含法人/机构股东参股，申报设立时必须备齐母公司有效营业执照副本加盖公章、法定代表人有效证件及同意出资之《股东会决议》；务必于公司章程中明确约定股东会表决机制与重大会计事项议事规则，严禁出现50:50等额持股导致治理僵局。' 
              : isMultiShareholder 
              ? `<strong>【治理重点】</strong>拟设架构为自然人合伙（${survey.shareholderCount}），建议合理划分表决权比例（配置67%绝对控制权或51%相对控制权）；明确分红节奏与股东退出机制；依据新《公司法》，规模较小或股东人数较少的有限责任公司可不设董事会，设一名董事或者经理，并可设审计委员会行使监事会职权。` 
              : '<strong>【治理重点】</strong>自然人一人独资设立有限责任公司，股东对公司拥有绝对决策权与执行效率；需特别注意新《公司法》关于一人有限责任公司财产独立性的严格规定，日常经营必须建立规范会计账簿，每会计年度终了编制财务会计报告，确保个人财产与公司财产严格独立，防止连带清偿风险。'}
          </div>
        </div>

        <!-- 维度 2 -->
        <div style="border: 1px solid #CBD5E1; border-radius: 4px; padding: 8px 12px; background-color: #FFFFFF;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 11px; font-weight: 700; color: #0F172A;">二、注册资本与认缴出资规划评估</span>
            <span style="font-size: 9.5px; color: #B45309; background-color: #FEF3C7; padding: 1px 6px; border-radius: 2px; font-weight: 600;">
              新《公司法》第47条约束
            </span>
          </div>
          <div style="font-size: 10px; color: #475569; line-height: 1.55;">
            <strong>【出资规划】</strong>核定认缴资本额：<strong>${plan.capitalAmount}</strong>。自2024年7月1日起施行的新《公司法》第47条规定，全体股东认缴的出资额由股东按照公司章程的规定自公司成立之日起 <strong>五年内缴足</strong>。评估建议：初创企业注册资本不宜盲目虚高，应结合业务规模与5年现金流规划出资；股东出资务必通过个人银行账户转账至公司银行基本对公账户，转账用途备注“投资款”，并妥善归档银行电子回单与验资证明。
          </div>
        </div>

        <!-- 维度 3 -->
        <div style="border: 1px solid #CBD5E1; border-radius: 4px; padding: 8px 12px; background-color: #FFFFFF;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 11px; font-weight: 700; color: #0F172A;">三、财税身份与发票纳税统筹评估</span>
            <span style="font-size: 9.5px; color: #475569; background-color: #F1F5F9; padding: 1px 6px; border-radius: 2px;">
              纳税人定位：${isGeneralTaxpayer ? '一般纳税人' : '小规模纳税人'}
            </span>
          </div>
          <div style="font-size: 10px; color: #475569; line-height: 1.55;">
            ${isGeneralTaxpayer 
              ? '<strong>【财税统筹】</strong>评定适用【增值税一般纳税人】。适用于直接面向大中型政企客户、进出口贸易或下游客户强烈要求开具增值税专用发票的情形。增值税税率通常为6%或13%，其取得的合法合规进项专票可在电子税务局全额勾选抵扣；要求设立后按期完成建账核算，由专业会计师负责进项认证与纳税申报底稿归档。' 
              : '<strong>【财税统筹】</strong>评定首选【增值税小规模纳税人】。充分享受国家普惠性税收优惠：月度销售额10万元以下（或按季30万元以下）免征增值税；增值税征收率为1%或3%；核算报税简便。若后续年应税销售额超过500万元或因大客户招投标需要开具专票，可随时在电子税务局申请登记转为一般纳税人。'}
          </div>
        </div>

        <!-- 维度 4 -->
        <div style="border: 1px solid #CBD5E1; border-radius: 4px; padding: 8px 12px; background-color: #FFFFFF;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 11px; font-weight: 700; color: #0F172A;">四、经营场所与住所合规性评估</span>
            <span style="font-size: 9.5px; color: #475569; background-color: #F1F5F9; padding: 1px 6px; border-radius: 2px;">
              ${hasOwnAddress ? '实体场地登记' : '商务秘书集群托管'}
            </span>
          </div>
          <div style="font-size: 10px; color: #475569; line-height: 1.55;">
            ${hasOwnAddress 
              ? '<strong>【住所要件】</strong>采用自有或租赁实体商用办公场所登记。评估要求：不动产权证书规划用途必须为“商业”、“办公”或“工业厂房”，严禁住宅性质用房违规注册；场所门牌必须清晰悬挂企业名称水牌，配备实体办公桌椅，以备银行开户尽调专员及市场监管局“双随机、一公开”实地勘查拍照。' 
              : '<strong>【住所要件】</strong>采用产业园区合规“商务秘书集群托管地址”登记。评估优势：有效节约初创期实体租金与押金成本；由托管机构建立专人代收代转市监、税务及司法专递信函机制，确保住所“信函通达、联络有效”，彻底防范因住所失联被列入“国家企业信用经营异常名录”。'}
          </div>
        </div>
      </div>
    </div>

    <!-- 第三部分：行业准入资质与拟申报经营范围梳理 -->
    <div style="margin-bottom: 20px;">
      <div style="border-left: 3.5px solid #0F172A; padding-left: 8px; font-size: 12.5px; font-weight: 800; color: #0F172A; margin-bottom: 8px;">
        第三部分 · 拟申报经营范围与行业准入资质审查
      </div>

      <!-- 经营范围 -->
      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 8px 12px; font-size: 10px; margin-bottom: 8px; line-height: 1.6;">
        <div style="font-weight: 700; color: #0F172A; margin-bottom: 2px;">
          【营业执照拟申报经营范围（规范表述）】
        </div>
        <div style="color: #334155;">
          <strong>一般项目：</strong>${survey.scope.join('；')}。（除依法须经批准的项目外，凭营业执照依法自主开展经营活动）
        </div>
      </div>

      <!-- 资质要求与排查 -->
      <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
        <tbody>
          <tr>
            <td style="width: 22%; padding: 6px 10px; background-color: #F8FAFC; border: 1px solid #CBD5E1; color: #475569; font-weight: 600;">建议行业后置资质</td>
            <td style="padding: 6px 10px; border: 1px solid #CBD5E1; color: #0F172A;">
              ${plan.postQualifications?.length > 0 ? plan.postQualifications.join('、') : '无特殊前置行政许可，取得营业执照即可自主经营'}
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 10px; background-color: #F8FAFC; border: 1px solid #CBD5E1; color: #475569; font-weight: 600;">敏感词与禁限用语筛查</td>
            <td style="padding: 6px 10px; border: 1px solid #CBD5E1; color: #15803D; font-weight: 600;">
              已通过排查：未检出金融、证券、期货等国家严格准入或禁止性字样，符合国民经济行业分类登记标准
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 第四部分：初创期企业合规经营关键避坑指引 -->
    <div style="margin-bottom: 22px;">
      <div style="border-left: 3.5px solid #0F172A; padding-left: 8px; font-size: 12.5px; font-weight: 800; color: #0F172A; margin-bottom: 8px;">
        第四部分 · 初创期合规经营与避坑风险提示
      </div>

      <div style="border: 1px solid #E2E8F0; border-radius: 4px; padding: 8px 12px; background-color: #F8FAFC; font-size: 9.5px; color: #475569; line-height: 1.6;">
        <div style="margin-bottom: 3px;">
          <strong>1. 资金出资合规：</strong>股东认缴出资必须按照章程约定期限由股东本人账户划入公司对公账户，备注“投资款”，妥善留存电子回单及入账凭证，规避出资加速到期追责风险。
        </div>
        <div style="margin-bottom: 3px;">
          <strong>2. 公私账目严格分立：</strong>公司对公账户与个人微信、支付宝及个人私卡必须严格分立，严禁公私混同，杜绝将经营资金直接转入个人账户，避免股东丧失有限责任保护。
        </div>
        <div style="margin-bottom: 3px;">
          <strong>3. 依法按期纳税申报：</strong>公司成立取得执照后，即使未正式对外经营或当期无营业收入，亦必须按期由专业财务人员进行“零申报”，严禁长期逾期脱管导致税务非正常户。
        </div>
        <div>
          <strong>4. 国家企业信用年报：</strong>每年 1 月 1 日至 6 月 30 日期间，必须登录“国家企业信用信息公示系统”报送上一年度年报并向社会公示，严防因逾期被市监列入经营异常名录。
        </div>
      </div>
    </div>

    <!-- 报告声明与说明 -->
    <div style="border-top: 1.5px solid #E2E8F0; padding-top: 14px; margin-top: 20px;">
      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 12px 16px; font-size: 9.5px; color: #64748B; line-height: 1.65;">
        <div style="font-weight: 700; color: #334155; margin-bottom: 4px;">【报告说明与合规指引】</div>
        <div>1. 本报告由班步企服系统依据申报人填报的企业设立意向信息，并结合新《中华人民共和国公司法》及属地市场监督管理部门现行商事登记规范测算生成。</div>
        <div>2. 报告所列之股权架构建议、认缴出资规划、财税统筹定位及经营风险提示，旨在为企业筹建提供结构性参考与合规前置指引。</div>
        <div>3. 最终法定登记范围、企业名称自主申报核准及营业执照发证结果，以属地市场监督管理机关及主管税务机关政务审核为准。</div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; font-size: 9px; color: #94A3B8; padding: 0 4px;">
        <div>班步企服 · 一站式企业设立与合规服务平台</div>
        <div>生成日期：${genDate} · 系统编号：${reportNo}</div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    // 使用 html2canvas 转换为高清 Canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF',
      windowWidth: 794
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // 第一页
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // 多页自动切片（若公文略长自动分页）
    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    const cleanName = (displayCompanyName || '企业设立规划评估报告')
      .replace(/[\\/:*?"<>|]/g, '')
      .slice(0, 24);

    pdf.save(`新创企业商事设立规划评估报告_${cleanName}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
