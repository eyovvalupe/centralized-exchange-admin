<template>
  <div class="reset-el-styte">
    <div class="flex justify-end p-2">
      <div>
        <el-button :type="searchForm.role == item.value ? 'success' : 'default'" v-for="(item) in option"
          :key="item.value" @click="changeSearch(item.value)">{{ item.label }}</el-button>
        <el-input v-model="searchForm.params" class="mx-2" placeholder="UID/用户名/用户备注" style="width: 200px;" />
        <!-- <el-date-picker v-model="timeRanges" type="daterange" range-separator="~" start-placeholder="请选择开始时间"
        end-placeholder="请选择结束时间" style="width: 280px;" /> -->
        <!-- <el-select v-model="searchForm.status" class="ml-2"  style="width: 100px;">
          <el-option v-for="item in optionStatus" :key="item.value" :label="item.label" :value="item.value" />
        </el-select> -->
        <el-button type="primary" class="ml-2" :icon="Search" @click="getDataList(1)"
          :loading="isLoading">搜索</el-button>
      </div>
    </div>
    <div class="">
      <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <template v-if="item.prop === 'uid'">
              <span class="truncate cursor-pointer" @click="copy(scope.row[item.prop])"> {{
                scope.row[item.prop] }}</span>
            </template>
            <span v-else-if="item.prop === 'username'" class="underline cursor-pointer text-[#165DFF]"
              @click="showDialog(scope.row, 'showInfoDialog')">
              {{ scope.row[item.prop] }}
            </span>
            <span v-else-if="item.prop === 'offset'" :class="scope.row[item.prop]" class="status-bg">
              {{ optionOffset[scope.row[item.prop]] }}
            </span>
            
            <span v-else-if="item.prop === 'role'">
              {{ option.find(f => f.value == scope.row[item.prop]).label }}
            </span>
            <span v-else-if="item.prop === 'time'">
              {{ scope.row[item.prop] }}{{ optionsTime.find(f => f.value == scope.row['unit']).label }}
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="70" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="showDialog(scope.row)">查看订单</el-button>
          </template>
        </el-table-column> -->
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
      <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
    </div>
  </div>
  <userDetail v-if="dialogType.showInfoDialog && dialogType.info" :partyid="dialogType.info.partyid"
    @close="closeDialogType" />
  <!-- <detailDialog v-if="dialogType.showDialog" :contract="true" :orderNo="orderNo" @close="closeDialogType" /> -->
</template>

<script>
export default { name: 'aiSearch' };
</script>
<script setup>
import { apiQueryList } from '/@/api/modules/ai'
import { copy } from '/@/utils'
// import detailDialog from '/@/components/detailDialog/index.vue'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { ElDialog, ElMessage, dayjs } from 'element-plus'
import userDetail from '/@/components/userDetail/index.vue'

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:contractSearch', () => {
  getDataList()
})
const timeRanges = ref([])
const optionOffset = {
  long: '买涨',
  short: '买跌'
};
const optionStatus = [
  {
    value: 'all',
    label: '全部',
  },
  {
    value: 'none',
    label: '开仓',
  },
  {
    value: 'lock',
    label: '锁定',
  },
  {
    value: 'open',
    label: '持仓',
  },
  {
    value: 'close',
    label: '平仓',
  },
  {
    value: 'fail',
    label: '失败',
  },
  {
    value: 'cancel',
    label: '已取消',
  },
  {
    value: 'done',
    label: '完成',
  }
]
const option = [
  {
    value: 'all',
    label: '所有用户',
  },
  {
    value: 'user',
    label: '真实用户',
  },
  {
    value: 'guest',
    label: '模拟用户',
  }
]
const dialogType = reactive({
  showDialog: false,
  showInfoDialog: false,
  showLockDialog: false,
  title: ''
})
const optionsTime = [
  { value : 's', label : '秒' },
  { value : 'm', label : '分钟' },
  { value : 'h', label : '小时' },
  { value : 'd', label : '天' }
]
const searchForm = reactive({
  params: '',
  role: 'all',
  status: 'all'
})

const currentLastPage = ref(1)
const currentPage = ref(1)

const columnBase = ref([
  { prop: 'uid', label: 'UID', width: 80, align: 'center' },
  { prop: 'username', label: '用户名', width: 130, align: 'center' },
  { prop: 'role', label: '角色', width: 100, align: 'center' },
  // { prop: 'father_username', label: '代理', width: 110, align: 'center' },
  { prop: 'name', label: '名称', align: 'center' },
  { prop: 'offset', label: '开仓', width: 110, align: 'center' },
  { prop: 'lever', label: '网格', width: 90, align: 'center' },
  { prop: 'time', label: '时间区间', width: 110, align: 'center' },
  { prop: 'amount', label: '投资金额', align: 'center' },
  { prop: 'profit', label: '盈亏金额',  align: 'center' },
])
const isLoading = ref(false)
const orderNo = ref('')
const showDialog = (data, key) => {
  if (data) {
    const { order_no } = data;
    orderNo.value = order_no;
    dialogType.info = Object.assign({}, data);
  }
  dialogType[key] = true;
}
const closeDialogType = (item) => {
  for (const key in dialogType) {
    dialogType[key] = false
  }
  if (item && item.reload) {
  }
}

// 获取玩家列表 page若传则为第一页
const getDataList = page => {
  if (page) {
    currentLastPage.value = page
  }
  isLoading.value = true
  const send = { page: currentLastPage.value };
  if (searchForm.params) {
    send.params = searchForm.params
  }
  if (searchForm.role !== 'all') {
    send.role = searchForm.role
  }
  if (searchForm.params && searchForm.params !== 'all') {
    send.params = searchForm.params
  }
  if (timeRanges.value && timeRanges.value.length) {
    send.start_time = dayjs(timeRanges.value[0]).format('YYYY-MM-DD')
    send.end_time = dayjs(timeRanges.value[1]).format('YYYY-MM-DD')
  }


  apiQueryList(send)
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
      tableData.value = res || []
    })
    .finally(() => {
      isLoading.value = false
    })
}
const changeSearch = (s) => {
  searchForm.role = s;
  getDataList();
}
getDataList();
</script>