<template>
  <div class="w-full h-full reset-el-styte">
    <div class="flex justify-end  p-2">
      <!-- <el-button type="primary" :icon="Plus" @click="addVisible = true">增加新玩家</el-button> -->
      <div class="flex">
        <div class="mr-5">
          <el-button :type="role == item.value ? 'success' : 'default'" v-for="(item) in roleOptions"
            :key="item.value" @click="changeSearch(item.value)">{{ item.label }}</el-button>
        </div>
        <div class="mr-2">
          <el-input v-model="searchValue" class="mx-1" placeholder="UID/用户名/备注" />
        </div>
        <!-- <el-select v-model="role" class="ml-2">
          <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select> -->
        <el-button type="primary" :icon="Search" @click="getPlayerList(1)" :loading="isLoading">搜索</el-button>
      </div>
    </div>

    <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
      v-loading="isLoading">
      <el-table-column v-for="item in column" :key="item.prop" :prop="item.prop" :label="item.label" :align="item.align"
        :width="item.width">
        <template #default="scope">
          <!-- :class="['status-yellow', 'status-green', 'status-green'][scope.row[item.prop]]" -->
          <span v-if="item.prop === 'kyc'">
            {{ ['未实名', 'L1认证', 'L2认证'][scope.row[item.prop]] || '-' }}
          </span>
          <span v-else-if="item.prop === 'lastlogin'">
            {{ dayjs(scope.row[item.prop]).format('MM-DD hh:mm:ss') }}
          </span>
          <span v-else-if="item.prop === 'uid'" class=" cursor-pointer" @click="copy(scope.row.uid)">
            {{ scope.row[item.prop] }}
          </span>
          <span class="status-bg " v-else-if="item.prop === 'role'"
            :class="scope.row[item.prop] == 'guest' ? 'review' : 'success'">
            {{ scope.row[item.prop] == 'guest' ? '模拟' : '真实' }}
          </span>
          <span v-else-if="item.prop === 'wallet'">
            <span class="cursor-pointer text-[#165DFF]"
              @click="showDialog({ ...scope.row, ...item }, 'showMoneyDialog', item.label)">查看余额</span>
          </span>
          <span v-else-if="item.prop === 'username'">
            <span class=" cursor-pointer text-[#165DFF]"
              @click="showDialog({ ...scope.row, ...item }, 'showInfoDialog', scope.row[item.prop] + '详细信息')">{{
                scope.row[item.prop] }}
            </span>
          </span>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
          <el-button class="data" link :type="checkAuthCode(11101)?'primary':'info'" @click="showDialog(scope.row, 'showTxDialog')" :disabled="!checkAuthCode(11101)">提现限制</el-button>
          <el-button class="data" link :type="checkAuthCode(11101)?'primary':'info'" @click="showDialog(scope.row, 'fundVisible')"  :disabled="!checkAuthCode(11101)">修改余额</el-button>
          <el-popover popper-class="operation_popover" placement="bottom" title="" :width="120" trigger="click"
            :show-arrow="false">
            <template #reference>
              <el-button link type="primary" size="small"><img style="width: 20px; height: 20px"
                  src="/src/assets/images/more.svg" /></el-button>
            </template>
            <div class="flex flex-col cursor-pointer">
              <p @click="showDialog(scope.row, 'modifyVisible')" :class="{ disabled: !checkAuthCode(10201) }" class="flex items-center py-2">
                <el-icon :size="20">
                  <EditPen />
                </el-icon> <span class="ml-1">修改</span>
              </p>
              <p @click="showDialog(scope.row, 'showIdDialog')" :class="{ disabled: !checkAuthCode(10201) }"
                class="flex items-center py-2">
                <el-icon :size="20">
                  <Postcard />
                </el-icon><span class="ml-1">修改实名认证</span>
              </p>
              <p @click="showDialog(scope.row, 'showParentDialog')" :class="{ disabled: !checkAuthCode(10201) }" class="flex items-center py-2">
                <el-icon :size="20">
                  <Share />
                </el-icon><span class="ml-1">修改代理</span>
              </p>
              <p @click="showDialog(scope.row, 'showLinkDialog')" :class="{ disabled: !checkAuthCode(10201) }" class="flex items-center py-2 border-b1">
                <el-icon :size="20">
                  <Link />
                </el-icon><span class="ml-1">重置链接</span>
              </p>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <template v-slot:empty>
        <el-empty class="nodata" description="暂无数据" />
      </template>
    </el-table>
    <div class="ml-2">
      <Pagination @changePage="getPlayerList" v-if="tableData.length" :currentPage="currentLastPage" />
    </div>
  </div>
  <fundEditDialog v-if="dialogType.fundVisible" :editInfo="detailData" @close="closeDialogType"
    @success="closeDialogType('reload')" />
  <playerTxDialog v-if="dialogType.showTxDialog" :visible="dialogType.showTxDialog" :editInfo="detailData"
    @close="closeDialogType" @success="closeDialogType('reload')" />
  <playerIdDialog v-if="dialogType.showIdDialog" :visible="dialogType.showIdDialog" :editInfo="detailData"
    @close="closeDialogType" @success="closeDialogType('reload')" />
  <modifyDialog v-if="dialogType.modifyVisible" :visible="dialogType.modifyVisible" :editInfo="detailData"
    @close="closeDialogType" @success="closeDialogType('reload')" />
  <playerParentDialog type="user" v-if="dialogType.showParentDialog" :visible="dialogType.showParentDialog"
    :editInfo="detailData" @close="closeDialogType" @success="closeDialogType('reload')" />
  <playerResetLinkDialog v-if="dialogType.showLinkDialog" :visible="dialogType.showLinkDialog" :editInfo="detailData"
    @close="closeDialogType" @success="closeDialogType('reload')" />
  <el-dialog :close-on-click-modal="false" v-model="dialogType.showMoneyDialog" :loading="dialogLoading"
    class="reset-el-styte" width="700" :title="dialogType.title" @close="closeDialogType">
    <div v-loading="dialogLoading" style="min-height: 80px;">
      <template v-if="!dialogLoading">
        <div class="flex">
          <div class="w-7/12">
            <div class="text-sm mt-1 mb-2">业务账户</div>
            <div class="table-list flex flex-nowrap justify-between bg-slate-50">
              <span class="w-4/12 text-center">账户</span>
              <span class="w-4/12 text-center" style="border-right: 1px solid #e6e6e6;"><b>货币</b></span>
              <span class="w-8/12 text-center"><b>金额</b></span>
            </div>
            <div v-for="child in detailData['account']" :key="child.currency"
              class="table-list flex flex-nowrap justify-between">
              <span class="w-4/12 text-center" style="font-weight: normal;">{{ options[child.account] }}</span>
              <span class="w-4/12 text-center" style="border-right: 1px solid #e6e6e6;">{{ child.name }}</span>
              <span class="w-8/12 text-center">{{ child.amount }}</span>
            </div>
          </div>
          <div class="w-5/12 ml-2">
            <div class="flex justify-between mb-2">
              <div class="text-sm mt-1">现金账户</div>
              <div>
                <span class="mr-2">隐藏0余额</span>
                <el-switch v-model="showZreo" size="small" />
              </div>
            </div>
            <div class="table-list flex flex-nowrap justify-between bg-slate-50">
              <span class="w-4/12 text-center">货币</span>
              <span class="w-7/12 text-center"><b>金额</b></span>
            </div>
            <template v-for="(item, index) in detailData['wallet']" :key="index">
              <div v-if="!(showZreo && item.amount == 0)" class="table-list flex flex-nowrap justify-between">
                <span>{{ item.name }}</span>
                <span class="w-7/12 text-center">{{ item.amount }}</span>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
  </el-dialog>
  <userDetail v-if="dialogType.showInfoDialog" :partyid="detailData.partyid" @close="closeDialogType" />

