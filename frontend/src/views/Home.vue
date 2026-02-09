<template>
  <div class="home fade-in">
    <section class="hero glass-card">
      <div class="hero-text">
        <span class="tag">Club de Tenis Isturgi</span>
        <h1 class="headline">Tenis con alma en Andujar.</h1>
        <p>
          Comunidad, competicion y escuela para todas las edades. Entrena en pistas
          cuidadas, respira el ambiente de Andujar y vive cada punto como si fuera
          final.
        </p>
        <div class="hero-actions">
          <router-link to="/contacto" class="btn btn-primary">Reserva pista</router-link>
          <router-link to="/escuela" class="btn btn-secondary">Unete a la escuela</router-link>
        </div>
        <div class="hero-stats">
          <div>
            <span class="stat-value">+120</span>
            <span class="stat-label">socios activos</span>
          </div>
          <div>
            <span class="stat-value">6</span>
            <span class="stat-label">pistas exteriores</span>
          </div>
          <div>
            <span class="stat-value">15</span>
            <span class="stat-label">anos de liga social</span>
          </div>
        </div>
      </div>
      <div class="hero-panel">
        <div class="panel-card">
          <h3>Entrena con equipo tecnico</h3>
          <p>Programas por niveles, seguimiento y sesiones personalizadas.</p>
        </div>
        <div class="panel-card">
          <h3>Agenda de torneos</h3>
          <p>Calendario competitivo, ligas mixtas y eventos solidarios.</p>
        </div>
        <div class="panel-card highlight">
          <h3>Inscripcion abierta</h3>
          <p>Plazas limitadas para escuela infantil y adultos.</p>
        </div>
      </div>
    </section>

    <section class="home-grid">
      <div class="news glass-card">
        <div class="section-header">
          <div>
            <h2 class="section-title">Noticias del club</h2>
            <p class="section-subtitle">Todo lo que se mueve en las pistas Isturgi.</p>
          </div>
          <router-link to="/club" class="btn btn-secondary">Ver mas</router-link>
        </div>

        <p v-if="cargando">Cargando noticias...</p>
        <p v-else-if="error" class="error">{{ error }}</p>

        <div v-else class="lista-noticias stagger">
          <article v-for="noticia in noticias" :key="noticia.id" class="tarjeta-noticia">
            <h3>{{ noticia.Titulo }}</h3>
            <p>{{ noticia.Descripcion }}</p>
            <small v-if="noticia.publishedAt">
              {{ new Date(noticia.publishedAt).toLocaleDateString() }}
            </small>
          </article>
        </div>
      </div>

      <aside class="sidebar glass-card">
        <div class="section-header">
          <div>
            <h2 class="section-title">Proximos torneos</h2>
            <p class="section-subtitle">Apunta tu pareja o unete a la lista.</p>
          </div>
        </div>

        <div class="card-torneo">
          <div class="fecha-box">
            <span class="dia">15</span>
            <span class="mes">MAR</span>
          </div>
          <div class="info-torneo">
            <h4>Torneo Primavera</h4>
            <p>Inscripcion abierta</p>
          </div>
        </div>

        <div class="card-torneo">
          <div class="fecha-box">
            <span class="dia">22</span>
            <span class="mes">ABR</span>
          </div>
          <div class="info-torneo">
            <h4>Liga Social Mix</h4>
            <p>Solo socios</p>
          </div>
        </div>

        <div class="cta-card">
          <p>Reserva tu pista online y recibe confirmacion inmediata.</p>
          <router-link to="/contacto" class="btn btn-primary">Contactar</router-link>
        </div>
      </aside>
    </section>

    <section class="cta-strip">
      <div>
        <h2 class="section-title">Vive el tenis como en casa</h2>
        <p class="section-subtitle">
          Andujar respira tenis. Unete al club y participa en eventos, clinics y
          ligas.
        </p>
      </div>
      <router-link to="/login" class="btn btn-secondary">Soy socio</router-link>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// --- LÓGICA DE NOTICIAS (REAL) ---
const noticias = ref([]);
const cargando = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const respuesta = await axios.get('http://localhost:1337/api/noticias');
    noticias.value = respuesta.data.data; 
  } catch (e) {
    console.error(e);
    error.value = 'Error al cargar noticias. Revisa que Strapi esté encendido.';
  } finally {
    cargando.value = false;
  }
});
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.hero {
  padding: 40px;
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 28px;
  background:
    linear-gradient(120deg, rgba(8, 15, 18, 0.92), rgba(8, 15, 18, 0.4)),
    url("https://images.unsplash.com/photo-1503945438517-f65904a52ce6?q=80&w=2000&auto=format&fit=crop")
      center/cover no-repeat;
}

.hero-text h1 {
  font-size: clamp(2.4rem, 3.4vw, 3.4rem);
  margin: 14px 0 10px;
}

.hero-text p {
  color: rgba(234, 242, 239, 0.8);
  max-width: 520px;
  margin-bottom: 18px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.stat-value {
  display: block;
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--ball);
}

.stat-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: rgba(234, 242, 239, 0.65);
}

.hero-panel {
  display: grid;
  gap: 14px;
}

.panel-card {
  background: rgba(9, 13, 15, 0.68);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  padding: 16px;
}

.panel-card h3 {
  margin: 0 0 6px;
  font-size: 1rem;
}

.panel-card p {
  margin: 0;
  color: rgba(234, 242, 239, 0.65);
  font-size: 0.9rem;
}

.panel-card.highlight {
  border-color: rgba(199, 255, 52, 0.3);
  background: rgba(199, 255, 52, 0.08);
}

.home-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.news,
.sidebar {
  padding: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 18px;
}

.lista-noticias {
  display: grid;
  gap: 16px;
}

.tarjeta-noticia {
  background: rgba(9, 13, 15, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  padding: 18px;
}

.tarjeta-noticia h3 {
  margin: 0 0 8px;
  color: var(--ball);
}

.tarjeta-noticia p {
  margin: 0 0 12px;
  color: rgba(234, 242, 239, 0.72);
}

.tarjeta-noticia small {
  color: rgba(234, 242, 239, 0.55);
}

.error {
  color: #ffb1b1;
}

.card-torneo {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(9, 13, 15, 0.72);
  padding: 12px 14px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 12px;
}

.fecha-box {
  background: var(--ball);
  color: var(--ink);
  padding: 6px 10px;
  border-radius: 8px;
  text-align: center;
  font-weight: 800;
}

.dia {
  font-size: 1.1rem;
  line-height: 1;
}

.mes {
  font-size: 0.7rem;
  text-transform: uppercase;
}

.info-torneo h4 {
  margin: 0;
  font-size: 1rem;
}

.info-torneo p {
  margin: 0;
  color: rgba(234, 242, 239, 0.65);
  font-size: 0.85rem;
}

.cta-card {
  margin-top: 18px;
  padding: 16px;
  border-radius: var(--radius-md);
  background: rgba(199, 255, 52, 0.08);
  border: 1px solid rgba(199, 255, 52, 0.2);
  display: grid;
  gap: 12px;
}

.cta-strip {
  padding: 24px 28px;
  border-radius: var(--radius-lg);
  background: linear-gradient(100deg, rgba(199, 255, 52, 0.18), rgba(201, 106, 58, 0.18));
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

@media (max-width: 960px) {
  .hero {
    grid-template-columns: 1fr;
  }
  .home-grid {
    grid-template-columns: 1fr;
  }
  .hero-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .cta-strip {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 600px) {
  .hero {
    padding: 28px;
  }
  .hero-stats {
    grid-template-columns: 1fr;
  }
}
</style>