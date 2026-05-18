<template>
  <footer class="site-footer">
    <div class="footer-wrap">
      <div class="footer-brand glass-card">
        <img src="/logo-isturgi.jpg" alt="Logo Club Tenis Isturgi" class="footer-logo" />
        <div>
          <p class="footer-name headline">Isturgi</p>
          <p class="footer-sub">Club de Tenis · Andújar</p>
          <p class="footer-copy">
            Pistas rápidas, escuela para todas las edades y competiciones con
            ambiente de club.
          </p>
        </div>
      </div>

      <div class="footer-grid">
        <div class="footer-card">
          <h3>Horarios</h3>
          <ul>
            <li>Lunes - Domingo: 09:00 - 22:00</li>
          </ul>
        </div>
        <div class="footer-card">
          <h3>Contacto</h3>
          <ul>
            <li>C. Egido del Puente, s/n, 23740 Andújar, Jaén</li>
            <li>
              <a href="tel:+34697827244">+34 697 827 244</a>
            </li>
            <li>
              <a href="mailto:tenisturgi@gmail.com">tenisturgi@gmail.com</a>
            </li>
            <li>Contacto: Carlos Martínez</li>
            <li>
              <a
                href="https://wa.me/34697827244"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
        <div class="footer-card">
          <h3>Acceso rápido</h3>
          <ul>
            <li><router-link to="/contacto">Reserva pista</router-link></li>
            <li><router-link to="/galeria">Galería</router-link></li>
            <li><router-link to="/liga">Liga</router-link></li>
          </ul>
        </div>
      </div>

      <div class="footer-cta">
        <div>
          <h3>¿Quieres jugar esta semana?</h3>
          <p>Reserva pista o únete a la escuela para mejorar tu nivel.</p>
        </div>
        <router-link to="/contacto" class="btn btn-primary">Reservar ahora</router-link>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* ─────────────────────────────────────────
   FOOTER  (mobile-first)
───────────────────────────────────────── */
.site-footer {
  margin-top: 48px;
  padding: 32px 16px 80px; /* 80px extra para no quedar bajo el bottom nav */
  background:
    radial-gradient(ellipse 120% 40% at 20% -5%, rgba(199, 255, 52, 0.1) 0%, transparent 55%),
    linear-gradient(160deg, rgba(7, 16, 13, 0.98), rgba(7, 12, 10, 0.95));
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.footer-wrap {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Brand card ── */
.footer-brand {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: rgba(13, 26, 21, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: var(--radius-lg);
}

.footer-logo {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 1.5px solid rgba(199, 255, 52, 0.45);
  object-fit: cover;
  background: rgba(7, 16, 13, 0.8);
  flex-shrink: 0;
}

.footer-name {
  margin: 0;
  font-size: 1.55rem;
  color: var(--ball);
}

.footer-sub {
  margin: 0 0 6px;
  text-transform: uppercase;
  font-size: 0.72rem;
  letter-spacing: 1.2px;
  color: rgba(232, 240, 236, 0.55);
}

.footer-copy {
  margin: 0;
  color: rgba(232, 240, 236, 0.65);
  font-size: 0.9rem;
  line-height: 1.55;
}

/* ── Info cards grid: 1 columna en móvil ── */
.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.footer-card {
  background: rgba(9, 18, 14, 0.7);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.07);
  padding: 16px 18px;
}

.footer-card h3 {
  margin: 0 0 10px;
  font-family: "Syne", sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--text);
}

.footer-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
  color: rgba(232, 240, 236, 0.65);
  font-size: 0.88rem;
  line-height: 1.5;
}

.footer-card a {
  color: inherit;
  transition: color 0.15s ease;
}

.footer-card a:hover {
  color: var(--ball);
}

/* ── CTA banner ── */
.footer-cta {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(120deg, rgba(199, 255, 52, 0.12), rgba(255, 99, 53, 0.1));
}

.footer-cta h3 {
  margin: 0 0 4px;
  font-family: "Syne", sans-serif;
  font-weight: 700;
  font-size: 1.05rem;
}

.footer-cta p {
  margin: 0;
  color: rgba(232, 240, 236, 0.65);
  font-size: 0.9rem;
}

/* ─────────────────────────────────────────
   TABLET  ≥ 640px
───────────────────────────────────────── */
@media (min-width: 640px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

/* ─────────────────────────────────────────
   DESKTOP  ≥ 1024px
───────────────────────────────────────── */
@media (min-width: 1024px) {
  .site-footer {
    padding: 48px 32px 72px;
    margin-top: 64px;
  }

  .footer-brand {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 20px;
    align-items: center;
  }

  .footer-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .footer-cta {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

@media (max-width: 639px) {
  .footer-brand {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-logo {
    width: 52px;
    height: 52px;
  }

  .footer-cta {
    gap: 12px;
  }

  .footer-cta .btn {
    width: 100%;
  }
}
</style>
