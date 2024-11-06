<template>
  <footer class="send-box h-[125px] border-t-[1px] border-solid border-[#E6E6E6] flex items-center justify-between">
    <div
      ref="inputDom"
      contenteditable="true"
      class="border-0 h-full w-full inputDom"
      placeholder="请输入消息"
      style="white-space: nowrap; overflow-x: auto"
      @keyup.enter="sendchat()"
    ></div>
    <div class="send-box-icon flex items-center justify-between">
      <img :src="sendMessage" alt="" class="cursor-pointer" @click="sendchat()" />
      <label>
        <img :src="sendImg" alt="" class="mx-8 cursor-pointer" />
        <input type="file" style="display: none" ref="fileInput" @change="uploadImg" />
      </label>
      <img :src="moreImg" @click="setDelel" class="ml-4 mr-4 cursor-pointer" />
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import moreImg from '/@/assets/imgs/service/more.png'
import sendMessage from '/@/assets/imgs/service/send.png'
import sendImg from '/@/assets/imgs/service/sendImg.png'
import { _compressImg, randomFileName } from '/@/utils'
import { useServiceStore } from '/@/store'
import { ServiceChat } from './ServiceChat'
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
