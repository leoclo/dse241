<template>
    <div class="linechart-wrapper">
        <ft-echart  :key="echartKey" :echartOption="echartOption"></ft-echart>
    </div>
</template>

<script>
    import FtEchart from './FtEchart.vue';
    import { echartBaseOption, dfToEchart} from './line.js';
    import _ from 'lodash';

    export default {
        name: 'ft-linechart',
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
                let echartDataRef = dfToEchart(this.data);
                Object.keys(echartDataRef).forEach(k => {
                    _.set(option, k, echartDataRef[k]);
                })
                return option;
            }
        }
    }

</script>

<style>
    .linechart-wrapper {
        width: 100%;
        height: 100%;
    }
</style>