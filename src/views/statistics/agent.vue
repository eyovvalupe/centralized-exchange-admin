<template>
  <div class="h-full">
    <div class="flex justify-between h-full">
      <div class="left-tree h-full">
        <el-input class="input-item m-b-10" clearable :suffix-icon="Search" v-model="filterText"
            placeholder="代理\备注关键词" />
        <div class="left-tree-box">
          <el-tree ref="treeRef" accordion highlight-current :indent="10" class="filter-tree" :data="treeData"
            :filter-node-method="filterNode" node-key="id" :props="defaultProps" :current-node-key="treeCurrInfo.id" @nodeClick="treeNodeClick">
            <template #default="{ node }">
              <p class="custom-tree-node">
                <span> {{ node.label }}</span>
              </p>
            </template>
          </el-tree>
        </div>
      </div>
      <div class="right-table h-full">
        <div class="flex reset-el-style-v2 justify-between">
          <div>
            <el-tag v-if="treeCurrInfo.id" type="primary" closable effect="plain" @close="closeTag" round>
                {{ treeCurrInfo?.username }}
            </el-tag>
          </div>
          <div>
              <el-button class="w-[100px]" :class="{'gray-btn':currLast == 1}"  :type="currLast == 0 ? 'success' : 'default'" @click="changeSearch(0)">本月数据</el-button>
              <el-button class="w-[100px]" :class="{'gray-btn':currLast == 0}"   :type="currLast == 1 ? 'success' : 'default'"
                  @click="changeSearch(1)">上月数据</el-button>
             
              <el-input class="ml-[10px]" v-model="searchForm.query"  suffix-icon="search" placeholder="UID/用户名/备注" style="width: 264px;" />
              <el-date-picker v-model="timeRanges" type="daterange" range-separator="至" start-placeholder="请选择开始时间"
                end-placeholder="请选择结束时间" style="width: 266px;margin-left: 10px;" />
              <el-button type="primary" class="w-[120px] ml-[10px]" @click="searchEvent"
                :loading="isLoading">查询</el-button>

          </div>
        </div>


        <!-- <div class="title">{{treeCurrInfo.username || ''}}线下数据</div> -->
        <div class="reset-el-style-v2 pt-[10px]">
          <el-table :data="tableData" ref="table" border :class="tableData.length ? '' : 'noborder'"
            v-loading="isLoading">
            <el-table-column v-for="(item, index) in columnBase" :key="index" :min-width="item.minWidth" :label="item.label"
              :class-name="item.class || ''" :align="item.align">
              <template #default="scope">
                <div :class="item.class || ''">
                  {{ scope.row[item.prop] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="详情" align="center" :min-width="gw(140)">
              <template #default="props">
                <el-button link size="default" class="underline" type="primary" @click="InfoshowDialog(props.row)">充提货币详情</el-button>
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
    </div>
    <dialogInfo  ref="dialogInfoRef" />
  </div>
</template>

<script>
export default { name: 'statisticsAgent' };
</script>
<script setup>
import { getAgentList, getAgentMenu } from '/@/api/modules/business/agents.api'
import { ref, reactive, onMounted, computed, nextTick,unref } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import dialogInfo from './dialogInfo.vue'

import { ElTree, ElMessage, dayjs } from 'element-plus'
import { resDatatoTree } from '/@/utils'
import { hex_md5 } from '/@/utils/md5'

const dialogInfoRef = ref()
const treeRef = ref();
const timeRanges = ref([]);
const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:statisticsAgent', () => {
  getDataList()
})
const dialogType = reactive({
  showAgDialog: false,
  showUserDialog: false,
  info: null
})

const isExpansion = reactive({})

const InfoshowDialog = (data) => {
  const send = {
    start:'',
    end:''
  };
  if (timeRanges.value && timeRanges.value.length) {
      send.start = dayjs(timeRanges.value[0]).format('YYYY-MM-DD')
      send.end = dayjs(timeRanges.value[1]).format('YYYY-MM-DD')
  }
  unref(dialogInfoRef).open(send.start,send.end,'agent',data.partyid)
}

