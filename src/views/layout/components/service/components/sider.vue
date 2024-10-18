<template>
  <div class="h-home border-r-[1px] border-solid border-[#E6E6E6]">
    <!-- select -->
    <header
      class="left-header h-[64px] py-[11px] pl-[10px] pr-[21px] border-b-[1px] border-solid border-[#E6E6E6] flex items-center justify-between">
      <div class="w-full relative flex items-center justify-between">
        <el-input v-model="state.userName" clearable @clear="clearUserList" @input="getAllList"
          placeholder="玩家名称/登录UID/用户名" class="w-full">
          <template #append>
            <el-button :icon="Search" :loading="loading" />
          </template>
        </el-input>
      </div>
    </header>
    <!-- messageList -->
    <div class="el-loading-mask" style="" v-if="isLoading">
      <div class="el-loading-spinner"><svg class="circular" viewBox="0 0 50 50">
          <circle class="path" cx="25" cy="25" r="20" fill="none"></circle>
        </svg><!----></div>
    </div>
    <section class="scroll-boxs-left" >
      <!-- 找到匹配的用户 -->
      <template  v-if="isSearch">
        <p class="is-search" v-if="loading">正在搜索...</p>
        <p class="is-search" v-else-if="isSearch && !loading">找到{{ msgUserList.length }}个对话消息</p>
        <div class="item-box flex-1 h-[52px] flex items-center px-2 cursor-pointer" v-for="item in msgUserList"
          :key="item.partyid" @click="selectSearchUser(item)">
          <div class="flex-1">
            <span class="flex items-center justify-between">
              <p class="username">
                {{ item.username || item.remark }}
              </p>
            </span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="item-box flex-1 h-[52px] flex items-center px-2 cursor-pointer" v-for="item in useService.userList"
          :key="item.chatid" :class="useService.chatid === item.chatid ? 'active' : ''" @click="selectAllMessage(item)">
          <div class="flex-1">
            <span class="flex items-center justify-between">
              <p class="username">
                <!-- + item.nologinid.substring(0,6) -->
                <span v-html="item.remarks || item.username || '匿名用户'"></span>
              </p>
              <p class="time text-sm" v-if="item.lasttime">
                {{ transferTime(item.lasttime) }}
              </p>
              <div class="last-icon flex justify-start align-top h-full" @click.stop="">
                <el-dropdown class="ml-5">
                  <el-icon>
                    <MoreFilled />
                  </el-icon>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="setBlack(item)">{{ item.blacklist ? '取消黑名单' : '设置黑名单' }}
                      </el-dropdown-item>
                      <el-dropdown-item @click="setRemark(item)">设置备注</el-dropdown-item>
                      <el-dropdown-item @click="setDelel(item.chatid)" v-if="useService.isSelectMessage">{{
                        !useService.isSelectMessage
                          ? '操作消息' : '取消操作' }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </span>
            <span class="flex items-center justify-between">
              <p class="msg-con">
                <span v-html="item.lastmsg"></span>
              </p>
              <p class="flex">
                <span class="w-6 h-6 rounded-full bg-[#ff8e16] text-[#FFFFFF] flex items-center justify-center mr-2"
                  v-if="item.unread && item.unread !== 0">{{ item.unread }}</span>
                <span v-if="item.blacklist">
                  <el-tag type="danger" size="small" effect="dark" round>黑名单</el-tag>
                </span>
              </p>

            </span>

          </div>
        </div>
      </template>
    </section>
     <el-dialog :close-on-click-modal="false" width="420" class="reset-el-styte" :title="`设置${state.info.username}备注`" v-model="state.showBlackDialog"
      @close="state.showBlackDialog = false">
      <p v-if="state.info.username" class="p-2 m-2">
        <el-input v-model="state.remarks" :rows="3" type="textarea" placeholder="" />
      </p>
      <p class="footer-btn m-2 pb-2"><el-button type="primary" @click="setRemarkHanle">确认</el-button></p>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useServiceStore } from '/@/store'
