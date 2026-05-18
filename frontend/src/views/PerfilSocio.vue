<template>
  <div class="perfil-page fade-in">
    <section class="hero-section">
      <div class="hero-content">
        <span class="mini-tag">Área de Socio</span>
        <h1>Mi Perfil</h1>
        <p class="hero-lead">Revisa y actualiza tus datos personales.</p>
        <button type="button" class="btn-algorithm" style="text-decoration: none; display: inline-block;" @click="goPanel">Ir a Mi Panel</button>
      </div>
    </section>

    <div class="container main-content">
      <div v-if="cargando" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando tu perfil...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="cargar" class="btn-retry">Reintentar</button>
      </div>

      <div v-else class="perfil-grid">
        <div class="perfil-card glass-card">
          <div class="avatar-row">
            <div class="avatar">
              <img :src="previewFoto" @error="onAvatarError" alt="Foto de perfil" />
            </div>
            <div class="avatar-meta">
              <h3>{{ form.Nombre }} {{ form.Apellidos }}</h3>
              <p class="muted">{{ form.Email }}</p>
              <p v-if="form.NumeroSocio" class="badge">Socio #{{ form.NumeroSocio }}</p>
            </div>
          </div>

          <form @submit.prevent="guardar" class="perfil-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Nombre</label>
                <input v-model="form.Nombre" required />
              </div>
              <div class="form-group">
                <label>Apellidos</label>
                <input v-model="form.Apellidos" />
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Teléfono</label>
                <input v-model="form.Telefono" placeholder="Ej: 600000000" />
              </div>
              <div class="form-group">
                <label>Foto (subir archivo)</label>
                <input type="file" accept="image/*" @change="onFileChange" />
                <p class="muted">Seleciona una imagen para subir; se guardará y usará como foto de perfil.</p>
                <p v-if="subiendoFoto" class="muted">Subiendo foto...</p>
              </div>
            </div>

            <div class="form-group">
              <label>Email</label>
              <input v-model="form.Email" type="email" placeholder="tu@correo.com" />
              <p class="muted">El email se sincroniza con Firebase; cambiarlo actualizará tu cuenta.</p>
            </div>

            <div class="actions">
              <button type="submit" class="btn-save" :disabled="guardando">
                {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
              </button>
              <p v-if="mensaje" class="submit-message" :class="{ success: ok, error: !ok }">{{ mensaje }}</p>
            </div>
          </form>
        </div>

        <div class="info-card glass-card">
          <h3>Datos de cuenta</h3>
          <ul class="info-list">
            <li><strong>Email:</strong> {{ form.Email }}</li>
            <li><strong>Número socio:</strong> {{ form.NumeroSocio || '—' }}</li>
            <li><strong>Nivel:</strong> {{ form.Nivel || '—' }}</li>
            <li><strong>Puntos:</strong> {{ form.Puntos ?? 0 }}</li>
          </ul>
          <p class="muted">* El email se gestiona desde Firebase.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuth } from '../utils/auth';

const router = useRouter();
const { state, isAuthenticated, refreshProfile } = useAuth();
const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const cargando = ref(true);
const guardando = ref(false);
const error = ref(null);
const mensaje = ref('');
const ok = ref(false);

const form = reactive({
  id: null,
  Nombre: '',
  Apellidos: '',
  Telefono: '',
  Email: '',
  Foto: '',
  NumeroSocio: '',
  Nivel: '',
  Puntos: 0
});

const previewFoto = computed(() => form.Foto || '/logo-isturgi.jpg');

const goPerfil = () => {
  router.push('/mi-perfil');
};
const goPanel = () => {
  router.push('/socio-dashboard');
};

const onAvatarError = (e) => {
  e.target.src = '/logo-isturgi.jpg';
};

const cargar = async () => {
  cargando.value = true;
  error.value = null;

  try {
    const config = { headers: { Authorization: `Bearer ${state.jwt}` } };
    const res = await axios.get(`${apiUrl}/api/jugadors/me`, config);
    const data = res.data?.data;
    if (!data) throw new Error('No se pudo cargar el perfil');

    form.id = data.id;
    form.Nombre = data.Nombre || '';
    form.Apellidos = data.Apellidos || '';
    form.Telefono = data.Telefono || '';
    form.Email = data.Email || state.user?.email || '';
    form.Foto = data.Foto || '';
    form.NumeroSocio = data.NumeroSocio || '';
    form.Nivel = data.Nivel || '';
    form.Puntos = data.Puntos ?? 0;
  } catch (e) {
    console.error(e);
    error.value = e.message || 'Error cargando el perfil.';
  } finally {
    cargando.value = false;
  }
};

