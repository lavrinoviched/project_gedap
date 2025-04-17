<template>
  <q-page class="main-page">
    <!-- Hero Section -->
    <section class="hero-section flex flex-center">
      <div class="hero-overlay"></div>
      <div class="text-center hero-content">
        <h1 class="text-h1 text-weight-bold">КОМАНДЫ ПРОЕКТОВ</h1>
        <p class="text-h4 q-mt-md">Найдите свою команду или создайте новую для реализации проектов в Тюменском индустриальном университете</p>
        <div class="q-mt-lg">
          <q-btn 
            color="primary" 
            label="СОЗДАТЬ КОМАНДУ" 
            class="custom-btn" 
            @click="showCreateForm = true"
          />
        </div>
      </div>
      <div class="arrow-down" @click="scrollToTeams">
        <q-icon name="arrow_downward" size="2em" />
      </div>
      <div class="balloons">
        <div v-for="i in 20" :key="i" :class="`balloon balloon${i}`"></div>
      </div>
    </section>
    
    <q-dialog v-model="showCreateForm" persistent>
      <q-card class="create-team-dialog">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Создание новой команды</div>
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-form @submit="submitTeamForm" class="q-gutter-md">
            <q-input
              v-model="teamForm.name"
              label="Название команды"
              outlined
              :rules="[val => !!val || 'Обязательное поле']"
            />

            <q-input
              v-model="teamForm.description"
              label="Описание команды"
              type="textarea"
              outlined
              :rules="[val => !!val || 'Обязательное поле']"
            />

            <q-select
              v-model="teamForm.technologies"
              :options="technologiesOptions"
              label="Используемые технологии"
              multiple
              outlined
              use-chips
            />

            <q-select
              v-model="teamForm.competencies"
              :options="competenciesOptions"
              label="Необходимые компетенции"
              multiple
              outlined
              use-chips
            />

            <q-input
              v-model="teamForm.contact"
              label="Ваши контакты"
              outlined
              :rules="[val => !!val || 'Обязательное поле']"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="primary" v-close-popup />
          <q-btn label="Отправить" type="submit" color="primary" @click="submitTeamForm" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Teams Section -->
    <section id="teams" class="teams-section">
      <div class="container">
        <!-- Animated Header -->
        <div class="section-header" data-aos="fade-up">
          <h2 class="section-title">
            <span class="title-highlight">Найдите</span> свою команду
          </h2>
          <p class="section-subtitle">Совместная работа над инновационными проектами университета</p>
        </div>

        <!-- Filter Panel -->
        <div class="filter-panel" data-aos="fade-up" data-aos-delay="100">
          <div class="filter-toggle" @click="showFilters = !showFilters">
            <div class="filter-toggle-content">
              <q-icon :name="showFilters ? 'tune' : 'tune'" size="sm" />
              <span>{{ showFilters ? 'Скрыть фильтры' : 'Показать фильтры' }}</span>
              <q-icon :name="showFilters ? 'expand_less' : 'expand_more'" size="sm" />
            </div>
          </div>
          
          <transition name="slide-fade">
            <div class="filters-expanded" v-show="showFilters">
              <div class="filter-row">
                <q-select
                  v-model="filters.privacy"
                  :options="privacyOptions"
                  label="Тип команды"
                  outlined
                  dense
                  color="primary"
                  emit-value
                  map-options
                  class="filter-field"
                />
                
                <q-select
                  v-model="filters.status"
                  :options="statusOptions"
                  label="Статус команды"
                  outlined
                  dense
                  color="primary"
                  emit-value
                  map-options
                  class="filter-field"
                />
                
                <q-input
                  v-model="filters.search"
                  placeholder="Поиск по названию..."
                  outlined
                  dense
                  color="primary"
                  class="filter-field search-field"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              
              <div class="filter-row">
                <q-select
                  v-model="filters.competencies"
                  :options="competenciesOptions"
                  label="Необходимые компетенции"
                  outlined
                  dense
                  multiple
                  color="primary"
                  use-chips
                  emit-value
                  map-options
                  class="filter-field"
                />
                
                <q-select
                  v-model="filters.technologies"
                  :options="technologiesOptions"
                  label="Используемые технологии"
                  outlined
                  dense
                  multiple
                  color="primary"
                  use-chips
                  emit-value
                  map-options
                  class="filter-field"
                />
                
                <q-btn 
                  flat
                  color="primary"
                  label="Сбросить фильтры" 
                  @click="resetFilters"
                  class="reset-btn"
                  icon="refresh"
                />
              </div>
            </div>
          </transition>
        </div>
        
        <!-- Teams Grid -->
        <div class="teams-grid">
          <div 
            v-for="(team, index) in filteredTeams" 
            :key="team.id" 
            class="team-card"
            :class="{'team-open': team.privacy === 'Открыта'}"
            :data-aos="index % 2 === 0 ? 'fade-right' : 'fade-left'"
            :data-aos-delay="(index % 4) * 100"
          >
            <div class="team-badge" :class="team.privacy === 'Открыта' ? 'badge-open' : 'badge-closed'">
              {{ team.privacy === 'Открыта' ? 'Открытая' : 'Закрытая' }}
            </div>
            
            <div class="team-header">
              <div class="team-avatar">
                <div class="avatar-circle" :class="team.privacy === 'Открыта' ? 'avatar-open' : 'avatar-closed'">
                  <q-icon name="groups" size="lg" />
                </div>
              </div>
              <div class="team-info">
                <h3 class="team-name">{{ team.name }}</h3>
                <div class="team-meta">
                  <q-badge :color="getStatusColor(team.status)" class="status-badge">
                    {{ team.status }}
                  </q-badge>
                  <span class="team-members">
                    <q-icon name="people" size="xs" />
                    {{ team.members }} участников
                  </span>
                  <span class="team-date">
                    <q-icon name="event" size="xs" />
                    {{ team.createdAt }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="team-content">
              <p class="team-description">
                {{ team.description || 'Команда работает над интересным проектом' }}
              </p>
              
              <div class="team-tags" v-if="team.technologies.length">
                <div class="tags-title">Технологии:</div>
                <div class="tags-list">
                  <span 
                    v-for="(tech, i) in team.technologies.slice(0, 3)" 
                    :key="i"
                    class="tech-tag"
                  >
                    {{ tech }}
                  </span>
                  <span 
                    v-if="team.technologies.length > 3" 
                    class="more-tag"
                  >
                    +{{ team.technologies.length - 3 }}
                  </span>
                </div>
              </div>
              
              <div class="team-tags" v-if="team.competencies.length">
                <div class="tags-title">Компетенции:</div>
                <div class="tags-list">
                  <span 
                    v-for="(skill, i) in team.competencies" 
                    :key="i"
                    class="skill-tag"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="team-footer">
              <div class="team-actions">
                <q-btn 
                  v-if="team.privacy === 'Открыта'"
                  color="primary"
                  label="Присоединиться" 
                  icon="person_add"
                  @click="joinTeam(team)"
                  class="action-btn"
                  unelevated
                />
                <q-btn 
                  flat
                  color="primary"
                  label="Подробнее" 
                  @click="showTeamDetails(team)"
                  class="details-btn"
                  icon-right="chevron_right"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div 
          v-if="filteredTeams.length === 0" 
          class="empty-state"
          data-aos="zoom-in"
        >
          <div class="empty-icon">
            <q-icon name="search_off" size="xl" />
          </div>
          <h4>Команд не найдено</h4>
          <p>Попробуйте изменить параметры поиска или создать новую команду</p>
          <div class="empty-actions">
            <q-btn 
              color="primary"
              label="Сбросить фильтры" 
              @click="resetFilters"
              unelevated
              class="q-mr-sm"
            />
            <q-btn 
              color="secondary"
              label="Создать команду" 
              unelevated
            />
          </div>
        </div>
      </div>
    </section>
  </q-page>


  <!-- Модальное окно с деталями команды -->

  <q-dialog v-model="showTeamDialog" maximized>
  <q-card class="team-details-card" v-if="selectedTeam">
    <q-card-section class="bg-primary text-white">
      <div class="row items-center">
        <q-btn icon="arrow_back" flat round dense v-close-popup class="q-mr-sm" />
        <div>
          <div class="text-h5">{{ selectedTeam.name }}</div>
          <div class="text-subtitle2 q-mt-xs">
            <q-badge :color="selectedTeam.privacy === 'Открыта' ? 'green' : 'red'">
              {{ selectedTeam.privacy === 'Открыта' ? 'Открытая команда' : 'Закрытая команда' }}
            </q-badge>
            <q-badge :color="getStatusColor(selectedTeam.status)" class="q-ml-sm">
              {{ selectedTeam.status }}
            </q-badge>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="scroll">
      <div class="row q-col-gutter-md">
        <!-- Основная информация -->
        <div class="col-md-8">
          <!-- Описание команды -->
          <q-card flat bordered class="card-section">
            <q-card-section>
              <div class="text-h6 section-title">Описание команды</div>
              <p class="q-mt-sm team-description">{{ selectedTeam.description || 'Описание отсутствует' }}</p>
            </q-card-section>
          </q-card>

          <!-- Участники команды -->
          <q-card flat bordered class="q-mt-md card-section">
            <q-card-section>
              <div class="text-h6 section-title">Участники команды</div>
              <div class="q-mt-md members-grid">
                <!-- Владелец команды -->
                <div v-if="selectedTeam.ownerDetails" class="member-card owner">
                  <router-link :to="selectedTeam.ownerDetails.profileLink" class="member-link">
                    <q-avatar size="60px" class="q-mb-sm">
                      <img :src="selectedTeam.ownerDetails.avatar">
                    </q-avatar>
                    <div class="member-name">{{ selectedTeam.ownerDetails.name }}</div>
                    <div class="member-role">Владелец</div>
                    <div class="member-email">{{ selectedTeam.ownerDetails.email }}</div>
                  </router-link>
                </div>

                <!-- Тим-лидеры -->
                <div v-for="leader in selectedTeam.leadersDetails" :key="leader.id" class="member-card leader">
                  <router-link :to="leader.profileLink" class="member-link">
                    <q-avatar size="60px" class="q-mb-sm">
                      <img :src="leader.avatar">
                    </q-avatar>
                    <div class="member-name">{{ leader.name }}</div>
                    <div class="member-role">Тим-лидер</div>
                    <div class="member-email">{{ leader.email }}</div>
                  </router-link>
                </div>

                <!-- Обычные участники -->
                <div v-for="member in selectedTeam.regularMembers" :key="member.id" class="member-card">
                  <router-link :to="member.profileLink" class="member-link">
                    <q-avatar size="60px" class="q-mb-sm">
                      <img :src="member.avatar">
                    </q-avatar>
                    <div class="member-name">{{ member.name }}</div>
                    <div class="member-role">{{ member.role }}</div>
                    <div class="member-email">{{ member.email }}</div>
                  </router-link>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Боковая панель с деталями -->
        <div class="col-md-4">
          <!-- Информация о команде -->
          <q-card flat bordered class="card-section">
  <q-card-section>
    <div class="text-h6 section-title">Информация</div>
    <div class="info-grid q-mt-md">
      <div v-for="(detail, index) in teamDetails" :key="index" class="info-item">
        <q-icon :name="getDetailIcon(detail.label)" size="sm" color="primary" />
        <span class="info-label">{{ detail.label }}:</span>
        <span class="info-value">{{ detail.value }}</span>
      </div>
      <div class="info-item">
        <q-icon name="link" size="sm" color="primary" />
        <span class="info-label">Контакты:</span>
        <a v-if="selectedTeam?.contactLink" :href="selectedTeam.contactLink" class="info-link">
          {{ selectedTeam.contactText || 'Ссылка' }}
        </a>
        <span v-else class="info-value">Не указаны</span>
      </div>
    </div>
  </q-card-section>
</q-card>

          <!-- Используемые технологии -->
          <q-card flat bordered class="q-mt-md card-section">
            <q-card-section>
              <div class="text-h6 section-title">Технологии</div>
              <div class="q-mt-sm">
                <div class="tech-tags">
                  <q-chip v-for="tech in selectedTeam.technologies" :key="tech" color="primary" text-color="white">
                    {{ tech }}
                  </q-chip>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Необходимые компетенции -->
          <q-card flat bordered class="q-mt-md card-section">
            <q-card-section>
              <div class="text-h6 section-title">Компетенции</div>
              <div class="q-mt-sm">
                <div class="skill-tags">
                  <q-chip v-for="skill in selectedTeam.competencies" :key="skill" color="green" text-color="white">
                    {{ skill }}
                  </q-chip>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Кнопки действий -->
          <div class="q-mt-md action-buttons">
            <q-btn 
              v-if="selectedTeam.privacy === 'Открыта'"
              color="primary"
              label="Присоединиться" 
              icon="person_add"
              class="full-width q-mb-sm"
              unelevated
              @click="joinTeam(selectedTeam)"
            />
            <q-btn 
              flat
              color="primary"
              label="Закрыть" 
              v-close-popup
              class="full-width"
            />
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</q-dialog>
  </template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';



const CompetenciesTeam = ['Frontend', 'Backend', 'Дизайн', 'Аналитика', 'Менеджмент'];

const submitTeamForm = () => {
  // Здесь будет логика отправки формы
  $q.notify({
    type: 'positive',
    message: 'Заявка на создание команды отправлена на рассмотрение',
    position: 'top'
  });
  showCreateForm.value = false;
  // Очищаем форму после отправки
  teamForm.value = {
    name: '',
    privacy: 'Открытая',
    description: '',
    technologies: [],
    competencies: [],
    contact: ''
  };
};

type PrivacyType = 'Открыта' | 'Закрыта';
type StatusType = 'В поисках' | 'В работе' | 'Не активна';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
  profileLink: string;
  isOwner?: boolean;
  isLeader?: boolean;
}

