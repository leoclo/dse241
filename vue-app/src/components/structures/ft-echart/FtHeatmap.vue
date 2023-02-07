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
  props: {data: {required:true}},
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
      let option = {...echartBaseOption};
      let xColName = 'Year';
      let yColName = 'Country';
      let valColName = 'Medal';
      let echartDataRef = dfToEchart(this.data.df, xColName, yColName, valColName, this.data.all_countries);
      Object.keys(echartDataRef).forEach(k => {
        _.set(option, k, echartDataRef[k]);
      })

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
