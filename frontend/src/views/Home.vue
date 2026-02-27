<template>
  <div class="home fade-in">
    <!-- Hero con banner original -->
    <section class="hero-noticias">
      <div class="hero-banner">
        <img src="/cancha.jpg" alt="Club de Tenis Isturgi" class="banner-image" />
        <div class="banner-overlay"></div>
        <h1 class="banner-title">CLUB DE TENIS ISTURGI</h1>
      </div>
    </section>

    <!-- Sección de Noticias -->
    <section class="noticias-section">
      <div class="section-header-main">
        <div>
          <h2 class="section-title-main">Últimas Noticias</h2>
          <p class="section-subtitle-main">Toda la actualidad del Club de Tenis Isturgi</p>
        </div>
      </div>

      <!-- Loading, Error y Sin noticias -->
      <div v-if="cargando" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando noticias...</p>
      </div>

      <div v-else-if="error" class="error-state glass-card">
        <span class="error-icon">⚠️</span>
        <p>{{ error }}</p>
      </div>

      <div v-else-if="noticias.length === 0" class="empty-state glass-card">
        <span class="empty-icon">📰</span>
        <h3>No hay noticias disponibles</h3>
        <p>Vuelve pronto para conocer las últimas novedades del club</p>
      </div>

      <!-- Grid de Noticias -->
      <div v-else class="noticias-grid stagger">
        <article 
          v-for="(noticia, index) in noticias" 
          :key="noticia.id" 
          class="noticia-card"
        >
          <div class="card-image-wrapper">
            <img 
              v-if="noticia.Imagen?.url"
              :src="`http://localhost:1337${noticia.Imagen.url}`"
              :alt="noticia.Titulo"
              class="card-image"
            />
            <div v-else class="image-placeholder">
              <span class="placeholder-icon">🎾</span>
            </div>
            <div class="image-overlay"></div>
          </div>
          
          <div class="card-content">
            <div class="card-meta">
              <span class="tag-news">Noticias</span>
              <time v-if="noticia.Fecha" class="card-date">
                {{ formatearFecha(noticia.Fecha) }}
              </time>
            </div>
            
            <h3 class="card-title">{{ noticia.Titulo }}</h3>
            
            <p class="card-description">
              {{ truncarTexto(noticia.Descripcion, 120) }}
            </p>
            
            <button 
              type="button"
              @click="irAlDetalle(noticia.documentId)" 
              class="card-link"
              :title="`Leer: ${noticia.Titulo}`"
            >
              Leer más
              <span class="arrow">→</span>
            </button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

// --- LÓGICA DE NOTICIAS (REAL) ---
const noticias = ref([]);
const cargando = ref(true);
const error = ref(null);

const formatearFecha = (fecha) => {
  const date = new Date(fecha);
  const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-ES', opciones);
};

const truncarTexto = (texto, maxLength) => {
  if (!texto) return '';
  if (texto.length <= maxLength) return texto;
  return texto.substring(0, maxLength).trim() + '...';
};

const irAlDetalle = (id) => {
  if (!id) {
    console.error('Error: ID de noticia no disponible');
    return;
  }
  console.log('Navegando a noticia con ID:', id);
  window.location.href = `/noticia/${id}`;
};

onMounted(async () => {
  try {
    const respuesta = await axios.get('http://localhost:1337/api/noticias?populate=*&sort=Fecha:desc');
    noticias.value = respuesta.data.data;
    console.log('Noticias cargadas:', noticias.value);
    if (noticias.value.length > 0) {
      console.log('Ejemplo de noticia:', noticias.value[0]);
    }
  } catch (e) {
    console.error(e);
    error.value = 'Error al cargar noticias. Asegúrate de que el servidor backend esté activo.';
  } finally {
    cargando.value = false;
  }
});
</script>

<style scoped>
.home {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
}

/* ============================================
   HERO NOTICIAS
   ============================================ */
.hero-noticias {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-bottom: 60px;
  background: #000;
}