interface Team {
  id: number;
  privacy: PrivacyType;
  name: string;
  status: StatusType;
  members: number;
  ownerDetails: TeamMember;
  leadersDetails: TeamMember[];
  regularMembers: TeamMember[];
  createdAt: string;
  description: string;
  technologies: string[];
  competencies: string[];
  contactLink?: string;
  contactText?: string;
}


interface Filters {
  privacy: string[];
  status: string[];
  competencies: string[];
  technologies: string[];
  search: string;
}

const filters = ref<Filters>({
  privacy: [],
  status: [],
  competencies: [],
  technologies: [],
  search: ''
});

const PryivacyTeam = [
  { label: 'Открытые команды', value: 'Открыта' },
  { label: 'Закрытые команды', value: 'Закрыта' }
];

const StatusTeam = [
  { label: 'Ищут участников', value: 'В поисках' },
  { label: 'Активно работают', value: 'В работе' },
  { label: 'Не активна', value: 'Не активна' }
];

const TechnologiesTeam = [
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 
  'PHP', 'GOLANG', 'Rust', 'Dart', 'R Lang', 'KOTLIN', 'SWIFT', 'Julia', 'XAML',
  'Node.js', 'React', 'Vue', 'Next.js', 'SpringBoot', 'Flutter',
  'Django', 'FastAPI', 'NestJS', '.NET', 'Unreal Engine',
  'MongoDB', 'SQL', 'PostgreSQL', 'MySQL', 'FireBase', 'Redis',
  'Git', 'Docker', 'TensorFlow', 'PyTorch', 'Figma', 'Photoshop'
];

