<template>
  <div class="profile-container">
    <div class="profile-card">
      <!-- Аватар и основная информация -->
      <div class="avatar-section">
        <div class="avatar-wrapper">
    <img
      :src="avatarUrl"
      alt="Аватар"
      class="avatar"
      @error="avatarUrl = defaultAvatar"
    >
    <input
      type="file"
      ref="fileInput"
      @change="handleAvatarChange"
      accept="image/*"
      style="display: none"
    >
    <button
      class="avatar-edit-btn"
      @click="fileInput.click()"
    >
      <i class="fas fa-camera"></i>
    </button>
    <button
      v-if="avatarUrl && avatarUrl !== defaultAvatar"
      class="avatar-remove-btn"
      @click="removeAvatar"
    >
      <i class="fas fa-trash"></i>
    </button>
    <div v-if="avatarUploading" class="upload-progress">
      <i class="fas fa-spinner fa-spin"></i>
    </div>
  </div>
        <h1 class="profile-title">{{ user.fullName }}</h1>
        <p class="profile-role">{{ user.role }}</p>
      </div>

      <!-- Личные данные -->
      <div class="info-section">
        <div class="section-header">
          <h2>Личные данные</h2>
          <button
            class="edit-toggle-btn"
            @click="toggleEditMode"
            v-tooltip="editMode ? 'Сохранить изменения' : 'Редактировать контакты'"
          >
            <i :class="editMode ? 'fas fa-save' : 'fas fa-edit'"></i>
            {{ editMode ? 'Сохранить' : 'Редактировать' }}
          </button>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <label><i class="fas fa-user-tag"></i> Фамилия</label>
            <input
              v-model="user.lastName"
              :disabled="!editMode"
              class="info-input"
            >
          </div>
          <div class="info-item">
            <label><i class="fas fa-user"></i> Имя</label>
            <input
              v-model="user.firstName"
              :disabled="!editMode"
              class="info-input"
            >
          </div>
          <div class="info-item" v-if="!isAdmin">
            <label><i class="fas fa-users"></i> Группа</label>
            <input
              v-model="user.group"
              disabled
              class="info-input"
            >
          </div>
          <div class="info-item">
            <label><i class="fas fa-envelope"></i> Email</label>
            <input
              v-model="user.email"
              :disabled="!editMode"
              class="info-input"
              type="email"
              placeholder="Введите email"
            >
          </div>
          <div class="info-item">
            <label><i class="fas fa-phone"></i> Телефон</label>
            <input
              v-model="user.phone"
              :disabled="!editMode"
              class="info-input"
              type="tel"
              placeholder="Введите телефон"
            >
          </div>
        </div>
      </div>

      <!-- Секция компетенций (только для обычных пользователей) -->
      <div class="skills-section" v-if="!isAdmin">
        <div class="section-header">
          <h2>Мои компетенции</h2>
          <button 
            class="edit-toggle-btn" 
            @click="toggleSkillsEditMode"
            v-tooltip="editSkillsMode ? 'Сохранить изменения' : 'Редактировать компетенции'"
          >
            <i :class="editSkillsMode ? 'fas fa-save' : 'fas fa-edit'"></i>
            {{ editSkillsMode ? 'Сохранить' : 'Редактировать' }}
          </button>
        </div>

        <div class="skills-grid">
          <div class="skill-item">
            <h3><i class="fas fa-briefcase"></i> Опыт работы</h3>
            <textarea
              v-model="user.experience"
              :disabled="!editSkillsMode"
              class="skill-textarea"
              placeholder="Опишите ваш опыт работы"
            ></textarea>
            
            <!-- Прикрепленные файлы -->
            <div class="attached-files" v-if="user.experienceFiles.length > 0">
              <h4>Прикрепленные файлы:</h4>
              <ul class="files-list">
                <li v-for="(file, index) in user.experienceFiles" :key="index">
                  <div class="file-item">
                    <i :class="getFileIcon(file.type)"></i>
                    <span class="file-name">{{ file.name }}</span>
                    <span class="file-size">({{ formatFileSize(file.size) }})</span>
                    <button 
                      v-if="editSkillsMode"
                      class="remove-file"
                      @click="removeExperienceFile(index)"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                    <a 
                      v-else
                      :href="file.url || '#'"
                      target="_blank"
                      class="view-file"
                    >
                      <i class="fas fa-eye"></i>
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Добавление новых файлов -->
            <div class="experience-files" v-if="editSkillsMode">
              <input 
                type="file" 
                ref="experienceFileInput"
                @change="handleExperienceFileChange"
                multiple
                style="display: none"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              >
              <button 
                class="add-file-btn"
                @click="triggerExperienceFileInput"
              >
                <i class="fas fa-plus"></i> Добавить файлы
              </button>
              <div class="hint">
                Максимальный размер файла: 5MB. Допустимые форматы: PDF, DOC, JPG, PNG
              </div>
            </div>
          </div>
          
          <div class="skill-item">
            <h3><i class="fas fa-code"></i> Технологии</h3>
            <div class="tech-categories">
              <div class="category" v-if="frontendLanguages.length > 0">
                <h4>Frontend</h4>
                <div class="tech-tags">
                  <span 
                    v-for="lang in frontendLanguages" 
                    :key="'front-'+lang"
                    class="tech-tag frontend"
                  >
                    {{ lang }}
                    <button 
                      v-if="editSkillsMode"
                      class="remove-tech"
                      @click="removeLanguage(lang)"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </span>
                </div>
              </div>

              <div class="category" v-if="backendLanguages.length > 0">
                <h4>Backend</h4>
                <div class="tech-tags">
                  <span 
                    v-for="lang in backendLanguages" 
                    :key="'back-'+lang"
                    class="tech-tag backend"
                  >
                    {{ lang }}
                    <button 
                      v-if="editSkillsMode"
                      class="remove-tech"
                      @click="removeLanguage(lang)"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </span>
                </div>
              </div>

              <div class="category" v-if="databaseLanguages.length > 0">
                <h4>Database</h4>
                <div class="tech-tags">
                  <span 
                    v-for="lang in databaseLanguages" 
                    :key="'db-'+lang"
                    class="tech-tag database"
                  >
                    {{ lang }}
                    <button 
                      v-if="editSkillsMode"
                      class="remove-tech"
                      @click="removeLanguage(lang)"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </span>
                </div>
              </div>

              <div class="category" v-if="otherLanguages.length > 0">
                <h4>Другие</h4>
                <div class="tech-tags">
                  <span 
                    v-for="lang in otherLanguages" 
                    :key="'other-'+lang"
                    class="tech-tag other"
                  >
                    {{ lang }}
                    <button 
                      v-if="editSkillsMode"
                      class="remove-tech"
                      @click="removeLanguage(lang)"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <multiselect
              v-if="editSkillsMode"
              v-model="selectedLanguage"
              :options="filteredLanguages"
              :multiple="false"
              :searchable="true"
              placeholder="Начните вводить технологию"
              @select="addLanguage"
              class="add-tech-select"
              :show-labels="false"
              :class="{ 'has-selected': selectedLanguage }"
            >
              <template #option="{ option }">
                <div class="tech-option">
                  <span :class="'tech-badge ' + getTechCategory(option)">{{ option }}</span>
                </div>
              </template>
              <template #noOptions>
                <div class="multiselect-no-options">
                  Все технологии добавлены или не найдены
                </div>
              </template>
            </multiselect>
          </div>
        </div>
      </div>

      <!-- Секция проектов (только для обычных пользователей) -->
      <div class="projects-section" v-if="!isAdmin">
        <div class="section-header">
          <h2><i class="fas fa-project-diagram"></i> Мои проекты</h2>
        </div>
        
        <div class="projects-container">
          <div 
            v-for="(project, index) in portfolio" 
            :key="index"
            class="project-card"
            :class="{'in-progress': project.status === 'В разработке'}"
          >
            <div class="project-main">
              <div class="project-header">
                <h3>{{ project.name }}</h3>
                <div class="project-status">
                  {{ project.status }}
                </div>
              </div>
              
              <div class="project-meta">
                <div class="meta-item">
                  <i class="fas fa-users"></i>
                  <span>{{ project.team }}</span>
                </div>
                <div class="meta-item">
                  <i class="fas fa-user-tie"></i>
                  <span>{{ project.role }}</span>
                </div>
                <div class="meta-item" v-if="project.timeline">
                  <i class="fas fa-calendar-alt"></i>
                  <span>{{ project.timeline }}</span>
                </div>
              </div>
              
              <p class="project-description" v-if="project.description">
                {{ truncateDescription(project.description) }}
              </p>
              
              <div class="project-details" v-if="selectedProject === index">
                <div class="detail-block">
                  <h4><i class="fas fa-info-circle"></i> Описание проекта</h4>
                  <p>{{ project.description }}</p>
                </div>
                
                <div class="detail-block">
                  <h4><i class="fas fa-user-tie"></i> Заказчик</h4>
                  <p>{{ project.customer }}</p>
                </div>
                
                <div class="detail-block">
                  <h4><i class="fas fa-users"></i> Команда</h4>
                  <ul class="team-list">
                    <li v-for="(member, idx) in project.teamMembers" :key="idx">
                      <span class="member-name">{{ member.name }}</span>
                      <span class="member-role">{{ member.role }}</span>
                    </li>
                  </ul>
                </div>
                
                <div class="detail-block" v-if="project.technologies && project.technologies.length">
                  <h4><i class="fas fa-code"></i> Использованные технологии</h4>
                  <div class="tech-tags">
                    <span 
                      v-for="(tech, techIdx) in project.technologies" 
                      :key="techIdx"
                      class="project-tech-tag"
                      :class="getTechCategory(tech)"
                    >
                      {{ tech }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              class="details-btn"
              @click="toggleProjectDetails(index)"
            >
              <i :class="selectedProject === index ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i> 
              {{ selectedProject === index ? 'Свернуть' : 'Подробнее' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Админ панель (только для администраторов) -->
      <div class="admin-section" v-if="isAdmin">
        <div class="section-header">
          <h2><i class="fas fa-user-shield"></i> Админ панель</h2>
        </div>
        
        <div class="admin-actions">
          <button class="admin-btn" @click="navigateToApplications">
            <i class="fas fa-clipboard-list"></i> Заявки
          </button>
          <button class="admin-btn" @click="navigateToUserManagement">
            <i class="fas fa-users-cog"></i> Управление пользователями
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import Multiselect from 'vue-multiselect';
import { useToast } from 'vue-toastification';
import { useMainStore } from '../stores/main-store';
import * as usersApi from '../api/users.api';
import { useRouter } from 'vue-router';
import 'vue-toastification/dist/index.css';

const toast = useToast();
const mainStore = useMainStore();
const router = useRouter();

// Проверка на администратора
const isAdmin = computed(() => mainStore.isAdmin());

// Состояния
const editMode = ref(false);
const editSkillsMode = ref(false);
const selectedProject = ref(null);
const avatarUploading = ref(false);
const avatarUrl = ref('');


// Рефы
const fileInput = ref(null);
const experienceFileInput = ref(null);

// Данные пользователя
const defaultAvatar = ref('https://www.gravatar.com/avatar/default?s=200&d=mp');
const user = reactive({
  id: 0,
  avatar: '',
  firstName: '',
  lastName: '',
  fullName: computed(() => `${user.firstName} ${user.lastName}`),
  role: '',
  group: '',
  email: '',
  phone: '',
  experience: '',
  yearsOfExperience: 0,
  projectsCompleted: 0,
  technologies: [],
  personalQualities: {
    communication: 0,
    teamwork: 0,
    leadership: 0,
    reliability: 0
  },
  experienceFiles: []
});

// Список всех языков программирования
const techCategories = {
  frontend: ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'SASS', 'Vue.js', 'React', 'Angular'],
  backend: ['Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Node.js'],
  database: ['SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Firebase'],
};

// Все доступные языки
const allLanguages = [
  ...techCategories.frontend,
  ...techCategories.backend,
  ...techCategories.database
];

// Фильтрация доступных языков для добавления
const filteredLanguages = computed(() => {
  return allLanguages.filter(lang => !user.technologies.includes(lang));
});

const selectedLanguage = ref(null);

// Вычисляемые свойства для категорий
const frontendLanguages = computed(() => 
  user.technologies.filter(lang => techCategories.frontend.includes(lang))
);
const backendLanguages = computed(() => 
  user.technologies.filter(lang => techCategories.backend.includes(lang))
);
const databaseLanguages = computed(() => 
  user.technologies.filter(lang => techCategories.database.includes(lang))
);
const otherLanguages = computed(() => 
  user.technologies.filter(lang => 
    !techCategories.frontend.includes(lang) &&
    !techCategories.backend.includes(lang) &&
    !techCategories.database.includes(lang)
  )
);

// Проекты
const portfolio = ref([
  {
    name: 'Проект 1',
    status: 'В разработке',
    team: 'Команда А',
    role: 'Разработчик',
    timeline: 'Январь 2023 - настоящее время',
    description: 'Описание проекта 1. Это более подробное описание проекта, которое может быть довольно длинным.',
    customer: 'Клиент А',
    teamMembers: [
      { name: 'Иван Иванов', role: 'Тимлид' },
      { name: 'Петр Петров', role: 'Дизайнер' }
    ],
    technologies: ['Vue.js', 'Node.js', 'MongoDB']
  },
  {
    name: 'Проект 2',
    status: 'Завершен',
    team: 'Команда Б',
    role: 'Фронтенд разработчик',
    timeline: 'Март 2022 - Декабрь 2022',
    description: 'Описание проекта 2. Это более подробное описание проекта, которое может быть довольно длинным.',
    customer: 'Клиент Б',
    teamMembers: [
      { name: 'Сергей Сергеев', role: 'Бэкенд разработчик' },
      { name: 'Алексей Алексеев', role: 'Тестировщик' }
    ],
    technologies: ['React', 'Python', 'PostgreSQL']
  }
]);

// Методы
const toggleEditMode = async () => {
  if (editMode.value) {
    try {
      // Сохраняем изменения в профиле
      const updateData = {
        firstname: user.firstName,
        lastname: user.lastName,
        email: user.email,
        telephone: user.phone,
        group: user.group,
        avatarPath: user.avatar // Добавляем аватар в данные для обновления
      };
      
      const updatedUser = await usersApi.updateProfile(user.id, updateData);
      if (updatedUser) {
        toast.success('Контактные данные сохранены');
        // Обновляем данные в хранилище
        mainStore.initAppState({
          userId: updatedUser.id,
          username: updatedUser.email,
          firstname: updatedUser.firstname,
          lastname: updatedUser.lastname,
          roles: updatedUser.roles,
          avatar: updatedUser.avatarPath
        });
      }
    } catch (error) {
      toast.error('Ошибка при сохранении данных');
      console.error(error);
    }
  }
  editMode.value = !editMode.value;
};

const toggleSkillsEditMode = async () => {
  if (editSkillsMode.value) {
    try {
      // Сохраняем изменения в компетенциях
      const updateData = {
        yearsOfExperience: user.yearsOfExperience,
        projectsCompleted: user.projectsCompleted,
        technologies: user.technologies,
        communicationSkill: user.personalQualities.communication,
        teamworkSkill: user.personalQualities.teamwork,
        leadershipSkill: user.personalQualities.leadership,
        reliabilitySkill: user.personalQualities.reliability
      };
      
      const updatedUser = await usersApi.updateProfile(user.id, updateData);
      if (updatedUser) {
        toast.success('Изменения в компетенциях сохранены');
      }
    } catch (error) {
      toast.error('Ошибка при сохранении компетенций');
      console.error(error);
    }
  }
  editSkillsMode.value = !editSkillsMode.value;
};

const addLanguage = (lang) => {
  if (lang && !user.technologies.includes(lang)) {
    user.technologies.push(lang);
    selectedLanguage.value = null;
    toast.success(`Технология "${lang}" добавлена`);
  }
};

const removeLanguage = (lang) => {
  user.technologies = user.technologies.filter(l => l !== lang);
  toast.info(`Технология "${lang}" удалена`);
};

const getTechCategory = (tech) => {
  if (techCategories.frontend.includes(tech)) return 'frontend';
  if (techCategories.backend.includes(tech)) return 'backend';
  if (techCategories.database.includes(tech)) return 'database';
  return 'other';
};

const truncateDescription = (desc) => {
  if (!desc) return '';
  return desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
};

const triggerFileInput = () => {
  fileInput.value.click();
};



// Вычисляем URL аватара с timestamp
const getAvatarUrl = (path) => {
  if (!path) return defaultAvatar.value;
  return `${path}?${Date.now()}`;
};

// Обработчик ошибки загрузки изображения
const handleImageError = () => {
  avatarUrl.value = defaultAvatar.value;
};

const handleAvatarChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.match('image.*')) {
    toast.error('Пожалуйста, выберите файл изображения (JPEG, PNG)');
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    toast.error('Размер файла не должен превышать 2MB');
    return;
  }

  avatarUploading.value = true;

  try {
    const avatarPath = await usersApi.uploadAvatar(user.id, file);
    if (avatarPath) {
      // Обновляем URL с timestamp для предотвращения кэширования
      avatarUrl.value = `${avatarPath}?${Date.now()}`;
      
      // Обновляем данные пользователя
      const currentUser = mainStore.getCurrentUser();
      if (currentUser) {
        currentUser.avatar = avatarPath;
      }
      
      toast.success('Аватар успешно обновлен');
    }
  } catch (error) {
    toast.error('Ошибка при загрузке аватарки');
    console.error(error);
  } finally {
    avatarUploading.value = false;
  }
};

