<template>
  <div class="contacto-page fade-in">
    <!-- Hero Contacto -->
    <section class="contacto-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="mini-tag">Estamos aquÃ­</span>
        <h1>Contacto</h1>
        <p class="hero-lead">Â¿Tienes alguna duda? Â¿Quieres apuntarte a la escuela o formar parte del club? ContÃ¡ctanos y te ayudaremos encantados.</p>
      </div>
    </section>

    <!-- Contacto Principal -->
    <section class="contacto-principal">
      <div class="contacto-grid">
        <!-- InformaciÃ³n de Contacto -->
        <div class="contacto-info">
          <h2>InformaciÃ³n de Contacto</h2>
          <p class="contacto-descripcion">Puedes contactarnos a travÃ©s de cualquiera de estos medios. Te responderemos lo antes posible.</p>

          <div class="contacto-items">
            <div class="contacto-item">
              <div class="item-icon">ðŸ“</div>
              <div class="item-content">
                <h4>UbicaciÃ³n</h4>
                <p>C. Egido del Puente, s/n<br/>23740 AndÃºjar, JaÃ©n<br/>EspaÃ±a</p>
              </div>
            </div>

            <div class="contacto-item">
              <div class="item-icon">âœ‰ï¸</div>
              <div class="item-content">
                <h4>Email</h4>
                <a href="mailto:tenisturgi@gmail.com">tenisturgi@gmail.com</a>
                <p class="item-note">Respuesta en menos de 24 horas</p>
              </div>
            </div>

            <div class="contacto-item">
              <div class="item-icon">ðŸ“ž</div>
              <div class="item-content">
                <h4>TelÃ©fono</h4>
                <a href="tel:+34697827244">+34 697 827 244</a>
                <p class="item-note">Carlos MartÃ­nez</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulario de Contacto -->
        <div class="contacto-form-container">
          <div class="form-card">
            <h3>EnvÃ­anos un mensaje</h3>
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
                <label for="telefono">TelÃ©fono</label>
                <input 
                  type="tel" 
                  id="telefono" 
                  v-model="formData.telefono" 
                  placeholder="Tu telÃ©fono (opcional)"
                />
              </div>

              <div class="form-group">
                <label for="asunto">Asunto *</label>
                <select id="asunto" v-model="formData.asunto" required>
                  <option value="">Selecciona un asunto</option>
                  <option value="escuela">Escuela Municipal de Tenis</option>
                  <option value="socio">Hacerse socio del club</option>
                  <option value="torneos">InformaciÃ³n sobre torneos</option>
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
                  placeholder="Escribe tu mensaje aquÃ­..."
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
            <div class="horario-icon">â˜€ï¸</div>
            <div class="horario-card-body">
              <h4>Temporada de Verano</h4>
              <p class="horario-periodo">Junio - Septiembre</p>
              <div class="horario-detalles">
                <div class="horario-detalle">8:00 - 22:00h</div>
              </div>
            </div>
          </div>

          <div class="horario-card">
            <div class="horario-icon">ðŸ‚</div>
            <div class="horario-card-body">
              <h4>Temporada de Invierno</h4>
              <p class="horario-periodo">Octubre - Mayo</p>
              <div class="horario-detalles">
                <div class="horario-detalle">09:00 - 22:00h</div>
              </div>
            </div>
          </div>

          <div class="horario-card">
            <div class="horario-icon">ðŸŽ¾</div>
            <div class="horario-card-body">
              <h4>Escuela Municipal</h4>
              <p class="horario-periodo">Todo el aÃ±o</p>
              <div class="horario-detalles">
                <div class="horario-detalle"><strong>Lunes a Viernes:</strong> 16:00 - 22:00h</div>
              </div>
            </div>
          </div>
        </div>

        <p class="horarios-nota">* Los horarios pueden variar en dÃ­as festivos o durante torneos. Consulta disponibilidad.</p>
      </div>
    </section>

    <!-- CÃ³mo llegar -->
    <section class="como-llegar-section">
      <div class="como-llegar-content">
        <h2>CÃ³mo Llegar</h2>

        <div class="llegar-grid">
          <div class="llegar-info">
            
            <div class="llegar-item">
              <div class="llegar-icon">ðŸ“</div>
              <div>
                <h4>DirecciÃ³n</h4>
                <p><strong>C. Egido del Puente, s/n</strong><br/>
                23740 AndÃºjar, JaÃ©n<br/>
                AndalucÃ­a, EspaÃ±a</p>
              </div>
            </div>
          </div>

          <div class="mapa-placeholder">
            <div class="mapa-overlay">
              <div class="mapa-icon">ðŸ—ºï¸</div>
              <p>Pistas Municipales de Tenis</p>
              <p class="mapa-ubicacion">C. Egido del Puente, s/n, 23740 AndÃºjar, JaÃ©n</p>
              <a href="https://www.google.com/maps/search/C.+Egido+del+Puente,+s%2Fn,+23740+And%C3%BAjar,+Ja%C3%A9n" target="_blank" rel="noopener" class="btn btn-secondary">
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
            <h4>Â¿CÃ³mo me hago socio del club?</h4>
            <p>Para hacerte socio, ponte en contacto con nosotros a travÃ©s del email o presencialmente en las pistas. Te informaremos sobre las cuotas y el proceso de inscripciÃ³n.</p>
          </div>

          <div class="faq-item">
            <h4>Â¿Puedo alquilar pistas si no soy socio?</h4>
            <p>SÃ­, las pistas estÃ¡n abiertas al pÃºblico en general.</p>
          </div>

          <div class="faq-item">
            <h4>Â¿CuÃ¡ndo empiezan las inscripciones para la escuela?</h4>
            <p>Las inscripciones para la escuela municipal suelen abrirse en septiembre. Consulta la secciÃ³n de Escuela para mÃ¡s informaciÃ³n.</p>
          </div>

          <div class="faq-item">
            <h4>Â¿QuÃ© necesito para participar en los torneos?</h4>
            <p>Para la mayorÃ­a de torneos del club solo necesitas ser socio. Algunos torneos federados requieren licencia FAT/RFET.</p>
          </div>

          <div class="faq-item">
            <h4>Â¿Hay material disponible para alquilar?</h4>
            <p>SÃ­, disponemos de raquetas para prÃ©stamo y pelotas para la venta. Consulta disponibilidad en las pistas.</p>
          </div>

          <div class="faq-item">
            <h4>Â¿OrganizÃ¡is eventos privados?</h4>
            <p>SÃ­, podemos organizar eventos, clinics y torneos privados. Contacta con nosotros para mÃ¡s informaciÃ³n sobre disponibilidad y tarifas.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>Â¿Hablamos?</h2>
        <p>Estamos aquÃ­ para ayudarte. Cualquier duda o consulta, no dudes en contactarnos.</p>
        <a href="mailto:info@clubtenisisturgi.com" class="btn btn-primary btn-large">EscrÃ­benos un email</a>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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