const searchForm = reactive({
  query: sessionStorage['statisticsAgentSearchQuery'] || '',
  father: '',
})
const defaultProps = {
  children: 'children',
  label: 'label',
}
const treeData = ref([])
const currentLastPage = ref(1)
const currentPage = ref(1)


const gw = (w)=>{
  return Math.round(1400/1920 * w)
}

const columnBase = reactive([
  { prop: 'uid', label: 'UID', align: 'center',minWidth:gw(110) },
  { prop: 'username',width: 130, label: '代理', align: 'center',minWidth:gw(220) },
  { prop: 'sub_users', label: '直推', align: 'center',minWidth:gw(200) },
  { prop: 'net_users', label: '网络', align: 'center',minWidth:gw(200) },
  { prop: 'deposit', label: '充值-USDT', align: 'center',minWidth:gw(250)},
  { prop: 'withdraw', label: '提现-USDT', align: 'center',minWidth:gw(250) },
  { prop: 'balance', label: '充提差-USDT', align: 'center',minWidth:gw(250) },
])
const column1 = reactive([
  { prop: 'deposit_main', label: '交易账户', align: 'center' },
  { prop: 'deposit_usd', label: '美元', align: 'center' },
  { prop: 'deposit_usdt', label: 'USDT', align: 'center' },
  { prop: 'deposit_btc', label: 'BTC', align: 'center' },
  { prop: 'deposit_eth', label: 'ETH', align: 'center' },
])
const column2 = reactive([
  { prop: 'withdraw_main', label: '交易账户', align: 'center' },
  { prop: 'withdraw_usd', label: '美元', align: 'center' },
  { prop: 'withdraw_usdt', label: 'USDT', align: 'center' },
  { prop: 'withdraw_btc', label: 'BTC', align: 'center' },
  { prop: 'withdraw_eth', label: 'ETH', align: 'center' },
])
const table = ref(null)
const isLoading = ref(false)
const filterText = ref('')


const searchEvent = () => {
  getDataList(1);
}
const getDataList = (page) => {
  if (page) {
    currentLastPage.value = page
  }
  const send = { page: currentLastPage.value };
  for (const key in searchForm) {
    if (searchForm[key]) {
      send[key] = searchForm[key]
    }
  }
  if (timeRanges.value[0] && timeRanges.value[1]) {
    send.start_time = dayjs(timeRanges.value[0]).format('YYYY-MM-DD')
    send.end_time = dayjs(timeRanges.value[1]).format('YYYY-MM-DD')
  }
  
  if(searchForm.query){
    send.query = searchForm.query
  }

  sessionStorage['statisticsAgentSearchQuery'] = searchForm.query
  
  const cacheKey = hex_md5(JSON.stringify(send))
  if(sessionStorage['statisticsAgentSearch']){
      const searchCache = JSON.parse(sessionStorage['statisticsAgentSearch'])
      if(searchCache.cacheKey == cacheKey){
          tableData.value = searchCache.data
      }else{
          isLoading.value = true
      }
  }else{
      isLoading.value = true
  }
  
  getAgentList(send)
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
      sessionStorage['statisticsAgentSearch'] = JSON.stringify({
          cacheKey,
          data:res
      })

    })
    .finally(() => {
      isLoading.value = false
    })
}
const getTreeList = () => {

  if(sessionStorage['statisticsAgentMenu']){
      const cache = JSON.parse(sessionStorage['statisticsAgentMenu'])
      const tree = resDatatoTree(cache);
      treeData.value = tree
  }

  getAgentMenu({})
    .then(res => {
      sessionStorage['statisticsAgentMenu'] = JSON.stringify(res)
      const tree = resDatatoTree(res);
      treeData.value = tree
      
    })
    .finally(() => {
      isLoading.value = false
    })
}

