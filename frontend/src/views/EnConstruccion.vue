<template>
  <div class="construccion">
    <h1>🚧 Sección en Desarrollo</h1>
    <p>Estamos trabajando para mejorar el Club de Tenis Isturgi.</p>
    <p>Esta funcionalidad estará disponible en el próximo Sprint.</p>
    <router-link to="/" class="btn-volver">Volver al Inicio</router-link>
  </div>
</template>

<style scoped>
.construccion {
  text-align: center;
  margin-top: 50px;
  color: white;
  padding: 50px;
  border: 2px dashed #444;
  border-radius: 10px;
}
h1 { color: #bfff00; }
.btn-volver {
  display: inline-block;
  margin-top: 20px;
  background: #bfff00;
  color: #222;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
}
</style>