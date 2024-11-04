<template>
  <div class="reset-el-styte">
    <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span v-if="item.prop == 'created'">
              {{ dayjs(scope.row[item.prop]).format('MM-DD hh:mm:ss') }}
            </span>
            <template v-else-if="item.prop === 'username'">
              <span class="truncate cursor-pointer text-[#4377FE]" @click="emit('showUserDialog',scope.row)"> {{
                scope.row[item.prop] }}</span>
            </template>
            <template v-else-if="item.prop === 'uid'">
              <span class="truncate cursor-pointer" @click="copy(scope.row[item.prop])"> {{
                scope.row[item.prop] }}</span>
            </template>
            <template v-else-if="item.prop === 'order_no'">
              <el-tooltip :content="scope.row[item.prop]" effect="dark" placement="bottom-start">
                <span v-if="scope.row[item.prop]"> ...{{
                  scope.row[item.prop].substring(scope.row[item.prop].length - 7) }}</span>
              </el-tooltip>
            </template>
            <span v-else-if="item.prop == 'currency'" align="center">
             {{   scope.row[item.prop]=='main'?'交易账户':scope.row[item.prop] }}
            </span>
            <span v-else-if="item.prop == 'status'" class="status-bg"
              :class="scope.row[item.prop] == 'success' ? 'close' : 'status-yellow'">
              {{ options.find(f => f.value == scope.row[item.prop]).label }}
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
</template>

<script setup>
import { apiDepositRecord } from '/@/api/modules/business/recharge-order.api'
import { copy } from '/@/utils'
import { ref, reactive, onMounted, computed, defineEmits } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, dayjs } from 'element-plus'
const emit=defineEmits(['showUserDialog'])
const tableData = ref([]);
const currentLastPage = ref(1)
const currentPage = ref(1)
const status = ref('')
const columnBase = reactive([
  { prop: 'order_no', label: '订单号',width: 100,  align: 'center' },
  { prop: 'uid', label: 'UID', width: 100, align: 'center' },
  { prop: 'username', label: '用户名', align: 'center', width: 130 },
  { prop: 'father_username', label: '上线代理', align: 'center' },
  { prop: 'status', label: '状态', width: 90, align: 'center' },
  { prop: 'currency', label: '货币', width: 90, align: 'center' },
  { prop: 'amount', label: '充值金额', align: 'center' },
  { prop: 'created', label: '时间', width: 200, align: 'center' },
  { prop: 'remarks', label: '备注',align: 'center' }
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
    label: '已处理'
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