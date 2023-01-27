<template>
  <div class="home-div"> Server Response: {{JSON.stringify(res)}}</div>
</template>

<script>
  export default {
    name: 'HomeView',
    data(){
      return {
        res: {}
      }
    },
    created(){
      this.axios.get('/health').then(data => {
        this.res = data.data;
      }).catch(error => {
        this.res = error;
      });
    }
  };
</script>

<style lang="scss">
  .home-div {
    color: $primary;
  }

</style>