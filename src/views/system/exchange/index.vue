<template>
  <div class="reset-el-styte">
    <div class="flex justify-between p-2">
      <div>
        <el-button type="primary" @click="showDialog(null,'showAutoDialog')">汇率更新方式</el-button>
      </div>
      <div>
        <!-- {{ autoMode?'自动':'手动' }} -->
       
      </div>
    </div>
    <div>
      <el-table :data="tableData" :border="tableData.length" :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span v-if="item.prop === 'market'">
              {{ scope.row[item.prop] == 'forex' ? '外汇' : '加密货币' }}
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="showDialog(scope.row, 'showEditDialog')">编辑价格</el-button>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
      <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
    </div>
  </div>
  <Autoup v-if="dialogType.showAutoDialog" @close="closeDialogType" />
  <Edit v-if="dialogType.showEditDialog" :info="dialogType.info" @close="closeDialogType" />
</template>

<script setup>
import Autoup from './Autoup.vue'
import Edit from './Edit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getList, apiAutoUp } from '/@/api/modules/exchange'
import { ref } from 'vue'

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:exchange', () => {
  getDataList()
})
const currentLastPage = ref(1)
const currentPage = ref(1)
const columnBase = ref([
  { prop: 'symbol', label: '货币', align: 'center' },
  { prop: 'market', label: '市场', align: 'center' },
  { prop: 'price', label: '汇率', align: 'center' }
])
const dialogType = reactive({
  showEditDialog: false,
  showAutoDialog: false,
  info: null
})
const isLoading = ref(false)

const showDialog = (data, type) => {
  if (data) {
    dialogType.info = Object.assign({}, data);
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
getDataList();
const closeDialogType = (item) => {
  for (const key in dialogType) {
    dialogType[key] = false
  }
  if (item && item.reload) {
    getDataList();
  }
}
</script>