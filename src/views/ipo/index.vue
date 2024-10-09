<template>
  <div class="reset-el-styte p-2">
    <div class="flex justify-between p-2">
      <div></div>
      <div class="flex">
        <div class="mr-5">
          <el-button :type="searchForm.status == item.value ? 'success' : 'default'" v-for="(item) in optionStatus"
            :key="item.value" @click="changeSearch(item.value)">{{ item.label }}</el-button>
        </div>
        <el-input v-model="searchForm.params" placeholder="公司名称/交易代码/UID/用户名" style="width: 300px;" />
        <!-- <el-select v-model="searchForm.status" class="ml-2"  style="width: 250px;">
          <el-option v-for="item in optionStatus" :key="item.value" :label="item.label" :value="item.value" />
        </el-select> -->
        <el-button type="primary" class="ml-5" :icon="Search" @click="getDataList(1)"
          :loading="isLoading">搜索</el-button>
      </div>
    </div>
    <div>
      <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <template v-if="item.prop === 'username'">
              <span class="truncate cursor-pointer text-[#165DFF]" @click="showDialog(scope.row, 'showUserDialog')"> {{
                scope.row[item.prop] }}</span>
            </template>
            <span v-else-if="item.prop === 'issue_price_min'">
              {{ scope.row['issue_price_min'] + '~' + scope.row['issue_price_max'] }}
            </span>
            <span v-else-if="item.prop === 'vip'">
              <span class="status-bg" :class="scope.row['lever'] > 1 ? 'status-yellow' : ''">
                {{ scope.row['lever'] > 1 ? scope.row['lever'] + 'X' : '无' }}
              </span>
            </span>
            <span v-else-if="item.prop === 'status'" class="status-bg"
              :class="scope.row['status']">
              {{ statusObj[scope.row[item.prop]] }}
            </span>
            <!-- <span v-else-if="item.prop==='date'">
              {{  dayjs(scope.row['date']).format('YYYY-MM-DD ')   }}
            </span> -->
            <template v-else-if="item.prop === 'order_no'">
              <el-tooltip :content="scope.row[item.prop]" effect="dark" placement="bottom-start">
                <span v-if="scope.row[item.prop]"> ...{{
                  scope.row[item.prop].substring(scope.row[item.prop].length - 7) }}</span>
              </el-tooltip>
            </template>
            <template v-else-if="item.prop === 'uid'">
              <span class="truncate cursor-pointer" @click="copy(scope.row[item.prop])"> {{ scope.row[item.prop]
                }}</span>
            </template>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template #default="scope">
            <el-button link  :type="checkAuthCode(22101)?'primary':'info'" :disabled="!checkAuthCode(22101)" @click="showDialog(scope.row, 'showWinDialog')">中签管理</el-button>
            <el-button link type="primary" @click="showDialog(scope.row, 'showDialog')">详情</el-button>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
      <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
    </div>
  </div>
  <detailDialog :orderNo="dialogType.info.order_no" v-if="dialogType.showDialog" />
  <winDialog :data="dialogType.info" v-if="dialogType.showWinDialog" @close="closeDialogType" />
  <!-- :partyid="dialogType.info.partyid"  -->
  <userDetail v-if="dialogType.showUserDialog" :partyid="dialogType.info.partyid" @close="closeDialogType" />
</template>

<script>
export default { name: 'ipoIndex' };
</script>
<script setup>
import { getList, getIpoWin } from '/@/api/modules/ipo/index.api'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { copy } from '/@/utils'
import userDetail from '/@/components/userDetail/index.vue'
import { ElMessageBox, ElMessage, dayjs } from 'element-plus'
import winDialog from './components/winDialog.vue'
import detailDialog from './components/detailDialog.vue'
import { checkAuthCode } from '/@/hooks/store.hook.js'

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:ipoIndex', () => {
  getDataList()
})
const dialogType = reactive({
  showDialog: false,
  showWinDialog: false,
  showUserDialog: false,
  info: {}
})
const searchForm = reactive({
  params: '',
  status: 'all'
})
const currentPage = ref(1)
const currentLastPage = ref(1)

const statusObj = ref({
  'lock': '认购',
  'success': '中签',
  'failure': '未中签'
})
const optionStatus = [
  {
    value: 'all',
    label: '全部',
  },
  {
    value: 'lock',
    label: '认购',
  },
  {
    value: 'success',
    label: '中签',
  },
  {
    value: 'failure',
    label: '未中签',
  },
]
const columnBase = ref([
  { prop: 'order_no', label: '订单号',width: 100,  align: 'center' },
  { prop: 'uid', label: 'UID', align: 'center' },
  { prop: 'username',width: 130, label: '用户名', align: 'center' },
  { prop: 'father_username', label: '代理', align: 'center' },
  { prop: 'company_name', label: '公司名称', align: 'center' },
  // { prop: 'market', label: '市场', align: 'center' },
  // { prop: 'symbol', label: '交易代码', align: 'center' },
  { prop: 'issue_price', label: '认购价格', align: 'center' },
  { prop: 'vip', label: 'VIP杠杆', align: 'center', width: 80 },
  // { prop: 'lever', label: '认购杠杆', align: 'center', width:90 },
  { prop: 'volume', label: '认购数量', align: 'center' },
  { prop: 'winning', label: '中签数量', align: 'center' },
  // { prop: 'fee', label: '手续费', align: 'center', width:60 },
  // { prop: 'date', label: '订单时间', align: 'center'},
  { prop: 'status', label: '状态', align: 'center' },
])
const isLoading = ref(false)
const showDialog = (data, type) => {
  if (data) {
    dialogType.info = Object.assign({}, data);
  } else {
    dialogType.info = null
  }
  dialogType[type] = true;
}
const getDataList = (page) => {
  if (page) {
    currentLastPage.value = page
  }
  isLoading.value = true
  const send = { page: currentLastPage.value };
  if (searchForm.params) {
    send.params = searchForm.params;
  }
  if (searchForm.status !== 'all') {
    send.status = searchForm.status;
  }
  getList(send)
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
const closeDialogType = (item) => {
  for (const key in dialogType) {
    dialogType[key] = false
  }
  if (item && item.reload) {
    getDataList();
  }
}
getDataList();
const changeSearch = (s) => {
  searchForm.status = s;
  getDataList();
}
</script>