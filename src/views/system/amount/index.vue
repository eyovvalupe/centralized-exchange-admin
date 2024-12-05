<template>
  <div class="px-[20px] py-[10px]">
    <div class="reset-el-style-v2 flex justify-end">
       <div class="flex">
          <el-input v-model="searchForm.params" class="mr-2" clearable placeholder="UID/用户名/日志"  style="width: 268px;"/>
          <el-date-picker v-model="timeRanges" type="daterange" range-separator="至" start-placeholder="开始时间"
                      end-placeholder="结束时间" style="width: 268px;margin-left: 10px;" />
              <el-button type="primary" class="w-[120px] ml-[10px]" @click="getDataList(1)"
                :loading="isLoading">查询</el-button>
       </div>
    </div>
    <div class="pt-[10px]">
      <el-table :data="tableData" border :class="tableData.length?'':'noborder'" v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :min-width="item.minWidth" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <template v-if="item.prop === 'username'">
              <span class="truncate cursor-pointer text-[#4377FE] underline" @click="showDialog(scope.row, 'showUserDialog')"> {{
                scope.row[item.prop] }}</span>
            </template>
            <template v-else-if="item.prop === 'account'">
              <span> {{ scope.row[item.prop] && accountMap[scope.row[item.prop]] ? accountMap[scope.row[item.prop]] : scope.row[item.prop] }}</span>
            </template>
            <template v-else-if="item.prop === 'uid'">
              <span class="truncate cursor-pointer" @click="copy(scope.row[item.prop])"> {{
                scope.row[item.prop] }}</span>
            </template>
          
            <span v-else-if="item.prop==='amount'" class="status" :class="scope.row[item.prop]>0?'success':'fail'">
              {{ scope.row[item.prop] > 0 ? '+' : '' }}{{ scope.row[item.prop] }}
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
      
    </div>
    <div class="py-[10px]">
      <Pagination @changePage="getPlayerList" v-if="tableData.length" :currentPage="currentLastPage"  />
    </div>
    <userDetail v-if="dialogType.showUserDialog" :partyid="dialogType.info.partyid" @close="closeDialogType" />
  </div>
</template>

<script>
export default { name: 'Amount' };
</script>
<script setup>
import userDetail from '/@/components/userDetail/index.vue'
import { getList } from '/@/api/modules/system/amount.api'
import { ref } from 'vue'
import { dayjs } from 'element-plus'
import { copy } from '/@/utils'
import { hex_md5 } from '/@/utils/md5'

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:Amount', () => {
  getDataList()
})

const timeRanges = ref([])
if(sessionStorage['amountSearchTimeRange']){
  timeRanges.value = JSON.parse(sessionStorage['amountSearchTimeRange'])
}
const dialogType = reactive({
  showUserDialog: false,
  info: null
})
const searchForm = reactive({
  params: sessionStorage['amountSearchParams'] || ''
})
const currentLastPage = ref(1)
const currentPage = ref(1)

const gw = (w)=>{
  return Math.round(1400/1920 * w)
}

const accountMap = {
  money:"现金账户",
  stock:"股票账户",
  futures:"合约账户",
  forex:"外汇账户",
  blocktrade:"大宗交易账户"
}

const columnBase = ref([
  { prop: 'uid', label: 'UID', minWidth:gw(110), align: 'center' },
  { prop: 'username', label: '用户名', minWidth:gw(300), align: 'center' },
  // { prop: 'father_username', label: '代理', minWidth:gw(110), align: 'center' },
  { prop: 'account', label: '账户', minWidth:gw(140), align: 'center' },
  { prop: 'symbol', label: '货币', minWidth:gw(140), align: 'center' },
  { prop: 'amount', label: '金额', minWidth:gw(300), align: 'center' },
  { prop: 'log', label: '日志', align: 'left',minWidth:gw(696) },
  { prop: 'created', label: '时间', minWidth:gw(200), align: 'center' }
])

const isLoading = ref(false)

const getDataList = (page) => {
  if (page) {
    currentLastPage.value = page
  }
  const send = { page: currentLastPage.value };
  if (searchForm.params) {
    send.params = searchForm.params
  }
  if (timeRanges.value && timeRanges.value[0]) {
    send.start_time = dayjs(timeRanges.value[0]).format('YYYY-MM-DD')
  }
  if (timeRanges.value && timeRanges.value[1]) {
    send.end_time = dayjs(timeRanges.value[1]).format('YYYY-MM-DD')
  }

  sessionStorage['amountSearchParams'] = searchForm.params
  sessionStorage['amountSearchTimeRange'] = JSON.stringify(timeRanges.value || [])

  const cacheKey = hex_md5(JSON.stringify(send))
  if(sessionStorage['amountSearch']){
      const searchCache = JSON.parse(sessionStorage['amountSearch'])
      if(searchCache.cacheKey == cacheKey){
          tableData.value = searchCache.data
      }else{
          isLoading.value = true
      }
  }else{
      isLoading.value = true
  }
  
  getList(send)
    .then(res => {
      isLoading.value = false
      if(!res || !res.length && currentLastPage.value>1){
         currentLastPage.value = currentPage.value;
        ElMessage({
          offset: 200,
          message: '已是最后一页',
          type: 'tips'
        })
        return;
      }
      currentPage.value = currentLastPage.value;
      tableData.value = res || []
      sessionStorage['amountSearch'] = JSON.stringify({
          cacheKey,
          data:res
      })
    })
    .finally(() => {
      isLoading.value = false
    })
}
getDataList();
const closeDialogType = (item) => {
  for (const key in dialogType) {
    dialogType[key] = false
  }
  if (item && item.reload) {
    getDataList();
  }
}
const showDialog = (data, type) => {
  if (data) {
    dialogType.info = Object.assign({}, data);
  } else {
    dialogType.info = null
  }
  dialogType[type] = true;
}
</script>