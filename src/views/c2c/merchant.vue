<template>
  <div class="px-[30px] py-[10px]">
    <div class="flex reset-el-style-v2 justify-between">
      <el-button plain class="w-[120px]" :type="checkAuthCode(12101)?'primary':'info'" icon="plus" :disabled="!checkAuthCode(12101)" @click="showDialog(null, 'showDialog')">新增</el-button>
    </div> 
    <div class="reset-el-style-v2 pt-[10px]">
      <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :min-width="item.minWidth" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span v-if="item.prop === 'status'" class="status-bg" :class="scope.row['status']">
              {{ statusObj[scope.row[item.prop]] }}
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="gw(140)" align="center">
          <template #default="scope">
            <span class="flex justify-center align-middle">
              <el-button class="underline" size="default" link :type="checkAuthCode(12101)?'primary':'info'" :disabled="!checkAuthCode(12101)" @click="showDialog(scope.row, 'showDialog')">修改</el-button>
            </span>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
      
    </div>
    <div class="py-[10px]">
      <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
    </div>
  </div>
  <merEdit v-if="dialogType.showDialog" :data="dialogType.info" @close="closeDialogType" />
</template>

<script>
export default { name: 'c2cMerchant' };
</script>
<script setup>
import { getList } from '/@/api/modules/c2cMer'
// import { getList } from '/@/api/modules/c2cOrder'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { copy } from '/@/utils'
import { ElMessageBox, ElMessage, dayjs } from 'element-plus'
import merEdit from './components/merEdit.vue'
import { checkAuthCode } from '/@/hooks/store.hook.js'
import { hex_md5 } from '/@/utils/md5'
const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:c2cMerchant', () => {
  getDataList()
})
const dialogType = reactive({
  showDialog: false,
  info: null
})
const searchForm = reactive({
  params: '',
  status: 'all'
})
const currentPage = ref(1)
const currentLastPage = ref(1)

const gw = (w)=>{
  return Math.round(1400/1920 * w)
}

const columnBase = ref([
  { prop: 'name', label: '商户名称', align: 'center', minWidth: gw(844) },
  { prop: 'volume', label: '成交量', align: 'center',minWidth: gw(300) },
  { prop: 'volumerate', label: '成交率', align: 'center',minWidth: gw(300) },
  { prop: 'avetime', label: '平均时效(分钟)', align: 'center',minWidth: gw(300) },
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
const closeDialogType = (item) => {
  for (const key in dialogType) {
    dialogType[key] = false
  }
  if (item && item.reload) {
    getDataList();
  }
}
const getDataList = (page) => {
  if (page) {
    currentLastPage.value = page
  }
  const send = { page: currentLastPage.value };
  if (searchForm.params) {
    send.params = searchForm.params;
  }
  if (searchForm.status !== 'all') {
    send.status = searchForm.status;
  }

  const cacheKey = hex_md5(JSON.stringify(send))
  if(sessionStorage['c2cMerchantSearch']){
    const searchCache = JSON.parse(sessionStorage['c2cMerchantSearch'])
    if(searchCache.cacheKey == cacheKey){
      tableData.value = searchCache.data
    }else{
      isLoading.value = true
    }
  }else{
    isLoading.value = true
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
      sessionStorage['c2cMerchantSearch'] = JSON.stringify({
        cacheKey,
        data:res
      })
    })
    .finally(() => {
      isLoading.value = false
    })
}

getDataList();
</script>