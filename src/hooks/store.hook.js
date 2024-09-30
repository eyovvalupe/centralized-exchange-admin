import { useUserStore, useAppStore } from '/@/store'

// 获取表格数据
export const useTableList = async( request ) => {
  const userStore = useUserStore()
  const appStore = useAppStore()
  return {
    userName : userStore.userName,
    size : appStore.size
    // total : state.total,
    // isLoading : state.isLoading
  }
}
export const checkAuthCode = (code) => {
  const userStore = useUserStore()
  return !userStore.auth_arr.includes(Number(code))
}
