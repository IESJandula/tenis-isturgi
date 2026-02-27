import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Liga from '../views/Liga.vue'
import Galeria from '../views/Galeria.vue'
import Club from '../views/Club.vue'
import Escuela from '../views/Escuela.vue'
import Torneos from '../views/Torneos.vue'
import Contacto from '../views/Contacto.vue'
import EnConstruccion from '../views/EnConstruccion.vue'
import NoticiaDetalle from '../pages/noticiaDetalle.vue'
import TorneoDetalle from '../pages/torneoDetalle.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/liga', component: Liga },
  { path: '/galeria', component: Galeria },
  { path: '/club', component: Club },
  { path: '/escuela', component: Escuela },
  { path: '/torneos', component: Torneos },
  { path: '/contacto', component: Contacto },
  { path: '/noticia/:id', component: NoticiaDetalle },
  { path: '/torneo/:id', component: TorneoDetalle },
  { path: '/login', component: EnConstruccion }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router