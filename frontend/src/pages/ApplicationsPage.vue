<template>
    <div class="applications-container">
      <div class="applications-card">
        <!-- Заголовок и навигация -->
        <div class="section-header">
        <h1>
          <i class="fas fa-clipboard-list"></i> Панель заявок
        </h1>
        <button 
          class="close-btn" 
          @click="goToProfile" 
          aria-label="Закрыть"
          title="Вернуться в личный кабинет">
    
          ×
        </button>
      </div>
  
        <!-- Навигация по типам заявок -->
        <div class="applications-nav">
          <router-link 
            v-for="tab in tabs" 
            :key="tab.path" 
            :to="'/admin/applications/' + tab.path"
            class="nav-tab"
            active-class="active"
          >
            <i :class="tab.icon"></i>
            {{ tab.title }}
            <span v-if="tab.count > 0" class="badge">{{ tab.count }}</span>
          </router-link>
        </div>
  
        <!-- Контент заявок -->
        <div class="applications-content">
          <router-view />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useMainStore } from '../stores/main-store';
  import { useToast } from 'vue-toastification';
  
  const toast = useToast();
  const mainStore = useMainStore();
  const router = useRouter();

  // Функция возврата в ЛК
  const goToProfile = () => {
  router.push('/profile'); // Или ваш путь к UserProfile.vue

};
  
  // Проверка прав администратора
  const isAdmin = computed(() => mainStore.isAdmin());
  
  // Данные для навигации
  const tabs = ref([
    { path: 'teams', title: 'Заявки команд', icon: 'fas fa-users', count: 0 },
    { path: 'projects', title: 'Заявки проектов', icon: 'fas fa-project-diagram', count: 0 },
    { path: 'ideas', title: 'Идеи проектов', icon: 'fas fa-lightbulb', count: 0 },
    { path: 'customers', title: 'Заявки заказчиков', icon: 'fas fa-user-tie', count: 0 }
  ]);
  
  // Загрузка количества заявок
  const loadApplicationsCount = async () => {
    try {
      // Здесь будет запрос к API для получения количества заявок
      // Пока используем моковые данные
      tabs.value = tabs.value.map(tab => ({
        ...tab,
        count: Math.floor(Math.random() * 10) // Случайное число для демонстрации
      }));
    } catch (error) {
      toast.error('Ошибка при загрузке количества заявок');
      console.error(error);
    }
  };
  
  onMounted(() => {
    if (!isAdmin.value) {
      router.push('/');
      toast.warning('У вас нет прав доступа к этой странице');
      return;
    }
    loadApplicationsCount();
  });
  </script>
  
  <style scoped>
  .applications-container {
    background-color: #f5f7fa;
    min-height: 100vh;
    padding: 2rem;
    display: flex;
    justify-content: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .applications-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 50, 0.1);
    width: 100%;
    max-width: 1200px;
    overflow: hidden;
  }
  
  .section-header {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.section-header h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 1rem;
}
  
  .applications-nav {
    display: flex;
    border-bottom: 1px solid #eee;
    padding: 0 2rem;
    background: #f8f9fa;
  }
  
  .nav-tab {
    padding: 1rem 1.5rem;
    text-decoration: none;
    color: #555;
    font-weight: 500;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    border-bottom: 3px solid transparent;
    transition: all 0.3s ease;
  }
  
  .nav-tab:hover {
    color: #1a237e;
    background: #f0f2f5;
  }
  
  .nav-tab.active {
    color: #1a237e;
    border-bottom-color: #1a237e;
    background: #f0f2f5;
  }
  
  .badge {
    background: #f44336;
    color: white;
    border-radius: 10px;
    padding: 0.2rem 0.5rem;
    font-size: 0.8rem;
    margin-left: 0.5rem;
  }
  
  .applications-content {
    padding: 2rem;
  }

  .header-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: white;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #ff0000;
  transform: translateY(-50%) scale(1.2);
}


  
  /* Адаптивность */
  @media (max-width: 768px) {
    .applications-container {
      padding: 1rem;
    }
    
    .applications-nav {
      flex-direction: column;
      padding: 0;
    }
    
    .nav-tab {
      padding: 1rem;
      border-bottom: 1px solid #eee;
      border-left: 4px solid transparent;
    }
    
    .nav-tab.active {
      border-bottom: 1px solid #eee;
      border-left: 4px solid #1a237e;
    } 
    .close-btn {
    right: 1rem;
    font-size: 1.8rem;
  }
}

  </style>