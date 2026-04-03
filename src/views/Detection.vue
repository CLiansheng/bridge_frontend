<template>
  <div class="detection-container" :class="{ 'is-leaving': isLeaving }">
    
    <section 
      class="cyber-panel" 
      :class="{ 
        'is-analyzing': status === 'analyzing',
        'is-success': status === 'success'
      }"
    >
      <div class="terminal-bracket tb-tl"></div>
      <div class="terminal-bracket tb-tr"></div>
      <div class="terminal-bracket tb-bl"></div>
      <div class="terminal-bracket tb-br"></div>

      <div class="panel-inner">
        
        <div class="panel-header">
          <div 
            class="sys-badge" 
            :class="{ 
              'analyzing-badge': status === 'analyzing',
              'success-badge': status === 'success'
            }"
          >
            <span class="badge-icon"></span>
            {{ 
              status === 'analyzing' ? 'ANALYZING_CORE_DATA...' : 
              (status === 'success' ? 'DIAGNOSTIC_COMPLETE' : 'UPLINK_READY') 
            }}
          </div>
          <h2 class="cyber-title">BridgeEye DETECT</h2>
          <p class="subtitle">桥 梁 病 害 诊 断 终 端</p>
          <div class="header-divider"></div>
        </div>

        <div 
          class="upload-zone"
          :class="{ 'drag-active': isDragging || status !== 'idle' }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          @click="triggerFileInput"
        >
          <input 
            type="file" 
            ref="fileInput" 
            class="hidden-input" 
            multiple 
            accept=".jpg,.jpeg,.png,.zip"
            @change="handleFileSelect"
          >
          <div class="scanner-line"></div>
          
          <div class="upload-content">
            <i class='bx bx-crosshair target-icon' :class="{ 'spin': status === 'analyzing' }"></i>
            <h3 class="upload-hint">>> 数 据 传 输 // <span class="highlight">点击或拖拽传输</span></h3>
            <p class="upload-tips">可接受格式: JPG, PNG, ZIP</p>
          </div>
          <div class="zone-grid"></div>
        </div>

        <div class="file-list-container" v-if="uploadedFiles.length > 0">
          <div class="list-header">
            <span>文件队列 ({{ uploadedFiles.length }})</span>
            <button class="clear-btn" @click="clearFiles" :disabled="status !== 'idle'">[ 删除已传文件 ]</button>
          </div>
          
          <div class="file-items">
            <div class="file-item" v-for="(file, index) in uploadedFiles" :key="index">
              <div class="file-info">
                <i class='bx bxs-file-blank file-icon'></i>
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ formatSize(file.size) }}</span>
              </div>
              <div class="file-status">
                <span class="status-text">[ 已上传 ]</span>
                <i class='bx bx-x remove-icon' v-if="status === 'idle'" @click.stop="removeFile(index)"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="action-bar">
          <button 
            class="cyber-submit-btn" 
            :disabled="uploadedFiles.length === 0 || status !== 'idle'"
            @click="startAnalysis"
          >
            <div class="btn-bg"></div>
            <span class="btn-text">
              {{ status === 'analyzing' ? 'BridgeEye 正 在 诊 断 中 ' : (status === 'success' ? '诊 断 分 析 已 完 成' : '点 击 开 始 诊 断') }}
            </span>
            <div class="btn-glitch-layer"></div>
          </button>
        </div>
      </div>
    </section>

    <teleport to="body">
      <transition name="hud-fade">
        <div v-show="showReportModal && !isExporting" class="hud-modal-overlay">
          <div class="hud-modal-dashboard">
            
            <div class="hud-bg-grid"></div>
            <div class="hud-bracket hb-tl"></div>
            <div class="hud-bracket hb-tr"></div>
            <div class="hud-bracket hb-bl"></div>
            <div class="hud-bracket hb-br"></div>

            <div class="hud-header">
              <div class="hud-header-left">
                <i class='bx bx-radar hud-radar-icon'></i>
                <h2 class="hud-title">BridgeEye 深度诊断结果</h2>
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
                  <span class="deco-box"></span> 影像观测器 ({{ currentImageIndex + 1 }}/{{ resultImages.length }})
                </div>
                
                <div class="cyber-carousel-container">
                  <div class="carousel-track">
                    <div class="hud-image-viewer" v-for="(img, idx) in resultImages" :key="idx" v-show="currentImageIndex === idx">
                      <div class="image-bracket ib-tl"></div>
                      <div class="image-bracket ib-tr"></div>
                      <div class="image-bracket ib-bl"></div>
                      <div class="image-bracket ib-br"></div>
                      
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

                <div class="hud-section-title mt-20">
                  <span class="deco-box"></span> 本张影像 AI 深度解析报告
                </div>
                <button class="hud-ai-trigger-btn" @click="toggleAiSummary">
                  <span class="btn-glitch-text" style="user-select: none;">{{ showAiSummary ? '<< 隐藏解析报告' : '>> 点击获取 AI 深度解析报告' }}</span>
                </button>
                
                <transition name="terminal-expand">
                  <div class="hud-terminal" v-show="showAiSummary">
                    <div class="terminal-header">
                      <span class="terminal-dot red"></span><span class="terminal-dot yellow"></span><span class="terminal-dot green"></span>
                      <span class="terminal-title">AI_CORE_DIAGNOSTICS</span>
                    </div>
                    <div class="terminal-content">
                      <div class="typewriter-text" v-html="currentImageData.aiSummaryHtml"></div>
                      <div class="terminal-cursor">_</div>
                    </div>
                  </div>
                </transition>
              </div>

              <!-- ！！！ 修改开始：彻底拍平右侧栏 DOM 布局，移除图表容器，统一卡片格式 ！！！ -->
              <div class="hud-scroll-col hud-col-right">
                
                <!-- 第一模块：核心指标 -->
                <div class="hud-section-title">
                  <span class="deco-box"></span> 本张影像核心诊断指标
                </div>
                
                <div class="hud-stats-grid one-image-grid">
                  <div class="hud-stat-card warning-card">
                    <div class="stat-border-top"></div><div class="stat-label">病害数量</div>
                    <div class="stat-value text-orange">{{ currentImageData.reportData.total_defect_count }}</div>
                  </div>
                  <div class="hud-stat-card">
                    <div class="stat-border-top"></div><div class="stat-label">风险评分</div>
                    <div class="stat-value" :class="riskScoreClass">{{ currentImageData.reportData.risk_score }}<span class="unit">/100</span></div>
                  </div>
                  <div class="hud-stat-card">
                    <div class="stat-border-top"></div><div class="stat-label">病害平均面积</div>
                    <div class="stat-value text-green">{{ currentImageData.reportData.average_area }}<span class="unit">mm²</span></div>
                  </div>
                  <div class="hud-stat-card">
                    <div class="stat-border-top"></div><div class="stat-label">病害平均长度</div>
                    <div class="stat-value text-green">{{ currentImageData.reportData.average_length }}<span class="unit">mm</span></div>
                  </div>
                </div>

                <!-- 第二模块：类别侦测扫描 -->
                <div class="hud-section-title mt-20">
                  <span class="deco-box"></span> 类别侦测扫描
                </div>
                
                <div class="hud-stats-grid one-image-grid">
                  <div class="hud-stat-card" v-for="type in ['crack', 'efflorescence', 'exposed rebar', 'spalling']" :key="type">
                    <div class="stat-border-top" :style="{ background: (currentImageData.reportData.class_count[type] || 0) > 0 ? '#00e5ff' : 'rgba(255, 255, 255, 0.1)' }"></div>
                    <div class="stat-label">{{ getClassName(type) }}</div>
                    <div 
                      class="stat-value" 
                      :class="{ 'text-cyan': (currentImageData.reportData.class_count[type] || 0) > 0 }"
                      :style="{ color: (currentImageData.reportData.class_count[type] || 0) === 0 ? 'rgba(255, 255, 255, 0.2)' : '' }"
                    >
                      {{ currentImageData.reportData.class_count[type] || 0 }}
                      <span class="unit" :style="{ color: (currentImageData.reportData.class_count[type] || 0) === 0 ? 'rgba(255, 255, 255, 0.1)' : '' }">处</span>
                    </div>
                  </div>
                </div>

                <!-- 第三模块：风险预警分布 (抛弃图表框，作为裸容器展示矩阵) -->
                <div class="hud-section-title mt-20">
                  <span class="deco-box"></span> 诊断特征矩阵
                </div>

                <div class="risk-matrix-dashboard-flat">
                  <div class="risk-row high" :class="{ active: currentImageData.reportData.risk_distribution.high > 0 }">
                    <span class="r-label">HIGH_RISK <span class="cn-text">高危</span></span>
                    <span class="r-val">{{ currentImageData.reportData.risk_distribution.high }}</span>
                  </div>
                  <div class="risk-row medium" :class="{ active: currentImageData.reportData.risk_distribution.medium > 0 }">
                    <span class="r-label">MED_RISK <span class="cn-text">中危</span></span>
                    <span class="r-val">{{ currentImageData.reportData.risk_distribution.medium }}</span>
                  </div>
                  <div class="risk-row low" :class="{ active: currentImageData.reportData.risk_distribution.low > 0 }">
                    <span class="r-label">LOW_RISK <span class="cn-text">低危</span></span>
                    <span class="r-val">{{ currentImageData.reportData.risk_distribution.low }}</span>
                  </div>
                </div>

              </div>
              <!-- ！！！ 修改结束 ！！！ -->

            </div>
          </div>
        </div>
      </transition>
    </teleport>

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

    <teleport to="body">
      <div v-if="isExporting" class="pdf-export-overlay">
        <div class="pdf-hidden-container">
          <div id="pdf-pure-template">
            <div class="pdf-header">
              <h1>BridgeEye DETECT // 深度诊断报告</h1>
              <p>生成时间: {{ new Date().toLocaleString() }}</p>
            </div>

            <div class="pdf-image-block" v-for="(imgData, idx) in resultImages" :key="idx">
              <div class="pdf-section-title">>> 影像档案: {{ imgData.name }} ({{ idx + 1 }}/{{ resultImages.length }})</div>
              
              <div class="pdf-visual-data">
                 <img :src="imgData.url" class="pdf-img-src" crossorigin="anonymous" />
                 
                 <div class="pdf-metrics-col">
                    <div class="pdf-metric-item"><strong>病害总数:</strong> {{ imgData.reportData.total_defect_count }}</div>
                    <div class="pdf-metric-item"><strong>风险评分:</strong> {{ imgData.reportData.risk_score }}</div>
                    <div class="pdf-metric-item"><strong>平均面积:</strong> {{ imgData.reportData.average_area }} mm²</div>
                    <div class="pdf-metric-item"><strong>平均长度:</strong> {{ imgData.reportData.average_length }} mm</div>
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
import { ref, computed, onBeforeUnmount, nextTick } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import html2pdf from 'html2pdf.js';

