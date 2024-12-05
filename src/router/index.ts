// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/landing.vue'
import Capture from '../views/capture.vue'
import Transform from '../views/transform.vue'
import Review from '../views/review.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing
    },
    {
      path: '/capture',
      name: 'capture', 
      component: Capture
    },
    {
      path: '/transform',
      name: 'transform', 
      component: Transform
    },
    {
      path: '/review',
      name: 'review', 
      component: Review
    },
  ]
})

export default router