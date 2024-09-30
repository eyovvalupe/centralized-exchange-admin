<template>
  <footer class="send-box h-[85px] flex items-center justify-between">
    <div ref="inputDom" contenteditable="true" class="border-0 h-full w-full inputDom" placeholder="请输入消息"
        style="white-space: nowrap; overflow-x: auto" @keyup.enter="sendchat()"></div>
      <div class="send-box-icon flex items-center justify-between">
        <img :src="sendMessage" alt="" class="cursor-pointer" @click="sendchat()">
        <label>
          <img :src="sendImg" alt="" class="mx-5 cursor-pointer">
          <input type="file" style="display: none" ref="fileInput" @change="uploadImg">
        </label>
      </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import sendMessage from '/@/assets/imgs/service/send.png'
import sendImg from '/@/assets/imgs/service/sendImg.png'
import { _compressImg, randomFileName } from '/@/utils'
import { useServiceStoreC2C } from '/@/store'
import { ServiceChatC2C } from './ServiceChatC2C'
const useServiceC2C = useServiceStoreC2C()

const inputDom = ref(null)
const sendchat = (type = 'text', msg) => {
  ServiceChatC2C.sendMessage('adminsend', { type,order_no: useServiceC2C.orderNo, content: msg || inputDom.value.textContent })
  inputDom.value.textContent = ''
}

const fileInput = ref(null)

const uploadImg = (event) => {
  const file = event.target.files[0]
  const fileName = randomFileName(file.name);
  const tmp_arr = { order_no: useServiceC2C.orderNo, content: '图片加载中...', fileName, time: Date.now(), direction: 'receive',isTmp:true, type: "img" }
  useServiceC2C.pushMessageList(tmp_arr)
  const apiUrl = `${import.meta.env.VITE_UPLOAD_ADDRESS}${fileName}`
  const reader = new FileReader();
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
    _compressImg(reader.result, ratio, (base64Img) => {
      const base64result = base64Img.substr(base64Img.indexOf(',') + 1);
      fetch(`${apiUrl}`, {
        method: 'PUT',
        headers: {
          'Authorization': import.meta.env.VITE_UPLOAD_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: useServiceC2C.orderNo,
          content: base64result,
          branch: 'main'
        })
      })
        .then(response => response.json())
        .then(data => {
          if (data.content && data.content.download_url) {
            sendchat('img', data.content.download_url)
          } else {
            console.error('上传失败:', data);
          }
        })
        .catch(error => {
          console.error('上传出错:', error)
        });
    })
  }
  reader.readAsDataURL(file);
}

</script>

<style lang="scss" scoped>
[contenteditable="true"]:focus {
  outline: none;
}

.send-box {
  height: 45px;
  padding: 0 15px 0 0;
  background: #f1f1f1;
  position: relative;
  width: 100%；
}

.inputDom {
  padding: 10px;
  line-height: 25px;
}

.send-box-icon img {
  height: 28px;
}
</style>
