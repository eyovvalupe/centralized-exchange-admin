<template>
  <div class="px-[30px] py-[10px]">
    <div class="flex reset-el-style-v2  justify-between">
      <div class="flex items-center">
        <el-radio-group v-model="tabPosition" @change="tabChange">
          <el-radio-button label="contractPos">合约持仓单</el-radio-button>
          <el-radio-button label="contractSearch">合约历史订单</el-radio-button>
          <el-radio-button label="contractIndex">合约场控</el-radio-button>
        </el-radio-group>
        <el-button class="ml-[10px]" :type="checkAuthCode(232)?'primary':'info'" plain :disabled="!checkAuthCode(232)" icon="plus" @click="showDialog(null, 'showLockDialog')">创建锁定单</el-button>
        <!-- <el-button :type="checkAuthCode(232)?'success':'info'" :disabled="!checkAuthCode(232)"  @click="showDialog(null, 'showCtrDialog')">合约场控</el-button> -->
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
        <el-button type="primary" class="w-[120px] ml-2" @click="getDataList(1)"
          :loading="isLoading">查询</el-button>
      </div>
    </div>
    <div class="reset-el-style-v2 py-[10px]">
      <el-table :data="tableData" :border="tableData.length > 0" :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column :min-width="item.minWidth" v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span v-if="item.prop === 'profit'" class="flex items-center">
              <span class="w-100 block"
                :class="scope.row[item.prop] > 0 ? 'success' : scope.row[item.prop] < 0 ? 'failure' : ''">
                {{ scope.row[item.prop] }}
              </span>
              <b class="split-line"></b>
              <span class="w-100 block"
                :class="scope.row['ratio'] > 0 ? 'success' : scope.row['ratio'] < 0 ? 'failure' : ''">
                {{ scope.row['ratio'] * 100 }}%
              </span>
            </span>
            <template v-else-if="item.prop === 'uid'">
              <span class="truncate cursor-pointer" @click="copy(scope.row[item.prop])"> {{
                scope.row[item.prop] }}</span>
            </template>
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
            <span v-else-if="item.prop === 'role'" class="status-bg" :class="scope.row[item.prop]=='guest'?'status-yellow':''">
              {{ optionStatus.find(f => f.value == scope.row[item.prop]).label }}
            </span> 
            <span v-else-if="item.prop === 'symbol'">
              {{ scope.row['symbol'] }}
              <!-- <b class="split-line"></b>{{ scope.row['market'] }} -->
            </span>
            <span v-else-if="item.prop === 'date'">
              {{ dayjs(scope.row[item.prop]).format('MM-DD hh:mm:ss') }}
            </span>
            <!-- <span v-else-if="item.prop === 'role'">
              {{ optionStatus.find(f => f.value == scope.row[item.prop]).label }}
            </span> -->
            <span class="flex items-center " v-else-if="['offset'].includes(item.prop)">
              {{ transKeyName(scope.row['lever_type'], 'lever_type') }}
              <b class="split-line"></b>
              <span class="status-bg" :class="[scope.row[item.prop] == 'long' ? 'success' : 'short']">{{ transKeyName(scope.row[item.prop], item.prop) }}</span>
              <b class="split-line"></b>
              {{ scope.row['lever'] }}X
            </span>
            <span v-else-if="['status'].includes(item.prop)">
              <span class="status" :class="scope.row[item.prop] != 'open' && scope.row[item.prop] != 'none' ? scope.row[item.prop] : ''">
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
        <el-table-column label="操作" :min-width="minWidth" align="center">
          <template #default="scope">
            <div class="w-full flex justify-between">
              <div class="flex-1 flex justify-center items-center">
                <el-button link type="primary" size="default" class="underline" @click="showDialog(scope.row, 'showDialog')">
                  查看订单
                </el-button>
              </div>
              <el-dropdown> 
                <img class="mr-[5px] w-[16px]" src="/src/assets/images/more.svg" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="showDialog(scope.row, 'closePos')" :disabled="!checkAuthCode(232)">
                      <el-icon :size="20" :color="!checkAuthCode(232)?'#ccc':'red'">
                        <WarnTriangleFilled />
                      </el-icon> <span class="ml-1">强行平仓</span>
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
  <contractCtr v-if="dialogType.showCtrDialog" @close="closeDialogType" />
  <closePos v-if="dialogType.closePos" :dataInfo="dialogType.info" :orderNo="orderNo" @close="closeDialogType" />
  <detailDialog v-if="dialogType.showDialog" :orderNo="orderNo" :contract="true" @close="closeDialogType" />
  <userDetail v-if="dialogType.showInfoDialog && dialogType.info" :partyid="dialogType.info.partyid"  @close="closeDialogType" />

