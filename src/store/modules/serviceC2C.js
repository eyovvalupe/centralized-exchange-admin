import { defineStore } from 'pinia'
const useServiceStoreC2C = defineStore({
  // persist: {
  //   paths: ['messageList']
  // },
  id: 'serviceC2C',
  state: () => {
    return {
      orderNo:'',
      isConnected: false,
      messageList:[],
    }
  },
  getters: {
  },
  actions: {
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
