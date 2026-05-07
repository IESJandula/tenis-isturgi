<template>
  <div class="home fade-in">
    <!-- Hero Premium (Sin vídeo, pero con diseño de impacto) -->
    <section class="hero-premium">
      <div class="hero-bg">
        <img src="/cancha.jpg" alt="Club de Tenis Isturgi" class="hero-img" />
        <div class="hero-overlay"></div>
      </div>
      
      <div class="hero-content-wrapper">
        <div class="hero-glass-card fade-in-up">
          <span class="hero-tag">Temporada 2026</span>
          <h1 class="hero-title">Club de Tenis <br/> <span class="highlight">Isturgi</span></h1>
          <p class="hero-text">
            Vive la pasión del tenis en las mejores instalaciones de Andújar. 
            Únete a nuestra liga social y compite al más alto nivel.
          </p>
          <div class="hero-actions">
            <router-link to="/liga" class="btn btn-primary btn-hero">Explorar Liga</router-link>
            <router-link to="/club" class="btn btn-outline btn-hero">Conocer el Club</router-link>
          </div>
        </div>
      </div>

      <div class="hero-stats">
        <div class="hero-stat-item">
          <span class="val">120+</span>
          <span class="lbl">Socios</span>
        </div>
        <div class="hero-stat-item">
          <span class="val">6</span>
          <span class="lbl">Pistas</span>
        </div>
        <div class="hero-stat-item">
          <span class="val">15</span>
          <span class="lbl">Torneos/año</span>
        </div>
      </div>
    </section>

    <!-- Sección de Noticias -->
    <section class="noticias-section">
      <div class="section-header-main">
        <div>
          <h2 class="section-title-main">Últimas Noticias</h2>
          <p class="section-subtitle-main">Toda la actualidad del Club de Tenis Isturgi</p>
        </div>
        <router-link to="/noticias" class="btn btn-secondary">Ver todas</router-link>
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
            <template v-if="noticia.Imagen">
              <img 
                :src="noticia.Imagen"
              :alt="noticia.Titulo"
              class="card-image"
            />
            </template>
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
              @click="() => router.push(`/noticia/${noticia.id || noticia.documentId}`)" 
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

    <!-- Sección de Próximos Torneos -->
    <section class="noticias-section">
      <div class="section-header-main">
        <div>
          <h2 class="section-title-main">Próximos Torneos</h2>
          <p class="section-subtitle-main">Las mejores competiciones de tenis del club</p>
        </div>
        <router-link to="/torneos" class="btn btn-secondary">Ver todos</router-link>
      </div>

      <!-- Loading, Error y Sin torneos -->
      <div v-if="cargandoTorneos" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando torneos...</p>
      </div>

      <div v-else-if="errorTorneos" class="error-state glass-card">
        <span class="error-icon">⚠️</span>
        <p>{{ errorTorneos }}</p>
      </div>

      <div v-else-if="torneos.length === 0" class="empty-state glass-card">
        <span class="empty-icon">🏆</span>
        <h3>No hay torneos disponibles</h3>
        <p>Vuelve pronto para conocer los próximos eventos</p>
      </div>

      <!-- Grid de Torneos -->
      <div v-else class="noticias-grid stagger">
        <article 
          v-for="(torneo, index) in torneos" 
          :key="torneo.id" 
          class="noticia-card"
        >
          <div class="card-image-wrapper">
            <template v-if="torneo.Cartel">
              <img 
                :src="torneo.Cartel"
              :alt="torneo.Nombre"
              class="card-image"
            />
            </template>
            <div v-else class="image-placeholder">
              <span class="placeholder-icon">🎾</span>
            </div>
            <div class="image-overlay"></div>
          </div>
          
          <div class="card-content">
            <div class="card-meta">
              <span class="tag-news">Torneo</span>
              <time v-if="torneo.FechaInicio" class="card-date">
                {{ formatearFecha(torneo.FechaInicio) }}
              </time>
            </div>
            
            <h3 class="card-title">{{ torneo.Nombre }}</h3>
            
            <p class="card-description">
              {{ truncarTexto(torneo.Descripcion_breve || torneo.Descripcion, 120) }}
            </p>
            
            <button 
              type="button"
              @click="() => router.push(`/torneo/${torneo.id || torneo.documentId}`)" 
              class="card-link"
              :title="`Ver torneo: ${torneo.Nombre}`"
            >
              Ver torneo
              <span class="arrow">→</span>
            </button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

import { formatearFecha, truncarTexto } from '../utils/formatters';

const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const router = useRouter();

// --- LÓGICA DE NOTICIAS Y TORNEOS ---
const noticias = ref([]);
const cargando = ref(true);
const error = ref(null);

const torneos = ref([]);
const cargandoTorneos = ref(true);
const errorTorneos = ref(null);

