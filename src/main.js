import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router' // 引入刚刚配置好的路由实例

// 创建 Vue 应用实例
const app = createApp(App)

// 创建 Pinia 实例
const pinia = createPinia()

// 核心步骤：将 Pinia 和 Router 作为插件安装到 Vue 应用中
app.use(pinia)
app.use(router)

// 挂载应用到 index.html 中的 <div id="app"></div> 节点
// 注意：app.mount 必须放在所有的 app.use 之后！
app.mount('#app')