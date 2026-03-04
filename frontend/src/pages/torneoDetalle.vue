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
                v-if="torneo.Imagen?.url"
                :src="`${apiUrl}${torneo.Imagen.url}`"
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
                <span class="label">Participantes</span>
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

import { formatearFecha } from '../utils/formatters';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:1337';
const route = useRoute();
const torneo = ref(null);
const cargando = ref(true);
const error = ref(null);

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

onMounted(async () => {
  try {
    const id = route.params.id;
    const respuesta = await axios.get(`${apiUrl}/api/torneos/${id}?populate=*`);
    torneo.value = respuesta.data.data;
  } catch (e) {
    error.value = 'No se pudo cargar el torneo. Intenta de nuevo.';
  } finally {
    cargando.value = false;
  }
});
</script>

<style scoped>
.torneo-detalle {
  min-height: 100vh;
  background: linear-gradient(135deg, #080d0f 0%, #0f1416 100%);
  color: #fff;
}

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

.torneo-content {
  padding: 60px 30px 100px;
  max-width: 1400px;
  margin: 0 auto;
}

.loading-state,
.error-state {
  padding: 80px 40px;
  text-align: center;
  border-radius: 16px;
  background: rgba(9, 13, 15, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  max-width: 600px;
  margin: 40px auto;
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

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state {
  background: rgba(255, 60, 60, 0.1);
  border-color: rgba(255, 60, 60, 0.3);
}

.error-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 20px;
}

.torneo-article {
  animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.article-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
}

.article-imagen-wrapper {
  position: sticky;
  top: 120px;
  background: rgba(9, 13, 15, 0.8);
  border: 1px solid rgba(199, 255, 52, 0.15);
  border-radius: 20px;
  overflow: hidden;
}

.article-imagen {
  width: 100%;
  min-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 20, 22, 0.5);
  padding: 30px;
}

.imagen-completa {
  width: 100%;
  height: 100%;
  max-height: calc(80vh - 60px);
  object-fit: contain;
  display: block;
}

.image-placeholder {
  width: 100%;
  height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(199, 255, 52, 0.08), rgba(201, 106, 58, 0.08));
}

.placeholder-icon {
  font-size: 6rem;
  opacity: 0.3;
}

.article-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.article-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.tag {
  background: rgba(199, 255, 52, 0.15);
  color: var(--ball);
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: 1px solid rgba(199, 255, 52, 0.3);
}

.estado {
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.estado-proximamente {
  background: rgba(255, 193, 7, 0.15);
  border-color: rgba(255, 193, 7, 0.35);
}

.estado-en-curso {
  background: rgba(76, 175, 80, 0.15);
  border-color: rgba(76, 175, 80, 0.35);
}

.estado-finalizado {
  background: rgba(244, 67, 54, 0.15);
  border-color: rgba(244, 67, 54, 0.35);
}

.article-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  margin: 0;
}

.fecha {
  color: rgba(234, 242, 239, 0.8);
  font-size: 1rem;
}

.descripcion-breve {
  color: rgba(234, 242, 239, 0.85);
  font-size: 1.1rem;
  line-height: 1.7;
  margin: 0 0 8px;
}

.descripcion :deep(p) {
  color: rgba(234, 242, 239, 0.8);
  line-height: 1.7;
  margin: 0 0 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 10px;
}

.info-item {
  background: rgba(9, 13, 15, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(234, 242, 239, 0.6);
}

.value {
  font-size: 0.95rem;
  color: rgba(234, 242, 239, 0.9);
}

@media (max-width: 900px) {
  .article-layout {
    grid-template-columns: 1fr;
  }

  .article-imagen-wrapper {
    position: static;
  }
}
</style>
