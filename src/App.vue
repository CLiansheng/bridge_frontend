<template>
  <div class="bg-container">
    <div class="bg-base"></div>
    <ConstellationBg/>
    <div class="data-particles"></div>
    <div class="radar-array">
      <div class="radar-ring outer"></div>
      <div class="radar-ring inner"></div>
      <div class="radar-sweep"></div>
    </div>
    <div class="grid-floor"></div>
    <div class="ambient-glow glow-1"></div>
    <div class="ambient-glow glow-2"></div>
    <div class="ambient-glow glow-3"></div>
    <div class="scan-line"></div>
    <div class="vignette-overlay"></div>
  </div>

  <div class="global-hud-corners">
    <div class="hud-corner top-left">
      <div class="corner-dot"></div>
      <div class="corner-inner"></div>
      <div class="corner-tick-h"></div>
      <div class="corner-tick-v"></div>
    </div>
    <div class="hud-corner top-right">
      <div class="corner-dot"></div>
      <div class="corner-inner"></div>
      <div class="corner-tick-h"></div>
      <div class="corner-tick-v"></div>
    </div>
    <div class="hud-corner bottom-left">
      <div class="corner-dot"></div>
      <div class="corner-inner"></div>
      <div class="corner-tick-h"></div>
      <div class="corner-tick-v"></div>
    </div>
    <div class="hud-corner bottom-right">
      <div class="corner-dot"></div>
      <div class="corner-inner"></div>
      <div class="corner-tick-h"></div>
      <div class="corner-tick-v"></div>
    </div>
  </div>

  <header class="hardcore-navbar" v-if="!['/login', '/'].includes($route.path)">
    <div class="nav-left">
      <div class="logo">
        <span class="bracket">&lt;</span>
        <span class="sys-name">BridgeEye</span>
        <span class="bracket">&gt;</span>
      </div>
    </div>
    
    <nav class="nav-center">
      <div 
        v-for="item in menu" 
        :key="item.path"
        :class="['nav-item', { 'active': $route.path === item.path }]"
        @click="navigateTo(item.path)"
      >
        <div class="nav-item-inner">
          <i class='bx' :class="item.icon"></i>
          <span>{{ item.name }}</span>
        </div>
        <div class="status-line"></div>
        <div class="hover-glow"></div>
      </div>
    </nav>

   <div class="nav-right">
      <div class="user-profile" @click="navigateTo('/profile')">
        <div class="tech-avatar-wrapper">
          <img v-if="userStore.avatar" :src="userStore.avatar" class="tech-avatar-img" />
          <div v-else class="tech-avatar"></div>
          <div class="online-dot"></div>
        </div>
        <div class="user-info">
          <span class="username">{{ userStore.username }}</span>
          <span class="user-role">ID: {{ userStore.phone || 'GUEST' }}</span>
        </div>
      </div>
    </div>
  </header>
  <main :class="['main-content', { 'login-mode': ['/login', '/'].includes($route.path) }]">
    <router-view v-slot="{ Component }">
      <transition name="glitch-slide" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import ConstellationBg from '@/components/ConstellationBg.vue'
import 'boxicons/css/boxicons.min.css'
const route = useRoute()
const router = useRouter()
const userStore = useUserStore() 
onMounted(() => {
  userStore.loadUserInfo() // 页面加载时拉取本地存储的用户信息
})
// 导航菜单配置项数组
const menu = [
  { path: '/dashboard', name: '首页', icon: 'bx-data' },
  { path: '/diagnose', name: '智能诊断', icon: 'bx-radar' },
  { path: '/history', name: '历史档案', icon: 'bx-history' },
  { path: '/profile', name: '用户资料', icon: 'bx-slider-alt' }
]

// 导航跳转方法
const navigateTo = (path) => {
  router.push(path)
}
</script>

