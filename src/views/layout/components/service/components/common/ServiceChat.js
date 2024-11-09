import { useServiceStore } from '/@/store'
import io from 'socket.io-client'
import { ElNotification } from 'element-plus'
const audio = new Audio('/tips.mp3')
class Service {
  constructor() {
    this.socket = null
    this.socketNum = null
    this.isConnected = false
  }
  init() {
    if (!this.socket) {
      const token = localStorage.getItem('token') || useUserStore().token
      const URL = import.meta.env.VITE_PROXY_WEBSOCKET2 + '/liveSupport'
      this.socket = io.connect(URL, {
        transports: ['websocket'],
        reconnectionDelayMax: 10000,
        query: {
          auth: token,
        },
      })
      this.socket.on('connect', () => {
        this.isConnected = true
        console.log('连接成功')
      })

      this.socket.on('disconnect', () => {
        console.log('连接断开')
        this.isConnected = false
      })
      this.socket.on('receive', message => {
        console.log(message)
        const useService = useServiceStore()
        message.data.forEach(dt => {
          useService.pushNewMessageList(dt)
        })
      })
    }
  }
  initNum() {
    if (!this.socketNum) {
      const useService = useServiceStore()
      const token = localStorage.getItem('token') || useUserStore().token
      const URL = import.meta.env.VITE_PROXY_WEBSOCKET2 + '/msgadmin'
      this.socketNum = io.connect(URL, {
        transports: ['websocket'],
        reconnectionDelayMax: 10000,
        query: {
          auth: token,
        },
      })
      this.socketNum.on('connect', () => {
        console.log('连接成功socketNum')
      })
      this.socketNum.on('disconnect', () => {
        console.log('连接断开')
      })
      this.socketNum.on('receive', message => {
        // console.log(message, Date.now())
        const { channel, type, num } = message.data
        let msg = ''
        if (channel === 'deposit') {
          if (type === 'new' && useService.playVoice) {
            useService.setReceivedDepositMsg()
            useService.getUserList()
            audio.play()
          }
        } else if (channel === 'support') {
          if (type === 'new' && useService.playVoice) {
            useService.setReceivedServiceMsg()
            useService.getUserList()
            audio.play()
          }
        } else if (channel === 'withdraw') {
          if (type === 'new' && useService.playVoice) {
            useService.setReceivedWithdrawMsg()
            useService.getUserList()
            audio.play()
          }
        } else if (channel === 'kyc') {
          if (type === 'new' && useService.playVoice) {
            useService.setReceivedVerifyMsg()
            useService.getUserList()
            audio.play()
          }
        }
        useService.setMessageNumObj(channel, num)
      })
    }
    // return this.socketNum
  }
  // 发送消息
  sendMessage(type, message) {
    console.log(message)
    if (!this.socket) {
      console.warn('Socket is not initialized.')
      return
    }
    try {
      this.socket.emit(type, JSON.stringify(message))
    } catch (e) {
      console.error('failure to send message', e)
      throw e
    }
  }

  // 断开
  destroy() {
    this.isConnected = false
    if (this.socket) {
      this.socket.off() // 移除所有监听器
      this.socket.disconnect()
      this.socket = null
    }
    if (this.socketNum) {
      this.socketNum.off() // 移除所有监听器
      this.socketNum.disconnect()
      this.socketNum = null
    }
  }
}
export const ServiceChat = new Service()
