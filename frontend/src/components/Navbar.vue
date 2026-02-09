<template>
  <nav class="navbar">
    <div class="brand">
      <router-link to="/" class="brand-link">
        <span class="brand-mark headline">Isturgi</span>
        <span class="brand-sub">Club de Tenis · Andujar</span>
      </router-link>
      <span class="brand-tag">Tierra, pista y comunidad</span>
    </div>

    <div class="enlaces">
      <router-link to="/">Inicio</router-link>
      <router-link to="/club">El Club</router-link>
      <router-link to="/escuela">Escuela</router-link>
      <router-link to="/liga">Liga</router-link>
      <router-link to="/torneos">Torneos</router-link>
      <router-link to="/contacto">Contacto</router-link>
      
      <router-link to="/login" class="btn-login">Soy Socio</router-link>
    </div>
  </nav>
</template>

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
  gap: 6px;
}

.brand-link {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-mark {
  font-size: 1.8rem;
  color: var(--ball);
  text-transform: uppercase;
}

.brand-sub {
  font-size: 0.85rem;
  color: rgba(234, 242, 239, 0.75);
  text-transform: uppercase;
  letter-spacing: 1.2px;
}

.brand-tag {
  font-size: 0.8rem;
  color: rgba(199, 255, 52, 0.75);
  text-transform: uppercase;
  letter-spacing: 0.8px;
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

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
  }
  .enlaces {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>