<template>
  <div
    class="notification_container w-[300px] h-[102px] bg-[#fff]"
    :class="isOpen ? 'open_notification' : 'close_notification'"
    :style="
      type == 'deposit'
        ? 'border: 1px solid #cdf2de'
        : type == 'withdraw'
        ? 'border: 1px solid #CED9F2'
        : type == 'verify'
        ? 'border: 1px solid #ECCDF2'
        : 'border: 1px solid #F2CDCD'
    "
  >
    <div
      class="flex justify-between w-full h-[42px] px-[10px]"
      :style="
        type == 'deposit'
          ? 'background: linear-gradient(90deg, rgba(3, 188, 89, 0.2) 0%, rgba(3, 188, 89, 0) 100%);'
          : type == 'withdraw'
          ? 'background: linear-gradient(90deg, rgba(3, 62, 188, 0.2) 0%, rgba(3, 62, 188, 0) 100%);'
          : type == 'verify'
          ? 'background: linear-gradient(90deg, rgba(160, 3, 188, 0.2) 0%, rgba(160, 3, 188, 0) 100%);'
          : 'background: linear-gradient(90deg, rgba(188, 3, 3, 0.2) 0%, rgba(188, 3, 3, 0) 100%);'
      "
    >
      <div class="flex h-[42px] items-center">
        <div class="mr-[5px]"><NotifiDepositIcon /></div>
        <div class="mr-[5px]">
          <span class="text-[16px] text-[#000] font-semibold">{{
            type == 'deposit'
              ? '充值'
              : type == 'withdraw'
              ? '提现'
              : type == 'verify'
              ? '实名认证'
              : '客服'
          }}</span>
        </div>
        <div class="notification_alert mr-[5px]">
          <span class="text-[#fff] text-[12px]">{{ numobj }}</span>
        </div>
      </div>
      <div class="flex items-center cursor-pointer" @click="closeNotifi()"><NotifiCloseIcon /></div>
    </div>
    <div class="flex flex-col p-[10px] justify-between">
      <span class="text-[16px] font-semibold text-[#000]">
        有新的{{
          type == 'deposit'
            ? '充值订单'
            : type == 'withdraw'
            ? '提现订单'
            : type == 'verify'
            ? '实名认证审核'
            : '客服消息'
        }}未处理</span
      >
      <span>{{ transferTime(time) }}</span>
    </div>
  </div>
</template>
<script setup>
import NotifiDepositIcon from './icons/NotifiDepositIcon.vue'
import NotifiServiceIcon from './icons/NotifiServiceIcon.vue'
import NotifiVerifyIcon from './icons/NotifiVerifyIcon.vue'
import NotifiWithdrawIcon from './icons/NotifiWithdrawIcon.vue'
import NotifiCloseIcon from './icons/NotifiCloseIcon.vue'
import { useCommonStore } from '/@/store';

const useCommon = useCommonStore()
const openReceiveMsgNotifi1 = computed(() => useCommon.openReceiveMsgNotifi1)
const openReceiveMsgNotifi2 = computed(() => useCommon.openReceiveMsgNotifi2)
const openReceiveMsgNotifi3 = computed(() => useCommon.openReceiveMsgNotifi3)
const openReceiveMsgNotifi4 = computed(() => useCommon.openReceiveMsgNotifi4)

const props = defineProps({
  type: {
    type: String,
    default: 'service',
  },
  numobj: {
    type: Number,
    default: 1,
  },
  time: {
    type: String,
    default: Date.now(),
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const transferTime = time => {
  const date = new Date(time)
  const currentDate = new Date()
  const year = String(date.getFullYear()).slice(-4)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const closeNotifi = () => {
  console.log(props.type)
  if (props.type == 'deposit') {
    useCommon.setOpenReceiveMsgNotifi1 = false
  }
}
</script>
<style lang="css">
.notification_container {
  position: absolute;
  z-index: 9999;
  bottom: 15px;
  right: 15px;
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
  border-top-right-radius: 16px;
  margin-top: 10px;
  box-shadow: 0px 4px 4px 0px #00000026;
  overflow: hidden;
}

.notification_alert {
  width: 23px;
  height: 16px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  background-color: #ff0004;
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes open_notifi {
  0% {
    transform: translateX(500px);
    opacity: 0;
    display: none;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
    display: block !important;
  }
}

@keyframes close_notifi {
  0% {
    transform: translateX(0);
    opacity: 1;
    display: block !important;
  }
  100% {
    transform: translateX(500px);
    opacity: 0;
    display: none;
  }
}

.close_notification {
  animation-name: close_notifi;
  animation-duration: 0.5s;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;
}

.open_notification {
  animation-name: open_notifi;
  animation-duration: 0.5s;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;
}
</style>
