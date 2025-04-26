import axios from 'axios';
import { useMainStore } from '../stores/main-store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000/api';

// Типы для заявок
export type ApplicationType = 'teams' | 'projects' | 'ideas' | 'customers';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';



// Интерфейс для фильтров
interface ApplicationFilters {
  status?: ApplicationStatus | 'all';
  date?: 'newest' | 'oldest';
  page?: number;
  limit?: number;
}

export const getApplications = async (
    type: ApplicationType,
    filters: ApplicationFilters = {}
  ) => {
    try {
      const mainStore = useMainStore();
      const user = mainStore.getCurrentUser();
      
      if (!user || !('token' in user) || !user.token) {
        throw new Error('Отсутствует токен аутентификации');
      }
  
      const response = await axios.get(`${API_BASE_URL}/applications/${type}`, {
        params: filters,
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      return response.data || []; // Добавлен fallback на пустой массив
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  };

export const updateApplicationStatus = async (
  type: ApplicationType,
  id: number,
  status: ApplicationStatus,
  notes = '' // Убрано явное указание типа string
) => {
  try {
    const mainStore = useMainStore();
    const user = mainStore.getCurrentUser();
    
    if (!user || !('token' in user) || !user.token) {
      throw new Error('Отсутствует токен аутентификации');
    }

    const response = await axios.patch(
      `${API_BASE_URL}/applications/${type}/${id}`,
      { status, notes },
      {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating application:', error);
    throw error;
  }
};