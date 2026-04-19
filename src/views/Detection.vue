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
          <h2 class="cyber-title"> 桥曈 DETECT</h2>
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
                status === 'analyzing' ? ' 桥曈 正 在 诊 断 中 ' : 
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
                <h2 class="hud-title"> 桥曈 深度诊断结果</h2>
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
      total_defect_count: 3,
      overall_risk_level: '低危',
      class_count: { 'spalling': 3 },
      risk_distribution: { high: 0, medium: 1, low: 2 },
      defects_detail: [
        { defect_id: 'D-SGL-301', type: 'spalling', name: '剥落', physical_length: 42, max_width: 35, severity: 'medium' },
        { defect_id: 'D-SGL-302', type: 'spalling', name: '剥落', physical_length: 17, max_width: 14, severity: 'low' },
        { defect_id: 'D-SGL-303', type: 'saplling', name: '剥落', physical_length: 6, max_width: 4, severity: 'low' }
      ]
    },
    aiSummaryHtml: `
      <p class="t-line text-orange"><span class="t-prefix">></span> [ 综合研判 ] 检出群发性混凝土表面剥落，评估为结构耐久性中度退化。</p>
      <p class="t-line">  ├─ 核心特征: 目标区块共提取到 3 处独立剥落区，最大缺损尺寸达 42x35cm，形态呈现典型的不规则离散分布。</p>
      <p class="t-line">  ├─ 深度推演: 结合 Feature Map 深度特征热力图分析，当前剥落已突破表层防线，内部混凝土基体微观孔隙已直接暴露。</p>
      <p class="t-line">  └─ 劣化分析: 保护层的局部丧失将大幅加速该区域的碳化进程。若遭遇冻融循环或雨水冲蚀，病害将沿边缘应力集中区迅速向深层扩展，未来极易诱发底层钢筋锈胀。</p>
      <br/>
      <p class="t-line"><strong class="text-cyan">[ 修复与全生命周期干预建议 ]</strong></p>
      <p class="t-line">  1. 状态评级: 当前病害尚未触发结构承载力断崖式衰减，但表观耐久性已被破坏，建议启动 [ 二级预防性养护响应 ]。</p>
      <p class="t-line">  2. 基层预处理: 采用机械剔凿或高压水射流技术，彻底清除剥落区四周的松散、酥软及隐性空鼓混凝土，直至露出坚实基面。</p>
      <p class="t-line">  3. 截面重塑工艺: 对粗糙基面涂刷高性能双向界面剂，随后采用高粘结力、低收缩的专用聚合物修补砂浆进行多道填平压实，恢复原始截面流线。</p>
      <p class="t-line">  4. 终极防护升级: 待修补区养护成型后，建议对该受损面整体喷涂硅烷浸渍剂或柔性防碳化涂料，彻底封堵毛细吸水通道，重构长效物理屏障。</p>
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
      total_defect_count: 3,
      overall_risk_level: '高危',
      class_count: { 'exposed rebar': 3 },
      risk_distribution: { high: 2, medium: 1, low: 0 },
      defects_detail: [
        { defect_id: 'D-MUL-201', type: 'exposed rebar', name: '钢筋裸露', physical_length: 126, max_width: 37, severity: 'high' },
        { defect_id: 'D-MUL-202', type: 'exposed rebar', name: '钢筋裸露', physical_length: 58, max_width: 22, severity: 'high' },
        { defect_id: 'D-MUL-203', type: 'exposed rebar', name: '钢筋裸露', physical_length: 23, max_width: 19, severity: 'medium' }
      ]
    },
    aiSummaryHtml: `
      <p class="t-line text-red"><span class="t-prefix">></span> [ 综合研判 ] 检出大面积深层钢筋裸露，评估为结构承载力严重受损（极高危）。</p>
      <p class="t-line">  ├─ 核心特征: 目标区块提取到 3 处连片分布的钢筋裸露区，保护层混凝土已完全崩落丧失，致使底层主筋与箍筋交织网格大面积直接暴露于外部环境。</p>
      <p class="t-line">  ├─ 深度推演: 结合 Feature Map 特征热力图极高响应峰值分析，该区域已发生深度贯穿性结构剥落，周边未脱落基体大概率已形成严重的隐性空鼓与微观暗裂。</p>
      <p class="t-line">  └─ 劣化分析: 核心承重构件失去碱性钝化膜保护，钢筋锈胀效应将呈指数级加速。有效受力截面被极度削弱，抗剪与抗拉能力出现断崖式下降，当前面临极高的突发性局部失效或整体失稳风险。</p>
      <br/>
      <p class="t-line"><strong class="text-cyan">[ 应急响应与结构性修复干预建议 ]</strong></p>
      <p class="t-line">  1. 应急管控: 立即触发 [ 一级红色预警响应 ]，建议对该受损结构关联区域实施紧急物理隔离与重载交通强制限行，严防次生坍塌灾害发生。</p>
      <p class="t-line">  2. 深度探伤: 紧急调遣结构专家组介入，采用探地雷达 (GPR) 或超声断层扫描技术进行内部缺陷无损层析成像，重新验算构件剩余承载力极限状态 (ULS)。</p>
      <p class="t-line">  3. 截面置换重塑: 严格实施全方位高压水除锈及化学阻锈处理。针对巨量截面损失，常规修补砂浆已无法满足力学传导要求，须采用喷射高强自密实聚合物混凝土进行结构性原位置换重构。</p>
      <p class="t-line">  4. 体系强化加固: 截面基体恢复后，强烈建议引入外包注胶钢板法或粘贴高模量碳纤维复合材料 (CFRP) 进行抗剪补强，并同步接入结构健康监测物联网 (SHM) 进行长效应力追踪。</p>
    `
  },
  {
    name: 'IMG_02.jpg',
    url: '/example/show_many/image2/page.jpg',
    maskUrl: '/example/show_many/image2/mask.png',
    featureUrl: '/example/show_many/image2/feature.png',
    reportData: {
      total_defect_count: 3,
      overall_risk_level: '低危',
      class_count: { crack: 1, 'exposed rebar': 2 },
      risk_distribution: { high: 0, medium: 1, low: 2 },
      defects_detail: [
        { defect_id: 'D-MUL-204', type: 'crack', name: '裂缝', physical_length: 35, max_width: 23, severity: 'medium' },
        { defect_id: 'D-MUL-204', type: 'crack', name: '裂缝', physical_length: 13, max_width: 4, severity: 'low' },
        { defect_id: 'D-MUL-204', type: 'crack', name: '裂缝', physical_length: 7, max_width: 2, severity: 'low' }
      ]
    },
    aiSummaryHtml: `
      <p class="t-line text-green"><span class="t-prefix">></span> [ 综合研判 ] 检出复合型浅表病害（局部开裂与钢筋裸露），评估为表观耐久性轻度受损（低危）。</p>
      <p class="t-line">  ├─ 核心特征: 目标区块共提取到 3 处缺陷特征，包含 1 处表面开裂受损区（最大物理界限达 35x23cm）及 2 处局部钢筋裸露（尺寸分别为 13x4cm 与 7x2cm）。</p>
      <p class="t-line">  ├─ 深度推演: 结合 Feature Map 浅层特征热力图分析，高频响应主要集中于混凝土保护层破损边缘，核心承重体系及主筋应力传导路径尚未受到实质性破坏。</p>
      <p class="t-line">  └─ 劣化分析: 虽当前评定为低危，但防腐屏障的局部失效已为水汽及氯离子打开微观入侵通道。长期暴露将引发钢筋表面的电化学腐蚀，产生锈胀应力并导致周边基体进一步剥离。</p>
      <br/>
      <p class="t-line"><strong class="text-cyan">[ 修复与全生命周期干预建议 ]</strong></p>
      <p class="t-line">  1. 状态评级: 结构主体仍处于安全服役期，病害属于早期轻度劣化，建议纳入 [ 三级预防性常规养护 ] 序列，当前无需限制交通荷载。</p>
      <p class="t-line">  2. 靶向除锈封闭: 针对 13x4cm 及 7x2cm 的裸露点，需采用小型机械进行靶向除锈，表面涂覆聚合物防锈底漆后，利用高粘结力环氧树脂砂浆进行微创封闭。</p>
      <p class="t-line">  3. 浅层基面修复: 针对 35x23cm 的主受损区，需彻底清除内部延伸的疏松、劣化表皮，清扫粉尘后使用高强自流平修补砂浆恢复保护层厚度。</p>
      <p class="t-line">  4. 长效物理防线: 修补面固化验收后，建议对该辐射区域整体喷涂硅烷浸渍剂，彻底阻断毛细孔隙吸水，有效提升构件表层的抗渗与抗碳化能力。</p>
    `
  },
  {
    name: 'IMG_03.jpg',
    url: '/example/show_many/image3/page.jpg',
    maskUrl: '/example/show_many/image3/mask.png',
    featureUrl: '/example/show_many/image3/feature.png',
    reportData: {
      total_defect_count: 2,
      overall_risk_level: '中危',
      class_count: { crack: 2 },
      risk_distribution: { high: 1, medium: 1, low: 0 },
      defects_detail: [
        { defect_id: 'D-MUL-205', type: 'crack', name: '裂缝', physical_length: 57, max_width: 1, severity: 'high' },
        { defect_id: 'D-MUL-206', type: 'crack', name: '裂缝', physical_length: 24, max_width: 1, severity: 'medium' },
      ]
    },
    aiSummaryHtml: `
      <p class="t-line text-orange"><span class="t-prefix">></span> [ 综合研判 ] 检出显著的结构受力型裂缝，评估为承载体系中度受损（中危）。</p>
      <p class="t-line">  ├─ 核心特征: 目标区块内共检出 2 处清晰的线性开裂。其中主裂缝延伸长度达 57cm，且局部最大张开宽度达到 1cm，呈典型的不均匀扩展形态。</p>
      <p class="t-line">  ├─ 深度推演: 结合 Feature Map 线性应力集中热力分布分析，高达 1cm 的宏观裂缝宽度表明局部截面可能已部分退出工作，或伴随内部受拉主筋的屈服变形，结构内力传导路径已发生偏移。</p>
      <p class="t-line">  └─ 劣化分析: 此级别宽度的裂缝已彻底丧失物理防护屏障作用。雨水、氧气及除冰盐等腐蚀介质可长驱直入直达钢筋表面；若遭遇低温冰冻，冰晶膨胀应力将导致裂缝迅速向纵深撕裂。</p>
      <br/>
      <p class="t-line"><strong class="text-cyan">[ 修复与全生命周期干预建议 ]</strong></p>
      <p class="t-line">  1. 状态评级: 鉴于局部裂缝宽度已远超常规桥梁规范允许限值，建议立即提升至 [ 二级结构性干预响应 ]，并在修复前对该墩台/梁体进行持续位移监测。</p>
      <p class="t-line">  2. 溯源排查: 严禁盲目封堵，必须由专业工程师引入超声波无损探伤技术探测裂缝实际深度，精准排查诱发开裂的根本致灾因子（如不均匀沉降、疲劳超载或严重温缩）。</p>
      <p class="t-line">  3. 恒压灌浆重塑: 针对 1cm 宽的深层主裂缝，必须采用壁可法（BICS）或低压恒速注浆工艺，将高韧性、低粘度的改性环氧树脂注入结构深处，强效恢复截面整体刚度。</p>
      <p class="t-line">  4. 局部应力补强: 树脂固化成型后，视结构复核计算结果，建议在裂缝垂直分布方向粘贴高抗拉强度的碳纤维复合板（CFRP）进行抗剪/抗弯强化，彻底遏制裂缝的二次发育。</p>
    `
  }
];

// 场景 3：ZIP批量航拍
const mockDataZip = [
  {
    name: 'IMG_01.jpg',
    url: '/example/show_zip/image1/page.jpg',
    maskUrl: '/example/show_zip/image1/mask.png',
    featureUrl: '/example/show_zip/image1/feature.png',
    reportData: {
      total_defect_count: 4,
      overall_risk_level: '中危',
      class_count: { 'exposed rebar': 4 },
      risk_distribution: { high: 0, medium: 4, low: 0 },
      defects_detail: [
        { defect_id: 'D-ZIP-101', type: 'exposed rebar', name: '钢筋裸露', physical_length: 21, max_width: 3, severity: 'medium' },
        { defect_id: 'D-ZIP-102', type: 'exposed rebar', name: '钢筋裸露', physical_length: 29, max_width: 3, severity: 'medium' },
        { defect_id: 'D-ZIP-103', type: 'exposed rebar', name: '钢筋裸露', physical_length: 25, max_width: 3, severity: 'medium' },
        { defect_id: 'D-ZIP-104', type: 'exposed rebar', name: '钢筋裸露', physical_length: 26, max_width: 3, severity: 'medium' }
      ]
    },
    aiSummaryHtml: `
      <p class="t-line text-orange"><span class="t-prefix">></span> [ 综合研判 ] 检出群发性顺筋锈胀剥落，评估为附属构件耐久性中度衰减（中危）。</p>
      <p class="t-line">  ├─ 核心特征: 目标区块（护栏边缘区域）精准提取到 4 处平行的纵向钢筋裸露病害。其中最大连续外露长度达 29cm，锈胀破损宽度约 3cm。</p>
      <p class="t-line">  ├─ 深度推演: 结合 Feature Map 的纵向线性热力响应分析，此病害为典型的“锈胀开裂”力学演化。内部主筋表面的碱性钝化膜已被破坏，铁锈体积膨胀产生的巨大径向拉应力突破了外层混凝土的抗拉极限，导致保护层沿受力主筋方向呈劈裂脱落。</p>
      <p class="t-line">  └─ 劣化分析: 裸露主筋已完全置于大气与水汽交替的电化学活化区，截面锈损将呈加速衰减趋势。虽不直接威胁桥梁主承重体系，但严重削弱了该边缘防撞构件的抗冲击安全冗余度。</p>
      <br/>
      <p class="t-line"><strong class="text-cyan">[ 修复与全生命周期干预建议 ]</strong></p>
      <p class="t-line">  1. 状态评级: 构件外层防腐物理体系已局部失效，建议启动 [ 专项防腐与界面修复响应 ]，遏制锈蚀向内部健康节点蔓延。</p>
      <p class="t-line">  2. 环向靶向除锈: 严禁未经处理直接封堵。必须对裸露主筋进行 360 度机械打磨或喷砂除锈至露出金属本色（Sa2.5标准），随后立即涂覆环氧富锌底漆或渗透型化学阻锈剂进行底层钝化。</p>
      <p class="t-line">  3. 截面抗裂重塑: 彻底剔除周遭松散、起壳的劣化基体，采用掺入抗裂微纤维的高强聚合物修补砂浆进行原位几何重塑，确保新老界面的高强粘结。</p>
      <p class="t-line">  4. 阻隔屏障重建: 砂浆固化成型后，强烈建议对该批次构件整体喷涂渗透性硅烷防水剂或高耐候氟碳涂层，彻底封死外部水分及氯离子的侵入管线。</p>
    `
  },
  {
    name: 'IMG_02.jpg',
    url: '/example/show_zip/image2/page.jpg',
    maskUrl: '/example/show_zip/image2/mask.png',
    featureUrl: '/example/show_zip/image2/feature.png',
    reportData: {
      total_defect_count: 1,
      overall_risk_level: '高危',
      class_count: { crack: 1 },
      risk_distribution: { high: 1, medium: 0, low: 0 },
      defects_detail: [
        { defect_id: 'D-ZIP-105', type: 'crack', name: '裂缝', physical_length: 93, max_width: 2, severity: 'high' },
      ]
    },
    aiSummaryHtml: `
      <p class="t-line text-red"><span class="t-prefix">></span> [ 综合研判 ] 检出典型分叉型结构受力裂缝，评估为承载体系严重受损（高危）。</p>
      <p class="t-line">  ├─ 核心特征: 目标区块提取到 1 处呈 "Y" 字型放射状扩展的主裂缝，主干长度延伸约 68cm，最大张开宽度达 0.4cm。</p>
      <p class="t-line">  ├─ 深度推演: 结合 Feature Map 高频且连续的线性热力响应分析，该裂缝已具备深度贯穿倾向。其分叉拓扑形态表明，局部区域正承受复杂的双向拉剪复合应力，原有的受力传导路径已发生严重畸变。</p>
      <p class="t-line">  └─ 劣化分析: 裂缝的多向分支扩展将极速割裂混凝土基体的整体刚度。若不及时阻断，动水压力将顺主干直达钢筋骨架，引发内部主筋的群体性电化学腐蚀与保护层的大面积连片剥离。</p>
      <br/>
      <p class="t-line"><strong class="text-cyan">[ 修复与全生命周期干预建议 ]</strong></p>
      <p class="t-line">  1. 状态评级: 裂缝形态复杂且宽度超出安全冗余阈值，建议立即触发 [ 一级结构性干预响应 ]，并增设动态裂缝计严密监测其疲劳扩展速率。</p>
      <p class="t-line">  2. 深层高压灌浆: 必须采取封闭式高压注浆工艺。沿裂缝分叉走向密集布设注浆嘴，注入超低粘度、高渗透性的改性环氧树脂，强力粘结离散的混凝土区块。</p>
      <p class="t-line">  3. 复合应力补强: 针对 "Y" 型分叉的核心应力集中区，建议在内部灌浆固化后，于表面采用跨缝植筋（骑马钉）或呈正交方向多层粘贴碳纤维布（CFRP），彻底锁死裂缝的张开自由度。</p>
    `
  },
  {
    name: 'IMG_03.jpg',
    url: '/example/show_zip/image3/page.jpg',
    maskUrl: '/example/show_zip/image3/mask.png',
    featureUrl: '/example/show_zip/image3/feature.png',
    reportData: {
      total_defect_count: 1,
      overall_risk_level: '中危',
      class_count: { spalling: 1 },
      risk_distribution: { high: 0, medium: 1, low: 0 },
      defects_detail: [
        { defect_id: 'D-ZIP-106', type: 'spalling', name: '剥落', physical_length: 49, max_width: 36, severity: 'medium' },
      ]
    },
    aiSummaryHtml: `
      <p class="t-line text-orange"><span class="t-prefix">></span> [ 综合研判 ] 检出孤立型深层混凝土剥落，评估为局部保护层中度失效（中危）。</p>
      <p class="t-line">  ├─ 核心特征: 目标区块精准提取到 1 处显著的块状剥落缺陷，最大几何包络尺寸达 49x36cm，呈现典型的脆性断裂剥离特征。</p>
      <p class="t-line">  ├─ 深度推演: 结合 Feature Map 的中心高亮凝聚态分布，该剥落面已突破表层砂浆，直达粗骨料层。其边缘应力梯度变化剧烈，暗示周边基体可能已处于悬浮或半脱离状态。</p>
      <p class="t-line">  └─ 劣化分析: 虽暂未发生主筋裸露，但该区域的有效保护层厚度已遭断崖式削减。二氧化碳及酸性游离离子将直接侵蚀深层基体，中长期视域下钢筋钝化膜被击穿的风险急剧攀升。</p>
      <br/>
      <p class="t-line"><strong class="text-cyan">[ 修复与全生命周期干预建议 ]</strong></p>
      <p class="t-line">  1. 状态评级: 局部耐久性防线已被突破，建议纳入 [ 二级结构性修复序列 ]，务必在下个雨季或冻融循环期来临前完成闭环处置。</p>
      <p class="t-line">  2. 界面拓扑清理: 严禁直接涂抹覆盖。必须采用机械手段将剥落区外延扩凿 2-3cm，彻底剔除边缘暗裂与松动骨料，形成向内倾斜的企口倒角，以强化后续修复的力学咬合。</p>
      <p class="t-line">  3. 截面无收缩重塑: 对粗糙基面进行湿润及界面剂涂刷后，采用带有抗下垂特性的高强聚合物修补砂浆进行分层夯实填补，重构构件原始几何线型。</p>
      <p class="t-line">  4. 屏障强化涂装: 修复面终凝验收后，对该区域及周边 50cm 缓冲带整体施加渗透型硅烷阻水剂或聚氨酯防碳化面漆，重建抵抗侵蚀介质的外部极效防线。</p>
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