.hero-banner {
  width: 100%;
  max-height: 500px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.banner-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  object-position: center;
  position: absolute;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.banner-title {
  position: relative;
  z-index: 2;
  color: #fff;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  text-align: center;
  margin: 0;
  letter-spacing: 2px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
}

/* ============================================
   SECCIÓN NOTICIAS
   ============================================ */
.noticias-section {
  padding: 0 20px 80px;
}

.section-header-main {
  text-align: center;
  margin-bottom: 48px;
}

.section-title-main {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  color: #fff;
  margin: 0 0 12px;
  letter-spacing: -0.5px;
}

.section-subtitle-main {
  font-size: 1.1rem;
  color: rgba(234, 242, 239, 0.7);
  margin: 0;
}

/* Estados: Loading, Error, Empty */
.loading-state,
.error-state,
.empty-state {
  padding: 80px 40px;
  text-align: center;
  border-radius: 16px;
  background: rgba(9, 13, 15, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  max-width: 600px;
  margin: 0 auto;
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

.error-icon,
.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 20px;
}

.error-state p {
  color: #ff9999;
  font-size: 1.1rem;
  margin: 0;
}

.empty-state h3 {
  color: #fff;
  margin: 0 0 12px;
  font-size: 1.5rem;
}

.empty-state p {
  color: rgba(234, 242, 239, 0.7);
  margin: 0;
}

/* Grid de Noticias */
.noticias-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Tarjeta de Noticia */
.noticia-card {
  background: rgba(9, 13, 15, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
}

.noticia-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 2px;
  background: linear-gradient(135deg, var(--ball), rgba(201, 106, 58, 0.5));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.noticia-card:hover {
  transform: translateY(-12px);
  box-shadow: 
    0 30px 60px rgba(0, 0, 0, 0.4),
    0 0 60px rgba(199, 255, 52, 0.2);
}

.noticia-card:hover::after {
  opacity: 1;
}

/* Primera noticia destacada */
.noticia-card.featured {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 0;
}

.noticia-card.featured .card-image-wrapper {
  height: 100%;
  min-height: 450px;
}

.noticia-card.featured .card-title {
  font-size: 2.2rem;
}

.noticia-card.featured .card-description {
  font-size: 1.1rem;
  line-height: 1.7;
}

/* Imagen de la tarjeta */
.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 260px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(199, 255, 52, 0.08), rgba(201, 106, 58, 0.08));
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.noticia-card:hover .card-image {
  transform: none;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(8, 12, 14, 0.7));
  opacity: 0;
  transition: opacity 0.4s ease;
}

.noticia-card:hover .image-overlay {
  opacity: 1;
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
  font-size: 5rem;
  filter: drop-shadow(0 4px 20px rgba(199, 255, 52, 0.3));
}

/* Contenido de la tarjeta */
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
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.tag-news {
  background: rgba(199, 255, 52, 0.15);
  color: var(--ball);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 1px solid rgba(199, 255, 52, 0.3);
}

.card-date {
  font-size: 0.85rem;
  color: rgba(234, 242, 239, 0.6);
  text-transform: capitalize;
  letter-spacing: 0.5px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.3px;
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
  font: inherit;
}

.card-link .arrow {
  transition: transform 0.3s ease;
  font-size: 1.2rem;
}

.card-link:hover {
  gap: 12px;
  color: rgba(199, 255, 52, 1);
}

.card-link:hover .arrow {
  transform: translateX(4px);
}

/* ============================================
   ANIMACIONES
   ============================================ */
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
.stagger > *:nth-child(n+7) { animation-delay: 0.35s; }

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 1024px) {
  .noticias-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  
  .noticia-card.featured {
    grid-template-columns: 1fr;
  }
  
  .noticia-card.featured .card-image-wrapper {
    min-height: 350px;
  }
}

@media (max-width: 768px) {
  .hero-noticias {
    min-height: 300px;
    border-radius: 0 0 16px 16px;
  }
  
  .hero-content {
    padding: 40px 20px;
  }

  .noticias-section {
    padding: 0 20px 60px;
  }
  
  .noticias-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .card-image-wrapper {
    height: 220px;
  }
  
  .noticia-card.featured .card-image-wrapper {
    min-height: 280px;
  }
  
  .card-title {
    font-size: 1.3rem;
  }
  
  .noticia-card.featured .card-title {
    font-size: 1.8rem;
  }

  .section-header-main {
    margin-bottom: 40px;
  }
}

@media (max-width: 480px) {
  .hero-banner {
    max-height: 180px;
  }

  .noticias-section {
    padding: 0 16px 40px;
  }
  
  .section-title-main {
    font-size: 1.8rem;
  }
  
  .section-subtitle-main {
    font-size: 1rem;
  }
  
  .card-content {
    padding: 20px;
  }
  
  .section-header-main {
    margin-bottom: 32px;
  }

  .loading-state,
  .error-state,
  .empty-state {
    padding: 60px 28px;
  }
}
</style>