<template>
  <div class="reset-el-styte pt-0 h-full">
    <div class="flex justify-between p-2">
      <div> <el-button type="primary" :icon="Refresh" @click="getDataList(1)"
        :loading="isLoading">同步数据</el-button></div>
      <div>
        <el-button :type="searchForm.market == item.value ? 'active-green' : 'default'" v-for="(item) in options" :key="item.value"
      @click="changeSearch(item.value)">{{ item.label }}</el-button>
        <el-input v-model="searchForm.symbol" class="mx-2" placeholder="交易代码搜索" style="width: 200px;"/>
        <el-button type="primary" :icon="Search" @click="getDataList(1)"
          :loading="isLoading">搜索</el-button>
      </div>
    </div>
    <div>
      <el-table :data="tableData" :border="tableData.length" :class="tableData.length?'':'noborder'" v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
          :align="item.align" @click="columnClick">
          <template #default="scope">
            <span v-if="item.prop=='market'">
              <span v-if="scope.row.name" class="mr-2"> {{ scope.row.name }}</span>
              <span> {{ scope.row.market }}</span>
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center" v-if="isDialog">
          <template #default="scope">
            <el-button link type="primary" @click="emit('edit',scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
      <Pagination @changePage="getDataList" />
    </div>
  </div>
</template>

<script setup>
import {
  getList
} from '/@/api/modules/stock/index.api'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'

import { ElDialog, ElMessage, dayjs } from 'element-plus'
const emit = defineEmits(['close', 'edit'])
const props = defineProps({
  isDialog: { // 行数据
    type: Boolean,
    default: false
  }
})
const isDialog=computed(()=>props.isDialog);
const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:Stock', () => {
  getDataList()
})


const searchForm = reactive({
  market: '',
  symbol: ''
})
const currentPage = ref(1)
const options = [
  {
    value: '',
    label: '全部',
  },
  {
    value: 'lock',
    label: '纳斯达克',
  },
  {
    value: 'success',
    label: '标普500',
  },
  {
    value: 'failure',
    label: '道琼斯',
  },
]
const columnBase = ref([
  { prop: 'name', label: '名称', align: 'center' },
  { prop: 'market', label: '市场', align: 'center' },
  { prop: 'symbol', label: '交易代码', align: 'center' },
])
const isLoading = ref(false)
// 获取玩家列表 page若传则为第一页
const getDataList = page => {
  if (page) {
    currentPage.value = page
  }
  isLoading.value = true
  const send = { page: currentPage.value };
  if (searchForm.symbol) {
    send.symbol = searchForm.symbol
  }
  if (searchForm.market) {
    send.market = searchForm.market
  }
  getList(send)
    .then(res => {
      isLoading.value = false
      tableData.value = res || []
    })
    .finally(() => {
      isLoading.value = false
    })
}
const columnClick = (row) => {
  console.log(row)
}
const changeSearch = (s) => {
  searchForm.market = s;
  getDataList();
}
getDataList();
</script>