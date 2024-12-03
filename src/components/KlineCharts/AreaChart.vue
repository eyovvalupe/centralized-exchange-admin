<!-- 折线图 -->
<template>
    <div class="chat_area_box">
        <div class="chat_area" id="chat_area"></div>

        <!-- 加载 -->
        <div class="chat_area_loading" v-if="loading" v-loading="loading">
            
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed, ref, onBeforeUnmount, watch } from "vue"
import { init, dispose } from 'klinecharts'
import { klineConfig } from './kline.conf';
import { _time } from "../../api/modules/base.api"
import { useSocketStore } from '/@/store'
const socketStore = useSocketStore()

// 根据值来获取最大小数位数
const _maxTail = num => {
  let tail = 100
  return tail
}

let socket = null
const getWs = (fn)=>{
    if(socketStore.sokcetWS){
        fn(socketStore.sokcetWS)
    }else{
        setTimeout(()=>{
            getWs(fn)
        },100)
    }
}

const props = defineProps({
    type:'',
    symbol: '',
    color: '',
    rgbColor: '',
    showY: {
        type: Boolean,
        default: false
    }
})
const symbol = computed(() => props.symbol || '')
watch(() => props.symbol, val => {
    setTimeout(() => {
        initData()
    }, 0)
})
let chart = ''

onMounted(() => {
    if (symbol.value) {
        chart = init('chat_area')
        chart.setStyles(klineConfig)
        chart?.setScrollEnabled(true) // 是否滚动
        chart?.setOffsetRightDistance(props.showY ? 50 : 0) // 设置右边距
        chart?.setMaxOffsetLeftDistance(0) // 设置左边最大空出的边距
        chart?.setMaxOffsetRightDistance(props.showY ? 50 : 0) // 设置右边最大空出的边距

    }
    initData()
})
onBeforeUnmount(() => {
    dispose('chat_area')
    socket && socket.emit('time', '') // 取消订阅
})


const loading = ref(true)
let timeout = null
const initData = async () => {
    // 样式
    const selfStyle = {
        grid: {
            show: true,
            horizontal: {
                show: true,
                size: 1,
                color: '#EDEDED',
                style: 'dashed',
                dashedValue: [2, 2]
            },
            vertical: {
                show: true,
                size: 1,
                color: '#EDEDED',
                style: 'dashed',
                dashedValue: [2, 2]
            }
        },
        xAxis: {
            show: props.showY,
            size: 'auto'
        },
        yAxis: {
            show: props.showY
        },
        candle: {
            type: 'area',
            priceMark: {
                show: props.showY
            },
            area: {
                lineColor: props.color || "#2168F6",
                point: {
                    show: props.showY
                },
                lineSize: 2,
                backgroundColor: [
                    {
                        offset: 0,
                        color: props.color ? `rgba(${props.rgbColor}, 0.01)` : "rgba(0, 0, 168, 0.01)"
                    },
                    {
                        offset: 1,
                        color: props.color ? `rgba(${props.rgbColor}, 0.3)` : "rgba(0, 0, 168, 0.3)"
                    }
                ],
                smooth: true,
                point: {
                    show: true,
                    color: props.color ? `rgba(${props.rgbColor}, 0.3)` : "rgba(0, 0, 168, 0.3)",
                    radius: 4,
                    rippleColor: props.color ? `rgba(${props.rgbColor}, 0.3)` : "rgba(0, 0, 168, 0.3)", // getAlphaBlue(0.3),
                    rippleRadius: 8,
                    animation: true,
                    animationDuration: 1000
                }
            },
            tooltip: {
                offsetLeft: 2,
                offsetTop: 3,
                offsetRight: 2,
                offsetBottom: 3,
                showRule: 'follow_cross', /// ,follow_cross
                showType: 'rect',
                custom: [
                    { title: 'time', value: '{time}' },
                    // { title: 'open', value: '{open}' },
                    // { title: 'high', value: '{high}' },
                    // { title: 'low', value: '{low}' },
                    // { title: 'close', value: '{close}' },
                    { title: 'price', value: '{open}' }
                ],
                text: {
                    size: 10,
                    family: 'Helvetica Neue',
                    weight: 'normal',
                    color: '#121826',
                    marginLeft: 8,
                    marginTop: 4,
                    marginRight: 8,
                    marginBottom: 4
                },
            }
        },
    }
    if (props.showY) {
        delete selfStyle.yAxis
    }
    chart.setStyles(selfStyle)
    // 数据
    const query = symbol.value
    loading.value = true
    if (timeout) clearTimeout(timeout)
    if (!symbol.value) return
    const datas = await getData({ symbol: query })
    loading.value = false
    if (query == symbol.value) { // 当前股票
        if (datas && datas.length) {
            let num = 2
            try {
                num = datas[0].high.toString().split('.')[1].length || 0
            } catch {
                num = 2
            }
            const maxTail = _maxTail(datas[0].high)
            if (num > maxTail) num = maxTail
            chart.setPriceVolumePrecision(num, 2)
            chart.applyNewData(datas.map(item => {
                item.timestamp = item.timestamp || item.ts
                return item
            })) // 重设图表数据
            if (datas[0] && datas[0].timezone) {
                chart.setTimezone(datas[0].timezone)
            }
            subs()
            timeout = setTimeout(() => {
                chart.resize()
            }, 300)
        }
    }
}

