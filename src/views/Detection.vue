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
          <h2 class="cyber-title">SPANS DETECT</h2>
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
              {{ status === 'analyzing' ? 'SPANS 正 在 诊 断 中 ' : (status === 'success' ? '诊 断 分 析 已 完 成' : '点 击 开 始 诊 断') }}
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
                <h2 class="hud-title">SPANS 深度诊断结果</h2>
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

            <div class="hud-body-wrapper">
              
              <div class="hud-scroll-col hud-col-left">
                
                <div class="hud-section-title">
                  <span class="deco-box"></span> 影像观测器 ({{ resultImages.length }}份)
                </div>
                
                <div class="cyber-carousel-container">
                  <div class="carousel-track">
                    <div class="hud-image-viewer" v-for="(img, idx) in resultImages" :key="idx" v-show="currentImageIndex === idx">
                      <div class="image-bracket ib-tl"></div>
                      <div class="image-bracket ib-tr"></div>
                      <div class="image-bracket ib-bl"></div>
                      <div class="image-bracket ib-br"></div>
                      <img :src="img.url" class="real-image" crossorigin="anonymous" />
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
                  <span class="deco-box"></span> AI深度解析报告
                </div>
                <button class="hud-ai-trigger-btn" @click="toggleAiSummary">
                  <span class="btn-glitch-text">{{ showAiSummary ? '<< AI 深度解析报告' : '>> 点击获取 AI 深度解析报告' }}</span>
                </button>
                
                <transition name="terminal-expand">
                  <div class="hud-terminal" v-show="showAiSummary">
                    <div class="terminal-header">
                      <span class="terminal-dot red"></span><span class="terminal-dot yellow"></span><span class="terminal-dot green"></span>
                      <span class="terminal-title"></span>
                    </div>
                    <div class="terminal-content">
                      <div class="typewriter-text" v-html="aiSummaryHtml"></div>
                      <div class="terminal-cursor">_</div>
                    </div>
                  </div>
                </transition>
              </div>

              <div class="hud-scroll-col hud-col-right">
                
                <div class="hud-section-title">
                  <span class="deco-box"></span> SPANS 核心诊断指标
                </div>
                
                <div class="hud-stats-grid">
                  <div class="hud-stat-card">
                    <div class="stat-border-top"></div><div class="stat-label">图片数量</div>
                    <div class="stat-value text-cyan">{{ reportData.task_summary.image_count }}</div>
                  </div>
                  <div class="hud-stat-card warning-card">
                    <div class="stat-border-top"></div><div class="stat-label">病害数量</div>
                    <div class="stat-value text-orange">{{ reportData.task_summary.total_defect_count }}</div>
                  </div>
                  <div class="hud-stat-card">
                    <div class="stat-border-top"></div><div class="stat-label">平均面积</div>
                    <div class="stat-value text-green">{{ reportData.average_area }}<span class="unit">mm²</span></div>
                  </div>
                  <div class="hud-stat-card">
                    <div class="stat-border-top"></div><div class="stat-label">平均长度</div>
                    <div class="stat-value text-green">{{ reportData.average_length }}<span class="unit">mm</span></div>
                  </div>
                </div>

                <div class="hud-section-title mt-20">
                  <span class="deco-box"></span> 病害全息图谱
                </div>
                
                <div class="hud-charts-grid">
                  <div class="hud-chart-box">
                    <div class="chart-corner cc-tl"></div><div class="chart-corner cc-br"></div>
                    <h4 class="chart-title">[ 类别侦测扫描 ]</h4>
                    <div class="chart-wrapper"><canvas ref="classChartCanvas"></canvas></div>
                  </div>
                  
                  <div class="hud-chart-box">
                    <div class="chart-corner cc-tl"></div><div class="chart-corner cc-br"></div>
                    <h4 class="chart-title">[ 风险预警分布 ]</h4>
                    <div class="chart-wrapper donut-wrapper">
                      <div class="donut-center-text">
                        <span class="core-label">RISK</span><span class="core-status text-orange">WARN</span>
                      </div>
                      <canvas ref="riskChartCanvas"></canvas>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <teleport to="body">
      <div v-if="isExporting" class="pdf-export-overlay">
        <div class="pdf-hidden-container">
          <div id="pdf-pure-template">
            
            <div class="pdf-header">
              <h1>SPANS DETECT // 深度诊断报告</h1>
              <p>生成时间: {{ new Date().toLocaleString() }}</p>
            </div>

            <div class="pdf-section">
              <h3>[ CORE_METRICS / 核心诊断指标 ]</h3>
              <div class="pdf-metrics-row">
                <div class="pdf-metric-item"><strong>图片总数:</strong> {{ reportData.task_summary.image_count }}</div>
                <div class="pdf-metric-item"><strong>总病害数:</strong> {{ reportData.task_summary.total_defect_count }}</div>
                <div class="pdf-metric-item"><strong>平均面积:</strong> {{ reportData.average_area }} mm²</div>
                <div class="pdf-metric-item"><strong>平均长度:</strong> {{ reportData.average_length }} mm</div>
              </div>
            </div>

            <div class="pdf-section">
              <h3>[ AI_CORE / 智能解析与干预建议 ]</h3>
              <div class="pdf-ai-content" v-html="aiSummaryHtml"></div>
            </div>

            <div class="pdf-section">
              <h3>[ VISUAL_FEED / 影像观测回传详情 ]</h3>
              <div class="pdf-image-item" v-for="(img, idx) in resultImages" :key="idx">
                <p class="pdf-img-title">>> 影像档档案号: {{ img.name }}</p>
                <img :src="img.url" class="pdf-img-src" crossorigin="anonymous" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </teleport>

  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, nextTick } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import Chart from 'chart.js/auto';
