<template>
  <div class="home">
    
    <section class="hero">
      <div class="hero-content">
        <h1>Bienvenido al Club de Tenis Isturgi 🎾</h1>
        <p>Pasión por el tenis en el corazón de Andújar</p>
      </div>
    </section>

    <div class="layout-grid">
      
      <section class="seccion-noticias">
        <h2>📢 Últimas Noticias</h2>
        
        <p v-if="cargando">Cargando noticias...</p>
        <p v-else-if="error" class="error">{{ error }}</p>
        
        <div v-else class="lista-noticias">
          <div v-for="noticia in noticias" :key="noticia.id" class="tarjeta-noticia">
            <h3>{{ noticia.Titulo }}</h3>
            <p>{{ noticia.Descripcion }}</p>
            <small v-if="noticia.publishedAt">
              📅 {{ new Date(noticia.publishedAt).toLocaleDateString() }}
            </small>
          </div>
        </div>
      </section>

      <aside class="sidebar-torneos">
        <h2>🏆 Próximos Torneos</h2>
        
        <div class="card-torneo">
          <div class="fecha-box">
             <span class="dia">15</span>
             <span class="mes">MAR</span>
          </div>
          <div class="info-torneo">
            <h4>Torneo Primavera</h4>
            <p>Inscripción abierta</p>
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

        <div class="publicidad">
           <p>🎾 ¡Reserva tu pista online!</p>
        </div>
      </aside>

    </div>
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
/* Estilos generales */
.home {
  color: white;
}

/* Hero Section (Portada) */
.hero {
  background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=2000&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-bottom: 30px;
  text-align: center;
}

.hero h1 {
  font-size: 2.5rem;
  color: #bfff00;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  margin: 0;
}

.hero p {
  font-size: 1.2rem;
  margin-top: 10px;
}

/* Layout de dos columnas */
.layout-grid {
  display: grid;
  grid-template-columns: 2fr 1fr; /* Izquierda ancha, derecha estrecha */
  gap: 30px;
}

@media (max-width: 768px) {
  .layout-grid {
    grid-template-columns: 1fr; /* En móvil, una debajo de otra */
  }
}

/* Noticias */
.tarjeta-noticia {
  background-color: #2c2c2c;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  border-left: 4px solid #bfff00;
}

.tarjeta-noticia h3 { margin-top: 0; color: #bfff00; }
.error { color: #ff5252; }

/* Sidebar Torneos */
.sidebar-torneos h2 {
  border-bottom: 2px solid #444;
  padding-bottom: 10px;
  margin-top: 0;
}

.card-torneo {
  display: flex;
  align-items: center;
  background: #333;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  transition: transform 0.2s;
}

.card-torneo:hover {
  transform: translateX(5px);
  background: #3a3a3a;
}

.fecha-box {
  background: #bfff00;
  color: #222;
  padding: 5px 10px;
  border-radius: 5px;
  text-align: center;
  margin-right: 15px;
  font-weight: bold;
  display: flex;
  flex-direction: column;
}

.dia { font-size: 1.2rem; line-height: 1; }
.mes { font-size: 0.7rem; text-transform: uppercase; }

.info-torneo h4 { margin: 0; font-size: 1rem; }
.info-torneo p { margin: 0; font-size: 0.8rem; color: #ccc; }

.publicidad {
  background: #bfff00;
  color: #222;
  text-align: center;
  padding: 15px;
  border-radius: 8px;
  font-weight: bold;
  margin-top: 20px;
  cursor: pointer;
}
</style>