const subs = () => { // 订阅新数据
    getWs(ws=>{
        const query = props.symbol
        socket = ws
        socket && socket.emit('time', query) // 分时
        socket && socket.off('time')
        socket && socket.on('time', res => {
            if (res.code == 200 && res.symbol == props.symbol) {
                res.data.forEach(item => {
                    chart.updateData({
                        ...item,
                        open: item.price,
                        close: item.price,
                        high: item.price,
                        low: item.price,
                        timestamp: item.timestamp || item.ts
                    })
                })
                chart.updateData()
            }
        })
    })
}

const getData = (params) => { // 获取数据
    const key = `${params.symbol}_time`
    return new Promise(resolve => {
        let rs = []
        // 先从session里找
        const s_rs = sessionStorage.getItem(key)
        if (s_rs) {
            try {
                rs = JSON.parse(s_rs)
            } catch { }
        }
        if (rs && rs.length) {
            // 判断数据存储的时间
            const t = Number(sessionStorage.getItem(key + '_time') || 0)
            if (Date.now() - t > 1 * 60 * 1000) { // 大于5分钟了就去重新请求

            } else {
                resolve(rs)
                return
            }
        }
        _time(params).then(data => {
            if (data && data.length) {
                const dd = data.map(item => {
                    item.open = item.price
                    item.close = item.price
                    item.high = item.price
                    item.low = item.price
                    item.timestamp = item.timestamp * 1000
                    return item
                }).reverse()
                resolve(dd)
                // 把结果放到sessionData
                sessionStorage.setItem(key + '_time', Date.now())
                sessionStorage.setItem(key, JSON.stringify(dd))
            } else {
                resolve([])
            }
        }).catch(() => {
            resolve([])
        })
    })
}

// 重置图表大小
const resetSize = () => {
    setTimeout(() => {
        chart.resize()
    }, 500)
}


defineExpose({
    resetSize
})
</script>

<style lang="scss" scoped>
.chat_area_box {
    width: 100%;
    height: 100%;
    position: relative;

    .chat_area {
        width: 100%;
        height: 100%;
    }

    .chat_area_loading {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
        z-index: 99;
        display: flex;
        align-items: center;
        justify-content: center;

        .lines {
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotate(45deg);
            position: relative;
            left: -100px;
            top: 100px;
            animation: loading 2s ease-out infinite;
        }

        @keyframes loading {
            0% {
                opacity: 1;
            }

            50% {
                opacity: 0.2;
            }

            100% {
                opacity: 1;
            }
        }

        .item {
            width: 50px;
            height: 100px;
            border-left: 1px solid #7F939E;
            border-top: 1px solid #7F939E;
            position: relative;
        }

        .item_2 {
            top: -100px;
        }

        .item_3 {
            top: -200px;
        }
    }
}
</style>