const handleSubmit = async () => {
  isSubmitting.value = true;
  submitMessage.value = '';
  submitSuccess.value = false;

  try {
    await axios.post(`${apiUrl}/api/contacto`, {
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      asunto: formData.asunto,
      mensaje: formData.mensaje
    });

    submitSuccess.value = true;
    submitMessage.value = 'Â¡Mensaje enviado correctamente! Te responderemos pronto.';

    Object.keys(formData).forEach(key => formData[key] = '');
  } catch (e) {
    console.error(e);
    const msg = e.response?.data?.message || e.response?.data?.error || e.message;
    submitSuccess.value = false;
    submitMessage.value = `No se pudo enviar el mensaje. ${msg || ''}`.trim();
  } finally {
    isSubmitting.value = false;
    setTimeout(() => {
      submitMessage.value = '';
    }, 5000);
  }
};
</script>

<style scoped>
.contacto-page { width: 100%; }

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   HERO  (mobile-first)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
.contacto-hero {
  position: relative;
  min-height: 240px;
  display: flex;
  align-items: flex-end;
  background:
    linear-gradient(to top, rgba(7, 16, 13, 0.97) 0%, rgba(7, 16, 13, 0.5) 55%, rgba(7,16,13,0.3) 100%),
    url("https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?q=80&w=2400&auto=format&fit=crop") center/cover no-repeat;
  border-radius: 0 0 20px 20px;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% 80%, rgba(199, 255, 52, 0.07), transparent 65%);
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 28px 20px 32px;
  width: 100%;
  max-width: 760px;
}

.mini-tag {
  display: inline-block;
  background: rgba(199, 255, 52, 0.14);
  color: var(--ball);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border: 1px solid rgba(199, 255, 52, 0.28);
  margin-bottom: 12px;
}

.hero-content h1 {
  font-family: "Syne", sans-serif;
  font-size: clamp(1.7rem, 5.5vw, 3.2rem);
  font-weight: 800;
  color: #fff;
  margin: 0 0 10px;
  line-height: 1.1;
  letter-spacing: -0.4px;
}

.hero-lead {
  font-size: clamp(0.88rem, 2vw, 1.02rem);
  color: rgba(232, 240, 236, 0.8);
  line-height: 1.65;
  margin: 0;
  max-width: 500px;
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CONTACTO PRINCIPAL  â€” mobile: stack
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
.contacto-principal {
  padding: 32px 16px 48px;
}

.contacto-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
  max-width: 1100px;
  margin: 0 auto;
}

