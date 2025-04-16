<template>
  <q-card class="my-card" flat bordered>
    <q-card-section horizontal>
      <q-card-section class="q-pt-xs">
        <div class="text-h6">{{ task.title }}</div>
      </q-card-section>

      <q-card-section class="q-pa-none">
        Создана: {{ creationDate }}
      </q-card-section>

      <q-card-section class="q-pa-none">
        Исполнитель: {{ assigneeFullName }}
      </q-card-section>

      <q-card-section class="q-pa-none">
        Автор: {{ authorFullName }}
      </q-card-section>
    </q-card-section>

    <q-separator />

    <q-card-actions>
      <q-btn flat icon="edit" label="Изменить" @click="onChangeClick" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { date } from 'quasar';
import type { TaskDto } from '../../../backend/src/common/types';

interface Props {
  value: TaskDto;
}

const emit = defineEmits<{
  (e: 'on-edit-click', task: TaskDto): void;
}>();

const props = defineProps<Props>();

const task = computed(() => props.value);
const creationDate = computed(() => date.formatDate(task.value.createdAt, 'DD.MM.YYYY'));

const assigneeFullName = computed(() => {
  if (!task.value.assignee) return 'Не назначен';
  return `${task.value.assignee.firstname} ${task.value.assignee.lastname}`.trim();
});

const authorFullName = computed(() => {
  return `${task.value.author.firstname} ${task.value.author.lastname}`.trim();
});

const onChangeClick = () => {
  emit('on-edit-click', task.value);
};
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 350px;
}
</style>