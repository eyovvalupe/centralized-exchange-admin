<template>
  <footer>
    <div class="msginput">
      <Toolbar class="tools" style="border-bottom: 1px solid #f6f6f6" :editor="editorRef" :defaultConfig="toolbarConfig"
        :mode="mode" />
      <div class="flex justify-between h-full w-full">
        <div class="flex-1">
          <Editor style="height: 125px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
            :mode="mode" @onCreated="handleCreated" />
        </div>
        <div class="right-send">
          <el-button type="primary" :disabled="!useService.isConnected" style="border-radius: 0;" @click="sendchat">
            发送消息
          </el-button>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { _compressImg } from '/@/utils'
import axios from 'axios'
import { ServiceChat } from './ServiceChat'
import { useServiceStore } from '/@/store'
const mode = ref('simple')
const useService = useServiceStore()
const sendchat = () => {
  console.dir(valueHtml.value)
  ServiceChat.sendMessage('send', { type: 'html', chatid: useService.chatid, content: valueHtml.value })
  valueHtml.value = ''
}
const editorRef = shallowRef()
// 内容 HTML
const valueHtml = ref()

const toolbarConfig = {}
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {}
  }
}
editorConfig.MENU_CONF['uploadImage'] = {
  maxNumberOfFiles: 1,
  withCredentials: true,
  async customUpload(file, insertFn) {
    console.log(file)
    let fileName = file.name  // 'test.png'
    fileName = [fileName.split('.')[0] + Date.now(), fileName.split('.')[1]].join('.')
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
        axios.put(apiUrl, JSON.stringify({ content: base64result, message: `upload ${fileName}` }), {
          headers: {
            Authorization: "Token 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"
          }
        }).then(res => {
          const { content: { download_url } } = res.data
          insertFn(download_url, fileName, download_url)
        })
      })
    }
    reader.readAsDataURL(file);
  }
}
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  console.log('asdf', editor.getConfig())
  toolbarConfig.excludeKeys = [
    'header1',
    'header2',
    'header3',
    'blockquote',
    'uploadVideo',
    'insertVideo',
    'insertImage',
    'insertLink',
    'codeBlock',
    'bulletedList',
    'numberedList',
    'undo',
    'todo',
    'redo',
    'fullScreen',
    'viewLink',
    'insertTable'
  ]
}
</script>

<style lang="scss" scoped>
[contenteditable="true"]:focus {
  outline: none;
}

.right-send {
  width: 80px;
  height: 125px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #fff;

  button {
    height: 100%;
    font-size: 18px;
    line-height: 30px;
    text-wrap: wrap;
  }
}

.msginput {
  background: #f5f5f5;
  padding: 10px;
  overflow: hidden;

  .tools {
    height: 50px;
  }
}
</style>
