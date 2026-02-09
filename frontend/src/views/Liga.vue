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
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
  color: white;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.header h1 {
  margin: 0 0 6px;
  color: #bfff00;
  font-size: 2.2rem;
}

.header p {
  margin: 0;
  color: #cfcfcf;
}

.division-select {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.chip {
  background: #2c2c2c;
  color: #f4f4f4;
  border: 1px solid #444;
  padding: 10px 16px;
  cursor: pointer;
  border-radius: 999px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  font-size: 0.75rem;
}

.chip.activo {
  background: #bfff00;
  color: #222;
  border-color: #bfff00;
}

.estado {
  padding: 16px;
  background: #2c2c2c;
  border-radius: 10px;
  text-align: center;
}

.estado.error {
  color: #ffb3b3;
  border: 1px solid #5a2a2a;
}

.jornadas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

.jornada-card {
  background: #1f1f1f;
  border: 1px solid #353535;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
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
  color: #bfff00;
}

.jornada-nombre {
  font-size: 0.8rem;
  color: #9a9a9a;
}

.partidos-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.partido-item {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 12px 14px;
  border: 1px solid #3a3a3a;
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
  color: #bfff00;
  font-weight: 800;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  color: #c0c0c0;
  font-size: 0.8rem;
}

.estado-pill {
  background: #3a3a3a;
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 700;
  color: #bfff00;
}

.detalle {
  text-align: right;
}

.vacio {
  color: #9a9a9a;
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