<template>
  <div class="history-container">
    
    <section class="cyber-panel archive-panel">
      <div class="terminal-bracket tb-tl"></div>
      <div class="terminal-bracket tb-tr"></div>
      <div class="terminal-bracket tb-bl"></div>
      <div class="terminal-bracket tb-br"></div>

      <div class="panel-inner">
        <div class="panel-header archive-header">
          <div class="header-left">
            <h2 class="cyber-title">BridgeEye 历史档案库</h2>
            <p class="subtitle">HISTORY / DIAGNOSTIC_RECORDS</p>
          </div>
          <div class="header-right">
            <button 
              class="cyber-action-btn danger-btn" 
              @click="deleteSelectedRecords" 
              :disabled="selectedIds.length === 0"
            >
              [ 抹除所选记录 ]
            </button>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="cyber-table">
            <thead>
              <tr>
                <th width="50">
                  <label class="cyber-checkbox">
                    <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
                    <span class="checkmark"></span>
                  </label>
                </th>
                <th>档案代号 [ TASK_NAME ]</th>
                <th>检测时间 [ TIMESTAMP ]</th>
                <th>传输协议 [ UPLOAD_TYPE ]</th>
                <th>高危异常 [ DEFECTS ]</th>
                <th>数据回溯 [ ACTION ]</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in historyStore.historyRecords" :key="record.id">
                <td>
                  <label class="cyber-checkbox">
                    <input type="checkbox" v-model="selectedIds" :value="record.id">
                    <span class="checkmark"></span>
                  </label>
                </td>
                <td class="id-col">
                  <input 
                    type="text" 
                    v-model="record.taskName" 
                    class="ghost-input"
                    @blur="updateTaskName(record.id, record.taskName)"
                    placeholder="未命名档案"
                  >
                </td>
                <td class="time-col">{{ record.detectionTime }}</td>
                <td class="type-col">{{ record.uploadType }}</td>
                <td>
                  <span :class="['alert-badge', record.defectCount > 0 ? 'active' : 'safe']">
                    {{ record.defectCount }} 处
                  </span>
                </td>
                <td>
                  <button class="cyber-action-btn view-btn" @click="viewReport(record)">
                    展开 HUD 面板
                  </button>
                </td>
              </tr>
              <tr v-if="historyStore.historyRecords.length === 0">
                <td colspan="6" class="empty-state">
                  <i class='bx bx-data'></i>
                  <p>SYS_MSG: 档案库暂无数据。</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <teleport to="body">
      <transition name="hud-fade">
        <div v-if="showReportModal" v-show="!isExporting" class="hud-modal-overlay">
          <div class="hud-modal-dashboard">
            
            <div class="hud-bg-grid"></div>
            <div class="hud-bracket hb-tl"></div>
            <div class="hud-bracket hb-tr"></div>
            <div class="hud-bracket hb-bl"></div>
            <div class="hud-bracket hb-br"></div>

            <div class="hud-header">
              <div class="hud-header-left">
                <i class='bx bx-history hud-radar-icon'></i>
                <h2 class="hud-title">{{ selectedRecord?.taskName }}</h2>
              </div>
              <div class="hud-header-right">
                <button class="hud-action-btn" @click="downloadPDF">
                  <i class='bx bxs-download'></i> 
                  <span class="btn-text">导出报告</span>
                </button>
                <button class="hud-close-btn" @click="closeReportModal">
                  <span class="close-text">关闭</span>
                  <i class='bx bx-x'></i>
                </button>
              </div>
            </div>

            <!-- 数据绑定从 reportData 变更为 currentImageData 以支持每张图独立数据 -->
            <div class="hud-body-wrapper" v-if="currentImageData">
              
              <div class="hud-scroll-col hud-col-left">
                <div class="hud-section-title">
                  <span class="deco-box"></span> <span style="user-select: none;">影像观测器 ({{ currentImageIndex + 1 }} / {{ resultImages.length }})</span>
                </div>
                
                <div class="cyber-carousel-container" v-if="resultImages.length > 0">
                  <div class="carousel-track">
                    <div class="hud-image-viewer" v-for="(img, idx) in resultImages" :key="idx" v-show="currentImageIndex === idx">
                      <div class="image-bracket ib-tl"></div>
                      <div class="image-bracket ib-tr"></div>
                      <div class="image-bracket ib-bl"></div>
                      <div class="image-bracket ib-br"></div>
                      
                      <!-- 注入支持放大和手型的样式与事件 -->
                      <img 
                        :src="img.url" 
                        class="real-image clickable-image" 
                        crossorigin="anonymous" 
                        @click="openZoomModal(img.url)"
                      />
                      <div class="image-overlay-tag">{{ img.name }}</div>
                    </div>
                  </div>
                  
                  <div class="carousel-controls" v-if="resultImages.length > 1">
                    <button class="nav-btn" @click="prevImage">&lt;</button>
                    <div class="indicators">
                      <span class="dot" v-for="(img, idx) in resultImages" :key="idx" :class="{ active: currentImageIndex === idx }" @click="setCurrentImage(idx)"></span>
                    </div>
                    <button class="nav-btn" @click="nextImage">&gt;</button>
                  </div>
                </div>
                
                <div v-else class="empty-images">暂无图像档案</div>

                <div class="hud-section-title mt-20">
                  <span class="deco-box"></span> 本张影像 AI 深度解析报告
                </div>
                <button class="hud-ai-trigger-btn" @click="toggleAiSummary">
                  <span class="btn-glitch-text">{{ showAiSummary ? '<< 隐藏解析报告' : '>> 点击获取 AI 深度解析报告' }}</span>
                </button>
                
                <transition name="terminal-expand">
                  <div class="hud-terminal" v-show="showAiSummary">
                    <div class="terminal-header">
                      <span class="terminal-dot red"></span>
                      <span class="terminal-dot yellow"></span>
                      <span class="terminal-dot green"></span>
                      <span class="terminal-title">AI_CORE_DIAGNOSTICS</span>
                    </div>
                    <div class="terminal-content">
                      <!-- 动态绑定当前影像的 AI 报告 -->
                      <div class="typewriter-text" v-html="currentImageData.aiSummaryHtml"></div>
                      <div class="terminal-cursor">_</div>
                    </div>
                  </div>
                </transition>
              </div>

              <!-- 彻底拍平对齐的右侧列 -->
              <div class="hud-scroll-col hud-col-right">
                
                <!-- 第一模块：核心指标 -->
                <div class="hud-section-title">
                  <span class="deco-box"></span> 本张影像核心诊断指标
                </div>
                
                <div class="hud-stats-grid one-image-grid">
                  <div class="hud-stat-card warning-card">
                    <div class="stat-border-top"></div><div class="stat-label">病害数量</div>
                    <div class="stat-value text-orange">{{ currentImageData.reportData?.total_defect_count || 0 }}</div>
                  </div>
                  <div class="hud-stat-card">
                    <div class="stat-border-top"></div><div class="stat-label">风险评分</div>
                    <div class="stat-value" :class="riskScoreClass">{{ currentImageData.reportData?.risk_score || 0 }}<span class="unit">/100</span></div>
                  </div>
                  <div class="hud-stat-card">
                    <div class="stat-border-top"></div><div class="stat-label">病害平均面积</div>
                    <div class="stat-value text-green">{{ currentImageData.reportData?.average_area || 0 }}<span class="unit">mm²</span></div>
                  </div>
                  <div class="hud-stat-card">
                    <div class="stat-border-top"></div><div class="stat-label">病害平均长度</div>
                    <div class="stat-value text-green">{{ currentImageData.reportData?.average_length || 0 }}<span class="unit">mm</span></div>
                  </div>
                </div>

                <!-- 第二模块：类别侦测扫描 -->
                <div class="hud-section-title mt-20">
                  <span class="deco-box"></span> 类别侦测扫描
                </div>
                
                <div class="hud-stats-grid one-image-grid">
                  <div class="hud-stat-card" v-for="type in ['crack', 'efflorescence', 'exposed rebar', 'spalling']" :key="type">
                    <div class="stat-border-top" :style="{ background: (currentImageData.reportData?.class_count?.[type] || 0) > 0 ? '#00e5ff' : 'rgba(255, 255, 255, 0.1)' }"></div>
                    <div class="stat-label">{{ getClassName(type) }}</div>
                    <div 
                      class="stat-value" 
                      :class="{ 'text-cyan': (currentImageData.reportData?.class_count?.[type] || 0) > 0 }"
                      :style="{ color: (currentImageData.reportData?.class_count?.[type] || 0) === 0 ? 'rgba(255, 255, 255, 0.2)' : '' }"
                    >
                      {{ currentImageData.reportData?.class_count?.[type] || 0 }}
                      <span class="unit" :style="{ color: (currentImageData.reportData?.class_count?.[type] || 0) === 0 ? 'rgba(255, 255, 255, 0.1)' : '' }">处</span>
                    </div>
                  </div>
                </div>

                <!-- 第三模块：风险预警分布 -->
                <div class="hud-section-title mt-20">
                  <span class="deco-box"></span> 诊断特征矩阵
                </div>

                <div class="risk-matrix-dashboard-flat">
                  <div class="risk-row high" :class="{ active: (currentImageData.reportData?.risk_distribution?.high || 0) > 0 }">
                    <span class="r-label">HIGH_RISK <span class="cn-text">高危</span></span>
                    <span class="r-val">{{ currentImageData.reportData?.risk_distribution?.high || 0 }}</span>
                  </div>
                  <div class="risk-row medium" :class="{ active: (currentImageData.reportData?.risk_distribution?.medium || 0) > 0 }">
                    <span class="r-label">MED_RISK <span class="cn-text">中危</span></span>
                    <span class="r-val">{{ currentImageData.reportData?.risk_distribution?.medium || 0 }}</span>
                  </div>
                  <div class="risk-row low" :class="{ active: (currentImageData.reportData?.risk_distribution?.low || 0) > 0 }">
                    <span class="r-label">LOW_RISK <span class="cn-text">低危</span></span>
                    <span class="r-val">{{ currentImageData.reportData?.risk_distribution?.low || 0 }}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- 影像全屏放大模态框 -->
    <teleport to="body">
      <transition name="zoom-fade">
        <div 
          v-if="showZoomModal" 
          class="zoom-modal-overlay" 
          @click.self="closeZoomModal"
          @wheel.prevent="handleZoomWheel"
        >
          <div class="zoom-header-controls">
            <span class="zoom-level-text">ZOOM: {{ Math.round(zoomScale * 100) }}%</span>
            <button class="zoom-reset-btn" @click="resetZoom">[ RESET ]</button>
            <button class="zoom-close-btn" @click="closeZoomModal"><i class='bx bx-x'></i></button>
          </div>
          
          <img 
            :src="zoomedImageUrl" 
            class="zoomed-image" 
            :class="{ 'is-panning': isPanning }"
            crossorigin="anonymous" 
            :style="{ transform: `translate(${panX}px, ${panY}px) scale(${zoomScale})` }"
            @mousedown.prevent="startPan"
          />
          <div class="zoom-hint">滚轮缩放 / 拖拽平移 / 点击背景关闭</div>
        </div>
      </transition>
    </teleport>

    <!-- PDF 导出模板 -->
    <teleport to="body">
      <div v-if="isExporting" class="pdf-export-overlay">
        <div class="pdf-hidden-container">
          <div id="pdf-pure-template">
            
            <div class="pdf-header">
              <h1>BridgeEye DETECT // 回溯诊断报告</h1>
              <p>档案代号: {{ selectedRecord?.taskName || '未命名档案' }}</p>
              <p>检测时间: {{ selectedRecord?.detectionTime || '未知' }}</p>
              <p>导出时间: {{ new Date().toLocaleString() }}</p>
            </div>

            <!-- PDF 也同步支持针对每张图片的数据导出 -->
            <div class="pdf-image-block" v-for="(imgData, idx) in resultImages" :key="idx">
              <div class="pdf-section-title">>> 影像档案: {{ imgData.name }} ({{ idx + 1 }}/{{ resultImages.length }})</div>
              
              <div class="pdf-visual-data">
                 <img :src="imgData.url" class="pdf-img-src" crossorigin="anonymous" />
                 
                 <div class="pdf-metrics-col">
                    <div class="pdf-metric-item"><strong>病害总数:</strong> {{ imgData.reportData?.total_defect_count || 0 }}</div>
                    <div class="pdf-metric-item"><strong>风险评分:</strong> {{ imgData.reportData?.risk_score || 0 }}</div>
                    <div class="pdf-metric-item"><strong>平均面积:</strong> {{ imgData.reportData?.average_area || 0 }} mm²</div>
                    <div class="pdf-metric-item"><strong>平均长度:</strong> {{ imgData.reportData?.average_length || 0 }} mm</div>
                 </div>
              </div>

              <div class="pdf-sub-section">
                <h3>[ AI_CORE / 智能解析与干预建议 ]</h3>
                <div class="pdf-ai-content" v-html="imgData.aiSummaryHtml"></div>
              </div>
              <div class="pdf-page-break"></div>
            </div>

          </div>
        </div>
      </div>
    </teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import html2pdf from 'html2pdf.js'
