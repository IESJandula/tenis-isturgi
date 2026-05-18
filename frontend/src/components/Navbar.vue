<template>
  <!-- ① Top bar: logo + usuario (siempre visible) -->
  <nav class="navbar">
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

    <!-- Desktop: enlaces completos -->
    <div class="enlaces" id="navbar-links">
      <router-link to="/" @click="closeMenu">Inicio</router-link>
      <router-link to="/club" @click="closeMenu">El Club</router-link>
      <router-link to="/galeria" @click="closeMenu">Galería</router-link>
      <router-link to="/escuela" @click="closeMenu">Escuela</router-link>
      <router-link to="/liga" @click="closeMenu">Liga</router-link>
      <router-link to="/noticias" @click="closeMenu">Noticias</router-link>
      <router-link to="/torneos" @click="closeMenu">Torneos</router-link>
      <router-link to="/contacto" @click="closeMenu">Contacto</router-link>
    </div>

    

    <!-- Zona usuario (visible siempre) -->
    <div class="navbar-right">
      <button type="button" class="hamburger" aria-label="Abrir menú" :aria-expanded="topMenuOpen" @click="toggleTopMenu">
        <span class="hamburger-inner"></span>
      </button>

      <router-link v-if="!isAuth" to="/login" class="btn-login" @click="closeAllMenus">Soy Socio</router-link>

      <div v-if="isAuth" class="user-area" ref="userAreaRef">
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
          <router-link v-if="!isAdminFlag" to="/mi-perfil" class="dropdown-item" role="menuitem" @click="closeAllMenus">Mi perfil</router-link>
          <router-link v-if="!isAdminFlag" to="/mis-partidos" class="dropdown-item" role="menuitem" @click="closeAllMenus">Mis partidos</router-link>
          <router-link v-if="isAdminFlag" to="/admin/dashboard" class="dropdown-item" role="menuitem" @click="closeAllMenus">Dashboard</router-link>
          <router-link v-if="isAdminFlag" to="/admin/calendario" class="dropdown-item" role="menuitem" @click="closeAllMenus">Jornadas</router-link>
          <router-link v-if="isAdminFlag" to="/admin-mantenimiento" class="dropdown-item" role="menuitem" @click="closeAllMenus">Mantenimiento</router-link>
          <button type="button" class="dropdown-item danger" role="menuitem" @click="handleLogout">Cerrar sesión</button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Mobile: top dropdown menu (hamburger) -->
  <Transition name="dropdown">
    <div v-if="topMenuOpen" class="mobile-dropdown" role="menu" aria-label="Navegación móvil superior">
      <nav class="dropdown-links">
        <router-link to="/" @click="closeTopMenu">Inicio</router-link>
        <router-link to="/club" @click="closeTopMenu">El Club</router-link>
        <router-link to="/galeria" @click="closeTopMenu">Galería</router-link>
        <router-link to="/escuela" @click="closeTopMenu">Escuela</router-link>
        <router-link to="/liga" @click="closeTopMenu">Liga</router-link>
        <router-link to="/noticias" @click="closeTopMenu">Noticias</router-link>
        <router-link to="/torneos" @click="closeTopMenu">Torneos</router-link>
        <router-link to="/contacto" @click="closeTopMenu">Contacto</router-link>
        <!-- En móvil: si estamos autenticados mostramos un botón compacto de cuenta (avatar + nombre), si no el CTA de login -->
        <router-link v-if="isAuth" to="/socio-dashboard" class="dropdown-account" @click="closeTopMenu">
          <img :src="avatarUrl" class="dropdown-account-avatar" alt="avatar" loading="lazy" @error="onAvatarError" />
          <span class="dropdown-account-name">{{ displayName }}</span>
        </router-link>
        <router-link v-if="!isAuth" to="/login" class="dropdown-cta" @click="closeTopMenu">Soy Socio</router-link>
      </nav>
    </div>
  </Transition>

  <!-- ③ Panel deslizante (sheet) para las rutas secundarias en móvil -->
  <Transition name="sheet">
    <div v-if="menuOpen" class="mobile-sheet" role="dialog" aria-modal="true" aria-label="Más opciones de navegación">
      <div class="sheet-handle" @click="closeMenu" role="button" aria-label="Cerrar menú" tabindex="0"></div>
      <nav class="sheet-links">
        <router-link to="/club"     class="sheet-link" @click="closeMenu"><span class="sheet-icon">🏛️</span>El Club</router-link>
        <router-link to="/galeria"  class="sheet-link" @click="closeMenu"><span class="sheet-icon">🖼️</span>Galería</router-link>
        <router-link to="/noticias" class="sheet-link" @click="closeMenu"><span class="sheet-icon">📰</span>Noticias</router-link>
        <router-link to="/contacto" class="sheet-link" @click="closeMenu"><span class="sheet-icon">📍</span>Contacto</router-link>
        <router-link v-if="!isAuth" to="/login" class="sheet-link sheet-cta" @click="closeMenu">Soy Socio →</router-link>
      </nav>
    </div>
  </Transition>

  <Transition name="backdrop">
    <div v-if="menuOpen" class="sheet-backdrop" @click="closeMenu" aria-hidden="true"></div>
  </Transition>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../utils/auth';

