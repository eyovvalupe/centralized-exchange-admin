<template>
<div class="px-[20px] py-[10px]">
    <div class="flex reset-el-style-v2 justify-between">
      <div class="flex items-center">
        <el-radio-group v-model="tabPosition" @change="tabChange">
          <el-radio-button label="aiPos">交易机器人持仓单</el-radio-button>
          <el-radio-button label="aiSearch">交易机器人订单查询</el-radio-button>
          <el-radio-button label="aiIndex">交易机器人场控</el-radio-button>
        </el-radio-group>
        <el-button class="ml-[10px]" plain icon="plus" type="primary" @click="showDialog(null, 'showDialog')">添加场控</el-button>
      </div>
      <div class="flex items-center">
        <!-- <div class="w-[168px]">
           <el-select v-model="searchForm.role" @change="changeSearch(searchForm.role)">
            <el-option v-for="(item) in optionStatus"
            :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </div> -->
        <div class="w-[264px] ml-[10px]">
          <el-input v-model="searchForm.params" ref="searchInput" suffix-icon="search" placeholder="UID/用户名" />
        </div>
        <el-button type="primary" class="w-[120px] ml-[10px]" @click="getDataList(1)"
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
            <span v-else-if="item.prop === 'offset'"  class="status-bg" :class="scope.row[item.prop] ? scope.row[item.prop] : 'all'">
              {{ options[scope.row[item.prop]] || '全部' }}
            </span>
            <span v-else-if="item.prop === 'role'">
              {{ optionStatus.find(f => f.value == scope.row[item.prop]).label }}
            </span> 
            <span v-else-if="item.prop === 'name'">
              {{   scope.row[item.prop] || '全部' }}
            </span> 
            <span v-else-if="item.prop === 'winrate'">
             {{  scope.row['compare'] == 'ge' ? '大于或等于':'小于' }} {{   scope.row[item.prop] }}%
            </span> 
            <span v-else-if="item.prop === 'username'">
              <span class="underline cursor-pointer text-[#4377FE]" @click="showDialog(scope.row, 'showInfoDialog')">{{
                scope.row[item.prop] }}
              </span>
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
                <el-button class="underline" size="default" link type="primary" @click="showDialog(scope.row, 'showDialog')">修改</el-button>
              </div>
              <el-dropdown class="!absolute right-[5px] top-[1px] w-[16px] h-[16px]">
                <img class="w-[16px] h-[16px]" src="/src/assets/images/more.svg" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleSubmit(scope.row)">
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
    <div class="py-[10px]">
      <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
    </div>
  </div>
  <userDetail v-if="dialogType.showInfoDialog && dialogType.info" :partyid="dialogType.info.partyid"  @close="closeDialogType" />
  <EditPrice v-if="dialogType.showDialog" :data="dialogType.info" @close="closeDialogType" />
  <!--  <el-dialog :close-on-click-modal="false" title="操作者验证" v-model="dialogType.showGoogle" width="320" @close="closeDialogType">
    <GoogleVerify class="agentGoogle" @confirm="handleSubmit" @close="closeDialogType" v-if="dialogType.showGoogle" />
  </el-dialog> -->
</template>

<script>
export default { name: 'aiIndex' };
</script>
<script setup>
import { getCtrList, apiCtrDel } from '/@/api/modules/ai'
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage, dayjs } from 'element-plus'
import EditPrice from './components/EditPrice.vue'
import { copy } from '/@/utils'
import userDetail from '/@/components/userDetail/index.vue'
import { useRouter } from 'vue-router'
import { hex_md5 } from '/@/utils/md5'

const router = useRouter()

const tabPosition = ref('aiIndex')
const tabChange = ()=>{
  router.replace({
    name:tabPosition.value
  })
}

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:ai', () => {
  getDataList()
})
const dialogType = reactive({
  showDialog: false,
  showInfoDialog: false,
  showGoogle: false,
  info: null
})

const searchForm = reactive({
  role: sessionStorage['aiIndexSearchRole'] || 'all',
  params: sessionStorage['aiIndexSearchParams'] || '',
  status: sessionStorage['aiIndexSearchStatus'] || 'all'
})


const currentPage = ref(1)
const currentLastPage = ref(1)
const optionStatus = [
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
const options={
  long: '买涨',
  short: '买跌'
};

const gw = (w)=>{
  return Math.round(1400/1920 * w)
}
const columnBase = ref([
  { prop: 'uid', label: 'UID',minWidth: gw(140), align: 'center' },
  { prop: 'username', label: '用户名',minWidth: gw(140), align: 'center' },
  { prop: 'role', label: '角色', align: 'center',minWidth: gw(364) },
  // { prop: 'father_username', label: '代理', align: 'center',minWidth: gw(364) },
  { prop: 'name', label: '合约', align: 'center',minWidth: gw(364), },
  { prop: 'offset', label: '方向', align: 'center',minWidth: gw(364), },
  { prop: 'winrate', label: '盈亏比率', align: 'center',minWidth: gw(364), },
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

  if (searchForm.role !== 'all') {
    //send.role = searchForm.role
  }

  if (searchForm.params) {
    send.params = searchForm.params;
  }
  if (searchForm.status !== 'all') {
    send.status = searchForm.status;
  }

  const cacheKey = hex_md5(JSON.stringify(send))
  if(sessionStorage['aiIndexSearch']){
    const searchCache = JSON.parse(sessionStorage['aiIndexSearch'])
    if(searchCache.cacheKey == cacheKey){
      tableData.value = searchCache.data
    }else{
      isLoading.value = true
    }
  }else{
    isLoading.value = true
  }

  sessionStorage['aiIndexSearchRole']   = searchForm.role
  sessionStorage['aiIndexSearchParams'] = searchForm.params
  sessionStorage['aiIndexSearchStatus'] = searchForm.status
  
  getCtrList(send)
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
      res.map(item=>{
        item.role = item.role || ''
      })
      tableData.value = res
      sessionStorage['aiIndexSearch'] = JSON.stringify({
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
const handleSubmit = async (data) => {
  ElMessageBox.confirm(`确定删除`, `确定删除吗？`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    isLoading.value = true
    apiCtrDel({ partyid: data.partyid }).then(() => {
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
    cancelButtonText: '取消',
  }).then(() => {
    dialogType.info = row;
    dialogType.showGoogle = true;
  })
}

const changeSearch = (s) => {
  searchForm.role = s;
  getDataList();
}

getDataList();
</script>