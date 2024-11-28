<template>
 <div class="px-[20px] py-[10px]">
        <div class="reset-el-style-v2 flex justify-end">
            <div class="flex">
                <el-button class="w-[100px]" :class="{'gray-btn':currLast == 1}"  :type="currLast == 0 ? 'success' : 'default'" @click="changeSearch(0)">本月数据</el-button>
                <el-button class="w-[100px]" :class="{'gray-btn':currLast == 0}"   :type="currLast == 1 ? 'success' : 'default'"
                    @click="changeSearch(1)">上月数据</el-button>
                
                <el-date-picker v-model="timeRanges" type="daterange" range-separator="至" start-placeholder="请选择开始时间"
                    end-placeholder="请选择结束时间" style="width: 268px;margin-left:10px;" />

                <el-button type="primary" class="w-[120px] ml-[10px]"  @click="changeSearch(currLast)"
                :loading="isLoading">查询</el-button>
            </div>
        </div>
        <div class="reset-el-style-v2">
            <div class="title">我的业绩</div>
            <dataOveriew :all-total="allTotal" :coin-list="coinList" @openDetail="showDialog({date:'total'})" />
            <div class="py-[10px]" v-if="showList">
                
                <el-radio-group v-model="tabPosition" @change="tabChange">
                    <el-radio-button label="online">线下代理</el-radio-button>
                    <el-radio-button label="offline">线下用户</el-radio-button>
                </el-radio-group>
                
            </div>
            <el-table v-if="showList" :data="tableData" border
                :class="tableData.length ? '' : 'noborder'" v-loading="isLoading">
                <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width"
                    :label="item.label" :align="item.align">
                    <template #default="scope">
                        <span v-if="item.prop == 'balance'">
                            ss
                        </span>
                        <span v-else>
                            {{ scope.row[item.prop] ? scope.row[item.prop] : '0' }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" :min-width="gw(140)" align="center">
                    <template #default="scope">
                            
                        <el-button size="default" class="data underline" link type="primary"
                            @click="showDialog(scope.row)">
                            充提货币详情</el-button>
                    </template>
                </el-table-column>
                <template v-slot:empty>
                    <el-empty class="nodata" description="暂无数据" />
                </template>
            </el-table>
                
        </div>
        <div class="py-[10px]" v-if="showList">
            <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
        </div>
        <dialogInfo ref="dialogInfoRef" />
    </div>
</template>

<script>
export default { name: 'statisticsAgentMy' };
</script>
<script setup>
import { getAgentList } from '/@/api/modules/business/agents.api'

import { getglobalMyDate, getglobalTotalMy, getGlobalCurrencyMy } from '/@/api/modules/base.api'
import { ref, unref } from 'vue'
import { ElDialog, ElMessage, dayjs } from 'element-plus'
import dialogInfo from './dialogInfo.vue'
import dataOveriew from './components/dataOveriew.vue'
import { apicoinList } from '/@/api/modules/crypto'
import { hex_md5 } from '/@/utils/md5'
const tabPosition = ref('online')
const tabChange = ()=>{
 
}
const props = defineProps({
    showList:{
        type:Boolean,
        default:true
    }  
})

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:whithdrawDeposit', () => {
    getDataList()
})
const timeRanges = ref([])
const currLast = ref(0)
const currentLastPage = ref(1)
const currentPage = ref(1)
const dialogInfoRef = ref()

const gw = (w)=>{
  return Math.round(1400/1920 * w)
}


const columnBase = ref([
    { prop: 'uid', label: 'UID',minWidth:gw(110), align: 'center' },    
    { prop: 'partyid', label: '代理',minWidth:gw(200), align: 'center' },
    { prop: 'sub_users', label: '直推',minWidth:gw(200), align: 'center' },
    { prop: 'net_users', label: '网络',minWidth:gw(200), align: 'center' },
    { prop: 'deposit', label: '充值-USDT',minWidth:gw(340), align: 'center' },
    { prop: 'withdraw', label: '提现-USDT',minWidth:gw(340), align: 'center' },
    { prop: 'balance', label: '充提差-USDT',minWidth:gw(340), align: 'center' },
])
const isLoading = ref(false)
const coinList = ref([])
const allTotal = ref({})
const updateList = (list)=>{
    list.map(item=>{
        switch(item.currency.toLocaleUpperCase()){
            case 'BTC':
                item.color = '#f89a29'
                break;
            case 'ETC':
                item.color = '#3cba3c'
                break;
            case 'ETH':
                item.color = '#5f59e0'
                break;
            case 'DOGE':
                item.color = '#ba9f33'
                break;
            case 'TRX':
                item.color = '#ff0013'
                break;
            case 'DASH':
                item.color = '#008ce7'
                break;
            case 'ARB':
                item.color = '#269fef'
                break;
            case 'BCH':
                item.color = '#8dc351'
                break;
            case 'USDT':
                item.color = '#1ba27a'
                break;
            case 'LTC':
                item.color = '#345d9d'
                break;
            case 'RVN':
                item.color = '#384182'
                break;
        }
    })
    coinList.value = list
}


