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
          total_defect_count: 2, 
          overall_risk_level: '高危',
          class_count: { crack: 2 },
          risk_distribution: { high: 1, medium: 1, low: 0 },
          defects_detail: [
            { defect_id: 'D-101', type: 'crack', name: '裂缝', physical_length: 67, max_width: 11, severity: 'high' },
            { defect_id: 'D-102', type: 'crack', name: '裂缝', physical_length: 45, max_width: 43, severity: 'medium' }
          ]
        },
        aiSummaryHtml: `
          <p class="t-line text-red"><span class="t-prefix">></span> [ 综合研判 ] 检出严重结构性受力裂缝，整体评定为高危。</p>
          <p class="t-line">  ├─ 核心特征: 发现长达 67mm、最大宽度超限的主裂缝。</p>
          <p class="t-line">  └─ 劣化分析: 裂缝呈扩展趋势，可能已深达钢筋层，严重影响构件承载能力和整体刚度。</p>
          <br/>
          <p class="t-line"><span class="t-prefix">></span> <strong class="text-cyan">[ 修复与干预建议 ]</strong></p>
          <p class="t-line">  指令: 启动红色预警并限制重型车辆通行；立即开展专项力学验算，并准备实施体外预应力加固。</p>
        `
      },
      { 
        name: 'IMG_02.jpg', 
        url: '/example/history_zip/image2/page.jpg',
        maskUrl: '/example/history_zip/image2/mask.png',
        featureUrl: '/example/history_zip/image2/feature.png',
        reportData: {
          total_defect_count: 1,
          overall_risk_level: '中危', 
          class_count: { 'exposed rebar': 1 },
          risk_distribution: { high: 0, medium: 1, low: 0 },
          defects_detail: [
            { defect_id: 'D-103', type: 'exposed rebar', name: '钢筋裸露', physical_length: 45, max_width: 24, severity: 'medium' }
          ]
        },
        aiSummaryHtml: `
          <p class="t-line text-orange"><span class="t-prefix">></span> [ 综合研判 ] 检出中度保护层失效，整体评定为中危。</p>
          <p class="t-line">  ├─ 核心特征: 存在尺寸达 45x24mm 的保护层破损及钢筋外露。</p>
          <p class="t-line">  └─ 劣化分析: 主筋已直接暴露于外部环境，锈蚀风险急剧升高，但暂未造成明显截面损失。</p>
          <br/>
          <p class="t-line"><span class="t-prefix">></span> <strong class="text-cyan">[ 修复与干预建议 ]</strong></p>
          <p class="t-line">  指令: 须尽快对该区域进行人工除锈处理，涂刷阻锈底漆后，使用聚合物砂浆恢复保护层厚度。</p>
        `
      },
      { 
        name: 'IMG_03.jpg', 
        url: '/example/history_zip/image3/page.jpg',
        maskUrl: '/example/history_zip/image3/mask.png',
        featureUrl: '/example/history_zip/image3/feature.png',
        reportData: {
          total_defect_count: 4, 
          overall_risk_level: '低危',
          class_count: { 'exposed rebar': 4 },
          risk_distribution: { high: 0, medium: 0, low: 4 },
          defects_detail: [
            { defect_id: 'D-104', type: 'exposed rebar', name: '钢筋裸露', physical_length: 21, max_width: 3, severity: 'low' },
            { defect_id: 'D-105', type: 'exposed rebar', name: '钢筋裸露', physical_length: 29, max_width: 3, severity: 'low' },
            { defect_id: 'D-106', type: 'exposed rebar', name: '钢筋裸露', physical_length: 25, max_width: 3, severity: 'low' },
            { defect_id: 'D-107', type: 'exposed rebar', name: '钢筋裸露', physical_length: 26, max_width: 2, severity: 'low' }
          ]
        },
        aiSummaryHtml: `
          <p class="t-line text-green"><span class="t-prefix">></span> [ 综合研判 ] 检出轻微点状病害，整体评定为低危。</p>
          <p class="t-line">  ├─ 核心特征: 发现多处细小的钢筋裸露现象，单处最大尺寸不超过 29x3mm。</p>
          <p class="t-line">  └─ 劣化分析: 属于表皮局部施工缺陷或轻度风化，当前状态安全可控。</p>
          <br/>
          <p class="t-line"><span class="t-prefix">></span> <strong class="text-cyan">[ 修复与干预建议 ]</strong></p>
          <p class="t-line">  指令: 无需紧急施工。建议列入常规表面养护流程中，统一进行打磨涂漆即可。</p>
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
          class_count: { crack: 1 },
          risk_distribution: { high: 1, medium: 0, low: 0 },
          defects_detail: [
            { defect_id: 'D-201', type: 'crack', name: '裂缝', physical_length: 83, max_width: 3, severity: 'high' }
          ]
        },
        aiSummaryHtml: `
          <p class="t-line text-red"><span class="t-prefix">></span> [ 综合研判 ] 检出核心承重构件深层裂缝，整体评定为高危。</p>
          <p class="t-line">  ├─ 核心特征: 桥墩主体存在长度 83mm 的结构受力裂缝。</p>
          <p class="t-line">  └─ 劣化分析: 直接位于传力路径上，预示着该构件可能已发生过载屈服。</p>
          <br/>
          <p class="t-line"><span class="t-prefix">></span> <strong class="text-cyan">[ 修复与干预建议 ]</strong></p>
          <p class="t-line">  指令: 须立即实施高压树脂注浆封闭，并增设碳纤维箍进行抗剪补强加固。</p>
        `
      },
      { 
        name: 'IMG_02.jpg', 
        url: '/example/history_zip/image2/page.jpg',
        maskUrl: '/example/history_zip/image2/mask.png',
        featureUrl: '/example/history_zip/image2/feature.png',
        reportData: {
          total_defect_count: 3, 
          overall_risk_level: '低危',
          class_count: { spalling: 3 },
          risk_distribution: { high: 0, medium: 0, low: 3 },
          defects_detail: [
            { defect_id: 'D-202', type: 'spalling', name: '剥落', physical_length: 12, max_width: 10, severity: 'low' },
            { defect_id: 'D-203', type: 'spalling', name: '剥落', physical_length: 15, max_width: 5, severity: 'low' },
            { defect_id: 'D-204', type: 'spalling', name: '剥落', physical_length: 20, max_width: 8, severity: 'low' }
          ]
        },
        aiSummaryHtml: `
          <p class="t-line text-green"><span class="t-prefix">></span> [ 综合研判 ] 检出辅助结构轻度表面缺陷，整体评定为低危。</p>
          <p class="t-line">  ├─ 核心特征: 多处微小的表皮混凝土剥落，最大不超过 20x8mm。</p>
          <p class="t-line">  └─ 劣化分析: 未暴露主筋体系，为常年风化导致的正常物理耗损。</p>
          <br/>
          <p class="t-line"><span class="t-prefix">></span> <strong class="text-cyan">[ 修复与干预建议 ]</strong></p>
          <p class="t-line">  指令: 保持定期巡检观察即可，本年度暂无需开展专项修复作业。</p>
        `
      },
      { 
        name: 'IMG_03.jpg', 
        url: '/example/history_zip/image2/page.jpg',
        maskUrl: '/example/history_zip/image2/mask.png',
        featureUrl: '/example/history_zip/image2/feature.png',
        reportData: {
          total_defect_count: 3, 
          overall_risk_level: '低危',
          class_count: { spalling: 3 },
          risk_distribution: { high: 0, medium: 0, low: 3 },
          defects_detail: [
            { defect_id: 'D-205', type: 'spalling', name: '剥落', physical_length: 12, max_width: 10, severity: 'low' },
            { defect_id: 'D-206', type: 'spalling', name: '剥落', physical_length: 9, max_width: 7, severity: 'low' },
            { defect_id: 'D-207', type: 'spalling', name: '剥落', physical_length: 13, max_width: 5, severity: 'low' }
          ]
        },
        aiSummaryHtml: `
          <p class="t-line text-green"><span class="t-prefix">></span> [ 综合研判 ] 检出辅助结构轻度表面缺陷，整体评定为低危。</p>
          <p class="t-line">  ├─ 核心特征: 多处微小的表皮混凝土剥落，最大尺寸仅 13x5mm。</p>
          <p class="t-line">  └─ 劣化分析: 未暴露主筋体系，为常年风化导致的正常物理耗损。</p>
          <br/>
          <p class="t-line"><span class="t-prefix">></span> <strong class="text-cyan">[ 修复与干预建议 ]</strong></p>
          <p class="t-line">  指令: 保持定期巡检观察即可，本年度暂无需开展专项修复作业。</p>
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