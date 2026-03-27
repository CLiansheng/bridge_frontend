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

    <!-- ================= 项目简介按钮 ================= -->
    <div class="project-info-section">
      <button class="info-toggle-btn" @click="toggleInfo">
        <i class='bx bx-info-circle'></i>
        <span>项目简介</span>
        <i class='bx' :class="isInfoOpen ? 'bx-chevron-up' : 'bx-chevron-down'"></i>
      </button>
    </div>

    <!-- ================= 项目简介展开页面 ================= -->
    <div class="info-overlay" :class="{ 'open': isInfoOpen }">
      <div class="info-content">
        <!-- 装饰元素 -->
        <div class="info-decoration top-left"></div>
        <div class="info-decoration top-right"></div>
        <div class="info-decoration bottom-left"></div>
        <div class="info-decoration bottom-right"></div>
        
        <div class="info-header">
          <h2 class="info-title">SPANS 桥梁病害诊断系统</h2>
          <button class="close-btn" @click="toggleInfo">
            X
          </button>
        </div>
        
        <div class="info-body">
          <!-- 平台简介 -->
          <section class="info-section">
            <div class="section-header">
              <div class="section-border"></div>
              <h3>平台简介</h3>
              <div class="section-border"></div>
            </div>
            <div class="section-content">
              <div class="info-text">
                <p class="info-text-highlight">SPANS 桥梁病害诊断系统是一款基于人工智能技术的桥梁结构健康监测与评估平台，旨在为桥梁维护提供高效、准确的病害诊断解决方案。</p>
                <p>系统通过先进的计算机视觉技术，对桥梁表面图像进行智能分析，自动识别裂缝、泛碱、钢筋裸露、剥落等常见病害，并评估其风险等级。</p>
                <p>我们的目标是利用AI技术提升桥梁检测的效率和准确性，为桥梁安全保驾护航。</p>
              </div>
              <div class="info-image-placeholder large"></div>
            </div>
          </section>

          <!-- 核心功能 -->
          <section class="info-section">
            <div class="section-header">
              <div class="section-border"></div>
              <h3>核心功能</h3>
              <div class="section-border"></div>
            </div>
            <div class="section-content">
              <div class="feature-grid enhanced">
                <div class="feature-item feature-item-1">
                  <div class="feature-image">
                    <img src="" alt="智能病害检测" class="feature-img">
                  </div>
                  <div class="feature-text">
                    <h4>智能病害检测</h4>
                    <p>利用AI算法自动识别多种桥梁病害类型</p>
                  </div>
                </div>
                <div class="feature-item feature-item-2">
                  <div class="feature-image">
                    <img src="" alt="风险等级评估" class="feature-img">
                  </div>
                  <div class="feature-text">
                    <h4>风险等级评估</h4>
                    <p>根据病害严重程度评估风险等级</p>
                  </div>
                </div>
                <div class="feature-item feature-item-3">
                  <div class="feature-image">
                    <img src="" alt="历史记录管理" class="feature-img">
                  </div>
                  <div class="feature-text">
                    <h4>历史记录管理</h4>
                    <p>存储和管理历史诊断记录</p>
                  </div>
                </div>
                <div class="feature-item feature-item-4">
                  <div class="feature-image">
                    <img src="" alt="报告生成" class="feature-img">
                  </div>
                  <div class="feature-text">
                    <h4>报告生成</h4>
                    <p>自动生成详细的诊断报告</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 操作流程 -->
          <section class="info-section">
            <div class="section-header">
              <div class="section-border"></div>
              <h3>操作流程</h3>
              <div class="section-border"></div>
            </div>
            <div class="section-content">
              <div class="process-steps enhanced">
                <div class="step-item step-item-1">
                  <div class="step-number">1</div>
                  <div class="step-content">
                    <h4>上传图片</h4>
                    <p>上传桥梁表面图像或ZIP压缩包</p>
                  </div>
                </div>
                <div class="step-connector">
                  <span>→</span>
                </div>
                <div class="step-item step-item-2">
                  <div class="step-number">2</div>
                  <div class="step-content">
                    <h4>AI分析</h4>
                    <p>系统自动分析识别病害</p>
                  </div>
                </div>
                <div class="step-connector">
                  <span>→</span>
                </div>
                <div class="step-item step-item-3">
                  <div class="step-number">3</div>
                  <div class="step-content">
                    <h4>查看报告</h4>
                    <p>查看详细的诊断报告</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 应用场景 -->
          <section class="info-section">
            <div class="section-header">
              <div class="section-border"></div>
              <h3>应用场景</h3>
              <div class="section-border"></div>
            </div>
            <div class="section-content">
              <div class="scenario-container">
                <div class="scenario-item scenario-item-1">
                  <div class="scenario-content">
                    <div class="scenario-image">
                      <img src="" alt="桥梁定期检测" class="scenario-img">
                    </div>
                    <div class="scenario-text">
                      <h4>桥梁定期检测</h4>
                      <p>用于桥梁的定期健康检查，通过AI技术快速识别潜在病害，提高检测效率和准确性。系统能够自动分析桥梁表面图像，识别裂缝、腐蚀等常见病害，为桥梁维护提供科学依据。</p>
                    </div>
                  </div>
                </div>
                <div class="scenario-item scenario-item-2">
                  <div class="scenario-content reverse">
                    <div class="scenario-image">
                      <img src="" alt="灾后评估" class="scenario-img">
                    </div>
                    <div class="scenario-text">
                      <h4>灾后评估</h4>
                      <p>自然灾害后快速评估桥梁损伤程度，为应急响应提供决策支持。系统能够在短时间内处理大量图像数据，评估桥梁结构完整性，帮助相关部门制定合理的修复方案。</p>
                    </div>
                  </div>
                </div>
                <div class="scenario-item scenario-item-3">
                  <div class="scenario-content">
                    <div class="scenario-image">
                      <img src="" alt="维护决策" class="scenario-img">
                    </div>
                    <div class="scenario-text">
                      <h4>维护决策</h4>
                      <p>为桥梁维护提供数据支持，基于AI分析结果生成维护建议。系统能够根据病害类型、严重程度和发展趋势，推荐最优维护方案，帮助管理部门合理分配资源。</p>
                    </div>
                  </div>
                </div>
                <div class="scenario-item scenario-item-4">
                  <div class="scenario-content reverse">
                    <div class="scenario-image">
                      <img src="" alt="长期监测" class="scenario-img">
                    </div>
                    <div class="scenario-text">
                      <h4>长期监测</h4>
                      <p>跟踪桥梁病害发展趋势，建立桥梁健康档案。通过定期检测和数据分析，系统能够预测病害发展方向，为桥梁的全生命周期管理提供支持。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <!-- 展开页面返回顶部按钮 -->
      <button class="info-back-to-top" @click="scrollToTopInfo">
        <i class='bx bx-arrow-to-top'></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useHistoryStore } from '../stores/history';
