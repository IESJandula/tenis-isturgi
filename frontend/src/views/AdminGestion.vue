<template>
  <div class="admin-gestion-page fade-in">
    <section class="hero-section">
      <div class="hero-content">
        <span class="mini-tag">Panel de Administración</span>
        <h1>Gestión de Jornadas</h1>
        <p class="hero-lead">Configuración de horarios y asignación de pistas para la Liga Social.</p>
        <div style="margin-top: 20px;">
          <router-link to="/admin-mantenimiento" class="btn-algorithm" style="text-decoration: none; display: inline-block;">
            Ir a Gestión de Contenidos
          </router-link>
        </div>
      </div>
    </section>

    <div class="container main-content">
      <div v-if="cargando" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando jornadas...</p>
      </div>

      <div v-else class="admin-container">
        
        <!-- SECCIÓN DIVISIONES -->
        <div v-if="divisiones.length" class="divisiones-section" style="margin-bottom: 50px;">
          <h2 style="color: white; margin-bottom: 20px; font-size: 1.5rem; border-bottom: 1px solid #333; padding-bottom: 10px;">Sorteo de Calendario (Por División)</h2>
          <div class="admin-grid">
            <div v-for="div in divisiones" :key="div.id" class="jornada-admin-card" style="border-left: 4px solid var(--ball);">
              <div class="card-info">
                <h3>{{ div.Nombre }}</h3>
                <p class="meta">Generación automática mediante Algoritmo Berger</p>
              </div>
              <div class="card-actions">
                <button 
                  @click="generarCalendarioDivision(div)" 
                  :disabled="procesando === 'div_' + div.id"
                  class="btn-algorithm"
                >
                  {{ procesando === 'div_' + div.id ? 'Procesando...' : 'Realizar Sorteo Automático' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <h2 v-if="jornadas.length" style="color: white; margin-bottom: 20px; font-size: 1.5rem; border-bottom: 1px solid #333; padding-bottom: 10px;">Gestión de Pistas y Resultados (Por Jornada)</h2>
        <div class="admin-grid" v-if="jornadas.length">
          <div v-for="jornada in jornadas" :key="jornada.id" class="jornada-admin-card">
            <div class="card-info">
              <h3>{{ jornada.Nombre }}</h3>
              <p class="meta">Temporada: {{ jornada.temporada?.Nombre || 'N/A' }}</p>
            </div>
            
            <div class="card-actions">
              <button 
                @click="lanzarAlgoritmo(jornada)" 
                :disabled="procesando === jornada.id"
                class="btn-algorithm"
              >
                {{ procesando === jornada.id ? 'Procesando...' : 'Generar Horarios' }}
              </button>
              <button 
                @click="togglePartidos(jornada)" 
                class="btn-view-matches"
              >
                {{ mostrandoPartidos[jornada.id] ? 'Ocultar Partidos' : 'Ver Partidos' }}
              </button>
            </div>

            <div v-if="mostrandoPartidos[jornada.id]" class="matches-section">
              <h4>Gestión de Resultados:</h4>
              <div v-if="!partidosJornada[jornada.id]?.length" class="no-matches">
                No hay partidos programados en esta jornada.
              </div>
              <div v-else class="matches-list">
                <div v-for="partido in partidosJornada[jornada.id]" :key="partido.id" class="match-item-admin">
                  <div class="match-main">
                    <span class="m-players">{{ partido.jugador1?.Nombre }} {{ partido.jugador1?.Apellidos || '' }} vs {{ partido.jugador2?.Nombre }} {{ partido.jugador2?.Apellidos || '' }}</span>
                    <span class="m-meta">{{ new Date(partido.fecha).toLocaleDateString('es-ES') }} • {{ partido.hora ? partido.hora.substring(0, 5) : 'Por definir' }} • Pista {{ partido.pista || '?' }}</span>
                  </div>
                  
                  <div v-if="partido.estado !== 'Jugado' && formResultados[partido.id]" class="result-inputs">
                    <div class="set-row">
                      <span>S1</span>
                      <input type="number" v-model="formResultados[partido.id].s1_1" placeholder="0">
                      <input type="number" v-model="formResultados[partido.id].s1_2" placeholder="0">
                    </div>
                    <div class="set-row">
                      <span>S2</span>
                      <input type="number" v-model="formResultados[partido.id].s2_1" placeholder="0">
                      <input type="number" v-model="formResultados[partido.id].s2_2" placeholder="0">
                    </div>
                    <div class="set-row">
                      <span>S3</span>
                      <input type="number" v-model="formResultados[partido.id].s3_1" placeholder="0">
                      <input type="number" v-model="formResultados[partido.id].s3_2" placeholder="0">
                    </div>
                    <button @click="guardarResultado(partido)" class="btn-save-mini">Guardar</button>
                  </div>
                  <div v-else class="result-final">
                    Resultado: <span class="res-tag">{{ partido.resultado }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="resultados[jornada.id]" class="results-log">
              <h4>Log de Asignación:</h4>
              <ul>
                <li v-for="(log, idx) in resultados[jornada.id]" :key="idx">{{ log }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const token = localStorage.getItem('jwt');
const config = { headers: { Authorization: `Bearer ${token}` } };

const jornadas = ref([]);
const divisiones = ref([]);
const cargando = ref(true);
const proyectando = ref(null);
const procesando = ref(null);
const resultados = reactive({});
const mostrandoPartidos = reactive({});
const partidosJornada = reactive({});
const formResultados = reactive({});

const cargarJornadas = async () => {
  try {
    const res = await axios.get(`${apiUrl}/api/jornadas?populate=division.temporada`, config);
    jornadas.value = res.data.data;
    
    const resDiv = await axios.get(`${apiUrl}/api/divisiones`, config);
    divisiones.value = resDiv.data.data;
  } catch (e) {
    console.error(e);
  } finally {
    cargando.value = false;
  }
};

const generarCalendarioDivision = async (division) => {
  if (!confirm(`¿Deseas generar el calendario completo para ${division.Nombre}? Esto creará jornadas y partidos automáticamente en base al número de jugadores.`)) return;
  
  procesando.value = 'div_' + division.id;
  try {
    const res = await axios.post(`${apiUrl}/api/divisions/${division.id}/generar-calendario`, {}, config);
    alert(`¡Éxito! ${res.data.message}. Se crearon ${res.data.jornadas} jornadas y ${res.data.partidos} partidos.`);
    await cargarJornadas();
  } catch (e) {
    console.error(e);
    alert(e.response?.data?.error?.message || 'Error al generar calendario.');
  } finally {
    procesando.value = null;
  }
};

const lanzarAlgoritmo = async (jornada) => {
  if (!confirm(`¿Deseas ejecutar el algoritmo de asignación para la ${jornada.Nombre}? Esto modificará los partidos pendientes.`)) return;
  
  procesando.value = jornada.id;
  try {
    const res = await axios.post(`${apiUrl}/api/jornadas/${jornada.id}/schedule`, {}, config);
    resultados[jornada.id] = res.data.data;
    alert('¡Proceso completado! Revisa los logs en la tarjeta.');
  } catch (e) {
    console.error(e);
    alert('Error al ejecutar el algoritmo.');
  } finally {
    procesando.value = null;
  }
};

const togglePartidos = async (jornada) => {
  const docId = jornada.id;
  if (mostrandoPartidos[docId]) {
    mostrandoPartidos[docId] = false;
    return;
  }

  try {
    const res = await axios.get(`${apiUrl}/api/jornadas/${docId}/partidos`, config);
    partidosJornada[docId] = res.data;
    
    // Inicializar formularios
    res.data.forEach(p => {
      if (!formResultados[p.id]) {
        formResultados[p.id] = {
          s1_1: null, s1_2: null,
          s2_1: null, s2_2: null,
          s3_1: null, s3_2: null
        };
      }
    });

    mostrandoPartidos[docId] = true;
  } catch (e) {
    console.error(e);
    alert('Error al cargar los partidos.');
  }
};

const guardarResultado = async (partido) => {
  const f = formResultados[partido.id];
  if (f.s1_1 === null || f.s1_2 === null) {
    alert('Introduce al menos el resultado del primer set.');
    return;
  }

  const resStr = `${f.s1_1}-${f.s1_2}${f.s2_1 !== null ? ', ' + f.s2_1 + '-' + f.s2_2 : ''}${f.s3_1 !== null ? ', ' + f.s3_1 + '-' + f.s3_2 : ''}`;

  if (!confirm(`¿Confirmar resultado ${resStr} para el partido ${partido.jugador1?.Nombre} vs ${partido.jugador2?.Nombre}?`)) return;

  try {
    await axios.put(`${apiUrl}/api/partidos/${partido.id}`, {
      data: {
        resultado: resStr,
        estado: 'Jugado'
      }
    }, config);
    
    alert('Resultado guardado correctamente.');
    // Recargar partidos de la jornada
    const jornadaId = Object.keys(partidosJornada).find(jid => partidosJornada[jid].some(p => p.id === partido.id));
    if (jornadaId) {
      mostrandoPartidos[jornadaId] = false;
      togglePartidos({ id: jornadaId });
    }
  } catch (e) {
    console.error(e);
    alert('Error al guardar el resultado.');
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

.btn-view-matches {
  background: rgba(255,255,255,0.1);
  color: white;
  border: 1px solid rgba(255,255,255,0.2);
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-view-matches:hover {
  background: rgba(255,255,255,0.2);
}

.matches-section {
  grid-column: span 2;
  border-top: 1px solid #333;
  padding-top: 20px;
}

.matches-section h4 { margin-bottom: 15px; color: #888; }

.match-item-admin {
  background: #000;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.match-main { display: flex; justify-content: space-between; align-items: center; }
.m-players { font-weight: 700; color: #fff; }
.m-meta { font-size: 0.8rem; color: #555; }

.result-inputs {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.set-row {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #111;
  padding: 5px 10px;
  border-radius: 6px;
}

.set-row span { font-size: 0.7rem; color: #666; font-weight: 800; }

.set-row input {
  width: 35px;
  background: transparent;
  border: 1px solid #333;
  color: var(--ball);
  text-align: center;
  padding: 4px;
  border-radius: 4px;
  font-weight: 800;
}

.btn-save-mini {
  background: var(--ball);
  color: var(--ink);
  border: none;
  padding: 6px 15px;
  border-radius: 5px;
  font-weight: 700;
  cursor: pointer;
}

.res-tag {
  color: var(--ball);
  font-weight: 800;
  font-family: monospace;
  background: rgba(199, 255, 52, 0.1);
  padding: 4px 10px;
  border-radius: 4px;
}
</style>
