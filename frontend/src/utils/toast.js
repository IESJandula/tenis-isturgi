import { reactive, readonly } from 'vue';

const state = reactive({
  items: []
});

const remove = (id) => {
  const idx = state.items.findIndex((t) => t.id === id);
  if (idx >= 0) state.items.splice(idx, 1);
};

export const toast = (message, type = 'info', timeoutMs = 4000) => {
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  state.items.push({ id, message: String(message ?? ''), type });

  if (timeoutMs > 0) {
    window.setTimeout(() => remove(id), timeoutMs);
  }

  return id;
};

export const useToasts = () => {
  return {
    state: readonly(state),
    remove
  };
};
