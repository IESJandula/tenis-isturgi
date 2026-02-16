<template>
  <footer class="site-footer">
    <div class="footer-wrap">
      <div class="footer-brand glass-card">
        <img src="/logo-isturgi.jpg" alt="Logo Club Tenis Isturgi" class="footer-logo" />
        <div>
          <p class="footer-name headline">Isturgi</p>
          <p class="footer-sub">Club de Tenis · Andujar</p>
          <p class="footer-copy">
            Pistas de tierra batida, escuela para todas las edades y competiciones con
            ambiente de club.
          </p>
        </div>
      </div>

      <div class="footer-grid">
        <div class="footer-card">
          <h3>Horarios</h3>
          <ul>
            <li>Lunes - Viernes: 09:00 - 22:00</li>
            <li>Sabado: 09:00 - 20:00</li>
            <li>Domingo: 10:00 - 14:00</li>
          </ul>
        </div>
        <div class="footer-card">
          <h3>Contacto</h3>
          <ul>
            <li>Av. de la Dehesa, Andujar</li>
            <li>+34 000 000 000</li>
            <li>club@isturgi.es</li>
          </ul>
        </div>
        <div class="footer-card">
          <h3>Acceso rapido</h3>
          <ul>
            <li><router-link to="/contacto">Reserva pista</router-link></li>
            <li><router-link to="/galeria">Galeria</router-link></li>
            <li><router-link to="/liga">Liga</router-link></li>
          </ul>
        </div>
      </div>

      <div class="footer-cta">
        <div>
          <h3>¿Quieres jugar esta semana?</h3>
          <p>Reserva pista o unete a la escuela para mejorar tu nivel.</p>
        </div>
        <router-link to="/contacto" class="btn btn-primary">Reservar ahora</router-link>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: 60px;
  padding: 40px 20px 60px;
  background:
    radial-gradient(800px 400px at 15% -10%, rgba(199, 255, 52, 0.14), transparent 60%),
    linear-gradient(160deg, rgba(8, 15, 18, 0.98), rgba(8, 12, 14, 0.92));
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-wrap {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 24px;
}

.footer-brand {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 18px;
  padding: 20px;
  align-items: center;
}

.footer-logo {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 2px solid rgba(199, 255, 52, 0.5);
  object-fit: cover;
  background: rgba(8, 12, 14, 0.7);
}

.footer-name {
  margin: 0;
  font-size: 1.8rem;
  color: var(--ball);
}

.footer-sub {
  margin: 0 0 8px;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 1.2px;
  color: rgba(234, 242, 239, 0.7);
}

.footer-copy {
  margin: 0;
  color: rgba(234, 242, 239, 0.7);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.footer-card {
  background: rgba(9, 13, 15, 0.72);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 18px;
}

.footer-card h3 {
  margin: 0 0 10px;
  font-size: 1rem;
}

.footer-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
  color: rgba(234, 242, 239, 0.7);
  font-size: 0.9rem;
}

.footer-card a {
  color: inherit;
}

.footer-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(100deg, rgba(199, 255, 52, 0.16), rgba(201, 106, 58, 0.16));
}

.footer-cta h3 {
  margin: 0 0 6px;
}

.footer-cta p {
  margin: 0;
  color: rgba(234, 242, 239, 0.7);
}

@media (max-width: 900px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
  .footer-cta {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 600px) {
  .footer-brand {
    grid-template-columns: 1fr;
    text-align: left;
  }
}
</style>
