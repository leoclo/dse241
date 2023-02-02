<template>
  <ft-container>
    <template #title><label> Olympics Visualization</label></template>
    <div class="olympics-div"> Server Response: {{JSON.stringify(res)}}</div>
    <div class="ft-heatmap-chart" v-if="res">
      <FtEchart></FtEchart>
    </div>
  </ft-container>
</template>

<script>
  import FtContainer from '@/components/utils/ft-container/FtContainer.vue';
  import FtEchart from '@/components/structures/ft-echart/FtEchart.vue';

  export default {
    name: 'OlympicsView',
    components: {
      FtContainer,
      FtEchart
    },
    data(){
      return {
        res: {},
        heatmap: [],
      }
    },
    created(){
      this.axios.get('/olympics').then(data => {
        this.heatmap = JSON.parse(data.data.df_heatmap);
        this.res = {'success': true, heatmapShape: this.heatmap.length};
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
  .ft-heatmap-chart {
    height: 75vh;
    width: 100vw;
  }

</style>