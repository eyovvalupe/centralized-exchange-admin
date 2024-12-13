<template>
<div class="px-[20px] py-[10px]">
    <div class="flex reset-el-style-v2 justify-between">
      <div class="flex items-center">
        <el-radio-group v-model="tabPosition" @change="tabChange">
          <el-radio-button label="ipoIndex">股票IPO管理</el-radio-button>
          <el-radio-button label="ipoCfg">IPO发行配置</el-radio-button>
        </el-radio-group>
         <el-button plain  type="primary" :disabled="!checkAuthCode(22101)" class="ml-[10px]" @click="showDialog(null, 'showDialog')" icon="plus">新增</el-button>
        <!-- <el-button type="info" plain :disabled="!checkAuthCode(22101)" class="ml-[10px]" @click="showDialog(null, 'showIpoDialog')">IPO参数</el-button> -->
      </div>

      <div class="flex justify-end">
        <div class="w-[168px]">
          <el-select v-model="searchForm.status" @change="changeSearch(searchForm.status)">
            <el-option v-for="(item) in optionStatus"
            :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </div>

        <div class="w-[264px] ml-[10px]">
          <el-input v-model="searchForm.params" suffix-icon="search"  placeholder="公司名称/交易代码" />
        </div>

        <el-button type="primary"  class="w-[120px] ml-[10px]" @click="getDataList(1)" :loading="isLoading">查询</el-button>
      </div>
      
    </div>
    <div class="reset-el-style-v2 pt-[10px]">
      <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :min-width="item.minWidth" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span v-if="item.prop === 'locked'" :style="{ color: !scope.row[item.prop] ? 'green' : '#ff0000' }">
              {{ scope.row[item.prop] ? '禁用' : '启用' }}
            </span>
            <span class="flex" v-else-if="item.prop === 'vip'">
              <span class="status-bg plain" :class="scope.row['lever'] > 1 ? 'status-yellow' : 'done'">
                {{ scope.row['lever'] > 1 ? scope.row['lever'] + 'X' : '无' }}
              </span>
            </span>
            <span v-else-if="item.prop == 'market'">
              {{ marketMap[scope.row.market] || '--' }}
            </span>
            <span class="flex items-center" v-else-if="item.prop == 'currency'">
              <img class="w-[20px] h-[20px] mr-[10px] rounded-full" :src="`/images/crypto/${scope.row.currency.toLocaleUpperCase()}.png`" :alt="scope.row.currency.toLocaleUpperCase()" />
              {{ scope.row.currency }}
            </span>
            <span class="cursor-pointer" @click="copy(scope.row[item.prop])" v-else-if="item.prop == 'keyword'">
              {{ scope.row[item.prop] }}
            </span>
            <span v-else-if="item.prop === 'issue_price_min'">
              {{ scope.row['issue_price_max'] }}
            </span>
            <span v-else-if="item.prop === 'status'" class="status-bg plain" :class="scope.row['status']">
              {{ statusObj[scope.row[item.prop]] }}
            </span>
          
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="gw(140)" align="center">
          <template #default="scope">
            <div class="flex justify-between items-center w-full relative">
             
              <div class="flex items-center justify-center flex-1 px-[21px]">
                <el-button link size="default" type="primary" class="underline" :disabled="!checkAuthCode(22101)"  @click="showDialog(scope.row, 'showDialog')">修改</el-button>
              </div>
              <el-dropdown  class="!absolute right-[5px] top-[1px] w-[16px] h-[16px]">
                <img class="w-[16px] h-[16px]" src="/src/assets/images/more.svg" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleDelete(scope.row)" :disabled="!checkAuthCode(22101)">
                      <el-icon :size="18" :color="checkAuthCode(22101) ? 'red':'#ccc'">
                        <Delete />
                      </el-icon> <span class="ml-1">删除</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
      
    </div>
    <div class="py-[10px]">
      <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
    </div>
  </div>
  
  <AddEditUser v-if="dialogType.showDialog" :data="dialogType.info" @close="closeDialogType" />
  <ipoEditModel v-if="dialogType.showIpoDialog" :data="dialogType.info" @close="closeDialogType" />

</template>

<script>
export default { name: 'ipoCfg' };
</script>
<script setup>
import { getList, apiDel } from '/@/api/modules/ipo/config.api'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { copy } from '/@/utils'
import { ElMessageBox, ElMessage, dayjs } from 'element-plus'
import AddEditUser from './components/AddEdit.vue'
import ipoEditModel from './components/ipoEdit.vue'
import { checkAuthCode } from '/@/hooks/store.hook.js'
import { useRouter } from 'vue-router'
import { hex_md5 } from '/@/utils/md5'
const router = useRouter()

const tabPosition = ref('ipoCfg')
const tabChange = ()=>{
  router.replace({
    name:tabPosition.value
  })
}

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
  params: sessionStorage['ipoCfgSearchParams'] || '',
  status: sessionStorage['ipoCfgSearchStatus'] || 'all'
})
const currentPage = ref(1)
const currentLastPage = ref(1)
const statusObj = ref({
  'none': '预售',
  'issuing': '可认购',
  'done': '认购结束',
  'listed': '已上市'
})
const marketMap = ref({
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

const gw = (w)=>{
  return Math.round(1400/1920 * w)
}

const columnBase = ref([
  { prop: 'company_name',minWidth:gw(300), label: '公司名称', align: 'center' },
  { prop: 'market', label: '市场',minWidth:gw(120), align: 'center'},
  { prop: 'symbol', label: '交易代码', align: 'center', minWidth:gw(120), },
  { prop: 'issue_start_date', label: '认购开始日期', align: 'center', minWidth:gw(150) },
  { prop: 'issue_end_date', label: '认购结束日期', align: 'center', minWidth:gw(150) },
  { prop: 'issue_price_min', label: '认购价格', align: 'center', minWidth:gw(120) },
  { prop: 'listing_date', label: '上市日期', align: 'center', minWidth:gw(150) },
  { prop: 'listed_price', label: '上市价格', align: 'center', minWidth:gw(150) },
  { prop: 'currency', label: '认购货币', align: 'center', minWidth:gw(150) },
  { prop: 'vip', label: 'VIP杠杆', align: 'center', minWidth:gw(120) },
  { prop: 'keyword', label: 'VIP密钥', align: 'center',minWidth:gw(120) },
  // { prop: 'lever', label: '认购杠杆', align: 'center', width:90 },
  { prop: 'status', label: '状态', align: 'center', minWidth:gw(120) },

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
  const send = { page: currentLastPage.value };
  if (searchForm.params) {
    send.params = searchForm.params;
  }
  if (searchForm.status !== 'all') {
    send.status = searchForm.status;
  }

  sessionStorage['ipoCfgSearchParams'] = searchForm.params
  sessionStorage['ipoCfgSearchStatus'] = searchForm.status

  const cacheKey = hex_md5(JSON.stringify(send))
  if(sessionStorage['ipoCfgSearch']){
    const searchCache = JSON.parse(sessionStorage['ipoCfgSearch'])
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
      sessionStorage['ipoCfgSearch'] = JSON.stringify({
        cacheKey,
        data:res
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
const changeSearch = (s) => {
  searchForm.status = s;
  getDataList();
}
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除(${row.company_name})吗？`, `确认删除`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
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