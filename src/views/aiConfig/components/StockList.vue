<template>
   <el-dialog :close-on-click-modal="false" width="900" title="品种选择" v-model="show" :append-to-body="true"
    @close="emit('close', false)">

    <div class="flex justify-end search-box">
      <div class="flex">
        <el-input suffix-icon="search" v-model="searchForm.params" placeholder="名称/代码" style="width: 264px;" />
        <el-button type="primary" class="w-[80px] ml-[10px]" @click="getDataList(1)" :loading="isLoading">查询</el-button>
      </div>
    </div>
    
    <div class="soll-list mt-[10px] reset-el-style-v2">
      <el-table :data="tableData" border v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :min-width="item.minWidth" :label="item.label"
          :align="item.align">
          <template #default="scope">
            {{ scope.row[item.prop] || 'N/A' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="gw(110)" align="center">
          <template #default="scope">
            <span class="flex justify-center align-middle">
              <el-button link class="underline" size="default" :type="scope.row['status'] == 1 ? '' : 'primary'" :disabled="scope.row['status'] == 1"
                @click="showDialog(scope.row, 'showEditDialog')">{{scope.row['status'] == 1 ? '已添加' : '添加'}}</el-button>
            </span>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
    </div>
    <div class="flex justify-between pt-[20px] pb-[10px] items-center" v-if="tableData.length" >
      <Pagination @changePage="getDataList" style="padding-top: 0px;" :currentPage="currentLastPage" />
      <div class="flex">
        <el-button type="primary"  @click="emit('close', false)" round class="w-[98px]">关闭</el-button>
      </div>
      
    </div>
      
  </el-dialog>
  <Edit v-if="dialogType.showEditDialog" :data="dialogType.info" @close="closeDialogType" />
</template>

<script setup>
import { getFutureList } from '/@/api/modules/ai'
import { ref, reactive, onMounted } from 'vue'
import Edit from './Edit.vue'
import {ElMessage} from 'element-plus'
const emit = defineEmits(['close', 'success'])
const props = defineProps({
  data: { // 行数据
    type: Object,
    default: () => ({})
  }
})

const gw = (w)=>{
  return Math.round(1400/1920 * w)
}

const columnBase = ref([
  { prop: 'name', label: '名称', align: 'center',minWidth:gw(130) },
  { prop: 'symbol', label: '代码', align: 'center', minWidth: gw(110) },
  { prop: 'price', label: '最新价', align: 'center', minWidth: gw(130) },
  { prop: 'amount', label: '交易金额(24H)', align: 'center', minWidth: gw(160) },
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
    dialogType.info = Object.assign({ }, data);
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
  if (isReload && isReload.reload) {
    emit('close', { reload: true })
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
