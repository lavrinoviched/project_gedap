<template>
  <main>
    <form class="form" @submit.prevent="onSignUp">
      <div class="form__cover"></div>
      <div class="form__loader" v-if="loading">
        <div class="spinner active">
          <svg class="spinner__circular" viewBox="25 25 50 50">
            <circle class="spinner__path" cx="50" cy="50" r="20" fill="none" stroke-width="4" stroke-miterlimit="10"></circle>
          </svg>
        </div>
      </div>
      <div class="form__content" :class="{ 'visible': !loading }">
        <h1 class="form__title">Регистрация</h1>
        <div class="styled-input" v-for="(input, index) in inputs" :key="index">
          <input
            class="styled-input__input"
            v-model="input.value"
            @focus="onFocus(index)"
            @blur="onBlur(index)"
            :type="input.type"
          />
          <div class="styled-input__placeholder" :ref="`placeholder-${index}`">
            <span class="styled-input__placeholder-text">{{ input.placeholder }}</span>
          </div>
          <div class="styled-input__circle"></div>
        </div>
        <div class="button-group">
          <button type="submit" class="styled-button">
            <span class="styled-button__text">Регистрация</span>
            <span class="styled-button__wave"></span>
          </button>
          <button type="button" class="styled-button secondary" @click="onReturn">
            <span class="styled-button__text">Назад</span>
            <span class="styled-button__wave"></span>
          </button>
        </div>
      </div>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { gsap } from 'gsap';
import { useQuasar } from 'quasar';
import * as api from 'src/api/auth.api';

const router = useRouter();
const $q = useQuasar();

const loading = ref(true);

// Обновите тип данных для inputs
interface InputField {
  value: string;
  placeholder: string;
  type: string;
  filled?: boolean; // Добавьте свойство filled
}

const inputs = ref<InputField[]>([
  { value: '', placeholder: 'Логин', type: 'text' },
  { value: '', placeholder: 'Пароль', type: 'password' },
  { value: '', placeholder: 'Имя', type: 'text' },
  { value: '', placeholder: 'Фамилия', type: 'text' }
]);

const onFocus = (index: number) => {
  inputs.value[index].filled = true; // Теперь TypeScript знает, что filled существует
  placeholderAnimationIn(index, true);
};

const onBlur = (index: number) => {
  if (!inputs.value[index].value.length) {
    inputs.value[index].filled = false; // Теперь TypeScript знает, что filled существует
    placeholderAnimationIn(index, false);
  }
};

const placeholderAnimationIn = (index: number, action: boolean) => {
  const letters = document.querySelectorAll('.styled-input__placeholder')[index].children;
  const act = action ? 'add' : 'remove';
  const lettersArray = Array.from(letters);
  if (!action) lettersArray.reverse();
  lettersArray.forEach((el, i) => {
    setTimeout(() => {
      el.classList[act]('active');
    }, 50 * i);
  });
};

const onReturn = () => {
  router.push({ path: '/login' });
};

const onSignUp = async () => {
  // Валидация полей
  if (!inputs.value[0].value || !inputs.value[1].value || 
      !inputs.value[2].value || !inputs.value[3].value) {
    $q.notify({
      message: 'Ошибка',
      caption: 'Все поля обязательны для заполнения',
      color: 'red',
      icon: 'error'
    });
    return;
  }

  try {
    const result = await api.signup({
      username: inputs.value[0].value,
      password: inputs.value[1].value,
      firstname: inputs.value[2].value,
      lastname: inputs.value[3].value
    });

    if (result.success) {
      $q.notify({
        message: 'Успешно',
        caption: 'Пользователь успешно создан. Ожидайте активации.',
        color: 'green',
        icon: 'verified'
      });
      router.push('/login');
    } else {
      $q.notify({
        message: 'Ошибка',
        caption: result.message || 'Не удалось создать пользователя',
        color: 'red',
        icon: 'error'
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    $q.notify({
      message: 'Ошибка',
      caption: 'Произошла непредвиденная ошибка',
      color: 'red',
      icon: 'error'
    });
  }
};

onMounted(() => {
  gsap.from('.form__title', {
    duration: 1,
    y: -50,
    opacity: 0,
    ease: 'power3.out'
  });

  gsap.from('.styled-input', {
    duration: 1,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    ease: 'power3.out'
  });

  gsap.from('.button-group', {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power3.out'
  });

  setTimeout(() => {
    loading.value = false;
  }, 1800);
});
</script>

<style scoped>
/* Основные стили */
@import url('https://fonts.googleapis.com/css?family=Roboto');

body {
  all: initial;
  font-family: 'Roboto', sans-serif;
  letter-spacing: 0.02em;
}

* {
  box-sizing: border-box;
}

main {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); /* Градиентный фон */
}

.form {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 400px;
  height: auto;
  flex-shrink: 0;
  padding: 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.form__title {
  color: white;
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
}

.styled-input {
  position: relative;
  margin-bottom: 20px;
}

.styled-input__input {
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 2px solid white;
  background: transparent;
  color: white;
  font-size: 1rem;
  outline: none;
}

.styled-input__placeholder {
  position: absolute;
  top: 10px;
  left: 10px;
  pointer-events: none;
  transition: all 0.3s ease;
}

.styled-input__placeholder-text {
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.styled-input__input:focus + .styled-input__placeholder,
.styled-input__input:not(:placeholder-shown) + .styled-input__placeholder {
  top: -10px;
  font-size: 0.8rem;
  color: #00bcd4; /* Голубой цвет для акцента */
}

.styled-input__circle {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #00bcd4; /* Голубой цвет для акцента */
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.styled-input__input:focus ~ .styled-input__circle {
  transform: scaleX(1);
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.styled-button {
  position: relative;
  padding: 10px 20px;
  border: none;
  background: #2196f3; /* Синий цвет */
  color: white;
  font-size: 1rem;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  min-width: 120px;
  text-align: center;
}

.styled-button.secondary {
  background: #ff7f50; /* Оранжевый цвет для кнопки "Назад" */
}

.styled-button:hover {
  background: #1976d2; /* Темно-синий цвет при наведении */
}

.styled-button.secondary:hover {
  background: #ff6347; /* Темно-оранжевый цвет при наведении */
}

.styled-button__text {
  position: relative;
  z-index: 2;
}

.styled-button__wave {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%) scale(0);
  border-radius: 50%;
  transition: transform 0.5s ease;
  z-index: 1;
}

.styled-button:hover .styled-button__wave {
  transform: translate(-50%, -50%) scale(1);
}
</style>
  