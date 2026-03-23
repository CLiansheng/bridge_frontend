<template>
  <div class="page-container">
    <div class="glass-panel upload-section">
      <div class="header">
        <h2><i class='bx bx-cloud-upload'></i> 智能诊断工作台</h2>
        <p>支持单张图片检测或批量 ZIP 压缩包上传</p>
      </div>

      <div class="upload-area">
        <i class='bx bxs-file-image upload-icon'></i>
        <h3>拖拽文件到此处，或 <span class="highlight">点击上传</span></h3>
        <p class="tips">支持 JPG, PNG, ZIP 格式 (最大 50MB)</p>
        <input 
          type="file" 
          class="hidden-input" 
          multiple 
          @change="handleFileUpload"
        >
      </div>

      <!-- 已选择文件列表 -->
      <div v-if="selectedFiles.length > 0" class="file-list">
        <h3>已选择文件 ({{ selectedFiles.length }})</h3>
        <ul>
          <li v-for="(file, index) in selectedFiles" :key="index">
            {{ file.name }}
            <span class="file-size">{{ formatFileSize(file.size) }}</span>
          </li>
        </ul>
      </div>

      <div class="action-bar">
        <button class="btn primary" @click="startDiagnosis" :disabled="!selectedFiles.length">
          开始 AI 诊断
        </button>
      </div>
    </div>

    <!-- 诊断报告 -->
    <div v-if="showReport" class="glass-panel  animate-fade-in">
      <div class="header">
        <h2><i class='bx bx-report'></i> 诊断报告</h2>
      </div>

      <div class="report-content">
        <!-- 统计卡片 -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ reportData.task_summary.image_count }}</div>
            <div class="stat-label">本次检测图片数</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ reportData.task_summary.total_defect_count }}</div>
            <div class="stat-label">总病害数</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ reportData.average_area }}</div>
            <div class="stat-label">平均病害面积</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ reportData.average_length }}</div>
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
                <!-- AI 总结按钮 -->
        <div class="action-bar">
          <button class="btn secondary" @click="toggleAiSummary">
            {{ showAiSummary ? '隐藏 AI 总结' : '显示 AI 总结' }}
          </button>
        </div>

        <!-- AI 总结内容 -->
        <div v-if="showAiSummary" class="ai-summary animate-fade-in">
          <div class="summary-header">
            <h3><i class='bx bx-brain'></i> AI 诊断总结</h3>
          </div>
          <div class="summary-content" v-html="aiSummary"></div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'
import { useUserStore } from '../stores/user'
import { useHistoryStore } from '../stores/history'

// 响应式状态
const selectedFiles = ref([])
const showReport = ref(false)
const showAiSummary = ref(false)
const classChart = ref(null)
const riskChart = ref(null)
let classChartInstance = null
let riskChartInstance = null

// Pinia store
const historyStore = useHistoryStore()

// 模拟报告数据
const reportData = ref({
  task_summary: {
    image_count: 3,
    total_defect_count: 8,
    class_count: {
      crack: 4,
      efflorescence: 2,
      'exposed rebar': 1,
      spalling: 1
    },
    risk_distribution: {
      low: 3,
      medium: 3,
      high: 2
    }
  },
  average_area: 1062, 
  average_length: 139 
})

// AI 总结数据
const aiSummary = ref(`## AI 诊断总结

### 病害分析
- **主要病害类型**：裂缝（4处）、泛碱（2处）、钢筋裸露（1处）、剥落（1处）
- **风险等级分布**：低风险3处，中风险3处，高风险2处
- **平均病害面积**：1062平方毫米
- **平均病害长度**：139毫米

### 桥梁状态评估
根据检测结果，桥梁整体状态为**中等风险**。建议进行以下维护措施：

1. **裂缝处理**：对4处裂缝进行密封处理，防止水渗入导致钢筋锈蚀
2. **泛碱处理**：对2处泛碱部位进行清洗和防护处理
3. **钢筋裸露修复**：对1处钢筋裸露部位进行除锈和防腐处理
4. **剥落修补**：对1处剥落部位进行修补，恢复混凝土保护层

### 建议维护计划
- **短期（1-3个月）**：优先处理高风险病害
- **中期（3-6个月）**：完成所有病害的修复
- **长期（6-12个月）**：进行全面的桥梁结构检查

### 注意事项
- 定期监测裂缝发展情况
- 加强桥梁排水系统的维护
- 定期进行防腐涂层的检查和更新
- 注意混凝土表面的泛碱现象，及时处理`)

// 方法
const handleFileUpload = (event) => {
  selectedFiles.value = Array.from(event.target.files)
}

const startDiagnosis = () => {
  // 模拟诊断过程
  showReport.value = true
  showAiSummary.value = false // 重置 AI 总结状态
  
  // 保存到历史记录
  saveToHistory()
}

const toggleAiSummary = () => {
  showAiSummary.value = !showAiSummary.value
}

