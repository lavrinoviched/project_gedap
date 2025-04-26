<template>
  <div class="user-manager q-pa-md">
    <!-- Режим списка пользователей -->
    <div v-if="!showEditForm" class="user-list-mode">
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
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-table
        :rows="filteredUsers"
        :columns="userColumns"
        row-key="id"
        :loading="loading"
        :pagination="{ rowsPerPage: 10 }"
        flat
        bordered
        class="shadow-1"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              @click="editUser(props.row)"
            />
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click="confirmDelete(props.row.id)"
              class="q-ml-sm"
            />
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Режим редактирования/создания -->
    <div v-else class="user-edit-mode">
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
import { api } from '../api/axios'; // Добавляем импорт api
const $q = useQuasar();

// Состояние интерфейса
const showEditForm = ref(false);
const mode = ref<'new' | 'update'>('new');
const loading = ref(false);
const searchQuery = ref('');

// Данные пользователей
const users = ref<SecuredUser[]>([]);

// Форма редактирования
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
const availableRoles = [Role.admin, Role.user];
const availableStatuses = [
  UserAccountStatus.active,
  UserAccountStatus.inactive,
  UserAccountStatus.pending
];

interface TableColumn<T = unknown> {
  name: string;
  label: string;
  field: string | ((row: SecuredUser) => string);
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  format?: (val: T) => string;
}

const userColumns: TableColumn<unknown>[] = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    align: 'left',
    sortable: true
  },
  {
    name: 'email',
    label: 'Email',
    field: 'email',
    align: 'left',
    sortable: true
  },
  {
    name: 'name',
    label: 'Имя',
    field: (row: SecuredUser) => `${row.firstname} ${row.lastname}`,
    align: 'left',
    sortable: true
  },
  {
    name: 'roles',
    label: 'Роли',
    field: 'roles',
    align: 'left',
    sortable: true,
    format: (val: unknown) => (val as Role[]).join(', ')
  },
  {
    name: 'status',
    label: 'Статус',
    field: 'status',
    align: 'left',
    sortable: true
  },
  {
    name: 'group',
    label: 'Группа',
    field: 'group',
    align: 'left',
    sortable: true
  },
  {
    name: 'actions',
    label: 'Действия',
    align: 'center',
    field: '',
    sortable: false
  }
];


// Вычисляемые свойства
const showGroupField = computed(() => {
  return form.value.roles.includes(Role.user) && !form.value.roles.includes(Role.admin);
});

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  
  const query = searchQuery.value.toLowerCase();
  return users.value.filter(user => 
    user.email.toLowerCase().includes(query) ||
    user.firstname.toLowerCase().includes(query) ||
    user.lastname.toLowerCase().includes(query) ||
    (user.group && user.group.toLowerCase().includes(query)) ||
    user.roles.join(' ').toLowerCase().includes(query)
  );
});


// Методы
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

// При создании пользователя - убираем group из DTO если он не нужен
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
   
        // group добавляем только если есть и нужен
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
       
        // group добавляем только если есть и нужен
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
    await usersApi.delete(id);
    $q.notify({
      message: 'Пользователь удален',
      color: 'positive'
    });
    await loadUsers();
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

const cancelEdit = () => {
  showEditForm.value = false;
  resetForm();
};

// Инициализация
onMounted(async () => {
  await loadUsers();
});
</script>
<style scoped>
.user-edit-page {
  max-width: 800px;
  margin: 0 auto;
}

.edit-card {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
</style>