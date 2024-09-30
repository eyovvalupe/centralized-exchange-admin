<template>
  <div class="reset-el-styte">
    <div class="flex justify-between p-2 reset-el-styte">
      <div>
        <el-button type="primary" :icon="Plus" @click="showDialog(null, 'showDialog')">增加地址</el-button>
        <el-button type="primary" plain @click="showDialog(null, 'showConfigDialog')">币种配置</el-button>
      </div>
      <div class="flex">
      
      </div>
    </div>
    <div>
      <el-table :data="tableData" :border="tableData.length" :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span v-if="item.prop == 'created'">
              {{ dayjs(scope.row[item.prop]).format('MM-DD hh:mm:ss') }}
            </span>
            <template v-else-if="item.prop === 'uid'">
              <span class="truncate cursor-pointer" @click="copy(scope.row[item.prop])"> {{
                scope.row[item.prop] }}</span>
            </template>
            <template v-else-if="item.prop === 'order_no'">
              <el-tooltip :content="scope.row[item.prop]" effect="dark" placement="bottom-start">
                <span v-if="scope.row[item.prop]"> ...{{
                  scope.row[item.prop].substring(scope.row[item.prop].length - 7) }}</span>
              </el-tooltip>
            </template>
            <span v-else-if="item.prop == 'currency'" align="center">
              {{ scope.row[item.prop] == 'main' ? '交易账户' : scope.row[item.prop] }}
            </span>
            <span v-else-if="item.prop == 'status'" class="status-bg"
              :class="scope.row[item.prop] == 'success' ? 'close' : 'status-yellow'">
              {{ options.find(f => f.value == scope.row[item.prop]).label }}
            </span>
            <template v-else-if="item.prop === 'address'">
              <span v-html="transName(scope.row[item.prop])"></span>
            </template>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template #default="scope">
            <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
      <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
    </div>
  </div>
  <Config v-if="dialogType.showConfigDialog" :data="dialogType.info" @close="closeDialogType" />
  <Edit v-if="dialogType.showDialog" :data="dialogType.info" @close="closeDialogType" />
   <el-dialog :close-on-click-modal="false" title="操作者验证" v-model="showGoogle" width="320">
    <GoogleVerify class="agentGoogle" @confirm="handleSubmit" @close="emit('close', false)" v-if="showGoogle" />
  </el-dialog>
</template>

<script setup>
// import { getList } from '/@/api/modules/business/kyc.api'
import { getList, apiDel } from '/@/api/modules/crypto'
import { copy } from '/@/utils'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, dayjs } from 'element-plus'

import Config from './Config.vue'
import Edit from './Edit.vue'

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:cryptoList', () => {
  getDataList()
})
const dialogType = reactive({
  showConfigDialog: false,
  showDialog: false,
  info: null
})
const showGoogle = ref(false);
const currentLastPage = ref(1)
const currentPage = ref(1)
const status = ref('')
const columnBase = reactive([
  { prop: 'currency', label: '货币', align: 'center', },
  { prop: 'network', label: '网络', align: 'center' },
  { prop: 'address', label: '地址', align: 'center' },
  // { prop: 'status', label: '状态', width: 90, align: 'center' },
])
const options = [
  {
    value: '',
    label: '全部'
  },
  {
    value: 'unknown',
    label: '审核中'
  },
  {
    value: 'success',
    label: '已处理'
  },
]
const transName=(adr)=>{
  return `<span class="status blue">${adr.substring(0,4)}</span><span>${adr.substring(4,adr.length-4)}</span><span class="status blue">${adr.substring(adr.length-4)}</span>`;
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
  if (status.value) {
    send.status = status.value;
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
let curid;
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除吗？`, `确认删除`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    curid = row.id;
    showGoogle.value = true;
  })
}

const handleSubmit = async (googlecode) => {
  showGoogle.value = false;
  isLoading.value = true
  apiDel({ id: curid, googlecode }).then(() => {
    getDataList()
    ElMessage({
      type: 'tips',
      message: '删除成功',
      offset: 200
    })
  }).finally(() => {
    isLoading.value = false
  })
}
const changeSearch = (s) => {
  status.value = s;
  getDataList();
}
getDataList();
</script>