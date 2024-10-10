<template>
    <div class="reset-el-styte">
        <div class="flex justify-end p-2">
            <div></div>
            <div>
                <el-button :type="currLast == 0 ? 'success' : 'default'" @click="changeSearch(0)">本月</el-button>
                <el-button class="mr-5" :type="currLast == 1 ? 'success' : 'default'"
                    @click="changeSearch(1)">上月</el-button>
                <el-input v-model="searchForm.query" class="mr-2" placeholder="UID/用户名" style="width: 200px;" />
                <el-date-picker v-model="timeRanges" type="daterange" range-separator="~" start-placeholder="请选择开始时间"
                    end-placeholder="请选择结束时间" style="width: 280px;" />
                <el-button type="primary" class="ml-2" :icon="Search" @click="changeSearch(3)"
                    :loading="isLoading">搜索</el-button>
            </div>
        </div>
        <div class="h-full w-full flex">
            <div class="w-full">
                {{allTotal}}
                <!-- <p class="title ml-1">充提统计</p> -->
                <el-table :data="tableData" row-class-name="bg-one-row" border
                    :class="tableData.length ? '' : 'noborder'" v-loading="isLoading">
                    <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width"
                        :label="item.label" :align="item.align">
                        <template #default="scope">
                            {{ scope.row[item.prop] ? scope.row[item.prop] : '0' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="160" align="center">
                        <template #default="scope">
                                
                            <el-button class="data" link type="primary"
                                @click="showDialog(scope.row)">
                                充提货币详情</el-button>
                        </template>
                    </el-table-column>
                    <template v-slot:empty>
                        <el-empty class="nodata" description="暂无数据" />
                    </template>
                </el-table>
                <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
            </div>
        </div>
        <dialogInfo ref="dialogInfoRef" />
    </div>
</template>

<script>
export default { name: 'statisticsAgentUser' };
</script>
<script setup>
import { getglobalDate, getglobalTotalUser, getGlobalCurrencyList } from '/@/api/modules/base.api'
import { ref, reactive, onMounted, computed, nextTick,unref } from 'vue'
import { ElDialog, ElMessage, dayjs } from 'element-plus'
import dialogInfo from './dialogInfo.vue'
import { Search } from '@element-plus/icons-vue'
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

const columnBase = ref([
    { prop: 'username', label: '用户名', align: 'center' },
    { prop: 'uid', label: 'UID', align: 'center' },
    { prop: 'amount', label: '流水(USDT)', align: 'center' },
    { prop: 'earn', label: '流水(盈利)', align: 'center' },
    { prop: 'deposit', label: '充值(USDT)', align: 'center' },
    { prop: 'withdraw', label: '提现(USDT)', align: 'center' },
    { prop: 'balance', label: '充提差(USDT)', align: 'center' },
])
const isLoading = ref(false)

const searchForm = reactive({
  query: '',
  father: '',
})
const getDataList = page => {
    if (page) {
        currentLastPage.value = page
    }
    isLoading.value = true
    const send = { page: currentLastPage.value };
     for (const key in searchForm) {
        if (searchForm[key]) {
        send[key] = searchForm[key]
        }
    }
    if (timeRanges.value && timeRanges.value.length) {
        send.start_time = dayjs(timeRanges.value[0]).format('YYYY-MM-DD')
        send.end_time = dayjs(timeRanges.value[1]).format('YYYY-MM-DD')
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
    getDataList(1);
}
changeSearch(0)
const showDialog = (data) => {
    let start = ''
    let end = ''
    start = timeRanges.value[0]
    end = timeRanges.value[1]
    unref(dialogInfoRef).open(start,end,'agentUser',data.partyid)
}
</script>
<style scoped>
.title{
    font-size: 15px;
}
</style>