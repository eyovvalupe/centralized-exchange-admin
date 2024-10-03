<template>
  <div class="reset-el-styte">
    <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span class="status-bg" v-if="item.prop == 'status'"
              :class="scope.row[item.prop] === 'success' ? 'close' : scope.row[item.prop]" align="center">
              {{ options.find(f => f.value == scope.row[item.prop]).label }}
            </span>
            <template v-else-if="item.prop === 'username'">
              <span class="truncate cursor-pointer text-[#165DFF]" @click="emit('showUserDialog',scope.row)"> {{ scope.row[item.prop] }}</span>
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
        <el-table-column label="操作" width="80" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="showDialog({ ...scope.row, tab: 'info' }, 'showDialog')">实名信息</el-button>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
  </div>
  <Info v-if="dialogType.showDialog" :info="dialogType.info" @close="closeDialogType" />
</template>
<script setup>
import { getList } from '/@/api/modules/business/kyc.api'
import { ref, reactive } from 'vue'
import { copy } from '/@/utils'
import { ElMessage, dayjs } from 'element-plus'
import Info from '/@/views/users/kyc/Info.vue'
const dialogType = reactive({
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

</script>