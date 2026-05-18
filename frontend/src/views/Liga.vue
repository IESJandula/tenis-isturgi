<template>
  <div class="liga-container">
    <header class="header">
      <div>
        <h1>{{ vista === 'calendario' ? 'Calendario de la Liga' : 'Clasificación General' }}</h1>
        <p>{{ vista === 'calendario' ? 'Jornadas y cruces todos contra todos' : 'Puntos y estadísticas actualizadas' }}</p>
      </div>

      <div class="header-actions">
        <div class="view-toggle">
          <button 
            :class="['toggle-btn', { activo: vista === 'calendario' }]" 
            @click="vista = 'calendario'"
          >
            Calendario
          </button>
          <button 
            :class="['toggle-btn', { activo: vista === 'clasificacion' }]" 
            @click="vista = 'clasificacion'"
          >
            Clasificación
          </button>
        </div>

        <div class="division-select">
          <button
            v-for="division in divisiones"
            :key="division.id"
            :class="['chip', { activo: division.id === divisionId }]"
            @click="divisionId = division.id"
          >
            {{ division.label }}
          </button>
        </div>
      </div>
    </header>

    <section v-if="cargando" class="estado">Cargando datos...</section>
    <section v-else-if="error" class="estado error">{{ error }}</section>

    <template v-else>
      <!-- VISTA CALENDARIO -->
      <section v-if="vista === 'calendario'" class="jornadas-grid stagger">
        <article v-for="(jornada, index) in jornadas" :key="jornada.id" class="jornada-card glass-card">
          <div class="jornada-header">
            <h2 class="headline">Jornada {{ jornada.numero ?? index + 1 }}</h2>
            <span class="jornada-nombre">{{ jornada.Nombre || 'Sin nombre' }}</span>
          </div>

          <ul v-if="jornada.partidos && jornada.partidos.length" class="partidos-list">
            <li v-for="partido in jornada.partidos" :key="partido.id" class="partido-item">
              <div class="match-info">
                <div class="jugadores">
                  <router-link 
                    v-if="partido.jugador1" 
                    :to="'/jugador/' + partido.jugador1.id" 
                    class="jugador-link"
                    :class="{ ganador: elGanadorEs(partido, 1) }"
                  >
                    {{ nombreJugador(partido.jugador1) }}
                  </router-link>
                  <span v-else class="jugador">Por confirmar</span>
                  
                  <span class="vs">vs</span>
                  
                  <router-link 
                    v-if="partido.jugador2" 
                    :to="'/jugador/' + partido.jugador2.id" 
                    class="jugador-link"
                    :class="{ ganador: elGanadorEs(partido, 2) }"
                  >
                    {{ nombreJugador(partido.jugador2) }}
                  </router-link>
                  <span v-else class="jugador">Por confirmar</span>
                </div>
                
                <div v-if="partido.estado === 'Jugado'" class="resultado-badge">
                  {{ partido.resultado }}
                </div>
              </div>

              <div class="meta">
                <div class="details">
                  <span class="estado-pill" :class="partido.estado?.toLowerCase()">{{ partido.estado || 'Pendiente' }}</span>
                  <span v-if="formatoMeta(partido)" class="detalle">{{ formatoMeta(partido) }}</span>
                </div>
                
                <button 
                  v-if="isAdmin()" 
                  class="btn-edit-result"
                  title="Editar resultado"
                  @click="abrirModal(partido)"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
              </div>
            </li>
          </ul>

          <p v-else class="vacio">Sin partidos registrados</p>
        </article>
      </section>

      <!-- VISTA CLASIFICACION -->
      <section v-else-if="vista === 'clasificacion'" class="clasificacion-section">
        <div class="table-wrapper">
          <table class="tabla-clasif">
            <thead>
              <tr class="gesliga-header">
                <th class="al-left">Pos</th>
                <th class="al-left">Jugador/a</th>
                <th>PJ</th>
                <th>PG</th>
                <th>PP</th>
                <th>SF</th>
                <th>SC</th>
                <th>DS</th>
                <th>JF</th>
                <th>JC</th>
                <th>DJ</th>
                <th>Pt</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(fila, idx) in clasificacion" :key="fila.id" :class="getFilaClass(idx)">
                <td class="pos">{{ idx + 1 }}</td>
                <td class="nombre-jugador">
                  <router-link :to="'/jugador/' + fila.jugador.id" class="table-jugador-link">
                    {{ nombreJugador(fila.jugador) }}
                  </router-link>
                </td>
                <td class="num">{{ fila.jugados }}</td>
                <td class="num">{{ fila.ganados }}</td>
                <td class="num">{{ fila.perdidos }}</td>
                <td class="num">{{ fila.setsFavor }}</td>
                <td class="num">{{ fila.setsContra }}</td>
                <td class="num bold">{{ fila.setsFavor - fila.setsContra }}</td>
                <td class="num">{{ fila.juegosFavor || 0 }}</td>
                <td class="num">{{ fila.juegosContra || 0 }}</td>
                <td class="num bold">{{ (fila.juegosFavor || 0) - (fila.juegosContra || 0) }}</td>
                <td class="puntos num">{{ fila.puntos }}</td>
              </tr>
              <tr v-if="!clasificacion.length">
                <td colspan="12" class="vacio-tabla">No hay datos de clasificación para esta división.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>

    <ModalResultados 
      :is-open="modalAbierto" 
      :partido="partidoSeleccionado"
      @close="modalAbierto = false"
      @saved="onResultadoGuardado"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import axios from 'axios';