// ================= 基本状态管理 =================
const fileInput = ref(null);
const isDragging = ref(false);       
const status = ref('idle');          
const uploadedFiles = ref([]);       
const isLeaving = ref(false);        

let analyzeTimer = null;             
let successTimer = null;             

// ================= 弹窗与控制状态 =================
const showReportModal = ref(false);  
const showAiSummary = ref(false);    
const isExporting = ref(false);      
const currentImageIndex = ref(0);    

// ================= 数据结构 =================
const resultImages = ref([
  { 
    name: 'IMG_CORE_01_裂缝侦测.jpg', 
    url: '/result1.jpg',
    reportData: {
        total_defect_count: 4,
        risk_score: 85, 
        class_count: { crack: 4 },
        risk_distribution: { high: 3, medium: 1, low: 0 },
        average_area: 1250, 
        average_length: 210
    },
    aiSummaryHtml: `
      <p class="t-line text-red"><span class="t-prefix">></span> [ 警告 ] 影像中发现严重结构性裂缝。</p>
      <p class="t-line">  ├─ 类型: 贯穿性裂缝</p>
      <p class="t-line">  ├─ 数量: <span class="text-red">4 处</span></p>
      <p class="t-line">  └─ 最大宽度推测: 2.5mm</p>
      <br/>
      <p class="t-line"><span class="t-prefix">></span> <strong class="text-cyan">[ 干预建议 ]</strong></p>
      <p class="t-line">  指令: 立即封锁该区域，执行高分子材料压力注浆加固。</p>
    `
  },
  { 
    name: 'IMG_CORE_02_泛碱透视.jpg', 
    url: '/result2.jpg',
    reportData: {
        total_defect_count: 3,
        risk_score: 45,
        class_count: { efflorescence: 3 },
        risk_distribution: { high: 0, medium: 2, low: 1 },
        average_area: 980, 
        average_length: 0
    },
    aiSummaryHtml: `
      <p class="t-line text-green"><span class="t-prefix">></span> [ 提示 ] 影像中存在多处泛碱现象。</p>
      <p class="t-line">  ├─ 类型: 表面泛碱</p>
      <p class="t-line">  ├─ 数量: 3 处</p>
      <p class="t-line">  └─ 成因: 水分渗漏携带盐分析出</p>
      <br/>
      <p class="t-line"><span class="t-prefix">></span> <strong class="text-cyan">[ 干预建议 ]</strong></p>
      <p class="t-line">  指令: 查找渗漏源头并修复防水层，清除表面泛碱物。</p>
    `
  },
  { 
    name: 'IMG_CORE_03_复合病害.jpg', 
    url: '/result3.jpg',
    reportData: {
        total_defect_count: 2,
        risk_score: 95,
        class_count: { 'exposed rebar': 1, spalling: 1 },
        risk_distribution: { high: 2, medium: 0, low: 0 },
        average_area: 2100, 
        average_length: 150
    },
    aiSummaryHtml: `
      <p class="t-line text-red"><span class="t-prefix">></span> [ 极高危 ] 发现钢筋严重裸露与混凝土剥落。</p>
      <p class="t-line">  ├─ 病害1: <span class="text-red">钢筋裸露(1处) - 锈蚀严重</span></p>
      <p class="t-line">  └─ 病害2: 混凝土剥落(1处)</p>
      <br/>
      <p class="t-line"><span class="t-prefix">></span> <strong class="text-cyan">[ 干预建议 ]</strong></p>
      <p class="t-line">  1. 指令: 紧急将该区域评定为不健康状态。</p>
      <p class="t-line">  2. 指令: 对裸露钢筋进行除锈处理，使用高强环氧砂浆修补剥落区。</p>
    `
  }
]);

