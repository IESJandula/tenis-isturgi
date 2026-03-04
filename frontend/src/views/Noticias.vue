<template>
  <div class="noticias-page fade-in">
    <!-- Hero Noticias -->
    <section class="noticias-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="mini-tag">Actualidad</span>
        <h1>Noticias y Novedades</h1>
        <p class="hero-lead">Mantente informado de todo lo que ocurre en el Club de Tenis Isturgi. Crónicas, avisos y eventos próximos.</p>
      </div>
    </section>

    <!-- Loading -->
    <div v-if="cargando" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando noticias...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <span class="error-icon">⚠️</span>
      <p>{{ error }}</p>
    </div>

    <!-- Contenido -->
    <template v-else>
      <!-- Grid de Noticias -->
      <section class="noticias-grid-section">
        <div class="section-header">
          <h2>Últimas Publicaciones</h2>
          <p class="section-subtitle">Toda la información del club actualizada día a día</p>
        </div>

        <div v-if="noticias.length > 0" class="noticias-grid stagger">
          <div 
            v-for="noticia in noticias" 
            :key="noticia.id"
            class="noticia-card"
          >
            <div class="card-image-wrapper">
              <div v-if="noticia.Imagen?.url" class="card-image-container">
                <img 
                  :src="`${apiUrl}${noticia.Imagen.url}`"
                  :alt="noticia.Titulo"
                  class="card-image"
                />
              </div>
              <div v-else class="image-placeholder">
                <span class="placeholder-icon">🎾</span>
              </div>
              <div class="image-overlay"></div>
            </div>
            
            <div class="card-content">
              <div class="card-meta">
                <span class="card-fecha">{{ formatearFecha(noticia.Fecha) }}</span>
              </div>
              
              <h3 class="card-title">{{ noticia.Titulo }}</h3>
              
              <p class="card-description">
                {{ truncarTexto(noticia.Resumen || noticia.Contenido, 120) }}
              </p>
              
              <button 
                type="button"
                @click="() => router.push(`/noticia/${noticia.documentId}`)"
                class="card-link"
                :title="`Leer más: ${noticia.Titulo}`"
              >
                Leer noticia completa
                <span class="arrow">→</span>
              </button>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>No hay noticias disponibles en este momento.</p>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { formatearFecha, truncarTexto } from '../utils/formatters';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:1337';
const router = useRouter();

const noticias = ref([]);
const cargando = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const respuesta = await axios.get(
      `${apiUrl}/api/noticias?populate=*&sort=Fecha:desc`
    );
    noticias.value = respuesta.data.data;
    console.log('Noticias cargadas:', noticias.value);
  } catch (e) {
    console.error('Error cargando noticias:', e);
    error.value = 'Error al cargar noticias. Asegúrate de que el servidor backend esté activo.';
  } finally {
    cargando.value = false;
  }
});
</script>

<style scoped>
.noticias-page {
  width: 100%;
}

/* States: Loading, Error, Empty */
.loading-state,
.error-state,
.empty-state {
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
  font-size: 4rem;
  display: block;
  margin-bottom: 20px;
}

.error-state p {
  color: #ff9999;
  font-size: 1.1rem;
  margin: 0;
}

.empty-state p {
  color: rgba(234, 242, 239, 0.7);
  font-size: 1.1rem;
  margin: 0;
}

/* Hero Noticias */
.noticias-hero {
  position: relative;
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(135deg, rgba(8, 15, 18, 0.9), rgba(15, 45, 35, 0.85)),
    url("https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2400&auto=format&fit=crop") center/cover no-repeat;
  margin-bottom: 60px;
  border-radius: 0 0 24px 24px;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(199, 255, 52, 0.1), transparent 70%);
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 60px 20px;
  max-width: 900px;
}

.mini-tag {
  display: inline-block;
  background: rgba(199, 255, 52, 0.15);
  color: var(--ball);
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border: 1px solid rgba(199, 255, 52, 0.3);
  margin-bottom: 20px;
}

.hero-content h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin: 0 0 20px;
  letter-spacing: -0.5px;
}

.hero-lead {
  font-size: 1.2rem;
  color: rgba(234, 242, 239, 0.9);
  line-height: 1.7;
  margin: 0;
}

/* Animaciones */
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

.stagger > * {
  animation: fadeInUp 0.6s ease backwards;
}

.stagger > *:nth-child(1) { animation-delay: 0.05s; }
.stagger > *:nth-child(2) { animation-delay: 0.1s; }
.stagger > *:nth-child(3) { animation-delay: 0.15s; }
.stagger > *:nth-child(4) { animation-delay: 0.2s; }
.stagger > *:nth-child(5) { animation-delay: 0.25s; }
.stagger > *:nth-child(6) { animation-delay: 0.3s; }

/* Grid de Noticias */
.noticias-grid-section {
  padding: 0 20px 60px;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 900;
  color: #fff;
  margin: 0 0 12px;
  letter-spacing: -0.5px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: rgba(234, 242, 239, 0.7);
  margin: 0;
}

.noticias-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 28px;
  max-width: 1200px;
  margin: 0 auto;
}

.noticia-card {
  background: rgba(9, 13, 15, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;
}

.noticia-card:hover {
  transform: translateY(-12px);
  box-shadow: 
    0 30px 60px rgba(0, 0, 0, 0.4),
    0 0 60px rgba(199, 255, 52, 0.2);
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(199, 255, 52, 0.12), rgba(201, 106, 58, 0.12));
}

.placeholder-icon {
  font-size: 4rem;
}

.card-content {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
}

.card-meta {
  display: flex;
  align-items: center;
}

.card-fecha {
  color: var(--ball);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
  line-height: 1.3;
}

.card-description {
  color: rgba(234, 242, 239, 0.8);
  line-height: 1.7;
  margin: 0;
  flex: 1;
  font-size: 0.95rem;
}

.card-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--ball);
  font-weight: 700;
  text-decoration: none;
  font-size: 0.95rem;
  margin-top: auto;
  transition: all 0.3s ease;
  width: fit-content;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
}

.card-link .arrow {
  transition: transform 0.3s ease;
}

.card-link:hover {
  gap: 12px;
}

.card-link:hover .arrow {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .noticias-grid {
    grid-template-columns: 1fr;
  }
}
</style>
