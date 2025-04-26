import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9000', // Убедитесь, что базовый URL корректен
  withCredentials: true,
});

export default api;
