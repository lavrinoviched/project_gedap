import { RouteRecordRaw } from 'vue-router';

 

const routes: RouteRecordRaw[] = [

  {

    path: '/',

    component: () => import('../../../frontend/src/storage/layout/MainLayout.vue'),

    children: [

      { path: '', component: () => import('../../../frontend/src/storage/pages/IndexPage.vue') },

      { path: 'users', component: () => import('../../../frontend/src/storage/pages/UsersPage.vue') },

      { path: 'users/:id', component: () => import('../../../frontend/src/storage/pages/UserEditPage.vue') },

    ],

  },

  {

    path: '/login',

    component: () => import('../../../frontend/src/storage/layout/ServiceLayout.vue'),

    children: [{ path: '', component: () => import('../../../frontend/src/storage/pages/LoginPage.vue') }],

  },

  {

    path: '/signup',

    component: () => import('../../../frontend/src/storage/layout/ServiceLayout.vue'),

    children: [{ path: '', component: () => import('../../../frontend/src/storage/pages/SignupPage.vue') }],

  },

 



  {

    path: '/:catchAll(.*)*',

    component: () => import('../../../frontend/src/storage/pages/ErrorNotFound.vue'),

  },

];

 

export default routes;