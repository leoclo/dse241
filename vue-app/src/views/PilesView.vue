<template>
    <ft-container>
      <template #title><label> Piles Visualization</label></template>
      <div v-if="!res.success" class="resp-div"> Server Response: {{JSON.stringify(res)}}</div>
      <div class="ft-chart" v-if="res.success">
        <span><ft-gmap-echart :data="custom"></ft-gmap-echart></span>
      </div>
    </ft-container>
  </template>

  <script>
    import FtContainer from '@/components/utils/ft-container/FtContainer.vue';
    import FtGmapEchart from '@/components/structures/ft-echart/FtGmapEchart.vue';

    export default {
      name: 'piles-view',
      components: {
        FtContainer,
        FtGmapEchart
      },
      data(){
        return {
          res: {},
          custom: {}
        }
      },
      created(){
        this.get_piles()
      },
      methods:{
        get_piles(){
          this.axios.get('/piles',  {params: {'admin1': null}}).then(data => {
          this.custom = data.data.custom;
          this.res = {'success': true };
          }).catch(error => {
            this.res = error;
          });
        }
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
      padding-top: 0.5rem;
    }

  </style>