</template>

<script setup>
import {
  apiUserList,
  apiUserDeposit,
  apiUserWithdraw,
  apiUserFunds,
  apiUserBalance,
} from '/@/api/modules/business/player.api'
// import { apiRoleList } from '/@/api/modules/system/index.api'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { checkAuthCode } from '/@/hooks/store.hook.js'
import { copy } from '/@/utils'
import playerParentDialog from '../playerParentDialog.vue'
import playerResetLinkDialog from './playerResetLinkDialog.vue'
import fundEditDialog from './fundEditDialog.vue'
import playerIdDialog from './playerIdDialog.vue'
import modifyDialog from './modifyDialog.vue'
import playerTxDialog from './playerTxDialog.vue'
import { ElMessage, dayjs } from 'element-plus'
import userDetail from '/@/components/userDetail/index.vue'

const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt

Bus.on('update:Player', () => {
  getPlayerList()
})
const roleOptions = [
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
const detailData = ref([])
const dialogLoading = ref(false)
const showZreo = ref(false)
const currentLastPage = ref(1)
const dialogType = reactive({
  showTxDialog: false,
  modifyVisible: false,
  fundVisible: false,
  showIdDialog: false,
  showParentDialog: false,
  showLinkDialog: false,
})
const condition = reactive({
  searchValue: '',
  role: 'user',
})

const role = ref('all')
const searchForm = reactive({
  start_time: '',
  end_time: ''
})

const searchValue = ref('')
const currentPage = ref(1)
const options = {
  money: '现金账户',
  stock: '股票账户',
  futures: '合约账户',
  forex: '外汇账户'
}

const column = reactive([
  { prop: 'uid', label: 'UID', width: 100, align: 'center' },
  { prop: 'username',width: 140, label: '用户名', align: 'center' },
  { prop: 'role', label: '角色', align: 'center' },
  { prop: 'father_username', label: '代理', align: 'center' },
  { prop: 'kyc', label: '实名认证', width: 90, align: 'center' },
  { prop: 'wallet', label: '账户余额', align: 'center' },
  { prop: 'limit', label: '流水限制', width: 100, align: 'center' },
  { prop: 'lastlogin', label: '最后登录', width: 140, align: 'center' },
  { prop: 'remarks', label: '备注', align: 'center' },
])
const columnWallet = ref([])
const isLoading = ref(false)
const tableData = ref([])
const maxHeight = ref(420)
onMounted(() => {
  maxHeight.value = document.body.offsetHeight - 290
})
const func = { wallet: apiUserFunds, withdraw: apiUserWithdraw, deposit: apiUserDeposit }
const showDialog = (data, key, title) => {
  if (!checkAuthCode(10201)) {
    return
  }
  if (title) {
    dialogType.title = title
  }
  const { partyid, prop } = data
  if (func[prop]) {
    dialogLoading.value = true
    func[data.prop]({ partyid })
      .then(res => {
        detailData.value = res
      })
      .finally(() => {
        dialogLoading.value = false
      })
  } else {
    detailData.value = data
  }
  dialogType[key] = true
}

// 获取玩家列表 page若传则为第一页
const getPlayerList = page => {
  if (page) {
    currentLastPage.value = page
  }
  isLoading.value = true
  const send = {
    page: currentLastPage.value,
  }
  if (searchValue.value) {
    send.params = searchValue.value
  }
  if (role.value !== 'all') {
    send.role = role.value
  }
  apiUserList(send)
    .then(res => {
      isLoading.value = false
      condition.searchValue = searchValue.value
      condition.role = role.value
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

const closeDialogType = (isReload) => {
  for (const key in dialogType) {
    dialogType[key] = false
  }
  dialogLoading.value = false;
  if (isReload) {
    getPlayerList();
  }
}

const changeSearch = (s) => {
  role.value = s;
  getPlayerList();
}
const findWalletKey = (key) => {
  const targetObj = detailData.value;
  const obj = targetObj.find(f => f.currency == key);
  return obj ? obj.amount : '-';
}

getPlayerList()
</script>

<style lang="scss">
.player {
  .el-pager {
    display: none;
  }
}
</style>
