<template>
    <ft-container>
      <template #title><label> Virus Visualization</label></template>
      <div v-if="!res.success" class="resp-div"> Server Response: {{JSON.stringify(res)}}</div>
      <div class="ft-chart" v-if="res.success">
        <span><ft-timeline-geo-echart :data="geo_heatmap"></ft-timeline-geo-echart></span>
      </div>
    </ft-container>
  </template>
  
  <script>
    import FtContainer from '@/components/utils/ft-container/FtContainer.vue';
    import FtTimelineGeoEchart from '@/components/structures/ft-echart/FtTimelineGeoEchart.vue';
    

    export default {
      name: 'virus-view',
      components: {
        FtContainer,
        FtTimelineGeoEchart
      },
      data(){
        return {
          res: {},
          geo_heatmap: {}
        }
      },
      created(){
        this.axios.get('/virus').then(data => {
            this.geo_heatmap = data.data.geo_heatmap;
            console.log(data)
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