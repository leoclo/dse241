<template>
  <ft-container>
    <template #title><label> Olympics Visualization</label></template>
    <div v-if="!res.success" class="olympics-div"> Server Response: {{JSON.stringify(res)}}</div>
    <div class="ft-heatmap-chart" v-if="res.success">
      <ft-bar :data="bar"></ft-bar>
      <ft-heatmap :df="heatmap"></ft-heatmap>
      
    </div>
  </ft-container>
</template>

<script>
  import FtContainer from '@/components/utils/ft-container/FtContainer.vue';
  import FtHeatmap from '@/components/structures/ft-echart/FtHeatmap.vue';
  import FtBar from '../components/structures/ft-echart/FtBar.vue';

  export default {
    name: 'OlympicsView',
    components: {
      FtContainer,
      FtHeatmap,
      FtBar
    },
    data(){
      return {
        res: {},
        heatmap: [],
        bar: {}
      }
    },
    created(){
      this.axios.get('/olympics').then(data => {
        this.heatmap = data.data.df_heatmap;
        this.bar = data.data.bar;
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
    width: 100%;
  }

</style>