<template>
  <div class="toast-host" aria-live="polite" aria-relevant="additions removals">
    <div
      v-for="t in state.items"
      :key="t.id"
      class="toast"
      :class="t.type"
      role="status"
    >
      <div class="toast-message">{{ t.message }}</div>
      <button type="button" class="toast-close" aria-label="Cerrar" @click="remove(t.id)">×</button>
    </div>
  </div>
</template>

<script setup>
import { useToasts } from '../utils/toast';

const { state, remove } = useToasts();
</script>

<style scoped>
.toast-host {
  position: fixed;
  top: 14px;
  right: 14px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast {
  width: min(380px, calc(100vw - 28px));
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(8, 15, 18, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.55);
  color: rgba(234, 242, 239, 0.92);
  pointer-events: auto;
}

.toast.info {
  border-color: rgba(199, 255, 52, 0.22);
}

.toast.success {
  border-color: rgba(65, 210, 140, 0.28);
}

.toast.warning {
  border-color: rgba(255, 206, 84, 0.28);
}

.toast.error {
  border-color: rgba(255, 82, 82, 0.3);
}

.toast-message {
  font-weight: 700;
  line-height: 1.35;
}

.toast-close {
  border: none;
  background: transparent;
  color: rgba(234, 242, 239, 0.75);
  font-size: 20px;
  font-weight: 900;
  cursor: pointer;
  padding: 0 4px;
}

.toast-close:hover {
  color: rgba(234, 242, 239, 0.95);
}
</style>
