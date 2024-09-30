import request from '/@/api/request'

export function getList(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/c2c/ad/list',
    data
  } )
}


export function apiAdd( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/c2c/ad/add',
    data
  } )
}

export function apiEdit( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/c2c/ad/update',
    data
  } )
} 
export function apiDel( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/c2c/ad/del',
    data
  } )
}


export function apiDetial( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/c2c/ad/get',
    data
  } )
}

