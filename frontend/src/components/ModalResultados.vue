<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="modal-backdrop" @click.self="close">
      <div class="modal-content glass-card">
        <header class="modal-header">
          <h2>Registrar Resultado</h2>
          <button class="close-btn" @click="close">×</button>
        </header>

        <main class="modal-body">
          <div class="match-display">
            <div class="player-col">
              <span class="player-name">{{ partido.jugador1?.Nombre }}</span>
            </div>
            <span class="vs-text">vs</span>
            <div class="player-col">
              <span class="player-name">{{ partido.jugador2?.Nombre }}</span>
            </div>
          </div>

          <div class="input-group">
            <label for="resultado">Resultado (ej: 6-4, 7-5)</label>
            <input 
              id="resultado"
              v-model="resultado" 
              type="text" 
              placeholder="Set 1, Set 2, Set 3..." 
              class="form-input"
              @keyup.enter="save"
            />
            <p class="input-hint">Formato: 6-4, 3-6, 7-6</p>
          </div>

          <div v-if="error" class="error-msg">{{ error }}</div>
        </main>

        <footer class="modal-footer">
          <button class="btn btn-secondary" @click="close" :disabled="guardando">Cancelar</button>
          <button class="btn btn-primary" @click="save" :disabled="guardando || !resultado">
            {{ guardando ? 'Guardando...' : 'Guardar Resultado' }}
          </button>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

const props = defineProps({
  isOpen: Boolean,
  partido: Object
});

const emit = defineEmits(['close', 'saved']);

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const resultado = ref('');
const guardando = ref(false);
const error = ref(null);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    resultado.value = props.partido.resultado || '';
    error.value = null;
  }
});

const close = () => {
  if (guardando.value) return;
  emit('close');
};

const save = async () => {
  if (!resultado.value.trim()) return;
  
  guardando.value = true;
  error.value = null;
  
  try {
    await axios.put(`${API_BASE}/api/partidos/${props.partido.id}/resultado`, {
      resultado: resultado.value.trim()
    });
    emit('saved');
    close();
  } catch (err) {
    console.error(err);
    error.value = 'Error al guardar el resultado. Verifica el formato.';
  } finally {
    guardando.value = false;
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-content {
  width: 100%;
  max-width: 480px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-family: "Syne", sans-serif;
  font-size: 1.5rem;
  color: var(--ball);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #fff;
}

.match-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: var(--radius-md);
  margin-bottom: 8px;
}

.player-col {
  flex: 1;
  text-align: center;
}

.player-name {
  font-weight: 700;
  font-size: 1.1rem;
}

.vs-text {
  font-family: "Syne", sans-serif;
  color: var(--text-faint);
  font-weight: 800;
  font-style: italic;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.form-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 14px;
  color: #fff;
  font-family: inherit;
  font-size: 1.1rem;
  text-align: center;
  letter-spacing: 1px;
}

.form-input:focus {
  outline: none;
  border-color: var(--ball);
  box-shadow: 0 0 15px rgba(199, 255, 52, 0.2);
}

.input-hint {
  font-size: 0.75rem;
  color: var(--text-faint);
  margin: 0;
}

.error-msg {
  color: #ff7070;
  font-size: 0.85rem;
  background: rgba(255, 112, 112, 0.1);
  padding: 10px;
  border-radius: 8px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-content {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-fade-leave-active .modal-content {
  transition: transform 0.2s ease;
}

.modal-fade-enter-from .modal-content {
  transform: scale(0.9) translateY(20px);
}

.modal-fade-leave-to .modal-content {
  transform: scale(0.95);
}
</style>
