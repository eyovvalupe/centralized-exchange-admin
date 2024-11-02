<template>
  <div class="px-[30px] py-[10px]">
    <div class="flex justify-between reset-el-style-v2">
      <div class="flex items-center">
        <el-radio-group v-model="tabPosition" @change="tabChange">
          <el-radio-button label="orderPositions">股票持仓单</el-radio-button>
          <el-radio-button label="orderIndex">股票历史订单</el-radio-button>
        </el-radio-group>
      </div>

      <div class="flex items-center">
          <div class="w-[168px]">
            <el-select v-model="searchForm.role" @change="changeSearch(searchForm.role)">
              <el-option  v-for="(item) in option"
              :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </div>
          
          <div class="w-[400px] ml-2">
            <el-date-picker style="width:100%;" v-model="timeRanges" type="daterange" range-separator="~" start-placeholder="请选择开始时间" end-placeholder="请选择结束时间"/>
          </div>
          <div class="w-[264px] ml-2">
            <el-input v-model="searchForm.params"  suffix-icon="search" placeholder="UID/用户名/备注" />
          </div>
        <!-- <el-select v-model="searchForm.status" class="ml-2"  style="width: 100px;">
            <el-option v-for="item in optionStatus" :key="item.value" :label="item.label" :value="item.value" />
          </el-select> -->
        <el-button type="primary" class="w-[120px] ml-2" @click="getDataList(1)" :loading="isLoading">查询</el-button>
      </div>

    </div>
    <div class="py-[10px] reset-el-style-v2">
      <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :min-width="item.minWidth" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span class="flex justify-center items-center" v-if="item.prop === 'profit'" >
              <span class="w-100 block" :class="scope.row[item.prop] > 0 ? 'success' : scope.row[item.prop] < 0 ? 'failure' : ''">
                {{ scope.row[item.prop] }}
              </span>
              <b class="split-line"></b>
              <span class="w-100 block" :class="scope.row['ratio'] > 0 ? 'success' : scope.row['ratio'] < 0 ? 'failure' : ''">
                {{ scope.row['ratio'] * 100 }}%
              </span>
            </span>
            <template v-else-if="item.prop === 'uid'">
              <span class="truncate cursor-pointer" @click="copy(scope.row[item.prop])"> {{
                scope.row[item.prop] }}</span>
            </template>
            <span v-else-if="item.prop === 'username'">
            <span class=" cursor-pointer text-[#165DFF]"
              @click="showDialog(scope.row, 'showInfoDialog')">{{
                scope.row[item.prop] }}
            </span>
          </span>
            <template v-else-if="item.prop === 'order_no'">
              <el-tooltip :content="scope.row[item.prop]" effect="light" placement="bottom-start">
                <span v-if="scope.row[item.prop]" class="truncate underline cursor-pointer"
                  @click="copy(scope.row[item.prop])">
                  ...{{ scope.row[item.prop].substring(scope.row[item.prop].length - 7) }}
                </span>
              </el-tooltip>
            </template>
            <span v-else-if="item.prop === 'date'">
              {{ dayjs(scope.row[item.prop]).format('MM-DD hh:mm:ss') }}
            </span>
            <span  class="flex items-center justify-center" v-else-if="['offset'].includes(item.prop)">
              {{ transKeyName(scope.row['lever_type'], 'lever_type') }}
              <b class="split-line"></b>
              <span class="status-bg" :class="[scope.row[item.prop] == 'long' ? 'success' : 'short']">{{ transKeyName(scope.row[item.prop], item.prop) }}</span>
              <b class="split-line"></b>
              {{ scope.row['lever'] }}X
            </span>
            <span v-else-if="['status'].includes(item.prop)">
              <span :class="scope.row[item.prop]=='lock'?'status-bg none':''">
                {{ transKeyName(scope.row[item.prop], item.prop) }}
              </span>
            </span>
            <span v-else-if="item.prop === 'price_type'">
              {{ transKeyName(scope.row[item.prop], item.prop) }}<b class="split-line" v-if="scope.row['open_price']=='limit'"></b>{{ scope.row['price']  }}
            </span>
            <span v-else-if="item.prop === 'open_volume'">
              {{ transKeyName(scope.row[item.prop], item.prop) }}
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="minWidth" align="center">
          <template #default="scope">
            <el-button link type="primary" size="default" class="underline" @click="showDialog(scope.row,'showDialog')">查看订单</el-button>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
      
    </div>
    <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
  </div>
  <userDetail v-if="dialogType.showInfoDialog && dialogType.info" :partyid="dialogType.info.partyid" @close="closeDialogType" />
  <detailDialog v-if="dialogType.showDialog" :orderNo="orderNo" @close="closeDialogType" />
</template>

