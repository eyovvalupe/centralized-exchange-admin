<template>
  <div class="reset-el-styte p-2">
    <div class="flex justify-between p-2">
      <div>
        <el-button type="primary" @click="showDialog(null, 'showDialog')">新增</el-button>
        <el-button class="ml-2" @click="showDialog(null, 'showCfgDialog')">交易参数配置</el-button>
      </div>
      <div class="flex">
        <!-- <div class="mr-10">
          <el-button :type="searchForm.status == item.value ? 'success' : 'default'" v-for="(item) in optionStatus"
            :key="item.value" @click="changeSearch(item.value)">{{ item.label }}</el-button>
        </div> -->
        <el-input v-model="searchForm.params" class="mr-2" placeholder="合约名称/交易代码" style="width: 250px;" />

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
            <span v-if="item.prop === 'locked'" :style="{ color: !scope.row[item.prop] ? 'green' : '#ff0000' }">
              {{ scope.row[item.prop] ? '禁用' : '启用' }}
            </span>
            <span v-else-if="item.prop === 'vip'">
              <span class="status-bg" :class="scope.row['lever'] > 1 ? 'status-yellow' : ''">
                {{ scope.row['lever'] > 1 ? scope.row['lever'] + 'X' : '无' }}
              </span>
            </span>
            <span v-else-if="item.prop === 'issue_price_min'">
              {{ scope.row['issue_price_max'] }}
            </span>
            <span v-else-if="item.prop === 'status'" class="status-bg" :class="scope.row['status']">
              {{ statusObj[scope.row[item.prop]] }}
            </span>
            <!-- <span v-else-if="item.prop==='issue_start_date'">
              <el-tag type="info" size="small"> {{  dayjs(scope.row['issue_start_date']).format('YYYY-MM-DD') }}</el-tag>
              <span class="mx-1">~</span>
              <el-tag type="info" size="small"> {{ dayjs(scope.row['issue_end_date']).format('YYYY-MM-DD')  }}</el-tag>
            </span> -->
            <!-- <span v-else-if="item.prop === 'company_name'"  class="cursor-pointer text-[#165DFF]" @click="copy(scope.row[item.prop])">
              {{ scope.row[item.prop] }}
            </span> -->
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template #default="scope">
            <span class="flex justify-center align-middle">
              <el-button link type="primary" @click="showDialog(scope.row, 'showEditDialog')">修改</el-button>
              <el-dropdown>
                <img style="width: 20px; height: 20px;margin-top: 5px;" src="/src/assets/images/more.svg" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleDelete(scope.row)">
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
  <Edit v-if="dialogType.showEditDialog" :data="dialogType.info" @close="closeDialogType" />
  <Config v-if="dialogType.showCfgDialog" :data="dialogType.info" @close="closeDialogType" />
  <StockList v-if="dialogType.showDialog" :data="dialogType.info" @close="closeDialogType" />
   <el-dialog :close-on-click-modal="false" title="操作者验证" v-model="dialogType.showGoogle" width="320" @close="closeDialogType">
    <GoogleVerify class="agentGoogle" @confirm="handleSubmit" @close="closeDialogType" v-if="dialogType.showGoogle" />
  </el-dialog>
</template>

<script>
export default { name: 'contract' };
</script>
<script setup>
import { getList, apiDel } from '/@/api/modules/contract'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { copy } from '/@/utils'
import { ElMessageBox, ElMessage, dayjs } from 'element-plus'
import Config from './components/Config.vue'
import Edit from './components/Edit.vue'
import StockList from './components/StockList.vue'

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:contract', () => {
  getDataList()
})
const dialogType = reactive({
  showEditDialog: false,
  showCfgDialog: false,
  showDialog: false,
  showGoogle: false,
  info: null
})
const searchForm = reactive({
  params: '',
  status: 'all'
})
const currentPage = ref(1)
const currentLastPage = ref(1)
const columnBase = ref([
  { prop: 'name', label: '合约名称', align: 'center' },
  { prop: 'symbol', label: '合约代码', align: 'center' },
  { prop: 'pip', label: '最小变化价位', align: 'center' },
  { prop: 'pip_value', label: '最小变化价位的点值', align: 'center' },
  { prop: 'price_multiple', label: '价格系数', align: 'center' },
  { prop: 'volume_multiple', label: '成交量系数', align: 'center' }
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
const handleSubmit = async (googlecode) => {
  ElMessageBox.confirm(`确定删除`, `确定删除吗？`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    isLoading.value = true
    apiDel({ symbol: dialogType.info.symbol, googlecode }).then(() => {
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