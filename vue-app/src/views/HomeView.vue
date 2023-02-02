<template>
  <ft-container>
    <template #title><label> Home Server Health</label></template>
    <div class="home-div ft-pt-2 ft-pl-2"> Server Response: {{JSON.stringify(res)}}</div>
  </ft-container>
</template>

<script>

  import FtContainer from '@/components/utils/ft-container/FtContainer.vue';

  export default {
    name: 'HomeView',
    components:{
      FtContainer
    },
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