const removeAvatar = async () => {
  try {
    await usersApi.updateProfile(user.id, { avatarPath: null });
    avatarUrl.value = defaultAvatar.value;
    
    const currentUser = mainStore.getCurrentUser();
    if (currentUser) {
      currentUser.avatar = '';
    }
    
    toast.success('Аватар успешно удален');
  } catch (error) {
    toast.error('Ошибка при удалении аватарки');
    console.error(error);
  }
};

onMounted(() => {
  loadUserData();
});

const triggerExperienceFileInput = () => {
  experienceFileInput.value.click();
};

const handleExperienceFileChange = (e) => {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  const validFiles = files.filter(file => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      toast.warning(`Файл ${file.name} имеет недопустимый формат`);
      return false;
    }
    
    if (file.size > maxSize) {
      toast.warning(`Файл ${file.name} слишком большой (макс. 5MB)`);
      return false;
    }
    
    return true;
  });

  validFiles.forEach(file => {
    const fileUrl = URL.createObjectURL(file);
    user.experienceFiles.push({
      name: file.name,
      type: file.type,
      size: file.size,
      url: fileUrl,
      file: file
    });
  });

  if (validFiles.length > 0) {
    toast.success(`Добавлено ${validFiles.length} файлов`);
  }
};

const removeExperienceFile = (index) => {
  const removedFile = user.experienceFiles.splice(index, 1)[0];
  if (removedFile.url) {
    URL.revokeObjectURL(removedFile.url);
  }
  toast.info(`Файл "${removedFile.name}" удален`);
};

