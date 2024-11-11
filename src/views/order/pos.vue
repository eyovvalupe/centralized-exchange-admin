<template>
   <div class="px-[30px] py-[10px]">
    <div class="flex reset-el-style-v2 justify-between">
      <div class="flex items-center">
        <el-radio-group v-model="tabPosition" @change="tabChange">
          <el-radio-button label="orderPositions">股票持仓单</el-radio-button>
          <el-radio-button label="orderIndex">股票历史订单</el-radio-button>
        </el-radio-group>
        <el-button type="primary" class="ml-[10px]" icon="plus" plain @click="showDialog(null, 'showLockDialog')">创建锁定单</el-button>
      </div>

      <div class="flex items-center">
        <div class="w-[168px]">
          <el-select v-model="searchValue" @change="changeSearch(searchValue)">
            <el-option v-for="(item) in optionStatus"
            :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </div>
        <div class="w-[264px] ml-2">
          <el-input v-model="searchStrbtn" ref="searchInput" suffix-icon="search" placeholder="UID/用户名" />
        </div>
        <el-button type="primary" class="w-[120px] ml-[10px]" @click="getDataList(1)"
          :loading="isLoading">查询</el-button>
      </div>      
    </div> 
    <div class="py-[10px] reset-el-style-v2">
      <el-table :data="tableData" :border="tableData.length > 0" :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :min-width="item.minWidth" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span class="flex justify-center items-center" v-if="item.prop === 'profit'" style="line-height: 20px;">
              <span class="w-100 block"
                :class="scope.row[item.prop] >= 0 ? 'success' : scope.row[item.prop] < 0 ? 'failure' : ''">
                {{ scope.row[item.prop] }}
              </span>
              <b class="split-line"></b>
              <span class="w-100 block"
                :class="scope.row['ratio'] >= 0 ? 'success' : scope.row['ratio'] < 0 ? 'failure' : ''">
                {{ scope.row['ratio'] }}%
              </span>
            </span>
            <template v-else-if="item.prop === 'uid'">
              <span class="truncate cursor-pointer" @click="copy(scope.row[item.prop])"> {{
                scope.row[item.prop] }}</span>
            </template>
            <span class="flex justify-center items-center" v-else-if="item.prop == 'settled_price'">
              <span>{{ scope.row.open_price || '--' }}</span>
              <b class="split-line"></b>
              <span>{{ scope.row.settled_price || '--' }}</span>
            </span>

            <!-- <template v-else-if="item.prop === 'order_no'">
              <el-tooltip :content="scope.row[item.prop]" effect="dark" placement="bottom-start">
                <span v-if="scope.row[item.prop]"> ...{{
                  scope.row[item.prop].substring(scope.row[item.prop].length - 7) }}</span>
              </el-tooltip>
            </template> -->
            <span v-else-if="item.prop === 'username'">
              <span class=" cursor-pointer text-[#4377FE] underline" @click="showDialog(scope.row, 'showInfoDialog')">{{
                scope.row[item.prop] }}
              </span>
            </span>
            <span class="flex flex-col" v-else-if="item.prop === 'symbol'">
              {{ scope.row['symbol'] }}
              <span class="text-gray-400 text-[11px] leading-none">{{ scope.row['name'] || '--' }}</span>
            </span>
        
            <span v-else-if="item.prop === 'role'">
              {{ optionStatus.find(f => f.value == scope.row[item.prop]).label }}
            </span>
            <span class="flex items-center justify-center" v-else-if="['offset'].includes(item.prop)">
              {{ transKeyName(scope.row['lever_type'], 'lever_type') }}
              <b class="split-line"></b>
              <span class="status-bg" :class="[scope.row[item.prop] == 'long' ? 'success' : 'short']">{{ transKeyName(scope.row[item.prop], item.prop) }}</span>
              <b class="split-line"></b>
              {{ scope.row['lever'] }}X
            </span>
            <span class="flex" v-else-if="['status'].includes(item.prop)">
              <span class="status-bg plain" :class="scope.row[item.prop]">
                {{ transKeyName(scope.row[item.prop], item.prop) }}
              </span>
            </span>
            <span v-else-if="item.prop === 'price_type'">
              {{ transKeyName(scope.row[item.prop], item.prop) }}<b class="split-line"
                v-if="scope.row['open_price'] == 'limit'"></b>{{ scope.row['price'] }}
            </span>
            <!-- <span v-else-if="item.prop === 'open_volume'">
              {{ transKeyName(scope.row[item.prop], item.prop) }}<b class="split-line"></b>{{ scope.row['unsold_volume']
              }}
            </span> -->
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
            <div class="flex justify-between items-center w-full relative">
              <div class="flex items-center justify-center flex-1 px-[21px]">
                <el-button link type="primary" class="underline" size="default" @click="showDialog(scope.row, 'showDialog')">查看订单</el-button>
              </div>
            
              <el-dropdown  class="!absolute right-[5px] top-[1px] w-[16px] h-[16px]">
                <img class="w-[16px] h-[16px]" src="/src/assets/images/more.svg" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="showDialog(scope.row, 'closePos')">
                      <el-icon :size="20" color="red">
                        <WarnTriangleFilled />
                      </el-icon> <span class="ml-1" style="color: red;">强行平仓</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
    </div>
  </div>
  <AddLock v-if="dialogType.showLockDialog" @close="closeDialogType" />
  <closePos v-if="dialogType.closePos" :dataInfo="dialogType.info" :orderNo="orderNo" @close="closeDialogType" />
  <detailDialog v-if="dialogType.showDialog" :orderNo="orderNo" @close="closeDialogType" />
  <userDetail v-if="dialogType.showInfoDialog && dialogType.info" :partyid="dialogType.info.partyid"
    @close="closeDialogType" />

