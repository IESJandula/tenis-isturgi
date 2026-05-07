<template>
  <div class="torneo-detalle">
    <header class="header-detalle">
      <div class="container">
        <router-link to="/torneos" class="btn-volver">
          <span class="arrow-back">←</span>
          Volver a torneos
        </router-link>
      </div>
    </header>

    <section class="torneo-content">
      <div v-if="cargando" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando torneo...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <span class="error-icon">!</span>
        <p>{{ error }}</p>
      </div>

      <article v-else-if="torneo" class="torneo-article">
        <div class="article-layout">
          <div class="article-imagen-wrapper">
            <div class="article-imagen">
              <img
                v-if="torneo.Cartel"
                :src="torneo.Cartel"
                :alt="torneo.Nombre"
                class="imagen-completa"
              />
              <div v-else class="image-placeholder">
                <span class="placeholder-icon">T</span>
              </div>
            </div>
          </div>

          <div class="article-info">
            <div class="article-meta">
              <span class="tag">{{ torneo.Categoria || 'Torneo' }}</span>
              <span v-if="torneo.Estado" class="estado" :class="estadoClass">
                {{ torneo.Estado }}
              </span>
            </div>

            <h1 class="article-title">{{ torneo.Nombre }}</h1>

            <p v-if="fechaRango" class="fecha">
              {{ fechaRango }}
            </p>

            <div class="article-content">
              <p v-if="torneo.Descripcion_breve" class="descripcion-breve">
                {{ torneo.Descripcion_breve }}
              </p>
              <div v-if="torneo.Descripcion" class="descripcion" v-html="torneo.Descripcion"></div>
            </div>

            <div class="registration-area" v-if="!torneoPasado">
              <div v-if="!isAuthenticated()" class="auth-notice glass-card">
                <p>Inicia sesión para inscribirte en este torneo</p>
                <router-link to="/login" class="btn btn-primary">Iniciar Sesión</router-link>
              </div>
              <div v-else-if="yaInscrito" class="success-notice glass-card">
                <span class="icon">✅</span>
                <p>¡Ya estás inscrito en este torneo!</p>
                <button class="btn btn-secondary btn-sm" @click="cancelarInscripcion" :disabled="procesando">Cancelar Inscripción</button>
              </div>
              <button 
                v-else 
                class="btn btn-primary btn-lg btn-block" 
                @click="inscribirse" 
                :disabled="procesando"
              >
                {{ procesando ? 'Procesando...' : 'Inscribirse al Torneo' }}
              </button>
            </div>

            <div class="participants-section glass-card" v-if="inscripciones.length > 0">
              <h3 class="headline">Jugadores Inscritos ({{ inscripciones.length }})</h3>
              <div class="participants-grid">
                <div v-for="ins in inscripciones" :key="ins.id" class="participant-chip">
                  <img :src="ins.jugador?.Foto || '/logo-isturgi.jpg'" alt="" class="p-avatar" />
                  <span>{{ ins.jugador?.Nombre }}</span>
                </div>
              </div>
            </div>

            <div class="info-grid">
              <div v-if="torneo.Modalidad" class="info-item">
                <span class="label">Modalidad</span>
                <span class="value">{{ torneo.Modalidad }}</span>
              </div>
              <div v-if="torneo.TipoParticipacion" class="info-item">
                <span class="label">Participacion</span>
                <span class="value">{{ torneo.TipoParticipacion }}</span>
              </div>
              <div v-if="torneo.NivelRequerido" class="info-item">
                <span class="label">Nivel</span>
                <span class="value">{{ torneo.NivelRequerido }}</span>
              </div>
              <div v-if="torneo.Participantes" class="info-item">
                <span class="label">Cupo máximo</span>
                <span class="value">{{ torneo.Participantes }}</span>
              </div>
              <div v-if="torneo.Premios" class="info-item">
                <span class="label">Premios</span>
                <span class="value">{{ torneo.Premios }}</span>
              </div>
              <div v-if="torneo.Patrocinador" class="info-item">
                <span class="label">Patrocinador</span>
                <span class="value">{{ torneo.Patrocinador }}</span>
              </div>
              <div class="info-item">
                <span class="label">Puntuable</span>
                <span class="value">{{ torneo.Puntuable ? 'Si' : 'No' }}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useAuth } from '../utils/auth';
