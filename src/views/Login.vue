<template>
  <main class="login-main">
    
    <div class="terminal-deploy-wrapper">
      
      <section 
        class="auth-terminal" 
        :class="{ 
          'is-loading': authStatus === 'loading',
          'is-success': authStatus === 'success',
          'is-error': authStatus === 'error' 
        }"
      >
        
        <div class="terminal-bracket tb-tl"></div>
        <div class="terminal-bracket tb-tr"></div>
        <div class="terminal-bracket tb-bl"></div>
        <div class="terminal-bracket tb-br"></div>

        <div class="terminal-inner">
          
          <div class="terminal-header">
            <div class="sys-badge">
              <span class="badge-icon"></span>
              {{ authStatus === 'success' ? 'ACCESS_GRANTED' : (authStatus === 'error' ? 'ACCESS_DENIED' : 'SYS_LOCKED') }}
            </div>
            <h1 class="glitch-text" data-text=" 桥况智析"> 桥况智析</h1>
            <p class="subtitle">桥梁病害诊断系统</p>
            <div class="header-divider"></div>
          </div>

          <div class="tactical-tabs" v-if="authMode !== 'reset'">
            <div 
              class="tab-item" 
              :class="{ active: ['pwd', 'code'].includes(authMode) }"
              @click="switchMode('pwd')"
            >
              [ 账号登录 ]
            </div>
            <div 
              class="tab-item" 
              :class="{ active: authMode === 'register' }"
              @click="switchMode('register')"
            >
              [ 注册 ]
            </div>
          </div>
          
          <div class="reset-header" v-else>
            <span class="warning-text">>> 密码重置</span>
          </div>

          <form class="auth-form" @submit.prevent="handleSubmit">
            
            <div class="input-group">
              <input 
                type="tel" 
                id="email" 
                v-model="formData.email" 
                placeholder=" "
                autocomplete="off"
                @input="formData.email = formData.email.replace(/[^a-zA-Z0-9@._%+-]/g, ''); clearError()"
              >
              <label for="email">请输入电子邮箱</label>
              <div class="input-energy-bar"></div>
              <div class="input-corner"></div>
            </div>

            <div class="input-group code-group" v-if="['code', 'register', 'reset'].includes(authMode)">
              <input 
                type="text" 
                id="verifyCode" 
                v-model="formData.verifyCode" 
                maxlength="6"
                placeholder=" "
                autocomplete="off"
                @input="clearError()"
              >
              <label for="verifyCode">请输入验证码</label>
              <button 
                type="button" 
                class="send-code-btn" 
                :disabled="countdown > 0 || !isValidEmail"
                @click="sendCode"
              >
                {{ countdown > 0 ? `[ T-${countdown}s ]` : '[ 获取验证码 ]' }}
              </button>
              <div class="input-energy-bar"></div>
              <div class="input-corner"></div>
            </div>

            <div class="input-group password-group" v-if="['pwd', 'register', 'reset'].includes(authMode)">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                v-model="formData.password" 
                placeholder=" "
                @input="formData.password = formData.password.replace(/[^\x21-\x7E]/g, ''); clearError()"
              >
              <label for="password">
                {{ authMode === 'reset' ? '请输入新密码' : '请输入访问密码' }}
              </label>
              
              <div 
                class="cyber-eye" 
                :class="{ 'is-open': showPassword }" 
                @click="showPassword = !showPassword"
              >
                <div class="eye-ring"></div>
                <div class="eye-lens"></div>
                <div class="vault-doors">
                  <div class="door door-top"></div>
                  <div class="door door-bottom"></div>
                </div>
              </div>

              <div class="input-energy-bar"></div>
              <div class="input-corner"></div>
            </div>

            <div class="form-actions" v-if="['pwd', 'code'].includes(authMode)">
              <a href="#" class="cyber-link" @click.prevent="switchMode(authMode === 'pwd' ? 'code' : 'pwd')">
                >> {{ authMode === 'pwd' ? '验证码登录' : '密码登录' }}
              </a>
              <a href="#" class="cyber-link alert-link" @click.prevent="switchMode('reset')">
                忘记密码?
              </a>
            </div>

            <div class="form-actions single-action" v-else>
              <a href="#" class="cyber-link" @click.prevent="switchMode('pwd')">
                << 返回接入模块
              </a>
            </div>

            <button type="submit" class="cyber-submit-btn" :disabled="authStatus === 'loading'">
              <div class="btn-bg"></div>
              <span class="btn-text">
                {{ submitButtonText }}
              </span>
              <div class="btn-glitch-layer"></div>
            </button>

          </form>

          <div class="terminal-footer">
            <div class="status-dot"></div>
            <span>
              {{ 
                authStatus === 'error' 
                  ? (['register', 'reset', 'code'].includes(authMode) ? 'WARNING: 验证码错误' : 'WARNING: 账号或密码错误') 
                  : 'AWAITING...' 
              }}
            </span>
          </div>

        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { ref, reactive, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

// ================= 状态管理 =================

const authMode = ref('pwd'); 
const authStatus = ref('idle'); 
const countdown = ref(0);

// 定时器引用，防止内存泄漏和路由跳转导致的报错
let timer = null; 
let errorTimer = null;
let loadingTimer = null;
let actionTimer = null;

const formData = reactive({
  email: '',
  password: '',
  verifyCode: ''
});

const showPassword = ref(false);

// ================= 核心业务方法 =================

const clearError = () => {
  // 清除未执行完的错误恢复定时器，防止状态竞态闪烁
  if (errorTimer) clearTimeout(errorTimer);
  if (authStatus.value === 'error') {
    authStatus.value = 'idle';
  }
};

const isValidEmail = computed(() => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(formData.email);
});

