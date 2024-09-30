<template>
  <header class="w-full flex items-center justify-between border-b-[1px] border-solid border-[#E6E6E6]">
    <section class="w-full h-full">
      <el-table :data="tableData" v-loading="loading" class="w-full">
        <el-table-column v-for="item in column" :key="item.prop" :prop="item.prop" :label="item.label"
          :align="item.align" :width="item.width">
          <template #default="scope">
            <span v-if="item.prop === 'kyc' && scope.row[item.prop] !== 'N/A'" class="status-bg"
              :class="['status-yellow', 'status-green', 'status-green'][scope.row[item.prop]]">
              {{ ['未实名', 'L1认证', 'L2认证'][scope.row[item.prop]] || '-' }}
            </span>
            <span v-else-if="item.prop === 'lastlogin' && scope.row[item.prop] !== 'N/A'">
              {{ dayjs(scope.row[item.prop]).format('MM-DD hh:mm:ss') }}
            </span>
            <span v-else-if="['withdraw'].includes(item.prop)">
              {{ scope.row[item.prop] }}
            </span>
            <span v-else-if="item.prop === 'username'">
              <span class="flex cursor-pointer justify-center align-middle" @click="setRemark(scope.row)">
                <span> {{ scope.row[item.prop] }}</span>
                <span><el-icon style="margin-top: 5px; margin-left: 5px;">
                    <Edit />
                  </el-icon></span>
              </span>
            </span>
            <span v-else-if="item.prop === 'role'">
              {{ roleName(scope.row[item.prop]) }}
            </span>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作消息" width="100" align="center">
          <el-icon @click="setDelel">
            <MoreFilled />
          </el-icon>
          <!-- <el-button>{{ !useService.isSelectMessage ? '操作消息' : '取消操作' }}</el-button> -->
        </el-table-column>
      </el-table>
    </section>
  </header>
   <el-dialog :close-on-click-modal="false" width="420" class="reset-el-styte" :title="`设置${state.info.username}备注`" v-model="state.showBlackDialog"
    @close="closeRemark">
    <p v-if="state.info.username" class="p-2 m-2">
      <el-input v-model="state.info.remarks" :rows="3" type="textarea" placeholder="" />
    </p>
    <p class="footer-btn m-2 pb-2"><el-button type="primary" @click="setRemarkHanle">确认</el-button></p>
  </el-dialog>
</template>

<script setup>
import { Edit, MoreFilled } from '@element-plus/icons-vue'
import { dayjs } from 'element-plus'
import { reactive, ref, watch } from 'vue'
import { useServiceStore } from '/@/store'
import { apiRemoveBlacklist, apiBlacklist, apiSetRemark } from '/@/api/modules/service/index.api'
import { apiUser } from '/@/api/modules/business/player.api'
const useService = useServiceStore()
const loading = ref(false)
const defaultData = [{ uid: 'N/A', username: 'N/A', role: 'N/A', father_username: 'N/A', kyc: 'N/A', withdraw: 'N/A', limit: 'N/A', lastlogin: 'N/A', remarks: 'N/A' }
]
const tableData = ref(defaultData)
const state = reactive({
  showBlackDialog: false,
  info: {}
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
const roleName = (key) => {
  const obj = roleOptions.find(f => f.value === key);
  return obj ? obj.label : 'N/A'
}
const column = reactive([
  { prop: 'uid', label: 'UID', align: 'center' },
  { prop: 'username', label: '用户名', align: 'center' },
  { prop: 'role', label: '角色', align: 'center' },
  { prop: 'father_username', label: '代理', align: 'center' },
  { prop: 'kyc', label: '实名认证', align: 'center' },
  { prop: 'withdraw', label: '账户余额', align: 'center' },
  { prop: 'limit', label: '流水限制', align: 'center' },
  { prop: 'lastlogin', label: '最后登录', width: 140, align: 'center' },
  { prop: 'remarks', label: '备注', align: 'center' },
])
const getData = () => {
  if (!useService.partyid) {
    tableData.value = defaultData
    return
  }
  loading.value = true
  const send_obj = { partyid: useService.partyid };
  apiUser(send_obj)
    .then(res => {
      tableData.value = [res]
    }).finally(() => {
      loading.value = false
    }).catch(() => {
      tableData.value = defaultData
    })
}
const setDelel = () => {
  useService.setSelectMessageStatus(!useService.isSelectMessage);
}
const setRemark = (item) => {
  state.showBlackDialog = true
  state.info = { ...item }
}
const closeRemark = () => {
  state.info = {}
  state.showBlackDialog = false
}
const setRemarkHanle = () => {
  state.showBlackDialog = false
  loading.value = true;
  apiSetRemark({ remarks: state.info.remarks, chatid: state.info.chatid }).then(async () => {
    await useService.getUserList()
    loading.value = false;
  })
}
const setBlack = (item) => {
  const func = item.blacklist ? apiRemoveBlacklist : apiBlacklist
  loading.value = true;
  func({ chatid: item.chatid }).then(async () => {
    getData();
    await useService.getUserList()
    loading.value = false;
  })
}
watch(() => useService.partyid, (val) => {
  val && getData();
}, { immediate: true })

</script>

<style lang="scss" scoped>
.row {
  display: flex;
  justify-content: center;
  align-items: center;
}

.cell {
  width: 151px;
  height: 32px;
  border: 1px solid #ebeef5;
  border-bottom: 0px solid #ebeef5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-btn {
  text-align: right;
  padding-right: 7px;
}

.title {
  font-weight: bold;
}
</style>