<template>
  <canvas ref="canvas" class="constellation-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let ctx = null
let animationFrameId = null
let particles = []

// 配置参数
const config = {
  particleCount: 70,        /* 关键修复：从 100/120 暴砍到 40，大大减少点的数量 */
  particleColor: '#00e5ff', 
  lineColor: '#00e5ff',     
  minDist: 100,             /* 缩短连线距离：从 150 缩到 100，防止过长的线条横穿屏幕 */
  maxOpacity: 0.7,         /* 调低透明度：让连线若隐若现，增加高级感 */
  baseSpeed: 0.4            /* 放慢漂移速度：让背景更沉稳、更 Hardcore，不要乱晃 */
}

// 粒子类定义
class Particle {
  constructor(w, h) {
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.vx = (Math.random() - 0.5) * config.baseSpeed
    this.vy = (Math.random() - 0.5) * config.baseSpeed
    this.radius = Math.random() * 1.5 + 0.5 // 随机大小的点
  }

  // 绘制点
  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = config.particleColor
    ctx.fill()
  }

  // 移动逻辑 (包含边界反弹)
  update(w, h) {
    if (this.x < 0 || this.x > w) this.vx *= -1
    if (this.y < 0 || this.y > h) this.vy *= -1
    this.x += this.vx
    this.y += this.vy
  }
}

// 初始化粒子
const initParticles = (w, h) => {
  particles = []
  for (let i = 0; i < config.particleCount; i++) {
    particles.push(new Particle(w, h))
  }
}

// 核心动画循环
const drawAnimation = () => {
    
  const w = canvas.value.width
  const h = canvas.value.height
  ctx.clearRect(0, 0, w, h) // 清空画布

  // 1. 移动和绘制每个点
  for (let p of particles) {
    p.update(w, h)
    p.draw()
  }

  // 2. 计算连线逻辑 (双重循环检查两两距离)
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i]
      const p2 = particles[j]
      const dx = p1.x - p2.x
      const dy = p1.y - p2.y
      const dist = Math.sqrt(dx * dx + dy * dy) // 勾股定理算距离

      // 如果距离小于设定的最小值，则绘制连线
      if (dist < config.minDist) {
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        
        // 根据距离动态计算透明度 (越远越淡)
        const opacity = config.maxOpacity * (1 - dist / config.minDist)
        // 关键修复：显式添加 "#" 号
        ctx.strokeStyle = `${config.lineColor.startsWith('#') ? config.lineColor : '#' + config.lineColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`
        
        // 如果上面那种写法你的环境不支持，可以用这种兼容写法：
        // const color = hexToRgb(config.lineColor)
        // ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`
        
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }
  }

  animationFrameId = requestAnimationFrame(drawAnimation)
}

// 十六进制转 RGB 的辅助函数 (可选，用于兼容老代码)
// function hexToRgb(hex) {
//   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//   return result ? {
//     r: parseInt(result[1], 16),
//     g: parseInt(result[2], 16),
//     b: parseInt(result[3], 16)
//   } : null;
// }

// 处理窗口重置大小
const handleResize = () => {
  if (canvas.value) {
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
    initParticles(canvas.value.width, canvas.value.height)
  }
}

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  handleResize()
  window.addEventListener('resize', handleResize)
  drawAnimation()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animationFrameId) // 必须清理动画帧，防止内存泄漏
})
</script>

<style scoped>
.constellation-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5; /* 改为正数，确保它在 bg-base 之上 */
  pointer-events: none; 
}
</style>