// 保存到历史记录
const saveToHistory = () => {
  // 生成批次号
  const date = new Date()
  const batchId = `BATCH-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
  
  // 创建历史记录
  const historyRecord = {
    id: Date.now(),
    batchId: batchId,
    detectionTime: date.toLocaleString('zh-CN'),
    uploadType: selectedFiles.value.length > 1 ? '批量 ZIP' : '单张图片',
    defectCount: reportData.value.task_summary.total_defect_count,
    reportData: { ...reportData.value } // 保存完整的报告数据
  }
  
  // 添加到 Pinia store
  historyStore.addHistoryRecord(historyRecord)
  
  console.log('诊断结果已保存到历史记录')
}

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB'
  else return (bytes / 1048576).toFixed(2) + ' MB'
}

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
  if (!showReport.value) return

  // 销毁现有图表实例
  if (classChartInstance) {
    classChartInstance.destroy()
  }
  if (riskChartInstance) {
    riskChartInstance.destroy()
  }

  // 准备类别数据
  const classLabels = Object.keys(reportData.value.task_summary.class_count).map(getClassName)
  const classData = Object.values(reportData.value.task_summary.class_count)
  const classColors = ['#00e5ff', '#00b8d9', '#0091c2']

  // 准备风险等级数据
  const riskLabels = Object.keys(reportData.value.task_summary.risk_distribution).map(getRiskLevel)
  const riskData = Object.values(reportData.value.task_summary.risk_distribution)
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

// 组件挂载后初始化
onMounted(() => {
  if (showReport.value) {
    initCharts()
  }
})
</script>

<style scoped>
.page-container { max-width: 1200px; margin: 0 auto; animation: fadeIn 0.5s ease; }
.glass-panel { border: 1px solid var(--glass-border); border-radius: 16px; padding: 40px; margin-bottom: 30px; }
.header { margin-bottom: 30px; text-align: center; }
.header h2 { display: flex; align-items: center; justify-content: center; gap: 10px; color: #fff; margin-bottom: 8px; }
.header p { color: var(--text-muted); font-size: 14px; }
.upload-area { position: relative; border: 2px dashed rgba(0, 242, 254, 0.4); border-radius: 12px; padding: 60px 20px; text-align: center; background: rgba(0, 242, 254, 0.02); transition: all 0.3s; cursor: pointer; }
.upload-area:hover { border-color: var(--neon-blue); background: rgba(0, 242, 254, 0.05); box-shadow: 0 0 20px rgba(0, 242, 254, 0.1); }
.upload-icon { font-size: 60px; color: var(--text-muted); margin-bottom: 15px; transition: 0.3s; }
.upload-area:hover .upload-icon { color: var(--neon-blue); transform: translateY(-5px); }
.highlight { color: var(--neon-blue); text-decoration: underline; }
.tips { color: #666; font-size: 12px; margin-top: 10px; }
.hidden-input { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
.action-bar { margin-top: 30px; display: flex; justify-content: center; }
.btn.primary { background: linear-gradient(45deg, var(--neon-blue), #0072ff); border: none; padding: 12px 40px; color: white; font-weight: bold; border-radius: 8px; font-size: 16px; cursor: pointer; box-shadow: 0 5px 15px rgba(0, 242, 254, 0.3); transition: 0.3s; }
.btn.primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0, 242, 254, 0.5); }
.btn.primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 242, 254, 0.3);
  padding: 10px 30px;
  color: var(--neon-blue);
  font-weight: bold;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s;
}

.btn.secondary:hover {
  background: rgba(0, 242, 254, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 242, 254, 0.2);
}

/* 文件列表样式 */
.file-list { margin: 20px 0; }
.file-list h3 { color: #fff; margin-bottom: 10px; }
.file-list ul { list-style: none; padding: 0; }
.file-list li { background: rgba(0, 242, 254, 0.05); border: 1px solid rgba(0, 242, 254, 0.2); border-radius: 8px; padding: 10px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
.file-size { color: var(--text-muted); font-size: 12px; }

/* 报告样式 */
.report-content { margin-top: 30px;width: 1120px; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
.stat-card { background: rgba(0, 242, 254, 0.05); border: 1px solid rgba(0, 242, 254, 0.2); border-radius: 12px; padding: 20px; text-align: center; transition: all 0.3s; }
.stat-card:hover { box-shadow: 0 0 20px rgba(0, 242, 254, 0.2); transform: translateY(-2px); }
.stat-value { font-size: 32px; font-weight: bold; color: var(--neon-blue); margin-bottom: 8px; }
.stat-label { color: var(--text-muted); font-size: 14px; }

/* AI 总结样式 */
.ai-summary {
  background: rgba(0, 242, 254, 0.05);
  border: 1px solid rgba(0, 242, 254, 0.2);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  margin-top: 30px;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  color: #fff;
}

.summary-content {
  color: #e2e8f0;
  line-height: 1.6;
}

.summary-content h3 {
  color: var(--neon-blue);
  margin-top: 20px;
  margin-bottom: 10px;
}

.summary-content h4 {
  color: #fff;
  margin-top: 15px;
  margin-bottom: 8px;
}

.summary-content ul {
  margin-left: 20px;
  margin-bottom: 15px;
}

.summary-content li {
  margin-bottom: 5px;
}

/* 图表容器 */
.charts-container { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
.chart-section { background: rgba(0, 242, 254, 0.05); border: 1px solid rgba(0, 242, 254, 0.2); border-radius: 12px; padding: 20px; }
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