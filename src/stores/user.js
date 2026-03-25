import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const username = ref('')
  const phone = ref('')
  const avatar = ref('')

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
      phone.value = userInfo.phone || '138****8888'
      avatar.value = userInfo.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bridge'
      isLoggedIn.value = true
    } else {
      // 默认用户信息
      username.value = '专家用户'
      phone.value = '138****8888'
      avatar.value = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bridge'
      isLoggedIn.value = true
      saveUserInfo()
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
    localStorage.setItem('bridgeUserInfo', JSON.stringify(userInfo))
  }

  return { 
    isLoggedIn, 
    username, 
    phone, 
    avatar, 
    loadUserInfo, 
    updateUserInfo 
  }
})