import Chart from 'chart.js/auto';

// ================= 状态与 Store =================
const historyStore = useHistoryStore();

// ================= 项目简介展开状态 =================
const isInfoOpen = ref(false);

const toggleInfo = () => {
  isInfoOpen.value = !isInfoOpen.value;
};

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

// 返回顶部功能
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// 展开页面返回顶部功能
const scrollToTopInfo = () => {
  const infoContent = document.querySelector('.info-content');
  if (infoContent) {
    infoContent.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
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
  overflow-y: hidden;
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

/* ================= 项目简介按钮 ================= */
.project-info-section {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 20px;
}

.info-toggle-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 229, 255, 0.1);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 25px;
  padding: 12px 30px;
  color: #00e5ff;
  font-family: 'Roboto Mono Local', monospace;
  font-size: 14px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.1);
}

.info-toggle-btn:hover {
  background: rgba(0, 229, 255, 0.2);
  box-shadow: 0 0 30px rgba(0, 229, 255, 0.2);
  transform: translateY(-2px);
}

.info-toggle-btn i {
  font-size: 18px;
  transition: transform 0.3s ease;
}

/* ================= 项目简介展开页面 ================= */
.info-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.info-overlay.open {
  opacity: 1;
  visibility: visible;
}

.info-content {
  background: rgba(2, 8, 16, 0.95);
  border-top: 2px solid #00e5ff;
  border-left: 1px solid rgba(0, 229, 255, 0.2);
  border-right: 1px solid rgba(0, 229, 255, 0.2);
  width: 100%;
  max-width: 1600px;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
  transform: translateY(100%);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 -10px 60px rgba(0, 229, 255, 0.15);
  position: relative;
}

