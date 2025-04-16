<script setup>
const auth = useAuthStore()
const router = useRouter()

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div :style="{
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  }">
    <!-- Боковая панель -->
    <div :style="{
      width: '250px',
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '20px 0',
      display: 'flex',
      flexDirection: 'column'
    }">
      <div :style="{
        padding: '0 20px 20px',
        borderBottom: '1px solid #34495e',
        marginBottom: '20px'
      }">
        <NuxtLink to="/">
          <img 
            src="/logo.png" 
            alt="Логотип"
            :style="{ maxWidth: '100%' }"
          >
        </NuxtLink>
      </div>

      <nav :style="{ flexGrow: '1' }">
        <NuxtLink 
          to="/admin" 
          :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 20px',
            color: '#ecf0f1',
            textDecoration: 'none',
            transition: 'background 0.3s'
          }"
        >
          <Icon name="mdi:view-dashboard" /> Главная
        </NuxtLink>
        <NuxtLink 
          to="/admin/users"
          :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 20px',
            color: '#ecf0f1',
            textDecoration: 'none',
            transition: 'background 0.3s'
          }"
        >
          <Icon name="mdi:account-group" /> Пользователи
        </NuxtLink>
      </nav>

      <div 
        @click="logout"
        :style="{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 20px',
          cursor: 'pointer',
          transition: 'background 0.3s'
        }"
      >
        <Icon name="mdi:logout" /> Выйти
      </div>
    </div>

    <!-- Основной контент -->
    <div :style="{ flexGrow: '1' }">
      <header :style="{
        backgroundColor: 'white',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }">
        <h1 :style="{ margin: '0', fontSize: '1.5rem' }">Админ-панель</h1>
        <div :style="{ display: 'flex', alignItems: 'center', gap: '10px' }">
          <span>{{ auth.user?.email }}</span>
          <span :style="{
            backgroundColor: '#e74c3c',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: '12px'
          }">ADMIN</span>
        </div>
      </header>

      <div :style="{ padding: '20px' }">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.router-link-active {
  background-color: #34495e;
  border-left: 3px solid #3498db;
}
.router-link-active:hover {
  background-color: #3d566e;
}
</style>