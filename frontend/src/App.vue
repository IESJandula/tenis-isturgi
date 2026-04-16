<template>
  <div class="app-layout">
    <ToastHost />
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
import ToastHost from './components/ToastHost.vue';
</script>

<style>
.app-layout {
  min-height: 100vh;
}
</style>