<template>
  <div class="admin-gestion-page fade-in">
    <section class="hero-section">
      <div class="hero-content">
        <span class="mini-tag">Panel de Administración</span>
        <h1>Gestión de Jornadas</h1>
        <p class="hero-lead">Configuración de horarios y asignación de pistas para la Liga Social.</p>
      </div>
    </section>

    <div class="container main-content">
      <div v-if="cargando" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando jornadas...</p>
      </div>

      <div v-else class="admin-grid">
        <div v-for="jornada in jornadas" :key="jornada.id" class="jornada-admin-card">
          <div class="card-info">
            <h3>{{ jornada.Nombre }}</h3>
            <p class="meta">Temporada: {{ jornada.temporada?.Nombre || 'N/A' }}</p>
          </div>
          
          <div class="card-actions">
            <button 
              @click="lanzarAlgoritmo(jornada)" 
              :disabled="procesando === jornada.documentId"
              class="btn-algorithm"
            >
              {{ procesando === jornada.documentId ? 'Procesando...' : 'Generar Horarios' }}
            </button>
          </div>

          <div v-if="resultados[jornada.documentId]" class="results-log">
            <h4>Log de Asignación:</h4>
            <ul>
              <li v-for="(log, idx) in resultados[jornada.documentId]" :key="idx">{{ log }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:1337';
const jornadas = ref([]);
const cargando = ref(true);
const proyectando = ref(null);
const procesando = ref(null);
const resultados = reactive({});

const cargarJornadas = async () => {
  try {
    const res = await axios.get(`${apiUrl}/api/jornadas?populate=division.temporada`);
    jornadas.value = res.data.data;
  } catch (e) {
    console.error(e);
  } finally {
    cargando.value = false;
  }
};

const lanzarAlgoritmo = async (jornada) => {
  if (!confirm(`¿Deseas ejecutar el algoritmo de asignación para la ${jornada.Nombre}? Esto modificará los partidos pendientes.`)) return;
  
  procesando.value = jornada.documentId;
  try {
    const res = await axios.post(`${apiUrl}/api/jornadas/${jornada.documentId}/schedule`);
    resultados[jornada.documentId] = res.data.data;
    alert('¡Proceso completado! Revisa los logs en la tarjeta.');
  } catch (e) {
    console.error(e);
    alert('Error al ejecutar el algoritmo.');
  } finally {
    procesando.value = null;
  }
};

onMounted(cargarJornadas);
</script>

<style scoped>
.admin-gestion-page { padding-bottom: 80px; }

.hero-section {
  background: linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1595113330663-e1293a1059f3?q=80&w=2000&auto=format&fit=crop');
  background-size: cover;
  padding: 60px 20px;
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.mini-tag {
  background: #ff3c3c;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 800;
  font-size: 0.7rem;
  text-transform: uppercase;
  margin-bottom: 15px;
  display: inline-block;
}

.container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }

.admin-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.jornada-admin-card {
  background: #1a1a1a;
  border: 1px solid rgba(255,255,255,0.1);
  padding: 25px;
  border-radius: 12px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  align-items: center;
}

.card-info h3 { color: var(--ball); margin-bottom: 5px; }
.card-info .meta { color: #888; font-size: 0.9rem; }

.btn-algorithm {
  background: #fff;
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-algorithm:hover {
  background: var(--ball);
}

.results-log {
  grid-column: span 2;
  background: #000;
  padding: 15px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.85rem;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #333;
}

.results-log h4 { color: #666; margin-bottom: 10px; }
.results-log ul { list-style: none; color: #0f0; }
</style>
