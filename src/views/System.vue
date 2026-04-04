<template>
  <div class="system-container">
    <section class="cyber-panel profile-panel">
      <div class="terminal-bracket tb-tl"></div>
      <div class="terminal-bracket tb-tr"></div>
      <div class="terminal-bracket tb-bl"></div>
      <div class="terminal-bracket tb-br"></div>

      <div class="panel-inner">
        <div class="panel-header">
          <div class="sys-badge">
            <span class="badge-icon"></span>
            SYS_USER_PROFILE
          </div>
          <h2 class="cyber-title">系统用户档案</h2>
          <div class="header-divider"></div>
        </div>

        <div class="profile-layout">
          <div class="avatar-zone">
            <div class="avatar-ring-outer"></div>
            <div class="avatar-ring-inner"></div>
            
            <div class="avatar-upload-wrapper" @click="triggerAvatarUpload">
              <img v-if="avatarUrl" :src="avatarUrl" class="poly-avatar" />
              <div v-else class="poly-avatar placeholder"></div>
              
              <div class="upload-hud">
                <i class='bx bx-scan'></i>
                <span>扫描更换</span>
              </div>
            </div>
            
            <input type="file" ref="fileInput" class="hidden-input" accept="image/*" @change="handleAvatarUpload">
            
            <div class="avatar-uid">UID: {{ userForm.phone || 'UNKNOWN' }}</div>
          </div>

          <div class="data-form-zone">
            <div class="input-group">
              <input type="text" id="sys-username" v-model="userForm.username" placeholder=" ">
              <label for="sys-username">用户名称</label>
              <div class="input-energy-bar"></div>
              <div class="input-corner"></div>
            </div>

            <div class="input-group locked-group">
              <input type="tel" id="sys-phone" :value="userForm.phone" placeholder=" " readonly>
              <label for="sys-phone">邮箱</label>
              <div class="input-energy-bar"></div>
              <div class="input-corner"></div>
            </div>

            <button class="cyber-submit-btn" @click="saveUserInfo" :disabled="!hasChanges">
              <div class="btn-bg"></div>
              <span class="btn-text">
                {{ hasChanges ? '>> 覆 写 更 新 数 据' : '数 据 已 同 步' }}
              </span>
              <div class="btn-glitch-layer"></div>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useUserStore } from '@/stores/user'

// 引入全局用户状态仓库
const userStore = useUserStore()
const fileInput = ref(null)
const avatarUrl = ref('')

// 本地表单状态，用于和原始数据做对比
const userForm = ref({ username: '', phone: '' })
const originalUserInfo = ref({})

// 页面加载时初始化数据
onMounted(() => {
  userStore.loadUserInfo()
  avatarUrl.value = userStore.avatar
  userForm.value = {
    username: userStore.username,
    phone: userStore.phone
  }
  // 保存一份原始数据的拷贝，用于判断是否有修改
  originalUserInfo.value = { ...userForm.value }
})

// 监听跨组件的头像数据变化
watch(() => userStore.avatar, (newAvatar) => { 
  avatarUrl.value = newAvatar 
})

// 触发隐藏的 input 框点击事件
const triggerAvatarUpload = () => { 
  fileInput.value.click() 
}

// 处理头像上传：将图片转为 Base64 格式保存在本地
const handleAvatarUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target.result
      avatarUrl.value = base64
      userStore.updateUserInfo({ avatar: base64 }) // 立即更新到 Store 同步全局
    }
    reader.readAsDataURL(file)
  }
}

// 动态计算属性：验证表单数据是否发生变化，以控制按钮的禁用状态
const hasChanges = computed(() => {
  return JSON.stringify(userForm.value) !== JSON.stringify(originalUserInfo.value)
})

// 保存修改的用户信息
const saveUserInfo = () => {
  if (hasChanges.value) {
    userStore.updateUserInfo(userForm.value)
    // 更新完成后重新对齐原始数据基准
    originalUserInfo.value = { ...userForm.value }
  }
}
</script>

<style scoped>
/* ================= 极简继承科技风核心 ================= */
.system-container {
  width: 100%;
  max-width: 800px;
  margin: 50px auto 0;
  animation: deployFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  /* 核心需求：禁止用户选择文字，增强 UI 面板沉浸感 */
  user-select: none; 
}

/* 主面板背景与模糊效果 */
.profile-panel {
  position: relative;
  background: rgba(2, 8, 16, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 229, 255, 0.3);
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(0, 229, 255, 0.05);
}

.panel-inner {
  padding: 40px;
}

/* 面板四角战术边框 */
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

/* 标题区排版 */
.panel-header {
  text-align: center;
  margin-bottom: 40px;
}

/* 系统标识胸牌 */
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
  font-family: 'Roboto Mono Local', monospace;
}

/* 标牌闪烁点 */
.badge-icon {
  width: 6px;
  height: 6px;
  background: #00e5ff;
  border-radius: 50%;
  animation: blink 1s infinite;
}

/* 标题字体 */
.cyber-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 28px;
  color: #fff;
  letter-spacing: 6px;
  margin: 0;
  text-shadow: 0 0 15px rgba(0, 229, 255, 0.5);
}

/* 标题下方的发光分割线 */
.header-divider {
  margin-top: 20px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.5), transparent);
}

/* 主体分栏：左右两列 */
.profile-layout {
  display: flex;
  gap: 50px;
  align-items: center;
}

