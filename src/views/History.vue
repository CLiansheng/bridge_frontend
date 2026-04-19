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
            <h2 class="cyber-title"> 桥曈 历史档案库</h2>
            <p class="subtitle">HISTORY / DIAGNOSTIC_RECORDS</p>
          </div>
          <div class="header-right">
            <button class="cyber-action-btn danger-btn" @click="deleteSelectedRecords" :disabled="selectedIds.length === 0">
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
                <th>总计病害 [ TOTAL_DEFECTS ]</th>
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
                  <input type="text" v-model="record.taskName" class="ghost-input" @blur="updateTaskName(record.id, record.taskName)" placeholder="未命名档案">
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

            <div class="hud-body-wrapper" v-if="currentImageData">
              <div class="hud-scroll-col hud-col-left">
                <div class="hud-section-title">
                  <span class="deco-box"></span> <span style="user-select: none;">影像观测器 ({{ currentImageIndex + 1 }}/{{ resultImages.length }})</span>
                </div>
                
                <div class="cyber-carousel-container" v-if="resultImages.length > 0">
                  <div class="carousel-track">
                    <div class="hud-image-viewer" v-for="(img, idx) in resultImages" :key="idx" v-show="currentImageIndex === idx">
                      <div class="image-bracket ib-tl"></div>
                      <div class="image-bracket ib-tr"></div>
                      <div class="image-bracket ib-bl"></div>
                      <div class="image-bracket ib-br"></div>
                      <img :src="img.url" class="real-image clickable-image" crossorigin="anonymous" @click="openZoomModal(img.url)"/>
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
                
                <div class="hud-terminal">
                  <div class="terminal-header">
                    <span class="terminal-dot red"></span><span class="terminal-dot yellow"></span><span class="terminal-dot green"></span>
                    <span class="terminal-title">AI_CORE_DIAGNOSTICS</span>
                  </div>
                  <div class="terminal-content">
                    <div class="typewriter-text" v-html="currentImageData.aiSummaryHtml"></div>
                    <div class="terminal-cursor">_</div>
                  </div>
                </div>

              </div>

              <div class="hud-scroll-col hud-col-right">
                <div class="hud-section-title">
                  <span class="deco-box"></span> 本张影像核心诊断指标
                </div>
                <div class="hud-stats-grid one-image-grid">
                  <div class="hud-stat-card warning-card">
                    <div class="stat-border-top"></div><div class="stat-label">检出病害数量</div>
                    <div class="stat-value text-orange">{{ currentImageData.reportData?.total_defect_count || 0 }}<span class="unit">处</span></div>
                  </div>
                  <div class="hud-stat-card">
                    <div class="stat-border-top"></div><div class="stat-label">整体危险程度</div>
                    <div class="stat-value" :class="riskScoreClass">{{ currentImageData.reportData?.overall_risk_level || '未知' }}</div>
                  </div>
                </div>

                <div class="hud-section-title mt-20">
                  <span class="deco-box"></span> 类别侦测扫描
                </div>
                <div class="hud-stats-grid one-image-grid">
                  <div class="hud-stat-card" v-for="type in ['crack', 'efflorescence', 'exposed rebar', 'spalling']" :key="type">
                    <div class="stat-border-top" :style="{ background: (currentImageData.reportData?.class_count?.[type] || 0) > 0 ? '#00e5ff' : 'rgba(255, 255, 255, 0.1)' }"></div>
                    <div class="stat-label">{{ getClassName(type) }}</div>
                    <div class="stat-value" :class="{ 'text-cyan': (currentImageData.reportData?.class_count?.[type] || 0) > 0 }" :style="{ color: (currentImageData.reportData?.class_count?.[type] || 0) === 0 ? 'rgba(255, 255, 255, 0.2)' : '' }">
                      {{ currentImageData.reportData?.class_count?.[type] || 0 }}
                      <span class="unit" :style="{ color: (currentImageData.reportData?.class_count?.[type] || 0) === 0 ? 'rgba(255, 255, 255, 0.1)' : '' }">处</span>
                    </div>
                  </div>
                </div>

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

                <div class="hud-section-title mt-20">
                  <span class="deco-box"></span> 深度病害特征解析
                </div>
                <div class="defect-detail-list">
                  <div v-for="defect in currentImageData.reportData?.defects_detail || []" :key="defect.defect_id" class="defect-detail-card" :class="defect.severity">
                    <div class="defect-card-header">
                      <span class="d-id">[{{ defect.defect_id }}]</span>
                      <span class="d-name">{{ defect.name }}</span>
                    </div>
                    <div class="defect-card-body">
                      <div class="d-metric">物理长度: <span class="v">{{ defect.physical_length }}</span><span class="u">cm</span></div>
                      <div class="d-metric">最大宽度: <span class="v">{{ defect.max_width }}</span><span class="u">cm</span></div>
                    </div>
                  </div>
                  <div v-if="!(currentImageData.reportData?.defects_detail?.length > 0)" class="empty-defects">
                    [ SYS_MSG ] : 当前区块未发现显著病害特征。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <teleport to="body">
      <transition name="zoom-fade">
        <div v-if="showZoomModal" class="zoom-modal-overlay" @click.self="closeZoomModal" @wheel.prevent="handleZoomWheel">
          <div class="zoom-header-controls">
            <span class="zoom-level-text">ZOOM: {{ Math.round(zoomScale * 100) }}%</span>
            <button class="zoom-reset-btn" @click="resetZoom">[ RESET ]</button>
            <button class="zoom-close-btn" @click="closeZoomModal"><i class='bx bx-x'></i></button>
          </div>
          <img :src="zoomedImageUrl" class="zoomed-image" :class="{ 'is-panning': isPanning }" crossorigin="anonymous" :style="{ transform: `translate(${panX}px, ${panY}px) scale(${zoomScale})` }" @mousedown.prevent="startPan"/>
          <div class="zoom-hint">滚轮缩放 / 拖拽平移 / 点击背景关闭</div>
        </div>
      </transition>
    </teleport>

    <teleport to="body">
      <div v-if="isExporting" class="pdf-export-overlay">
        <div class="pdf-hidden-container">
          <div id="pdf-pure-template" class="formal-pdf">
            
            <div class="pdf-header-official">
              <h1 class="pdf-doc-title">桥梁外观病害智能检测与诊断报告</h1>
              <div class="pdf-doc-meta">
                <span>检测平台:  桥曈桥梁病害诊断系统</span>
                <span>生成日期: {{ new Date().toLocaleString() }}</span>
              </div>
              <div class="pdf-divider"></div>
            </div>

            <div class="pdf-image-block-official" v-for="(imgData, idx) in resultImages" :key="idx">
              <h2 class="pdf-section-heading">检测部位 {{ idx + 1 }}：{{ imgData.name }}</h2>
              
              <div class="pdf-images-grid">
                 <div class="pdf-img-main">
                   <img :src="imgData.url" crossorigin="anonymous" />
                   <p>【图 1】 原始检测影像及病害位置标注</p>
                 </div>
                 <div class="pdf-img-sub-row">
                   <div class="pdf-img-sub">
                     <img :src="imgData.maskUrl || imgData.url" crossorigin="anonymous" />
                     <p>【图 2】 像素级病害分割掩码图 (Mask)</p>
                   </div>
                   <div class="pdf-img-sub">
                     <img :src="imgData.featureUrl || imgData.url" crossorigin="anonymous" />
                     <p>【图 3】 深度学习特征热力图 (Feature Map)</p>
                   </div>
                 </div>
              </div>

              <div class="pdf-data-tables">
                <h3 class="pdf-sub-heading">一、 病害诊断概览</h3>
                <table class="official-table">
                  <tr>
                    <th width="20%">检出病害总数</th>
                    <td width="30%">{{ imgData.reportData?.total_defect_count || 0 }} 处</td>
                    <th width="20%">结构危险程度</th>
                    <td width="30%"><strong>{{ imgData.reportData?.overall_risk_level || '未知' }}</strong></td>
                  </tr>
                  <tr>
                    <th>类别分类统计</th>
                    <td colspan="3" class="text-left">
                       <span v-for="(val, key) in imgData.reportData?.class_count" :key="key">
                         {{ getClassName(key) }}({{ val }}处) &nbsp;&nbsp;&nbsp;
                       </span>
                    </td>
                  </tr>
                </table>

                <h3 class="pdf-sub-heading">二、 病害几何特征明细</h3>
                <table class="official-table">
                  <thead>
                    <tr>
                      <th>病害编号</th>
                      <th>病害类型</th>
                      <th>物理长度 (cm)</th>
                      <th>最大宽度 (cm)</th>
                      <th>危险程度判定</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="defect in imgData.reportData?.defects_detail" :key="defect.defect_id">
                      <td>{{ defect.defect_id }}</td>
                      <td>{{ defect.name }}</td>
                      <td>{{ defect.physical_length }}</td>
                      <td>{{ defect.max_width }}</td>
                      <td>{{ defect.severity === 'high' ? '高危' : (defect.severity === 'medium' ? '中危' : '低危') }}</td>
                    </tr>
                    <tr v-if="!imgData.reportData?.defects_detail?.length">
                      <td colspan="5" style="text-align:center;">当前部位未检出显著病害特征。</td>
                    </tr>
                  </tbody>
                </table>

                <h3 class="pdf-sub-heading">三、 智能研判与修复指导意见</h3>
                <div class="official-ai-report" v-html="imgData.aiSummaryHtml"></div>
              </div>

              <div class="pdf-page-break" v-if="idx < resultImages.length - 1"></div>
            </div>

          </div>
        </div>
      </div>
    </teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
