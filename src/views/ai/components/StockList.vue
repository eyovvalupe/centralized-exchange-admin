<template>
   <el-dialog :close-on-click-modal="false" width="680" class="reset-el-styte" title="品种选择" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <div class="flex justify-end mb-2">
      <div class="flex">
        <el-input v-model="searchForm.params" class="mr-2" placeholder="合约名称/交易代码" style="width: 250px;" />
        <el-button type="primary" :icon="Search" @click="getDataList(1)" :loading="isLoading">搜索</el-button>
      </div>
    </div>
    <div class="soll-list">
      <el-table :data="tableData" border  v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            {{ scope.row[item.prop] || 'N/A' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template #default="scope">
            <span class="flex justify-center align-middle">
              <el-button link :type="scope.row['status'] == 1?'':'primary'" :disabled="scope.row['status'] == 1"
                @click="showDialog(scope.row, 'showEditDialog')">添加</el-button>
            </span>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
      <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emit('close', false)">取消</el-button>
        <el-button type="primary" class="default_btn" @click="handleSubmit" :loading="isLoading">确定 </el-button>
      </span>
    </template>
  </el-dialog>
  <Edit v-if="dialogType.showEditDialog" :data="dialogType.info" @close="closeDialogType" />
</template>

<script setup>
import { getFutureList } from '/@/api/modules/contract'
import { ref, reactive, onMounted } from 'vue'
import Edit from './Edit.vue'
const emit = defineEmits(['close', 'success'])
const props = defineProps({
  data: { // 行数据
    type: Object,
    default: () => ({})
  }
})
const columnBase = ref([
  { prop: 'name', label: '名称', align: 'center' },
  { prop: 'symbol', label: '代码', align: 'center', width: 100 },
  { prop: 'price', label: '最新价', align: 'center', width: 100 },
  { prop: 'amount', label: '交易金额(24H)', align: 'center', width: 180 },
])
const searchForm = reactive({
  params: ''
})
const currentPage = ref(1)
const currentLastPage = ref(1)

const tableData = ref([])
const show = ref(true)
const isLoading = ref(true)

const showDialog = (data, type) => {
  if (data) {
    dialogType.info = Object.assign({}, data);
  } else {
    dialogType.info = null
  }
  dialogType[type] = true;
}

const dialogType = reactive({
  showEditDialog: false,
  info: null
})
const closeDialogType = (isReload) => {
  for (const key in dialogType) {
    dialogType[key] = false
  }
  if(isReload&&isReload.reload){
    emit('close', {reload:true})
  }
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
  getFutureList(send)
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
getDataList(1);
</script>
<style scoped>
.soll-list {
  max-height: 500px;
  overflow: auto;
}
</style>