import { useAuth } from '../utils/auth';
import ModalResultados from '../components/ModalResultados.vue';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const { isAdmin } = useAuth();

const vista = ref('calendario'); // 'calendario' | 'clasificacion'
const divisiones = ref([]);
const divisionId = ref(null);
const jornadas = ref([]);
const clasificacion = ref([]);
const cargando = ref(false);
const error = ref(null);

// Modal Logic
const modalAbierto = ref(false);
const partidoSeleccionado = ref({});

const abrirModal = (partido) => {
  partidoSeleccionado.value = partido;
  modalAbierto.value = true;
};

const onResultadoGuardado = () => {
  if (vista.value === 'calendario') cargarCalendario();
  else cargarClasificacion();
};

const getFilaClass = (index) => {
  if (index < 4) return 'zona-ascenso';
  if (index >= clasificacion.value.length - 3 && clasificacion.value.length > 6) return 'zona-descenso';
  return '';
};

const cargarDivisiones = async () => {
  try {
    const respuesta = await axios.get(`${API_BASE}/api/divisions`);
    const items = respuesta.data?.data || [];

    divisiones.value = items.map((division) => ({
      id: division.id,
      label: division.Nombre || `División ${division.id}`,
    }));

    if (!divisionId.value && divisiones.value.length) {
      divisionId.value = divisiones.value[0].id;
    }
  } catch (err) {
    console.error(err);
    error.value = 'No se pudieron cargar las divisiones. Revisa el servidor.';
  }
};

const cargarCalendario = async () => {
  if (!divisionId.value) return;
  cargando.value = true;
  try {
    const respuesta = await axios.get(
      `${API_BASE}/api/jornadas/division/${divisionId.value}/jornadas?limit=100`
    );
    const data = respuesta.data || [];
    jornadas.value = data
      .slice()
      .sort((a, b) => (a.numero ?? a.Numero ?? 0) - (b.numero ?? b.Numero ?? 0));
  } catch (err) {
    console.error(err);
    error.value = 'No se pudo cargar el calendario.';
  } finally {
    cargando.value = false;
  }
};

const cargarClasificacion = async () => {
  if (!divisionId.value) return;
  cargando.value = true;
  try {
    const respuesta = await axios.get(`${API_BASE}/api/clasificacions`, {
      params: {
        'filters[division][id]': divisionId.value
      }
    });

    let data = respuesta.data?.data || [];
    
    // El ordenamiento lo seguimos haciendo en cliente para asegurar Pt > DS > DJ
    data.sort((a, b) => {
      if ((b.puntos || 0) !== (a.puntos || 0)) return (b.puntos || 0) - (a.puntos || 0);
      const dsA = (a.setsFavor || 0) - (a.setsContra || 0);
      const dsB = (b.setsFavor || 0) - (b.setsContra || 0);
      if (dsB !== dsA) return dsB - dsA;
      const djA = (a.juegosFavor || 0) - (a.juegosContra || 0);
      const djB = (b.juegosFavor || 0) - (b.juegosContra || 0);
      if (djB !== djA) return djB - djA;
      return 0;
    });

    clasificacion.value = data;
  } catch (err) {
    console.error(err);
    error.value = 'No se pudo cargar la clasificación.';
  } finally {
    cargando.value = false;
  }
};

const cargarTab = () => {
  if (vista.value === 'calendario') cargarCalendario();
  else cargarClasificacion();
};

const elGanadorEs = (partido, numJugador) => {
  if (partido.estado !== 'Jugado' || !partido.ganador) return false;
  const idGanador = typeof partido.ganador === 'object' ? partido.ganador.id : partido.ganador;
  const j = numJugador === 1 ? partido.jugador1 : partido.jugador2;
  return j && j.id === idGanador;
};

const nombreJugador = (jugador) => {
  if (!jugador) return 'Por confirmar';
  const nombre = jugador.Nombre || jugador.username || '';
  const apellidos = jugador.Apellidos || '';
  return `${nombre} ${apellidos}`.trim() || 'Por confirmar';
};