import html2pdf from 'html2pdf.js';

// ================= 基本状态管理 =================
const fileInput = ref(null);
const isDragging = ref(false);       // 拖拽激活状态
const status = ref('idle');          // 任务状态：idle, analyzing, success
const uploadedFiles = ref([]);       // 已上传的文件列表
const isLeaving = ref(false);        // 路由跳转控制开关

let analyzeTimer = null;             // 模拟分析计时器
let successTimer = null;             // 成功延迟弹窗计时器

// ================= 弹窗与控制状态 =================
const showReportModal = ref(false);  // 控制战术仪表盘(弹窗)显示
const showAiSummary = ref(false);    // 控制 AI 诊断终端是否折叠
const isExporting = ref(false);      // 切换当前是否处于生成 PDF 模式
const currentImageIndex = ref(0);    // 轮播图当前聚焦的下标

// ================= 图表实例控制 =================
const classChartCanvas = ref(null);
const riskChartCanvas = ref(null);
let classChartInstance = null;
let riskChartInstance = null;

// ================= 模拟数据源 =================
// 统计与概览数据
const reportData = ref({
  task_summary: {
    image_count: 3,
    total_defect_count: 8,
    class_count: { crack: 4, efflorescence: 2, 'exposed rebar': 1, spalling: 1 },
    risk_distribution: { low: 3, medium: 3, high: 2 }
  },
  average_area: 1062, 
  average_length: 139 
});

