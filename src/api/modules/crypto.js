import request from '/@/api/request'


export function getList( data ) {
  return request({
    method : 'post',
    url : '/roles/v1/crypto/list',
    data
  })
}
export function getConfigList( data ) {
  return request({
    method : 'post',
    url : '/roles/v1/crypto/config/list',
    data
  })
}
export function setEnabled( data ) {
  return request({
    method : 'post',
    url : '/roles/v1/crypto/config/enabled',
    data
  })
}
export function setConfirm( data ) {
  return request({
    method : 'post',
    url : '/roles/v1/crypto/config/confirm',
    data
  })
}
export function apiAdd( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/crypto/add',
    data
  } )
}

export function apicoinList( data ) {
  return  request( {
    method : 'post',
    url : '/authc/v1/wallet/currency',
    data : data
  })
}


export function apiDel( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/crypto/del',
    data
  } )
}

