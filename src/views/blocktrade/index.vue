<template>
  <div class="px-[20px] py-[10px]">
    <div class="reset-el-style-v2">
      <div class="flex items-center">
        <el-radio-group v-model="tabPosition" @change="tabChange">
          <el-radio-button label="blocktradePos">大宗商品持仓单</el-radio-button>
          <el-radio-button label="blocktradeSearch">大宗商品历史订单</el-radio-button>
          <el-radio-button label="blocktradeIndex">大宗商品场控</el-radio-button>
        </el-radio-group>
        
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
  <Price :data="dialogType.info" v-if="dialogType.showDialog" @close="closeDialogType" />
  <Volume :data="dialogType.info" v-if="dialogType.showVolumeDialog" @close="closeDialogType" />
</template>

<script>
export default { name: 'blocktradeIndex' };
</script>
<script setup>
import { apiClear } from '/@/api/modules/blocktrade'
import { ref, reactive, computed,  watch } from 'vue'
import Price from './components/Price.vue'
import Volume from './components/Volume.vue'
import { ElMessageBox, ElMessage, dayjs } from 'element-plus'
import { useSocketStore } from '/@/store'
import { useRouter } from 'vue-router'
const router = useRouter()
const socketStore = useSocketStore()
const isLoading = ref(false)
const tableData = computed(() => {
  return socketStore.blocktradeList || []
});
const dialogType = reactive({
  showDialog: false,
  showVolumeDialog: false,
  info: null
})

const tabPosition = ref('blocktradeIndex')
const tabChange = ()=>{
  router.replace({
    name:tabPosition.value
  })
}

const minWidth = 120
const columnBase = ref([
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
    socketStore.send('blocktradecontrol', 'sub')
  }
}, { immediate: true })
</script>