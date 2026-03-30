<template>
  <div
    class="show-container"
    :class="{ 'is-entering': isEntering }"
  >

    <div class="hud-overlay">
      
      <div class="hud-visual visual-tl">
        <div class="optical-sensor">
          <div class="optical-ring outer-dashed"></div>
          <div class="optical-ring inner-solid"></div>
          <div class="optical-cross"></div>
          <div class="optical-core"></div>
        </div>
      </div>

      <div class="hud-visual visual-tr">
        <div class="gyro-stabilizer">
          <div class="gyro-axis axis-x"></div>
          <div class="gyro-axis axis-y"></div>
          <div class="gyro-axis axis-z"></div>
          <div class="gyro-center"></div>
        </div>
      </div>

      <div class="hud-visual visual-bl">
        <div class="resonance-wave">
          <div class="wave-bar bar-1"></div>
          <div class="wave-bar bar-2"></div>
          <div class="wave-bar bar-3"></div>
          <div class="wave-bar bar-4"></div>
          <div class="wave-bar bar-5"></div>
          <div class="wave-bar bar-6"></div>
          <div class="wave-bar bar-7"></div>
        </div>
      </div>

      <div class="hud-visual visual-br">
        <div class="targeting-reticle">
          <div class="reticle-bracket br-tl"></div>
          <div class="reticle-bracket br-tr"></div>
          <div class="reticle-bracket br-bl"></div>
          <div class="reticle-bracket br-br"></div>
          <div class="reticle-ring"></div>
          <div class="reticle-dot"></div>
        </div>
      </div>

    </div>

    <div class="shield-assembly">

      <div class="shield-core-glow"></div>

      <div
        v-for="q in ['tl', 'tr', 'bl', 'br']"
        :key="q"
        class="quadrant-wrapper"
        :class="'w-' + q"
      >
        <div
          class="quadrant-panel"
          :class="'q-' + q"
        >
          <div class="armor-plate"></div>

          <div class="mechanical-shield-ui">
            
            <div class="shield-ring target-ring"></div>
            <div class="shield-ring gear-ring-outer"></div>
            <div class="shield-ring dashed-ring-ccw"></div>
            <div class="shield-ring scale-ring"></div>
            
            <div class="shield-ring core-ring">
              <div class="energy-pulse"></div>
            </div>

            <div class="center-content">
              <h2 class="sub-title">
                WELCOME TO
              </h2>
              
              <h1
                class="glitch-text"
                data-text="BridgeEye"
              >
                BridgeEye
              </h1>

              <div class="scanning-status-wrapper">
                <span class="status-icon"></span>
                <span class="status-text">
                  SYSTEM STANDBY
                </span>
                <span class="scanning-dots">
                  ...
                </span>
              </div>

              <h3 class="sys-name">
                桥梁病害诊断中心
              </h3>
            </div>
            
          </div>
        </div>
      </div>
    </div>

    <button
      class="initiate-btn"
      @click="startEnterSystem"
    >
      <span class="btn-bracket">
        [
      </span>
      <span class="btn-text">
        启动系统
      </span>
      <span class="btn-bracket">
        ]
      </span>
      <div class="btn-scan-line"></div>
    </button>
    
    <!-- ================= 项目简介按钮 ================= -->
    <button
      class="initiate-btn"
      @click="toggleInfo"
    >
      <span class="btn-bracket">
        [
      </span>
      <span class="btn-text">
        项目简介
      </span>
      <span class="btn-bracket">
        ]
      </span>
      <div class="btn-scan-line"></div>
    </button>

    <!-- ================= 项目简介展开页面 ================= -->
    <div class="info-overlay" :class="{ 'open': isInfoOpen }">
      <div class="info-content">
        <!-- 装饰元素 -->
        <div class="info-decoration top-left"></div>
        <div class="info-decoration top-right"></div>
        <div class="info-decoration bottom-left"></div>
        <div class="info-decoration bottom-right"></div>
        
        <div class="info-header">
          <h2 class="info-title">BridgeEye 桥梁病害诊断系统</h2>
          <button class="close-btn" @click="toggleInfo">
            X
          </button>
        </div>
        
        <div class="info-body">
          <!-- 平台简介 -->
          <section class="info-section">
            <div class="section-header">
              <div class="section-border"></div>
              <h3>平台简介</h3>
              <div class="section-border"></div>
            </div>
            <div class="section-content">
              <div class="info-text">
                <p class="info-text-highlight">BridgeEye 桥梁病害诊断系统是一款基于人工智能技术的桥梁结构健康监测与评估平台，旨在为桥梁维护提供高效、准确的病害诊断解决方案。</p>
                <p>系统通过先进的计算机视觉技术，对桥梁表面图像进行智能分析，自动识别裂缝、泛碱、钢筋裸露、剥落等常见病害，并评估其风险等级。</p>
                <p>我们的目标是利用AI技术提升桥梁检测的效率和准确性，为桥梁安全保驾护航。</p>
              </div>
              <div class="info-image-placeholder large">
                <img src="../../public/BridgeEye.jpg" alt="BridgeEye" class="feature-img">
              </div>
            </div>
          </section>

          <!-- 核心功能 -->
          <section class="info-section">
            <div class="section-header">
              <div class="section-border"></div>
              <h3>核心功能</h3>
              <div class="section-border"></div>
            </div>
            <div class="section-content">
              <div class="feature-grid enhanced">
                <div class="feature-item feature-item-1">
                  <div class="feature-image">
                    <img src="../../public/feature1.jpg" alt="智能病害检测" class="feature-img">
                  </div>
                  <div class="feature-text">
                    <h4>智能病害检测</h4>
                    <p>利用AI算法自动识别多种桥梁病害类型</p>
                  </div>
                </div>
                <div class="feature-item feature-item-2">
                  <div class="feature-image">
                    <img src="../../public/feature2.png" alt="风险等级评估" class="feature-img">
                  </div>
                  <div class="feature-text">
                    <h4>风险等级评估</h4>
                    <p>根据病害严重程度评估风险等级</p>
                  </div>
                </div>
                <div class="feature-item feature-item-3">
                  <div class="feature-image">
                    <img src="../../public/feature3.jpg" alt="历史记录管理" class="feature-img">
                  </div>
                  <div class="feature-text">
                    <h4>历史记录管理</h4>
                    <p>存储和管理历史诊断记录</p>
                  </div>
                </div>
                <div class="feature-item feature-item-4">
                  <div class="feature-image">
                    <img src="../../public/feature4.jpg" alt="报告生成" class="feature-img">
                  </div>
                  <div class="feature-text">
                    <h4>报告生成</h4>
                    <p>自动生成详细的诊断报告</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 操作流程 -->
          <section class="info-section">
            <div class="section-header">
              <div class="section-border"></div>
              <h3>操作流程</h3>
              <div class="section-border"></div>
            </div>
            <div class="section-content">
              <div class="process-steps enhanced">
                <div class="step-item step-item-1">
                  <div class="step-number">1</div>
                  <div class="step-image">
                    <img src="../../public/step1.jpg" alt="上传图片" class="step-img">
                  </div>
                  <div class="step-content">
                    <h4>上传图片</h4>
                    <p>上传桥梁表面图像或ZIP压缩包</p>
                  </div>
                </div>
                <div class="step-connector">
                  <span>→</span>
                </div>
                <div class="step-item step-item-2">
                  <div class="step-number">2</div>
                  <div class="step-image">
                    <img src="../../public/step2.jpg" alt="AI分析" class="step-img">
                  </div>
                  <div class="step-content">
                    <h4>AI分析</h4>
                    <p>系统自动分析识别病害</p>
                  </div>
                </div>
                <div class="step-connector">
                  <span>→</span>
                </div>
                <div class="step-item step-item-3">
                  <div class="step-number">3</div>
                  <div class="step-image">
                    <img src="../../public/step3.jpg" alt="查看报告" class="step-img">
                  </div>
                  <div class="step-content">
                    <h4>查看报告</h4>
                    <p>查看详细的诊断报告</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 应用场景 -->
          <section class="info-section">
            <div class="section-header">
              <div class="section-border"></div>
              <h3>应用场景</h3>
              <div class="section-border"></div>
            </div>
            <div class="section-content">
              <div class="scenario-container">
                <div class="scenario-item scenario-item-1">
                  <div class="scenario-content">
                    <div class="scenario-image">
                      <img src="../../public/scenario1.jpg" alt="桥梁定期检测" class="scenario-img">
                    </div>
                    <div class="scenario-text">
                      <h4>桥梁定期检测</h4>
                      <p>用于桥梁的定期健康检查，通过AI技术快速识别潜在病害，提高检测效率和准确性。系统能够自动分析桥梁表面图像，识别裂缝、腐蚀等常见病害，为桥梁维护提供科学依据。</p>
                    </div>
                  </div>
                </div>
                <div class="scenario-item scenario-item-2">
                  <div class="scenario-content reverse">
                    <div class="scenario-image">
                      <img src="../../public/scenario2.jpg" alt="灾后评估" class="scenario-img">
                    </div>
                    <div class="scenario-text">
                      <h4>灾后评估</h4>
                      <p>自然灾害后快速评估桥梁损伤程度，为应急响应提供决策支持。系统能够在短时间内处理大量图像数据，评估桥梁结构完整性，帮助相关部门制定合理的修复方案。</p>
                    </div>
                  </div>
                </div>
                <div class="scenario-item scenario-item-3">
                  <div class="scenario-content">
                    <div class="scenario-image">
                      <img src="../../public/scenario3.jpg" alt="维护决策" class="scenario-img">
                    </div>
                    <div class="scenario-text">
                      <h4>维护决策</h4>
                      <p>为桥梁维护提供数据支持，基于AI分析结果生成维护建议。系统能够根据病害类型、严重程度和发展趋势，推荐最优维护方案，帮助管理部门合理分配资源。</p>
                    </div>
                  </div>
                </div>
                <div class="scenario-item scenario-item-4">
                  <div class="scenario-content reverse">
                    <div class="scenario-image">
                      <img src="../../public/scenario4.jpg" alt="长期监测" class="scenario-img">
                    </div>
                    <div class="scenario-text">
                      <h4>长期监测</h4>
                      <p>跟踪桥梁病害发展趋势，建立桥梁健康档案。通过定期检测和数据分析，系统能够预测病害发展方向，为桥梁的全生命周期管理提供支持。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <!-- 展开页面返回顶部按钮 -->
      <button class="info-back-to-top" @click="scrollToTopInfo">
        <i class='bx bx-arrow-to-top'></i>
      </button>
    </div>
  </div>