const submitButtonText = computed(() => {
  if (authStatus.value === 'loading') return 'PROCESSING...';
  if (authStatus.value === 'success') return 'SYSTEM_UNLOCKED';
  switch (authMode.value) {
    case 'pwd':
    case 'code': return '登 录 访 问';
    case 'register': return '身 份 注 册';
    case 'reset': return 'OVERRIDE PROTOCOL';
    default: return 'SUBMIT';
  }
});

const switchMode = (mode) => {
  authMode.value = mode;
  formData.password = '';
  formData.verifyCode = '';
  authStatus.value = 'idle';
  showPassword.value = false;
  
  // 切换模式时重置验证码倒计时和报错状态
  countdown.value = 0;
  if (timer) clearInterval(timer);
  if (errorTimer) clearTimeout(errorTimer);
};

const sendCode = () => {
  if (countdown.value > 0 || !isValidEmail.value) return;
  
  console.log('Sending code to:', formData.email); 
  
  countdown.value = 60;
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

const handleSubmit = () => {
  // 复用计算属性，消除重复验证逻辑
  const isEmailValid = isValidEmail.value; 
  const isPwdComplete = ['pwd', 'register', 'reset'].includes(authMode.value) ? formData.password.length > 0 : true;
  const isCodeComplete = ['code', 'register', 'reset'].includes(authMode.value) ? formData.verifyCode.length === 6 : true;

  if (!isEmailValid || !isPwdComplete || !isCodeComplete) {
    if (errorTimer) clearTimeout(errorTimer);
    authStatus.value = 'error'; 
    errorTimer = setTimeout(() => {
      authStatus.value = 'idle'; 
    }, 1000);
    return; 
  }

  authStatus.value = 'loading';
  
  loadingTimer = setTimeout(() => {
    
    if (formData.password === 'error') {
      authStatus.value = 'error';
      return; 
    }

    authStatus.value = 'success'; 
    
    if (['pwd', 'code'].includes(authMode.value)) {
      userStore.login(formData.email);
      actionTimer = setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } else {
      actionTimer = setTimeout(() => {
        alert("操作指令已确立执行。");
        switchMode('pwd');
      }, 1000);
    }

  }, 1500);
};

// ================= 生命周期钩子 =================
// 组件销毁前彻底清理所有后台跑动的定时器
onUnmounted(() => {
  if (timer) clearInterval(timer);
  if (errorTimer) clearTimeout(errorTimer);
  if (loadingTimer) clearTimeout(loadingTimer);
  if (actionTimer) clearTimeout(actionTimer);
});
</script>

<style scoped>
/* 彻底隐藏浏览器原生自带的密码小眼睛和清除按钮 */
input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear {
  display: none !important;
  width: 0;
  height: 0;
}

/* 针对部分 WebKit 浏览器的额外重置 */
input::-webkit-credentials-auto-fill-button {
  display: none !important;
  visibility: hidden;
  pointer-events: none;
}

/* ================= 页面底层与扫描层 ================= */
.login-main {
  position: absolute;
  top: -50px;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  z-index: 20;
  overflow: hidden;
}

/* ================= 核心认证终端面板 ================= */
.terminal-deploy-wrapper {
  animation: terminalDeploy 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  z-index: 10;
}

.auth-terminal {
  position: relative;
  width: 480px;
  background: rgba(2, 8, 16, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 229, 255, 0.3);
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.8), inset 0 0 30px rgba(0, 229, 255, 0.05);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.terminal-bracket {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 2px solid transparent;
  z-index: 15;
  transition: border-color 0.3s ease;
}

.tb-tl {
  top: -2px;
  left: -2px;
  border-top-color: rgba(0, 229, 255, 1);
  border-left-color: rgba(0, 229, 255, 1);
}

.tb-tr {
  top: -2px;
  right: -2px;
  border-top-color: rgba(0, 229, 255, 1);
  border-right-color: rgba(0, 229, 255, 1);
}

.tb-bl {
  bottom: -2px;
  left: -2px;
  border-bottom-color: rgba(0, 229, 255, 1);
  border-left-color: rgba(0, 229, 255, 1);
}

.tb-br {
  bottom: -2px;
  right: -2px;
  border-bottom-color: rgba(0, 229, 255, 1);
  border-right-color: rgba(0, 229, 255, 1);
}

.terminal-inner {
  padding: 45px 40px;
  position: relative;
}

/* ================= 头部结构 ================= */
.terminal-header {
  user-select: none;
  text-align: center;
  margin-bottom: 25px;
}

.sys-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.5);
  color: #ff3333;
  padding: 4px 12px;
  font-size: 12px;
  font-family:  monospace;
  letter-spacing: 2px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.badge-icon {
  width: 6px;
  height: 6px;
  background: #ff3333;
  border-radius: 50%;
  animation: blink 1s infinite;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.glitch-text {
  font-family: 'Orbitron', sans-serif;
  font-size: 48px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 8px;
  margin: 0;
  text-shadow: 0 0 20px rgba(0, 229, 255, 0.6);
}

.subtitle {
  color: rgba(0, 229, 255, 0.8);
  font-size: 14px;
  letter-spacing: 6px;
  margin-top: 10px;
}

.header-divider {
  margin-top: 20px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.5), transparent);
}

