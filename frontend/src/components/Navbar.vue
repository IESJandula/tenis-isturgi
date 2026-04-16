<template>
  <nav class="navbar">
    <div class="brand">
      <router-link to="/" class="brand-link" @click="closeAllMenus">
        <img
          src="/logo-isturgi.jpg"
          alt="Logo Club Tenis Isturgi"
          class="brand-logo"
          loading="lazy"
        />
        <span class="brand-text">
          <span class="brand-mark headline">Isturgi</span>
          <span class="brand-sub">Club de Tenis · Andújar</span>
        </span>
      </router-link>
      <span class="brand-tag">Tierra, pista y comunidad</span>
    </div>

    <button
      type="button"
      class="burger"
      :aria-expanded="menuOpen"
      aria-controls="navbar-links"
      :aria-label="menuOpen ? 'Cerrar menú' : 'Abrir menú'"
      @click="toggleMenu"
    >
      <span class="burger-line" aria-hidden="true"></span>
      <span class="burger-line" aria-hidden="true"></span>
      <span class="burger-line" aria-hidden="true"></span>
    </button>

    <div class="enlaces" :class="{ open: menuOpen }" id="navbar-links">
      <router-link to="/" @click="closeMenu">Inicio</router-link>
      <router-link to="/club" @click="closeMenu">El Club</router-link>
      <router-link to="/galeria" @click="closeMenu">Galería</router-link>
      <router-link to="/escuela" @click="closeMenu">Escuela</router-link>
      <router-link to="/liga" @click="closeMenu">Liga</router-link>
      <router-link to="/noticias" @click="closeMenu">Noticias</router-link>
      <router-link to="/torneos" @click="closeMenu">Torneos</router-link>
      <router-link to="/contacto" @click="closeMenu">Contacto</router-link>

      <router-link v-if="isAuthenticated() && !isAdmin()" to="/disponibilidad" @click="closeMenu">Mi Disponibilidad</router-link>

      <router-link v-if="!isAuthenticated()" to="/login" class="btn-login" @click="closeMenu">Soy Socio</router-link>

      <div v-else class="user-area" ref="userAreaRef">
        <button
          type="button"
          class="user-trigger"
          :aria-expanded="userMenuOpen"
          aria-haspopup="menu"
          :aria-label="userMenuOpen ? 'Cerrar menú de usuario' : 'Abrir menú de usuario'"
          @click="toggleUserMenu"
        >
          <img
            class="user-avatar"
            :src="avatarUrl"
            alt=""
            loading="lazy"
            @error="onAvatarError"
          />
          <span class="user-name">{{ displayName }}</span>
          <span class="chev" aria-hidden="true">▾</span>
        </button>

        <div v-if="userMenuOpen" class="user-dropdown" role="menu">
          <router-link to="/socio-dashboard" class="dropdown-item" role="menuitem" @click="closeAllMenus">Mi panel</router-link>

          <router-link v-if="!isAdmin()" to="/mi-perfil" class="dropdown-item" role="menuitem" @click="closeAllMenus">Mi perfil</router-link>
          <router-link v-if="!isAdmin()" to="/mis-partidos" class="dropdown-item" role="menuitem" @click="closeAllMenus">Mis partidos</router-link>

          <router-link v-if="isAdmin()" to="/admin-gestion" class="dropdown-item" role="menuitem" @click="closeAllMenus">Admin · Gestión</router-link>
          <router-link v-if="isAdmin()" to="/admin-mantenimiento" class="dropdown-item" role="menuitem" @click="closeAllMenus">Admin · Mantenimiento</router-link>

          <button type="button" class="dropdown-item danger" role="menuitem" @click="handleLogout">Cerrar sesión</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../utils/auth';

const router = useRouter();
const { state, isAuthenticated, isAdmin, logout } = useAuth();

const menuOpen = ref(false);
const userMenuOpen = ref(false);
const userAreaRef = ref(null);

const displayName = computed(() => {
  const nombre = [state.user?.Nombre, state.user?.Apellidos].filter(Boolean).join(' ').trim();
  return nombre || state.user?.displayName || state.user?.email || 'Socio';
});

const avatarUrl = computed(() => {
  return state.user?.Foto || '/logo-isturgi.jpg';
});

