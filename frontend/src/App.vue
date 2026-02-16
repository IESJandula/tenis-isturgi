<template>
  <div class="app-layout">
    <Navbar />
    
    <main class="page">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
</script>

<style>
.app-layout {
  min-height: 100vh;
}
</style>