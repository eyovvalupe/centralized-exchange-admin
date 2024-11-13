<template>
  <div class="px-[20px] py-[10px]">
    <div class="flex reset-el-style-v2">
      <div class="flex items-center">
        <el-radio-group v-model="tabPosition" @change="tabChange">
          <el-radio-button label="RechargeOrder">充值订单</el-radio-button>
          <el-radio-button label="cryptoList">平台充值地址</el-radio-button>
        </el-radio-group>
        
      </div>
      <el-button type="primary" plain icon="plus" class="ml-[10px]" @click="showDialog(null, 'showDialog')">增加地址</el-button>
      <!-- <el-button type="info" plain @click="showDialog(null, 'showConfigDialog')">币种配置</el-button> -->
    </div>
   
    <div class="py-[10px] reset-el-style-v2">
      <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :min-width="item.minWidth" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span v-if="item.prop == 'currency'" class="flex items-center" align="center">
              <img class="w-[16px] h-[16px] mr-[10px] rounded-full" :src="`/images/crypto/${scope.row[item.prop].toUpperCase()}.png`" :alt="scope.row[item.prop].toUpperCase()">
              {{ scope.row[item.prop] == 'main' ? '交易账户' : scope.row[item.prop] }}
            </span>
            <span v-else-if="item.prop == 'status'" class="status-bg"
              :class="scope.row[item.prop] == 'success' ? 'close' : 'status-yellow'">
              {{ options.find(f => f.value == scope.row[item.prop]).label }}
            </span>
            
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="gw(140)" align="center">
          <template #default="scope">
            <el-button link type="danger"  size="default" class="underline" @click="handleDelete(scope.row)">删除</el-button>
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
  <Config v-if="dialogType.showConfigDialog" :data="dialogType.info" @close="closeDialogType" />
  <Edit v-if="dialogType.showDialog" :data="dialogType.info" @close="closeDialogType" />
   <el-dialog :close-on-click-modal="false" title="操作者验证" v-model="showGoogle" width="320" v-if="showGoogle" >
    <GoogleVerify class="agentGoogle" @confirm="handleSubmit" @close="showGoogle=false;"/>
  </el-dialog>
</template>

<script>
export default { name: 'cryptoList' };
</script>
<script setup>
// import { getList } from '/@/api/modules/business/kyc.api'
import { getList, apiDel } from '/@/api/modules/crypto'
import { copy } from '/@/utils'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, dayjs } from 'element-plus'

import Config from './Config.vue'
import Edit from './Edit.vue'

import { hex_md5 } from '/@/utils/md5'
import { useRouter } from 'vue-router'
const router = useRouter()

const tabPosition = ref('cryptoList')
const tabChange = ()=>{
  router.replace({
    name:tabPosition.value
  })
}


const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:cryptoList', () => {
  getDataList()
})
const dialogType = reactive({
  showConfigDialog: false,
  showDialog: false,
  info: null
})
const showGoogle = ref(false);
const currentLastPage = ref(1)
const currentPage = ref(1)
const status = ref('')
const gw = (w)=>{
  return Math.round(1400/1920 * w)
}

const columnBase = reactive([
  { prop: 'currency', label: '货币',minWidth:gw(300), align: 'center', },
  { prop: 'network', label: '网络',minWidth:gw(300), align: 'center' },
  { prop: 'address', label: '地址',minWidth:gw(1140), align: 'center' },
  // { prop: 'status', label: '状态', minWidth:gw(300), align: 'center' },
])

const options = [
  {
    value: '',
    label: '全部'
  },
  {
    value: 'unknown',
    label: '审核中'
  },
  {
    value: 'success',
    label: '已处理'
  },
]

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
  if (status.value) {
    send.status = status.value;
  }

  const cacheKey = hex_md5(JSON.stringify(send))
  if(sessionStorage['cryptoListSearch']){
    const searchCache = JSON.parse(sessionStorage['cryptoListSearch'])
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
      sessionStorage['cryptoListSearch'] = JSON.stringify({
        cacheKey,
        data:res
      })
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
let curid;
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除吗？`, `提示`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    curid = row.id;
    showGoogle.value = true;
  })
}

const handleSubmit = async (googlecode) => {
  showGoogle.value = false;
  isLoading.value = true
  apiDel({ id: curid, googlecode }).then(() => {
    getDataList()
    ElMessage({
      type: 'tips',
      message: '删除成功',
      offset: 200
    })
  }).finally(() => {
    isLoading.value = false
  })
}
const changeSearch = (s) => {
  status.value = s;
  getDataList();
}
getDataList();
</script>