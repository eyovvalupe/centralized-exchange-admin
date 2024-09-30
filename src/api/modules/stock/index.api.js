import request from '/@/api/request'

export function getList(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/stock/item/list',
    data
  } )
} 
export function apiConfig(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/stock/config/para/get',
    data
  } )
}
export function apiUpdate(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/stock/item/update',
    data
  } )
}
export function apiUpdateConfig(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/stock/config/para/update',
    data
  } )
}
export function apiTimeConfig(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/stock/config/tradingtime/get',
    data
  } )
}
export function apiUpdateTimeConfig(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/stock/config/tradingtime/update',
    data
  } )
}