<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <img src="/logo-isturgi.jpg" alt="Logo" class="login-logo" />
        <h2>Soy Socio</h2>
        <p>Bienvenido de nuevo a tu club</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="identifier">Correo o Usuario</label>
          <input 
            type="text" 
            id="identifier" 
            v-model="identifier" 
            placeholder="ej. socio@isturgi.com"
            required 
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="••••••••"
            required 
          />
        </div>

        <div v-if="state.error" class="error-message">
          {{ state.error }}
        </div>

        <button type="submit" :disabled="state.loading" class="btn-submit">
          <span v-if="state.loading">Entrando...</span>
          <span v-else>Acceder</span>
        </button>
      </form>

      <div class="login-footer">
        <router-link to="/">Volver al inicio</router-link>
        <span>¿No tienes acceso? Contacta con el club</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../utils/auth';

const { state, login, isAuthenticated } = useAuth();
const router = useRouter();
const route = useRoute();

const identifier = ref('');
const password = ref('');

const redirectTarget = computed(() => {
  const redirect = route.query.redirect;
  if (typeof redirect !== 'string') return '/socio-dashboard';
  if (!redirect.startsWith('/') || redirect.startsWith('//') || redirect.startsWith('/login')) return '/socio-dashboard';
  return redirect;
});

if (isAuthenticated()) {
  router.replace('/socio-dashboard');
}

const handleLogin = async () => {
  const result = await login(identifier.value, password.value);
  if (result.success) {
    router.push(redirectTarget.value);
  }
};
</script>

<style scoped>
.login-container {
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: radial-gradient(circle at top right, rgba(199, 255, 52, 0.05), transparent),
              radial-gradient(circle at bottom left, rgba(14, 28, 32, 1), #080f12);
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background: rgba(234, 242, 239, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 16px;
  border: 2px solid var(--ball);
}

.login-header h2 {
  font-family: 'Outfit', sans-serif;
  font-size: 2rem;
  color: #ffffff;
  margin-bottom: 8px;
}

.login-header p {
  color: rgba(234, 242, 239, 0.6);
  font-size: 0.95rem;
}

.login-form {
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
  color: rgba(234, 242, 239, 0.8);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input {
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--ball);
  background: rgba(199, 255, 52, 0.05);
}

.btn-submit {
  padding: 16px;
  background: var(--ball);
  color: var(--ink);
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(199, 255, 52, 0.2);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 12px;
  background: rgba(255, 82, 82, 0.1);
  border: 1px solid rgba(255, 82, 82, 0.3);
  border-radius: 8px;
  color: #ff5252;
  font-size: 0.85rem;
  text-align: center;
}

.login-footer {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.login-footer a {
  color: var(--ball);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
}

.login-footer span {
  color: rgba(234, 242, 239, 0.4);
  font-size: 0.8rem;
}
</style>
