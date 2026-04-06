<template>
  <div class="disponibilidad-page fade-in">
    <section class="hero-section">
      <div class="hero-content">
        <span class="mini-tag">Área de Jugador</span>
        <h1>Mi Disponibilidad Semanal</h1>
        <p class="hero-lead">Selecciona las franjas horarias en las que puedes jugar el próximo fin de semana.</p>
      </div>
    </section>

    <div class="container main-content">
      <div v-if="cargando" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando jornada actual...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="cargarDatos" class="btn-retry">Reintentar</button>
      </div>

      <div v-else class="disponibilidad-grid-container">
        <div class="jornada-info">
          <div class="info-card">
            <h3>{{ jornadaActual?.Nombre || 'Jornada Sin Nombre' }}</h3>
            <p class="deadline">Límite para marcar: <strong>Miércoles 23:59h</strong></p>
          </div>
        </div>

        <div class="grid-card">
          <div class="grid-header">
            <div class="header-col">Franja</div>
            <div class="header-col">Viernes</div>
            <div class="header-col">Sábado</div>
            <div class="header-col">Domingo</div>
          </div>

          <div class="grid-body">
            <div v-for="slot in slotsDef" :key="slot.hora" class="grid-row">
              <div class="time-label">{{ slot.label }}</div>
              
              <!-- Viernes -->
              <div class="slot-cell">
                <label v-if="slot.viernes" class="checkbox-container">
                  <input type="checkbox" v-model="form.viernes[slot.hora]">
                  <span class="checkmark"></span>
                </label>
                <span v-else class="no-slot">-</span>
              </div>

              <!-- Sábado -->
              <div class="slot-cell">
                <label v-if="slot.sabado" class="checkbox-container">
                  <input type="checkbox" v-model="form.sabado[slot.hora]">
                  <span class="checkmark"></span>
                </label>
                <span v-else class="no-slot">-</span>
              </div>

              <!-- Domingo -->
              <div class="slot-cell">
                <label v-if="slot.domingo" class="checkbox-container">
                  <input type="checkbox" v-model="form.domingo[slot.hora]">
                  <span class="checkmark"></span>
                </label>
                <span v-else class="no-slot">-</span>
              </div>
            </div>
          </div>
        </div>

        <div class="actions">
          <button @click="guardarDisponibilidad" :disabled="guardando" class="btn-save">
            {{ guardando ? 'Guardando...' : 'Guardar Disponibilidad' }}
          </button>
          <p v-if="mensajeExito" class="success-message">¡Guardado correctamente! 🎾</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Final fix to ensure form reactive state is detected
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import { useAuth } from '../utils/auth';

const { state } = useAuth();

const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const cargando = ref(true);
const guardando = ref(false);
const error = ref(null);
const mensajeExito = ref(false);
const jornadaActual = ref(null);

// Definición de slots según requisitos
const slotsDef = [
  { hora: '09:00', label: '09:00', viernes: false, sabado: true, domingo: true },
  { hora: '11:00', label: '11:00', viernes: false, sabado: true, domingo: true },
  { hora: '16:00', label: '16:00', viernes: true,  sabado: true, domingo: true },
  { hora: '18:00', label: '18:00', viernes: true,  sabado: true, domingo: true },
];

const form = reactive({
  viernes: {},
  sabado: {},
  domingo: {}
});

const jugadorId = ref(null);

const cargarDatos = async () => {
  cargando.value = true;
  error.value = null;
  try {
    const config = {
      headers: { Authorization: `Bearer ${state.jwt}` }
    };

    // 1. Obtener el perfil de jugador (incluye division para filtrar jornadas)
    let divisionId = null;
    try {
      const resMe = await axios.get(`${apiUrl}/api/jugadors/me`, config);
      if (resMe.data.data) {
        jugadorId.value = resMe.data.data.id;
        divisionId = resMe.data.data?.division?.id || null;
      }
    } catch (e) {
      console.error('Error fetching /jugadors/me:', e);
    }

    if (!jugadorId.value) {
      throw new Error('No se encontró un perfil de jugador vinculado a tu cuenta.');
    }

    // 2. Obtener jornadas de la division del jugador y escoger la primera abierta.
    const jornadaParams = { limit: 300 };
    if (divisionId) jornadaParams.divisionId = divisionId;

    const resJornada = await axios.get(`${apiUrl}/api/jornadas`, {
      ...config,
      params: jornadaParams
    });
    const allJornadas = resJornada.data.data || resJornada.data || [];
    if (!allJornadas.length) {
      throw new Error('No hay jornadas activas configuradas.');
    }

    const jornadasAbiertas = allJornadas
      .filter(j => j?.cerrada === false)
      .sort((a, b) => {
        const numA = Number.isFinite(a?.Numero) ? a.Numero : Number.MAX_SAFE_INTEGER;
        const numB = Number.isFinite(b?.Numero) ? b.Numero : Number.MAX_SAFE_INTEGER;
        if (numA !== numB) return numA - numB;
        return (a?.id ?? 0) - (b?.id ?? 0);
      });

    if (jornadasAbiertas.length > 0) {
      jornadaActual.value = jornadasAbiertas[0];
    } else {
      // Fallback: si todas estan cerradas, mostrar la mas reciente.
      const jornadasOrdenadas = [...allJornadas].sort((a, b) => (b?.id ?? 0) - (a?.id ?? 0));
      jornadaActual.value = jornadasOrdenadas[0];
    }

    // 3. Intentar cargar disponibilidad existente usando filtros server-side
    const resDisp = await axios.get(`${apiUrl}/api/disponibilidades`, {
      ...config,
      params: { jugadorId: jugadorId.value, jornadaId: jornadaActual.value.id }
    });

    const filteredDisp = resDisp.data.data || resDisp.data || [];
    if (filteredDisp.length > 0) {
      const existingStr = filteredDisp[0].slots;
      const existing = typeof existingStr === 'string' ? JSON.parse(existingStr) : existingStr;
      if (existing) {
        Object.assign(form, existing);
      }
    }
  } catch (e) {
    console.error(e);
    error.value = e.message || 'No se pudo cargar la información de la jornada.';
  } finally {
    cargando.value = false;
  }
};

