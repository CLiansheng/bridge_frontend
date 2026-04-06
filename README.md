### 修复后的 README.md 内容（修正代码块显示 + 序号层级）
以下是修正后的完整内容，重点修复了**标题序号层级**、**代码块语法高亮**、**Markdown 格式规范**等问题：

```markdown
#### 3.1.2.1 开发所用工具与技术栈
##### 3.1.2.1.1 包管理工具
本项目采用 **npm** 作为包管理工具，它是前端开发最主流的依赖管理工具，也是Node.js自带的默认包管理器，核心优势如下：
1. **生态成熟，普及率高**：拥有全球最大的开源包仓库，项目中用到的所有前端依赖都可通过npm快速安装，无需额外适配，学习和使用门槛低，非常适合学生开发者快速上手。
2. **版本管理稳定可靠**：经过多年迭代优化，依赖解析和版本控制机制已非常成熟，能保证项目在不同设备上安装的依赖版本完全一致，避免出现“本地可运行、部署后报错”的环境差异问题。
3. **支持多包协同管理**：自带workspaces特性，支持在一个项目中管理多个关联的子模块，方便项目后续的模块化拆分与功能扩展，适配多人协作开发的需求。
4. **功能全面易操作**：提供简洁的命令行指令，可完成依赖的安装、更新、卸载全流程操作，同时支持自定义配置，能满足项目的个性化开发需求。

##### 3.1.2.1.2 JS 框架
本项目选用 **Vue 3** 作为核心前端开发框架，它是一款轻量、易上手的渐进式Web框架，非常适配中小型项目的快速开发，核心优势如下：
1. **学习门槛低**：基于标准HTML、CSS、JavaScript构建，官方文档清晰易懂，学生开发者可快速上手并投入项目开发，无需花费大量时间学习全新的语法体系。
2. **渲染性能优异**：通过编译器优化和响应式系统升级，渲染性能大幅提升，无需手动做大量优化，即可保证页面的流畅运行。
3. **代码组织更灵活**：新增的组合式API（Composition API），可将同一功能的逻辑代码集中编写，避免代码分散，逻辑复用和后期维护更方便，适配多人协作的开发模式。
4. **原生TypeScript支持**：内置完整的TypeScript适配，开发阶段即可完成类型校验，提前发现代码潜在问题，减少运行时bug，提升代码健壮性。
5. **生态灵活可扩展**：可根据项目规模灵活选择配套工具，小型项目可仅用核心库，复杂项目可搭配完整生态工具，适配性极强。

##### 3.1.2.1.3 前端构建工具
本项目使用 **Vite** 作为前端构建工具，它是新一代前端构建工具，相比传统工具开发和打包效率有明显提升，核心能力分为两部分：
- 开发服务器：基于浏览器原生ES模块实现，提供毫秒级的模块热更新（HMR），开发过程中修改代码后页面可瞬间更新，无需等待长时间编译，大幅提升开发效率。
- 生产构建：内置Rollup打包工具，且已完成生产环境预配置，无需编写复杂的打包配置，即可直接生成优化后的静态资源，方便项目部署。

##### 3.1.2.1.4 状态管理库
本项目采用 **Pinia** 作为全局状态管理工具，它是Vue官方推荐的新一代状态管理库，相比传统方案更简洁、易上手，核心优势如下：
1. **写法简单易理解**：Store的写法与Vue 3组件逻辑高度一致，无需学习复杂的新概念，学生开发者可快速上手，代码可读性更高。
2. **类型支持完善**：自带完整的类型推导，即使使用JavaScript开发也能获得良好的代码自动补全，减少编码错误，提升开发效率。
3. **调试友好**：兼容Vue Devtools调试工具，可直接在浏览器中查看状态变化，方便调试bug、定位问题，降低开发难度。
4. **扩展性强**：可通过插件实现状态本地持久化、事务管理等功能，项目中的用户信息持久化就是基于该特性实现，开发成本极低。
5. **极致轻量化**：包体积仅1KB左右，引入后不会给项目增加额外性能负担，对页面加载速度几乎无影响。
6. **模块化设计**：可创建多个独立的Store（如用户Store、历史记录Store），代码拆分更清晰，多人协作开发时不会互相干扰。

##### 3.1.2.1.5 路由管理
本项目采用 **Vue Router** 作为路由管理工具，它是Vue官方配套的路由库，专为Vue多页面应用设计，核心优势如下：
1. **路由定义直观易懂**：提供简洁的路由定义语法，无论是静态路由还是带参数的动态路由，都能快速配置，学习成本低。
2. **导航控制灵活**：提供导航守卫功能，可拦截页面跳转，项目中“未登录用户无法访问系统首页”的权限控制，就是通过该特性实现，可精准管控页面访问权限。
3. **贴合Vue组件化思想**：采用“路由-组件”的映射模式，一个路由地址对应一个页面组件，与Vue开发理念完全一致，代码逻辑清晰。
4. **多种路由模式可选**：提供History、Hash等多种路由模式，可根据项目的部署环境灵活选择，适配性强。
5. **用户体验优化**：支持路由跳转时的页面滚动位置控制，比如从列表页进入详情页再返回时，可自动回到之前的滚动位置，提升使用体验。

##### 3.1.2.1.6 图标库
本项目选用 **Boxicons** 作为图标库，它是一套开源的现代化图标集，可完全覆盖项目的图标使用需求，核心优势如下：
1. **图标资源丰富**：提供大量常用图标，覆盖导航、按钮、功能提示等所有项目使用场景，无需额外设计图标。
2. **使用方式简单**：可直接通过HTML标签或CSS类名引入，一行代码即可使用，无需复杂配置。
3. **可自定义性强**：可通过CSS直接修改图标的大小、颜色、透明度等样式，完美适配项目的科幻风格设计。
4. **轻量化**：图标体积小，加载速度快，不会影响页面的加载性能。

##### 3.1.2.1.7 图表绘制库
本项目采用 **Chart.js** 作为可视化图表解决方案，用于实现项目中的数据统计可视化功能，核心优势如下：
1. **上手门槛低**：提供高封装度的API，只需简单配置即可生成折线图、柱状图等常用统计图表，无需掌握复杂的Canvas开发知识，适合快速开发。
2. **图表类型丰富**：支持折线图、柱状图、饼图、雷达图等多种常用图表，完全满足项目的数据可视化需求。
3. **响应式适配**：图表可自动根据容器尺寸调整大小，在不同屏幕上都能正常显示，无需手动做多端适配。
4. **定制化程度高**：可自由修改图表的样式、颜色、交互效果，与项目整体设计风格保持统一。
5. **渲染性能好**：即使处理较大数据量的图表，也能保持流畅的渲染和交互，不会出现页面卡顿。

##### 3.1.2.1.8 PDF 生成库
本项目选用 **html2pdf.js** 作为前端PDF生成工具，用于实现检测报告的导出功能，核心优势如下：
1. **集成简单**：提供简洁的API，几行代码即可将页面HTML内容转换为PDF文件，无需后端参与，开发成本极低。
2. **配置灵活**：支持自定义PDF的页面尺寸、边距、图片质量、文件名等参数，可满足项目检测报告的导出规范。
3. **兼容性好**：兼容所有主流现代浏览器，可保证不同用户导出的PDF格式一致。
4. **纯前端生成**：整个PDF生成过程都在用户浏览器中完成，无需调用后端接口，不会给服务器增加额外压力。

#### 3.1.2.2 核心功能模块实现
##### 3.1.2.2.1 网络请求模块
在Web项目开发中，网络请求是前端与后端服务器交互的核心环节。如果每个页面都单独编写请求逻辑，不仅会产生大量重复代码，后期维护也会非常麻烦。因此我们将网络请求相关逻辑封装为独立模块，统一管理所有请求的基础配置、身份认证、错误处理等逻辑，大幅提升代码的可维护性和复用性。具体实现如下：

首先，引入axios（前端最常用的HTTP请求库，基于Promise封装，兼容浏览器和Node.js环境），并创建axios实例，统一设置项目所有请求的基础配置：
```javascript
import axios from 'axios';

