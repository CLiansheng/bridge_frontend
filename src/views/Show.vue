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
                data-text=" 桥曈"
              >
                 桥曈
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

    <div class="action-buttons-wrapper">
      
      <button
        class="initiate-btn secondary-btn"
        @click="startEnterSystem"
      >
        <span class="btn-bracket">[</span>
        <span class="btn-text">启动系统</span>
        <span class="btn-bracket">]</span>
      </button>
      
      <button
        class="initiate-btn"
        @click="toggleInfo"
      >
        <span class="btn-bracket">[</span>
        <span class="btn-text">项目简介</span>
        <span class="btn-bracket">]</span>
      </button>

    </div>
    <!-- ================= 项目简介展开页面 ================= -->
    <div class="info-overlay" :class="{ 'open': isInfoOpen }">
      <div class="info-content">
        <!-- 装饰元素 -->
        <div class="info-decoration top-left"></div>
        <div class="info-decoration top-right"></div>
        <div class="info-decoration bottom-left"></div>
        <div class="info-decoration bottom-right"></div>
        
        <div class="info-header">
          <h2 class="info-title"> 桥曈 桥梁病害诊断系统</h2>
          <button class="close-btn" @click="toggleInfo">
              X
          </button>
        </div>
        
<div class="info-body">
          <section class="info-section">
            <div class="section-header">
              <div class="section-border"></div>
              <h3>系统功能概览</h3>
              <div class="section-border"></div>
            </div>
            <div class="section-content">
              <div class="info-text">
                <p class="info-text-highlight"> 桥曈 桥梁智能巡检与全息诊断决策基座，是依托先进计算机视觉与多模态大语言模型打造的划时代桥梁基础设施病害检测平台。</p>
                <p>面对传统桥梁巡检中“高危人工作业多、主观误判率高、海量数据追溯难”等行业级痛点，本系统开创性地引入了全新的 AI 专家研判引擎。我们将物理世界的桥梁实体与病害特征精准映射至数字空间，构筑了一条从“高清图像采集、毫秒级特征解析、多维风险定级”到“智能化养护策略生成”的端到端数据闭环。</p>
                <p>这不仅是一套病害识别工具，更是面向未来交通枢纽的“预防性养护”数字大脑。 桥曈 致力于打破数据孤岛，赋能交通管理部门实现从“被动抢修”向“主动干预”的战略跨越，实现运维成本的指数级降低与桥梁服役寿命的极限延伸。</p>
              </div>
              <div class="info-image-placeholder large">
                <img src="/fuchuang.png" alt=" 桥曈" class="feature-img">
              </div>
            </div>
          </section>

          <section class="info-section">
            <div class="section-header">
              <div class="section-border"></div>
              <h3>核心业务引擎 (CORE ENGINES)</h3>
              <div class="section-border"></div>
            </div>
            <div class="section-content">
              <div class="feature-grid enhanced">
                <div class="feature-item feature-item-1">
                  <div class="feature-image">
                    <img src=" /feature1.jpg" alt="多维视觉病害解析" class="feature-img">
                  </div>
                  <div class="feature-text">
                    <h4>多维视觉解析引擎</h4>
                    <p>突破复杂野外环境光与遮挡干扰，底层卷积神经网络能够精准锁定裂缝、泛碱、露筋等表观病害，毫米级提取病害几何特征、走向与形态分布参数。</p>
                  </div>
                </div>
                <div class="feature-item feature-item-2">
                  <div class="feature-image">
                    <img src=" /feature2.png" alt="AI Agent 智能研判" class="feature-img">
                  </div>
                  <div class="feature-text">
                    <h4>AI 智能研判中枢</h4>
                    <p>引入具备上下文逻辑思考能力的 AI 专家助手。系统将视觉提取指标与国家现行桥梁评定标准融合，进行多模态交叉演算，科学输出结构风险定级模型。</p>
                  </div>
                </div>
                <div class="feature-item feature-item-3">
                  <div class="feature-image">
                    <img src=" /feature3.jpg" alt="全息数字档案管线" class="feature-img">
                  </div>
                  <div class="feature-text">
                    <h4>全息数字档案管线</h4>
                    <p>沉淀桥梁全生命周期检测数据，构建防篡改、可追溯的历史病害知识库。通过交互式三维数据大屏，直观呈现全网桥梁健康指数与劣化趋势热力图。</p>
                  </div>
                </div>
                <div class="feature-item feature-item-4">
                  <div class="feature-image">
                    <img src=" /feature4.jpg" alt="标准化评估诊断书" class="feature-img">
                  </div>
                  <div class="feature-text">
                    <h4>标准化决策诊断书</h4>
                    <p>告别繁杂的人工报表编撰。系统可一键导出涵盖高分辨率病害图谱、量化指标矩阵及 AI 智能修复建议的综合诊断报告，为一线养护决策提供坚实数据背书。</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="info-section">
            <div class="section-header">
              <div class="section-border"></div>
              <h3>全场景应用赋能 (SCENARIOS)</h3>
              <div class="section-border"></div>
            </div>
            <div class="section-content">
              <div class="scenario-container">
                <div class="scenario-item scenario-item-1">
                  <div class="scenario-content">
                    <div class="scenario-image">
                      <img src=" /scenario1.jpg" alt="例行巡检与健康建档" class="scenario-img">
                    </div>
                    <div class="scenario-text">
                      <h4>桥梁例行巡检与数字建档</h4>
                      <p>深度赋能路政及桥梁养护单位的日常巡检业务。依托高并发计算集群， 桥曈 能够极速吞吐无人机及车载抓拍的海量表观图像，将非结构化的杂乱数据瞬间转化为标准化的病害台账。大幅降低人工登高、下水作业的安全风险与主观漏检率，为每一座桥梁建立伴随其全生命周期的超清数字健康档案。</p>
                    </div>
                  </div>
                </div>
                <div class="scenario-item scenario-item-2">
                  <div class="scenario-content reverse">
                    <div class="scenario-image">
                      <img src=" /scenario2.jpg" alt="突发灾后结构快速评估" class="scenario-img">
                    </div>
                    <div class="scenario-text">
                      <h4>突发自然灾害后结构快速评估</h4>
                      <p>在面对地震、极寒冰雪、特大洪涝或超重车辆撞击等突发性公共事件后，生命线工程的恢复时间极度宝贵。本平台能够协助应急响应团队在震后/灾后 24 小时内完成受损数据的全面上云与解析，迅速量化桥梁承重结构的完好程度，为交通生命线的抢险保通提供最核心的量化决策依据。</p>
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
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";

