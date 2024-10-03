<template>
  <div class=" p-2 pt-0 h-full reset-el-styte">
    <div class="flex justify-between p-2">
      <div> <el-button type="primary" class="ml-2" :icon="Plus" @click="showDialog(null, 'showDialog')">新增</el-button>
      </div>
      <div class="flex">
        <el-input v-model="searchValue" class="ml-4" placeholder="用户名" />
        <el-button type="primary" class="ml-4" :icon="Search" @click="getDataList(1)"
          :loading="isLoading">搜索</el-button>
      </div>
    </div>
    <div>
      <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span v-if="item.prop === 'locked'" class="status-bg" :class="!scope.row[item.prop] ? 'success' : 'none'">
              {{ scope.row[item.prop] ? '限制' : '正常' }}
            </span>
            <span v-else-if="item.prop === 'preset'">
              {{ scope.row[item.prop] ? '是' : '否' }}
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <span v-if="!scope.row['preset']">
              <!-- <el-button link type="danger" @click="showDialog(scope.row,'showGoogle')">删除</el-button> -->
              <el-button link type="primary" @click="showDialog(scope.row, 'showDialog')">修改</el-button>
              <el-dropdown>
                <img style="width: 20px; height: 20px;margin-top: 5px;" src="/src/assets/images/more.svg" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="showDialog(scope.row, 'showResetDialog')">
                      <el-icon :size="20">
                        <Edit />
                      </el-icon> <span class="ml-1">修改登录密码</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </span>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
      <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
    </div>
  </div>
  <AddEditUser v-if="dialogType.showDialog" :data="dialogType.info" @close="closeDialogType" />
  <ResetPwd v-if="dialogType.showResetDialog" :data="dialogType.info" @close="closeDialogType" />
   <el-dialog :close-on-click-modal="false" title="操作者验证" v-model="dialogType.showGoogle" width="350" @close="closeDialogType">
    <div v-loading="googleLoading">
      <GoogleVerify class="agentGoogle" @confirm="googleSubmit" v-if="dialogType.showGoogle" />
    </div>
  </el-dialog>

</template>

<script setup>
import { getList, apiResetPwd } from '/@/api/modules/system/user.api'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Search, Plus,Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import AddEditUser from './AddEditUser.vue'
import ResetPwd from './ResetPwd.vue'

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:SysUsers', () => {
  getDataList()
})
const dialogType = reactive({
  showDialog: false,
  showGoogle: false,
  showResetDialog: false,
  info: null
})
const currentPage = ref(1)
const currentLastPage = ref(1)
const columnBase = ref([
  { prop: 'username', label: '用户名', align: 'center' ,width:120  },
  { prop: 'rolename', label: '角色', align: 'center' },
  { prop: 'locked', label: '状态', align: 'center',width:80 },
  { prop: 'preset', label: '是否预设', align: 'center',width:100  },
  { prop: 'remarks', label: '备注', align: 'center' }])
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
    currentLastPage.value = page
  }
  isLoading.value = true
  const send = { page: currentLastPage.value };
  if (searchValue.value) {
    send.username = searchValue.value;
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
const googleSubmit = (googlecode) => {
  googleLoading.value = true;
  const { roleid } = dialogType.info;
  apiDel({ roleid, googlecode }).then(data => {
    ElMessage({
      type: 'tips',
      message: '操作成功',
      offset: 200
    })
    closeDialogType({ reload: true });
  }).finally(() => {
    googleLoading.value = false
  })
}
getDataList();
</script>