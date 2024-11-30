<template>
<div class="px-[20px] py-[10px]">
    <div class="flex reset-el-style-v2 justify-between">
      <div class="flex items-center">
        <el-radio-group v-model="tabPosition" @change="tabChange">
          <el-radio-button label="aiPos">交易机器人持仓单</el-radio-button>
          <el-radio-button label="aiSearch">交易机器人订单查询</el-radio-button>
          <el-radio-button label="aiIndex">交易机器人场控</el-radio-button>
        </el-radio-group>
        <el-button class="ml-[10px]" plain icon="plus" type="primary" @click="showDialog(null, 'showCtrDialog')">添加场控</el-button>
      </div>
      <div class="flex items-center">
        <div class="w-[168px]">
          <el-select v-model="searchForm.role" @change="changeSearch(searchForm.role)">
            <el-option v-for="(item) in option"
            :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </div>
         <!-- <div class="w-[400px] ml-2">
            <el-date-picker style="width:100%;" v-model="timeRanges" type="daterange" range-separator="~" start-placeholder="请选择开始时间" end-placeholder="请选择结束时间"/>
          </div> -->

        <div class="w-[264px] ml-[10px]">
          <el-input v-model="searchForm.params" ref="searchInput" suffix-icon="search" placeholder="UID/用户名" />
        </div>
        <el-button type="primary" class="w-[120px] ml-[10px]" @click="isLoading=true;getDataList(1)"
          :loading="isLoading">查询</el-button>
      </div>
      
    </div>
    <div class="reset-el-style-v2 pt-[10px]">
      <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :min-width="item.minWidth" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <template v-if="item.prop === 'uid'">
              <span class="truncate cursor-pointer" @click="copy(scope.row[item.prop])"> {{
                scope.row[item.prop] }}</span>
            </template>
            <span v-else-if="item.prop === 'username'" class="underline cursor-pointer text-[#4377FE]"
              @click="showDialog(scope.row, 'showInfoDialog')">
              {{ scope.row[item.prop] }}
            </span>
            <span v-else-if="item.prop === 'offset'" :class="scope.row[item.prop]" class="status-bg">
              {{ optionOffset[scope.row[item.prop]] }}
            </span>
            
            <span v-else-if="item.prop === 'role'">
              {{ option.find(f => f.value == scope.row[item.prop]).label }}
            </span>
            <span v-else-if="item.prop === 'time'">
              {{ scope.row[item.prop] }}{{ optionsTime.find(f => f.value == scope.row['unit']).label }}
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="70" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="showDialog(scope.row)">查看订单</el-button>
          </template>
        </el-table-column> -->
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
      
    </div>
    <div class="py-[10px]">
      <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
    </div>
  </div>
  
  <EditPrice v-if="dialogType.showCtrDialog" :data="dialogType.info"  @close="closeDialogType" />
  <userDetail v-if="dialogType.showInfoDialog && dialogType.info" :partyid="dialogType.info.partyid"
    @close="closeDialogType" />
    
  <!-- <detailDialog v-if="dialogType.showDialog" :contract="true" :orderNo="orderNo" @close="closeDialogType" /> -->
</template>

<script>
export default { name: 'aiSearch' };
</script>
<script setup>
import EditPrice from './components/EditPrice.vue'
import { apiQueryList } from '/@/api/modules/ai'
import { copy } from '/@/utils'
// import detailDialog from '/@/components/detailDialog/index.vue'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { ElDialog, ElMessage, dayjs } from 'element-plus'
import userDetail from '/@/components/userDetail/index.vue'
import { useRouter } from 'vue-router'
import { hex_md5 } from '/@/utils/md5'

const router = useRouter()

