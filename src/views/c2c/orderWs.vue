<template>
  <div class="reset-el-styte">
    <div class="flex justify-end p-2">
      <div>
        <el-button type="success">未处理</el-button>
        <el-button  @click="handleSelect('c2cOrder')">已完成</el-button>
        <el-input v-model="searchForm.params" class="mx-2" placeholder="UID/用户名 " style="width: 250px;" />
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
            <template v-else-if="item.prop === 'offset'">
              <span class="status-bg" :class="scope.row[item.prop]">
                {{ offsetObj[scope.row[item.prop]] }}
              </span>
            </template>
            <span v-else-if="item.prop === 'username'">
              <span class=" cursor-pointer text-[#165DFF]" @click="showDialog(scope.row, 'showInfoDialog')">{{
                scope.row[item.prop] }}
              </span>
            </span>
            <span v-else-if="item.prop === 'status'" class="status-bg"
              :class="scope.row['status'] == 'done' ? 'buy' : scope.row['status']">
              {{ statusObj[scope.row[item.prop]] }}
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template #default="scope">
            <span class="flex justify-center align-middle">
              <!-- :disabled="scope.row['status']=='done'" -->
              <el-button link :type="scope.row['status'] !== 'done' && checkAuthCode(12101) ? 'primary' : ''"
                :disabled="!checkAuthCode(12101)" @click="showDialog(scope.row, 'showOrderInfo')">业务操作</el-button>
            </span>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
    </div>
  </div>
  <userDetail v-if="dialogType.showInfoDialog && dialogType.info" :partyid="dialogType.info.partyid"
    @close="closeDialogType" />
  <OrderInfo v-if="dialogType.showOrderInfo" :data="dialogType.info" @close="closeDialogType" />
</template>

<script>
export default { name: 'c2cOrderWs' };
</script>
<script setup>
import { getList } from '/@/api/modules/c2cOrder'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { copy } from '/@/utils'
import { ElMessageBox, ElMessage, dayjs } from 'element-plus'
import { useSocketStore } from '/@/store'
import userDetail from '/@/components/userDetail/index.vue'
import { checkAuthCode } from '/@/hooks/store.hook.js'
import { useAppStore } from '/@/store'
import { useRouter } from 'vue-router'
import OrderInfo from './components/OrderInfo.vue'
const router = useRouter()
const appStore = useAppStore()
const socketStore = useSocketStore()


const offsetObj = {
  buy: '买入',
  sell: '卖出'
}
const statusObj = {
  'waitpayment': '等待付款',
  'waitconfirm': '等待确认',
  'done': '已完成',
  'cancel': '已取消'
}
const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:c2corderWs', () => {
  getDataList()
})
const dialogType = reactive({
  showOrderInfo: false,
  showInfoDialog: false,
  info: null
})
const searchForm = reactive({
  params: ''
})
const columnBase = ref([
  { prop: 'uid', label: 'UID', align: 'center' },
  { prop: 'username', label: '用户名', align: 'center', width: 130 },
  { prop: 'offset', label: '方向', align: 'center' },
  { prop: 'crypto', label: '加密货币', align: 'center' },
  { prop: 'currency', label: '计价法币', align: 'center' },
  { prop: 'price', label: '价格', align: 'center' },
  { prop: 'volume', label: '数量', align: 'center' },
  { prop: 'totalprice', label: '总价', align: 'center' },
  { prop: 'status', label: '状态', align: 'center' },
  { prop: 'date', label: '时间', align: 'center' },
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
const closeDialogType = (item) => {
  for (const key in dialogType) {
    dialogType[key] = false
  }
}
let filterData = []
watch(() => socketStore.sokcetWS, (ws) => {
  if (ws) {
    socketStore.send('c2corder', 'sub')
  }
}, { immediate: true })

watch(() => socketStore.c2cOrderList, (c2cOrderList) => {
  if (c2cOrderList) {
    filterData = c2cOrderList;
    if (searchForm.params) {
      filterData = c2cOrderList.filter(f => {
        return f.username.indexOf(searchForm.params) !== -1 || f.uid.indexOf(searchForm.params) !== -1
      })
    }
    tableData.value = filterData;
  }
}, { immediate: true })
const handleSelect = (key) => {
  if (!appStore.tabs.includes(key)) {
    appStore.tabs.push(key)
  }
  appStore.curTab = key
  router.push({ name: key })
  setTimeout(() => {
    useAppStore().SET_REFRESHTAB('') // 关闭刷新
  }, 2000);
}
</script>