<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="user-info">
        <h1>Hola, {{ state.user?.username || state.user?.nombre || 'Socio' }}</h1>
        <div class="user-meta" v-if="state.user?.NumeroSocio">
          <span class="meta-tag">Socio #{{ state.user.NumeroSocio }}</span>
          <span class="meta-tag ranking">{{ state.user.Nivel }}</span>
          <span class="meta-tag points">{{ state.user.Puntos || 0 }} pts</span>
        </div>
        <p v-else>Miembro del Club de Tenis Isturgi</p>
      </div>
      <button @click="handleLogout" class="btn-logout">Cerrar Sesión</button>
    </header>

    <div class="dashboard-grid">
      <!-- Disponibilidad Card (Only if not Admin) -->
      <router-link v-if="!isAdmin()" to="/disponibilidad" class="dashboard-card">
        <div class="card-icon">📅</div>
        <h3>Mi Disponibilidad</h3>
        <p>Vota tus horarios para la próxima jornada de liga.</p>
        <span class="card-action">Ir ahora →</span>
      </router-link>

      <!-- Perfil Card (Only if not Admin) -->
      <router-link v-if="!isAdmin()" to="/mi-perfil" class="dashboard-card">
        <div class="card-icon">👤</div>
        <h3>Mi Perfil</h3>
        <p>Consulta tus estadísticas y datos personales.</p>
        <span class="card-action">Ver perfil →</span>
      </router-link>

      <!-- Mis Partidos Card (Only if not Admin) -->
      <router-link v-if="!isAdmin()" to="/mis-partidos" class="dashboard-card action-card">
        <div class="card-icon">🏆</div>
        <h3>Mis Partidos</h3>
        <p>Revisa tu calendario y sube el resultado de tus partidos.</p>
        <span class="card-action">Ver partidos →</span>
      </router-link>

      <!-- Admin Card (Only if Admin) -->
      <router-link v-if="isAdmin()" to="/admin-gestion" class="dashboard-card admin-card">
        <div class="card-icon">⚙️</div>
        <h3>Gestión Ligas</h3>
        <p>Panel de control para horarios, sorteos y resultados de la liga.</p>
        <span class="card-action">Acceder →</span>
      </router-link>

      <!-- Admin Mantenimiento Card (Only if Admin) -->
      <router-link v-if="isAdmin()" to="/admin-mantenimiento" class="dashboard-card maintenance-card">
        <div class="card-icon">🛠️</div>
        <h3>Mantenimiento</h3>
        <p>Gestiona noticias, torneos y datos maestros de socios.</p>
        <span class="card-action">Administrar →</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '../utils/auth';

const { state, logout, isAdmin } = useAuth();
const router = useRouter();

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
}

.user-info h1 {
  font-family: 'Outfit', sans-serif;
  font-size: 2.5rem;
  color: #ffffff;
  margin-bottom: 4px;
}

.user-info p {
  color: var(--ball);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
}

.user-meta {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.meta-tag {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
}

.meta-tag.ranking {
  border-color: var(--ball);
  color: var(--ball);
}

.meta-tag.points {
  background: linear-gradient(to right, #c7ff34, #9fcc2a);
  color: #000;
  border: none;
}

.btn-logout {
  padding: 10px 20px;
  background: rgba(255, 82, 82, 0.1);
  border: 1px solid rgba(255, 82, 82, 0.3);
  border-radius: 999px;
  color: #ff5252;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-logout:hover {
  background: #ff5252;
  color: #ffffff;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.dashboard-card {
  padding: 32px;
  background: rgba(234, 242, 239, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.dashboard-card:hover:not(.disabled) {
  transform: translateY(-8px);
  background: rgba(234, 242, 239, 0.06);
  border-color: var(--ball);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.dashboard-card h3 {
  font-size: 1.4rem;
  color: #ffffff;
  margin-bottom: 12px;
}

.dashboard-card p {
  color: rgba(234, 242, 239, 0.6);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 24px;
  flex-grow: 1;
}

.card-action {
  color: var(--ball);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.card-status {
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  align-self: flex-start;
  text-transform: uppercase;
  font-weight: 600;
}

.admin-card {
  background: rgba(199, 255, 52, 0.05);
  border-color: rgba(199, 255, 52, 0.2);
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}
</style>
