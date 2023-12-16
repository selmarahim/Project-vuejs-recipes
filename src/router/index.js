import { createRouter, createWebHistory } from 'vue-router'
import MenuSemaine from '@/components/MenuSemaine.vue'
import MenuInput from '@/components/MenuInput.vue'
import Home from '@/components/Home.vue'
import foodly from '@/components/foodly.vue'
const routes = [
  {
    path: '/about',
    name: 'about',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },

  { path: '/home', component: Home },
  { path: '/menu-semaine', component: MenuSemaine },
  { path: '/menu-input', component: MenuInput },
  { path: '/foodly', component: foodly },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
