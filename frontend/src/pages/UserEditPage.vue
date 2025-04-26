<template>
  <div class="q-pa-md">
    <div class="text-center q-mb-md">
      <span class="text-h6">
        {{ mode === 'update' ? 'Редактирование пользователя' : 'Создание нового пользователя' }}
      </span>
    </div>

    <q-form @submit.prevent="onSave" class="q-gutter-md">
      <q-input
        v-model="email"
        label="Email"
        dense
        outlined
        :rules="[val => !!val || 'Обязательное поле', val => /.+@.+\..+/.test(val) || 'Некорректный email']"
      />

      <q-input
        v-model="firstname"
        label="Имя"
        dense
        outlined
        :rules="[val => !!val || 'Обязательное поле']"
      />

      <q-input
        v-model="lastname"
        label="Фамилия"
        dense
        outlined
        :rules="[val => !!val || 'Обязательное поле']"
      />

      <q-input
        v-if="mode === 'new'"
        v-model="password"
        type="password"
        label="Пароль"
        dense
        outlined
        :rules="[val => val.length >= 6 || 'Минимум 6 символов']"
      />

      <q-select
        v-model="roles"
        multiple
        use-chips
        :options="availableRoles"
        label="Роли"
        outlined
        dense
      />

      <q-select
        v-model="status"
        :options="availableStatuses"
        label="Статус"
        outlined
        dense
      />

      <div class="text-center q-mt-lg">
        <q-btn
          type="submit"
          color="positive"
          label="Сохранить"
          :loading="loading"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import {
  CreateUserDto,
  UpdateUserDto,
  Role,
  UserAccountStatus
} from '../../../backend/src/common/types';
import usersApi from '../api/users.api'; // Импортируем usersApi

const $q = useQuasar();
const route = useRoute();
const router = useRouter();

// Form state
const mode = ref<'new' | 'update'>('new');
const loading = ref(false);
const userId = ref<number | null>(null);

// Form fields
const email = ref('');
const firstname = ref('');
const lastname = ref('');
const password = ref('');
const roles = ref<Role[]>([Role.user]);
const status = ref<UserAccountStatus>(UserAccountStatus.active);

// Available options
const availableRoles = [Role.admin, Role.user];
const availableStatuses = [
  UserAccountStatus.active,
  UserAccountStatus.inactive,
  UserAccountStatus.pending
];

// Load user data for editing
onMounted(async () => {
  if (route.params.id !== 'new') {
    mode.value = 'update';
    userId.value = Number(route.params.id);
    await loadUserData();
  }
});

const loadUserData = async () => {
  if (!userId.value) return;

  try {
    const user = await usersApi.get(userId.value);
    if (user) {
      email.value = user.email;
      firstname.value = user.firstname;
      lastname.value = user.lastname;
      roles.value = user.roles;
      status.value = user.status;
    }
  } catch (error) {
    console.error('Ошибка загрузки данных пользователя:', error);
    $q.notify({
      message: 'Не удалось загрузить данные пользователя',
      color: 'negative'
    });
  }
};

const onSave = async () => {
  loading.value = true;

  try {
    if (mode.value === 'new') {
      const newUser: CreateUserDto = {
        email: email.value,
        firstname: firstname.value,
        lastname: lastname.value,
        password: password.value,
        roles: roles.value,
        status: status.value
      };

      const createdUser = await usersApi.create(newUser);
      if (createdUser) {
        userId.value = createdUser.id;
        mode.value = 'update';
        router.push({ path: `/users/${createdUser.id}` });
        $q.notify({
          message: 'Пользователь создан',
          color: 'positive'
        });
      }
    } else if (mode.value === 'update' && userId.value) {
      const updatedUser: UpdateUserDto = {
        id: userId.value, // Добавлено обязательное поле id
        email: email.value,
        firstname: firstname.value,
        lastname: lastname.value,
        roles: roles.value,
        status: status.value
      };

      const response = await usersApi.update(userId.value, updatedUser);
      if (response) {
        $q.notify({
          message: 'Изменения сохранены',
          color: 'positive',
          icon: 'save'
        });
      }
    }
  } catch (error) {
    console.error('Ошибка сохранения:', error);
    $q.notify({
      message: 'Ошибка при сохранении',
      color: 'negative'
    });
  } finally {
    loading.value = false;
  }
};
</script>