const $q = useQuasar();
const showFilters = ref(true);
const showCreateForm = ref(false);
const showTeamDialog = ref(false);
const selectedTeam = ref<Team | null>(null);

const technologiesOptions = ref(TechnologiesTeam);
const competenciesOptions = ref(CompetenciesTeam);
const privacyOptions = ref(PryivacyTeam);
const statusOptions = ref(StatusTeam);

const teamForm = ref({
  name: '',
  privacy: 'Открытая',
  description: '',
  technologies: [],
  competencies: [],
  contact: ''
});


  const teams: Team[] = [
  {
    id: 1,
    privacy: 'Открыта', 
    name: 'Педагог года 2024', 
    status: 'В поисках', 
    members: 8,
    ownerDetails: {
      id: 101,
      name: 'Екатерина Сердюкова',
      email: 'e.serdyukova@university.ru',
      role: 'Преподаватель педагогики',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      profileLink: '/profile/101',
      isOwner: true
    },
    leadersDetails: [
      {
        id: 102,
        name: 'Константин Белозёров',
        email: 'k.belozerov@university.ru',
        role: 'Frontend-разработчик',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        profileLink: '/profile/102',
        isLeader: true
      },
      {
        id: 103,
        name: 'Анна Петрова',
        email: 'a.petrova@university.ru',
        role: 'UX/UI дизайнер',
        avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
        profileLink: '/profile/103',
        isLeader: true
      }
    ],
    regularMembers: [
      {
        id: 104,
        name: 'Иван Иванов',
        email: 'i.ivanov@university.ru',
        role: 'Backend-разработчик',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        profileLink: '/profile/104'
      },
      {
        id: 105,
        name: 'Мария Смирнова',
        email: 'm.smirnova@university.ru',
        role: 'Аналитик данных',
        avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
        profileLink: '/profile/105'
      },
      {
        id: 106,
        name: 'Алексей Козлов',
        email: 'a.kozlov@university.ru',
        role: 'Тестировщик',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        profileLink: '/profile/106'
      }
    ],
    createdAt: '03.07.2024',
    description: 'Разработка образовательной платформы для конкурса "Педагог года" с интерактивными модулями обучения и системой оценки',
    technologies: ['Vue.js', 'TypeScript', 'Node.js', 'MongoDB', 'Figma'],
    competencies: ['Frontend', 'Backend', 'Дизайн', 'Аналитика'],
    contactLink: 'https://t.me/team_pedagog',
    contactText: 'Telegram чат'
  },
  {
    id: 2,
    privacy: 'Открыта', 
    name: 'Команда ВШЦТ 24', 
    status: 'В поисках', 
    members: 9,
    ownerDetails: {
      id: 201,
      name: 'Дмитрий Волков',
      email: 'd.volkov@university.ru',
      role: 'Руководитель ВШЦТ',
      avatar: 'https://randomuser.me/api/portraits/men/28.jpg',
      profileLink: '/profile/201',
      isOwner: true
    },
    leadersDetails: [
      {
        id: 202,
        name: 'Ольга Новикова',
        email: 'o.novikova@university.ru',
        role: 'Project Manager',
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
        profileLink: '/profile/202',
        isLeader: true
      }
    ],
    regularMembers: [
      {
        id: 203,
        name: 'Артём Морозов',
        email: 'a.morozov@university.ru',
        role: 'Fullstack разработчик',
        avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
        profileLink: '/profile/203'
      },
      {
        id: 204,
        name: 'Елена Васнецова',
        email: 'e.vasnecova@university.ru',
        role: 'Бизнес-аналитик',
        avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
        profileLink: '/profile/204'
      },
      {
        id: 205,
        name: 'Павел Гусев',
        email: 'p.gusev@university.ru',
        role: 'DevOps инженер',
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
        profileLink: '/profile/205'
      },
      {
        id: 206,
        name: 'Юлия Крылова',
        email: 'u.krylova@university.ru',
        role: 'Тестировщик',
        avatar: 'https://randomuser.me/api/portraits/women/77.jpg',
        profileLink: '/profile/206'
      }
    ],
    createdAt: '31.05.2024',
    description: 'Разработка внутренних проектов института, включая систему управления образовательным процессом и аналитическую платформу',
    technologies: ['PHP', 'Laravel', 'MySQL', 'JavaScript', 'Docker'],
    competencies: ['Backend', 'Аналитика', 'DevOps'],
    contactLink: 'https://t.me/team_VSHCT',
    contactText: 'Telegram канал'
  },
  {
    id: 3,
    privacy: 'Открыта', 
    name: 'ANNIHOMESHARING', 
    status: 'В работе', 
    members: 5,
    ownerDetails: {
      id: 301,
      name: 'Александр Киреев',
      email: 'a.kireev@university.ru',
      role: 'Основатель проекта',
      avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
      profileLink: '/profile/301',
      isOwner: true
    },
    leadersDetails: [
      {
        id: 302,
        name: 'Виктория Медведева',
        email: 'v.medvedeva@university.ru',
        role: 'Frontend Lead',
        avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
        profileLink: '/profile/302',
        isLeader: true
      }
    ],
    regularMembers: [
      {
        id: 303,
        name: 'Глеб Соколов',
        email: 'g.sokolov@university.ru',
        role: 'Backend разработчик',
        avatar: 'https://randomuser.me/api/portraits/men/53.jpg',
        profileLink: '/profile/303'
      },
      {
        id: 304,
        name: 'Алина Полякова',
        email: 'a.polyakova@university.ru',
        role: 'Дизайнер интерфейсов',
        avatar: 'https://randomuser.me/api/portraits/women/38.jpg',
        profileLink: '/profile/304'
      }
    ],
    createdAt: '16.09.2024',
    description: 'Сервис для совместного проживания студентов с системой рейтинга и подбора соседей на основе совместимости',
    technologies: ['Golang', 'Vue.js', 'PostgreSQL', 'Redis', 'Figma'],
    competencies: ['Frontend', 'Backend', 'Дизайн'],
    contactLink: '',
    contactText: ''
  },
  {
    id: 4,
    privacy: 'Закрыта', 
    name: 'Data Dreamers', 
    status: 'Не активна', 
    members: 4,
    ownerDetails: {
      id: 401,
      name: 'Сергей Миронов',
      email: 's.mironov@university.ru',
      role: 'Data Scientist',
      avatar: 'https://randomuser.me/api/portraits/men/19.jpg',
      profileLink: '/profile/401',
      isOwner: true
    },
    leadersDetails: [],
    regularMembers: [
      {
        id: 402,
        name: 'Антон Жуков',
        email: 'a.zhukov@university.ru',
        role: 'Data Engineer',
        avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
        profileLink: '/profile/402'
      },
      {
        id: 403,
        name: 'Наталья Воробьёва',
        email: 'n.vorobyeva@university.ru',
        role: 'Аналитик данных',
        avatar: 'https://randomuser.me/api/portraits/women/51.jpg',
        profileLink: '/profile/403'
      },
      {
        id: 404,
        name: 'Денис Павлов',
        email: 'd.pavlov@university.ru',
        role: 'ML Engineer',
        avatar: 'https://randomuser.me/api/portraits/men/74.jpg',
        profileLink: '/profile/404'
      }
    ],
    createdAt: '21.09.2024',
    description: 'Анализ образовательных данных для улучшения учебного процесса и прогнозирования успеваемости студентов',
    technologies: ['Python', 'Pandas', 'PyTorch', 'SQL', 'Tableau'],
    competencies: ['Аналитика', 'Машинное обучение'],
    contactLink: '',
    contactText: ''
  },
  {
    id: 5,
    privacy: 'Открыта', 
    name: 'VR Lab', 
    status: 'В поисках', 
    members: 3,
    ownerDetails: {
      id: 501,
      name: 'Игорь Семёнов',
      email: 'i.semenov@university.ru',
      role: 'Преподаватель VR-технологий',
      avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
      profileLink: '/profile/501',
      isOwner: true
    },
    leadersDetails: [
      {
        id: 502,
        name: 'Кирилл Борисов',
        email: 'k.borisov@university.ru',
        role: '3D Artist',
        avatar: 'https://randomuser.me/api/portraits/men/25.jpg',
        profileLink: '/profile/502',
        isLeader: true
      }
    ],
    regularMembers: [
      {
        id: 503,
        name: 'Светлана Кузнецова',
        email: 's.kuznecova@university.ru',
        role: 'Unity разработчик',
        avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
        profileLink: '/profile/503'
      }
    ],
    createdAt: '10.10.2024',
    description: 'Разработка VR-приложений для образовательных целей в технических дисциплинах (физика, химия, инженерия)',
    technologies: ['Unreal Engine', 'C++', 'Blender', 'Unity', '3D моделирование'],
    competencies: ['Дизайн', 'GameDev', '3D моделирование'],
    contactLink: 'https://t.me/vr_lab_team',
    contactText: 'Telegram чат'
  },
  {
    id: 6,
    privacy: 'Открыта', 
    name: 'Eco Campus', 
    status: 'В работе', 
    members: 7,
    ownerDetails: {
      id: 601,
      name: 'Анна Зеленая',
      email: 'a.zelenaya@university.ru',
      role: 'Руководитель эко-проектов',
      avatar: 'https://randomuser.me/api/portraits/women/60.jpg',
      profileLink: '/profile/601',
      isOwner: true
    },
    leadersDetails: [
      {
        id: 602,
        name: 'Максим Фетюков',
        email: 'm.lesnoy@university.ru',
        role: 'Tech Lead',
        avatar: 'https://randomuser.me/api/portraits/men/70.jpg',
        profileLink: '/profile/602',
        isLeader: true
      },
      {
        id: 603,
        name: 'Екатерина Гриб',
        email: 'e.rechnaya@university.ru',
        role: 'Product Manager',
        avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
        profileLink: '/profile/603',
        isLeader: true
      }
    ],
    regularMembers: [
      {
        id: 604,
        name: 'Артур Солнечный',
        email: 'a.solnechny@university.ru',
        role: 'IoT разработчик',
        avatar: 'https://randomuser.me/api/portraits/men/15.jpg',
        profileLink: '/profile/604'
      },
      {
        id: 605,
        name: 'Дарья Цветкова',
        email: 'd.cvetkova@university.ru',
        role: 'Data Analyst',
        avatar: 'https://randomuser.me/api/portraits/women/31.jpg',
        profileLink: '/profile/605'
      },
      {
        id: 606,
        name: 'Роман Громов',
        email: 'r.gromov@university.ru',
        role: 'Backend разработчик',
        avatar: 'https://randomuser.me/api/portraits/men/48.jpg',
        profileLink: '/profile/606'
      }
    ],
    createdAt: '05.09.2024',
    description: 'Проект по автоматизации мониторинга энергопотребления в кампусе и оптимизации ресурсов с использованием IoT и анализа данных',
    technologies: ['Python', 'Django', 'IoT', 'PostgreSQL', 'Grafana'],
    competencies: ['Backend', 'Аналитика', 'IoT'],
    contactLink: 'mailto:eco.campus@university.ru',
    contactText: 'Написать email'
  }
];


