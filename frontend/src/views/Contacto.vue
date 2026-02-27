<template>
  <div class="contacto-page fade-in">
    <!-- Hero Contacto -->
    <section class="contacto-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="mini-tag">Estamos aquí</span>
        <h1>Contacto</h1>
        <p class="hero-lead">¿Tienes alguna duda? ¿Quieres apuntarte a la escuela o formar parte del club? Contáctanos y te ayudaremos encantados.</p>
      </div>
    </section>

    <!-- Contacto Principal -->
    <section class="contacto-principal">
      <div class="contacto-grid">
        <!-- Información de Contacto -->
        <div class="contacto-info">
          <h2>Información de Contacto</h2>
          <p class="contacto-descripcion">Puedes contactarnos a través de cualquiera de estos medios. Te responderemos lo antes posible.</p>

          <div class="contacto-items">
            <div class="contacto-item">
              <div class="item-icon">📍</div>
              <div class="item-content">
                <h4>Ubicación</h4>
                <p>Pistas Municipales de Andújar<br/>Andújar, Jaén<br/>España</p>
              </div>
            </div>

            <div class="contacto-item">
              <div class="item-icon">✉️</div>
              <div class="item-content">
                <h4>Email</h4>
                <a href="mailto:info@clubtenisisturgi.com">info@clubtenisisturgi.com</a>
                <p class="item-note">Respuesta en menos de 24 horas</p>
              </div>
            </div>

            <div class="contacto-item">
              <div class="item-icon">📞</div>
              <div class="item-content">
                <h4>Teléfono</h4>
                <p>Disponible en horario de pistas</p>
                <p class="item-note">Consultar horarios</p>
              </div>
            </div>

            <div class="contacto-item">
              <div class="item-icon">🌐</div>
              <div class="item-content">
                <h4>Web Oficial</h4>
                <a href="https://clubtenisisturgi.jimdofree.com/" target="_blank" rel="noopener">clubtenisisturgi.jimdofree.com</a>
                <p class="item-note">Más información y noticias</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulario de Contacto -->
        <div class="contacto-form-container">
          <div class="form-card">
            <h3>Envíanos un mensaje</h3>
            <p class="form-subtitle">Completa el formulario y nos pondremos en contacto contigo</p>

            <form class="contacto-form" @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="nombre">Nombre completo *</label>
                <input 
                  type="text" 
                  id="nombre" 
                  v-model="formData.nombre" 
                  required 
                  placeholder="Tu nombre"
                />
              </div>

              <div class="form-group">
                <label for="email">Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="formData.email" 
                  required 
                  placeholder="tu@email.com"
                />
              </div>

              <div class="form-group">
                <label for="telefono">Teléfono</label>
                <input 
                  type="tel" 
                  id="telefono" 
                  v-model="formData.telefono" 
                  placeholder="Tu teléfono (opcional)"
                />
              </div>

              <div class="form-group">
                <label for="asunto">Asunto *</label>
                <select id="asunto" v-model="formData.asunto" required>
                  <option value="">Selecciona un asunto</option>
                  <option value="escuela">Escuela Municipal de Tenis</option>
                  <option value="socio">Hacerse socio del club</option>
                  <option value="torneos">Información sobre torneos</option>
                  <option value="alquiler">Alquiler de pistas</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div class="form-group">
                <label for="mensaje">Mensaje *</label>
                <textarea 
                  id="mensaje" 
                  v-model="formData.mensaje" 
                  rows="6" 
                  required 
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
              </div>

              <button type="submit" class="btn btn-primary btn-block" :disabled="isSubmitting">
                {{ isSubmitting ? 'Enviando...' : 'Enviar mensaje' }}
              </button>

              <p v-if="submitMessage" class="submit-message" :class="{ success: submitSuccess, error: !submitSuccess }">
                {{ submitMessage }}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Horarios -->
    <section class="horarios-section">
      <div class="horarios-content">
        <h2>Horarios de las Pistas</h2>
        <p class="section-subtitle">Consulta los horarios para jugar, entrenamientos y competiciones</p>

        <div class="horarios-grid">
          <div class="horario-card">
            <div class="horario-icon">☀️</div>
            <h4>Temporada de Verano</h4>
            <p class="horario-periodo">Junio - Septiembre</p>
            <div class="horario-detalles">
              <div class="horario-detalle">
                <strong>Mañanas:</strong> 9:00 - 14:00h
              </div>
              <div class="horario-detalle">
                <strong>Tardes:</strong> 19:00 - 23:00h
              </div>
            </div>
          </div>

          <div class="horario-card">
            <div class="horario-icon">🍂</div>
            <h4>Temporada de Invierno</h4>
            <p class="horario-periodo">Octubre - Mayo</p>
            <div class="horario-detalles">
              <div class="horario-detalle">
                <strong>Mañanas:</strong> 10:00 - 14:00h
              </div>
              <div class="horario-detalle">
                <strong>Tardes:</strong> 16:00 - 22:00h
              </div>
            </div>
          </div>

          <div class="horario-card">
            <div class="horario-icon">🎾</div>
            <h4>Escuela Municipal</h4>
            <p class="horario-periodo">Todo el año</p>
            <div class="horario-detalles">
              <div class="horario-detalle">
                <strong>Lunes a Viernes:</strong> 17:00 - 21:00h
              </div>
              <div class="horario-detalle">
                <strong>Sábados:</strong> 10:00 - 14:00h
              </div>
            </div>
          </div>
        </div>

        <p class="horarios-nota">* Los horarios pueden variar en días festivos o durante torneos. Consulta disponibilidad.</p>
      </div>
    </section>

    <!-- Cómo llegar -->
    <section class="como-llegar-section">
      <div class="como-llegar-content">
        <h2>Cómo Llegar</h2>
        <p class="section-subtitle">Las pistas se encuentran en el centro de Andújar, de fácil acceso</p>

        <div class="llegar-grid">
          <div class="llegar-info">
            <div class="llegar-item">
              <div class="llegar-icon">🚗</div>
              <div>
                <h4>En Coche</h4>
                <p>Parking disponible en las inmediaciones. Zona de aparcamiento municipal gratuito a menos de 50 metros de las pistas.</p>
              </div>
            </div>

            <div class="llegar-item">
              <div class="llegar-icon">🚶</div>
              <div>
                <h4>A Pie</h4>
                <p>Situadas en el centro de Andújar, a pocos minutos andando desde el paseo principal y la plaza de España.</p>
              </div>
            </div>

            <div class="llegar-item">
              <div class="llegar-icon">📍</div>
              <div>
                <h4>Dirección</h4>
                <p><strong>Pistas Municipales de Andújar</strong><br/>
                Andújar, Jaén<br/>
                Andalucía, España</p>
              </div>
            </div>
          </div>

          <div class="mapa-placeholder">
            <div class="mapa-overlay">
              <div class="mapa-icon">🗺️</div>
              <p>Pistas Municipales de Tenis</p>
              <p class="mapa-ubicacion">Andújar, Jaén</p>
              <a href="https://www.google.com/maps/search/pistas+tenis+andujar+jaen" target="_blank" rel="noopener" class="btn btn-secondary">
                Ver en Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq-section">
      <div class="faq-content">
        <h2>Preguntas Frecuentes</h2>
        
        <div class="faq-grid">
          <div class="faq-item">
            <h4>¿Cómo me hago socio del club?</h4>
            <p>Para hacerte socio, ponte en contacto con nosotros a través del email o presencialmente en las pistas. Te informaremos sobre las cuotas y el proceso de inscripción.</p>
          </div>

          <div class="faq-item">
            <h4>¿Puedo alquilar pistas si no soy socio?</h4>
            <p>Sí, las pistas están abiertas al público en general. Los socios tienen prioridad en la reserva y tarifas especiales.</p>
          </div>

          <div class="faq-item">
            <h4>¿Cuándo empiezan las inscripciones para la escuela?</h4>
            <p>Las inscripciones para la escuela municipal suelen abrirse en septiembre para la temporada 2025/26. Consulta la sección de Escuela para más información.</p>
          </div>

          <div class="faq-item">
            <h4>¿Qué necesito para participar en los torneos?</h4>
            <p>Para la mayoría de torneos del club solo necesitas ser socio. Algunos torneos federados requieren licencia FAT/RFET.</p>
          </div>

          <div class="faq-item">
            <h4>¿Hay material disponible para alquilar?</h4>
            <p>Sí, disponemos de raquetas para préstamo y pelotas para la venta. Consulta disponibilidad en las pistas.</p>
          </div>

          <div class="faq-item">
            <h4>¿Organizáis eventos privados?</h4>
            <p>Sí, podemos organizar eventos, clinics y torneos privados. Contacta con nosotros para más información sobre disponibilidad y tarifas.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>¿Hablamos?</h2>
        <p>Estamos aquí para ayudarte. Cualquier duda o consulta, no dudes en contactarnos.</p>
        <a href="mailto:info@clubtenisisturgi.com" class="btn btn-primary btn-large">Escríbenos un email</a>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

