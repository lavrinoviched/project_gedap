<template>
  <div class="user-manager q-pa-md">
    <!-- Режим списка пользователей -->
    <div class="user-list-mode">
      <div class="row justify-between items-center q-mb-md">
        <div class="text-h5 text-primary">Управление пользователями</div>
        <q-btn
          color="primary"
          label="Добавить пользователя"
          icon="add"
          @click="startCreateUser"
        />
      </div>

      <q-card class="q-mb-md">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="searchQuery"
                label="Поиск пользователей"
                dense
                outlined
                clearable
                bg-color="white"
                @update:model-value="filterUsers"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="statusFilter"
                :options="availableStatuses"
                label="Фильтр по статусу"
                multiple
                use-chips
                outlined
                dense
                clearable
                bg-color="white"
                @update:model-value="filterUsers"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <TIUUserDataTable
        :users="filteredUsers"
        :loading="loading"
        @user-click="handleUserClick"
        @edit-user="handleEditUser"
        @delete-user="handleDeleteUser"
        @toggle-status="handleToggleStatus"
      />
    </div>

    <!-- Режим редактирования/создания -->
    <div v-if="showEditForm" class="user-edit-mode">
      <q-card class="edit-card shadow-2">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6 text-center">
            {{ mode === 'update' ? 'Редактирование пользователя' : 'Создание нового пользователя' }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="onSave" class="q-gutter-y-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.email"
                  label="Email"
                  dense
                  outlined
                  bg-color="white"
                  :rules="[val => !!val || 'Обязательное поле', val => /.+@.+\..+/.test(val) || 'Некорректный email']"
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-if="mode === 'new'"
                  v-model="form.password"
                  type="password"
                  label="Пароль"
                  dense
                  outlined
                  bg-color="white"
                  :rules="[val => val.length >= 6 || 'Минимум 6 символов']"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.firstname"
                  label="Имя"
                  dense
                  outlined
                  bg-color="white"
                  :rules="[val => !!val || 'Обязательное поле']"
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.lastname"
                  label="Фамилия"
                  dense
                  outlined
                  bg-color="white"
                  :rules="[val => !!val || 'Обязательное поле']"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-select
                  v-model="form.roles"
                  multiple
                  use-chips
                  :options="availableRoles"
                  label="Роли"
                  outlined
                  dense
                  bg-color="white"
                  @update:model-value="handleRoleChange"
                />
              </div>

              <div class="col-12 col-md-6">
                <q-select
                  v-model="form.status"
                  :options="availableStatuses"
                  label="Статус"
                  outlined
                  dense
                  bg-color="white"
                />
              </div>
            </div>

            <div v-if="showGroupField" class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  v-model="form.group"
                  label="Группа"
                  dense
                  outlined
                  bg-color="white"
                  hint="Укажите учебную группу (только для обычных пользователей)"
                />
              </div>
            </div>

            <div class="row justify-between q-mt-lg">
              <div>
                <q-btn
                  v-if="mode === 'update'"
                  label="Удалить"
                  color="negative"
                  @click="confirmDelete(form.id)"
                  :loading="loading"
                  :disable="form.roles.includes(Role.admin)"
                />
              </div>
              <div>
                <q-btn
                  label="Отмена"
                  color="grey"
                  class="q-mr-sm"
                  @click="cancelEdit"
                />
                <q-btn
                  type="submit"
                  color="primary"
                  label="Сохранить"
                  :loading="loading"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>

    <!-- Диалог смены пароля -->
    <q-dialog v-model="showPasswordDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Смена пароля для {{ selectedUser?.email }}</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newPassword"
            type="password"
            label="Новый пароль"
            outlined
            :rules="[val => val.length >= 6 || 'Минимум 6 символов']"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="primary" v-close-popup />
          <q-btn flat label="Сохранить" color="primary" @click="changePassword" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import {
  CreateUserDto,
  UpdateUserDto,
  SecuredUser,
  Role,
  UserAccountStatus
} from '../../../backend/src/common/types';
import usersApi from '../api/users.api';
import { api } from '../api/axios';
import TIUUserDataTable from 'src/components/TIUUserDataTable.vue';

const $q = useQuasar();

// Состояние
const showEditForm = ref(false);
const mode = ref<'new' | 'update'>('new');
const loading = ref(false);
const searchQuery = ref('');
const statusFilter = ref<UserAccountStatus[]>([]);
const showPasswordDialog = ref(false);
const selectedUser = ref<SecuredUser | null>(null);
const newPassword = ref('');
const users = ref<SecuredUser[]>([]);
const form = ref({
  id: 0,
  email: '',
  firstname: '',
  lastname: '',
  password: '',
  roles: [Role.user] as Role[],
  status: UserAccountStatus.active as UserAccountStatus,
  group: '',
});

// Доступные опции
const availableRoles = [Role.admin, Role.user, Role.customer];
const availableStatuses = [
  UserAccountStatus.active,
  UserAccountStatus.inactive,
  UserAccountStatus.pending
];

// Вычисляемые свойства
const showGroupField = computed(() => {
  return form.value.roles.includes(Role.user) && !form.value.roles.includes(Role.admin);
});

const filteredUsers = computed(() => {
  let result = users.value;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(user => 
      user.email.toLowerCase().includes(query) ||
      user.firstname?.toLowerCase().includes(query) ||
      user.lastname?.toLowerCase().includes(query) ||
      (user.group && user.group.toLowerCase().includes(query)) ||
      user.roles.join(' ').toLowerCase().includes(query)
    );
  }
  
  if (statusFilter.value.length > 0) {
    result = result.filter(user => statusFilter.value.includes(user.status));
  }
  
  return result;
});

