<template>
  <div class="page-container">
    <div class="glass-panel profile-card">
      <div class="avatar-section">
        <div class="avatar-wrapper">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bridge" alt="Avatar">
          <div class="edit-overlay"><i class='bx bx-camera'></i></div>
        </div>
        <div class="user-intro">
          <h2>专家用户</h2>
          <p>系统管理员 / 高级桥梁工程师</p>
        </div>
      </div>

      <div class="divider"></div>

      <div class="info-form">
        <div class="form-group">
          <label>邮箱地址</label>
          <input type="text" value="expert@nexus-bridge.com" disabled>
        </div>
        <div class="form-group">
          <label>联系电话</label>
          <input type="text" value="138****8888">
        </div>
        <button class="save-btn">更新资料</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container { max-width: 600px; margin: 0 auto; animation: fadeIn 0.5s ease; }
.glass-panel { border: 1px solid var(--glass-border); border-radius: 16px; padding: 40px; }
.avatar-section { display: flex; align-items: center; gap: 24px; }
.avatar-wrapper { position: relative; width: 80px; height: 80px; border-radius: 50%; overflow: hidden; border: 2px solid var(--neon-blue); cursor: pointer; }
.avatar-wrapper img { width: 100%; height: 100%; background: #1a202c; }
.edit-overlay { position: absolute; bottom: 0; left: 0; width: 100%; height: 30%; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; color: white; opacity: 0; transition: 0.3s; }
.avatar-wrapper:hover .edit-overlay { opacity: 1; }
.user-intro h2 { margin: 0; color: #fff; font-size: 22px; }
.user-intro p { margin: 5px 0 0 0; color: var(--text-muted); font-size: 14px; }
.divider { height: 1px; background: rgba(255,255,255,0.1); margin: 30px 0; }
.form-group { margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
.form-group label { color: var(--text-muted); font-size: 13px; }
.form-group input { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); padding: 12px; border-radius: 8px; color: #fff; outline: none; transition: 0.3s; }
.form-group input:focus { border-color: var(--neon-blue); }
.form-group input:disabled { color: #666; cursor: not-allowed; }
.save-btn { margin-top: 10px; width: 100%; background: transparent; border: 1px solid var(--neon-blue); color: var(--neon-blue); padding: 12px; border-radius: 8px; cursor: pointer; transition: 0.3s; }
.save-btn:hover { background: rgba(0, 242, 254, 0.1); box-shadow: 0 0 15px rgba(0,242,254,0.3); }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>