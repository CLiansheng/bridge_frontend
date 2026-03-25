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