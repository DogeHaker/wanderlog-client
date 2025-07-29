import { createRouter, createWebHistory } from "vue-router"

import Travels from './views/Travels.vue'
import New from './views/New.vue'
import Edit from './views/Edit.vue'
import Show from './views/Show.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'

const routes = [
  { 
    path: '/', 
    redirect: '/login' 
  },
  { 
    path: '/travels', 
    component: Travels 
  },
  { 
    path: '/travels/new', 
    component: New 
  },
  { 
    path: '/travels/:id', 
    component: Show 
  },
  { 
    path: '/travels/:id/edit', 
    component: Edit 
  },
  { 
    path: '/login', 
    component: Login 
  },
  { 
    path: '/register', 
    component: Register 
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Redirect to login if not logged in
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('userId')
  if (!isLoggedIn && to.path !== '/login' && to.path !== '/register') {
    next('/login')
  } else {
    next()
  }
})

export default router