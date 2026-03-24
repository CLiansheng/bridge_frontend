<template>
  <div class="page-container">
    
    <section class="cyber-panel hero-section">
      <div class="terminal-bracket tb-tl"></div>
      <div class="terminal-bracket tb-tr"></div>
      <div class="terminal-bracket tb-bl"></div>
      <div class="terminal-bracket tb-br"></div>

      <div class="hero-content">
        <h1 class="cyber-title">SPANS 桥梁病害诊断系统</h1>
        <p class="subtitle">A I 辅 助 / 实 时 诊 断 / 结 构 健 康 评 估</p>
        
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-border-top"></div>
            <i class='bx bx-scan'></i>
            <div class="stat-info">
              <span class="label">累计诊断次数</span>
              <span class="value text-cyan">{{ totalTasks }}<small>次</small></span>
            </div>
          </div>
          
          <div class="stat-box">
            <div class="stat-border-top"></div>
            <i class='bx bx-bug'></i>
            <div class="stat-info">
              <span class="label">累计发现病害</span>
              <span class="value text-green">{{ totalDefects }}<small>处</small></span>
            </div>
          </div>
          
          <div class="stat-box warning-card">
            <div class="stat-border-top"></div>
            <i class='bx bx-error-alt bx-flashing'></i>
            <div class="stat-info">
              <span class="label">历史高危预警</span>
              <span class="value text-red">{{ highRiskAlerts }}<small>项</small></span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="charts-section">
      <div class="hud-charts-grid">
        
        <div class="hud-chart-box">
          <div class="chart-corner cc-tl"></div>
          <div class="chart-corner cc-br"></div>
          <h4 class="chart-title">[ 历史病害类别分布侦测 ]</h4>
          <div class="chart-wrapper">
            <canvas id="defectTypeChartCanvas" ref="defectTypeChartCanvas"></canvas>
          </div>
        </div>
        
        <div class="hud-chart-box">
          <div class="chart-corner cc-tl"></div>
          <div class="chart-corner cc-br"></div>
          <h4 class="chart-title">[ 历史累计风险分布 ]</h4>
          <div class="chart-wrapper donut-wrapper">
            <div class="donut-center-text">
              <span class="core-label">history</span>
              <span class="core-status text-orange">历史风险分布</span>
            </div>
            <canvas id="riskChartCanvas HomeDonut" ref="riskChartCanvas"></canvas>
          </div>
        </div>

      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useHistoryStore } from '../stores/history';
import Chart from 'chart.js/auto';

// ================= 状态与 Store =================
const historyStore = useHistoryStore();

// ================= 动态计算核心指标 =================
// 累计诊断次数（总记录数）
const totalTasks = computed(() => historyStore.historyRecords.length);

// 累计发现病害总数
const totalDefects = computed(() => {
  return historyStore.historyRecords.reduce((sum, record) => sum + (record.defectCount || 0), 0);
});

// 历史高风险预警总数
const highRiskAlerts = computed(() => {
  return historyStore.historyRecords.reduce((sum, record) => {
    const high = record.reportData?.task_summary?.risk_distribution?.high || 0;
    return sum + high;
  }, 0);
});

// ================= 图表实例控制 =================
const defectTypeChartCanvas = ref(null);
const riskChartCanvas = ref(null);
let defectTypeChartInstance = null;
let riskChartInstance = null;

// ================= 初始化与渲染 =================
onMounted(() => {
  // 确保数据已加载
  if (historyStore.historyRecords.length === 0) {
    historyStore.loadHistoryRecords();
  }
  
  // 延迟一帧等待 DOM 挂载完毕后初始化图表
  nextTick(() => {
    initCharts();
  });

  // 关键修复 2: 绑定 resize 监听器，在全屏或缩小窗口时强行更新图表，防止混乱
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  if (defectTypeChartInstance) defectTypeChartInstance.destroy();
  if (riskChartInstance) riskChartInstance.destroy();
  window.removeEventListener('resize', handleResize);
});

// 监听历史记录变化，动态重绘图表
watch(() => historyStore.historyRecords, () => {
  initCharts();
}, { deep: true });

// 关键修复 3: 全屏或缩小窗口时的强行重绘逻辑
const handleResize = () => {
  if (defectTypeChartInstance) defectTypeChartInstance.resize();
  if (riskChartInstance) riskChartInstance.resize();
};

