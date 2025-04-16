<script setup>
const route = useRoute()
const userId = route.params.id

const { data: user } = await useFetch(`/api/admin/users/${userId}`)

const form = ref({
  email: user.value.email,
  role: user.value.role
})

const saveUser = async () => {
  await $fetch(`/api/admin/users/${userId}`, {
    method: 'PUT',
    body: form.value
  })
  navigateTo('/admin/users')
}
</script>

<template>
  <div>
    <h2 :style="{ marginBottom: '20px' }">Редактирование пользователя</h2>
    
    <div :style="{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }">
      <div :style="{ marginBottom: '16px' }">
        <label :style="{
          display: 'block',
          marginBottom: '8px',
          fontWeight: '500'
        }">Email</label>
        <input
          v-model="form.email"
          type="email"
          :style="{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }"
        >
      </div>

      <div :style="{ marginBottom: '24px' }">
        <label :style="{
          display: 'block',
          marginBottom: '8px',
          fontWeight: '500'
        }">Роль</label>
        <select
          v-model="form.role"
          :style="{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            backgroundColor: 'white'
          }"
        >
          <option value="user">Пользователь</option>
          <option value="admin">Администратор</option>
        </select>
      </div>

      <div :style="{ display: 'flex', gap: '10px' }">
        <button
          @click="saveUser"
          :style="{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '6px',
            backgroundColor: '#2ecc71',
            color: 'white',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: 'none'
          }"
        >
          <Icon name="mdi:content-save" /> Сохранить
        </button>
        <button
          @click="navigateTo('/admin/users')"
          :style="{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '6px',
            backgroundColor: '#95a5a6',
            color: 'white',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: 'none'
          }"
        >
          <Icon name="mdi:cancel" /> Отмена
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
input:focus, select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}
button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style>