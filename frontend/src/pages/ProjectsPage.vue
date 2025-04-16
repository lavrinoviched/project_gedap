<template>
  <q-page class="gallery-page">
    <!-- Hero Section -->
    <section class="hero-section flex flex-center">
      <div class="hero-overlay"></div>
      <div class="text-center hero-content">
        <h1 class="text-h1 text-weight-bold">ГАЛЕРЕЯ ПРОЕКТОВ</h1>
        <p class="text-h4 q-mt-md">Галерея проектов – раздел, на котором регулярно появляются новые проекты в IT области</p>
        <div class="q-mt-lg">
          <q-btn 
            color="primary" 
            label="СОЗДАТЬ ПРОЕКТ" 
            class="custom-btn" 
            @click="onNewClick"
          />
        </div>
      </div>
      
      <!-- Стрелка для скролла -->
      <div class="arrow-down" @click="scrollToProjects">
        <q-icon name="keyboard_arrow_down" size="2em" />
      </div>
      
      <!-- Летающие шарики -->
      <div class="balloons">
        <div v-for="i in 12" :key="i" :class="`balloon balloon${i}`"></div>
      </div>
    </section>

    <!-- Projects Section с анимацией -->
    <section 
      id="projects" 
      class="projects-section q-pa-xl bg-white"
      :class="{ visible: isProjectsVisible }"
      ref="projectsSection"
    >
      <div class="container">
        <h2 class="section-title text-primary">ВСЕ ПРОЕКТЫ</h2>
        <div class="row q-mt-md">
          <!-- Список проектов -->
          <div class="col-12 col-md-6 q-pa-md" v-for="(project, index) in projects" :key="index">
            <q-card class="custom-card shadow-5">
              <q-card-section>
                <div class="text-h6 q-mb-md">{{ project.title }}</div>
                <p class="text-caption q-mb-md">Дата окончания приёма заявок: {{ project.deadline }}</p>
                <div class="row justify-between q-mb-md">
                  <q-btn color="primary" label="Подать заявку на участие" class="q-mr-sm" />
                  <q-btn color="secondary" label="Подробнее" @click="openDialog(project)" />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Диалог с подробной информацией -->
    <q-dialog v-model="showDialog">
      <q-card class="dialog-card">
        <q-card-section class="dialog-header">
          <div class="text-h6">{{ selectedProject?.title }}</div>
        </q-card-section>

        <q-card-section class="dialog-body">
          <div class="section">
            <div class="text-subtitle1 q-mb-sm">Краткое описание проекта</div>
            <div class="text-body2 q-mb-md">
              <p><strong>Проблема:</strong> {{ selectedProject?.problem }}</p>
              <p><strong>Предлагаемое решение:</strong> {{ selectedProject?.solution }}</p>
              <p><strong>Ожидаемый результат:</strong> {{ selectedProject?.expectedResult }}</p>
              <p><strong>Ресурсы:</strong> {{ selectedProject?.resources }}</p>
            </div>
          </div>

          <div class="section">
            <div class="text-subtitle1 q-mb-sm">Информация</div>
            <div class="info-item q-mb-sm">
              <strong>Заказчик:</strong> ВШЦТ
            </div>
            <div class="info-item q-mb-sm">
              <strong>Инициатор:</strong> Екатерина Сердюкова
            </div>
            <div class="info-item q-mb-sm">
              <strong>Статус:</strong>
              <q-badge :color="selectedProject?.status === 'В разработке' ? 'orange' : 'green'">
                {{ selectedProject?.status }}
              </q-badge>
            </div>
            <div class="info-item q-mb-sm">
              <strong>Дата старта проекта:</strong> 03.06.2024
            </div>
            <div class="info-item q-mb-sm">
              <strong>Дата окончания проекта:</strong> {{ selectedProject?.deadline }}
            </div>
          </div>

          <div class="section">
            <div class="text-subtitle1 q-mb-sm">Участники проекта</div>
            <div v-for="(member, index) in selectedProject?.members" :key="index" class="member-item q-mb-sm">
              <q-btn flat :label="member.name" @click="goToProfile(member.id)" class="text-primary" />
              <span class="text-caption q-ml-sm">{{ member.role }}</span>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="dialog-actions">
          <q-btn flat label="Прокомментировать" color="primary" @click="openComments" />
          <q-btn flat label="Подать заявку" color="primary" @click="applyForProject" />
          <q-btn flat label="Закрыть" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Интерфейсы для типизации
interface ProjectMember {
  id: number;
  name: string;
  role: string;
}

interface Project {
  title: string;
  deadline: string;
  problem: string;
  solution: string;
  expectedResult: string;
  resources: string;
  members: ProjectMember[];
  status: string;
}

// Данные проектов с правильной типизацией
const projects = ref<Project[]>([
  { 
    title: 'Чат-бот в телеграмм', 
    deadline: '29.11.2023',
    problem: 'Отсутствие единой системы для управления учебным процессом.',
    solution: 'Создание портала с персональными кабинетами для студентов и преподавателей.',
    expectedResult: 'Повышение эффективности обучения и упрощение контроля успеваемости.',
    resources: 'Знание Python, работа с Telegram API',
    members: [
      { id: 1, name: 'Екатерина Сердюкова', role: 'Тим-лид' },
      { id: 2, name: 'Иван Иванов', role: 'Разработчик' },
      { id: 3, name: 'Петр Петров', role: 'Дизайнер' },
    ],
    status: 'В разработке',
  },
  { 
    title: 'Онлайн-платформа для обучения', 
    deadline: '08.02.2024',
    problem: 'Необходимость в современной системе дистанционного обучения.',
    solution: 'Разработка интерактивной платформы с курсами и тестами.',
    expectedResult: 'Улучшение качества дистанционного образования.',
    resources: 'Знание JavaScript, React, Node.js',
    members: [
      { id: 1, name: 'Алексей Смирнов', role: 'Тим-лид' },
      { id: 2, name: 'Мария Петрова', role: 'Фронтенд-разработчик' },
      { id: 3, name: 'Дмитрий Волков', role: 'Бэкенд-разработчик' },
    ],
    status: 'Завершен',
  }
]);

