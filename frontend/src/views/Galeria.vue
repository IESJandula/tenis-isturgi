<template>
  <section class="galeria-view fade-in">
    <header class="galeria-hero glass-card">
      <div>
        <span class="tag">Vista multimedia</span>
        <h1 class="headline">Galeria del Club Isturgi</h1>
        <p>
          Fotos seleccionadas de entrenos, torneos y vida social. Una mirada real a las
          pistas de Andujar.
        </p>
      </div>
      <div class="hero-actions">
        <router-link to="/contacto" class="btn btn-primary">Enviar fotos</router-link>
        <router-link to="/liga" class="btn btn-secondary">Ver liga</router-link>
      </div>
    </header>

    <section class="filter-bar">
      <button
        v-for="filtro in filtros"
        :key="filtro"
        :class="['filter-chip', { activo: filtro === filtroActivo }]"
        @click="filtroActivo = filtro"
      >
        {{ filtro }}
      </button>
    </section>

    <section class="galeria-grid">
      <article v-for="item in itemsFiltrados" :key="item.id" class="galeria-item">
        <div
          class="media-frame"
          :style="{ '--frame-image': `url(${item.src})` }"
          role="button"
          tabindex="0"
          @click="abrirLightbox(item)"
          @keyup.enter="abrirLightbox(item)"
          @keyup.space.prevent="abrirLightbox(item)"
        >
          <span class="media-tag">{{ item.categoria }}</span>
          <div class="media-copy">
            <h3>{{ item.titulo }}</h3>
            <p>{{ item.texto }}</p>
          </div>
        </div>
      </article>
    </section>

    <div v-if="lightboxActivo" class="lightbox" @click.self="cerrarLightbox">
      <div class="lightbox-card" role="dialog" aria-modal="true">
        <button class="lightbox-close" type="button" @click="cerrarLightbox">
          Cerrar
        </button>
        <img :src="lightboxActivo.src" :alt="lightboxActivo.titulo" />
        <div class="lightbox-info">
          <span class="media-tag">{{ lightboxActivo.categoria }}</span>
          <h3>{{ lightboxActivo.titulo }}</h3>
          <p>{{ lightboxActivo.texto }}</p>
        </div>
      </div>
    </div>

    <section class="media-highlight glass-card">
      <div>
        <h2 class="section-title">Highlights del club</h2>
        <p class="section-subtitle">
          Un resumen de torneos y entrenamientos con los mejores puntos de la semana.
        </p>
      </div>
      <a
        class="highlight-card"
        href="https://www.youtube.com/results?search_query=tenis+club+highlights"
        target="_blank"
        rel="noreferrer"
      >
        <div class="highlight-media"></div>
        <div class="highlight-copy">
          <span class="tag">Video</span>
          <h3>Ver highlights en YouTube</h3>
          <p>Abre la lista de reproduccion y comparte los mejores puntos.</p>
        </div>
      </a>
    </section>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const filtros = ['Todos', 'Pistas', 'Escuela', 'Liga', 'Torneos', 'Club', 'Eventos'];
const filtroActivo = ref('Todos');

const mediaItems = [
  {
    id: 1,
    categoria: 'Pistas',
    titulo: 'Tierra batida al amanecer',
    texto: 'Preparando las lineas para el primer turno.',
    src: 'https://images.unsplash.com/photo-1503945438517-f65904a52ce6?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 2,
    categoria: 'Escuela',
    titulo: 'Sesion tecnica en pista 3',
    texto: 'Trabajo de pies y control de profundidad.',
    src: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 3,
    categoria: 'Liga',
    titulo: 'Partido nocturno',
    texto: 'Ambiente social despues del trabajo.',
    src: 'https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 4,
    categoria: 'Club',
    titulo: 'Zona social',
    texto: 'Cafe, conversa y analisis del partido.',
    src: 'https://images.unsplash.com/photo-1500634245200-e5245c7574ef?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 5,
    categoria: 'Torneos',
    titulo: 'Final de primavera',
    texto: 'Gradas completas y mucha energia.',
    src: 'https://images.unsplash.com/photo-1502899576159-f224dc2349fa?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 6,
    categoria: 'Eventos',
    titulo: 'Clinic de fin de semana',
    texto: 'Sesion abierta para nuevos socios.',
    src: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 7,
    categoria: 'Pistas',
    titulo: 'Lineas perfectas',
    texto: 'Cuidado diario para un bote limpio.',
    src: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 8,
    categoria: 'Liga',
    titulo: 'Dobles mixtos',
    texto: 'Parejas nuevas cada jornada.',
    src: 'https://images.unsplash.com/photo-1502899576159-f224dc2349fa?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 9,
    categoria: 'Club',
    titulo: 'Equipo tecnico',
    texto: 'Seguimiento personalizado para mejorar tu juego.',
    src: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1600&auto=format&fit=crop',
  },
];