.info-overlay.open .info-content {
  transform: translateY(0);
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  border-bottom: 1px solid rgba(0, 229, 255, 0.2);
  background: rgba(0, 229, 255, 0.05);
}

.info-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 24px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 4px;
  margin: 0;
  text-shadow: 0 0 20px rgba(0, 229, 255, 0.6);
}

.close-btn {
  background: none;
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00e5ff;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(0, 229, 255, 0.2);
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
}

.info-body {
  padding: 50px;
}

.info-section {
  margin-bottom: 50px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 40px;
  justify-content: center;
}

.section-border {
  width: 40px;
  height: 2px;
  background: #00e5ff;
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
}

.section-header h3 {
  font-family: 'Orbitron', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #00e5ff;
  letter-spacing: 2px;
  margin: 0;
}

.section-content {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.info-text {
  flex: 1;
}

.info-text p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 15px;
  font-family: 'Roboto Mono Local', monospace;
  font-size: 14px;
}

.info-text-highlight {
  font-size: 16px !important;
  font-weight: bold;
  color: #00e5ff !important;
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
  margin-bottom: 20px !important;
}

.info-image-placeholder {
  width: 300px;
  height: 200px;
  background: linear-gradient(45deg, rgba(0, 229, 255, 0.1), rgba(0, 229, 255, 0.05));
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.info-image-placeholder.large {
  width: 400px;
  height: 280px;
  box-shadow: 0 0 40px rgba(0, 229, 255, 0.15);
}

.info-image-placeholder.large::before {
  animation: shine 2s infinite;
}

.info-image-placeholder::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.2), transparent);
  animation: shine 3s infinite;
}

@keyframes shine {
  100% {
    left: 100%;
  }
}

/* 核心功能网格 */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  width: 100%;
}

.feature-grid.enhanced {
  gap: 40px;
}

.feature-item {
  background: rgba(0, 229, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 8px;
  padding: 30px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  min-height: 300px;
  transform: perspective(1000px) rotateY(0deg);
}

.feature-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.2), transparent);
  animation: shine 3s infinite;
  z-index: 1;
}

.feature-item:hover {
  transform: perspective(1000px) rotateY(15deg) translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 229, 255, 0.2);
}

/* 不同功能项的颜色 */
.feature-item-1 {
  border-left: 3px solid #00e5ff;
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.05), rgba(0, 229, 255, 0.02));
}

.feature-item-2 {
  border-left: 3px solid #00ffaa;
  background: linear-gradient(135deg, rgba(0, 255, 170, 0.05), rgba(0, 255, 170, 0.02));
}

.feature-item-3 {
  border-left: 3px solid #ffaa00;
  background: linear-gradient(135deg, rgba(255, 170, 0, 0.05), rgba(255, 170, 0, 0.02));
}

.feature-item-4 {
  border-left: 3px solid #ff3333;
  background: linear-gradient(135deg, rgba(255, 51, 51, 0.05), rgba(255, 51, 51, 0.02));
}

