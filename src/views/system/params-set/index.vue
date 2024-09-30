<template>
  <div class="reset-el-styte p-2">
    <div class="flex justify-between p-2">
      <div> </div>
      <div class="flex">
        <el-input v-model="searchValue" class="ml-4" placeholder="参数名称" />
        <el-button type="primary" class="ml-4" :icon="Search" @click="getDataList(1)"
          :loading="isLoading">搜索</el-button>
      </div>
    </div>
    <div>
      <el-table :data="tableData" :border="tableData.length" :class="tableData.length?'':'noborder'" v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template #default="scope">
            <el-button link :type="scope.row['modify']?'primary':''" :disabled="!scope.row['modify']" @click="showDialog(scope.row, 'showDialog')">修改</el-button>
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

<script setup>
import { getList } from '/@/api/modules/system/info.api'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Edit from './Edit.vue'

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
const currentPage = ref(1)
const columnBase = ref([
  { prop: 'name', label: '名称', align: 'left',width:200 },
  // { prop: 'code', label: '代码', align: 'center' },
  { prop: 'value', label: '值', align: 'left',width:250  },
  { prop: 'remark', label: '说明', align: 'left' },
])
const searchValue = ref('')
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
  isLoading.value = true
  const send = {};
  if(searchValue.value){
    send.name = searchValue.value;
  }
  getList(send)
    .then(res => {
      isLoading.value = false
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
// const handleDelete = (row) => {
//   console.log(row.id)
//   ElMessageBox.confirm(`确定要退出系统吗？`, '提示', {
//     confirmButtonText: '确定',
//     cancelButtonText: '取消',
//     type: 'warning'
//   }).then(() => {
//     apiDel({roleid}).then(data => {
//       console.log(data)
//       ElMessage.success('删除成功')
//       getDataList()
//     })
//   })
// }
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