</template>

<script setup>
// 引入 Vue 响应式引用和 Vue Router 实例
import { ref } from "vue";
import { useRouter } from "vue-router";

// 获取路由实例用于跳转
const router = useRouter();
// 控制系统是否正在进入的响应式状态（用于触发离场机甲解体动画）
const isEntering = ref(false);

// ================= 项目简介展开状态 =================
const isInfoOpen = ref(false);

const toggleInfo = () => {
  isInfoOpen.value = !isInfoOpen.value;
};

// 展开页面返回顶部功能
const scrollToTopInfo = () => {
  const infoContent = document.querySelector('.info-content');
  if (infoContent) {
    infoContent.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
};

// 启动系统交互逻辑
const startEnterSystem = () => {
  // 防抖：如果动画已经在执行，则拦截重复点击
  if (isEntering.value) return;
  // 触发离场动画类名
  isEntering.value = true;
  // 延迟 1.5 秒，等待装甲板解锁、爆射退场等连贯动画播放完毕后，执行路由跳转
  setTimeout(() => {
    router.push("/login");
  }, 1500);
};
</script>

<style scoped>
/* ================= 全局与容器 ================= */
.show-container {
  /* 定义局部 CSS 变量：主题青色、暗色背景、等宽字体族 */
  --show-cyan: rgba(0, 229, 255, 1);
  --show-cyan-dim: rgba(0, 229, 255, 0.3);
  --font-mono: 'Roboto Mono Local', 'Courier New', Courier, monospace;
  /* 全屏绝对定位，阻止滚动 */
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 100;
  /* 开启 3D 透视以支持陀螺仪等 3D 效果 */
  perspective: 2000px;
  background: transparent;
}

/* ================= 纯视觉 HUD 组件 ================= */
.hud-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  /* 确保不遮挡底部按钮的鼠标事件 */
  pointer-events: none;
}

