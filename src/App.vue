<template>
  <div class="bg-container">
    <div class="bg-base"></div>
    
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

  <header class="hardcore-navbar">
    <div class="nav-left">
      <div class="logo">
        <span class="bracket">[</span>
        <i class='bx bx-hive tech-icon'></i>
        <span class="sys-name">桥梁结构诊断系统</span>
        <span class="bracket">]</span>
      </div>
    </div>
    
    <nav class="nav-center">
      <div 
        v-for="item in menu" :key="item.id"
        :class="['nav-item', { active: currentView === item.id }]"
        @click="currentView = item.id"
      >
        <div class="nav-item-inner">
          <i :class="['bx', item.icon]"></i>
          <span>{{ item.name }}</span>
        </div>
        <div class="status-line"></div>
      </div>
    </nav>

    <div class="nav-right">
      <div class="user-profile">
        <div class="tech-avatar">
          <i class='bx bx-user-pin'></i>
        </div>
        <div class="user-info">
          <span class="user-role">ADMIN //</span>
          <span class="username">专家用户</span>
        </div>
        <i class='bx bx-power-off logout-btn' title="退出系统"></i>
      </div>
    </div>
  </header>

  <main class="main-content">
    <transition name="glitch-slide" mode="out-in">
      <component :is="views[currentView]" />
    </transition>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

/**
 * 视图组件导入
 * 对应 views 目录下的功能模块
 */
import Home from './views/Home.vue'         // 主页/概览
import Diagnose from './views/Detection.vue' // 检测诊断
import History from './views/Algorithm.vue'  // 历史记录/算法中心
import Profile from './views/System.vue'     // 系统配置

// 响应式变量：存储当前展示的组件 ID
const currentView = ref('Home')

// 导航菜单数据配置
const menu = [
  { id: 'Home', name: '主页', icon: 'bx-data' },
  { id: 'Diagnose', name: '诊断', icon: 'bx-radar' },
  { id: 'History', name: '历史', icon: 'bx-history' },
  { id: 'Profile', name: '系统', icon: 'bx-slider-alt' }
]

// 动态组件映射对象
const views: any = { Home, Diagnose, History, Profile }
</script>

<style>
/* -----------------------------------------------------------
   1. 基础样式与全局变量配置
----------------------------------------------------------- */
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap');

:root {
  /* 品牌视觉色系 */
  --tech-cyan: #00e5ff;          /* 核心青色 */
  --tech-cyan-dim: rgba(0, 229, 255, 0.15);
  --tech-bg-dark: #010308;       /* 极致背景黑 */
  --tech-panel-bg: rgba(6, 9, 14, 0.65);
  --tech-border: rgba(0, 229, 255, 0.2);
  
  /* 文本色系 */
  --text-main: #e2e8f0;
  --text-muted: #64748b;
  --text-alert: #ff2a2a;
  
  /* 字体族 */
  --font-mono: 'Roboto Mono', monospace;
  --font-sans: 'Noto Sans SC', sans-serif;
}

/* 基础 HTML 与 App 重置 */
body, html, #app { 
  margin: 0; padding: 0; height: 100vh; 
  font-family: var(--font-sans); 
  background-color: transparent !important; 
  overflow: hidden; 
  color: var(--text-main); 
}

/* -----------------------------------------------------------
   2. 核心背景特效样式
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
  /* 径向渐变建立深度感 */
  background: radial-gradient(ellipse at bottom center, #051329 0%, var(--tech-bg-dark) 100%);
}

/* 粒子漂浮层样式 */
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

/* 3D 网格地板容器 */
.grid-floor {
  position: absolute; 
  bottom: -20%; 
  left: -50%; 
  width: 200%; 
  height: 70%;
  /* 关键：CSS 3D 透视 */
  transform: perspective(800px) rotateX(75deg);
  /* 设置上下边缘遮罩 */
  mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%);
  -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%);
  transform-style: preserve-3d;
}

/* 3D 网格线条实现 */
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
  background-size: 60px 60px;
  transform: translateZ(0); 
  will-change: background-position;
  animation: gridMoveSmooth 3s linear infinite;
}

/* 雷达组件外观 */
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
  animation: spinRotate 30s linear infinite reverse; 
  border-width: 2px; 
  border-style: dotted; }
.radar-ring.inner { 
  width: 60%; 
  height: 60%; 
  animation: spinRotate 20s linear infinite; 
  border: 1px solid var(--tech-cyan-dim); 
  box-shadow: inset 0 0 40px var(--tech-cyan-dim); }
.radar-sweep {
  position: absolute; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%; 
  border-radius: 50%;
  /* 锥形渐变模拟扫描效果 */
  background: conic-gradient(from 0deg, transparent 70%, rgba(0, 229, 255, 0.1) 95%, rgba(0, 229, 255, 0.6) 100%);
  animation: spinRotate 6s linear infinite;
}