// 获取路由实例用于跳转
const router = useRouter();
// 控制系统是否正在进入的响应式状态（用于触发离场机甲解体动画）
const isEntering = ref(false);

// ================= 项目简介展开状态 =================
const isInfoOpen = ref(false);

const toggleInfo = () => {
  isInfoOpen.value = !isInfoOpen.value;
  // 当面板被打开时，重置滚动条到顶部
  if (isInfoOpen.value) {
    nextTick(() => {
      const infoBody = document.querySelector('.info-body');
      if (infoBody) infoBody.scrollTop = 0;
    });
  }
};

// 展开页面返回顶部功能
const scrollToTopInfo = () => {
  const infoBody = document.querySelector('.info-body');
  if (infoBody) {
    infoBody.scrollTo({
      top: 0,
      behavior: 'smooth' /* 触发浏览器原生丝滑滚动 */
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
  --font-mono: 'Courier New', Courier, monospace;
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
/* ================= 新增：底部横向按钮组容器 ================= */
.action-buttons-wrapper {
  display: flex;
  justify-content: center;
  gap: 50px;               /* 加大间距，让呼吸感更强 */
  margin-top: 60px;
  z-index: 20;
}

/* ================= 核心机甲风按钮基类 (启动系统) ================= */
.initiate-btn {
  user-select: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-width: 180px;
  padding: 14px 35px;
  /* 玻璃拟态：微弱的渐变底色 + 强效高斯模糊 */
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.1) 0%, rgba(2, 8, 16, 0.5) 100%);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 2px;
  
  color: rgba(0, 229, 255, 0.9);
  /* 使用你标题的 Orbitron 字体，如果没有则回退到等宽字体 */
  font-family: 'Orbitron', monospace;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 4px;
  cursor: pointer;
  
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
}

/* 按钮四个角的“锁定准星”修饰 */
.initiate-btn::before,
.initiate-btn::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  transition: all 0.3s ease;
  pointer-events: none;
}

.initiate-btn::before {
  top: -1px;
  left: -1px;
  border-top: 2px solid #00e5ff;
  border-left: 2px solid #00e5ff;
}

.initiate-btn::after {
  bottom: -1px;
  right: -1px;
  border-bottom: 2px solid #00e5ff;
  border-right: 2px solid #00e5ff;
}

/* ================= 悬停炫酷发光态 ================= */
.initiate-btn:hover {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.25) 0%, rgba(0, 100, 150, 0.4) 100%);
  color: #ffffff;
  border-color: rgba(0, 229, 255, 0.8);
  box-shadow: 0 0 25px rgba(0, 229, 255, 0.4), inset 0 0 15px rgba(0, 229, 255, 0.2);
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  transform: translateY(-3px); /* 悬浮微升 */
}

