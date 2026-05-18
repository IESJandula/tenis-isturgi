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
            <div class="article-imagen" @click="abrirImagenCompleta" :class="{ 'imagen-clickeable': torneo.Cartel }">
              <img
                v-if="torneo.Cartel"
                :src="torneo.Cartel"
                :alt="torneo.Nombre"
                class="imagen-completa"
              />
              <div v-else class="image-placeholder">
                <span class="placeholder-icon">T</span>
              </div>
              <div v-if="torneo.Cartel" class="imagen-overlay">
                <span class="zoom-icon">🔍</span>
                <span class="zoom-text">Click para ampliar</span>
              </div>
            </div>
          </div>

          <div class="article-info">
            <div class="article-meta">
              <span class="tag">{{ torneo.Categoria || 'Torneo' }}</span>
              <time v-if="fechaRango" class="fecha">
                {{ fechaRango }}
              </time>
            </div>

            <h1 class="article-title">{{ torneo.Nombre }}</h1>

            <div class="article-content">
              <p v-if="torneo.Descripcion_breve" class="descripcion-breve">
                {{ torneo.Descripcion_breve }}
              </p>
              <div v-if="torneo.Descripcion" class="descripcion" v-html="torneo.Descripcion"></div>

              <!-- Información del torneo (moved here to match noticiaDetalle layout) -->
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
            
          </div>
        </div>
      </article>
    </section>

    <!-- Modal pantalla completa para cartel del torneo -->
    <Teleport to="body">
      <div v-if="imagenPantallaCompleta" class="lightbox" @click="cerrarImagenCompleta">
        <button class="lightbox-close" @click="cerrarImagenCompleta" title="Cerrar (Esc)">
          ✕
        </button>
        <button class="lightbox-fullscreen" @click.stop="toggleFullscreen" title="Pantalla completa (F)">
          ⛶
        </button>
        <div class="lightbox-content" @click.stop>
          <img 
            v-if="torneo?.Cartel"
            :src="torneo.Cartel"
            :alt="torneo.Nombre"
            class="lightbox-imagen"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useAuth } from '../utils/auth';
import { formatearFecha } from '../utils/formatters';

const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const route = useRoute();
const router = useRouter();
const { state, isAuthenticated } = useAuth();

const torneo = ref(null);
const inscripciones = ref([]);
const cargando = ref(true);
const error = ref(null);
const procesando = ref(false);
const imagenPantallaCompleta = ref(false);

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
  router.push('/contacto#formulario');
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

const abrirImagenCompleta = () => {
  if (torneo.value?.Cartel) {
    imagenPantallaCompleta.value = true;
    document.body.style.overflow = 'hidden';
  }
};

const cerrarImagenCompleta = () => {
  imagenPantallaCompleta.value = false;
  document.body.style.overflow = '';
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
};

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

const handleKeydown = (e) => {
  if (imagenPantallaCompleta.value) {
    if (e.key === 'Escape') {
      cerrarImagenCompleta();
    } else if (e.key === 'f' || e.key === 'F') {
      toggleFullscreen();
    }
  }
};

onMounted(cargarDatos);
window.addEventListener('keydown', handleKeydown);

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.torneo-detalle {
  min-height: 100vh;
  background: linear-gradient(135deg, #080d0f 0%, #0f1416 100%);
  color: #fff;
  overflow-x: hidden;
}

/* Header compacto */
.header-detalle {
  padding: 30px 0;
  border-bottom: 1px solid rgba(199, 255, 52, 0.1);
  background: rgba(9, 13, 15, 0.6);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 30px;
}

.btn-volver {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(234, 242, 239, 0.8);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  padding: 8px 0;
}

.arrow-back {
  font-size: 1.2em;
  transition: transform 0.3s ease;
}

.btn-volver:hover {
  color: var(--ball);
}

.btn-volver:hover .arrow-back {
  transform: translateX(-4px);
}

/* Contenido */
.torneo-content {
  padding: 60px 30px 100px;
  max-width: 1400px;
  margin: 0 auto;
}

.torneo-article {
  animation: fadeInUp 0.6s ease;
}

/* Layout de 2 columnas */
.article-layout {
  display: grid;
  grid-template-columns: 480px 1fr;
  gap: 40px;
  align-items: start;
}

/* Columna izquierda: Imagen */
.article-imagen-wrapper {
  position: relative;
  width: 100%;
  background: rgba(9, 13, 15, 0.8);
  border: 1px solid rgba(199, 255, 52, 0.15);
  border-radius: 20px;
  overflow: hidden;
}

.article-imagen-wrapper::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(199, 255, 52, 0.05),
    transparent 40%,
    transparent 60%,
    rgba(201, 106, 58, 0.05)
  );
  pointer-events: none;
  z-index: 1;
}

.article-imagen {
  width: 100%;
  min-height: 400px;
  max-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 20, 22, 0.5);
  padding: 30px;
  position: relative;
  transition: transform 0.3s ease;
}

.imagen-clickeable {
  cursor: pointer;
}

.imagen-clickeable:hover {
  transform: scale(1.02);
}

.imagen-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 3;
}

.imagen-clickeable:hover .imagen-overlay {
  opacity: 1;
}

.zoom-icon {
  font-size: 3rem;
}

.zoom-text {
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.imagen-completa {
  width: 100%;
  height: 100%;
  max-height: calc(80vh - 60px);
  object-fit: contain;
  display: block;
  position: relative;
  z-index: 2;
}

.image-placeholder {
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(199, 255, 52, 0.08), rgba(201, 106, 58, 0.08));
}

