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

const API_URL = 'http://localhost:3000/api/users'; // Замените на ваш фактический URL API

export const getAllUsers = async (): Promise<SecuredUser[]> => {
  const response = await api.get('/users');
  return response.status === 200 ? response.data : [];
};

export const createUser = async (newUser: CreateUserDto): Promise<SecuredUser | undefined> => {
  const response = await api.post('/users', newUser);
  return response.status === 201 ? response.data : undefined;
};

export const uploadAvatar = async (userId: number, file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await api.post(`/users/${userId}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  if (response.status !== 200) {
    throw new Error('Failed to upload avatar');
  }
  
  return response.data.avatarPath;
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

export const updateUser = async (id: number, payload: UpdateUserDto): Promise<SecuredUser | undefined> => {
  const response = await api.patch(`/users/${id}`, payload);
  return response.status === 200 ? response.data : undefined;
};

export const updateProfile = async (id: number, payload: UpdateProfileDto): Promise<SecuredUser | undefined> => {
  const response = await api.put(`/users/${id}/profile`, payload);
  return response.status === 200 ? response.data : undefined;
};

export const setUserStatus = async (id: number, status: UserAccountStatus): Promise<boolean> => {
  const response = await api.post(`/users/${id}/status`, { value: status });
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
  /**
   * Получает пользователя по ID.
   * @param id - Идентификатор пользователя.
   * @returns Обещание с данными пользователя.
   */
  async get(id: number): Promise<SecuredUser> {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  /**
   * Создает нового пользователя.
   * @param user - Данные нового пользователя.
   * @returns Обещание с данными созданного пользователя.
   */
  async create(user: CreateUserDto): Promise<SecuredUser> {
    const response = await axios.post(API_URL, user);
    return response.data;
  },

  /**
   * Обновляет существующего пользователя.
   * @param id - Идентификатор пользователя.
   * @param user - Обновленные данные пользователя.
   * @returns Обещание с данными обновленного пользователя.
   */
  async update(id: number, user: UpdateUserDto): Promise<SecuredUser> {
    const response = await axios.put(`${API_URL}/${id}`, user);
    return response.data;
  }
};

export default usersApi;
