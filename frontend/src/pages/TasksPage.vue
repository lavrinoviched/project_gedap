<template>
  <q-page class="task-bank-page">
    <!-- Hero Section -->
    <section class="hero-section flex flex-center">
      <div class="hero-overlay"></div>
      <div class="text-center hero-content">
        <h1 class="text-h1 text-weight-bold">БАНК ИДЕЙ</h1>
        <p class="text-h4 q-mt-md">Платформа, которая представляет собой удобный список идей проектов от партнеров и сотрудников нашего университета</p>
        <div class="q-mt-lg">
          <q-btn
            color="primary"
            label="Предложить идею проекта"
            class="custom-btn"
            @click="onNewClick"
          />
        </div>
      </div>

      <!-- Стрелка для скролла -->
      <div class="arrow-down" @click="scrollToHowItWorks">
        <q-icon name="keyboard_arrow_down" size="2em" />
      </div>

      <!-- Летающие шарики -->
      <div class="balloons">
        <div v-for="i in 12" :key="i" :class="`balloon balloon${i}`"></div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section
      id="how-it-works"
      class="how-it-works-section q-pa-xl"
      :class="{ visible: isHowItWorksVisible }"
    >
      <div class="container">
        <h2 class="section-title">КАК РАБОТАТЬ С БАНКОМ ИДЕЙ</h2>

        <div class="steps-container">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="step-item"
            :class="{ visible: step.visible }"
            @mouseenter="hoverStep(index)"
            @mouseleave="unhoverStep(index)"
          >
            <div class="step-number">{{ index + 1 }}</div>
            <h3 class="step-title">ШАГ {{ index + 1 }}</h3>
            <p class="step-description">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tasks Section -->
    <section
      id="tasks"
      class="tasks-section q-pa-xl"
      :class="{ visible: isTasksVisible }"
    >
      <div class="container">
        <h2 class="section-title">ДОСТУПНЫЕ ИДЕИ</h2>

        <!-- Кнопка фильтров -->
        <div class="q-mb-lg text-center">
          <q-btn
            color="primary"
            label="Фильтры"
            icon="filter_list"
            @click="showFilters = !showFilters"
            class="q-mb-md"
          />
        </div>

        <!-- Фильтры (скрытые по умолчанию) -->
        <div class="filter-bar q-mb-lg shadow-2" v-show="showFilters">
          <div class="row">
            <div class="col-md-3 col-sm-6 col-12 q-pa-sm">
              <q-select
                v-model="selectedInitiator"
                :options="initiatorOptions"
                label="Инициатор проекта"
                outlined
                dense
                color="primary"
              />
            </div>
            <div class="col-md-3 col-sm-6 col-12 q-pa-sm">
              <q-select
                v-model="selectedStack"
                :options="stackOptions"
                label="Стек технологий"
                outlined
                dense
                multiple
                color="primary"
              />
            </div>
            <div class="col-md-3 col-sm-6 col-12 q-pa-sm">
              <q-select
                v-model="selectedStatus"
                :options="statusOptions"
                label="Статус идеи"
                outlined
                dense
                color="primary"
              />
            </div>
            <div class="col-md-3 col-sm-6 col-12 q-pa-sm">
              <q-select
                v-model="selectedTeamSize"
                :options="teamSizeOptions"
                label="Размер команды"
                outlined
                dense
                color="primary"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-3 col-sm-6 col-12 q-pa-sm">
              <q-select
                v-model="selectedHasReward"
                :options="hasRewardOptions"
                label="Награда участникам"
                outlined
                dense
                color="primary"
              />
            </div>
            <div class="col-md-3 col-sm-6 col-12 q-pa-sm">
              <q-select
                v-model="selectedCategory"
                :options="categoryOptions"
                label="Категория задачи"
                outlined
                dense
                color="primary"
              />
            </div>
            <div class="col-md-3 col-sm-6 col-12 q-pa-sm">
              <q-select
                v-model="selectedComplexity"
                :options="complexityOptions"
                label="Сложность"
                outlined
                dense
                color="primary"
              />
            </div>
            <div class="col-md-3 col-sm-6 col-12 q-pa-sm">
              <q-input
                outlined
                dense
                v-model="deadlineFrom"
                label="Срок от"
                type="date"
                color="primary"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 col-sm-12 col-12 q-pa-sm">
              <q-input
                class="search-input"
                outlined
                dense
                v-model="searchText"
                label="Поиск по названию"
                color="primary"
              >
                <template v-slot:append>
                  <q-icon name="search" color="primary" />
                </template>
              </q-input>
            </div>
            <div class="col-md-3 col-sm-6 col-12 q-pa-sm flex flex-center">
              <q-btn
                color="primary"
                label="Сбросить фильтры"
                icon="refresh"
                @click="resetFilters"
              />
            </div>
          </div>
        </div>

        <!-- Таблица задач -->
        <div class="tasks-table bg-white shadow-2">
          <div class="table-header">
            <div class="header-title">Идея</div>
            <div class="header-category">Категория</div>
            <div class="header-deadline">Срок выполнения</div>
            <div class="header-actions">Действия</div>
          </div>

          <div
            v-for="idea in filteredIdeas"
            :key="idea.id"
            class="task-row"
          >
            <div class="task-title">
              <q-icon name="assignment" color="primary" class="q-mr-sm" />
              {{ idea.name }}
            </div>
            <div class="task-category">
              {{ idea.category || 'Нет категории' }}
            </div>
            <div class="task-deadline">
              <q-icon name="event" color="primary" class="q-mr-sm" />
              {{ idea.deadline || 'Нет дедлайна' }}
            </div>
            <div class="task-actions">
              <q-btn
                flat
                color="primary"
                label="Подробнее"
                icon="info"
                class="action-btn"
                @click="showTaskDetails(idea)"
              />
              <q-btn
                flat
                color="primary"
                label="Взять задачу"
                icon="playlist_add_check"
                class="action-btn"
                @click="takeTask(idea)"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Become Customer Section -->
    <section
      id="become-customer"
      class="become-customer-section q-pa-xl bg-white"
      :class="{ visible: isBecomeCustomerVisible }"
    >
      <div class="container text-center">
        <div class="become-customer-card shadow-5">
          <h2 class="section-title" :class="{ animated: isBecomeCustomerVisible }">
            <q-icon name="person_add" size="md" class="q-mr-sm" />
            ХОТИТЕ СТАТЬ ЗАКАЗЧИКОМ?
          </h2>
          <p class="section-description" :class="{ animated: isBecomeCustomerVisible }">
            Если Вы хотите предложить свою идею для «Банка идей» или стать партнером университета,
            перейдите в раздел «Создать идею»
          </p>
          <q-btn
            color="primary"
            label="Создать идею"
            size="lg"
            icon="add_task"
            class="custom-btn"
            :class="{ animated: isBecomeCustomerVisible }"
            @click="onNewClick"
          />
        </div>
      </div>
    </section>
  </q-page>