// Form data
const formData = reactive({
  nombre: '',
  email: '',
  telefono: '',
  asunto: '',
  mensaje: ''
});

const isSubmitting = ref(false);
const submitMessage = ref('');
const submitSuccess = ref(false);

const handleSubmit = () => {
  isSubmitting.value = true;
  submitMessage.value = '';

  // Simulación de envío (en producción esto haría una llamada al backend)
  setTimeout(() => {
    isSubmitting.value = false;
    submitSuccess.value = true;
    submitMessage.value = '¡Mensaje enviado correctamente! Te responderemos pronto.';

    // Reset form
    Object.keys(formData).forEach(key => formData[key] = '');

    // Clear message after 5 seconds
    setTimeout(() => {
      submitMessage.value = '';
    }, 5000);
  }, 1500);
};
</script>

<style scoped>
.contacto-page {
  width: 100%;
}

/* Hero Contacto */
.contacto-hero {
  position: relative;
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(135deg, rgba(8, 15, 18, 0.9), rgba(15, 45, 35, 0.85)),
    url("https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?q=80&w=2400&auto=format&fit=crop") center/cover no-repeat;
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
  max-width: 800px;
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
}

.hero-lead {
  font-size: 1.2rem;
  color: rgba(234, 242, 239, 0.9);
  line-height: 1.7;
  margin: 0;
}

