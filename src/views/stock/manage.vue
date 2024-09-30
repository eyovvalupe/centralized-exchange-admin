<template>
  <div class="reset-el-styte p-2">
    <div class="flex justify-between p-2">
      <div>
        <el-button type="primary"  @click="showDialog(null, 'showCfgDialog')">交易参数配置</el-button>
        <el-button type="success"  class="ml-2" @click="showDialog(null, 'showTimeDialog')">交易时间配置</el-button>
      </div>
      <div class="flex">
        <el-input v-model="searchForm.symbol" class="mr-2" placeholder="股票代码" style="width: 250px;" />
        <el-button type="primary" class="ml-4" :icon="Search" @click="getDataList(1)"
          :loading="isLoading">搜索</el-button>
      </div>
    </div>
    <div>
      <el-table :data="tableData" :border="tableData.length" :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span v-if="item.prop === 'enabled'" class="status-bg" :class="scope.row[item.prop]==1?'success':'fail'">
              {{ scope.row[item.prop]==1 ? '启用' : '禁用' }}
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template #default="scope">
            <span class="flex justify-center align-middle">
              <el-button link type="primary" @click="showDialog(scope.row, 'showEditDialog')">修改</el-button>
            </span>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
      <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
    </div>
  </div>
  <Edit v-if="dialogType.showEditDialog" :data="dialogType.info" @close="closeDialogType" />
  <Config v-if="dialogType.showCfgDialog" :data="dialogType.info" @close="closeDialogType" />
  <ConfigTime v-if="dialogType.showTimeDialog" :data="dialogType.info" @close="closeDialogType" />
</template>

<script setup>
import {  getList } from '/@/api/modules/stock/index.api'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage, dayjs } from 'element-plus'
import Config from './components/Config.vue'
import ConfigTime from './components/ConfigTime.vue'
import Edit from './components/Edit.vue'

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:stockManage', () => {
  getDataList()
})
const dialogType = reactive({
  showEditDialog: false,
  showCfgDialog: false,
  showTimeDialog: false,
  info: null
})
const searchForm = reactive({
  params: '',
  symbol: ''
})
const currentPage = ref(1)
const currentLastPage = ref(1)
const columnBase = ref([
  { prop: 'name', label: '公司名称', align: 'center' },
  { prop: 'symbol', label: '股票代码', align: 'center' },
  { prop: 'exchange', label: '交易所', align: 'center' },
  { prop: 'enabled', label: '状态', align: 'center' }
])
const isLoading = ref(false)
const showDialog = (data, type) => {
  if (data) {
    dialogType.info = Object.assign({ id: 1 }, data);
  } else {
    dialogType.info = null
  }
  dialogType[type] = true;
}
const getDataList = (page) => {
  if (page) {
    currentLastPage.value = page
  }
  isLoading.value = true
  const send = { page: currentLastPage.value };
  if (searchForm.params) {
    send.params = searchForm.params;
  }
  if (searchForm.symbol) {
    send.symbol = searchForm.symbol;
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
const closeDialogType = (item) => {
  for (const key in dialogType) {
    dialogType[key] = false
  }
  if (item && item.reload) {
    getDataList();
  }
}
getDataList();
</script>