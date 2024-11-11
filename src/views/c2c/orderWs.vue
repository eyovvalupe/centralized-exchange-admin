<template>
 <div class="px-[30px] py-[10px]">
    <div class="flex justify-between reset-el-style-v2">
      <div class="flex items-center">
        <el-radio-group v-model="tabPosition" @change="tabChange">
          <el-radio-button label="c2cOrderWs">未处理订单</el-radio-button>
          <el-radio-button label="c2cOrder">历史订单</el-radio-button>
        </el-radio-group>
      </div>
      <div class="flex items-center">
        
        <div class="w-[264px] ml-[10px]">
          <el-input v-model="searchForm.params" ref="searchInput" suffix-icon="search" placeholder="UID/用户名/备注" />
        </div>
        <el-button type="primary" class="w-[120px] ml-[10px]" @click="getDataList(1)"
          :loading="isLoading">查询</el-button>
      </div>

    </div>
    <div class="py-[10px]  reset-el-style-v2"> 
      <OrderList v-loading="isLoading" :tableData="tableData" :showDialog="showDialog" @btnClick="onBtnClick" btn-text="业务操作" />
      <el-empty class="nodata" v-if="!isLoading && !tableData.length" description="暂无数据" />
      
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
import OrderList from './components/OrderList.vue'
import OrderInfo from './components/OrderInfo.vue'
const router = useRouter()
const appStore = useAppStore()
const socketStore = useSocketStore()

const tabPosition = ref('c2cOrderWs')
const tabChange = ()=>{
  router.replace({
    name:tabPosition.value
  })
}

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
  { prop: 'order_no', label: '订单号', align: 'center', width: 180 },
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
const closeDialogType = (obj) => {
  for (const key in dialogType) {
    dialogType[key] = false
  }
  
}

const onBtnClick = (item)=>{
  showDialog(item,'showOrderInfo')
}

const getDataList = ()=>{
  isLoading.value = true
  setTimeout(()=>{
    isLoading.value = false
  },300)
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
</script>