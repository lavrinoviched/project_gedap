<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 400px">
      <q-card-section>
        <div class="text-h6 text-center">
          {{ props.new ? 'Новая задача' : 'Редактирование задачи' }}
        </div>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <q-input
          v-model="taskData.title"
          label="Название задачи"
          dense
          outlined
          :rules="[(val) => !!val || 'Обязательное поле']"
        />

        <q-select
          v-model="taskData.status"
          :options="statusOptions"
          label="Статус"
          emit-value
          map-options
          outlined
          dense
        />

        <q-select
          v-model="taskData.assigneeId"
          :options="filteredUsers"
          label="Исполнитель"
          option-value="id"
          :option-label="getUserLabel"
          outlined
          dense
          use-input
          clearable
          @filter="filterUsers"
          :display-value="getAssigneeDisplay"
        >
          <template v-if="!taskData.assigneeId" v-slot:selected>
            <div class="text-grey">Не назначен</div>
          </template>
        </q-select>
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn flat label="Отмена" color="primary" @click="onDialogCancel" />
        <q-btn
          v-if="!props.new"
          flat
          label="Удалить"
          color="negative"
          @click="onDelete"
        />
        <q-btn
          label="Сохранить"
          color="primary"
          @click="onOKClick"
          :loading="loading"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import {
  CreateUpdateTaskDto,
  SecuredUser,
  TaskDto,
  TaskStatus,
} from '../../../backend/src/common/types';
import * as api from '../api/tasks.api';
import * as userApi from '../api/users.api';
import { useMainStore } from 'src/stores/main-store';

interface TaskEditProps {
  new: boolean;
  task?: TaskDto;
}

const props = defineProps<TaskEditProps>();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = 
  useDialogPluginComponent();

const mainStore = useMainStore();
const loading = ref(false);
const users = ref<SecuredUser[]>([]);
const userFilter = ref('');

const taskData = ref<CreateUpdateTaskDto>({
  title: props.task?.title || '',
  status: props.task?.status || TaskStatus.new,
  assigneeId: props.task?.assignee?.id,
  authorId: mainStore.userId,
});

const statusOptions = computed(() => {
  const options = [
    { label: 'Новая', value: TaskStatus.new },
    { label: 'В работе', value: TaskStatus.inProgress },
  ];
  if (!props.new) {
    options.push({ label: 'Выполнена', value: TaskStatus.done });
  }
  return options;
});

const filteredUsers = computed(() => {
  if (!userFilter.value) return users.value;
  const search = userFilter.value.toLowerCase();
  return users.value.filter(
    (user) =>
      user.firstname.toLowerCase().includes(search) ||
      user.lastname.toLowerCase().includes(search)
  );
});

onMounted(async () => {
  try {
    users.value = await userApi.getAll();
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error);
  }
});

function getUserLabel(user: SecuredUser) {
  return `${user.lastname} ${user.firstname}`;
}

function getAssigneeDisplay() {
  if (!taskData.value.assigneeId) return 'Не назначен';
  const user = users.value.find((u) => u.id === taskData.value.assigneeId);
  return user ? getUserLabel(user) : 'Не найден';
}

function filterUsers(val: string, update: (callback: () => void) => void) {
  update(() => {
    userFilter.value = val;
  });
}

async function onOKClick() {
  if (!taskData.value.title.trim()) return;

  loading.value = true;
  try {
    if (props.new) {
      await api.create(taskData.value);
    } else if (props.task?.id) {
      await api.update(props.task.id, taskData.value);
    }
    onDialogOK();
  } catch (error) {
    console.error('Ошибка сохранения задачи:', error);
  } finally {
    loading.value = false;
  }
}

async function onDelete() {
  if (!props.task?.id) return;
  
  loading.value = true;
  try {
    await api.remove(props.task.id);
    onDialogOK();
  } catch (error) {
    console.error('Ошибка удаления задачи:', error);
  } finally {
    loading.value = false;
  }
}
</script>