const getFileIcon = (fileType) => {
  if (fileType.includes('pdf')) return 'fas fa-file-pdf';
  if (fileType.includes('word')) return 'fas fa-file-word';
  if (fileType.includes('image')) return 'fas fa-file-image';
  return 'fas fa-file';
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const toggleProjectDetails = (index) => {
  selectedProject.value = selectedProject.value === index ? null : index;
};

const navigateToApplications = () => {
  router.push('/admin/applications');
};

const navigateToUserManagement = () => {
  router.push('/admin/users');
};

// Загрузка данных пользователя
const loadUserData = async () => {
  try {
    const currentUser = mainStore.getCurrentUser();
    if (!currentUser) return;
    
    user.id = currentUser.id;
    user.firstName = currentUser.firstname;
    user.lastName = currentUser.lastname;
    user.email = currentUser.email;
    user.role = isAdmin.value ? 'Администратор' : 'Пользователь';
    
    // Загружаем полный профиль
    const userProfile = await usersApi.getProfile(user.id);
    if (userProfile) {
      user.phone = userProfile.telephone || '';
      user.group = userProfile.group || '';
      avatarUrl.value = userProfile.avatarPath ? 
        `${userProfile.avatarPath}?${Date.now()}` : 
        defaultAvatar.value;
    }
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error);
    avatarUrl.value = defaultAvatar.value;
  }
};