const formatoMeta = (partido) => {
  const partes = [];
  if (partido.fecha) partes.push(new Date(partido.fecha).toLocaleDateString());
  if (partido.hora) partes.push(partido.hora.slice(0, 5));
  if (partido.pista) partes.push(`Pista ${partido.pista}`);
  return partes.join(' • ');
};

watch(divisionId, cargarTab);
watch(vista, cargarTab);

onMounted(() => {
  cargarDivisiones().then(() => {
    if (divisionId.value) cargarTab();
  });
});
</script>

<style scoped>
.liga-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 40px;
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
  background:
    linear-gradient(rgba(0,0,0,0.58), rgba(0,0,0,0.58)),
    url('/cancha.jpg') center/cover no-repeat;
  border: 1px solid var(--glass-stroke);
  backdrop-filter: blur(20px);
}

.header > div:first-child {
  width: 100%;
  text-align: center;
}

.header h1 {
  margin: 0 0 14px;
  color: #fff;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-family: "Syne", sans-serif;
  font-weight: 800;
  letter-spacing: -1px;
}

.header p {
  margin: 0;
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.2rem;
  line-height: 1.7;
  max-width: 760px;
  margin-inline: auto;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  width: 100%;
}

/* TABS */
.view-toggle {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  padding: 6px;
  border-radius: 16px;
  border: 1px solid var(--border);
}

.toggle-btn {
  padding: 10px 24px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.toggle-btn.activo {
  background: var(--ball);
  color: var(--ink);
  box-shadow: 0 4px 12px rgba(199, 255, 52, 0.25);
}

.division-select {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.chip {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 999px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-size: 0.75rem;
  transition: all 0.2s ease;
}

.chip:hover {
  background: var(--surface-hover);
  border-color: rgba(255, 255, 255, 0.2);
}

.chip.activo {
  background: rgba(255, 255, 255, 0.1);
  color: var(--ball);
  border-color: var(--ball);
}

.estado {
  padding: 40px;
  text-align: center;
  color: var(--text-muted);
}

/* CALENDARIO */
.jornadas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 24px;
}

.jornada-card {
  padding: 24px;
}

.jornada-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.jornada-header h2 {
  margin: 0;
  font-size: 1.3rem;
  color: #fff;
}

.jornada-nombre {
  font-size: 0.85rem;
  color: var(--text-faint);
  font-weight: 600;
}

.partidos-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.partido-item {
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.partido-item:hover {
  transform: translateX(4px);
  border-color: rgba(255, 255, 255, 0.1);
}

.match-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.jugadores {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.jugador-link {
  flex: 1;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-muted);
  transition: color 0.2s ease;
}

.jugador-link:hover {
  color: var(--ball);
}

.jugador-link.ganador {
  color: #fff;
  font-weight: 700;
}

.table-jugador-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}

.table-jugador-link:hover {
  color: var(--ball) !important;
}

.vs {
  font-size: 0.75rem;
  color: var(--text-faint);
  font-weight: 800;
  font-style: italic;
  text-transform: uppercase;
}

.resultado-badge {
  background: var(--ball-dim);
  color: var(--ball);
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 800;
  font-size: 1.1rem;
  text-align: center;
  font-variant-numeric: tabular-nums;
  border: 1px solid var(--border-accent);
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
}

.details {
  display: flex;
  align-items: center;
  gap: 12px;
}

.estado-pill {
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-faint);
}

.estado-pill.jugado {
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
}

.detalle {
  font-size: 0.8rem;
  color: var(--text-faint);
}

.btn-edit-result {
  background: transparent;
  border: none;
  color: var(--text-faint);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.btn-edit-result:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--ball);
}

.btn-edit-result svg {
  width: 18px;
  height: 18px;
}

/* CLASIFICACION */
.clasificacion-section {
  background: var(--glass);
  border: 1px solid var(--glass-stroke);
  border-radius: var(--radius-xl);
  overflow: hidden;
  backdrop-filter: blur(20px);
}

.table-wrapper {
  overflow-x: auto;
}

.tabla-clasif {
  width: 100%;
  border-collapse: collapse;
}

.tabla-clasif th {
  padding: 20px 16px;
  text-align: right;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-faint);
  border-bottom: 1px solid var(--border);
}

.tabla-clasif th.al-left {
  text-align: left;
}

.tabla-clasif td {
  padding: 16px;
  text-align: right;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.tabla-clasif td.al-left {
  text-align: left;
}

.pos {
  font-weight: 800;
  color: var(--text-faint);
  width: 60px;
}

.nombre-jugador {
  font-weight: 700;
  color: #fff;
  font-size: 1rem;
}

.zona-ascenso .pos { color: #4ade80; }
.zona-descenso .pos { color: #f87171; }

.num {
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}

.puntos {
  font-weight: 800;
  color: var(--ball);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .header {
    padding: 24px;
  }
  .header h1 {
    font-size: 1.8rem;
  }
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .jornadas-grid {
    grid-template-columns: 1fr;
  }
}
</style>
