<template>
    <div 
      ref="my_echart" 
      class="ft-echart-wrapper" 
      :class="{'echarts-gmap': gmap}" 
      >
    </div>
</template>

<script>
  import * as echarts from 'echarts';
  import 'echarts-extension-gmap';

  import { FtTheme } from './theme';
  import _ from 'lodash';
  var myChart = {};

  export default {
    name: 'ft-echart',
    props: {
      echartOption: {required:true},
      geojsonMapRef: {default: ()=> []},
      gmap: {default: false}
    },
    created(){
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
        this.$emit('init', myChart);
      }
    }
  }

</script>

<style>
  .ft-echart-wrapper {
    width: 100%;
    height: 100%;
    
  }
  .echarts-gmap:first-child {
    overflow: hidden;
    position: absolute;
    width: 96vw;
    height: 74vh;
  }
</style>