onMounted(() => {
  loadUserData();
});
</script>
<style scoped>
.profile-container {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  justify-content: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.profile-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 50, 0.1);
  width: 100%;
  max-width: 1000px;
  overflow: hidden;
}

.avatar-section {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  color: white;
  padding: 2.5rem;
  text-align: center;
  position: relative;
}

.avatar-wrapper {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 1.5rem;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.avatar:hover {
  transform: scale(1.03);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #1a237e;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-edit-btn:hover {
  background: #303f9f;
  transform: scale(1.1);
}

.upload-progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.profile-title {
  margin: 0.5rem 0 0;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.profile-role {
  margin: 0.5rem 0 0;
  opacity: 0.9;
  font-size: 1.2rem;
  font-weight: 400;
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
  font-size: 1.6rem;
  font-weight: 600;
}

.edit-toggle-btn, .add-btn {
  background: #1a237e;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.edit-toggle-btn:hover, .add-btn:hover {
  background: #283593;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.info-section {
  padding: 2rem;
  border-bottom: 1px solid #eee;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  margin-bottom: 1rem;
}

.info-item label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
  font-size: 0.95rem;
}

.info-input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9f9f9;
}

.info-input:disabled {
  background: #f0f0f0;
  color: #333;
  border-color: #e0e0e0;
}

