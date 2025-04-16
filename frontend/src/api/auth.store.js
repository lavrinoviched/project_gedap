import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, logout, getMe } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)

  const loginUser = async (credentials) => {
    isLoading.value = true
    try {
      const response = await login(credentials)
      user.value = response.data.user
      isAuthenticated.value = true
      return response
    } finally {
      isLoading.value = false
    }
  }

  const logoutUser = async () => {
    await logout()
    user.value = null
    isAuthenticated.value = false
  }

  const fetchUser = async () => {
    try {
      const response = await getMe()
      user.value = response.data.user
      isAuthenticated.value = true
      return response
    } catch (error) {
      user.value = null
      isAuthenticated.value = false
      throw error
    }
  }

  // Проверка роли пользователя
  const isAdmin = computed(() => user.value?.role === 'admin')

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    loginUser,
    logoutUser,
    fetchUser
  }
})