// 后端回传的渲染好画框的图片
const resultImages = ref([
  { name: 'IMG_CORE_01_裂缝侦测.jpg', url: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=800&h=450' },
  { name: 'IMG_CORE_02_泛碱透视.jpg', url: 'https://images.unsplash.com/photo-1590483736622-398b6ea46b41?auto=format&fit=crop&q=80&w=800&h=450' },
  { name: 'IMG_CORE_03_钢筋裸露.jpg', url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800&h=450' }
]);

// 模拟 AI 解析生成的终端结果文本（包含 HTML 样式类）
const aiSummaryHtml = ref(`
  <p class="t-line"><span class="t-prefix">></span> 初始化桥梁结构深度扫描...</p>
  <p class="t-line text-green"><span class="t-prefix">></span> 扫描完成。发现高危结构异常信号。</p>
  <br/>
  <p class="t-line"><span class="t-prefix">></span> <strong class="text-cyan">[ 病害侦测清单 ]</strong></p>
  <p class="t-line">  ├─ 裂缝 (Crack): <span class="text-orange">4 处</span></p>
  <p class="t-line">  ├─ 泛碱 (Efflorescence): 2 处</p>
  <p class="t-line">  ├─ 钢筋裸露 (Exposed Rebar): <span class="text-red">1 处</span></p>
  <p class="t-line">  └─ 剥落 (Spalling): 1 处</p>
  <br/>
  <p class="t-line"><span class="t-prefix">></span> <strong class="text-cyan">[ 干预建议 ]</strong></p>
  <p class="t-line">  1. 警告: 当前桥梁系统整体评定为 <span class="t-bg-warning">[ 中等风险 ]</span></p>
  <p class="t-line">  2. 指令: 优先对裂缝执行高分子材料注射密封。</p>
  <p class="t-line">  3. 指令: 对钢筋裸露区进行紧急除锈与环氧砂浆回填。</p>
`);

// ================= 生命周期钩子 =================
// 离开路由前销毁并重置状态，防止内存泄漏和页面卡顿
onBeforeRouteLeave((to, from, next) => {
  // ⭐ 新增拦截逻辑：处于分析（抖动）状态时，严禁离开当前路由
  if (status.value === 'analyzing') {
    alert('SYSTEM_WARNING: [ 高危操作 ] 系统正在执行核心深度扫描，强制中断将导致数据流损坏，请等待诊断完成！');
    next(false); // 拒绝路由跳转请求
    return;
  }

  // 正常离开时的清理逻辑
  isLeaving.value = true;
  uploadedFiles.value = [];
  if (showReportModal.value) closeReportModal();
  nextTick(() => { next(); });
});

onBeforeUnmount(() => {
  if (analyzeTimer) clearTimeout(analyzeTimer);
  if (successTimer) clearTimeout(successTimer);
  destroyCharts();
});

// ================= 轮播图控制 =================
// 切换下一张，循环播放
const nextImage = () => { 
  if (currentImageIndex.value < resultImages.value.length - 1) currentImageIndex.value++; 
  else currentImageIndex.value = 0; 
};

// 切换上一张，循环播放
const prevImage = () => { 
  if (currentImageIndex.value > 0) currentImageIndex.value--; 
  else currentImageIndex.value = resultImages.value.length - 1; 
};

// 点击指示器直接跳转特定图片
const setCurrentImage = (idx) => { 
  currentImageIndex.value = idx; 
};

// ================= 上传与分析业务 =================
// 唤起系统文件选择框
const triggerFileInput = () => { 
  if (status.value === 'idle') fileInput.value.click(); 
};

// 处理拖拽放置事件
const handleDrop = (e) => { 
  isDragging.value = false; 
  if (status.value !== 'idle') return; 
  if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files); 
};

// 处理输入框选择事件
const handleFileSelect = (e) => { 
  if (e.target.files.length > 0) processFiles(e.target.files); 
  e.target.value = ''; 
};

// 对文件进行校验过滤（限制 50MB）并装填入队
const processFiles = (files) => {
  const maxSize = 50 * 1024 * 1024;
  Array.from(files).forEach(file => {
    if (file.size > maxSize) return alert(`SYSTEM_WARN: 文件 ${file.name} 超过 50MB。`);
    // 去重处理
    if (!uploadedFiles.value.some(f => f.name === file.name)) uploadedFiles.value.push(file);
  });
};

// 移除单个文件
const removeFile = (index) => uploadedFiles.value.splice(index, 1);

// 清空文件队列
const clearFiles = () => { uploadedFiles.value = []; };

// 格式化文件大小单位
const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 触发分析核心流程
const startAnalysis = () => {
  if (uploadedFiles.value.length === 0 || status.value !== 'idle') return;
  status.value = 'analyzing';
  
  // 模拟请求分析等待时间
  analyzeTimer = setTimeout(() => {
    if (isLeaving.value) return;
    status.value = 'success';
    
    // 成功后延迟一小会展开报告弹窗
    successTimer = setTimeout(() => { openReportModal(); }, 1200);
  }, 3000);
};

// ================= 弹窗控制逻辑 =================
const openReportModal = () => {
  showReportModal.value = true;
  showAiSummary.value = false; 
  currentImageIndex.value = 0;
  // 须在弹窗 DOM 渲染结束后挂载 Canvas 图表
  nextTick(() => { initCharts(); });
};

const closeReportModal = () => {
  showReportModal.value = false;
  destroyCharts();
  clearFiles();
  status.value = 'idle';
};

const toggleAiSummary = () => {
  showAiSummary.value = !showAiSummary.value;
};

// ================= ⭐ 纯净文档流导出 PDF 核心方法 =================
const downloadPDF = async () => {
  if (isExporting.value) return;
  
  // 1. 触发挂载纯净 PDF 模板 (隐藏原网页面板，展示 Loading 遮罩)
  isExporting.value = true;
  
  // 2. 留出延迟时间：确保浏览器完全渲染并加载完隐蔽容器中的高清图
  setTimeout(() => {
    const element = document.getElementById('pdf-pure-template');
    
    // 配置 html2pdf.js，采用标准 A4 的竖向排版
    const opt = {
      margin:       15,
      filename:     `SPANS_Diagnostic_Report_${new Date().getTime()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#020810',
        windowWidth: 800 // 严格锁定屏幕截取宽度
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } // 保护内容不断层
    };

    // 触发导出指令
    html2pdf().set(opt).from(element).save().then(() => {
      // 成功后还原到 Web 端查看模式
      isExporting.value = false;
      // 恢复图表状态以防生命周期中断
      nextTick(() => { initCharts(); });
    }).catch(err => {
      console.error('PDF Generation Error:', err);
      isExporting.value = false;
      nextTick(() => { initCharts(); });
    });

  }, 800); 
};

// ================= Chart.js 实例化与渲染 =================
// 销毁已有图表以防止 Canvas 的内存泄漏与重叠渲染
const destroyCharts = () => {
  if (classChartInstance) classChartInstance.destroy();
  if (riskChartInstance) riskChartInstance.destroy();
  classChartInstance = null;
  riskChartInstance = null;
};

// 转化报告的原始类别标签为展示的中文
const getClassName = (className) => {
  const classMap = { crack: '裂缝', efflorescence: '泛碱', 'exposed rebar': '钢筋裸露', spalling: '剥落' };
  return classMap[className] || className;
};

// 转化风险级别标签为展示的中英混合
const getRiskLevel = (level) => {
  const levelMap = { low: '低风险(Low)', medium: '中风险(Med)', high: '高风险(High)' };
  return levelMap[level] || level;
};

// 初始化创建两个主图表
const initCharts = () => {
  destroyCharts();
  
  // 安全拦截：如果在尚未渲染完成时调用，则退出
  if (!classChartCanvas.value || !riskChartCanvas.value) return;

  const classLabels = Object.keys(reportData.value.task_summary.class_count).map(getClassName);
  const classData = Object.values(reportData.value.task_summary.class_count);
  const riskLabels = Object.keys(reportData.value.task_summary.risk_distribution).map(getRiskLevel);
  const riskData = Object.values(reportData.value.task_summary.risk_distribution);

  // Chart.js 统一样式设定：科技风
  Chart.defaults.color = 'rgba(0, 229, 255, 0.5)';
  Chart.defaults.font.family = "'Roboto Mono Local', monospace";

  // 构建类别分布的柱状图 (Bar Chart)
  classChartInstance = new Chart(classChartCanvas.value, {
    type: 'bar',
    data: {
      labels: classLabels,
      datasets: [{
        label: '检测数量',
        data: classData,
        backgroundColor: 'rgba(0, 229, 255, 0.25)', 
        borderColor: '#00e5ff',
        borderWidth: { top: 2, right: 1, bottom: 0, left: 1 }, 
        borderRadius: 4,     
        barThickness: 16,    
      }]
    },
    options: {
      responsive: true, 
      maintainAspectRatio: false,
      plugins: { 
        legend: { display: false }, 
        tooltip: { 
          backgroundColor: 'rgba(2,8,16,0.95)', 
          titleColor: '#00e5ff', 
          bodyColor: '#fff', 
          borderColor: '#00e5ff', 
          borderWidth: 1 
        } 
      },
      scales: {
        y: { 
          beginAtZero: true, 
          grid: { color: 'rgba(0, 229, 255, 0.1)', drawBorder: false }, 
          ticks: { stepSize: 1, color: '#00e5ff' } 
        },
        x: { 
          grid: { display: false }, 
          ticks: { color: '#00e5ff' } 
        }
      }
    }
  });

  // 构建风险占比的环形图 (Doughnut Chart)
  riskChartInstance = new Chart(riskChartCanvas.value, {
    type: 'doughnut',
    data: {
      labels: riskLabels,
      datasets: [{
        data: riskData,
        backgroundColor: ['rgba(0, 255, 170, 0.85)', 'rgba(255, 170, 0, 0.85)', 'rgba(255, 51, 51, 0.85)'],
        borderWidth: 0, 
        spacing: 5, 
        borderRadius: 10, 
        hoverOffset: 0
      }]
    },
    options: {
      responsive: true, 
      maintainAspectRatio: false, 
      cutout: '78%', 
      plugins: {
        legend: { 
          position: 'bottom', 
          labels: { padding: 15, boxWidth: 10, usePointStyle: true, color: '#00e5ff' } 
        },
        tooltip: { 
          backgroundColor: 'rgba(2,8,16,0.95)', 
          bodyColor: '#fff', 
          borderColor: 'rgba(255,255,255,0.2)', 
          borderWidth: 1 
        }
      }
    }
  });
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

/* 拦截离开动画过程中的卡顿 */
.detection-container.is-leaving { 
  animation: none !important; 
}
.detection-container.is-leaving * { 
  animation: none !important; 
  transition: none !important; 
}

/* ================= 主力核心诊断面板区域 ================= */
.cyber-panel { 
  position: relative; 
  background: rgba(2, 8, 16, 0.85); 
  backdrop-filter: blur(12px); 
  border: 1px solid rgba(0, 229, 255, 0.3); 
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(0, 229, 255, 0.05); 
}

/* 机甲面板四角外固定游标 */
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

/* 内层间距与结构 */
.panel-inner { 
  padding: 40px; 
  display: flex; 
  flex-direction: column; 
  gap: 30px; 
}

/* 面板标题部分 */
.panel-header { 
  user-select: none;
  text-align: center; 
}

/* 小系统标识标牌 */
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

/* 标牌伴随灯效 */
.badge-icon { 
  width: 6px; 
  height: 6px; 
  background: #00e5ff; 
  border-radius: 50%; 
  animation: blink 1s infinite; 
}

/* 分析中 - 警告色 */
.analyzing-badge { 
  background: rgba(255, 170, 0, 0.1); 
  border-color: rgba(255, 170, 0, 0.5); 
  color: #ffaa00; 
}
.analyzing-badge .badge-icon { 
  background: #ffaa00; 
  box-shadow: 0 0 8px #ffaa00; 
}

/* 成功 - 安全色 */
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

/* 大标题与副标 */
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

/* 头部视觉渐变分割线 */
.header-divider { 
  margin-top: 20px; 
  height: 2px; 
  background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.5), transparent); 
}

/* ================= 文件传送区 (拖拽或点击) ================= */
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

/* 网格透视底纹 */
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

/* 发光扫描线 */
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

/* 传送区内容排版 */
.upload-content { 
  position: relative; 
  z-index: 5; 
  text-align: center; 
  pointer-events: none; 
}

/* 准星标记 */
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

/* 文字提示 */
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

/* 拖拽和悬停的激活效果 */
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

/* ================= 队列容器 (已传文件展示) ================= */
.file-list-container { 
  user-select: none;
  display: flex; 
  flex-direction: column; 
  gap: 15px; 
}

/* 队列头部分割 */
.list-header { 
  display: flex; 
  justify-content: space-between; 
  font-size: 12px; 
  color: rgba(0, 229, 255, 0.6); 
  border-bottom: 1px solid rgba(0, 229, 255, 0.2); 
  padding-bottom: 5px; 
}

/* 一键清除队列按钮 */
.clear-btn { 
  background: none; 
  border: none; 
  color: rgba(255, 51, 51, 0.6); 
  font-size: 11px; 
  cursor: pointer; 
}

/* 队列包裹器带滚动条 */
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

/* 列表行单项 */
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

/* 单条删除 X 图标 */
.remove-icon { 
  color: rgba(255, 255, 255, 0.3); 
  font-size: 18px; 
  cursor: pointer; 
}
.remove-icon:hover { 
  color: #ff3333; 
}

/* ================= 系统按钮与全场状态光效 ================= */
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

/* 按钮背景扫描动画层 */
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

/* 父级面版状态控制：分析中变黄，成功变绿 */
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

/* ================= 战术报告查看 (Web 端视图专用) ================= */

/* 全屏遮盖层与毛玻璃支持 */
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

/* 视窗级的监控面板定宽高 */
.hud-modal-dashboard {
  position: relative; 
  width: 95%; 
  max-width: 1200px; 
  height: 85vh;
  background: linear-gradient(135deg, rgba(2, 8, 16, 0.95) 0%, rgba(1, 15, 25, 0.95) 100%);
  border: 1px solid rgba(0, 229, 255, 0.4);
  box-shadow: 0 0 50px rgba(0, 229, 255, 0.15), inset 0 0 30px rgba(0, 229, 255, 0.05);
  display: flex; 
  flex-direction: column; 
  overflow: hidden;
  animation: hudBootUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* 装饰：背景深邃线条层 */
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

/* 装饰：弹窗外沿大边角框 */
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

/* ================= 报告弹窗 - 头部栏 ================= */
.hud-header { 
  position: relative; 
  z-index: 5; 
  flex-shrink: 0; 
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

/* 旋转状态的雷达小图标 */
.hud-radar-icon { 
  font-size: 24px; 
  color: #00e5ff; 
  animation: radarSpin 3s linear infinite; 
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

/* 装饰：科技风残缺条码 */
.hud-deco-barcode { 
  height: 20px; 
  width: 100px; 
  margin-left: 20px; 
  background-image: repeating-linear-gradient(90deg, #00e5ff 0, #00e5ff 2px, transparent 2px, transparent 5px, #00e5ff 5px, #00e5ff 6px, transparent 6px, transparent 10px); 
  opacity: 0.4; 
}

/* ================= 弹窗头部右侧：操作按钮容器 ================= */
.hud-header-right { 
  display: flex; 
  align-items: center; 
  gap: 15px; 
}

/* ================= 导出 PDF 按钮基础样式 ================= */
.hud-action-btn { 
  box-sizing: border-box;
  background: rgba(0, 229, 255, 0.1); 
  border: 1px solid rgba(0, 229, 255, 0.5); 
  color: #00e5ff; 
  height: 34px; /* 强制锁定高度，绝对统一 */
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

.hud-action-btn:disabled { 
  opacity: 0.5; 
  cursor: not-allowed; 
  border-color: rgba(255,170,0,0.5); 
  color: #ffaa00;
}

/* ================= 关闭按钮基础样式 ================= */
.hud-close-btn { 
  box-sizing: border-box;
  background: rgba(255, 51, 51, 0.1); 
  border: 1px solid rgba(255, 51, 51, 0.5); 
  color: #ff3333; 
  height: 34px; /* 强制锁定高度，绝对统一 */
  padding: 0 16px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 6px; 
  cursor: pointer; 
  transition: all 0.3s ease; 
  border-radius: 4px; 
  text-align: center;
}

.hud-close-btn:hover { 
  background: rgba(255, 51, 51, 0.2); 
  box-shadow: 0 0 15px rgba(255, 51, 51, 0.4); 
  color: #fff; 
}

/* ================= 按钮内部：图标与文字的绝对居中修复 ================= */
/* 修复图标的行高偏移 */
.hud-action-btn i, 
.hud-close-btn i {
  font-size: 16px;
  line-height: 1;
  display: block;
}

/* 修复文字的行高偏移 */
.btn-text, 
.close-text { 
  font-family: 'Roboto Mono Local', monospace, sans-serif; 
  font-size: 13px; 
  font-weight: bold; 
  line-height: 1;
  text-align: center;
  display: block;
}

/* ================= 报告弹窗 - 内容区排版(解决互相拉伸) ================= */

/* 分割为左右两个独立的列，不互相抢夺空间 */
.hud-body-wrapper { 
  position: relative; 
  z-index: 5; 
  flex: 1; 
  display: flex; 
  gap: 30px; 
  padding: 25px 30px; 
  min-height: 0; 
}

/* 单个滚动列的定义 */
.hud-scroll-col { 
  display: flex; 
  flex-direction: column; 
  height: 100%; 
  overflow-y: auto; 
  padding-right: 15px; 
}

/* 滚动条再次细化支持 */
.hud-scroll-col::-webkit-scrollbar { 
  width: 4px; 
}
.hud-scroll-col::-webkit-scrollbar-track { 
  background: rgba(0, 229, 255, 0.02); 
}
.hud-scroll-col::-webkit-scrollbar-thumb { 
  background: rgba(0, 229, 255, 0.4); 
  border-radius: 2px; 
}

/* 列的占比：左图区占用 50%，右数据区占用 50%（自动占据剩余内容） */
.hud-col-left { 
  flex: 0 0 50%; 
}
.hud-col-right { 
  flex: 1; 
}

/* 列内部通用标题设计 */
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
  user-select: none;
  width: 8px; 
  height: 8px; 
  background: #00e5ff; 
  box-shadow: 0 0 8px #00e5ff; 
}

/* ================= 左侧组件细节：影像观测与智能解析 ================= */

/* 轮播图轨道支持 */
.cyber-carousel-container { 
  display: flex; 
  flex-direction: column; 
  gap: 10px; 
  flex-shrink: 0; 
}
.carousel-track { 
  display: flex; 
  flex-direction: column; 
}

/* 图片呈现容器 */
.hud-image-viewer {
  position: relative; 
  width: 100%; 
  aspect-ratio: 16 / 9; 
  min-height: 250px; 
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.6); 
  border: 1px solid rgba(0, 229, 255, 0.2);
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center;
  overflow: hidden; 
  box-shadow: inset 0 0 30px rgba(0, 229, 255, 0.05);
}

/* 边角光标 */
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

/* 控制图片不会变形并完全展示病害区域 */
.real-image { 
  width: 100%; 
  height: 100%; 
  display: block; 
  object-fit: contain; 
  position: relative; 
  z-index: 1; 
}

/* 右下角/左下角的原档代号标签 */
.image-overlay-tag { 
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

/* 轮播控制台，包含左右按钮和圆点 */
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
  font-family: 'Roboto Mono Local', monospace; 
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

/* 倾斜科技控制点点 */
.dot { 
  width: 8px; 
  height: 8px; 
  background: rgba(0, 229, 255, 0.2); 
  border: 1px solid #00e5ff; 
  cursor: pointer; 
  transition: all 0.3s; 
  transform: rotate(45deg); 
}
.dot.active { 
  background: #00e5ff; 
  box-shadow: 0 0 10px #00e5ff; 
}

/* AI 解析按钮与终端控制 */
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
  transition: all 0.3s; 
  letter-spacing: 1px; 
  text-align: left; 
  position: relative; 
  flex-shrink: 0; 
}
.hud-ai-trigger-btn:hover { 
  background: rgba(0, 255, 170, 0.15); 
  box-shadow: 0 0 15px rgba(0, 255, 170, 0.2); 
}
.btn-glitch-text { 
  position: relative; 
  z-index: 2; 
}

/* 终端主体容器 */
.hud-terminal { 
  margin-top: 15px; 
  background: rgba(0, 0, 0, 0.6); 
  border: 1px solid rgba(0, 255, 170, 0.3); 
  box-shadow: inset 0 0 15px rgba(0, 255, 170, 0.05); 
  font-family: 'Roboto Mono Local', monospace; 
  flex-shrink: 0; 
  display: flex; 
  flex-direction: column; 
}

/* 终端 Mac/Ubuntu 风格控制栏 */
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
  font-size: 12px; 
  margin-left: 10px; 
}

/* 终端黑框文字 */
.terminal-content { 
  padding: 20px; 
  color: #00ffaa; 
  font-size: 13px; 
  line-height: 1.6; 
}

/* --- 深层类设定 (用于支持 v-html 内部元素的重排与渲染) --- */
:deep(.t-line) { 
  margin: 0; 
  margin-bottom: 6px; 
} 
:deep(.t-prefix) { 
  color: rgba(0, 255, 170, 0.5); 
  margin-right: 8px; 
}
:deep(.t-bg-warning) { 
  background: rgba(255, 170, 0, 0.2); 
  color: #ffaa00; 
  padding: 2px 6px; 
  border: 1px solid rgba(255, 170, 0, 0.5); 
}

/* 打字游标 */
.terminal-cursor { 
  display: inline-block; 
  width: 8px; 
  height: 15px; 
  background: #00ffaa; 
  animation: blink 1s infinite; 
  vertical-align: middle; 
  margin-left: 5px; 
}

/* CSS 终端展开特效 */
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

/* ================= 右侧组件细节：数据统计与图表 ================= */

/* 四宫格数据统计网格排布 */
.hud-stats-grid { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
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

/* 高危数据展示特调警告色 */
.warning-card { 
  border-left-color: #ffaa00; 
  background: rgba(255, 170, 0, 0.02); 
}
.warning-card:hover { 
  background: rgba(255, 170, 0, 0.08); 
  box-shadow: inset 0 0 20px rgba(255, 170, 0, 0.1); 
}

/* 顶部高光细装饰带 */
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
  user-select: none;
  color: rgba(255, 255, 255, 0.5); 
  font-family: 'Roboto Mono Local', monospace; 
  font-size: 11px; 
  margin-bottom: 8px; 
}
.stat-value { 
  user-select: none;
  font-family: 'Orbitron', sans-serif; 
  font-size: 28px; 
  font-weight: bold; 
}

/* 统一发光文字色类支持 */
:deep(.text-cyan) { color: #00e5ff; text-shadow: 0 0 8px rgba(0, 229, 255, 0.5); } 
:deep(.text-orange) { color: #ffaa00; text-shadow: 0 0 8px rgba(255, 170, 0, 0.5); } 
:deep(.text-green) { color: #00ffaa; text-shadow: 0 0 8px rgba(0, 255, 170, 0.5); } 
:deep(.text-red) { color: #ff3333; text-shadow: 0 0 8px rgba(255, 51, 51, 0.5); }

/* 数值旁边的小单位支持 */
.unit { 
  font-size: 12px; 
  color: rgba(255, 255, 255, 0.4); 
  margin-left: 5px; 
}

/* 图表容器底板：使用 1:1 独立布局防止被拉伸变形 */
.hud-charts-grid { 
  display: flex; 
  flex-direction: column; /* 核心：改为上下竖向排布 */
  gap: 25px; 
  flex-shrink: 0; 
  padding-bottom: 20px; 
}
.hud-chart-box { 
  position: relative; 
  background: rgba(0, 229, 255, 0.02); 
  border: 1px solid rgba(0, 229, 255, 0.15); 
  padding: 15px; 
  height: 280px !important; /* 核心：固定高度，避免图表压扁 */
  display: flex; 
  flex-direction: column; 
  flex-shrink: 0; 
}
/* 装饰角 */
.chart-corner { 
  position: absolute; 
  width: 15px; 
  height: 15px; 
  border: 2px solid transparent; 
}
.cc-tl { 
  top: -1px; 
  left: -1px; 
  border-top-color: #00e5ff; 
  border-left-color: #00e5ff; 
} 
.cc-br { 
  bottom: -1px; 
  right: -1px; 
  border-bottom-color: #00e5ff; 
  border-right-color: #00e5ff; 
}

/* 图表容器名 */
.chart-title { 
  user-select: none;
  color: #fff; 
  font-family: 'Roboto Mono Local', monospace; 
  font-size: 12px; 
  text-align: center; 
  margin-top: 0; 
  margin-bottom: 10px; 
  letter-spacing: 1px; 
}

/* 真实图表放置区域，由 Chart.js 填充 */
.chart-wrapper { 
  flex: 1; 
  position: relative; 
  width: 100%; 
  height: 100%; 
  min-height: 0; 
}

/* 环形反应堆专属包裹以提供中心点文字对其 */
.donut-wrapper { 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  position: relative; 
}

/* 反应堆内部发光字体定位 */
.donut-center-text { 
  position: absolute; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
  pointer-events: none; 
  z-index: 10; 
  left: 50%; 
  top: 50%; 
  transform: translate(-50%, -50%); 
}
.core-label { 
  font-family: 'Roboto Mono Local', monospace; 
  font-size: 11px; 
  color: rgba(0, 229, 255, 0.6); 
  letter-spacing: 2px; 
}
.core-status { 
  font-family: 'Orbitron', sans-serif; 
  font-size: 16px; 
  font-weight: bold; 
  margin-top: 2px; 
}

/* ================= 💣 专属隐形 PDF 导出模板样式 ================= */

/* 全屏幕阻止交互操作层的 Loader（遮挡掉原来视图） */
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


/* HTML 截取专用的流式布局，不占据实际屏幕以保证用户体验 */
.pdf-hidden-container {
  position: absolute;
  top: 0; 
  left: -9999px; /* 脱离屏幕不阻碍原本操作与动画 */
  width: 800px;  /* 绑定一个能被 html2pdf 正确计算缩放的视口宽度 */
}

/* 该模板不包含复杂的 Chart Canvas 以追求稳定 */
#pdf-pure-template {
  background: #020810; 
  color: #e2e8f0;
  padding: 40px;
  font-family: 'Roboto Mono Local', monospace, sans-serif;
}

/* PDF - 头部打印风格 */
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

/* PDF - 模块内容通用分割 */
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

/* PDF - 横向分布简单表单风格数据 */
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

/* PDF - AI 的分析流，原样带入富文本 */
.pdf-ai-content {
  background: rgba(0, 0, 0, 0.5);
  border: 1px dashed rgba(0, 255, 170, 0.4);
  padding: 25px;
  font-size: 14px;
  line-height: 1.8;
  color: #00ffaa;
}

/* PDF - 图源罗列专用支持 (避免从中间分页截断) */
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

/* 图表直接由 CSS 绘制边框 */
.pdf-img-src {
  width: 100%;
  display: block;
  border: 1px solid rgba(0, 229, 255, 0.3);
}

/* ================= 通用动画基类支持 ================= */

/* 核心面板上提进入 */
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

/* 扫描线上下移动的动画 */
@keyframes scanMove {
  0% {
    top: 0%;
  }
  100% {
    top: 100%;
  }
}

/* 文字或光标闪烁 */
@keyframes blink { 
  0%, 100% { 
    opacity: 1; 
  } 
  50% { 
    opacity: 0; 
  } 
}

/* 雷达无限扫射 */
@keyframes radarSpin { 
  100% { 
    transform: rotate(360deg); 
  } 
}

/* HUD 弹窗专用从中心压薄展开 */
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

@keyframes panelOverload { 
  0%, 100% { transform: translate(0, 0); } 
  25% { transform: translate(-1px, 1px); } 
  50% { transform: translate(1px, -1px); } 
  75% { transform: translate(1px, 1px); } 
}

/* 文字呼吸发光（用于分析中按钮文字） */
@keyframes pulseOpacity { 
  0% { opacity: 0.5; } 
  50% { opacity: 1; } 
  100% { opacity: 0.5; } 
}
</style>