/* 四个角落 HUD 模块的统一样式及入场动画 */
.hud-visual {
  position: absolute;
  width: 80px;
  height: 80px;
  opacity: 0;
  animation: fadeUp 1s 0.5s ease forwards;
}

/* HUD 分别定位于屏幕四角 */
.visual-tl {
  top: 60px;
  left: 60px;
}

.visual-tr {
  top: 60px;
  right: 60px;
}

.visual-bl {
  bottom: 60px;
  left: 60px;
}

.visual-br {
  bottom: 60px;
  right: 60px;
}

/* 1. 光学侦测眼 (Optical Sensor) */
.optical-sensor {
  position: relative;
  width: 100%;
  height: 100%;
}

.optical-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
}

/* 虚线外环，顺时针旋转 */
.outer-dashed {
  width: 100%;
  height: 100%;
  border: 2px dashed rgba(0, 229, 255, 0.6);
  animation: spinCW 8s linear infinite;
}

/* 实线内环，逆时针旋转 */
.inner-solid {
  width: 60%;
  height: 60%;
  border: 1px solid rgba(0, 229, 255, 0.3);
  animation: spinCCW 4s linear infinite;
}

/* 十字标线 */
.optical-cross {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 1px;
  background: rgba(0, 229, 255, 0.2);
}

.optical-cross::after {
  content: "";
  position: absolute;
  top: -50px;
  left: 50%;
  width: 1px;
  height: 100px;
  background: rgba(0, 229, 255, 0.2);
}

/* 核心聚焦点，带有呼吸发光动画 */
.optical-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: rgba(0, 229, 255, 1);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 229, 255, 1);
  animation: pulse 1s infinite alternate;
}

/* 2. 三维姿态陀螺仪 (Gyro Stabilizer) */
.gyro-stabilizer {
  position: relative;
  width: 100%;
  height: 100%;
  /* 开启 3D 子元素保留 */
  transform-style: preserve-3d;
  perspective: 200px;
}

.gyro-axis {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid rgba(0, 229, 255, 0.5);
  transform-origin: center;
}

/* X/Y/Z 三轴分别应用不同的 3D 旋转动画 */
.axis-x {
  border-color: rgba(0, 229, 255, 0.8);
  animation: gyroX 4s linear infinite;
}

.axis-y {
  border-color: rgba(0, 229, 255, 0.4);
  animation: gyroY 6s linear infinite;
}

.axis-z {
  border-style: dashed;
  animation: gyroZ 10s linear infinite;
}

.gyro-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 8px #fff;
}

/* 3. 结构共振波形 (Resonance Wave) */
.resonance-wave {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 4px;
}

/* 单个波形柱基础样式：顶部高亮，本体半透明 */
.wave-bar {
  width: 8px;
  background: rgba(0, 229, 255, 0.6);
  box-shadow: 0 0 5px rgba(0, 229, 255, 0.4);
  border-top: 2px solid #fff;
}

/* 为 7 个波形柱设定参差不齐的基础高度与各自独立的缩放周期动画 */
.bar-1 { height: 20%; animation: waveAnim 1.2s infinite alternate ease-in-out; }
.bar-2 { height: 50%; animation: waveAnim 1.5s infinite alternate ease-in-out; }
.bar-3 { height: 80%; animation: waveAnim 0.8s infinite alternate ease-in-out; }
.bar-4 { height: 100%; animation: waveAnim 1.1s infinite alternate ease-in-out; }
.bar-5 { height: 60%; animation: waveAnim 1.4s infinite alternate ease-in-out; }
.bar-6 { height: 30%; animation: waveAnim 0.9s infinite alternate ease-in-out; }
.bar-7 { height: 40%; animation: waveAnim 1.3s infinite alternate ease-in-out; }

/* 4. 重型光学瞄准星 (Targeting Reticle) */
.targeting-reticle {
  position: relative;
  width: 100%;
  height: 100%;
  /* 整体缓慢顺时针旋转 */
  animation: spinCW 15s linear infinite;
}

/* 四个准星直角括号的基础结构 */
.reticle-bracket {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
}

.br-tl {
  top: 0;
  left: 0;
  border-top-color: rgba(0, 229, 255, 0.8);
  border-left-color: rgba(0, 229, 255, 0.8);
}

.br-tr {
  top: 0;
  right: 0;
  border-top-color: rgba(0, 229, 255, 0.8);
  border-right-color: rgba(0, 229, 255, 0.8);
}

.br-bl {
  bottom: 0;
  left: 0;
  border-bottom-color: rgba(0, 229, 255, 0.8);
  border-left-color: rgba(0, 229, 255, 0.8);
}

.br-br {
  bottom: 0;
  right: 0;
  border-bottom-color: rgba(0, 229, 255, 0.8);
  border-right-color: rgba(0, 229, 255, 0.8);
}

/* 中心圆环锁定圈 */
.reticle-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  height: 50%;
  border: 1px solid rgba(0, 229, 255, 0.4);
  border-radius: 50%;
}