/* 悬停时四个角的锁定框包裹住整个按钮 */
.initiate-btn:hover::before,
.initiate-btn:hover::after {
  width: calc(100% + 2px);
  height: calc(100% + 2px);
  opacity: 0.5;
}

/* 按下受击反馈 */
.initiate-btn:active {
  transform: translateY(0.1px);
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.2), inset 0 0 20px rgba(0, 229, 255, 0.4);
}

/* ================= 次级按钮 (项目简介) - 幽灵装甲风 ================= */
.secondary-btn {
  /* 提升亮度：使用浅青色的微渐变毛玻璃底色 */
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.05) 0%, rgba(0, 229, 255, 0.15) 100%);
  border: 1px solid rgba(0, 229, 255, 0.4);
  color: rgba(0, 229, 255, 0.9); /* 文字提亮 */
  box-shadow: inset 0 0 10px rgba(0, 229, 255, 0.1); /* 增加微妙的内发光 */
}

/* 调亮四角机械准星的初始亮度 */
.secondary-btn::before,
.secondary-btn::after {
  border-color: rgba(0, 229, 255, 0.6);
}


/* 悬停时的能量爆发感 */
.secondary-btn:hover {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.15) 0%, rgba(0, 229, 255, 0.3) 100%);
  color: #ffffff;
  border-color: rgba(0, 229, 255, 1);
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.3), inset 0 0 15px rgba(0, 229, 255, 0.3);
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  transform: translateY(-3px);
}

/* 按下反馈 */
.secondary-btn:active {
  transform: translateY(1px);
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.2), inset 0 0 15px rgba(0, 229, 255, 0.3);
}

/* 机甲解体时，整个按钮组同步退出 */
.is-entering .action-buttons-wrapper {
  animation: btnExit 0.3s cubic-bezier(0.8, 0, 0.2, 1) forwards;
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


/* ================= 项目简介展开页面 (全息悬浮窗重构) ================= */
.info-overlay {
  /* 保留原有基础... */
  user-select: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(2, 8, 16, 0.7); /* 稍微降低遮罩透明度，减少混合成本 */
  
  backdrop-filter: blur(8px); /* 模糊度从15px下调到8px，视觉相差不大，性能提升巨大 */
  -webkit-backdrop-filter: blur(8px);
  
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.info-overlay.open {
  opacity: 1;
  visibility: visible;
}

/* 悬浮玻璃面板 */
.info-content {
  /* 保留原有基础样式... */
  background: rgba(4, 14, 28, 0.9); /* 稍微加大底色不透明度，减少透视计算 */
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 12px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), inset 0 0 30px rgba(0, 229, 255, 0.05);
  width: 90%;
  max-width: 1400px;
  height: 85vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  
  transform: translateZ(0) scale(0.95) translateY(30px);
  will-change: transform, opacity; /* 提前告知浏览器将要进行的动画，进一步优化 */
}

.info-overlay.open .info-content {
  transform: translateZ(0) scale(1) translateY(0); /* 保持 translateZ */
}

/* 固定的头部标题栏 */
.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 40px;
  border-bottom: 1px solid rgba(0, 229, 255, 0.2);
  background: linear-gradient(to bottom, rgba(0, 229, 255, 0.08), transparent);
  flex-shrink: 0; /* 确保头部不会在滚动时被压缩 */
  z-index: 10;
}