const currentImageData = computed(() => resultImages.value[currentImageIndex.value] || null);

const riskScoreClass = computed(() => {
    const score = currentImageData.value?.reportData.risk_score || 0;
    if (score >= 80) return 'text-red';
    if (score >= 60) return 'text-orange';
    return 'text-green';
});

// 数据转换 Helper
const getClassName = (className) => {
  const classMap = { crack: '裂缝', efflorescence: '泛碱', 'exposed rebar': '钢筋裸露', spalling: '剥落' };
  return classMap[className] || className;
};

// ================= 生命周期 =================
onBeforeRouteLeave((to, from, next) => {
  if (status.value === 'analyzing') {
    alert('SYSTEM_WARNING: 系统正在执行核心扫描，强制中断将导致数据损坏！');
    next(false); 
    return;
  }
  isLeaving.value = true;
  uploadedFiles.value = [];
  if (showReportModal.value) closeReportModal();
  if (showZoomModal.value) closeZoomModal();
  nextTick(() => { next(); });
});

onBeforeUnmount(() => {
  if (analyzeTimer) clearTimeout(analyzeTimer);
  if (successTimer) clearTimeout(successTimer);
  window.removeEventListener('mousemove', onPan);
  window.removeEventListener('mouseup', stopPan);
});

// ================= 轮播图控制 =================
const nextImage = () => { 
  if (currentImageIndex.value < resultImages.value.length - 1) currentImageIndex.value++; 
  else currentImageIndex.value = 0; 
};

