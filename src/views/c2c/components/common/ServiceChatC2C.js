import { useServiceStoreC2C, useUserStore } from '/@/store'
import { ElMessage } from 'element-plus'
import io from 'socket.io-client'
class ServiceC2C {
  constructor() {
    this.socket = null
    this.isConnected = false
  }
  init() {
    if (!this.socket) {
      const usec2cService = useServiceStoreC2C()
      const token = localStorage.getItem('token') || useUserStore().token
      const URL = import.meta.env.VITE_PROXY_WEBSOCKET2 + '/c2cmsg'
      this.socket = io.connect(URL, {
        transports: ['websocket'],
        reconnectionDelayMax: 10000,
        query: {
          auth: token,
        },
      })
      this.socket.on('connect', () => {
        this.isConnected = true
        usec2cService.setConnected(this.isConnected)
        console.log('c2c 连接成功')
      })

      this.socket.on('disconnect', () => {
        console.log('连接断开')
        this.isConnected = false
        usec2cService.setConnected(this.isConnected)
      })
      this.socket.on('receive', message => {
        console.log('received message list using ws ====》', message.data)
        if (!usec2cService.isOpenningWindow[message.data[0]['order_no']]) {
          console.log("close")
          usec2cService.setUnreadMessage(message.data[0]['order_no'])
        } else {
          console.log("open")
        }
        console.log(usec2cService.unreadMessage)
        const arr = message.data
        if (!usec2cService.messageList.length) {
          const index = usec2cService.messageList.findIndex(fitem => fitem.isTmp)
          if (index !== -1 && arr[0].type == 'img') {
            usec2cService.messageList.splice(index, 1)
          }
          usec2cService.setMessageList(arr)
        } else {
          const index = usec2cService.messageList.findIndex(fitem => fitem.isTmp)
          if (index !== -1 && arr[0].type == 'img') {
            usec2cService.messageList.splice(index, 1)
          }
          usec2cService.setMessageList([...usec2cService.messageList, ...arr])
        }
      })
    }
    return this.socket
  }
  // 发送消息
  sendMessage(type, message) {
    if (!this.socket) {
      ElMessage({
        type: 'tips',
        message: '重新连中...',
        offset: 200,
      })
      this.init()
      console.error('Socket is not initialized.')
      return
    }
    try {
      this.socket.emit(type, JSON.stringify(message))
    } catch (e) {
      console.error('failure to send message', e)
      throw e
    }
  }

  subscribe() {
    console.log('subscribe action')
    const usec2cService = useServiceStoreC2C()
    this.socket.emit('subscribe', usec2cService.orderNo)
  }

  // 断开
  destroy() {
    this.isConnected = false
    if (this.socket) {
      this.socket.off() // 移除所有监听器
      this.socket.disconnect()
      this.socket = null
    }
  }
}
export const ServiceChatC2C = new ServiceC2C()