const onAvatarError = (e) => {
  e.target.src = '/logo-isturgi.jpg';
};

const closeMenu = () => {
  menuOpen.value = false;
};

const closeAllMenus = () => {
  menuOpen.value = false;
  userMenuOpen.value = false;
};

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
  if (!menuOpen.value) userMenuOpen.value = false;
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
};

const handleDocumentClick = (ev) => {
  if (!userMenuOpen.value) return;
  const el = userAreaRef.value;
  if (el && !el.contains(ev.target)) {
    userMenuOpen.value = false;
  }
};

const handleKeydown = (ev) => {
  if (ev.key === 'Escape') closeAllMenus();
};

onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
  document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick);
  document.removeEventListener('keydown', handleKeydown);
});

const handleLogout = async () => {
  closeAllMenus();
  await logout();
  router.push('/login');
};
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 18px 28px;
  background: rgba(8, 15, 18, 0.88);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.brand {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.brand-link {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 12px;
}

.brand-logo {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid rgba(199, 255, 52, 0.5);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.35);
  object-fit: cover;
  margin: 0;
  background: rgba(8, 12, 14, 0.7);
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1;
}

.brand-mark {
  font-size: 1.6rem;
  color: var(--ball);
  text-transform: uppercase;
}

.brand-sub {
  font-size: 0.75rem;
  color: rgba(234, 242, 239, 0.75);
  text-transform: uppercase;
  letter-spacing: 1.2px;
}

.brand-tag {
  font-size: 0.72rem;
  color: rgba(199, 255,  52, 0.75);
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.burger {
  display: none;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(234, 242, 239, 0.9);
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.burger:hover {
  background: rgba(255, 255, 255, 0.08);
}

.burger-line {
  display: block;
  width: 22px;
  height: 2px;
  background: rgba(234, 242, 239, 0.85);
  margin: 4px 0;
  border-radius: 999px;
}

.enlaces {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.enlaces a {
  padding: 6px 10px;
  border-radius: 999px;
  color: rgba(234, 242, 239, 0.82);
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  transition: all 0.2s ease;
}

.enlaces a:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

.burger:focus-visible,
.enlaces a:focus-visible,
.btn-login:focus-visible,
.user-trigger:focus-visible,
.dropdown-item:focus-visible {
  outline: 2px solid var(--ball);
  outline-offset: 2px;
}

.router-link-active {
  color: var(--ball);
  background: rgba(199, 255, 52, 0.12);
}

.btn-login {
  padding: 10px 18px;
  border-radius: 999px;
  background: var(--ball);
  color: var(--ink) !important;
  font-weight: 800;
  margin-left: 8px;
  box-shadow: 0 10px 20px rgba(199, 255, 52, 0.25);
}

.btn-login:hover {
  transform: translateY(-2px);
}

.user-area {
  position: relative;
  display: flex;
  align-items: center;
}

.user-trigger {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border-radius: 999px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(234, 242, 239, 0.92);
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-trigger:hover {
  background: rgba(255, 255, 255, 0.08);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(199, 255, 52, 0.35);
}

.user-name {
  font-weight: 800;
  font-size: 0.9rem;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chev {
  opacity: 0.8;
  font-weight: 900;
}

.user-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  min-width: 220px;
  border-radius: 16px;
  background: rgba(8, 15, 18, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 25px 55px rgba(0, 0, 0, 0.55);
  padding: 10px;
}

.dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border-radius: 12px;
  color: rgba(234, 242, 239, 0.9);
  font-weight: 800;
  letter-spacing: 0.2px;
  text-transform: none;
  background: transparent;
  border: none;
  cursor: pointer;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.dropdown-item.danger {
  color: #ff6b6b;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: row;
    align-items: center;
    padding: 14px 16px;
  }

  .brand-tag {
    display: none;
  }

  .burger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .enlaces {
    display: none;
    width: 100%;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    flex-direction: column;
    align-items: flex-start;
  }

  .enlaces.open {
    display: flex;
  }

  .btn-login {
    margin-left: 0;
  }

  .user-name {
    max-width: 160px;
  }

  .user-dropdown {
    right: auto;
    left: 0;
    width: 100%;
    min-width: unset;
  }
}
</style>