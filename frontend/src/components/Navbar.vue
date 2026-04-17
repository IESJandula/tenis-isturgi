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
      <router-link v-if="isAuthenticated() && !isAdmin()" to="/disponibilidad" @click="closeMenu">Mi Disponibilidad</router-link>
    </div>

    <!-- Zona usuario (visible siempre) -->
    <div class="navbar-right">
      <router-link v-if="!isAuthenticated()" to="/login" class="btn-login" @click="closeAllMenus">Soy Socio</router-link>

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

  <!-- ② Bottom nav: solo móvil -->
  <nav class="bottom-nav" aria-label="Navegación principal">
    <router-link to="/" class="bnav-item" @click="closeAllMenus">
      <svg class="bnav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
      <span>Inicio</span>
    </router-link>

    <router-link to="/liga" class="bnav-item" @click="closeAllMenus">
      <svg class="bnav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
      <span>Liga</span>
    </router-link>

    <router-link to="/torneos" class="bnav-item" @click="closeAllMenus">
      <svg class="bnav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M6 9H4.5a2.5 2.5 0 000 5H6"/><path d="M18 9h1.5a2.5 2.5 0 010 5H18"/><path d="M8 9h8v10H8z"/><path d="M12 19v3"/><path d="M8 22h8"/>
      </svg>
      <span>Torneos</span>
    </router-link>

    <router-link to="/escuela" class="bnav-item" @click="closeAllMenus">
      <svg class="bnav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
      <span>Escuela</span>
    </router-link>

    <button
      type="button"
      class="bnav-item"
      :class="{ 'bnav-active': menuOpen }"
      @click="toggleMenu"
      aria-label="Más opciones"
    >
      <svg class="bnav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
      <span>Más</span>
    </button>
  </nav>

  <!-- ③ Panel deslizante (sheet) para las rutas secundarias en móvil -->
  <Transition name="sheet">
    <div v-if="menuOpen" class="mobile-sheet" role="dialog" aria-modal="true" aria-label="Más opciones de navegación">
      <div class="sheet-handle" @click="closeMenu" role="button" aria-label="Cerrar menú" tabindex="0"></div>
      <nav class="sheet-links">
        <router-link to="/club"     class="sheet-link" @click="closeMenu"><span class="sheet-icon">🏛️</span>El Club</router-link>
        <router-link to="/galeria"  class="sheet-link" @click="closeMenu"><span class="sheet-icon">🖼️</span>Galería</router-link>
        <router-link to="/noticias" class="sheet-link" @click="closeMenu"><span class="sheet-icon">📰</span>Noticias</router-link>
        <router-link to="/contacto" class="sheet-link" @click="closeMenu"><span class="sheet-icon">📍</span>Contacto</router-link>
        <router-link v-if="isAuthenticated() && !isAdmin()" to="/disponibilidad" class="sheet-link" @click="closeMenu"><span class="sheet-icon">📅</span>Mi Disponibilidad</router-link>
        <router-link v-if="!isAuthenticated()" to="/login" class="sheet-link sheet-cta" @click="closeMenu">Soy Socio →</router-link>
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
/* ═══════════════════════════════════════
   TOP NAVBAR  (mobile-first)
═══════════════════════════════════════ */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
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
  filter: brightness(1.06);
}

.sheet-backdrop {
  position: fixed;
  inset: 0;
  z-index: 140;
  background: rgba(0, 0, 0, 0.55);
}

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
</style>