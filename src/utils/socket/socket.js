import io from 'socket.io-client'
import EventEmitter from './EventEmitter'
import useUserStore from '/@/store/modules/users'

export class SocketHelper extends EventEmitter {
  constructor(url, nameSpace) {
    super()
    this.url = url
    this.nameSpace = nameSpace
    this.module = null
    this.toast = null
    this.status = ''
    this.betId = ''
    this.isReconnected = false
  }

  connect () {
    const userStore = useUserStore()
    this.userStore = userStore
    const query = userStore.token ? { token: userStore.token } : {}
    this.socket = io(this.url + this.nameSpace, {
      reconnectionDelayMax: 10000,
      query
    })

    this.socket.on('connect', () => {
      console.log('连接成功', this.module)
      this.isConnected = true
      this.trigger('isConnected')
      this.enterRoom()
    })

    this.socket.on('disconnect', () => {
      console.log('连接断开')
      this.isConnected = false
      this.isReconnected = true
      this.trigger('disConnected')
    })

    this.socket.on('connect_error', error => {
      console.log('连接错误', error)
    })

    this.socket.on('reconnecting', () => {
      if (!this.toast) {
        console.log('正在重连')
        this.showToast()
      }
    })

    this.socket.on('reconnect', () => {
      if (this.toast) {
        console.log('重连成功')
        this.isReconnected = false
        this.closeToast()
      }
    })
  }

  disconnect () {
    this.socket.close()
    this.socket = null
  }

  showToast () {

  }

  closeToast () {
    this.toast.close()
    this.toast = null
  }

  emit (cmd, data, module = this.gameID) {
    this.socket.emit('msg', JSON.stringify({ module, cmd, data }))
  }

  async enterRoom () {
    this.emit(1, { roomName: this.roomName }, 1000)
  }

  setlistener (callback) {
    console.log('setlistener')
    this.socket.on('msg', msg => {
      const cmd = msg.cmd
      const data = msg.data
      const code = data.code === '200'
      if (code) {
        callback(cmd, data)
      } else {
        console.error('error', msg)
      }
    })
  }
}
