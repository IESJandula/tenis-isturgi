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
import AdminDashboard from '../views/AdminDashboard.vue'
import MisPartidos from '../views/MisPartidos.vue'
import PerfilSocio from '../views/PerfilSocio.vue'
import NoticiaDetalle from '../pages/noticiaDetalle.vue'
import TorneoDetalle from '../pages/torneoDetalle.vue'
import JugadorPerfil from '../views/JugadorPerfil.vue'
import { useAuth } from '../utils/auth'

const routes = [
  { path: '/', component: Home, meta: { title: 'Inicio' } },
  { path: '/liga', component: Liga, meta: { title: 'Liga' } },
  { path: '/jugador/:id', component: JugadorPerfil, meta: { title: 'Perfil de Jugador' } },
  { path: '/galeria', component: Galeria, meta: { title: 'Galería' } },
  { path: '/club', component: Club, meta: { title: 'El Club' } },
  { path: '/escuela', component: Escuela, meta: { title: 'Escuela' } },
  { path: '/torneos', component: Torneos, meta: { title: 'Torneos' } },
  { path: '/noticias', component: Noticias, meta: { title: 'Noticias' } },
  {
    path: '/disponibilidad',
    component: Disponibilidad,
    meta: { requiresAuth: true, title: 'Disponibilidad' }
  },
  {
    path: '/admin/dashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Admin · Dashboard' }
  },
  {
    path: '/admin/calendario',
    alias: '/admin-gestion',
    component: AdminGestion,
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Admin · Gestión' }
  },
  {
    path: '/admin-mantenimiento',
    component: AdminMantenimiento,
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Admin · Mantenimiento' }
  },
  { path: '/login', component: Login, meta: { title: 'Acceder' } },
  {
    path: '/socio-dashboard',
    component: SocioDashboard,
    meta: { requiresAuth: true, title: 'Mi cuenta' }
  },
  {
    path: '/mis-partidos',
    component: MisPartidos,
    meta: { requiresAuth: true, title: 'Mis partidos' }
  },
  {
    path: '/mi-perfil',
    component: PerfilSocio,
    meta: { requiresAuth: true, title: 'Mi perfil' }
  },
  { path: '/contacto', component: Contacto, meta: { title: 'Contacto' } },
  { path: '/noticia/:id', component: NoticiaDetalle, meta: { title: 'Noticia' } },
  { path: '/torneo/:id', component: TorneoDetalle, meta: { title: 'Torneo' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Si ya estás autenticado, no tiene sentido volver al login
  if (to.path === '/login' && isAuthenticated()) {
    const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : '/socio-dashboard';
    next(redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/socio-dashboard');
    return;
  }

  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else if (to.meta.requiresAdmin && !isAdmin()) {
    next('/socio-dashboard');
  } else {
    next();
  }
});

router.afterEach((to) => {
  const base = 'Club de Tenis Isturgi';
  const title = to.meta?.title ? `${to.meta.title} · ${base}` : base;
  document.title = title;
});

export default router