<template>
  <div class="detection-container" :class="{ 'is-leaving': isLeaving }">
    
    <section 
      class="cyber-panel" 
      :class="{ 
        'is-analyzing': status === 'analyzing',
        'is-success': status === 'success',
        'is-error': status === 'error' 
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
              'success-badge': status === 'success',
              'error-badge': status === 'error'
            }"
          >
            <span class="badge-icon"></span>
            {{ 
              status === 'analyzing' ? 'ANALYZING_CORE_DATA...' : 
              (status === 'success' ? 'DIAGNOSTIC_COMPLETE' : 
              (status === 'error' ? 'ANALYSIS_FAILED' : 'UPLINK_READY')) 
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
              {{ 
                status === 'analyzing' ? 'BridgeEye 正 在 诊 断 中 ' : 
                (status === 'success' ? '诊 断 分 析 已 完 成' : 
                (status === 'error' ? '数 据 异 常 ，诊 断 失 败' : '点 击 开 始 诊 断')) 
              }}
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
                      <img :src="img.url" class="real-image clickable-image" @click="openZoomModal(img.url)"/>
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
          <img :src="zoomedImageUrl" class="zoomed-image" :class="{ 'is-panning': isPanning }" :style="{ transform: `translate(${panX}px, ${panY}px) scale(${zoomScale})` }" @mousedown.prevent="startPan"/>
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
                <span>检测平台: BridgeEye桥梁病害诊断系统</span>
                <span>生成日期: {{ new Date().toLocaleString() }}</span>
              </div>
              <div class="pdf-divider"></div>
            </div>

            <div class="pdf-image-block-official" v-for="(imgData, idx) in resultImages" :key="idx">
              <h2 class="pdf-section-heading">检测部位 {{ idx + 1 }}：{{ imgData.name }}</h2>
              
              <div class="pdf-images-grid">
                 <div class="pdf-img-main">
                   <img :src="imgData.url" />
                   <p>【图 1】 原始检测影像及病害位置标注</p>
                 </div>
                 <div class="pdf-img-sub-row">
                   <div class="pdf-img-sub">
                     <img :src="imgData.maskUrl || imgData.url" />
                     <p>【图 2】 像素级病害分割掩码图 (Mask)</p>
                   </div>
                   <div class="pdf-img-sub">
                     <img :src="imgData.featureUrl || imgData.url" />
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
                  <tr>
                    <th>特征诊断矩阵</th>
                    <td colspan="3" class="text-left">
                      高危风险: {{ imgData.reportData?.risk_distribution?.high || 0 }} 处 &nbsp;&nbsp;&nbsp;
                      中危风险: {{ imgData.reportData?.risk_distribution?.medium || 0 }} 处 &nbsp;&nbsp;&nbsp;
                      低危风险: {{ imgData.reportData?.risk_distribution?.low || 0 }} 处
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
import { ref, computed, onBeforeUnmount, nextTick } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import html2pdf from 'html2pdf.js';
import { useHistoryStore } from '@/stores/history';

const historyStore = useHistoryStore(); 
const fileInput = ref(null);
const isDragging = ref(false);       
const status = ref('idle');          
const uploadedFiles = ref([]);       
const isLeaving = ref(false);        

let analyzeTimer = null;             
let successTimer = null;             

const showReportModal = ref(false);  
const isExporting = ref(false);      
const currentImageIndex = ref(0);    

// ================= 数据结构 (Mask和Feature自动匹配 page.jpg) =================
const resultImages = ref([]);

// 场景 1：单图极速诊断
const mockDataSingle = [
  {
    name: 'IMG_01.jpg',
    url: '/example/show_one/page.jpg',
    maskUrl: '/example/show_one/mask.png',
    featureUrl: '/example/show_one/feature.png',
    reportData: {
      total_defect_count: 6,
      overall_risk_level: '高危',
      class_count: { 'exposed rebar': 5, 'spalling': 1 },
      risk_distribution: { high: 4, medium: 0, low: 2 },
      defects_detail: [
        { defect_id: 'D-SGL-301', type: 'spalling', name: '剥落', physical_length: 98, max_width: 85, severity: 'high' },
        { defect_id: 'D-SGL-302', type: 'exposed rebar', name: '钢筋裸露', physical_length: 25, max_width: 3, severity: 'low' },
        { defect_id: 'D-SGL-303', type: 'exposed rebar', name: '钢筋裸露', physical_length: 21, max_width: 3, severity: 'low' },
        { defect_id: 'D-SGL-304', type: 'exposed rebar', name: '钢筋裸露', physical_length: 57, max_width: 4, severity: 'high' },
        { defect_id: 'D-SGL-305', type: 'exposed rebar', name: '钢筋裸露', physical_length: 59, max_width: 4, severity: 'high' },
        { defect_id: 'D-SGL-306', type: 'exposed rebar', name: '钢筋裸露', physical_length: 76, max_width: 56, severity: 'high' }
      ]
    },
    aiSummaryHtml: `
      <p class="t-line text-red"><span class="t-prefix">></span> [ 综合研判 ] 检出严重结构性病害，整体评定为高危。</p>
      <p class="t-line">  ├─ 核心特征: 存在大面积混凝土剥落 (最大 98x85cm)，并伴随多处连续的钢筋裸露现象。</p>
      <p class="t-line">  └─ 劣化分析: 保护层大面积失效将导致钢筋加速锈蚀，显著削弱构件的有效承载截面，直接威胁结构整体安全。</p>
      <br/>
      <p class="t-line"><span class="t-prefix">></span> <strong class="text-cyan">[ 修复与干预建议 ]</strong></p>
      <p class="t-line">  1. 响应级别: 建议立即对该桥段实施临时交通限载或封闭管控。</p>
      <p class="t-line">  2. 深度检测: 安排结构工程师进行现场无损检测，评估内部钢筋锈蚀程度及承载力折减情况。</p>
      <p class="t-line">  3. 修复方案: 对裸露钢筋进行彻底除锈、涂刷阻锈剂处理；随后使用高强聚合物修补砂浆恢复混凝土截面。</p>
    `
  }
];

// 场景 2：多图组合抽检
const mockDataMulti = [
  {
    name: 'IMG_01.jpg',
    url: '/example/show_many/image1/page.jpg',
    maskUrl: '/example/show_many/image1/mask.png',
    featureUrl: '/example/show_many/image1/feature.png',
    reportData: {
      total_defect_count: 1,
      overall_risk_level: '高危',
      class_count: { crack: 1 },
      risk_distribution: { high: 1, medium: 0, low: 0 },
      defects_detail: [
        { defect_id: 'D-MUL-201', type: 'crack', name: '裂缝', physical_length: 153, max_width: 2, severity: 'high' }
      ]
    },
    aiSummaryHtml: `
      <p class="t-line text-red"><span class="t-prefix">></span> [ 综合研判 ] 检出超限裂缝，整体评定为高危。</p>
      <p class="t-line">  ├─ 核心特征: 发现长度 153cm、最大宽度 2cm 的主裂缝。</p>
      <p class="t-line">  └─ 劣化分析: 裂缝宽度已超出常规桥梁规范允许值 (通常为 0.2cm)，表现为明显的结构受力裂缝，水分及腐蚀介质极易沿裂缝侵入。</p>
      <br/>
      <p class="t-line"><span class="t-prefix">></span> <strong class="text-cyan">[ 修复与干预建议 ]</strong></p>
      <p class="t-line">  1. 响应级别: 优先处理，需启动专项力学验算，分析该裂缝对构件整体刚度的影响。</p>
      <p class="t-line">  2. 修复方案: 针对超宽裂缝，须采用低粘度环氧树脂进行高压灌浆封闭处理，以恢复结构整体性并阻断水流渗入。</p>
    `
  },
  {
    name: 'IMG_02.jpg',
    url: '/example/show_many/image2/page.jpg',
    maskUrl: '/example/show_many/image2/mask.png',
    featureUrl: '/example/show_many/image2/feature.png',
    reportData: {
      total_defect_count: 1,
      overall_risk_level: '中危',
      class_count: { crack: 1 },
      risk_distribution: { high: 0, medium: 1, low: 0 },
      defects_detail: [
        { defect_id: 'D-MUL-203', type: 'crack', name: '裂缝', physical_length: 45, max_width: 27, severity: 'medium' }
      ]
    },
    aiSummaryHtml: `
      <p class="t-line text-orange"><span class="t-prefix">></span> [ 综合研判 ] 检出宽幅结构张开，整体评定为中危。</p>
      <p class="t-line">  ├─ 核心特征: 发现延伸裂隙，局部最大宽度达到 27cm。</p>
      <p class="t-line">  └─ 劣化分析: 裂缝存在明显的不均匀张开，需警惕水分截留引发冻胀破坏或内部钢筋锈蚀。</p>
      <br/>
      <p class="t-line"><span class="t-prefix">></span> <strong class="text-cyan">[ 修复与干预建议 ]</strong></p>
      <p class="t-line">  1. 深度排查: 探明裂缝深度是否触及主筋，排查周边区域是否存在隐性空鼓现象。</p>
      <p class="t-line">  2. 修复方案: 建议对裂缝进行“V”型扩缝清理后，使用弹性嵌缝胶结合修补砂浆进行深度填补。</p>
    `
  },
  {
    name: 'IMG_03.jpg',
    url: '/example/show_many/image3/page.jpg',
    maskUrl: '/example/show_many/image3/mask.png',
    featureUrl: '/example/show_many/image3/feature.png',
    reportData: {
      total_defect_count: 3,
      overall_risk_level: '中危',
      class_count: { spalling: 3 },
      risk_distribution: { high: 0, medium: 1, low: 2 },
      defects_detail: [
        { defect_id: 'D-MUL-204', type: 'spalling', name: '剥落', physical_length: 42, max_width: 35, severity: 'medium' },
        { defect_id: 'D-MUL-205', type: 'spalling', name: '剥落', physical_length: 17, max_width: 14, severity: 'low' },
        { defect_id: 'D-MUL-206', type: 'spalling', name: '剥落', physical_length: 6, max_width: 4, severity: 'low' }
      ]
    },
    aiSummaryHtml: `
      <p class="t-line text-orange"><span class="t-prefix">></span> [ 综合研判 ] 检出多处表层缺陷，整体评定为中危。</p>
      <p class="t-line">  ├─ 核心特征: 检出 3 处混凝土剥落，最大尺寸为 42x35cm。</p>
      <p class="t-line">  └─ 劣化分析: 保护层局部脱落，虽未大规模钢筋裸露，但长期暴露将加速碳化进程。</p>
      <br/>
      <p class="t-line"><span class="t-prefix">></span> <strong class="text-cyan">[ 修复与干预建议 ]</strong></p>
      <p class="t-line">  1. 修复准备: 凿除周边松散、劣化的混凝土至坚实基面。</p>
      <p class="t-line">  2. 修复方案: 清理粉尘并涂刷界面剂后，使用专用修补砂浆进行表面找平，建议补刷防碳化涂层。</p>
    `
  }
];

// 场景 3：ZIP批量航拍
const mockDataZip = [
  {
    name: 'IMG_001.jpg',
    url: '/example/show_zip/image1/page.jpg',
    maskUrl: '/example/show_zip/image1/mask.png',
    featureUrl: '/example/show_zip/image1/feature.png',
    reportData: {
      total_defect_count: 1,
      overall_risk_level: '高危',
      class_count: { crack: 1 },
      risk_distribution: { high: 1, medium: 0, low: 0 },
      defects_detail: [
        { defect_id: 'D-ZIP-101', type: 'crack', name: '裂缝', physical_length: 180, max_width: 4, severity: 'high' }
      ]
    },
    aiSummaryHtml: `
      <p class="t-line text-red"><span class="t-prefix">></span> [ 综合研判 ] 检出贯穿性主裂缝，整体评定为高危。</p>
      <p class="t-line">  ├─ 核心特征: 结构表面存在长达 180cm、最大宽度 4cm 的严重裂缝。</p>
      <p class="t-line">  └─ 劣化分析: 该尺寸裂缝极具破坏性，通常由不均匀沉降或超载引起，严重削弱抗剪能力。</p>
      <br/>
      <p class="t-line"><span class="t-prefix">></span> <strong class="text-cyan">[ 修复与干预建议 ]</strong></p>
      <p class="t-line">  1. 响应级别: 结构面临失稳风险，建议立即封锁交通并搭建临时支撑架。</p>
      <p class="t-line">  2. 修复方案: 实施体外预应力加固或粘贴碳纤维板补强；裂缝本体进行高压注浆封闭。</p>
    `
  },
  {
    name: 'IMG_02.jpg',
    url: '/example/show_zip/image2/page.jpg',
    maskUrl: '/example/show_zip/image2/mask.png',
    featureUrl: '/example/show_zip/image2/feature.png',
    reportData: {
      total_defect_count: 2,
      overall_risk_level: '中危',
      class_count: { efflorescence: 2 },
      risk_distribution: { high: 0, medium: 2, low: 0 },
      defects_detail: [
        { defect_id: 'D-ZIP-103', type: 'efflorescence', name: '泛碱', physical_length: 40, max_width: 20, severity: 'medium' },
        { defect_id: 'D-ZIP-104', type: 'efflorescence', name: '泛碱', physical_length: 35, max_width: 15, severity: 'medium' }
      ]
    },
    aiSummaryHtml: `
      <p class="t-line text-orange"><span class="t-prefix">></span> [ 综合研判 ] 检出明显渗水析出，整体评定为中危。</p>
      <p class="t-line">  ├─ 核心特征: 发现 2 处泛碱区域，最大影响范围达 40x20cm。</p>
      <p class="t-line">  └─ 劣化分析: 预示着防水层已失效，需防范内部碱骨料反应的发生。</p>
      <br/>
      <p class="t-line"><span class="t-prefix">></span> <strong class="text-cyan">[ 修复与干预建议 ]</strong></p>
      <p class="t-line">  1. 源头治理: 优先查明并切断渗水源头（如桥面排水系统不畅、伸缩缝老化漏水等）。</p>
      <p class="t-line">  2. 修复方案: 清除表面结晶体，待基面干燥后，大面积涂刷硅烷浸渍剂防水。</p>
    `
  },
  {
    name: 'IMG_03.jpg',
    url: '/example/show_zip/image3/page.jpg',
    maskUrl: '/example/show_zip/image3/mask.png',
    featureUrl: '/example/show_zip/image3/feature.png',
    reportData: {
      total_defect_count: 3,
      overall_risk_level: '低危',
      class_count: { spalling: 1, 'exposed rebar': 2 },
      risk_distribution: { high: 0, medium: 0, low: 3 },
      defects_detail: [
        { defect_id: 'D-ZIP-106', type: 'spalling', name: '剥落', physical_length: 25, max_width: 23, severity: 'low' },
        { defect_id: 'D-ZIP-107', type: 'exposed rebar', name: '钢筋裸露', physical_length: 13, max_width: 4, severity: 'low' },
        { defect_id: 'D-ZIP-108', type: 'exposed rebar', name: '钢筋裸露', physical_length: 7, max_width: 2, severity: 'low' }
      ]
    },
    aiSummaryHtml: `
      <p class="t-line text-green"><span class="t-prefix">></span> [ 综合研判 ] 检出轻微表观病害，整体评定为低危。</p>
      <p class="t-line">  ├─ 核心特征: 存在小范围剥落 (25x23cm) 及局部点状钢筋外露。</p>
      <p class="t-line">  └─ 劣化分析: 属于早期轻度劣化状态，未达到危及结构整体安全的界限。</p>
      <br/>
      <p class="t-line"><span class="t-prefix">></span> <strong class="text-cyan">[ 修复与干预建议 ]</strong></p>
      <p class="t-line">  1. 响应级别: 暂不影响正常安全运营，建议纳入常规养护计划统一处理。</p>
      <p class="t-line">  2. 预防性养护: 对点状裸露钢筋进行打磨防锈，并用普通水泥砂浆封闭表面。</p>
    `
  }
];

const currentImageData = computed(() => resultImages.value[currentImageIndex.value] || null);

const riskScoreClass = computed(() => {
    const level = currentImageData.value?.reportData?.overall_risk_level;
    if (level === '高危') return 'text-red';
    if (level === '中危') return 'text-orange';
    if (level === '低危') return 'text-green';
    return 'text-green'; 
});

const getClassName = (className) => {
  const classMap = { crack: '裂缝', efflorescence: '泛碱', 'exposed rebar': '钢筋裸露', spalling: '剥落' };
  return classMap[className] || className;
};

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

const nextImage = () => { 
  if (currentImageIndex.value < resultImages.value.length - 1) currentImageIndex.value++; 
  else currentImageIndex.value = 0; 
};

const prevImage = () => { 
  if (currentImageIndex.value > 0) currentImageIndex.value--; 
  else currentImageIndex.value = resultImages.value.length - 1; 
};

const setCurrentImage = (idx) => { currentImageIndex.value = idx; };

const showZoomModal = ref(false);
const zoomedImageUrl = ref('');
const zoomScale = ref(1);
const panX = ref(0);
const panY = ref(0);
const isPanning = ref(false);
let startMouseX = 0;
let startMouseY = 0;
let initialPanX = 0;
let initialPanY = 0;

const openZoomModal = (url) => { zoomedImageUrl.value = url; showZoomModal.value = true; resetZoom(); };
const closeZoomModal = () => { showZoomModal.value = false; zoomedImageUrl.value = ''; stopPan(); };
const resetZoom = () => { zoomScale.value = 1; panX.value = 0; panY.value = 0; };
const handleZoomWheel = (e) => { const zoomSensitivity = 0.0015; const delta = -e.deltaY * zoomSensitivity; zoomScale.value = Math.max(0.1, Math.min(zoomScale.value + delta, 8)); };
const startPan = (e) => { isPanning.value = true; startMouseX = e.clientX; startMouseY = e.clientY; initialPanX = panX.value; initialPanY = panY.value; window.addEventListener('mousemove', onPan); window.addEventListener('mouseup', stopPan); };
const onPan = (e) => { if (!isPanning.value) return; panX.value = initialPanX + (e.clientX - startMouseX); panY.value = initialPanY + (e.clientY - startMouseY); };
const stopPan = () => { isPanning.value = false; window.removeEventListener('mousemove', onPan); window.removeEventListener('mouseup', stopPan); };

const triggerFileInput = () => { if (status.value === 'idle') fileInput.value.click(); };
const handleDrop = (e) => { isDragging.value = false; if (status.value !== 'idle') return; if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files); };
const handleFileSelect = (e) => { if (e.target.files.length > 0) processFiles(e.target.files); e.target.value = ''; };
const processFiles = (files) => { const maxSize = 50 * 1024 * 1024; Array.from(files).forEach(file => { if (file.size > maxSize) return alert(`SYSTEM_WARN: 文件 ${file.name} 超过 50MB。`); if (!uploadedFiles.value.some(f => f.name === file.name)) uploadedFiles.value.push(file); }); };
const removeFile = (index) => uploadedFiles.value.splice(index, 1);
const clearFiles = () => { uploadedFiles.value = []; };
const formatSize = (bytes) => { if (bytes === 0) return '0 B'; const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(bytes) / Math.log(k)); return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]; };

