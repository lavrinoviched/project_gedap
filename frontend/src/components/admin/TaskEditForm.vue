<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 500px">
      <q-card-section>
        <div class="text-h4 text-center text-weight-bold q-mb-md">
          {{ props.new ? 'Новая идея проекта' : 'Редактирование идеи' }}
        </div>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <q-input
          v-model="ideaData.title"
          label="Название идеи*"
          dense
          outlined
          :rules="[(val) => !!val || 'Обязательное поле']"
        />

        <q-select
          v-model="ideaData.category"
          :options="categoryOptions"
          label="Категория*"
          outlined
          dense
          :rules="[(val) => !!val || 'Выберите категорию']"
        />

        <q-select
          v-model="ideaData.complexity"
          :options="complexityOptions"
          label="Сложность*"
          outlined
          dense
        />

        <q-select
          v-model="ideaData.technologies"
          :options="stackOptions"
          label="Технологии"
          outlined
          dense
          multiple
          use-chips
        />

        <q-input
          v-model="ideaData.deadline"
          label="Срок выполнения"
          type="date"
          outlined
          dense
        />

        <q-input
          v-model="ideaData.description"
          label="Подробное описание*"
          type="textarea"
          outlined
          dense
          :rules="[(val) => !!val || 'Обязательное поле']"
          rows="3"
        />
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn flat label="Отмена" color="primary" @click="onDialogCancel" />
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
import { ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';

interface IdeaFormData {
  title: string;
  category: string;
  complexity: string;
  technologies: string[];
  deadline: string;
  description: string;
}

interface TaskEditProps {
  new: boolean;
  formData: IdeaFormData;
  onSubmit: () => Promise<void>;
}

const props = defineProps<TaskEditProps>();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = 
  useDialogPluginComponent();

const loading = ref(false);

// Инициализация формы с переданными данными или значениями по умолчанию
const ideaData = ref<IdeaFormData>({
  title: props.formData?.title || '',
  category: props.formData?.category || '',
  complexity: props.formData?.complexity || 'Средняя',
  technologies: props.formData?.technologies || [],
  deadline: props.formData?.deadline || '',
  description: props.formData?.description || '',
});

// Опции для селектов
const categoryOptions = [
  'Программирование',
  'Аналитика',
  'Дизайн',
  'Документирование',
  'Тестирование',
  'Обучение'
];

const complexityOptions = ['Низкая', 'Средняя', 'Высокая'];

const stackOptions = ['Не важно','PHP', 'Blueprint', 'GOLANG', 'Rust', 'Flatter', 'Dart', 'R Lang', 'Java', 'Javascript','HTML', 'CSS', 'C++', 
'Next', 'Julia', 'TypeScript', 'Python', 'SWIFT', 'KOTLIN', 'XAML', 'C#' ,'Scss', 'Ruby', 'React', 'Unreal Engine GameMode', 'SpringBoot',
'Keras','Scikit Learn','Pandas','TensorFlow',
'PyTorch','Vue','PhalconPHP','FastAPI','Flutter','1с','ReactJS','NestJS','Node.js','Next.js','.NET MAUI','.NET 6.0','Django',
'Unreal Engine','Flutter','NumPy','ReactNative','Flask','Tailwind','Bootstrap','Ruby on Rails','Jest','Mocha','Cypress','Selenium',

'SQLite','SQL','FireBase','Redis','MySQL','TypeORM','SQL1','PostgreSQL','MongoDB'
];
async function onOKClick() {
  if (!ideaData.value.title || !ideaData.value.description || !ideaData.value.category) {
    return;
  }

  loading.value = true;
  try {
    // Обновляем исходные данные формы
    Object.assign(props.formData, ideaData.value);
    
    // Вызываем переданную функцию onSubmit
    if (props.onSubmit) {
      await props.onSubmit();
    }
    
    onDialogOK();
  } catch (error) {
    console.error('Ошибка сохранения:', error);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.q-dialog-plugin {
  border-radius: 12px;
}

.text-h4 {
  color: #2a5298;
}

.q-card-section {
  padding: 20px;
}
</style>