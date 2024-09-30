<template>
  <div class="reset-el-styte h-full">
    <div class="flex justify-between  p-2 pt-0 h-full">
      <div class="left-tree h-full">
        <div class="input-item m-b-10"><el-input clearable :prefix-icon="Search" v-model="filterText"
            placeholder="代理\备注关键词" /></div>
        <div class="left-tree-box">
          <el-tree ref="treeRef" accordion highlight-current :indent="10" class="filter-tree" :data="treeData"
            :filter-node-method="filterNode" node-key="id" :props="defaultProps" @nodeClick="treeNodeClick">
            <template #default="{ node }">
              <p class="custom-tree-node">
                <span> {{ node.label }}</span>
              </p>
            </template>
          </el-tree>
        </div>
      </div>
      <div class="right-table h-full pt-2">
        <div class="flex justify-between">
          <div></div>
          <div>
            <div>
              <el-tag v-if="treeCurrInfo.remarks" type="primary" closable effect="plain" @close="closeTag" round
                class="mr-2">
                {{ treeCurrInfo?.username }}
              </el-tag>
              <el-button :type="currLast == 0 ? 'active-green' : 'default'" @click="changeSearch(0)">本月</el-button>
              <el-button class="mr-5" :type="currLast == 1 ? 'active-green' : 'default'"
                @click="changeSearch(1)">上月</el-button>
              <el-input v-model="searchForm.searchValue" class="mr-2" placeholder="UID/用户名/备注" style="width: 200px;" />
              <el-date-picker v-model="timeRanges" type="daterange" range-separator="~" start-placeholder="请选择开始时间"
                end-placeholder="请选择结束时间" style="width: 280px;" />
              <el-button type="primary" class="ml-2" :icon="Search" @click="searchEvent"
                :loading="isLoading">搜索</el-button>
            </div>
          </div>
        </div>
        <div class="mt-2">
          <el-table :data="tableData" ref="table" :border="tableData.length" :class="tableData.length ? '' : 'noborder'"
            v-loading="isLoading">
            <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
              :class-name="item.class || ''" :align="item.align">
              <template #default="scope">

                <template v-if="item.prop === 'username'">
                  <span class="truncate cursor-pointer text-[#165DFF]" @click="showDialog(scope.row, 'showUserDialog')">
                    {{ scope.row[item.prop] }}</span>
                </template>
                <div v-else :class="item.class || ''">
                  {{ scope.row[item.prop] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="详情" align="center" width="100">
              <template #default="props">
                <!-- <el-button link type="primary" @click="toogleExpand(props.row, index)">{{ isExpansion[index] ? '收起' :
                  '展开' }}</el-button> -->
                <el-button link type="primary" @click="showDialog(props.row, 'showAgDialog')">详情</el-button>
              </template>
            </el-table-column>
            <template v-slot:empty>
              <el-empty class="nodata" description="暂无数据" />
            </template>
          </el-table>
          <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
        </div>
      </div>
    </div>
    <AgentInfo v-if="dialogType.showAgDialog" :data="dialogType.info" :timeRanges="timeRanges" @close="closeDialogType" />
    <userDetail v-if="dialogType.showUserDialog" :partyid="dialogType.info.partyid" @close="closeDialogType" />
  </div>
</template>

<script setup>
import { getAgentList, getAgentMenu } from '/@/api/modules/business/agents.api'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import AgentInfo from './AgentInfo.vue'
import userDetail from '/@/components/userDetail/index.vue'
import { ElTree, ElMessage, dayjs } from 'element-plus'
import { resDatatoTree } from '/@/utils'

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

const showDialog = (data, type) => {
  if (data) {
    dialogType.info = Object.assign({}, data);
  } else {
    dialogType.info = null
  }
  dialogType[type] = true;
}

const searchForm = reactive({
  query: '',
  father: '',
})
const defaultProps = {
  children: 'children',
  label: 'label',
}
const treeData = ref([])
const currentLastPage = ref(1)
const currentPage = ref(1)
const columnBase = reactive([
  { prop: 'uid', label: 'UID', align: 'center' },
  { prop: 'username',width: 130, label: '用户名', align: 'center' },
  { prop: 'sub_users', label: '直推', align: 'center' },
  { prop: 'net_users', label: '网络', align: 'center' },
  { prop: 'deposit', label: '充值', align: 'center', class: 'bg-color1' },
  { prop: 'withdraw', label: '提现', align: 'center' },
  { prop: 'balance', label: '充提差', align: 'center', class: 'bg-color3' },
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
const toogleExpand = (row, index) => {
  isExpansion[index] = !isExpansion[index];
  console.log(isExpansion[index]);
  table.value && table.value.toggleRowExpansion(row, isExpansion[index]);

}
const searchEvent = () => {
  searchForm.father = "";
  treeCurrInfo.value = {};
  getDataList(1);
}
const getDataList = (page) => {
  if (page) {
    currentLastPage.value = page
  }
  isLoading.value = true
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


    })
    .finally(() => {
      isLoading.value = false
    })
}
const getTreeList = () => {
  getAgentMenu({})
    .then(res => {
      const tree = resDatatoTree(res);
      treeData.value = tree
    })
    .finally(() => {
      isLoading.value = false
    })
}

const treeCurrInfo = ref({});
const treeNodeClick = (item) => {
  currentPage.value = 1;
  console.log(item);
  searchForm.params = "";
  searchForm.father = item.id;
  treeCurrInfo.value = item;
  getDataList()
}
getTreeList();
const closeTag = () => {
  searchForm.father = "";
  treeCurrInfo.value = {};
  if (treeData.value.length) {
    console.log(treeData.value, treeRef.value)
    treeRef.value.setCurrentKey()
    const nodes = treeRef.value.store._getAllNodes();
    nodes.forEach(item => {
      item.expanded = false;
    });
  }
  changeSearch(1);
}
const filterNode = (value, data) => {
  if (!value) return true
  return data.label.includes(value)
}
const currLast = ref(1);
const changeSearch = (num) => {
  treeCurrInfo.value = {};
  currLast.value = num;
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
changeSearch(1);
watch(filterText, (val) => {
  treeRef.value.filter(val)
})
const closeDialogType = (isReload) => {
  for (const key in dialogType) {
    dialogType[key] = false
  }
}
</script>
<style scoped>
.left-tree {
  padding: 10px;
  background: #fafafa;
  border-radius: 10px;
  width: 220px;
  height: 100%;
  overflow: hidden;
}

.left-tree-box {
  width: 220px;
  overflow: auto;
  padding-right: 20px;
}

.input-item {
  margin-bottom: 10px;
}

.left-tree .el-tree {
  background: #fafafa;

}

.el-tree {
  min-width: 100%;
  display: inline-block !important;
}

.el-tree-node>.el-tree-node__children {
  overflow: visible;
}

.right-table {
  width: calc(100% - 230px);
  overflow-y: auto;
}
</style>