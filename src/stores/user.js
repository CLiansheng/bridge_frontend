import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const username = ref('')

  function login(name) {
    isLoggedIn.value = true
    username.value = name
  }

  return { isLoggedIn, username, login }
})