// Состояние для управления диалогом
const showDialog = ref(false);
const selectedProject = ref<Project | null>(null);
const isProjectsVisible = ref(false);
const projectsSection = ref<HTMLElement | null>(null);

// Методы
const onNewClick = () => {
  console.log('Создание нового проекта');
};

const openDialog = (project: Project) => {
  selectedProject.value = project;
  showDialog.value = true;
};

const goToProfile = (id: number) => {
  console.log('Переход к профилю участника:', id);
};

const openComments = () => {
  console.log('Открытие комментариев');
};

const applyForProject = () => {
  console.log('Подача заявки на проект');
  showDialog.value = false;
};

const scrollToProjects = () => {
  const element = document.getElementById('projects');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Анимация появления при скролле
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isProjectsVisible.value = true;
        }
      });
    },
    { threshold: 0.1 }
  );

  if (projectsSection.value) {
    observer.observe(projectsSection.value);
  }
});
</script>

<style scoped>
.gallery-page {
  background: white;
  color: #2a5298;
  font-family: 'Roboto', sans-serif;
  position: relative;
}

/* Hero Section */
.hero-section {
  height: 100vh;
  background: linear-gradient(135deg, #0d1f3d 0%, #1a3466 100%);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 40px;
}
.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  padding: 0 20px;
}

.text-h1 {
  font-size: 4rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.text-h4 {
  font-size: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

/* Projects Section */
.projects-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin: 40px auto;
  max-width: 1200px;
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 1s ease, transform 1s ease;
}

.projects-section.visible {
  opacity: 1;
  transform: translateY(0);
}

.section-title {
  color: #2a5298;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.custom-card {
  background: white;
  border-radius: 8px;
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
}

.custom-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15) !important;
}

/* Кнопки */
.custom-btn {
  font-size: 1.2rem;
  padding: 12px 24px;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  border: none;
  color: white;
  border-radius: 8px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.custom-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

/* Стрелка */
.arrow-down {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  z-index: 3;
  animation: bounce 2s infinite;
  color: white;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  40% {
    transform: translateY(-15px) translateX(-50%);
  }
  60% {
    transform: translateY(-7px) translateX(-50%);
  }
}

/* Летающие шарики */
.balloons {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  overflow: hidden;
}

.balloon {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  filter: blur(30px);
  opacity: 0.8;
  animation: float 6s infinite ease-in-out;
}

/* Цвета шариков */
.balloon1 { background: rgba(173, 216, 230, 0.6); top: 10%; left: 5%; animation-duration: 7s; }
.balloon2 { background: rgba(135, 206, 250, 0.6); top: 20%; left: 25%; animation-duration: 8s; }
.balloon3 { background: rgba(100, 149, 237, 0.6); top: 15%; left: 50%; animation-duration: 9s; }
.balloon4 { background: rgba(70, 130, 180, 0.6); top: 25%; left: 70%; animation-duration: 6s; }
.balloon5 { background: rgba(30, 144, 255, 0.6); top: 5%; left: 90%; animation-duration: 7s; }
.balloon6 { background: rgba(0, 191, 255, 0.6); top: 30%; left: 10%; animation-duration: 8s; }
.balloon7 { background: rgba(173, 216, 230, 0.6); top: 40%; left: 60%; animation-duration: 6s; }
.balloon8 { background: rgba(135, 206, 250, 0.6); top: 50%; left: 80%; animation-duration: 7s; }
.balloon9 { background: rgba(100, 149, 237, 0.6); top: 60%; left: 20%; animation-duration: 8s; }
.balloon10 { background: rgba(70, 130, 180, 0.6); top: 70%; left: 40%; animation-duration: 6s; }
.balloon11 { background: rgba(30, 144, 255, 0.6); top: 80%; left: 60%; animation-duration: 7s; }
.balloon12 { background: rgba(0, 191, 255, 0.6); top: 90%; left: 80%; animation-duration: 8s; }

@keyframes float {
  0% { transform: translateY(0) translateX(0) rotate(0deg); }
  25% { transform: translateY(-40px) translateX(40px) rotate(5deg); }
  50% { transform: translateY(20px) translateX(-20px) rotate(-5deg); }
  75% { transform: translateY(-30px) translateX(30px) rotate(3deg); }
  100% { transform: translateY(0) translateX(0) rotate(0deg); }
}

/* Диалог */
.dialog-card {
  width: 600px;
  max-width: 90vw;
  background: white;
  border-radius: 12px;
}

.dialog-header {
  background: #2a5298;
  color: white;
  padding: 16px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.dialog-body {
  padding: 20px;
}

.section {
  margin-bottom: 20px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
}

.info-item, .member-item {
  margin-bottom: 8px;
}

.dialog-actions {
  padding: 16px;
  border-top: 1px solid #eee;
}

/* Адаптивность */
@media (max-width: 768px) {
  .text-h1 {
    font-size: 2.5rem;
  }
  
  .text-h4 {
    font-size: 1.2rem;
  }
  
  .projects-section {
    padding: 30px 15px;
    margin: 20px auto;
  }
  
  .custom-card {
    margin-bottom: 20px;
  }
}
</style>