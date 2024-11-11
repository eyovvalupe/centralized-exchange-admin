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
    <div class="py-[10px] reset-el-style-v2" v-loading="isLoading" style="min-height:300px;" > 
      <OrderList :tableData="tableData" :showDialog="showDialog" @btnClick="onBtnClick" />
      <el-empty class="nodata" v-if="!isLoading && !tableData.length" description="暂无数据" />
      
     
    </div>
    <div class="pb-[10px]">
       <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
    </div>
  </div>
  <userDetail v-if="dialogType.showInfoDialog && dialogType.info" :partyid="dialogType.info.partyid"
    @close="closeDialogType" />
  <OrderInfo v-if="dialogType.showOrderInfo" :data="dialogType.info" @close="closeDialogType" />
</template>

<script>
export default { name: 'c2cOrder' };
</script>
<script setup>
import { getList } from '/@/api/modules/c2cOrder'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { copy } from '/@/utils'
import { ElMessageBox, ElMessage, dayjs } from 'element-plus'
import userDetail from '/@/components/userDetail/index.vue'
import OrderList from './components/OrderList.vue'
import { checkAuthCode } from '/@/hooks/store.hook.js'
import { useAppStore } from '/@/store'
import { useRouter } from 'vue-router'
import OrderInfo from './components/OrderInfo.vue'
import { hex_md5 } from '/@/utils/md5'
const router = useRouter()

const tabPosition = ref('c2cOrder')
const tabChange = ()=>{
  router.replace({
    name:tabPosition.value
  })
}

const appStore = useAppStore()
const offsetObj = {
  buy: '买入',
  sell: '卖出'
}

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:c2corder', () => {
  getDataList()
})
const dialogType = reactive({
  showOrderInfo: false,
  showInfoDialog: false,
  info: null
})
const searchForm = reactive({
  params: sessionStorage['c2cOrderSearchParams'] || ''
})
const currentPage = ref(1)
const currentLastPage = ref(1)

const isLoading = ref(false)
const showDialog = (data, type) => {
  if (data) {
    dialogType.info = Object.assign({ id: 1 }, data);
  } else {
    dialogType.info = null
  }
  dialogType[type] = true;
}

const onBtnClick = (item)=>{
  showDialog(item,'showOrderInfo')
}
const closeDialogType = (item) => {
  for (const key in dialogType) {
    dialogType[key] = false
  }
  if (item && item.reload) {
    getDataList();
  }
}
const getDataList = (page) => {
  if (page) {
    currentLastPage.value = page
  }
  const send = { page: currentLastPage.value };
  if (searchForm.params) {
    send.params = searchForm.params;
  }
  sessionStorage['c2cOrderSearchParams'] = searchForm.params
  const cacheKey = hex_md5(JSON.stringify(send))
  if(sessionStorage['c2cOrderSearch']){
    const searchCache = JSON.parse(sessionStorage['c2cOrderSearch'])
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
      tableData.value = res;
      sessionStorage['c2cOrderSearch'] = JSON.stringify({
        cacheKey,
        data:res
      })
    })
    .finally(() => {
      isLoading.value = false
    })
}
getDataList()
</script>
