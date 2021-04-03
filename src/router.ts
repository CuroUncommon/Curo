import { RouteRecordRaw } from 'vue-router'
import Authvue from '~/pages/Auth/Auth.vue'

export const appRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/auth',
  },
  {
    path: '/auth',
    component: Authvue,
  },
]
