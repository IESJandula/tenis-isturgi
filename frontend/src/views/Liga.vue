<template>
  <div class="liga-container">
    <header class="header">
      <div>
        <h1>Calendario de la Liga</h1>
        <p>Jornadas y cruces todos contra todos</p>
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
    </header>

    <section v-if="cargando" class="estado">Cargando calendario...</section>
    <section v-else-if="error" class="estado error">{{ error }}</section>

    <section v-else class="jornadas-grid">
      <article v-for="(jornada, index) in jornadas" :key="jornada.id" class="jornada-card">
        <div class="jornada-header">
          <h2>Jornada {{ jornada.numero ?? index + 1 }}</h2>
          <span class="jornada-nombre">{{ jornada.Nombre || 'Sin nombre' }}</span>
        </div>

        <ul v-if="jornada.partidos && jornada.partidos.length" class="partidos-list">
          <li v-for="partido in jornada.partidos" :key="partido.id" class="partido-item">
            <div class="jugadores">
              <span class="jugador">{{ nombreJugador(partido.jugador1) }}</span>
              <span class="vs">vs</span>
              <span class="jugador">{{ nombreJugador(partido.jugador2) }}</span>
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
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337';

const divisiones = [
  { id: 1, label: 'Division Oro' },
  { id: 2, label: 'Division Plata' },
];

const divisionId = ref(divisiones[0].id);
const jornadas = ref([]);
const cargando = ref(false);
const error = ref(null);

const cargarCalendario = async () => {
  cargando.value = true;
  error.value = null;

  try {
    const respuesta = await axios.get(
      `${API_BASE}/api/jornadas/division/${divisionId.value}/jornadas`
    );
    jornadas.value = respuesta.data || [];
  } catch (err) {
    console.error(err);
    error.value = 'No se pudo cargar el calendario. Revisa Strapi y el divisionId.';
  } finally {
    cargando.value = false;
  }
};

const nombreJugador = (jugador) => {
  if (!jugador) return 'Por confirmar';
  const nombre = jugador.Nombre || jugador.username || '';
  const apellidos = jugador.Apellidos || '';
  return `${nombre} ${apellidos}`.trim() || 'Por confirmar';
};

const formatoMeta = (partido) => {
  const partes = [];
  if (partido.fecha) {
    partes.push(new Date(partido.fecha).toLocaleDateString());
  }
  if (partido.hora) {
    partes.push(partido.hora.slice(0, 5));
  }
  if (partido.pista) {
    partes.push(`Pista ${partido.pista}`);
  }
  return partes.join(' • ');
};

watch(divisionId, () => {
  cargarCalendario();
});

onMounted(() => {
  cargarCalendario();
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
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 20px 24px;
  border-radius: var(--radius-lg);
  background: rgba(8, 15, 18, 0.8);
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

.jornadas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
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

.vs {
  color: var(--ball);
  font-weight: 800;
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
  background: rgba(199, 255, 52, 0.14);
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 700;
  color: var(--ball);
}

.detalle {
  text-align: right;
}

.vacio {
  color: rgba(234, 242, 239, 0.55);
  font-style: italic;
  margin: 0;
}

@media (max-width: 720px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
  .jugadores {
    flex-direction: column;
  }
  .vs {
    text-align: center;
  }
  .meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>