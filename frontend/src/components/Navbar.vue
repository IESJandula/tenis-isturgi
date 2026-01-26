<template>
  <nav class="navbar">
    <div class="logo">
      <router-link to="/">
        <span>🎾 Club Tenis Isturgi</span>
      </router-link>
    </div>

    <div class="enlaces">
      <router-link to="/">Inicio</router-link>
      <router-link to="/club">El Club</router-link>
      <router-link to="/escuela">Escuela</router-link>
      <router-link to="/liga">Liga</router-link>
      <router-link to="/torneos">Torneos</router-link>
      <router-link to="/contacto">Contacto</router-link>
      
      <router-link to="/login" class="btn-login">🔒 Soy Socio</router-link>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #bfff00; /* Verde pelota */
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  position: sticky; /* Se queda pegado arriba al bajar */
  top: 0;
  z-index: 1000;
}

.logo a {
  text-decoration: none;
}

.logo span {
  font-weight: 800;
  font-size: 1.5rem;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.enlaces {
  display: flex;
  align-items: center;
}

.enlaces a {
  margin-left: 20px;
  text-decoration: none;
  color: #2c3e50;
  font-weight: 700;
  font-size: 0.95rem;
  transition: color 0.3s;
  text-transform: uppercase;
}

.enlaces a:hover {
  color: #555;
  text-decoration: none;
}

/* El enlace activo (donde estás ahora) */
.router-link-active {
  border-bottom: 3px solid #2c3e50;
}

/* --- ESTILO ESPECIAL PARA EL BOTÓN DE SOCIO --- */
.btn-login {
  background-color: #2c3e50;
  color: #bfff00 !important; /* Texto verde */
  padding: 8px 18px;
  border-radius: 30px;
  border: 2px solid #2c3e50;
  margin-left: 30px !important; /* Separarlo más del resto */
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

/* Quitamos el subrayado activo del botón login para que no quede raro */
.btn-login.router-link-active {
  border-bottom: 2px solid #2c3e50; 
}

.btn-login:hover {
  background-color: transparent !important;
  color: #2c3e50 !important; /* Texto oscuro al pasar ratón */
  border-color: #2c3e50;
  transform: translateY(-2px); /* Efecto de elevación */
}

/* Ajuste para móviles (Responsive básico) */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    padding: 1rem;
  }
  .enlaces {
    margin-top: 15px;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
  .enlaces a {
    margin: 5px;
    font-size: 0.8rem;
  }
  .btn-login {
    margin-left: 5px !important;
  }
}
</style>