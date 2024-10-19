import request from '/@/api/request'

export function getList(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/ipo/order/q/list',
    data
  } )
}
export function getDetail(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/ipo/order/q/get',
    data
  } )
}
export function getIpoWin(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/ipo/order/m/win',
    data
  } )
}