<script>
export default { name: 'orderIndex' };
</script>
<script setup>
import {
  getList
} from '/@/api/modules/market/index.api'
import { copy } from '/@/utils'
import detailDialog from '/@/components/detailDialog/index.vue'
import { Search } from '@element-plus/icons-vue'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { ElDialog, ElMessage, dayjs } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:orderIndex', () => {
  getDataList()
})

const tabPosition = ref('orderIndex')
const tabChange = ()=>{
  router.replace({
    name:tabPosition.value
  })
}

const timeRanges=ref([])
const optionStatus = [
  {
    value: 'all',
    label: '全部',
  },
  {
    value: 'none',
    label: '开仓',
  },
  {
    value: 'lock',
    label: '锁定',
  },
  {
    value: 'open',
    label: '持仓',
  },
  {
    value: 'done',
    label: '平仓',
  },
  {
    value: 'fail',
    label: '失败',
  },
  {
    value: 'cancel',
    label: '已取消',
  }
]
const option = [
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
const dialogType = reactive({
  info: null,
  showDialog: false,
  showInfoDialog:false,
  showLockDialog:false,
  title: ''
})
const searchForm = reactive({
  params: '',
  role: 'all',
  status: 'all'
})

const currentLastPage = ref(1)
const currentPage = ref(1)

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
      fail: "失败",
      cancel: "已取消"
    }
  }
  str = obj[val] || val;
  return str;
}

const minWidth = 100
const columnBase = ref([
  // { prop: 'order_no', label: '订单号',minWidth, align: 'center' },
  { prop: 'uid', label: 'UID', minWidth, align: 'center' },
  { prop: 'username', label: '用户名', minWidth, align: 'center' },
  { prop: 'role', label: '角色', minWidth, align: 'center' },
  { prop: 'father_username', label: '代理',minWidth,  align: 'center' },
  { prop: 'symbol', label: '股票代码',minWidth:150, align: 'center' },
  { prop: 'offset', label: '开仓',minWidth:150,  align: 'center' },
  // { prop: 'price_type', label: '限价方式',minWidth, align: 'center' },
  { prop: 'open_volume', label: '开仓数量', minWidth, align: 'center' },
  { prop: 'margin', label: '开仓保证金', align: 'center' },
  // { prop: 'settled_price', label: '订单结算价格', minWidth, align: 'center' },
  { prop: 'profit', label: '订单收益/百分比',  minWidth:150, align: 'center' },
  { prop: 'status', label: '状态', minWidth, align: 'center' },
  { prop: 'date', label: '时间',  minWidth, align: 'center' }
])

// const column = reactive([
//   { prop: 'order_no', label: '订单号' },
//   { prop: ['username', 'uid'], label: 'UID/用户名' },
//   { prop: 'father_username', label: '代理称' },
//   { prop: 'market', label: '市场' },
//   { prop: 'symbol', label: '交易代码' },
//   { prop: ['offset', 'lever_type', 'lever'], label: '开仓方向' },
//   { prop: ['price_type', 'price'], label: '限价方式/价格', },
//   { prop: ['open_volume', 'unsold_volume'], label: '开仓/未售数量' },
//   { prop: ['margin', 'surplus_margin'], label: '保证金/剩余金额' },
//   { prop: 'unlock', label: '解锁金额', },
//   { prop: ['profit', 'ratio'], label: '订单收益/百分比', color: true },
//   { prop: 'fee', label: '手续费' },
//   { prop: 'open_price', label: '开仓价格' },
//   { prop: 'settled_price', label: '订单结算价格' },
//   { prop: ['stop_profit', 'stop_profit_type', 'stop_profit_price'], label: '止盈' },
//   { prop: ['stop_loss', 'stop_loss_type', 'stop_loss_price'], label: '止损' },
//   { prop: 'status', label: '状态', width: 90 },
//   { prop: 'date', label: '订单时间' }
// ])

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
 
// 获取玩家列表 page若传则为第一页
const getDataList = page => {
  if (page) {
    currentLastPage.value = page
  }
  isLoading.value = true
  const send = { page: currentLastPage.value };
  if (searchForm.params) {
    send.params = searchForm.params
  }
  if (searchForm.role !== 'all') {
    send.role = searchForm.role
  }
  if (searchForm.params !== 'all') {
    send.params = searchForm.params
  }
  if(timeRanges.value&&timeRanges.value.length){
    send.start_time = dayjs(timeRanges.value[0]).format('YYYY-MM-DD')
    send.end_time = dayjs(timeRanges.value[1]).format('YYYY-MM-DD')
  }


  getList(send)
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
const changeSearch = (s) => {
  searchForm.role = s;
  getDataList();
}
const closeDialogType = () => {
  for (const key in dialogType) {
    dialogType[key] = false
  }
}
getDataList();
</script>