</template>


<script setup lang="ts">
import { useQuasar } from 'quasar';
import TaskEditForm from '../components/TaskEditForm.vue';
import { computed, onMounted, ref } from 'vue';
import { Idea, StatusIdea, TechnologyName } from '../../../backend/src/common/types';
import { IdeaApi } from '../api/ideas.api';
import { useMainStore } from 'src/stores/main-store';

const $q = useQuasar()

// Реактивные данные
const searchText = ref('');
const isHowItWorksVisible = ref(false);
const isTasksVisible = ref(false);
const isBecomeCustomerVisible = ref(false);
const showFilters = ref(false);
const ideas = ref<Idea[]>([]);

// Опции для селектов
const categoryOptions = ['Программирование', 'Аналитика', 'Дизайн', 'Документирование', 'Тестирование', 'Обучение'];
const complexityOptions = ['Низкая', 'Средняя', 'Высокая'];
const teamSizeOptions = ['1-2 человека', '2-3 человека', '3-4 человека', '4-5 человек'];
const stackOptions = Object.values(TechnologyName).filter(v => typeof v === 'string');
const statusOptions = Object.values(StatusIdea).map(status => ({
  label: status,
  value: status
}));
const initiatorOptions = ref([]); // Добавьте нужные опции для инициатора
const hasRewardOptions = ref([{ label: 'Да', value: true }, { label: 'Нет', value: false }]);

// Реактивные данные формы
const newTaskForm = ref({
  title: '',
  category: '',
  description: '',
  initiator: '',
  technologies: [] as string[],
  deadline: '',
  teamSize: '',
  hasReward: false,
  reward: '',
  complexity: 'Средняя'
});

// Добавьте недостающие реактивные свойства
const selectedInitiator = ref(null);
const selectedStack = ref(null);
const selectedStatus = ref(null);
const selectedTeamSize = ref(null);
const selectedHasReward = ref(null);
const selectedCategory = ref(null);
const selectedComplexity = ref(null);
const deadlineFrom = ref(null);



