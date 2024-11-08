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
    }
  },
  mutations:{
    setOpenReceiveMsgNotifi1(state, data) {
      console.log(data);
      state.openReceiveMsgNotifi1 = data
    },
    setOpenReceiveMsgNotifi2(state, data) {
      state.openReceiveMsgNotifi2 = data
    },
    setOpenReceiveMsgNotifi3(state, data) {
      state.openReceiveMsgNotifi3 = data
    },
    setOpenReceiveMsgNotifi4(state, data) {
      state.openReceiveMsgNotifi4 = data
    }
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
    }
  }
})

export default useCommonStore
