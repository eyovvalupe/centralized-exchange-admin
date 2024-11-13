<template>
<div class="px-[30px] py-[10px]">
    <div class="flex reset-el-style-v2 justify-between">
      <div>
        <el-button class="w-[120px]" type="primary" plain icon="plus" @click="showDialog(null, 'showDialog')">新增</el-button>
      </div>
      <div class="flex">
        <div class="w-[264px] ml-2">
          <el-input v-model="searchValue" ref="searchInput" suffix-icon="search" placeholder="用户名" />
        </div>
        <el-button type="primary" class="w-[120px] ml-[10px]" @click="getDataList(1)"
          :loading="isLoading">查询</el-button>
      </div>
    </div>
    <div class="reset-el-style-v2 py-[10px]">
      <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :min-width="item.minWidth" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span v-if="item.prop === 'locked'" class="status" :class="!scope.row[item.prop] ? 'success' : 'fail'">
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
        <el-table-column label="操作" :min-width="gw(140)" align="center">
          <template #default="scope">
            <div class="flex justify-between items-center w-full relative" v-if="!scope.row['preset']">
              <div class="flex items-center justify-center flex-1 px-[21px]">
              <!-- <el-button size="default" class="underline" link type="danger" @click="showDialog(scope.row,'showGoogle')">删除</el-button> -->
                <el-button size="default" class="underline" link type="primary" @click="showDialog(scope.row, 'showDialog')">修改</el-button>
              </div>
              <el-dropdown class="!absolute right-[5px] top-[1px] w-[16px] h-[16px]">
                <img class="w-[16px] h-[16px]" src="/src/assets/images/more.svg" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="showDialog(scope.row, 'showResetDialog')">
                      <SvgIcon name="edit" size="15px" /><span class="ml-[10px]">修改登录密码</span>
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
      
    </div>

    <div class="pb-[10px]">
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

<script>
export default { name: 'SysUsers' };
</script>
<script setup>
import { getList, apiResetPwd } from '/@/api/modules/system/user.api'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import AddEditUser from './AddEditUser.vue'
import ResetPwd from './ResetPwd.vue'
import SvgIcon from '/@/components/icons/index.vue'
import { hex_md5 } from '/@/utils/md5'
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

const gw = (w)=>{
  return Math.round(1400/1920 * w)
}

const columnBase = ref([
  { prop: 'username', label: '用户名', align: 'center' ,minWidth:gw(240)  },
  { prop: 'rolename', label: '角色', align: 'center',minWidth:gw(300) },
  { prop: 'locked', label: '状态', align: 'center',minWidth:gw(200) },
  { prop: 'preset', label: '是否预设', align: 'center',minWidth:gw(200)  },
  { prop: 'remarks', label: '备注', align: 'center',minWidth:gw(805) }])
const searchValue = ref(sessionStorage.sysUsersSearchValue || '')
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
  const send = { page: currentLastPage.value };
  if (searchValue.value) {
    send.username = searchValue.value;
  }

  sessionStorage.sysUsersSearchValue =  searchValue.value || ''

  const cacheKey = hex_md5(JSON.stringify(send))
  if(sessionStorage['sysUsersSearch']){
    const searchCache = JSON.parse(sessionStorage['sysUsersSearch'])
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
      sessionStorage['sysUsersSearch'] = JSON.stringify({
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
// const handleDelete = (row) => {
//   ElMessageBox.confirm(`确定要退出系统吗？`, '提示', {
//     confirmButtonText: '确定',
//     cancelButtonText: '取消',
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