<template>
    <el-dialog :close-on-click-modal="false" width="500" class="reset-el-styte" :title="marketName" v-model="show" :append-to-body="true"
    @closed="emit('close', false)">
        <div class="stock-search-box">
            <el-input size="default" v-model.trim="searchDialogStr" @change="getList()" prefix-icon="Search" placeholder="搜索" />
        </div>
        <div class="stock-list soll-list soll-list-y" v-loading="isLoading">
            <template v-if="list.length">
                <StockItem v-for="(item,i) in list" :item="item" :handleClick="handleClick" :market-type="marketType == 'futures' ? 'crypto' : marketType" :key="i" />
            </template>
            <el-empty class="nodata" v-else-if="!isLoading" description="暂无数据" />
        </div>
    </el-dialog>
</template>
<script setup>
import StockItem from './StockItem.vue'
import { computed,onBeforeUnmount,onUnmounted,ref } from 'vue'
import { searchMarket } from '/@/api/modules/base.api'
import { useSocketStore } from '/@/store'

import { hex_md5 } from '/@/utils/md5'

const socketStore = useSocketStore()
const emit = defineEmits(['close','choice'])
const show = ref(true)
const props = defineProps({
    marketType:{
        type:String,
        default:'stock'
    }
})
const list = ref([])
const marketName = computed(()=>{
    if(props.marketType == 'stock'){
        return '股票选择'
    }else if(props.marketType == 'futures'){
        return '合约选择'
    }
    return ''
})

const handleClick = (item)=>{
    show.value = false
    emit('choice',item)
}

const getWs = (fn)=>{
    if(socketStore.sokcetWS){
        fn(socketStore.sokcetWS)
    }else{
        setTimeout(()=>{
            getWs(fn)
        },100)
    }
}

const searchDialogStr = ref('')
const isLoading = ref(false)
const getList = ()=>{

    const send = {
        market:props.marketType,
        symbol:searchDialogStr.value
    }

    const cacheKey = hex_md5(JSON.stringify(send))
    if(sessionStorage['stockSelectionSearch']){
        const searchCache = JSON.parse(sessionStorage['stockSelectionSearch'])
        if(searchCache.cacheKey == cacheKey){
            list.value = searchCache.data
            
        }else{
            isLoading.value = true
        }
    }else{
        isLoading.value = true
    }
    searchMarket(send).then(res=>{
        if(isLoading.value){
            list.value = res || []
        }
        sessionStorage['stockSelectionSearch'] = JSON.stringify({
            cacheKey,
            data:list.value
        })
        const keys = list.value.map(item => item.symbol)

        getWs(socket=>{
            socket.off('realtime')
            socket.emit('realtime', keys.join(',')) // 价格变化
            socket.on('realtime', res => {
                if (res.code == 200) {
                    const arr = list.value.map(item => { // 数据和观察列表里的数据融合
                        const target = res.data.find(a => a.symbols == item.symbol || a.symbol == item.symbol)
                        if (target) {
                            return {
                                ...item,
                                ...target,
                                name: item.name || target.name
                            }
                        }
                        return item
                    })
                    list.value = arr
                    sessionStorage['stockSelectionSearch'] = JSON.stringify({
                        cacheKey,
                        data:list.value
                    })
                    
                }
            })
        })
        isLoading.value = false
    })
}

getList()

onBeforeUnmount(()=>{
    getWs(socket=>{
        socket.off('realtime')
    })
})

</script>

<style lang="scss" scoped>
.stock-search-box{
    padding: 10px 0;
    :deep(.el-input__icon){
        font-size: 19px;
        color:#666D80;
    }
    :deep(.el-input__wrapper){
        border-radius: 30px;
        background-color: #F5F7FC;
    }
}
.stock-list{
    padding-bottom: 10px;
    height: 500px;
}
</style>