<template>
  <div class="mis-partidos-page fade-in">
    <section class="hero-section">
      <div class="hero-content">
        <span class="mini-tag">Panel Deportivo</span>
        <h1>Mis Partidos</h1>
        <p class="hero-lead">Consulta tu calendario y sube los resultados de los partidos jugados.</p>
      </div>
    </section>

    <div class="container main-content">
      <div v-if="cargando" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando tus partidos...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <span class="error-icon">⚠️</span>
        <p>{{ error }}</p>
        <button @click="cargarDatos" class="btn-retry">Reintentar</button>
      </div>

      <div v-else class="partidos-grid">
        <div v-if="partidos.length === 0" class="empty-state">
          <span class="empty-icon">🎾</span>
          <h3>No tienes partidos asignados</h3>
          <p>Aún no se ha generado el calendario o no estás inscrito en ninguna división activa.</p>
        </div>

        <div v-else v-for="partido in partidos" :key="partido.id" class="partido-card">
          <div class="card-header">
            <h4>{{ partido.jornada?.Nombre || 'Jornada N/A' }}</h4>
            <span class="estado-tag" :class="partido.estado.toLowerCase()">{{ partido.estado }}</span>
          </div>

          <div class="match-details">
            <div class="players-row">
              <span class="player" :class="{ 'me': isMe(partido.jugador1) }">
                {{ formatNombre(partido.jugador1) }}
                <span v-if="isMe(partido.jugador1)" class="me-badge">(Tú)</span>
              </span>
              <span class="vs">vs</span>
              <span class="player" :class="{ 'me': isMe(partido.jugador2) }">
                {{ formatNombre(partido.jugador2) }}
                <span v-if="isMe(partido.jugador2)" class="me-badge">(Tú)</span>
              </span>
            </div>

            <div class="match-meta">
              <span>📅 {{ partido.fecha ? new Date(partido.fecha).toLocaleDateString('es-ES') : 'Por definir' }}</span>
              <span>⏰ {{ partido.hora ? partido.hora.substring(0, 5) : 'Por definir' }}</span>
              <span>📍 Pista {{ partido.pista || '?' }}</span>
            </div>
          </div>

          <!-- SUBIR RESULTADO UI -->
          <div class="result-action">
            <div v-if="partido.estado === 'Jugado'" class="result-display">
              <p>Resultado final:</p>
              <h3>{{ partido.resultado }}</h3>
            </div>
            
            <div v-else class="result-form-wrapper">
              <button 
                v-if="!mostrandoFormulario[partido.id]" 
                @click="abrirFormulario(partido.id)"
                class="btn-subir"
              >
                Subir Resultado
              </button>

              <div v-if="mostrandoFormulario[partido.id]" class="result-form fade-in">
                <p class="form-help">Introduce los juegos por set:</p>
                <div class="sets-grid">
                  <div class="set-input">
                    <span>S1</span>
                    <input type="number" v-model="formResultados[partido.id].s1_1" placeholder="0" min="0">
                    <span>-</span>
                    <input type="number" v-model="formResultados[partido.id].s1_2" placeholder="0" min="0">
                  </div>
                  <div class="set-input">
                    <span>S2</span>
                    <input type="number" v-model="formResultados[partido.id].s2_1" placeholder="0" min="0">
                    <span>-</span>
                    <input type="number" v-model="formResultados[partido.id].s2_2" placeholder="0" min="0">
                  </div>
                  <div class="set-input">
                    <span>S3 (Opcional)</span>
                    <input type="number" v-model="formResultados[partido.id].s3_1" placeholder="0" min="0">
                    <span>-</span>
                    <input type="number" v-model="formResultados[partido.id].s3_2" placeholder="0" min="0">
                  </div>
                </div>

                <div class="form-actions">
                  <button @click="cerrarFormulario(partido.id)" class="btn-cancel">Cancelar</button>
                  <button 
                    @click="guardarResultado(partido)" 
                    :disabled="guardando === partido.id"
                    class="btn-save"
                  >
                    {{ guardando === partido.id ? 'Guardando...' : 'Confirmar Resultado' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuth } from '../utils/auth';

const router = useRouter();
const { state, isAuthenticated } = useAuth();
const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const cargando = ref(true);
const error = ref(null);
const jugadorId = ref(null);
const partidos = ref([]);

const mostrandoFormulario = reactive({});
const formResultados = reactive({});
const guardando = ref(null);

const formatNombre = (jugador) => {
  if (!jugador) return 'Desconocido';
  return `${jugador.Nombre || ''} ${jugador.Apellidos || ''}`.trim() || 'Jugador sin nombre';
};

const isMe = (jugador) => {
  if (!jugador || !jugadorId.value) return false;
  return jugador.id === jugadorId.value;
};

const abrirFormulario = (docId) => {
  mostrandoFormulario[docId] = true;
  if (!formResultados[docId]) {
    formResultados[docId] = {
      s1_1: null, s1_2: null,
      s2_1: null, s2_2: null,
      s3_1: null, s3_2: null
    };
  }
};

const cerrarFormulario = (docId) => {
  mostrandoFormulario[docId] = false;
};

const guardarResultado = async (partido) => {
  const f = formResultados[partido.id];
  if (f.s1_1 === null || f.s1_2 === null || f.s1_1 === '' || f.s1_2 === '') {
    alert('Introduce al menos el resultado del primer set completo.');
    return;
  }

  const resStr = `${f.s1_1}-${f.s1_2}${f.s2_1 !== null && f.s2_1 !== '' ? ', ' + f.s2_1 + '-' + f.s2_2 : ''}${f.s3_1 !== null && f.s3_1 !== '' ? ', ' + f.s3_1 + '-' + f.s3_2 : ''}`;

  if (!confirm(`Vas a confirmar el resultado: ${resStr}. ¿Es correcto?`)) return;

  guardando.value = partido.id;
  const config = { headers: { Authorization: `Bearer ${state.jwt}` } };

  try {
    await axios.put(`${apiUrl}/api/partidos/${partido.id}`, {
      resultado: resStr,
      estado: 'Jugado'
    }, config);
    
    alert('¡Resultado guardado correctamente! La clasificación se actualizará.');
    cerrarFormulario(partido.id);
    await cargarDatos(); // Recargar partidos
  } catch (e) {
    console.error(e);
    alert('Error al guardar el resultado. ' + (e.response?.data?.error?.message || ''));
  } finally {
    guardando.value = null;
  }
};

const cargarDatos = async () => {
  cargando.value = true;
  error.value = null;
  const config = { headers: { Authorization: `Bearer ${state.jwt}` } };

  try {
    // 1. Obtener el perfil de jugador (Nuevo endpoint robusto en Strapi v5)
    let pId = null;
    try {
      const resMe = await axios.get(`${apiUrl}/api/jugadors/me`, config);
      if (resMe.data.data) {
        pId = resMe.data.data.id;
      }
    } catch (e) {
      console.error('Error fetching /jugadors/me:', e);
    }

    if (!pId) {
      throw new Error('No se encontró un perfil de jugador vinculado a tu cuenta. Contacta con el administrador.');
    }
    
    jugadorId.value = pId;

    // 2. Cargar partidos del jugador
    const urlPartidos = `${apiUrl}/api/partidos`;
    const resPartidos = await axios.get(urlPartidos, config);
    
    // Client-side filtering because of custom Spring Controller
    let data = resPartidos.data.data || resPartidos.data || [];
    data = data.filter(p => (p.jugador1 && p.jugador1.id === pId) || (p.jugador2 && p.jugador2.id === pId));
    
    partidos.value = data.sort((a, b) => {
      if (a.estado !== 'Jugado' && b.estado === 'Jugado') return -1;
      if (a.estado === 'Jugado' && b.estado !== 'Jugado') return 1;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  } catch (err) {
    console.error(err);
    error.value = err.message || 'Error al conectar con el servidor.';
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  if (!isAuthenticated()) {
    router.push('/login');
    return;
  }
  cargarDatos();
});
</script>

<style scoped>
.mis-partidos-page { padding-bottom: 80px; }

.hero-section {
  background: linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1595113330663-e1293a1059f3?q=80&w=2000&auto=format&fit=crop');
  background-size: cover;
  padding: 60px 20px;
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.mini-tag {
  background: var(--ball);
  color: #000;
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 800;
  font-size: 0.7rem;
  text-transform: uppercase;
  margin-bottom: 15px;
  display: inline-block;
}

.hero-lead { color: #ccc; max-width: 600px; margin: 10px auto 0; }
.container { max-width: 900px; margin: 0 auto; padding: 0 20px; }

.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 50px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
}

.spinner {
  width: 40px; height: 40px;
  border: 3px solid rgba(199,255,52,0.3);
  border-top-color: var(--ball);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin { to { transform: rotate(360deg); } }

.error-icon, .empty-icon { font-size: 3rem; display: block; margin-bottom: 15px; }
.btn-retry { margin-top: 15px; padding: 8px 20px; background: var(--ball); border: none; font-weight: bold; cursor: pointer; border-radius: 4px; }

.partidos-grid { display: flex; flex-direction: column; gap: 24px; }

.partido-card {
  background: rgba(20, 20, 25, 0.8);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding-bottom: 15px;
}

.card-header h4 { margin: 0; color: white; font-size: 1.2rem; }

.estado-tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  background: rgba(255,255,255,0.1);
  color: #ccc;
}

.estado-tag.jugado { background: rgba(199,255,52,0.2); color: var(--ball); }
.estado-tag.pendiente { background: rgba(255, 165, 0, 0.2); color: orange; }

.match-details { display: flex; flex-direction: column; gap: 15px; }

.players-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background: rgba(0,0,0,0.3);
  padding: 20px;
  border-radius: 12px;
}

.player { font-size: 1.4rem; font-weight: 800; color: white; text-align: center; }
.player.me { color: var(--ball); }
.me-badge { font-size: 0.8rem; vertical-align: super; background: rgba(199,255,52,0.2); padding: 2px 6px; border-radius: 4px; margin-left: 5px; }
.vs { color: #666; font-weight: 700; }

.match-meta {
  display: flex;
  justify-content: space-around;
  color: #aaa;
  font-size: 0.9rem;
  background: rgba(255,255,255,0.02);
  padding: 10px;
  border-radius: 8px;
}

.result-action { margin-top: 10px; text-align: center; }

.result-display p { margin: 0 0 5px; color: #888; font-size: 0.9rem; }
.result-display h3 { margin: 0; color: var(--ball); font-size: 1.8rem; font-weight: 900; }

.btn-subir {
  background: var(--ball);
  color: #000;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-weight: 800;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s;
}

.btn-subir:hover { opacity: 0.9; transform: translateY(-2px); }

.result-form {
  background: rgba(0,0,0,0.4);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(199,255,52,0.2);
}

.form-help { color: #ccc; margin-bottom: 15px; font-size: 0.9rem; }

.sets-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.set-input {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.set-input span { color: white; width: 100px; text-align: right; margin-right: 15px; font-size: 0.9rem; }
.set-input span:not(:first-child) { width: auto; margin: 0 10px; }

.set-input input {
  width: 60px;
  height: 50px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 800;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  border-radius: 8px;
}

.set-input input:focus { outline: none; border-color: var(--ball); background: rgba(199,255,52,0.1); }

.form-actions { display: flex; gap: 15px; justify-content: center; }

.btn-cancel { background: transparent; color: white; border: 1px solid rgba(255,255,255,0.3); padding: 10px 20px; border-radius: 8px; cursor: pointer; }
.btn-cancel:hover { background: rgba(255,255,255,0.1); }

.btn-save { background: var(--ball); color: #000; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; }
.btn-save:hover:not(:disabled) { opacity: 0.9; }
.btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

@media (max-width: 600px) {
  .players-row { flex-direction: column; gap: 10px; }
  .match-meta { flex-direction: column; align-items: center; gap: 10px; }
  .set-input span:first-child { width: auto; margin-right: 5px; }
}
</style>
