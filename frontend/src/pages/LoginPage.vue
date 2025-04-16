<template>
  <main>
    <form class="form" @submit.prevent="onLogin">
      <div class="form__cover"></div>
      <div class="form__loader" v-if="loading">
        <div class="spinner active">
          <svg class="spinner__circular" viewBox="25 25 50 50">
            <circle class="spinner__path" cx="50" cy="50" r="20" fill="none" stroke-width="4" stroke-miterlimit="10"></circle>
          </svg>
        </div>
      </div>
      <div class="form__content" :class="{ 'visible': !loading }">
        <h1 class="form__title">Авторизация</h1>
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
            <span class="styled-button__text">Вход</span>
            <span class="styled-button__wave"></span>
          </button>
          <button type="button" class="styled-button" @click="onSignUp">
            <span class="styled-button__text">Регистрация</span>
            <span class="styled-button__wave"></span>
          </button>
        </div>
      </div>
    </form>
  </main>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { gsap } from 'gsap';
import * as api from '../api/auth.api';  // Ensure correct API import
import { useMainStore } from 'src/stores/main-store';
import { useQuasar } from 'quasar';

export default {
  setup() {
    const router = useRouter();
    const mainStore = useMainStore();
    const $q = useQuasar();

    const loading = ref(true);
    const inputs = ref([
      { value: '', placeholder: 'Логин', type: 'text' },
      { value: '', placeholder: 'Пароль', type: 'password' }
    ]);

    const onFocus = (index) => {
      inputs.value[index].filled = true;
      placeholderAnimationIn(index, true);
    };

    const onBlur = (index) => {
      if (!inputs.value[index].value.length) {
        inputs.value[index].filled = false;
        placeholderAnimationIn(index, false);
      }
    };

    const placeholderAnimationIn = (index, action) => {
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

    const onLogin = async () => {
      let response;

      try {
        response = await api.login(inputs.value[0].value, inputs.value[1].value);
      } catch {
        console.log('Login failed');
      }

      console.log('login: ', response);

      if (response) {
        mainStore.initAppState(response);
        router.push({ path: '/' });
      } else {
        $q.notify({
          message: 'Удостоверьтесь в правильности введеного Вами логина и пароля.',
          color: 'red',
          icon: 'error'
        });
      }
    };

    const onSignUp = () => {
      router.push({ path: '/signup' });
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

    return { loading, inputs, onFocus, onBlur, onLogin, onSignUp };
  }
};
</script>

<style scoped>
/* Scoping styles as per the first snippet */
@import
url('https://fonts.googleapis.com/css?family=Roboto');

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
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); /* Красивый градиент */
}

.form {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 400px;
  height: 400px;
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
  gap: 10px; /* Отступ между кнопками */
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
  min-width: 120px; /* Минимальная ширина для кнопок */
  text-align: center;
}

.styled-button:hover {
  background: #1976d2; /* Темно-синий цвет при наведении */
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

