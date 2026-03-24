import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const username = ref('')
  const email = ref('')
  const phone = ref('')
  const position = ref('')
  const currentReport = ref(null)

  function login(name) {
    isLoggedIn.value = true
    username.value = name
  }

  function setCurrentReport(report) {
    currentReport.value = report
  }

  function loadUserInfo() {
    const storedUserInfo = localStorage.getItem('bridgeUserInfo')
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo)
      username.value = userInfo.username || '专家用户'
      email.value = userInfo.email || 'expert@nexus-bridge.com'
      phone.value = userInfo.phone || '138****8888'
      position.value = userInfo.position || '系统管理员 / 高级桥梁工程师'
      isLoggedIn.value = true
    } else {
      // 默认用户信息
      username.value = '专家用户'
      email.value = 'expert@nexus-bridge.com'
      phone.value = '138****8888'
      position.value = '系统管理员 / 高级桥梁工程师'
      isLoggedIn.value = true
      saveUserInfo()
    }
  }

  function updateUserInfo(userData) {
    if (userData.username !== undefined) username.value = userData.username
    if (userData.email !== undefined) email.value = userData.email
    if (userData.phone !== undefined) phone.value = userData.phone
    if (userData.position !== undefined) position.value = userData.position
    saveUserInfo()
  }

  function saveUserInfo() {
    const userInfo = {
      username: username.value,
      email: email.value,
      phone: phone.value,
      position: position.value
    }
    localStorage.setItem('bridgeUserInfo', JSON.stringify(userInfo))
  }

  return { 
    isLoggedIn, 
    username, 
    email, 
    phone, 
    position, 
    currentReport, 
    login, 
    setCurrentReport, 
    loadUserInfo, 
    updateUserInfo 
  }
})