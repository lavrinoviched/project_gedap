<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// Статистика
const stats = ref([
  { title: 'Пользователи', value: 128, icon: 'mdi:account-group', color: '#3498db', change: '+12%' },
  { title: 'Заказы', value: 56, icon: 'mdi:cart', color: '#2ecc71', change: '+5%' },
  { title: 'Доход', value: '245,000 ₽', icon: 'mdi:cash', color: '#f39c12', change: '+18%' },
  { title: 'Обращения', value: 24, icon: 'mdi:email', color: '#9b59b6', change: '-2%' }
])

// Последние действия
const activities = ref([
  { id: 1, user: 'admin', action: 'изменил данные пользователя user123', time: '10 мин назад', icon: 'mdi:account-edit', color: '#3498db' },
  { id: 2, user: 'admin', action: 'удалил товар "Смартфон XYZ"', time: '2 часа назад', icon: 'mdi:delete', color: '#e74c3c' },
  { id: 3, user: 'manager1', action: 'создал новый заказ #1245', time: '5 часов назад', icon: 'mdi:cart-plus', color: '#2ecc71' },
  { id: 4, user: 'user42', action: 'оставил отзыв к товару "Наушники"', time: 'вчера', icon: 'mdi:comment', color: '#f39c12' }
])
</script>

<template>
  <div :style="{ padding: '20px' }">
    <h1 :style="{ marginBottom: '20px', fontSize: '24px', fontWeight: '600' }">Панель управления</h1>
    
    <!-- Статистика -->
    <div :style="{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    }">
      <div 
        v-for="stat in stats" 
        :key="stat.title"
        :style="{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          borderLeft: `4px solid ${stat.color}`
        }"
      >
        <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }">
          <div :style="{ color: '#7f8c8d', fontSize: '14px' }">{{ stat.title }}</div>
          <Icon 
            :name="stat.icon" 
            :style="{ color: stat.color, fontSize: '24px' }"
          />
        </div>
        <div :style="{ 
          display: 'flex', 
          alignItems: 'baseline', 
          gap: '8px', 
          marginTop: '10px'
        }">
          <span :style="{ fontSize: '24px', fontWeight: '600' }">{{ stat.value }}</span>
          <span :style="{
            backgroundColor: stat.change.startsWith('+') ? '#e8f8f5' : '#fdedec',
            color: stat.change.startsWith('+') ? '#2ecc71' : '#e74c3c',
            padding: '2px 6px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: '500'
          }">
            {{ stat.change }}
          </span>
        </div>
      </div>
    </div>

    <!-- Последние действия -->
    <div :style="{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }">
      <h2 :style="{ 
        marginBottom: '20px', 
        fontSize: '18px', 
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }">
        <Icon name="mdi:clock" :style="{ color: '#7f8c8d' }" />
        Последние действия
      </h2>
      
      <div :style="{ display: 'flex', flexDirection: 'column', gap: '12px' }">
        <div 
          v-for="activity in activities" 
          :key="activity.id"
          :style="{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid #eee'
          }"
        >
          <div :style="{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: `${activity.color}20`,
            marginRight: '12px',
            flexShrink: '0'
          }">
            <Icon 
              :name="activity.icon" 
              :style="{ color: activity.color, fontSize: '18px' }"
            />
          </div>
          
          <div :style="{ flexGrow: '1' }">
            <span :style="{ fontWeight: '500' }">{{ activity.user }}</span>
            <span :style="{ marginLeft: '6px' }">{{ activity.action }}</span>
          </div>
          
          <div :style="{ 
            color: '#95a5a6', 
            fontSize: '14px',
            flexShrink: '0'
          }">
            {{ activity.time }}
          </div>
        </div>
      </div>

      <button
        :style="{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '20px',
          padding: '8px 12px',
          backgroundColor: 'transparent',
          border: '1px solid #ddd',
          borderRadius: '6px',
          color: '#3498db',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }"
      >
        <Icon name="mdi:refresh" /> Показать еще
      </button>
    </div>

    <!-- Быстрые действия -->
    <div :style="{ 
      marginTop: '30px',
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }">
      <h2 :style="{ 
        marginBottom: '20px', 
        fontSize: '18px', 
        fontWeight: '600' 
      }">
        Быстрые действия
      </h2>
      
      <div :style="{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '15px'
      }">
        <button
          @click="navigateTo('/admin/users/new')"
          :style="{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }"
        >
          <Icon name="mdi:account-plus" :style="{ 
            fontSize: '28px',
            color: '#3498db'
          }" />
          <span>Добавить пользователя</span>
        </button>
        
        <button
          @click="navigateTo('/admin/products/new')"
          :style="{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }"
        >
          <Icon name="mdi:package-variant-plus" :style="{ 
            fontSize: '28px',
            color: '#2ecc71'
          }" />
          <span>Добавить товар</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.quick-action-btn:hover {
  background-color: #f1f1f1;
}
</style>