<template>
  <div class="page-container">
    <div class="glass-panel">
      <div class="table-header">
        <h2 class="title" style="position: relative;left: 50px;">历史检测档案</h2>
        <button 
          class="btn delete-btn" 
          @click="deleteSelectedRecords" 
          :disabled="selectedIds.length === 0">
          删除所选
        </button>
      </div>
      <table class="cyber-table">
        <thead>
          <tr>
            <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll"></th>
            <th>任务名称</th>
            <th>检测时间</th>
            <th>上传方式</th>
            <th>病害数量</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in historyStore.historyRecords" :key="record.id">
            <td><input type="checkbox" v-model="selectedIds" :value="record.id"></td>
            <td class="id-col">
              <input 
                type="text" 
                v-model="record.taskName" 
                class="task-name-input"
                @blur="updateTaskName(record.id, record.taskName)"
                placeholder="未命名"
              >
            </td>
            <td>{{ record.detectionTime }}</td>
            <td>{{ record.uploadType }}</td>
            <td class="alert-text">{{ record.defectCount }} 处</td>
            <td><button class="link-btn" @click="viewReport(record)">查看报告</button></td>
          </tr>
          <tr v-if="historyStore.historyRecords.length === 0">
            <td colspan="6" class="empty-message">暂无历史记录</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 历史报告详情 -->
    <div v-if="showReport" class="glass-panel report-section animate-fade-in">
      <div class="header">
        <h2><i class='bx bx-report'></i> 诊断报告 - {{ selectedRecord?.taskName }}</h2>
        <button class="btn close-btn" @click="showReport = false">关闭</button>
      </div>

      <transition name="fade-slide">
        <div v-if="showReport" class="report-content">
          <!-- 统计卡片 -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">{{ selectedRecord?.reportData?.task_summary?.image_count }}</div>
              <div class="stat-label">本次检测图片数</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ selectedRecord?.reportData?.task_summary?.total_defect_count }}</div>
              <div class="stat-label">总病害数</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ selectedRecord?.reportData?.average_area }}</div>
              <div class="stat-label">平均病害面积</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ selectedRecord?.reportData?.average_length }}</div>
              <div class="stat-label">平均病害长度</div>
            </div>
          </div>

          <!-- 图表区域 -->
          <div class="charts-container">
            <!-- 各类别数量图表 -->
            <div class="chart-section">
              <h3>各类别数量</h3>
              <div class="chart-wrapper">
                <canvas ref="classChart"></canvas>
              </div>
            </div>

            <!-- 风险等级分布图表 -->
            <div class="chart-section">
              <h3>风险等级分布</h3>
              <div class="chart-wrapper">
                <canvas ref="riskChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import Chart from 'chart.js/auto'
import { useHistoryStore } from '../stores/history'

// Pinia store
const historyStore = useHistoryStore()

// 响应式状态
const showReport = ref(false)
const selectedRecord = ref(null)
const classChart = ref(null)
const riskChart = ref(null)
const selectedIds = ref([])
const selectAll = ref(false)
let classChartInstance = null
let riskChartInstance = null

// 方法
const viewReport = (record) => {
  selectedRecord.value = record
  showReport.value = true
}

// 全选/取消全选
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedIds.value = historyStore.historyRecords.map(record => record.id)
  } else {
    selectedIds.value = []
  }
}

// 删除选中的记录
const deleteSelectedRecords = () => {
  if (selectedIds.value.length > 0) {
    if (confirm('确定要删除所选记录吗？')) {
      historyStore.deleteSelectedRecords(selectedIds.value)
      selectedIds.value = []
      selectAll.value = false
    }
  }
}

// 更新任务名称
const updateTaskName = (id, newName) => {
  historyStore.updateTaskName(id, newName)
}

// 监听选中的记录，更新全选状态
watch(selectedIds, (newValue) => {
  selectAll.value = newValue.length === historyStore.historyRecords.length
}, { deep: true })

const getClassName = (className) => {
  const classMap = {
    crack: '裂缝',
    efflorescence: '泛碱',
    'exposed rebar': '钢筋裸露',
    spalling: '剥落'
  }
  return classMap[className] || className
}

const getRiskLevel = (level) => {
  const levelMap = {
    low: '低风险',
    medium: '中风险',
    high: '高风险'
  }
  return levelMap[level] || level
}