/* Contacto Principal */
.contacto-principal {
  padding: 0 20px 60px;
}

.contacto-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Información de Contacto */
.contacto-info h2 {
  font-size: 2.5rem;
  font-weight: 900;
  color: #fff;
  margin: 0 0 16px;
  letter-spacing: -0.5px;
}

.contacto-descripcion {
  color: rgba(234, 242, 239, 0.8);
  line-height: 1.7;
  margin: 0 0 32px;
  font-size: 1.1rem;
}

.contacto-items {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contacto-item {
  display: flex;
  gap: 20px;
  background: rgba(9, 13, 15, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
}

.contacto-item:hover {
  border-color: rgba(199, 255, 52, 0.3);
  transform: translateX(8px);
}

.item-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 4px 12px rgba(199, 255, 52, 0.3));
}

.item-content {
  flex: 1;
}

.item-content h4 {
  font-size: 1.2rem;
  color: var(--ball);
  margin: 0 0 8px;
  font-weight: 700;
}

.item-content p {
  color: rgba(234, 242, 239, 0.85);
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
}

.item-content a {
  color: rgba(234, 242, 239, 0.95);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
  display: inline-block;
  margin-bottom: 4px;
}

.item-content a:hover {
  color: var(--ball);
}

.item-note {
  font-size: 0.85rem !important;
  color: rgba(234, 242, 239, 0.6) !important;
  margin-top: 4px !important;
}

