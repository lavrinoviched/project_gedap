<template>
  <q-layout view="hHh Lpr fFf">
    <!-- Верхняя панель -->
    <q-header elevated class="main-header">
      <!-- Подложка с темно-синим цветом -->
      <div class="header-background"></div>
      <q-toolbar>
        <!-- Логотип университета -->
        <img
          src="~assets/logo.png"
          alt="ТИУ Логотип"
          class="logo"
        />

        <!-- Первый q-space для выравнивания ссылок по центру -->
        <q-space />

        <!-- Ссылки на разделы -->
        <q-btn flat label="Главная" to="/" class="nav-link" />
        <q-btn flat label="Галерея проектов" to="/gallery" class="nav-link" />
        <q-btn flat label="Банк идей" to="/tasks" class="nav-link" />
        <q-btn flat label="Команды" to="/teams" class="nav-link" />
        <!-- Второй q-space для выравнивания ссылок по центру -->
        <q-space />

        <!-- Иконки уведомлений и пользователя -->
        <q-btn flat round dense icon="notifications" class="nav-icon" />
        <q-btn flat round dense icon="account_circle" class="nav-icon" @click="profileModal = true" />
        <q-btn flat round dense icon="logout" class="nav-icon" @click="onLogout" />
      </q-toolbar>
    </q-header>

    <!-- Модальное окно личного кабинета -->
    <q-dialog v-model="profileModal" maximized>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <UserProfile is-modal @close="profileModal = false" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Основное содержимое -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as api from '../api/auth.api';
import UserProfile from '../components/UserProfile.vue';
import { QDialog, QCard, QCardSection, QSpace, QBtn } from 'quasar';

const router = useRouter();
const profileModal = ref(false);

const onLogout = () => {
  api.logout();
  router.push({ path: '/login' });
};
</script>

<style scoped>
/* Основной стиль для верхней панели */
.main-header {
  background-color: rgba(4, 17, 42, 0.95) !important;
  backdrop-filter: blur(10px);
  transition: background-color 0.3s ease;
}

/* Подложка для фона (можно оставить для совместимости) */
.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(4, 17, 42, 0.95);
  backdrop-filter: blur(10px);
  z-index: -1;
}

/* Стили для навигационных ссылок */
.nav-link {
  color: white !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  font-weight: 500;
  margin: 0 8px;
  letter-spacing: 0.5px;
}

/* Стили для иконок */
.nav-icon {
  color: white !important;
  margin-left: 12px;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3));
}

/* Стили для логотипа */
.logo {
  height: 40px;
  width: auto;
  margin-right: 16px;
  border-radius: 0;
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}
</style>