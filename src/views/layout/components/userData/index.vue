<template>
  <div>
     <el-dialog :close-on-click-modal="false" v-model="useCommon.selectUser" title="请输入用户名" width="30%" center @close="closeDialog">
      <el-input v-model="input" placeholder="清输入玩家UID/用户名" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelDialog">取消</el-button>
          <el-button type="primary" @click="getUserData">
            查询
          </el-button>
        </span>
      </template>
    </el-dialog>
    <div class="flex justify-end p-4" :class="{ 'pb-0': tip }">
      <div class="flex">
        <el-date-picker v-model="dataValue" type="daterange" range-separator="To" start-placeholder="Start date"
          end-placeholder="End date" :size="size" @change="getData" />
        <el-tree-select v-model="value1" :data="data1" class=" mr-4 casinoList" placeholder="厂商" clearable filterable />
        <el-tree-select v-model="value" :data="data" filterable placeholder="请选择游戏" class="casinoList" clearable />
        <el-button type="primary" class="ml-6" :icon="Search" @click="getPlayerList()" :loading="isLoading">查询</el-button>
      </div>
    </div>
    <div class="p-4 pt-0 mb-22">
      <span class="text-lg">汇总</span>
      <el-table :data="tableData" border :class="tableData.length?'':'noborder'" :height="height" v-loading="isLoading" class="mt-3">
        <el-table-column v-for="item in column" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width"
          :align="item.align">
          <template #default="scope">
            <span v-if="item.isDate">{{ formatDate(scope.row[item.prop] / 1) }}</span>
            <span v-else-if="item.prop === 'createdTime'">
              {{ transferTime(scope.row[item.prop]) }}
            </span>

            <span v-else-if="item.prop === 'profit'">
              {{ parseFloat(scope.row[item.prop]).toFixed(3) }}
            </span>
            <span v-else-if="item.prop === 'nickName'">
              <span class="underline cursor-pointer text-[#165DFF]" @click="getSymbolData(scope.row)">{{
                scope.row[item.prop]
              }}</span>
            </span>
            <span v-else-if="item.prop === 'deposit'">
              <span>{{
                scope.row[item.prop]
              }}</span>
            </span>
            <span v-else-if="item.prop === 'betAmount'">
              <span>{{
                scope.row[item.prop]
              }}</span>
            </span>
            <span v-else-if="item.prop === 'enabled'" class="status-bg" :class="scope.row[item.prop] ? '' : 'status-yellow'">
              {{ scope.row[item.prop] ? '正常' : '锁定' }}
            </span>
            <span v-else-if="item.prop === 'settled'" class="status-bg" :class="scope.row[item.prop] ? 'status-green' : 'status-yellow'">
              {{ scope.row[item.prop] ? '已结算' : '未结算' }}
            </span>
            <span v-else-if="item.prop === 'usdt'">
              <span class="underline cursor-pointer text-[#165DFF]" @click="onDetail(scope.row)">{{
                scope.row[item.prop]
              }}</span>
            </span>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty description="暂无数据" />
        </template>
      </el-table>
      <!-- <Pagination :total="len" :size="pageSize" @changePage="getPlayerList" /> -->
    </div>
    <Fund :parameters="parameters" :provider="provider" :gameCode="gameCode" :startTime="startTime" :endTime="endTime" />

  </div>
</template>

<script setup  >
import Fund from './Fund.vue'
import { apiCollect } from '/@/api/modules/userData/index.api'
import { onMounted, watch, ref, nextTick, onBeforeMount } from 'vue';
import { useCommonStore } from '/@/store';
import { PAGE_SIZE } from '/@/const/config'
import { ElMessage, dayjs } from 'element-plus'
const props = defineProps({
  username: {
    type: String,
    default: ''
  },

})
const dataValue = ref([])
const startDate = ref('')
const endDate = ref('')
const value = ref()
const sourceData = ref([
  {
    value: 'crash'
  },
  {
    value: 'roulette'
  },
  {
    value: 'wingo'
  },
])
const data = ref(sourceData.value)