// Данные шагов
const steps = ref([
  {
    description: 'Выберите фильтр идеи в поиске',
    visible: false,
    hovered: false
  },
  {
    description: 'Ознакомьтесь с содержанием идеи',
    visible: false,
    hovered: false
  },
  {
    description: 'Заполните заявку Исполнителя идеи',
    visible: false,
    hovered: false
  },
  {
    description: 'Дождитесь ответа от Заказчика',
    visible: false,
    hovered: false
  }
]);

// Загрузка идей при монтировании компонента
onMounted(async () => {
  await loadIdeas();
});

async function loadIdeas() {
  try {
    const data = await IdeaApi.getAllIdeas();
    ideas.value = data;
  } catch (error) {
    console.error('Ошибка при загрузке идей:', error);
    $q.notify({
      message: 'Не удалось загрузить идеи',
      color: 'negative',
    });
  }
}

const submitTask = async (): Promise<boolean> => {
  try {
    $q.loading.show({ 
      message: 'Создание идеи...'
    });

    const mainStore = useMainStore();
    const currentUser = mainStore.getCurrentUser();

    if (!currentUser?.id) {
      throw new Error('Пользователь не авторизован');
    }

    const ideaData = {
      name: newTaskForm.value.title,
      problem: newTaskForm.value.description,
      solution: newTaskForm.value.description || 'Решение не указано',
      result: 'Ожидается результат',
      resource: 'Ресурсы не указаны',
      stack: newTaskForm.value.technologies || [],
      category: newTaskForm.value.category,
      deadline: newTaskForm.value.deadline || undefined
    };

    if (!ideaData.name || !ideaData.problem || !ideaData.category) {
      throw new Error('Заполните название, описание и категорию');
    }

    const createdIdea = await IdeaApi.createIdea(ideaData);
    
    if (!createdIdea?.id) {
      throw new Error('Не удалось создать идею');
    }

    // Форматируем дату для отображения
    const formatDeadline = (dateStr?: string) => {
      if (!dateStr) return undefined;
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? undefined : date.toISOString().split('T')[0];
    };

    const formattedIdea: Idea = {
      ...createdIdea,
      createdAt: new Date(createdIdea.createdAt),
      deadline: formatDeadline(newTaskForm.value.deadline),
      customer: {
        id: currentUser.id,
        name: `${currentUser.firstname} ${currentUser.lastname}`,
        email: currentUser.email
      },
      category: newTaskForm.value.category
    };

    ideas.value.unshift(formattedIdea);

    $q.notify({
      message: 'Идея успешно создана!',
      color: 'positive',
      icon: 'check_circle',
      position: 'top',
      timeout: 2000
    });

    // Сброс формы
    newTaskForm.value = {
      title: '',
      category: '',
      description: '',
      initiator: '',
      technologies: [],
      deadline: '',
      teamSize: '',
      hasReward: false,
      reward: '',
      complexity: 'Средняя'
    };

    return true;

  } catch (error: unknown) {
    console.error('Ошибка создания идеи:', error);
    
    let errorMessage = 'Ошибка при создании идеи';
    
    if (typeof error === 'object' && error !== null) {
      const axiosError = error as { response?: { status?: number, data?: { message?: string } } };
      if (axiosError.response?.status === 401) {
        errorMessage = 'Требуется авторизация';
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      } else if ('message' in error && typeof error.message === 'string') {
        errorMessage = error.message;
      }
    }

    $q.notify({
      message: errorMessage,
      color: 'negative',
      icon: 'error',
      position: 'top',
      timeout: 3000
    });

    return false;
  } finally {
    $q.loading.hide();
  }
};




const onNewClick = async () => {
  try {
    $q.dialog({
      component: TaskEditForm,
      componentProps: {
        new: true,
        formData: newTaskForm.value,
        onSubmit: submitTask
      }
    })
  } catch (error) {
    console.error('Ошибка открытия диалога:', error)
    $q.notify({
      message: 'Не удалось открыть форму создания идеи',
      color: 'negative'
    })
  }
}

