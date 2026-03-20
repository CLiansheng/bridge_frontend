<template>
  <div class="page-container">
    <div class="glass-panel hero-section">
      <h1 class="gradient-text">NEXUS 桥梁数字孪生中心</h1>
      <p class="subtitle">实时监控 / 智能诊断 / 结构健康评估</p>
      
      <div class="stats-grid">
        <div class="stat-box">
          <i class='bx bx-bridge'></i>
          <div class="stat-info">
            <span class="label">监控桥梁总数</span>
            <span class="value">12<small>座</small></span>
          </div>
        </div>
        <div class="stat-box">
          <i class='bx bx-scan'></i>
          <div class="stat-info">
            <span class="label">累计诊断次数</span>
            <span class="value">3,492<small>次</small></span>
          </div>
        </div>
        <div class="stat-box warning">
          <i class='bx bx-error'></i>
          <div class="stat-info">
            <span class="label">当前预警</span>
            <span class="value">2<small>项</small></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container { height: 100%; display: flex; flex-direction: column; gap: 24px; animation: fadeIn 0.5s ease; }
.glass-panel {   border: 1px solid var(--glass-border); border-radius: 16px; padding: 40px; }
.hero-section { text-align: center; }
.gradient-text { font-size: 36px; font-weight: 700; background: linear-gradient(to right, #fff, var(--neon-blue)); background-clip: text; margin-bottom: 10px; }
.subtitle { color: var(--text-muted); font-size: 16px; letter-spacing: 2px; margin-bottom: 40px; }
.stats-grid { display: flex; justify-content: center; gap: 30px; }
.stat-box { display: flex; align-items: center; gap: 20px; background: rgba(255,255,255,0.03); padding: 20px 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); transition: 0.3s; }
.stat-box:hover { transform: translateY(-5px); border-color: var(--neon-blue); box-shadow: 0 10px 20px rgba(0,242,254,0.1); }
.stat-box i { font-size: 40px; color: var(--neon-blue); }
.stat-info { display: flex; flex-direction: column; text-align: left; }
.label { font-size: 12px; color: var(--text-muted); }
.value { font-size: 28px; font-weight: bold; color: #fff; }
.value small { font-size: 14px; margin-left: 4px; color: var(--text-muted); }
.stat-box.warning:hover { border-color: #ef4444; box-shadow: 0 10px 20px rgba(239,68,68,0.1); }
.stat-box.warning i { color: #ef4444; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>