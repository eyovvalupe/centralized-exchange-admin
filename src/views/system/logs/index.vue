<template>
<div class="px-[30px] py-[10px]">
    <div class="flex reset-el-style-v2 justify-between">
       <div></div>
       <div class="flex">

          <div class="w-[264px] ml-2">
            <el-input v-model="searchForm.operator" ref="searchInput" suffix-icon="search" placeholder="操作者" />
          </div>
          <el-date-picker start-placeholder="开始时间" end-placeholder="结束时间" clearable v-model="timerange" class="ml-[10px]" type="daterange" style="width: 400px;"  />
          
          <el-button type="primary" class="w-[120px] ml-[10px]" @click="getDataList(1)"
        :loading="isLoading">查询</el-button>
       </div>
    </div>
    <div class=" reset-el-style-v2 pt-[10px]">
      <el-table :data="tableData" border :class="tableData.length?'':'noborder'" v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :label="item.label"  :min-width="item.minWidth"
          :align="item.align">
          <template #default="scope">
            <span v-if="['uid','username'].includes(item.prop)">
                 {{ scope.row[item.prop] }}
                </span>
           
            <span v-else-if="item.prop == 'role'">
              {{ roleOptions[scope.row[item.prop]] || '' }}
            </span>
            <span v-else-if="item.prop==='category'" >
              {{ scope.row[item.prop]=='operate'?'操作':'安全' }}
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
      <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
    </div>

  </div>
</template>

<script>
export default { name: 'OperationLog' };
</script>
<script setup>
import { getList } from '/@/api/modules/system/log.api'
import { ref, toRaw } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { dayjs } from 'element-plus'
import { copy } from '/@/utils'
import { hex_md5 } from '/@/utils/md5'
import { ElMessage } from 'element-plus'
const currentPage = ref(1)
const currentLastPage = ref(1)
const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:OperationLog', () => {
  getDataList()
})
const searchForm = reactive({
  operator:sessionStorage['operationLogSearchOperator'] || '',
  query: '',
  start_time: sessionStorage['operationLogSearchStartTime'] || '',
  end_time: sessionStorage['operationLogSearchEndTime'] || ''
})

const timerange = ref([searchForm.start_time,searchForm.end_time])


const roleOptions = {user:'真实用户',guest:'模拟用户'};


const gw = (w)=>{
  return Math.round(1400/1920 * w)
}


const columnBase = ref([
  { prop: 'uid', label: 'UID', minWidth:gw(110), align: 'center' },
  { prop: 'username', label: '用户名', minWidth:gw(200),  align: 'center' },
  { prop: 'category', label: '状态', minWidth:gw(140),  align: 'center' },
  { prop: 'role', label: '用户', align: 'center' , minWidth: gw(200)},
  { prop: 'log', label: '日志', align: 'left',minWidth:gw(836)},
  { prop: 'operator', label: '操作者',width:120, align: 'center',minWidth:gw(200) },
  { prop: 'date', label: '时间', width:130, align: 'center',minWidth:gw(200)}
])

const isLoading = ref(false)

const getDataList = (page=1) => {
  if (page) {
    currentLastPage.value = page
  }

  if(timerange.value && timerange.value[0]){
    searchForm.start_time = timerange.value[0]
  }else{
    searchForm.start_time = ''
  }
  if(timerange.value && timerange.value[1]){
    searchForm.end_time = timerange.value[1]
  }else{
    searchForm.end_time = ''
  }
  
  const send = toRaw(searchForm);
  send.page = currentLastPage.value

  if (searchForm.start_time) {
    send.start_time = dayjs(searchForm.start_time).format('YYYY-MM-DD')
  }
  if (searchForm.end_time) {
    send.end_time = dayjs(searchForm.end_time).format('YYYY-MM-DD')
  }
  sessionStorage['operationLogSearchOperator']  = searchForm.operator
  sessionStorage['operationLogSearchStartTime'] = searchForm.start_time
  sessionStorage['operationLogSearchEndTime']   = searchForm.end_time
  const cacheKey = hex_md5(JSON.stringify(send))
  if(sessionStorage['operationLogSearch']){
    const searchCache = JSON.parse(sessionStorage['operationLogSearch'])
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

      isLoading.value = false
      tableData.value = res || []
      sessionStorage['operationLogSearch'] = JSON.stringify({
        cacheKey,
        data:tableData.value
      })

    })
    .finally(() => {
      isLoading.value = false
    })
}
getDataList();
</script>