.info-input:focus {
  outline: none;
  border-color: #1a237e;
  box-shadow: 0 0 0 2px rgba(26, 35, 126, 0.2);
  background: white;
}

.skills-section {
  padding: 2rem;
  border-bottom: 1px solid #eee;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.skill-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.skill-item h3 {
  margin-top: 0;
  color: #1a237e;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.skill-textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  background: #f9f9f9;
  line-height: 1.5;
}

.skill-textarea:disabled {
  background: #f0f0f0;
}

.skill-textarea:focus {
  outline: none;
  border-color: #1a237e;
  background: white;
}

.hint {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.5rem;
  font-style: italic;
}

.experience-files {
  margin-top: 1rem;
}

.add-file-btn {
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

.add-file-btn:hover {
  background: #283593;
}

.attached-files {
  margin-top: 1rem;
}

.attached-files h4 {
  margin: 1rem 0 0.5rem;
  font-size: 1rem;
  color: #555;
}

.files-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.files-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.file-name {
  flex: 1;
  font-size: 0.9rem;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 0.8rem;
  color: #777;
}

.remove-file, .view-file {
  background: none;
  border: none;
  color: #5c6bc0;
  cursor: pointer;
  padding: 0.2rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.remove-file:hover {
  color: #f44336;
}

.view-file:hover {
  color: #1a237e;
}

.tech-categories {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.category h4 {
  margin: 0 0 0.5rem 0;
  color: #555;
  font-size: 0.95rem;
  font-weight: 500;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.2s ease;
}

.tech-tag.frontend {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.tech-tag.backend {
  background: #e3f2fd;
  color: #1565c0;
  border: 1px solid #bbdefb;
}

.tech-tag.database {
  background: #fff3e0;
  color: #e65100;
  border: 1px solid #ffe0b2;
}

.tech-tag.other {
  background: #f3e5f5;
  color: #6a1b9a;
  border: 1px solid #e1bee7;
}

.remove-tech {
  background: none;
  border: none;
  color: inherit;
  opacity: 0.7;
  cursor: pointer;
  padding: 0;
  font-size: 0.7rem;
  transition: all 0.2s ease;
}

.remove-tech:hover {
  opacity: 1;
  transform: scale(1.1);
}

.add-tech-select {
  margin-top: 1rem;
  width: 100%;
}

.add-tech-select.has-selected :deep(.multiselect__tags) {
  border-color: #1a237e;
}

:deep(.multiselect__option--highlight) {
  background: #1a237e;
  color: white;
}

:deep(.multiselect__option--highlight) .tech-badge {
  color: white;
  background: rgba(255, 255, 255, 0.2);
}

:deep(.multiselect__content-wrapper) {
  max-height: 300px;
  overflow-y: auto;
}

.multiselect-no-options {
  padding: 8px 12px;
  color: #666;
  font-size: 0.9rem;
  text-align: center;
}

.projects-section {
  padding: 2rem;
}

.projects-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.project-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.project-card.in-progress {
  border-left: 4px solid #ff9800;
}

.project-card.completed {
  border-left: 4px solid #4caf50;
}

.project-card.planned {
  border-left: 4px solid #2196f3;
}

.project-main {
  padding: 1.5rem;
  flex: 1;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.project-header h3 {
  margin: 0;
  color: #1a237e;
  font-size: 1.2rem;
}

.project-status {
  background: #e8eaf6;
  color: #1a237e;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.project-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #555;
  font-size: 0.9rem;
}

.meta-item i {
  color: #5c6bc0;
}

.project-description {
  color: #555;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

.details-btn {
  background: none;
  border: none;
  padding: 0.8rem;
  width: 100%;
  border-top: 1px solid #eee;
  color: #5c6bc0;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.details-btn:hover {
  background: #f5f5f5;
  color: #3949ab;
}

.project-details {
  padding: 1rem 0 0;
  animation: fadeIn 0.3s ease-out;
}

.detail-block {
  margin-bottom: 1.5rem;
}

.detail-block h4 {
  margin: 0 0 0.5rem;
  color: #1a237e;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-block p {
  margin: 0;
  color: #555;
  line-height: 1.6;
}

.team-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.team-list li {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.member-name {
  font-weight: 500;
}

.member-role {
  color: #666;
  font-size: 0.9rem;
}

.project-tech-tag {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.project-tech-tag.frontend {
  background: #e8f5e9;
  color: #2e7d32;
}

.project-tech-tag.backend {
  background: #e3f2fd;
  color: #1565c0;
}

.project-tech-tag.database {
  background: #fff3e0;
  color: #e65100;
}

.project-tech-tag.other {
  background: #f3e5f5;
  color: #6a1b9a;
}

/* Анимации */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Адаптивность */
@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }
  
  .info-grid, .skills-grid, .projects-container {
    grid-template-columns: 1fr;
  }
  
  .avatar-section {
    padding: 1.5rem;
  }
  
  .profile-title {
    font-size: 1.6rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .skill-item {
    padding: 1rem;
  }
  
  .project-card {
    width: 100%;
  }
}

/* Специфические стили для Multiselect */
:deep(.multiselect__tags) {
  min-height: 48px;
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 8px 12px;
}

:deep(.multiselect__input) {
  margin: 0;
  padding: 0;
}

:deep(.multiselect__single) {
  margin: 0;
  padding: 0;
  background: transparent;
}

:deep(.multiselect__option) {
  padding: 10px 16px;
}

:deep(.multiselect__option--selected) {
  background: #f5f5f5;
  color: #333;
}

:deep(.multiselect__option--selected.multiselect__option--highlight) {
  background: #f44336;
  color: white;
}

:deep(.multiselect__spinner) {
  border-color: #1a237e transparent transparent;
}

.tech-option {
  display: flex;
  align-items: center;
  padding: 8px 12px;
}

.tech-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.85rem;
}

.tech-badge.frontend {
  background: #e8f5e9;
  color: #2e7d32;
}

.tech-badge.backend {
  background: #e3f2fd;
  color: #1565c0;
}

.tech-badge.database {
  background: #fff3e0;
  color: #e65100;
}

.tech-badge.other {
  background: #f3e5f5;
  color: #6a1b9a;
}

/* Дополнительные стили для файлов */
.file-icon {
  width: 24px;
  text-align: center;
  color: #5c6bc0;
}

.file-actions {
  display: flex;
  gap: 8px;
}

/* Улучшенные стили для состояний */
.in-progress .project-status {
  background: #fff3e0;
  color: #ff6d00;
}

.completed .project-status {
  background: #e8f5e9;
  color: #2e7d32;
}

.planned .project-status {
  background: #e3f2fd;
  color: #1565c0;
}

/* Улучшенные стили для текстовых полей */
.skill-textarea {
  transition: border-color 0.3s ease;
}

.skill-textarea:focus {
  border-color: #1a237e;
  box-shadow: 0 0 0 2px rgba(26, 35, 126, 0.2);
}

/* Стили для пустых состояний */
.empty-message {
  color: #999;
  font-style: italic;
  font-size: 0.9rem;
  text-align: center;
  padding: 1rem;
}

/* Улучшенные стили для иконок */
.icon {
  width: 20px;
  text-align: center;
}

/* Добавляем новые стили для админ панели */
.admin-section {
  padding: 2rem;
  border-top: 1px solid #eee;
}

.admin-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.admin-btn {
  background: #1a237e;
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex: 1;
  justify-content: center;
}

.admin-btn:hover {
  background: #283593;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.admin-btn i {
  font-size: 1.2rem;
}

/* Стили для кнопки удаления аватарки */
.avatar-remove-btn {
  position: absolute;
  bottom: 5px;
  left: 5px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f44336;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-remove-btn:hover {
  background: #d32f2f;
  transform: scale(1.1);
}
</style>

<style>
/* Глобальные стили для Multiselect */
.multiselect {
  margin-top: 0.5rem;
  font-family: inherit;
}

.multiselect__tags {
  border: 1px solid #ddd;
  border-radius: 8px;
  min-height: 48px;
  padding: 0.5rem 1rem;
  background: #f9f9f9;
}

.multiselect__tag {
  background: #1a237e;
  color: white;
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.multiselect__tag-icon:after {
  color: white;
}

.multiselect__option--highlight {
  background: #1a237e;
}

.multiselect__option--highlight:after {
  background: #1a237e;
}

.multiselect__option--selected.multiselect__option--highlight {
  background: #f44336;
}

.multiselect__option--selected.multiselect__option--highlight:after {
  background: #f44336;
}

.multiselect__spinner {
  border-color: #1a237e transparent transparent;
}

.multiselect__input, 
.multiselect__single {
  font-size: 1rem;
  padding: 0;
  margin: 0;
  background: transparent;
}

.multiselect__placeholder {
  color: #999;
  margin: 0;
  padding: 0;
}

.multiselect__content-wrapper {
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.multiselect__option {
  padding: 0.8rem 1rem;
}

.multiselect__option--selected {
  background: #f5f5f5;
  color: #333;
  font-weight: normal;
}
</style>