<template>
  <div class="olympics-div"> Server Response: {{JSON.stringify(res)}}</div>
</template>

<script>
  export default {
    name: 'OlympicsView',
    data(){
      return {
        res: {}
      }
    },
    created(){
      this.axios.get('/olympics').then(data => {
        this.res = data.data;
      }).catch(error => {
        this.res = error;
      });
    }
  };
</script>

<style lang="scss">
  .olympics-div {
    color: $primary;
  }

</style>