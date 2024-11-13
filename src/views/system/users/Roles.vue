<template>
<div class="px-[20px] py-[10px]">
    <div class="flex reset-el-style-v2 justify-between">
      <div>
        <el-button type="primary" icon="plus" class="w-[120px]" plain @click="showDialog(null, 'showDialog')">新增</el-button>
      </div>
    </div>
    <div class="pt-[10px] reset-el-style-v2">
      <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :min-width="item.minWidth" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <div class="role-tag-list" v-if="item.prop == 'auths'">
              <span class="role-tag-bg lock mr-1" v-for="(item, idx) in scope.row[item.prop].split(',')" :key="idx">
                {{ item }}
              </span>
            </div>
            <div v-else>
              {{ scope.row[item.prop] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="gw(140)" align="center">
          <template #default="scope">
            <div class="flex justify-between items-center w-full relative" v-if="!scope.row['preset']">
              <div class="flex items-center justify-center flex-1 px-[21px]">
                <el-button class="underline" size="default" link type="primary" @click="showDialog(scope.row, 'showDialog')">修改</el-button>
              </div>
             <el-dropdown class="!absolute right-[5px] top-[1px] w-[16px] h-[16px]">
                <img class="w-[16px] h-[16px]" src="/src/assets/images/more.svg" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="showDialog(scope.row, 'showGoogle')">
                      <el-icon :size="18">
                        <Delete />
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
      
    </div>
    <div class="py-[10px]">
      <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
    </div>
  </div>
  <AddEdit v-if="dialogType.showDialog" :data="dialogType.info" @close="closeDialogType" />
   <el-dialog :close-on-click-modal="false" title="操作者验证" v-model="dialogType.showGoogle" width="350" @close="closeDialogType" v-if="dialogType.showGoogle">
    <div v-loading="googleLoading">
      <GoogleVerify class="agentGoogle" @close="dialogType.showGoogle=false;" @confirm="googleSubmit"  />
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
import { hex_md5 } from '/@/utils/md5'
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

const gw = (w)=>{
  return Math.round(1400/1920 * w)
}


const columnBase = ref([
  // { prop: 'roleid', label: '角色ID', align: 'center',minWidth:gw(300) },
  { prop: 'rolename', label: '角色名', align: 'center',minWidth:gw(300) },
  { prop: 'auths', label: '权限', align: 'center',minWidth:gw(1140) },
  { prop: 'remarks', label: '备注', align: 'center',minWidth:gw(300) }])
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

  const cacheKey = hex_md5(JSON.stringify(send))
  if(sessionStorage['rolesSearch']){
    const searchCache = JSON.parse(sessionStorage['rolesSearch'])
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
      sessionStorage['rolesSearch'] = JSON.stringify({
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
<style lang="scss" scoped>
.el-transfer__buttons .el-transfer__button:nth-child(2){
  margin: 0 !important;
}

.role-tag-bg{
  line-height: 28px;
  padding: 0 10px;
  border-radius: 4px;
  background-color: var(--el-color-primary);
  color:#fff;
  display: inline-block;
  margin:5px;
}
</style>