<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="user-info">
        <h1>Hola, {{ displayName }}</h1>
        <div class="user-meta" v-if="state.user?.NumeroSocio">
          <span class="meta-tag">Socio #{{ state.user.NumeroSocio }}</span>
          <span class="meta-tag ranking">{{ state.user.Nivel }}</span>
          <span class="meta-tag points">{{ puntosCalculados }} pts</span>
        </div>
        <p v-else-if="isAdmin()">Administrador del Club de Tenis Isturgi</p>
        <p v-else>Miembro del Club de Tenis Isturgi</p>
      </div>
      <button @click="handleLogout" class="btn-logout">Cerrar Sesión</button>
    </header>

    <!-- Próximo partido (solo socios, no admin) -->
    <section v-if="!isAdmin()" class="next-match glass-card">
      <div class="next-match-head">
        <h2 class="headline">Próximo partido</h2>
        <router-link to="/mis-partidos" class="next-match-link">Ver todos →</router-link>
      </div>

      <div v-if="cargandoProximo" class="next-match-state">
        <div class="spinner"></div>
        <p>Cargando tu próximo partido...</p>
      </div>

      <div v-else-if="errorProximo" class="next-match-state error">
        <p>{{ errorProximo }}</p>
      </div>

      <div v-else-if="!proximoPartido" class="next-match-state">
        <p>No tienes próximos partidos asignados.</p>
      </div>

      <div v-else class="next-match-card">
        <div class="nm-top">
          <div class="nm-title">
            <span class="nm-jornada">{{ proximoPartido.jornada?.Nombre || 'Jornada' }}</span>
            <span class="nm-estado" :class="estadoBadgeClass(proximoPartido.estado)">{{ proximoPartido.estado || 'Pendiente' }}</span>
          </div>
        </div>

        <div class="nm-players">
          <span class="nm-me">{{ formatNombre(yoEnPartido(proximoPartido)) }}</span>
          <span class="nm-vs">vs</span>
          <span class="nm-rival">{{ formatNombre(rivalEnPartido(proximoPartido)) }}</span>
        </div>

        <div class="nm-meta">
          <span>📅 {{ fmtFecha(proximoPartido.fecha) }}</span>
          <span>⏰ {{ fmtHora(proximoPartido.hora) }}</span>
          <span>📍 Pista {{ proximoPartido.pista || '?' }}</span>
        </div>
      </div>
    </section>

    <div class="dashboard-grid">
      <!-- Disponibilidad Card (Only if not Admin) -->
      <router-link v-if="!isAdmin()" to="/disponibilidad" class="dashboard-card">
        <div class="card-icon">📅</div>
        <h3>Mi Disponibilidad</h3>
        <p>Vota tus horarios para la próxima jornada de liga.</p>
        <span class="card-action">Ir ahora →</span>
      </router-link>

      <!-- Perfil Card (Only if not Admin) -->
      <router-link v-if="!isAdmin()" to="/mi-perfil" class="dashboard-card">
        <div class="card-icon">👤</div>
        <h3>Mi Perfil</h3>
        <p>Consulta tus estadísticas y datos personales.</p>
        <span class="card-action">Ver perfil →</span>
      </router-link>

      <!-- Mis Partidos Card (Only if not Admin) -->
      <router-link v-if="!isAdmin()" to="/mis-partidos" class="dashboard-card action-card">
        <div class="card-icon">🏆</div>
        <h3>Mis Partidos</h3>
        <p>Revisa tu calendario y sube el resultado de tus partidos.</p>
        <span class="card-action">Ver partidos →</span>
      </router-link>

      <!-- Admin Card (Only if Admin) -->
      <router-link v-if="isAdmin()" to="/admin-gestion" class="dashboard-card admin-card">
        <div class="card-icon">⚙️</div>
        <h3>Gestión Ligas</h3>
        <p>Panel de control para horarios, sorteos y resultados de la liga.</p>
        <span class="card-action">Acceder →</span>
      </router-link>

      <!-- Admin Mantenimiento Card (Only if Admin) -->
      <router-link v-if="isAdmin()" to="/admin-mantenimiento" class="dashboard-card maintenance-card admin-card">
        <div class="card-icon">🛠️</div>
        <h3>Mantenimiento</h3>
        <p>Gestiona noticias, torneos y datos maestros de socios.</p>
        <span class="card-action">Administrar →</span>
      </router-link>

      <!-- Admin Dashboard Card (Only if Admin) -->
      <router-link v-if="isAdmin()" to="/admin/dashboard" class="dashboard-card admin-dashboard-card admin-card">
        <div class="card-icon">📊</div>
        <h3>Dashboard</h3>
        <p>Visor global con métricas y accesos rápidos de administración.</p>
        <span class="card-action">Ir al Dashboard →</span>
      </router-link>


    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../utils/auth';
