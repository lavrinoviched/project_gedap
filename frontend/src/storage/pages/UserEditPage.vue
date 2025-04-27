<template>
  <div class="q-pa-md">
    <div class="text-center">
      <span v-if="mode === 'update'">Редактирование</span>
      <span v-if="mode === 'new'">Создание нового</span>
    </div>

    <q-input label="Логин" v-model="name" dense />
    <q-input label="Имя" v-model="firstname" dense />
    <q-input label="Фамилия" v-model="lastname" dense />
    <q-input v-if="mode === 'new'" type="password" label="Пароль" v-model="password" dense />
    <q-select v-model="roles" multiple use-chips :options="rolesDict" label="Роли" />
    <q-select v-model="status" :options="statusDict" label="Статус" />

    <div class="text-center q-py-md">
      <q-btn color="positive" label="Сохранить" @click="onSave" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue';
import { CreateUserDto, Role, UpdateUserDto, UserAccountStatus } from '../../../../backend/src/common/types';
import { useRoute, useRouter } from 'vue-router';
import usersApi from '../../api/users.api'; // Импортируем usersApi по умолчанию
import { useQuasar } from 'quasar';

type Mode = 'new' | 'update';

const mode: Ref<Mode> = ref('new');
const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const id = ref(-1);
const name = ref('');
const firstname = ref('');
const lastname = ref('');
const password = ref('');
const roles: Ref<Role[]> = ref([Role.user]);
const rolesDict = [Role.admin, Role.user];
const status: Ref<UserAccountStatus> = ref(UserAccountStatus.active);
const statusDict = [UserAccountStatus.active, UserAccountStatus.inactive, UserAccountStatus.pending];

onMounted(async () => {
  if (route.params.id === 'new') {
    mode.value = 'new';
  } else {
    mode.value = 'update';
    id.value = +route.params.id;
    await loadUserData();
  }
});

const loadUserData = async () => {
  const response = await usersApi.get(id.value); // Используем usersApi.get
  if (response) {
    firstname.value = response.firstname;
    lastname.value = response.lastname;
    id.value = response.id;
    roles.value = response.roles;
    status.value = response.status;
  }
};

const onSave = async () => {
  if (mode.value === 'new') {
    const newUser: CreateUserDto = {
      firstname: firstname.value,
      lastname: lastname.value,
      password: password.value,
      roles: roles.value,
      status: status.value,
      email: name.value, // Используем name.value для email
    };

    const response = await usersApi.create(newUser); // Используем usersApi.create
    console.log('add new response ', response);
    if (response) {
      router.push({ path: `/users/${response.id}` });
      mode.value = 'update';
      id.value = response.id;
    }
  } else if (mode.value === 'update') {
    const updatedUser: UpdateUserDto = {
      email: name.value, // Используем name.value для email
      id: id.value,
      firstname: firstname.value,
      lastname: lastname.value,
      roles: roles.value,
      status: status.value,
    };

    const response = await usersApi.update(id.value, updatedUser); // Используем usersApi.update
    if (response) {
      $q.notify({
        message: 'Сохранено',
        color: 'positive',
        icon: 'save',
      });
    }
  }
};
</script>