.feature-image {
  width: 100%;
  height: 180px;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  background: linear-gradient(45deg, rgba(0, 229, 255, 0.1), rgba(0, 229, 255, 0.05));
  border: 1px solid rgba(0, 229, 255, 0.2);
  transition: all 0.3s ease;
}

.feature-item:hover .feature-image {
  transform: scale(1.05);
}

.feature-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.feature-text {
  width: 100%;
  z-index: 2;
}

.feature-item h4 {
  font-family: 'Orbitron', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #00e5ff;
  letter-spacing: 1px;
  margin: 0 0 15px 0;
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
}

.feature-item-2 h4 {
  color: #00ffaa;
  text-shadow: 0 0 10px rgba(0, 255, 170, 0.5);
}

.feature-item-3 h4 {
  color: #ffaa00;
  text-shadow: 0 0 10px rgba(255, 170, 0, 0.5);
}

.feature-item-4 h4 {
  color: #ff3333;
  text-shadow: 0 0 10px rgba(255, 51, 51, 0.5);
}

.feature-item p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
  font-family: 'Roboto Mono Local', monospace;
}

/* 操作流程 */
.process-steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  gap: 20px;
}

.process-steps.enhanced {
  gap: 20px;
}

.step-item {
  flex: 1;
  min-width: 200px;
  background: rgba(0, 229, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 8px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 15px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.step-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 229, 255, 0.15);
}

/* 不同步骤的颜色 */
.step-item-1 {
  border-top: 3px solid #00e5ff;
}

.step-item-2 {
  border-top: 3px solid #00ffaa;
}

.step-item-3 {
  border-top: 3px solid #ffaa00;
}

.step-item-4 {
  border-top: 3px solid #ff3333;
}

.step-number {
  width: 50px;
  height: 50px;
  background: #00e5ff;
  color: #020810;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Orbitron', sans-serif;
  font-weight: bold;
  font-size: 18px;
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.5);
}

.step-item-2 .step-number {
  background: #00ffaa;
  box-shadow: 0 0 20px rgba(0, 255, 170, 0.5);
}

.step-item-3 .step-number {
  background: #ffaa00;
  box-shadow: 0 0 20px rgba(255, 170, 0, 0.5);
}

.step-item-4 .step-number {
  background: #ff3333;
  box-shadow: 0 0 20px rgba(255, 51, 51, 0.5);
}

.step-content {
  width: 100%;
}

.step-content h4 {
  font-family: 'Orbitron', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #00e5ff;
  letter-spacing: 1px;
  margin: 0 0 10px 0;
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
}

.step-item-2 h4 {
  color: #00ffaa;
  text-shadow: 0 0 10px rgba(0, 255, 170, 0.5);
}

.step-item-3 h4 {
  color: #ffaa00;
  text-shadow: 0 0 10px rgba(255, 170, 0, 0.5);
}

.step-item-4 h4 {
  color: #ff3333;
  text-shadow: 0 0 10px rgba(255, 51, 51, 0.5);
}

.step-content p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin: 0;
  font-family: 'Roboto Mono Local', monospace;
}

.step-connector {
  flex-shrink: 0;
  padding: 0 10px;
  color: #00e5ff;
  font-size: 20px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
}



/* 滚动条样式 */
.info-content::-webkit-scrollbar {
  width: 8px;
}

.info-content::-webkit-scrollbar-track {
  background: rgba(0, 229, 255, 0.05);
}

.info-content::-webkit-scrollbar-thumb {
  background: rgba(0, 229, 255, 0.3);
  border-radius: 4px;
}

.info-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 229, 255, 0.5);
}

/* 应用场景容器 */
.scenario-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
}

.scenario-item {
  background: rgba(0, 229, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 8px;
  padding: 40px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  transform: perspective(1000px) rotateY(0deg);
}

.scenario-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.2), transparent);
  animation: shine 3s infinite;
  z-index: 1;
}

.scenario-item:hover {
  transform: perspective(1000px) rotateY(2deg) translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 229, 255, 0.15);
}

