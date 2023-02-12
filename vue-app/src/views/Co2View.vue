<template>
    <ft-container>
        <template #title><label>  CO<sub>2</sub> Visualization</label></template>
        <div v-if="!res.success" class="resp-div ft-pt-2 ft-pl-2"> Server Response: {{JSON.stringify(res)}}</div>
        <div class="ft-chart" v-if="res.success">
            <span><ft-geochart :data="map"></ft-geochart></span>
        </div>
        
    </ft-container>
  </template>

<script>
    import FtGeochart from '@/components/structures/ft-echart/FtGeochart.vue';
    import FtContainer from '@/components/utils/ft-container/FtContainer.vue';
    // import FtGeoChart from '@/components/structures/ft-echart/FtGeoChart.vue';

    export default {
        name: 'Co2View',
        components:{
            FtContainer,
            FtGeochart
        },
        data(){
            return {
                res: {},
                map: [],
            }
        },
        created(){
        this.axios.get('/co2').then(data => {
            this.map = data.data.map;
            this.res = {'success': true, heatmapShape: this.map.length};
        }).catch(error => {
            this.res = error;
        });
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

    .ft-chart span {
        display: block;
        padding-top: 2rem;
    }

</style>