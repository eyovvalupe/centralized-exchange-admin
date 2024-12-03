<!-- k线图 -->
<template>
    <div class="chat_area_box">
        <div class="chat_area" id="chat_k"></div>

        <!-- 加载更多数据时的loading -->
        <div class="more_loading" v-show="moreLoading" v-loading="moreLoading">
            <!-- <L color="#1989fa" type="spinner" /> -->
        </div>

        <!-- 初始化时的骨架屏 -->
        <div class="init_loading" v-if="initLoading" v-loading="initLoading">
            
        </div>
    </div>

</template>

<script setup>
import { onMounted, ref, computed, watch, onBeforeUnmount } from "vue"
import { init, dispose } from 'klinecharts'
import { klineConfig } from './kline.conf';
import { _kline } from "../../api/modules/base.api"
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
    symbol: '',
    period: '',
    type:''
})
const periodMap = {
    '1m': '1min',
    '5m': '5min',
    '10m': '10min',
    '15m': '15min',
    '30m': '30min',
    '1h': '1h',
    '4h': '4h',
    '1D': '1day',
    '1W': '1week',
    '1M': '1month',
    '1Y': '1year',
}
const currPeriod = computed(() => periodMap[props.period])
const page = ref(1)

watch(currPeriod, val => {
    setTimeout(() => {
        initData()
    }, 100)
})


let chart = null
onMounted(() => {
    setTimeout(() => {
        chart = init('chat_k')
        chart.setStyles(klineConfig)
        chart?.setScrollEnabled(true) // 是否滚动
        chart?.setOffsetRightDistance(50) // 设置右边距
        chart?.setMaxOffsetLeftDistance(0) // 设置左边最大空出的边距
        chart?.setMaxOffsetRightDistance(50) // 设置右边最大空出的边距
        chart.setStyles({
            // tooltip: {
            //     showRule: 'none'
            // },
            candle: {
                type: 'candle_solid',
                margin: {
                    right: 0 // 设置右边距为0
                }
            }
        })
    }, 100)
    setTimeout(() => {
      initData()
    }, 300)
})
onBeforeUnmount(() => {
    dispose('chat_k')
    socket && socket.emit('kline', '') // 取消订阅
})

const vol = ref(null) // 技术指标
const initLoading = ref(false)
const initData = async () => { // 初始化数据
    page.value = 1
    const query = {
        symbol: props.symbol,
        period: currPeriod.value,
        page: page.value,
    }
    chart.loadMore(() => { })
    initLoading.value = true
    const datas = await getData(query)
    initLoading.value = false
    if (query.symbol == props.symbol && query.period == currPeriod.value) { // 而且是当前选项
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
            // 同步数据到股票详情
            //setCurrData(datas[datas.length - 1] || {})
            chart.loadMore(loadMoreData)
            setTimeout(() => {
                if (!vol.value) {
                    vol.value = chart.createIndicator('VOL')
                } else {
                    chart.overrideIndicator({
                        name: vol.value
                    })
                }
                chart.resize()
            }, 300)
            // 订阅新数据
            subs()
        } else {
            chart.applyNewData([]) // 重设图表数据
        }
    }
}
const subs = () => { // 订阅新数据

    getWs((ws) => {
        socket = ws
        const params = { symbol: props.symbol, period: currPeriod.value }
        socket && socket.off('kline')
        socket && socket.emit('kline', JSON.stringify(params)) // 快照数据
        socket && socket.on('kline', res => {

            if (res.code == 200 && res.symbol == props.symbol && (res.period == props.period || res.period == currPeriod.value)) {
                res.data.forEach(a => {
                    chart.updateData({
                        ...a,
                        timestamp: a.timestamp || a.ts
                    })
                })

                
            }
        })
    })
}

const moreLoading = ref(false) // 获取更多数据时的loading
const loadMoreData = async () => { // 加载更多
    page.value++
    const query = {
        symbol: props.symbol,
        period: currPeriod.value,
        page: page.value,
    }
    moreLoading.value = true
    const datas = await getData(query)
    setTimeout(() => {
        moreLoading.value = false
    }, 300)
    if (datas && datas.length) { // 有数据
        if (query.symbol == props.symbol && query.period == currPeriod.value) { // 而且是当前选项
            chart.applyMoreData(datas) // 追加更多数据
            setTimeout(() => {
                chart.resize()
            }, 100)
        }
    }

}

const getData = (params) => { // 获取数据
    const key = `${props.type}_${params.symbol}_${params.period}_${params.page}`
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
        _kline(params).then(data => {
            if (data && data.length) {
                const dd = data.reverse()
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
    overflow: hidden;

    .chat_area {
        width: 100%;
        height: 100%;
    }

    .more_loading {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0);
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0;
        left: 0
    }

    .init_loading {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-around;
        top: 0;
        left: 0;
        // border-right: 1px solid #7F939E;
        // border-bottom: 1px solid #7F939E;
        z-index: 9;

        .init_item {
            width: 7px;
            background-color: #7F939E;
            position: relative;
            animation: loading 2s ease-out infinite;
        }
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

}
</style>