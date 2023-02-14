<template>
    <ft-container>
        <template #title><label>  CO<sub>2</sub> Visualization</label></template>
        <div v-if="!res.success" class="resp-div ft-pt-2 ft-pl-2"> Server Response: {{JSON.stringify(res)}}</div>
        <div class="ft-chart" v-if="res.success">
            <span><ft-geochart @init="initializeMap" :data="map"></ft-geochart></span>
        </div>
        <div v-if="showLineChart">
            <ft-modal @close="showLineChart=false" width="90%">
                <template #header>
                    State Line Chart
                </template>
                <div class="ft-co2-line-chart">
                    <ft-linechart :data="line"></ft-linechart>
                </div>
            </ft-modal>
        </div>
        
    </ft-container>
  </template>

<script>
    import FtGeochart from '@/components/structures/ft-echart/FtGeochart.vue';
    import FtLinechart from '@/components/structures/ft-echart/FtLinechart.vue';
    import FtContainer from '@/components/utils/ft-container/FtContainer.vue';
    import FtModal from '@/components/utils/ft-modal/FtModal.vue';

    export default {
        name: 'Co2View',
        components:{
            FtContainer,
            FtGeochart,
            FtModal,
            FtLinechart
        },
        data(){
            return {
                res: {},
                map: {},
                line: {},
                showLineChart: false
            }
        },
        created(){
            this.axios.get('/co2').then(data => {
                this.map = data.data.map;
                this.res = {'success': true, heatmapShape: this.map.length};
            }).catch(error => {
                this.res = error;
            });
        },
        methods: {
            get_line_spec(spec){
                this.axios.get(`/co2-spec`, {params: {'spec': spec}}, ).then(data => {

                    this.line = data.data.line;
                    this.showLineChart = true;
                    // this.res = {'success': true, heatmapShape: this.map.length};
                }).catch(error => {
                    this.res = error;
                });
            },
            initializeMap(myChart){
                myChart.on('click', params => {
                    if (params.componentType === 'title') {
                        this.get_line_spec('US')
                        return;
                    }
                    if(params.componentType === 'series'){
                        if(params.name == 'Puerto Rico'){
                            alert('No data for Puerto Rico')
                            return;
                        }
                        this.get_line_spec(params.name);
                        return;
                    }
                })
            }
        }
    }
</script>
  
<style lang="scss">
    .resp-div {
        color: $primary;
    }

    .ft-chart {
        width: 100%;
    }

    .ft-co2-line-chart {
        display: block;
        width: 100%;
        height: 75vh;
    }

    .ft-chart span {
        display: block;
        padding-top: 2rem;
    }

</style>