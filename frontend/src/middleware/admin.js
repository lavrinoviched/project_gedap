export default defineNuxtRouteMiddleware(() => {
    const authStore = useAuthStore()
    
    if (!authStore.isAuthenticated) {
      return navigateTo('/login')
    }
    
    if (!authStore.isAdmin) {
      return abortNavigation({
        statusCode: 403,
        message: 'Только для администраторов!'
      })
    }
  })