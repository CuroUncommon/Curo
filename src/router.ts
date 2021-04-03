import { RouteRecordRaw } from 'vue-router'
import Authvue from '~/pages/Auth/Auth.vue'
import Appvue from '~/pages/App/App.vue'

export const appRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/auth',
  },
  {
    path: '/auth',
    component: Authvue,
  },
  {
    path: '/app',
    component: Appvue,
  },
]