/* ================= TABS ================= */
.tactical-tabs {
  user-select: none;
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
  font-family:  monospace;
}

.tab-item {
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
  letter-spacing: 2px;
  cursor: pointer;
  transition: color 0.3s ease, text-shadow 0.3s ease;
  padding: 5px 10px;
}

.tab-item:hover {
  color: rgba(0, 229, 255, 0.8);
}

.tab-item.active {
  color: rgba(0, 229, 255, 1);
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.6);
  font-weight: bold;
}

.reset-header {
  text-align: center;
  margin-bottom: 30px;
  font-family:  monospace;
}

.warning-text {
  color: #ffaa00;
  font-size: 14px;
  letter-spacing: 2px;
  text-shadow: 0 0 8px rgba(255, 170, 0, 0.5);
}

/* ================= 输入框基类 ================= */
.input-group {
  position: relative;
  margin-bottom: 30px;
}

.input-group input {
  width: 100%;
  background: rgba(0, 229, 255, 0.03);
  border: 1px solid rgba(0, 229, 255, 0.2);
  padding: 15px 15px 15px 20px;
  color: #fff;
  font-size: 16px;
  font-family:  monospace;
  outline: none;
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
  box-sizing: border-box;
}

/* ================= 极品输入框悬浮标签 ================= */
.input-group label {
  position: absolute;
  top: 16px;
  left: 20px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
  font-family:  monospace;
  letter-spacing: 1px;
  pointer-events: none;
  transform-origin: left top;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  -webkit-font-smoothing: antialiased;
  will-change: transform, color;
}

.input-group input:focus ~ label,
.input-group input:not(:placeholder-shown) ~ label {
  transform: translate3d(-20px, -38px, 0) scale(0.85);
  color: rgba(0, 229, 255, 1);
}

/* ================= 密码框机甲光圈小眼睛 ================= */
.password-group input {
  padding-right: 50px;
}

.cyber-eye {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  cursor: pointer;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eye-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 1px dashed rgba(0, 229, 255, 0.4);
  border-radius: 50%;
  animation: eyeSpin 8s linear infinite;
  transition: all 0.3s ease;
  z-index: 3;
  pointer-events: none;
}

