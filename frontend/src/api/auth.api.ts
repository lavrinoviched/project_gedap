import { api } from './axios';
import { LoginResponseDto } from '../../../backend/src/common/types';
import axios from 'axios'; // Импортируем axios для обработки ошибок

function useJwtToken(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export async function login(username: string, password: string): Promise<LoginResponseDto | undefined> {
  const response = await api.post('/auth/login', { username, password });
  if (response.status === 200) {
    useJwtToken(response.data.access_token);
    localStorage.setItem('ttm-session', JSON.stringify(response.data));
    return response.data;
  }
  return undefined;
}

export async function refresh(): Promise<LoginResponseDto | undefined> {
  const rawSavedSession = localStorage.getItem('ttm-session');
  if (rawSavedSession) {
    const savedSession: LoginResponseDto = JSON.parse(rawSavedSession);
    useJwtToken(savedSession.access_token);
    return savedSession;
  }
  return undefined;
}

export function logout(): void {
  localStorage.removeItem('ttm-session');
}

export async function signup(payload: {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
}): Promise<{ success: boolean; message?: string }> {
  try {
    await api.post('/auth/signup', payload);
    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        return { success: false, message: 'Пользователь с таким логином уже существует' };
      }
      return { success: false, message: error.response?.data?.message || 'Ошибка регистрации' };
    }
    return { success: false, message: 'Сетевая ошибка. Проверьте подключение к интернету' };
  }
}