onMounted(async () => {
  try {
    const respuesta = await axios.get(`${apiUrl}/api/noticias`);
    let n = respuesta.data.data || [];
    // Sort and limit on client side to emulate Strapi's behavior temporarily
    n.sort((a,b) => new Date(b.FechaPublicacion || b.createdAt) - new Date(a.FechaPublicacion || a.createdAt));
    noticias.value = n.slice(0, 4);
  } catch (e) {
    console.error(e);
    error.value = 'Error al cargar noticias. Asegúrate de que el servidor backend esté activo.';
  } finally {
    cargando.value = false;
  }

  try {
    const resTorneos = await axios.get(`${apiUrl}/api/torneos`);
    let t = resTorneos.data.data || [];
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const parseFecha = (value) => {
      if (!value) return null;
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? null : d;
    };

    const conFecha = t.map((item) => ({
      item,
      fecha: parseFecha(item.FechaInicio) || parseFecha(item.createdAt)
    }));

    const proximos = conFecha
      .filter((x) => x.fecha && x.fecha >= hoy)
      .sort((a, b) => a.fecha - b.fecha)
      .map((x) => x.item);

    const pasados = conFecha
      .filter((x) => !x.fecha || x.fecha < hoy)
      .sort((a, b) => (b.fecha || 0) - (a.fecha || 0))
      .map((x) => x.item);

    torneos.value = [...proximos, ...pasados].slice(0, 4);
  } catch (e) {
    console.error(e);
    errorTorneos.value = 'Error al cargar torneos.';
  } finally {
    cargandoTorneos.value = false;
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
   HERO PREMIUM
   ============================================ */
.hero-premium {
  position: relative;
  height: 90vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  padding: 0 5%;
  overflow: hidden;
  margin-bottom: 64px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.6) scale(1.1);
  animation: slowZoom 20s infinite alternate linear;
}

@keyframes slowZoom {
  from { transform: scale(1); }
  to { transform: scale(1.15); }
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
}

.hero-content-wrapper {
  position: relative;
  z-index: 2;
  max-width: 800px;
}

.hero-glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  padding: 64px;
  border-radius: var(--radius-xl);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
}

.hero-tag {
  color: var(--ball);
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 2px;
  font-size: 0.85rem;
  margin-bottom: 16px;
  display: block;
}

.hero-title {
  font-family: "Syne", sans-serif;
  font-size: 5rem;
  font-weight: 800;
  line-height: 1;
  margin: 0 0 24px;
  color: #fff;
}

.hero-title .highlight {
  color: var(--ball);
  text-shadow: var(--glow);
}

.hero-text {
  font-size: 1.2rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 500px;
}

.hero-actions {
  display: flex;
  gap: 20px;
}

.btn-hero {
  padding: 18px 40px;
  font-size: 1rem;
}

.btn-outline {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: #fff;
}

.hero-stats {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--ball);
  color: var(--ink);
  display: flex;
  padding: 32px 64px;
  gap: 64px;
  border-radius: 40px 0 0 0;
  z-index: 3;
}

.hero-stat-item {
  display: flex;
  flex-direction: column;
}

.hero-stat-item .val {
  font-family: "Syne", sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
}

.hero-stat-item .lbl {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  opacity: 0.7;
}

@media (max-width: 1024px) {
  .hero-glass-card { padding: 40px; }
  .hero-title { font-size: 3.5rem; }
  .hero-stats { padding: 24px 40px; gap: 32px; }
}

@media (max-width: 768px) {
  .hero-premium { height: auto; padding: 120px 20px 60px; }
  .hero-glass-card { background: transparent; backdrop-filter: none; padding: 0; border: none; box-shadow: none; }
  .hero-overlay { background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%); }
  .hero-stats { position: relative; border-radius: 20px; margin-top: 40px; width: 100%; right: auto; justify-content: space-around; }
}

/* ============================================
   SECCIÓN NOTICIAS
   ============================================ */
.noticias-section {
  padding: 0 16px 48px;
}

.section-header-main {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.section-title-main {
  font-family: "Syne", sans-serif;
  font-size: clamp(1.5rem, 4vw, 2.4rem);
  font-weight: 800;
  color: #fff;
  margin: 0 0 4px;
  letter-spacing: -0.3px;
}

.section-subtitle-main {
  font-size: 0.88rem;
  color: var(--text-muted);
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

/* Grid de Noticias – mobile-first: 1 columna base */
.noticias-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Tarjeta de Noticia */
.noticia-card {
  background: var(--glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-stroke);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1);
  position: relative;
}

.noticia-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--ball);
  box-shadow: var(--shadow-lg), var(--glow);
}

/* Primera noticia destacada – solo en desktop */
.noticia-card.featured {
  /* sin layout especial en móvil */
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
  aspect-ratio: 16 / 9;
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
  padding: 18px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  font-family: "Syne", sans-serif;
  font-size: clamp(1.05rem, 2.5vw, 1.35rem);
  font-weight: 800;
  color: #fff;
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.2px;
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
   RESPONSIVE  (mobile-first breakpoints)
   ============================================ */
@media (min-width: 480px) {
  .hero-noticias {
    border-radius: 0 0 24px 24px;
    margin-bottom: 48px;
  }
}

@media (min-width: 640px) {
  .noticias-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .noticias-section {
    padding: 0 24px 56px;
  }
}

@media (min-width: 1024px) {
  .noticias-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
  }

  .noticias-section {
    padding: 0 32px 72px;
  }

  .section-header-main {
    margin-bottom: 36px;
  }

  .noticia-card.featured {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 1.35fr 1fr;
    gap: 0;
  }

  .noticia-card.featured .card-image-wrapper {
    aspect-ratio: unset;
    height: 100%;
    min-height: 400px;
  }

  .noticia-card.featured .card-title {
    font-size: 1.9rem;
  }

  .noticia-card.featured .card-content {
    padding: 32px;
  }
}

@media (min-width: 1400px) {
  .hero-noticias {
    border-radius: 0 0 32px 32px;
  }
}
</style>