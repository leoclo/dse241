<template>
    <div class="timeline-geochart-wrapper">
        <ft-echart :key="echartKey" :echartOption="echartOption" :geojsonMapRef="geojsonMapRef"></ft-echart>
    </div>
</template>

<script>
    import FtEchart from './FtEchart.vue';
    import { caGeoJson } from './california_geojson';
    import { echartBaseOption, dfToEchart} from './ca_map.js';
    import _ from 'lodash';


    export default {
        name: 'ft-timeline-geo-echart',
        components:{
            FtEchart
        },
        props: {data: {required:true}},
        data(){
            return {
                echartOption: {},
                geojsonMapRef: {
                    'ca-counties': {
                        geojson: {...caGeoJson},
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
                let option = {baseOption: {...echartBaseOption}};
                
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
    .timeline-geochart-wrapper {
        width: 100%;
        height: 82vh;
    }
</style>