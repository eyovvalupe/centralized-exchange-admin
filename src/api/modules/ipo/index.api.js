import request from '/@/api/request'

export function getList(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/ipo/order/query/list',
    data
  } )
}
export function getDetail(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/ipo/order/query/get',
    data
  } )
}
export function getIpoWin(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/ipo/order/win',
    data
  } )
}