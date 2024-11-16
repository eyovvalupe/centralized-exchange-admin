<template>
  <div class="px-[20px] py-[10px]">
    <div class="reset-el-style-v2 flex justify-between">
       <el-button class="w-[120px]" type="primary" icon="plus" @click="showDialog(null,'showCommissionDialog')" plain>新增</el-button>
       
    </div>
    <div class="pt-[10px]">
      <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :min-width="item.minWidth" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span class="flex items-center justify-center" v-if="item.prop == 'symbol'">
              <img class="w-[16px] h-[16px] mr-[6px] rounded-full" :src="`/images/crypto/${scope.row[item.prop].toLocaleUpperCase()}.png`" :alt="scope.row[item.prop].toLocaleUpperCase()" /> {{ scope.row[item.prop]  }}
            </span>
            <span v-else-if="item.prop == 'mode'">
              {{ modeMap[scope.row[item.prop]] || '--' }}
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="gw(220)" align="center">
          <template #default="scope">
            <div class="flex items-center justify-center">
              <el-button size="default" class="underline" link type="primary" @click="showDialog(scope.row, 'showCommissionDialog')">修改</el-button>
              <b class="split-line"></b>
              <el-button size="default" class="underline" link type="primary" @click="handleDel(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
    </div>
    <div class="py-[10px]">
      <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage"  />
    </div>
    <AddCommission v-if="dialogType.showCommissionDialog" :data="dialogType.info"  @close="closeDialogType" />
    <el-dialog :close-on-click-modal="false" title="操作者验证" v-model="showGoogle" width="320" v-if="showGoogle">
        <GoogleVerify class="agentGoogle" @confirm="handleDelSubmit" @close="showGoogle=false;" />
    </el-dialog>
  </div>
</template>

<script>
export default { name: 'Amount' };
</script>
<script setup>
import { ElMessage,ElMessageBox } from 'element-plus'
import AddCommission from './components/AddCommission.vue'
import { withdrawConfigList,withdrawConfigDel } from '/@/api/modules/system/withdraw.api'
import { ref } from 'vue'
import { hex_md5 } from '/@/utils/md5'

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:Amount', () => {
  getDataList()
})

const timeRanges = ref([])
if(sessionStorage['amountSearchTimeRange']){
  timeRanges.value = JSON.parse(sessionStorage['amountSearchTimeRange'])
}

const modeMap = ref({
  percent:"百分比",
  fixed:"固定手续费"
})
const dialogType = reactive({
  showCommissionDialog: false,
  info: null
})

const currentLastPage = ref(1)
const currentPage = ref(1)

const gw = (w)=>{
  return Math.round(1400/1920 * w)
}

const columnBase = ref([
  { prop: 'symbol', label: '货币', minWidth:gw(200), align: 'center' },
  { prop: 'mode', label: '模式', minWidth:gw(200), align: 'center' },
  { prop: 'value', label: '手续费', minWidth:gw(670), align: 'center' },
  { prop: 'min', label: '提现最小金额', minWidth:gw(670), align: 'center' }
])

const isLoading = ref(false)

const getDataList = (page) => {
  if (page) {
    currentLastPage.value = page
  }
  const send = { page: currentLastPage.value };
  
  const cacheKey = hex_md5(JSON.stringify(send))
  if(sessionStorage['commissionSearch']){
      const searchCache = JSON.parse(sessionStorage['commissionSearch'])
      if(searchCache.cacheKey == cacheKey){
          tableData.value = searchCache.data
      }else{
          isLoading.value = true
      }
  }else{
      isLoading.value = true
  }
  
  withdrawConfigList(send)
    .then(res => {
      isLoading.value = false
      if(!res || !res.length && currentLastPage.value>1){
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
      sessionStorage['commissionSearch'] = JSON.stringify({
          cacheKey,
          data:res
      })
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
const showDialog = (data, type) => {
  if (data) {
    dialogType.info = Object.assign({}, data);
  } else {
    dialogType.info = null
  }
  dialogType[type] = true;
}

const showGoogle = ref(false)
const delId = ref(0)
const handleDel = (row)=>{
  delId.value = row.id
  ElMessageBox.confirm(`确定删除 ${row.symbol} 手续费配置吗？`, `确定删除吗？`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    showGoogle.value = true
  })
}
const handleDelSubmit = async (googlecode) => {
    showGoogle.value = false
    isLoading.value = true
    withdrawConfigDel({ id: delId.value,googlecode }).then(() => {
      closeDialogType({ reload: true })
      ElMessage({
        type: 'tips',
        message: '删除成功',
        offset: 200
      })
    }).finally(() => {
      isLoading.value = false
    })
}
</script>