</template>

<script>
export default { name: 'contractPos' };
</script>
<script setup>
import AddLock from './components/AddLock.vue'
import closePos from './components/closePos.vue'
import detailDialog from '/@/components/detailDialog/index.vue'
import contractCtr from './components/contractCtr.vue'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { ElDialog, ElMessage, dayjs } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import { copy } from '/@/utils'
import userDetail from '/@/components/userDetail/index.vue'
import { checkAuthCode } from '/@/hooks/store.hook.js'
import { useSocketStore } from '/@/store'
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

const tabPosition = ref('contractPos')
const tabChange = ()=>{
  router.replace({
    name:tabPosition.value
  })
}

const dialogLoading = ref(false)
const searchValue = ref('all')
const searchStrbtn = ref('')
const searchStr = ref('')
const tableData = computed(() => {
  let list = socketStore.futureOrderList || []
  if (searchValue.value !== 'all') {
    list = socketStore.futureOrderList.filter(f => f.role == searchValue.value)
  }
  if (searchStr.value) {
    list = socketStore.futureOrderList.filter(f => {
      return f.username.indexOf(searchStr.value) !== -1 || f.uid.indexOf(searchStr.value) !== -1
    })
  }
  return list
});
const dialogType = reactive({
  info: null,
  showInfoDialog: false,
  showLockDialog: false,
  showCtrDialog: false,
  showDialog: false,
  closePos: false
})
const searchInput = ref(null)
const getDataList = () => {

  searchStr.value = searchStrbtn.value;
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
      close: "平仓",
      fail: "失败",
      cancel: "已取消"
    }
  }
  str = obj[val] || val;
  return str;
}

const minWidth = 120
const columnBase = ref([
  // { prop: 'order_no', label: '订单号', minWidth, align: 'center' },
  { prop: 'uid', label: 'UID',minWidth, align: 'center' },
  { prop: 'username', label: '用户名',minWidth, align: 'center' },
  { prop: 'role', label: '角色',minWidth, align: 'center' },
  { prop: 'name', label: '合约',minWidth, align: 'center' },
  { prop: 'offset', label: '开仓',minWidth: 165, align: 'center' },
  // { prop: 'price_type', label: '限价方式', minWidth, align: 'center' },
  { prop: 'unsold_volume', label: '可售数量', minWidth, align: 'center' },
  // { prop: 'margin', label: '保证金/剩余金额', minWidth, align: 'center' },
  // { prop: 'profit', label: '收益/百分比',minWidth, align: 'center' },
  // { prop: 'unsold_volume', label: '持仓数量',minWidth, align: 'center' },
  { prop: 'surplus_margin', label: '剩余保证金',minWidth, align: 'center' },
  { prop: 'profit', label: '订单收益/百分比', minWidth, align: 'center' },
  // { prop: 'ratio', label: '收益率',  minWidth,align: 'center' },
  { prop: 'status', label: '状态', minWidth, align: 'center' },
  { prop: 'date', label: '时间', minWidth, align: 'center' }
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

}
watch(() => socketStore.sokcetWS, (ws) => {
  if (ws) {
    socketStore.send('futuresorder', 'sub')
  }
}, { immediate: true })
</script>


