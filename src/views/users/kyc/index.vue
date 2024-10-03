<template>
  <div class="reset-el-styte">
    <div class="flex justify-end p-2 reset-el-styte">
      <div></div>
      <div class="flex">
        <div class="mr-5">
          <el-button :type="searchForm.status == item.value ? 'success' : 'default'" v-for="(item) in options"
            :key="item.value" @click="changeSearch(item.value)">{{ item.label }}</el-button>
        </div>
        <el-input v-model="searchForm.params" clearable placeholder="UID/用户名/备注" style="width: 200px;" />
        <!-- <el-select v-model="searchForm.status" placeholder="" class="ml-2" style="width: 130px;">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select> -->
        <el-button type="primary" class="ml-2" :icon="Search" @click="getDataList(1)"
          :loading="isLoading">搜索</el-button>
      </div>
    </div>
    <div>
      <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span class="status-bg" v-if="item.prop == 'status'"
              :class="scope.row[item.prop]" align="center">
              {{ transdata(scope.row[item.prop]) }}
            </span>
            <template v-else-if="item.prop === 'username'">
              <span class="truncate cursor-pointer text-[#165DFF]" @click="showDialog(scope.row, 'showUserDialog')"> {{ scope.row[item.prop] }}</span>
            </template>
            <template v-else-if="item.prop === 'uid'">
              <span class="truncate cursor-pointer" @click="copy(scope.row[item.prop])"> {{
                scope.row[item.prop] }}</span>
            </template>
            <span v-else-if="item.prop == 'l2'">
              <el-button link type="primary"
                @click="showDialog({ ...scope.row, tab: 'img' }, 'showDialog')">查看照片</el-button>
            </span>
            <span v-else-if="item.prop == 'created'">
              {{ dayjs(scope.row[item.prop]).format('MM-DD hh:mm:ss') }}
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="showDialog({ ...scope.row, tab: 'info' }, 'showDialog')">实名信息</el-button>
            <el-button link :type="scope.row['status'] === 'success' ? 'info' : 'primary'"
              :disabled="scope.row['status'] === 'success'"
              @click="showDialog(scope.row, 'showEditDialog')">审核</el-button>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
      <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
    </div>
  </div>
  <userDetail v-if="dialogType.showUserDialog" :partyid="dialogType.info.partyid" @close="closeDialogType"/>
  <Info v-if="dialogType.showDialog" :info="dialogType.info" @close="closeDialogType" />
  <Edit v-if="dialogType.showEditDialog" :info="dialogType.info" @close="closeDialogType" />
</template>
<script setup>
import { getList } from '/@/api/modules/business/kyc.api'
import { ref, reactive } from 'vue'
import { copy } from '/@/utils'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, dayjs } from 'element-plus'
import Edit from './Edit.vue'
import Info from './Info.vue'
import userDetail from '/@/components/userDetail/index.vue'

const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:kycList', () => {
  getDataList()
})
const dialogType = reactive({
  showEditDialog: false,
  showUserDialog: false,
  showDialog: false,
  info: null
})

const options = [
  {
    value: 'all',
    label: '全部',
  },
  {
    value: 'review',
    label: '审核中',
  },
  {
    value: 'success',
    label: '通过',
  },
  {
    value: 'failure',
    label: '拒绝',
  },
]

const searchForm = reactive({
  params: '',
  status: 'all',
})

const tableData = ref([])
const columnBase = ref([
  { prop: 'uid', label: 'UID', align: 'center', width: 120 },
  { prop: 'username', width: 130,label: '用户名', align: 'center' },
  { prop: 'father_username', label: '代理', align: 'center' },
  { prop: 'name', label: '姓名', align: 'center' },
  { prop: 'idtype', label: '证件类型', align: 'center', width: 100 },
  { prop: 'idnum', label: '证件号码', align: 'center' },
  { prop: 'birthday', label: '生日', align: 'center' },
  { prop: 'l2', label: '认证照片', align: 'center', width: 100 },
  { prop: 'status', label: '状态', align: 'center', width: 90 },
  { prop: 'created', label: '时间', align: 'center' }
])
const currentLastPage = ref(1)
const currentPage = ref(1)
const transdata=(d)=>{
  const obj= options.find(f => f.value ==d) || {label:'--'}
  return obj.label
}
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
getDataList();
const changeSearch = (s) => {
  searchForm.status = s;
  getDataList();
}
</script>
<style scoped>
.right-table {
  width: calc(100% - 230px);
}
</style>