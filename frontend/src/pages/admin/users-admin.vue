<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { data: users, refresh } = await useFetch('/api/admin/users')

const deleteUser = async (id) => {
  if (confirm('Вы точно хотите удалить этого пользователя?')) {
    await $fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    refresh()
  }
}
</script>

<template>
  <div>
    <div :style="{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    }">
      <h2 :style="{ margin: '0' }">Управление пользователями</h2>
      <button
        @click="navigateTo('/admin/users/new')"
        :style="{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          borderRadius: '6px',
          backgroundColor: '#3498db',
          color: 'white',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s',
          border: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }"
      >
        <Icon name="mdi:plus" /> Добавить пользователя
      </button>
    </div>

    <div :style="{
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }">
      <table :style="{
        width: '100%',
        borderCollapse: 'collapse'
      }">
        <thead>
          <tr :style="{ backgroundColor: '#f8f9fa' }">
            <th :style="{
              padding: '12px 16px',
              textAlign: 'left',
              fontWeight: '500',
              color: '#7f8c8d'
            }">ID</th>
            <th :style="{
              padding: '12px 16px',
              textAlign: 'left',
              fontWeight: '500',
              color: '#7f8c8d'
            }">Email</th>
            <th :style="{
              padding: '12px 16px',
              textAlign: 'left',
              fontWeight: '500',
              color: '#7f8c8d'
            }">Роль</th>
            <th :style="{
              padding: '12px 16px',
              textAlign: 'left',
              fontWeight: '500',
              color: '#7f8c8d'
            }">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="user in users" 
            :key="user.id"
            :style="{ borderBottom: '1px solid #eee' }"
          >
            <td :style="{ padding: '12px 16px' }">{{ user.id }}</td>
            <td :style="{ padding: '12px 16px' }">{{ user.email }}</td>
            <td :style="{ padding: '12px 16px' }">
              <span :style="{
                display: 'inline-block',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: user.role === 'admin' ? '#e74c3c' : '#3498db',
                color: 'white'
              }">
                {{ user.role }}
              </span>
            </td>
            <td :style="{
              padding: '12px 16px',
              display: 'flex',
              gap: '8px'
            }">
              <button
                @click="navigateTo(`/admin/users/edit/${user.id}`)"
                :style="{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  backgroundColor: '#f8f9fa',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }"
              >
                <Icon name="mdi:pencil" :style="{ color: '#3498db' }" />
              </button>
              <button
                @click="deleteUser(user.id)"
                :style="{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  backgroundColor: '#f8f9fa',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }"
              >
                <Icon name="mdi:delete" :style="{ color: '#e74c3c' }" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style>