const prevImage = () => { 
  if (currentImageIndex.value > 0) currentImageIndex.value--; 
  else currentImageIndex.value = resultImages.value.length - 1; 
};

const setCurrentImage = (idx) => { 
  currentImageIndex.value = idx; 
};

// ================= ⭐ 进阶：图片滚轮缩放与拖拽 =================
const showZoomModal = ref(false);
const zoomedImageUrl = ref('');

// 变换状态
const zoomScale = ref(1);
const panX = ref(0);
const panY = ref(0);

// 拖拽控制变量
const isPanning = ref(false);
let startMouseX = 0;
let startMouseY = 0;
let initialPanX = 0;
let initialPanY = 0;

const openZoomModal = (url) => {
    zoomedImageUrl.value = url;
    showZoomModal.value = true;
    resetZoom();
};

const closeZoomModal = () => {
    showZoomModal.value = false;
    zoomedImageUrl.value = '';
    stopPan();
};

const resetZoom = () => {
    zoomScale.value = 1;
    panX.value = 0;
    panY.value = 0;
};

// 滚轮缩放事件
const handleZoomWheel = (e) => {
    // 缩放灵敏度
    const zoomSensitivity = 0.0015;
    const delta = -e.deltaY * zoomSensitivity;
    let newScale = zoomScale.value + delta;
    
    // 限制缩放比例范围 10% - 800%
    newScale = Math.max(0.1, Math.min(newScale, 8));
    zoomScale.value = newScale;
};

