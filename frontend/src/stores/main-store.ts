import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';
// import { useQuasar } from 'quasar';
import {
  LoginResponseDto,
  Role,
  SecuredUser,
  UserAccountStatus,
} from '../../../backend/src/common/types';
// import * as authApi from '../api/auth.api';

export const useMainStore = defineStore('main', () => {
  // const $q = useQuasar();
  const state = reactive({
    userId: 0,
    username: 'unknown',
    firstname: 'unknown',
    lastname: 'unknown',
    roles: [] as Role[],
    userStatus: UserAccountStatus,
    token: '', // Добавляем токен в состояние
  });

  const initAppState = (appState: LoginResponseDto & { token?: string }) => {
    state.userId = appState.userId;
    state.username = appState.username;
    state.firstname = appState.firstname;
    state.lastname = appState.lastname;
    state.roles = appState.roles;
    state.token = appState.token || '';
    if (appState.token) {
      localStorage.setItem('authToken', appState.token);
    }
  };

  const getCurrentUser = (): SecuredUser => {
    return {
      id: state.userId,
      email: state.username,
      firstname: state.firstname,
      lastname: state.lastname,
      roles: state.roles,
      status: UserAccountStatus.active,
      token: state.token || localStorage.getItem('authToken') || ''
    };
  };

  const isAdmin = () => state.roles.some((r) => r == Role.admin);
  const isUser = () => state.roles.some((r) => r == Role.user);

  return {
    ...toRefs(state),
    initAppState,
    isAdmin,
    isUser,
    getCurrentUser,
  };
});
