import { defineStore } from 'pinia'

const useSocketStore = defineStore({
  id: 'socketStore',
  state: () => {
    return {
      sokcetWS: null,
      futureList: [],
      c2cOrderList: [],
      aiOrderList: [],
      stockOrderList: [],
      futureOrderList: [],
      blocktradeOrderList: [],
      contractList: [],
      blocktradeList:[]
    }
  },
  actions: {
    setDataList(key, data) {
      this[key] = data;
    },
    setWS(ws) {
      this.sokcetWS = ws;
    },
    send(type,str) {
      this.sokcetWS.emit(type,str)
    },
    findOne(symbol){
      return this.contractList.find(f=>f.symbol==symbol) || {};
    }
  }
})

export default useSocketStore