import { useHistoryStore } from '@/stores/history'

// ================= 状态管理 =================
const historyStore = useHistoryStore()
const selectedIds = ref([])
const selectAll = ref(false)

// HUD Report (查看报告详情)相关状态
const showReportModal = ref(false)
const selectedRecord = ref(null)
const showAiSummary = ref(false)
const currentImageIndex = ref(0)
const resultImages = ref([])
const isExporting = ref(false)

// 动态获取当前活动图片的数据（支持独立展示）
const currentImageData = computed(() => {
  return resultImages.value[currentImageIndex.value] || null;
});

// 样式动态计算
const riskScoreClass = computed(() => {
    const score = currentImageData.value?.reportData?.risk_score || 0;
    if (score >= 80) return 'text-red';
    if (score >= 60) return 'text-orange';
    return 'text-green';
});

// 数据转换 Helper
const getClassName = (c) => ({ crack: '裂缝', efflorescence: '泛碱', 'exposed rebar': '钢筋裸露', spalling: '剥落' }[c] || c)

// 初始化时从本地加载记录
onMounted(() => {
  historyStore.loadHistoryRecords()
})

// 清理事件监听
onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onPan)
  window.removeEventListener('mouseup', stopPan)
})

// ================= 表格业务逻辑 =================
watch(selectedIds, (newValue) => {
  selectAll.value = newValue.length === historyStore.historyRecords.length && historyStore.historyRecords.length > 0
}, { deep: true })

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedIds.value = historyStore.historyRecords.map(r => r.id)
  } else {
    selectedIds.value = []
  }
}