// 创建 axios 实例
const service = axios.create({
  baseURL: '/be', // 基础URL，所有接口都以/be开头
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});
```

其次，为实例配置请求拦截器，作用是在每个请求发送到后端前，做统一处理。核心功能是为所有请求自动附加身份认证token，无需在每个请求中手动重复编写：
```javascript
// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从本地存储获取token并添加到请求头
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);
```

随后，配置响应拦截器，统一处理后端返回的结果与异常。比如后端返回数据后，直接提取核心的data内容，简化页面层的代码；如果请求出错，会根据不同的错误状态码做统一处理，例如401未授权时，自动清除本地token，引导用户重新登录：
```javascript
// 响应拦截器
service.interceptors.response.use(
  response => {
    // 直接返回响应数据，简化业务层数据获取逻辑
    return response.data;
  },
  error => {
    // 统一处理错误
    if (error.response) {
      // 服务器返回错误状态码
      switch (error.response.status) {
        case 401:
          // 未授权，清除token并准备跳转到登录页
          localStorage.removeItem('token');
          // 可扩展登录页跳转逻辑
          break;
        case 403:
          console.error('拒绝访问');
          break;
        case 404:
          console.error('请求地址不存在');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        default:
          console.error(`请求错误: ${error.response.status}`);
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('网络错误，无法连接到服务器');
    } else {
      // 请求配置出错
      console.error('请求配置错误:', error.message);
    }
    return Promise.reject(error);
  }
);
```

为了让代码逻辑更清晰，我们按照业务模块拆分，将所有接口请求封装为对应的API函数，分为用户、诊断、历史三大核心业务模块。页面使用时直接导入对应的API函数即可，无需关心底层的请求细节：
```javascript
// 用户相关API
export const userApi = {
  register: (data) => service.post('/user/registry', data),
  login: (data) => service.post('/user/login', data),
  // 更多用户API...
};

// 诊断相关API
export const diagnoseApi = {
  uploadImages: (data) => service.post('/diagnose/task', data),
  getTaskStatus: (taskId) => service.get(`/diagnose/task/status?taskId=${taskId}`),
  // 更多诊断API...
};

// 历史相关API
export const historyApi = {
  getHistoryPage: (data) => service.post('/history/page', data),
  deleteHistory: (taskId) => service.delete(`/history/${taskId}`),
  // 更多历史API...
};

// 统一导出API对象，方便业务层调用
export const api = {
  user: userApi,
  diagnose: diagnoseApi,
  history: historyApi
};
```

通过这套封装方案，我们将网络请求的底层逻辑与业务页面代码完全解耦。后期如果需要修改接口地址或请求配置，只需修改该模块的代码，无需逐个调整页面，大幅提升了代码的可维护性。

最后，将封装好的axios实例与聚合后的API对象导出，供项目其他模块调用：
```javascript
export default service;
export const api = {
  user: userApi,
  diagnose: diagnoseApi,
  history: historyApi
};
```

##### 3.1.2.2.2 数据存储模块
在Web项目中，很多数据需要在多个页面间共享（比如用户登录信息、头像等），同时需要保证页面刷新后数据不丢失，因此需要一套统一的数据存储模块。本项目采用Pinia作为全局状态管理核心，结合浏览器localStorage实现数据持久化存储，确保用户刷新页面后，登录状态和个人信息不会丢失。以下是用户存储模块的核心实现：

```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const username = ref('未命名')
  const phone = ref('')
  const avatar = ref('') 

  // 登录时初始化
  function login(loginPhone) {
    isLoggedIn.value = true
    phone.value = loginPhone
    username.value = '未命名'
    avatar.value = '' // 默认无头像，交由CSS渲染机甲默认图
    saveUserInfo()
  }

  function loadUserInfo() {
    const storedUserInfo = localStorage.getItem('spansUserInfo')
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo)
      username.value = userInfo.username || '未命名'
      phone.value = userInfo.phone || ''
      avatar.value = userInfo.avatar || ''
      isLoggedIn.value = true
    }
  }

  function updateUserInfo(userData) {
    if (userData.username !== undefined) username.value = userData.username
    if (userData.phone !== undefined) phone.value = userData.phone
    if (userData.avatar !== undefined) avatar.value = userData.avatar
    saveUserInfo()
  }

  function saveUserInfo() {
    const userInfo = {
      username: username.value,
      phone: phone.value,
      avatar: avatar.value
    }
    localStorage.setItem('spansUserInfo', JSON.stringify(userInfo))
  }

  return { isLoggedIn, username, phone, avatar, login, loadUserInfo, updateUserInfo }
})
```

该模块中，我们定义了用户登录状态、用户名、手机号、头像等核心信息，同时封装了登录、加载用户信息、更新用户信息、本地存储的相关方法。每次用户信息发生变化时，都会自动同步到localStorage；页面刷新时，会自动从localStorage读取已保存的用户信息，保证数据的连续性。

#### 3.1.2.3 核心页面功能实现
##### 3.1.2.3.1 系统展示页面
我们在用户进入系统前，设计了专属的系统展示页面，主要用于呈现系统的基本信息与整体视觉设计风格，核心功能包含两项：一是提供进入系统的入口，二是展示项目简介信息。
![展示页面](./public/screenshots/show.png)

该页面采用科幻风格设计，加入了丰富的动画效果与视觉装饰元素，提升用户的第一印象与沉浸式体验。核心视觉元素与动画实现如下：

HUD视觉元素：
```html
<!-- HUD 视觉效果 -->
<div class="hud-overlay">
  <!-- 左上角光学传感器 -->
  <div class="hud-visual visual-tl">
    <div class="optical-sensor">
      <div class="optical-ring outer-dashed"></div>
      <div class="optical-ring inner-solid"></div>
      <div class="optical-cross"></div>
      <div class="optical-core"></div>
    </div>
  </div>

  <!-- 右上角陀螺仪 -->
  <div class="hud-visual visual-tr">
    <div class="gyro-stabilizer">
      <div class="gyro-axis axis-x"></div>
      <div class="gyro-axis axis-y"></div>
      <div class="gyro-axis axis-z"></div>
      <div class="gyro-center"></div>
    </div>
  </div>

  <!-- 左下角共振波形 -->
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

  <!-- 右下角瞄准星 -->
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
```

盾牌核心组件：
```html
<!-- 核心机甲装甲金属总成 -->
<div class="shield-assembly">
  <div class="shield-core-glow"></div>

  <!-- 四个象限面板 -->
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

        <!-- 中心文字内容 -->
        <div class="center-content">
          <h2 class="sub-title">WELCOME TO</h2>
          <h1 class="glitch-text" data-text="BridgeEye">BridgeEye</h1>
          <div class="scanning-status-wrapper">
            <span class="status-icon"></span>
            <span class="status-text">SYSTEM STANDBY</span>
            <span class="scanning-dots">...</span>
          </div>
          <h3 class="sys-name">桥梁病害诊断中心</h3>
        </div>
      </div>
    </div>
  </div>