.cyber-eye:hover .eye-ring {
  border: 1px solid rgba(0, 229, 255, 0.84);
  box-shadow: 0 0 8px rgba(0, 229, 255, 0.5);
  animation: eyeSpin 3s linear infinite;
}

.eye-lens {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #00e5ff;
  border-radius: 50%;
  box-shadow: 0 0 10px #00e5ff;
  z-index: 1;
  transform: scale(0.2);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.vault-doors {
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  transform: rotate(45deg);
  overflow: hidden;
  z-index: 2;
  border: 1px solid rgba(0, 229, 255, 0.2);
  transition: border-color 0.3s ease;
}

.door-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: #020810;
  border-bottom: 1.5px solid #00e5ff;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.door-top::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);
  width: 6px;
  height: 3px;
  background: #00e5ff;
  border-radius: 1px;
  transition: background 0.3s ease;
}

.door-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: #020810;
  border-top: 1.5px solid #00e5ff;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* 光圈开合状态控制 */
.cyber-eye.is-open .eye-lens {
  transform: scale(1);
  opacity: 1;
}

.cyber-eye.is-open .door-top {
  transform: translateY(-150%);
  opacity: 0;
}

.cyber-eye.is-open .door-bottom {
  transform: translateY(150%);
  opacity: 0;
}

.cyber-eye.is-open .vault-doors {
  border-color: transparent;
}

/* ================= 验证码按钮 ================= */
.code-group input {
  padding-right: 140px;
}

.send-code-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: rgba(0, 229, 255, 0.8);
  font-family:  monospace;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  transition: color 0.3s ease, text-shadow 0.3s ease;
  padding: 5px;
}

.send-code-btn:hover:not(:disabled) {
  color: #fff;
  text-shadow: 0 0 8px rgba(0, 229, 255, 1);
}

.send-code-btn:disabled {
  color: rgba(255, 255, 255, 0.2);
  cursor: not-allowed;
}

/* ================= 充能条 & 装饰 ================= */
.input-energy-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0%;
  background: rgba(0, 229, 255, 1);
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.8);
  transition: width 0.4s ease;
}

.input-group input:focus ~ .input-energy-bar,
.input-group input:not(:placeholder-shown) ~ .input-energy-bar {
  width: 100%;
}

.input-corner {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 10px;
  height: 10px;
  border-bottom: 2px solid rgba(0, 229, 255, 1);
  border-right: 2px solid rgba(0, 229, 255, 1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.input-group input:focus ~ .input-corner {
  opacity: 1;
}

/* ================= 辅助选项链接 ================= */
.form-actions {
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  font-family:  monospace;
}

.form-actions.single-action {
  justify-content: flex-start;
}

.cyber-link {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  text-decoration: none;
  transition: color 0.3s ease, text-shadow 0.3s ease;
  letter-spacing: 1px;
}

.cyber-link:hover {
  color: rgba(0, 229, 255, 1);
  text-shadow: 0 0 8px rgba(0, 229, 255, 0.8);
}

.alert-link:hover {
  color: #ffaa00;
  text-shadow: 0 0 8px rgba(255, 170, 0, 0.8);
}

/* ================= 动作按钮 ================= */
.cyber-submit-btn {
  user-select: none;
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

.btn-bg {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.2), transparent);
  transition: left 0.4s ease;
}

.cyber-submit-btn:hover .btn-bg {
  left: 100%;
}

.btn-text {
  position: relative;
  z-index: 2;
  color: rgba(0, 229, 255, 1);
  font-family:  monospace;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 4px;
  text-shadow: 0 0 5px rgba(0, 229, 255, 0.5);
  transition: color 0.3s ease, text-shadow 0.3s ease;
}

.cyber-submit-btn:hover {
  background: rgba(0, 229, 255, 0.15);
  box-shadow: 0 0 30px rgba(0, 229, 255, 0.3), inset 0 0 15px rgba(0, 229, 255, 0.2);
}

.cyber-submit-btn:hover .btn-text {
  color: #fff;
  text-shadow: 0 0 10px #fff;
}

.cyber-submit-btn:active {
  transform: scale(0.98);
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
}

.cyber-submit-btn:disabled {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  cursor: not-allowed;
}

.cyber-submit-btn:disabled .btn-text {
  color: rgba(255, 255, 255, 0.5);
  animation: pulseOpacity 1s infinite alternate;
}

/* ================= 状态指示灯 ================= */
.terminal-footer {
  user-select: none;
  margin-top: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family:  monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.3);
  transition: color 0.3s ease;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: rgba(0, 229, 255, 0.5);
  border-radius: 50%;
  animation: pulseScale 2s infinite alternate;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

/* ================= 认证状态动效 ================= */

/* 当系统识别为 error 状态时，全局强制染红所有输入框 */
.auth-terminal.is-error .input-group input {
  border-color: #ff3333 !important;
  background: rgba(255, 0, 0, 0.05) !important;
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.2) !important;
  color: #ff3333 !important;
}