/* Formulario */
.form-card {
  background: rgba(9, 13, 15, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 40px;
}

.form-card h3 {
  font-size: 2rem;
  color: #fff;
  margin: 0 0 12px;
  font-weight: 800;
}

.form-subtitle {
  color: rgba(234, 242, 239, 0.7);
  margin: 0 0 32px;
  font-size: 0.95rem;
}

.contacto-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: rgba(234, 242, 239, 0.9);
  font-weight: 600;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  background: rgba(9, 13, 15, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #fff;
  padding: 14px 18px;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--ball);
  box-shadow: 0 0 0 3px rgba(199, 255, 52, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.btn-block {
  width: 100%;
  justify-content: center;
}

.submit-message {
  padding: 12px 20px;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  margin: 0;
}

.submit-message.success {
  background: rgba(199, 255, 52, 0.2);
  color: var(--ball);
  border: 1px solid rgba(199, 255, 52, 0.3);
}

.submit-message.error {
  background: rgba(255, 82, 82, 0.2);
  color: rgba(255, 82, 82, 1);
  border: 1px solid rgba(255, 82, 82, 0.3);
}

/* Horarios */
.horarios-section {
  padding: 60px 20px;
  background: rgba(9, 13, 15, 0.2);
}

.horarios-content {
  max-width: 1200px;
  margin: 0 auto;
}

.horarios-content h2 {
  font-size: 2.5rem;
  font-weight: 900;
  color: #fff;
  margin: 0 0 12px;
  text-align: center;
  letter-spacing: -0.5px;
}

.section-subtitle {
  text-align: center;
  color: rgba(234, 242, 239, 0.7);
  margin: 0 0 40px;
  font-size: 1.1rem;
}

.horarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 28px;
  margin-bottom: 32px;
}

.horario-card {
  background: rgba(9, 13, 15, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  transition: all 0.3s ease;
}

.horario-card:hover {
  transform: translateY(-6px);
  border-color: rgba(199, 255, 52, 0.3);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
}

.horario-icon {
  font-size: 3.5rem;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 16px rgba(199, 255, 52, 0.3));
}

.horario-card h4 {
  font-size: 1.4rem;
  color: #fff;
  margin: 0 0 8px;
  font-weight: 700;
}

.horario-periodo {
  color: var(--ball);
  font-weight: 600;
  margin: 0 0 20px;
  font-size: 0.9rem;
}

.horario-detalles {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.horario-detalle {
  background: rgba(9, 13, 15, 0.5);
  padding: 12px 16px;
  border-radius: 8px;
  color: rgba(234, 242, 239, 0.85);
  font-size: 0.95rem;
  text-align: left;
}

.horario-detalle strong {
  color: rgba(234, 242, 239, 1);
}

.horarios-nota {
  text-align: center;
  color: rgba(234, 242, 239, 0.6);
  font-size: 0.9rem;
  font-style: italic;
  margin: 0;
}

/* Cómo llegar */
.como-llegar-section {
  padding: 60px 20px;
}

.como-llegar-content {
  max-width: 1200px;
  margin: 0 auto;
}

.como-llegar-content h2 {
  font-size: 2.5rem;
  font-weight: 900;
  color: #fff;
  margin: 0 0 12px;
  text-align: center;
  letter-spacing: -0.5px;
}

.llegar-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 40px;
}

.llegar-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.llegar-item {
  display: flex;
  gap: 20px;
  background: rgba(9, 13, 15, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 24px;
}

.llegar-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 4px 12px rgba(199, 255, 52, 0.3));
}

.llegar-item h4 {
  color: var(--ball);
  margin: 0 0 8px;
  font-weight: 700;
  font-size: 1.2rem;
}

.llegar-item p {
  color: rgba(234, 242, 239, 0.85);
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
}

.mapa-placeholder {
  background:
    linear-gradient(135deg, rgba(9, 13, 15, 0.8), rgba(15, 45, 35, 0.7)),
    url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop") center/cover no-repeat;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.mapa-overlay {
  text-align: center;
  padding: 40px;
  background: rgba(9, 13, 15, 0.8);
  border-radius: 16px;
  border: 1px solid rgba(199, 255, 52, 0.2);
}

.mapa-icon {
  font-size: 4rem;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 20px rgba(199, 255, 52, 0.4));
}

.mapa-overlay p {
  color: #fff;
  font-weight: 700;
  font-size: 1.3rem;
  margin: 0 0 8px;
}

.mapa-ubicacion {
  color: var(--ball) !important;
  font-size: 1.1rem !important;
  margin-bottom: 24px !important;
}

/* FAQ */
.faq-section {
  padding: 60px 20px;
  background: rgba(9, 13, 15, 0.2);
}

.faq-content {
  max-width: 1000px;
  margin: 0 auto;
}

.faq-content h2 {
  font-size: 2.5rem;
  font-weight: 900;
  color: #fff;
  margin: 0 0 40px;
  text-align: center;
  letter-spacing: -0.5px;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.faq-item {
  background: rgba(9, 13, 15, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
}

.faq-item:hover {
  border-color: rgba(199, 255, 52, 0.3);
  transform: translateY(-4px);
}

.faq-item h4 {
  color: var(--ball);
  margin: 0 0 12px;
  font-weight: 700;
  font-size: 1.1rem;
}

.faq-item p {
  color: rgba(234, 242, 239, 0.8);
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
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
@media (max-width: 992px) {
  .contacto-grid {
    grid-template-columns: 1fr;
  }

  .llegar-grid {
    grid-template-columns: 1fr;
  }

  .mapa-placeholder {
    min-height: 300px;
  }
}

@media (max-width: 768px) {
  .contacto-hero {
    min-height: 300px;
  }

  .hero-content h1 {
    font-size: 2rem;
  }

  .hero-lead {
    font-size: 1rem;
  }

  .contacto-info h2,
  .horarios-content h2,
  .como-llegar-content h2,
  .faq-content h2 {
    font-size: 2rem;
  }

  .form-card {
    padding: 28px 20px;
  }

  .form-card h3 {
    font-size: 1.6rem;
  }

  .horarios-grid {
    grid-template-columns: 1fr;
  }

  .faq-grid {
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
