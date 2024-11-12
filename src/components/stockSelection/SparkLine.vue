<!-- 折线图标 -->
<template>
    <div ref="root" class="stock-chart-svg_4vRMv" style="width:100%; height: 100%;">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" :key="color">
            <line x1="0" y1="30%" :x2="lineWidth" y2="30%" stroke-dasharray="2 2"
                :style="{ stroke: color, 'stroke-width': 1 }"></line>
            <defs style="width:100%">
                <linearGradient style="width:100%" :id="props.ratio + ''" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" :stop-color="stopStartColor"></stop>
                    <stop offset="100%" :stop-color="stopEndColor"></stop>
                </linearGradient>
            </defs>
            <polygon :points="shadowPoints"
                :style="`fill:url(#${Number(props.ratio)}); stroke: none; opacity: 1; width:100%`">
            </polygon>
            <polyline :points="newPoints" :style="`fill: none; stroke: ${color}; stroke-width:${polylineStrokeWidth}; width:100%`">
            </polyline>
        </svg>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
const root = ref()

const props = defineProps({
    points: {
        type: [Number, String],
        default: ''
    },
    polylineStrokeWidth:{
        type:Number,
        default:1
    },
    ratio: {
        type: [Number, String],
        default: 0
    },
    xtimes: {
        type: Number,
        default: 1
    },
    ytimes: {
        type: Number,
        default: 1
    },
    height : {
        type: Number,
        default: 30,
    }
})

const color = computed(() => {
    if (props.ratio > 0) {
        return '#55C860'
    } else if (props.ratio < 0) {
        return '#FD4938'
    } else {
        return '#6C7B90'
    }
})
const lineWidth = ref(0);
const newPoints = computed(() => 
    props.points ? props.points.split(' ').map((val) => { const [x,y] = val.split(','); return `${parseFloat(x)*props.xtimes},${parseFloat(y)*props.ytimes}`}).join(' ') : props.points)
const shadowPoints = computed(() => {
    // 获取 polyline 的点
    const points = newPoints.value.split(' ').map(point => point.split(','));
    // 获取 SVG 的高度
    lineWidth.value = parseFloat(points[points.length-1][0]) - parseFloat(points[0][0]) ; 
    // const svgHeight = root.value ? root.value.clientHeight : 50;
    // 构建 shadowPoints，多边形覆盖 polyline 并扩展到底部
    const shadowPoints = points.map(p => p.join(',')).join(' ') + ` ${points[points.length - 1][0]},${props.height*props.ytimes} ${points[0][0]},${props.height*props.ytimes}`;
    return shadowPoints;
})

const stopStartColor = computed(() => {
    if (props.ratio > 0) {
        return 'rgba(57, 179, 98, 0.15)'
    } else if (props.ratio < 0) {
        return 'rgba(253, 73, 56, 0.15)'
    } else {
        return 'rgba(108, 123, 144, 0.15)'
    }
})
const stopEndColor = computed(() => {
    if (props.ratio > 0) {
        return 'rgba(57, 179, 98, 0)'
    } else if (props.ratio < 0) {
        return 'rgba(253, 73, 56, 0)'
    } else {
        return 'rgba(108, 123, 144, 0)'
    }
})
</script>