</div>
```

核心动画效果：
```css
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

/* 左上碎片防爆门退场核心动画 */
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

/* 故障文字前置伪元素动态随机横向剪切区动画 */
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

/* 故障文字后置伪元素反向动态剪切区动画 */
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

/* 项目简介页面发光动画 */
@keyframes shine {
  100% {
    left: 100%;
  }
}
```

交互逻辑上，用户点击“项目简介”按钮，会跳转到项目详情页面，展示系统核心功能、操作流程、应用场景等信息；点击“启动系统”按钮，会跳转到登录页面，用户完成身份验证后即可进入系统主界面。
![项目简介页面](./public/screenshots/info.jpg)

##### 3.1.2.3.2 登录页面
登录页面采用终端风格设计，提供了账号密码登录、验证码登录、用户注册、密码重置等完整的身份认证功能，可满足不同用户的使用需求。
![登录页面](./public/screenshots/login.jpg)

在用户输入环节，我们通过正则表达式完成了邮箱格式的合法性校验，同时对输入内容做了安全过滤，限制用户仅可输入合法字符，规避非法输入带来的安全问题：
```javascript
const isValidEmail = computed(() => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(formData.email);
});

// 邮箱输入过滤（只允许字母、数字、@、.、_、%、+、-）
@input="formData.email = formData.email.replace(/[^a-zA-Z0-9@._%+-]/g, ''); clearError()"

