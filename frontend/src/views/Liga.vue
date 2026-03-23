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
      <section v-if="vista === 'calendario'" class="jornadas-grid">
        <article v-for="(jornada, index) in jornadas" :key="jornada.id" class="jornada-card">
          <div class="jornada-header">
            <h2>Jornada {{ jornada.numero ?? index + 1 }}</h2>
            <span class="jornada-nombre">{{ jornada.Nombre || 'Sin nombre' }}</span>
          </div>

          <ul v-if="jornada.partidos && jornada.partidos.length" class="partidos-list">
            <li v-for="partido in jornada.partidos" :key="partido.id" class="partido-item">
              <div class="jugadores">
                <span class="jugador" :class="{ ganador: elGanadorEs(partido, 1) }">
                  {{ nombreJugador(partido.jugador1) }}
                </span>
                <span class="vs">vs</span>
                <span class="jugador" :class="{ ganador: elGanadorEs(partido, 2) }">
                  {{ nombreJugador(partido.jugador2) }}
                </span>
              </div>
              <div class="resultado-inline" v-if="partido.estado === 'Jugado'">
                {{ partido.resultado }}
              </div>
              <div class="meta">
                <span class="estado-pill">{{ partido.estado || 'Pendiente' }}</span>
                <span v-if="formatoMeta(partido)" class="detalle">{{ formatoMeta(partido) }}</span>
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
                  {{ nombreJugador(fila.jugador) }}
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
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const vista = ref('calendario'); // 'calendario' | 'clasificacion'
const divisiones = ref([]);
const divisionId = ref(null);
const jornadas = ref([]);
const clasificacion = ref([]);
const cargando = ref(false);
const error = ref(null);

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
      return djB - djA;
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
  gap: 20px;
  color: #eaf2ef;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  border-radius: var(--radius-lg);
  background: rgba(8, 15, 18, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.header h1 {
  margin: 0 0 6px;
  color: var(--ball);
  font-size: 2.1rem;
  font-family: "Bebas Neue", sans-serif;
  letter-spacing: 1px;
}

.header p {
  margin: 0;
  color: rgba(234, 242, 239, 0.7);
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

/* TABS */
.view-toggle {
  display: flex;
  background: rgba(0, 0, 0, 0.3);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.toggle-btn {
  padding: 8px 20px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.toggle-btn.activo {
  background: rgba(199, 255, 52, 0.15);
  color: var(--ball);
}

.division-select {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.chip {
  background: rgba(9, 13, 15, 0.7);
  color: #f4f4f4;
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: 10px 16px;
  cursor: pointer;
  border-radius: 999px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  font-size: 0.75rem;
}

.chip.activo {
  background: var(--ball);
  color: var(--ink);
  border-color: var(--ball);
}

.estado {
  padding: 16px;
  background: rgba(9, 13, 15, 0.7);
  border-radius: var(--radius-md);
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.estado.error {
  color: #ffb3b3;
  border: 1px solid rgba(255, 110, 110, 0.3);
}

/* CALENDARIO */
.jornadas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.jornada-card {
  background: rgba(9, 13, 15, 0.74);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: 18px;
  box-shadow: var(--shadow);
}

.jornada-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 14px;
}

.jornada-header h2 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--ball);
}

.jornada-nombre {
  font-size: 0.8rem;
  color: rgba(234, 242, 239, 0.6);
}

.partidos-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.partido-item {
  background: rgba(13, 18, 20, 0.76);
  border-radius: 12px;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.jugadores {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-weight: 600;
}

.jugador {
  flex: 1;
}

.jugador.ganador {
  color: var(--ball);
}

.vs {
  color: rgba(255, 255, 255, 0.3);
  font-weight: 400;
}

.resultado-inline {
  display: block;
  font-size: 1.1rem;
  font-weight: 800;
  margin: 6px 0;
  text-align: center;
  color: var(--ball);
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  color: rgba(234, 242, 239, 0.6);
  font-size: 0.8rem;
}

.estado-pill {
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.7rem;
  text-transform: uppercase;
  color: rgba(234, 242, 239, 0.8);
}

/* CLASIFICACION */
.clasificacion-section {
  background: rgba(9, 13, 15, 0.74);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: 0;
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

.tabla-clasif {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}

.gesliga-header th {
  background: #e9e2d0; /* Beige Gesliga */
  color: #2c3e50;
  padding: 10px 6px;
  text-align: right;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  border-bottom: 2px solid #d4cbb3;
}

.gesliga-header th.al-left {
  text-align: left;
}

.tabla-clasif td {
  padding: 8px 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  text-align: right;
  color: rgba(255, 255, 255, 0.8);
}

.tabla-clasif td.al-left,
.tabla-clasif td.pos,
.tabla-clasif td.nombre-jugador {
  text-align: left;
}

.pos {
  font-weight: 800;
  color: rgba(255, 255, 255, 0.4);
  width: 30px;
}

.nombre-jugador {
  font-weight: 600;
  color: #fff;
  min-width: 140px;
}

.zona-ascenso .nombre-jugador {
  color: #4ade80 !important; /* Green */
}

.zona-descenso .nombre-jugador {
  color: #f87171 !important; /* Red */
}

.num {
  font-variant-numeric: tabular-nums;
}

.bold {
  font-weight: 800;
  color: #fff;
}

.puntos {
  font-weight: 900;
  color: var(--ball) !important;
  background: rgba(199, 255, 52, 0.05);
}

.vacio-tabla {
  text-align: center;
  padding: 40px !important;
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
}

@media (max-width: 720px) {
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .view-toggle {
    width: 100%;
  }
  .toggle-btn {
    flex: 1;
  }
}
</style>
