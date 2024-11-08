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

    }
  },
  mutations:{
    setOpenReceiveMsgNotifi1(state, data) {
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

  }
})

export default useCommonStore