const tabPosition = ref('aiSearch')
const tabChange = ()=>{
  router.replace({
    name:tabPosition.value
  })
}

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:contractSearch', () => {
  getDataList()
})
const timeRanges = ref([])
if(sessionStorage['aiSearchTimerange'] && sessionStorage['aiSearchTimerange'] != '[]'){
  //timeRanges.value = JSON.parse(sessionStorage['aiSearchTimerange'])
}
const optionOffset = {
  long: '买涨',
  short: '买跌'
};
const optionStatus = [
  {
    value: 'all',
    label: '全部',
  },
  {
    value: 'none',
    label: '开仓',
  },
  {
    value: 'lock',
    label: '锁定',
  },
  {
    value: 'open',
    label: '持仓',
  },
  {
    value: 'close',
    label: '平仓',
  },
  {
    value: 'fail',
    label: '失败',
  },
  {
    value: 'cancel',
    label: '已取消',
  },
  {
    value: 'done',
    label: '完成',
  }
]
const option = [
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
const dialogType = reactive({
  info: null,
  showDialog: false,
  showInfoDialog: false,
  showLockDialog: false,
  showCtrDialog: false,
  title: ''
})
const optionsTime = [
  { value : 's', label : '秒' },
  { value : 'm', label : '分钟' },
  { value : 'h', label : '小时' },
  { value : 'd', label : '天' }
]

const searchForm = reactive({
  params: sessionStorage['aiSearchParams'] || '',
  role: sessionStorage['aiSearchRole'] || 'all',
  status: sessionStorage['aiSearchStatus'] || 'all'
})

const currentLastPage = ref(1)
const currentPage = ref(1)

const gw = (w)=>{
  return Math.round(1400/1920 * w)
}

const columnBase = ref([
  { prop: 'uid', label: 'UID', minWidth: gw(205), align: 'center' },
  { prop: 'username', label: '用户名', minWidth: gw(205), align: 'center' },
  { prop: 'role', label: '角色', minWidth: gw(205), align: 'center' },
  // { prop: 'father_username',minWidth: gw(205), label: '代理', width: 110, align: 'center' },
  { prop: 'name', label: '名称', align: 'center',minWidth: gw(205) },
  { prop: 'offset', label: '开仓',  align: 'center',minWidth: gw(205) },
  { prop: 'lever', label: '网格', minWidth: gw(205), align: 'center' },
  { prop: 'time', label: '时间区间', minWidth: gw(205), align: 'center' },
  { prop: 'amount', label: '投资金额',minWidth: gw(205), align: 'center' },
  { prop: 'profit', label: '盈亏金额',minWidth: gw(205), align: 'center' },
])
const isLoading = ref(false)
const orderNo = ref('')
const showDialog = (data, key) => {
  if (data) {
    const { order_no } = data;
    orderNo.value = order_no;
    dialogType.info = Object.assign({}, data);
  }
  dialogType[key] = true;
}
const closeDialogType = (item) => {
  for (const key in dialogType) {
    dialogType[key] = false
  }
  if (item && item.reload) {
  }
}

// 获取玩家列表 page若传则为第一页
const getDataList = page => {
  if (page) {
    currentLastPage.value = page
  }
  const send = { page: currentLastPage.value };
  if (searchForm.params) {
    send.params = searchForm.params
  }
  if (searchForm.role !== 'all') {
    send.role = searchForm.role
  }
  if (searchForm.params && searchForm.params !== 'all') {
    send.params = searchForm.params
  }
  if (timeRanges.value && timeRanges.value.length) {
    send.start_time = dayjs(timeRanges.value[0]).format('YYYY-MM-DD')
    send.end_time = dayjs(timeRanges.value[1]).format('YYYY-MM-DD')
  }

  const cacheKey = hex_md5(JSON.stringify(send))
  if(sessionStorage['aiSearch']){
    const searchCache = JSON.parse(sessionStorage['aiSearch'])
    if(searchCache.cacheKey == cacheKey){
      tableData.value = searchCache.data
    }else{
      isLoading.value = true
    }
  }else{
    isLoading.value = true
  }

  sessionStorage['aiSearchTimerange'] = JSON.stringify(timeRanges.value)
  sessionStorage['aiSearchParams']    = searchForm.params
  sessionStorage['aiSearchRole']      = searchForm.role
  sessionStorage['aiSearchStatus']    = searchForm.status

  apiQueryList(send)
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
      sessionStorage['aiSearch'] = JSON.stringify({
        cacheKey,
        data:res
      })
    })
    .finally(() => {
      isLoading.value = false
    })
}
const changeSearch = (s) => {
  searchForm.role = s;
  getDataList();
}
getDataList();
</script>