import axios from 'axios';

const { state, logout, isAdmin } = useAuth();
const router = useRouter();

const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const cargandoProximo = ref(false);
const errorProximo = ref(null);
const proximoPartido = ref(null);
const jugadorId = ref(null);
const puntosCalculados = ref(0);

const displayName = computed(() => {
  const nombre = [state.user?.Nombre, state.user?.Apellidos].filter(Boolean).join(' ').trim();
  return nombre || state.user?.displayName || state.user?.email || 'Socio';
});

const handleLogout = async () => {
  await logout();
  router.push('/login');
};

const formatNombre = (jugador) => {
  if (!jugador) return 'Por confirmar';
  return `${jugador.Nombre || ''} ${jugador.Apellidos || ''}`.trim() || jugador.email || 'Jugador';
};

const fmtFecha = (value) => {
  if (!value) return 'Por definir';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'Por definir';
  return d.toLocaleDateString('es-ES');
};

const fmtHora = (value) => {
  if (!value) return 'Por definir';
  return String(value).substring(0, 5);
};

const estadoBadgeClass = (estado) => {
  const s = String(estado || '').toLowerCase();
  if (s === 'jugado') return 'jugado';
  if (s === 'programado') return 'programado';
  if (s === 'aplazado') return 'aplazado';
  return 'pendiente';
};

const yoEnPartido = (p) => {
  if (!p) return null;
  if (!jugadorId.value) return p.jugador1 || null;
  if (p.jugador1?.id === jugadorId.value) return p.jugador1;
  if (p.jugador2?.id === jugadorId.value) return p.jugador2;
  return p.jugador1 || p.jugador2 || null;
};

const rivalEnPartido = (p) => {
  if (!p) return null;
  if (!jugadorId.value) return p.jugador2 || null;
  if (p.jugador1?.id === jugadorId.value) return p.jugador2 || null;
  if (p.jugador2?.id === jugadorId.value) return p.jugador1 || null;
  return p.jugador2 || p.jugador1 || null;
};

const toDateTime = (fecha, hora) => {
  if (!fecha) return null;
  const base = new Date(fecha);
  if (Number.isNaN(base.getTime())) return null;
  const h = hora ? String(hora).substring(0, 5) : null;
  if (h && h.includes(':')) {
    const parts = h.split(':');
    const hh = Number(parts[0]);
    const mm = Number(parts[1]);
    if (!Number.isNaN(hh)) base.setHours(hh);
    if (!Number.isNaN(mm)) base.setMinutes(mm);
  } else {
    base.setHours(0, 0, 0, 0);
  }
  base.setSeconds(0, 0);
  return base;
};

const calcularProximo = (lista) => {
  if (!Array.isArray(lista) || lista.length === 0) return null;

  const pendientes = lista.filter((p) => (p?.estado || '').toLowerCase() !== 'jugado');
  if (pendientes.length === 0) return null;

  const ahora = new Date();
  const conFecha = [];
  const sinFecha = [];

  for (const p of pendientes) {
    const dt = toDateTime(p.fecha, p.hora);
    if (dt) conFecha.push({ p, dt });
    else sinFecha.push(p);
  }

  // 1) Próximo futuro (fecha >= ahora)
  const futuros = conFecha.filter((x) => x.dt >= ahora).sort((a, b) => a.dt - b.dt);
  if (futuros.length) return futuros[0].p;

  // 2) Si no hay futuros, el más cercano con fecha (aunque esté pasado)
  conFecha.sort((a, b) => a.dt - b.dt);
  if (conFecha.length) return conFecha[0].p;

  // 3) Sin fecha programada
  return sinFecha[0] || null;
};

const cargarPuntos = async (jugadorId) => {
  try {
    const res = await axios.get(`${apiUrl}/api/clasificacions`);
    const clasificacion = res.data?.data || [];
    const jugadorClasif = clasificacion.find(c => c.jugador?.id === jugadorId || c.jugadorId === jugadorId);
    puntosCalculados.value = jugadorClasif?.puntos || 0;
  } catch (e) {
    console.error('Error cargando puntos:', e);
    puntosCalculados.value = 0;
  }
};

