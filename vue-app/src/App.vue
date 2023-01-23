<script setup>
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  
  <header>
    <h1> Mahalo</h1>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style>
</style>
