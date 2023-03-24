<template>
    <div class="echart-gmap-wrapper">
        <ft-echart v-if="echartKey > 0"
            @init="getEchartsOption"
            :key="echartKey"
            :echartOption="echartOption"
            :gmap="true"
        >
        </ft-echart>
    </div>
</template>


<script>
    import FtEchart from './FtEchart.vue';
    import { gmapsThemes , dfToEchart} from './geojson_gmap';
    import _ from 'lodash';

    const gmapInitialOption = {
          center: [-51.9253, -14.2350],
          zoom: 4,
          renderOnMoving: true,
          echartsLayerZIndex: 2020,
          roam: true,
          styles: gmapsThemes['lightBlueWater']
    }

    export default {
        name: 'ft-timeline-geo-echart',
        components:{
            FtEchart
        },
        props: {
            data: {required:true}
        },
        data(){
            return {
                gmap: null,
                myChart: null,
                apiKey: 'AIzaSyAlIZXl2MiwZP1mMAEp4q-8cfZ_y1tdNPQ',
                echartOption: {},
                echartKey: 0,
                mode: 'admin1'
            }
        },
        mounted(){
            this.echartOption = {
                gmap: {
                    ...gmapInitialOption
                }
            };
            this.loadGmaps('gmap-script', () => {
                this.echartKey ++
            });
        },
        methods: {
            getEchartsOption(myChart){
                if(!this.myChart){
                    this.mychartInitials(myChart)
                }
                let option = dfToEchart(JSON.parse(JSON.stringify(this.data)), this.gmap);
                this.myChart.setOption(option);
                this.myChart.setOption({'visualMap': option.visualMap});

            },
            getEchartsOptionAdmn2(myChart){

            },
            getEchartsOptionAdmn3(myChart){

            },
            mychartInitials(myChart){
                this.myChart = myChart;
                this.gmap = this.myChart.getModel().getComponent('gmap').getGoogleMap();
                this.myChart.on('click', params => {
                    if(this.mode === 'admin1'){
                        this.get
                    }
                })
            },
            loadGmaps(elId, _callback){
                let el = document.getElementById(elId);
                if(!el){
                    el = document.createElement('script');
                    el.type = 'text/javascript';
                    el.id = elId;
                    el.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=Function.prototype`;
                    el.onload = (res) => {
                        _callback();
                    }
                    document.head.appendChild(el);
                } else{
                    _callback();
                }
            }
        }
    }
</script>


<style>
    .echart-gmap-wrapper {
        width: 100%;
        height: 82vh;
    }
</style>