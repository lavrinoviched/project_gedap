<template>
  <div class="project-applications">
    <div class="section-header">
      <h2><i class="fas fa-project-diagram"></i> Заявки на проекты</h2>
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
    </div>

    <div class="applications-list">
      <div v-if="loading" class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i> Загрузка...
      </div>
      
      <div v-else-if="filteredApplications.length === 0" class="empty-message">
        Нет заявок на проекты
      </div>
      
      <div v-else class="application-item" v-for="app in filteredApplications" :key="app.id">
        <div class="application-main">
          <div class="application-header">
            <h3>{{ app.title }}</h3>
            <span class="application-status" :class="app.status">
              {{ getStatusLabel(app.status) }}
            </span>
          </div>
          
          <div class="application-meta">
            <div class="meta-item">
              <i class="fas fa-layer-group"></i>
              <span>Категория: {{ app.category }}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-bolt"></i>
              <span>Сложность: {{ app.complexity }}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-calendar-alt"></i>
              <span>Дедлайн: {{ formatDate(app.deadline) }}</span>
            </div>
          </div>
          
          <div class="application-description">
            <p>{{ app.description }}</p>
          </div>
          
          <div class="application-technologies" v-if="app.technologies?.length">
            <p><strong>Технологии:</strong> {{ app.technologies.join(', ') }}</p>
          </div>
        </div>
        
        <div class="application-actions" v-if="app.status === 'pending'">
          <button class="details-btn" @click="showDetails(app)">
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
    
    <div class="pagination" v-if="filteredApplications.length > 0">
      <button :disabled="currentPage === 1" @click="prevPage">
        <i class="fas fa-chevron-left"></i> Назад
      </button>
      <span>Страница {{ currentPage }} из {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="nextPage">
        Вперед <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- Диалог подробностей -->
    <q-dialog v-model="showDetailsDialog">
      <q-card class="dialog-card" style="width: 700px; max-width: 90vw;">
        <q-card-section class="dialog-header">
          <div class="text-h6">{{ selectedApplication?.title }}</div>
          <q-btn flat round dense icon="close" class="float-right" v-close-popup />
        </q-card-section>

        <q-card-section class="dialog-body">
          <div class="section">
            <div class="text-subtitle1 q-mb-sm">Описание проекта</div>
            <div class="text-body2 q-mb-md">
              {{ selectedApplication?.description }}
            </div>
          </div>

          <div class="section">
            <div class="text-subtitle1 q-mb-sm">Детали проекта</div>
            <div class="info-grid">
              <div class="info-item">
                <strong>Категория:</strong> {{ selectedApplication?.category }}
              </div>
              <div class="info-item">
                <strong>Сложность:</strong> {{ selectedApplication?.complexity }}
              </div>
              <div class="info-item">
                <strong>Технологии:</strong> {{ selectedApplication?.technologies?.join(', ') }}
              </div>
              <div class="info-item">
                <strong>Дедлайн:</strong> {{ formatDate(selectedApplication?.deadline) }}
              </div>
              <div class="info-item">
                <strong>Дата подачи:</strong> {{ formatDate(selectedApplication?.createdAt) }}
              </div>
              <div class="info-item">
                <strong>Статус:</strong> 
                <q-badge :color="getStatusColor(selectedApplication?.status)">
                  {{ getStatusLabel(selectedApplication?.status) }}
                </q-badge>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="dialog-actions">
          <q-btn 
            v-if="selectedApplication?.status === 'pending'"
            flat 
            label="Одобрить" 
            color="positive" 
            @click="approveApplication(selectedApplication?.id)" 
          />
          <q-btn 
            v-if="selectedApplication?.status === 'pending'"
            flat 
            label="Отклонить" 
            color="negative" 
            @click="rejectApplication(selectedApplication?.id)" 
          />
          <q-btn flat label="Закрыть" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
  
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';

interface ProjectApplication {
  id: number;
  title: string;
  category: string;
  complexity: string;
  description: string;
  technologies: string[];
  deadline: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const $q = useQuasar();

// Состояния
const applications = ref<ProjectApplication[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;
const showDetailsDialog = ref(false);
const selectedApplication = ref<ProjectApplication | null>(null);

const filters = ref({
  status: 'all',
});

// Методы
const loadApplications = async () => {
  loading.value = true;
  try {
    const response = await api.get('/project-applications');
    applications.value = response.data;
  } catch (error) {
    console.error('Ошибка загрузки заявок:', error);
    $q.notify({
      type: 'negative',
      message: 'Ошибка при загрузке заявок',
    });
  } finally {
    loading.value = false;
  }
};

const approveApplication = async (id?: number) => {
  if (!id) return;
  
  try {
    await api.patch(`/project-applications/${id}/status`, { status: 'approved' });
    $q.notify({
      type: 'positive',
      message: 'Проект одобрен и добавлен в галерею',
    });
    loadApplications();
    showDetailsDialog.value = false;
  } catch (error) {
    console.error('Ошибка одобрения:', error);
    $q.notify({
      type: 'negative',
      message: 'Ошибка при одобрении проекта',
    });
  }
};

const rejectApplication = async (id?: number) => {
  if (!id) return;
  
  try {
    await api.patch(`/project-applications/${id}/status`, { status: 'rejected' });
    $q.notify({
      type: 'positive',
      message: 'Проект отклонен',
    });
    loadApplications();
    showDetailsDialog.value = false;
  } catch (error) {
    console.error('Ошибка отклонения:', error);
    $q.notify({
      type: 'negative',
      message: 'Ошибка при отклонении проекта',
    });
  }
};

const showDetails = (app: ProjectApplication) => {
  selectedApplication.value = app;
  showDetailsDialog.value = true;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('ru-RU');
};

const getStatusLabel = (status?: string) => {
  switch (status) {
    case 'pending': return 'На рассмотрении';
    case 'approved': return 'Одобрен';
    case 'rejected': return 'Отклонен';
    default: return '';
  }
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'pending': return 'orange';
    case 'approved': return 'green';
    case 'rejected': return 'red';
    default: return 'gray';
  }
};

// Вычисляемые свойства
const filteredApplications = computed(() => {
  let result = [...applications.value];
  
  if (filters.value.status !== 'all') {
    result = result.filter(app => app.status === filters.value.status);
  }
  
  const start = (currentPage.value - 1) * itemsPerPage;
  return result.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(applications.value.length / itemsPerPage);
});

// Пагинация
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// Инициализация
onMounted(() => {
  loadApplications();
});
</script>

  
  <style scoped>
  /* Стили идентичны IdeaApplications.vue */
  .project-applications {
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
  
  .application-technologies {
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

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
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

      .info-grid {
    grid-template-columns: 1fr;
  }
  }
  </style>