const deleteSelectedRecords = () => {
  if (selectedIds.value.length > 0 && confirm('SYSTEM_WARNING: 将永久抹除所选档案记录。确认执行？')) {
    historyStore.deleteSelectedRecords(selectedIds.value)
    selectedIds.value = []
    selectAll.value = false
  }
}

const updateTaskName = (id, newName) => {
  historyStore.updateTaskName(id, newName)
}

// ================= HUD 面板与报告数据逻辑 =================
const viewReport = (record) => {
  selectedRecord.value = record
  
  // 核心处理：如果历史数据里没有存单张图的 reportData 结构，则自动注入完整的 Mock 数据以供展示
  const mockImages = [
      { 
        name: 'IMG_CORE_01_裂缝侦测.jpg', 
        url: '/result1.jpg',
        reportData: { total_defect_count: 4, risk_score: 85, class_count: { crack: 4 }, risk_distribution: { high: 3, medium: 1, low: 0 }, average_area: 1250, average_length: 210 },
        aiSummaryHtml: `<p class="t-line text-red"><span class="t-prefix">></span> [ 警告 ] 影像中发现严重结构性裂缝。</p><p class="t-line">  ├─ 类型: 贯穿性裂缝</p><p class="t-line">  ├─ 数量: <span class="text-red">4 处</span></p><p class="t-line">  └─ 最大宽度推测: 2.5mm</p><br/><p class="t-line"><span class="t-prefix">></span> <strong class="text-cyan">[ 干预建议 ]</strong></p><p class="t-line">  指令: 立即封锁该区域，执行高分子材料压力注浆加固。</p>`
      },
      { 
        name: 'IMG_CORE_02_泛碱透视.jpg', 
        url: '/result2.jpg',
        reportData: { total_defect_count: 3, risk_score: 45, class_count: { efflorescence: 3 }, risk_distribution: { high: 0, medium: 2, low: 1 }, average_area: 980, average_length: 0 },
        aiSummaryHtml: `<p class="t-line text-green"><span class="t-prefix">></span> [ 提示 ] 影像中存在多处泛碱现象。</p><p class="t-line">  ├─ 类型: 表面泛碱</p><p class="t-line">  ├─ 数量: 3 处</p><p class="t-line">  └─ 成因: 水分渗漏携带盐分析出</p><br/><p class="t-line"><span class="t-prefix">></span> <strong class="text-cyan">[ 干预建议 ]</strong></p><p class="t-line">  指令: 查找渗漏源头并修复防水层，清除表面泛碱物。</p>`
      },
      { 
        name: 'IMG_CORE_03_复合病害.jpg', 
        url: '/result3.jpg',
        reportData: { total_defect_count: 2, risk_score: 95, class_count: { 'exposed rebar': 1, spalling: 1 }, risk_distribution: { high: 2, medium: 0, low: 0 }, average_area: 2100, average_length: 150 },
        aiSummaryHtml: `<p class="t-line text-red"><span class="t-prefix">></span> [ 极高危 ] 发现钢筋严重裸露与混凝土剥落。</p><p class="t-line">  ├─ 病害1: <span class="text-red">钢筋裸露(1处) - 锈蚀严重</span></p><p class="t-line">  └─ 病害2: 混凝土剥落(1处)</p><br/><p class="t-line"><span class="t-prefix">></span> <strong class="text-cyan">[ 干预建议 ]</strong></p><p class="t-line">  1. 指令: 紧急将该区域评定为不健康状态。</p><p class="t-line">  2. 指令: 对裸露钢筋进行除锈处理，使用高强环氧砂浆修补剥落区。</p>`
      }
  ]

  // 取真实带独立数据的格式，没有就走 Mock (让历史回放也能动态展示)
  if (record.resultImages && record.resultImages.length > 0 && record.resultImages[0].reportData) {
      resultImages.value = record.resultImages;
  } else {
      resultImages.value = mockImages;
  }
  
  currentImageIndex.value = 0
  showAiSummary.value = false
  showReportModal.value = true
}

