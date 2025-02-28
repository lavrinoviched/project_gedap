<template>
    <div class="error-container">
      <h1>404 - Страница не найдена</h1>
      <p>К сожалению, страница, которую вы ищете, не существует.</p>
      <router-link to="/">Вернуться на главную</router-link>
    </div>
  </template>
  
  <script lang="ts">
  export default {
    name: 'ErrorNotFound',
  }
  </script>
  
  <style scoped>
  .error-container {
    text-align: center;
    margin-top: 50px;
  }
  </style>