/* Info */
.contacto-info h2 {
  font-family: "Syne", sans-serif;
  font-size: clamp(1.4rem, 3.5vw, 2rem);
  font-weight: 800;
  color: #fff;
  margin: 0 0 10px;
  letter-spacing: -0.3px;
}

.contacto-descripcion {
  color: var(--text-muted);
  line-height: 1.65;
  margin: 0 0 24px;
  font-size: 0.95rem;
}

.contacto-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contacto-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  background: rgba(9, 18, 14, 0.6);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-md);
  padding: 18px 20px;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.contacto-item:hover {
  border-color: rgba(199, 255, 52, 0.28);
  transform: translateX(4px);
}

.item-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(199, 255, 52, 0.07);
  border-radius: var(--radius-sm);
}

.item-content { flex: 1; }

.item-content h4 {
  font-family: "Syne", sans-serif;
  font-size: 0.88rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--ball);
  margin: 0 0 5px;
  font-weight: 700;
}

.item-content p {
  color: rgba(232, 240, 236, 0.85);
  line-height: 1.55;
  margin: 0;
  font-size: 0.9rem;
}

.item-content a {
  color: rgba(232, 240, 236, 0.95);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
  display: inline-block;
  margin-bottom: 2px;
  font-size: 0.9rem;
}

.item-content a:hover { color: var(--ball); }

.item-note {
  font-size: 0.8rem !important;
  color: var(--text-muted) !important;
  margin-top: 3px !important;
}

/* Formulario */
.form-card {
  background: rgba(9, 18, 14, 0.6);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: var(--radius-lg);
  padding: 28px 22px;
}

.form-card h3 {
  font-family: "Syne", sans-serif;
  font-size: clamp(1.15rem, 3vw, 1.6rem);
  color: #fff;
  margin: 0 0 6px;
  font-weight: 800;
}

.form-subtitle {
  color: var(--text-muted);
  margin: 0 0 24px;
  font-size: 0.88rem;
}

.contacto-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  color: rgba(232, 240, 236, 0.9);
  font-weight: 600;
  font-size: 0.84rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  background: rgba(7, 16, 13, 0.75);
  border: 1px solid rgba(255,255,255,0.11);
  color: #fff;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.22s ease, box-shadow 0.22s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--ball);
  box-shadow: 0 0 0 3px rgba(199, 255, 52, 0.1);
}

.form-group select option { background: #0a1510; color: #fff; }

.form-group textarea {
  resize: vertical;
  min-height: 110px;
}

.btn-block { width: 100%; justify-content: center; }

.submit-message {
  padding: 10px 18px;
  border-radius: var(--radius-sm);
  text-align: center;
  font-weight: 600;
  font-size: 0.88rem;
  margin: 0;
}

.submit-message.success {
  background: rgba(199, 255, 52, 0.14);
  color: var(--ball);
  border: 1px solid rgba(199, 255, 52, 0.3);
}

.submit-message.error {
  background: rgba(255,82,82,0.14);
  color: rgba(255,100,100,1);
  border: 1px solid rgba(255,82,82,0.3);
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   HORARIOS  â€” 1 col mobile, 3 col tablet
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
.horarios-section {
  padding: 44px 16px;
  background: rgba(7, 16, 13, 0.35);
}

.horarios-content {
  max-width: 920px;
  margin: 0 auto;
}

.horarios-content h2 {
  font-family: "Syne", sans-serif;
  font-size: clamp(1.4rem, 3.5vw, 2rem);
  font-weight: 800;
  color: #fff;
  margin: 0 0 6px;
  text-align: center;
  letter-spacing: -0.3px;
}

.section-subtitle {
  text-align: center;
  color: var(--text-muted);
  margin: 0 0 28px;
  font-size: 0.92rem;
}

.horarios-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.horario-card {
  background: rgba(9, 18, 14, 0.6);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-md);
  padding: 22px 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: border-color 0.22s ease, transform 0.22s ease;
}

.horario-card:hover {
  border-color: rgba(199, 255, 52, 0.28);
  transform: translateY(-3px);
}

.horario-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(199,255,52,0.07);
  border-radius: var(--radius-sm);
}

.horario-card-body { flex: 1; }

.horario-card h4 {
  font-family: "Syne", sans-serif;
  font-size: 0.96rem;
  color: #fff;
  margin: 0 0 4px;
  font-weight: 700;
}

.horario-periodo {
  color: var(--ball);
  font-weight: 600;
  margin: 0 0 8px;
  font-size: 0.82rem;
}

.horario-detalles { display: flex; flex-direction: column; gap: 6px; }

.horario-detalle {
  color: rgba(232, 240, 236, 0.8);
  font-size: 0.88rem;
  line-height: 1.45;
}

.horario-detalle strong { color: rgba(232, 240, 236, 0.95); }

