<template>
    <div class="geochart-wrapper">
        <ft-echart @init="(myChart) => $emit('init', myChart)" :key="echartKey" :echartOption="echartOption" :geojsonMapRef="geojsonMapRef"></ft-echart>
    </div>
</template>

<script>
    import FtEchart from './FtEchart.vue';
    import { usGeoJSON } from './us_geojson';
    import { echartBaseOption, dfToEchart} from './map.js';
    import _ from 'lodash';

    const extra = {
        Alaska: {
            left: -131,
            top: 25,
            width: 15
        },
        Hawaii: {
            left: -110,
            top: 25,
            width: 5
        },
        'Puerto Rico': {
            left: -76,
            top: 26,
            width: 2
        }
    }

    export default {
        name: 'ft-geochart',
        components:{
            FtEchart
        },
        props: {data: {required:true}},
        data(){
            return {
                echartOption: {},
                geojsonMapRef: {
                    'us-states': {
                        geojson: {...usGeoJSON},
                        extra: {...extra}
                    }
                },
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
                let echartDataRef = dfToEchart(this.data.df, this.data.valColName, this.data.locColName);
                Object.keys(echartDataRef).forEach(k => {
                    _.set(option, k, echartDataRef[k]);
                })
                return option;
            }
        }
    }
</script>

<style>
    .geochart-wrapper {
        width: 100%;
        height: 82vh;
    }
</style>
