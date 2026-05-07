<template>
  <div class="app-layout">
    <ToastHost />
    <Navbar />

    <main class="page">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
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

/* Padding inferior en móvil para no quedar oculto bajo el bottom nav */
.page {
  padding-bottom: calc(var(--bottom-nav-h) + 40px);
}

@media (min-width: 769px) {
  .page {
    padding-bottom: 80px;
  }
}
</style>