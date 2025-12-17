import { createRouter, createWebHistory } from 'vue-router'

// Páginas
import Home from '../pages/Home.vue'
import Noticias from '../pages/Noticias.vue'
import NoticiaDetalle from '../pages/NoticiaDetalle.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/noticias', name: 'noticias', component: Noticias },
  { path: '/noticias/:id', name: 'noticia-detalle', component: NoticiaDetalle },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
