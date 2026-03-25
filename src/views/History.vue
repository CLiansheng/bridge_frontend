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
            <h2 class="cyber-title">SPANS 历史档案库</h2>
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
                <th>任务名称</th>
                <th>检测时间</th>
                <th>传输文件</th>
                <th>病害异常</th>
                <th>报告面板</th>
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
                    打开报告
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
        <div v-if="showReportModal" class="hud-modal-overlay">
          <div class="hud-modal-dashboard">
            
            <div class="hud-bg-grid"></div>
            <div class="hud-bracket hb-tl"></div>
            <div class="hud-bracket hb-tr"></div>
            <div class="hud-bracket hb-bl"></div>
            <div class="hud-bracket hb-br"></div>

            <div class="hud-header">
              <div class="hud-header-left">
                <i class='bx bx-history hud-radar-icon'></i>
                <h2 class="hud-title">SPANS 回溯档案 // {{ selectedRecord?.taskName }}</h2>
              </div>
              <div class="hud-header-right">
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
                
                <div class="cyber-carousel-container" v-if="resultImages.length > 0">
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
                
                <div v-else class="empty-images">暂无图像档案</div>

                <div class="hud-section-title mt-20">
                  <span class="deco-box"></span> AI深度解析报告
                </div>
                <button class="hud-ai-trigger-btn" @click="toggleAiSummary">
                  <span class="btn-glitch-text">{{ showAiSummary ? '<< AI 深度解析报告' : '>> 点击获取 AI 深度解析报告' }}</span>
                </button>
                
                <transition name="terminal-expand">
                  <div class="hud-terminal" v-show="showAiSummary">
                    <div class="terminal-header">
                      <span class="terminal-dot red"></span>
                      <span class="terminal-dot yellow"></span>
                      <span class="terminal-dot green"></span>
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
                    <div class="stat-value text-cyan">{{ reportData?.task_summary?.image_count || 0 }}</div>
                  </div>
                  <div class="hud-stat-card" :class="{'warning-card': reportData?.task_summary?.total_defect_count > 0}">
                    <div class="stat-border-top"></div><div class="stat-label">病害数量</div>
                    <div class="stat-value" :class="reportData?.task_summary?.total_defect_count > 0 ? 'text-orange' : 'text-green'">
                      {{ reportData?.task_summary?.total_defect_count || 0 }}
                    </div>
                  </div>
                  <div class="hud-stat-card">
                    <div class="stat-border-top"></div><div class="stat-label">平均面积</div>
                    <div class="stat-value text-green">{{ reportData?.average_area || 0 }}<span class="unit">mm²</span></div>
                  </div>
                  <div class="hud-stat-card">
                    <div class="stat-border-top"></div><div class="stat-label">平均长度</div>
                    <div class="stat-value text-green">{{ reportData?.average_length || 0 }}<span class="unit">mm</span></div>
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
                        <span class="core-label">RISK</span>
                        <span class="core-status" :class="reportData?.task_summary?.risk_distribution?.high > 0 ? 'text-orange' : 'text-cyan'">OVERVIEW</span>
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

  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import Chart from 'chart.js/auto'
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
const aiSummaryHtml = ref('')
const reportData = ref(null)

// Chart 图表 Canvas 引用
const classChartCanvas = ref(null)
const riskChartCanvas = ref(null)
let classChartInstance = null
let riskChartInstance = null

// 初始化时从本地加载记录
onMounted(() => {
  historyStore.loadHistoryRecords()
})

// ================= 表格业务逻辑 =================
// 监听选中项变化，动态更新“全选”框状态
watch(selectedIds, (newValue) => {
  selectAll.value = newValue.length === historyStore.historyRecords.length && historyStore.historyRecords.length > 0
}, { deep: true })

// 点击全选框时的逻辑
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedIds.value = historyStore.historyRecords.map(r => r.id)
  } else {
    selectedIds.value = []
  }
}

