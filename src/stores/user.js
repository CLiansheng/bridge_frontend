import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const username = ref('')
  const email = ref('')
  const phone = ref('')
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
      isLoggedIn.value = true
    } else {
      // 默认用户信息
      username.value = '专家用户'
      email.value = 'expert@nexus-bridge.com'
      phone.value = '138****8888'
      isLoggedIn.value = true
      saveUserInfo()
    }
  }

  function updateUserInfo(userData) {
    if (userData.username) username.value = userData.username
    if (userData.email) email.value = userData.email
    if (userData.phone) phone.value = userData.phone
    saveUserInfo()
  }

  function saveUserInfo() {
    const userInfo = {
      username: username.value,
      email: email.value,
      phone: phone.value
    }
    localStorage.setItem('bridgeUserInfo', JSON.stringify(userInfo))
  }

  return { 
    isLoggedIn, 
    username, 
    email, 
    phone, 
    currentReport, 
    login, 
    setCurrentReport, 
    loadUserInfo, 
    updateUserInfo 
  }
})