// 密码输入过滤（只允许ASCII可打印字符）
@input="formData.password = formData.password.replace(/[^\x21-\x7E]/g, ''); clearError()"
```

用户点击登录按钮后，会先校验输入内容是否完整合法，校验不通过会给出错误提示；校验通过后执行登录逻辑，并根据登录结果（成功/失败）展示对应的动画效果，给用户明确的操作反馈：
```javascript
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
```

系统会根据认证结果展示差异化的视觉动效：
- 登录成功
![登录成功动画](./public/screenshots/login_yes.jpg)
- 登录失败
![登录失败动画](./public/screenshots/login_no.jpg)

##### 3.1.2.3.3 系统主界面
系统主界面是用户操作的核心枢纽，主要分为顶部导航栏和主体内容区两部分。导航栏提供系统各功能模块的入口，主体内容区通过路由展示对应页面内容，首页同时会展示系统核心统计数据。
![主界面](./public/screenshots/home.jpg)

主界面核心实现代码如下：
```vue
<template>
  <div class="main-container">
    <header class="hardcore-navbar">
      <div class="nav-left">
        <div class="logo">
          <span class="bracket">&lt;</span>
          <span class="sys-name">BridgeEye</span>
          <span class="sys-version"></span>
          <span class="bracket">/&gt;</span>
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
    
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="glitch-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

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
```

主界面延续了项目整体的科幻风格设计，顶部导航栏清晰划分了首页、智能诊断、历史档案、用户资料四个核心功能模块，用户点击对应菜单即可快速跳转；导航栏右侧展示了当前登录用户的基本信息，点击可进入用户资料页面。主体内容区通过路由插槽展示对应页面内容，同时加入了页面切换的过渡动画，提升用户使用体验。

##### 3.1.2.3.4 智能检测页面
智能检测页面是系统的核心业务页面，核心功能是支持用户上传桥梁图像文件，提交后完成桥梁病害的智能检测。
![检测页面](./public/screenshots/detect.jpg)

我们在该页面实现了批量文件上传功能，支持点击选择文件和拖拽上传两种方式，用户可一次上传多张图片或zip压缩包，上传前会自动校验文件大小，避免超大文件导致上传失败：
```javascript
// 基本状态管理
const fileInput = ref(null);
const isDragging = ref(false);       
const status = ref('idle');          
const uploadedFiles = ref([]);       
//文件上传触发
const triggerFileInput = () => { 
  if (status.value === 'idle') fileInput.value.click(); 
};
//拖拽处理
const handleDrop = (e) => { 
  isDragging.value = false; 
  if (status.value !== 'idle') return; 
  if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files); 
};
//文件选择处理
const handleFileSelect = (e) => { 
  if (e.target.files.length > 0) processFiles(e.target.files); 
  e.target.value = ''; 
};
//文件处理
const processFiles = (files) => {
  const maxSize = 50 * 1024 * 1024;
  Array.from(files).forEach(file => {
    if (file.size > maxSize) return alert(`SYSTEM_WARN: 文件 ${file.name} 超过 50MB。`);
    if (!uploadedFiles.value.some(f => f.name === file.name)) uploadedFiles.value.push(file);
  });
};
//文件大小格式化
const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
//文件分析开始
const startAnalysis = () => {
  if (uploadedFiles.value.length === 0 || status.value !== 'idle') return;
  status.value = 'analyzing';
  
  analyzeTimer = setTimeout(() => {
    if (isLeaving.value) return;
    status.value = 'success';
    successTimer = setTimeout(() => { openReportModal(); }, 1200);
  }, 3000);
};
```

用户上传文件并点击“开始分析”后，系统会提交检测任务，检测完成后自动生成标准化检测报告，展示检测结果、病害类型、风险等级等核心信息。
![检测报告](./public/screenshots/report.jpg)

检测报告页面主要分为三个核心功能模块，具体实现如下：

1. 影像观测模块：用户可轮播查看所有上传的检测图片，支持图片放大、缩小、拖拽平移，方便用户查看病害细节
![影像观测](./public/screenshots/pic.jpg)
```javascript
// 图片轮播控制
const currentImageIndex = ref(0);

