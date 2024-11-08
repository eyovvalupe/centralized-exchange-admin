<template>
  <div class="w-full h-[100px] p-[20px] flex items-center">
    <label class="mr-[20px]">
      <UploadIcon />
      <input type="file" style="display: none" ref="fileInput" @change="uploadImg" />
    </label>
    <div class="flex-1 h-[60px] rounded-[16px] border-[1px] border-[#ececec] p-[15px] flex items-center">
      <div
        ref="inputDom"
        contenteditable="true"
        class="flex-1"
        placeholder="请输入消息"
        style="white-space: nowrap; overflow-x: auto"
        @keyup.enter="sendchat()"
      ></div>
      <div
        class="w-[78px] h-[30px] bg-[#4377fe] rounded-[8px] mr-[15px] px-[10px] flex items-center justify-between cursor-pointer"
        @click="sendchat()"
      >
        <SendIcon />
        <span class="text-[14px] text-[#fff]">发送</span>
      </div>
      <div
        class="w-[106px] h-[30px] bg-[#ececec] rounded-[8px] px-[10px] flex items-center justify-between cursor-pointer"
        @click="setDelel"
      >
        <DelIcon />
        <span class="text-[14px] text-[#999999]">删除信息</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import moreImg from '/@/assets/imgs/service/more.png'
import sendMessage from '/@/assets/imgs/service/send.png'
import sendImg from '/@/assets/imgs/service/sendImg.png'
import { _compressImg, randomFileName } from '/@/utils'
import { useServiceStore } from '/@/store'
import { ServiceChat } from './ServiceChat'
import UploadIcon from './icons/UploadIcon.vue'
import SendIcon from './icons/SendIcon.vue'
import DelIcon from './icons/DelIcon.vue'

ServiceChat.init()
ServiceChat.initNum()
const useService = useServiceStore()

const inputDom = ref(null)
const sendchat = (type = 'text', msg) => {
  // 发送消息前先移除之前的消息监听器
  // ServiceChat.socket.off('supportReceiveMsg')
  const message = { type, chatid: useService.chatid, content: msg || inputDom.value.textContent }
  ServiceChat.sendMessage('send', message)
  // useService.pushNewMessageList({ ...message, time: Date.now(), direction: 'receive' })
  inputDom.value.textContent = ''
}

const fileInput = ref(null)
const setDelel = () => {
  useService.setSelectMessageStatus(!useService.isSelectMessage)
}
const uploadImg = event => {
  const file = event.target.files[0]
  const fileName = randomFileName(file.name)
  const tmp_arr = {
    chatid: useService.chatid,
    content: '图片加载中...',
    fileName,
    time: Date.now(),
    direction: 'receive',
    type: 'img',
  }
  // useService.pushNewMessageList(tmp_arr)
  const apiUrl = `${import.meta.env.VITE_UPLOAD_ADDRESS2}${fileName}`
  const reader = new FileReader()
  reader.onloadend = function () {
    let ratio = 0.5
    const size = file.size / 1024
    if (size < 50) {
      ratio = 1
    } else if (size < 150) {
      ratio = 0.9
    } else {
      ratio = 0.5
    }
    _compressImg(reader.result, ratio, base64Img => {
      const base64result = base64Img.substr(base64Img.indexOf(',') + 1)
      fetch(`${apiUrl}`, {
        method: 'PUT',
        headers: {
          Authorization: import.meta.env.VITE_UPLOAD_TOKEN2,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: useService.chatid,
          content: base64result,
          branch: 'main',
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.content && data.content.download_url) {
            sendchat('img', data.content.download_url)
          } else {
            console.error('上传失败:', data)
          }
        })
        .catch(error => {
          console.error('上传出错:', error)
        })
    })
  }
  reader.readAsDataURL(file)
}
</script>

<style lang="scss" scoped>
[contenteditable='true']:focus {
  outline: none;
}

.send-box {
  height: 45px;
  background: #fff;
  position: relative;
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 11;
  width: calc(100% - 350px);
}

.inputDom {
  padding: 10px;
  line-height: 25px;
}

.send-box-icon img {
  height: 28px;
}
</style>