import { formatearFecha } from '../utils/formatters';

const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const route = useRoute();
const { state, isAuthenticated } = useAuth();

const torneo = ref(null);
const inscripciones = ref([]);
const cargando = ref(true);
const error = ref(null);
const procesando = ref(false);

const fechaRango = computed(() => {
  const inicio = formatearFecha(torneo.value?.FechaInicio);
  const fin = formatearFecha(torneo.value?.FechaFin);
  if (inicio && fin) return `${inicio} - ${fin}`;
  return inicio || fin || '';
});

const estadoClass = computed(() => {
  const estado = torneo.value?.Estado?.toLowerCase() || '';
  return estado ? `estado-${estado.replace(/\s+/g, '-')}` : '';
});

const torneoPasado = computed(() => {
  if (!torneo.value?.FechaFin) return false;
  return new Date(torneo.value.FechaFin) < new Date();
});

const yaInscrito = computed(() => {
  if (!state.user) return false;
  return inscripciones.value.some(ins => ins.jugador?.id === state.user.id);
});

const cargarDatos = async () => {
  try {
    const id = route.params.id;
    const [resTorneo, resInscripciones] = await Promise.all([
      axios.get(`${apiUrl}/api/torneos/${id}`),
      axios.get(`${apiUrl}/api/torneo-inscripciones/torneo/${id}`)
    ]);
    torneo.value = resTorneo.data.data || resTorneo.data;
    inscripciones.value = resInscripciones.data.data || [];
  } catch (e) {
    console.error(e);
    error.value = 'No se pudo cargar la información. Intenta de nuevo.';
  } finally {
    cargando.value = false;
  }
};

const inscribirse = async () => {
  if (!state.user) return;
  procesando.value = true;
  try {
    await axios.post(`${apiUrl}/api/torneo-inscripciones`, {
      torneoId: torneo.value.id,
      jugadorId: state.user.id
    });
    await cargarDatos();
  } catch (e) {
    alert(e.response?.data?.message || 'Error al inscribirse');
  } finally {
    procesando.value = false;
  }
};

const cancelarInscripcion = async () => {
  const inscripcion = inscripciones.value.find(ins => ins.jugador?.id === state.user.id);
  if (!inscripcion) return;
  
  if (!confirm('¿Seguro que quieres cancelar tu inscripción?')) return;

  procesando.value = true;
  try {
    await axios.delete(`${apiUrl}/api/torneo-inscripciones/${inscripcion.id}`);
    await cargarDatos();
  } catch (e) {
    alert('Error al cancelar inscripción');
  } finally {
    procesando.value = false;
  }
};

onMounted(cargarDatos);
</script>

<style scoped>
.torneo-detalle {
  min-height: 100vh;
}

.header-detalle {
  padding: 24px 0;
  border-bottom: 1px solid var(--border);
  background: var(--glass);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}

.btn-volver {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.btn-volver:hover {
  color: var(--ball);
}

.torneo-content {
  padding: 40px 32px 100px;
  max-width: 1200px;
  margin: 0 auto;
}

.article-layout {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 64px;
  align-items: start;
}

.article-imagen-wrapper {
  position: sticky;
  top: 120px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.imagen-completa {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  display: block;
}

.article-info {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.article-title {
  font-family: "Syne", sans-serif;
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin: 0;
}

.registration-area {
  padding: 24px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.btn-lg {
  padding: 18px 32px;
  font-size: 1.1rem;
}

.btn-block {
  width: 100%;
}

.auth-notice, .success-notice {
  padding: 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.success-notice .icon {
  font-size: 2rem;
}

.participants-section {
  padding: 32px;
}

.participants-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

.participant-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 999px;
  border: 1px solid var(--border);
  font-size: 0.9rem;
  font-weight: 600;
}

.p-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.info-item {
  padding: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-faint);
  margin-bottom: 4px;
  display: block;
}

.value {
  font-weight: 700;
  color: #fff;
}

.tag {
  background: var(--ball-dim);
  color: var(--ball);
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.estado {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.estado-abierto { background: rgba(74, 222, 128, 0.1); color: #4ade80; }
.estado-cerrado { background: rgba(248, 113, 113, 0.1); color: #f87171; }

@media (max-width: 1024px) {
  .article-layout {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .article-title {
    font-size: 2.5rem;
  }
}
</style>