const nextImage = () => { 
  if (currentImageIndex.value < resultImages.value.length - 1) currentImageIndex.value++; 
  else currentImageIndex.value = 0; 
};

const prevImage = () => { 
  if (currentImageIndex.value > 0) currentImageIndex.value--; 
  else currentImageIndex.value = resultImages.value.length - 1; 
};

const setCurrentImage = (idx) => { 
  currentImageIndex.value = idx; 
};

// 图片缩放功能
const showZoomModal = ref(false);
const zoomedImageUrl = ref('');

// 变换状态
const zoomScale = ref(1);
const panX = ref(0);
const panY = ref(0);

// 拖拽控制变量
const isPanning = ref(false);
let startMouseX = 0;
let startMouseY = 0;
let initialPanX = 0;
let initialPanY = 0;

const openZoomModal = (url) => {
    zoomedImageUrl.value = url;
    showZoomModal.value = true;
    resetZoom();
};

const closeZoomModal = () => {
    showZoomModal.value = false;
    zoomedImageUrl.value = '';
    stopPan();
};

const resetZoom = () => {
    zoomScale.value = 1;
    panX.value = 0;
    panY.value = 0;
};

// 滚轮缩放事件
const handleZoomWheel = (e) => {
    // 缩放灵敏度
    const zoomSensitivity = 0.0015;
    const delta = -e.deltaY * zoomSensitivity;
    let newScale = zoomScale.value + delta;
    
    // 限制缩放比例范围 10% - 800%
    newScale = Math.max(0.1, Math.min(newScale, 8));
    zoomScale.value = newScale;
};

