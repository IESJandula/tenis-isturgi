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
              <td>{{ p.jugador1?.Nombre }} {{ p.jugador1?.Apellidos }} vs {{ p.jugador2?.Nombre }} {{ p.jugador2?.Apellidos }}</td>
              <td><span class="res-badge">{{ p.resultado }}</span></td>
              <td>{{ new Date(p.fecha).toLocaleDateString() }}</td>
            </tr>
          </tbody>
        </table>
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
  sociosActivos: 0
});

const ultimosPartidos = ref([]);

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
  grid-template-columns: 1fr;
  gap: 32px;
}

.proximos-partidos {
  padding: 32px;
  text-align: center;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 24px;
}

.admin-table th {
  text-align: center;
  color: var(--text-faint);
  font-size: 0.8rem;
  text-transform: uppercase;
  padding: 12px;
  border-bottom: 1px solid var(--border);
}

.admin-table td {
  padding: 16px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  text-align: center;
}

.res-badge {
  background: var(--ball-dim);
  color: var(--ball);
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 700;
  font-family: monospace;
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