// 开始拖拽
const startPan = (e) => {
    isPanning.value = true;
    startMouseX = e.clientX;
    startMouseY = e.clientY;
    initialPanX = panX.value;
    initialPanY = panY.value;
    window.addEventListener('mousemove', onPan);
    window.addEventListener('mouseup', stopPan);
};

// 拖拽中
const onPan = (e) => {
    if (!isPanning.value) return;
    panX.value = initialPanX + (e.clientX - startMouseX);
    panY.value = initialPanY + (e.clientY - startMouseY);
};

// 停止拖拽
const stopPan = () => {
    isPanning.value = false;
    window.removeEventListener('mousemove', onPan);
    window.removeEventListener('mouseup', stopPan);
};


// ================= 上传分析业务 =================
const triggerFileInput = () => { 
  if (status.value === 'idle') fileInput.value.click(); 
};

const handleDrop = (e) => { 
  isDragging.value = false; 
  if (status.value !== 'idle') return; 
  if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files); 
};

const handleFileSelect = (e) => { 
  if (e.target.files.length > 0) processFiles(e.target.files); 
  e.target.value = ''; 
};

const processFiles = (files) => {
  const maxSize = 50 * 1024 * 1024;
  Array.from(files).forEach(file => {
    if (file.size > maxSize) return alert(`SYSTEM_WARN: 文件 ${file.name} 超过 50MB。`);
    if (!uploadedFiles.value.some(f => f.name === file.name)) uploadedFiles.value.push(file);
  });
};

const removeFile = (index) => uploadedFiles.value.splice(index, 1);
const clearFiles = () => { uploadedFiles.value = []; };

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const startAnalysis = () => {
  if (uploadedFiles.value.length === 0 || status.value !== 'idle') return;
  status.value = 'analyzing';
  
  analyzeTimer = setTimeout(() => {
    if (isLeaving.value) return;
    status.value = 'success';
    successTimer = setTimeout(() => { openReportModal(); }, 1200);
  }, 3000);
};

// ================= 弹窗控制逻辑 =================
const openReportModal = () => {
  showReportModal.value = true;
  showAiSummary.value = false; 
  currentImageIndex.value = 0;
};

const closeReportModal = () => {
  showReportModal.value = false;
  clearFiles();
  status.value = 'idle';
};

const toggleAiSummary = () => {
  showAiSummary.value = !showAiSummary.value;
};

