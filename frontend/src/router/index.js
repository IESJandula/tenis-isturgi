import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Liga from '../views/Liga.vue'
import Galeria from '../views/Galeria.vue'
import Club from '../views/Club.vue'
import Escuela from '../views/Escuela.vue'
import Torneos from '../views/Torneos.vue'
import Contacto from '../views/Contacto.vue'
import Noticias from '../views/Noticias.vue'
import Disponibilidad from '../views/Disponibilidad.vue'
import AdminGestion from '../views/AdminGestion.vue'
import AdminMantenimiento from '../views/AdminMantenimiento.vue'
import Login from '../views/Login.vue'
import SocioDashboard from '../views/SocioDashboard.vue'
import MisPartidos from '../views/MisPartidos.vue'
import NoticiaDetalle from '../pages/noticiaDetalle.vue'
import TorneoDetalle from '../pages/torneoDetalle.vue'
import { useAuth } from '../utils/auth'

const routes = [
  { path: '/', component: Home },
  { path: '/liga', component: Liga },
  { path: '/galeria', component: Galeria },
  { path: '/club', component: Club },
  { path: '/escuela', component: Escuela },
  { path: '/torneos', component: Torneos },
  { path: '/noticias', component: Noticias },
  {
    path: '/disponibilidad',
    component: Disponibilidad,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin-gestion',
    component: AdminGestion,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin-mantenimiento',
    component: AdminMantenimiento,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  { path: '/login', component: Login },
  {
    path: '/socio-dashboard',
    component: SocioDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/mis-partidos',
    component: MisPartidos,
    meta: { requiresAuth: true }
  },
  { path: '/contacto', component: Contacto },
  { path: '/noticia/:id', component: NoticiaDetalle },
  { path: '/torneo/:id', component: TorneoDetalle }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login');
  } else if (to.meta.requiresAdmin && !isAdmin()) {
    next('/socio-dashboard');
  } else {
    next();
  }
});

export default router