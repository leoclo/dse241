<template>
    <ft-container>
      <template #title><label> Sheep Visualization</label></template>
      <div v-if="!res.success" class="resp-div"> Server Response: {{JSON.stringify(res)}}</div>
      <div class="ft-chart" v-if="res.success">
        <span><ft-graph :data="graph"></ft-graph></span>
      </div>
    </ft-container>
  </template>
  
  <script>
    import FtContainer from '@/components/utils/ft-container/FtContainer.vue';
    import FtGraph from '@/components/structures/ft-echart/FtGraph.vue';

    export default {
      name: 'sheep-view',
      components: {
        FtContainer,
        FtGraph
      },
      data(){
        return {
          res: {},
          graph: {}
        }
      },
      created(){
        this.axios.get('/sheep').then(data => {
          console.log(data)
          this.graph = data.data.graph;
          this.res = {'success': true };
        }).catch(error => {
          this.res = error;
        });
      }
    };
  </script>
  
  <style lang="scss">
    .resp-div {
      color: $primary;
    }
    .ft-chart {
      width: 100%;
    }
  
    .ft-chart span {
      display: block;
      padding-top: 2rem;
    }
  
  </style>