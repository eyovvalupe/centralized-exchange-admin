<template>
  <div class="main">
    <div v-show="loading" class="loading w-full h-full flex flex-col items-center justify-center">
      <p>
        <el-icon class="is-loading" :size="30">
          <Loading />
        </el-icon>
      </p>
      <p> 请稍候...</p>
    </div>
    <main class="scroll-box" @scroll="handleScroll"
      ref="scrollChatContainer">
      <p class="w-full flex items-center justify-center"
        v-if="!useServiceC2C.messageList.length">
        <span class="text-[#bbb]">没有更多消息了...</span>
      </p>
      <ul v-else>
        <li v-for="(item,i) in useServiceC2C.messageList" :key="item.id" >

          <div class="time" v-if="!useServiceC2C.messageList[i-1] || dayjs(item.time).diff(useServiceC2C.messageList[i-1].time) > 60000">
              {{ dayjs(item.time).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
          <div class="flex mb-[15px]"
            :class="item.direction === 'send' ? '' : 'justify-end'">
            <div class="avatar-icon" v-if="item.direction == 'send'"> {{ (item.username || '匿').substring(0, 1)
              }}</div>
            
            <div>
              <span class="flex" :class="item.direction === 'send' ? '' : 'justify-end'">
                <template v-if="item.type === 'img'">
                  <div class="img-loading" v-if="item.fileName">
                    <el-icon size="24" color="#bbb"><icon-picture /></el-icon>
                    <div class="img-loading-txt">图片加载中...</div>
                  </div>
                  <el-image v-else lazy :preview-src-list="[item.content]" :src="item.content"
                    class="imgMessage">
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
                </template>
                <p v-else :class="item.direction"
                  class="msg-con">
                  <span>{{  item.content }}</span>
                </p>
              </span>
            </div>
            <div class="avatar-icon avatar-icon2" v-if="item.direction != 'send'">商</div>
          </div>
        </li>
      </ul>
    </main>
  </div>
</template>

<script setup>
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { useServiceStoreC2C } from '/@/store'
import { onMounted, nextTick, ref, watch } from 'vue'
import { apiMsgRead } from '/@/api/modules/c2cOrder'
import { dayjs } from 'element-plus'
const useServiceC2C = useServiceStoreC2C()
const loading = ref(false)
onUpdated(() => {
  scrollToBottom();
});

const scrollChatContainer = ref(null);
const scrollToBottom = () => {
  scrollChatContainer.value.scrollTop = scrollChatContainer.value.scrollHeight;
};
const handleScroll = () => {
  const container = scrollChatContainer.value;
  if (container.scrollTop + container.clientHeight === container.scrollHeight) {
    apiMsgRead({ order_no: useServiceC2C.orderNo })
  }
};
onMounted(() => {
   setTimeout(() => {
    scrollToBottom();
   }, 100);
})
</script>

<style lang="scss" scoped>
.main {
  position: relative;

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
.img-loading{
 text-align: center;
 background: #f5f5f5;
 padding: 10px;
 border-radius: 10px;
 color: #bbb;
}

.scroll-box {
  background: #fff;
  height: 450px;

  &.select-box {
    height: 420px;
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
  min-height: 25px;
  min-width: 40px;
  position: relative;
  padding: 15px 12px 15px 16px;
  background: #EFF3F8;
  line-height: 20px;
}
.avatar-icon{
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgb(200, 199, 199);
  text-align: center;
  line-height: 40px;
  color:#fff;
  font-size: 16px;
  margin-right: 10px;
}
.avatar-icon2{
  background-color: #4377FE;
  color:#fff;
  margin-left: 10px;
  margin-right: 0px;
}
.receive {
  background: #4377FE;
  color: #fff;
  border-radius: 10px 0 10px 10px;

}


.send {
  background: #EFF3F8;
  color: #061023;
  border-radius: 0 10px 10px 10px;

}
.time{
  display: flex;
  justify-content: center;
  justify-content: center;
  padding: 10px 0;
  color:#8F92A1;
  font-size: 14px;
}
.img-loading-txt{
  font-size: 12px;
}
</style>