// 批量删除选中的记录
const deleteSelectedRecords = () => {
  if (selectedIds.value.length > 0 && confirm('SYSTEM_WARNING: 将永久抹除所选档案记录。确认执行？')) {
    historyStore.deleteSelectedRecords(selectedIds.value)
    selectedIds.value = [] // 清空选项
    selectAll.value = false
  }
}

// 失焦保存重命名的任务代号
const updateTaskName = (id, newName) => {
  historyStore.updateTaskName(id, newName)
}

// ================= HUD 面板与报告数据逻辑 =================
const viewReport = (record) => {
  selectedRecord.value = record
  // 提取对应历史档案的数据以供渲染
  resultImages.value = record.resultImages || []
  aiSummaryHtml.value = record.aiSummaryHtml || '<p class="t-line text-cyan">> 暂无解析</p>'
  reportData.value = record.reportData || {}
  
  // 初始化查看状态
  currentImageIndex.value = 0
  showAiSummary.value = false
  showReportModal.value = true

  // 必须等待弹窗 DOM 渲染完成再挂载 Canvas 图表
  nextTick(() => { initCharts() })
}

const closeReportModal = () => {
  showReportModal.value = false
  destroyCharts()
}

const toggleAiSummary = () => { 
  showAiSummary.value = !showAiSummary.value 
}

// 图片轮播控制
const nextImage = () => { 
  currentImageIndex.value = (currentImageIndex.value + 1) % resultImages.value.length 
}
const prevImage = () => { 
  currentImageIndex.value = (currentImageIndex.value - 1 + resultImages.value.length) % resultImages.value.length 
}
const setCurrentImage = (idx) => { 
  currentImageIndex.value = idx 
}

// ================= Chart.js 控制 =================
// 销毁图表，防止页面内存泄漏
const destroyCharts = () => {
  if (classChartInstance) classChartInstance.destroy()
  if (riskChartInstance) riskChartInstance.destroy()
  classChartInstance = null
  riskChartInstance = null
}

// 将英文键映射回中文展示
const getClassName = (c) => ({ crack: '裂缝', efflorescence: '泛碱', 'exposed rebar': '钢筋裸露', spalling: '剥落' }[c] || c)
const getRiskLevel = (l) => ({ low: '低风险', medium: '中风险', high: '高风险' }[l] || l)

// 初始化战术图表
const initCharts = () => {
  destroyCharts()
  if (!classChartCanvas.value || !riskChartCanvas.value || !reportData.value) return

  const data = reportData.value.task_summary
  const classLabels = Object.keys(data.class_count || {}).map(getClassName)
  const classDataArr = Object.values(data.class_count || {})
  const riskLabels = Object.keys(data.risk_distribution || {}).map(getRiskLevel)
  const riskDataArr = Object.values(data.risk_distribution || {})

  Chart.defaults.color = 'rgba(0, 229, 255, 0.5)'
  Chart.defaults.font.family = "'Roboto Mono Local', monospace"

  // 渲染柱状图：异常分类统计
  classChartInstance = new Chart(classChartCanvas.value, {
    type: 'bar',
    data: {
      labels: classLabels.length ? classLabels : ['无病害'],
      datasets: [{
        label: '检测数量',
        data: classDataArr.length ? classDataArr : [0],
        backgroundColor: 'rgba(0, 229, 255, 0.25)', 
        borderColor: '#00e5ff',
        borderWidth: { top: 2, right: 1, bottom: 0, left: 1 }, 
        barThickness: 16
      }]
    },
    options: {
      responsive: true, 
      maintainAspectRatio: false,
      plugins: { 
        legend: { display: false }, 
        tooltip: { backgroundColor: 'rgba(2,8,16,0.95)' } 
      },
      scales: {
        y: { 
          beginAtZero: true, 
          grid: { color: 'rgba(0, 229, 255, 0.1)' }, 
          ticks: { stepSize: 1 } 
        },
        x: { grid: { display: false } }
      }
    }
  })

  // 渲染环形图：危险等级分布
  riskChartInstance = new Chart(riskChartCanvas.value, {
    type: 'doughnut',
    data: {
      labels: riskLabels.length ? riskLabels : ['健康'],
      datasets: [{
        data: riskDataArr.length && riskDataArr.some(v=>v>0) ? riskDataArr : [1],
        backgroundColor: ['rgba(0, 255, 170, 0.85)', 'rgba(255, 170, 0, 0.85)', 'rgba(255, 51, 51, 0.85)'],
        borderWidth: 0, 
        spacing: 5, 
        cutout: '78%'
      }]
    },
    options: {
      responsive: true, 
      maintainAspectRatio: false,
      plugins: { 
        legend: { position: 'bottom', labels: { padding: 15, usePointStyle: true } } 
      }
    }
  })
}
</script>

