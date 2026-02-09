<template>
  <div class="app-layout">
    <Navbar />
    
    <main class="page">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
</script>

<style>
.app-layout {
  min-height: 100vh;
}
</style>