const startAnalysis = () => {
  if (uploadedFiles.value.length === 0 || status.value !== 'idle') return;
  status.value = 'analyzing';

  const fileCount = uploadedFiles.value.length;
  const zipCount = uploadedFiles.value.filter(f => f.name.toLowerCase().endsWith('.zip')).length;
  const imgCount = fileCount - zipCount;
  let matchedData = null; let uploadTypeStr = '';

  if (fileCount === 1 && zipCount === 1) { matchedData = mockDataZip; uploadTypeStr = 'ZIP 批量传输'; } 
  else if (fileCount === 1 && imgCount === 1) { matchedData = mockDataSingle; uploadTypeStr = '单文件侦测'; } 
  else if (fileCount === 3 && imgCount === 3) { matchedData = mockDataMulti; uploadTypeStr = '多图组合上传'; }
  
  analyzeTimer = setTimeout(() => {
    if (isLeaving.value) return;
    if (!matchedData) { status.value = 'error'; setTimeout(() => { if (status.value === 'error') status.value = 'idle'; }, 3000); return; }

    status.value = 'success';
    resultImages.value = matchedData;

    const totalDefects = resultImages.value.reduce((sum, img) => sum + (img.reportData?.total_defect_count || 0), 0);
    
    // 🚨 修改：新生成的记录强制命名为“未命名”，由用户在历史记录里自由修改
    const newRecord = {
      id: Date.now(), 
      taskName: '未命名', 
      detectionTime: new Date().toLocaleString(),
      uploadType: uploadTypeStr,
      defectCount: totalDefects,
      resultImages: JSON.parse(JSON.stringify(resultImages.value))
    };

    historyStore.addHistoryRecord(newRecord);
    successTimer = setTimeout(() => { openReportModal(); }, 1200);
  }, 3000);
};