/* 中心红色锁定点，带有持续闪烁动画 */
.reticle-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 4px;
  background: #f00;
  border-radius: 50%;
  box-shadow: 0 0 8px #f00;
  animation: textBlink 1s infinite;
}

/* ================= 核心机甲装甲金属总成 (无缝解体) ================= */
.shield-assembly {
  position: relative;
  width: 600px;
  height: 600px;
  z-index: 10;
  /* 整体机甲盾牌入场时 Z 轴从远及近突出 */
  animation: shieldDeploy 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* 爆发核心光源，平时处于完全透明状态 */
.shield-core-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: rgba(0, 229, 255, 1);
  border-radius: 50%;
  filter: blur(50px);
  opacity: 0;
  transition: opacity 0.3s;
}

/* 触发入场动作后核心光束爆炸扩散 */
.is-entering .shield-core-glow {
  opacity: 1;
  animation: coreExplode 1.5s ease-out forwards;
}

/* 象限外部容器：用于渲染切口边缘的等离子发光阴影效果 */
.quadrant-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 6px rgba(0, 229, 255, 0.6));
}

.quadrant-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 高能闪电斜切坐标计算 (通过精确百分比在中心 50% 50% 实现 100% 紧密咬合防断字) */
/* 左上装甲碎片裁剪区域 */
.q-tl {
  clip-path: polygon(
    0% 0%, 
    50% 0%, 
    55% 30%, 
    50% 50%, 
    30% 45%, 
    0% 50%
  );
}

/* 右上装甲碎片裁剪区域 */
.q-tr {
  clip-path: polygon(
    50% 0%, 
    100% 0%, 
    100% 50%, 
    70% 55%, 
    50% 50%, 
    55% 30%
  );
}

/* 左下装甲碎片裁剪区域 */
.q-bl {
  clip-path: polygon(
    0% 50%, 
    30% 45%, 
    50% 50%, 
    45% 70%, 
    50% 100%, 
    0% 100%
  );
}

/* 右下装甲碎片裁剪区域 */
.q-br {
  clip-path: polygon(
    100% 50%, 
    100% 100%, 
    50% 100%, 
    45% 70%, 
    50% 50%, 
    70% 55%
  );
}

/* 重金属装甲底板：质感构建 */
.armor-plate {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 径向渐变背景色模拟光照 */
  background: radial-gradient(
    circle at center,
    rgba(12, 28, 44, 0.95) 0%,
    rgba(2, 6, 12, 0.98) 100%
  );
  /* 毛玻璃效果增加厚重感 */
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 229, 255, 0.2);
  /* 深邃内边缘阴影强化体积感 */
  box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.8);
  /* 碳纤维式斜向防滑条纹纹理 */
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 4px,
    rgba(0, 229, 255, 0.03) 4px,
    rgba(0, 229, 255, 0.03) 8px
  );
}

/* 内部全息 UI 光效定位基准 */
.mechanical-shield-ui {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.shield-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
}

/* 外围细线目标环：逆时针缓转 */
.target-ring {
  width: 560px;
  height: 560px;
  border: 1px solid rgba(0, 229, 255, 0.15);
  animation: spinCCW 40s linear infinite;
}

/* 厚重外层齿轮轨道环：顺时针旋转附带内发光 */
.gear-ring-outer {
  width: 480px;
  height: 480px;
  border: 14px dashed rgba(0, 229, 255, 0.3);
  box-shadow: inset 0 0 20px rgba(0, 229, 255, 0.1);
  animation: spinCW 30s linear infinite;
}

/* 反向旋转的青色粗边刻度环 */
.dashed-ring-ccw {
  width: 410px;
  height: 410px;
  border: 3px solid transparent;
  border-top: 3px solid rgba(0, 229, 255, 1);
  border-bottom: 3px solid rgba(0, 229, 255, 1);
  animation: spinCCW 15s linear infinite;
  filter: drop-shadow(0 0 10px rgba(0, 229, 255, 1));
}

/* 带有背景渐变锥形扫描的内圈仪表板 */
.scale-ring {
  width: 350px;
  height: 350px;
  border: 1px solid rgba(0, 229, 255, 0.3);
  background: conic-gradient(
    from 0deg,
    rgba(0, 229, 255, 0.05) 0%,
    transparent 20%,
    rgba(0, 229, 255, 0.05) 50%,
    transparent 70%,
    rgba(0, 229, 255, 0.05) 100%
  );
  animation: spinCW 25s linear infinite;
}

/* 最中心的深色透明能量圈容器 */
.core-ring {
  width: 270px;
  height: 270px;
  background: rgba(0, 10, 20, 0.6);
  border: 2px solid rgba(0, 229, 255, 1);
  box-shadow: 0 0 30px rgba(0, 229, 255, 0.3);
}

/* 位于核心圈内不断律动的半透明光效 */
.energy-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 229, 255, 1);
  opacity: 0.1;
  animation: pulse 2s infinite alternate;
}

/* ================= 中心文字排版 ================= */
/* 整体居中排列，Z 轴悬浮突出层次感 */
.center-content {
  user-select: none;  
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
  z-index: 15;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

/* 顶部引言文字 */
.sub-title {
  color: #fff;
  font-size: 15px;
  letter-spacing: 6px;
  margin: 0;
  opacity: 0.9;
}

/* Glitch 故障风主标志文本 */
.glitch-text {
  font-family: 'Orbitron', sans-serif;
  font-size: 75px;
  font-weight: 900;
  margin: 0;
  color: #fff;
  text-shadow: 0 0 20px rgba(0, 229, 255, 1);
  letter-spacing: 8px;
  position: relative;
}

/* 利用 ::before 和 ::after 伪元素重叠相同文本并错开渲染用于切割色散特效 */
.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
}

