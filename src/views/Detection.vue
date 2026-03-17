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
        <input type="file" class="hidden-input" multiple>
      </div>

      <div class="action-bar">
        <button class="btn primary">开始 AI 诊断</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container { max-width: 800px; margin: 0 auto; animation: fadeIn 0.5s ease; }
.glass-panel { border: 1px solid var(--glass-border); border-radius: 16px; padding: 40px; }
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
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>