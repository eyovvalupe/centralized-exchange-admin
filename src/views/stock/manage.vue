<template>
   <div class="px-[20px] py-[10px]">
    <div class="flex reset-el-style-v2 justify-between">

      <div class="flex items-center">
        <el-radio-group v-model="tabPosition" @change="tabChange">
          <el-radio-button label="stockManage">股票管理</el-radio-button>
          <el-radio-button label="stockTimeConfig">市场休市配置</el-radio-button>
        </el-radio-group>
        <el-button type="primary" class="ml-[10px]" plain @click="showDialog(null, 'showCfgDialog')">股票交易参数配置</el-button>
      </div>

      <div class="flex">
        <div class="w-[168px] mr-[10px]">
          <el-select v-model="searchForm.country" @change="getDataList(1)">
            <el-option value="all" label="所有国家"></el-option>
            <el-option v-for="(country) in countryList"
            :key="country" :value="country" :label="countryTitleMap[country]"></el-option>
          </el-select>
        </div>
        <div class="w-[264px]">
          <el-input v-model="searchForm.symbol" suffix-icon="search" placeholder="公司名称/股票代码"  />
        </div>
        <el-button type="primary" class="w-[120px] ml-[10px]" @click="isLoading=true;getDataList(1)"
          :loading="isLoading">查询</el-button>
      </div>
    </div>
    <div class="py-[10px]">
      <el-table :data="tableData" border class="mb-[10px]" :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :min-width="item.minWidth" :key="index" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span v-if="item.prop === 'country'">
              {{ countryTitleMap[scope.row.country] }}
            </span>
            <span v-else-if="item.prop === 'enabled'" class="status" :class="scope.row[item.prop]==1?'success':'fail'">
              {{ scope.row[item.prop]==1 ? '启用' : '禁用' }}
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="gw(140)" align="center">
          <template #default="scope">
            <span class="flex justify-center align-middle">
              <el-button link class="underline"  size="default" type="primary" @click="showDialog(scope.row, 'showEditDialog')">修改</el-button>
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
  <ConfigTime :market="market" :title="countryTitleMap[market]" v-if="dialogType.showTimeDialog" :data="dialogType.info" @close="closeDialogType" />
</template>

<script>
export default { name: 'stockManage' };
</script>
<script setup>
import {  getList } from '/@/api/modules/stock/index.api'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { ElMessage, dayjs } from 'element-plus'
import Config from './components/Config.vue'
import ConfigTime from './components/ConfigTime.vue'
import Edit from './components/Edit.vue'
import { useRouter } from 'vue-router'
 import { hex_md5 } from '/@/utils/md5'
const router = useRouter()

const tabPosition = ref('stockManage')
const tabChange = ()=>{
  router.replace({
    name:tabPosition.value
  })
}

const market = ref("us")

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:stockManage', () => {
  getDataList()
})
const dialogType = reactive({
  showEditDialog: false,
  showCfgDialog: false,
  showTimeDialog: false,
  info: null
})
const searchForm = reactive({
  country:sessionStorage['stockManageCountry'] || 'all',
  params: sessionStorage['stockManageParams'] || '',
  symbol: sessionStorage['stockManageSymbol'] || ''
})
const countryTitleMap = ref({
  us:"美国",
  japan:"日本",
  india:"印度",
  korea:"韩国",
  germany:"德国",
  uk:"英国",
  singapore:"新加坡",
  hongkong:"香港",
  malaysia:'马来西亚'
})

const countryList = computed(()=>{
  return Object.keys(countryTitleMap.value)
})
const currentPage = ref(1)
const currentLastPage = ref(1)

const gw = (w)=>{
  return Math.round(1400/1920 * w)
}
const columnBase = ref([
  { prop: 'country', label: '国家', align: 'center',minWidth:gw(200) },
  { prop: 'market', label: '市场', align: 'center',minWidth:gw(200) },
  { prop: 'name', label: '公司名称', align: 'center',minWidth:gw(400) },
  { prop: 'symbol', label: '股票代码', align: 'center',minWidth:gw(400) },
  { prop: 'enabled', label: '状态', align: 'center',minWidth:gw(200) }
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

const openTimeDialog = (_market)=>{
  market.value = _market
  showDialog(null,'showTimeDialog')
}
const getDataList = (page) => {
  if (page) {
    currentLastPage.value = page
  }
  const send = { page: currentLastPage.value };
  if (searchForm.params) {
    send.params = searchForm.params;
  }
  if (searchForm.symbol) {
    send.symbol = searchForm.symbol;
  }
  if(searchForm.country != 'all'){
    send.country = searchForm.country
  }

  sessionStorage['stockManageParams'] = searchForm.params || ''
  sessionStorage['stockManageSymbol'] = searchForm.symbol || ''
  sessionStorage['stockManageCountry'] = searchForm.country

  const cacheKey = hex_md5(JSON.stringify(send))
  if(sessionStorage['stockManage']){
      const searchCache = JSON.parse(sessionStorage['stockManage'])
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
      tableData.value = res || []
      sessionStorage['stockManage'] = JSON.stringify({
          cacheKey,
          data:tableData.value
      })
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
</script>