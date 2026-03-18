<template>
  <main class="login-main">
    <section id="login-section">
      <div class="glass-panel">
        
        <div class="panel-content">
          <h1>NEXUS<br>SYSTEM</h1>
          <p class="subtitle">SECURE ACCESS PORTAL V2.0</p>
        </div>

        <div class="panel-divider"></div>

        <div class="login-form-container">
          <h2 class="form-title">SIGN IN</h2>
          
          <form @submit.prevent="handleLogin">
            <div class="input-group">
              <input type="text" id="username" v-model="loginForm.username" required placeholder=" ">
              <label for="username">Username / 账号</label>
              <div class="input-line"></div>
            </div>

            <div class="input-group">
              <input type="password" id="password" v-model="loginForm.password" required placeholder=" ">
              <label for="password">Password / 密码</label>
              <div class="input-line"></div>
            </div>

            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" v-model="loginForm.remember"> 记住我
              </label>
              <a href="#" class="forgot-pwd">忘记密码？</a>
            </div>

            <button type="submit" class="login-submit-btn" :disabled="isLoading">
              {{ isLoading ? 'AUTHENTICATING...' : 'ENTER SYSTEM' }}
            </button>
          </form>
          
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router'; // 引入路由钩子

const router = useRouter(); // 获取路由实例

const loginForm = reactive({
  username: '',
  password: '',
  remember: false
});

const isLoading = ref(false);

const handleLogin = () => {
  isLoading.value = true;
  
  // 模拟网络请求验证
  setTimeout(() => {
    isLoading.value = false;
    
    // 1. 模拟将登录状态保存到本地（配合之前写的 router.beforeEach 守卫）
    localStorage.setItem('isLogin', 'true');
    localStorage.setItem('username', loginForm.username); // 保存用户名备用

    // 2. 路由跳转到主控台页面
    router.push('/dashboard');
  }, 1500);
};
</script>

<style scoped>
/* 局部样式，仅作用于 Login 组件内部 */
.login-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  height: 100%;
  width: 100%;
  position: absolute; /* 让路由动画更平滑 */
  top: 0;
  left: 0;
  z-index: 10;
}

.glass-panel {
  background-color: var(--glass-bg);
  border-radius: 16px;
  display: flex;
  align-items: stretch;
  padding: 50px;
  gap: 40px;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.01), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}

.glass-panel { border: 1px solid var(--glass-border); border-radius: 16px; padding: 40px; }

.panel-content { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.panel-content h1 { font-size: 54px; font-weight: 700; line-height: 1.1; letter-spacing: 2px; background: linear-gradient(to right, #fff, var(--accent-cyan)); background-clip: text; -webkit-text-fill-color: transparent; }
.panel-content .subtitle { color: var(--sub-text-color); font-size: 13px; margin-top: 15px; letter-spacing: 3px; }
.panel-divider { width: 1px; background: linear-gradient(to bottom, transparent, var(--glass-border), transparent); margin: 0 10px; }

.login-form-container { flex: 1; display: flex; flex-direction: column; justify-content: center; min-width: 300px; }
.form-title { font-size: 20px; font-weight: 600; margin-bottom: 30px; letter-spacing: 1px; }

.input-group { position: relative; margin-bottom: 35px; }
.input-group input { width: 100%; padding: 10px 0; background: transparent; border: none; color: var(--text-color); font-size: 16px; outline: none; }
.input-line { position: absolute; bottom: 0; left: 0; width: 100%; height: 1px; background-color: var(--sub-text-color); transition: all 0.3s ease; }
.input-line::before { content: ''; position: absolute; bottom: 0; left: 0; width: 0%; height: 2px; background: linear-gradient(90deg, var(--neon-blue), var(--neon-purple)); transition: width 0.4s ease; box-shadow: 0 0 10px var(--neon-blue); }

.input-group label { position: absolute; top: 10px; left: 0; color: var(--sub-text-color); font-size: 14px; pointer-events: none; transition: all 0.3s ease; }
.input-group input:focus ~ label, .input-group input:not(:placeholder-shown) ~ label { top: -20px; font-size: 12px; color: var(--neon-blue); text-shadow: 0 0 8px rgba(0, 242, 254, 0.4); }
.input-group input:focus ~ .input-line::before, .input-group input:not(:placeholder-shown) ~ .input-line::before { width: 100%; }

.form-options { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; font-size: 12px; color: var(--sub-text-color); }
.form-options input[type="checkbox"] { accent-color: var(--neon-blue); margin-right: 5px; }
.forgot-pwd { color: var(--sub-text-color); text-decoration: none; transition: color 0.3s; }
.forgot-pwd:hover { color: var(--neon-purple); }

.login-submit-btn { width: 100%; padding: 14px; background: transparent; border: 1px solid var(--neon-blue); color: var(--text-color); font-size: 14px; font-weight: 600; letter-spacing: 2px; border-radius: 4px; cursor: pointer; position: relative; overflow: hidden; transition: all 0.3s ease; box-shadow: 0 0 15px rgba(0, 242, 254, 0.2); }
.login-submit-btn:hover:not(:disabled) { background: rgba(0, 242, 254, 0.1); box-shadow: 0 0 25px rgba(0, 242, 254, 0.5); border-color: var(--accent-cyan); text-shadow: 0 0 5px #fff; }
.login-submit-btn:disabled { border-color: #ff00de; box-shadow: 0 0 25px rgba(255, 0, 222, 0.6); cursor: not-allowed; color: #fff; text-shadow: 0 0 10px #ff00de; }

@media (max-width: 768px) {
  .glass-panel { flex-direction: column; padding: 30px; gap: 20px; }
  .panel-divider { width: 100%; height: 1px; background: linear-gradient(to right, transparent, var(--glass-border), transparent); margin: 10px 0; }
}
</style>