const scrollToTeams = () => {
  const teamsSection = document.getElementById('teams');
  if (teamsSection) {
    teamsSection.scrollIntoView({ behavior: 'smooth' });
  }
};

const getStatusColor = (status: string): string => {
  switch(status) {
    case 'В поисках': return 'orange';
    case 'В работе': return 'green';
    case 'Не активна': return 'grey';
    default: return 'blue';
  }
};

const getDetailIcon = (label: string) => {
  switch(label) {
    case 'Владелец команды': return 'person';
    case 'Тим-лидеры': return 'group';
    case 'Дата создания': return 'event';
    case 'Количество участников': return 'people';
    default: return 'info';
  }
};

const showTeamDetails = (team: Team) => {
  selectedTeam.value = team;
  showTeamDialog.value = true;
  $q.notify({
    type: 'info',
    message: `Подробности о команде "${team.name}"`,
    position: 'top'
  });
};

const joinTeam = (team: Team) => {
  $q.notify({
    type: 'positive',
    message: `Запрос на присоединение к команде "${team.name}" отправлен`,
    position: 'top'
  });
};

const resetFilters = () => {
  filters.value = {
    privacy: [],
    status: [],
    competencies: [],
    technologies: [],
    search: ''
  };
};

const filteredTeams = computed<Team[]>(() => {
  return teams.filter((team: Team) => { // убрали .value и указали тип team
    if (filters.value.privacy.length > 0) {
      const privacyMatch = filters.value.privacy.some(p => 
        (p === 'Открыта' && team.privacy === 'Открыта') ||
        (p === 'Закрыта' && team.privacy === 'Закрыта')
      );
      if (!privacyMatch) return false;
    }
    
    if (filters.value.status.length > 0 && !filters.value.status.includes(team.status)) {
      return false;
    }
    
    if (filters.value.competencies.length > 0) {
      const hasCompetency = filters.value.competencies.some(c => 
        team.competencies.includes(c)
      );
      if (!hasCompetency) return false;
    }
    
    if (filters.value.technologies.length > 0) {
      const hasTechnology = filters.value.technologies.some(t => 
        team.technologies.includes(t)
      );
      if (!hasTechnology) return false;
    }
    
    if (filters.value.search && !team.name.toLowerCase().includes(filters.value.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });
});

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  const teamsSection = document.getElementById('teams');
  if (teamsSection) observer.observe(teamsSection);
});