/* 周边装饰光晕 */
.ambient-glow { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.4; }
.glow-1 { 
  width: 400px; 
  height: 400px; 
  background: #00e5ff; 
  top: -100px; 
  left: -100px; 
  animation: pulseGlow 8s ease-in-out infinite alternate; }
.glow-2 { 
  width: 600px; 
  height: 600px; 
  background: #0051ff; 
  bottom: -200px; 
  right: -200px; 
  animation: pulseGlow 12s ease-in-out infinite alternate-reverse; }
.glow-3 { 
  width: 300px; 
  height: 300px; 
  background: #00ffaa; 
  top: 40%; 
  left: 50%; 
  transform: translate(-50%, -50%); 
  animation: pulseGlow 10s ease-in-out infinite alternate; 
  opacity: 0.15; }

/* 扫描线效果 */
.scan-line {
  position: absolute; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--tech-cyan), transparent);
  box-shadow: 0 0 15px 3px rgba(0, 229, 255, 0.3);
  opacity: 0.8; animation: verticalScan 5s linear infinite;
}

/* 视觉聚焦暗角层 */
.vignette-overlay {
  position: absolute; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%;
  background: radial-gradient(circle at center, transparent 30%, #000000 120%);
}

/* -----------------------------------------------------------
   3. 动画关键帧定义
----------------------------------------------------------- */
@keyframes particleDrift { 100% { transform: translateY(-350px); } }
@keyframes gridMoveSmooth { 100% { background-position: 0 60px; } }
@keyframes spinRotate { 100% { transform: translate(-50%, -50%) rotate(360deg); } }
@keyframes verticalScan { 0% { top: -10%; opacity: 0; } 10% { opacity: 0.8; } 90% { opacity: 0.8; } 100% { top: 110%; opacity: 0; } }
@keyframes pulseGlow { 0% { transform: scale(0.8); opacity: 0.2; } 100% { transform: scale(1.2); opacity: 0.5; } }

/* -----------------------------------------------------------
   4. 导航栏与布局组件样式
----------------------------------------------------------- */
.hardcore-navbar {
  position: fixed; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 64px;
  background: var(--tech-panel-bg); 
  backdrop-filter: blur(12px); 
  border-bottom: 1px solid var(--tech-border);
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 0 30px; 
  z-index: 100;
  box-shadow: 0 4px 30px rgba(0,0,0,0.8), inset 0 -1px 0 rgba(0, 229, 255, 0.15);
}

/* 导航栏左侧 Logo 区 */
.logo { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  font-family: var(--font-mono); 
  font-size: 18px; 
  font-weight: 700; 
}
.tech-icon { 
  color: var(--tech-cyan); 
  font-size: 24px; 
  text-shadow: 0 0 15px var(--tech-cyan); 
}

/* 导航栏中间菜单 */
.nav-center { 
  display: flex; 
  gap: 10px; 
  height: 100%; 
  align-items: flex-end; 
}
.nav-item { 
  position: relative; 
  color: var(--text-muted); 
  font-size: 15px; 
  cursor: pointer; 
  display: flex; 
  flex-direction: column; 
  justify-content: flex-end; 
  height: 100%; 
  padding: 0 20px 15px 20px; 
  transition: 0.2s; 
}
/* 状态横线基础样式 */
.status-line { 
  position: absolute; 
  bottom: 0; 
  left: 50%; 
  transform: translateX(-50%); 
  width: 0; 
  height: 2px;
  background: var(--tech-cyan); 
  transition: width 0.3s; 
}
/* 激活态文字颜色 */
.nav-item.active { 
  color: var(--tech-cyan); 
  text-shadow: 0 0 10px var(--tech-cyan-dim); 
}
/* 激活态横线伸长效果 */
.nav-item.active .status-line { 
  width: 100%; 
  box-shadow: 0 -2px 12px var(--tech-cyan); 
}

/* 导航栏右侧用户信息 */
.user-profile { 
  display: flex; 
  align-items: center; 
  gap: 16px; 
  font-family: var(--font-mono); 
}
.tech-avatar { 
  width: 32px; 
  height: 32px;
  border: 1px solid var(--tech-border); 
  display: flex; justify-content: center;
  align-items: center; 
  color: var(--tech-cyan); 
  background: rgba(0, 229, 255, 0.05); }

/* 主体内容滚动区配置 */
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
}

/* -----------------------------------------------------------
   5. 路由切换动画 (Vue Transition)
----------------------------------------------------------- */
.glitch-slide-enter-active, .glitch-slide-leave-active { 
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

</style>