import { Search } from '@element-plus/icons-vue'
import { getAllUsers, apiRemoveBlacklist,apiUserSearch, apiBlacklist, apiMsgRead, apiSetRemark, apiCreateChatInfo } from '/@/api/modules/service/index.api'
const useService = useServiceStore()
const state = reactive({
  showBlackDialog: false,
  info: {},
  remarks: '',
  userName: ''
})
// const dataList = ref(useService.userList);
const msgUserList = ref([])
const isSearch = ref(false)
const isLoading = ref(false)
const loading = ref(false)

let timer;
const getUserListData = () => {
  return new Promise(r => {
    useService.getUserList().then(res => {
      useService.userList = res;
    }).finally(() => {
      r();
    })
  })
}
getUserListData();
const getAllList = (params) => {
  if (!params || !params.length) {
    clearUserList()
    return
  }
  isSearch.value = true;
  loading.value = true
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  timer = setTimeout(() => {
    // loading.value = true
    apiUserSearch({
      params,
    }).then(data => {
      loading.value = false
      msgUserList.value = data.user
    })
  }, 300);
}
const clearUserList = () => {
  msgUserList.value = [];
  state.userName = ''
  // dataList.value = useService.userList;
  isSearch.value = false;
}
const selectSearchUser = async (item) => {
  useService.setSelectMessageStatus(false);
  await createChat(item.partyid)
  clearUserList()
}
const selectAllMessage = async (item) => {
  isLoading.value = true;
  useService.setSelectMessageStatus(false);
  useService.setChatid(item.chatid || '')
  useService.setPartyid(item.partyid || '')
  useService.getMessageList(item.chatid).then(() => {
    isLoading.value = false;
    clearUserList()
  });
  apiMsgRead({ chatid: item.chatid }).then(() => {
    getUserListData();
  })
};

const setDelel = () => {
  useService.setSelectMessageStatus(!useService.isSelectMessage);
}
// 时间转换
const transferTime = (time) => {
  const date = new Date(time)
  const currentDate = new Date()
  const isToday = date.getDate() === currentDate.getDate() && date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()
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
const setRemark = (item) => {
  state.showBlackDialog = true
  state.info = { ...item }
}
const setRemarkHanle = () => {
  state.showBlackDialog = false
  isLoading.value = true;
  apiSetRemark({ remarks: state.remarks, chatid: state.info.chatid }).then(async () => {
    await getUserListData();
    isLoading.value = false;
  })
}
const createChat = partyid => {
  isLoading.value = true;
  apiCreateChatInfo(
      partyid
    ).then(data => {
      useService.chatid = data.chatid
      getUserListData();
      isLoading.value = false;
    })
}
const setBlack = (item) => {
  const func = item.blacklist ? apiRemoveBlacklist : apiBlacklist
  isLoading.value = true;
  func({ chatid: item.chatid }).then(async () => {
    await getUserListData()
    isLoading.value = false;
  })
}

</script>

<style lang="scss" scoped>
.username {
  width: 59%;
  font-size: 15px;
}

.h-home {
  position: relative;
}

.time {
  width: 100px;
  text-align: right;
}

.all {
  color: #165DFF;
}

.msg-con {
  max-width: 335px;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.left-header {
  flex-direction: column;
}

.is-search {
  text-align: center;
  background: #f5f5f5;
  color: #b1b1b1;
  padding: 2px 0;
}

.scroll-boxs-left {
  max-height: calc(100% - 56px);
  // padding: 20px;
  overflow-y: auto;
}

.scroll-boxs-left::-webkit-scrollbar {
  width: 2px;
}

.scroll-boxs-left::-webkit-scrollbar-thumb {
  background-color: rgba(155, 168, 255, 0.795);
  border-radius: 2px;
}

.scroll-box {
  padding: 20px;
  overflow-y: auto;
}

.item-box {
  &.active {
    background: #165DFF;
    color: #fff;

    .el-icon {
      color: #fff !important;
    }
  }

  border-bottom: 1px solid #E6E6E6;

  &:not(.active):hover {
    background: #dfe6f9;
  }
}

.scroll-box::-webkit-scrollbar {
  width: 6px;
}

.footer-btn {
  text-align: right;
}

.scroll-box::-webkit-scrollbar-thumb {
  background-color: rgba(95, 37, 255, 0.795);
  border-radius: 3px;
}

.el-button:hover {
  background-color: transparent !important;
  color: inherit !important;
}

.el-button--text {
  margin-right: 15px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