const closeReportModal = () => {
  showReportModal.value = false
}

const toggleAiSummary = () => { 
  showAiSummary.value = !showAiSummary.value 
}

const nextImage = () => { 
  if (resultImages.value.length === 0) return
  currentImageIndex.value = (currentImageIndex.value + 1) % resultImages.value.length 
}
const prevImage = () => { 
  if (resultImages.value.length === 0) return
  currentImageIndex.value = (currentImageIndex.value - 1 + resultImages.value.length) % resultImages.value.length 
}
const setCurrentImage = (idx) => { 
  currentImageIndex.value = idx 
}

// ================= 进阶：图片滚轮缩放与拖拽 =================
const showZoomModal = ref(false)
const zoomedImageUrl = ref('')

const zoomScale = ref(1)
const panX = ref(0)
const panY = ref(0)
const isPanning = ref(false)
let startMouseX = 0
let startMouseY = 0
let initialPanX = 0
let initialPanY = 0

const openZoomModal = (url) => {
    zoomedImageUrl.value = url
    showZoomModal.value = true
    resetZoom()
}

const closeZoomModal = () => {
    showZoomModal.value = false
    zoomedImageUrl.value = ''
    stopPan()
}

const resetZoom = () => {
    zoomScale.value = 1
    panX.value = 0
    panY.value = 0
}

const handleZoomWheel = (e) => {
    const zoomSensitivity = 0.0015
    const delta = -e.deltaY * zoomSensitivity
    let newScale = zoomScale.value + delta
    newScale = Math.max(0.1, Math.min(newScale, 8))
    zoomScale.value = newScale
}

const startPan = (e) => {
    isPanning.value = true
    startMouseX = e.clientX
    startMouseY = e.clientY
    initialPanX = panX.value
    initialPanY = panY.value
    window.addEventListener('mousemove', onPan)
    window.addEventListener('mouseup', stopPan)
}

const onPan = (e) => {
    if (!isPanning.value) return
    panX.value = initialPanX + (e.clientX - startMouseX)
    panY.value = initialPanY + (e.clientY - startMouseY)
}

