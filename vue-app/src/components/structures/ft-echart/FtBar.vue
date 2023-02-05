<template>
    <div class="chart-wrapper">
        <ft-echart :key="echartKey" :echartOption="echartOption"></ft-echart>
    </div>
</template>

<script>
  import FtEchart from './FtEchart.vue';
  import { echartBaseOption, dfToEchart} from './bar.js'
  import _ from 'lodash';

  export default {
    name: 'ft-bar',
    components:{
      FtEchart
    },
    props: {
        data: {required:true}
    },
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
        let xColName = 'Country';
        let valColName = 'Sport';

        let echartDataRef = dfToEchart(this.data, xColName, valColName);
        Object.keys(echartDataRef).forEach(k => {
          _.set(option, k, echartDataRef[k]);
        })

        return option;
      }
    }
  }

</script>

<style>
  .chart-wrapper {
    width: 100%;
    height: 82vh;
  }
</style>