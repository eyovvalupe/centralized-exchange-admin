<template>
  <div class="reset-el-styte">
    <div class="flex justify-between p-2">
      <div>
        <el-button  :type="checkAuthCode(12101)?'primary':'info'" :disabled="!checkAuthCode(12101)"  :icon="Plus" @click="showDialog(null, 'showDialog')">新增</el-button>
      </div>
      <div class="flex">
        <el-button :type="searchForm.offset == item.value ? 'success' : 'default'" v-for="(item) in optionStatus"
          :key="item.value" @click="changeSearch(item.value)">{{ item.label }}</el-button>
        <el-select v-model="searchForm.crypto" style="width: 150px;" class="mx-2">
          <el-option v-for="item in cryptoList" :label="item.name" :key="item.currency" :value="item.currency" />
        </el-select>
        <el-select v-model="searchForm.currency" style="width: 150px;">
          <el-option v-for="item in currencyList" :label="item.name" :key="item.currency" :value="item.currency" />
        </el-select>
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
            <span v-if="item.prop === 'offset'" class="status-bg"
              :class="scope.row['offset'] == 'buy' ? 'long' : 'short'">
              {{ optionStatus.find(f => f.value == scope.row[item.prop]).label }}
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
        <el-table-column label="操作" width="100" align="center">
          <template #default="scope">
            <span class="flex justify-center align-middle">
              <el-button link :type="checkAuthCode(12101)?'primary':'info'" :disabled="!checkAuthCode(12101)" @click="showDialog(scope.row, 'showDialog')">修改</el-button>
              <el-dropdown>
                <img style="width: 20px; height: 20px;margin-top: 5px;" src="/src/assets/images/more.svg" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleDelete(scope.row)" :disabled="!checkAuthCode(12101)" >
                      <el-icon :size="20" :color="checkAuthCode(12101)?'red':'#ccc'">
                        <DeleteFilled />
                      </el-icon> <span class="ml-1">删除</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
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
  <AdEdit v-if="dialogType.showDialog" :data="dialogType.info" @close="closeDialogType" />
</template>

<script setup>
import { getList, apiDel } from '/@/api/modules/c2cAd'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { copy } from '/@/utils'
import { ElMessageBox, ElMessage, dayjs } from 'element-plus'
import { getGlobalWalletList } from '/@/api/modules/base.api'
import AdEdit from './components/AdEdit.vue'
import { checkAuthCode } from '/@/hooks/store.hook.js'

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
  currency: 'all',
  crypto: 'all',
  offset: 'all'
})
const currentPage = ref(1)
const currentLastPage = ref(1)
const columnBase = ref([
  { prop: 'merchant', label: '商户名称', align: 'center',width:250 },
  { prop: 'offset', label: '方向', align: 'center' },
  { prop: 'crypto', label: '加密货币', align: 'center' },
  { prop: 'currency', label: '计价法币', align: 'center'},
  { prop: 'price', label: '价格', align: 'center'  },
  { prop: 'limit', label: '限额', align: 'center',width:200 },
])
const currencyList = ref([])
const cryptoList = ref([])
const isLoading = ref(false)
getGlobalWalletList({}).then((res) => {
  const currency_arr = [ { name: '全部计价货币', currency: 'all' }];
  const mer_arr = [ { name: '全部加密货币', currency: 'all' }];
  res.forEach(item => {
    if (item.type === 'drypto') {
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

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除此c2c广告吗？`, `确定删除吗？`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
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