/* 左侧：头像区 */
.avatar-zone {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 头像外侧旋转虚线环 */
.avatar-ring-outer {
  position: absolute;
  width: 180px;
  height: 180px;
  border: 1px dashed rgba(0, 229, 255, 0.5);
  border-radius: 50%;
  animation: radarSpin 20s linear infinite;
  pointer-events: none;
}

/* 头像内侧实线边框 */
.avatar-ring-inner {
  position: absolute;
  width: 140px;
  height: 140px;
  border: 2px solid rgba(0, 229, 255, 0.2);
  border-radius: 50%;
  pointer-events: none;
}

/* 头像底部的 UID 显示 */
.avatar-uid {
  position: absolute;
  bottom: -30px;
  font-family: 'Roboto Mono Local', monospace;
  color: #00e5ff;
  font-size: 12px;
  letter-spacing: 2px;
  text-shadow: 0 0 8px rgba(0, 229, 255, 0.6);
}

/* 头像六边形裁切包裹层 */
.avatar-upload-wrapper {
  position: relative;
  width: 110px;
  height: 110px;
  cursor: pointer;
  z-index: 10;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  overflow: hidden;
  border: 2px solid #00e5ff;
  background: rgba(0, 229, 255, 0.05);
}

/* 真实的头像图片 */
.poly-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 占位图背景 */
.poly-avatar.placeholder {
  background: repeating-linear-gradient(45deg, rgba(0, 229, 255, 0.1), rgba(0, 229, 255, 0.1) 10px, transparent 10px, transparent 20px);
}

/* 鼠标悬停时的上传交互 UI */
.upload-hud {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(2, 8, 16, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #00e5ff;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-upload-wrapper:hover .upload-hud {
  opacity: 1;
}

.upload-hud i {
  font-size: 24px;
  margin-bottom: 5px;
}

.upload-hud span {
  font-size: 11px;
  font-family: 'Roboto Mono Local', monospace;
}

/* 隐藏原生文件上传按钮 */
.hidden-input {
  display: none;
}

/* 右侧：表单区 */
.data-form-zone {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* 机甲输入框组 */
.input-group {
  position: relative;
}

/* 输入框核心样式 */
.input-group input {
  width: 100%;
  background: rgba(0, 229, 255, 0.03);
  border: 1px solid rgba(0, 229, 255, 0.2);
  padding: 15px 15px 15px 20px;
  color: #fff;
  font-size: 15px;
  font-family: 'Roboto Mono Local', monospace;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
  /* 表单输入处放开选择限制，允许输入操作 */
  user-select: auto; 
}

/* 输入框悬浮占位标签 */
.input-group label {
  position: absolute;
  top: 16px;
  left: 20px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
  font-family: 'Roboto Mono Local', monospace;
  letter-spacing: 1px;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* 输入框聚焦时标签上移缩小 */
.input-group input:focus ~ label,
.input-group input:not(:placeholder-shown) ~ label {
  transform: translate3d(-20px, -38px, 0) scale(0.85);
  color: #00e5ff;
}

/* 输入框底部发光能量条 */
.input-energy-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0%;
  background: #00e5ff;
  box-shadow: 0 0 10px #00e5ff;
  transition: width 0.4s ease;
}

.input-group input:focus ~ .input-energy-bar,
.input-group input:not(:placeholder-shown) ~ .input-energy-bar {
  width: 100%;
}

/* 输入框聚焦时右下角折角效果 */
.input-corner {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 10px;
  height: 10px;
  border-bottom: 2px solid #00e5ff;
  border-right: 2px solid #00e5ff;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.input-group input:focus ~ .input-corner {
  opacity: 1;
}

/* ================= 锁定输入框的特殊样式 (核心凭证不可修改) ================= */
.locked-group input {
  color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  cursor: not-allowed;
  user-select: none;
}

/* 锁定状态下，禁用原本的标签高亮效果 */
.locked-group input:focus ~ label,
.locked-group input:not(:placeholder-shown) ~ label {
  color: rgba(255, 255, 255, 0.3);
}

/* 锁定状态下，禁用底部能量条动画 */
.locked-group .input-energy-bar {
  display: none;
}

/* 锁定状态下，禁用边角动画 */
.locked-group .input-corner {
  display: none;
}

/* 赛博提交按钮 */
.cyber-submit-btn {
  width: 100%;
  position: relative;
  background: rgba(0, 30, 45, 0.8);
  border: 1px solid rgba(0, 229, 255, 0.5);
  padding: 18px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s ease;
  margin-top: 10px;
}

/* 按钮内部悬停扫描光效背景 */
.btn-bg {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.2), transparent);
  transition: left 0.4s ease;
}

.cyber-submit-btn:hover:not(:disabled) .btn-bg {
  left: 100%;
}

/* 按钮文字层 */
.btn-text {
  position: relative;
  z-index: 2;
  color: #00e5ff;
  font-family: 'Roboto Mono Local', monospace;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  transition: color 0.3s ease;
}

/* 按钮悬停状态特效 */
.cyber-submit-btn:hover:not(:disabled) {
  background: rgba(0, 229, 255, 0.15);
  box-shadow: 0 0 30px rgba(0, 229, 255, 0.3);
}

.cyber-submit-btn:hover:not(:disabled) .btn-text {
  color: #fff;
  text-shadow: 0 0 10px #fff;
}

/* 按钮禁用状态（未修改时） */
.cyber-submit-btn:disabled {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  cursor: not-allowed;
}

.cyber-submit-btn:disabled .btn-text {
  color: rgba(255, 255, 255, 0.3);
}

/* 面板加载动画 */
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

/* 闪烁动画 */
@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

/* 雷达圆环旋转动画 */
@keyframes radarSpin {
  100% {
    transform: rotate(360deg);
  }
}
</style>