const guardarDisponibilidad = async () => {
  if (!jugadorId.value) return;
  
  guardando.value = true;
  mensajeExito.value = false;
  try {
    const config = {
      headers: { Authorization: `Bearer ${state.jwt}` }
    };
    // Buscar si ya existe para hacer PUT o POST (server-side filters)
    const resDisp = await axios.get(`${apiUrl}/api/disponibilidades`, {
      ...config,
      params: { jugadorId: jugadorId.value, jornadaId: jornadaActual.value.id }
    });
    const resExistente = resDisp.data.data || resDisp.data || [];
    
    const payload = {
      jugador: { id: jugadorId.value },
      jornada: { id: jornadaActual.value.id },
      slots: JSON.stringify({ ...form })
    };

    if (resExistente.length > 0) {
      const docId = resExistente[0].id || resExistente[0].documentId;
      await axios.put(`${apiUrl}/api/disponibilidades/${docId}`, payload, config);
    } else {
      await axios.post(`${apiUrl}/api/disponibilidades`, payload, config);
    }

    mensajeExito.value = true;
    setTimeout(() => mensajeExito.value = false, 3000);
  } catch (e) {
    console.error(e);
    alert('Error al guardar la disponibilidad.');
  } finally {
    guardando.value = false;
  }
};

onMounted(cargarDatos);
</script>

<style scoped>
.disponibilidad-page {
  padding-bottom: 80px;
}

.hero-section {
  background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1595435066311-66632490b6c6?q=80&w=2000&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  padding: 80px 20px;
  text-align: center;
  color: white;
  margin-bottom: 40px;
  border-radius: 0 0 40px 40px;
}

.mini-tag {
  background: var(--ball);
  color: var(--ink);
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 800;
  font-size: 0.7rem;
  text-transform: uppercase;
  margin-bottom: 20px;
  display: inline-block;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 15px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.info-card {
  background: rgba(199, 255, 52, 0.1);
  border: 1px solid var(--ball);
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 30px;
  text-align: center;
}

.deadline {
  color: #ffcc00;
  margin-top: 10px;
}

.grid-card {
  background: #1a1a1a;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);
}

.grid-header {
  display: grid;
  grid-template-columns: 100px 1fr 1fr 1fr;
  background: #333;
  padding: 15px;
  text-align: center;
  font-weight: 800;
  color: var(--ball);
}

.grid-row {
  display: grid;
  grid-template-columns: 100px 1fr 1fr 1fr;
  padding: 15px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  align-items: center;
  text-align: center;
}

.time-label {
  font-weight: 700;
  color: #888;
}

.no-slot {
  color: #444;
}

/* Checkbox Custom */
.checkbox-container {
  display: inline-block;
  position: relative;
  cursor: pointer;
  font-size: 22px;
  user-select: none;
  width: 30px;
  height: 30px;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 30px;
  width: 30px;
  background-color: #333;
  border-radius: 8px;
  border: 2px solid #555;
  transition: all 0.2s;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #444;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: var(--ball);
  border-color: var(--ball);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 10px;
  top: 5px;
  width: 8px;
  height: 15px;
  border: solid #000;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
}

.actions {
  margin-top: 40px;
  text-align: center;
}

.btn-save {
  background: var(--ball);
  color: var(--ink);
  border: none;
  padding: 18px 40px;
  border-radius: 99px;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-save:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(199, 255, 52, 0.4);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.success-message {
  color: var(--ball);
  margin-top: 20px;
  font-weight: 700;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 600px) {
  .grid-header, .grid-row {
    grid-template-columns: 70px 1fr 1fr 1fr;
    font-size: 0.8rem;
  }
}
</style>