// Остальные методы остаются без изменений
const scrollToHowItWorks = () => {
  const element = document.getElementById('how-it-works');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const hoverStep = (index: number) => {
  steps.value[index].hovered = true;
};

const unhoverStep = (index: number) => {
  steps.value[index].hovered = false;
};

const showTaskDetails = (idea: Idea) => {
  $q.dialog({
    title: idea.name,
    message: `
      <div><strong>Описание проблемы:</strong> ${idea.problem}</div>
      <div><strong>Предлагаемое решение:</strong> ${idea.solution}</div>
      <div><strong>Ожидаемый результат:</strong> ${idea.result}</div>
      <div><strong>Необходимые ресурсы:</strong> ${idea.resource}</div>
      <div><strong>Технологии:</strong> ${idea.stack.join(', ')}</div>
      <div><strong>Статус:</strong> ${idea.status}</div>
      <div><strong>Дата создания:</strong> ${idea.createdAt.toLocaleDateString()}</div>
    `,
    html: true,
    ok: {
      label: 'Закрыть',
      color: 'primary'
    }
  });
};

const takeTask = (idea: Idea) => {
  $q.notify({
    message: `Вы взяли задачу "${idea.name}"`,
    color: 'positive',
    icon: 'check_circle'
  });
};

const resetFilters = () => {
  searchText.value = '';
  selectedInitiator.value = null;
  selectedStack.value = null;
  selectedStatus.value = null;
  selectedTeamSize.value = null;
  selectedHasReward.value = null;
  selectedCategory.value = null;
  selectedComplexity.value = null;
  deadlineFrom.value = null;
};

// Вычисляемое свойство для фильтрации идей
const filteredIdeas = computed(() => {
  return ideas.value.filter((idea: Idea) => {
    // Фильтрация по поисковому тексту
    if (searchText.value && !idea.name.toLowerCase().includes(searchText.value.toLowerCase())) {
      return false;
    }

    // Добавьте другие фильтры по мере необходимости
    // Например, фильтрация по статусу:
    if (selectedStatus.value && idea.status !== selectedStatus.value) {
      return false;
    }

    // Добавьте аналогичные проверки для других фильтров

    return true;
  });
});

// Анимация при скролле
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'how-it-works') {
            isHowItWorksVisible.value = true;
            steps.value.forEach((step, index) => {
              setTimeout(() => {
                step.visible = true;
              }, index * 200);
            });
          } else if (entry.target.id === 'tasks') {
            isTasksVisible.value = true;
          } else if (entry.target.id === 'become-customer') {
            isBecomeCustomerVisible.value = true;
          }
        }
      });
    },
    { threshold: 0.1 }
  );

  const howItWorksSection = document.getElementById('how-it-works');
  const tasksSection = document.getElementById('tasks');
  const becomeCustomerSection = document.getElementById('become-customer');

  if (howItWorksSection) observer.observe(howItWorksSection);
  if (tasksSection) observer.observe(tasksSection);
  if (becomeCustomerSection) observer.observe(becomeCustomerSection);
});
</script>



<style scoped>
.task-bank-page {
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
  z-index: 2;
  max-width: 900px;
  padding: 0 20px;
}

.text-h1 {
  font-size: 4.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
  margin-bottom: 20px;
}

.text-h4 {
  font-size: 2rem;
  max-width: 800px;
  margin: 0 auto;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  line-height: 1.4;
}

.custom-btn {
  font-size: 1.2em;
  padding: 12px 24px;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  border: none;
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
}

.custom-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

/* How It Works Section */
.how-it-works-section {
  background: white;
  color: #2a5298;
  padding: 80px 20px;
  position: relative;
  z-index: 2;
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 1s ease, transform 1s ease;
}

.how-it-works-section.visible {
  opacity: 1;
  transform: translateY(0);
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 50px;
  color: #2a5298;
  position: relative;
}

.section-title::after {
  content: '';
  display: block;
  width: 100px;
  height: 4px;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  margin: 15px auto 0;
  border-radius: 2px;
}

.steps-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 30px;
}

