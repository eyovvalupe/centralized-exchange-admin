<template>
  <div class="reset-el-styte">
    <div class="flex justify-end p-2">
       <div></div>
       <div class="flex reset-el-styte">
        <el-input v-model="searchForm.params" class="mr-2" clearable placeholder="UID/用户名/日志"  style="width: 200px;"/>
              <el-date-picker v-model="searchForm.start_time" :disabled-date="disabledStart" type="date" style="width: 160px;"
                placeholder="开始时间" />
              <el-date-picker v-model="searchForm.end_time" :disabled-date="disabledEnd" type="date" class="ml-2"  style="width: 160px;"
                placeholder="结束时间" />
        <el-button type="primary" class="ml-2" :icon="Search" @click="getDataList(1)"
          :loading="isLoading">搜索</el-button>
       </div>
    </div>
    <div class="p-2 pt-0">
      <el-table :data="tableData" border :class="tableData.length?'':'noborder'" v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <template v-if="item.prop === 'username'">
              <span class="truncate cursor-pointer text-[#165DFF]" @click="showDialog(scope.row, 'showUserDialog')"> {{
                scope.row[item.prop] }}</span>
            </template>
            <template v-else-if="item.prop === 'uid'">
              <span class="truncate cursor-pointer" @click="copy(scope.row[item.prop])"> {{
                scope.row[item.prop] }}</span>
            </template>
            <span v-else-if="item.prop == 'created'">
              {{ dayjs(scope.row[item.prop]).format('MM-DD hh:mm:ss') }}
            </span>
            <span v-else-if="item.prop==='amount'" :class="scope.row[item.prop]>0?'text-red-700':'text-green-700'">
              {{ scope.row[item.prop] }}
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
import { Search } from '@element-plus/icons-vue'
import { dayjs } from 'element-plus'
import { copy } from '/@/utils'

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:Amount', () => {
  getDataList()
})
const dialogType = reactive({
  showUserDialog: false,
  info: null
})
const searchForm = reactive({
  query: '',
  start_time: '',
  end_time: ''
})
const currentLastPage = ref(1)
const currentPage = ref(1)
const columnBase = ref([
  { prop: 'uid', label: 'UID', width:120, align: 'center' },
  { prop: 'username', label: '用户名', width:130, align: 'center' },
  { prop: 'father_username', label: '代理', width:120, align: 'center' },
  { prop: 'symbol', label: '账户', width:120, align: 'center' },
  { prop: 'amount', label: '金额', width:120, align: 'center' },
  { prop: 'log', label: '日志', align: 'left' },
  { prop: 'created', label: '时间', width:150, align: 'center' }
])

const isLoading = ref(false)
const disabledStart = (time) => {
  return time.getTime() >= Date.now()
}
const disabledEnd = (time) => {
  return time.getTime() < Date.now()
}
const getDataList = (page) => {
  if (page) {
    currentLastPage.value = page
  }
  isLoading.value = true
  const send = { page: currentLastPage.value };
  if (searchForm.params) {
    send.params = searchForm.params
  }
  if (searchForm.end_time) {
    send.start_time = dayjs(searchForm.start_time).format('YYYY-MM-DD')
  }
  if (searchForm.end_time) {
    send.end_time = dayjs(searchForm.end_time).format('YYYY-MM-DD')
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