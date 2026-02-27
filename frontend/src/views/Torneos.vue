<template>
  <div class="torneos-page fade-in">
    <!-- Hero Torneos -->
    <section class="torneos-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="mini-tag">Competición</span>
        <h1>Torneos y Competiciones</h1>
        <p class="hero-lead">Calendario completo de torneos del Club de Tenis Isturgi. Desde torneos

 sociales hasta competiciones oficiales federadas.</p>
      </div>
    </section>

    <!-- Loading -->
    <div v-if="cargando" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando torneos...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <span class="error-icon">⚠️</span>
      <p>{{ error }}</p>
    </div>

    <!-- Contenido -->
    <template v-else>
      <!-- Grid de Torneos -->
      <section class="torneos-grid-section">
      <div class="section-header">
        <h2>Calendario de Torneos</h2>
        <p class="section-subtitle">Todos los torneos organizados por el club durante la temporada</p>
      </div>

      <div v-if="torneosGrid.length > 0" class="torneos-grid stagger">
        <div 
          v-for="torneo in torneosGrid" 
          :key="torneo.id"
          class="torneo-card"
        >
          <div class="card-image-wrapper">
            <div v-if="torneo.Imagen?.url" class="card-image-container">
              <img 
                :src="`http://localhost:1337${torneo.Imagen.url}`"
                :alt="torneo.Nombre"
                class="card-image"
              />
            </div>
            <div v-else class="image-placeholder">
              <span class="placeholder-icon">🏆</span>
            </div>
            <div class="image-overlay"></div>
          </div>
          
          <div class="card-content">
            <div class="card-meta">
              <span class="card-edicion">Edición {{ torneo.Edicion || 'I' }}</span>
              <span v-if="torneo.Estado" class="card-estado" :class="'estado-' + torneo.Estado.toLowerCase()">
                {{ torneo.Estado }}
              </span>
            </div>
            
            <h3 class="card-title">{{ torneo.Nombre }}</h3>
            
            <p class="card-description">
              {{ truncarTexto(torneo.Descripcion_breve || torneo.Descripcion, 100) }}
            </p>
            
            <button 
              type="button"
              @click="() => router.push(`/torneo/${torneo.documentId}`)"
              class="card-link"
              :title="`Ver: ${torneo.Nombre}`"
            >
              Ver detalles
              <span class="arrow">→</span>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>No hay torneos disponibles en este momento.</p>
      </div>
    </section>

    <!-- Información General -->
    <section class="info-general-section">
      <div class="info-general-content">
        <h2>Información General de Torneos</h2>
        
        <div class="info-grid">
          <div class="info-block">
            <h4>📋 Inscripciones</h4>
            <p>Las inscripciones para cada torneo se abren con suficiente antelación. Se puede realizar presencialmente en las pistas o a través del email del club.</p>
          </div>

          <div class="info-block">
            <h4>📊 Ranking del Club</h4>
            <p>La mayoría de torneos son puntuables para el ranking anual del club. Los puntos se acumulan durante la temporada para la Copa Master final.</p>
          </div>

          <div class="info-block">
            <h4>🏆 Premios y Trofeos</h4>
            <p>Todos los torneos cuentan con trofeos para finalistas. Los torneos importantes tienen premios adicionales y reconocimientos especiales.</p>
          </div>

          <div class="info-block">
            <h4>📱 Resultados</h4>
            <p>Los resultados y clasificaciones se publican en la plataforma GesLiga y en las redes sociales del club.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>¿Quieres participar?</h2>
        <p>Hazte socio del club y participa en todos nuestros torneos y competiciones. Juega, compete y disfruta del tenis en Andújar.</p>
        <router-link to="/contacto" class="btn btn-primary btn-large">Más información</router-link>
      </div>
    </section>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const torneos = ref([]);
const cargando = ref(true);
const error = ref(null);

const torneosGrid = computed(() => {
  return torneos.value.sort((a, b) => (b.OrdenMostrado || 0) - (a.OrdenMostrado || 0));
});

const formatearFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-ES', opciones);
};

const truncarTexto = (texto, maxLength) => {
  if (!texto) return '';
  if (texto.length <= maxLength) return texto;
  return texto.substring(0, maxLength).trim() + '...';
};

onMounted(async () => {
  try {
    const respuesta = await axios.get(
      'http://localhost:1337/api/torneos?populate=*&sort=OrdenMostrado:desc,Edicion:desc'
    );
    torneos.value = respuesta.data.data;
    console.log('Torneos cargados:', torneos.value);
  } catch (e) {
    console.error('Error cargando torneos:', e);
    error.value = 'Error al cargar torneos. Asegúrate de que el servidor backend esté activo.';
  } finally {
    cargando.value = false;
  }
});
</script>

