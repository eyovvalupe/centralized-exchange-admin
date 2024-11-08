<template>
  <div class="main">
    <div v-show="loading" class="loading w-full flex flex-col items-center justify-center">
      <p>
        <el-icon class="is-loading" :size="30">
          <Loading />
        </el-icon>
      </p>
      <p>请稍候...</p>
    </div>
    <div class="del-tools reset-el-styte w-full px-5 py-2 flex justify-between" v-if="useService.isSelectMessage">
      <el-button type="primary" @click="rebackMessage">删除 {{ useService.deleteMessageID.length }}</el-button>
      <el-button link @click="cancelRebackMessage">取消</el-button>
    </div>
    <main
      class="scroll-box"
      :class="{ 'select-box': useService.isSelectMessage }"
      @scroll="handleScroll"
      ref="scrollContainer"
    >
      <p
        class="w-full flex items-center justify-center"
        v-if="!useService.newMessageList[useService.chatid] || !useService.newMessageList[useService.chatid].length"
      >
        <span>没有更多消息了...</span>
      </p>
      <ul v-else>
        <li
          v-for="item in useService.newMessageList[useService.chatid]"
          :key="item.id"
          class="flex w-auto mb-[20px]"
          :class="item.direction === 'send' ? '' : 'justify-end'"
        >
          <div class="flex">
            <span class="flex mx-[10px]">
              <el-checkbox
                size="small"
                v-if="useService.isSelectMessage"
                class="pr-2"
                @click="getMessageInfor(item)"
                :checked="stateObj[item.msgid]"
              />

              <p
                :class="`txt-${item.direction}`"
                class="text-[12px] text-[#999999] pr-[10px] flex flex-col justify-end"
                v-if="item.direction == 'receive'"
              >
                {{ transferTime(item.time) }}
              </p>
              <template v-if="item.type === 'img'">
                <div class="img-loading" v-if="item.fileName">
                  <el-icon size="60" color="#bbb"><icon-picture /></el-icon>
                  <div class="img-loading-txt">图片加载中...</div>
                </div>
                <div
                  style="border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; overflow: hidden"
                  :style="item.direction == 'send' ? 'border-top-right-radius: 16px' : 'border-top-left-radius: 16px'"
                  v-else
                >
                  <el-image
                    lazy
                    :preview-src-list="[item.content]"
                    style="max-height: 300px"
                    :src="item.content"
                    class="imgMessage"
                  >
                    <template #placeholder>
                      <div class="image-slot">
                        <el-icon><icon-picture /></el-icon>
                      </div>
                    </template>
                    <template #error>
                      <div class="image-slot">
                        <el-icon><icon-picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                </div>
              </template>

              <p
                v-else
                :class="[item.direction, useService.deleteMessageID.includes(item.msgid) ? 'checked' : '']"
                class="msg-con"
              >
                <span v-html="item.content"></span>
              </p>
            </span>
            <p
              :class="`txt-${item.direction}`"
              class="text-[12px] text-[#999999] flex flex-col justify-end"
              v-if="item.direction == 'send'"
            >
              {{ transferTime(item.time) }}
            </p>
          </div>
        </li>
      </ul>
    </main>
  </div>
  <!-- <div>asdf</div> -->
</template>

<script setup>
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { useServiceStore } from '/@/store'
import { onMounted, nextTick, ref, watch } from 'vue'
import { apiMsgRead, apiDelMsg } from '/@/api/modules/service/index.api'
import { ServiceChat } from './ServiceChat'
const useService = useServiceStore()
const stateObj = ref({})
const loading = ref(false)
onUpdated(() => {
  scrollToBottom()
})
// 时间转换
const transferTime = time => {
  const date = new Date(time)
  const currentDate = new Date()
  const isToday =
    date.getDate() === currentDate.getDate() &&
    date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear()
  // if (isToday) {
  //   const hours = date.getHours().toString().padStart(2, '0')
  //   const minutes = date.getMinutes().toString().padStart(2, '0')
  //   return `${hours}:${minutes}`
  // } else {
  const year = String(date.getFullYear()).slice(-4)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  // }
}
const getMessageInfor = item => {
  stateObj.value[item.msgid] = !stateObj.value[item.msgid]
  const arr = useService.deleteMessageID || []
  const idx = arr.findIndex(f => f === item.msgid)
  if (idx !== -1) {
    arr.splice(idx, 1)
  } else {
    arr.push(item.msgid)
  }
  useService.setSeleteMessageID(arr)
}
const rebackMessage = () => {
  const msgid = (useService.deleteMessageID || []).join(',')
  const chatid = useService.chatid
  console.log(msgid, chatid)
  loading.value = true
  apiDelMsg({ chatid, msgid }).then(async () => {
    await useService.getMessageList(chatid)
    cancelRebackMessage()
    useService.setSeleteMessageID([])
    loading.value = false
  })
  const message = { type: 'text', chatid: useService.chatid, content: 'msg' || inputDom.value.textContent }
  ServiceChat.sendMessage('send', message)
  // ServiceChat.sendMessage('send', { chatid, msgid })
}
const cancelRebackMessage = () => {
  useService.setSelectMessageStatus(!useService.isSelectMessage)
}
const scrollContainer = ref(null)
const scrollToBottom = () => {
  scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
}
const handleScroll = () => {
  const container = scrollContainer.value
  if (container.scrollTop + container.clientHeight === container.scrollHeight) {
    apiMsgRead({ chatid: useService.chatid }).then(() => {
      useService.getUserList()
    })
  }
}
onMounted(() => {
  nextTick(scrollToBottom)
})
watch(
  () => useService.isSelectMessage,
  val => {
    stateObj.value = {}
    useService.setSeleteMessageID([])
  }
)

</script>

<style lang="scss" scoped>
.main {
  position: relative;
  flex: 1;

  .loading {
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(255, 255, 255, 0.519);
    z-index: 10;
  }
}

.image-slot {
  cursor: pointer;
  font-size: 50px;
  color: #ccc;
}
.img-loading {
  text-align: center;
  background: #f5f5f5;
  padding: 5px 10px;
  border-radius: 10px;
  color: #bbb;
}

.scroll-box {
  height: calc(100vh - 250px);

  &.select-box {
    height: calc(100vh - 300px);
  }

  overflow-y: auto;
  padding: 10px 5px;
}

.del-tools {
  background: #f5f5f5;
}

.scroll-box::-webkit-scrollbar {
  width: 6px;
}

.scroll-box::-webkit-scrollbar-thumb {
  background-color: rgba(218, 214, 214, 0.795);
  border-radius: 3px;
}

.txt-receive {
  text-align: right;
}

.msg-con {
  position: relative;
  padding: 15px 20px;
  font-size: 16px;

  &.checked {
    background: #ff7777;
  }
}

.receive {
  background: #165dff;
  color: #fff;
  border-radius: 16px 0 16px 16px;
}

.send {
  background: #eaeaea;
  color: #333;
  border-radius: 0 16px 16px 16px;
}
</style>
<style lang="css">
.el-dialog__title {
  font-size: 20px !important;
  font-weight: 600 !important;
}
</style>
