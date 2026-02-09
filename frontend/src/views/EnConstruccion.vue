<template>
  <div class="construccion">
    <span class="tag">Zona en desarrollo</span>
    <h1 class="headline">Estamos afinando esta pista</h1>
    <p>Estamos trabajando para mejorar el Club de Tenis Isturgi.</p>
    <p>Esta funcionalidad estara disponible en el proximo Sprint.</p>
    <router-link to="/" class="btn btn-primary">Volver al inicio</router-link>
  </div>
</template>

<style scoped>
.construccion {
  text-align: center;
  display: grid;
  gap: 12px;
  padding: 50px 32px;
  border-radius: var(--radius-lg);
  background: rgba(9, 13, 15, 0.75);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow);
}
.construccion p {
  color: rgba(234, 242, 239, 0.7);
  margin: 0;
}
</style>