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
    import { gmapsThemes , dfToEchart, dfToEchartScatter} from './geojson_gmap';
    import _ from 'lodash';

    const gmapInitialOption = {
          center: [-51.9253, -21.2350],
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
                // "title":{
                //     "text": "Google Maps Piles Data",
                //     "left": "center",
                // },
                "toolbox":{
                    "show": true,
                    "left": "center",
                    iconStyle: {
                        borderColor: '#5A5A5A',
                        borderWidth: 2
                    },
                    "feature": {
                        "saveAsImage": {
                            "type": "png"
                        },
                        myTool: {
                            show: true,
                            title: 'Return',
                            onclick: () => {
                                this.myChart.showLoading();
                                this.getEchartsOption()
                            },
                            icon: {
                                path: 'M22,1.4L9.9,13.5l12.3,12.3 M10.3,13.5H54.9v44.6 H10.3v-26'
                            }
                        }
                    }
                },
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
                this.myChart.showLoading();
                let option = dfToEchart(JSON.parse(JSON.stringify(this.data)), this.gmap);
                this.myChart.setOption({...option, gmap: {zoom:4}});
                this.myChart.setOption({'visualMap': option.visualMap});
                this.mode = 'admin1'
                this.myChart.hideLoading();
            },
            getEchartsOptionAdmn2(data, row){
                let option = dfToEchart(JSON.parse(JSON.stringify(data)), this.gmap);
                this.myChart.setOption(
                    {...option, gmap: {center: [row.center_area_long, row.center_area_lat], zoom: 7}}
                )
                // this.myChart.setOption(option, {
                //     replaceMerge: ['visualMap', 'series', 'tooltip']
                // });
                this.myChart.setOption({'visualMap': option.visualMap});
                this.mode = 'admin2'
            },
            getEchartsOptionAdmn3(data, row){
                let option = dfToEchartScatter(JSON.parse(JSON.stringify(data)));
                this.myChart.setOption(
                    {...option, gmap: {center: [row.center_area_long, row.center_area_lat], zoom: 10}}
                )
                // this.myChart.setOption(option, {
                //     replaceMerge: ['visualMap', 'series', 'tooltip']
                // });
                this.myChart.setOption({'visualMap': option.visualMap});
                this.mode = 'admin3';
            },
            mychartInitials(myChart){
                this.myChart = myChart;
                this.gmap = this.myChart.getModel().getComponent('gmap').getGoogleMap();
                this.myChart.on('click', params => {
                    if(this.mode === 'admin1'){
                        this.myChart.showLoading();
                        this.axios.get('/piles',  {params: {'admin1': params.name}}).then(data => {
                            this.myChart.hideLoading();
                            this.getEchartsOptionAdmn2(data.data.custom, params.data.row)
                        }).catch(error => {
                            this.myChart.hideLoading();
                            console.log(error)
                            alert('error fetching data')
                        });
                    }
                    if(this.mode === 'admin2'){
                        this.myChart.showLoading();
                        this.axios.get('/piles-area',  {params: {'admin1': params.data.row.admin1, 'admin2': params.name}}).then(data => {
                            this.myChart.hideLoading();
                            console.log(data.data.scatter);
                            this.getEchartsOptionAdmn3(data.data.scatter, params.data.row)
                        }).catch(error => {
                            this.myChart.hideLoading();
                            console.log(error)
                            alert('error fetching data')
                        });
                    }
                })
            },
            loadGmaps(elId, _callback){
                let el = document.getElementById(elId);
                if(!el){
                    el = document.createElement('script');
                    el.type = 'text/javascript';
                    el.id = elId;
                    el.src = `https://maps.googleapis.com/maps/api/js?key=${window.GOOGLE_API_KEY}&callback=Function.prototype`;
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