<template>
    <q-table 
      :rows="props.users" 
      :columns="columns" 
      row-key="id"
      @row-click="onRowClick"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            color="primary"
            icon="edit"
            @click.stop="onEditClick(props.row)"
          />
          <q-btn
            flat
            round
            color="negative"
            icon="delete"
            @click.stop="onDeleteClick(props.row)"
            class="q-ml-sm"
          />
          <q-btn
            flat
            round
            :color="props.row.status === 'active' ? 'orange' : 'positive'"
            :icon="props.row.status === 'active' ? 'pause' : 'play_arrow'"
            @click.stop="onToggleStatusClick(props.row)"
            class="q-ml-sm"
          />
        </q-td>
      </template>
    </q-table>
  </template>
  
  <script lang="ts" setup>
  import { SecuredUser } from '../../../backend/src/common/types';
  import { QTableProps } from 'quasar';
  
  interface UserTableProps {
    users: SecuredUser[];
    loading?: boolean;
  }
  
  const emit = defineEmits<{
    (e: 'user-click', user: SecuredUser): void;
    (e: 'edit-user', user: SecuredUser): void;
    (e: 'delete-user', user: SecuredUser): void;
    (e: 'toggle-status', user: SecuredUser): void;
  }>();
  
  const props = withDefaults(defineProps<UserTableProps>(), { 
    users: () => [],
    loading: false
  });
  
  const columns: QTableProps['columns'] = [
    {
      name: 'login',
      label: 'Логин',
      align: 'left',
      field: 'email',
      sortable: true
    },
    {
      name: 'firstname',
      label: 'Имя',
      align: 'left',
      field: 'firstname',
      sortable: true
    },
    {
      name: 'lastname',
      label: 'Фамилия',
      align: 'left',
      field: 'lastname',
      sortable: true
    },
    {
      name: 'roles',
      label: 'Роли',
      align: 'left',
      field: (row: SecuredUser) => row.roles.join(', '),
      sortable: true
    },
    {
      name: 'status',
      label: 'Статус',
      align: 'left',
      field: 'status',
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
  
  const onRowClick = (evt: Event, row: SecuredUser) => {
    emit('user-click', row);
  };
  
  const onEditClick = (user: SecuredUser) => {
    emit('edit-user', user);
  };
  
  const onDeleteClick = (user: SecuredUser) => {
    emit('delete-user', user);
  };
  
  const onToggleStatusClick = (user: SecuredUser) => {
    emit('toggle-status', user);
  };
  </script>
  
  <style scoped>
  .q-table {
    width: 100%;
  }
  </style>