const itemsFiltrados = computed(() => {
  if (filtroActivo.value === 'Todos') return mediaItems;
  return mediaItems.filter((item) => item.categoria === filtroActivo.value);
});

const lightboxActivo = ref(null);

const abrirLightbox = (item) => {
  lightboxActivo.value = item;
};

const cerrarLightbox = () => {
  lightboxActivo.value = null;
};

const onKeydown = (event) => {
  if (event.key === 'Escape') {
    cerrarLightbox();
  }
};

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
});
</script>

<style scoped>
.galeria-view {
  display: grid;
  gap: 28px;
}

.galeria-hero {
  padding: 32px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 18px;
  background:
    linear-gradient(120deg, rgba(8, 12, 14, 0.9), rgba(8, 12, 14, 0.4)),
    url("https://images.unsplash.com/photo-1503945438517-f65904a52ce6?q=80&w=2000&auto=format&fit=crop")
      center/cover no-repeat;
}

.galeria-hero p {
  max-width: 520px;
  color: rgba(234, 242, 239, 0.75);
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-chip {
  border-radius: 999px;
  padding: 10px 18px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(9, 13, 15, 0.7);
  color: rgba(234, 242, 239, 0.8);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-chip.activo {
  background: var(--ball);
  color: var(--ink);
  border-color: var(--ball);
}

.galeria-grid {
  column-count: 3;
  column-gap: 16px;
}

.galeria-item {
  break-inside: avoid;
  margin-bottom: 16px;
}

.media-frame {
  min-height: 220px;
  padding: 18px;
  border-radius: var(--radius-md);
  background:
    linear-gradient(180deg, rgba(8, 12, 14, 0.08), rgba(8, 12, 14, 0.78)),
    var(--frame-image) center/cover no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.media-frame:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.35);
}

.galeria-item:nth-child(3n) .media-frame {
  min-height: 280px;
}

.galeria-item:nth-child(4n) .media-frame {
  min-height: 240px;
}

.media-tag {
  align-self: flex-start;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(199, 255, 52, 0.15);
  color: var(--ball);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.media-copy h3 {
  margin: 0 0 6px;
  color: #ffffff;
}

.media-copy p {
  margin: 0;
  color: rgba(234, 242, 239, 0.72);
  font-size: 0.85rem;
}

.media-highlight {
  padding: 26px;
  display: grid;
  gap: 18px;
}

.highlight-card {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 18px;
  padding: 18px;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(9, 13, 15, 0.7);
  text-decoration: none;
  color: inherit;
}

.highlight-media {
  min-height: 180px;
  border-radius: var(--radius-md);
  background:
    linear-gradient(130deg, rgba(8, 12, 14, 0.2), rgba(8, 12, 14, 0.7)),
    url("https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1200&auto=format&fit=crop")
      center/cover no-repeat;
}

.highlight-copy h3 {
  margin: 10px 0 6px;
}

.highlight-copy p {
  margin: 0;
  color: rgba(234, 242, 239, 0.7);
}

.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(5, 8, 10, 0.75);
  backdrop-filter: blur(12px);
  display: grid;
  place-items: center;
  padding: 24px;
  z-index: 2000;
}

.lightbox-card {
  max-width: 900px;
  width: min(90vw, 900px);
  background: rgba(9, 13, 15, 0.92);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  display: grid;
  gap: 16px;
  padding: 18px;
}

.lightbox-card img {
  width: 100%;
  border-radius: var(--radius-md);
  max-height: 520px;
  object-fit: cover;
}

.lightbox-close {
  align-self: flex-end;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: #ffffff;
  border-radius: 999px;
  padding: 8px 16px;
  font-weight: 700;
  cursor: pointer;
}

.lightbox-info h3 {
  margin: 8px 0 6px;
}

.lightbox-info p {
  margin: 0;
  color: rgba(234, 242, 239, 0.7);
}

@media (max-width: 980px) {
  .galeria-grid {
    column-count: 2;
  }
  .highlight-card {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .galeria-hero {
    padding: 24px;
  }
  .galeria-grid {
    column-count: 1;
  }
  .lightbox-card {
    padding: 14px;
  }
}
</style>