const openReportModal = () => { showReportModal.value = true; currentImageIndex.value = 0; };
const closeReportModal = () => { showReportModal.value = false; clearFiles(); status.value = 'idle'; };
const toggleAiSummary = () => { showAiSummary.value = !showAiSummary.value; };

// ================= 🚨 恢复：简单的 setTimeout PDF 导出 (因为本地路径无延迟) =================
const downloadPDF = async () => {
  if (isExporting.value) return;
  isExporting.value = true;
  
  setTimeout(() => {
    const element = document.getElementById('pdf-pure-template');
    const opt = {
      margin:       15,
      filename:     `BridgeEye_Diagnostic_Report_${new Date().getTime()}.pdf`,
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
.detection-container { width: 100%; max-width: 850px; margin: 0 auto; padding: 20px; animation: deployFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.detection-container.is-leaving { animation: none !important; }
.detection-container.is-leaving * { animation: none !important; transition: none !important; }

/* 机甲面板 */
.cyber-panel { position: relative; background: rgba(2, 8, 16, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(0, 229, 255, 0.3); box-shadow: 0 0 40px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(0, 229, 255, 0.05); }
.terminal-bracket { position: absolute; width: 30px; height: 30px; border: 2px solid transparent; z-index: 15; transition: border-color 0.3s ease; }
.tb-tl { top: -2px; left: -2px; border-top-color: #00e5ff; border-left-color: #00e5ff; }
.tb-tr { top: -2px; right: -2px; border-top-color: #00e5ff; border-right-color: #00e5ff; }
.tb-bl { bottom: -2px; left: -2px; border-bottom-color: #00e5ff; border-left-color: #00e5ff; }
.tb-br { bottom: -2px; right: -2px; border-bottom-color: #00e5ff; border-right-color: #00e5ff; }
.panel-inner { padding: 40px; display: flex; flex-direction: column; gap: 30px; }
.panel-header { user-select: none; text-align: center; }
.sys-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(0, 229, 255, 0.1); border: 1px solid rgba(0, 229, 255, 0.5); color: #00e5ff; padding: 4px 12px; font-size: 12px; margin-bottom: 15px; }
.badge-icon { width: 6px; height: 6px; background: #00e5ff; border-radius: 50%; animation: blink 1s infinite; }
.analyzing-badge { background: rgba(255, 170, 0, 0.1); border-color: rgba(255, 170, 0, 0.5); color: #ffaa00; }
.analyzing-badge .badge-icon { background: #ffaa00; box-shadow: 0 0 8px #ffaa00; }
.success-badge { background: rgba(0, 255, 170, 0.1); border-color: rgba(0, 255, 170, 0.5); color: #00ffaa; }
.success-badge .badge-icon { background: #00ffaa; box-shadow: 0 0 8px #00ffaa; animation: none; }
.cyber-title { font-family: 'Orbitron', sans-serif; font-size: 32px; color: #fff; letter-spacing: 6px; margin: 0; text-shadow: 0 0 15px rgba(0, 229, 255, 0.5); }
.subtitle { color: rgba(0, 229, 255, 0.8); font-size: 14px; letter-spacing: 4px; margin-top: 10px; }
.header-divider { margin-top: 20px; height: 2px; background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.5), transparent); }

/* 文件传送区 */
.upload-zone { user-select: none; position: relative; height: 200px; border: 1px dashed rgba(0, 229, 255, 0.4); background: rgba(0, 229, 255, 0.02); display: flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; }
.hidden-input { display: none; }
.zone-grid { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: linear-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px); background-size: 20px 20px; pointer-events: none; z-index: 1; }
.scanner-line { position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: #00e5ff; box-shadow: 0 0 15px 5px rgba(0, 229, 255, 0.4); opacity: 0; pointer-events: none; transition: opacity 0.3s; z-index: 2; }
.upload-content { position: relative; z-index: 5; text-align: center; pointer-events: none; }
.target-icon { font-size: 48px; color: rgba(0, 229, 255, 0.6); margin-bottom: 15px; }
.target-icon.spin { color: #ffaa00; animation: radarSpin 2s linear infinite; text-shadow: 0 0 15px rgba(255, 170, 0, 0.8); }
.upload-hint { color: #fff; font-size: 15px; margin: 0 0 10px 0; }
.highlight { color: #00e5ff; text-shadow: 0 0 8px rgba(0, 229, 255, 0.5); }
.upload-tips { color: rgba(255, 255, 255, 0.4); font-size: 11px; }
.upload-zone:hover, .upload-zone.drag-active { border: 1px solid rgba(0, 229, 255, 0.8); background: rgba(0, 229, 255, 0.08); }
.upload-zone:hover .scanner-line, .upload-zone.drag-active .scanner-line { opacity: 1; animation: scanMove 2.5s ease-in-out infinite alternate; }

/* 文件队列 */
.file-list-container { user-select: none; display: flex; flex-direction: column; gap: 15px; }
.list-header { display: flex; justify-content: space-between; font-size: 12px; color: rgba(0, 229, 255, 0.6); border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 5px; }
.clear-btn { background: none; border: none; color: rgba(255, 51, 51, 0.6); font-size: 11px; cursor: pointer; }
.file-items { display: flex; flex-direction: column; gap: 10px; max-height: 200px; overflow-y: auto; padding-right: 5px; }
.file-items::-webkit-scrollbar { width: 4px; }
.file-items::-webkit-scrollbar-thumb { background: rgba(0, 229, 255, 0.4); }
.file-item { display: flex; justify-content: space-between; background: rgba(0, 0, 0, 0.5); border-left: 3px solid #00e5ff; padding: 12px 15px; }
.file-name { margin-right: 10px; color: #fff; font-size: 13px; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.file-size { color: rgba(255, 255, 255, 0.4); font-size: 11px; }
.status-text { color: #00ffaa; font-size: 11px; }
.remove-icon { color: rgba(255, 255, 255, 0.3); font-size: 18px; cursor: pointer; }
.remove-icon:hover { color: #ff3333; }

/* 系统按钮 */
.action-bar { margin-top: 10px; }
.cyber-submit-btn { width: 100%; position: relative; background: rgba(0, 30, 45, 0.8); border: 1px solid rgba(0, 229, 255, 0.5); padding: 18px; cursor: pointer; overflow: hidden; transition: all 0.2s; }
.btn-bg { position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.2), transparent); transition: left 0.4s; }
.cyber-submit-btn:hover:not(:disabled) .btn-bg { left: 100%; }
.btn-text { position: relative; z-index: 2; color: #00e5ff; font-size: 16px; font-weight: 900; letter-spacing: 2px; }
.cyber-submit-btn:hover:not(:disabled) { box-shadow: 0 0 30px rgba(0, 229, 255, 0.3); }
.cyber-submit-btn:disabled { border-color: rgba(255, 255, 255, 0.1); background: rgba(255, 255, 255, 0.05); cursor: not-allowed; }

.cyber-panel.is-analyzing { border-color: rgba(255, 170, 0, 0.8); box-shadow: 0 0 50px rgba(255, 170, 0, 0.2), inset 0 0 30px rgba(255, 170, 0, 0.1); animation: panelOverload 0.2s infinite; }
.cyber-panel.is-analyzing .terminal-bracket { border-color: rgba(255, 170, 0, 1); }
.cyber-panel.is-analyzing .cyber-submit-btn:disabled { border-color: rgba(255, 170, 0, 0.5); background: rgba(255, 170, 0, 0.1); }
.cyber-panel.is-analyzing .cyber-submit-btn:disabled .btn-text { color: #ffaa00; text-shadow: 0 0 10px rgba(255, 170, 0, 0.8); animation: pulseOpacity 1s infinite alternate; }
.cyber-panel.is-success { border-color: rgba(0, 255, 170, 0.8); box-shadow: 0 0 50px rgba(0, 255, 170, 0.2), inset 0 0 30px rgba(0, 255, 170, 0.1); }
.cyber-panel.is-success .terminal-bracket { border-color: rgba(0, 255, 170, 1); }
.cyber-panel.is-success .cyber-submit-btn:disabled { border-color: rgba(0, 255, 170, 0.5); background: rgba(0, 255, 170, 0.1); }
.cyber-panel.is-success .cyber-submit-btn:disabled .btn-text { color: #00ffaa; text-shadow: 0 0 10px rgba(0, 255, 170, 0.8); }
.cyber-panel.is-error { border-color: rgba(255, 51, 51, 0.8); box-shadow: 0 0 50px rgba(255, 51, 51, 0.2), inset 0 0 30px rgba(255, 51, 51, 0.1); animation: terminalErrorShake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both; }
.cyber-panel.is-error .terminal-bracket { border-color: rgba(255, 51, 51, 1); }
.cyber-panel.is-error .cyber-submit-btn:disabled { border-color: rgba(255, 51, 51, 0.5); background: rgba(255, 51, 51, 0.1); }
.cyber-panel.is-error .cyber-submit-btn:disabled .btn-text { color: #ff3333; text-shadow: 0 0 10px rgba(255, 51, 51, 0.8); animation: pulseOpacity 0.3s infinite alternate; }

.error-badge { background: rgba(255, 51, 51, 0.1); border-color: rgba(255, 51, 51, 0.5); color: #ff3333; }
.error-badge .badge-icon { background: #ff3333; box-shadow: 0 0 8px #ff3333; animation: none; }

/* ================= 战术报告 HUD ================= */
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
.hud-title { user-select: none; color: #fff; font-family: 'Orbitron', sans-serif; font-size: 20px; letter-spacing: 3px; margin: 0; text-shadow: 0 0 10px rgba(0, 229, 255, 0.6); }
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

/* 影像观测器 */
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

/* 核心指标与诊断矩阵 */
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

/* 深度病害特征解析卡片样式 */
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

/* ================= 放大图片模态框 ================= */
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

/* ================= 🚨 动态导出 PDF 模板样式 ================= */
.pdf-export-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.85); z-index: 99999; display: flex; align-items: center; justify-content: center; }
.export-loader { text-align: center; color: #00e5ff; font-family: monospace; position: absolute; z-index: 10; }
.export-loader i { font-size: 50px; margin-bottom: 15px; }
.export-loader p { font-size: 16px; letter-spacing: 2px; }

/* PDF 隐藏容器（置于屏幕外部），由于包在 v-if 内，它会在点击导出时动态挂载 */
.pdf-hidden-container { position: absolute; top: 0; left: -9999px; width: 850px; }

.formal-pdf { background: #ffffff; color: #000000; padding: 40px; font-family: 'SimSun', 'Songti SC', 'Times New Roman', serif; }
.pdf-header-official { text-align: center; margin-bottom: 30px; }
.pdf-doc-title { font-size: 32px; font-weight: bold; margin: 0 0 20px 0; letter-spacing: 4px; font-family: 'SimHei', sans-serif; }
.pdf-doc-meta { display: flex; justify-content: space-between; font-size: 14px; font-family: sans-serif; margin-bottom: 10px; color: #333; }
.pdf-divider { border-top: 3px solid #000; border-bottom: 1px solid #000; height: 2px; }

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

.formal-pdf :deep(.t-line) { margin: 8px 0; color: #000; font-size: 14px; line-height: 1.6; font-family: 'SimSun', serif; }
.formal-pdf :deep(.t-prefix) { display: none; }
.formal-pdf :deep(.text-red), .formal-pdf :deep(.text-orange), .formal-pdf :deep(.text-green) { color: #000 !important; text-shadow: none !important; font-weight: bold; }
.formal-pdf :deep(.text-cyan) { color: #000 !important; text-shadow: none !important; font-weight: bold; font-family: 'SimHei', sans-serif; font-size: 15px; }

@keyframes deployFade { 0% { opacity: 0; transform: translateY(20px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes hudBootUp { 0% { opacity: 0; transform: scaleY(0.01) scaleX(0.8); } 50% { opacity: 1; transform: scaleY(0.01) scaleX(1); } 100% { transform: scaleY(1) scaleX(1); } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
@keyframes scanMove { 0% { top: 0%; } 100% { top: 100%; } }
@keyframes radarSpin { 100% { transform: rotate(360deg); } }
@keyframes panelOverload { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-1px, 1px); } 50% { transform: translate(1px, -1px); } 75% { transform: translate(1px, 1px); } }
@keyframes pulseOpacity { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
@keyframes terminalErrorShake { 0%, 100% { transform: translate3d(0, 0, 0); } 10%, 90% { transform: translate3d(-2px, 0, 0); } 20%, 80% { transform: translate3d(5px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-10px, 0, 0); } 40%, 60% { transform: translate3d(10px, 0, 0); } }
.hud-fade-enter-active, .hud-fade-leave-active { transition: opacity 0.3s; }
.hud-fade-enter-from, .hud-fade-leave-to { opacity: 0; }
.terminal-expand-enter-active, .terminal-expand-leave-active { transition: all 0.3s ease; max-height: 800px; opacity: 1; overflow: hidden; }
.terminal-expand-enter-from, .terminal-expand-leave-to { max-height: 0; opacity: 0; margin-top: 0; }
</style>