// Методы
const loadUsers = async () => {
  loading.value = true;
  try {
    const response = await api.get('/users');
    users.value = response.data || [];
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error);
    $q.notify({
      message: 'Не удалось загрузить список пользователей',
      color: 'negative'
    });
  } finally {
    loading.value = false;
  }
};

const filterUsers = () => {
  // Фильтрация происходит через computed свойство
};

const startCreateUser = () => {
  resetForm();
  mode.value = 'new';
  showEditForm.value = true;
};

const editUser = (user: SecuredUser) => {
  form.value = {
    id: user.id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    password: '',
    roles: [...user.roles],
    status: user.status,
    group: user.group || '',
  };
  mode.value = 'update';
  showEditForm.value = true;
};

const resetForm = () => {
  form.value = {
    id: 0,
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    roles: [Role.user],
    status: UserAccountStatus.active,
    group: '',
  };
};

const handleRoleChange = (newRoles: Role[]) => {
  if (!newRoles.includes(Role.user)) {
    form.value.group = '';
  }
};

const onSave = async () => {
  loading.value = true;
  try {
    if (mode.value === 'new') {
      const newUser: CreateUserDto = {
        email: form.value.email,
        firstname: form.value.firstname,
        lastname: form.value.lastname,
        password: form.value.password,
        roles: form.value.roles,
        status: form.value.status,
        ...(form.value.group && { group: form.value.group })
      };

      const createdUser = await usersApi.create(newUser);
      if (createdUser) {
        $q.notify({
          message: 'Пользователь создан',
          color: 'positive'
        });
        await loadUsers();
        cancelEdit();
      }
    } else {
      const updatedUser: UpdateUserDto = {
        id: form.value.id,
        email: form.value.email,
        firstname: form.value.firstname,
        lastname: form.value.lastname,
        roles: form.value.roles,
        status: form.value.status,
        ...(form.value.group && { group: form.value.group })
      };

      const response = await usersApi.update(form.value.id, updatedUser);
      if (response) {
        $q.notify({
          message: 'Изменения сохранены',
          color: 'positive',
          icon: 'save'
        });
        await loadUsers();
        cancelEdit();
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

const confirmDelete = (id: number) => {
  $q.dialog({
    title: 'Подтверждение',
    message: 'Вы уверены, что хотите удалить этого пользователя?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await deleteUser(id);
  });
};

const deleteUser = async (id: number) => {
  loading.value = true;
  try {
    const success = await usersApi.delete(id); // Изменено здесь
    if (success) {
      $q.notify({
        message: 'Пользователь удален',
        color: 'positive'
      });
      await loadUsers();
    }
  } catch (error) {
    console.error('Ошибка удаления:', error);
    $q.notify({
      message: 'Ошибка при удалении пользователя',
      color: 'negative'
    });
  } finally {
    loading.value = false;
  }
};

const toggleUserStatus = async (user: SecuredUser) => {
  try {
    const newStatus = user.status === UserAccountStatus.active 
      ? UserAccountStatus.inactive 
      : UserAccountStatus.active;
    
    const success = await usersApi.setUserStatus(user.id, newStatus);
    if (success) {
      $q.notify({
        message: `Статус пользователя изменен на ${newStatus}`,
        color: 'positive'
      });
      await loadUsers();
    }
  } catch (error) {
    console.error('Ошибка изменения статуса:', error);
    $q.notify({
      message: 'Ошибка при изменении статуса пользователя',
      color: 'negative'
    });
  }
};

const handleUserClick = (user: SecuredUser) => {
  // Реализуйте логику обработки клика на пользователе
  console.log('User clicked:', user);
};

const handleEditUser = (user: SecuredUser) => {
  editUser(user);
};

const handleDeleteUser = (user: SecuredUser) => {
  confirmDelete(user.id);
};

const handleToggleStatus = (user: SecuredUser) => {
  toggleUserStatus(user);
};

const showChangePasswordDialog = (user: SecuredUser) => {
  selectedUser.value = user;
  newPassword.value = '';
  showPasswordDialog.value = true;
};

const changePassword = async () => {
  if (!selectedUser.value || !newPassword.value) return;

  try {
    await api.post(`/users/${selectedUser.value.id}/change-password`, {
      newPassword: newPassword.value
    });
    $q.notify({
      message: 'Пароль успешно изменен',
      color: 'positive'
    });
    showPasswordDialog.value = false;
  } catch (error) {
    console.error('Ошибка смены пароля:', error);
    $q.notify({
      message: 'Ошибка при смене пароля',
      color: 'negative'
    });
  }
};

const cancelEdit = () => {
  showEditForm.value = false;
  resetForm();
};

const getStatusColor = (status: UserAccountStatus) => {
  switch (status) {
    case UserAccountStatus.active: return 'positive';
    case UserAccountStatus.inactive: return 'negative';
    case UserAccountStatus.pending: return 'warning';
    default: return 'grey';
  }
};

const getRoleColor = (role: Role) => {
  switch (role) {
    case Role.admin: return 'primary';
    case Role.user: return 'positive';
    case Role.customer: return 'orange';
    default: return 'grey';
  }
};

onMounted(async () => {
  await loadUsers();
});
</script>

<style scoped>
.user-manager {
  max-width: 1200px;
  margin: 0 auto;
}

.edit-card {
  max-width: 800px;
  margin: 0 auto;
  border-radius: 8px;
}

.q-field--outlined .q-field__control {
  border-radius: 4px;
}

.q-field--outlined .q-field__control:before {
  border: 1px solid #e0e0e0;
}

.q-field--outlined:hover .q-field__control:before {
  border-color: #1976d2;
}

.shadow-1 {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.shadow-2 {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.q-badge {
  font-size: 0.8em;
  padding: 4px 8px;
}
</style>