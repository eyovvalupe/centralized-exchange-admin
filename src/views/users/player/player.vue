<template>
  <div class="px-[30px] py-[10px]">
    <div class="reset-el-style-v2">
      <!-- <el-button type="primary" @click="addVisible = true">增加新玩家</el-button> -->
      <div class="flex justify-end">
    
        <div class="w-[168px]">
          <el-select v-model="role" @change="changeSearch(role)">
            <el-option v-for="(item) in roleOptions"
            :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </div>

        <div class="w-[264px] ml-[10px]">
          <el-input v-model="searchValue" suffix-icon="search"  placeholder="UID/用户名/备注" />
        </div>
        <!-- <el-select v-model="role" class="ml-2">
          <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select> -->
        <el-button type="primary"  class="w-[120px] ml-[10px]" @click="getPlayerList(1)" :loading="isLoading">查询</el-button>
      </div>
    </div>
    <div class="py-[10px] reset-el-style-v2">
      <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="item in column" :key="item.prop" :prop="item.prop" :label="item.label" :align="item.align"
          :width="item.width" :min-width="item.minWidth">
          <template #default="scope">
            <!-- :class="['status-yellow', 'status-green', 'status-green'][scope.row[item.prop]]" -->
            <span v-if="item.prop === 'kyc'">
              {{ ['未实名', 'L1认证', 'L2认证'][scope.row[item.prop]] || '-' }}
            </span>
            
            <span v-else-if="item.prop === 'uid'" class=" cursor-pointer" @click="copy(scope.row.uid)">
              {{ scope.row[item.prop] }}
            </span>
            <span class="status-bg " v-else-if="item.prop === 'role'">
              {{ scope.row[item.prop] == 'guest' ? '模拟' : '真实' }}
            </span>
            <span v-else-if="item.prop === 'wallet'">
              <span class="underline cursor-pointer text-[#4377FE]"
                @click="showDialog({ ...scope.row, ...item }, 'showMoneyDialog')">查看余额</span>
            </span>
            <span v-else-if="item.prop === 'username'">
              <span class="underline cursor-pointer text-[#4377FE]"
                @click="showDialog({ ...scope.row, ...item }, 'showInfoDialog', scope.row[item.prop] + '详细信息')">{{
                  scope.row[item.prop] }}
              </span>
            </span>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="gw(210)" align="center">
          <template #default="scope">
            <div class="w-full flex justify-between">
              <div class="flex-1 flex justify-center items-center">
                <el-button size="default" class="data underline" link :type="checkAuthCode(11101)?'primary':'info'" @click="showDialog(scope.row, 'showTxDialog')" :disabled="!checkAuthCode(11101)">提现限制</el-button>
                <b class="split-line"></b>
                <el-button size="default" class="data underline" link :type="checkAuthCode(11101)?'primary':'info'" @click="showDialog(scope.row, 'fundVisible')"  :disabled="!checkAuthCode(11101)">修改余额</el-button>
              </div>

              <el-popover popper-class="operation_popover" placement="bottom" title="" :width="120" trigger="click"
              :show-arrow="false">
                <template #reference>
                  <img class="mr-[5px] w-[16px]" src="/src/assets/images/more.svg" />
                </template>
                <div class="flex flex-col cursor-pointer">
                  <p @click="showDialog(scope.row, 'modifyVisible')" :class="{ disabled: !checkAuthCode(10201) }" class="flex items-center py-2">
                    <SvgIcon name="edit" size="15px" /><span class="ml-[10px]">修改</span>
                  </p>
                  <p @click="showDialog(scope.row, 'showIdDialog')" :class="{ disabled: !checkAuthCode(10201) }"
                    class="flex items-center py-2">
                    <SvgIcon name="realnameOutline" size="16px" /><span class="ml-[10px]">修改实名认证</span>
                  </p>
                  <p @click="showDialog(scope.row, 'showParentDialog')" :class="{ disabled: !checkAuthCode(10201) }" class="flex items-center py-2">
                    <SvgIcon name="agent" size="16px" /><span class="ml-[10px]">修改代理</span>
                  </p>
                  <p @click="showDialog(scope.row, 'showLinkDialog')" :class="{ disabled: !checkAuthCode(10201) }" class="flex items-center py-2 border-b1">
                    <SvgIcon name="link" size="16px" /><span class="ml-[10px]">重置链接</span>
                  </p>
                </div>
              </el-popover>
            </div>
           
            
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
    </div>
    <div class="pb-[10px]">
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
 
  <userMoney v-if="dialogType.showMoneyDialog" :partyid="detailData.partyid" @close="closeDialogType" />

  <userDetail v-if="dialogType.showInfoDialog" :partyid="detailData.partyid" @close="closeDialogType" />

</template>

<script>
export default { name: 'Player' };
</script>
<script setup>
import {
  apiUserList,
  apiUserDeposit,
  apiUserWithdraw
} from '/@/api/modules/business/player.api'
// import { apiRoleList } from '/@/api/modules/system/index.api'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import SvgIcon from '/@/components/icons/Index.vue'

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
import userMoney from '/@/components/userDetail/money.vue'
import { hex_md5 } from '/@/utils/md5'
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

const role = ref(sessionStorage['playerSearchRole'] || 'all')
const searchForm = reactive({
  start_time: '',
  end_time: ''
})

const searchValue = ref(sessionStorage['playerSearchValue'] || '')
const currentPage = ref(1)
const options = {
  money: '现金账户',
  stock: '股票账户',
  futures: '合约账户',
  forex: '外汇账户'
}
const gw = (w)=>{
  return Math.round(1400/1920 * w)
}

const column = reactive([
  { prop: 'uid', label: 'UID', minWidth:gw(110), align: 'center' },
  { prop: 'username',minWidth:gw(140), label: '用户名', align: 'center' },
  { prop: 'role', label: '角色', align: 'center',minWidth:gw(200), },
  { prop: 'father_username', label: '代理', align: 'center',minWidth:gw(200) },
  { prop: 'kyc', label: '实名认证', minWidth:gw(170), align: 'center' },
  { prop: 'wallet', label: '账户余额', align: 'center', minWidth:gw(140)},
  { prop: 'limit', label: '流水限制', minWidth:gw(140), align: 'center' },
  { prop: 'lastlogin', label: '最后登录', minWidth:gw(170), align: 'center' },
  { prop: 'remarks', label: '备注',minWidth:gw(410), align: 'center' },
])
const columnWallet = ref([])
const isLoading = ref(false)
const tableData = ref([])
const maxHeight = ref(420)
onMounted(() => {
  maxHeight.value = document.body.offsetHeight - 290
})
const func = { withdraw: apiUserWithdraw, deposit: apiUserDeposit }
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
  const send = {
    page: currentLastPage.value,
  }
  if (searchValue.value) {
    send.params = searchValue.value
  }
  if (role.value !== 'all') {
    send.role = role.value
  }


  sessionStorage['playerSearchValue'] = searchValue.value
  sessionStorage['playerSearchRole'] = role.value

  const cacheKey = hex_md5(JSON.stringify(send))
  if(sessionStorage['playerSearch']){
    const searchCache = JSON.parse(sessionStorage['playerSearch'])
    if(searchCache.cacheKey == cacheKey){
      tableData.value = searchCache.data
    }else{
      isLoading.value = true
    }
  }else{
    isLoading.value = true
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
      sessionStorage['playerSearch'] = JSON.stringify({
        cacheKey,
        data:res
      })
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