// ================= PDF 导出 =================
const downloadPDF = async () => {
  if (isExporting.value) return;
  isExporting.value = true;
  
  setTimeout(() => {
    const element = document.getElementById('pdf-pure-template');
    const opt = {
      margin:       10,
      filename:     `BridgeEye_Diagnostic_Report_${new Date().getTime()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#020810', windowWidth: 800 },
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
/* ================= 页面根容器布局基础 ================= */
.detection-container {
  width: 100%;
  max-width: 850px;
  margin: 0 auto;
  padding: 20px;
  animation: deployFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.detection-container.is-leaving {
  animation: none !important;
}

.detection-container.is-leaving * {
  animation: none !important;
  transition: none !important;
}

/* ================= 核心诊断面板 ================= */
.cyber-panel {
  position: relative;
  background: rgba(2, 8, 16, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 229, 255, 0.3);
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(0, 229, 255, 0.05);
}

.terminal-bracket {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 2px solid transparent;
  z-index: 15;
  transition: border-color 0.3s ease;
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

.panel-inner {
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.panel-header {
  user-select: none;
  text-align: center;
}

.sys-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 229, 255, 0.1);
  border: 1px solid rgba(0, 229, 255, 0.5);
  color: #00e5ff;
  padding: 4px 12px;
  font-size: 12px;
  margin-bottom: 15px;
}

.badge-icon {
  width: 6px;
  height: 6px;
  background: #00e5ff;
  border-radius: 50%;
  animation: blink 1s infinite;
}

.analyzing-badge {
  background: rgba(255, 170, 0, 0.1);
  border-color: rgba(255, 170, 0, 0.5);
  color: #ffaa00;
}

.analyzing-badge .badge-icon {
  background: #ffaa00;
  box-shadow: 0 0 8px #ffaa00;
}

.success-badge {
  background: rgba(0, 255, 170, 0.1);
  border-color: rgba(0, 255, 170, 0.5);
  color: #00ffaa;
}

.success-badge .badge-icon {
  background: #00ffaa;
  box-shadow: 0 0 8px #00ffaa;
  animation: none;
}

.cyber-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 32px;
  color: #fff;
  letter-spacing: 6px;
  margin: 0;
  text-shadow: 0 0 15px rgba(0, 229, 255, 0.5);
}

.subtitle {
  color: rgba(0, 229, 255, 0.8);
  font-size: 14px;
  letter-spacing: 4px;
  margin-top: 10px;
}

.header-divider {
  margin-top: 20px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.5), transparent);
}

/* ================= 文件传送区 ================= */
.upload-zone {
  user-select: none;
  position: relative;
  height: 200px;
  border: 1px dashed rgba(0, 229, 255, 0.4);
  background: rgba(0, 229, 255, 0.02);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
}

.hidden-input {
  display: none;
}

.zone-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
  z-index: 1;
}

.scanner-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #00e5ff;
  box-shadow: 0 0 15px 5px rgba(0, 229, 255, 0.4);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
  z-index: 2;
}

.upload-content {
  position: relative;
  z-index: 5;
  text-align: center;
  pointer-events: none;
}

.target-icon {
  font-size: 48px;
  color: rgba(0, 229, 255, 0.6);
  margin-bottom: 15px;
}

.target-icon.spin {
  color: #ffaa00;
  animation: radarSpin 2s linear infinite;
  text-shadow: 0 0 15px rgba(255, 170, 0, 0.8);
}

.upload-hint {
  color: #fff;
  font-size: 15px;
  margin: 0 0 10px 0;
}

.highlight {
  color: #00e5ff;
  text-shadow: 0 0 8px rgba(0, 229, 255, 0.5);
}

.upload-tips {
  color: rgba(255, 255, 255, 0.4);
  font-size: 11px;
}

.upload-zone:hover,
.upload-zone.drag-active {
  border: 1px solid rgba(0, 229, 255, 0.8);
  background: rgba(0, 229, 255, 0.08);
}

.upload-zone:hover .scanner-line,
.upload-zone.drag-active .scanner-line {
  opacity: 1;
  animation: scanMove 2.5s ease-in-out infinite alternate;
}

/* ================= 文件队列 ================= */
.file-list-container {
  user-select: none;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: rgba(0, 229, 255, 0.6);
  border-bottom: 1px solid rgba(0, 229, 255, 0.2);
  padding-bottom: 5px;
}

.clear-btn {
  background: none;
  border: none;
  color: rgba(255, 51, 51, 0.6);
  font-size: 11px;
  cursor: pointer;
}

.file-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 5px;
}

.file-items::-webkit-scrollbar {
  width: 4px;
}

.file-items::-webkit-scrollbar-thumb {
  background: rgba(0, 229, 255, 0.4);
}

.file-item {
  display: flex;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.5);
  border-left: 3px solid #00e5ff;
  padding: 12px 15px;
}

.file-name {
  margin-right: 10px;
  color: #fff;
  font-size: 13px;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  color: rgba(255, 255, 255, 0.4);
  font-size: 11px;
}

.status-text {
  color: #00ffaa;
  font-size: 11px;
}

.remove-icon {
  color: rgba(255, 255, 255, 0.3);
  font-size: 18px;
  cursor: pointer;
}

.remove-icon:hover {
  color: #ff3333;
}

/* ================= 系统按钮 ================= */
.action-bar {
  margin-top: 10px;
}

.cyber-submit-btn {
  width: 100%;
  position: relative;
  background: rgba(0, 30, 45, 0.8);
  border: 1px solid rgba(0, 229, 255, 0.5);
  padding: 18px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s;
}

.btn-bg {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.2), transparent);
  transition: left 0.4s;
}

.cyber-submit-btn:hover:not(:disabled) .btn-bg {
  left: 100%;
}

.btn-text {
  position: relative;
  z-index: 2;
  color: #00e5ff;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 2px;
}

.cyber-submit-btn:hover:not(:disabled) {
  box-shadow: 0 0 30px rgba(0, 229, 255, 0.3);
}

.cyber-submit-btn:disabled {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  cursor: not-allowed;
}

.cyber-panel.is-analyzing {
  border-color: rgba(255, 170, 0, 0.8);
  box-shadow: 0 0 50px rgba(255, 170, 0, 0.2), inset 0 0 30px rgba(255, 170, 0, 0.1);
  animation: panelOverload 0.2s infinite;
}

.cyber-panel.is-analyzing .terminal-bracket {
  border-color: rgba(255, 170, 0, 1);
}

.cyber-panel.is-analyzing .cyber-submit-btn:disabled {
  border-color: rgba(255, 170, 0, 0.5);
  background: rgba(255, 170, 0, 0.1);
}

.cyber-panel.is-analyzing .cyber-submit-btn:disabled .btn-text {
  color: #ffaa00;
  text-shadow: 0 0 10px rgba(255, 170, 0, 0.8);
  animation: pulseOpacity 1s infinite alternate;
}

.cyber-panel.is-success {
  border-color: rgba(0, 255, 170, 0.8);
  box-shadow: 0 0 50px rgba(0, 255, 170, 0.2), inset 0 0 30px rgba(0, 255, 170, 0.1);
}

.cyber-panel.is-success .terminal-bracket {
  border-color: rgba(0, 255, 170, 1);
}

.cyber-panel.is-success .cyber-submit-btn:disabled {
  border-color: rgba(0, 255, 170, 0.5);
  background: rgba(0, 255, 170, 0.1);
}

.cyber-panel.is-success .cyber-submit-btn:disabled .btn-text {
  color: #00ffaa;
  text-shadow: 0 0 10px rgba(0, 255, 170, 0.8);
}

/* ================= 战术报告 HUD ================= */
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
  user-select: none;
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

/* ====== 新增：风险预警分布容器 ====== */
.risk-matrix-dashboard-flat {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.risk-row {
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
  user-select: none;
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
  user-select: none;
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
@keyframes scanMove {
  0% {
    top: 0%;
  }
  100% {
    top: 100%;
  }
}

@keyframes radarSpin {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes panelOverload {
  0%, 100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(-1px, 1px);
  }
  50% {
    transform: translate(1px, -1px);
  }
  75% {
    transform: translate(1px, 1px);
  }
}

@keyframes pulseOpacity {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
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