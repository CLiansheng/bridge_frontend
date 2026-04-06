import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHistoryStore = defineStore('history', () => {
  const historyRecords = ref([])
  const isLoaded = ref(false) 

  function addHistoryRecord(record) {
    historyRecords.value.unshift(record)
    localStorage.setItem('spansHistoryRecords', JSON.stringify(historyRecords.value))
  }

  function loadHistoryRecords() {
    if (isLoaded.value) return; 

    const storedStr = localStorage.getItem('spansHistoryRecords')

    if (storedStr !== null) {
      try {
        historyRecords.value = JSON.parse(storedStr)
      } catch (e) {
        historyRecords.value = [] 
      }
    } else {
      const mockData = [
  // ==========================================
  // 情况 1：ZIP 批量传输
  // ==========================================
  {
    id: Date.now() - 3600000,
    taskName: '跨海大桥南段',
    detectionTime: new Date(Date.now() - 3600000).toLocaleString(),
    uploadType: 'ZIP 批量传输',
    defectCount: 7, 
    resultImages: [
      { 
        name: 'IMG_01.jpg', 
        url: '/example/history_zip/image1/page.jpg',
        maskUrl: '/example/history_zip/image1/mask.png',
        featureUrl: '/example/history_zip/image1/feature.png',
        reportData: {
          total_defect_count: 1, 
          overall_risk_level: '高危',
          class_count: { crack: 1 },
          risk_distribution: { high: 1, medium: 0, low: 0 },
          defects_detail: [
            { defect_id: 'D-101', type: 'crack', name: '裂缝', physical_length: 153, max_width: 2, severity: 'high' },
          ]
        },
        aiSummaryHtml: `
          <p class="t-line text-red"><span class="t-prefix">></span> [ 综合研判 ] 检出横向贯穿性结构受力裂缝，评估为抗弯承载体系严重受损（高危）。</p>
      <p class="t-line">  ├─ 核心特征: 目标区块内检出 1 处极其显著的横向主裂缝。其物理延展长度高达 153cm (1.53m)，局部最大张开宽度达 2cm，呈现出典型的“中段宽、两端细”受力撕裂形态。</p>
      <p class="t-line">  ├─ 深度推演: 结合 Feature Map 的连续高亮线性热力带分析，该裂缝具有极强的纵深贯穿特性。横向开裂已完全切断了表层混凝土的拉应力传导路径，深度极大概率已穿透受拉区主筋层，表明该截面的抗弯刚度已出现断崖式的临界衰减。</p>
      <p class="t-line">  └─ 劣化分析: 此级别宽度的横向受力裂缝是结构整体失稳的危险先兆。超限的缝宽已彻底破坏材料的防腐屏障，动水压力将裹挟氯离子直击核心受力骨架，若不紧急干预，极易因主筋锈断引发突发性的脆性破坏。</p>
      <br/>
      <p class="t-line"><strong class="text-cyan">[ 修复与全生命周期干预建议 ]</strong></p>
      <p class="t-line">  1. 应急管控: 结构局部面临极高的失效风险，建议立即触发 [ 一级红色结构预警 ]，对该桥跨实施重型车辆强制限行乃至全封闭管控，并迅速架设临时安全支撑体系。</p>
      <p class="t-line">  2. 深度探伤复核: 紧急调遣结构检测专班，采用超声波平测法精确探明裂缝绝对深度，并结合全桥沉降线型数据重新验算实际的抗弯承载能力极限状态 (ULS)。</p>
      <p class="t-line">  3. 恒压灌浆重塑: 针对 2cm 宽的深层贯穿裂缝，严禁表面敷衍涂抹。必须采用 V 型扩缝与高压注浆工艺，将低粘度、高韧性的改性环氧树脂强力压注至裂缝根底，恢复截面的物理完整性。</p>
      <p class="t-line">  4. 结构抗弯补强: 内部树脂固化验收后，必须在受拉区底部或侧面顺桥向多层粘贴高模量碳纤维复合板 (CFRP)，或增设体外预应力钢束，从根本上代偿损失的抗拉伸刚度。</p>
        `
      },
      { 
        name: 'IMG_02.jpg', 
        url: '/example/history_zip/image2/page.jpg',
        maskUrl: '/example/history_zip/image2/mask.png',
        featureUrl: '/example/history_zip/image2/feature.png',
        reportData: {
          total_defect_count: 1,
          overall_risk_level: '高危', 
          class_count: { 'exposed rebar': 1 },
          risk_distribution: { high: 1, medium: 0, low: 0 },
          defects_detail: [
            { defect_id: 'D-102', type: 'exposed rebar', name: '钢筋裸露', physical_length: 162, max_width: 35, severity: 'high' }
          ]
        },
        aiSummaryHtml: `
          <p class="t-line text-red"><span class="t-prefix">></span> [ 综合研判 ] 检出核心承重构件大面积保护层脱落与钢筋网裸露，评估为结构承载力极度危急（高危）。</p>
      <p class="t-line">  ├─ 核心特征: 目标区块提取到 1 处极其严重的结构性毁损，物理破坏界限达到惊人的 162x35cm。底部受力主筋与箍筋体系已完全丧失混凝土握裹层，呈大面积悬空裸露状态。</p>
      <p class="t-line">  ├─ 深度推演: 结合 Feature Map 全局高强度的弥散热力响应分析，该构件的有效受力截面已发生灾难性缩减。钢筋与基体间的锚固粘结应力彻底失效，原有的内力传导路径已被强制阻断，发生危险的二次内力重分布。</p>
      <p class="t-line">  └─ 劣化分析: 完全失去碱性钝化环境的钢筋骨架正处于极速电化学腐蚀期。在此等极其夸张的截面损失率下，构件极易在常规交变荷载或微小偏心扰动下发生脆性折断，进而诱发桥梁体系的连锁性坍塌。</p>
      <br/>
      <p class="t-line"><strong class="text-cyan">[ 修复与全生命周期干预建议 ]</strong></p>
      <p class="t-line">  1. 应急熔断响应: 结构濒临极限失效点，必须立即触发 [ 最高级别红色安全警报 ]。强制切断该区域相关联的交通荷载，并在 24 小时内紧急搭设满堂重型钢管支撑体系，强行接管并代偿失稳构件的残余荷载。</p>
      <p class="t-line">  2. 极限状态重估: 严禁盲目原位涂抹修补。必须由权威鉴定机构介入，通过超声波断层扫描探明内部暗裂深度，重构残存基体的 3D 真实受力模型，并出具专项抢险加固图纸。</p>
      <p class="t-line">  3. 截面置换重塑: 严格按力学复核结果，对严重锈蚀的主筋进行截面等效补偿（原位植筋或并筋焊接）。鉴于缺损体量巨大，必须重新支模，泵送浇筑微膨胀高强自密实聚合物混凝土，进行核心构件的彻底原位重构与力学复苏。</p>
        `
      },
      { 
        name: 'IMG_03.jpg', 
        url: '/example/history_zip/image3/page.jpg',
        maskUrl: '/example/history_zip/image3/mask.png',
        featureUrl: '/example/history_zip/image3/feature.png',
        reportData: {
          total_defect_count: 2, 
          overall_risk_level: '中危',
          class_count: { 'efflorescence': 2 },
          risk_distribution: { high: 0, medium: 2, low: 0 },
          defects_detail: [
            { defect_id: 'D-103', type: 'efflorescence', name: '泛碱', physical_length: 47, max_width: 12, severity: 'medium' },
            { defect_id: 'D-104', type: 'efflorescence', name: '泛碱', physical_length: 22, max_width: 7, severity: 'medium' },
          ]
        },
        aiSummaryHtml: `
          <p class="t-line text-orange"><span class="t-prefix">></span> [ 综合研判 ] 检出显著的纵向泛碱渗出带，评估为防水体系局部失效及基体碱性异常流失（中危）。</p>
      <p class="t-line">  ├─ 核心特征: 目标区块提取到 2 处明显的纵向白色结晶析出带，最大蔓延物理边界达 47x12cm，呈现出典型的沿微裂缝或毛细孔隙下泄的流体侵蚀路径。</p>
      <p class="t-line">  ├─ 深度推演: 结合 Feature Map 的纵向连贯热力特征，表明该区域存在活跃的水分运移通道。雨水长驱直入并溶解了内部水化产物（氢氧化钙），在毛细压作用下于表面析出并发生碳化结晶反应。</p>
      <p class="t-line">  └─ 劣化分析: 泛碱虽不产生即时力学衰减，却是混凝土持续丧失碱性的危险预兆。伴随内部游离钙的不断透支，微环境 pH 值将不可逆地跌破临界点，最终诱发深层钢筋的去钝化与全面锈胀。</p>
      <br/>
      <p class="t-line"><strong class="text-cyan">[ 修复与全生命周期干预建议 ]</strong></p>
      <p class="t-line">  1. 状态评级: 材料内部微环境已遭持续侵扰，建议提升至 [ 二级耐久性防治响应 ]，必须从源头切断病害的物理化学演化链条。</p>
      <p class="t-line">  2. 溯源截流: 治标须先治本。务必优先排查桥面径流排水分区、上方伸缩缝止水带及泄水管周边是否存在结构性或密封性渗漏，彻底切断补给水源。</p>
      <p class="t-line">  3. 盐害清创: 待渗流源头阻断且基面完全干燥后，采用柔性机械打磨结合环保型弱酸清洗剂，彻底剥离表面坚实结晶体，并用高压水洗净残留盐分。</p>
      <p class="t-line">  4. 靶向抗渗重构: 待清理区域达到干燥标准后，深度喷涂高渗透率的硅烷或硅氧烷类憎水剂，利用分子级成膜技术彻底锁死毛细吸水通道，重塑表层高阶抗渗防线。</p>
        `
      }
    ]
  },

  // ==========================================
  // 情况 2：多图组合上传
  // ==========================================
  {
    id: Date.now() - 86400000,
    taskName: '高架立交',
    detectionTime: new Date(Date.now() - 86400000).toLocaleString(),
    uploadType: '多图组合上传',
    defectCount: 7, 
    resultImages: [
      { 
        name: 'IMG_01.jpg', 
        url: '/example/history_many/image1/page.jpg',
        maskUrl: '/example/history_many/image1/mask.png',
        featureUrl: '/example/history_many/image1/feature.png',
        reportData: {
          total_defect_count: 1, 
          overall_risk_level: '高危',
          class_count: { 'exposed rebar': 1 },
          risk_distribution: { high: 1, medium: 0, low: 0 },
          defects_detail: [
            { defect_id: 'D-201', type: 'exposed rebar', name: '钢筋裸露', physical_length: 169, max_width: 83, severity: 'high' }
          ]
        },
        aiSummaryHtml: `
         <p class="t-line text-red"><span class="t-prefix">></span> [ 综合研判 ] 检出核心承重构件灾难性溃散，评估为抗压承载力极度丧失（极高危 / 临界坍塌）。</p>
      <p class="t-line">  ├─ 核心特征: 目标承重墩柱发生物理尺度达 169x83cm 的巨型爆炸性剥落。内部主筋与箍筋骨架完全外露，且多根受压主筋已发生明显的向外屈曲（Buckling）变形。</p>
      <p class="t-line">  ├─ 深度推演: 极端的空间缺损表明该构件已遭受典型的轴压/偏心受压脆性破坏。核心区混凝土大面积压碎并退出工作，原有轴向应力传导路径彻底切断，当前竖向荷载已完全由残存的塑性屈服钢筋及周边设置的临时钢支撑勉强维持。</p>
      <p class="t-line">  └─ 劣化分析: 构件自身的刚度与稳定性已彻底崩溃，系统处于极度脆弱的危态平衡。任何微小的附加活载、风振或临时支撑的轻微侧移，都将瞬间触发上部结构的断崖式整体坍塌。</p>
      <br/>
      <p class="t-line"><strong class="text-cyan">[ 抢险响应与结构置换建议 ]</strong></p>
      <p class="t-line">  1. 最高级别熔断: 立即上报重大结构险情，彻底封锁周边及下方的所有立体交通。严禁任何非抢险特种作业人员靠近，并指派专人 24 小时盯防现有的红色重型钢支撑体系，确保不发生失稳。</p>
      <p class="t-line">  2. 应力主动卸载: 紧急调派结构专家组制定卸载方案。严禁在受力状态下直接切割残损钢筋，必须通过增设千斤顶等主动顶升设备，
        `
      },
      { 
        name: 'IMG_02.jpg', 
        url: '/example/history_zip/image2/page.jpg',
        maskUrl: '/example/history_zip/image2/mask.png',
        featureUrl: '/example/history_zip/image2/feature.png',
        reportData: {
          total_defect_count: 4, 
          overall_risk_level: '低危',
          class_count: { spalling: 4 },
          risk_distribution: { high: 0, medium: 2, low: 2 },
          defects_detail: [
            { defect_id: 'D-202', type: 'spalling', name: '剥落', physical_length: 36, max_width: 29, severity: 'medium' },
            { defect_id: 'D-203', type: 'spalling', name: '剥落', physical_length: 24, max_width: 12, severity: 'medium' },
            { defect_id: 'D-204', type: 'spalling', name: '剥落', physical_length: 11, max_width: 5, severity: 'low' },
            { defect_id: 'D-205', type: 'spalling', name: '剥落', physical_length: 9, max_width: 6, severity: 'low' }
          ]
        },
        aiSummaryHtml: `
          <p class="t-line text-orange"><span class="t-prefix">></span> [ 综合研判 ] 检出群发性浅表混凝土剥落，评估为结构防腐屏障多点受损（中危）。</p>
      <p class="t-line">  ├─ 核心特征: 目标区块内高精度提取到 4 处呈散态分布的混凝土剥落区，最大单体几何界限约 36x29cm。病害呈现向四周游离扩展的趋势，伴随周边砂浆层的微观起壳。</p>
      <p class="t-line">  ├─ 深度推演: 结合 Feature Map 的多核独立热力响应分析，各剥落区底部粗骨料已部分显露。虽暂未直接波及深层受力钢筋网，但群发性的病害点阵预示着该区域的表层材料粘结性能正处于整体退化周期。</p>
      <p class="t-line">  └─ 劣化分析: 粗糙且凹陷的剥落面极易成为水分与侵蚀性介质（如 CO2、氯盐）的天然滞留温床，形成局部的微环境腐蚀效应。若不及时干预，相邻的散态剥落区将因边缘劣化而逐渐连片，最终导致底层骨架的大面积去钝化。</p>
      <br/>
      <p class="t-line"><strong class="text-cyan">[ 修复与全生命周期干预建议 ]</strong></p>
      <p class="t-line">  1. 状态评级: 保护层有效厚度已产生实质性的多点折减，建议提升至 [ 二级耐久性预警 ]，并优先将其纳入近期的表观专项修复计划。</p>
      <p class="t-line">  2. 界面拓扑清创: 严禁直接“打补丁”。必须采用机械凿除法，彻底清理各剥落坑内部及四周的酥散劣化层，将不规则的边缘人工修整为外扩的几何多边形（企口倒角），杜绝“零厚度”修补带来的二次脱落。</p>
      <p class="t-line">  3. 聚合物改性重塑: 充分润湿基面并满涂高粘结力界面剂，随后采用低收缩、抗下垂的聚合物改性修补砂浆进行分层填平压实，完美恢复构件的平整度与气密性。</p>
      <p class="t-line">  4. 区域防渗封嵌: 待修补区养护达标后，强烈建议对该群发病害的整个辐射区域喷施高渗透性硅烷防水涂料，彻底封闭微观水汽通道，重置该桥段的服役寿命时钟。</p>
        `
      },
      { 
        name: 'IMG_03.jpg', 
        url: '/example/history_zip/image2/page.jpg',
        maskUrl: '/example/history_zip/image2/mask.png',
        featureUrl: '/example/history_zip/image2/feature.png',
        reportData: {
          total_defect_count: 1, 
          overall_risk_level: '高危',
          class_count: { crack: 1 },
          risk_distribution: { high: 1, medium: 0, low: 0 },
          defects_detail: [
            { defect_id: 'D-206', type: 'crack', name: '裂缝', physical_length: 107, max_width: 2, severity: 'high' },
          ]
        },
        aiSummaryHtml: `
          <p class="t-line text-red"><span class="t-prefix">></span> [ 综合研判 ] 检出超限分支型结构受力裂缝，评估为局部承载体系重度受损（高危）。</p>
      <p class="t-line">  ├─ 核心特征: 目标区块内检出 1 处极其显著的分叉型结构主裂缝，主干物理延展长度达 107mm，最大张开宽度飙升至 2mm，呈现危险的“Y”字型多向撕裂形态。</p>
      <p class="t-line">  ├─ 深度推演: 结合 Feature Map 的连续高能线性热力带特征，该裂缝具备明显的深度贯穿属性。高达 2mm 的超限缝宽与分叉拓扑结构表明，该区域正承受极为复杂的拉剪复合应力，混凝土抗拉截面已实质性退出工作。</p>
      <p class="t-line">  └─ 劣化分析: 裂缝宽度远超常规《桥梁养护规范》的容许极限，彻底摧毁了基体的物理防护屏障。水汽及侵蚀性离子可无阻挡直击内部受力骨架，若遭遇动载疲劳冲击，极易诱发不可逆的脆性断裂破坏。</p>
      <br/>
      <p class="t-line"><strong class="text-cyan">[ 修复与全生命周期干预建议 ]</strong></p>
      <p class="t-line">  1. 应急熔断: 强烈建议立即对该构件辐射区域实施 [ 限制重荷载作业 ] 响应，并紧急架设高精度动态裂缝计，全天候捕捉其瞬态疲劳扩展速率。</p>
      <p class="t-line">  2. 深度层析探伤: 严禁盲目进行表面涂抹。必须由专业检测机构采用超声波无损探伤技术精确标定裂缝纵深，并重新进行有限元结构安全性复核。</p>
      <p class="t-line">  3. 恒压灌浆重塑: 必须采用壁可法（BICS）或低压恒速微孔注浆工艺，将超低粘度、高韧性的改性环氧树脂强力压注至裂缝根底，深度愈合基体裂隙，恢复结构整体刚度。</p>
      <p class="t-line">  4. 拓扑应力补强: 针对“Y”型应力集中的分叉危险区，内部树脂固化验收后，建议表面跨缝正交粘贴多层高模量碳纤维布（CFRP）进行抗拉拔强化，强行锁死裂缝的二次张开自由度。</p>
        `
      }
    ]
  }
];
    historyRecords.value = mockData;

    }
    
    isLoaded.value = true;
  }

  function deleteSelectedRecords(ids) {
    historyRecords.value = historyRecords.value.filter(record => !ids.includes(record.id))
    localStorage.setItem('spansHistoryRecords', JSON.stringify(historyRecords.value))
  }

  function updateTaskName(id, newName) {
    const record = historyRecords.value.find(record => record.id === id)
    if (record) {
      record.taskName = newName
      localStorage.setItem('spansHistoryRecords', JSON.stringify(historyRecords.value))
    }
  }

  return { historyRecords, isLoaded, addHistoryRecord, loadHistoryRecords, deleteSelectedRecords, updateTaskName }
})