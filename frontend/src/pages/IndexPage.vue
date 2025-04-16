<template>
  <q-page class="main-page">
    <!-- Hero Section -->
    <section class="hero-section flex flex-center">
      <div class="hero-overlay"></div>
      <div class="text-center hero-content">
        <h1 class="text-h1 text-weight-bold">БИРЖА ПРОЕКТОВ</h1>
        <p class="text-h4 q-mt-md">Биржа проектов – это единая платформа проектной деятельности Тюменского индустриального университета института Высшей цифровой школы технологий</p>
        <div class="q-mt-lg button-container">
          <q-btn color="primary" label="СОЗДАТЬ ПРОЕКТ" class="custom-btn q-mr-md" />
          <q-btn color="primary" label="АВТОРИЗАЦИЯ" class="custom-btn" />
        </div>
      </div>
      <div class="arrow-down" @click="scrollToAbout">
        <q-icon name="arrow_downward" size="2em" />
      </div>
      <div class="balloons">
        <div v-for="i in 20" :key="i" :class="`balloon balloon${i}`"></div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about-section q-pa-xl section-card" ref="aboutSection">
      <div class="text-center">
        <h2 class="text-h4 text-weight-bold">О нас</h2>
        <div class="row q-mt-md">
          <div class="col-12">
            <p class="q-mt-md">
              «Биржа проектов ВШЦТ» — это платформа, которая объединяет студентов и преподавателей университета для обмена идеями и совместной работы над проектами. Здесь вы сможете найти интересные задачи, предложить свои идеи и получить помощь от опытных наставников.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works-section q-pa-xl section-card" ref="howItWorksSection">
      <h2 class="text-h4 text-weight-bold text-center">Как работать на платформе</h2>
      <div class="row q-mt-lg">
        <div class="col-12 col-md-4 q-pa-md" v-for="(step, index) in steps" :key="index">
          <q-card class="text-center custom-card">
            <q-card-section>
              <q-icon :name="step.icon" size="3em" class="q-mb-md" />
              <div class="text-h6">{{ step.title }}</div>
              <p>{{ step.description }}</p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>

    <!-- Project Application Section -->
    <section class="application-section q-pa-xl section-card" ref="applicationSection">
      <div class="text-center">
        <h2 class="text-h4 text-weight-bold">У Вас есть уникальная идея или Вы хотите стать заказчиком проекта?</h2>
        
        <q-form @submit="onSubmit" class="q-mt-lg form-container">
          <!-- ФИО -->
          <q-input
            v-model="formData.fullName"
            label="ФИО*"
            outlined
            class="q-mb-md"
            :rules="[val => !!val || 'Обязательное поле']"
          />
          
          <!-- Телефон -->
          <q-input
            v-model="formData.phone"
            label="Телефон*"
            outlined
            class="q-mb-md"
            mask="+7 (###) ###-##-##"
            :rules="[
              val => !!val || 'Обязательное поле',
              val => val.replace(/\D/g, '').length === 11 || 'Введите корректный номер'
            ]"
          />
          
          <!-- Email -->
          <q-input
            v-model="formData.email"
            label="Email*"
            outlined
            class="q-mb-md"
            type="email"
            :rules="[
              val => !!val || 'Обязательное поле',
              val => /.+@.+\..+/.test(val) || 'Некорректный email'
            ]"
          />
      
          
          <!-- Описание проекта -->
          <q-input
            v-model="formData.description"
            label="Опишите ваш проект или идею*"
            type="textarea"
            outlined
            class="q-mb-md"
            :rules="[val => !!val || 'Обязательное поле']"
          />
          
          <q-btn
            type="submit"
            color="primary"
            label="Подать заявку"
            class="custom-btn submit-btn"
            :loading="submitting"
          />
        </q-form>
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const submitting = ref(false);

// Шаги работы
const steps = ref([
  {
    title: '1. ОПРЕДЕЛИ ФОРМАТ РАБОТЫ С ПРОЕКТОМ',
    description: 'На платформе доступны такие форматы работы, как участие в проекте или организация собственного проекта.',
    icon: 'fas fa-lightbulb'
  },
  {
    title: '2. ЗАПОЛНИ ФОРМУ ОРГАНИЗАТОРА ИЛИ УЧАСТНИКА ПРОЕКТА',
    description: 'Заполнить форму можно прямо на сайте.',
    icon: 'fas fa-edit'
  },
  {
    title: '3. ДОЖДИСЬ ИНФОРМАЦИИ ОТ ДИРЕКЦИИ "БИРЖИ ПРОЕКТОВ"',
    description: 'После того, как Ваш проект или Ваше участие будут утверждены, Вы получите уведомление на электронную почту.',
    icon: 'fas fa-envelope'
  }
]);



// Данные формы
const formData = ref({
  fullName: '',
  phone: '',
  email: '',
  company: '',
  requestType: null,
  description: ''
});

// Отправка формы
const onSubmit = async () => {
  try {
    submitting.value = true;
    
    // Подготовка данных
    const payload = {
      ...formData.value,
      phone: formData.value.phone.replace(/\D/g, '') // Очистка номера телефона
    };

    // Здесь будет реальный API-запрос
    console.log('Отправка данных:', payload);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация запроса
    
    $q.notify({
      type: 'positive',
      message: 'Заявка отправлена!',
      caption: 'Мы свяжемся с вами в ближайшее время',
      position: 'top'
    });
    
    // Сброс формы
    formData.value = {
      fullName: '',
      phone: '',
      email: '',
      company: '',
      requestType: null,
      description: ''
    };
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Ошибка отправки',
      caption: 'Попробуйте еще раз позже',
      position: 'top'
    });
  } finally {
    submitting.value = false;
  }
};

// Прокрутка к секции
const scrollToAbout = () => {
  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    aboutSection.scrollIntoView({ behavior: 'smooth' });
  }
};

// Анимация появления секций
const aboutSection = ref<HTMLElement | null>(null);
const howItWorksSection = ref<HTMLElement | null>(null);
const applicationSection = ref<HTMLElement | null>(null);

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

  if (aboutSection.value) observer.observe(aboutSection.value);
  if (howItWorksSection.value) observer.observe(howItWorksSection.value);
  if (applicationSection.value) observer.observe(applicationSection.value);
});
</script>

<style scoped>
/* Основные стили (сохранены из оригинала) */
.main-page {
  background: white;
  color: #2a5298;
  font-family: 'Roboto', sans-serif;
  position: relative;
  overflow: hidden;
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

.section-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin: 40px auto;
  max-width: 1200px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 1.5s ease-out, transform 1.5s ease-out;
  padding: 50px;
}

.section-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.custom-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.custom-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
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

.submit-btn {
  width: 100%;
  max-width: 300px;
  margin-top: 20px;
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

.section-card h2 {
  color: #2a5298;
}

.section-card p {
  color: #555;
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

/* Адаптивность */
@media (max-width: 768px) {
  .text-h1 { font-size: 2.5rem; }
  .text-h4 { font-size: 1.2rem; }
  .button-container { flex-direction: column; gap: 10px; }
  .section-card { padding: 30px 20px; margin: 20px auto; }
}

/* Стили формы */
.form-container {
  max-width: 600px;
  margin: 0 auto;
}

.q-field {
  margin-bottom: 16px;
}

.q-field--outlined .q-field__control:before {
  border-color: rgba(0, 0, 0, 0.12);
}

.q-field--outlined .q-field__control:hover:before {
  border-color: rgba(0, 0, 0, 0.24);
}

.q-field--highlighted .q-field__control:after {
  background: #2a5298;
}
</style>