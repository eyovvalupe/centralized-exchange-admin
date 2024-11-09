<template>
   <div class="px-[30px] py-[10px]">
    <div class="flex reset-el-style-v2 justify-between">
      <div>
        <el-button type="primary" plain @click="showDialog(null,'showAutoDialog')">汇率更新方式</el-button>
      </div>
      <div>
        <!-- {{ autoMode?'自动':'手动' }} -->
       
      </div>
    </div>
    <div class="reset-el-style-v2 pt-[10px]">
      <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :min-width="item.minWidth" :label="item.label"
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
        <el-table-column label="操作" :min-width="gw(140)" align="center">
          <template #default="scope">
            <el-button class="underline" link type="primary" @click="showDialog(scope.row, 'showEditDialog')">编辑价格</el-button>
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
  <Autoup v-if="dialogType.showAutoDialog" @close="closeDialogType" />
  <Edit v-if="dialogType.showEditDialog" :info="dialogType.info" @close="closeDialogType" />
</template>

<script>
export default { name: 'exchange' };
</script>
<script setup>
import Autoup from './Autoup.vue'
import Edit from './Edit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getList, apiAutoUp } from '/@/api/modules/exchange'
import { ref } from 'vue'
import { hex_md5 } from '/@/utils/md5'
const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:exchange', () => {
  getDataList()
})
const currentLastPage = ref(1)
const currentPage = ref(1)

const gw = (w)=>{
  return Math.round(1400/1920 * w)
}
const columnBase = ref([
  { prop: 'symbol', label: '货币', align: 'center',minWidth:gw(300) },
  { prop: 'market', label: '市场', align: 'center',minWidth:gw(300) },
  { prop: 'price', label: '汇率', align: 'center',minWidth:gw(1140) }
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
  const send = { page: currentLastPage.value };

  const cacheKey = hex_md5(JSON.stringify(send))
  if(sessionStorage['exchangeSearch']){
    const searchCache = JSON.parse(sessionStorage['exchangeSearch'])
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
      sessionStorage['exchangeSearch'] = JSON.stringify({
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
</script>