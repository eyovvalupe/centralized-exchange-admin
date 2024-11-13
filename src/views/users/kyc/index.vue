<template>
   <div class="px-[20px] py-[10px]">
    <div class="flex reset-el-style-v2  justify-end">
      
      <div class="flex items-center">
        <div class="w-[168px]">
          <el-select v-model="searchForm.status" @change="changeSearch(searchForm.status)">
            <el-option v-for="(item) in options"
            :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </div>
        <div class="w-[264px] ml-[10px]">
          <el-input v-model="searchForm.params" ref="searchInput" suffix-icon="search" placeholder="UID/用户名/备注" />
        </div>
        <el-button type="primary" class="w-[120px] ml-[10px]" @click="getDataList(1)"
          :loading="isLoading">查询</el-button>
      </div>


    </div>
    <div class="reset-el-style-v2 py-[10px]">
      <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :min-width="item.minWidth" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span class="status-bg" v-if="item.prop == 'status'"
              :class="scope.row[item.prop]" align="center">
              {{ transdata(scope.row[item.prop]) }}
            </span>
            <template v-else-if="item.prop === 'username'">
              <span class="truncate cursor-pointer text-[#4377FE] underline" @click="showDialog(scope.row, 'showUserDialog')"> {{ scope.row[item.prop] }}</span>
            </template>
            <template v-else-if="item.prop === 'uid'">
              <span class="truncate cursor-pointer" @click="copy(scope.row[item.prop])"> {{
                scope.row[item.prop] }}</span>
            </template>
            <span v-else-if="item.prop == 'l2'">
              <el-button class="underline" link type="primary"
                @click="showDialog({ ...scope.row, tab: 'img' }, 'showDialog')">查看照片</el-button>
            </span>
           
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="gw(210)" align="center">
          <template #default="scope">
            <el-button class="underline"  size="default" link type="primary" @click="showDialog({ ...scope.row, tab: 'info' }, 'showDialog')">实名信息</el-button>
            <b class="split-line"></b>
            <el-button class="underline"  size="default" link :type="scope.row['status'] === 'success' ? 'info' : 'primary'"
              :disabled="scope.row['status'] === 'success'"
              @click="showDialog(scope.row, 'showEditDialog')">审核</el-button>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
      
    </div>
    <div class="pb-[10px]">
      <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
    </div>
  </div>
  <userDetail v-if="dialogType.showUserDialog" :partyid="dialogType.info.partyid" @close="closeDialogType"/>
  <Info v-if="dialogType.showDialog" :info="dialogType.info" @close="closeDialogType" />
  <Edit v-if="dialogType.showEditDialog" :info="dialogType.info" @close="closeDialogType" />
</template>

<script>
export default { name: 'kycList' };
</script>
<script setup>
import { getList } from '/@/api/modules/business/kyc.api'
import { ref, reactive } from 'vue'
import { copy } from '/@/utils'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, dayjs } from 'element-plus'
import Edit from './Edit.vue'
import Info from './Info.vue'
import userDetail from '/@/components/userDetail/index.vue'
import { hex_md5 } from '/@/utils/md5'

const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:kycList', () => {
  getDataList()
})
const dialogType = reactive({
  showEditDialog: false,
  showUserDialog: false,
  showDialog: false,
  info: null
})

const options = [
  {
    value: 'all',
    label: '全部',
  },
  {
    value: 'review',
    label: '审核中',
  },
  {
    value: 'success',
    label: '通过',
  },
  {
    value: 'failure',
    label: '拒绝',
  },
]


const searchForm = reactive({
  params: sessionStorage['kycParams'] || '',
  status: sessionStorage['kycStatus'] || 'all',
})

const tableData = ref([])

const gw = (w)=>{
  return Math.round(1400/1920 * w)
}


const columnBase = ref([
  { prop: 'uid', label: 'UID', align: 'center', minWidth:gw(110) },
  { prop: 'username', minWidth:gw(200),label: '用户名', align: 'center' },
  // { prop: 'father_username',minWidth:gw(200), label: '代理', align: 'center' },
  { prop: 'name',minWidth:gw(200), label: '姓名', align: 'center' },
  { prop: 'idtype', label: '证件类型', align: 'center', minWidth:gw(200)},
  { prop: 'idnum', label: '证件号码', align: 'center',minWidth:gw(378) },
  { prop: 'birthday', label: '生日', align: 'center',minWidth:gw(200) },
  // { prop: 'l2', label: '认证照片', align: 'center', minWidth:gw(200)},
  { prop: 'status', label: '状态', align: 'center', minWidth:gw(200)},
  { prop: 'created', label: '时间', align: 'center',minWidth:gw(200) }
])
const currentLastPage = ref(1)
const currentPage = ref(1)
const transdata = (d) =>{
  const obj= options.find(f => f.value ==d) || {label:'--'}
  return obj.label
}

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

  sessionStorage['kycParams'] =  searchForm.params
  sessionStorage['kycStatus'] =  searchForm.status;
  
  const cacheKey = hex_md5(JSON.stringify(send))
  if(sessionStorage['kycSearch']){
    const kycSearchCache = JSON.parse(sessionStorage['kycSearch'])
    if(kycSearchCache.cacheKey == cacheKey){
      tableData.value = kycSearchCache.data
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

      sessionStorage['kycSearch'] = JSON.stringify({
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
getDataList();
const changeSearch = (s) => {
  searchForm.status = s;
  getDataList();
}
</script>
<style scoped>
.right-table {
  width: calc(100% - 230px);
}
</style>