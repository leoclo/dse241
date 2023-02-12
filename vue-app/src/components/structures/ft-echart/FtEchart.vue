<template>
    <div ref="my_echart" class="ft-echart-wrapper"></div>
</template>

<script>
  import * as echarts from 'echarts';
  import { FtTheme } from './theme';
  import _ from 'lodash';
  var myChart = {};

  export default {
    name: 'ft-echart',
    props: {echartOption: {required:true}, geojsonMapRef: {default: ()=> []}},
    created() {
      
      echarts.registerTheme('ft-theme', FtTheme);

      Object.keys(this.geojsonMapRef).forEach(k => {
        echarts.registerMap(
          k, this.geojsonMapRef[k].geojson,
          _.get(this.geojsonMapRef[k], 'extra', {}) 
        );
      });
    },
    mounted(){
      this.initialize()
    },  
    methods: {
      initialize(){
        myChart = echarts.init(this.$refs.my_echart, 'ft-theme');
        myChart.setOption(this.echartOption);
      }
    }
  }

</script>

<style>
  .ft-echart-wrapper {
    width: 100%;
    height: 100%;
  }
</style>