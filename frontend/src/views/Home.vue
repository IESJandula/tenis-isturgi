<template>
  <div class="home fade-in">
    <div class="home-cover">
      <img
        src="/cancha.jpg"
        alt="Pistas del Club de Tenis Isturgi"
        class="home-cover-img"
        loading="eager"
        decoding="async"
      />

      <div class="home-cover-overlay" aria-hidden="true"></div>

      <div class="home-cover-text">
        <div class="home-cover-badge">
          <h1 class="headline home-cover-title">
            Club de Tenis <span class="home-cover-mark">Isturgi</span>
          </h1>
          <p class="home-cover-sub">Andújar</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  width: 100%;
  max-width: 100%;
  margin: 0;
}

.home-cover {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(13, 26, 21, 0.4);
  /* Banner más bajo */
  height: clamp(210px, 30vw, 340px);
}

.home-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* un pelín más abajo para centrar pista/jugador */
  object-position: 50% 62%;
}

.home-cover-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  /* Degradado suave para que el texto se lea sin “efecto raro” */
  background:
    radial-gradient(ellipse 120% 80% at 50% 50%, rgba(7, 16, 13, 0.05) 0%, rgba(7, 16, 13, 0.35) 70%, rgba(7, 16, 13, 0.55) 100%),
    linear-gradient(180deg, rgba(7, 16, 13, 0.08) 0%, rgba(7, 16, 13, 0.22) 55%, rgba(7, 16, 13, 0.45) 100%);
}

.home-cover-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 16px;
  z-index: 1;
}

.home-cover-badge {
  width: min(720px, 100%);
  padding: 16px 16px 14px;
  border-radius: var(--radius-lg);
  background: rgba(13, 26, 21, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm);
}

.home-cover-title {
  margin: 0;
  color: #fff;
  font-size: clamp(1.6rem, 4.5vw, 2.8rem);
  line-height: 1.05;
  text-shadow: 0 10px 28px rgba(0, 0, 0, 0.55);
}

.home-cover-mark {
  color: var(--ball);
}

.home-cover-sub {
  margin: 6px 0 0;
  color: rgba(232, 240, 236, 0.78);
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  font-size: 0.82rem;
}

@media (min-width: 640px) {
  .home-cover { height: clamp(240px, 26vw, 380px); }
  .home-cover-badge { padding: 18px 20px 16px; }
}
</style>