.step-item {
  flex: 1;
  min-width: 200px;
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease;
  opacity: 0;
  transform: translateY(30px);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.step-item.visible {
  opacity: 1;
  transform: translateY(0);
}

.step-item:hover {
  border-color: #6a11cb;
  transform: translateY(-10px) !important;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.step-number {
  font-size: 3rem;
  font-weight: bold;
  color: rgba(42, 82, 152, 0.1);
  position: absolute;
  top: 10px;
  right: 20px;
  line-height: 1;
}

.step-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: #2a5298;
}

.step-description {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.5;
}

/* Tasks Section */
.tasks-section {
  background: white;
  color: #2a5298;
  padding: 80px 20px;
  position: relative;
  z-index: 2;
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 1s ease, transform 1s ease;
}

.tasks-section.visible {
  opacity: 1;
  transform: translateY(0);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.filter-bar {
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  background: white;
}

.search-input {
  width: 100%;
}

.tasks-table {
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: flex;
  padding: 15px 20px;
  background: #f0f2f5;
  font-weight: bold;
  border-bottom: 1px solid #e0e0e0;
  color: #2a5298;
}

.header-title {
  flex: 3;
}

.header-category {
  flex: 2;
}

.header-deadline {
  flex: 2;
  text-align: center;
}

.header-actions {
  flex: 3;
  text-align: center;
}

.task-row {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}

.task-row:hover {
  background: #f9f9f9;
}

.task-title {
  flex: 3;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
}

.task-category {
  flex: 2;
  color: #333;
}

.task-deadline {
  flex: 2;
  text-align: center;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-actions {
  flex: 3;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.action-btn {
  font-weight: 500;
}

/* Become Customer Section */
.become-customer-section {
  padding: 100px 20px;
  position: relative;
  z-index: 2;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
}

.become-customer-section.visible {
  opacity: 1;
  transform: translateY(0);
}

.become-customer-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
}

.section-description {
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto 40px;
  line-height: 1.6;
  color: #555;
}

/* Balloons */
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
  animation: float 4s infinite ease-in-out;
}

/* Летающие шарики */
.balloon1 {
  background: radial-gradient(circle, rgba(173, 216, 230, 0.8), rgba(173, 216, 230, 0));
  top: 10%;
  left: 5%;
  animation-duration: 3s;
}

.balloon2 {
  background: radial-gradient(circle, rgba(135, 206, 250, 0.8), rgba(135, 206, 250, 0));
  top: 20%;
  left: 25%;
  animation-duration: 4s;
}

.balloon3 {
  background: radial-gradient(circle, rgba(100, 149, 237, 0.8), rgba(100, 149, 237, 0));
  top: 15%;
  left: 50%;
  animation-duration: 5s;
}

.balloon4 {
  background: radial-gradient(circle, rgba(70, 130, 180, 0.8), rgba(70, 130, 180, 0));
  top: 25%;
  left: 70%;
  animation-duration: 3s;
}

.balloon5 {
  background: radial-gradient(circle, rgba(30, 144, 255, 0.8), rgba(30, 144, 255, 0));
  top: 5%;
  left: 90%;
  animation-duration: 4s;
}

.balloon6 {
  background: radial-gradient(circle, rgba(0, 191, 255, 0.8), rgba(0, 191, 255, 0));
  top: 30%;
  left: 10%;
  animation-duration: 5s;
}

.balloon7 {
  background: radial-gradient(circle, rgba(173, 216, 230, 0.8), rgba(173, 216, 230, 0));
  top: 40%;
  left: 60%;
  animation-duration: 3s;
}

.balloon8 {
  background: radial-gradient(circle, rgba(135, 206, 250, 0.8), rgba(135, 206, 250, 0));
  top: 50%;
  left: 80%;
  animation-duration: 4s;
}

.balloon9 {
  background: radial-gradient(circle, rgba(100, 149, 237, 0.8), rgba(100, 149, 237, 0));
  top: 60%;
  left: 20%;
  animation-duration: 5s;
}

.balloon10 {
  background: radial-gradient(circle, rgba(70, 130, 180, 0.8), rgba(70, 130, 180, 0));
  top: 70%;
  left: 40%;
  animation-duration: 3s;
}

.balloon11 {
  background: radial-gradient(circle, rgba(30, 144, 255, 0.8), rgba(30, 144, 255, 0));
  top: 80%;
  left: 60%;
  animation-duration: 4s;
}

.balloon12 {
  background: radial-gradient(circle, rgba(0, 191, 255, 0.8), rgba(0, 191, 255, 0));
  top: 90%;
  left: 80%;
  animation-duration: 5s;
}

/* Arrow down */
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

/* Animations */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  40% {
    transform: translateY(-20px) translateX(-50%);
  }
  60% {
    transform: translateY(-10px) translateX(-50%);
  }
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-40px) translateX(40px);
  }
  50% {
    transform: translateY(20px) translateX(-20px);
  }
  75% {
    transform: translateY(-30px) translateX(30px);
  }
  100% {
    transform: translateY(0) translateX(0);
  }
}

/* Responsive styles */
@media (max-width: 1024px) {
  .header-category {
    display: none;
  }
  
  .task-category {
    display: none;
  }
}

@media (max-width: 768px) {
  .text-h1 {
    font-size: 3rem;
  }
  
  .text-h4 {
    font-size: 1.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .task-actions {
    flex-direction: column;
  }
  
  .table-header {
    display: none;
  }
  
  .task-row {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
  }
  
  .task-title {
    width: 100%;
    margin-bottom: 10px;
    font-weight: bold;
  }
  
  .task-deadline {
    width: 100%;
    text-align: left;
    margin-bottom: 15px;
  }
  
  .task-actions {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .text-h1 {
    font-size: 2.2rem;
  }
  
  .text-h4 {
    font-size: 1.2rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .become-customer-card {
    padding: 20px;
  }
  
  .filter-bar .row > div {
    width: 100%;
  }
}
</style>