const cargarProximoPartido = async () => {
  if (isAdmin()) return;
  if (!state.jwt) return;

  cargandoProximo.value = true;
  errorProximo.value = null;
  proximoPartido.value = null;

  const config = { headers: { Authorization: `Bearer ${state.jwt}` } };

  try {
    let pId = state.user?.id || null;
    if (!pId) {
      const resMe = await axios.get(`${apiUrl}/api/jugadors/me`, config);
      pId = resMe.data?.data?.id || null;
    }

    if (!pId) {
      errorProximo.value = 'No se encontró tu perfil de jugador.';
      return;
    }

    jugadorId.value = pId;
    await cargarPuntos(pId);

    const res = await axios.get(`${apiUrl}/api/partidos`, { ...config, params: { jugadorId: pId } });
    const data = res.data?.data || res.data || [];
    proximoPartido.value = calcularProximo(data);
  } catch (e) {
    console.error(e);
    errorProximo.value = 'No se pudo cargar tu próximo partido.';
  } finally {
    cargandoProximo.value = false;
  }
};

watch(
  () => state.jwt,
  (jwt) => {
    if (jwt) cargarProximoPartido();
  },
  { immediate: true }
);
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
}

.user-info h1 {
  font-family: 'Outfit', sans-serif;
  font-size: 2.5rem;
  color: #ffffff;
  margin-bottom: 4px;
}

.user-info p {
  color: var(--ball);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
}

.user-meta {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.meta-tag {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
}

.meta-tag.ranking {
  border-color: var(--ball);
  color: var(--ball);
}

.meta-tag.points {
  background: linear-gradient(to right, #c7ff34, #9fcc2a);
  color: #000;
  border: none;
}

.btn-logout {
  padding: 10px 20px;
  background: rgba(255, 82, 82, 0.1);
  border: 1px solid rgba(255, 82, 82, 0.3);
  border-radius: 999px;
  color: #ff5252;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-logout:hover {
  background: #ff5252;
  color: #ffffff;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.next-match {
  padding: 24px;
  margin-bottom: 24px;
}

.next-match-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.next-match-link {
  color: var(--ball);
  font-weight: 800;
  font-size: 0.9rem;
}

.next-match-state {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(234, 242, 239, 0.7);
}

.next-match-state.error {
  color: rgba(255, 180, 180, 0.9);
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(199, 255, 52, 0.25);
  border-top-color: var(--ball);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.next-match-card {
  padding: 18px;
  border-radius: 16px;
  background: rgba(234, 242, 239, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.nm-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.nm-jornada {
  font-weight: 900;
  color: #fff;
}

.nm-estado {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.nm-estado.pendiente {
  border-color: var(--border);
  background: var(--surface);
  color: var(--text-muted);
}

.nm-estado.programado {
  border-color: var(--border-accent);
  background: var(--ball-dim);
  color: var(--ball);
}

.nm-estado.aplazado {
  border-color: var(--clay-dim);
  background: var(--clay-dim);
  color: var(--clay);
}

.nm-estado.jugado {
  border-color: var(--border-accent);
  background: var(--ball-dim);
  color: var(--ball);
}

.nm-players {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 14px;
  border-radius: 12px;
  background: rgba(0,0,0,0.25);
}

.nm-me {
  font-weight: 900;
  color: var(--ball);
}

.nm-vs {
  color: rgba(232, 240, 236, 0.35);
  font-weight: 900;
  text-transform: uppercase;
}

.nm-rival {
  font-weight: 900;
  color: #fff;
}

.nm-meta {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 16px;
  color: rgba(234, 242, 239, 0.7);
  font-weight: 700;
}

.dashboard-card {
  padding: 32px;
  background: rgba(234, 242, 239, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.dashboard-card:hover:not(.disabled) {
  transform: translateY(-8px);
  background: rgba(234, 242, 239, 0.06);
  border-color: var(--ball);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dashboard-card h3 {
  font-size: 1.4rem;
  color: #ffffff;
  margin-bottom: 12px;
}

.dashboard-card p {
  color: rgba(234, 242, 239, 0.6);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 24px;
  flex-grow: 1;
}

.card-action {
  color: var(--ball);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.card-status {
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  align-self: flex-start;
  text-transform: uppercase;
  font-weight: 600;
}

.admin-card {
  background: rgba(199, 255, 52, 0.05);
  border-color: rgba(199, 255, 52, 0.2);
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}
</style>
