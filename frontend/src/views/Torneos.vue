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

    <!-- Torneo Principal Destacado -->
    <section class="torneo-destacado">
      <div class="torneo-destacado-card">
        <div class="torneo-ribbon">El más antiguo</div>
        <div class="torneo-destacado-content">
          <div class="torneo-numero-grande">XXXII</div>
          <h2>Torneo de Feria de Andújar 2025</h2>
          <p class="torneo-descripcion">El torneo tenístico con más solera de la ciudad. Categoría individual absoluta que se celebra desde hace más de 30 años coincidiendo con las fiestas de la Virgen de la Cabeza.</p>
          <div class="torneo-detalles">
            <div class="detalle-item">
              <strong>📅 Fechas:</strong> 28 de agosto - 22 de septiembre
            </div>
            <div class="detalle-item">
              <strong>🎾 Categoría:</strong> Individual absoluta
            </div>
            <div class="detalle-item">
              <strong>🏆 Puntuable:</strong> Ranking del club
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Grid de Torneos -->
    <section class="torneos-grid-section">
      <div class="section-header">
        <h2>Calendario de Torneos</h2>
        <p class="section-subtitle">Todos los torneos organizados por el club durante la temporada</p>
      </div>

      <div class="torneos-grid">
        <!-- Liga Municipal -->
        <div class="torneo-card featured">
          <div class="torneo-header">
            <span class="torneo-numero">XXI</span>
            <span class="torneo-badge">En curso</span>
          </div>
          <h3>Liga Municipal "Ciudad de Andújar"</h3>
          <p>La competición estrella del club. 5 divisiones de juego para mayores de 16 años. Un partido cada semana durante toda la temporada.</p>
          <div class="torneo-info">
            <div class="info-row">
              <span class="info-icon">👥</span>
              <span>5 divisiones</span>
            </div>
            <div class="info-row">
              <span class="info-icon">📊</span>
              <span>Sistema de clasificación</span>
            </div>
            <div class="info-row">
              <span class="info-icon">🏆</span>
              <span>Trofeos para los 3 primeros</span>
            </div>
          </div>
          <router-link to="/liga" class="btn btn-secondary">Ver clasificación</router-link>
        </div>

        <!-- Memorial Manuel Solas -->
        <div class="torneo-card">
          <div class="torneo-header">
            <span class="torneo-numero">VIII</span>
          </div>
          <h3>Memorial Manuel Solas</h3>
          <p>Torneo nocturno de dobles en homenaje a nuestro compañero Manuel Solas. Una noche mágica de tenis que se prolonga hasta la madrugada.</p>
          <div class="torneo-info">
            <div class="info-row">
              <span class="info-icon">🌙</span>
              <span>Modalidad nocturna</span>
            </div>
            <div class="info-row">
              <span class="info-icon">👥</span>
              <span>Dobles mixtos</span>
            </div>
            <div class="info-row">
              <span class="info-icon">🎾</span>
              <span>Formato liguilla</span>
            </div>
          </div>
        </div>

        <!-- Torneo 16 Puntos -->
        <div class="torneo-card">
          <div class="torneo-header">
            <span class="torneo-numero">VIII</span>
          </div>
          <h3>Torneo Social 16 Puntos</h3>
          <p>Torneo rápido y emocionante. Modalidad de juego a 16 puntos sin descanso que arranca la temporada. Sólo para socios del club.</p>
          <div class="torneo-info">
            <div class="info-row">
              <span class="info-icon">⚡</span>
              <span>Juego rápido</span>
            </div>
            <div class="info-row">
              <span class="info-icon">🎯</span>
              <span>16 puntos sin stop</span>
            </div>
            <div class="info-row">
              <span class="info-icon">📊</span>
              <span>Puntuable ranking</span>
            </div>
          </div>
        </div>

        <!-- Arques & Torres -->
        <div class="torneo-card">
          <div class="torneo-header">
            <span class="torneo-numero">XI</span>
            <span class="torneo-badge sponsor">Patrocinado</span>
          </div>
          <h3>Torneo Arques & Torres Asesores</h3>
          <p>Torneo patrocinado con gran participación. Competición de alto nivel técnico abierta a todos los jugadores federados.</p>
          <div class="torneo-info">
            <div class="info-row">
              <span class="info-icon">🏆</span>
              <span>Alto nivel</span>
            </div>
            <div class="info-row">
              <span class="info-icon">🎾</span>
              <span>Federados</span>
            </div>
            <div class="info-row">
              <span class="info-icon">💰</span>
              <span>Premios importantes</span>
            </div>
          </div>
        </div>

        <!-- Liga Escuela -->
        <div class="torneo-card">
          <div class="torneo-header">
            <span class="torneo-numero">III</span>
          </div>
          <h3>Liga Escuela Municipal</h3>
          <p>Competición para alumnos de la escuela municipal. Dos grupos de clasificación según nivel para fomentar el espíritu deportivo.</p>
          <div class="torneo-info">
            <div class="info-row">
              <span class="info-icon">👦</span>
              <span>Categorías infantiles</span>
            </div>
            <div class="info-row">
              <span class="info-icon">📚</span>
              <span>Formativo</span>
            </div>
            <div class="info-row">
              <span class="info-icon">🎯</span>
              <span>2 grupos</span>
            </div>
          </div>
        </div>

        <!-- Mix-ins Dobles -->
        <div class="torneo-card">
          <div class="torneo-header">
            <span class="torneo-numero">XIV</span>
          </div>
          <h3>Torneo Mix-ins de Dobles</h3>
          <p>Jornada de convivencia entre socios. Más de 30 partidos de dobles en formato liguilla con arroz y buen ambiente tenístico.</p>
          <div class="torneo-info">
            <div class="info-row">
              <span class="info-icon">🎉</span>
              <span>Social</span>
            </div>
            <div class="info-row">
              <span class="info-icon">👥</span>
              <span>Dobles variados</span>
            </div>
            <div class="info-row">
              <span class="info-icon">🍚</span>
              <span>Incluye comida</span>
            </div>
          </div>
        </div>

        <!-- Copa Master -->
        <div class="torneo-card">
          <div class="torneo-header">
            <span class="torneo-numero">V</span>
            <span class="torneo-badge final">Final temporada</span>
          </div>
          <h3>Copa Master</h3>
          <p>Torneo de maestros que cierra la temporada. Los 8 mejores del ranking anual se enfrentan por el título de maestro del club.</p>
          <div class="torneo-info">
            <div class="info-row">
              <span class="info-icon">👑</span>
              <span>Top 8 del ranking</span>
            </div>
            <div class="info-row">
              <span class="info-icon">🏆</span>
              <span>Gran finalísima</span>
            </div>
            <div class="info-row">
              <span class="info-icon">⭐</span>
              <span>Máximo nivel</span>
            </div>
          </div>
        </div>

        <!-- Torneo Cantera -->
        <div class="torneo-card">
          <div class="torneo-header">
            <span class="torneo-numero">VI</span>
          </div>
          <h3>Torneo de Tenis Cantera</h3>
          <p>Torneo para jugadores de la escuela municipal de tenis. Diferentes categorías desde mini-tenis hasta juvenil. Trofeos para todos los participantes.</p>
          <div class="torneo-info">
            <div class="info-row">
              <span class="info-icon">🌟</span>
              <span>Categorías base</span>
            </div>
            <div class="info-row">
              <span class="info-icon">🎁</span>
              <span>Todos premiados</span>
            </div>
            <div class="info-row">
              <span class="info-icon">📸</span>
              <span>Gran ambiente</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Concentraciones y Eventos Especiales -->
    <section class="eventos-section">
      <div class="section-header">
        <h2>Eventos Especiales</h2>
        <p class="section-subtitle">Concentraciones, clinics y jornadas especiales</p>
      </div>

      <div class="eventos-grid">
        <div class="evento-card">
          <div class="evento-icon">🎪</div>
          <h3>Concentraciones de Escuela</h3>
          <p>Concentraciones periódicas para alumnos de la escuela municipal. Formato liguilla por grupos según niveles de juego. Fomentamos la participación y deportividad.</p>
        </div>

        <div class="evento-card">
          <div class="evento-icon">🎾</div>
          <h3>Open Isturgi Club</h3>
          <p>Torneo del Circuito Andalucía Tenis Tour. Jugadores de toda Andalucía compiten en nuestras instalaciones. 4 categorías diferentes.</p>
        </div>

        <div class="evento-card">
          <div class="evento-icon">🏃</div>
          <h3>Clinics y Masterclass</h3>
          <p>Sesiones especiales con entrenadores profesionales. Perfeccionamiento técnico y táctico para socios del club.</p>
        </div>
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
  </div>