import html2pdf from 'html2pdf.js'
import { useHistoryStore } from '@/stores/history'

const historyStore = useHistoryStore()
const selectedIds = ref([])
const selectAll = ref(false)

const showReportModal = ref(false)
const selectedRecord = ref(null)
const currentImageIndex = ref(0)
const resultImages = ref([])
const isExporting = ref(false)

const currentImageData = computed(() => { return resultImages.value[currentImageIndex.value] || null; });

const riskScoreClass = computed(() => {
    const level = currentImageData.value?.reportData?.overall_risk_level;
    if (level === '高危') return 'text-red';
    if (level === '中危') return 'text-orange';
    if (level === '低危') return 'text-green';
    return 'text-green';
});

const getClassName = (c) => ({ crack: '裂缝', efflorescence: '泛碱', 'exposed rebar': '钢筋裸露', spalling: '剥落' }[c] || c)

onMounted(() => { historyStore.loadHistoryRecords() })
onBeforeUnmount(() => { window.removeEventListener('mousemove', onPan); window.removeEventListener('mouseup', stopPan); })

watch(selectedIds, (newValue) => { selectAll.value = newValue.length === historyStore.historyRecords.length && historyStore.historyRecords.length > 0 }, { deep: true })

const toggleSelectAll = () => { if (selectAll.value) { selectedIds.value = historyStore.historyRecords.map(r => r.id) } else { selectedIds.value = [] } }
const deleteSelectedRecords = () => { if (selectedIds.value.length > 0 && confirm('SYSTEM_WARNING: 将永久抹除所选档案记录。确认执行？')) { historyStore.deleteSelectedRecords(selectedIds.value); selectedIds.value = []; selectAll.value = false; } }
const updateTaskName = (id, newName) => { historyStore.updateTaskName(id, newName) }

