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
          <div> <el-button type="primary"
              @click="showDialog(null, 'showDialog')" :disabled="!checkAuthCode(10101)">
               <!-- <el-icon>
                <Plus />
              </el-icon> -->
              新增
              </el-button>
          </div>
          <div>
            <div>
              <el-tag v-if="treeCurrInfo.id" type="primary" closable effect="plain" @close="closeTag" round
                class="mr-2">
                {{ treeCurrInfo.username }}
              </el-tag>
              <el-input v-model="searchForm.params" class="mr-2" placeholder="UID/用户名/备注" style="width: 250px;" />
              <el-button type="primary" class="ml-2" :icon="Search" @click="searchEvent"
                :loading="isLoading">搜索</el-button>
            </div>
          </div>
        </div>
        <div class="mt-2">
          <el-table :data="tableData" border :class="tableData.length?'':'noborder'" v-loading="isLoading">
            <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
              :align="item.align">
              <template #default="scope">
                <span v-if="item.prop === 'enabled'" :class="scope.row[item.prop] ? 'status-bg success' : 'status-yellow'"
                  class="status-bg cursor-pointer">
                  {{ scope.row[item.prop] ? '正常' : '锁定' }}
                </span>
                <!-- <span v-else-if="item.prop === 'locked'" :class="!scope.row[item.prop] ? '' : 'status-yellow'"
                  class="status-bg cursor-pointer">
                  {{ !scope.row[item.prop] ? '正常' : '锁定' }}
                </span> -->
                <span v-else-if="item.prop === 'uid'" @click="copy(scope.row.uid)"
                  class="cursor-pointer">
                  {{ scope.row[item.prop] }}
                </span>
                <!-- <span v-else-if="['deposit','withdraw'].includes(item.prop)"  class="underline cursor-pointer text-[#165DFF]">
                  {{ scope.row[item.prop] }}
                </span> -->
                <span v-else-if="item.prop == 'sub_net_users'">
                  {{ scope.row['sub_users'] }} / {{ scope.row['net_users'] }}
                </span>
                <span v-else>
                  {{ scope.row[item.prop] }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="205" align="center">
              <template #default="scope">
                <el-button link type="primary" @click="showDialog(scope.row, 'showDialog')">修改</el-button>
                <el-button link type="primary" @click="showDialog(scope.row, 'showParentDialog')">修改代理</el-button>
                <el-button link type="primary" @click="showDialog(scope.row, 'setPwdDialog')">重置密码</el-button>
              </template>
            </el-table-column>
            <template v-slot:empty>
              <el-empty class="nodata" description="暂无数据" />
            </template>
          </el-table>
          <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage"  />
        </div>
      </div>
    </div>
  </div>
  <playerParentDialog v-if="dialogType.showParentDialog" type="agent" :visible="dialogType.showParentDialog"
    :editInfo="dialogType.info" @close="closeDialogType" @success="closeDialogType({ reload: true })" />
  <ResetPwd v-if="dialogType.setPwdDialog" :visible="dialogType.setPwdDialog" :editInfo="dialogType.info"
    @close="closeDialogType" @success="closeDialogType({ reload: true })" />
  <AddEdit v-if="dialogType.showDialog" :data="dialogType.info" @close="closeDialogType" />

</template>

<script>
export default { name: 'AgentList' };
</script>
<script setup>
import { getList,getAgentMenu } from '/@/api/modules/business/agents.api'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { checkAuthCode } from '/@/hooks/store.hook.js'
import { ElTree, ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import AddEdit from './AddEdit.vue'
import playerParentDialog from '../playerParentDialog.vue'
import ResetPwd from './ResetPwd.vue'
import { resDatatoTree,copy } from '/@/utils'
const treeRef = ref();
const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:AgentList', () => {
  getDataList()
})
const dialogType = reactive({
  showDialog: false,
  showParentDialog: false,
  showMoneyDialog: false,
  setPwdDialog: false,
  info: null
})
const searchForm = reactive({
  params: '',
  father: '',
  scope: 'sub'
})
const defaultProps = {
  children: 'children',
  label: 'label',
}
const treeData = ref([])
const currentLastPage = ref(1)
const currentPage = ref(1)
const columnBase = ref([
  { prop: 'uid', label: 'UID', align: 'center', width: 120 },
  { prop: 'username', width: 150,label: '用户名', align: 'center' },
  { prop: 'father_username', label: '代理',width: 150, align: 'center' },
  { prop: 'sub_net_users', label: '直推/网络', align: 'center', width: 80 },
  { prop: 'deposit', label: '充值', align: 'center', width: 120 },
  { prop: 'withdraw', label: '提现', align: 'center', width: 120 },
  { prop: 'enabled', label: '业务权限', align: 'center', width: 85 },
  // { prop: 'locked', label: '登录权限', align: 'center', width: 85 },
  { prop: 'remarks', label: '备注', align: 'center' }])
const isLoading = ref(false)
const filterText = ref('')
const showDialog = (data, type) => {
  if (data) {
    dialogType.info = Object.assign({}, data);
  } else {
    dialogType.info = null
  }
  dialogType[type] = true;
}
const searchEvent = () => {
  // for (const key in searchForm) {
  //   if (key !== 'params') {
  //     searchForm[key] = "";
  //   }
  // }
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
  getList(send)
    .then(res => {
      isLoading.value = false
      if(!res || !res.length && currentLastPage.value>1){
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
const closeDialogType = ({ reload }) => {
  for (const key in dialogType) {
    dialogType[key] = false
  }
  if (reload) {
    getDataList();
    getTreeList();
  }
}
const treeCurrInfo = ref({});
const treeNodeClick = (item) => {
  currentPage.value = 1;
  searchForm.params = "";
  searchForm.father = item.id;
  treeCurrInfo.value = item;
  getDataList()
}
getDataList();
getTreeList();
const closeTag = () => {
  searchForm.father = "";
  treeCurrInfo.value = {};
  if (treeData.value.length) {
    treeRef.value.setCurrentKey()
    const nodes = treeRef.value.store._getAllNodes();
    nodes.forEach(item => {
      item.expanded = false;
    });

  }
  getDataList(1)
}
const filterNode = (value, data) => {
  if (!value) return true
  return data.label.includes(value)
}
watch(filterText, (val) => {
  treeRef.value.filter(val)
})
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