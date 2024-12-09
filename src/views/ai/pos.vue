<template>
<div class="px-[20px] py-[10px]">
    <div class="flex reset-el-style-v2 justify-between">
      <div class="flex items-center">
        <el-radio-group v-model="tabPosition" @change="tabChange">
          <el-radio-button label="aiPos">交易机器人持仓单</el-radio-button>
          <el-radio-button label="aiSearch">交易机器人订单查询</el-radio-button>
          <el-radio-button label="aiIndex">交易机器人场控</el-radio-button>
        </el-radio-group>
        <el-button class="ml-[10px]" plain icon="plus" type="primary" @click="showDialog(null, 'showCtrDialog')">添加场控</el-button>
      </div>
      <div class="flex items-center">
        <div class="w-[168px]">
          <el-select v-model="searchValue" @change="changeSearch(searchValue)">
            <el-option v-for="(item) in optionStatus"
            :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </div>
        <div class="w-[264px] ml-[10px]">
          <el-input v-model="searchStrbtn" ref="searchInput" suffix-icon="search" placeholder="UID/用户名" />
        </div>
        <el-button type="primary" class="w-[120px] ml-[10px]" @click="getDataList(1)"
          :loading="isLoading">查询</el-button>
      </div>

    </div>
    <div class="reset-el-style-v2 pt-[10px]">
      <el-table :data="tableData" :border="tableData.length > 0" :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :minWidth="item.minWidth" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span v-if="item.prop === 'profit'">
                {{ scope.row['amountreturn'] }} USDT
            </span>
            <template v-else-if="item.prop === 'uid'">
              <span class="truncate cursor-pointer" @click="copy(scope.row[item.prop])"> {{
                scope.row[item.prop] }}</span>
            </template>
            
            <span v-else-if="item.prop === 'username'">
              <span class="underline cursor-pointer text-[#4377FE]" @click="showDialog(scope.row, 'showInfoDialog')">{{
                scope.row[item.prop] }}
              </span>
            </span>
            <span class="underline cursor-pointer text-[#4377FE]" @click="showDialog(scope.row, 'showQuotationsDialog')" v-else-if="item.prop === 'name'">
              {{ scope.row['name'] }}
            </span>
            <span v-else-if="item.prop === 'date'">
              {{ dayjs(scope.row[item.prop]).format('MM-DD hh:mm:ss') }}
            </span>
           
            <span class="status-bg" :class="[scope.row[item.prop] == 'long' ? 'success' : 'short']" v-else-if="['offset'].includes(item.prop)">
       
              {{ transKeyName(scope.row[item.prop], item.prop) }}
            </span>
            <span class="flex" v-else-if="['status'].includes(item.prop)">
              <span class="status-bg plain" :class="scope.row[item.prop]">
                {{ transKeyName(scope.row[item.prop], item.prop) }}
              </span>
            </span>
            <span v-else-if="item.prop === 'role'" class="status-bg" :class="scope.row[item.prop]=='guest'?'status-yellow':''">
              {{ optionStatus.find(f => f.value == scope.row[item.prop]).label }}
            </span> 
            <span v-else-if="item.prop === 'price_type'">
              {{ transKeyName(scope.row[item.prop], item.prop) }}<b class="split-line"
                v-if="scope.row['open_price'] == 'limit'"></b>{{ scope.row['price'] }}
            </span>
            <span v-else-if="item.prop === 'time'">
              {{ scope.row[item.prop] }} {{ optionsTime.find(f => f.value == scope.row.unit).label }}

            </span>
            <span v-else-if="item.prop === 'endtime'">
              {{ scope.row[item.prop] }} 秒
            </span>
        
            <span v-else-if="item.prop === 'margin'">
              {{ transKeyName(scope.row[item.prop], item.prop) }}
              <!-- <b class="split-line"></b>{{ scope.row['unlock'] }} -->
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="gw(140)" align="center">
          <template #default="scope">
            <el-button link class="underline" size="default" type="primary" @click="showDialog(scope.row, 'showCtrDialog')">用户场控</el-button>
            <!-- <el-button link type="primary" @click="showDialog(scope.row, 'showDialog')">查看订单</el-button> -->
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
    </div>
  </div>
  <MarketQuotations :symbol="dialogType.info.symbol" v-if="dialogType.showQuotationsDialog" @close="closeDialogType" />
  <EditPrice v-if="dialogType.showCtrDialog" :data="dialogType.info"  @close="closeDialogType" />
  <userDetail v-if="dialogType.showInfoDialog && dialogType.info" :partyid="dialogType.info.partyid"  @close="closeDialogType" />