// 开始拖拽
const startPan = (e) => {
    isPanning.value = true;
    startMouseX = e.clientX;
    startMouseY = e.clientY;
    initialPanX = panX.value;
    initialPanY = panY.value;
    window.addEventListener('mousemove', onPan);
    window.addEventListener('mouseup', stopPan);
};

// 拖拽中
const onPan = (e) => {
    if (!isPanning.value) return;
    panX.value = initialPanX + (e.clientX - startMouseX);
    panY.value = initialPanY + (e.clientY - startMouseY);
};

// 停止拖拽
const stopPan = () => {
    isPanning.value = false;
    window.removeEventListener('mousemove', onPan);
    window.removeEventListener('mouseup', stopPan);
};
```

2. AI分析报告模块：可切换查看AI生成的病害检测分析报告，展示每张图片的病害类型、风险等级、检测结果等详细信息
![AI报告](./public/screenshots/AI.jpg)
```javascript
// AI 报告状态
const showAiSummary = ref(false);

// 切换 AI 报告显示
const toggleAiSummary = () => {
  showAiSummary.value = !showAiSummary.value;
};

// 当前图片数据计算
const currentImageData = computed(() => resultImages.value[currentImageIndex.value] || null);
```

3. 报告导出模块：用户可将检测报告导出为PDF文件保存到本地，通过html2pdf.js实现，支持自定义PDF格式与质量
![导出报告](./public/screenshots/file.jpg)
```javascript
// 导出状态
const isExporting = ref(false);

// PDF 导出
const downloadPDF = async () => {
  if (isExporting.value) return;
  isExporting.value = true;
  
  setTimeout(() => {
    const element = document.getElementById('pdf-pure-template');
    const opt = {
      margin:       10,
      filename:     `BridgeEye_Diagnostic_Report_${new Date().getTime()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#020810', windowWidth: 800 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      isExporting.value = false;
    }).catch(err => {
      console.error('PDF Generation Error:', err);
      isExporting.value = false;
    });

  }, 800); 
};
```

##### 3.1.2.3.5 历史记录页面
历史记录页面主要用于管理用户所有的历史检测任务，用户可在该页面查看全部历史检测记录，点击单条记录可查看完整检测报告，也可删除不需要的历史记录。
![历史记录](./public/screenshots/history.jpg)

每条历史记录展开后的详情页面，与检测报告页面功能完全一致，此处不重复赘述。历史记录管理的核心实现代码如下：
```javascript
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import html2pdf from 'html2pdf.js'
import { useHistoryStore } from '@/stores/history'

// 状态管理
const historyStore = useHistoryStore()
const selectedIds = ref([])
const selectAll = ref(false)

// HUD Report (查看报告详情)相关状态
const showReportModal = ref(false)
const selectedRecord = ref(null)
const showAiSummary = ref(false)
const currentImageIndex = ref(0)
const resultImages = ref([])
const isExporting = ref(false)

// 动态获取当前活动图片的数据（支持独立展示）
const currentImageData = computed(() => {
  return resultImages.value[currentImageIndex.value] || null;
});

// 样式动态计算
const riskScoreClass = computed(() => {
    const score = currentImageData.value?.reportData?.risk_score || 0;
    if (score >= 80) return 'text-red';
    if (score >= 60) return 'text-orange';
    return 'text-green';
});

// 数据转换 Helper
const getClassName = (c) => ({ crack: '裂缝', efflorescence: '泛碱', 'exposed rebar': '钢筋裸露', spalling: '剥落' }[c] || c)

// 初始化时从本地加载记录
onMounted(() => {
  historyStore.loadHistoryRecords()
})

// 清理事件监听
onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onPan)
  window.removeEventListener('mouseup', stopPan)
})
```

##### 3.1.2.3.6 用户资料页面
用户资料页面主要用于展示和管理当前登录用户的个人信息，用户可在该页面修改用户名、手机号、头像等个人资料。
![用户资料](./public/screenshots/system.jpg)

该页面的核心实现代码如下：
```javascript
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
```

该页面实现了头像的本地上传与预览功能，用户选择图片后，会转换为Base64格式保存到本地存储，同时同步更新到全局用户状态；用户修改个人信息后，会实时同步到全局状态与本地存储，保证整个系统的用户信息一致性。
```
