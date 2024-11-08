import { defineStore } from 'pinia'
import { apiUserList, apiHistoryMsg, apiCreateChatInfo,apiUserSearch } from '/@/api/modules/service/index.api'
const useServiceStore = defineStore({
  persist: {
    paths: ['userList', 'newMessageList', 'chatid', 'partyid', 'playVoice', 'messageNumObj']
  },
  id: 'service',
  state: () => {
    return {
      checkImgTime:0,
      userList: [],
      // 搜索用户
      searchUserList: [],
      // 客服左侧用户列表
      serviceList:[],
      chatid: '',
      partyid: '',
      playVoice: true,
      messageNumObj: {},
      isConnected: false,
      isSelectMessage: false,
      showMessageBox: false,
      deleteMessageID: [],
      // 所有消息存储
      newMessageList: {},
    }
  },
  getters: {
  },
  actions: {
    setMessageNumObj(key, val) {
      this.messageNumObj[key] = val;
    },
    setPlayVoice(val) {
      this.playVoice = val;
    },
    setConnected(status) {
      this.isConnected = status;
    },
    setChatid(chatid) {
      this.chatid = chatid;
    },
    setPartyid(partyid) {
      this.partyid = partyid;
    },
    setSelectMessageStatus(status) {
      this.isSelectMessage = status;
    },
    setSeleteMessageID(arr) {
      this.deleteMessageID = arr
    },
    // 获取用户列表
    getUserList() {
      return new Promise(r => {
        apiUserList({
          time: Date.now()
        }).then(data => {
          let id = 1
          this.userList = {}
          const obj = {};
          data.forEach(item => {
            const tmp_obj = Object.assign({ id: id++ }, item)
            obj[item.chatid] = tmp_obj;
          })
          this.userList = { ...obj };
          console.log(obj)
          r(obj)
        })
      })
    },
    // 创建用户会话
    createUserChat(partyId) {
      apiCreateChatInfo({
        partyId: partyId
      }).then(data => {
      })
    },
    // 消息列表
    getMessageList(chatid) {
      return new Promise(r => {
        apiHistoryMsg({
          time: Date.now(),
          chatid,
        }).then(data => {
          this.newMessageList[chatid] = data.reverse();
          r(chatid);
        })
      })
    },
    // user
    getUserNameList(parameters) {
      apiUserSearch({
        params: parameters,
      }).then(data => {
        this.userNameList = data.user
        // this.serviceList = this.searchUserList
      })
    },
    setUserList(arr) {
      arr.forEach(item => {
        console.log(item)
        const { chatid } = item;
        const key_arr = Object.keys(this.userList);
        this.userList[chatid] = {}
        if (key_arr.length) {
          let lastId = this.userList[key_arr[key_arr.length - 1]].id;
          const obj = Object.assign({ id: lastId++ }, item)
          this.userList[chatid] = obj
        }
      })
      // 时间戳排序
      let userArr = {}
      userArr = this.userList
      let entries = Object.entries(userArr);
      entries.sort(([, aValue], [, bValue]) => bValue.lasttime - aValue.lasttime)
      let sortedObj = Object.fromEntries(entries);
      this.userList = sortedObj
      this.serviceList = this.userList
    },
    pushNewMessageList(obj) {
      this.newMessageList[obj.chatid].push(obj)
    },
    timerCheckImg(arr_chatid) {
      const tmp_img_idx = [];
      arr_chatid.forEach((item, index) => {
        if (item.fileName) {
          for (let i = index + 1; i < arr_chatid.length; i++) {
            if (arr_chatid[i].content.indexOf(item.fileName) !== -1) {
              tmp_img_idx.push(index)
              break
            }
          }
        }
      });
      tmp_img_idx.forEach((idx)=>{
        arr_chatid.splice(idx,1);
      })
      return arr_chatid
    },
    setNewMessageList(arr) {
      arr.forEach(item => {
        const { chatid } = item;
        // arr_chatid 变量名冲突修改 arrChatid
        let arrChatid = this.newMessageList[chatid];
        if (arrChatid) {
          arrChatid.push(item);
        } else {
          arrChatid = [item];
        }
        const del_img_arr = this.timerCheckImg(arrChatid)
        this.newMessageList[chatid] = del_img_arr;

      })
    },
    clearMsg(){
      this.messageNumObj = {}
    }
  }
})
export default useServiceStore