</template>

<script>
export default { name: 'aiPos' };
</script>
<script setup>
import EditPrice from './components/EditPrice.vue'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { ElDialog, ElMessage, dayjs } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import { copy } from '/@/utils'
import userDetail from '/@/components/userDetail/index.vue'
import { checkAuthCode } from '/@/hooks/store.hook.js'
import MarketQuotations from '../contract/components/MarketQuotations'
import { useSocketStore } from '/@/store'
import { useRouter } from 'vue-router'
const router = useRouter()

const tabPosition = ref('aiPos')
const tabChange = ()=>{
  router.replace({
    name:tabPosition.value
  })
}


const socketStore = useSocketStore()
const optionStatus = [
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
const optionsTime = [
  { value : 's', label : '秒' },
  { value : 'm', label : '分钟' },
  { value : 'h', label : '小时' },
  { value : 'd', label : '天' }
]
const dialogLoading = ref(false)
const searchValue = ref(sessionStorage['aiPosSearchValue'] || 'all')
const searchStr = ref(sessionStorage['aiPosSearchStr'] || '')
const searchStrbtn = ref(searchStr.value)
const tableData = computed(() => {
  let list = socketStore.aiOrderList || []
  if (searchValue.value !== 'all') {
    list = socketStore.aiOrderList.filter(f => f.role == searchValue.value)
  }
  if (searchStr.value) {
    list = socketStore.aiOrderList.filter(f => {
      return f.username.indexOf(searchStr.value) !== -1 || f.uid.indexOf(searchStr.value) !== -1
    })
  }
  sessionStorage['aiPosSearchValue'] = searchValue.value
  sessionStorage['aiPosSearchStr'] = searchStr.value
  return list
});
const dialogType = reactive({
  info: null,
  showQuotationsDialog:false,
  showInfoDialog: false,
  showLockDialog: false,
  showCtrDialog: false,
  showDialog: false,
  closePos: false
})
const getDataList = () => {
  isLoading.value = true
  searchStr.value = searchStrbtn.value;
  setTimeout(()=>{
    isLoading.value = false
  },300)
}

const transKeyName = (val, key) => {
  let str = val;
  let obj = {};
  if (key === 'lever_type') {
    obj = {
      cross: '全仓',
      isolated: '逐仓'
    }
  } else if (key === 'offset') {
    obj = {
      long: '买涨',
      short: '买跌'
    }
  } else if (key === 'price_type') {
    obj = {
      market: '市价',
      limit: '限价'
    }
  } else if (key === 'stop_profit_type') {
    obj = {
      price: '价格',
      amount: '金额',
      ratio: '百分比',
    }
  } else if (key === 'status') {
    obj = {
      none: "开仓",
      lock: "锁定",
      open: "持仓",
      close: "平仓",
      settled: "已结算",
      fail: "失败",
      cancel: "已取消",
      done: "完成"
    }
  }
  str = obj[val] || val;
  return str;
}



const gw = (w)=>{
  return Math.round(1400/1920 * w)
}

const columnBase = ref([
  { prop: 'uid', label: 'UID', minWidth: gw(110),align: 'center' },
  { prop: 'username', label: '用户名', minWidth: gw(160), align: 'center' },
  { prop: 'role', label: '角色',minWidth: gw(140), align: 'center' },
  { prop: 'name', label: '名称',minWidth: gw(160), align: 'center' },
  { prop: 'offset', label: '开仓', minWidth: gw(140), align: 'center' },
  { prop: 'lever', label: '网格', minWidth: gw(140), align: 'center' },
  { prop: 'time', label: '时间区间', minWidth: gw(140), align: 'center' },
  { prop: 'amount', label: '投资金额', minWidth: gw(140),align: 'center' },
  { prop: 'endtime', label: '剩余时间', minWidth: gw(140), align: 'center' },
  { prop: 'profit', label: '预期盈亏',minWidth: gw(230), align: 'center' },
  { prop: 'date', label: '时间', minWidth: gw(140), align: 'center' },
  { prop: 'status', label: '用户场控', minWidth: gw(140), align: 'center' },
  
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
  dialogLoading.value = false;
  if (item && item.reload) {
  }
}
const changeSearch = (s) => {
  searchValue.value = s;
  searchStrbtn.value = ''
  searchStr.value = ''
}
watch(() => socketStore.sokcetWS, (ws) => {
  if (ws) {
    socketStore.send('aiquantorder', '')
  }
}, { immediate: true })
</script>

<style lang="scss">
.player {
  .el-pager {
    display: none;
  }
}
</style>
