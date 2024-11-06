<template>
  <div class="px-[30px] py-[10px]">
    <div class="flex reset-el-style-v2 justify-end">

      <div class="flex items-center">
        <div class="w-[168px]">
          <el-select v-model="status" @change="changeSearch(status)">
            <el-option v-for="(item) in options"
            :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </div>
        <div class="w-[264px] ml-[10px]">
          <el-input v-model="searchValue" ref="searchInput" suffix-icon="search" placeholder="UID/用户名/备注" />
        </div>
        <el-button type="primary" class="w-[120px] ml-[10px]" @click="getDataList(1)"
          :loading="isLoading">查询</el-button>
      </div>

    </div>
    <div class="reset-el-style-v2 py-[10px]">
      <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :min-width="item.minWidth" :label="item.label"
          :align="item.align">
          <template #default="scope">
           
            <template v-if="item.prop === 'uid' || item.prop === 'order_no'">
              <span class="truncate cursor-pointer" @click="copy(scope.row[item.prop])"> {{
                scope.row[item.prop] }}</span>
            </template>
            <template v-else-if="item.prop === 'username'">
              <span class="truncate cursor-pointer text-[#4377FE] underline" @click="showDialog(scope.row, 'showUserDialog')"> {{
                scope.row[item.prop] }}</span>
            </template>
            <template v-else-if="item.prop === 'transfer'">
              <span class="truncate text-red text-sm"> {{
                scope.row.amount - scope.row.fee }}</span>
            </template>
            <!-- <template v-else-if="item.prop === 'order_no'">
              <el-tooltip :content="scope.row[item.prop]" effect="dark" placement="bottom-start">
                <span v-if="scope.row[item.prop]"> ...{{
                  scope.row[item.prop].substring(scope.row[item.prop].length - 7) }}</span>
              </el-tooltip>
            </template> -->
            <template v-else-if="item.prop === 'currency'">
              <div class="money-class">
                <img :src="`/images/crypto/${scope.row[item.prop].toUpperCase()}.png`" :alt="scope.row[item.prop].toUpperCase()">
                <span>{{ scope.row[item.prop] }}</span>
              </div>
            </template>
            <!-- <span v-else-if="item.prop == 'currency'" align="center">
              {{ scope.row[item.prop] == 'main' ? '交易账户' : scope.row[item.prop] }}
            </span> -->
            <span v-else-if="item.prop == 'channel'" align="center">
              {{ scope.row[item.prop] == 'auto' ? '客户提现' : '后台下分' }}
            </span>
            <span v-else-if="item.prop == 'status'" class="status-bg"  :class="scope.row[item.prop] == 'unknown' ? 'review':scope.row[item.prop]">
              {{ options.find(f => f.value == scope.row[item.prop]).label }}
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="gw(210)" align="center">
          <template #default="scope">
            <el-button class="underline" link :type="checkAuthCode(11101)?'primary':'info'"
              v-if="scope.row['channel']=='auto'"
             :disabled="!checkAuthCode(11101)" @click="showDialog(scope.row, 'showAccountDialog')">提现账号</el-button>
             <b v-if="scope.row['channel']=='auto'" class="split-line"></b>
            <el-button class="underline" link :type="checkAuthCode(11101) && scope.row.status == 'unknown' ?'primary':'info'" :disabled="!checkAuthCode(11101) || scope.row.status !== 'unknown'"
              @click="showDialog(scope.row, 'showDialog')">订单处理</el-button>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
    </div>
    
    <div class="pb-[10px]">
      <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
    </div>

  </div>
  <Edit v-if="dialogType.showDialog" :data="dialogType.info" @close="closeDialogType" />
  <Account v-if="dialogType.showAccountDialog" :order_no="dialogType.info.order_no" @close="closeDialogType" />
  <userDetail v-if="dialogType.showUserDialog" :partyid="dialogType.info.partyid" @close="closeDialogType" />
</template>

<script>
export default { name: 'withdrawlOrder' };
</script>
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
import { hex_md5 } from '/@/utils/md5'

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
const status = ref(sessionStorage.withdrawlOrderStatus || '')
const gw = (w)=>{
  return Math.round(1400/1920 * w)
}

const columnBase = reactive([

  { prop: 'order_no', label: '订单号', minWidth: gw(250), align: 'center' },
  { prop: 'uid', label: 'UID', minWidth: gw(110), align: 'center' },
  { prop: 'username', label: '用户名', minWidth: gw(140), align: 'center' },
  { prop: 'channel', label: '提现类型', minWidth: gw(140), align: 'center' },
  // { prop: 'father_username', label: '代理', minWidth: gw(140), align: 'center' },
  { prop: 'currency', label: '币种', minWidth: gw(140), align: 'center' },
  { prop: 'amount', label: '提现金额', minWidth: gw(140), align: 'center' },
  { prop: 'fee', label: '手续费', minWidth: gw(140), align: 'center' },
  { prop: 'transfer', label: '到账金额', minWidth: gw(140), align: 'center' },
  
  { prop: 'remarks', label: '失败原因',minWidth: gw(190), align: 'center' },
  { prop: 'created', label: '时间', minWidth: gw(150), align: 'center' },
  { prop: 'status', label: '状态', minWidth: gw(140), align: 'center' },
])


const searchValue = ref(sessionStorage.withdrawlOrderSearchValue || '')

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
  const send = { page: currentLastPage.value };
  if (searchValue.value) {
    send.params = searchValue.value;
  }
  if (status.value) {
    send.status = status.value;
  }

  sessionStorage.withdrawlOrderStatus = status.value
  sessionStorage.withdrawlOrderSearchValue = searchValue.value

  const cacheKey = hex_md5(JSON.stringify(send))
  if(sessionStorage['withdrawlOrderSearch']){
    const searchCache = JSON.parse(sessionStorage['withdrawlOrderSearch'])
    if(searchCache.cacheKey == cacheKey){
      tableData.value = searchCache.data
    }else{
      isLoading.value = true
    }
  }else{
    isLoading.value = true
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
      sessionStorage['withdrawlOrderSearch'] = JSON.stringify({
        cacheKey,
        data:res
      })
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