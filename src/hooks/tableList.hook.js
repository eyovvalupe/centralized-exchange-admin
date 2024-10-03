import { reactive, onActivated } from 'vue'

// 获取表格数据
export const useTableList = ( request ) => {
  const state = reactive( {
    pageIndex : 1, // 当前页
    pageSize : 20, // 每页显示条数
    isLoading : true,
    total : 0,
    tableData : []
  } )

  // 获取列表
  function getList() {
    // 判断是否是函数
    if ( typeof request !== 'function' ) {
      throw new Error( 'request is not a function' )
    }
    // 获取结果
    state.isLoading = true
    request( { pageIndex : state.pageIndex, pageSize : state.pageSize } ).then( res => {
      const { total = 0, info = [] } = res
      state.total = total
      state.tableData = info || []
      state.isLoading = false
    } ).catch( err => {
      state.isLoading = false
    } )
  }
  // 路由唤醒
  onActivated( () => {
    getList()
  } )
  return {
    state,
    getList
  }
}
