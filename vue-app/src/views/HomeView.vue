<template>
  <div class="aloha"> Server Response: {{JSON.stringify(res)}}</div>
</template>

<script>
  import { RouterLink, RouterView } from 'vue-router';

  export default {
    name: 'HomeView',
    data(){
      return {
        res: {}
      }
    },
    created(){
      this.axios.defaults.baseURL = 'http://localhost:5000/';
      this.axios.get('/health').then(data => {
        this.res = data.data;
      }).catch(error => {
        this.res = error;
      });
    }
  };
</script>
<style lang="scss">
  .aloha {
    color: $primary;
  }

</style>