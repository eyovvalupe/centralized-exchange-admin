<template>
  <div class="reset-el-styte">
    <div class="flex justify-between p-2">
      <div> <el-button type="primary" class="ml-2" @click="showDialog(null, 'showDialog')">新增</el-button>
      </div>
    </div>
    <div>
      <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span v-if="item.prop == 'auths'">
              <span class="status-bg lock mr-1" v-for="(item, idx) in scope.row[item.prop].split(',')" :key="idx">
                {{ item }}
              </span>
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width='150' align="center">
          <template #default="scope">
            <!-- <el-button link type="danger" @click="showDialog(scope.row,'showGoogle')">删除</el-button> -->
            <div class="flex justify-center">
              <el-button link type="primary" @click="showDialog(scope.row, 'showDialog')">修改</el-button>
              <el-dropdown>
                <img class="mr-[5px] w-[16px]" src="/src/assets/images/more.svg" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="showDialog(scope.row, 'showGoogle')">
                      <el-icon :size="20">
                        <DeleteFilled />
                      </el-icon> <span class="ml-1">删除</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
      <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
    </div>
  </div>
  <AddEdit v-if="dialogType.showDialog" :data="dialogType.info" @close="closeDialogType" />
   <el-dialog :close-on-click-modal="false" title="操作者验证" v-model="dialogType.showGoogle" width="350" @close="closeDialogType">
    <div v-loading="googleLoading">
      <GoogleVerify class="agentGoogle" @confirm="googleSubmit" v-if="dialogType.showGoogle" />
    </div>
  </el-dialog>
</template>

<script>
export default { name: 'Roles' };
</script>
<script setup>
import { getList, apiDel } from '/@/api/modules/system/index.api'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Search, Plus, Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import AddEdit from './AddEdit.vue'

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:Roles', () => {
  getDataList()
})
const dialogType = reactive({
  showDialog: false,
  showGoogle: false,
  info: null
})
const currentPage = ref(1)
const currentLastPage = ref(1)
const columnBase = ref([
  // { prop: 'roleid', label: '角色ID', align: 'center' },
  { prop: 'rolename', label: '角色名', align: 'center',width:150 },
  { prop: 'auths', label: '权限', align: 'center' },
  { prop: 'remarks', label: '备注', align: 'center' }])
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
const closeDialogType = (item) => {
  for (const key in dialogType) {
    dialogType[key] = false
  }
  if (item && item.reload) {
    getDataList();
  }
}
// const handleDelete = (row) => {
//   ElMessageBox.confirm(`确定要退出系统吗？`, '提示', {
//     confirmButtonText: '确定',
//     cancelButtonText: '取消',
//     type: 'warning'
//   }).then(() => {
//     apiDel({roleid}).then(data => {
//       ElMessage.success('删除成功')
//       getDataList()
//     })
//   })
// }
const googleSubmit = (googlecode) => {
  googleLoading.value = true;
  const { roleid } = dialogType.info;
  apiDel({ roleid, googlecode }).then(data => {
    ElMessage({
      type: 'tips',
      message: '删除成功',
      offset: 200
    })
    closeDialogType({ reload: true });
  }).finally(() => {
    googleLoading.value = false
  })
}
getDataList();
</script>
<style>
.el-transfer__buttons .el-transfer__button:nth-child(2){
  margin: 0 !important;
}
</style>