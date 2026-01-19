<template>
  <div class="home">
    <h1>Club de Tenis Isturgi 🎾</h1>
    <h2>Últimas Noticias</h2>

    <p v-if="cargando">Cargando noticias...</p>
    
    <p v-else-if="error" class="error">{{ error }}</p>

    <div v-else class="lista-noticias">
      <div v-for="noticia in noticias" :key="noticia.id" class="tarjeta-noticia">
        <h3>{{ noticia.Titulo || noticia.titulo }}</h3>
        <p>{{ noticia.Descripcion || noticia.descripcion }}</p>
        
        <small v-if="noticia.publishedAt">
          Publicado: {{ new Date(noticia.publishedAt).toLocaleDateString() }}
        </small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const noticias = ref([]);
const cargando = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    // 1. Petición a Strapi
    const respuesta = await axios.get('http://localhost:1337/api/noticias');
    
    console.log("Datos recibidos de Strapi:", respuesta.data); // Chivato en consola F12

    // 2. Guardamos los datos
    // En Strapi 5, a veces viene en 'data' y otras directo, pero lo normal es data.data
    noticias.value = respuesta.data.data; 

  } catch (e) {
    console.error("Error de conexión:", e);
    error.value = 'Error al cargar noticias. Revisa la consola (F12).';
  } finally {
    cargando.value = false;
  }
});
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.tarjeta-noticia {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #2c2c2c; /* Fondo oscuro para que destaque en tu tema */
  color: white;
}
.error {
  color: red;
  font-weight: bold;
}
</style>