/* 左侧红紫色通道散影偏移与上部分裁剪动画 */
.glitch-text::before {
  left: 3px;
  text-shadow: -2px 0 #ff00c1;
  animation: glitch-anim-1 2s infinite linear alternate-reverse;
}

/* 右侧青色通道散影偏移与下部分裁剪动画 */
.glitch-text::after {
  left: -3px;
  text-shadow: -2px 0 #00fff9;
  animation: glitch-anim-2 3s infinite linear alternate-reverse;
}

/* 系统运行扫描状态栏框体 */
.scanning-status-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 6px 20px;
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 4px;
}

/* 状态栏左侧闪烁告警红点 */
.status-icon {
  width: 8px;
  height: 8px;
  background: #f00;
  border-radius: 50%;
  box-shadow: 0 0 10px #f00;
  animation: statusPulse 1s infinite alternate;
}

/* 状态字样 */
.status-text {
  color: #fff;
  font-size: 13px;
  letter-spacing: 2px;
}

/* 点阵式打字机装载动效 */
.scanning-dots {
  color: #fff;
  animation: dotsBlink 1.5s infinite;
}

/* 系统中文大标题 */
.sys-name {
  color: #fff;
  font-size: 18px;
  letter-spacing: 10px;
  margin-top: 15px;
  text-shadow: 0 0 10px rgba(0, 229, 255, 1);
}

/* ================= 底部重型启动按钮 ================= */
.initiate-btn {
  margin-top: 50px;
  z-index: 20;
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 55px;
  opacity: 0;
  animation: fadeUp 1s 0.5s ease forwards;
  background: rgba(4, 20, 32, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-top: 1px solid rgba(0, 229, 255, 0.8);
  border-bottom: 5px solid rgba(0, 100, 140, 0.9);
  border-radius: 4px;
  color: rgba(0, 229, 255, 1);
  font-family: 'Roboto Mono', 'Courier New', Courier, monospace;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 4px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.15s ease-out;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.5);
}

.initiate-btn + .initiate-btn {
  margin-top: 35px;
}

/* 装饰性括弧 */
.btn-bracket {
  font-weight: 300;
  opacity: 0.5;
  transition: 0.2s;
}

/* ================= 悬停充能状态 ================= */
.initiate-btn:hover {
  background: rgba(0, 45, 65, 0.9);
  color: #fff;
  border-top: 1px solid #fff;
  border-bottom: 5px solid rgba(0, 180, 220, 1);
  box-shadow: 0 15px 30px rgba(0, 229, 255, 0.3), inset 0 0 20px rgba(0, 229, 255, 0.2);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

/* 悬停时外框括号放大强化焦点 */
.initiate-btn:hover .btn-bracket {
  color: #fff;
  transform: scale(1.3);
  opacity: 1;
}

.initiate-btn:active {
  border-bottom: 1px solid rgba(0, 180, 220, 1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.8), inset 0 5px 15px rgba(0, 0, 0, 0.5);
}

.btn-scan-line {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transform: skewX(-20deg);
  animation: btnScan 3s infinite;
}

/* ================= 震撼机甲解体退场动画 ================= */

/* 左上角象限碎片飞出：蓄力后带旋转向左上爆射 */
.is-entering .w-tl {
  animation: blastTL 1.2s 0.1s cubic-bezier(0.8, 0, 0.2, 1) forwards;
}

/* 右上角象限碎片飞出 */
.is-entering .w-tr {
  animation: blastTR 1.2s 0.1s cubic-bezier(0.8, 0, 0.2, 1) forwards;
}

/* 左下角象限碎片飞出 */
.is-entering .w-bl {
  animation: blastBL 1.2s 0.1s cubic-bezier(0.8, 0, 0.2, 1) forwards;
}

/* 右下角象限碎片飞出 */
.is-entering .w-br {
  animation: blastBR 1.2s 0.1s cubic-bezier(0.8, 0, 0.2, 1) forwards;
}

/* 机甲解体时按钮同步向下隐藏消退 */
.is-entering .initiate-btn {
  animation: btnExit 0.3s cubic-bezier(0.8, 0, 0.2, 1) forwards;
}

/* 周边仪表盘 HUD 缩放模糊退出 */
.is-entering .hud-overlay {
  animation: hudCollapse 0.8s 0.2s ease-in forwards;
}

/* ================= 全局核心动画关键帧定义区 ================= */

/* 陀螺仪 X 轴 3D 旋转 */
@keyframes gyroX {
  0% {
    transform: rotateX(0deg);
  }
  100% {
    transform: rotateX(360deg);
  }
}

/* 陀螺仪 Y 轴 3D 旋转 */
@keyframes gyroY {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}

/* 陀螺仪 Z 轴 3D 旋转 */
@keyframes gyroZ {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
}

/* 能量波形高度起伏缩放动画 */
@keyframes waveAnim {
  0% {
    transform: scaleY(0.5);
  }
  100% {
    transform: scaleY(1);
  }
}

/* 左上碎片防爆门退场核心动画：
   0%-20%：反向蓄力与屏幕发光 (模拟机甲卡扣解锁) 
   100%：极速向左上方抛射缩放并消失 */
@keyframes blastTL {
  0% {
    transform: translate(0, 0);
  }
  20% {
    transform: translate(-15px, -15px);
    filter: brightness(1.5);
  }
  100% {
    transform: translate(-150vw, -150vh) rotate(-25deg) scale(0.4);
    opacity: 0;
  }
}

/* 右上碎片爆射退场 */
@keyframes blastTR {
  0% {
    transform: translate(0, 0);
  }
  20% {
    transform: translate(15px, -15px);
    filter: brightness(1.5);
  }
  100% {
    transform: translate(150vw, -150vh) rotate(25deg) scale(0.4);
    opacity: 0;
  }
}

/* 左下碎片爆射退场 */
@keyframes blastBL {
  0% {
    transform: translate(0, 0);
  }
  20% {
    transform: translate(-15px, 15px);
    filter: brightness(1.5);
  }
  100% {
    transform: translate(-150vw, 150vh) rotate(-25deg) scale(0.4);
    opacity: 0;
  }
}

/* 右下碎片爆射退场 */
@keyframes blastBR {
  0% {
    transform: translate(0, 0);
  }
  20% {
    transform: translate(15px, 15px);
    filter: brightness(1.5);
  }
  100% {
    transform: translate(150vw, 150vh) rotate(25deg) scale(0.4);
    opacity: 0;
  }
}

/* 核心底座光源引爆扩散动画 */
@keyframes coreExplode {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(15);
    opacity: 0;
  }
}

