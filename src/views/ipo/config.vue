<template>
  <div class="reset-el-styte p-2">
    <div class="flex justify-between p-2">
      <div>
        <el-button  :type="checkAuthCode(22101)?'primary':'info'" :disabled="!checkAuthCode(22101)" class="ml-2" @click="showDialog(null, 'showDialog')">新增</el-button>
        <el-button  :type="checkAuthCode(22101)?'su':'info'" :disabled="!checkAuthCode(22101)" class="ml-2" @click="showDialog(null, 'showIpoDialog')">IPO参数</el-button>
      </div>
      <div class="flex">
        <div class="mr-10">
          <el-button :type="searchForm.status == item.value ? 'success' : 'default'" v-for="(item) in optionStatus"
            :key="item.value" @click="changeSearch(item.value)">{{ item.label }}</el-button>
        </div>
        <el-input v-model="searchForm.params" class="mr-2" placeholder="公司名称/交易代码" style="width: 250px;" />
        <!-- <el-select v-model="searchForm.status" class="ml-2"  style="width: 100px;">
          <el-option v-for="item in optionStatus" :key="item.value" :label="item.label" :value="item.value" />
        </el-select> -->
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
              <!-- <el-popover popper-class="operation_popover" placement="bottom" title="" :width="80" trigger="click"
                :show-arrow="false">
                <template #reference>
                  <el-button link type="primary" size="small"><img style="width: 20px; height: 20px"
                      src="/src/assets/images/more.svg" /></el-button>
                </template>
  <div class="flex flex-col items-center cursor-pointer">
    <p @click="handleDelete(scope.row, 'modifyVisible')" class="flex items-center py-2">
      <el-icon :size="20">
        <DeleteFilled />
      </el-icon> <span class="ml-1">删除</span>
    </p>
  </div>
  </el-popover> -->
              <!-- <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button> -->
              <el-button link  :type="checkAuthCode(22101)?'primary':'info'" :disabled="!checkAuthCode(22101)"  @click="showDialog(scope.row, 'showDialog')">修改</el-button>
              <el-dropdown>
                <img style="width: 20px; height: 20px;margin-top: 5px;" src="/src/assets/images/more.svg" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleDelete(scope.row)" :disabled="!checkAuthCode(22101)">
                      <el-icon :size="20" :color="checkAuthCode(22101)?'red':'#ccc'">
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
  <AddEditUser v-if="dialogType.showDialog" :data="dialogType.info" @close="closeDialogType" />
  <ipoEditModel v-if="dialogType.showIpoDialog" :data="dialogType.info" @close="closeDialogType" />

</template>

<script setup>
import { getList, apiDel } from '/@/api/modules/ipo/config.api'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { copy } from '/@/utils'
import { ElMessageBox, ElMessage, dayjs } from 'element-plus'
import AddEditUser from './components/AddEdit.vue'
import ipoEditModel from './components/ipoEdit.vue'
import { checkAuthCode } from '/@/hooks/store.hook.js'

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:ipoCfg', () => {
  getDataList()
})
const dialogType = reactive({
  showDialog: false,
  showIpoDialog: false,
  showGoogle: false,
  showResetDialog: false,
  info: null
})
const searchForm = reactive({
  params: '',
  status: 'all'
})
const currentPage = ref(1)
const currentLastPage = ref(1)
const statusObj = ref({
  'none': '预售',
  'issuing': '可认购',
  'done': '认购结束',
  'listed': '已上市'
})

const optionStatus = [
  {
    value: 'all',
    label: '全部',
  },
  {
    value: 'issuing',
    label: '发行中',
  },
  {
    value: 'listed',
    label: '已上市',
  },
]
const columnBase = ref([
  { prop: 'company_name', label: '公司名称', align: 'center' },
  { prop: 'market', label: '市场', align: 'center', width: 100 },
  { prop: 'symbol', label: '交易代码', align: 'center', width: 90 },
  { prop: 'issue_start_date', label: '认购开始日期', align: 'center', width: 115 },
  { prop: 'issue_end_date', label: '认购结束日期', align: 'center', width: 115 },
  { prop: 'issue_price_min', label: '认购价格', align: 'center', width: 85 },
  { prop: 'listing_date', label: '上市日期', align: 'center', width: 100 },
  { prop: 'listed_price', label: '上市价格', align: 'center', width: 90 },
  { prop: 'vip', label: 'VIP杠杆', align: 'center', width: 80 },
  { prop: 'keyword', label: 'VIP密钥', align: 'center', width: 80 },
  // { prop: 'lever', label: '认购杠杆', align: 'center', width:90 },
  { prop: 'status', label: '状态', align: 'center', width: 100 },

])
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
const changeSearch = (s) => {
  searchForm.status = s;
  getDataList();
}
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除(${row.company_name})吗？`, `确认删除`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    isLoading.value = true
    apiDel({ id: row.id }).then(data => {
      getDataList()
      ElMessage({
        type: 'tips',
        message: '操作成功',
        offset: 200
      })
    }).finally(() => {
      isLoading.value = false
    })
  })
}
getDataList();
</script>