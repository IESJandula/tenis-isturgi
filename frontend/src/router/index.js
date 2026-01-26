import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Liga from '../views/Liga.vue'
import EnConstruccion from '../views/EnConstruccion.vue' // <--- Importamos la nueva

const routes = [
  { path: '/', component: Home },
  { path: '/liga', component: Liga },
  
  // Rutas nuevas (apuntan a "En Construcción" por ahora)
  { path: '/club', component: EnConstruccion },
  { path: '/escuela', component: EnConstruccion },
  { path: '/torneos', component: EnConstruccion },
  { path: '/contacto', component: EnConstruccion },
  { path: '/login', component: EnConstruccion }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router