.placeholder-icon {
  font-size: 8rem;
  opacity: 0.3;
}

/* Columna derecha: Contenido */
.article-info {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Meta información */
.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.tag-news, .tag {
  background: rgba(199, 255, 52, 0.15);
  color: var(--ball);
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  border: 1px solid rgba(199, 255, 52, 0.3);
}

.fecha {
  font-size: 0.95rem;
  color: rgba(234, 242, 239, 0.5);
  text-transform: capitalize;
  font-weight: 500;
}

/* Título del artículo */
.article-title {
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 900;
  margin: 0 0 30px;
  line-height: 1.15;
  letter-spacing: -0.5px;
  color: #fff;
}

/* Contenido del artículo */
.article-content {
  background: rgba(9, 13, 15, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 40px;
  backdrop-filter: blur(10px);
  margin-bottom: 30px;
}

.article-text, .descripcion-breve, .descripcion {
  font-size: 1.15rem;
  color: rgba(234, 242, 239, 0.9);
  line-height: 1.9;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Información del torneo: separa etiqueta y valor */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.info-item {
  padding: 16px;
  background: rgba(15, 20, 22, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 12px;
}

.label {
  display: block;
  font-size: 0.85rem;
  text-transform: none;
  color: rgba(234, 242, 239, 0.6);
  margin-bottom: 6px;
}

.value {
  display: block;
  font-weight: 700;
  color: #fff;
}

/* Lightbox / Modal pantalla completa */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 50; /* debajo del nav (nav usa z-index:100) */
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
  cursor: zoom-out;
}

.lightbox-close {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 51; /* ligeramente por encima del overlay, pero por debajo del nav */
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.lightbox-close:hover {
  background: rgba(255, 60, 60, 0.8);
  border-color: rgba(255, 60, 60, 1);
  transform: rotate(90deg);
}

.lightbox-fullscreen {
  position: fixed;
  top: 20px;
  right: 90px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.3rem;
  cursor: pointer;
  z-index: 51;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.lightbox-fullscreen:hover {
  background: rgba(199, 255, 52, 0.3);
  border-color: var(--ball);
  transform: scale(1.1);
}

.lightbox-content {
  max-width: 95vw;
  max-height: 95vh;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
}

.lightbox-imagen {
  max-width: 100%;
  max-height: 95vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

/* Estados de carga y error */
.loading-state, .error-state {
  padding: 80px 40px;
  text-align: center;
  border-radius: 16px;
  background: rgba(9, 13, 15, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(199, 255, 52, 0.2);
  border-top-color: var(--ball);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin { to { transform: rotate(360deg); } }

.error-icon { font-size: 4rem; display: block; margin-bottom: 20px; }
.error-state { background: rgba(255, 60, 60, 0.1); border-color: rgba(255, 60, 60, 0.3); }
.error-state p { color: #ff9999; font-size: 1.1rem; }

/* Responsive */
@media (max-width: 1024px) {
  .torneo-content { max-width: 1200px; }
  .article-layout { gap: 30px; }
  .article-title { font-size: clamp(1.6rem, 3.5vw, 2.5rem); }
  .article-content { padding: 32px; }
}

@media (max-width: 900px) {
  .article-layout { grid-template-columns: 1fr; gap: 40px; }
  .article-imagen-wrapper { position: relative; top: 0; width: auto; max-height: 600px; }
  .article-info { margin-left: 0; }
  .article-imagen { max-height: 600px; }
}

@media (max-width: 768px) {
  .header-detalle { padding: 20px 0; }
  .container, .torneo-content { padding-left: 20px; padding-right: 20px; }
  .torneo-content { padding-top: 40px; padding-bottom: 60px; }
  .article-layout { gap: 30px; }
  .article-title { font-size: 1.8rem; margin-bottom: 24px; }
  .article-imagen { min-height: 300px; padding: 20px; }
  .imagen-completa { max-height: 450px; }
  .article-content { padding: 30px 20px; }
  .article-text { font-size: 1.05rem; line-height: 1.8; }
  .info-grid { grid-template-columns: 1fr; gap: 12px; }
  .lightbox-close, .lightbox-fullscreen { width: 45px; height: 45px; font-size: 1.2rem; }
  .lightbox-fullscreen { right: 75px; }
}

@media (max-width: 640px) {
  .header-detalle { padding: 16px 0; }

  .container,
  .torneo-content {
    padding-left: 16px;
    padding-right: 16px;
  }

  .torneo-content {
    padding-top: 32px;
    padding-bottom: 52px;
  }

  .article-meta {
    gap: 10px;
    margin-bottom: 18px;
  }

  .article-content {
    padding: 24px 16px;
  }

  .info-item {
    padding: 14px;
  }

  .lightbox-content {
    padding: 0 12px;
  }
}

@media (max-width: 480px) {
  .article-title { font-size: 1.5rem; }
  .article-imagen { min-height: 250px; padding: 15px; }
  .article-content { padding: 25px 18px; }
  .article-text { font-size: 1rem; }
  .lightbox-close, .lightbox-fullscreen { width: 40px; height: 40px; font-size: 1.1rem; top: 10px; }
  .lightbox-close { right: 10px; }
  .lightbox-fullscreen { right: 60px; }
  .zoom-text { font-size: 0.85rem; }
}
</style>