// ================= 核心图表绘制逻辑 =================
const initCharts = () => {
  if (defectTypeChartInstance) defectTypeChartInstance.destroy();
  if (riskChartInstance) riskChartInstance.destroy();

  if (!defectTypeChartCanvas.value || !riskChartCanvas.value) return;

  const records = historyStore.historyRecords;
  if (records.length === 0) return; // 无数据不渲染

  // ====== 准备类别分布数据 ======
  // 初始化累计变量
  let totalCrack = 0, totalEfflorescence = 0, totalBare = 0, totalSpalling = 0;
  
  // 统揽所有历史记录
  records.forEach(r => {
    const classCount = r.reportData?.task_summary?.class_count;
    if (classCount) {
      totalCrack += classCount.crack || 0;
      totalEfflorescence += classCount.efflorescence || 0;
      totalBare += classCount['exposed rebar'] || 0;
      totalSpalling += classCount.spalling || 0;
    }
  });

  // ====== 准备风险分布数据 ======
  let totalLow = 0, totalMedium = 0, totalHigh = 0;
  records.forEach(r => {
    const risk = r.reportData?.task_summary?.risk_distribution;
    if (risk) {
      totalLow += risk.low || 0;
      totalMedium += risk.medium || 0;
      totalHigh += risk.high || 0;
    }
  });

  // ====== Chart.js 全局机甲风设定 ======
  Chart.defaults.color = 'rgba(0, 229, 255, 0.5)';
  Chart.defaults.font.family = "'Roboto Mono Local', monospace";

  // ====== ⭐ 绘制类别分布柱状图 (Bar Chart) ======
  const ctxTrend = defectTypeChartCanvas.value.getContext('2d');
  const gradientTrend = ctxTrend.createLinearGradient(0, 0, 0, 300);
  gradientTrend.addColorStop(0, 'rgba(0, 229, 255, 0.4)'); // 顶部高亮
  gradientTrend.addColorStop(1, 'rgba(0, 229, 255, 0.0)'); // 底部消散

  defectTypeChartInstance = new Chart(defectTypeChartCanvas.value, {
    type: 'bar',
    data: {
      labels: ['裂缝', '泛碱', '钢筋 bare', '剥落'],
      datasets: [{
        label: '累计发现数量',
        data: [totalCrack, totalEfflorescence, totalBare, totalSpalling],
        borderColor: '#00e5ff',
        backgroundColor: gradientTrend, // 使用渐变填充
        borderWidth: { top: 2, right: 1, bottom: 0, left: 1 }, // 只要顶部有清晰切边
        borderRadius: 4,     // 顶部微小切角
        barThickness: 24,    // 锁定柱状图宽度
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // 关键修复 4: 强制图表跟随 Canvas 容器填满，不保持固定比例，防止崩坏
      plugins: { 
        legend: { display: false },
        tooltip: { backgroundColor: 'rgba(2,8,16,0.95)', titleColor: '#00e5ff', borderColor: '#00e5ff', borderWidth: 1 }
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

  // ====== 绘制累计风险分布环形图 (Doughnut Chart) ======
  riskChartInstance = new Chart(riskChartCanvas.value, {
    type: 'doughnut',
    data: {
      labels: ['低风险(Low)', '中风险(Med)', '高风险(High)'],
      datasets: [{
        data: [totalLow, totalMedium, totalHigh],
        backgroundColor: ['rgba(0, 255, 170, 0.85)', 'rgba(255, 170, 0, 0.85)', 'rgba(255, 51, 51, 0.85)'],
        borderWidth: 0, 
        spacing: 5,     
        borderRadius: 10, 
        hoverOffset: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // 关键修复 4
      cutout: '78%', 
      plugins: {
        legend: { position: 'bottom', labels: { padding: 15, boxWidth: 10, usePointStyle: true, color: '#00e5ff' } },
        tooltip: { backgroundColor: 'rgba(2,8,16,0.95)', bodyColor: '#fff', borderColor: 'rgba(255,255,255,0.2)', borderWidth: 1 }
      }
    }
  });
};
</script>

<style scoped>
/* ================= 页面根容器布局基础 ================= */
.page-container { 
  width: 100%; 
  max-width: 1000px; 
  margin: 0 auto; 
  padding: 20px; 
  display: flex; 
  flex-direction: column; 
  gap: 30px; 
  animation: deployFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
}

/* ================= 顶部看板：赛博战术面板 ================= */
.cyber-panel { 
  position: relative; 
  background: rgba(2, 8, 16, 0.85); 
  backdrop-filter: blur(12px); 
  border: 1px solid rgba(0, 229, 255, 0.3); 
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(0, 229, 255, 0.05); 
  padding: 40px; 
  text-align: center; 
}

/* 四角锁定游标 */
.terminal-bracket { 
  position: absolute; 
  width: 30px; 
  height: 30px; 
  border: 2px solid transparent; 
  z-index: 15; 
}
.tb-tl { top: -2px; left: -2px; border-top-color: #00e5ff; border-left-color: #00e5ff; }
.tb-tr { top: -2px; right: -2px; border-top-color: #00e5ff; border-right-color: #00e5ff; }
.tb-bl { bottom: -2px; left: -2px; border-bottom-color: #00e5ff; border-left-color: #00e5ff; }
.tb-br { bottom: -2px; right: -2px; border-bottom-color: #00e5ff; border-right-color: #00e5ff; }

/* 标题样式 */
.hero-content { 
  user-select: none;
  position: relative; 
  z-index: 5; 
}
.cyber-title { 
  font-family: 'Orbitron', sans-serif; 
  font-size: 36px; 
  font-weight: 900; 
  color: #fff; 
  letter-spacing: 6px; 
  margin: 0 0 10px 0; 
  text-shadow: 0 0 20px rgba(0, 229, 255, 0.6); 
}
.subtitle { 
  color: rgba(0, 229, 255, 0.8); 
  font-size: 16px; 
  letter-spacing: 4px; 
  margin-bottom: 40px; 
}

/* 数据卡片网格 */
.stats-grid { 
  display: flex; 
  justify-content: center; 
  gap: 30px; 
}

/* 单个数据卡片 */
.stat-box { 
  position: relative; 
  display: flex; 
  align-items: center; 
  gap: 20px; 
  background: rgba(0, 229, 255, 0.02); 
  border: 1px solid rgba(0, 229, 255, 0.2); 
  border-left: 3px solid #00e5ff; 
  padding: 20px 30px; 
  border-radius: 4px; 
  transition: all 0.3s ease; 
  min-width: 250px; 
}
.stat-box:hover { 
  transform: translateY(-5px); 
  background: rgba(0, 229, 255, 0.08); 
  box-shadow: 0 10px 20px rgba(0, 229, 255, 0.15), inset 0 0 15px rgba(0, 229, 255, 0.1); 
}
.stat-box i { 
  font-size: 40px; 
  color: #00e5ff; 
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.5); 
}
.stat-info { 
  display: flex; 
  flex-direction: column; 
  text-align: left; 
}
.label { 
  font-size: 12px; 
  font-family: 'Roboto Mono Local', monospace; 
  color: rgba(255, 255, 255, 0.6); 
  letter-spacing: 1px; 
  margin-bottom: 4px; 
}
.value { 
  font-family: 'Orbitron', sans-serif; 
  font-size: 28px; 
  font-weight: bold; 
}
.value small { 
  font-size: 14px; 
  margin-left: 6px; 
  color: rgba(255, 255, 255, 0.4); 
}

/* 顶部高光修饰线 */
.stat-border-top { 
  position: absolute; 
  top: 0; 
  right: 0; 
  width: 40px; 
  height: 2px; 
  background: #00e5ff; 
}

/* 警告色卡片特调 */
.warning-card { 
  border-left-color: #ff3333; 
  border-color: rgba(255, 51, 51, 0.3); 
  background: rgba(255, 51, 51, 0.02); 
}
.warning-card:hover { 
  background: rgba(255, 51, 51, 0.08); 
  box-shadow: 0 10px 20px rgba(255, 51, 51, 0.15), inset 0 0 15px rgba(255, 51, 51, 0.1); 
}
.warning-card i { 
  color: #ff3333; 
  text-shadow: 0 0 10px rgba(255, 51, 51, 0.5); 
}
.warning-card .stat-border-top { 
  background: #ff3333; 
}

/* 文字发光色库 */
.text-cyan { color: #00e5ff; text-shadow: 0 0 8px rgba(0, 229, 255, 0.5); } 
.text-green { color: #00ffaa; text-shadow: 0 0 8px rgba(0, 255, 170, 0.5); } 
.text-orange { color: #ffaa00; text-shadow: 0 0 8px rgba(255, 170, 0, 0.5); } 
.text-red { color: #ff3333; text-shadow: 0 0 8px rgba(255, 51, 51, 0.5); }

/* ================= 底部：数据图谱网格 ================= */
.charts-section {
  width: 100%;
}
.hud-charts-grid { 
  display: grid; 
  grid-template-columns: 1fr 1fr; /* 保持左右并列，符合宽屏审美 */
  gap: 30px; 
}

/* ⭐ 关键修复 5: 强制设置图表盒子的固定高度，不再跟随排版混乱 */
.hud-chart-box { 
  user-select: none;
  position: relative; 
  background: rgba(2, 8, 16, 0.7); 
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 229, 255, 0.2); 
  padding: 20px; 
  height: 320px; /* ⭐ 写死高度 */
  display: flex; 
  flex-direction: column; 
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

/* 图表装饰角 */
.chart-corner { 
  position: absolute; 
  width: 15px; 
  height: 15px; 
  border: 2px solid transparent; 
}
.cc-tl { top: -1px; left: -1px; border-top-color: #00e5ff; border-left-color: #00e5ff; } 
.cc-br { bottom: -1px; right: -1px; border-bottom-color: #00e5ff; border-right-color: #00e5ff; }

/* 图表标题 */
.chart-title { 
  user-select: none;
  color: #fff; 
  font-family: 'Roboto Mono Local', monospace; 
  font-size: 13px; 
  text-align: center; 
  margin-top: 0; 
  margin-bottom: 15px; 
  letter-spacing: 2px; 
}

/* 内部 Canvas 容器 */
.chart-wrapper { 
  flex: 1; 
  position: relative; 
  width: 100%; 
  height: 100%; 
  min-height: 0; 
}

/* 环形反应堆文字居中设定 */
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
  /* 核心修复：把 50% 调小到 42% 左右，用来抵消底部图例占据的空间 */
  top: 42%; 
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

/* ================= 动画支持 ================= */
@keyframes deployFade { 
  0% { opacity: 0; transform: translateY(20px) scale(0.98); } 
  100% { opacity: 1; transform: translateY(0) scale(1); } 
}

</style>