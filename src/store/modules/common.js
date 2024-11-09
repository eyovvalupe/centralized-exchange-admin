import { defineStore } from 'pinia'

const useCommonStore = defineStore({
  id: 'common',
  state: () => {
    return {
      userDataDialog: false,
      selectUser: true,
      FundData: false,
      GameData: false,
      parameters: '',
      openReceiveMsgNotifi1: false,
      openReceiveMsgNotifi2: false,
      openReceiveMsgNotifi3: false,
      openReceiveMsgNotifi4: false,
      isRender1: false,
      isRender2: false,
      isRender3: false,
      isRender4: false,
      depositMsgLasttime: '',
      verifyMsgLasttime: '',
      serviceMsgLasttime: '',
      withdrawMsgLasttime: '',
      depositMsgPosition: 0,
      verifyMsgPosition: 0,
      serviceMsgPosition: 0,
      withdrawMsgPosition: 0,
      latestMsg: 0
    }
  },
  mutations:{
    
  },
  actions: {
    toggleNotification1(value) {
      this.openReceiveMsgNotifi1 = value;
    },
    toggleNotification2(value) {
      this.openReceiveMsgNotifi2 = value;
    },
    toggleNotification3(value) {
      this.openReceiveMsgNotifi3 = value;
    },
    toggleNotification4(value) {
      this.openReceiveMsgNotifi4 = value;
    },
    setAlreadyRender1() {
      this.isRender1 = true
    },
    setAlreadyRender2() {
      this.isRender2 = true
    },
    setAlreadyRender3() {
      this.isRender3 = true
    },
    setAlreadyRender4() {
      this.isRender4 = true
    },
    setDepositMsgPosition(val) {
      this.depositMsgPosition = val
    },
    setVerifyMsgPosition(val) {
      this.verifyMsgPosition = val
    },
    setServiceMsgPosition(val) {
      this.serviceMsgPosition = val
    },
    setWithdrawMsgPosition(val) {
      this.withdrawMsgPosition = val
    },
    setDepositMsgLasttime(val) {
      this.depositMsgLasttime = val
    },
    setVerifyMsgLasttime(val) {
      this.verifyMsgLasttime = val
    },
    setServiceMsgLasttime(val) {
      this.serviceMsgLasttime = val
    },
    setWithdrawMsgLasttime(val) {
      this.withdrawMsgLasttime = val
    },
    setLatestMsg(val) {
      this.latestMsg = val
    }
  }
})

export default useCommonStore
