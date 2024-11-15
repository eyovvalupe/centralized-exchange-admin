<template>
    <div class="px-[20px] py-[10px]">
        <div class="reset-el-style-v2 flex justify-end">
            <div class="flex">
                <el-button class="w-[100px]" :class="{'gray-btn':currLast == 1}"  :type="currLast == 0 ? 'success' : 'default'" @click="changeSearch(0)">本月数据</el-button>
                <el-button class="w-[100px]" :class="{'gray-btn':currLast == 0}"   :type="currLast == 1 ? 'success' : 'default'"
                    @click="changeSearch(1)">上月数据</el-button>
                
                <div class="w-[268px] ml-[10px]">
                    <el-input v-model="searchForm.query"  suffix-icon="search"  placeholder="UID/用户名"/>
                </div>
                <el-date-picker v-model="timeRanges" type="daterange" range-separator="至" start-placeholder="请选择开始时间"
                    end-placeholder="请选择结束时间" style="width: 268px;margin-left: 10px;" />
                    
                    <el-button type="primary" class="w-[120px] ml-[10px]"  @click="changeSearch(currLast)"
                    :loading="isLoading">查询</el-button>
            </div>
        </div>
        <div class="reset-el-style-v2 pt-[10px]">
                <!-- <p class="title ml-1">充提统计</p> -->
                <el-table :data="tableData"  border
                    :class="tableData.length ? '' : 'noborder'" v-loading="isLoading">
                    <el-table-column v-for="(item, index) in columnBase" :key="index" :min-width="item.minWidth"
                        :label="item.label" :align="item.align">
                        <template #default="scope">
                            
                            <span v-if="item.prop === 'username'" class="underline cursor-pointer text-[#4377FE]" @click="showInfoDialog(scope.row)">{{
                                scope.row[item.prop] }}
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
        <div class="py-[10px]">
            <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
        </div>
        <dialogInfo ref="dialogInfoRef" />
        <userDetail v-if="infoDialog" :partyid="partyid" @close="infoDialog=false;" />
    </div>
</template>

<script>
export default { name: 'statisticsAgentUser' };
</script>
<script setup>
import userDetail from '/@/components/userDetail/index.vue'
import { getglobalDate, getglobalTotalUser, getGlobalCurrencyList } from '/@/api/modules/base.api'
import { ref, reactive, onMounted, computed, nextTick,unref } from 'vue'
import { ElDialog, ElMessage, dayjs } from 'element-plus'
import dialogInfo from './dialogInfo.vue'
import { hex_md5 } from '/@/utils/md5'
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

const partyid = ref('')
const infoDialog = ref(false)

const columnBase = ref([
    { prop: 'uid', label: 'UID', align: 'center',minWidth:gw(140) },
    { prop: 'username', label: '用户名', align: 'center',minWidth:gw(200) },
    { prop: 'amount', label: '流水-USDT', align: 'center',minWidth:gw(280) },
    { prop: 'earn', label: '盈利-USDT', align: 'center',minWidth:gw(280) },
    { prop: 'deposit', label: '充值-USDT', align: 'center',minWidth:gw(280) },
    { prop: 'withdraw', label: '提现-USDT', align: 'center',minWidth:gw(280) },
    { prop: 'balance', label: '充提差-USDT', align: 'center',minWidth:gw(280) },
])
const isLoading = ref(false)

const searchForm = reactive({
  query: sessionStorage['statisticsAgentUserSearchQuery'] || '',
  father: sessionStorage['statisticsAgentUserSearchFather'] || '',
})
const getDataList = page => {
    if (page) {
        currentLastPage.value = page
    }
    const send = { page: currentLastPage.value };
     for (const key in searchForm) {
        if (searchForm[key]) {
            send[key] = searchForm[key]
        }
    }

    sessionStorage['statisticsAgentUserSearchQuery']  = searchForm.query
    sessionStorage['statisticsAgentUserSearchFather'] = searchForm.father

    if (timeRanges.value && timeRanges.value.length) {
        send.start_time = dayjs(timeRanges.value[0]).format('YYYY-MM-DD')
        send.end_time = dayjs(timeRanges.value[1]).format('YYYY-MM-DD')
    }


    const cacheKey = hex_md5(JSON.stringify(send))
    if(sessionStorage['statisticsAgentUserSearch']){
        const searchCache = JSON.parse(sessionStorage['statisticsAgentUserSearch'])
        if(searchCache.cacheKey == cacheKey){
            tableData.value = searchCache.data
        }else{
            isLoading.value = true
        }
    }else{
        isLoading.value = true
    }

    getglobalTotalUser(send)
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
            tableData.value = res;
            sessionStorage['statisticsAgentUserSearch'] = JSON.stringify({
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
    sessionStorage['statisticsAgentUserCurrLast'] = num
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
    getDataList(1);
}
changeSearch(sessionStorage['statisticsAgentUserCurrLast'] || 0)
const showDialog = (data) => {
    let start = data.date
    let end = data.date
    unref(dialogInfoRef).open(start,end,'agentUser',data.partyid)
}
const showInfoDialog = (data)=>{
    partyid.value = data.partyid || ''
    infoDialog.value = true
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

</style>