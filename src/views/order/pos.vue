<template>
  <div class="player reset-el-styte p-2">
    <div class="flex justify-between p-2">
      <div>
        <el-button type="primary" @click="showDialog(null, 'showLockDialog')">创建锁定单</el-button>
      </div>
      <div>
        <el-button :type="searchValue == item.value ? 'success' : 'default'" v-for="(item) in optionStatus"
          :key="item.value" @click="changeSearch(item.value)">{{ item.label }}</el-button>
        <el-input v-model="searchStrbtn" class="mx-2" placeholder="UID/用户名" style="width: 200px;" />
        <el-button type="primary" class="ml-2" :icon="Search" @click="getDataList(1)"
          :loading="isLoading">搜索</el-button>
      </div>
    </div>
    <div class="p-2 pt-0 h-full">
      <el-table :data="tableData" :border="tableData.length > 0" :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span v-if="item.prop === 'profit'" style="line-height: 20px;">
              <span class="w-100 block"
                :class="scope.row[item.prop] > 0 ? 'success' : scope.row[item.prop] < 0 ? 'failure' : ''">
                {{ scope.row[item.prop] }}
              </span>
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
            <span v-else-if="item.prop === 'role'">
              {{ optionStatus.find(f => f.value == scope.row[item.prop]).label }}
            </span>
            <span v-else-if="['offset'].includes(item.prop)">
              {{ transKeyName(scope.row['lever_type'], 'lever_type') }}
              <b class="split-line"></b>
              {{ transKeyName(scope.row[item.prop], item.prop) }}
              <b class="split-line"></b>
              {{ scope.row['lever'] }}X
            </span>
            <span v-else-if="['status'].includes(item.prop)">
              <span :class="scope.row[item.prop]=='lock'?'status-bg none':''">
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
        <el-table-column label="操作" width="100" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="showDialog(scope.row, 'showDialog')">查看订单</el-button>
            <el-dropdown>
              <img style="width: 20px; height: 20px;margin-top: 5px;" src="/src/assets/images/more.svg" />
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
import { Search, Plus } from '@element-plus/icons-vue'
import { copy } from '/@/utils'
import userDetail from '/@/components/userDetail/index.vue'
import AddLock from './components/AddLock.vue'
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

const dialogLoading = ref(false)
const searchValue = ref(localStorage.getItem('searchstr') || 'all')
const searchStrbtn = ref('')
const searchStr = ref('')
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
  // { prop: 'order_no', label: '订单号', width: 100, align: 'center' },
  { prop: 'uid', label: 'UID', align: 'center' },
  { prop: 'username', label: '用户名', align: 'center' },
  { prop: 'role', label: '角色', align: 'center' },
  { prop: 'father_username', label: '代理', align: 'center' },
  { prop: 'symbol', label: '股票代码', align: 'center' },
  { prop: 'offset', label: '开仓', width: 120, align: 'center' },
  // { prop: 'price_type', label: '限价方式', width: 100, align: 'center' },
  { prop: 'unsold_volume', label: '可售数量', width: 120, align: 'center' },
  // { prop: 'margin', label: '保证金/剩余金额', width: 130, align: 'center' },
  // { prop: 'profit', label: '收益/百分比', align: 'center' },
  // { prop: 'unsold_volume', label: '持仓数量', align: 'center' },
  { prop: 'surplus_margin', label: '剩余保证金', align: 'center' },
  { prop: 'profit', label: '订单收益/百分比', width: 130, align: 'center' },
  // { prop: 'ratio', label: '收益率',  width: 80,align: 'center' },
  { prop: 'status', label: '状态', width: 70, align: 'center' },
  { prop: 'date', label: '时间', width: 110, align: 'center' }
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
  localStorage.setItem('searchstr', s);
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
