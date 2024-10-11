
import { useServiceStore } from '/@/store'
import io from 'socket.io-client'
import { ElNotification } from 'element-plus'
const audio = new Audio('/tips.mp3');
class Service {
  constructor() {
    this.socket = null;
    this.socketNum = null;
    this.isConnected = false
  }
  init() {
    if (!this.socket) {
      const useService = useServiceStore()
      const token = localStorage.getItem('token') || useUserStore().token;
      const URL = import.meta.env.VITE_PROXY_WEBSOCKET2 + '/liveSupport'
      this.socket = io.connect(URL, {
        transports: ['websocket'],
        reconnectionDelayMax: 10000,
        query: {
          auth: token
        }
      })
      this.socket.on('connect', () => {
        this.isConnected = true;
        useService.setConnected(this.isConnected)
        console.log('连接成功')
      })

      this.socket.on('disconnect', () => {
        console.log('连接断开')
        this.isConnected = false
        useService.setConnected(this.isConnected)
      })
      this.socket.on('receive', message => {
        const arr = message.data;
        useService.setNewMessageList(arr)
      })
      this.socket.on('user', message => {
        const arr = message.data;
        useService.setUserList(arr)
      })
    }
  }
  initNum() {
    if (!this.socketNum) {
      const useService = useServiceStore()
      const token = localStorage.getItem('token') || useUserStore().token;
      const URL = import.meta.env.VITE_PROXY_WEBSOCKET2 + '/msgadmin'
      this.socketNum = io.connect(URL, {
        transports: ['websocket'],
        reconnectionDelayMax: 10000,
        query: {
          auth: token
        }
      })
      this.socketNum.on('connect', () => {
        console.log('连接成功')
      })
      this.socketNum.on('disconnect', () => {
        console.log('连接断开')
      })
      this.socketNum.on('receive', message => {
        const { channel, type, num } = message.data;
        if (type === 'new' && useService.playVoice) {
          audio.play();
          ElNotification({
            title: '新消息提醒！',
            message: "您有1条新的客服消息",
            position: 'bottom-right',
          })
        }
        useService.setMessageNumObj(channel, num)
      })
    }
  }
  // 发送消息
  sendMessage(type, message) {
    console.log(message);
    if (!this.socket) {
      console.warn('Socket is not initialized.');
      return;
    }
    try {
      this.socket.emit(type, JSON.stringify(message));
    } catch (e) {
      console.error('failure to send message', e);
      throw e;
    }
  }

  // 断开
  destroy() {
    this.isConnected = false;
    if (this.socket) {
      this.socket.off(); // 移除所有监听器
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
export const ServiceChat = new Service()