<style>
/* -----------------------------------------------------------
   1. 基础样式与全局变量定义 (未修改)
----------------------------------------------------------- */
@font-face {
  font-family: 'Roboto Mono Local';
  src: url('@/assets/fonts/RobotoMono-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap; 
}

@font-face {
  font-family: 'Roboto Mono Local';
  src: url('@/assets/fonts/RobotoMono-Medium.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Roboto Mono Local';
  src: url('@/assets/fonts/RobotoMono-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

:root {
  --tech-cyan: #00e5ff;
  --tech-cyan-dim: rgba(0, 229, 255, 0.15);
  --tech-bg-dark: #010308;
  --tech-panel-bg: rgba(6, 9, 14, 0.65);
  --tech-border: rgba(0, 229, 255, 0.2);
  
  --text-main: #e2e8f0;
  --text-muted: #64748b;
  --text-alert: #ff2a2a;
  
  --font-mono: 'Roboto Mono Local', 'Roboto Mono', monospace;
  --font-sans: sans-serif;
}

body, 
html, 
#app { 
  margin: 0;
  padding: 0;
  height: 100vh; 
  font-family: var(--font-sans); 
  background-color: transparent !important; 
  overflow: hidden; 
  color: var(--text-main); 
}

/* -----------------------------------------------------------
   2. 核心背景特效样式定义 (未修改)
----------------------------------------------------------- */
.bg-container { 
  position: fixed; 
  top: 0; 
  left: 0; 
  width: 100vw; 
  height: 100vh; 
  z-index: -999; 
  pointer-events: none; 
  overflow: hidden;
  background-color: var(--tech-bg-dark);
}

.bg-base {
  position: absolute; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%;
  background: radial-gradient(ellipse at bottom center, #051329 0%, var(--tech-bg-dark) 100%);
}

.data-particles {
  position: absolute; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 200%;
  background-image: 
    radial-gradient(2px 2px at 40px 60px, var(--tech-cyan) 50%, transparent),
    radial-gradient(2px 2px at 120px 180px, #ffffff 50%, transparent),
    radial-gradient(3px 3px at 250px 90px, var(--tech-cyan-dim) 50%, transparent),
    radial-gradient(1.5px 1.5px at 300px 220px, var(--tech-cyan) 50%, transparent);
  background-size: 350px 350px;
  opacity: 0.6;
  animation: particleDrift 40s linear infinite;
}

.grid-floor {
  position: absolute; 
  bottom: -20%; 
  left: -50%; 
  width: 200%; 
  height: 70%;
  transform-origin: center top; 
  transform: perspective(800px) rotateX(75deg);
  mask-image: radial-gradient(ellipse 50% 40% at center bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
  -webkit-mask-image: radial-gradient(ellipse 50% 40% at center bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
  transform-style: preserve-3d;
}

.grid-floor::before {
  content: '';
  position: absolute; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 229, 255, 0.4) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 255, 0.4) 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: center top; 
  transform: translateZ(0); 
}

.radar-array {
  position: absolute; 
  top: 40%; 
  left: 50%; 
  transform: translate(-50%, -50%);
  width: 800px; 
  height: 800px; 
  opacity: 0.3;
}

.radar-ring {
  position: absolute; 
  top: 50%; 
  left: 50%; 
  transform: translate(-50%, -50%);
  border-radius: 50%; 
  border: 1px dashed var(--tech-cyan);
}

.radar-ring.outer { 
  width: 100%; 
  height: 100%; 
  animation: spinWithCenter 30s linear infinite reverse; 
  border-width: 2px; 
  border-style: dotted; 
}

.radar-ring.inner { 
  width: 60%; 
  height: 60%; 
  animation: spinWithCenter 20s linear infinite; 
  border: 1px solid var(--tech-cyan-dim); 
  box-shadow: inset 0 0 40px var(--tech-cyan-dim); 
}

.radar-sweep {
  position: absolute; 
  top: 50%; 
  left: 50%; 
  width: 100%; 
  height: 100%; 
  border-radius: 50%;
  transform: translate(-50%, -50%) rotate(0deg);
  background: conic-gradient(from 0deg, transparent 70%, rgba(0, 229, 255, 0.1) 95%, rgba(0, 229, 255, 0.6) 100%);
  animation: spinWithCenter 6s linear infinite;
}

.ambient-glow { 
  position: absolute; 
  border-radius: 50%; 
  filter: blur(60px); 
  opacity: 0.4; 
}

.glow-1 { 
  width: 400px; 
  height: 400px; 
  background: #00e5ff; 
  top: -100px; 
  left: -100px; 
  animation: pulseGlow 8s ease-in-out infinite alternate; 
}

.glow-2 { 
  width: 600px; 
  height: 600px; 
  background: #0051ff; 
  bottom: -200px; 
  right: -200px; 
  animation: pulseGlow 12s ease-in-out infinite alternate-reverse; 
}

.glow-3 { 
  width: 300px; 
  height: 300px; 
  background: #00ffaa; 
  top: 40%; 
  left: 50%; 
  transform: translate(-50%, -50%); 
  animation: pulseGlow 10s ease-in-out infinite alternate; 
  opacity: 0.15; 
}

.scan-line {
  position: absolute; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--tech-cyan), transparent);
  box-shadow: 0 0 15px 3px rgba(0, 229, 255, 0.3);
  opacity: 0.8; 
  animation: verticalScan 5s linear infinite;
}

.vignette-overlay {
  position: absolute; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%;
  background: radial-gradient(circle at center, transparent 30%, #000000 120%);
}

/* -----------------------------------------------------------
   3. 动画关键帧声明 (未修改)
----------------------------------------------------------- */
@keyframes particleDrift { 
  100% { transform: translateY(-350px); } 
}
@keyframes gridMoveSmooth { 
  100% { background-position: 0 60px; } 
}
@keyframes spinWithCenter { 
  0% { transform: translate(-50%, -50%) rotate(0deg); } 
  100% { transform: translate(-50%, -50%) rotate(360deg); } 
}
@keyframes verticalScan { 
  0% { top: -10%; opacity: 0; } 
  10% { opacity: 0.8; } 
  90% { opacity: 0.8; } 
  100% { top: 110%; opacity: 0; } 
}
@keyframes pulseGlow { 
  0% { transform: scale(0.8); opacity: 0.2; } 
  100% { transform: scale(1.2); opacity: 0.5; } 
}

/* -----------------------------------------------------------
   4. ⭐导航栏与主内容布局 (赛博重构版 - 已修复居中)⭐
----------------------------------------------------------- */
.hardcore-navbar {
  position: fixed; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 70px; 
  background: var(--tech-panel-bg); 
  backdrop-filter: blur(12px); 
  border-bottom: 1px solid rgba(0, 229, 255, 0.15); 
  display: flex; 
  align-items: center; 
  justify-content: space-around; /* 新增：让左右两部分贴边 */
  z-index: 100;
  box-shadow: 0 4px 30px rgba(0,0,0,0.8), inset 0 -2px 15px rgba(0, 229, 255, 0.05);
  box-sizing: border-box; 
}

/* 导航栏底部的全局激光线 */
.hardcore-navbar::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--tech-cyan), transparent);
  opacity: 0.6;
}

/* 取消了原本的 flex: 1，依靠父级的 space-between 即可 */
.nav-left, 
.nav-right {
  display: flex;
  align-items: center;
}

/* ================= Logo 核心区域 ================= */
.logo { 
  display: flex; 
  align-items: baseline; 
  gap: 6px; 
  cursor: default;
  user-select: none;
}

.bracket {
  color: var(--tech-cyan);
  font-family: var(--font-mono);
  font-size: 22px;
  font-weight: 900;
  opacity: 0.8;
  animation: blink 2s infinite; 
}

.sys-name {
  font-family: 'Orbitron', var(--font-sans); 
  font-size: 28px; 
  font-weight: 900; 
  background: linear-gradient(to right, #ffffff 20%, #00e5ff 100%);
  background-clip: text;
  color: transparent;
  letter-spacing: 4px;
  filter: drop-shadow(0 0 10px rgba(0, 229, 255, 0.5)); 
}

/* ================= 中间选项样式修复 (文字绝对居中) ================= */
.nav-center {
  user-select: none;
  position: absolute; /* 让中间菜单脱离文档流 */
  left: 50%;          /* 左侧推至屏幕一半 */
  transform: translateX(-50%); /* 向回拉自身的50%达到大框架的绝对居中 */
  display: flex;
  height: 100%;
  align-items: center; 
  gap: 10px;
}

.nav-item {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 35px; /* 留出额外空间给左侧悬浮的图标 */
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-muted);
  overflow: hidden;
}

.nav-item-inner {
  position: relative; /* 核心：让内部容器尺寸完全由“文字”的宽度决定 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  line-height: 1;
}

/* 核心修复：把图标抽离出正常文档流，挂在文字左侧，不再挤压排版 */
.nav-item-inner i {
  position: absolute;
  left: -24px; /* 图标往左悬浮，完美避开文字中轴线 */
  font-size: 18px;
  transition: transform 0.3s ease, color 0.3s ease;
  display: flex;
  align-items: center;
}

.nav-item-inner span {
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 1px;
  position: relative;
}

/* 底部状态线：它现在会自动和上方的“纯文字”完美对中 */
.status-line {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: var(--tech-cyan);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 3;
  box-shadow: 0 0 10px var(--tech-cyan);
}

/* 悬停时的向上全息渐变光柱 */
.hover-glow {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%; 
  background: linear-gradient(to top, rgba(0, 229, 255, 0.08), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
  pointer-events: none;
}

/* 悬停状态交互 */
.nav-item:hover { color: #fff; }
.nav-item:hover .hover-glow { opacity: 1; }
.nav-item:hover .nav-item-inner i {
  transform: translateY(-2px); 
  color: var(--tech-cyan);
}

/* 激活状态展示 */
.nav-item.active { 
  color: #fff; 
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.5); 
}
.nav-item.active .nav-item-inner i {
  color: var(--tech-cyan);
  text-shadow: 0 0 15px var(--tech-cyan); 
}
.nav-item.active .status-line { 
  width: 100%; 
}

/* ================= 右侧用户身份牌 ================= */
.user-profile {
  display: flex;
  align-items: center;
  gap: 15px; 
  background: rgba(0, 229, 255, 0.03);
  border: 1px solid rgba(0, 229, 255, 0.15);
  padding: 6px 20px 6px 10px;
  border-radius: 30px; 
  transition: all 0.3s ease;
  cursor: pointer;
}
.user-profile:hover {
  border-color: rgba(0, 229, 255, 0.4);
  box-shadow: inset 0 0 15px rgba(0, 229, 255, 0.1);
}

.tech-avatar-wrapper {
  position: relative;
}
.tech-avatar-img {
  width: 36px;
  height: 36px;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  border: 2px solid var(--tech-cyan); 
  box-sizing: border-box;
  position: relative;
  object-fit: cover;
  display: block;
}
.tech-avatar {
  width: 36px;
  height: 36px;
  background: rgba(0, 229, 255, 0.1);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  border: 2px solid var(--tech-cyan); 
  box-sizing: border-box;
  position: relative;
}

.tech-avatar::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  border: 1px solid var(--tech-cyan);
  border-radius: 50%;
}

.online-dot {
  position: absolute;
  bottom: 0;
  right: -2px;
  width: 10px;
  height: 10px;
  background: #00ffaa;
  border-radius: 50%;
  border: 2px solid var(--tech-bg-dark);
  box-shadow: 0 0 8px #00ffaa;
  animation: pulseGlow 2s infinite alternate;
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.username {
  font-size: 13px;
  font-weight: bold;
  color: #fff;
  letter-spacing: 1px;
}

.user-role {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--tech-cyan);
  opacity: 0.8;
  letter-spacing: 0.5px;
}

/* -----------------------------------------------------------
   5. 主体内容样式 (未修改)
----------------------------------------------------------- */
.main-content {
  padding-top: 80px; 
  padding-left: 30px; 
  padding-right: 30px; 
  padding-bottom: 20px;
  height: 100vh; 
  box-sizing: border-box; 
  overflow-y: auto;
  position: relative; 
  z-index: 10;
  display: flex;
  flex-direction: column;
}

.main-content.login-mode {
  padding-top: 0;
}

/* -----------------------------------------------------------
   6. 视图切换路由动画 (未修改)
----------------------------------------------------------- */
.glitch-slide-enter-active, 
.glitch-slide-leave-active { 
  transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1); 
}
.glitch-slide-enter-from { 
  opacity: 0; 
  transform: translateY(15px); 
  filter: brightness(1.5) blur(3px); 
}
.glitch-slide-leave-to { 
  opacity: 0; 
  transform: translateY(-15px); 
  filter: brightness(0.5) blur(3px); 
}

.main-content.login-mode {
  padding-top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ================= 极致精细：全局机甲边框样式 ================= */
.global-hud-corners {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
}

.hud-corner {
  position: absolute;
  width: 120px;
  height: 120px;
  border-top: 2px solid rgba(0, 229, 255, 0.85);
  border-left: 2px solid rgba(0, 229, 255, 0.85);
  filter: drop-shadow(0 0 4px rgba(0, 229, 255, 0.4));
  animation: hudCornerBreath 3s infinite alternate ease-in-out;
}

.corner-dot {
  position: absolute;
  top: -4px;
  left: -4px;
  width: 6px;
  height: 6px;
  background: #ffffff;
  box-shadow: 0 0 10px rgba(0, 229, 255, 1), 0 0 5px rgba(0, 229, 255, 1);
}

.corner-inner {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 40px;
  height: 40px;
  border-top: 1px solid rgba(0, 229, 255, 0.35);
  border-left: 1px solid rgba(0, 229, 255, 0.35);
}

.corner-tick-h {
  position: absolute;
  top: -6px;
  right: 0;
  width: 2px;
  height: 10px;
  background: rgba(0, 229, 255, 0.85);
}

.corner-tick-v {
  position: absolute;
  bottom: 0;
  left: -6px;
  width: 10px;
  height: 2px;
  background: rgba(0, 229, 255, 0.85);
}

.top-left { top: 35px; left: 35px; }
.top-right { top: 35px; right: 35px; transform: scaleX(-1); }
.bottom-left { bottom: 35px; left: 35px; transform: scaleY(-1); }
.bottom-right { bottom: 35px; right: 35px; transform: scaleX(-1) scaleY(-1); }

@keyframes hudCornerBreath {
  0% { opacity: 0.6; }
  100% { opacity: 1; }
}
</style>