import { defineStore } from 'pinia'

const useCommonStore = defineStore({
  id: 'common',
  state: () => {
    return {
      userDataDialog: false,
      selectUser: true,
      FundData: false,
      GameData: false,
      parameters: ''
    }
  },
  mutations:{
    
  },
  actions: {

  }
})

export default useCommonStore
