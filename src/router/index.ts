import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import Chat from '../views/Chat.vue'
import Settings from '../views/Settings.vue'
import AddContact from '../views/AddContact.vue'
import Help from '../views/Help.vue'
import Switch from '../views/Switch.vue'
import PageNotFound from '../views/PageNotFound.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Switch',
    component: Switch
  },
  {
    path: '/chat/:contactId',
    name: 'ChatRoom',
    component: Chat,
    props: true,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/newcontact',
    name: 'AddContact',
    component: AddContact
  },
  {
    path: '/help',
    name: 'Help',
    component: Help
  },
  {
    path: '/:catchAll(.*)',
    name: '404',
    component:PageNotFound
  }
]

const router = createRouter({
  history:createWebHistory(),
  routes
})

export default router