<style scoped>
/* ================= 极简机甲面板与表格 ================= */
.history-container {
  width: 100%;
  max-width: 1100px;
  margin: 20px auto;
  animation: deployFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  /* 核心需求：禁止用户选择文字，避免破坏终端 UI 沉浸感 */
  user-select: none;
}

/* 主面板装甲背景 */
.archive-panel {
  background: rgba(2, 8, 16, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 229, 255, 0.3);
  padding: 30px;
  position: relative;
}

/* 边角游标固定点 */
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

/* 头部左右布局 */
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

/* 赛博操作按钮基础类 */
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

/* 危险操作特供（删除键） */
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

/* 赛博表格排版 */
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

/* 各列特殊字体与着色 */
.time-col {
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
}

.type-col {
  color: #00ffaa;
  font-size: 11px;
}

/* 表格内伪装成纯文字的输入框（允许修改任务代号） */
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
  /* 允许在输入框中选中文本进行编辑 */
  user-select: auto;
}

.ghost-input:focus, 
.ghost-input:hover {
  border-bottom-color: #00e5ff;
  background: rgba(0, 229, 255, 0.05);
  outline: none;
}

/* 警示标记框 */
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

/* 空状态占位提示 */
.empty-state {
  text-align: center;
  padding: 40px !important;
  color: rgba(0, 229, 255, 0.5);
}

.empty-state i {
  font-size: 40px;
  margin-bottom: 10px;
}

/* 纯 CSS 赛博级 Checkbox */
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
  background-color: rgba(0, 229, 255, 0.2);
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

/* ================= 战术 HUD 仪表盘样式 (复刻 Detection.vue) ================= */
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

/* HUD 弹窗背景网格 */
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

.hud-close-btn {
  background: rgba(255, 51, 51, 0.1);
  border: 1px solid rgba(255, 51, 51, 0.5);
  color: #ff3333;
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

.hud-close-btn:hover {
  background: rgba(255, 51, 51, 0.2);
  box-shadow: 0 0 15px rgba(255, 51, 51, 0.4);
  color: #fff;
}

.close-text {
  font-family: 'Roboto Mono Local', monospace;
  font-size: 13px;
  font-weight: bold;
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
}

.hud-section-title {
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

.real-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: relative;
  z-index: 1;
}

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

/* AI 解析展开终端 */
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

/* 核心指标统计格 */
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
  font-size: 11px;
  margin-bottom: 8px;
}

.stat-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 28px;
  font-weight: bold;
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

/* 图表容器底板排版 */
.hud-charts-grid {
  display: flex;
  flex-direction: column;
  gap: 25px;
  flex-shrink: 0;
  padding-bottom: 20px;
}

.hud-chart-box {
  position: relative;
  background: rgba(0, 229, 255, 0.02);
  border: 1px solid rgba(0, 229, 255, 0.15);
  padding: 15px;
  height: 280px !important;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

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

.chart-title {
  color: #fff;
  font-family: 'Roboto Mono Local', monospace;
  font-size: 12px;
  text-align: center;
  margin: 0 0 10px 0;
  letter-spacing: 1px;
}

.chart-wrapper {
  flex: 1;
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
}

/* 环形图包裹，文字绝对居中 */
.donut-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

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

/* 动画效果汇总 */
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