<template>
  <div class="noticia-detalle">
    <!-- Header compacto -->
    <header class="header-detalle">
      <div class="container">
        <router-link to="/" class="btn-volver">
          <span class="arrow-back">←</span>
          Volver a noticias
        </router-link>
      </div>
    </header>

    <!-- Contenido -->
    <section class="noticia-content">
      <div v-if="cargando" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando noticia...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <span class="error-icon">⚠️</span>
        <p>{{ error }}</p>
      </div>

      <article v-else-if="noticia" class="noticia-article">
        <!-- Layout de 2 columnas -->
        <div class="article-layout">
          <!-- Columna izquierda: Imagen -->
          <div class="article-imagen-wrapper">
            <div class="article-imagen" @click="abrirImagenCompleta" :class="{ 'imagen-clickeable': noticia.Imagen?.url }">
              <img 
                v-if="noticia.Imagen?.url"
                :src="`${apiUrl}${noticia.Imagen.url}`"
                :alt="noticia.Titulo"
                class="imagen-completa"
              />
              <div v-else class="image-placeholder">
                <span class="placeholder-icon">🎾</span>
              </div>
              <div v-if="noticia.Imagen?.url" class="imagen-overlay">
                <span class="zoom-icon">🔍</span>
                <span class="zoom-text">Click para ampliar</span>
              </div>
            </div>
          </div>

          <!-- Columna derecha: Contenido -->
          <div class="article-info">
            <!-- Meta info -->
            <div class="article-meta">
              <span class="tag-news">Noticias</span>
              <time v-if="noticia.Fecha" class="fecha">
                {{ formatearFecha(noticia.Fecha) }}
              </time>
            </div>

            <!-- Título -->
            <h1 class="article-title">{{ noticia.Titulo }}</h1>

            <!-- Descripción -->
            <div class="article-content">
              <p class="article-text">{{ noticia.Descripcion }}</p>
            </div>

            <!-- Archivos adjuntos -->
            <div v-if="noticia.Archivos && noticia.Archivos.length > 0" class="archivos-adjuntos">
              <h3 class="archivos-titulo">📎 Archivos adjuntos</h3>
              <div class="archivos-lista">
                <a 
                  v-for="archivo in noticia.Archivos" 
                  :key="archivo.id"
                  :href="`${apiUrl}${archivo.url}`"
                  :download="archivo.name"
                  target="_blank"
                  class="archivo-item"
                >
                  <div class="archivo-icono">
                    <span v-if="esPDF(archivo)">📄</span>
                    <span v-else-if="esImagen(archivo)">🖼️</span>
                    <span v-else-if="esVideo(archivo)">🎥</span>
                    <span v-else>📁</span>
                  </div>
                  <div class="archivo-info">
                    <span class="archivo-nombre">{{ archivo.name }}</span>
                    <span class="archivo-meta">
                      {{ obtenerTipoArchivo(archivo) }} • {{ formatearTamano(archivo.size) }}
                    </span>
                  </div>
                  <div class="archivo-descarga">
                    <span class="descarga-icono">⬇</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>

    <!-- Modal pantalla completa -->
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
            v-if="noticia?.Imagen?.url"
            :src="`${apiUrl}${noticia.Imagen.url}`"
            :alt="noticia.Titulo"
            class="lightbox-imagen"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { formatearFecha, formatearTamano } from '../utils/formatters';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:1337';
const route = useRoute();
const noticia = ref(null);
const cargando = ref(true);
const error = ref(null);
const imagenPantallaCompleta = ref(false);

// Funciones para archivos adjuntos
const esPDF = (archivo) => {
  return archivo.mime?.includes('pdf') || archivo.ext === '.pdf';
};

const esImagen = (archivo) => {
  return archivo.mime?.startsWith('image/');
};

const esVideo = (archivo) => {
  return archivo.mime?.startsWith('video/');
};

const obtenerTipoArchivo = (archivo) => {
  if (esPDF(archivo)) return 'Documento PDF';
  if (esImagen(archivo)) return 'Imagen JPEG';
  if (esVideo(archivo)) return 'Video';
  return archivo.ext?.replace('.', '').toUpperCase() || 'Archivo';
};

const abrirImagenCompleta = () => {
  if (noticia.value?.Imagen?.url) {
    imagenPantallaCompleta.value = true;
    document.body.style.overflow = 'hidden';
  }
};

