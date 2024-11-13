<template>
   <div class="px-[20px] py-[10px]">
    <div class="flex reset-el-style-v2 justify-end">

       <div class="flex items-center">
       
        <div class="w-[264px] ml-2">
          <el-input v-model="searchValue" ref="searchInput" suffix-icon="search" placeholder="参数名称" />
        </div>
        <el-button type="primary" class="w-[120px] ml-[10px]" @click="getDataList(1)"
          :loading="isLoading">查询</el-button>
      </div>      
     
    </div>
    <div class="py-[10px] reset-el-style-v2">
      <el-table :data="tableData" border :class="tableData.length?'':'noborder'" v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :min-width="item.minWidth" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <div class="w-full break-words text-center">
              {{ scope.row[item.prop] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="gw(140)" align="center">
          <template #default="scope">
            <el-button size="default" link class="underline" :type="scope.row['modify']?'primary':''" :disabled="!scope.row['modify']" @click="showDialog(scope.row, 'showDialog')">修改</el-button>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
      <!-- <Pagination @changePage="getDataList" /> -->
    </div>
  </div>
  <Edit v-if="dialogType.showDialog" :data="dialogType.info" @close="closeDialogType" />
   
</template>

<script>
export default { name: 'ParamsSet' };
</script>
<script setup>
import { getList } from '/@/api/modules/system/info.api'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import Edit from './Edit.vue'
import { hex_md5 } from '/@/utils/md5'

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:ParamsSet', () => {
  getDataList()
})
const dialogType = reactive({
  showDialog: false,
  showGoogle: false,
  showResetDialog: false,
  info: null
})

const gw = (w)=>{
  return Math.round(1400/1920 * w)
}

const currentPage = ref(1)
const columnBase = ref([
  { prop: 'name', label: '名称', align: 'left',minWidth:gw(300) },
  // { prop: 'code', label: '代码', align: 'center',minWidth:gw(200) },
  { prop: 'value', label: '值', align: 'left',minWidth:gw(500)  },
  { prop: 'remark', label: '说明', align: 'left',minWidth:gw(940) },
])
const searchValue = ref(sessionStorage.paramsSetSearchValue || '')
const isLoading = ref(false)
const googleLoading = ref(false)
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
    currentPage.value = page
  }
  const send = {};
  if(searchValue.value){
    send.name = searchValue.value;
  }

  sessionStorage.paramsSetSearchValue = searchValue.value || ''
  
  const cacheKey = hex_md5(JSON.stringify(send))
  if(sessionStorage['paramsSetSearch']){
    const searchCache = JSON.parse(sessionStorage['paramsSetSearch'])
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
      tableData.value = res || []
      sessionStorage['paramsSetSearch'] = JSON.stringify({
        cacheKey,
        data:tableData.value
      })
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
const googleSubmit=(googlecode)=>{
  googleLoading.value = true;
  const { roleid } = dialogType.info;
  apiDel({roleid,googlecode}).then(data => {
    ElMessage({
      type: 'tips',
      message: '操作成功',
      offset: 200
    })
      closeDialogType({reload:true});
    }).finally(()=>{
      googleLoading.value = false
    })
}
getDataList();
</script>