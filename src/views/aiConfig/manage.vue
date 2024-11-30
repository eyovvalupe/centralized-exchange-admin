<template>
  <div class="px-[20px] py-[10px]">
    <div class="flex justify-between reset-el-style-v2">
      <div>
        <el-button type="primary" class="w-[120px]" icon="plus" plain @click="showDialog(null, 'showDialog')">新增</el-button>
        <el-button plain type="primary" class="w-[140px]" @click="showDialog(null, 'showTimeCtrDialog')">时间区间配置</el-button>
      </div>
      <div class="flex">
        <!-- <div class="mr-10">
          <el-button :type="searchForm.status == item.value ? 'success' : 'default'" v-for="(item) in optionStatus"
            :key="item.value" @click="changeSearch(item.value)">{{ item.label }}</el-button>
        </div> -->

        <el-input v-model="searchForm.params"  suffix-icon="search"  placeholder="名称/代码" style="width: 264px;" />
        <el-button type="primary" class="ml-[10px] w-[120px]" @click="isLoading=true;getDataList(1)"
          :loading="isLoading">查询</el-button>

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
            <span v-else-if="item.prop === 'vip'">
              <span class="status-bg" :class="scope.row['lever'] > 1 ? 'status-yellow' : ''">
                {{ scope.row['lever'] > 1 ? scope.row['lever'] + 'X' : '无' }}
              </span>
            </span>
            <span v-else-if="item.prop === 'issue_price_min'">
              {{ scope.row['issue_price_max'] }}
            </span>
            <span v-else-if="item.prop === 'status'" class="status-bg" :class="scope.row['status']">
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
                <el-button class="underline" size="default" link type="primary" @click="showDialog(scope.row, 'showEditDialog')">修改</el-button>
              </div>
              <el-dropdown class="!absolute right-[5px] top-[1px] w-[16px] h-[16px]">
                <img class="w-[16px] h-[16px]" src="/src/assets/images/more.svg" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleDelete(scope.row)">
                       <el-icon :size="18">
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
    <div class="py-[10px]"><Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" /></div>
  </div>
  <TimeCtr v-if="dialogType.showTimeCtrDialog" :data="dialogType.info" @close="closeDialogType" />
  <Edit v-if="dialogType.showEditDialog" :data="dialogType.info" @close="closeDialogType" />
  <StockList v-if="dialogType.showDialog" :data="dialogType.info" @close="closeDialogType" />
   <el-dialog :close-on-click-modal="false" title="操作者验证" v-model="dialogType.showGoogle" width="320" @close="closeDialogType">
    <GoogleVerify class="agentGoogle" @confirm="handleSubmit" @close="closeDialogType" v-if="dialogType.showGoogle" />
  </el-dialog>
</template>

<script>
export default { name: 'aiConfig' };
</script>
<script setup>
import { getList, apiDel } from '/@/api/modules/ai'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { copy } from '/@/utils'
import { ElMessageBox, ElMessage, dayjs } from 'element-plus'

import TimeCtr from './components/TimeCtr.vue'
import Edit from './components/Edit.vue'
import StockList from './components/StockList.vue'
import { hex_md5 } from '/@/utils/md5'

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:contract', () => {
  getDataList()
})
const dialogType = reactive({
  showEditDialog: false,
  showTimeCtrDialog: false,
  showDialog: false,
  showGoogle: false,
  info: null
})
const searchForm = reactive({
  params: sessionStorage.aiConfigSearchParams || '',
  status: sessionStorage.aiConfigSearchStatus || 'all'
})
const currentPage = ref(1)
const currentLastPage = ref(1)

const gw = (w)=>{
  return Math.round(1400/1920 * w)
}


const columnBase = ref([
  { prop: 'name', label: '名称', align: 'center', minWidth:gw(360), },
  { prop: 'symbol', label: '代码', align: 'center', minWidth:gw(200) },
  { prop: 'minamount', label: '最小投资额', align: 'center', minWidth:gw(170)  },
  { prop: 'maxgrid', label: '最大网格', align: 'center' , minWidth:gw(170) },
  { prop: 'numpeople', label: '投资人数', align: 'center', minWidth:gw(170)  },
  { prop: 'income', label: '收益金额', align: 'center', minWidth:gw(170) },
  { prop: 'ratereturn', label: '历史收益率', align: 'center', minWidth:gw(170) },
  { prop: 'ratereturn24h', label: '24小时收益率', align: 'center', minWidth:gw(170) },
  { prop: 'runtime', label: '运行时间', align: 'center', minWidth:gw(170) },
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

  sessionStorage.aiConfigSearchParams = searchForm.params
  sessionStorage.aiConfigSearchStatus = searchForm.status

  const cacheKey = hex_md5(JSON.stringify(send))
  if(sessionStorage['aiConfigSearch']){
    const searchCache = JSON.parse(sessionStorage['aiConfigSearch'])
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
      sessionStorage['aiConfigSearch'] = JSON.stringify({
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
const handleSubmit = async (googlecode) => {
  ElMessageBox.confirm(`确定删除`, `确定删除吗？`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    isLoading.value = true
    apiDel({ symbol: dialogType.info.symbol, googlecode }).then(() => {
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
const handleDelete = (row) => {
  ElMessageBox.confirm(`删除会清空所有行情数据，且无法恢复`, `确定删除吗？`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    dialogType.info = row;
    dialogType.showGoogle = true;
  })
}
getDataList();
</script>