/* 不同场景的颜色 */
.scenario-item-1 {
  border-left: 4px solid #00e5ff;
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.05), rgba(0, 229, 255, 0.02));
}

.scenario-item-2 {
  border-left: 4px solid #00ffaa;
  background: linear-gradient(135deg, rgba(0, 255, 170, 0.05), rgba(0, 255, 170, 0.02));
}

.scenario-item-3 {
  border-left: 4px solid #ffaa00;
  background: linear-gradient(135deg, rgba(255, 170, 0, 0.05), rgba(255, 170, 0, 0.02));
}

.scenario-item-4 {
  border-left: 4px solid #ff3333;
  background: linear-gradient(135deg, rgba(255, 51, 51, 0.05), rgba(255, 51, 51, 0.02));
}

.scenario-content {
  display: flex;
  align-items: center;
  gap: 40px;
  z-index: 2;
  position: relative;
}

.scenario-content.reverse {
  flex-direction: row-reverse;
}

.scenario-image {
  width: 40%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  background: linear-gradient(45deg, rgba(0, 229, 255, 0.1), rgba(0, 229, 255, 0.05));
  border: 1px solid rgba(0, 229, 255, 0.2);
  transition: all 0.3s ease;
}

.scenario-item:hover .scenario-image {
  transform: scale(1.05);
}

.scenario-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scenario-text {
  flex: 1;
  z-index: 2;
}

.scenario-item h4 {
  font-family: 'Orbitron', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #00e5ff;
  letter-spacing: 1px;
  margin: 0 0 20px 0;
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
}

.scenario-item-2 h4 {
  color: #00ffaa;
  text-shadow: 0 0 10px rgba(0, 255, 170, 0.5);
}

.scenario-item-3 h4 {
  color: #ffaa00;
  text-shadow: 0 0 10px rgba(255, 170, 0, 0.5);
}

.scenario-item-4 h4 {
  color: #ff3333;
  text-shadow: 0 0 10px rgba(255, 51, 51, 0.5);
}

.scenario-item p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
  font-family: 'Roboto Mono Local', monospace;
}

/* 返回顶部按钮 */
.info-back-to-top {
  position: absolute;
  bottom: 30px;
  right: 10px;
  width: 45px;
  height: 45px;
  background: none;
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00e5ff;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1001;
}

.info-back-to-top:hover {
  background: rgba(0, 229, 255, 0.2);
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
}



/* 返回顶部按钮 */
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: rgba(0, 229, 255, 0.1);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00e5ff;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 999;
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.1);
}

.back-to-top:hover {
  background: rgba(0, 229, 255, 0.2);
  box-shadow: 0 0 30px rgba(0, 229, 255, 0.3);
  transform: translateY(-5px);
}

/* ================= 装饰元素 ================= */
.info-decoration {
  position: absolute;
  width: 100px;
  height: 100px;
  border: 1px solid rgba(0, 229, 255, 0.1);
  pointer-events: none;
  animation: rotate 20s linear infinite;
}

.info-decoration.top-left {
  top: 20px;
  left: 20px;
  border-top-color: #00e5ff;
  border-left-color: #00e5ff;
}

.info-decoration.top-right {
  top: 20px;
  right: 20px;
  border-top-color: #00e5ff;
  border-right-color: #00e5ff;
}

.info-decoration.bottom-left {
  bottom: 20px;
  left: 20px;
  border-bottom-color: #00e5ff;
  border-left-color: #00e5ff;
}

.info-decoration.bottom-right {
  bottom: 20px;
  right: 20px;
  border-bottom-color: #00e5ff;
  border-right-color: #00e5ff;
}

/* ================= 动画支持 ================= */
@keyframes deployFade { 
  0% { opacity: 0; transform: translateY(20px) scale(0.98); } 
  100% { opacity: 1; transform: translateY(0) scale(1); } 
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>