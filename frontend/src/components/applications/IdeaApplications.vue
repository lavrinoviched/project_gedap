<template>
    <div class="idea-applications">
      <div class="section-header">
        <h2><i class="fas fa-lightbulb"></i> Идеи проектов</h2>
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
          Нет идей для отображения
        </div>
        
        <div v-else class="application-item" v-for="app in filteredApplications" :key="app.id">
          <div class="application-main">
            <div class="application-header">
              <h3>{{ app.title }}</h3>
              <span class="application-status" :class="app.status">{{ app.statusLabel }}</span>
            </div>
            
            <div class="application-meta">
              <div class="meta-item">
                <i class="fas fa-user"></i>
                <span>Автор: {{ app.authorName }}</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-calendar-alt"></i>
                <span>Дата подачи: {{ formatDate(app.createdAt) }}</span>
              </div>
              <div class="meta-item" v-if="app.tags?.length">
                <i class="fas fa-tags"></i>
                <span>Теги: {{ app.tags.join(', ') }}</span>
              </div>
            </div>
            
            <div class="application-description">
              <p><strong>Описание идеи:</strong> {{ app.description }}</p>
            </div>
            
            <div class="application-details" v-if="app.benefits">
              <p><strong>Польза проекта:</strong> {{ app.benefits }}</p>
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
          
          <div class="application-notes" v-if="app.notes">
            <p><strong>Примечание:</strong> {{ app.notes }}</p>
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
    title: 'Экосистема для удаленных команд',
    authorName: 'Смирнов Алексей',
    description: 'Комплексное решение для управления удаленными командами с инструментами коллаборации, трекингом задач и аналитикой продуктивности',
    status: 'pending',
    statusLabel: 'На рассмотрении',
    createdAt: '2023-05-18T09:15:00Z'
  },
  {
    id: 2,
    title: 'AI-ассистент для пожилых',
    authorName: 'Козлова Елена',
    description: 'Голосовой помощник с простым интерфейсом для помощи пожилым людям в повседневных задачах',
    benefits: 'Улучшение качества жизни пожилых людей, снижение нагрузки на родственников',
    tags: ['искусственный интеллект', 'социальный проект', 'здоровье'],
    status: 'rejected',
    statusLabel: 'Отклонена',
    createdAt: '2023-05-05T16:20:00Z',
    notes: 'Не хватает проработки бизнес-модели'
  }
]);
  
  const loadApplications = async () => {
    loading.value = true;
    try {
      const response = await getApplications('ideas');
      applications.value = response.data || [];
    } catch (error) {
      toast.error('Ошибка при загрузке идей');
      console.error(error);
    } finally {
      loading.value = false;
    }
  };
  
  const filteredApplications = computed(() => {
    let result = [...applications.value];
    
    if (filters.value.status !== 'all') {
      result = result.filter(app => app.status === filters.value.status);
    }
    
    if (filters.value.date === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    
    const start = (currentPage.value - 1) * itemsPerPage;
    return result.slice(start, start + itemsPerPage);
  });
  
  const totalPages = computed(() => {
    return Math.ceil(applications.value.length / itemsPerPage);
  });
  
  const approveApplication = (id) => {
    const app = applications.value.find(a => a.id === id);
    if (app) {
      app.status = 'approved';
      app.statusLabel = 'Одобрена';
      app.notes = 'Идея одобрена администратором';
      toast.success(`Идея "${app.title}" одобрена`);
    }
  };
  
  const rejectApplication = (id) => {
    const app = applications.value.find(a => a.id === id);
    if (app) {
      app.status = 'rejected';
      app.statusLabel = 'Отклонена';
      app.notes = 'Идея отклонена администратором';
      toast.warning(`Идея "${app.title}" отклонена`);
    }
  };

  const showDetails = (id) => {
  const app = applications.value.find(a => a.id === id);
  if (app) {
    // Можно открыть модальное окно или перейти на отдельную страницу
    toast.info(`Открыты подробности заявки: ${app.teamName || app.projectName || app.title || app.companyName}`);
  }
};
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU');
  };
  
  const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
  };
  
  const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
  };
  
  onMounted(() => {
    loadApplications();
  });
  </script>
  
  <style scoped>
  /* Стили идентичны TeamApplications.vue */
  .idea-applications {
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
  
  .application-details {
    margin: 1rem 0;
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