const router = useRouter();
const { state, isAuthenticated, isAdmin, logout } = useAuth();

const isAuth = computed(() => isAuthenticated());
const isAdminFlag = computed(() => isAdmin());

const menuOpen = ref(false);
const topMenuOpen = ref(false);
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
  topMenuOpen.value = false;
  userMenuOpen.value = false;
};

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
  if (!menuOpen.value) userMenuOpen.value = false;
};

const toggleTopMenu = () => {
  topMenuOpen.value = !topMenuOpen.value;
  // cerrar otros menús cuando se abre el top menu
  if (topMenuOpen.value) {
    menuOpen.value = false;
    userMenuOpen.value = false;
  }
};

const closeTopMenu = () => {
  topMenuOpen.value = false;
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
/* ═══════════════════════════════════════
   TOP NAVBAR  (mobile-first)
═══════════════════════════════════════ */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100010;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  background: rgba(7, 16, 13, 0.93);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}

.brand-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1.5px solid rgba(199, 255, 52, 0.5);
  object-fit: cover;
  background: rgba(7, 16, 13, 0.8);
  flex-shrink: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  line-height: 1;
}

  .hamburger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 8px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.04);
    margin-left: 8px;
    cursor: pointer;
  }

  .hamburger-inner {
    width: 18px;
    height: 2px;
    background: rgba(232,240,236,0.9);
    position: relative;
  }

  .hamburger-inner::before,
  .hamburger-inner::after {
    content: '';
    position: absolute;
    left: 0;
    width: 18px;
    height: 2px;
    background: rgba(232,240,236,0.9);
  }

  .hamburger-inner::before { top: -6px; }
  .hamburger-inner::after { top: 6px; }

.brand-mark {
  font-size: 1.3rem;
  color: var(--ball);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.brand-sub {
  font-size: 0.62rem;
  color: rgba(232, 240, 236, 0.55);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Desktop nav links – oculto en móvil */
.enlaces {
  display: none;
}

/* Zona usuario */
.navbar-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.btn-login {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--ball);
  color: var(--ink) !important;
  font-weight: 700;
  font-size: 0.85rem;
  min-height: 40px;
  box-shadow: 0 6px 18px rgba(199, 255, 52, 0.28);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.btn-login:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(199, 255, 52, 0.38);
}

.user-area {
  position: relative;
}

.user-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(232, 240, 236, 0.9);
  cursor: pointer;
  min-height: 44px;
  transition: background 0.18s ease;
}

.user-trigger:hover {
  background: rgba(255, 255, 255, 0.08);
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid rgba(199, 255, 52, 0.35);
}

/* Oculto en móvil, visible en desktop */
.user-name,
.chev {
  display: none;
}

.chev {
  opacity: 0.7;
}

.user-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  min-width: 200px;
  border-radius: var(--radius-md);
  background: rgba(7, 16, 13, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  padding: 8px;
  z-index: 200;
}

.dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  min-height: 44px;
  border-radius: var(--radius-sm);
  color: rgba(232, 240, 236, 0.9);
  font-weight: 600;
  font-size: 0.9rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.07);
}

.dropdown-item.danger {
  color: #ff7070;
}

/* ═══════════════════════════════════════
   BOTTOM NAVIGATION  (solo móvil)
═══════════════════════════════════════ */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: stretch;
  height: 64px;
  background: rgba(7, 16, 13, 0.97);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.09);
  /* Espacio extra en dispositivos con notch inferior */
  padding-bottom: env(safe-area-inset-bottom, 0);
}

/* Mobile top dropdown */
.mobile-dropdown {
  position: absolute;
  top: 64px; /* justo debajo de la navbar */
  right: 8px; /* alineado a la derecha */
  left: auto;
  background: rgba(7,16,13,0.98);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  z-index: 120;
  padding: 12px 8px;
}

.dropdown-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dropdown-links a {
  color: rgba(232,240,236,0.95);
  padding: 10px 12px;
  border-radius: 8px;
  text-decoration: none;
}