const viewReport = (record) => {
  selectedRecord.value = record
  
  // 兜底数据兼容历史记录
  const mockImages = [
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
      }
  ]

  if (record.resultImages && record.resultImages.length > 0 && record.resultImages[0].reportData) {
      resultImages.value = record.resultImages;
  } else {
      resultImages.value = mockImages;
  }
  
  currentImageIndex.value = 0; 
  showReportModal.value = true;
  resetHUDScroll(); // 打开档案时重置滚动
}

// 新增：重置 HUD 两列滚动条
const resetHUDScroll = () => {
  nextTick(() => {
    const cols = document.querySelectorAll('.hud-scroll-col');
    cols.forEach(col => col.scrollTop = 0);
  });
};

const closeReportModal = () => { showReportModal.value = false }

const nextImage = () => { 
  if (resultImages.value.length === 0) return; 
  currentImageIndex.value = (currentImageIndex.value + 1) % resultImages.value.length;
  resetHUDScroll(); // 切换图片时重置滚动
}

const prevImage = () => { 
  if (resultImages.value.length === 0) return; 
  currentImageIndex.value = (currentImageIndex.value - 1 + resultImages.value.length) % resultImages.value.length;
  resetHUDScroll(); // 切换图片时重置滚动
}

const setCurrentImage = (idx) => { 
  currentImageIndex.value = idx;
  resetHUDScroll(); // 切换图片时重置滚动
}

const showZoomModal = ref(false); const zoomedImageUrl = ref(''); const zoomScale = ref(1); const panX = ref(0); const panY = ref(0); const isPanning = ref(false);
let startMouseX = 0; let startMouseY = 0; let initialPanX = 0; let initialPanY = 0;

const openZoomModal = (url) => { zoomedImageUrl.value = url; showZoomModal.value = true; resetZoom() }
const closeZoomModal = () => { showZoomModal.value = false; zoomedImageUrl.value = ''; stopPan() }
const resetZoom = () => { zoomScale.value = 1; panX.value = 0; panY.value = 0 }
const handleZoomWheel = (e) => { const zoomSensitivity = 0.0015; const delta = -e.deltaY * zoomSensitivity; zoomScale.value = Math.max(0.1, Math.min(zoomScale.value + delta, 8)) }
const startPan = (e) => { isPanning.value = true; startMouseX = e.clientX; startMouseY = e.clientY; initialPanX = panX.value; initialPanY = panY.value; window.addEventListener('mousemove', onPan); window.addEventListener('mouseup', stopPan) }
const onPan = (e) => { if (!isPanning.value) return; panX.value = initialPanX + (e.clientX - startMouseX); panY.value = initialPanY + (e.clientY - startMouseY) }
const stopPan = () => { isPanning.value = false; window.removeEventListener('mousemove', onPan); window.removeEventListener('mouseup', stopPan) }