</template>

<script>
export default { name: 'orderPositions' };
</script>
<script setup>
import closePos from './components/closePos.vue'
import detailDialog from '/@/components/detailDialog/index.vue'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { ElDialog, ElMessage, dayjs } from 'element-plus'
import { copy } from '/@/utils'
import userDetail from '/@/components/userDetail/index.vue'
import AddLock from './components/AddLock.vue'
import { useSocketStore } from '/@/store'
import { useRouter } from 'vue-router'
const router = useRouter()
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

const tabPosition = ref('orderPositions')
const tabChange = ()=>{
  router.replace({
    name:tabPosition.value
  })
}

const dialogLoading = ref(false)
const searchValue = ref(sessionStorage['orderPosSearchValue'] || 'all')
const searchStr = ref(sessionStorage['orderPosSearchStr'] || '')
const searchStrbtn = ref(searchStr.value)
const tableData = computed(() => {
  let list = socketStore.stockOrderList || []
  if (searchValue.value !== 'all') {
    list = socketStore.stockOrderList.filter(f => f.role == searchValue.value)
  }
  if (searchStr.value) {
    list = socketStore.stockOrderList.filter(f => {
      return f.username.indexOf(searchStr.value) !== -1 || f.uid.indexOf(searchStr.value) !== -1
    })
  }
  return list
});

const dialogType = reactive({
  info: null,
  showInfoDialog: false,
  showLockDialog: false,
  showDialog: false,
  closePos: false
})
const getDataList = () => {
  searchStr.value = searchStrbtn.value;
  sessionStorage['orderPosSearchValue'] = searchValue.value
  sessionStorage['orderPosSearchStr'] = searchStr.value
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
      done: "平仓",
      settled: "已结算",
      fail: "失败",
      cancel: "已取消"
    }
  }
  str = obj[val] || val;
  return str;
}

const gw = (w)=>{
  return Math.round(1400/1920 * w)
}

const columnBase = ref([
  { prop: 'uid', label: 'UID',minWidth:gw(110), align: 'center' },
  { prop: 'username', label: '用户名',minWidth:gw(140), align: 'center' },
  { prop: 'role', label: '角色',minWidth:gw(160), align: 'center' },
  { prop: 'symbol', label: '股票代码',minWidth:gw(240), align: 'center' },
  { prop: 'offset', label: '开仓', minWidth: gw(200), align: 'center' },
  { prop: 'settled_price', label: '买价/现价', minWidth:gw(200), align: 'center' },
  { prop: 'unsold_volume', label: '可售数量', minWidth:gw(120), align: 'center' },
  { prop: 'surplus_margin', label: '剩余保证金',minWidth:gw(120), align: 'center' },
  { prop: 'profit', label: '订单收益/百分比', minWidth:gw(200), align: 'center' },
  { prop: 'status', label: '状态', minWidth:gw(110), align: 'center' },
  { prop: 'date', label: '时间', minWidth:gw(150), align: 'center' }
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
  sessionStorage['orderPosSearchValue'] = searchValue.value
}
// watch(() => socketStore.sokcetWS, (ws) => {
//   if (ws) {
//     socketStore.send('stockorder')
//   }
// }, { immediate: true })
// watch(() => socketStore.stockOrderList, (val) => {
//   if (val) {
//     tableData.value = val;
//   }
// })
</script>

<style lang="scss">
.player {
  .el-pager {
    display: none;
  }
}
</style>
