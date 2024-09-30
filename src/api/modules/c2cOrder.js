import request from '/@/api/request'

export function getList(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/c2c/order/q/list',
    data
  } )
}


export function apiSetBank( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/c2c/order/m/bank',
    data
  } )
}

export function apiSetStatus( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/c2c/order/m/status',
    data
  } )
}

export function apiMsgRead( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/c2c/msg/read',
    data
  } )
}

export function apiDetial( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/c2c/order/q/get',
    data
  } )
}

