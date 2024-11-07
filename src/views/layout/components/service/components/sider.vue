<template>
  <div class="sider_container">
    <div class="relative p-[5px] mb-[10px]">
      <input
        v-model="state.userName"
        class="p-[5px] w-full h-[40px] bg-[#f5f5f5] rounded-[8px] flex items-center px-[10px]"
        placeholder="玩家名称/登录UID/用户名"
      />
      <div class="absolute top-[17.5px] right-[15px]" @click="() => {}">
        <SearchIcon />
      </div>
    </div>
    <div style="overflow-y: auto;">
      <div
        class="w-full h-[68px] rounded-[8px] p-[10px] flex items-center mb-[10px] hover:bg-[#cee9ff]"
        v-for="item in useService.userList"
        :key="item.chatid"
        :class="useService.chatid == item.chatid ? 'bg-[#cee9ff]' : 'bg-[#fff]'"
        @click="selectAllMessage(item)"
      >
        <div class="w-full h-[68px] rounded-[8px] flex items-center">
          <div class="w-[48px] h-[48px] bg-[#4377fe] rounded-[24px] flex justify-center items-center mr-[10px]">
            <span class="text-[20px] text-[#fff]">{{ item.order_no ? item.fater_username ? item.fater_username : '未' : '匿' }}</span>
          </div>
          <div class="flex flex-col justify-between">
            <span class="text-[14px] text-[#000]">{{ item.remarks || item.username || '匿名用户' }}</span>
            <span class="text-[13px] text-[#999999]">{{ item.lastmsg }}</span>
          </div>
        </div>
        <div
          style="
            min-width: 100px;
            align-items: end;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <span class="text-[12px] text-[#999999]">{{ transferTime(item.lasttime) }}</span>
          <div style="display: inline-block; width: 20px; " 
            :style="item.unread && item.unread != 0 ? 'visibility: visible;' : 'visibility: hidden;'"
          >
            <div class="w-[20px] h-[16px] rounded-[10px] bg-[red]" style="display: flex; justify-content: center; align-items: center;">
              <span class="text-[12px] text-[#fff]">{{ item.unread }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useServiceStore } from '/@/store'
import { Search } from '@element-plus/icons-vue'
import {
  getAllUsers,
  apiRemoveBlacklist,
  apiUserSearch,
  apiBlacklist,
  apiMsgRead,
  apiSetRemark,
  apiCreateChatInfo,
} from '/@/api/modules/service/index.api'
import SearchIcon from './common/SearchIcon.vue'

const useService = useServiceStore()
const state = reactive({
  showBlackDialog: false,
  info: {},
  remarks: '',
  userName: '',
})
// const dataList = ref(useService.userList);
const msgUserList = ref([])
const isSearch = ref(false)
const isLoading = ref(false)
const loading = ref(false)

let timer
const getUserListData = () => {
  return new Promise(r => {
    useService
      .getUserList()
      .then(res => {
        useService.userList = res
      })
      .finally(() => {
        r()
      })
  })
}
getUserListData()
const getAllList = params => {
  if (!params || !params.length) {
    clearUserList()
    return
  }
  isSearch.value = true
  loading.value = true
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  timer = setTimeout(() => {
    // loading.value = true
    apiUserSearch().then(data => {
      loading.value = false
      msgUserList.value = data.user
    })
  }, 300)
}
const clearUserList = () => {
  msgUserList.value = []
  state.userName = ''
  // dataList.value = useService.userList;
  isSearch.value = false
}
const selectSearchUser = async item => {
  useService.setSelectMessageStatus(false)
  await createChat(item.partyid)
  clearUserList()
}
const selectAllMessage = async item => {
  isLoading.value = true
  useService.setSelectMessageStatus(false)
  useService.setChatid(item.chatid || '')
  useService.setPartyid(item.partyid || '')
  useService.getMessageList(item.chatid).then(() => {
    isLoading.value = false
    clearUserList()
  })
  apiMsgRead({ chatid: item.chatid }).then(() => {
    getUserListData()
  })
}

const setDelel = () => {
  useService.setSelectMessageStatus(!useService.isSelectMessage)
}
// 时间转换
const transferTime = time => {
  const date = new Date(time)
  const currentDate = new Date()
  const isToday =
    date.getDate() === currentDate.getDate() &&
    date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear()
  if (isToday) {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  } else {
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${month}-${day} ${hours}:${minutes}`
  }
}
const setRemark = item => {
  state.showBlackDialog = true
  state.info = { ...item }
}
const setRemarkHanle = () => {
  state.showBlackDialog = false
  isLoading.value = true
  apiSetRemark({ remarks: state.remarks, chatid: state.info.chatid }).then(async () => {
    await getUserListData()
    isLoading.value = false
  })
}
const createChat = partyid => {
  isLoading.value = true
  apiCreateChatInfo(partyid).then(data => {
    useService.chatid = data.chatid
    getUserListData()
    isLoading.value = false
  })
}
const setBlack = item => {
  const func = item.blacklist ? apiRemoveBlacklist : apiBlacklist
  isLoading.value = true
  func({ chatid: item.chatid }).then(async () => {
    await getUserListData()
    isLoading.value = false
  })
}
</script>

<style lang="scss" scoped>
// .username {
//   width: 59%;
//   font-size: 15px;
// }

// .h-home {
//   position: relative;
// }

// .time {
//   width: 100px;
//   text-align: right;
// }

// .all {
//   color: #165dff;
// }

// .msg-con {
//   max-width: 335px;
//   font-size: 12px;
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
// }

// .left-header {
//   flex-direction: column;
// }

// .is-search {
//   text-align: center;
//   background: #f5f5f5;
//   color: #b1b1b1;
//   padding: 2px 0;
// }

// .scroll-boxs-left {
//   max-height: calc(100% - 56px);
//   // padding: 20px;
//   overflow-y: auto;
// }

// .scroll-boxs-left::-webkit-scrollbar {
//   width: 2px;
// }

// .scroll-boxs-left::-webkit-scrollbar-thumb {
//   background-color: rgba(155, 168, 255, 0.795);
//   border-radius: 2px;
// }

// .scroll-box {
//   padding: 20px;
//   overflow-y: auto;
// }

// .item-box {
//   &.active {
//     background: #165dff;
//     color: #fff;

//     .el-icon {
//       color: #fff !important;
//     }
//   }

//   border-bottom: 1px solid #e6e6e6;

//   &:not(.active):hover {
//     background: #dfe6f9;
//   }
// }

// .scroll-box::-webkit-scrollbar {
//   width: 6px;
// }

// .footer-btn {
//   text-align: right;
// }

// .scroll-box::-webkit-scrollbar-thumb {
//   background-color: rgba(95, 37, 255, 0.795);
//   border-radius: 3px;
// }

// .el-button:hover {
//   background-color: transparent !important;
//   color: inherit !important;
// }

// .el-button--text {
//   margin-right: 15px;
// }

// .dialog-footer button:first-child {
//   margin-right: 10px;
// }
.sider_container {
  width: 400px;
  border-right: 1px solid #ececec;
  padding: 10px;
  overflow-y: auto;
}
</style>
