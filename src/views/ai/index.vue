<template>
  <div class="reset-el-styte">
    <div class="flex justify-between p-2">
      <div>
        <el-button type="primary" @click="showDialog(null, 'showDialog')">
          <el-icon>
            <Plus />
          </el-icon>
          新建
        </el-button>
      </div>
      <div class="flex">
        <el-input v-model="searchForm.params" class="mr-2" placeholder="名称/代码" style="width: 250px;" />
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
            <template v-if="item.prop === 'uid'">
              <span class="truncate cursor-pointer" @click="copy(scope.row[item.prop])"> {{
                scope.row[item.prop] }}</span>
            </template>
            <span v-else-if="item.prop === 'offset'"  class="status-bg" :class="scope.row[item.prop]">
              {{ options[scope.row[item.prop]] }}
            </span>
            <span v-else-if="item.prop === 'role'">
              {{ optionStatus.find(f => f.value == scope.row[item.prop]).label }}
            </span> 
            <span v-else-if="item.prop === 'name'">
              {{   scope.row[item.prop] || '全部' }}
            </span> 
            <span v-else-if="item.prop === 'winrate'">
             {{  scope.row['compare']=='ge'?'大于或等于':'小于' }} {{   scope.row[item.prop] }}%
            </span> 
            <span v-else-if="item.prop === 'username'">
              <span class=" cursor-pointer text-[#165DFF]" @click="showDialog(scope.row, 'showInfoDialog')">{{
                scope.row[item.prop] }}
              </span>
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template #default="scope">
            <span class="flex justify-center align-middle">
              <el-button link type="primary" @click="showDialog(scope.row, 'showDialog')">修改</el-button>
              <el-dropdown>
                <img style="width: 20px; height: 20px;margin-top: 5px;" src="/src/assets/images/more.svg" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleSubmit(scope.row)">
                      <el-icon :size="20">
                        <DeleteFilled />
                      </el-icon> <span class="ml-1">删除</span>
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
  <userDetail v-if="dialogType.showInfoDialog && dialogType.info" :partyid="dialogType.info.partyid"  @close="closeDialogType" />
  <EditPrice v-if="dialogType.showDialog" :data="dialogType.info" @close="closeDialogType" />
  <!--  <el-dialog :close-on-click-modal="false" title="操作者验证" v-model="dialogType.showGoogle" width="320" @close="closeDialogType">
    <GoogleVerify class="agentGoogle" @confirm="handleSubmit" @close="closeDialogType" v-if="dialogType.showGoogle" />
  </el-dialog> -->
</template>

<script>
export default { name: 'aiIndex' };
</script>
<script setup>
import { getCtrList, apiCtrDel } from '/@/api/modules/ai'
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage, dayjs } from 'element-plus'
import EditPrice from './components/EditPrice.vue'
import { copy } from '/@/utils'

import userDetail from '/@/components/userDetail/index.vue'
const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:ai', () => {
  getDataList()
})
const dialogType = reactive({
  showDialog: false,
  showInfoDialog: false,
  showGoogle: false,
  info: null
})
const searchForm = reactive({
  params: '',
  status: 'all'
})
const currentPage = ref(1)
const currentLastPage = ref(1)
const optionStatus = [
  {
    value: 'all',
    label: '所有用户',
  },
  {
    value: 'user',
    label: '真实用户',
  },
  {
    value: 'guest',
    label: '模拟用户',
  }
]
const options={
      long: '买涨',
      short: '买跌'
    };
const columnBase = ref([
  { prop: 'uid', label: 'UID', align: 'center' },
  { prop: 'username', label: '用户名', align: 'center' },
  { prop: 'role', label: '角色', align: 'center' },
  // { prop: 'father_username', label: '代理', align: 'center' },
  { prop: 'name', label: '合约', align: 'center' },
  { prop: 'offset', label: '方向', align: 'center' },
  { prop: 'winrate', label: '盈亏比率', align: 'center' },
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
const getDataList = (page) => {
  if (page) {
    currentLastPage.value = page
  }
  isLoading.value = true
  const send = { page: currentLastPage.value };
  if (searchForm.params) {
    send.params = searchForm.params;
  }
  if (searchForm.status !== 'all') {
    send.status = searchForm.status;
  }
  getCtrList(send)
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
const handleSubmit = async (data) => {
  ElMessageBox.confirm(`确定删除`, `确定删除吗？`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    isLoading.value = true
    apiCtrDel({ partyid: data.partyid }).then(() => {
      closeDialogType({ reload: true })
      ElMessage({
        type: 'tips',
        message: '删除成功',
        offset: 200
      })
    }).finally(() => {
      isLoading.value = false
    })
  })
}
const handleDelete = (row) => {
  ElMessageBox.confirm(`删除会清空所有行情数据，且无法恢复`, `确定删除吗？`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    dialogType.info = row;
    dialogType.showGoogle = true;
  })
}
getDataList();
</script>