const subiendoFoto = ref(false);
const onFileChange = async (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  subiendoFoto.value = true;
  try {
    const fd = new FormData();
    fd.append('file', file);
    const config = { headers: { Authorization: `Bearer ${state.jwt}` } };
    const res = await axios.post(`${apiUrl}/api/jugadors/me/photo`, fd, config);
    const url = res.data?.data?.url;
    if (url) {
      form.Foto = url;
    }
  } catch (err) {
    console.error('Error subiendo foto', err);
    mensaje.value = 'No se pudo subir la foto.';
    ok.value = false;
    setTimeout(() => (mensaje.value = ''), 4000);
  } finally {
    subiendoFoto.value = false;
  }
};

const guardar = async () => {
  guardando.value = true;
  mensaje.value = '';

  try {
    const config = { headers: { Authorization: `Bearer ${state.jwt}` } };
    await axios.put(`${apiUrl}/api/jugadors/me`, {
      Nombre: form.Nombre,
      Apellidos: form.Apellidos,
      Telefono: form.Telefono,
      Foto: form.Foto,
      Email: form.Email
    }, config);

    await refreshProfile();

    ok.value = true;
    mensaje.value = 'Perfil actualizado correctamente.';
  } catch (e) {
    console.error(e);
    ok.value = false;
    mensaje.value = 'No se pudo guardar el perfil.';
  } finally {
    guardando.value = false;
    setTimeout(() => (mensaje.value = ''), 4000);
  }
};

onMounted(async () => {
  if (!isAuthenticated()) {
    router.push('/login');
    return;
  }
  await cargar();
});
</script>

<style scoped>
.perfil-page { padding-bottom: 80px; }

.hero-section {
  background: linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('/fotos-tenis/photo-1558365849-6ebd8b0454b2.avif');
  background-size: cover;
  background-position: center 40%;
  padding: 60px 20px;
  text-align: center;
  color: white;
  margin-bottom: 40px;
  border-radius: 0 0 28px 28px;
  overflow: hidden;
}

/* Responsive tweaks to avoid hero clipping on mobile */
.hero-content h1 {
  font-size: clamp(2rem, 6vw, 3rem);
  line-height: 1.02;
  margin-bottom: 12px;
}

@media (max-width: 480px) {
  .hero-section { padding: 90px 16px; border-radius: 0 0 28px 28px; }
  .hero-content h1 { font-size: 2.2rem; }
  .mini-tag { margin-bottom: 14px; }
  .btn-algorithm { margin-top: 18px; }
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

.btn-algorithm {
  background: #fff;
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-algorithm:hover {
  background: var(--ball);
}

.container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }

.perfil-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

@media (max-width: 900px) {
  .perfil-grid { grid-template-columns: 1fr; }
}

.glass-card {
  background: rgba(234, 242, 239, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px;
}

.avatar-row {
  display: flex;
  gap: 18px;
  align-items: center;
  margin-bottom: 18px;
}

.avatar {
  width: 84px;
  height: 84px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
}

.avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }

.badge {
  display: inline-block;
  margin-top: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(199, 255, 52, 0.12);
  border: 1px solid rgba(199, 255, 52, 0.25);
  color: var(--ball);
  font-weight: 700;
  font-size: 0.8rem;
}

.muted { color: rgba(234, 242, 239, 0.6); margin: 0; }

.perfil-form { margin-top: 10px; }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 12px;
}

@media (max-width: 700px) {
  .form-grid { grid-template-columns: 1fr; }
}

.form-group label { display: block; font-weight: 700; color: #fff; margin-bottom: 8px; }

.form-group input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.25);
  color: #fff;
}

.actions { display: flex; gap: 12px; align-items: center; margin-top: 14px; flex-wrap: wrap; }

.btn-save {
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid rgba(199, 255, 52, 0.35);
  background: rgba(199, 255, 52, 0.12);
  color: var(--ball);
  font-weight: 800;
  cursor: pointer;
}

.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

.submit-message { margin: 0; font-weight: 700; }
.submit-message.success { color: var(--ball); }
.submit-message.error { color: #ff7b7b; }

.info-list { list-style: none; padding: 0; margin: 12px 0 0; display: grid; gap: 10px; }
.info-list li { color: rgba(234, 242, 239, 0.8); }
.info-list strong { color: #fff; }

.loading-state, .error-state {
  text-align: center;
  padding: 24px;
  border-radius: 16px;
  background: rgba(234, 242, 239, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.btn-retry {
  margin-top: 12px;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  cursor: pointer;
}
</style>
