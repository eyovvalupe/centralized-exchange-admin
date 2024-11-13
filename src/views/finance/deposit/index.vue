<template>
<div class="px-[20px] py-[10px]">
    <div class="flex reset-el-style-v2  justify-between">
      <div class="flex items-center">
        <el-radio-group v-model="tabPosition" @change="tabChange">
          <el-radio-button label="RechargeOrder">充值订单</el-radio-button>
          <el-radio-button label="cryptoList">平台充值地址</el-radio-button>
        </el-radio-group>
        
      </div>
      <div class="flex items-center">
        <div class="w-[168px]">
          <el-select v-model="status" @change="changeSearch(status)">
            <el-option v-for="(item) in options2"
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
    
    <div class="reset-el-style-v2 pt-[10px]">
      <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :min-width="item.minWidth" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
           
            <template v-if="item.prop === 'username'">
              <span class="truncate cursor-pointer text-[#4377FE] underline" @click="showDialog(scope.row, 'showUserDialog')"> {{ scope.row[item.prop] }}</span>
            </template>
            <template v-else-if="item.prop === 'uid' || item.prop === 'order_no'">
              <span class="truncate cursor-pointer" @click="copy(scope.row[item.prop])"> {{
                scope.row[item.prop] }}</span>
            </template>
            <template v-else-if="item.prop === 'currency'">
              <div class="money-class ">
                <img :src="`/images/crypto/${scope.row[item.prop].toUpperCase()}.png`" :alt="scope.row[item.prop].toUpperCase()">
                <span>{{ scope.row[item.prop] }}</span>
              </div>
            </template>
            <template v-else-if="item.prop == 'amount'">
              <span class="text-[#FF0004] text-sm">{{ scope.row[item.prop] }}</span>
            </template>
            <!-- 订单号展示 -->
            <!-- <template v-else-if="item.prop === 'order_no'">
              <el-tooltip :content="scope.row[item.prop]" effect="dark" placement="bottom-start">
                <span v-if="scope.row[item.prop]"> ...{{
                  scope.row[item.prop].substring(scope.row[item.prop].length - 7) }}</span>
              </el-tooltip>
            </template> -->
            <!-- <span v-else-if="item.prop == 'currency'" align="center">
             {{   scope.row[item.prop]=='main'?'交易账户':scope.row[item.prop] }}
            </span> -->
            <span v-else-if="item.prop == 'channel'" align="center">
             {{   scope.row[item.prop]=='crypto'?'加密货币':'手动操作'}}
            </span>
            <span v-else-if="item.prop == 'status'" class="status-bg"
              :class="scope.row[item.prop] == 'unknown' ? 'review' : scope.row[item.prop]">
              {{ options2.find(f => f.value == scope.row[item.prop]).label }}
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="gw(210)" align="center">
          <template #default="scope">
            <el-button link  class="underline" size="default" :type="scope.row.status == 'success'?'info':'primary'"  :disabled="scope.row.status == 'success'"
              @click="showDialog(scope.row, 'showDialog')">充值审核</el-button>
              <b class="split-line" v-if="scope.row['channel']=='crypto'" ></b>
              <el-button link type="primary"  size="default" class="underline" v-if="scope.row['channel']=='crypto'" @click="showDialog(scope.row, 'showAddressDialog')">充值地址</el-button>
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
  <Edit v-if="dialogType.showDialog" :data="dialogType.info" @close="closeDialogType" />
  <Address v-if="dialogType.showAddressDialog" :data="dialogType.info" @close="closeDialogType" />
  <userDetail v-if="dialogType.showUserDialog" :partyid="dialogType.info.partyid" @close="closeDialogType" />
</template>

<script>
export default { name: 'RechargeOrder' };
</script>
<script setup>
import { apiDepositRecord } from '/@/api/modules/business/recharge-order.api'
import { copy } from '/@/utils'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, dayjs } from 'element-plus'
import userDetail from '/@/components/userDetail/index.vue'

import Edit from './Edit.vue'
import Address from './Address.vue'
import { hex_md5 } from '/@/utils/md5'
import { useRouter } from 'vue-router'
const router = useRouter()

const tabPosition = ref('RechargeOrder')
const tabChange = ()=>{
  router.replace({
    name:tabPosition.value
  })
}


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
const status = ref(sessionStorage.rechargeOrderStatus || '')

const gw = (w)=>{
  return Math.round(1400/1920 * w)
}

const columnBase = reactive([
  { prop: 'order_no', label: '订单号',minWidth: gw(300),  align: 'center' },
  { prop: 'uid', label: 'UID', minWidth: gw(110), align: 'center' },
  { prop: 'username', label: '用户名', align: 'center', minWidth: gw(200) },
  // { prop: 'father_username', label: '代理', minWidth: gw(170), align: 'center' },
  { prop: 'channel', label: '渠道', minWidth: gw(170), align: 'center' },
  { prop: 'currency', label: '币种',minWidth: gw(170), align: 'center' },
  { prop: 'amount', label: '充值金额', minWidth: gw(170), align: 'center' },
  { prop: 'remarks', label: '失败原因',minWidth: gw(210),align: 'center' },
  { prop: 'created', label: '时间', minWidth: gw(170), align: 'center' },
  { prop: 'status', label: '状态', minWidth: gw(170), align: 'center' },
])

const searchValue = ref(sessionStorage.rechargeOrderSearchValue || '')
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
  const send = { page: currentLastPage.value };
  if (searchValue.value) {
    send.params = searchValue.value;
  }
  if (status.value) {
    send.status = status.value;
  }
  sessionStorage.rechargeOrderStatus = status.value;
  sessionStorage.rechargeOrderSearchValue = searchValue.value;
  
  const cacheKey = hex_md5(JSON.stringify(send))
  if(sessionStorage['rechargeOrderSearch']){
    const searchCache = JSON.parse(sessionStorage['rechargeOrderSearch'])
    if(searchCache.cacheKey == cacheKey){
      tableData.value = searchCache.data
    }else{
      isLoading.value = true
    }
  }else{
    isLoading.value = true
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
      sessionStorage['rechargeOrderSearch'] = JSON.stringify({
        cacheKey,
        data:res
      })
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