/* 按钮专属的极速滑落退场动画 */
@keyframes btnExit {
  0% {
    opacity: 1;
    transform: translate(0%, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(0%, 30px) scale(0.8);
  }
}

/* 核心防爆盾首次初始化入场 Z 轴拉伸拉近动画 */
@keyframes shieldDeploy {
  0% {
    transform: scale(0.5) translateZ(-500px);
    opacity: 0;
    filter: blur(15px);
  }
  100% {
    transform: scale(1) translateZ(0);
    opacity: 1;
    filter: blur(0px);
  }
}

/* 四周 HUD 仪表盘坍缩退场动画 */
@keyframes hudCollapse {
  to {
    transform: scale(0.5) translateZ(-200px);
    opacity: 0;
    filter: blur(8px);
  }
}

/* 通用由下至上透明度淡入动画 */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 二维顺时针 360 度循环平滑旋转 */
@keyframes spinCW {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* 二维逆时针 360 度循环平滑旋转 */
@keyframes spinCCW {
  to {
    transform: translate(-50%, -50%) rotate(-360deg);
  }
}

/* 缩放脉冲放大呼吸动画 */
@keyframes pulse {
  to {
    transform: translate(0%, 0%) scale(1.1);
    opacity: 0.5;
  }
}

/* 红色警告点发光闪动动画 */
@keyframes statusPulse {
  to {
    opacity: 0.3;
    box-shadow: 0 0 3px #f00;
  }
}

/* 文本交替频闪动画 */
@keyframes textBlink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
}

/* 按钮表面强光滑过动画 */
@keyframes btnScan {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 200%;
  }
}

/* 扫描状态省略号等距点阵显示动画 */
@keyframes dotsBlink {
  0%, 20% {
    content: '';
  }
  40% {
    content: '.';
  }
  60% {
    content: '..';
  }
  80%, 100% {
    content: '...';
  }
}

/* 故障文字前置伪元素动态随机横向剪切区动画 (营造数字毛刺抖动感) */
@keyframes glitch-anim-1 {
  0% {
    clip-path: inset(20% 0 80% 0);
  }
  20% {
    clip-path: inset(60% 0 10% 0);
  }
  40% {
    clip-path: inset(40% 0 50% 0);
  }
  60% {
    clip-path: inset(80% 0 5% 0);
  }
  80% {
    clip-path: inset(10% 0 70% 0);
  }
  100% {
    clip-path: inset(30% 0 20% 0);
  }
}

