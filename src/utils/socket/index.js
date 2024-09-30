import io from 'socket.io-client'
import { useUserStore } from '/@/store' // usePermissionStore
export const wsConnect = (name, callback) => {
    const userStore = useUserStore()
    const URL = import.meta.env.VITE_PROXY_WEBSOCKET + (name || '/admin')
    const ws = io.connect(URL, {
        path: '',
        transports: ['websocket'], // 强制使用 WebSocket 连接
        upgrade: false, // 禁用 HTTP 长轮询
        reconnection: true, // 自动重连
        addTrailingSlash: false,
        query: {
            auth: userStore.token
        },
    })
    ws.on('connect', () => {
        console.log('连接成功')
        callback && callback(ws);
    })
    return ws;
}