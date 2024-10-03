import { defineStore } from 'pinia'
import { apiUserList, apiHistoryMsg, apiCreateChatInfo } from '/@/api/modules/service/index.api'
const useServiceStore = defineStore({
  persist: {
    paths: ['userList', 'newMessageList', 'chatid', 'partyid', 'playVoice', 'messageNumObj']
  },
  id: 'service',
  state: () => {
    return {
      checkImgTime:0,
      userList: [],
      userList: [],
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
      apiUserList({
        parameters: parameters,
        time: Date.now()
      }).then(data => {
        this.userNameList = data
      })
    },
    setUserList(arr) {
      arr.forEach(item => {
        const { chatid } = item;
        const key_arr = Object.keys(this.userList);
        this.userList[chatid] = {}
        if (key_arr.length) {
          let lastId = this.userList[key_arr[key_arr.length - 1]].id;
          const obj = Object.assign({ id: lastId++ }, item)
          this.userList[chatid] = obj
        }
      })
    },
    pushNewMessageList(obj) {
      this.newMessageList[this.chatid].push(obj)
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
    }
  }
})
export default useServiceStore
