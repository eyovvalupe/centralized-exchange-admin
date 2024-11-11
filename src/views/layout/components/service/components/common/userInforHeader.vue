<template>
  <div class="user_info_container flex" v-loading="loading">
    <div class="user_info_main min-w-[300px]">
      <div class="w-[48px] h-[48px] min-w-[48px] rounded-[24px] bg-[#4377fe] flex justify-center items-center mr-[10px]">
        <span class="text-[20px] text-[#fff]">{{ useService.partyid ? tableData[0].username.slice(0, 1) : "匿"}}</span>
      </div>
      <span class="text-[16px] text-[#000] font-semibold mr-[10px]">{{ useService.partyid ? tableData[0].username : "匿名用户" }}</span>
      <div class="w-[60px] min-w-[60px] h-[20px] rounded-[10px] bg-[#4377fe] px-[10px] flex justify-between items-center cursor-pointer" v-if="useService.partyid">
        <EditIcon />
        <span class="text-[12px] text-[#fff]">编辑</span>
      </div>
    </div>
    <div v-if="useService.partyid">
      <table>
        <thead>
          <tr>
            <th class="min-w-[51px]">UID</th>
            <th class="min-w-[63px]">用户名</th>
            <th class="min-w-[35px]">角色</th>
            <th>账户余额</th>
            <th>流水限制</th>
            <th>备注</th>
            <th class="min-w-[63px]">最后登录时间</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="min-w-[50px]">{{ tableData[0].uid }}</td>
            <td class="text-[#4377fe] min-w-[60px]">{{ tableData[0].username }}</td>
            <td class="min-w-[30px]">真实用户</td>
            <td>undifined</td>
            <td>undifined</td>
            <td>undifined</td>
            <td class="min-w-[62px]">{{ tableData[0].lastlogin.split(" ")[0] }}<br>{{ tableData[0].lastlogin.split(" ")[1] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { Edit, MoreFilled } from '@element-plus/icons-vue'
import { dayjs } from 'element-plus'
import { reactive, ref, watch } from 'vue'
import { useServiceStore } from '/@/store'
import { apiRemoveBlacklist, apiBlacklist, apiSetRemark } from '/@/api/modules/service/index.api'
import { apiUser } from '/@/api/modules/business/player.api'
import EditIcon from './icons/EditIcon.vue'

const useService = useServiceStore()
const loading = ref(false)
const defaultData = [
  {
    uid: 'N/A',
    username: '匿名用户',
    role: 'N/A',
    father_username: 'N/A',
    kyc: 'N/A',
    withdraw: 'N/A',
    limit: 'N/A',
    lastlogin: 'N/A',
    remarks: 'N/A',
  },
]
const tableData = ref(defaultData)
const state = reactive({
  showBlackDialog: false,
  info: {},
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
  },
]
const roleName = key => {
  const obj = roleOptions.find(f => f.value === key)
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
  const send_obj = { partyid: useService.partyid }
  apiUser(send_obj)
    .then(res => {
      console.log('user header', res)
      tableData.value = [res]
    })
    .finally(() => {
      loading.value = false
    })
    .catch(() => {
      tableData.value = defaultData
    })
}
const setDelel = () => {
  useService.setSelectMessageStatus(!useService.isSelectMessage)
}
const setRemark = item => {
  state.showBlackDialog = true
  state.info = { ...item }
}
const closeRemark = () => {
  state.info = {}
  state.showBlackDialog = false
}
const setRemarkHanle = () => {
  state.showBlackDialog = false
  loading.value = true
  apiSetRemark({ remarks: state.info.remarks, chatid: state.info.chatid }).then(async () => {
    await useService.getUserList()
    loading.value = false
  })
}
const setBlack = item => {
  const func = item.blacklist ? apiRemoveBlacklist : apiBlacklist
  loading.value = true
  func({ chatid: item.chatid }).then(async () => {
    getData()
    await useService.getUserList()
    loading.value = false
  })
}
watch(
  () => useService.chatid,
  val => {
    val && getData()
    console.log('chat id --->', useService.chatid)
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.user_info_container {
  .user_info_main {
    height: 93px;
    padding-left: 20px;
    display: flex;
    flex: 1;
    border-bottom: 1px solid #ececec;
    align-items: center;
  }
  $table-border-color: #ececec;
  $header-bg-color: #f5fbff;
  $row-bg-color: #ffffff;
  $row-hover-bg-color: #e9e9e9;

  table {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
    color: #000;

    th,
    td {
      border-bottom: 1px solid $table-border-color;
      border-left: 1px solid $table-border-color;
      text-align: center;
      font-size: 13px;
      height: 46px;
      word-break: break-all;
      border-collapse: collapse;

      &:first-child {
        width: 110px;
      }

      &:nth-child(2) {
        width: 140px;
      }

      &:nth-child(3) {
        width: 200px;
      }

      &:nth-child(4),
      &:nth-child(5),
      &:nth-child(6) {
        width: 180px;
      }

      &:nth-child(7) {
        width: 140px;
      }
    }

    th {
      background-color: $header-bg-color;
      font-weight: bold;
    }

    tr {
      background-color: $row-bg-color;

      &:hover {
        background-color: $row-hover-bg-color;
      }
    }

    tbody {
      display: block;
      height: 46px;
    }

    tr {
      display: table;
      width: 100%;
    }
  }
}
</style>
