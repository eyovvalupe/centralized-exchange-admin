<template>
  <div class="reset-el-styte h-full">
    <div class="flex justify-between h-full">
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
      <div class="right-box h-full">
        <el-table :data="tableData" :border="tableData.length" :class="tableData.length ? '' : 'noborder'"
          v-loading="isLoading">
          <el-table-column v-for="(item, index) in rightColumn" :key="index" :width="item.width" :label="item.label"
            :align="item.align">
            <template #default="scope">
              <span v-if="item.prop === 'sub_users'">
                {{ scope.row['sub_users'] }}/ {{ scope.row['net_users'] }}
              </span>
              <span v-else-if="item.prop === 'username'">
                <span class="underline cursor-pointer text-[#165DFF]"
                  @click="showDialog(scope.row)">{{ scope.row[item.prop] }}</span>
              </span>
              <span v-else>
                {{ scope.row[item.prop] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="充值" align="center">
            <el-table-column v-for="(item, index) in column1" :key="index" :width="item.width" :label="item.label"
              :align="item.align">
              <template #default="scope">
                {{ scope.row[item.prop] }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="提现" align="center" class-name="bg-white2">
            <el-table-column v-for="(item, index) in column2" :key="index" :width="item.width" :label="item.label"
              :align="item.align">
              <template #default="scope">
                {{ scope.row[item.prop] }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="小计(USDT)" align="center">
            <el-table-column v-for="(item, index) in column3" :key="index" :width="item.width" :label="item.label"
              :align="item.align">
              <template #default="scope">
                {{ scope.row[item.prop] }}
              </template>
            </el-table-column>
          </el-table-column>
          <template v-slot:empty>
            <el-empty class="nodata" description="暂无数据" />
          </template>
        </el-table>
        <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
      </div>
    </div>
    <userDetail v-if="dialogType.showInfoDialog" :partyid="partyid" @close="closeDialogType" />
  </div>
</template>

<script setup>
import { getAgentList, getAgentMenu } from '/@/api/modules/business/agents.api'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import userDetail from '/@/components/userDetail/index.vue'

const leftData = ref([]);
const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:statisticsAgent', () => {
  getDataList()
})
const dialogType = reactive({
  showInfoDialog: false
})
const currentLastPage = ref(1)
const currentPage = ref(1)
const partyid = ref('');
const partyid2 = ref('');
const  showDialog=(item)=>{
  partyid2.value = item.partyid;
  dialogType.showInfoDialog = true;
}
const columnBase = reactive([
  // { prop: 'uid', label: 'UID', width: 100, align: 'left' },
  { prop: 'username', label: '用户名', width: 100, align: 'left' },
  { prop: 'remarks', label: '备注', align: 'left' }])
const isLoading = ref(false)
const rightColumn = reactive([{ prop: 'sub_users', label: '直推/网络', align: 'center', width: 90 },
{ prop: 'username', label: '用户名', align: 'center' }])
const column1 = reactive([
  { prop: 'deposit_main', label: '交易账户', width: 90, align: 'center' },
  { prop: 'deposit_usd', label: '美元', width: 60, align: 'center' },
  { prop: 'deposit_usdt', label: 'USDT', width: 70, align: 'center' },
  { prop: 'deposit_btc', label: 'BTC', width: 60, align: 'center' },
  { prop: 'deposit_eth', label: 'ETH', width: 60, align: 'center' },
])
const column2 = reactive([
  { prop: 'withdraw_main', label: '交易账户', width: 90, align: 'center' },
  { prop: 'withdraw_usd', label: '美元', width: 70, align: 'center' },
  { prop: 'withdraw_usdt', label: 'USDT', width: 70, align: 'center' },
  { prop: 'withdraw_btc', label: 'BTC', width: 70, align: 'center' },
  { prop: 'withdraw_eth', label: 'ETH', width: 70, align: 'center' },
])
const column3 = reactive([
  { prop: 'deposit', label: '充值', width: 70, align: 'center' },
  { prop: 'withdraw', label: '提现', width: 70, align: 'center' },
  { prop: 'balance', label: '充提差', width: 90, align: 'center' },
])
const closeDialogType = (isReload) => {
  for (const key in dialogType) {
    dialogType[key] = false
  }
  if (isReload) {
    getPlayerList();
  }
}
const tableRowClassName = ({ row }) => {
  console.log(partyid.value, row['partyid'])
  return partyid.value == row['partyid'] ? 'active' : ''
}
const getDataList = (page) => {
  if (page) {
    currentLastPage.value = page
  }
  isLoading.value = true
  const send = { page: -1 };
  // const send = { father: partyid.value };
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
  isLoading.value = true
  getAgentMenu({ father: -1 })
    .then(res => {
      leftData.value = res
      if (res && res[0]) {
        partyid.value = res[0].partyid;
        getDataList(1)
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}
getTreeList();
const rowSelect = (row) => {
  partyid.value = row.partyid;
  getDataList(1)
}
</script>
<style lang="scss" scoped>
.left-box {
  padding: 10px;
  background: #fafafa;
  border-radius: 10px;
  width: 300px;
  height: 100%;
  overflow: hidden;
}

.right-box {
  padding: 10px 0 0 0;
  width: calc(100% - 300px);
}
</style>