const allData = (callback) => {
    const send = {};
    if (timeRanges.value && timeRanges.value.length) {
        send.start_time = dayjs(timeRanges.value[0]).format('YYYY-MM-DD')
        send.end_time = dayjs(timeRanges.value[1]).format('YYYY-MM-DD')
    }
    const cacheKey = hex_md5(JSON.stringify(send))
    if(sessionStorage['statisticsAgentMyAllDataSearch']){
        const searchCache = JSON.parse(sessionStorage['statisticsAgentMyAllDataSearch'])
        if(searchCache.cacheKey == cacheKey){
            updateList(searchCache.data)
        }else{
            isLoading.value = true
        }
    }else{
        isLoading.value = true
    }

    getGlobalCurrencyMy(send).then(res => {
        res = res || []
        if(res.length < 6){
            apicoinList({
                type:'crypto'
            }).then(res2=>{
                res2 = res2 || []
                res2.map(item=>{
                    if(res.length < 6 && !res.filter(v=>v.currency.toLocaleUpperCase() == item.currency.toLocaleUpperCase()).length){
                        res.push({
                            balance: 0,
                            currency: item.currency,
                            deposit: 0,
                            deposit_ratio:0,
                            deposit_usdt:0,
                            withdraw: 0,
                            withdraw_usdt:0,
                            withdraw_ratio:0
                        })
                    }
                })
                sessionStorage['statisticsAgentMyAllDataSearch'] = JSON.stringify({
                    cacheKey,
                    data:res
                })
                updateList(res)
            })
        }else{
            sessionStorage['statisticsAgentMyAllDataSearch'] = JSON.stringify({
                cacheKey,
                data:res
            })
            updateList(res)
        }
        
    })

    let hasCache = false
    if(sessionStorage['statisticsAgentMyTotal']){
        const totalSearchCache = JSON.parse(sessionStorage['statisticsAgentMyTotal'])
        if(totalSearchCache.cacheKey == cacheKey){
            allTotal.value = totalSearchCache.data
            hasCache = true
            callback()
        }else{
            isLoading.value = true
        }
       
    }
    getglobalTotalMy(send).then(res => {
        allTotal.value = res
        sessionStorage['statisticsAgentMyTotal'] = JSON.stringify({
            cacheKey,
            data:res
        })
        if(!hasCache){
            callback()
        }
    })
}
const getDataList = page => {
    if(!props.showList){
        return
    }
    if (page) {
        currentLastPage.value = page
    }
    const send = { page: currentLastPage.value };
    if (timeRanges.value && timeRanges.value.length) {
        send.start_time = dayjs(timeRanges.value[0]).format('YYYY-MM-DD')
        send.end_time = dayjs(timeRanges.value[1]).format('YYYY-MM-DD')
    }
    const cacheKey = hex_md5(JSON.stringify(send))
    if(sessionStorage['statisticsAgentMySearch']){
        const searchCache = JSON.parse(sessionStorage['statisticsAgentMySearch'])
        if(searchCache.cacheKey == cacheKey){
            tableData.value = searchCache.data
            
        }else{
            isLoading.value = true
        }
    }else{
        isLoading.value = true
    }
    getAgentList(send)
        .then(res => {
            isLoading.value = false
            if (!res || !res.length && currentLastPage.value > 1) {
                currentLastPage.value = currentPage.value;
                ElMessage({
                    offset: 200,
                    message: '已是最后一页',
                    type: 'tips'
                })
                return;
            }
            currentPage.value = currentLastPage.value;
            tableData.value = res
            sessionStorage['statisticsAgentMySearch'] = JSON.stringify({
                cacheKey,
                data:res
            })
        })
        .finally(() => {
            isLoading.value = false
        })
}
const changeSearch = (num) => {
    currLast.value = num
    let arr = [];
    if (num == 0) {
        // 获取本月的开始时间
        const startOfMonth = dayjs().startOf('month');
        // 获取当前时间
        const currentTime = dayjs();
        arr = [startOfMonth, currentTime]
    } else if (num == 1) {
        // 获取上个月的开始时间
        const startOfLastMonth = dayjs().subtract(1, 'month').startOf('month');
        // 获取上个月的结束时间
        const endOfLastMonth = dayjs().subtract(1, 'month').endOf('month');
        arr = [startOfLastMonth, endOfLastMonth]
    } else {
        arr = timeRanges.value;
    }
    timeRanges.value = arr;
    allData(() => {
        getDataList(1);
    });
}
changeSearch(0)
const showDialog = (data) => {
    let start = ''
    let end = ''
    if(data.date == 'total'){
        start = timeRanges.value[0]
        end = timeRanges.value[1]
    }else{
       start = data.date 
       end = data.date 
    }
    console.log(start,end)
    unref(dialogInfoRef).open(start,end,'my','')
}
</script>
<style scoped>
.gray-btn{
    background-color: #F5F5F5;
    border-color: #F5F5F5;
    color:#000;
    &:hover{
        color:#000;
    }
}
.title{
    line-height: 22px;
    margin-top: 20px;
    font-size: 16px;
    font-weight: 400;
    color:#000;
}
</style>