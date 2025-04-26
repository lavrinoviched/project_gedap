import { RouteRecordRaw } from 'vue-router';



const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'users', component: () => import('pages/UsersPage.vue') },
      { path: 'gallery', component: () => import('pages/ProjectsPage.vue') },
    
      { path: 'profile', component: () => import('components/UserProfile.vue') }, // Добавляем маршрут профиля
      { path: 'tasks', component: () => import('pages/TasksPage.vue') },
      { path: 'teams', component: () => import('pages/TeamsPage.vue') },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/signup',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [{ path: '', component: () => import('pages/SignupPage.vue') }],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
{
  path: '/users',
  component: () => import('components/UserProfile.vue'),
  children: [
    { path: 'edit', component: () => import('pages/UserEditPage.vue') },
  ],
},
{
  path: '/admin/applications',
  component: () => import('pages/ApplicationsPage.vue'),
  meta: { requiresAdmin: true },
  children: [
    { path: '', redirect: '/admin/applications/teams' },
    { path: 'teams', component: () => import('components/applications/TeamApplications.vue') },
    { path: 'projects', component: () => import('components/applications/ProjectApplications.vue') },
    { path: 'ideas', component: () => import('components/applications/IdeaApplications.vue') },
    { path: 'customers', component: () => import('components/applications/CustomerApplications.vue') },
  ],
},

]
export default routes;