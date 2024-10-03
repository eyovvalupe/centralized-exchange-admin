<template>
  <div class="reset-el-styte">
    <div class="flex justify-end p-2 reset-el-styte">
      <div></div>
      <div class="flex">
        <div class="mr-5">
          <el-button :type="status == item.value ? 'success' : 'default'" v-for="(item) in options2" :key="item.value"
          @click="changeSearch(item.value)">{{ item.label }}</el-button>
        </div>
        <el-input v-model="searchValue" clearable placeholder="UID/用户名/备注" style="width: 200px;" />
        <!-- <el-select v-model="searchForm.status" placeholder="" class="ml-2" style="width: 130px;">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select> -->
        <el-button type="primary" class="ml-2" :icon="Search" @click="getDataList(1)"
          :loading="isLoading">搜索</el-button>
      </div>
    </div>
    <div>
      <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span v-if="item.prop == 'created'">
              {{ dayjs(scope.row[item.prop]).format('MM-DD hh:mm:ss') }}
            </span>
            <template v-else-if="item.prop === 'username'">
              <span class="truncate cursor-pointer text-[#165DFF]" @click="showDialog(scope.row, 'showUserDialog')"> {{
                scope.row[item.prop] }}</span>
            </template>
            <template v-else-if="item.prop === 'uid' || item.prop === 'order_no'">
              <span class="truncate cursor-pointer" @click="copy(scope.row[item.prop])"> {{
                scope.row[item.prop] }}</span>
            </template>
            <!-- 订单号展示 -->
            <!-- <template v-else-if="item.prop === 'order_no'">
              <el-tooltip :content="scope.row[item.prop]" effect="dark" placement="bottom-start">
                <span v-if="scope.row[item.prop]"> ...{{
                  scope.row[item.prop].substring(scope.row[item.prop].length - 7) }}</span>
              </el-tooltip>
            </template> -->
            <span v-else-if="item.prop == 'currency'" align="center">
             {{   scope.row[item.prop]=='main'?'交易账户':scope.row[item.prop] }}
            </span>
            <span v-else-if="item.prop == 'channel'" align="center">
             {{   scope.row[item.prop]=='crypto'?'加密货币':'手动操作'}}
            </span>
            <span v-else-if="item.prop == 'status'" class="status-bg"
              :class="scope.row[item.prop] == 'unknown' ? 'status-yellow':scope.row[item.prop]">
              {{ options2.find(f => f.value == scope.row[item.prop]).label }}
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button link  :type="scope.row.status == 'success'?'info':'primary'"  :disabled="scope.row.status == 'success'"
              @click="showDialog(scope.row, 'showDialog')">充值审核</el-button>
              <el-button link type="primary"  v-if="scope.row['channel']=='crypto'" @click="showDialog(scope.row, 'showAddressDialog')">充值地址</el-button>
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
  <Address v-if="dialogType.showAddressDialog" :data="dialogType.info" @close="closeDialogType" />
  <userDetail v-if="dialogType.showUserDialog" :partyid="dialogType.info.partyid" @close="closeDialogType" />
</template>

<script setup>
import { apiDepositRecord } from '/@/api/modules/business/recharge-order.api'
import { copy } from '/@/utils'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, dayjs } from 'element-plus'
import userDetail from '/@/components/userDetail/index.vue'

import Edit from './Edit.vue'
import Address from './Address.vue'

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:RechargeOrder', () => {
  getDataList()
})
const dialogType = reactive({
  showDialog: false,
  showAddressDialog: false,
  showGoogle: false,
  showResetDialog: false,
  showUserDialog: false,
  info: null
})
const currentLastPage = ref(1)
const currentPage = ref(1)
const status = ref('')
const columnBase = reactive([
  { prop: 'order_no', label: '订单号',width: 200,  align: 'center' },
  { prop: 'uid', label: 'UID', width: 120, align: 'center' },
  { prop: 'username', label: '用户名', align: 'center', width: 180 },
  { prop: 'father_username', label: '代理', width: 180, align: 'center' },
  { prop: 'channel', label: '渠道', width: 80, align: 'center' },
  { prop: 'currency', label: '币种', width: 90, align: 'center' },
  { prop: 'amount', label: '充值金额', width: 120, align: 'center' },
  { prop: 'remarks', label: '失败原因',align: 'center' },
  { prop: 'created', label: '时间', width: 120, align: 'center' },
  { prop: 'status', label: '状态', width: 70, align: 'center' },
])
const searchValue = ref('')
const options2 = [
{
    value: '',
    label: '全部'
  },
  {
    value: 'unknown',
    label: '审核中'
  },
  {
    value: 'failure',
    label: '拒绝'
  },
  {
    value: 'success',
    label: '通过'
  },
]
if (searchValue.value) {
  send.params = searchValue.value;
}
if (status.value) {
  send.status = status.value;
}
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
  if (searchValue.value) {
    send.params = searchValue.value;
  }
  if (status.value) {
    send.status = status.value;
  }
  apiDepositRecord(send)
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