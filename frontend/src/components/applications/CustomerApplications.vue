<template>
    <div class="customer-applications">
      <div class="section-header">
        <h2><i class="fas fa-user-tie"></i> Заявки от заказчиков</h2>
        <div class="actions">
          <button class="refresh-btn" @click="loadApplications">
            <i class="fas fa-sync-alt"></i> Обновить
          </button>
        </div>
      </div>
  
      <div class="filters">
        <div class="filter-group">
          <label>Статус:</label>
          <select v-model="filters.status" class="filter-select">
            <option value="all">Все</option>
            <option value="pending">На рассмотрении</option>
            <option value="approved">Одобренные</option>
            <option value="rejected">Отклоненные</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Дата:</label>
          <select v-model="filters.date" class="filter-select">
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
          </select>
        </div>
      </div>
  
      <div class="applications-list">
        <div v-if="loading" class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i> Загрузка...
        </div>
        
        <div v-else-if="applications.length === 0" class="empty-message">
          Нет заявок для отображения
        </div>
        
        <div v-else class="application-item" v-for="app in filteredApplications" :key="app.id">
          <div class="application-main">
            <div class="application-header">
              <h3>{{ app.companyName || 'Без названия' }}</h3>
              <span class="application-status" :class="app.status">{{ app.statusLabel }}</span>
            </div>
            
            <div class="application-meta">
              <div class="meta-item">
                <i class="fas fa-user"></i>
                <span>Контактное лицо: {{ app.contactPerson }}</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-phone"></i>
                <span>Телефон: {{ app.phone }}</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-envelope"></i>
                <span>Email: {{ app.email }}</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-calendar-alt"></i>
                <span>Дата подачи: {{ formatDate(app.createdAt) }}</span>
              </div>
            </div>
            
            <div class="application-description">
              <p><strong>Описание проекта/потребности:</strong> {{ app.projectDescription }}</p>
            </div>
            
            <div class="application-budget" v-if="app.budget">
              <p><strong>Бюджет:</strong> {{ formatBudget(app.budget) }}</p>
            </div>
          </div>
          
          <div class="application-actions" v-if="app.status === 'pending'">
            <button class="details-btn" @click="showDetails(app.id)">
    <i class="fas fa-info-circle"></i> Подробнее
  </button>
            <button class="approve-btn" @click="approveApplication(app.id)">
              <i class="fas fa-check"></i> Одобрить
            </button>
            <button class="reject-btn" @click="rejectApplication(app.id)">
              <i class="fas fa-times"></i> Отклонить
            </button>
          </div>
        </div>
      </div>
      
      <div class="pagination" v-if="applications.length > 0">
        <button :disabled="currentPage === 1" @click="prevPage">
          <i class="fas fa-chevron-left"></i> Назад
        </button>
        <span>Страница {{ currentPage }} из {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="nextPage">
          Вперед <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useToast } from 'vue-toastification';
  import { getApplications } from '../../api/applications.api';
  
  const toast = useToast();
  
  const filters = ref({
    status: 'all',
    date: 'newest'
  });
  
  const loading = ref(true);
  const currentPage = ref(1);
  const itemsPerPage = 5;

  const applications = ref([
  {
    id: 1,
    companyName: 'ООО ТехноПром',
    contactPerson: 'Иванов Иван Иванович',
    phone: '+7 (123) 456-78-90',
    email: 'ivanov@techprom.ru',
    projectDescription: 'Разработка CRM-системы для управления продажами с интеграцией с 1С и мобильным приложением',
    status: 'pending',
    statusLabel: 'На рассмотрении',
    createdAt: '2023-05-15T10:30:00Z'
  },
  {
    id: 2,
    companyName: 'Стартап Инновации',
    contactPerson: 'Петрова Мария Сергеевна',
    phone: '+7 (987) 654-32-10',
    email: 'petrova@innov.ru',
    projectDescription: 'Создание MVP мобильного приложения для доставки еды с функцией рекомендаций',
    budget: 800000,
    status: 'approved',
    statusLabel: 'Одобрена',
    createdAt: '2023-05-10T14:45:00Z',
    notes: 'Заявка одобрена, ожидается подписание договор'
  }
]);
  
  const loadApplications = async () => {
    loading.value = true;
    try {
      const response = await getApplications('customers');
      applications.value = response.data || [];
    } catch (error) {
      toast.error('Ошибка при загрузке заявок');
      console.error(error);
    } finally {
      loading.value = false;
    }
  };
  
   // Фильтрация заявок
   const filteredApplications = computed(() => {
    let result = [...applications.value];
    
    // Фильтр по статусу
    if (filters.value.status !== 'all') {
      result = result.filter(app => app.status === filters.value.status);
    }
    
    // Сортировка по дате
    if (filters.value.date === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    
    // Пагинация
    const start = (currentPage.value - 1) * itemsPerPage;
    return result.slice(start, start + itemsPerPage);
  });
  
  const totalPages = computed(() => {
    return Math.ceil(applications.value.length / itemsPerPage);
  });
  
  // Действия
  const approveApplication = (id) => {
    const app = applications.value.find(a => a.id === id);
    if (app) {
      app.status = 'approved';
      app.statusLabel = 'Одобрена';
      app.notes = 'Заявка одобрена администратором';
      toast.success(`Заявка команды "${app.teamName}" одобрена`);
    }
  };
  
  const rejectApplication = (id) => {
    const app = applications.value.find(a => a.id === id);
    if (app) {
      app.status = 'rejected';
      app.statusLabel = 'Отклонена';
      app.notes = 'Заявка отклонена администратором';
      toast.warning(`Заявка команды "${app.teamName}" отклонена`);
    }
  };

  const showDetails = (id) => {
  const app = applications.value.find(a => a.id === id);
  if (app) {
    // Можно открыть модальное окно или перейти на отдельную страницу
    toast.info(`Открыты подробности заявки: ${app.teamName || app.projectName || app.title || app.companyName}`);
  }
};
  
  const formatBudget = (amount) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount);
  };
  
  onMounted(() => {
    loadApplications();
  });
  </script>
  
  <style scoped>
  .team-applications {
    padding: 1rem;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #eee;
  }
  
  .section-header h2 {
    margin: 0;
    color: #1a237e;
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
  
  .refresh-btn {
    background: #1a237e;
    color: white;
    border: none;
    padding: 0.6rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .refresh-btn:hover {
    background: #283593;
  }
  
  .filters {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
  }
  
  .filter-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .filter-group label {
    font-weight: 500;
    color: #555;
  }
  
  .filter-select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: white;
  }
  
  .applications-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .application-item {
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 1.5rem;
    transition: all 0.3s ease;
  }
  
  .application-item:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .application-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .application-header h3 {
    margin: 0;
    color: #1a237e;
    font-size: 1.2rem;
  }
  
  .application-status {
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  .application-status.pending {
    background: #fff3e0;
    color: #ff6d00;
  }
  
  .application-status.approved {
    background: #e8f5e9;
    color: #2e7d32;
  }
  
  .application-status.rejected {
    background: #ffebee;
    color: #c62828;
  }
  
  .application-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 1rem;
    color: #555;
    font-size: 0.9rem;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .meta-item i {
    color: #5c6bc0;
  }
  
  .application-description {
    margin-bottom: 1rem;
    color: #333;
    line-height: 1.6;
  }
  
  .team-members {
    margin: 1rem 0;
  }
  
  .team-members h4 {
    margin: 0 0 0.5rem 0;
    color: #555;
    font-size: 1rem;
  }
  
  .team-members ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .team-members li {
    padding: 0.3rem 0;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .application-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
  }
  
  .approve-btn, .reject-btn {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .approve-btn {
    background: #e8f5e9;
    color: #2e7d32;
  }
  
  .approve-btn:hover {
    background: #c8e6c9;
  }
  
  .reject-btn {
    background: #ffebee;
    color: #c62828;
  }
  
  .reject-btn:hover {
    background: #ffcdd2;
  }
  
  .application-notes {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px dashed #ddd;
    color: #666;
    font-size: 0.9rem;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #eee;
  }
  
  .pagination button {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .pagination button:hover:not(:disabled) {
    background: #1a237e;
    color: white;
    border-color: #1a237e;
  }
  
  .loading-spinner {
    text-align: center;
    padding: 2rem;
    color: #555;
    font-size: 1.1rem;
  }
  
  .loading-spinner i {
    margin-right: 0.5rem;
  }
  
  .empty-message {
    text-align: center;
    padding: 2rem;
    color: #999;
    font-style: italic;
  }

  .details-btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #e3f2fd;
  color: #1565c0;
}

.details-btn:hover {
  background: #bbdefb;
}
  
  /* Адаптивность */
  @media (max-width: 768px) {
    .filters {
      flex-direction: column;
      gap: 1rem;
    }
    
    .application-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    .application-actions {
      flex-direction: column;
    }
    
    .approve-btn, .reject-btn {
      width: 100%;
      justify-content: center;
    }
  }
  </style>