const teamDetails = computed(() => {
  if (!selectedTeam.value) return [];
  
  return [
    { 
      label: 'Владелец команды', 
      value: selectedTeam.value.ownerDetails?.name || 'Не указан' 
    },
    { 
      label: 'Тим-лидеры', 
      value: selectedTeam.value.leadersDetails?.map(l => l.name).join(', ') || 'Не указаны' 
    },
    { 
      label: 'Дата создания', 
      value: selectedTeam.value.createdAt 
    },
    { 
      label: 'Количество участников', 
      value: selectedTeam.value.members 
    }
  ];
});
</script>

<style scoped lang="scss">
/* Основные стили */
.main-page {
  background: #f8fafc;
  color: #1e293b;
  font-family: 'Inter', sans-serif;
}

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

.custom-btn {
  font-size: 1.2em;
  padding: 10px 20px;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  border: none;
  color: white;
  border-radius: 8px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.custom-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.text-h1 {
  font-size: 4rem;
  font-weight: bold;
  color: white;
}

.text-h4 {
  color: white;
}

.arrow-down {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  animation: bounce 2s infinite;
  color: white;
  z-index: 2;
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

.balloons {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
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

/* Цвета шариков */
.balloon1 { background: radial-gradient(circle, rgba(173, 216, 230, 0.8), rgba(173, 216, 230, 0)); top: 10%; left: 5%; animation-duration: 3s; }
.balloon2 { background: radial-gradient(circle, rgba(135, 206, 250, 0.8), rgba(135, 206, 250, 0)); top: 20%; left: 25%; animation-duration: 4s; }
.balloon3 { background: radial-gradient(circle, rgba(100, 149, 237, 0.8), rgba(100, 149, 237, 0)); top: 15%; left: 50%; animation-duration: 5s; }
.balloon4 { background: radial-gradient(circle, rgba(70, 130, 180, 0.8), rgba(70, 130, 180, 0)); top: 25%; left: 70%; animation-duration: 3s; }
.balloon5 { background: radial-gradient(circle, rgba(30, 144, 255, 0.8), rgba(30, 144, 255, 0)); top: 5%; left: 90%; animation-duration: 4s; }
.balloon6 { background: radial-gradient(circle, rgba(0, 191, 255, 0.8), rgba(0, 191, 255, 0)); top: 30%; left: 10%; animation-duration: 5s; }
.balloon7 { background: radial-gradient(circle, rgba(173, 216, 230, 0.8), rgba(173, 216, 230, 0)); top: 40%; left: 60%; animation-duration: 3s; }
.balloon8 { background: radial-gradient(circle, rgba(135, 206, 250, 0.8), rgba(135, 206, 250, 0)); top: 50%; left: 80%; animation-duration: 4s; }
.balloon9 { background: radial-gradient(circle, rgba(100, 149, 237, 0.8), rgba(100, 149, 237, 0)); top: 60%; left: 20%; animation-duration: 5s; }
.balloon10 { background: radial-gradient(circle, rgba(70, 130, 180, 0.8), rgba(70, 130, 180, 0)); top: 70%; left: 40%; animation-duration: 3s; }
.balloon11 { background: radial-gradient(circle, rgba(30, 144, 255, 0.8), rgba(30, 144, 255, 0)); top: 80%; left: 60%; animation-duration: 4s; }
.balloon12 { background: radial-gradient(circle, rgba(0, 191, 255, 0.8), rgba(0, 191, 255, 0)); top: 90%; left: 80%; animation-duration: 5s; }

@keyframes float {
  0% { transform: translateY(0) translateX(0); }
  25% { transform: translateY(-40px) translateX(40px); }
  50% { transform: translateY(20px) translateX(-20px); }
  75% { transform: translateY(-30px) translateX(30px); }
  100% { transform: translateY(0) translateX(0); }
}
/* Teams Section */
.teams-section {
  background: #f8fafc;
  padding: 100px 0;
  position: relative;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #242053;
  margin-bottom: 16px;
  position: relative;
  display: inline-block;
  line-height: 1.3;
}

.title-highlight {
  position: relative;
  z-index: 1;
}

.title-highlight::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 0;
  width: 100%;
  height: 12px;
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.3), rgba(99, 102, 241, 0));
  z-index: -1;
  transform-origin: left;
  animation: highlight 1.5s ease forwards;
}