const cerrarImagenCompleta = () => {
  imagenPantallaCompleta.value = false;
  document.body.style.overflow = '';
  // Salir de fullscreen si está activo
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

onMounted(async () => {
  try {
    const id = route.params.id;
    console.log('Cargando noticia con ID:', id);
    const respuesta = await axios.get(
      `${apiUrl}/api/noticias/${id}?populate=*`
    );
    console.log('Respuesta de API:', respuesta.data);
    noticia.value = respuesta.data.data;
  } catch (e) {
    console.error('Error al cargar noticia:', e);
    error.value = 'No se pudo cargar la noticia. Intenta de nuevo.';
  } finally {
    cargando.value = false;
  }

  // Agregar listener para teclas
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  // Limpiar listener y restaurar scroll
  window.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.noticia-detalle {
  min-height: 100vh;
  background: linear-gradient(135deg, #080d0f 0%, #0f1416 100%);
  color: #fff;
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
.noticia-content {
  padding: 60px 30px 100px;
  max-width: 1400px;
  margin: 0 auto;
}

.noticia-article {
  animation: fadeInUp 0.6s ease;
}

/* Layout de 2 columnas */
.article-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
}

/* Columna izquierda: Imagen */
.article-imagen-wrapper {
  position: sticky;
  top: 120px;
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

.tag-news {
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

.article-text {
  font-size: 1.15rem;
  color: rgba(234, 242, 239, 0.9);
  line-height: 1.9;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Archivos adjuntos */
.archivos-adjuntos {
  background: rgba(9, 13, 15, 0.4);
  border: 1px solid rgba(199, 255, 52, 0.2);
  border-radius: 16px;
  padding: 30px;
  backdrop-filter: blur(10px);
}

.archivos-titulo {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--ball);
  margin: 0 0 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.archivos-lista {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.archivo-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 16px 20px;
  background: rgba(15, 20, 22, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.archivo-item:hover {
  background: rgba(199, 255, 52, 0.1);
  border-color: rgba(199, 255, 52, 0.4);
  transform: translateX(4px);
}

.archivo-icono {
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: rgba(199, 255, 52, 0.1);
  border-radius: 10px;
}

.archivo-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.archivo-nombre {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.archivo-meta {
  font-size: 0.85rem;
  color: rgba(234, 242, 239, 0.5);
}

.archivo-descarga {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(199, 255, 52, 0.2);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.descarga-icono {
  font-size: 1.3rem;
}

.archivo-item:hover .archivo-descarga {
  background: var(--ball);
  transform: scale(1.1);
}

.archivo-item:hover .descarga-icono {
  animation: bounce 0.6s ease;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* Estados de carga y error */
.loading-state,
.error-state {
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

@keyframes spin {
  to { transform: rotate(360deg); }
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

.error-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 20px;
}

.error-state {
  background: rgba(255, 60, 60, 0.1);
  border-color: rgba(255, 60, 60, 0.3);
}

.error-state p {
  color: #ff9999;
  font-size: 1.1rem;
}

/* Lightbox / Modal pantalla completa */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
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
  z-index: 10001;
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
  z-index: 10001;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .noticia-content {
    max-width: 1200px;
  }

  .article-layout {
    gap: 30px;
  }

  .article-title {
    font-size: clamp(1.6rem, 3.5vw, 2.5rem);
  }
}

@media (max-width: 900px) {
  .article-layout {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .article-imagen-wrapper {
    position: relative;
    top: 0;
    max-height: 600px;
  }

  .article-imagen {
    max-height: 600px;
  }
}

@media (max-width: 768px) {
  .header-detalle {
    padding: 20px 0;
  }

  .container,
  .noticia-content {
    padding-left: 20px;
    padding-right: 20px;
  }

  .noticia-content {
    padding-top: 40px;
    padding-bottom: 60px;
  }

  .article-layout {
    gap: 30px;
  }

  .article-title {
    font-size: 1.8rem;
    margin-bottom: 24px;
  }

  .article-imagen {
    min-height: 300px;
    padding: 20px;
  }

  .imagen-completa {
    max-height: 450px;
  }

  .article-content {
    padding: 30px 20px;
  }

  .article-text {
    font-size: 1.05rem;
    line-height: 1.8;
  }

  .archivos-adjuntos {
    padding: 25px 20px;
  }

  .archivos-titulo {
    font-size: 1.1rem;
  }

  .archivo-item {
    padding: 14px 16px;
    gap: 12px;
  }

  .archivo-icono {
    width: 45px;
    height: 45px;
    font-size: 1.8rem;
  }

  .archivo-nombre {
    font-size: 0.95rem;
  }

  .lightbox-close,
  .lightbox-fullscreen {
    width: 45px;
    height: 45px;
    font-size: 1.2rem;
  }

  .lightbox-fullscreen {
    right: 75px;
  }
}

@media (max-width: 480px) {
  .article-title {
    font-size: 1.5rem;
  }

  .article-imagen {
    min-height: 250px;
    padding: 15px;
  }

  .article-content {
    padding: 25px 18px;
  }

  .article-text {
    font-size: 1rem;
  }

  .archivos-adjuntos {
    padding: 20px 16px;
  }

  .archivos-titulo {
    font-size: 1rem;
  }

  .archivo-item {
    padding: 12px 14px;
    gap: 10px;
    grid-template-columns: auto 1fr;
  }

  .archivo-icono {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }

  .archivo-nombre {
    font-size: 0.9rem;
  }

  .archivo-meta {
    font-size: 0.8rem;
  }

  .archivo-descarga {
    grid-column: 1 / -1;
    width: 100%;
    border-radius: 8px;
  }

  .lightbox-close,
  .lightbox-fullscreen {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
    top: 10px;
  }

  .lightbox-close {
    right: 10px;
  }

  .lightbox-fullscreen {
    right: 60px;
  }

  .zoom-text {
    font-size: 0.85rem;
  }
}
</style>