const stopPan = () => {
    isPanning.value = false
    window.removeEventListener('mousemove', onPan)
    window.removeEventListener('mouseup', stopPan)
}

// ================= 纯净文档流导出 PDF =================
const downloadPDF = async () => {
  if (isExporting.value) return;
  isExporting.value = true;
  
  setTimeout(() => {
    const element = document.getElementById('pdf-pure-template');
    
    const opt = {
      margin:       15,
      filename:     `BridgeEye_History_Report_${selectedRecord.value?.taskName || 'Archive'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#020810',
        windowWidth: 800
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      isExporting.value = false;
    }).catch(err => {
      console.error('PDF Generation Error:', err);
      isExporting.value = false;
    });

  }, 800); 
};
</script>

<style scoped>
/* ================= 极简机甲面板与表格 ================= */
.history-container {
  width: 100%;
  max-width: 1100px;
  margin: 20px auto;
  animation: deployFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  user-select: none;
}

.archive-panel {
  background: rgba(2, 8, 16, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 229, 255, 0.3);
  padding: 30px;
  position: relative;
}

.terminal-bracket {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 2px solid transparent;
  z-index: 15;
}

.tb-tl {
  top: -2px;
  left: -2px;
  border-top-color: #00e5ff;
  border-left-color: #00e5ff;
}

.tb-tr {
  top: -2px;
  right: -2px;
  border-top-color: #00e5ff;
  border-right-color: #00e5ff;
}

.tb-bl {
  bottom: -2px;
  left: -2px;
  border-bottom-color: #00e5ff;
  border-left-color: #00e5ff;
}

.tb-br {
  bottom: -2px;
  right: -2px;
  border-bottom-color: #00e5ff;
  border-right-color: #00e5ff;
}

.archive-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(0, 229, 255, 0.2);
  padding-bottom: 15px;
}

.cyber-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 24px;
  color: #fff;
  margin: 0;
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
  letter-spacing: 2px;
}

.subtitle {
  color: rgba(0, 229, 255, 0.6);
  font-family: 'Roboto Mono Local', monospace;
  font-size: 12px;
  margin: 5px 0 0 0;
}

.cyber-action-btn {
  background: rgba(0, 229, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.5);
  color: #00e5ff;
  font-family: 'Roboto Mono Local', monospace;
  font-size: 12px;
  padding: 6px 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.cyber-action-btn:hover:not(:disabled) {
  background: rgba(0, 229, 255, 0.2);
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.4);
  color: #fff;
}

.danger-btn {
  border-color: rgba(255, 51, 51, 0.5);
  color: #ff3333;
  background: rgba(255, 51, 51, 0.05);
}

.danger-btn:hover:not(:disabled) {
  background: rgba(255, 51, 51, 0.2);
  box-shadow: 0 0 10px rgba(255, 51, 51, 0.5);
  color: #fff;
}

.danger-btn:disabled {
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.3);
  cursor: not-allowed;
}

.view-btn {
  padding: 4px 10px;
  font-size: 11px;
}

.table-wrapper {
  overflow-x: auto;
}

.cyber-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-family: 'Roboto Mono Local', monospace;
}

.cyber-table th {
  padding: 15px 10px;
  color: rgba(0, 229, 255, 0.8);
  font-size: 12px;
  border-bottom: 2px solid rgba(0, 229, 255, 0.2);
}

.cyber-table td {
  padding: 12px 10px;
  color: #e2e8f0;
  font-size: 13px;
  border-bottom: 1px solid rgba(0, 229, 255, 0.05);
  transition: background 0.3s;
}

.cyber-table tbody tr:hover td {
  background: rgba(0, 229, 255, 0.05);
}

.time-col {
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
}

.type-col {
  color: #00ffaa;
  font-size: 11px;
}

.ghost-input {
  background: transparent;
  border: 1px solid transparent;
  color: #fff;
  font-family: inherit;
  font-size: 13px;
  padding: 4px;
  width: 100%;
  transition: 0.3s;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
  user-select: auto;
}

.ghost-input:focus, 
.ghost-input:hover {
  border-bottom-color: #00e5ff;
  background: rgba(0, 229, 255, 0.05);
  outline: none;
}

.alert-badge {
  padding: 2px 8px;
  border-radius: 2px;
  font-size: 11px;
  font-weight: bold;
}

.alert-badge.active {
  background: rgba(255, 170, 0, 0.2);
  color: #ffaa00;
  border: 1px solid #ffaa00;
}

.alert-badge.safe {
  background: rgba(0, 255, 170, 0.1);
  color: #00ffaa;
  border: 1px solid rgba(0, 255, 170, 0.3);
}

.empty-state {
  text-align: center;
  padding: 40px !important;
  color: rgba(0, 229, 255, 0.5);
}

.empty-state i {
  font-size: 40px;
  margin-bottom: 10px;
}

.cyber-checkbox {
  display: block;
  position: relative;
  cursor: pointer;
  width: 16px;
  height: 16px;
  user-select: none;
}

.cyber-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 16px;
  width: 16px;
  border: 1px solid #00e5ff;
  background-color: rgba(0, 0, 0, 0.5);
  transition: 0.2s;
}

.cyber-checkbox:hover input ~ .checkmark {
  background: rgba(0, 229, 255, 0.2);
}

.cyber-checkbox input:checked ~ .checkmark {
  background-color: #00e5ff;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.cyber-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.cyber-checkbox .checkmark:after {
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid #020810;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* ================= 战术 HUD 仪表盘样式 ================= */
.hud-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(1, 5, 10, 0.7);
  backdrop-filter: blur(5px);
  z-index: 9990;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hud-modal-dashboard {
  position: relative;
  width: 95%;
  max-width: 1200px;
  height: 85vh;
  background: linear-gradient(135deg, rgba(2, 8, 16, 0.95), rgba(1, 15, 25, 0.95));
  border: 1px solid rgba(0, 229, 255, 0.4);
  box-shadow: 0 0 50px rgba(0, 229, 255, 0.15), inset 0 0 30px rgba(0, 229, 255, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: hudBootUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.hud-bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px);
  background-size: 30px 30px;
  pointer-events: none;
  z-index: 0;
}

.hud-bracket {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 3px solid transparent;
  z-index: 10;
  pointer-events: none;
}

.hb-tl {
  top: -1px;
  left: -1px;
  border-top-color: #00e5ff;
  border-left-color: #00e5ff;
}

.hb-tr {
  top: -1px;
  right: -1px;
  border-top-color: #00e5ff;
  border-right-color: #00e5ff;
}

.hb-bl {
  bottom: -1px;
  left: -1px;
  border-bottom-color: #00e5ff;
  border-left-color: #00e5ff;
}

.hb-br {
  bottom: -1px;
  right: -1px;
  border-bottom-color: #00e5ff;
  border-right-color: #00e5ff;
}

.hud-header {
  position: relative;
  z-index: 5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid rgba(0, 229, 255, 0.2);
  background: linear-gradient(90deg, rgba(0, 229, 255, 0.05), transparent);
}

.hud-header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.hud-radar-icon {
  font-size: 24px;
  color: #00e5ff;
}

.hud-title {
  color: #fff;
  font-family: 'Orbitron', sans-serif;
  font-size: 20px;
  letter-spacing: 3px;
  margin: 0;
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.6);
}

.hud-header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.hud-action-btn,
.hud-close-btn {
  box-sizing: border-box;
  background: rgba(0, 229, 255, 0.1);
  border: 1px solid rgba(0, 229, 255, 0.5);
  color: #00e5ff;
  height: 34px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.hud-action-btn:hover:not(:disabled) {
  background: rgba(0, 229, 255, 0.3);
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.4);
  color: #fff;
}

.hud-close-btn {
  background: rgba(255, 51, 51, 0.1);
  border-color: rgba(255, 51, 51, 0.5);
  color: #ff3333;
}

.hud-close-btn:hover {
  background: rgba(255, 51, 51, 0.2);
  box-shadow: 0 0 15px rgba(255, 51, 51, 0.4);
  color: #fff;
}

.hud-action-btn i,
.hud-close-btn i {
  font-size: 16px;
  line-height: 1;
  display: block;
}

.btn-text,
.close-text {
  font-family: 'Roboto Mono Local', monospace, sans-serif;
  font-size: 13px;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  display: block;
}

.hud-body-wrapper {
  position: relative;
  z-index: 5;
  flex: 1;
  display: flex;
  gap: 30px;
  padding: 25px 30px;
  min-height: 0;
}

.hud-scroll-col {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding-right: 15px;
}

.hud-scroll-col::-webkit-scrollbar {
  width: 4px;
}

.hud-scroll-col::-webkit-scrollbar-thumb {
  background: rgba(0, 229, 255, 0.4);
  border-radius: 2px;
}

.hud-col-left {
  flex: 0 0 50%;
}

.hud-col-right {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.hud-section-title {
  user-select: none;
  color: rgba(0, 229, 255, 0.8);
  font-family: 'Roboto Mono Local', monospace;
  font-size: 14px;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.mt-20 {
  margin-top: 25px;
}

.deco-box {
  width: 8px;
  height: 8px;
  background: #00e5ff;
  box-shadow: 0 0 8px #00e5ff;
}

/* 影像观测器 */
.cyber-carousel-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
}

.hud-image-viewer {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  min-height: 250px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(0, 229, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: inset 0 0 30px rgba(0, 229, 255, 0.05);
}

.image-bracket {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  z-index: 5;
}

.ib-tl {
  top: 5px;
  left: 5px;
  border-top-color: #00e5ff;
  border-left-color: #00e5ff;
}

.ib-tr {
  top: 5px;
  right: 5px;
  border-top-color: #00e5ff;
  border-right-color: #00e5ff;
}

.ib-bl {
  bottom: 5px;
  left: 5px;
  border-bottom-color: #00e5ff;
  border-left-color: #00e5ff;
}

.ib-br {
  bottom: 5px;
  right: 5px;
  border-bottom-color: #00e5ff;
  border-right-color: #00e5ff;
}

.clickable-image {
  cursor: zoom-in;
  transition: transform 0.3s ease;
}

.clickable-image:hover {
  transform: scale(1.02);
}

.real-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: relative;
  z-index: 1;
}

.image-overlay-tag {
  user-select: none;
  position: absolute;
  bottom: 0;
  left: 0;
  background: rgba(0, 229, 255, 0.8);
  color: #020810;
  font-family: 'Roboto Mono Local', monospace;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 10px;
  z-index: 10;
}

.empty-images {
  color: rgba(255, 255, 255, 0.3);
  font-size: 12px;
  font-family: 'Roboto Mono Local', monospace;
  padding: 20px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  text-align: center;
}

/* 轮播控制器 */
.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 229, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.2);
  padding: 5px 10px;
}

.nav-btn {
  background: none;
  border: none;
  color: #00e5ff;
  font-family: monospace;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.2s;
  padding: 5px 15px;
}

.nav-btn:hover {
  color: #fff;
  text-shadow: 0 0 8px #00e5ff;
}

.indicators {
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  background: rgba(0, 229, 255, 0.2);
  border: 1px solid #00e5ff;
  cursor: pointer;
  transform: rotate(45deg);
}

.dot.active {
  background: #00e5ff;
  box-shadow: 0 0 10px #00e5ff;
}

/* AI 解析终端 */
.hud-ai-trigger-btn {
  background: rgba(0, 255, 170, 0.05);
  border: 1px solid rgba(0, 255, 170, 0.4);
  color: #00ffaa;
  padding: 12px 20px;
  width: 100%;
  font-family: 'Roboto Mono Local', monospace;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  text-align: left;
  flex-shrink: 0;
  transition: all 0.3s;
}

.hud-ai-trigger-btn:hover {
  background: rgba(0, 255, 170, 0.15);
  box-shadow: 0 0 15px rgba(0, 255, 170, 0.2);
}

.hud-terminal {
  margin-top: 15px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(0, 255, 170, 0.3);
  font-family: 'Roboto Mono Local', monospace;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.terminal-header {
  background: rgba(0, 255, 170, 0.1);
  padding: 8px 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(0, 255, 170, 0.2);
}

.terminal-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.terminal-dot.red {
  background: #ff3333;
}

.terminal-dot.yellow {
  background: #ffaa00;
}

.terminal-dot.green {
  background: #00ffaa;
}

.terminal-title {
  color: rgba(0, 255, 170, 0.8);
  font-size: 10px;
  margin-left: auto;
  letter-spacing: 1px;
}

.terminal-content {
  padding: 20px;
  color: #00ffaa;
  font-size: 13px;
  line-height: 1.6;
}

:deep(.t-line) {
  margin: 0;
  margin-bottom: 6px;
}

:deep(.t-prefix) {
  color: rgba(0, 255, 170, 0.5);
  margin-right: 8px;
}

.terminal-cursor {
  display: inline-block;
  width: 8px;
  height: 15px;
  background: #00ffaa;
  animation: blink 1s infinite;
  vertical-align: middle;
  margin-left: 5px;
}

/* 核心指标与诊断矩阵 */
.one-image-grid {
  grid-template-columns: 1fr 1fr;
}

.hud-stats-grid {
  user-select: none;
  display: grid;
  gap: 15px;
  flex-shrink: 0;
}

.hud-stat-card {
  position: relative;
  background: rgba(0, 229, 255, 0.02);
  border: 1px solid rgba(0, 229, 255, 0.15);
  border-left: 3px solid #00e5ff;
  padding: 20px;
  transition: all 0.3s;
}

.hud-stat-card:hover {
  background: rgba(0, 229, 255, 0.08);
  box-shadow: inset 0 0 20px rgba(0, 229, 255, 0.1);
  transform: translateX(5px);
}

.warning-card {
  border-left-color: #ffaa00;
  background: rgba(255, 170, 0, 0.02);
}

.stat-border-top {
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 2px;
  background: #00e5ff;
}

.warning-card .stat-border-top {
  background: #ffaa00;
}

.stat-label {
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Roboto Mono Local', monospace;
  font-size: 13px;
  margin-bottom: 8px;
}

.stat-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 28px;
  font-weight: bold;
}

/* ================== 风险预警分布容器 ================== */
.risk-matrix-dashboard-flat {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.risk-row {
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 229, 255, 0.02);
  transition: all 0.3s ease;
}

.risk-row.high {
  border-left: 4px solid #ff3333;
}

.risk-row.high.active {
  background: rgba(255, 51, 51, 0.15);
  border-color: rgba(255, 51, 51, 0.4);
  box-shadow: inset 0 0 15px rgba(255, 51, 51, 0.2);
}

.risk-row.medium {
  border-left: 4px solid #ffaa00;
}

.risk-row.medium.active {
  background: rgba(255, 170, 0, 0.15);
  border-color: rgba(255, 170, 0, 0.4);
  box-shadow: inset 0 0 15px rgba(255, 170, 0, 0.2);
}

.risk-row.low {
  border-left: 4px solid #00ffaa;
}

.risk-row.low.active {
  background: rgba(0, 255, 170, 0.15);
  border-color: rgba(0, 255, 170, 0.4);
  box-shadow: inset 0 0 15px rgba(0, 255, 170, 0.2);
}

.r-label {
  font-family: 'Orbitron', sans-serif;
  font-size: 14px;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.cn-text {
  font-family: 'Roboto Mono Local', monospace;
  font-size: 12px;
  opacity: 0.6;
}

.risk-row.high .r-label {
  color: #ff3333;
}

.risk-row.medium .r-label {
  color: #ffaa00;
}

.risk-row.low .r-label {
  color: #00ffaa;
}

.r-val {
  font-family: 'Roboto Mono Local', monospace;
  font-size: 20px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.3);
}

.risk-row.active .r-val {
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

/* 文字着色统一 */
:deep(.text-cyan) {
  color: #00e5ff;
  text-shadow: 0 0 8px rgba(0, 229, 255, 0.5);
}

:deep(.text-orange) {
  color: #ffaa00;
  text-shadow: 0 0 8px rgba(255, 170, 0, 0.5);
}

:deep(.text-green) {
  color: #00ffaa;
  text-shadow: 0 0 8px rgba(0, 255, 170, 0.5);
}

:deep(.text-red) {
  color: #ff3333;
  text-shadow: 0 0 8px rgba(255, 51, 51, 0.5);
}

.unit {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  margin-left: 5px;
}

/* ================= 强化版图片放大模态框 ================= */
.zoom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 3, 10, 0.9);
  backdrop-filter: blur(10px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.zoom-header-controls {
  position: absolute;
  top: 20px;
  right: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 10001;
  background: rgba(0, 229, 255, 0.1);
  border: 1px solid rgba(0, 229, 255, 0.3);
  padding: 5px 15px;
  border-radius: 4px;
}

.zoom-level-text {
  color: #00e5ff;
  font-family: 'Roboto Mono Local', monospace;
  font-size: 14px;
  font-weight: bold;
}

.zoom-reset-btn {
  background: none;
  border: none;
  color: #fff;
  font-family: 'Roboto Mono Local', monospace;
  font-size: 12px;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s;
}

.zoom-reset-btn:hover {
  opacity: 1;
  color: #00e5ff;
  text-shadow: 0 0 8px #00e5ff;
}

.zoom-close-btn {
  background: none;
  border: none;
  color: #ff3333;
  font-size: 24px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
}

.zoom-close-btn:hover {
  opacity: 1;
  text-shadow: 0 0 10px #ff3333;
}

.zoom-hint {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
  pointer-events: none;
  letter-spacing: 2px;
}

.zoomed-image {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  box-shadow: 0 0 50px rgba(0, 229, 255, 0.2);
  border: 1px solid rgba(0, 229, 255, 0.2);
  cursor: grab;
  transition: box-shadow 0.3s ease;
  will-change: transform;
}

.zoomed-image.is-panning {
  cursor: grabbing;
}

/* ================= 隐形 PDF 导出模板样式 ================= */
.pdf-export-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.502);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pdf-hidden-container {
  position: absolute;
  top: 0;
  left: -9999px;
  width: 800px;
}

#pdf-pure-template {
  background: #020810;
  color: #e2e8f0;
  padding: 40px;
  font-family: 'Roboto Mono Local', monospace, sans-serif;
}

.pdf-header {
  border-bottom: 2px solid #00e5ff;
  margin-bottom: 30px;
  padding-bottom: 15px;
}

.pdf-header h1 {
  color: #00e5ff;
  margin: 0 0 10px 0;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 2px;
}

.pdf-header p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  margin: 0;
}

.pdf-section {
  margin-bottom: 40px;
}

.pdf-section h3 {
  color: #00ffaa;
  font-size: 18px;
  margin-bottom: 20px;
  border-left: 4px solid #00ffaa;
  padding-left: 12px;
}

.pdf-metrics-row {
  display: flex;
  justify-content: space-between;
  background: rgba(0, 229, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.2);
  padding: 20px;
}

.pdf-metric-item {
  font-size: 15px;
}

.pdf-metric-item strong {
  color: #00e5ff;
  margin-right: 5px;
}

.pdf-ai-content {
  background: rgba(0, 0, 0, 0.5);
  border: 1px dashed rgba(0, 255, 170, 0.4);
  padding: 25px;
  font-size: 14px;
  line-height: 1.8;
  color: #00ffaa;
}

.pdf-image-item {
  margin-bottom: 30px;
  page-break-inside: avoid;
  break-inside: avoid;
}

.pdf-img-title {
  color: #00e5ff;
  font-size: 14px;
  margin: 0 0 10px 0;
  font-weight: bold;
}

.pdf-img-src {
  width: 100%;
  display: block;
  border: 1px solid rgba(0, 229, 255, 0.3);
}

/* ================= 动画效果 ================= */
@keyframes deployFade {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes hudBootUp {
  0% {
    opacity: 0;
    transform: scaleY(0.01) scaleX(0.8);
  }
  50% {
    opacity: 1;
    transform: scaleY(0.01) scaleX(1);
  }
  100% {
    transform: scaleY(1) scaleX(1);
  }
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.hud-fade-enter-active,
.hud-fade-leave-active {
  transition: opacity 0.3s;
}

.hud-fade-enter-from,
.hud-fade-leave-to {
  opacity: 0;
}

.terminal-expand-enter-active,
.terminal-expand-leave-active {
  transition: all 0.3s ease;
  max-height: 800px;
  opacity: 1;
  overflow: hidden;
}

.terminal-expand-enter-from,
.terminal-expand-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
}
</style>