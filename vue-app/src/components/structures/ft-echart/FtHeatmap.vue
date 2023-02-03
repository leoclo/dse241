<template>
    <div class="heatmap-wrapper">
        <ft-echart :key="echartKey" :echartOption="echartOption"></ft-echart>
    </div>
</template>

<script>
  import FtEchart from './FtEchart.vue';
  import { echartBaseOption, dfToEchart} from './heatmap.js'
  import _ from 'lodash';

  export default {
    name: 'ft-heatmap',
    components:{
      FtEchart
    },
    props: {df: {required:true}},
    data(){
      return {
        echartOption: {},
        echartKey: 0
      }
    },
    mounted(){
      this.echartOption = this.getEchartsOption();
      this.echartKey ++;
    },
    methods: {
      getEchartsOption(){
        let option = {baseOption: { ...echartBaseOption}, options: []};
        let xColName = 'Sport';
        let yColName = 'Country';
        let valColName = 'Medal';

        let echartDataRef = dfToEchart(this.df, xColName, yColName, valColName);
        Object.keys(echartDataRef).forEach(k => {
          _.set(option, k, echartDataRef[k]);
        })
        console.log(option);
        return option;
      }
    }
  }

</script>

<style>
  .heatmap-wrapper {
    width: 100%;
    height: 82vh;
  }
</style>