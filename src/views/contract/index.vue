<template>
  <div class="px-[20px] py-[10px]">
    <div class="reset-el-style-v2 flex justify-between">
      <div class="flex items-center">
        <el-radio-group v-model="tabPosition" @change="tabChange">
          <el-radio-button label="contractPos">合约持仓单</el-radio-button>
          <el-radio-button label="contractSearch">合约历史订单</el-radio-button>
          <el-radio-button label="contractIndex">合约场控</el-radio-button>
        </el-radio-group>
      </div>
      <div class="flex items-center">
        <div class="w-[168px] mr-[10px]">
          <el-select v-model="searchType" @change="getDataList(1)">
            <el-option v-for="(item) in typeOptions"
            :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </div>
        
        <div class="w-[264px] ml-[10px]">
          <el-input v-model="searchStrbtn" ref="searchInput" suffix-icon="search" placeholder="名称/代码" />
        </div>
        <el-button type="primary" class="w-[120px] ml-[10px]" @click="getDataList(1)"
          :loading="isLoading">查询</el-button>
      </div>
    </div>

    <div class="reset-el-style-v2 py-[10px]">
      <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column :min-width="item.minWidth" v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span v-if="item.prop === 'locked'" :style="{ color: !scope.row[item.prop] ? 'green' : '#ff0000' }">
              {{ scope.row[item.prop] ? '禁用' : '启用' }}
            </span>
            <span v-else-if="item.prop === 'vip'">
              <span class="status-bg" :class="scope.row['lever'] > 1 ? 'status-yellow' : ''">
                {{ scope.row['lever'] > 1 ? scope.row['lever'] + 'X' : '无' }}
              </span>
            </span>
            <span v-else-if="item.prop == 'type'">
              {{ typeMap[scope.row.type] || '--' }}
            </span>
            <span class="cursor-pointer" @click="showDialog(scope.row, 'showQuotationsDialog')" v-else-if="item.prop === 'name'">
              {{ scope.row['name'] }}
            </span>

            <span v-else-if="item.prop === 'issue_price_min'">
              {{ scope.row['issue_price_max'] }}
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="165" align="center">
          <template #default="scope">
            <div class="flex justify-between items-center w-full px-[5px]">
              <div class="flex items-center justify-center flex-1">
                <el-button link class="underline" size="default" type="primary" @click="showDialog(scope.row, 'showDialog')">调整价格</el-button>
                <b class="split-line"></b>
                <el-button link class="underline" size="default" type="primary" @click="showDialog(scope.row, 'showVolumeDialog')">调整成交量</el-button>
              </div>
              <el-dropdown>
                <img class="ml-[20px]" src="/src/assets/images/more.svg" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :disabled="scope.row['unadjusted'] <= 0" @click="handleClear(scope.row)">
                      <el-icon :size="14">
                        <DeleteFilled :color="scope.row['unadjusted'] <= 0 ? '#ccc' : '#FF0004'" />
                      </el-icon><span class="ml-[10px] text-[14px]">清除未生效调整</span>
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
  <MarketQuotations :symbol="dialogType.info.symbol" v-if="dialogType.showQuotationsDialog" @close="closeDialogType" />
  <Price :data="dialogType.info" v-if="dialogType.showDialog" @close="closeDialogType" />
  <Volume :data="dialogType.info" v-if="dialogType.showVolumeDialog" @close="closeDialogType" />
</template>

<script>
export default { name: 'contractIndex' };
</script>
<script setup>
import { apiClear } from '/@/api/modules/contract'
import { ref, reactive, onMounted, computed, onUnmounted, watch } from 'vue'
import Price from './components/Price.vue'
import Volume from './components/Volume.vue'
import MarketQuotations from './components/MarketQuotations'
import { ElMessageBox, ElMessage, dayjs } from 'element-plus'
import { useSocketStore } from '/@/store'
import { useRouter } from 'vue-router'
const router = useRouter()
const socketStore = useSocketStore()
const isLoading = ref(false)
const searchType = ref(sessionStorage['futuresCtrSearchType'] || 'all')
const searchStr = ref(sessionStorage['futuresCtrSearchStr'] || '')
const searchStrbtn = ref(searchStr.value)

const tableData = computed(() => {
  let list = socketStore.futureList || []

  if (searchType.value !== 'all') {
    list = socketStore.futureOrderList.filter(f => f.type == searchType.value)
  }
  if (searchStr.value) {
    list = socketStore.futureOrderList.filter(f => {
      return (f.name && f.name.indexOf(searchStr.value) !== -1) || (f.symbol && f.symbol.indexOf(searchStr.value) !== -1)
    })
  }
  return list
});

const getDataList = () => {
  isLoading.value = true
  setTimeout(()=>{
    searchStr.value = searchStrbtn.value;
    sessionStorage['futuresCtrSearchType'] = searchType.value
    sessionStorage['futuresCtrSearchStr']  = searchStr.value
    isLoading.value = false
  },300)
  
}

const dialogType = reactive({
  showQuotationsDialog:false,
  showDialog: false,
  showVolumeDialog: false,
  info: null
})

const tabPosition = ref('contractIndex')
const tabChange = ()=>{
  router.replace({
    name:tabPosition.value
  })
}


const typeMap = ref({
  crypto:'加密货币',
  forex:'外汇',
  blocktrade:'大宗商品'
})

const typeOptions = ref([
  {
    label:"所有类型",
    value:"all"
  },
  {
    label:"加密货币",
    value:"crypto"
  },
  {
    label:"外汇",
    value:"forex"
  },
  {
    label:"大宗商品",
    value:"blocktrade"
  }
])

const minWidth = 100
const columnBase = ref([
  { prop: 'type', label: '类型', align: 'center',minWidth },  
  { prop: 'name', label: '名称', align: 'center',minWidth },
  { prop: 'symbol', label: '代码', align: 'center', minWidth },
  { prop: 'old_price', label: '原价格(调整前)',minWidth:165, align: 'center' },
  { prop: 'price', label: '最新价格(调整后)',minWidth:165, align: 'center' },
  { prop: 'unadjusted', label: '未生效调整', align: 'center', minWidth },
  { prop: 'second', label: '生效时间', align: 'center', minWidth },
  { prop: 'volume_multiple', label: '成交量系数', align: 'center', minWidth }
])
const handleSubmit = (row) => {
  isLoading.value = true
  apiClear({ symbol: row.symbol }).then(() => {
    ElMessage({
      type: 'tips',
      message: '清除成功',
      offset: 200
    })
  }).finally(() => {
    isLoading.value = false
  })
}
const handleClear = (row) => {
  ElMessageBox.confirm(`确定清除吗？`, `确认清除`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    handleSubmit(row);
  })
}
const showDialog = (data, type) => {
  if (data) {
    dialogType.info = Object.assign({}, data);
  } else {
    dialogType.info = null
  }
  dialogType[type] = true;
}
const closeDialogType = (item) => {
  for (const key in dialogType) {
    dialogType[key] = false
  }
}
watch(() => socketStore.sokcetWS, (ws) => {
  if (ws) {
    socketStore.send('futures_control_list', 'sub')
  }
}, { immediate: true })
</script>