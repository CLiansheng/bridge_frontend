<template>
  <div class="page-container">
    <div class="glass-panel">
      <h2 class="title">历史检测档案</h2>
      <table class="cyber-table">
        <thead>
          <tr>
            <th>任务批次号</th>
            <th>检测时间</th>
            <th>上传方式</th>
            <th>病害数量</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 5" :key="i">
            <td class="id-col">BATCH-2026030{{i}}</td>
            <td>2026-03-04 14:2{{i}}:00</td>
            <td>{{ i % 2 === 0 ? '批量 ZIP' : '单张图片' }}</td>
            <td class="alert-text">{{ i * 2 }} 处</td>
            <td><span class="status-tag success">已完成</span></td>
            <td><button class="link-btn">查看报告</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.page-container { animation: fadeIn 0.5s ease; }
.glass-panel {  border: 1px solid var(--glass-border); border-radius: 16px; padding: 30px; }
.title { color: #fff; margin-bottom: 20px; font-size: 20px; border-left: 4px solid var(--neon-blue); padding-left: 10px; }
.cyber-table { width: 100%; border-collapse: collapse; text-align: left; }
.cyber-table th { padding: 16px; color: var(--text-muted); font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.1); }
.cyber-table td { padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 14px; transition: 0.3s; }
.cyber-table tbody tr:hover td { background: rgba(0, 242, 254, 0.05); }
.id-col { color: var(--neon-purple); font-family: monospace; }
.alert-text { color: #f59e0b; font-weight: bold; }
.status-tag.success { background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 4px 10px; border-radius: 4px; font-size: 12px; border: 1px solid rgba(16,185,129,0.3); }
.link-btn { background: none; border: none; color: var(--neon-blue); cursor: pointer; text-decoration: underline; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>