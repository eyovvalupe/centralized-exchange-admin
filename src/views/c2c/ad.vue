<template>
  <div class="px-[30px] py-[10px]">
    <div class="flex reset-el-style-v2 justify-between">
      <div>
        <el-button class="w-[120px]" plain icon="plus"  :type="checkAuthCode(12101)?'primary':'info'" :disabled="!checkAuthCode(12101)"  @click="showDialog(null, 'showDialog')">新增</el-button>
      </div>
      <div class="flex">

        <div class="w-[168px]">
          <el-select v-model="searchForm.offset">
            <el-option v-for="(item) in optionStatus"
            :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </div>
        <div class="w-[168px] ml-[10px]">
          <el-select v-if="!cryptoList.length"></el-select>
          <el-select v-model="searchForm.crypto" v-else>
            <el-option v-for="item in cryptoList" :label="item.name" :key="item.currency" :value="item.currency" >
              <div class="select-money">
                <img v-if="item.name != '全部加密货币'" :src="`/images/crypto/${ item.name.toUpperCase()}.png`" :alt="item.name.toUpperCase()">
                <span>{{ item.name }}</span>
              </div>
            </el-option>
          </el-select>
        </div>
        <div class="w-[168px] ml-[10px]">
          <el-select v-if="!currencyList.length"></el-select>
          <el-select v-model="searchForm.currency" v-else>
            <el-option v-for="item in currencyList" :label="item.name" :key="item.currency" :value="item.currency" >
              <div class="select-money">
                <img v-if="item.name != '全部计价法币'" :src="`/images/crypto/FIAT_${ item.name.toUpperCase()}.png`" :alt="item.name.toUpperCase()">
                <span>{{ item.name }}</span>
              </div>
            </el-option>
          </el-select>
        </div>
        <el-button type="primary" class="ml-[10px]" :icon="Search" @click="getDataList(1)"
          :loading="isLoading">搜索</el-button>
      </div>
    </div>
    <div class="reset-el-style-v2 pt-[10px]">
      <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :min-width="item.minWidth" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span v-if="item.prop === 'offset'" class="status-bg"
              :class="scope.row['offset'] == 'buy' ? 'long' : 'short'">
              {{ optionStatus.find(f => f.value == scope.row[item.prop]).label }}
            </span>
            <span class="flex items-center" v-else-if="item.prop == 'crypto' || item.prop == 'currency'">
              <img class="w-[16px] h-[16px] rounded mr-[10px]" :src="`/images/crypto/${ scope.row[item.prop].toUpperCase()}.png`" :alt="scope.row[item.prop]"> {{scope.row[item.prop]}}
            </span>
            <template v-else-if="item.prop === 'merchant'">
              <span class="truncate cursor-pointer" @click="copy(scope.row[item.prop])"> {{
                scope.row[item.prop] }}</span>
            </template>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="gw(140)" align="center">
          <template #default="scope">
            <div class="flex justify-between items-center w-full relative">
              <div class="flex items-center justify-center flex-1 px-[21px]">
                <el-button class="underline" size="default" link :type="checkAuthCode(12101)?'primary':'info'" :disabled="!checkAuthCode(12101)" @click="showDialog(scope.row, 'showDialog')">修改</el-button>
               </div>
              <el-dropdown class="!absolute right-[5px] top-[1px] w-[16px] h-[16px]">
                <img class="w-[16px] h-[16px]" src="/src/assets/images/more.svg" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleDelete(scope.row)" :disabled="!checkAuthCode(12101)" >
                      <el-icon :size="18" :color="checkAuthCode(12101)?'':'#ccc'">
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
  <AdEdit v-if="dialogType.showDialog" :data="dialogType.info" @close="closeDialogType" />
</template>

<script>
export default { name: 'c2cAd' };
</script>
<script setup>
import { getList, apiDel } from '/@/api/modules/c2cAd'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { copy } from '/@/utils'
import { ElMessageBox, ElMessage, dayjs } from 'element-plus'
import { getGlobalWalletList } from '/@/api/modules/base.api'
import AdEdit from './components/AdEdit.vue'
import { checkAuthCode } from '/@/hooks/store.hook.js'
import { hex_md5 } from '/@/utils/md5'

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:c2cAd', () => {
  getDataList()
})
const optionStatus = [
  {
    value: 'all',
    label: '全部',
  },
  {
    value: 'buy',
    label: '买入',
  },
  {
    value: 'sell',
    label: '卖出',
  }
]
const dialogType = reactive({
  showDialog: false,
  showCfgDialog: false,
  showDialog: false,
  showGoogle: false,
  info: null
})
const searchForm = reactive({
  currency: sessionStorage['c2cAdSearchCurrency'] || 'all',
  crypto: sessionStorage['c2cAdSearchCrypto'] || 'all',
  offset: sessionStorage['c2cAdSearchOffset'] || 'all'
})
const currentPage = ref(1)
const currentLastPage = ref(1)

const gw = (w)=>{
  return Math.round(1400/1920 * w)
}

const columnBase = ref([
  { prop: 'merchant', label: '商户名称', align: 'center',minWidth:gw(500) },
  { prop: 'offset', label: '方向', align: 'center',minWidth:gw(200) },
  { prop: 'crypto', label: '加密货币', align: 'center',minWidth:gw(200) },
  { prop: 'currency', label: '计价法币', align: 'center',minWidth:gw(200)},
  { prop: 'price', label: '价格', align: 'center',minWidth:gw(200)  },
  { prop: 'limit', label: '限额', align: 'center',minWidth:gw(446) },
])
const currencyList = ref([])
const cryptoList = ref([])
const isLoading = ref(false)
getGlobalWalletList({}).then((res) => {
  const currency_arr = [ { name: '全部计价法币', currency: 'all' }];
  const mer_arr = [ { name: '全部加密货币', currency: 'all' }];
  res.forEach(item => {
    if (item.type === 'crypto') {
      mer_arr.push(item)
    } else {
      currency_arr.push(item)
    }
  });
  currencyList.value = currency_arr
  cryptoList.value = mer_arr

})
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
  if (searchForm.offset !== 'all') {
    send.offset = searchForm.offset;
  }
  if (searchForm.crypto !== 'all') {
    send.crypto = searchForm.crypto;
  }
  if (searchForm.currency !== 'all') {
    send.currency = searchForm.currency;
  }

  const cacheKey = hex_md5(JSON.stringify(send))
  if(sessionStorage['c2cAdSearch']){
    const searchCache = JSON.parse(sessionStorage['c2cAdSearch'])
    if(searchCache.cacheKey == cacheKey){
      tableData.value = searchCache.data
    }else{
      isLoading.value = true
    }
  }else{
    isLoading.value = true
  }

  sessionStorage['c2cAdSearchParams'] = searchForm.params
  sessionStorage['c2cAdSearchOffset'] = searchForm.offset
  sessionStorage['c2cAdSearchCrypto'] = searchForm.crypto
  sessionStorage['c2cAdSearchCurrency'] = searchForm.currency
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
      sessionStorage['c2cAdSearch'] = JSON.stringify({
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

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除此c2c广告吗？`, `确定删除吗？`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    isLoading.value = true
    apiDel({ id: row.id }).then(() => {
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
const changeSearch = (s) => {
  searchForm.offset = s;
  getDataList();
}
getDataList();
</script>