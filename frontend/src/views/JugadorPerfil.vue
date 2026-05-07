<template>
  <div class="jugador-perfil page fade-in">
    <div v-if="cargando" class="estado">Cargando perfil de jugador...</div>
    <div v-else-if="error" class="estado error">{{ error }}</div>
    
    <template v-else>
      <header class="perfil-header glass-card">
        <div class="avatar-wrapper">
          <img :src="jugador.Foto || '/logo-isturgi.jpg'" alt="Avatar" class="avatar" />
        </div>
        <div class="info">
          <h1 class="headline">{{ jugador.Nombre }} {{ jugador.Apellidos }}</h1>
          <div class="tags">
            <span class="mini-tag">{{ jugador.Nivel || 'Nivel medio' }}</span>
            <span class="mini-tag">{{ jugador.Categoria || 'Absoluto' }}</span>
          </div>
        </div>
        <div class="stats-overview">
          <div class="stat-item">
            <span class="val">{{ partidos.length }}</span>
            <span class="lbl">Partidos</span>
          </div>
          <div class="stat-item">
            <span class="val">{{ victorias }}</span>
            <span class="lbl">Victorias</span>
          </div>
          <div class="stat-item win-rate">
            <span class="val">{{ winRate }}%</span>
            <span class="lbl">Win Rate</span>
          </div>
        </div>
      </header>

      <div class="perfil-grid">
        <section class="historial glass-card">
          <h2 class="headline">Historial de Partidos</h2>
          <div v-if="partidos.length === 0" class="vacio">No hay partidos registrados todavía.</div>
          <ul v-else class="partidos-list">
            <li v-for="p in partidos" :key="p.id" class="partido-item" :class="{ victoria: ganoYo(p) }">
              <div class="meta">
                <span class="fecha">{{ p.fecha ? new Date(p.fecha).toLocaleDateString() : 'Pendiente' }}</span>
                <span class="rival">vs {{ rivalNombre(p) }}</span>
              </div>
              <div class="resultado">
                {{ p.resultado || 'Pendiente' }}
              </div>
              <div class="tag-resultado">
                {{ ganoYo(p) ? 'W' : (p.estado === 'Jugado' ? 'L' : 'P') }}
              </div>
            </li>
          </ul>
        </section>

        <section class="graficos glass-card">
          <h2 class="headline">Rendimiento</h2>
          <div class="chart-mockup">
            <div class="bar-container">
              <div class="bar win" :style="{ height: winRate + '%' }"></div>
              <div class="bar loss" :style="{ height: (100 - winRate) + '%' }"></div>
            </div>
            <div class="chart-labels">
              <span>Victorias</span>
              <span>Derrotas</span>
            </div>
          </div>
          <p class="stats-text">
            Este jugador ha disputado {{ partidos.length }} partidos en la división actual. 
            Su rendimiento actual es del {{ winRate }}% de victorias.
          </p>
        </section>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const jugador = ref({});
const partidos = ref([]);
const cargando = ref(true);
const error = ref(null);

const victorias = computed(() => {
  return partidos.value.filter(p => ganoYo(p)).length;
});

const winRate = computed(() => {
  const jugados = partidos.value.filter(p => p.estado === 'Jugado').length;
  if (jugados === 0) return 0;
  return Math.round((victorias.value / jugados) * 100);
});

const ganoYo = (partido) => {
  if (partido.estado !== 'Jugado' || !partido.ganador) return false;
  const idGanador = typeof partido.ganador === 'object' ? partido.ganador.id : partido.ganador;
  return idGanador === Number(route.params.id);
};

const rivalNombre = (partido) => {
  const esJ1 = partido.jugador1?.id === Number(route.params.id);
  const rival = esJ1 ? partido.jugador2 : partido.jugador1;
  if (!rival) return 'Por confirmar';
  return `${rival.Nombre || ''} ${rival.Apellidos || ''}`.trim();
};

onMounted(async () => {
  const id = route.params.id;
  try {
    const resJugador = await axios.get(`${API_BASE}/api/jugadors/${id}`);
    jugador.value = resJugador.data?.data || {};

    const resPartidos = await axios.get(`${API_BASE}/api/partidos`, {
      params: { jugadorId: id }
    });
    partidos.value = resPartidos.data?.data || [];
  } catch (err) {
    console.error(err);
    error.value = 'No se pudo cargar la información del jugador.';
  } finally {
    cargando.value = false;
  }
});
</script>

<style scoped>
.perfil-header {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 40px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--ball);
  box-shadow: var(--glow);
}

.info {
  flex: 1;
  min-width: 250px;
}

.info h1 {
  margin: 0 0 12px;
  font-size: 2.5rem;
}

.tags {
  display: flex;
  gap: 12px;
}

.stats-overview {
  display: flex;
  gap: 32px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-item .val {
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  font-family: "Syne", sans-serif;
}

.stat-item .lbl {
  font-size: 0.8rem;
  color: var(--text-faint);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 1px;
}

.win-rate .val {
  color: var(--ball);
}

.perfil-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 32px;
}

.historial, .graficos {
  padding: 32px;
}

.historial h2, .graficos h2 {
  margin-bottom: 24px;
  font-size: 1.5rem;
}

.partidos-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.partido-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid var(--border);
}

.partido-item.victoria {
  border-color: rgba(74, 222, 128, 0.3);
  background: rgba(74, 222, 128, 0.05);
}

.partido-item .meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.fecha {
  font-size: 0.8rem;
  color: var(--text-faint);
}

.rival {
  font-weight: 700;
  font-size: 1rem;
}

.resultado {
  font-family: "Syne", sans-serif;
  font-weight: 800;
  font-size: 1.2rem;
  color: #fff;
}

.tag-resultado {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-faint);
}

.victoria .tag-resultado {
  background: var(--ball);
  color: var(--ink);
}

/* Chart Mockup */
.chart-mockup {
  height: 200px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.bar-container {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 32px;
  padding: 0 40px;
}

.bar {
  flex: 1;
  border-radius: 8px 8px 0 0;
  min-height: 10px;
  transition: height 1s ease;
}

.bar.win {
  background: var(--ball);
  box-shadow: 0 0 20px rgba(199, 255, 52, 0.3);
}

.bar.loss {
  background: rgba(255, 255, 255, 0.1);
}

.chart-labels {
  display: flex;
  justify-content: space-around;
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 600;
}

.stats-text {
  color: var(--text-muted);
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .perfil-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .perfil-header {
    flex-direction: column;
    text-align: center;
    padding: 32px;
  }
  .stats-overview {
    justify-content: center;
    width: 100%;
  }
}
</style>