const treeCurrInfo = ref({});
if(sessionStorage['statisticsAgentTreeCurrInfo']){
  treeCurrInfo.value = JSON.parse(sessionStorage['statisticsAgentTreeCurrInfo'])
}
const treeNodeClick = (item) => {
  currentPage.value = 1;
  searchForm.query = "";
  searchForm.father = item.id;
  treeCurrInfo.value = item;
  sessionStorage['statisticsAgentTreeCurrInfo'] = JSON.stringify({
    id:item.id,
    label:item.label,
    username:item.username
  })
  getDataList()

}
const clearTreeCurrInfo = ()=>{
  treeCurrInfo.value = {}
  sessionStorage['statisticsAgentTreeCurrInfo'] = ''
}
getTreeList();
const closeTag = () => {
  searchForm.father = "";
  clearTreeCurrInfo()
  if (treeData.value.length) {
    treeRef.value.setCurrentKey()
    const nodes = treeRef.value.store._getAllNodes();
    nodes.forEach(item => {
      item.expanded = false;
    });
  }
  changeSearch(currLast.value);
}
const filterNode = (value, data) => {
  if (!value) return true
  return data.label.includes(value)
}
const currLast = ref(1);
const changeSearch = (num) => {
  currLast.value = num;
  sessionStorage['statisticsAgentCurrLast'] = num
  let arr = [];
  if (currLast.value == 0) {
    // 获取本月的开始时间
    const startOfMonth = dayjs().startOf('month');
    // 获取当前时间
    const currentTime = dayjs();
    arr = [startOfMonth, currentTime]
  } else if (currLast.value == 1) {
    // 获取上个月的开始时间
    const startOfLastMonth = dayjs().subtract(1, 'month').startOf('month');
    // 获取上个月的结束时间
    const endOfLastMonth = dayjs().subtract(1, 'month').endOf('month');
    arr = [startOfLastMonth, endOfLastMonth]
  } else {
    arr = timeRanges.value;
  }
  timeRanges.value = arr
  getDataList();
}
changeSearch(sessionStorage['statisticsAgentCurrLast'] || 0);


watch(filterText, (val) => {
  treeRef.value.filter(val)
})

</script>
<style lang="scss" scoped>
.left-tree {
  padding: 20px;
  background: #f5f5f5;
  width: 280px;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  :deep(.el-tree-node__content){
    margin-top: 10px;
    height: 32px;
    font-size: 16px;
    color:#000;
  }
  :deep(.el-tree > .el-tree-node + .el-tree-node){
    border-top: 1px solid #ECECEC;
    margin-top: 14px;
    padding-top: 10px;
  }
  :deep(.el-tree-node.is-current>.el-tree-node__content){
    background-color: #E1EAFF;
  }
  :deep(.el-tree-node__content>.el-tree-node__expand-icon){
    font-size: 16px;
    color:#000;
    padding-right: 10px;
  }
}

.left-tree .el-tree {
  background: none;

}

.left-tree-box {
  width: 240px;
  overflow: auto;
  background: none;
}


.input-item {
  margin-bottom: 10px;
  :deep(.el-input__wrapper){
    box-shadow: 0 0 0 rgba(255,255,255,0);
    border-radius: 8px;
  }
}

.gray-btn{
    background-color: #F5F5F5;
    border-color: #F5F5F5;
    color:#000;
    &:hover{
        color:#000;
    }
}

.right-table {
  width: calc(100% - 280px);
  overflow-y: auto;
  box-sizing: border-box;
  padding: 10px 20px;
  .el-tag{
    height: 40px;
    border-radius: 8px;
    padding: 0 20px;
    font-size: 14px;
    :deep(.el-tag__close){
      margin-left: 20px;
      font-size: 18px;
      &:hover{
        background: none;
        color: #2e68fa;
      }
    }
    
  }
}
.title{
  font-size: 16px;
  font-weight: 500;
  color:#000;
  margin-top: 20px;
}
</style>