.auth-terminal.is-error .input-group label {
  color: #ff3333 !important;
  text-shadow: none !important;
}

.auth-terminal.is-error .input-energy-bar,
.auth-terminal.is-error .input-corner {
  background: #ff3333 !important;
  border-color: #ff3333 !important;
  box-shadow: 0 0 10px #ff3333 !important;
}

/* 错误红屏时的光圈小眼睛变色同步 */
.auth-terminal.is-error .eye-ring {
  border-color: rgba(255, 51, 51, 0.6);
}

.auth-terminal.is-error .cyber-eye:hover .eye-ring {
  border-color: #ff3333;
  box-shadow: 0 0 8px rgba(255, 51, 51, 0.5);
}

.auth-terminal.is-error .vault-doors {
  border-color: rgba(255, 51, 51, 0.2);
}

.auth-terminal.is-error .door-top {
  border-bottom-color: #ff3333;
}

.auth-terminal.is-error .door-top::after {
  background: #ff3333;
}

.auth-terminal.is-error .door-bottom {
  border-top-color: #ff3333;
}

.auth-terminal.is-error .eye-lens {
  background: #ff3333;
  box-shadow: 0 0 10px #ff3333;
}

/* 1. 成功 绿屏状态 (常态保持，不跳动) */
.auth-terminal.is-success {
  border-color: rgba(0, 255, 170, 0.8);
  box-shadow: 0 0 50px rgba(0, 255, 170, 0.2), inset 0 0 20px rgba(0, 255, 170, 0.1);
}

.auth-terminal.is-success .terminal-bracket {
  border-color: rgba(0, 255, 170, 1);
}

.auth-terminal.is-success .sys-badge {
  background: rgba(0, 255, 170, 0.1);
  border-color: rgba(0, 255, 170, 0.5);
  color: #00ffaa;
}

.auth-terminal.is-success .badge-icon,
.auth-terminal.is-success .status-dot {
  background: #00ffaa;
  box-shadow: 0 0 10px #00ffaa;
}

.auth-terminal.is-success .terminal-footer {
  color: #00ffaa;
}

/* 2. 失败 红色警戒态 + 左右物理跳动受击反馈 */
.auth-terminal.is-error {
  animation: terminalErrorShake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  border-color: #ff3333;
  box-shadow: 0 0 50px rgba(255, 51, 51, 0.3), inset 0 0 30px rgba(255, 51, 51, 0.15);
}

.auth-terminal.is-error .terminal-bracket {
  border-color: #ff3333;
}

.auth-terminal.is-error .sys-badge {
  background: rgba(255, 51, 51, 0.1);
  border-color: rgba(255, 51, 51, 0.5);
  color: #ff3333;
}

.auth-terminal.is-error .badge-icon,
.auth-terminal.is-error .status-dot {
  background: #ff3333;
  box-shadow: 0 0 10px #ff3333;
}

.auth-terminal.is-error .terminal-footer {
  color: #ff3333;
  font-weight: bold;
}

/* ================= 动画关键帧 ================= */
@keyframes terminalDeploy {
  0% {
    transform: scale(0.9) translateY(30px);
    opacity: 0;
    filter: blur(10px);
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
    filter: blur(0px);
  }
}

@keyframes gridMove {
  100% {
    transform: perspective(500px) rotateX(60deg) translateY(40px);
  }
}

@keyframes radarSpin {
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes eyeSpin {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes pulseOpacity {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

@keyframes pulseScale {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  100% {
    transform: scale(1.5);
    opacity: 1;
    box-shadow: 0 0 8px rgba(0, 229, 255, 0.8);
  }
}

@keyframes terminalErrorShake {
  0%, 100% {
    transform: translate3d(0, 0, 0);
  }
  10%, 90% {
    transform: translate3d(-2px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(5px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-10px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(10px, 0, 0);
  }
}
</style>