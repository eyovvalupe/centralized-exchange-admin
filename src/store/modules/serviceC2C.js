import { defineStore } from 'pinia'
const useServiceStoreC2C = defineStore({
  persist: {
    paths: ['unreadMessage']
  },
  id: 'serviceC2C',
  state: () => {
    return {
      orderNo:'',
      isConnected: false,
      messageList:[],
      unreadMessage: {},
      isOpenningWindow: {}
    }
  },
  getters: {
  },
  actions: {
    setIsOpenningWindow(id) {
      this.isOpenningWindow[id] = true
    },
    setClosedWindow(id) {
      this.isOpenningWindow[id] = false
    },
    setUnreadMessage(id) {
      if (this.unreadMessage[id] == undefined) this.unreadMessage[id] = 0
      else this.unreadMessage[id] = this.unreadMessage[id] + 1
    },
    removeUnreadMessage(id) {
      this.unreadMessage[id] = this.unreadMessage[id] - 1
    },
    setClearUnreadMessage(id) {
      this.unreadMessage[id] = 0
    },
    setOrderNo(orderNo) {
      this.orderNo = orderNo;
    },
    setConnected(status) {
      this.isConnected = status;
    },
    setSelectMessageStatus(status) {
      this.isSelectMessage = status;
    },
    setMessageList(arr) {
      this.messageList = arr;
    },
    pushMessageList(obj) {
      this.messageList.push(obj);
    }
  }
})
export default useServiceStoreC2C
