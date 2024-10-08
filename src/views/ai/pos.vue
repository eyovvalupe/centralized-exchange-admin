<template>
  <div class="player reset-el-styte">
    <div class="flex justify-between p-2">
      <div>
        <el-button type="primary" @click="showDialog(null, 'showCtrDialog')">添加场控</el-button>
      </div>
      <div>
        <el-button :type="searchValue == item.value ? 'success' : 'default'" v-for="(item) in optionStatus"
          :key="item.value" @click="changeSearch(item.value)">{{ item.label }}</el-button>
        <el-input v-model="searchStrbtn" class="mx-2" placeholder="UID/用户名" style="width: 200px;" />
        <el-button type="primary" class="ml-2" :icon="Search" @click="getDataList(1)"
          :loading="isLoading">搜索</el-button>
      </div>
    </div>
    <div class="">
      <el-table :data="tableData" :border="tableData.length > 0" :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span v-if="item.prop === 'profit'" style="line-height: 20px;">
              <span class="w-100 block">
                {{ scope.row['amountreturn'] }}
              </span>
            </span>
            <template v-else-if="item.prop === 'uid'">
              <span class="truncate cursor-pointer" @click="copy(scope.row[item.prop])"> {{
                scope.row[item.prop] }}</span>
            </template>
            <template v-else-if="item.prop === 'endtime'">
             {{ dayjs(scope.row[item.prop]).format('HH:mm:ss') }} 
            </template>
            <span v-else-if="item.prop === 'username'">
              <span class=" cursor-pointer text-[#165DFF]" @click="showDialog(scope.row, 'showInfoDialog')">{{
                scope.row[item.prop] }}
              </span>
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
            <span v-else-if="['offset'].includes(item.prop)">
              <!-- {{ transKeyName(scope.row['lever_type'], 'lever_type') }} -->
              <!-- <b class="split-line"></b> -->
             <!-- <span class="status-bg" :class="scope.row[item.prop]">
              {{ transKeyName(scope.row[item.prop], item.prop) }}
             </span> 
              {{ scope.row['lever'] }}X -->
              {{ transKeyName(scope.row[item.prop], item.prop) }}
            </span>
            <span v-else-if="item.prop === 'role'" class="status-bg" :class="scope.row[item.prop]=='guest'?'status-yellow':''">
              {{ optionStatus.find(f => f.value == scope.row[item.prop]).label }}
            </span> 
            <span v-else-if="item.prop === 'price_type'">
              {{ transKeyName(scope.row[item.prop], item.prop) }}<b class="split-line"
                v-if="scope.row['open_price'] == 'limit'"></b>{{ scope.row['price'] }}
            </span>
            <span v-else-if="item.prop === 'time'">
              {{ scope.row[item.prop] }}{{ optionsTime.find(f => f.value == scope.row['unit']).label }}
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
        <el-table-column label="操作" width="100" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="showDialog(scope.row, 'showCtrDialog')">用户场控</el-button>
            <!-- <el-button link type="primary" @click="showDialog(scope.row, 'showDialog')">查看订单</el-button> -->
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
    </div>
  </div>
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
const optionsTime = [
  { value : 's', label : '秒' },
  { value : 'm', label : '分钟' },
  { value : 'h', label : '小时' },
  { value : 'd', label : '天' }
]
const dialogLoading = ref(false)
const searchValue = ref(localStorage.getItem('searchstr') || 'all')
const searchStrbtn = ref('')
const searchStr = ref('')
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
const getDataList = () => {
  searchStr.value = searchStrbtn.value;
  searchValue.value = 'all';
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
const columnBase = ref([
  { prop: 'uid', label: 'UID', width: 100,align: 'center' },
  { prop: 'username', label: '用户名', width: 150, align: 'center' },
  { prop: 'role', label: '角色',width: 100, align: 'center' },
  // { prop: 'father_username', label: '代理', align: 'center' },
  { prop: 'name', label: '名称',width: 120, align: 'center' },
  { prop: 'offset', label: '开仓', width: 100, align: 'center' },
  { prop: 'lever', label: '网格', width: 100, align: 'center' },
  { prop: 'time', label: '时间区间', width: 120, align: 'center' },
  { prop: 'amount', label: '投资金额', width: 120,align: 'center' },
  { prop: 'endtime', label: '剩余时间', width: 130, align: 'center' },
  { prop: 'profit', label: '预期盈亏', align: 'center' },
  { prop: 'status', label: '用户场控', width: 70, align: 'center' }
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
