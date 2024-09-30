<template>
  <div class="reset-el-styte">
    <div class="flex justify-between p-2">
      <div> </div>
      <div class="flex justify-end p-2 pb-0" style="min-width: 500px;">
        <el-button :type="status == item.value ? 'active-green' : 'default'" v-for="(item) in options" :key="item.value"
          @click="changeSearch(item.value)">{{ item.label }}</el-button>
        <el-input v-model="searchValue" class="ml-2" size="large" placeholder="订单号/UID/用户名" :suffix-icon="Search" />
        <!-- <el-select v-model="status" clearable placeholder="请选择"  class="ml-2" >
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select> -->
        <el-button type="primary" class="ml-2" :icon="Search" @click="getDataList(1)"
          :loading="isLoading">查询</el-button>

      </div>
    </div>
    <div class="p-2 pt-0 h-full">
      <el-table :data="tableData" :border="tableData.length" :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span v-if="item.prop == 'created'" label="时间" align="center">
              {{ dayjs(scope.row[item.prop]).format('MM-DD hh:mm:ss') }}
            </span>
            <template v-else-if="item.prop === 'username'">
              <span class="truncate cursor-pointer text-[#165DFF]" @click="showDialog(scope.row, 'showUserDialog')"> {{
                scope.row[item.prop] }}</span>
            </template>
            <template v-else-if="item.prop === 'order_no'">
              <el-tooltip :content="scope.row[item.prop]" effect="dark" placement="bottom-start">
                <span v-if="scope.row[item.prop]"> ...{{
                  scope.row[item.prop].substring(scope.row[item.prop].length - 7) }}</span>
              </el-tooltip>
            </template>
            <span v-else-if="item.prop == 'currency'" align="center">
              {{ scope.row[item.prop] == 'main' ? '交易账户' : scope.row[item.prop] }}
            </span>
            <span v-else-if="item.prop == 'status'" class="status-bg"  :class="scope.row[item.prop] == 'unknown' ? 'status-yellow':scope.row[item.prop]">
              {{ options.find(f => f.value == scope.row[item.prop]).label }}
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170" align="center">
          <template #default="scope">
            <el-button link :type="checkAuthCode(11101)?'primary':'info'" :disabled="!checkAuthCode(11101)" @click="showDialog(scope.row, 'showAccountDialog')">提现账号</el-button>
            <el-button link :type="checkAuthCode(11101) && scope.row.status == 'unknown' ?'primary':'info'" :disabled="!checkAuthCode(11101) || scope.row.status !== 'unknown'"
              @click="showDialog(scope.row, 'showDialog')">订单处理</el-button>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
      <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
    </div>
  </div>
  <Edit v-if="dialogType.showDialog" :data="dialogType.info" @close="closeDialogType" />
  <Account v-if="dialogType.showAccountDialog" :order_no="dialogType.info.order_no" @close="closeDialogType" />
  <userDetail v-if="dialogType.showUserDialog" :partyid="dialogType.info.partyid" @close="closeDialogType" />
</template>

<script setup>
import { apiWithdrawRecord } from '/@/api/modules/business/withdrawl-order.api'
import { copy } from '/@/utils'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, dayjs } from 'element-plus'
import Edit from './Edit.vue'
import Account from './Account.vue'
import userDetail from '/@/components/userDetail/index.vue'
import { checkAuthCode } from '/@/hooks/store.hook.js'

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:DepositOrder', () => {
  getDataList()
})
const dialogType = reactive({
  showDialog: false,
  showGoogle: false,
  showAccountDialog: false,
  showResetDialog: false,
  showUserDialog: false,
  info: null
})
const currentPage = ref(1)
const currentLastPage = ref(1)
const status = ref('')
const columnBase = reactive([
{ prop: 'uid', label: 'UID', width: 100, align: 'center' },
  { prop: 'order_no', label: '订单号', width: 100, align: 'center' },
  { prop: 'username', label: '用户名', width: 130, align: 'center' },
  { prop: 'father_username', label: '代理', width: 100, align: 'center' },
  { prop: 'currency', label: '币种', width: 90, align: 'center' },
  { prop: 'amount', label: '提现金额', width: 100, align: 'center' },
  { prop: 'fee', label: '手续费', width: 100, align: 'center' },
  // { prop: 'transfer', label: '到账金额', width: 100, align: 'center' },
  { prop: 'status', label: '状态', width: 90, align: 'center' },
  { prop: 'remarks', label: '失败原因', align: 'center' },
  { prop: 'created', label: '时间', width: 120, align: 'center' },
])
const searchValue = ref('')

const options = [
  {
    value: '',
    label: '全部'
  },
  {
    value: 'unknown',
    label: '审核中'
  },
  {
    value: 'success',
    label: '通过'
  },
  {
    value: 'failure',
    label: '拒绝'
  },
]
if (searchValue.value) {
  send.params = searchValue.value;
}
if (status.value) {
  send.status = status.value;
}
const isLoading = ref(false)
const googleLoading = ref(false)
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
  if (searchValue.value) {
    send.params = searchValue.value;
  }
  if (status.value) {
    send.status = status.value;
  }
  apiWithdrawRecord(send)
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
const changeSearch = (s) => {
  status.value = s;
  getDataList();
}
getDataList();
</script>