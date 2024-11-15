<template>
    <div ref="chartDom">
        
    </div>
</template>
<script setup>
import * as echarts from 'echarts';
import {onMounted, ref, watch} from 'vue'
const props = defineProps({
    seriesName:String,
    color:{
        type:Array,
        default:()=>[]
    },
    data:{
        type:Array,
        default:()=>[]
    }
})

let myChart = null
const chartDom = ref(null)
watch(()=>props.data,()=>{
    if(!myChart){
        return
    }
    updateChart()
})
const updateChart = ()=>{
    const option = {
        color:props.color,
        tooltip: {
            trigger: 'item'
        },
        grid:{
            top:'0%'
        },
        legend: {
            show:false,
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: props.seriesName,
                type: 'pie',
                radius: ['35%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                    show: false,
                    fontSize: 40,
                    fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: props.data
            }
        ]
    };
    myChart.setOption(option);
}
onMounted(()=>{
    myChart = echarts.init(chartDom.value);
    updateChart()
})



</script>