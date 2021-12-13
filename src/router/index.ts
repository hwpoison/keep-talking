import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import Chat from '../views/Chat.vue'
import Contacts from '../views/Contacts.vue'
import Settings from '../views/Settings.vue'
import AddContact from '../views/AddContact.vue'
import Help from '../views/Help.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Contacts',
    component: Contacts
  },
  {
    path: '/chat/:id',
    name: 'ChatRoom',
    component: Chat
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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
