<template>
  <div class="reset-el-styte p-2">
    <div>
      <el-table :data="tableData" :border="tableData.length" :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
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
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <span class="flex justify-center align-middle">
              <el-button link type="primary" @click="showDialog(scope.row, 'showDialog')">调整价格</el-button>
              <el-button link type="primary" @click="showDialog(scope.row, 'showVolumeDialog')">调整成交量</el-button>
              <el-dropdown>
                <img style="width: 20px; height: 20px;margin-top: 5px;" src="/src/assets/images/more.svg" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :disabled="scope.row['unadjusted'] <= 0" @click="handleClear(scope.row)">
                      <el-icon :size="20">
                        <DeleteFilled />
                      </el-icon> <span class="ml-1">清除未生效调整</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </span>

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

<script setup>
import { apiClear } from '/@/api/modules/contract'
import { ref, reactive, onMounted, computed, onUnmounted, watch } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import Price from './components/Price.vue'
import Volume from './components/Volume.vue'
import { ElMessageBox, ElMessage, dayjs } from 'element-plus'
import { useSocketStore } from '/@/store'
const socketStore = useSocketStore()
const isLoading = ref(false)
const tableData = computed(() => {
  return socketStore.futureList || []
});
const dialogType = reactive({
  showDialog: false,
  showVolumeDialog: false,
  info: null
})

const columnBase = ref([
  { prop: 'name', label: '名称', align: 'center' },
  { prop: 'symbol', label: '代码', align: 'center', width: 100 },
  { prop: 'old_price', label: '原价格(调整前)', align: 'center' },
  { prop: 'price', label: '最新价格(调整后)', align: 'center' },
  { prop: 'unadjusted', label: '未生效调整', align: 'center', width: 100 },
  { prop: 'second', label: '生效时间', align: 'center', width: 100 },
  { prop: 'volume_multiple', label: '成交量系数', align: 'center', width: 100 }
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
    type: 'warning'
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