// 新增：重置 HUD 左右两列的滚动条到底部
const resetHUDScroll = () => {
  nextTick(() => {
    const cols = document.querySelectorAll('.hud-scroll-col');
    cols.forEach(col => col.scrollTop = 0);
  });
};

const openReportModal = () => { 
  showReportModal.value = true; 
  currentImageIndex.value = 0; 
  resetHUDScroll(); // 打开时重置
};
const closeReportModal = () => { showReportModal.value = false; clearFiles(); status.value = 'idle'; };

const nextImage = () => { 
  if (currentImageIndex.value < resultImages.value.length - 1) currentImageIndex.value++; 
  else currentImageIndex.value = 0; 
  resetHUDScroll(); // 切换下一张时重置
};

const prevImage = () => { 
  if (currentImageIndex.value > 0) currentImageIndex.value--; 
  else currentImageIndex.value = resultImages.value.length - 1; 
  resetHUDScroll(); // 切换上一张时重置
};

const setCurrentImage = (idx) => { 
  currentImageIndex.value = idx; 
  resetHUDScroll(); // 点击小圆点切换时重置
};

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

const toggleAiSummary = () => { showAiSummary.value = !showAiSummary.value; };

const downloadPDF = async () => {
  if (isExporting.value) return;
  isExporting.value = true;
  
  // 等待 Vue 把隐藏的 PDF 模板和加载动画挂载到真实 DOM 上
  await nextTick();

  setTimeout(() => {
    const element = document.getElementById('pdf-pure-template');
    if (!element) {
        isExporting.value = false;
        return;
    }
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