.info-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 24px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 4px;
  margin: 0;
  text-shadow: 0 0 15px rgba(0, 229, 255, 0.6);
}
/* ================= 极简关闭按钮 ================= */
.close-btn {
  background: rgba(0, 229, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 4px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00e5ff;
  font-size: 20px;
  font-family: monospace;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* 简单的悬停变亮效果 */
.close-btn:hover {
  background: rgba(0, 229, 255, 0.2);
  border-color: rgba(0, 229, 255, 0.8);
  color: #fff;
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
}

.close-btn:active {
  transform: scale(0.95);
}

/* 核心的两条青色横线组成的“十”字（赛博机甲风） */
.cross-line {
  position: absolute;
  width: 20px;
  height: 2px;
  background: #00e5ff;
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0 8px rgba(0, 229, 255, 0.6);
}

.cross-line.l1 { transform: rotate(45deg); }
.cross-line.l2 { transform: rotate(-45deg); }



/* 独立滑动的丝滑内容区 */
.info-body {
  padding: 40px 50px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  
  /* hint：告诉浏览器这里的内容专门处理抗锯齿，能缓解滑动卡顿感 */
  -webkit-font-smoothing: antialiased;
  /* hint：提升滚动区域层级，尽量减少和底层 Matrix 雨的混合计算 */
  contain: paint; 
}

.info-section {
  margin-bottom: 60px; /* 稍微加大各个段落的间距，呼吸感更强 */
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

/* 文本与高亮细节保留... */
.info-text { flex: 1; }
.info-text p {
  color: rgba(220, 245, 255, 0.85); /* 抛弃暗灰色，改用极其通透的高级冰蓝色 */
  line-height: 2.0; /* 拉大行高，让长篇幅文字不显得拥挤 */
  margin-bottom: 22px;
  font-family: -apple-system, 'PingFang SC', sans-serif;
  font-size: 16px; /* 字号从 14px 提拔到 16px */
  letter-spacing: 1px;
  text-shadow: 0 0 1px rgba(0, 229, 255, 0.2); /* 微弱的字体发光，增加屏幕质感 */
}

.info-text-highlight {
  font-size: 20px !important; /* 字号拉大，增加视觉冲击 */
  font-weight: 900;
  letter-spacing: 2px;
  /* 制作青绿交织的高级金属渐变字体 */
  background: linear-gradient(90deg, #00e5ff 0%, #00ffaa 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(0, 229, 255, 0.4); /* 外发光光晕 */
  margin-bottom: 30px !important;
  line-height: 1.6 !important;
}

/* 图片占位符等保留... (确保没删掉你原有的图片样式) */
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

/* ================= 极细科技感悬浮滚动条 ================= */
.info-body::-webkit-scrollbar {
  width: 6px; /* 极细设计 */
}

.info-body::-webkit-scrollbar-track {
  background: transparent; /* 轨道完全透明，干脆利落 */
  border-left: 1px solid rgba(0, 229, 255, 0.05); /* 仅留一条微弱的定位指示线 */
}

.info-body::-webkit-scrollbar-thumb {
  background: rgba(0, 229, 255, 0.3);
  border-radius: 10px;
  border: 1px solid rgba(0, 229, 255, 0.1); /* 给游标加上微弱的物理边框质感 */
}

.info-body::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 229, 255, 0.8);
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.6); /* 鼠标移上去产生耀眼高光 */
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
  font-family: 'Orbitron', 'PingFang SC', sans-serif;
  font-size: 18px; /* 原本 16px，调大 */
  font-weight: 700;
  letter-spacing: 2px;
  margin: 0 0 15px 0;
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
    color: rgba(220, 245, 255, 0.75);
    font-size: 15px; /* 原本 14px，调大 */
    line-height: 1.8;
    margin: 0;
    letter-spacing: 1px;
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
    font-family: monospace;
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
    font-family: 'Orbitron', 'PingFang SC', sans-serif;
    font-size: 22px; /* 原本 20px，调大 */
    font-weight: 700;
    letter-spacing: 2px;
    margin: 0 0 20px 0;
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
    color: rgba(220, 245, 255, 0.85); /* 同样采用通透的冰蓝色 */
    font-size: 16px; /* 统一正文字号 */
    line-height: 2.0;
    margin: 0;
    letter-spacing: 1px;
  }

  .section-header h3 {
    font-family: 'Orbitron', 'PingFang SC', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #fff; /* 主色变白 */
    text-shadow: 0 0 15px rgba(0, 229, 255, 0.8); /* 靠青色阴影发光 */
    letter-spacing: 4px;
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