import axios from 'axios';
import { api } from './axios'; // Исправлено на правильный импорт
import {
  CreateUserDto,
  SecuredUser,
  UpdateUserDto,
  UserAccountStatus,
  UpdateProfileDto,
  TechnologyName
} from '../../../backend/src/common/types';

const API_URL = 'http://localhost:9000/api/users'; // Замените на ваш фактический URL API

export const getAllUsers = async (): Promise<SecuredUser[]> => {
  const response = await api.get('/users');
  return response.status === 200 ? response.data : [];
};

export const createUser = async (newUser: CreateUserDto): Promise<SecuredUser | undefined> => {
  const response = await api.post('/users', newUser);
  return response.status === 201 ? response.data : undefined;
};

// users.api.ts
export const uploadAvatar = async (userId: number, file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const response = await api.post(`/users/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 30000, // 30 секунд таймаут
    });
    
    if (response.status === 200) {
      if (response.data?.avatarPath) {
        return response.data.avatarPath;
      }
      if (response.data?.path) {
        return response.data.path;
      }
    }
    throw new Error(response.data?.message || 'Не удалось загрузить аватар');
  } catch (error: unknown) {
    console.error('Upload error:', error);
    
    let errorMessage = 'Ошибка загрузки аватара';
    
    if (axios.isAxiosError(error)) {
      // Обработка ошибок Axios
      errorMessage = error.response?.data?.message || 
                    error.response?.data?.error || 
                    error.message;
    } else if (error instanceof Error) {
      // Обработка стандартных ошибок
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};


export const getCurrentUser = async (): Promise<SecuredUser | undefined> => {
  const response = await api.get('/users/me');
  return response.status === 200 ? response.data : undefined;
};

export const getUserById = async (id: number): Promise<SecuredUser | undefined> => {
  const response = await api.get(`/users/${id}`);
  return response.status === 200 ? response.data : undefined;
};

export const getUserProfile = async (id: number): Promise<SecuredUser | undefined> => {
  const response = await api.get(`/users/${id}/profile`);
  return response.status === 200 ? response.data : undefined;
};

export const getProfile = async (id: number): Promise<SecuredUser | undefined> => {
  const response = await api.get(`/users/${id}/profile`);
  return response.status === 200 ? response.data : undefined;
};

export const deleteUser = async (id: number): Promise<boolean> => {
  const response = await api.delete(`/users/${id}`);
  return response.status === 200;
};

export const updateUser = async (id: number, payload: UpdateUserDto): Promise<SecuredUser | undefined> => {
  const response = await api.patch(`/users/${id}`, payload); // Изменил PUT на PATCH
  return response.status === 200 ? response.data : undefined;
};

export const updateProfile = async (id: number, payload: UpdateProfileDto): Promise<SecuredUser | undefined> => {
  const response = await api.put(`/users/${id}/profile`, payload);
  return response.status === 200 ? response.data : undefined;
};

export const setUserStatus = async (id: number, status: UserAccountStatus): Promise<boolean> => {
  const response = await api.patch(`/users/${id}/status`, { status }); // Изменил структуру запроса
  return response.status === 200;
};

export const addTechnologies = async (userId: number, technologies: TechnologyName[]): Promise<SecuredUser | undefined> => {
  const response = await api.post(`/users/${userId}/technologies`, { technologies });
  return response.status === 200 ? response.data : undefined;
};

export const removeTechnologies = async (userId: number, technologies: TechnologyName[]): Promise<SecuredUser | undefined> => {
  const response = await api.delete(`/users/${userId}/technologies`, { data: { technologies } });
  return response.status === 200 ? response.data : undefined;
};

const usersApi = {
  async get(id: number): Promise<SecuredUser> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

   /**
   * Устанавливает статус пользователя
   * @param id - ID пользователя
   * @param status - Новый статус
   * @returns Promise с boolean результатом
   */
   async setUserStatus(id: number, status: UserAccountStatus): Promise<boolean> {
    const response = await api.patch(`/users/${id}/status`, { status });
    return response.status === 200;
  },

  /**
   * Создает нового пользователя.
   * @param user - Данные нового пользователя.
   * @returns Обещание с данными созданного пользователя.
   */
  async create(user: CreateUserDto): Promise<SecuredUser> {
    const response = await api.post('/users', user);
    return response.data;
  },

  /**
   * Обновляет существующего пользователя.
   * @param id - Идентификатор пользователя.
   * @param user - Обновленные данные пользователя.
   * @returns Обещание с данными обновленного пользователя.
   */
  async update(id: number, user: UpdateUserDto): Promise<SecuredUser> {
    const response = await api.patch(`/users/${id}`, user);
    return response.data;
  },
  async delete(id: number): Promise<boolean> {
    const response = await api.delete(`/users/${id}`);
    return response.status === 200;
  }
};

export default usersApi;