<style scoped>
.torneos-page {
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

/* Hero Torneos */
.torneos-hero {
  position: relative;
  min-height: 400px;
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

/* Torneo Destacado */
.torneo-destacado {
  padding: 0 20px 60px;
}

.torneo-destacado-card {
  max-width: 1000px;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(199, 255, 52, 0.12), rgba(201, 106, 58, 0.1));
  border: 2px solid rgba(199, 255, 52, 0.3);
  border-radius: 24px;
  padding: 48px;
  position: relative;
  overflow: hidden;
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
.stagger > *:nth-child(n+7) { animation-delay: 0.35s; }

/* Grid de Torneos */
.torneos-grid-section,
.eventos-section {
  padding: 60px 20px;
}

.eventos-section {
  background: rgba(9, 13, 15, 0.2);
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

.torneos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 28px;
  max-width: 1200px;
  margin: 0 auto;
}

.torneo-card {
  background: rgba(9, 13, 15, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;
}

.torneo-card::after {
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

.torneo-card:hover {
  transform: translateY(-12px);
  box-shadow: 
    0 30px 60px rgba(0, 0, 0, 0.4),
    0 0 60px rgba(199, 255, 52, 0.2);
}

.torneo-card:hover::after {
  opacity: 1;
}

/* Imagen de la tarjeta */
.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 260px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(199, 255, 52, 0.08), rgba(201, 106, 58, 0.08));
}

.card-image-container,
.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.torneo-card:hover .card-image {
  transform: none;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(8, 12, 14, 0.7));
  opacity: 0;
  transition: opacity 0.4s ease;
}

.torneo-card:hover .image-overlay {
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

.card-edicion {
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

.card-estado {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 1px solid;
}

.card-estado.estado-en\ curso {
  background: rgba(199, 255, 52, 0.2);
  color: var(--ball);
  border-color: rgba(199, 255, 52, 0.4);
}

.card-estado.estado-próximamente {
  background: rgba(100, 150, 255, 0.2);
  color: rgba(100, 150, 255, 1);
  border-color: rgba(100, 150, 255, 0.4);
}

.card-estado.estado-finalizado {
  background: rgba(180, 180, 180, 0.2);
  color: rgba(200, 200, 200, 1);
  border-color: rgba(180, 180, 180, 0.4);
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

/* Eventos */
.eventos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 28px;
  max-width: 1200px;
  margin: 0 auto;
}

.evento-card {
  background: rgba(9, 13, 15, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  transition: all 0.3s ease;
}

.evento-card:hover {
  transform: translateY(-6px);
  border-color: rgba(199, 255, 52, 0.3);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
}

.evento-icon {
  font-size: 3.5rem;
  margin-bottom: 20px;
  display: block;
  filter: drop-shadow(0 4px 16px rgba(199, 255, 52, 0.3));
}

.evento-card h3 {
  font-size: 1.3rem;
  color: #fff;
  margin: 0 0 16px;
  font-weight: 700;
}

.evento-card p {
  color: rgba(234, 242, 239, 0.8);
  line-height: 1.7;
  margin: 0;
}

/* Información General */
.info-general-section {
  padding: 60px 20px;
  background: rgba(9, 13, 15, 0.3);
}

.info-general-content {
  max-width: 1000px;
  margin: 0 auto;
}

.info-general-content h2 {
  font-size: 2.5rem;
  font-weight: 900;
  color: #fff;
  margin: 0 0 40px;
  text-align: center;
  letter-spacing: -0.5px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.info-block {
  background: rgba(9, 13, 15, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 24px;
}

.info-block h4 {
  font-size: 1.2rem;
  color: var(--ball);
  margin: 0 0 12px;
  font-weight: 700;
}

.info-block p {
  color: rgba(234, 242, 239, 0.8);
  line-height: 1.6;
  margin: 0;
  font-size: 0.9rem;
}

/* CTA Final */
.cta-section {
  padding: 80px 20px;
  text-align: center;
}

.cta-content {
  max-width: 700px;
  margin: 0 auto;
  padding: 60px 40px;
  background: linear-gradient(135deg, rgba(199, 255, 52, 0.1), rgba(15, 45, 35, 0.25));
  border: 1px solid rgba(199, 255, 52, 0.2);
  border-radius: 24px;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 900;
  color: #fff;
  margin: 0 0 20px;
}

.cta-content p {
  font-size: 1.1rem;
  color: rgba(234, 242, 239, 0.8);
  line-height: 1.7;
  margin: 0 0 32px;
}

.btn-large {
  padding: 16px 40px;
  font-size: 1.1rem;
  font-weight: 800;
}

/* Responsive */
@media (max-width: 768px) {
  .torneos-hero {
    min-height: 350px;
  }

  .hero-content h1 {
    font-size: 2rem;
  }

  .hero-lead {
    font-size: 1rem;
  }

  .section-header h2 {
    font-size: 2rem;
  }

  .torneo-destacado-card {
    padding: 32px 24px;
  }

  .torneo-numero-grande {
    font-size: 3.5rem;
  }

  .torneo-destacado-card h2 {
    font-size: 2rem;
  }

  .torneo-descripcion {
    font-size: 1rem;
  }

  .torneos-grid {
    grid-template-columns: 1fr;
  }

  .cta-content {
    padding: 40px 28px;
  }

  .cta-content h2 {
    font-size: 2rem;
  }
}

@media (max-width: 1024px) {
  .torneos-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .torneos-hero {
    min-height: 300px;
    border-radius: 0 0 16px 16px;
  }
  
  .hero-content {
    padding: 40px 20px;
  }

  .torneos-grid-section {
    padding: 0 20px 60px;
  }
  
  .torneos-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .card-image-wrapper {
    height: 220px;
  }
  
  .card-title {
    font-size: 1.3rem;
  }

  .section-header {
    margin-bottom: 40px;
  }

  .info-general-section {
    padding: 40px 20px;
  }

  .cta-section {
    padding: 60px 20px;
  }
}

@media (max-width: 480px) {
  .torneos-hero {
    min-height: 250px;
  }

  .torneos-grid-section {
    padding: 0 16px 40px;
  }
  
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .hero-lead {
    font-size: 1rem;
  }
  
  .section-header h2 {
    font-size: 1.8rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
  
  .card-content {
    padding: 20px;
  }

  .section-header {
    margin-bottom: 32px;
  }

  .loading-state,
  .error-state,
  .empty-state {
    padding: 60px 28px;
  }

  .info-general-content h2 {
    font-size: 2rem;
  }

  .cta-content h2 {
    font-size: 1.5rem;
  }

  .cta-content p {
    font-size: 1rem;
  }
}
}
</style>
