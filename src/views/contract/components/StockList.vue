<template>
   <el-dialog :close-on-click-modal="false" width="900" title="添加合约" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <div class="flex justify-end search-box reset-el-style-v2">
      <div class="flex">
        <div class="w-[168px] mr-[10px]">
          <el-select v-model="searchForm.type" @change="getDataList(1)">
            <el-option v-for="(item) in typeOptions"
            :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </div>
        <el-input prefix-icon="search" v-model="searchForm.params" placeholder="合约名称/合约代码" style="width: 264px;" />
        <el-button type="primary" class="w-[80px] ml-[10px]" @click="getDataList(1)" :loading="isLoading">查询</el-button>
      </div>
    </div>
    <div class="soll-list mt-[10px] reset-el-style-v2">
      <el-table :data="tableData" border v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :min-width="item.minWidth" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span v-if="item.prop == 'type'">{{ typeMap[scope.row.type] || '--'}}</span>
            <span v-else>{{ scope.row[item.prop] || 'N/A' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80" align="center">
          <template #default="scope">
            <span class="flex justify-center align-middle">
              <el-button link class="underline"  size="default" :type="scope.row['status'] == 1 ? '' :'primary'" :disabled="scope.row['status'] == 1"
                @click="showDialog(scope.row, 'showEditDialog')">{{ scope.row['status'] == 1 ? '已添加' : '添加' }}</el-button>
            </span>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
    </div>
    <div class="flex justify-between pt-[20px] pb-[5px] items-center" v-if="tableData.length" >
      <Pagination @changePage="getDataList" style="padding-top: 0px;" :currentPage="currentLastPage" />
      <div class="flex">
        <el-button type="primary" class="w-[98px]" round @click="emit('close', false)">关闭 </el-button>
      </div>
      
    </div>
  </el-dialog>
  <Edit v-if="dialogType.showEditDialog" :data="dialogType.info" @close="closeDialogType" />
</template>

<script setup>
import { getFutureList } from '/@/api/modules/contract'
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

const typeMap = ref({
  crypto:'加密货币',
  forex:'外汇',
  blocktrade:'大宗商品'
})

const columnBase = ref([
  { prop: 'type', label: '类型', align: 'center', minWidth: 80 },  
  { prop: 'name', label: '合约名称', align: 'center', minWidth: 90 },
  { prop: 'symbol', label: '合约代码', align: 'center', minWidth: 80 },
  { prop: 'price', label: '最新价', align: 'center', minWidth: 110 },
  { prop: 'amount', label: '交易金额(24H)', align: 'center', minWidth: 120 },
])
const searchForm = reactive({
  type:"all",
  params: ''
})
const currentPage = ref(1)
const currentLastPage = ref(1)

const tableData = ref([])
const show = ref(true)
const isLoading = ref(true)

const showDialog = (data, type) => {
  if (data) {
    dialogType.info = Object.assign({
      pip_value:data.pip
    }, data);
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
  if(searchForm.type != 'all'){
    send.type = searchForm.type
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