const downloadPDF = async () => {
  if (isExporting.value) return;
  isExporting.value = true;
  
  setTimeout(() => {
    const element = document.getElementById('pdf-pure-template');
    const opt = {
      margin:       15,
      filename:     `qiaotong_History_Report_${selectedRecord.value?.taskName || 'Archive'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#ffffff', windowWidth: 850 },
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
/* ================= 前端机甲风基础样式保持不变 ================= */
.history-container { width: 100%; max-width: 1100px; margin: 20px auto; animation: deployFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; user-select: none; }
.archive-panel { background: rgba(2, 8, 16, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(0, 229, 255, 0.3); padding: 30px; position: relative; }
.terminal-bracket { position: absolute; width: 30px; height: 30px; border: 2px solid transparent; z-index: 15; }
.tb-tl { top: -2px; left: -2px; border-top-color: #00e5ff; border-left-color: #00e5ff; }
.tb-tr { top: -2px; right: -2px; border-top-color: #00e5ff; border-right-color: #00e5ff; }
.tb-bl { bottom: -2px; left: -2px; border-bottom-color: #00e5ff; border-left-color: #00e5ff; }
.tb-br { bottom: -2px; right: -2px; border-bottom-color: #00e5ff; border-right-color: #00e5ff; }
.archive-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px; }
.cyber-title { font-family: 'Orbitron', sans-serif; font-size: 24px; color: #fff; margin: 0; text-shadow: 0 0 10px rgba(0, 229, 255, 0.5); letter-spacing: 2px; }
.subtitle { color: rgba(0, 229, 255, 0.6); font-family: monospace; font-size: 12px; margin: 5px 0 0 0; }
.cyber-action-btn { background: rgba(0, 229, 255, 0.05); border: 1px solid rgba(0, 229, 255, 0.5); color: #00e5ff; font-family: monospace; font-size: 12px; padding: 6px 15px; cursor: pointer; transition: all 0.3s; }
.cyber-action-btn:hover:not(:disabled) { background: rgba(0, 229, 255, 0.2); box-shadow: 0 0 10px rgba(0, 229, 255, 0.4); color: #fff; }
.danger-btn { border-color: rgba(255, 51, 51, 0.5); color: #ff3333; background: rgba(255, 51, 51, 0.05); }
.danger-btn:hover:not(:disabled) { background: rgba(255, 51, 51, 0.2); box-shadow: 0 0 10px rgba(255, 51, 51, 0.5); color: #fff; }
.danger-btn:disabled { border-color: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.3); cursor: not-allowed; }
.view-btn { padding: 4px 10px; font-size: 11px; }
.table-wrapper { overflow-x: auto; }
.cyber-table { width: 100%; border-collapse: collapse; text-align: left; font-family: monospace; }
.cyber-table th { padding: 15px 10px; color: rgba(0, 229, 255, 0.8); font-size: 12px; border-bottom: 2px solid rgba(0, 229, 255, 0.2); }
.cyber-table td { padding: 12px 10px; color: #e2e8f0; font-size: 13px; border-bottom: 1px solid rgba(0, 229, 255, 0.05); transition: background 0.3s; }
.cyber-table tbody tr:hover td { background: rgba(0, 229, 255, 0.05); }
.time-col { color: rgba(255, 255, 255, 0.5); font-size: 11px; }
.type-col { color: #00ffaa; font-size: 11px; }
.ghost-input { background: transparent; border: 1px solid transparent; color: #fff; font-family: inherit; font-size: 13px; padding: 4px; width: 100%; transition: 0.3s; border-bottom: 1px dashed rgba(255, 255, 255, 0.2); user-select: auto; }
.ghost-input:focus, .ghost-input:hover { border-bottom-color: #00e5ff; background: rgba(0, 229, 255, 0.05); outline: none; }
.alert-badge { padding: 2px 8px; border-radius: 2px; font-size: 11px; font-weight: bold; }
.alert-badge.active { background: rgba(255, 170, 0, 0.2); color: #ffaa00; border: 1px solid #ffaa00; }
.alert-badge.safe { background: rgba(0, 255, 170, 0.1); color: #00ffaa; border: 1px solid rgba(0, 255, 170, 0.3); }
.empty-state { text-align: center; padding: 40px !important; color: rgba(0, 229, 255, 0.5); }
.empty-state i { font-size: 40px; margin-bottom: 10px; }
.cyber-checkbox { display: block; position: relative; cursor: pointer; width: 16px; height: 16px; user-select: none; }
.cyber-checkbox input { position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; }
.checkmark { position: absolute; top: 0; left: 0; height: 16px; width: 16px; border: 1px solid #00e5ff; background-color: rgba(0, 0, 0, 0.5); transition: 0.2s; }
.cyber-checkbox:hover input ~ .checkmark { background: rgba(0, 229, 255, 0.2); }
.cyber-checkbox input:checked ~ .checkmark { background-color: #00e5ff; }
.checkmark:after { content: ""; position: absolute; display: none; }
.cyber-checkbox input:checked ~ .checkmark:after { display: block; }
.cyber-checkbox .checkmark:after { left: 5px; top: 2px; width: 4px; height: 8px; border: solid #020810; border-width: 0 2px 2px 0; transform: rotate(45deg); }

/* HUD 弹窗 */
.hud-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(1, 5, 10, 0.7); backdrop-filter: blur(5px); z-index: 9990; display: flex; align-items: center; justify-content: center; }
.hud-modal-dashboard { position: relative; width: 95%; max-width: 1200px; height: 85vh; background: linear-gradient(135deg, rgba(2, 8, 16, 0.95), rgba(1, 15, 25, 0.95)); border: 1px solid rgba(0, 229, 255, 0.4); box-shadow: 0 0 50px rgba(0, 229, 255, 0.15), inset 0 0 30px rgba(0, 229, 255, 0.05); display: flex; flex-direction: column; overflow: hidden; animation: hudBootUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.hud-bg-grid { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px); background-size: 30px 30px; pointer-events: none; z-index: 0; }
.hud-bracket { position: absolute; width: 40px; height: 40px; border: 3px solid transparent; z-index: 10; pointer-events: none; }
.hb-tl { top: -1px; left: -1px; border-top-color: #00e5ff; border-left-color: #00e5ff; }
.hb-tr { top: -1px; right: -1px; border-top-color: #00e5ff; border-right-color: #00e5ff; }
.hb-bl { bottom: -1px; left: -1px; border-bottom-color: #00e5ff; border-left-color: #00e5ff; }
.hb-br { bottom: -1px; right: -1px; border-bottom-color: #00e5ff; border-right-color: #00e5ff; }
.hud-header { position: relative; z-index: 5; display: flex; justify-content: space-between; align-items: center; padding: 20px 30px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); background: linear-gradient(90deg, rgba(0, 229, 255, 0.05), transparent); }
.hud-header-left { display: flex; align-items: center; gap: 15px; }
.hud-radar-icon { font-size: 24px; color: #00e5ff; }
.hud-title { color: #fff; font-family: 'Orbitron', sans-serif; font-size: 20px; letter-spacing: 3px; margin: 0; text-shadow: 0 0 10px rgba(0, 229, 255, 0.6); }
.hud-header-right { display: flex; align-items: center; gap: 15px; }
.hud-action-btn, .hud-close-btn { box-sizing: border-box; background: rgba(0, 229, 255, 0.1); border: 1px solid rgba(0, 229, 255, 0.5); color: #00e5ff; height: 34px; padding: 0 16px; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; transition: all 0.3s ease; border-radius: 4px; }
.hud-action-btn:hover:not(:disabled) { background: rgba(0, 229, 255, 0.3); box-shadow: 0 0 15px rgba(0, 229, 255, 0.4); color: #fff; }
.hud-close-btn { background: rgba(255, 51, 51, 0.1); border-color: rgba(255, 51, 51, 0.5); color: #ff3333; }
.hud-close-btn:hover { background: rgba(255, 51, 51, 0.2); box-shadow: 0 0 15px rgba(255, 51, 51, 0.4); color: #fff; }
.hud-action-btn i, .hud-close-btn i { font-size: 16px; line-height: 1; display: block; }
.btn-text, .close-text { font-family: monospace, sans-serif; font-size: 13px; font-weight: bold; line-height: 1; text-align: center; display: block; }
.hud-body-wrapper { position: relative; z-index: 5; flex: 1; display: flex; gap: 30px; padding: 25px 30px; min-height: 0; }
.hud-scroll-col { display: flex; flex-direction: column; height: 100%; overflow-y: auto; padding-right: 15px; }
.hud-scroll-col::-webkit-scrollbar { width: 4px; }
.hud-scroll-col::-webkit-scrollbar-thumb { background: rgba(0, 229, 255, 0.4); border-radius: 2px; }
.hud-col-left { flex: 0 0 50%; }
.hud-col-right { flex: 1; display: flex; flex-direction: column; }
.hud-section-title { user-select: none; color: rgba(0, 229, 255, 0.8); font-family: monospace; font-size: 14px; letter-spacing: 2px; display: flex; align-items: center; gap: 10px; margin-bottom: 20px; flex-shrink: 0; }
.mt-20 { margin-top: 25px; }
.deco-box { width: 8px; height: 8px; background: #00e5ff; box-shadow: 0 0 8px #00e5ff; }

.cyber-carousel-container { display: flex; flex-direction: column; gap: 10px; flex-shrink: 0; }
.hud-image-viewer { position: relative; width: 100%; aspect-ratio: 16/9; min-height: 250px; background: rgba(0, 0, 0, 0.6); border: 1px solid rgba(0, 229, 255, 0.2); display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: inset 0 0 30px rgba(0, 229, 255, 0.05); }
.image-bracket { position: absolute; width: 20px; height: 20px; border: 2px solid transparent; z-index: 5; }
.ib-tl { top: 5px; left: 5px; border-top-color: #00e5ff; border-left-color: #00e5ff; }
.ib-tr { top: 5px; right: 5px; border-top-color: #00e5ff; border-right-color: #00e5ff; }
.ib-bl { bottom: 5px; left: 5px; border-bottom-color: #00e5ff; border-left-color: #00e5ff; }
.ib-br { bottom: 5px; right: 5px; border-bottom-color: #00e5ff; border-right-color: #00e5ff; }
.clickable-image { cursor: zoom-in; transition: transform 0.3s ease; }
.clickable-image:hover { transform: scale(1.02); }
.real-image { width: 100%; height: 100%; object-fit: contain; position: relative; z-index: 1; }
.image-overlay-tag { user-select: none; position: absolute; bottom: 0; left: 0; background: rgba(0, 229, 255, 0.8); color: #020810; font-family: monospace; font-size: 12px; font-weight: bold; padding: 4px 10px; z-index: 10; }
.empty-images { color: rgba(255, 255, 255, 0.3); font-size: 12px; font-family: monospace; padding: 20px; border: 1px dashed rgba(255, 255, 255, 0.2); text-align: center; }
.carousel-controls { display: flex; align-items: center; justify-content: space-between; background: rgba(0, 229, 255, 0.05); border: 1px solid rgba(0, 229, 255, 0.2); padding: 5px 10px; }
.nav-btn { background: none; border: none; color: #00e5ff; font-family: monospace; font-size: 16px; font-weight: bold; cursor: pointer; transition: color 0.2s; padding: 5px 15px; }
.nav-btn:hover { color: #fff; text-shadow: 0 0 8px #00e5ff; }
.indicators { display: flex; gap: 8px; }
.dot { width: 8px; height: 8px; background: rgba(0, 229, 255, 0.2); border: 1px solid #00e5ff; cursor: pointer; transform: rotate(45deg); }
.dot.active { background: #00e5ff; box-shadow: 0 0 10px #00e5ff; }

/* AI 解析常驻面板 */
.hud-terminal { margin-top: 15px; background: rgba(0, 0, 0, 0.6); border: 1px solid rgba(0, 255, 170, 0.3); font-family: monospace; flex-shrink: 0; display: flex; flex-direction: column; }
.terminal-header { background: rgba(0, 255, 170, 0.1); padding: 8px 15px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(0, 255, 170, 0.2); }
.terminal-dot { width: 10px; height: 10px; border-radius: 50%; }
.terminal-dot.red { background: #ff3333; }
.terminal-dot.yellow { background: #ffaa00; }
.terminal-dot.green { background: #00ffaa; }
.terminal-title { color: rgba(0, 255, 170, 0.8); font-size: 10px; margin-left: auto; letter-spacing: 1px; }
.terminal-content { padding: 20px; color: #00ffaa; font-size: 13px; line-height: 1.6; }

:deep(.t-line) { margin: 0; margin-bottom: 6px; }
:deep(.t-prefix) { color: rgba(0, 255, 170, 0.5); margin-right: 8px; }
.terminal-cursor { display: inline-block; width: 8px; height: 15px; background: #00ffaa; animation: blink 1s infinite; vertical-align: middle; margin-left: 5px; }

.one-image-grid { grid-template-columns: 1fr 1fr; }
.hud-stats-grid { user-select: none; display: grid; gap: 15px; flex-shrink: 0; }
.hud-stat-card { position: relative; background: rgba(0, 229, 255, 0.02); border: 1px solid rgba(0, 229, 255, 0.15); border-left: 3px solid #00e5ff; padding: 20px; transition: all 0.3s; }
.hud-stat-card:hover { background: rgba(0, 229, 255, 0.08); box-shadow: inset 0 0 20px rgba(0, 229, 255, 0.1); transform: translateX(5px); }
.warning-card { border-left-color: #ffaa00; background: rgba(255, 170, 0, 0.02); }
.stat-border-top { position: absolute; top: 0; right: 0; width: 30px; height: 2px; background: #00e5ff; }
.warning-card .stat-border-top { background: #ffaa00; }
.stat-label { color: rgba(255, 255, 255, 0.5); font-family: monospace; font-size: 13px; margin-bottom: 8px; }
.stat-value { font-family: 'Orbitron', sans-serif; font-size: 28px; font-weight: bold; }

.risk-matrix-dashboard-flat { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.risk-row { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border: 1px solid rgba(255, 255, 255, 0.05); background: rgba(0, 229, 255, 0.02); transition: all 0.3s ease; }
.risk-row.high { border-left: 4px solid #ff3333; }
.risk-row.high.active { background: rgba(255, 51, 51, 0.15); border-color: rgba(255, 51, 51, 0.4); box-shadow: inset 0 0 15px rgba(255, 51, 51, 0.2); }
.risk-row.medium { border-left: 4px solid #ffaa00; }
.risk-row.medium.active { background: rgba(255, 170, 0, 0.15); border-color: rgba(255, 170, 0, 0.4); box-shadow: inset 0 0 15px rgba(255, 170, 0, 0.2); }
.risk-row.low { border-left: 4px solid #00ffaa; }
.risk-row.low.active { background: rgba(0, 255, 170, 0.15); border-color: rgba(0, 255, 170, 0.4); box-shadow: inset 0 0 15px rgba(0, 255, 170, 0.2); }
.r-label { user-select: none; font-family: 'Orbitron', sans-serif; font-size: 14px; letter-spacing: 2px; display: flex; align-items: center; gap: 10px; }
.cn-text { font-family: monospace; font-size: 12px; opacity: 0.6; }
.risk-row.high .r-label { color: #ff3333; }
.risk-row.medium .r-label { color: #ffaa00; }
.risk-row.low .r-label { color: #00ffaa; }
.r-val { font-family: monospace; font-size: 20px; user-select: none; font-weight: bold; color: rgba(255, 255, 255, 0.3); }
.risk-row.active .r-val { color: #fff; text-shadow: 0 0 10px rgba(255, 255, 255, 0.5); }

.defect-detail-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
.defect-detail-card { background: rgba(2, 8, 16, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); border-left: 4px solid #fff; padding: 12px 15px; transition: all 0.3s ease; }
.defect-detail-card:hover { background: rgba(0, 229, 255, 0.05); box-shadow: inset 0 0 15px rgba(0, 229, 255, 0.1); transform: translateX(4px); }
.defect-detail-card.high { border-left-color: #ff3333; background: rgba(255, 51, 51, 0.05); }
.defect-detail-card.medium { border-left-color: #ffaa00; background: rgba(255, 170, 0, 0.03); }
.defect-detail-card.low { border-left-color: #00ffaa; background: rgba(0, 255, 170, 0.03); }
.defect-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; border-bottom: 1px dashed rgba(255, 255, 255, 0.1); padding-bottom: 6px; }
.d-id { font-family: 'Orbitron', sans-serif; font-size: 12px; color: rgba(255, 255, 255, 0.5); letter-spacing: 1px; }
.d-name { font-family: monospace; font-size: 14px; font-weight: bold; color: #fff; }
.defect-card-body { display: flex; gap: 20px; }
.d-metric { font-family: monospace; font-size: 12px; color: rgba(255, 255, 255, 0.5); }
.d-metric .v { font-family: 'Orbitron', sans-serif; font-size: 16px; font-weight: bold; color: #00e5ff; margin-left: 5px; }
.defect-detail-card.high .d-metric .v { color: #ff3333; }
.defect-detail-card.medium .d-metric .v { color: #ffaa00; }
.d-metric .u { font-size: 14px; margin-left: 2px; color: rgba(255, 255, 255, 0.3); }
.empty-defects { font-family: monospace; font-size: 12px; color: rgba(0, 255, 170, 0.6); padding: 15px; border: 1px dashed rgba(0, 255, 170, 0.3); text-align: center; background: rgba(0, 255, 170, 0.05); }

:deep(.text-cyan) { color: #00e5ff; text-shadow: 0 0 8px rgba(0, 229, 255, 0.5); }
:deep(.text-orange) { color: #ffaa00; text-shadow: 0 0 8px rgba(255, 170, 0, 0.5); }
:deep(.text-green) { color: #00ffaa; text-shadow: 0 0 8px rgba(0, 255, 170, 0.5); }
:deep(.text-red) { color: #ff3333; text-shadow: 0 0 8px rgba(255, 51, 51, 0.5); }
.unit { font-size: 12px; color: rgba(255, 255, 255, 0.4); margin-left: 5px; }

.zoom-modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 3, 10, 0.9); backdrop-filter: blur(10px); z-index: 10000; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.zoom-header-controls { position: absolute; top: 20px; right: 25px; display: flex; align-items: center; gap: 20px; z-index: 10001; background: rgba(0, 229, 255, 0.1); border: 1px solid rgba(0, 229, 255, 0.3); padding: 5px 15px; border-radius: 4px; }
.zoom-level-text { color: #00e5ff; font-family: monospace; font-size: 14px; font-weight: bold; }
.zoom-reset-btn { background: none; border: none; color: #fff; font-family: monospace; font-size: 12px; cursor: pointer; opacity: 0.7; transition: all 0.2s; }
.zoom-reset-btn:hover { opacity: 1; color: #00e5ff; text-shadow: 0 0 8px #00e5ff; }
.zoom-close-btn { background: none; border: none; color: #ff3333; font-size: 24px; cursor: pointer; opacity: 0.8; transition: opacity 0.2s; display: flex; align-items: center; }
.zoom-close-btn:hover { opacity: 1; text-shadow: 0 0 10px #ff3333; }
.zoom-hint { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); color: rgba(255, 255, 255, 0.4); font-size: 12px; pointer-events: none; letter-spacing: 2px; }
.zoomed-image { max-width: 90vw; max-height: 90vh; object-fit: contain; box-shadow: 0 0 50px rgba(0, 229, 255, 0.2); border: 1px solid rgba(0, 229, 255, 0.2); cursor: grab; transition: box-shadow 0.3s ease; will-change: transform; }
.zoomed-image.is-panning { cursor: grabbing; }

/* ================= 🚨 隐形 PDF 导出模板样式 (重构为纯公文白底黑字) ================= */
.pdf-export-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.8); z-index: 99999; display: flex; align-items: center; justify-content: center; }
.pdf-hidden-container { position: absolute; top: 0; left: -9999px; width: 850px; }

.formal-pdf { background: #ffffff; color: #000000; padding: 40px; font-family: 'SimSun', 'Songti SC', 'Times New Roman', serif; }
.pdf-header-official { text-align: center; margin-bottom: 30px; }
.pdf-doc-title { font-size: 32px; font-weight: bold; margin: 0 0 20px 0; letter-spacing: 4px; font-family: 'SimHei', sans-serif; }
.pdf-doc-meta { display: flex; justify-content: space-between; font-size: 14px; font-family: sans-serif; margin-bottom: 10px; color: #333; }
.pdf-divider { border-top: 3px solid #000; border-bottom: 1px solid #000; height: 2px; }

/* ✅ 核心修改：pdf-page-break 强行换页属性 */
.pdf-image-block-official { margin-bottom: 0px; }
.pdf-page-break { page-break-after: always; break-after: page; height: 0; display: block; clear: both; }

.pdf-section-heading { font-family: 'SimHei', sans-serif; font-size: 20px; font-weight: bold; margin-bottom: 20px; padding-left: 10px; border-left: 5px solid #000; }

.pdf-images-grid { margin-bottom: 25px; }
.pdf-img-main { text-align: center; margin-bottom: 15px; }
.pdf-img-main img { width: 90%; max-height: 400px; border: 1px solid #333; object-fit: contain; }
.pdf-img-sub-row { display: flex; justify-content: center; gap: 20px; }
.pdf-img-sub { width: 45%; text-align: center; }
.pdf-img-sub img { width: 100%; max-height: 250px; border: 1px solid #333; object-fit: contain; }
.pdf-images-grid p { font-size: 13px; font-family: 'SimHei', sans-serif; margin-top: 8px; color: #000; font-weight: bold; }

.pdf-sub-heading { font-family: 'SimHei', sans-serif; font-size: 16px; font-weight: bold; margin: 25px 0 10px 0; }
.official-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; font-family: 'SimSun', serif; }
.official-table th, .official-table td { border: 1px solid #000; padding: 10px; text-align: center; }
.official-table th { background-color: #f0f0f0; font-weight: bold; }
.official-table td.text-left { text-align: left; }

.official-ai-report { border: 1px solid #000; padding: 20px; background-color: #fdfdfd; min-height: 100px; }

/* 强行覆盖 AI HTML 原有的机甲风 CSS，让它在 PDF 里变成规规矩矩的段落 */
.formal-pdf :deep(.t-line) { margin: 8px 0; color: #000; font-size: 14px; line-height: 1.6; font-family: 'SimSun', serif; }
.formal-pdf :deep(.t-prefix) { display: none; }
.formal-pdf :deep(.text-red), .formal-pdf :deep(.text-orange), .formal-pdf :deep(.text-green) { color: #000 !important; text-shadow: none !important; font-weight: bold; }
.formal-pdf :deep(.text-cyan) { color: #000 !important; text-shadow: none !important; font-weight: bold; font-family: 'SimHei', sans-serif; font-size: 15px; }

@keyframes deployFade { 0% { opacity: 0; transform: translateY(20px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes hudBootUp { 0% { opacity: 0; transform: scaleY(0.01) scaleX(0.8); } 50% { opacity: 1; transform: scaleY(0.01) scaleX(1); } 100% { transform: scaleY(1) scaleX(1); } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
.hud-fade-enter-active, .hud-fade-leave-active { transition: opacity 0.3s; }
.hud-fade-enter-from, .hud-fade-leave-to { opacity: 0; }
</style>