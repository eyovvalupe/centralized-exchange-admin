<template>
  <div class="px-[20px] py-[10px]">
    <div class="flex justify-between reset-el-style-v2">
      <div>
        <el-button type="primary" icon="plus"  plain @click="showDialog(null, 'showDialog')">新增大宗商品</el-button>
        <el-button class="ml-[10px]" type="primary" plain @click="showDialog(null, 'showCfgDialog')">交易参数配置</el-button>
      </div>
      <div class="flex">
        <!-- <div class="mr-10">
          <el-button :type="searchForm.status == item.value ? 'success' : 'default'" v-for="(item) in optionStatus"
            :key="item.value" @click="changeSearch(item.value)">{{ item.label }}</el-button>
        </div> -->
        <el-input v-model="searchForm.params"  suffix-icon="search"  placeholder="大宗商品名称/交易代码" style="width: 264px;" />
        <el-button type="primary" class="ml-[10px] w-[120px]" @click="getDataList(1)"
          :loading="isLoading">查询</el-button>
      </div>
    </div>
    <div class="pt-[10px]">
      <div class="reset-el-style-v2">
        <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
          v-loading="isLoading">
          <el-table-column v-for="(item, index) in columnBase" :key="index" :min-width="item.minWidth" :width="item.width" :label="item.label"
            :align="item.align">
            <template #default="scope">
             
              <span v-if="item.prop === 'vip'">
                <span class="status-tag primary" v-for="v in scope.row['lever']" :key="v" v-show="v > 1">
                  {{ v + 'X' }}
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
              <!-- <span v-else-if="item.prop === 'company_name'"  class="underline cursor-pointer text-[#4377FE]" @click="copy(scope.row[item.prop])">
                {{ scope.row[item.prop] }}
              </span> -->
              <span v-else>
                {{ scope.row[item.prop] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" :min-width="minWidth" align="center">
            <template #default="scope">
              <span class="flex justify-center align-middle">
                <el-button link type="primary"  size="default" class="underline" @click="showDialog(scope.row, 'showEditDialog')">修改</el-button>
                <!-- <el-dropdown>
                  <img class="mr-[5px] w-[16px]" src="/src/assets/images/more.svg" />
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="handleDelete(scope.row)">
                        <el-icon :size="20">
                          <DeleteFilled />
                        </el-icon> <span class="ml-1">删除</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown> -->
              </span>
            </template>
          </el-table-column>
          <template v-slot:empty>
            <el-empty class="nodata" description="暂无数据" />
          </template>
        </el-table>
      </div>
      <div  class="py-[10px]">
        <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
      </div>

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
export default { name: 'blocktrade' };
</script>
<script setup>
import { getList, apiDel } from '/@/api/modules/blocktrade'
import { ref, reactive } from 'vue'
import { ElMessageBox, ElMessage, dayjs } from 'element-plus'
import Config from './components/Config.vue'
import Edit from './components/Edit.vue'
import StockList from './components/StockList.vue'

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:blocktrade', () => {
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

const minWidth = 120

const columnBase = ref([
  { prop: 'name',minWidth, label: '大宗商品名称', align: 'center' },
  { prop: 'symbol',minWidth, label: '大宗商品代码', align: 'center' },
  { prop: 'vip',minWidth:180, label: '杠杆', align: 'center' },
  { prop: 'pip',minWidth, label: '最小变化点差', align: 'center' },
  { prop: 'pip_value',minWidth, label: '点值', align: 'center' },
  { prop: 'price_multiple',minWidth, label: '价格系数', align: 'center' },
  { prop: 'volume_multiple',minWidth, label: '成交量系数', align: 'center' }
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
      res = res || []
      res.map(item=>{
        item.lever = item.lever ? item.lever.split(',') : []
      })
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
  }).then(() => {
    dialogType.info = row;
    dialogType.showGoogle = true;
  })
}
getDataList();
</script>