const value1 = ref()
const sourceData1 = ref([
  {
    value: 'Fun Game'
  },
  {
    value: 'Pocket Games Soft'
  },
  {
    value: 'Asia Gaming'
  },
])
const data1 = ref(sourceData1.value)
const useCommon = useCommonStore()
const input = ref('')
// table list
const tableData = ref([])
const isLoading = ref(false)
// table title
const column = reactive([
  { prop: 'nickName', label: '玩家', width: 250, align: 'center' },
  { prop: 'uid', label: 'UID', width: 250, align: 'center' },
  { prop: 'deposit', label: '充值', width: 190, align: 'center' },
  { prop: 'gift', label: '彩金', width: 190, align: 'center' },
  { prop: 'withdraw', label: '提现', width: 190, align: 'center' },
  { prop: 'rebate', label: '返水', width: 190, align: 'center' },
  { prop: 'betAmount', label: '下注金额', width: 190, align: 'center' },
  { prop: 'betCount', label: '下注次数', width: 190, align: 'center' },
  { prop: 'betProfit', label: '下注收益', width: 190, align: 'center' },
])
// 翻页
const len = ref(0)
const currentPage = ref(1)
const pageSize = ref(PAGE_SIZE)
const parameters = ref('')

onMounted(() => {
  if (input.value == '' && props.username !== '') {
    getUserData()
  } else if (props.username == '') {
    useCommon.selectUser = true
  }
})
// 时间转换
const transferTime = (time) => {
  const date = new Date(time)
  const currentDate = new Date()
  const isToday = date.getDate() === currentDate.getDate() && date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${month}-${day} ${hours}:${minutes}`

}
const provider = ref('')
const gameCode = ref('')
const getUserData = () => {
  tableData.value = []
  isLoading.value = true
  parameters.value = props.username || input.value
  if (input.value !== '' || props.username !== '') {
    // props.username = input.value
    // 执行查询逻辑
    useCommon.selectUser = false
    isLoading.value = true
    apiCollect({
      pageIndex: currentPage.value,
      parameters: props.username == '' ? input.value : props.username,
      // startTime: startDate.value,
      // endTime: endDate.value
    }).then(res => {
      const { info } = res
      tableData.value = info || []
      isLoading.value = false
      input.value = ''
    }).finally(() => {
      isLoading.value = false
    })
  } else {
    ElMessage({
      message: '请输入UID/用户名',
      type: 'warning',
    })
  }

}

const getSymbolData = (item) => {
  parameters.value = item.nickName
  useCommon.FundData = true
}
const cancelDialog = () => {
  useCommon.selectUser = false

}

const getData = () => {
  startDate.value = formatDate(dataValue._value[0]);
  endDate.value = formatDate(dataValue._value[1]);

}
const formatDate = (date) => {
  const formattedDate = new Date(date);
  const year = formattedDate.getFullYear();
  const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
  const day = String(formattedDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
const startTime = ref('')
const endTime = ref('')
const getPlayerList = () => {
  if (startDate.value !== '' && endDate.value !== '') {
    startTime.value = startDate.value
    endTime.value = endDate.value
    isLoading.value = true
    apiCollect({
      pageIndex: currentPage.value,
      parameters: props.username == '' ? input.value : props.username,
      startTime: startDate.value,
      endTime: endDate.value
    }).then(res => {
      const { info } = res
      tableData.value = info || []
      isLoading.value = false
      input.value = ''
    }).finally(() => {
      isLoading.value = false
    })
  } else {
    gameCode.value = value.value
    provider.value = value1.value
  }

}
</script>

<style lang="scss" scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}

.betRecord {
  .el-pager {
    display: none;
  }
}

:deep(.el-input__wrapper) {
  width: 240px !important;
}
</style>
