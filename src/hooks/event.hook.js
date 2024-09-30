import { getCurrentInstance, ref } from 'vue'
import { useAppStore } from '/@/store'

// 获取表格数据
export default ( request ) => {
  const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
  const appStore = useAppStore()
  const test = ref( 1 )
  Bus.on( 'update', ( data ) => {
    appStore.refreshTab = data
    if ( typeof request === 'function' ) { // 执行刷新
      request()
    }
  } )
  return {
    test
  }
}
