<template>
  <div class="admin-dashboard page fade-in">
    <header class="dashboard-header">
      <h1 class="headline">Dashboard Administrativo</h1>
      <div class="quick-stats">
        <div class="stat-card glass-card">
          <span class="val">{{ stats.partidosPendientes }}</span>
          <span class="lbl">Partidos Pendientes</span>
        </div>
        <div class="stat-card glass-card">
          <span class="val">{{ stats.inscripcionesNuevas }}</span>
          <span class="lbl">Nuevas Inscripciones</span>
        </div>
        <div class="stat-card glass-card">
          <span class="val">{{ stats.sociosActivos }}</span>
          <span class="lbl">Socios Activos</span>
        </div>
      </div>
    </header>

    <div class="dashboard-grid">
      <section class="proximos-partidos glass-card">
        <h2 class="headline">Últimos Partidos Jugados</h2>
        <div v-if="ultimosPartidos.length === 0" class="vacio">No hay partidos recientes.</div>
        <table v-else class="admin-table">
          <thead>
            <tr>
              <th>Jugadores</th>
              <th>Resultado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in ultimosPartidos" :key="p.id">
              <td>{{ p.jugador1?.Nombre }} vs {{ p.jugador2?.Nombre }}</td>
              <td><span class="res-badge">{{ p.resultado }}</span></td>
              <td>{{ new Date(p.fecha).toLocaleDateString() }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="inscripciones-recientes glass-card">
        <h2 class="headline">Inscripciones a Torneos</h2>
        <div v-if="inscripciones.length === 0" class="vacio">No hay inscripciones nuevas.</div>
        <ul v-else class="inscripciones-list">
          <li v-for="ins in inscripciones.slice(0, 5)" :key="ins.id" class="ins-item">
            <div class="user">
              <strong>{{ ins.jugador?.Nombre }} {{ ins.jugador?.Apellidos }}</strong>
              <span>se ha inscrito en {{ ins.torneo?.Nombre }}</span>
            </div>
            <time>{{ new Date(ins.fechaInscripcion).toLocaleDateString() }}</time>
          </li>
        </ul>
        <router-link to="/torneos" class="btn-text">Gestionar Torneos →</router-link>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const stats = reactive({
  partidosPendientes: 0,
  inscripcionesNuevas: 0,
  sociosActivos: 0
});

const ultimosPartidos = ref([]);
const inscripciones = ref([]);

onMounted(async () => {
  try {
    const [resPartidos, resIns, resJugadores] = await Promise.all([
      axios.get(`${API_BASE}/api/partidos?limit=50`),
      axios.get(`${API_BASE}/api/torneo-inscripciones/todo`), // Need to create this endpoint
      axios.get(`${API_BASE}/api/jugadors`)
    ]);

    const allPartidos = resPartidos.data.data || [];
    ultimosPartidos.value = allPartidos.filter(p => p.estado === 'Jugado').slice(0, 5);
    stats.partidosPendientes = allPartidos.filter(p => p.estado !== 'Jugado').length;
    
    inscripciones.value = resIns.data.data || [];
    stats.inscripcionesNuevas = inscripciones.value.length;
    
    stats.sociosActivos = (resJugadores.data.data || []).length;
  } catch (err) {
    console.error('Error cargando dashboard:', err);
  }
});
</script>

<style scoped>
.dashboard-header {
  margin-bottom: 40px;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-top: 32px;
}

.stat-card {
  padding: 32px;
  text-align: center;
}

.stat-card .val {
  display: block;
  font-family: "Syne", sans-serif;
  font-size: 3rem;
  font-weight: 800;
  color: var(--ball);
}

.stat-card .lbl {
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 1px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 32px;
}

.proximos-partidos, .inscripciones-recientes {
  padding: 32px;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 24px;
}

.admin-table th {
  text-align: left;
  color: var(--text-faint);
  font-size: 0.8rem;
  text-transform: uppercase;
  padding: 12px;
  border-bottom: 1px solid var(--border);
}

.admin-table td {
  padding: 16px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.res-badge {
  background: var(--ball-dim);
  color: var(--ball);
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 700;
  font-family: monospace;
}

.inscripciones-list {
  list-style: none;
  padding: 0;
  margin: 24px 0;
}

.ins-item {
  padding: 16px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ins-item .user {
  display: flex;
  flex-direction: column;
}

.ins-item time {
  font-size: 0.8rem;
  color: var(--text-faint);
}

.btn-text {
  color: var(--ball);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