/* 故障文字后置伪元素反向动态剪切区动画 (与 anim-1 交错撕裂) */
@keyframes glitch-anim-2 {
  0% {
    clip-path: inset(10% 0 60% 0);
  }
  20% {
    clip-path: inset(30% 0 20% 0);
  }
  40% {
    clip-path: inset(70% 0 10% 0);
  }
  60% {
    clip-path: inset(20% 0 50% 0);
  }
  80% {
    clip-path: inset(50% 0 30% 0);
  }
  100% {
    clip-path: inset(5% 0 80% 0);
  }
}


  /* ================= 项目简介展开页面 ================= */
  .info-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    z-index: 1000;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .info-overlay.open {
    opacity: 1;
    visibility: visible;
  }

  .info-content {
    background: rgba(2, 8, 16, 0.95);
    border-top: 2px solid #00e5ff;
    border-left: 1px solid rgba(0, 229, 255, 0.2);
    border-right: 1px solid rgba(0, 229, 255, 0.2);
    width: 100%;
    max-width: 1600px;
    max-height: 90vh;
    overflow-y: auto;
    overflow-x: hidden;
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 -10px 60px rgba(0, 229, 255, 0.15);
    position: relative;
  }

  .info-overlay.open .info-content {
    transform: translateY(0);
  }

  .info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px;
    border-bottom: 1px solid rgba(0, 229, 255, 0.2);
    background: rgba(0, 229, 255, 0.05);
  }

  .info-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 24px;
    font-weight: 900;
    color: #fff;
    letter-spacing: 4px;
    margin: 0;
    text-shadow: 0 0 20px rgba(0, 229, 255, 0.6);
  }

  .close-btn {
    background: none;
    border: 1px solid rgba(0, 229, 255, 0.3);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #00e5ff;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .close-btn:hover {
    background: rgba(0, 229, 255, 0.2);
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
  }

  .info-body {
    padding: 50px;
  }

  .info-section {
    margin-bottom: 50px;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 40px;
    justify-content: center;
  }

  .section-border {
    width: 40px;
    height: 2px;
    background: #00e5ff;
    box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
  }

  .section-header h3 {
    font-family: 'Orbitron', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #00e5ff;
    letter-spacing: 2px;
    margin: 0;
  }

  .section-content {
    display: flex;
    gap: 30px;
    align-items: flex-start;
  }

  .info-text {
    flex: 1;
  }

  .info-text p {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    margin-bottom: 15px;
    font-family: 'Roboto Mono Local', monospace;
    font-size: 14px;
  }

  .info-text-highlight {
    font-size: 16px !important;
    font-weight: bold;
    color: rgb(0, 229, 255,) !important;
    text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
    margin-bottom: 20px !important;
  }

  .info-image-placeholder {
    width: 350px;
    height: 200px;
    background: linear-gradient(45deg, rgba(0, 229, 255, 0.6), rgba(0, 229, 255, 0.05));
    border: 1px solid rgba(0, 229, 255, 0.2);
    border-radius: 8px;
    position: relative;
    overflow: hidden;
  }

  .info-image-placeholder.large {
    width: 450px;
    height: 280px;
    box-shadow: 0 0 40px rgba(0, 229, 255, 0.15);
  }

  .info-image-placeholder.large::before {
    animation: shine 2s infinite;
  }

  .info-image-placeholder::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.2), transparent);
    animation: shine 3s infinite;
  }

  @keyframes shine {
    100% {
      left: 100%;
    }
  }

  /* 核心功能网格 */
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    width: 100%;
  }

  .feature-grid.enhanced {
    gap: 40px;
  }

  .feature-item {
    background: rgba(0, 229, 255, 0.05);
    border: 1px solid rgba(0, 229, 255, 0.2);
    border-radius: 8px;
    padding: 30px;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    overflow: hidden;
    min-height: 300px;
    transform: perspective(1000px) rotateY(0deg);
  }

  .feature-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.2), transparent);
    animation: shine 3s infinite;
    z-index: 1;
  }

  .feature-item:hover {
    transform: perspective(1000px) rotateY(5deg) translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 229, 255, 0.2);
  }

  .feature-item-2:hover {
    transform: perspective(1000px) rotateY(-5deg) translateY(-8px);
  }

  .feature-item-4:hover {
    transform: perspective(1000px) rotateY(-5deg) translateY(-8px);
  }

  /* 不同功能项的颜色 */
  .feature-item-1 {
    border-left: 3px solid #00e5ff;
    background: linear-gradient(135deg, rgba(0, 229, 255, 0.05), rgba(0, 229, 255, 0.02));
  }

  .feature-item-2 {
    border-left: 3px solid #00ffaa;
    background: linear-gradient(135deg, rgba(0, 255, 170, 0.05), rgba(0, 255, 170, 0.02));
  }

  .feature-item-3 {
    border-left: 3px solid #ffaa00;
    background: linear-gradient(135deg, rgba(255, 170, 0, 0.05), rgba(255, 170, 0, 0.02));
  }

  .feature-item-4 {
    border-left: 3px solid #ff3333;
    background: linear-gradient(135deg, rgba(255, 51, 51, 0.05), rgba(255, 51, 51, 0.02));
  }

  .feature-image {
    width: 100%;
    height: 180px;
    margin-bottom: 20px;
    border-radius: 8px;
    overflow: hidden;
    background: linear-gradient(45deg, rgba(0, 229, 255, 0.1), rgba(0, 229, 255, 0.05));
    border: 1px solid rgba(0, 229, 255, 0.2);
    transition: all 0.3s ease;
  }

  .feature-item:hover .feature-image {
    transform: scale(1.05);
  }

  .feature-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .feature-text {
    width: 100%;
    z-index: 2;
  }

  .feature-item h4 {
    font-family: 'Orbitron', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #00e5ff;
    letter-spacing: 1px;
    margin: 0 0 15px 0;
    text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
  }

  .feature-item-2 h4 {
    color: #00ffaa;
    text-shadow: 0 0 10px rgba(0, 255, 170, 0.5);
  }

  .feature-item-3 h4 {
    color: #ffaa00;
    text-shadow: 0 0 10px rgba(255, 170, 0, 0.5);
  }

  .feature-item-4 h4 {
    color: #ff3333;
    text-shadow: 0 0 10px rgba(255, 51, 51, 0.5);
  }

  .feature-item p {
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
    line-height: 1.4;
    margin: 0;
    font-family: 'Roboto Mono Local', monospace;
  }

  /* 操作流程 */
  .process-steps {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    flex-wrap: wrap;
    gap: 20px;
  }

  .process-steps.enhanced {
    gap: 20px;
  }

  .step-item {
    flex: 1;
    min-width: 200px;
    background: rgba(0, 229, 255, 0.05);
    border: 1px solid rgba(0, 229, 255, 0.2);
    border-radius: 8px;
    padding: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 15px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .step-image {
    width: 100%;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;
    background: linear-gradient(45deg, rgba(0, 229, 255, 0.1), rgba(0, 229, 255, 0.05));
    border: 1px solid rgba(0, 229, 255, 0.2);
    transition: all 0.3s ease;
  }

  .step-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .step-item:hover .step-image {
    transform: scale(1.05);
  }

  .step-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 229, 255, 0.15);
  }

  /* 不同步骤的颜色 */
  .step-item-1 {
    border-top: 3px solid #00e5ff;
  }

  .step-item-2 {
    border-top: 3px solid #00ffaa;
  }

  .step-item-3 {
    border-top: 3px solid #ffaa00;
  }

  .step-item-4 {
    border-top: 3px solid #ff3333;
  }

  .step-number {
    width: 50px;
    height: 50px;
    background: #00e5ff;
    color: #020810;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Orbitron', sans-serif;
    font-weight: bold;
    font-size: 18px;
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.5);
  }

  .step-item-2 .step-number {
    background: #00ffaa;
    box-shadow: 0 0 20px rgba(0, 255, 170, 0.5);
  }

  .step-item-3 .step-number {
    background: #ffaa00;
    box-shadow: 0 0 20px rgba(255, 170, 0, 0.5);
  }

  .step-item-4 .step-number {
    background: #ff3333;
    box-shadow: 0 0 20px rgba(255, 51, 51, 0.5);
  }

  .step-content {
    width: 100%;
  }

  .step-content h4 {
    font-family: 'Orbitron', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #00e5ff;
    letter-spacing: 1px;
    margin: 0 0 10px 0;
    text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
  }

  .step-item-2 h4 {
    color: #00ffaa;
    text-shadow: 0 0 10px rgba(0, 255, 170, 0.5);
  }

  .step-item-3 h4 {
    color: #ffaa00;
    text-shadow: 0 0 10px rgba(255, 170, 0, 0.5);
  }

  .step-item-4 h4 {
    color: #ff3333;
    text-shadow: 0 0 10px rgba(255, 51, 51, 0.5);
  }

  .step-content p {
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
    margin: 0;
    font-family: 'Roboto Mono Local', monospace;
  }

  .step-connector {
    flex-shrink: 0;
    padding: 0 10px;
    color: #00e5ff;
    font-size: 20px;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
  }



  /* 滚动条样式 */
  .info-content::-webkit-scrollbar {
    width: 8px;
  }

  .info-content::-webkit-scrollbar-track {
    background: rgba(0, 229, 255, 0.05);
  }

  .info-content::-webkit-scrollbar-thumb {
    background: rgba(0, 229, 255, 0.3);
    border-radius: 4px;
  }

  .info-content::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 229, 255, 0.5);
  }

  /* 应用场景容器 */
  .scenario-container {
    display: flex;
    flex-direction: column;
    gap: 40px;
    width: 100%;
  }

  .scenario-item {
    background: rgba(0, 229, 255, 0.05);
    border: 1px solid rgba(0, 229, 255, 0.2);
    border-radius: 8px;
    padding: 40px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    transform: perspective(1000px) rotateY(0deg);
  }

  .scenario-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.2), transparent);
    animation: shine 3s infinite;
    z-index: 1;
  }

  .scenario-item:hover {
    transform: perspective(1000px) rotateY(4deg) translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 229, 255, 0.15);
  }
  .scenario-item-2:hover {
    transform: perspective(1000px) rotateY(-4deg) translateY(-5px);
  }
  .scenario-item-4:hover {
    transform: perspective(1000px) rotateY(-4deg) translateY(-5px);
  }

  /* 不同场景的颜色 */
  .scenario-item-1 {
    border-left: 4px solid #00e5ff;
    background: linear-gradient(135deg, rgba(0, 229, 255, 0.05), rgba(0, 229, 255, 0.02));
  }

  .scenario-item-2 {
    border-left: 4px solid #00ffaa;
    background: linear-gradient(135deg, rgba(0, 255, 170, 0.05), rgba(0, 255, 170, 0.02));
  }

  .scenario-item-3 {
    border-left: 4px solid #ffaa00;
    background: linear-gradient(135deg, rgba(255, 170, 0, 0.05), rgba(255, 170, 0, 0.02));
  }

  .scenario-item-4 {
    border-left: 4px solid #ff3333;
    background: linear-gradient(135deg, rgba(255, 51, 51, 0.05), rgba(255, 51, 51, 0.02));
  }

  .scenario-content {
    display: flex;
    align-items: center;
    gap: 40px;
    z-index: 2;
    position: relative;
  }

  .scenario-content.reverse {
    flex-direction: row-reverse;
  }

  .scenario-image {
    width: 40%;
    height: 300px;
    border-radius: 8px;
    overflow: hidden;
    background: linear-gradient(45deg, rgba(0, 229, 255, 0.1), rgba(0, 229, 255, 0.05));
    border: 1px solid rgba(0, 229, 255, 0.2);
    transition: all 0.3s ease;
  }

  .scenario-item:hover .scenario-image {
    transform: scale(1.05);
  }

  .scenario-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .scenario-text {
    flex: 1;
    z-index: 2;
  }

  .scenario-item h4 {
    font-family: 'Orbitron', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #00e5ff;
    letter-spacing: 1px;
    margin: 0 0 20px 0;
    text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
  }

  .scenario-item-2 h4 {
    color: #00ffaa;
    text-shadow: 0 0 10px rgba(0, 255, 170, 0.5);
  }

  .scenario-item-3 h4 {
    color: #ffaa00;
    text-shadow: 0 0 10px rgba(255, 170, 0, 0.5);
  }

  .scenario-item-4 h4 {
    color: #ff3333;
    text-shadow: 0 0 10px rgba(255, 51, 51, 0.5);
  }

  .scenario-item p {
    color: rgba(255, 255, 255, 0.6);
    font-size: 16px;
    line-height: 1.6;
    margin: 0;
    font-family: 'Roboto Mono Local', monospace;
  }

  /* 返回顶部按钮 */
  .info-back-to-top {
    position: absolute;
    bottom: 55px;
    right: 60px;
    width: 45px;
    height: 45px;
    background: none;
    border: 1px solid rgba(0, 229, 255, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #00e5ff;
    font-size: 24px;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 1001;
  }

  .info-back-to-top:hover {
    background: rgba(0, 229, 255, 0.2);
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
  }



  /* ================= 装饰元素 ================= */
  .info-decoration {
    position: absolute;
    width: 100px;
    height: 100px;
    border: 1px solid rgba(0, 229, 255, 0.1);
    pointer-events: none;
    animation: rotate 20s linear infinite;
  }

  .info-decoration.top-left {
    top: 20px;
    left: 20px;
    border-top-color: #00e5ff;
    border-left-color: #00e5ff;
  }

  .info-decoration.top-right {
    top: 20px;
    right: 20px;
    border-top-color: #00e5ff;
    border-right-color: #00e5ff;
  }

  .info-decoration.bottom-left {
    bottom: 20px;
    left: 20px;
    border-bottom-color: #00e5ff;
    border-left-color: #00e5ff;
  }

  .info-decoration.bottom-right {
    bottom: 20px;
    right: 20px;
    border-bottom-color: #00e5ff;
    border-right-color: #00e5ff;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>