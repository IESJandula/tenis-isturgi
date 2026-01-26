<template>
  <div class="app-layout">
    <Navbar />
    
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
</script>

<style>
body {
  margin: 0;
  background-color: #222;
  color: white;
  font-family: sans-serif;
}
main {
  padding: 20px;
}
</style>