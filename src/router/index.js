import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'

const router = createRouter({
  // 使用 HTML5 的 History 路由模式，URL 更加美观（没有 # 号）
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // 访问根目录时，默认重定向到登录页
      path: '/',
      name: 'home',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: '系统登录 | NEXUS SYSTEM' // 可以在这里配置页面标题
      }
    }]
})

export default router