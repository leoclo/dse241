<template>
    <div ref="my_echart" class="ft-echart-wrapper"></div>
</template>

<script>
  import * as echarts from 'echarts';
  import { FtTheme } from './theme';

  export default {
    name: 'ft-echart',
    props: {chartOption: {}},
    data(){
      return {
          myChart: {},
      }
    },
    mounted() {
      echarts.registerTheme('ft-theme', FtTheme);
      this.myChart = echarts.init(this.$refs.my_echart, 'ft-theme');
      this.myChart.setOption({
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line'
          }
        ]
      });
    }
  }

</script>

<style>
  .ft-echart-wrapper {
    width: 100%;
    height: 100%;
  }
</style>