</template>

<script setup>
// No se necesita lógica específica
</script>

<style scoped>
.torneos-page {
  width: 100%;
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

.torneo-ribbon {
  position: absolute;
  top: 20px;
  right: -40px;
  background: var(--ball);
  color: var(--ink);
  padding: 8px 60px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  transform: rotate(45deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.torneo-numero-grande {
  font-size: 5rem;
  font-weight: 900;
  color: var(--ball);
  text-shadow: 0 0 30px rgba(199, 255, 52, 0.4);
  font-family: 'Georgia', serif;
  margin-bottom: 16px;
}

.torneo-destacado-card h2 {
  font-size: 2.5rem;
  font-weight: 900;
  color: #fff;
  margin: 0 0 20px;
  letter-spacing: -0.5px;
}

.torneo-descripcion {
  font-size: 1.1rem;
  color: rgba(234, 242, 239, 0.85);
  line-height: 1.7;
  margin: 0 0 32px;
}

.torneo-detalles {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detalle-item {
  background: rgba(9, 13, 15, 0.5);
  padding: 12px 20px;
  border-radius: 10px;
  border-left: 3px solid var(--ball);
  color: rgba(234, 242, 239, 0.85);
  font-size: 1rem;
}

.detalle-item strong {
  color: var(--ball);
  margin-right: 8px;
}

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
  border-radius: 16px;
  padding: 32px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.torneo-card.featured {
  background: linear-gradient(135deg, rgba(199, 255, 52, 0.1), rgba(15, 45, 35, 0.25));
  border-color: rgba(199, 255, 52, 0.3);
}

.torneo-card:hover {
  transform: translateY(-8px);
  border-color: rgba(199, 255, 52, 0.4);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
}

.torneo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.torneo-numero {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--ball);
  text-shadow: 0 0 20px rgba(199, 255, 52, 0.3);
  font-family: 'Georgia', serif;
}

.torneo-badge {
  background: rgba(199, 255, 52, 0.2);
  color: var(--ball);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 1px solid rgba(199, 255, 52, 0.4);
}

.torneo-badge.sponsor {
  background: rgba(201, 106, 58, 0.2);
  color: rgba(201, 106, 58, 1);
  border-color: rgba(201, 106, 58, 0.4);
}

.torneo-badge.final {
  background: rgba(255, 215, 0, 0.2);
  color: rgba(255, 215, 0, 1);
  border-color: rgba(255, 215, 0, 0.4);
}

.torneo-card h3 {
  font-size: 1.4rem;
  color: #fff;
  margin: 0;
  font-weight: 700;
  line-height: 1.3;
}

.torneo-card > p {
  color: rgba(234, 242, 239, 0.8);
  line-height: 1.7;
  margin: 0;
  font-size: 0.95rem;
  flex: 1;
}

.torneo-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(234, 242, 239, 0.75);
  font-size: 0.9rem;
  font-weight: 600;
}

.info-icon {
  font-size: 1.2rem;
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

  .eventos-grid {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .cta-content {
    padding: 40px 28px;
  }

  .cta-content h2 {
    font-size: 2rem;
  }
}
</style>