@keyframes highlight {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.create-team-dialog {
  width: 100%;
  max-width: 600px;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Filter Panel */
.filter-panel {
  background: white;
  border-radius: 16px;
  margin-bottom: 40px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.03), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.filter-toggle {
  padding: 16px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f1f5f9;
}

.filter-toggle:hover {
  background: #f8fafc;
}

.filter-toggle-content {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #64748b;
  font-weight: 500;
  justify-content: center;
}

.filters-expanded {
  padding: 24px;
  background: #f8fafc;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-field {
  flex: 1;
  min-width: 200px;
}

.search-field {
  flex: 2;
}

.reset-btn {
  margin-left: auto;
  font-weight: 500;
}

/* Teams Grid */
.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 30px;
}

/* Team Card */
.team-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(45, 37, 103, 0.05);
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
}

.team-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-color: #c7d2fe;
}

.team-badge {
  position: absolute;
  top: 16px;
  right: -30px;
  width: 120px;
  padding: 4px 0;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  transform: rotate(45deg);
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.badge-open {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
}

.badge-closed {
  background: linear-gradient(135deg, #64748b 0%, #94a3b8 100%);
}

.team-header {
  display: flex;
  padding: 24px;
  background: white;
  position: relative;
  z-index: 1;
}

.team-avatar {
  margin-right: 16px;
}

.avatar-circle {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e0e7ff;
  color: #4f46e5;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.avatar-open {
  background: #e0e7ff;
  color: #4f46e5;
}

.avatar-closed {
  background: #f1f5f9;
  color: #64748b;
}

.team-info {
  flex: 1;
  min-width: 0;
}

.team-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.team-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.8rem;
  color: #64748b;
}

.status-badge {
  font-size: 0.7rem;
  padding: 4px 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.team-members, .team-date {
  display: flex;
  align-items: center;
  gap: 4px;
}

.team-content {
  padding: 0 24px 16px 24px;
  flex: 1;
}

.team-description {
  color: #475569;
  margin-bottom: 16px;
  line-height: 1.6;
  font-size: 0.95rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3; /* Добавлено стандартное свойство */
  overflow: hidden;
}

.team-tags {
  margin-bottom: 16px;
}

.tags-title {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 6px;
  font-weight: 500;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tech-tag {
  background: #e0e7ff;
  color: #4f46e5;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.skill-tag {
  background: #ecfdf5;
  color: #059669;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.more-tag {
  background: #f1f5f9;
  color: #64748b;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 500;
}

.team-footer {
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
  margin-top: auto;
}

.team-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.details-btn {
  font-weight: 500;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.03);
  margin-top: 40px;
  border: 1px dashed #e2e8f0;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 50%;
  color: #94a3b8;
}

.empty-state h4 {
  color: #1e293b;
  margin: 20px 0 10px;
  font-size: 1.5rem;
  font-weight: 700;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 24px;
  font-size: 1rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.empty-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

/* Animations */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .teams-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
  
  .filter-row {
    flex-direction: column;
    gap: 12px;
  }
  
  .filter-field, .search-field {
    width: 100%;
  }
  
  .reset-btn {
    margin-left: 0;
    width: 100%;
  }
  
  .button-container {
    flex-direction: column;
    gap: 12px;
  }
  
  .text-h1 {
    font-size: 2.5rem;
  }
  
  .text-h4 {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .team-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .team-avatar {
    margin-bottom: 12px;
  }
  
  .team-actions {
    flex-direction: column;
  }
}
/* Добавляем новые стили для диалога */
.team-details-card {
  width: 100%;
  max-width: 1200px;
  border-radius: 12px;
  overflow: hidden;
  
  .card-section {
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    transition: box-shadow 0.3s;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
  }
  
  .section-title {
    position: relative;
    padding-bottom: 8px;
    color: #090f18;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50px;
      height: 3px;
      background: linear-gradient(90deg, #6366f1, #8b5cf6);
      border-radius: 3px;
    }
  }
  
  .team-description {
    color: #475569;
    line-height: 1.6;
    font-size: 1rem;
  }
  
  .members-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }
  
  .member-card {
    padding: 16px;
    border-radius: 8px;
    background: #f8fafc;
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }
    
    &.owner {
      background: linear-gradient(135deg, #f3e8ff, #e9d5ff);
      border-left: 3px solid #8b5cf6;
    }
    
    &.leader {
      background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
      border-left: 3px solid #6366f1;
    }
  }
  
  .member-link {
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .member-name {
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 4px;
  }
  
  .member-role {
    font-size: 0.8rem;
    color: #64748b;
    margin-bottom: 4px;
  }
  
  .member-email {
    font-size: 0.75rem;
    color: #94a3b8;
    word-break: break-all;
  }
  
  .info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}


  .info-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f8fafc;
  border-radius: 8px;
}
  
.info-label {
  font-weight: 500;
  color: #64748b;
}
  
.info-label {
  font-weight: 500;
  color: #64748b;
}
  
.info-link {
  color: #6366f1;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
  
  .tech-tags, .skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .team-details-card {
    .members-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
  }
}

@media (max-width: 600px) {
  .team-details-card {
    .row {
      flex-direction: column;
    }
    
    .col-md-4, .col-md-8 {
      width: 100%;
    }
  }
}
</style>