.horarios-nota {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.82rem;
  font-style: italic;
  margin: 0;
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CÃ“MO LLEGAR
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
.como-llegar-section {
  padding: 44px 16px;
}

.como-llegar-content {
  max-width: 920px;
  margin: 0 auto;
}

.como-llegar-content h2 {
  font-family: "Syne", sans-serif;
  font-size: clamp(1.4rem, 3.5vw, 2rem);
  font-weight: 800;
  color: #fff;
  margin: 0 0 24px;
  text-align: center;
  letter-spacing: -0.3px;
}

.llegar-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.llegar-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.llegar-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  background: rgba(9, 18, 14, 0.6);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-md);
  padding: 18px 20px;
}

.llegar-icon {
  font-size: 1.6rem;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(199,255,52,0.07);
  border-radius: var(--radius-sm);
}

.llegar-item h4 {
  font-family: "Syne", sans-serif;
  font-size: 0.88rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--ball);
  margin: 0 0 6px;
  font-weight: 700;
}

.llegar-item p {
  color: rgba(232, 240, 236, 0.85);
  line-height: 1.6;
  margin: 0;
  font-size: 0.9rem;
}

.mapa-placeholder {
  background:
    linear-gradient(135deg, rgba(9, 18, 14, 0.85), rgba(13, 38, 28, 0.9)),
    url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop") center/cover no-repeat;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255,255,255,0.08);
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.mapa-overlay {
  text-align: center;
  padding: 28px 20px;
}

.mapa-icon {
  font-size: 2.4rem;
  margin-bottom: 10px;
}

.mapa-overlay p {
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  margin: 0 0 6px;
}

.mapa-ubicacion {
  color: var(--ball) !important;
  font-size: 0.85rem !important;
  margin-bottom: 18px !important;
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FAQ
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
.faq-section {
  padding: 44px 16px;
  background: rgba(7, 16, 13, 0.35);
}

.faq-content {
  max-width: 900px;
  margin: 0 auto;
}

.faq-content h2 {
  font-family: "Syne", sans-serif;
  font-size: clamp(1.4rem, 3.5vw, 2rem);
  font-weight: 800;
  color: #fff;
  margin: 0 0 28px;
  text-align: center;
  letter-spacing: -0.3px;
}

.faq-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.faq-item {
  background: rgba(9, 18, 14, 0.6);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-md);
  padding: 18px 20px;
  transition: border-color 0.2s ease;
}

.faq-item:hover {
  border-color: rgba(199, 255, 52, 0.28);
}

.faq-item h4 {
  font-family: "Syne", sans-serif;
  font-size: 0.92rem;
  color: var(--ball);
  margin: 0 0 8px;
  font-weight: 700;
  line-height: 1.35;
}

.faq-item p {
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
  font-size: 0.88rem;
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CTA FINAL
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
.cta-section {
  padding: 40px 16px 64px;
  text-align: center;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 36px 22px;
  background: linear-gradient(135deg, rgba(199, 255, 52, 0.09), rgba(13, 26, 21, 0.4));
  border: 1px solid rgba(199, 255, 52, 0.2);
  border-radius: var(--radius-xl);
}

.cta-content h2 {
  font-family: "Syne", sans-serif;
  font-size: clamp(1.4rem, 3.5vw, 2rem);
  font-weight: 800;
  color: #fff;
  margin: 0 0 12px;
}

.cta-content p {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.65;
  margin: 0 0 24px;
}

.btn-large {
  padding: 13px 32px;
  font-size: 0.96rem;
  font-weight: 700;
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   TABLET  â‰¥ 640px
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
@media (min-width: 640px) {
  .contacto-hero {
    min-height: 300px;
    align-items: center;
    border-radius: 0 0 28px 28px;
  }

  .hero-content {
    padding: 40px 32px;
    text-align: center;
    margin: 0 auto;
  }

  .hero-lead { margin: 0 auto; }

  .horarios-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }

  .horario-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 24px 18px;
  }

  .horario-card-body { text-align: center; }

  .faq-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   DESKTOP  â‰¥ 900px
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
@media (min-width: 900px) {
  .contacto-hero {
    min-height: 380px;
    border-radius: 0 0 32px 32px;
  }

  .contacto-principal {
    padding: 48px 32px 72px;
  }

  .contacto-grid {
    grid-template-columns: 1fr 1.3fr;
    gap: 40px;
    align-items: start;
  }

  .form-card {
    padding: 36px 32px;
  }

  .llegar-grid {
    grid-template-columns: 1fr 1.4fr;
    gap: 28px;
    align-items: start;
  }

  .mapa-placeholder {
    min-height: 320px;
  }

  .horarios-section,
  .como-llegar-section,
  .faq-section {
    padding: 60px 32px;
  }

  .cta-content {
    padding: 48px 44px;
  }
}
</style>