/* Cuenta compacta en el dropdown (móvil) */
.dropdown-account {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(255,255,255,0.02);
  color: rgba(232,240,236,0.95);
  text-decoration: none;
  font-weight: 700;
}
.dropdown-account-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid rgba(199, 255, 52, 0.35);
}
.dropdown-account-name {
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-links a.dropdown-cta {
  background: var(--ball);
  color: #000;
  font-weight: 800;
  text-align: center;
}

/* Hide hamburger on desktop (already showing desktop links) */
@media (min-width: 769px) {
  .hamburger { display: none; }
  .mobile-dropdown { display: none; }
}

@media (max-width: 768px) {
  /* hide the bottom sheet backdrop overlap when top dropdown open */
  .sheet-backdrop[style] { display: none; }
}

.bnav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: rgba(232, 240, 236, 0.45);
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.18s ease;
  min-height: 44px;
  padding: 6px 4px;
  font-family: "Outfit", sans-serif;
}

.bnav-item:hover,
.bnav-item.router-link-active,
.bnav-item.bnav-active {
  color: var(--ball);
}

.bnav-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  transition: transform 0.18s ease;
}

.bnav-item:hover .bnav-icon {
  transform: translateY(-1px);
}

/* ═══════════════════════════════════════
   MOBILE SHEET  (panel deslizante desde abajo)
═══════════════════════════════════════ */
.mobile-sheet {
  position: fixed;
  bottom: 64px;
  left: 0;
  right: 0;
  z-index: 150;
  background: rgba(9, 18, 14, 0.99);
  border-top: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 20px 20px 0 0;
  padding: 8px 0 20px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.sheet-handle {
  width: 40px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  margin: 8px auto 16px;
  cursor: pointer;
}

.sheet-links {
  display: flex;
  flex-direction: column;
  padding: 0 12px;
  gap: 2px;
}

.sheet-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  color: rgba(232, 240, 236, 0.85);
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
  min-height: 52px;
}

.sheet-link:hover,
.sheet-link.router-link-active {
  background: rgba(199, 255, 52, 0.08);
  color: var(--ball);
}

.sheet-icon {
  font-size: 1.2rem;
  width: 28px;
  text-align: center;
  flex-shrink: 0;
}

.sheet-cta {
  margin-top: 8px;
  background: var(--ball);
  color: var(--ink) !important;
  font-weight: 700;
  justify-content: center;
}

.sheet-cta:hover {
.dropdown-links a.dropdown-cta {
  background: var(--ball);
  color: #000;
  font-weight: 800;
  text-align: center;
}
  filter: brightness(1.06);
}

.sheet-backdrop {
  position: fixed;
  inset: 0;
  z-index: 140;
  background: rgba(0, 0, 0, 0.55);
}
  /* En móvil ocultar el área de usuario y mostrar el hamburger en la derecha; ocultar el CTA de login */
  .user-area { display: none; }
  .btn-login { display: none !important; }
  .user-name { display: inline; font-weight: 700; font-size: 0.85rem; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* ── Transiciones ── */
.sheet-enter-active,
.sheet-leave-active {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
}

.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}
.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

/* ── Focus accesibilidad ── */
.btn-login:focus-visible,
.user-trigger:focus-visible,
.dropdown-item:focus-visible,
.bnav-item:focus-visible,
.sheet-link:focus-visible {
  outline: 2px solid var(--ball);
  outline-offset: 2px;
}

/* ═══════════════════════════════════════
   DESKTOP  ≥ 769px
═══════════════════════════════════════ */
@media (min-width: 769px) {
  .navbar {
    padding: 14px 28px;
    gap: 20px;
  }

  .brand-logo {
    width: 52px;
    height: 52px;
  }

  .brand-mark {
    font-size: 1.55rem;
  }

  .brand-sub {
    font-size: 0.7rem;
  }

  /* Mostrar enlaces en desktop */
  .enlaces {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    flex: 1;
    justify-content: center;
  }

  .enlaces a {
    padding: 7px 11px;
    border-radius: 999px;
    color: rgba(232, 240, 236, 0.75);
    font-weight: 600;
    font-size: 0.86rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-decoration: none;
    transition: all 0.18s ease;
  }

  .enlaces a:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.07);
  }

  .enlaces a.router-link-active {
    color: var(--ball);
    background: rgba(199, 255, 52, 0.1);
  }

  /* Mostrar nombre de usuario en desktop */
  .user-name,
  .chev {
    display: inline;
  }

  /* Mostrar el área de usuario en desktop */
  .user-area { display: inline-flex; align-items: center; gap: 8px; }

  /* Restaurar CTA de login en desktop (se oculta en móvil) */
  .btn-login { display: inline-flex !important; }

  .user-name {
    font-weight: 700;
    font-size: 0.88rem;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Ocultar bottom nav y sheet en desktop */
  .bottom-nav,
  .mobile-sheet,
  .sheet-backdrop {
    display: none !important;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .navbar {
    padding: 12px 16px;
    gap: 12px;
  }

  .brand-sub {
    display: none;
  }

  .enlaces {
    gap: 2px;
  }

  .enlaces a {
    padding: 6px 8px;
    font-size: 0.76rem;
    letter-spacing: 0.35px;
  }

  .user-name {
    max-width: 110px;
  }
}
</style>
