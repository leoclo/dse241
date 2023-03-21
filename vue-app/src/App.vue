<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink class="app-link" :class="{active: $route.path=='/'}"  :to="{name: 'home'}">  
          Home        
        </RouterLink>
        <RouterLink class="app-link" :class="{active: $route.path.includes('/olympics')}" :to="{name: 'olympics'}">
          Olympics
        </RouterLink>
        <RouterLink class="app-link" :class="{active: $route.path.includes('/co2')}" :to="{name: 'co2'}">
          CO<sub>2</sub>
        </RouterLink>
        <RouterLink class="app-link" :class="{active: $route.path.includes('/sheep')}" :to="{name: 'sheep'}">
          Sheep
        </RouterLink>
        <RouterLink class="app-link" :class="{active: $route.path.includes('/virus')}" :to="{name: 'virus'}">
          Virus
        </RouterLink>
        <RouterLink class="app-link" :class="{active: $route.path.includes('/piles')}" :to="{name: 'piles'}">
          Piles (Final Project)
        </RouterLink>
      </nav>
    </div>
  </header>
  <div>
    <RouterView />
  </div>
  
</template>

<script>
  import { RouterLink, RouterView } from 'vue-router';

  export default {
    name: 'App',
    created(){
      this.axios.defaults.baseURL = 'http://localhost:5001';
      // this.axios.defaults.headers.get['Content-Type'] = 'application/json';
    }
  }
</script>


<style lang="scss">
  .wrapper {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  .app-link {
    color: $secondary;
    border: 2px solid $light_border_color;
    padding: 0.5rem 1rem;
    margin-left: 0.5rem;
    cursor: pointer;
    text-decoration: none;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
  }

  .app-link:focus, .app-link:hover, .app-link.active{
      color: $primary;
      border-color: rgba($primary, .4)
  }

</style>
