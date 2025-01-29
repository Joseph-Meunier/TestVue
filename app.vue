<script setup lang="ts">
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';

</script>

<template>
  <NuxtLayout>
    <Header/>
      <NuxtPage />
    <Footer/>
  </NuxtLayout>
</template>