// 初始化图表
const initCharts = () => {
  if (!showReport.value || !selectedRecord.value) return

  // 销毁现有图表实例
  if (classChartInstance) {
    classChartInstance.destroy()
  }
  if (riskChartInstance) {
    riskChartInstance.destroy()
  }

  const reportData = selectedRecord.value.reportData
  if (!reportData) return

  // 准备类别数据
  const classLabels = Object.keys(reportData.task_summary.class_count).map(getClassName)
  const classData = Object.values(reportData.task_summary.class_count)
  const classColors = ['#00e5ff', '#00b8d9', '#0091c2']

  // 准备风险等级数据
  const riskLabels = Object.keys(reportData.task_summary.risk_distribution).map(getRiskLevel)
  const riskData = Object.values(reportData.task_summary.risk_distribution)
  const riskColors = ['#00e5ff', '#00b8d9', '#0091c2']

  // 创建类别图表
  if (classChart.value) {
    classChartInstance = new Chart(classChart.value, {
      type: 'bar',
      data: {
        labels: classLabels,
        datasets: [{
          label: '病害数量',
          data: classData,
          backgroundColor: classColors,
          borderColor: classColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 229, 255, 0.1)'
            },
            ticks: {
              color: '#e2e8f0'
            }
          },
          x: {
            grid: {
              color: 'rgba(0, 229, 255, 0.1)'
            },
            ticks: {
              color: '#e2e8f0'
            }
          }
        }
      }
    })
  }

  // 创建风险等级图表
  if (riskChart.value) {
    riskChartInstance = new Chart(riskChart.value, {
      type: 'pie',
      data: {
        labels: riskLabels,
        datasets: [{
          data: riskData,
          backgroundColor: riskColors,
          borderColor: riskColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#e2e8f0'
            }
          }
        }
      }
    })
  }
}

// 监听报告显示状态
watch(() => showReport.value, (newValue) => {
  if (newValue) {
    // 延迟初始化图表，确保 DOM 已经渲染
    setTimeout(initCharts, 100)
  }
})

// 组件挂载后加载数据
onMounted(() => {
    historyStore.loadHistoryRecords()
  })
</script>

<style scoped>
.page-container { animation: fadeIn 0.5s ease; }
.glass-panel {  border: 1px solid var(--glass-border); border-radius: 16px; padding: 30px; margin-bottom: 30px; }
.title { color: #fff; font-size: 20px; border-left: 4px solid var(--tech-cyan); padding-left: 10px; }
.cyber-table { width: 100%; border-collapse: collapse; text-align: left; }
.cyber-table th { padding: 16px; color: var(--text-muted); font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.1); }

/* 自定义复选框样式 */
input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

input[type="checkbox"]:hover {
  border-color: var(--tech-cyan);
  background: rgba(0, 229, 255, 0.1);
}

input[type="checkbox"]:checked {
  background: var(--tech-cyan);
  border-color: var(--tech-cyan);
}

input[type="checkbox"]:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000;
  font-size: 12px;
  font-weight: bold;
}

input[type="checkbox"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.cyber-table td { padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 14px; transition: 0.3s; }
.cyber-table tbody tr:hover td { background: rgba(0, 242, 254, 0.05); }
.id-col { color: var(--neon-purple); font-family: monospace; }
.alert-text { color: #f59e0b; font-weight: bold; }

.link-btn { background: none; border: none; color: var(--tech-cyan); cursor: pointer; text-decoration: underline; }
.empty-message { text-align: center; color: var(--text-muted); padding: 40px; }

/* 报告样式 */
.table-header { display: flex; justify-content:space-between; align-items: center; margin-bottom: 20px; }

.delete-btn {
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
  color: #ff4757;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.3s;
  position: relative;
  left: -130px;
}

.delete-btn:hover:not(:disabled) {
  background: rgba(255, 0, 0, 0.2);
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
}

.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: var(--text-muted);
  color: var(--text-muted);
}

.task-name-input {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: 0.3s;
  width: 150px;
}

.task-name-input:focus {
  border-color: var(--tech-cyan);
  box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.2);
}

.report-section .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.report-section .header h2 { margin: 0; }
.close-btn { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #fff; padding: 8px 16px; border-radius: 4px; cursor: pointer; transition: 0.3s; }
.close-btn:hover { background: rgba(255, 255, 255, 0.2); }

.report-content { margin-top: 30px; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
.stat-card { background: rgba(0, 229, 255, 0.05); border: 1px solid rgba(0, 229, 255, 0.2); border-radius: 12px; padding: 20px; text-align: center; transition: all 0.3s; }
.stat-card:hover { box-shadow: 0 0 20px rgba(0, 229, 255, 0.2); transform: translateY(-2px); }
.stat-value { font-size: 32px; font-weight: bold; color: var(--tech-cyan); margin-bottom: 8px; }
.stat-label { color: var(--text-muted); font-size: 14px; }

/* 图表容器 */
.charts-container { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
.chart-section { background: rgba(0, 229, 255, 0.05); border: 1px solid rgba(0, 229, 255, 0.2); border-radius: 12px; padding: 20px; }
.chart-section h3 { color: #fff; margin-bottom: 20px; text-align: center; }
.chart-wrapper { height: 300px; }

/* 响应式设计 */
@media (max-width: 768px) {
  .charts-container { grid-template-columns: 1fr; }
  .page-container { max-width: 100%; padding: 0 20px; }
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* 动画效果 */
.animate-fade-in {
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>