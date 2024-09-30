<template>
  <div class="player">
    <div class="p-2 pt-0 h-full">
      <el-table :data="tableData" :border="tableData.length" :class="tableData.length?'':'noborder'" v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <template v-if="Array.isArray(item.prop)">
              <span v-for="(arrItem, idx) in item.prop" :key="arrItem" class="arr">
                <span v-if="idx">｜</span>
                <span
                  :class="[arrItem, item.color ? (scope.row[arrItem] == 0 ? '' : scope.row[arrItem] < 0 ? 'text-red-800' : 'text-green-800') : '']">
                  <span v-if="arrItem === 'ratio'">{{ scope.row[arrItem] }}%</span>
                  <span v-else-if="arrItem == 'lever'">{{ scope.row[arrItem] }}x</span>
                  <span v-else-if="arrItem == 'price'">{{ scope.row['price'] || scope.row['open_price'] }}</span>
                  <span v-else>{{ transKeyName(scope.row[arrItem], arrItem)||'-' }}</span>
                </span>
              </span>
            </template>
            <template v-else-if="item.prop === 'order_no'">
              <el-tooltip :content="scope.row[item.prop]" effect="dark" placement="bottom-start">
                <span v-if="scope.row[item.prop]"> ...{{
                  scope.row[item.prop].substring(scope.row[item.prop].length - 7) }}</span>
              </el-tooltip>
            </template>
            <span v-else-if="item.prop === 'date'">
              {{ dayjs(scope.row[item.prop]).format('MM-DD hh:mm:ss') }}
            </span>
            <span v-else :class="[item.prop, scope.row[item.prop]]">
              {{ transKeyName(scope.row[item.prop], item.prop) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="showDialog(scope.row,'showDialog')">查看订单</el-button>
            <el-button link type="primary" @click="showDialog(scope.row,'closePos')">强行平仓</el-button>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
    </div>
  </div>
  <closePos v-if="dialogType.closePos" :orderNo="orderNo" @close="closeDialogType" />
  <detailDialog v-if="dialogType.showDialog" :orderNo="orderNo" @close="closeDialogType" />
</template>

<script setup>
import closePos from './components/closePos.vue'
import detailDialog from './components/detailDialog.vue'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { ElDialog, ElMessage, dayjs } from 'element-plus'
const tableData = ref([]);

const detailData = ref({})
const dialogLoading = ref(false)
const dialogType = reactive({
  showDialog: false,
  closePos: false
})
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
      none: '开仓',
      lock: '锁定',
      open: '持仓',
      close: '平仓',
      fail: '失败',
      cancel: '已取消',
    }
  }
  str = obj[val] || val;
  return str;
}

const columnBase = ref([
  { prop: 'order_no', label: '订单号'},
  { prop: 'symbol', label: '交易代码', align: 'center' },
  { prop: ['offset', 'lever_type', 'lever'], label: '开仓方向', align: 'center' },
  { prop: ['price_type', 'price'], label: '限价方式/价格', align: 'center' },
  { prop: ['open_volume', 'unsold_volume'], label: '开仓/未售数量', align: 'center' },
  { prop: ['margin', 'surplus_margin'], label: '保证金/剩余金额', align: 'center' },
  { prop: 'unlock', label: '解锁金额', align: 'center' },
  { prop: ['profit', 'ratio'], label: '订单收益/百分比', color: true, align: 'center' },
  { prop: 'status', label: '状态', width: 90, align: 'center' },
  { prop: 'date', label: '订单时间', align: 'center' }])

const isLoading = ref(false)
const orderNo = ref('')
const showDialog = ({order_no},key) => {
  orderNo.value = order_no;
  dialogType[key]=true;
}
const closeDialogType = (item) => {
  for (const key in dialogType) {
    dialogType[key] = false
  }
  dialogLoading.value = false;
  if(item && item.reload){
    console.log('reload',reload)
  }
}
</script>

<style lang="scss" scoped>
.player {
  .el-pager {
    display: none;
  }
}
</style>
